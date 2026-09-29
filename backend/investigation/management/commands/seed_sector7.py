from django.core.management.base import BaseCommand
from investigation.models import Case, Clue, DialogueNode

class Command(BaseCommand):
    help = 'Seed Sector 7 murder mystery case data, clues, and progressive dialogue nodes'

    def handle(self, *args, **options):
        self.stdout.write("Seeding Case 1: The Vanishing at Sector 7 (Progressive Narrative Flow)...")

        case, _ = Case.objects.update_or_create(
            id='sector-7',
            defaults={
                'title': 'The Vanishing at Sector 7',
                'synopsis': (
                    'Dr. Aris Thorne is found dead inside the airtight, locked cleanroom Sector 7 at Aether Biometrix. '
                    'The cleanroom doors remained locked all night, but security cameras glitched for 90 seconds at 03:14 AM. '
                    'The player must collect clues, expose false alibis, and discover how the killer moved the body inside '
                    'the locked room without opening the doors.'
                ),
                'location': 'Sector 7 Class-1 Cleanroom, Aether Biometrix',
                'min_evidence_required': 3,
                'total_evidence': 6,
                'initial_node_id': 'scene_1_intro'
            }
        )

        clues_data = [
            {
                'clue_id': 'E1',
                'name': 'Body Position Report',
                'category': 'Medical Forensics',
                'summary': "Blood pooling (lividity) settled flat across Dr. Thorne's back and spine.",
                'inference': "Proves Thorne died lying flat on the corridor floor for at least 30 minutes, not sitting upright in his lab chair.",
                'contradiction': "Demolishes the staging in the chair; proves the victim was murdered elsewhere and moved post-mortem.",
                'icon': 'heart-pulse'
            },
            {
                'clue_id': 'E2',
                'name': 'Conveyor Belt Fabric Scrap',
                'category': 'Physical Evidence',
                'summary': "White synthetic fibers and rubber scuff marks caught in the narrow materials pass-through rollers.",
                'inference': "Proves a heavy object clothed in a lab coat was forced through the wafer hatch while the main doors stayed sealed.",
                'contradiction': "Explains how the body entered an airtight room without breaching the sealed 500-lb electromagnetic airlock door.",
                'icon': 'cog'
            },
            {
                'clue_id': 'E3',
                'name': 'Blue Chemical Residue',
                'category': 'Chemical Analysis',
                'summary': "Fresh droplets of Fluorinert FC-40 coolant found on Dr. Elena Cruz's coat sleeve.",
                'inference': "This liquid evaporates in 4 hours and exists only inside Sector 7. Proves Elena returned after hours despite her turnstile alibi.",
                'contradiction': "Demolishes Elena's alibi that she left at 2:30 AM and went straight home.",
                'icon': 'flask-conical'
            },
            {
                'clue_id': 'E4',
                'name': 'Smartwatch Telemetry Log',
                'category': 'Digital Forensics',
                'summary': "Bluetooth pairing log timestamped 03:14:10 AM at the Sector 7 console.",
                'inference': "Matches Kevin Lin's wearable device, directly tying him to the console at the exact second the CCTV was disabled.",
                'contradiction': "Demolishes Kevin's claim that he was asleep in the bunk room with his phone turned off.",
                'icon': 'watch'
            },
            {
                'clue_id': 'E5',
                'name': 'The Whistleblower Email',
                'category': 'Documentary Evidence',
                'summary': "Unsent draft from Thorne to Marcus Vance timestamped 01:15 AM threatening federal regulatory disclosure.",
                'inference': "Thorne threatened to report Vance's falsified sensor yield data to regulators by 08:00 AM, establishing Vance's murder motive.",
                'contradiction': "Proves Marcus Vance had a multi-million-dollar emergency motive to silence Thorne before 8:00 AM.",
                'icon': 'mail-warning'
            },
            {
                'clue_id': 'E6',
                'name': 'Thermal Sterilization Log',
                'category': 'Telemetry',
                'summary': "Sector 7 emergency heating cycle activated at 03:16 AM, ramping room to 65°C.",
                'inference': "Explains how the killer sanitized the crime scene, baking away touch DNA, fingerprints, and fibers.",
                'contradiction': "Proves the cleanroom was thermally scrubbed right after the camera blackout to eliminate forensic traces.",
                'icon': 'flame'
            },
        ]

        for c in clues_data:
            Clue.objects.update_or_create(
                clue_id=c['clue_id'],
                defaults={
                    'case': case,
                    'name': c['name'],
                    'category': c['category'],
                    'summary': c['summary'],
                    'inference': c['inference'],
                    'contradiction': c['contradiction'],
                    'icon': c['icon']
                }
            )

        nodes_data = [
            # ===================== SCENE 1: ARRIVAL & CLEANROOM =====================
            {
                'node_id': 'scene_1_intro',
                'scene_number': 1,
                'background': 'bg_cleanroom_int',
                'speaker': 'OFFICER MILLER',
                'sprite': 'officer_miller_neutral',
                'text': 'Glad you arrived, Detective! Security called us at 6:00 AM. Dr. Aris Thorne was found dead in his chair inside Sector 7. The night guard assumed a sudden heart attack—until we checked the door logs.',
                'audio_cue': None,
                'clue_unlock': None,
                'energy_delta': 0,
                'choices_json': [
                    {'id': 'c1', 'text': 'What is suspicious about the cleanroom door logs?', 'next_node_id': 'scene_1_briefing_2'}
                ]
            },
            {
                'node_id': 'scene_1_briefing_2',
                'scene_number': 1,
                'background': 'bg_cleanroom_int',
                'speaker': 'OFFICER MILLER',
                'sprite': 'officer_miller_serious',
                'text': 'Sector 7 is an airtight cleanroom sealed behind a 500-pound magnetic door. The electronic logs prove it was locked all night. Nobody entered, and nobody left. Yet at 3:14 AM, all security cameras went black for 90 seconds. A dead man inside an unbreakable room... this is murder, Detective.',
                'audio_cue': None,
                'clue_unlock': None,
                'energy_delta': 0,
                'choices_json': [
                    {'id': 'c2', 'text': 'An impossible locked-room murder. Let us inspect the crime scene.', 'next_node_id': 'scene_1_hub'}
                ]
            },
            {
                'node_id': 'scene_1_hub',
                'scene_number': 1,
                'background': 'bg_cleanroom_int',
                'speaker': 'DETECTIVE',
                'sprite': None,
                'text': 'The cleanroom is cold and silent. Dr. Thorne sits slumped over his desk. To the left is the locked magnetic airlock door. Built into the glass wall beside him is a motorized conveyor hatch used to slide silicon wafers into the room.',
                'audio_cue': None,
                'clue_unlock': None,
                'energy_delta': 0,
                'choices_json': [
                    {
                        'id': '1A',
                        'text': 'Examine Dr. Thorne\'s body with the forensic UV light',
                        'next_node_id': 'scene_1_body',
                        'energy_delta': 10,
                        'clue_unlock': 'E1'
                    },
                    {
                        'id': '1B',
                        'text': 'Inspect the motorized conveyor hatch in the glass wall',
                        'next_node_id': 'scene_1_conveyor',
                        'energy_delta': 10,
                        'clue_unlock': 'E2'
                    },
                    {
                        'id': '1C',
                        'text': 'Attempt to kick open the heavy 500-lb magnetic airlock door',
                        'next_node_id': 'scene_1_kick_door',
                        'energy_delta': -20,
                        'clue_unlock': None
                    }
                ]
            },
            {
                'node_id': 'scene_1_body',
                'scene_number': 1,
                'background': 'bg_cleanroom_int',
                'speaker': 'DETECTIVE',
                'sprite': 'thorne_deceased',
                'text': 'Look at his back under the UV light—the blood pooling (lividity) has settled completely flat along his spine! That means he died lying flat on the floor for at least 30 minutes. He was NOT killed in this chair; someone murdered him in the hallway and staged his body here!',
                'audio_cue': 'clue',
                'clue_unlock': 'E1',
                'energy_delta': 10,
                'choices_json': [
                    {
                        'id': 'body_next',
                        'text': 'Discuss this breakthrough with Officer Miller',
                        'next_node_id': 'scene_1_conclusion',
                        'energy_delta': 0,
                        'clue_unlock': None
                    }
                ]
            },
            {
                'node_id': 'scene_1_conveyor',
                'scene_number': 1,
                'background': 'bg_cleanroom_int',
                'speaker': 'DETECTIVE',
                'sprite': 'officer_miller_neutral',
                'text': 'Look closely at this motorized conveyor hatch. It connects the outer hallway to the cleanroom. The rubber rollers have fresh friction scuffs, and caught in the teeth is a torn scrap of Dr. Thorne\'s white lab coat! The killer could not open the heavy airlock door, so they shoved Thorne\'s dead body through this conveyor opening!',
                'audio_cue': 'clue',
                'clue_unlock': 'E2',
                'energy_delta': 10,
                'choices_json': [
                    {
                        'id': 'conv_next',
                        'text': 'Discuss this breakthrough with Officer Miller',
                        'next_node_id': 'scene_1_conclusion',
                        'energy_delta': 0,
                        'clue_unlock': None
                    }
                ]
            },
            {
                'node_id': 'scene_1_kick_door',
                'scene_number': 1,
                'background': 'bg_cleanroom_int',
                'speaker': 'OFFICER MILLER',
                'sprite': 'officer_miller_serious',
                'text': 'Whoa, easy Detective! That door is held shut by high-voltage electromagnets. Kicking it only bruised your shin and drained your AP (-20 AP)! That door was definitely sealed tight. We need to investigate the room for real forensic clues.',
                'audio_cue': 'penalty',
                'clue_unlock': None,
                'energy_delta': -20,
                'choices_json': [
                    {
                        'id': 'kick_next',
                        'text': 'Acknowledge the mistake and proceed with Officer Miller',
                        'next_node_id': 'scene_1_conclusion',
                        'energy_delta': 0,
                        'clue_unlock': None
                    }
                ]
            },
            {
                'node_id': 'scene_1_conclusion',
                'scene_number': 1,
                'background': 'bg_cleanroom_int',
                'speaker': 'OFFICER MILLER',
                'sprite': 'officer_miller_neutral',
                'text': 'We are making real progress on the locked-room mystery! Thorne was murdered in the hallway and pushed through the conveyor hatch. But who shut off the cameras at 3:14 AM to pull off this stunt? Let us head down to the Sub-Level Security Hub.',
                'audio_cue': None,
                'clue_unlock': None,
                'energy_delta': 0,
                'choices_json': [
                    {'id': 'to_scene2', 'text': 'Descend to the Sub-Level Security Hub & Testing Bay', 'next_node_id': 'scene_2_intro'}
                ]
            },

            # ===================== SCENE 2: SUB-LEVEL SECURITY & LAB BAY =====================
            {
                'node_id': 'scene_2_intro',
                'scene_number': 2,
                'background': 'bg_security_hub',
                'speaker': 'KEVIN LIN',
                'sprite': 'kevin_neutral',
                'text': 'O-Officer Miller! Detective! You are here about the camera blackout? Look, I had nothing to do with it! My shift ended at 1:00 AM sharp. I turned off my phone, went straight to the staff bunk room, and slept like a log until morning. I swear!',
                'audio_cue': None,
                'clue_unlock': None,
                'energy_delta': 0,
                'choices_json': [
                    {'id': 's2_c1', 'text': 'Then how did the security cameras shut off for exactly 90 seconds at 3:14 AM?', 'next_node_id': 'scene_2_hub'}
                ]
            },
            {
                'node_id': 'scene_2_hub',
                'scene_number': 2,
                'background': 'bg_security_hub',
                'speaker': 'DETECTIVE',
                'sprite': 'kevin_neutral',
                'text': 'Kevin Lin is sweating and nervously pulling at his badge lanyard. Behind him, the security server racks blink with live event logs. Across the glass hallway, Dr. Elena Cruz is working in the Chemical Testing Bay, and the staff cafeteria is down the corridor.',
                'audio_cue': None,
                'clue_unlock': None,
                'energy_delta': 0,
                'choices_json': [
                    {
                        'id': '2A',
                        'text': 'Inspect the security server terminal audit logs directly',
                        'next_node_id': 'scene_2_server',
                        'energy_delta': 10,
                        'clue_unlock': 'E4,E6'
                    },
                    {
                        'id': '2B',
                        'text': 'Confront Dr. Elena Cruz and inspect her lab coat with UV light',
                        'next_node_id': 'scene_2_lab',
                        'energy_delta': 10,
                        'clue_unlock': 'E3'
                    },
                    {
                        'id': '2C',
                        'text': 'Search the cafeteria fridge and trash bins for clues',
                        'next_node_id': 'scene_2_cafeteria',
                        'energy_delta': -20,
                        'clue_unlock': None
                    }
                ]
            },
            {
                'node_id': 'scene_2_server',
                'scene_number': 2,
                'background': 'bg_security_hub',
                'speaker': 'DETECTIVE',
                'sprite': 'kevin_nervous',
                'text': 'Got him! At 3:14:10 AM, a blackout script called "bypass_loop.sh" killed the cameras. And right as it ran, a Bluetooth smartwatch connected to the console—matching Kevin Lin\'s watch (E4)! Even worse: at 3:16 AM, someone activated Sector 7\'s emergency heat cycle, blasting the room at 65°C to bake away all fingerprints and DNA (E6)!',
                'audio_cue': 'clue',
                'clue_unlock': 'E4,E6',
                'energy_delta': 10,
                'choices_json': [
                    {
                        'id': 'srv_next',
                        'text': 'Confer with Officer Miller on the digital server proof',
                        'next_node_id': 'scene_2_conclusion',
                        'energy_delta': 0,
                        'clue_unlock': None
                    }
                ]
            },
            {
                'node_id': 'scene_2_lab',
                'scene_number': 2,
                'background': 'bg_chem_lab',
                'speaker': 'DR. ELENA CRUZ',
                'sprite': 'elena_defensive',
                'text': 'Excuse me, Detective? I have delicate experiments running—(you shine the UV light on her cuff)—Wait! Bright neon-blue liquid glows on her sleeve! That is Sector 7 Fluorinert FC-40 coolant. It evaporates within 4 hours, which means she was in the cleanroom after hours despite her turnstile alibi (E3)!',
                'audio_cue': 'clue',
                'clue_unlock': 'E3',
                'energy_delta': 10,
                'choices_json': [
                    {
                        'id': 'lab_next',
                        'text': 'Confer with Officer Miller on the chemical proof',
                        'next_node_id': 'scene_2_conclusion',
                        'energy_delta': 0,
                        'clue_unlock': None
                    }
                ]
            },
            {
                'node_id': 'scene_2_cafeteria',
                'scene_number': 2,
                'background': 'bg_corridor_night',
                'speaker': 'OFFICER MILLER',
                'sprite': 'officer_miller_neutral',
                'text': 'Rummaging through old donut boxes and sandwich wrappers in the cafeteria, Detective? That will not solve a murder! You wasted valuable time and focus (-20 AP). The real crime scene leads are back in the security hub and chemical lab!',
                'audio_cue': 'penalty',
                'clue_unlock': None,
                'energy_delta': -20,
                'choices_json': [
                    {
                        'id': 'caf_next',
                        'text': 'Return to Officer Miller to review the gathered leads',
                        'next_node_id': 'scene_2_conclusion',
                        'energy_delta': 0,
                        'clue_unlock': None
                    }
                ]
            },
            {
                'node_id': 'scene_2_conclusion',
                'scene_number': 2,
                'background': 'bg_security_hub',
                'speaker': 'OFFICER MILLER',
                'sprite': 'officer_miller_serious',
                'text': 'Both Kevin and Elena were lying through their teeth! Kevin shut off the cameras, and Elena was at the crime scene after hours. But who ordered this operation? Who had the power and the motive? We need to question CEO Marcus Vance in the Penthouse Office.',
                'audio_cue': None,
                'clue_unlock': None,
                'energy_delta': 0,
                'choices_json': [
                    {'id': 'to_scene3', 'text': 'Take the executive elevator to the Penthouse Suite', 'next_node_id': 'scene_3_intro'}
                ]
            },

            # ===================== SCENE 3: EXECUTIVE PENTHOUSE & INTERROGATIONS =====================
            {
                'node_id': 'scene_3_intro',
                'scene_number': 3,
                'background': 'bg_executive_office',
                'speaker': 'OFFICER MILLER',
                'sprite': 'officer_miller_neutral',
                'text': 'Welcome to the CEO\'s office. Luxury leather, expensive whiskey, and a panoramic city skyline view. Marcus Vance claims he spent the whole night here working on financial projections. His personal laptop sits open on the desk.',
                'audio_cue': None,
                'clue_unlock': None,
                'energy_delta': 0,
                'choices_json': [
                    {
                        'id': '3A',
                        'text': 'Search Marcus Vance\'s laptop and inspect backup emails',
                        'next_node_id': 'scene_3_desk',
                        'energy_delta': 10,
                        'clue_unlock': 'E5'
                    },
                    {
                        'id': '3B',
                        'text': 'Head straight to the Interrogation Holding Area',
                        'next_node_id': 'scene_3_interrogation_ready',
                        'energy_delta': 0,
                        'clue_unlock': None
                    }
                ]
            },
            {
                'node_id': 'scene_3_desk',
                'scene_number': 3,
                'background': 'bg_executive_office',
                'speaker': 'DETECTIVE',
                'sprite': 'officer_miller_serious',
                'text': 'Bingo! An unsent draft email from Dr. Thorne to Marcus Vance, timestamped 1:15 AM: "Marcus, if you do not withdraw your fraudulent sensor safety reports before the 8:00 AM board meeting, I am delivering the real telemetry directly to federal regulators." Vance was facing criminal indictment and financial ruin! He had the ultimate motive to kill Thorne tonight!',
                'audio_cue': 'clue',
                'clue_unlock': 'E5',
                'energy_delta': 10,
                'choices_json': [
                    {'id': 'dsk_to_ir', 'text': 'Bring this explosive motive to the Interrogation Suite', 'next_node_id': 'scene_3_interrogation_ready'}
                ]
            },
            {
                'node_id': 'scene_3_interrogation_ready',
                'scene_number': 3,
                'background': 'bg_interrogation_room',
                'speaker': 'OFFICER MILLER',
                'sprite': 'officer_miller_neutral',
                'text': 'All three suspects are in the holding rooms: Dr. Elena Cruz, Kevin Lin, and CEO Marcus Vance. Use the Interrogation button [I] anytime to present clues, break their alibis, and get their confessions. When our evidence criteria is met, we can present the grand indictment!',
                'audio_cue': None,
                'clue_unlock': None,
                'energy_delta': 0,
                'choices_json': [
                    {'id': 'gate_check', 'text': 'Review Clues & Proceed to Final Indictment Gate', 'next_node_id': 'scene_4_gate'}
                ]
            },

            # ===================== SCENE 4: CLUE VERIFICATION GATE (50% RULE) =====================
            {
                'node_id': 'scene_4_gate',
                'scene_number': 4,
                'background': 'bg_interrogation_room',
                'speaker': 'OFFICER MILLER',
                'sprite': 'officer_miller_serious',
                'text': 'Let us review our case file, Detective. Marcus Vance has high-priced defense attorneys. The district attorney will not indict a powerful CEO without solid proof! We need at least 3 out of 6 confirmed clues (50%) or the arrest warrant will be rejected on the spot.',
                'audio_cue': None,
                'clue_unlock': None,
                'energy_delta': 0,
                'choices_json': [
                    {'id': 'to_accuse', 'text': 'Confront Marcus Vance (Proceed to Final Accusation)', 'next_node_id': 'scene_5_accusation'},
                    {'id': 'to_more_interrogate', 'text': 'Return to Holding Rooms to Interrogate Suspects Further', 'next_node_id': 'scene_3_interrogation_ready'},
                    {'id': 'restart_investigation_choice', 'text': '🔄 Not Enough Evidence: Return to Start of Investigation to Find Clues', 'next_node_id': 'scene_1_intro'}
                ]
            },

            # ===================== SCENE 5: ACCUSATION BOARD & RESOLUTION =====================
            {
                'node_id': 'scene_5_accusation',
                'scene_number': 5,
                'background': 'bg_interrogation_room',
                'speaker': 'DETECTIVE',
                'sprite': 'vance_neutral',
                'text': 'This is it. Marcus Vance sits across the metal table with a calm, arrogant smirk. He thinks his corporate wealth, his locked-room trick, and the heat-scrubbed cleanroom make him untouchable. It is time to break down his illusion step by step.',
                'audio_cue': None,
                'clue_unlock': None,
                'energy_delta': 0,
                'choices_json': [
                    {'id': 'open_accusation_choice', 'text': '⚖️ Present Grand Indictment: Accuse Killer & Break Murder Method', 'next_node_id': 'scene_5_accusation'},
                    {'id': 'back_to_interrogate_choice', 'text': '👥 Return to Question Suspects / Review Clues First', 'next_node_id': 'scene_3_interrogation_ready'},
                    {'id': 'restart_investigation_choice', 'text': '🔄 Not Enough Evidence: Return to Start of Investigation to Find Clues', 'next_node_id': 'scene_1_intro'}
                ]
            }
        ]


        for n in nodes_data:
            DialogueNode.objects.update_or_create(
                node_id=n['node_id'],
                defaults={
                    'case': case,
                    'scene_number': n['scene_number'],
                    'background': n['background'],
                    'speaker': n['speaker'],
                    'sprite': n['sprite'],
                    'text': n['text'],
                    'audio_cue': n['audio_cue'],
                    'clue_unlock': n['clue_unlock'],
                    'energy_delta': n['energy_delta'],
                    'choices_json': n['choices_json']
                }
            )

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {len(clues_data)} clues and {len(nodes_data)} dialogue nodes!"))
