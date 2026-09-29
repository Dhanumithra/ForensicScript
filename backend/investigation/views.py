import json
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Case, Clue, DialogueNode, GameSession
from .serializers import (
    CaseDetailSerializer,
    DialogueNodeSerializer,
    GameSessionSerializer,
    StartSessionSerializer,
    ActionRequestSerializer,
    AccuseRequestSerializer,
    InterrogateRequestSerializer,
    ReinvestigateRequestSerializer,
    SyncEnergyRequestSerializer
)

class StartSessionView(APIView):
    def post(self, request):
        serializer = StartSessionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        case_id = serializer.validated_data.get('case_id', 'sector-7')
        detective_gender = serializer.validated_data.get('detective_gender', 'f')
        requested_energy = serializer.validated_data.get('energy')

        if requested_energy is not None:
            starting_energy = max(0, min(50, requested_energy))
        else:
            starting_energy = 50

        case = get_object_or_404(Case, id=case_id)
        session = GameSession.objects.create(
            case=case,
            energy=starting_energy,
            unlocked_clues=[],
            current_node_id=case.initial_node_id,
            detective_gender=detective_gender,
            status='active' if starting_energy > 0 else 'game_over'
        )

        initial_node = DialogueNode.objects.filter(node_id=case.initial_node_id).first()
        node_data = DialogueNodeSerializer(initial_node).data if initial_node else None

        return Response({
            'session': GameSessionSerializer(session).data,
            'initial_node': node_data,
            'message': f'Session started successfully. Focus set to {starting_energy}/50 AP.'
        }, status=status.HTTP_201_CREATED)


class SessionDetailView(APIView):
    def get(self, request, session_id):
        session = get_object_or_404(GameSession, session_id=session_id)

        # Passive AP recharge: 1 AP per minute elapsed (Max 50 AP)
        if session.energy < 50 and session.updated_at:
            minutes_elapsed = int((timezone.now() - session.updated_at).total_seconds() // 60)
            if minutes_elapsed > 0:
                session.energy = min(50, session.energy + minutes_elapsed)
                if session.energy >= 50 and session.status == 'game_over':
                    session.status = 'active'
                session.save()

        current_node = DialogueNode.objects.filter(node_id=session.current_node_id).first()
        node_data = DialogueNodeSerializer(current_node).data if current_node else None

        return Response({
            'session': GameSessionSerializer(session).data,
            'current_node': node_data,
            'case': CaseDetailSerializer(session.case).data
        })


class CaseDetailView(APIView):
    def get(self, request, case_id):
        case = get_object_or_404(Case, id=case_id)
        return Response(CaseDetailSerializer(case).data)


class DialogueNodeView(APIView):
    def get(self, request, node_id):
        node = get_object_or_404(DialogueNode, node_id=node_id)
        return Response(DialogueNodeSerializer(node).data)


class ActionView(APIView):
    def post(self, request):
        serializer = ActionRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        session = get_object_or_404(GameSession, session_id=data['session_id'])

        # Passive AP recharge: check elapsed time since last update (Max 50 AP)
        if session.energy < 50 and session.updated_at:
            minutes_elapsed = int((timezone.now() - session.updated_at).total_seconds() // 60)
            if minutes_elapsed > 0:
                session.energy = min(50, session.energy + minutes_elapsed)
                if session.energy >= 50 and session.status == 'game_over':
                    session.status = 'active'

        # If client explicitly reported current_energy from local recovery
        client_energy = data.get('current_energy')
        if client_energy is not None:
            session.energy = max(0, min(50, client_energy))
            if session.energy >= 50 and session.status == 'game_over':
                session.status = 'active'

        if session.status == 'game_over' or session.energy <= 0:
            return Response({
                'error': 'Game over: Detective focus depleted (0 AP). Please wait until focus recharges to 50 AP (+1 AP/min).',
                'status': 'game_over',
                'energy': session.energy
            }, status=status.HTTP_400_BAD_REQUEST)

        next_node_id = data['next_node_id']
        node = get_object_or_404(DialogueNode, node_id=next_node_id)

        visited = list(session.visited_nodes or [])
        is_already_visited = next_node_id in visited

        # Calculate energy delta (only if node hasn't been visited yet to prevent farming)
        delta = 0
        if not is_already_visited:
            delta = data.get('energy_delta', 0)
            if delta == 0 and node.energy_delta != 0:
                delta = node.energy_delta

        new_energy = session.energy + delta
        if new_energy > 50:
            new_energy = 50
        elif new_energy <= 0:
            new_energy = 0
            session.status = 'game_over'

        session.energy = new_energy

        # Handle clue unlocks
        clues_to_add = []
        is_wrong_choice = delta < 0 or data.get('energy_delta', 0) < 0 or node.energy_delta < 0

        # CRITICAL RULE: A wrong option (energy penalty) must NEVER unlock any evidence.
        # Only choices related to that specific investigation action unlock their corresponding clue.
        if not is_wrong_choice:
            requested_clue = data.get('clue_unlock')
            if requested_clue is not None:
                # Choice explicitly provided clue_unlock (can be empty string or specific clue ID)
                raw_clue = requested_clue.strip() if requested_clue else None
            else:
                raw_clue = node.clue_unlock

            if raw_clue:
                clue_tokens = [c.strip() for c in raw_clue.split(',') if c.strip()]
                current_clues = list(session.unlocked_clues)
                for c_id in clue_tokens:
                    if c_id not in current_clues:
                        current_clues.append(c_id)
                        clues_to_add.append(c_id)
                session.unlocked_clues = current_clues

        if not is_already_visited:
            visited.append(next_node_id)
            session.visited_nodes = visited

        session.current_node_id = next_node_id
        session.save()

        return Response({
            'session': GameSessionSerializer(session).data,
            'dialogue_node': DialogueNodeSerializer(node).data,
            'energy_delta': delta,
            'unlocked_new_clues': clues_to_add,
            'status': session.status
        })


class InterrogateView(APIView):
    def post(self, request):
        serializer = InterrogateRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        session = get_object_or_404(GameSession, session_id=data['session_id'])
        suspect = data['suspect'].lower().strip()
        clue_id = data['clue_id'].upper().strip()

        # Elena Cruz confrontation
        if 'elena' in suspect:
            if clue_id == 'E3':
                return Response({
                    'success': True,
                    'suspect': 'Dr. Elena Cruz',
                    'sprite': 'elena_shocked',
                    'headline': 'Alibi Crushed: Fluorinert Coolant Confirmed',
                    'dialogue': 'Where did you... how did you spot that?! Fine! I didn\'t leave! I used the basement maintenance hatch to sneak back upstairs at 2:50 AM to steal the patent drive. But he was already dead, lying flat in the corridor! I took the drive and fled!',
                    'testimony': 'Elena confirms Aris Thorne was already dead in the outer corridor before 2:50 AM.',
                    'audio_cue': 'contradiction'
                })
            else:
                return Response({
                    'success': False,
                    'suspect': 'Dr. Elena Cruz',
                    'sprite': 'elena_defensive',
                    'headline': 'Objection Rejected',
                    'dialogue': 'That proves nothing about my whereabouts, Detective. I have work to finish.',
                    'audio_cue': 'penalty'
                })

        # Kevin Lin confrontation
        elif 'kevin' in suspect:
            if clue_id == 'E4':
                return Response({
                    'success': True,
                    'suspect': 'Kevin Lin',
                    'sprite': 'kevin_panicked',
                    'headline': 'Audit Log Match: Bluetooth Handshake Exposed',
                    'dialogue': 'Oh god... the Bluetooth handshake logged?! Please, I didn\'t hurt him! An encrypted contact paid me $5,000 in crypto to execute a 90-second camera blackout test script at 03:14 AM! When the feed cut, I peeked out: I saw someone in a tailored dark gray suit dragging a body toward the materials conveyor hatch!',
                    'testimony': 'Kevin confesses to disabling cameras for a $5,000 bribe. Saw a man in a tailored gray suit push Thorne into the conveyor.',
                    'audio_cue': 'contradiction'
                })
            else:
                return Response({
                    'success': False,
                    'suspect': 'Kevin Lin',
                    'sprite': 'kevin_nervous',
                    'headline': 'Objection Rejected',
                    'dialogue': 'I... I don\'t know what that has to do with the network servers, Detective.',
                    'audio_cue': 'penalty'
                })

        # Marcus Vance confrontation
        elif 'vance' in suspect:
            if clue_id == 'E5':
                return Response({
                    'success': True,
                    'suspect': 'Marcus Vance',
                    'sprite': 'vance_angry',
                    'headline': 'Motive Unmasked: Falsified Yield Whistleblower Ultimatum',
                    'dialogue': 'You accessed my private company files. Aris was an unstable perfectionist. Disclosing minor calibration variances would have wiped out our stock price and destroyed decades of my work! But having a disagreement does not prove murder. Sector 7 was sealed from the inside. Explain how I put him in that room!',
                    'testimony': 'Vance confirms Thorne threatened to report him to regulators by 8:00 AM, establishing Vance\'s murder motive.',
                    'audio_cue': 'contradiction'
                })
            else:
                return Response({
                    'success': False,
                    'suspect': 'Marcus Vance',
                    'sprite': 'vance_neutral',
                    'headline': 'Objection Rejected',
                    'dialogue': 'Circumstantial, Detective. Come back when you have something that can stand up in a courtroom.',
                    'audio_cue': 'penalty'
                })

        return Response({
            'success': False,
            'headline': 'Unknown Suspect',
            'dialogue': 'Invalid interrogation target.'
        }, status=status.HTTP_400_BAD_REQUEST)


class AccuseView(APIView):
    def post(self, request):
        serializer = AccuseRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        session = get_object_or_404(GameSession, session_id=data['session_id'])

        # 50% Clue Rule Check (At least min_evidence_required clues required, 3/6)
        clue_count = len(session.unlocked_clues)
        if clue_count < session.case.min_evidence_required:
            return Response({
                'success': False,
                'error': 'INSUFFICIENT_EVIDENCE',
                'message': f'Insufficient Evidence! The prosecutor rejects your indictment. You hold {clue_count}/6 clues. At least {session.case.min_evidence_required} confirmed clues (50%) are required to secure an arrest warrant. Head back to the lab and check the logs.',
                'clues_held': clue_count,
                'min_required': session.case.min_evidence_required
            }, status=status.HTTP_400_BAD_REQUEST)

        culprit = data['culprit'].strip().lower()
        method = data['method'].strip().lower()

        is_culprit_correct = 'vance' in culprit
        is_method_correct = 'conveyor' in method or 'heat' in method or 'purge' in method

        if is_culprit_correct and is_method_correct:
            session.status = 'solved'
            session.is_completed = True
            grade = 'Master Forensic Detective' if session.energy >= 40 else 'Senior Homicide Inspector'
            session.grade = grade
            session.save()

            return Response({
                'success': True,
                'verdict': 'GUILTY - FIRST-DEGREE MURDER',
                'culprit': 'Marcus Vance (CEO, Aether Biometrix)',
                'grade': grade,
                'final_energy': session.energy,
                'sprite': 'vance_defeated',
                'confession': 'He was going to burn this company to the ground over a rounding error! Over numbers on a spreadsheet! I built this empire... I was not going to let an academic ruin it!',
                'case_summary': [
                    'At 02:15 AM: Vance confronted Dr. Thorne in the outer corridor. When Thorne refused the buyout, Vance asphyxiated him (E1: Flat spinal lividity).',
                    'At 02:50 AM: Dr. Elena Cruz discovered the body, panicked, and stole the encrypted USB drive, picking up fresh coolant (E3: Blue chemical residue).',
                    'At 03:14 AM: Vance exploited Kevin Lin\'s paid 90-second camera blackout (E4: Smartwatch handshake).',
                    'Vance pushed Thorne\'s body onto the motorized wafer intake conveyor (E2: Torn synthetic cloth).',
                    'He staged Thorne in the chair and activated Sector 7\'s 65°C emergency sterilizer from the hall console to vaporize all touch DNA (E6: Telemetry log).',
                    'Motive verified: Thorne\'s 01:15 AM whistleblower email threatened federal disclosure of falsified sensor yields (E5).'
                ],
                'audio_cue': 'victory'
            })
        else:
            # Penalize reckless accusation (-20 AP)
            session.energy = max(0, session.energy - 20)
            if session.energy <= 0:
                session.status = 'game_over'
            session.save()

            feedback = []
            if not is_culprit_correct:
                feedback.append('Incorrect culprit named. Review the motive and physical testimonies.')
            if not is_method_correct:
                feedback.append('Incorrect murder method. Remember the airtight magnetic door seals were never broken.')

            return Response({
                'success': False,
                'error': 'WRONG_INDICTMENT',
                'message': 'Indictment Rejected! ' + ' '.join(feedback),
                'current_energy': session.energy,
                'status': session.status,
                'audio_cue': 'penalty'
            }, status=status.HTTP_400_BAD_REQUEST)


class ReinvestigateView(APIView):
    """
    Restarts the investigation narrative and clues from Scene 1,
    while STRICTLY MAINTAINING the detective's current AP.
    If the detective's AP <= 0, status remains 'game_over' and they must wait for recharge.
    """
    def post(self, request):
        serializer = ReinvestigateRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        session_id = serializer.validated_data['session_id']
        session = get_object_or_404(GameSession, session_id=session_id)

        # Retain current energy, optionally adopting latest client-calculated energy
        client_energy = serializer.validated_data.get('energy')
        if client_energy is not None:
            session.energy = max(0, min(50, client_energy))
        else:
            session.energy = min(50, session.energy)

        initial_node_id = session.case.initial_node_id or 'scene_1_intro'
        session.current_node_id = initial_node_id
        session.unlocked_clues = []
        session.visited_nodes = [initial_node_id]
        session.is_completed = False
        session.grade = None

        if session.energy <= 0:
            session.status = 'game_over'
        else:
            session.status = 'active'

        session.save()

        initial_node = DialogueNode.objects.filter(node_id=initial_node_id).first()
        node_data = DialogueNodeSerializer(initial_node).data if initial_node else None

        return Response({
            'session': GameSessionSerializer(session).data,
            'initial_node': node_data,
            'energy': session.energy,
            'status': session.status,
            'message': f'Re-investigation initiated. Maintained current {session.energy} AP.'
        })


class SyncEnergyView(APIView):
    """
    Syncs detective energy (e.g. from passive +1 AP/min recharge or espresso recovery)
    and un-locks game_over if energy reaches at least 50 AP (max 50 AP).
    """
    def post(self, request):
        serializer = SyncEnergyRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        session_id = serializer.validated_data['session_id']
        energy = serializer.validated_data['energy']

        session = get_object_or_404(GameSession, session_id=session_id)
        session.energy = max(0, min(50, energy))

        if session.energy >= 50 and session.status == 'game_over':
            session.status = 'active'
        elif session.energy <= 0:
            session.status = 'game_over'

        session.save()

        return Response({
            'session': GameSessionSerializer(session).data,
            'energy': session.energy,
            'status': session.status
        })
