from django.test import TestCase
from django.core.management import call_command
from rest_framework.test import APIClient
from rest_framework import status
from investigation.models import Case, GameSession

class ForensicEngineAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Seed database
        call_command('seed_sector7')
        self.case = Case.objects.get(id='sector-7')

    def test_start_session_defaults(self):
        """1. Initial State Integrity: Energy = 50, Clues = 0, Status = active"""
        response = self.client.post('/api/sessions/start/', {
            'case_id': 'sector-7',
            'detective_gender': 'f'
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.data
        self.assertIn('session', data)
        session_data = data['session']
        self.assertEqual(session_data['energy'], 50)
        self.assertEqual(session_data['unlocked_clues'], [])
        self.assertEqual(session_data['status'], 'active')
        self.assertEqual(session_data['detective_gender'], 'f')
        self.assertIsNotNone(data.get('initial_node'))

    def test_wrong_option_deducts_ap_and_unlocks_no_clues(self):
        """Wrong options must deduct AP and NEVER unlock any clues"""
        session = GameSession.objects.create(
            case=self.case,
            energy=50,
            unlocked_clues=[],
            status='active'
        )

        # Player chooses kicking the airlock door (-20 AP)
        response = self.client.post('/api/sessions/action/', {
            'session_id': str(session.session_id),
            'next_node_id': 'scene_1_kick_door',
            'energy_delta': -20,
            'clue_unlock': None
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        session.refresh_from_db()
        self.assertEqual(session.energy, 30)
        self.assertEqual(session.unlocked_clues, [])
        self.assertEqual(response.data.get('unlocked_new_clues'), [])

    def test_choice_unlocks_only_its_specific_related_clue(self):
        """Choices must unlock ONLY the clue related to that specific investigation action"""
        session = GameSession.objects.create(
            case=self.case,
            energy=50,
            unlocked_clues=[],
            status='active'
        )

        # Choice 1A: Examine body with UV light -> only unlocks E1
        res1 = self.client.post('/api/sessions/action/', {
            'session_id': str(session.session_id),
            'next_node_id': 'scene_1_body',
            'energy_delta': 10,
            'clue_unlock': 'E1'
        }, format='json')
        self.assertEqual(res1.status_code, status.HTTP_200_OK)
        session.refresh_from_db()
        self.assertEqual(session.unlocked_clues, ['E1'])
        self.assertEqual(res1.data.get('unlocked_new_clues'), ['E1'])

        # Choice 1B: Inspect conveyor hatch -> only unlocks E2
        res2 = self.client.post('/api/sessions/action/', {
            'session_id': str(session.session_id),
            'next_node_id': 'scene_1_conveyor',
            'energy_delta': 10,
            'clue_unlock': 'E2'
        }, format='json')
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        session.refresh_from_db()
        self.assertEqual(session.unlocked_clues, ['E1', 'E2'])
        self.assertEqual(res2.data.get('unlocked_new_clues'), ['E2'])

    def test_energy_depletion_triggers_game_over(self):
        """2. Energy Boundary & Game Over: AP <= 0 transitions status to game_over"""
        session = GameSession.objects.create(
            case=self.case,
            energy=15,
            unlocked_clues=[],
            status='active'
        )

        # Apply a penalty action (-20 AP)
        response = self.client.post('/api/sessions/action/', {
            'session_id': str(session.session_id),
            'next_node_id': 'scene_1_kick_door',
            'energy_delta': -20
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        session.refresh_from_db()
        self.assertEqual(session.energy, 0)
        self.assertEqual(session.status, 'game_over')

        # Further actions should be rejected with game over
        blocked_response = self.client.post('/api/sessions/action/', {
            'session_id': str(session.session_id),
            'next_node_id': 'scene_1_hub',
            'energy_delta': 10
        }, format='json')
        self.assertEqual(blocked_response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(blocked_response.data.get('status'), 'game_over')

    def test_accusation_rejected_below_min_evidence_gate(self):
        """3. Evidence Gate Security: < 3 clues (50% gate) returns HTTP 400 with prosecutor warning"""
        # Session with only 2 clues
        session = GameSession.objects.create(
            case=self.case,
            energy=50,
            unlocked_clues=['E1', 'E2'],
            status='active'
        )

        response = self.client.post('/api/sessions/accuse/', {
            'session_id': str(session.session_id),
            'culprit': 'Marcus Vance',
            'method': 'conveyor belt and heat purge'
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data.get('error'), 'INSUFFICIENT_EVIDENCE')
        self.assertIn('Insufficient Evidence', response.data.get('message', ''))
        self.assertEqual(response.data.get('clues_held'), 2)
        self.assertEqual(response.data.get('min_required'), 3)

    def test_valid_indictment_with_evidence(self):
        """4. Deterministic Victory: Marcus Vance + Conveyor Method with >= 3 clues succeeds"""
        # Session with 5 clues and 50 AP
        session = GameSession.objects.create(
            case=self.case,
            energy=50,
            unlocked_clues=['E1', 'E2', 'E3', 'E4', 'E5'],
            status='active'
        )

        response = self.client.post('/api/sessions/accuse/', {
            'session_id': str(session.session_id),
            'culprit': 'Marcus Vance',
            'method': 'Pushed body through materials conveyor hatch and triggered 65C heat purge'
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertTrue(data.get('success'))
        self.assertEqual(data.get('culprit'), 'Marcus Vance (CEO, Aether Biometrix)')
        self.assertEqual(data.get('sprite'), 'vance_defeated')
        self.assertIn('Master Forensic Detective', data.get('grade', ''))

        session.refresh_from_db()
        self.assertEqual(session.status, 'solved')
        self.assertTrue(session.is_completed)

    def test_start_session_maintains_passed_ap(self):
        """Starting a game when detective has reduced AP (e.g. 25 AP) preserves AP and does NOT reset to 50"""
        response = self.client.post('/api/sessions/start/', {
            'case_id': 'sector-7',
            'detective_gender': 'f',
            'energy': 25
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.data
        self.assertEqual(data['session']['energy'], 25)

    def test_ap_strictly_capped_at_max_50(self):
        """AP must never exceed maximum 50 AP even when gaining AP"""
        session = GameSession.objects.create(
            case=self.case,
            energy=45,
            unlocked_clues=[],
            status='active'
        )

        # Action gives +10 AP, should cap at 50 (not 55)
        response = self.client.post('/api/sessions/action/', {
            'session_id': str(session.session_id),
            'next_node_id': 'scene_1_body',
            'energy_delta': 10
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        session.refresh_from_db()
        self.assertEqual(session.energy, 50)

    def test_reinvestigate_preserves_current_ap(self):
        """5. Reinvestigate Integrity: Must preserve current AP (does NOT reset to 50 AP)"""
        # Session failed or restarting with 25 AP and clues
        session = GameSession.objects.create(
            case=self.case,
            energy=25,
            unlocked_clues=['E1', 'E2'],
            current_node_id='scene_5_accusation',
            status='active'
        )

        response = self.client.post('/api/sessions/reinvestigate/', {
            'session_id': str(session.session_id)
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertEqual(data['energy'], 25)
        self.assertEqual(data['session']['energy'], 25)
        self.assertEqual(data['session']['unlocked_clues'], [])
        self.assertEqual(data['session']['current_node_id'], 'scene_1_intro')
        self.assertEqual(data['status'], 'active')

        session.refresh_from_db()
        self.assertEqual(session.energy, 25)
        self.assertEqual(session.unlocked_clues, [])
        self.assertEqual(session.current_node_id, 'scene_1_intro')

    def test_reinvestigate_with_zero_ap_keeps_lockout(self):
        """Reinvestigate with 0 AP must keep 0 AP and game_over status, blocking actions until recharge"""
        session = GameSession.objects.create(
            case=self.case,
            energy=0,
            unlocked_clues=['E1'],
            current_node_id='scene_5_accusation',
            status='game_over'
        )

        response = self.client.post('/api/sessions/reinvestigate/', {
            'session_id': str(session.session_id)
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['energy'], 0)
        self.assertEqual(response.data['status'], 'game_over')

        # Action must be rejected because AP is 0
        action_res = self.client.post('/api/sessions/action/', {
            'session_id': str(session.session_id),
            'next_node_id': 'scene_1_body',
            'energy_delta': 10
        }, format='json')
        self.assertEqual(action_res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(action_res.data.get('status'), 'game_over')

    def test_sync_energy_recovers_game_over_at_50_ap(self):
        """When AP reaches 50 (via recharge or espresso), sync_energy unlocks game_over to active"""
        session = GameSession.objects.create(
            case=self.case,
            energy=0,
            status='game_over'
        )

        response = self.client.post('/api/sessions/sync-energy/', {
            'session_id': str(session.session_id),
            'energy': 50
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['energy'], 50)
        self.assertEqual(response.data['status'], 'active')

        session.refresh_from_db()
        self.assertEqual(session.energy, 50)
        self.assertEqual(session.status, 'active')
