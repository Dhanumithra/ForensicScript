from django.core.management.base import BaseCommand
from investigation.models import Case, Clue, DialogueNode

class Command(BaseCommand):
    help = 'Seed Case 2: The Phantom Heir murder mystery data, clues, and dialogue nodes'

    def handle(self, *args, **options):
        self.stdout.write("Seeding Case 2: The Phantom Heir (Progressive Narrative Flow)...")

        case, _ = Case.objects.update_or_create(
            id='phantom-heir',
            defaults={
                'title': 'Case 08-NX: The Phantom Heir',
                'synopsis': (
                    'Julian Sterling, billionaire founder of Sterling Neural Dynamics, is found dead '
                    'inside the soundproof, Faraday-shielded Obsidian Study vault at Sterling Ridge Manor. '
                    'The biometric vault sealed at 10:42 PM, but liver temperature placed death at 02:00 AM, '
                    'matching all suspects\' alibis. Piercing through manipulated room physics, neural telemetry '
                    'loops, and acoustic deepfakes, the detective must break the impossible locked room and identify '
                    'the Phantom Heir before the estate trust transfers at noon.'
                ),
                'location': 'The Obsidian Study & Biometric Sanctuary, Sterling Ridge Manor',
                'min_evidence_required': 4,
                'total_evidence': 6,
                'initial_node_id': 'c2_scene_1_intro'
            }
        )

        clues_data = [
            {
                'clue_id': 'E1',
                'name': 'Vitreous Potassium Assay',
                'category': 'Pathology & Biochemistry',
                'summary': "Syringe assay of fluid from Julian's ocular vitreous humor analyzed via ion spectrometry shows [K+] = 14.8 mmol/L.",
                'inference': "Vitreous potassium degrades at a steady rate independent of ambient room temperature, proving Julian died between 10:30 PM and 10:50 PM.",
                'contradiction': "Demolishes the coroner's 02:00 AM estimate and invalidates the suspects' midnight-to-dawn alibis.",
                'icon': 'eye'
            },
            {
                'clue_id': 'E2',
                'name': 'HVAC Thermal Inversion Log',
                'category': 'Environmental Telemetry',
                'summary': "Firmware logs from the Obsidian Study's automated climate control unit reveal an unauthorized temperature override.",
                'inference': "At 10:45 PM, the room plunged to 6°C to accelerate body heat loss (algor mortis tampering), then reheated to 24°C at 04:30 AM.",
                'contradiction': "Proves the ambient temperature was weaponized to delay the perceived time of death by over three hours.",
                'icon': 'thermometer-snowflake'
            },
            {
                'clue_id': 'E3',
                'name': 'Transdermal DMSO Gel Residue',
                'category': 'Toxicology & Trace Analysis',
                'summary': "Microscopic clear film swabbed from the outer recessed rim of the vault thumbprint scanner glass.",
                'inference': "Mass spectrometry detects Dimethyl Sulfoxide (DMSO) and synthetic Batrachotoxin, absorbed rapidly through intact skin upon touch.",
                'contradiction': "Proves Julian was fatally poisoned the exact second he pressed his thumb to the scanner to lock the vault door at 10:40 PM.",
                'icon': 'flask-conical'
            },
            {
                'clue_id': 'E4',
                'name': 'Cloned Neural Telemetry Glitch',
                'category': 'Digital Forensics',
                'summary': "Live brainwave EEG monitoring feed transmitted from Julian's neural implant to the estate medical server.",
                'inference': "Between 11:00 PM and 02:00 AM, the Fourier transform pattern matches an identical recorded loop from three days prior.",
                'contradiction': "Exposes that the 'live vitals' until 02:00 AM were a pre-recorded playback loop running on a scheduled cron-job.",
                'icon': 'activity'
            },
            {
                'clue_id': 'E5',
                'name': 'Holographic Disinheritance Codicil',
                'category': 'Documentary Evidence',
                'summary': "Digitally signed codicil inside Julian's desktop safe, timestamped 09:00 PM on the night of the murder.",
                'inference': "Confirms Dr. Cedric Laurent is Julian's secret illegitimate son ('The Phantom Heir') and was completely disinherited for black-market patent sales.",
                'contradiction': "Establishes Cedric's devastating motive for murder just hours before the trust irrevocably sealed.",
                'icon': 'file-text'
            },
            {
                'clue_id': 'E6',
                'name': 'Synthesized Intercom Acoustic Artifact',
                'category': 'Audio Engineering & Forensics',
                'summary': "Spectral waveform analysis of the 01:30 AM security intercom call ('Do not disturb me until morning...').",
                'inference': "Band-pass filtering reveals a 19.2 kHz digital aliasing artifact and VocalSynth-Pro watermark registered to Cedric's clinic laptop.",
                'contradiction': "Proves Julian's late-night voice was a deepfake synthesis designed to fabricate proof of life after midnight.",
                'icon': 'waveform'
            },
        ]

        for c_data in clues_data:
            Clue.objects.update_or_create(
                clue_id=c_data['clue_id'],
                case=case,
                defaults=c_data
            )

        nodes_data = [
            # SCENE 1: THE OBSIDIAN STUDY (ARRIVAL)
            {
                'node_id': 'c2_scene_1_intro',
                'scene_number': 1,
                'background': 'bg_manor_exterior',
                'speaker': 'OFFICER MILLER',
                'sprite': 'officer_miller_serious',
                'text': "Detective! Thank god you're here. Lightning took out the coast road an hour ago. We're inside Sterling Manor. Billionaire Julian Sterling was found dead inside his biometric panic study.",
                'audio_cue': None,
                'clue_unlock': None,
                'energy_delta': 0,
                'choices_json': [
                    {
                        'id': 'c2_c1_enter',
                        'text': "Let's enter the Obsidian Study and inspect the crime scene.",
                        'next_node_id': 'c2_scene_1_vault_entry',
                        'energy_delta': 0,
                        'clue_unlock': None
                    },
                    {
                        'id': 'c2_c1_miller_alibi',
                        'text': "What does security say about the study's lock status?",
                        'next_node_id': 'c2_scene_1_security_brief',
                        'energy_delta': 5,
                        'clue_unlock': None
                    }
                ]
            },
            {
                'node_id': 'c2_scene_1_security_brief',
                'scene_number': 1,
                'background': 'bg_manor_exterior',
                'speaker': 'OFFICER MILLER',
                'sprite': 'officer_miller_neutral',
                'text': "Rowan Brooks, head of manor security, logs the vault sealing at 10:42 PM. The door never opened. At 01:30 AM, Julian allegedly called the guard over intercom telling them not to disturb him.",
                'audio_cue': None,
                'clue_unlock': None,
                'energy_delta': 0,
                'choices_json': [
                    {
                        'id': 'c2_c1_proceed_vault',
                        'text': "Lead me into the vault immediately.",
                        'next_node_id': 'c2_scene_1_vault_entry',
                        'energy_delta': 0,
                        'clue_unlock': None
                    }
                ]
            },
            {
                'node_id': 'c2_scene_1_vault_entry',
                'scene_number': 1,
                'background': 'bg_obsidian_study',
                'speaker': 'DETECTIVE',
                'sprite': None,
                'text': "The Obsidian Study is freezing cold. Julian Sterling sits slumped motionless over his black marble desk. The 500-lb reinforced vault door is sealed tight with a glowing biometric thumb scanner.",
                'audio_cue': None,
                'clue_unlock': None,
                'energy_delta': 0,
                'choices_json': [
                    {
                        'id': 'c2_c1_body_potassium',
                        'text': "Extract vitreous fluid from Julian's eye with the portable ion spectrometer.",
                        'next_node_id': 'c2_scene_1_vitreous',
                        'energy_delta': 10,
                        'clue_unlock': 'E1'
                    },
                    {
                        'id': 'c2_c1_scanner_swab',
                        'text': "Swab the recessed glass rim of the vault's exterior thumbprint reader.",
                        'next_node_id': 'c2_scene_1_scanner',
                        'energy_delta': 10,
                        'clue_unlock': 'E3'
                    },
                    {
                        'id': 'c2_c1_kick_door',
                        'text': "Slam your shoulder against the titanium vault door to test its locking bolts.",
                        'next_node_id': 'c2_scene_1_kick',
                        'energy_delta': -15,
                        'clue_unlock': None
                    }
                ]
            },
            {
                'node_id': 'c2_scene_1_kick',
                'scene_number': 1,
                'background': 'bg_obsidian_study',
                'speaker': 'DETECTIVE',
                'sprite': None,
                'text': "You slam your shoulder against the military-grade vault door. The reinforced alloy doesn't budge an inch, sending a painful shockwave through your arm. (-15 AP)",
                'audio_cue': 'penalty',
                'clue_unlock': None,
                'energy_delta': -15,
                'choices_json': [
                    {
                        'id': 'c2_c1_recover_kick',
                        'text': "Focus on scientific deduction: examine the victim and vault controls.",
                        'next_node_id': 'c2_scene_1_vault_entry',
                        'energy_delta': 0,
                        'clue_unlock': None
                    }
                ]
            },
            {
                'node_id': 'c2_scene_1_vitreous',
                'scene_number': 1,
                'background': 'bg_obsidian_study',
                'speaker': 'DETECTIVE',
                'sprite': None,
                'text': "The ion spectrometer beeps: [K+] concentration is 14.8 mmol/L. Vitreous potassium degrades at a constant rate regardless of ambient chill. Julian died between 10:30 PM and 10:50 PM! Not 02:00 AM! (Clue E1 Acquired)",
                'audio_cue': 'clue',
                'clue_unlock': 'E1',
                'energy_delta': 10,
                'choices_json': [
                    {
                        'id': 'c2_c1_to_hvac',
                        'text': "Check the room's automated climate control panel for temperature logs.",
                        'next_node_id': 'c2_scene_1_hvac',
                        'energy_delta': 10,
                        'clue_unlock': 'E2'
                    },
                    {
                        'id': 'c2_c1_to_scanner',
                        'text': "Inspect the biometric thumbprint scanner glass rim.",
                        'next_node_id': 'c2_scene_1_scanner',
                        'energy_delta': 10,
                        'clue_unlock': 'E3'
                    }
                ]
            },
            {
                'node_id': 'c2_scene_1_hvac',
                'scene_number': 1,
                'background': 'bg_obsidian_study',
                'speaker': 'DETECTIVE',
                'sprite': None,
                'text': "Firmware crash logs retrieved! At 10:45 PM, an internal network override plunged the study to 6°C to freeze the body, then reheated it to 24°C at 04:30 AM to corrupt the coroner's algor mortis calculations! (Clue E2 Acquired)",
                'audio_cue': 'clue',
                'clue_unlock': 'E2',
                'energy_delta': 10,
                'choices_json': [
                    {
                        'id': 'c2_c1_to_safe',
                        'text': "Examine Julian's biometric desktop safe for documents.",
                        'next_node_id': 'c2_scene_1_safe',
                        'energy_delta': 10,
                        'clue_unlock': 'E5'
                    },
                    {
                        'id': 'c2_c1_to_security',
                        'text': "Move to the Security Hub to inspect intercom recordings.",
                        'next_node_id': 'c2_scene_2_security',
                        'energy_delta': 0,
                        'clue_unlock': None
                    }
                ]
            },
            {
                'node_id': 'c2_scene_1_scanner',
                'scene_number': 1,
                'background': 'bg_obsidian_study',
                'speaker': 'DETECTIVE',
                'sprite': None,
                'text': "Mass spectrometer flags a microscopic film on the scanner glass: Dimethyl Sulfoxide (DMSO) mixed with synthetic Batrachotoxin! The neurotoxin penetrated Julian's skin the second he locked the door at 10:40 PM! (Clue E3 Acquired)",
                'audio_cue': 'clue',
                'clue_unlock': 'E3',
                'energy_delta': 10,
                'choices_json': [
                    {
                        'id': 'c2_c1_scanner_to_safe',
                        'text': "Check Julian's biometric desktop safe before leaving the room.",
                        'next_node_id': 'c2_scene_1_safe',
                        'energy_delta': 10,
                        'clue_unlock': 'E5'
                    },
                    {
                        'id': 'c2_c1_scanner_to_hvac',
                        'text': "Examine the study's HVAC climate unit on the wall.",
                        'next_node_id': 'c2_scene_1_hvac',
                        'energy_delta': 10,
                        'clue_unlock': 'E2'
                    }
                ]
            },
            {
                'node_id': 'c2_scene_1_safe',
                'scene_number': 1,
                'background': 'bg_obsidian_study',
                'speaker': 'DETECTIVE',
                'sprite': None,
                'text': "The safe pops open! An unsent codicil timestamped 09:00 PM confirms Dr. Cedric Laurent is Julian's secret biological son ('The Phantom Heir') — but disinherits him completely for selling proprietary patents on the black market! (Clue E5 Acquired)",
                'audio_cue': 'clue',
                'clue_unlock': 'E5',
                'energy_delta': 10,
                'choices_json': [
                    {
                        'id': 'c2_c1_safe_to_security',
                        'text': "Head to the Security Operations Center to question Rowan Brooks.",
                        'next_node_id': 'c2_scene_2_security',
                        'energy_delta': 0,
                        'clue_unlock': None
                    },
                    {
                        'id': 'c2_c1_safe_to_lab',
                        'text': "Visit the Neural Dynamics clinic annex to check Cedric's monitoring console.",
                        'next_node_id': 'c2_scene_3_clinic',
                        'energy_delta': 0,
                        'clue_unlock': None
                    }
                ]
            },

            # SCENE 2: THE MANOR SECURITY OPERATIONS HUB
            {
                'node_id': 'c2_scene_2_security',
                'scene_number': 2,
                'background': 'bg_manor_security',
                'speaker': 'ROWAN BROOKS',
                'sprite': 'rowan_neutral',
                'text': "Detective. I run security here. The exterior perimeter was locked all night. At 01:30 AM, Julian's intercom was patched directly to this console. I have the recording on file.",
                'audio_cue': None,
                'clue_unlock': None,
                'energy_delta': 0,
                'choices_json': [
                    {
                        'id': 'c2_c2_analyze_audio',
                        'text': "Run audio waveform spectral analysis on the 01:30 AM intercom call.",
                        'next_node_id': 'c2_scene_2_audio',
                        'energy_delta': 10,
                        'clue_unlock': 'E6'
                    },
                    {
                        'id': 'c2_c2_accuse_rowan_wildly',
                        'text': "You're lying, Brooks! You murdered him and turned off the cameras!",
                        'next_node_id': 'c2_scene_2_rowan_wild',
                        'energy_delta': -15,
                        'clue_unlock': None
                    }
                ]
            },
            {
                'node_id': 'c2_scene_2_rowan_wild',
                'scene_number': 2,
                'background': 'bg_manor_security',
                'speaker': 'ROWAN BROOKS',
                'sprite': 'rowan_tense',
                'text': "Watch your mouth, Detective. I was in this chair during the 01:30 AM broadcast with three junior officers. Produce proof or get off my deck. (-15 AP)",
                'audio_cue': 'penalty',
                'clue_unlock': None,
                'energy_delta': -15,
                'choices_json': [
                    {
                        'id': 'c2_c2_rowan_recheck_audio',
                        'text': "Calm down and run spectral filtering on the intercom recording.",
                        'next_node_id': 'c2_scene_2_audio',
                        'energy_delta': 10,
                        'clue_unlock': 'E6'
                    }
                ]
            },
            {
                'node_id': 'c2_scene_2_audio',
                'scene_number': 2,
                'background': 'bg_manor_security',
                'speaker': 'DETECTIVE',
                'sprite': None,
                'text': "Spectral waveform analysis flags a 19.2 kHz high-frequency compression artifact and an acoustic neural watermark matching 'VocalSynth-Pro'! The voice call was an AI deepfake! (Clue E6 Acquired)",
                'audio_cue': 'clue',
                'clue_unlock': 'E6',
                'energy_delta': 10,
                'choices_json': [
                    {
                        'id': 'c2_c2_to_clinic',
                        'text': "Proceed to the clinic annex to inspect the neural telemetry feed.",
                        'next_node_id': 'c2_scene_3_clinic',
                        'energy_delta': 0,
                        'clue_unlock': None
                    }
                ]
            },

            # SCENE 3: THE NEURAL DYNAMICS CLINIC ANNEX
            {
                'node_id': 'c2_scene_3_clinic',
                'scene_number': 3,
                'background': 'bg_neural_lab',
                'speaker': 'DR. CEDRIC LAURENT',
                'sprite': 'cedric_neutral',
                'text': "Ah, Detective. A heartbreaking tragedy. I was monitoring Julian's experimental neural telemetry right here all night. His brainwaves were normal until a sudden catastrophic cardiac collapse at 02:00 AM.",
                'audio_cue': None,
                'clue_unlock': None,
                'energy_delta': 0,
                'choices_json': [
                    {
                        'id': 'c2_c3_telemetry_audit',
                        'text': "Audit the Fourier transform pattern of Julian's recorded EEG feed.",
                        'next_node_id': 'c2_scene_3_telemetry',
                        'energy_delta': 10,
                        'clue_unlock': 'E4'
                    },
                    {
                        'id': 'c2_c3_accuse_cedric_early',
                        'text': "You're his personal doctor, Cedric. You poisoned his bedtime pills!",
                        'next_node_id': 'c2_scene_3_cedric_early',
                        'energy_delta': -15,
                        'clue_unlock': None
                    }
                ]
            },
            {
                'node_id': 'c2_scene_3_cedric_early',
                'scene_number': 3,
                'background': 'bg_neural_lab',
                'speaker': 'DR. CEDRIC LAURENT',
                'sprite': 'cedric_neutral',
                'text': "Julian took zero pills tonight, Detective. His evening scotch was completely untouched on his desk. Wild guesses won't impress the district attorney. (-15 AP)",
                'audio_cue': 'penalty',
                'clue_unlock': None,
                'energy_delta': -15,
                'choices_json': [
                    {
                        'id': 'c2_c3_recheck_eeg',
                        'text': "Examine the raw mathematical telemetry feed on his server.",
                        'next_node_id': 'c2_scene_3_telemetry',
                        'energy_delta': 10,
                        'clue_unlock': 'E4'
                    }
                ]
            },
            {
                'node_id': 'c2_scene_3_telemetry',
                'scene_number': 3,
                'background': 'bg_neural_lab',
                'speaker': 'DETECTIVE',
                'sprite': None,
                'text': "Found it! The EEG data from 11:00 PM to 02:00 AM has the exact same mathematical Fourier transform as an archive baseline recorded three days ago! The 'live' vitals were an automated playback loop! (Clue E4 Acquired)",
                'audio_cue': 'clue',
                'clue_unlock': 'E4',
                'energy_delta': 10,
                'choices_json': [
                    {
                        'id': 'c2_c3_to_interrogate',
                        'text': "Summon the suspects to the manor interrogation wing for formal confrontation.",
                        'next_node_id': 'c2_scene_4_interrogation_intro',
                        'energy_delta': 0,
                        'clue_unlock': None
                    }
                ]
            },

            # SCENE 4: SUSPECT CONFRONTATION WING
            {
                'node_id': 'c2_scene_4_interrogation_intro',
                'scene_number': 4,
                'background': 'bg_interrogation_room',
                'speaker': 'OFFICER MILLER',
                'sprite': 'officer_miller_neutral',
                'text': "All three suspects have been isolated in the interview wing: Vivienne Sterling, Rowan Brooks, and Dr. Cedric Laurent. Use your collected forensic evidence to shatter their alibis.",
                'audio_cue': None,
                'clue_unlock': None,
                'energy_delta': 0,
                'choices_json': [
                    {
                        'id': 'c2_c4_open_interrogation',
                        'text': "Open Interrogation Chamber: Expose Suspect Contradictions [I]",
                        'next_node_id': 'c2_scene_4_interrogation_active',
                        'energy_delta': 0,
                        'clue_unlock': None
                    },
                    {
                        'id': 'c2_c4_ready_to_accuse',
                        'text': "I have sufficient evidence. Proceed directly to the Final Indictment [A]",
                        'next_node_id': 'c2_scene_5_accusation',
                        'energy_delta': 0,
                        'clue_unlock': None
                    }
                ]
            },
            {
                'node_id': 'c2_scene_4_interrogation_active',
                'scene_number': 4,
                'background': 'bg_interrogation_room',
                'speaker': 'DETECTIVE',
                'sprite': None,
                'text': "Select a suspect from the dossier to present evidence. Breaking Vivienne's gala alibi (E1) or Rowan's security log (E2) will expose their secret agendas and narrow down the killer.",
                'audio_cue': None,
                'clue_unlock': None,
                'energy_delta': 0,
                'choices_json': [
                    {
                        'id': 'c2_c4_to_accusation_board',
                        'text': "Proceed to Final Indictment & Warrant Execution Board [A]",
                        'next_node_id': 'c2_scene_5_accusation',
                        'energy_delta': 0,
                        'clue_unlock': None
                    }
                ]
            },

            # SCENE 5: FINAL ACCUSATION
            {
                'node_id': 'c2_scene_5_accusation',
                'scene_number': 5,
                'background': 'bg_obsidian_study',
                'speaker': 'DETECTIVE',
                'sprite': None,
                'text': "The forensic timeline is complete. At least 4 confirmed clues (60% gate) are required to secure an airtight murder indictment from the prosecutor. Name the culprit and the exact murder method.",
                'audio_cue': None,
                'clue_unlock': None,
                'energy_delta': 0,
                'choices_json': [
                    {
                        'id': 'c2_open_accusation_choice',
                        'text': "Present Formal Indictment Warrant to Prosecutor [A]",
                        'next_node_id': 'c2_scene_5_accusation',
                        'energy_delta': 0,
                        'clue_unlock': None
                    },
                    {
                        'id': 'c2_back_to_interrogate_choice',
                        'text': "Return to Interrogation Room to re-examine suspect alibis [I]",
                        'next_node_id': 'c2_scene_4_interrogation_intro',
                        'energy_delta': 0,
                        'clue_unlock': None
                    }
                ]
            }
        ]

        for n_data in nodes_data:
            DialogueNode.objects.update_or_create(
                node_id=n_data['node_id'],
                case=case,
                defaults=n_data
            )

        self.stdout.write(self.style.SUCCESS(
            f"Successfully seeded Case 2: {len(clues_data)} clues and {len(nodes_data)} dialogue nodes!"
        ))
