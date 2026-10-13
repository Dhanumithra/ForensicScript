from django.core.management.base import BaseCommand
from investigation.models import Case, Clue, DialogueNode

class Command(BaseCommand):
    help = 'Seed Case 2: The Phantom Heir murder mystery data, clues, and progressive dialogue nodes'

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
                'summary': "Syringe assay of fluid from Julian's ocular vitreous humor analyzed via ion spectrometer shows [K+] = 14.8 mmol/L.",
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
            # ===================== SCENE 1: ARRIVAL & THE OBSIDIAN STUDY =====================
            {
                'node_id': 'c2_scene_1_intro',
                'scene_number': 1,
                'background': 'bg_manor_exterior',
                'speaker': 'OFFICER MILLER',
                'sprite': 'officer_miller_serious',
                'text': "Detective! Rain and lightning have cut off the coast road. Julian Sterling, founder of Sterling Neural Dynamics, was discovered dead inside his biometric vault at 6:15 AM. The door was locked tight from the inside all night.",
                'audio_cue': None,
                'clue_unlock': None,
                'energy_delta': 0,
                'choices_json': [
                    {
                        'id': 'c2_c1_miller_brief',
                        'text': "What does security say about the study's lock status?",
                        'next_node_id': 'c2_scene_1_security_brief',
                        'energy_delta': 5,
                        'clue_unlock': None
                    },
                    {
                        'id': 'c2_c1_enter',
                        'text': "Let's enter the Obsidian Study and inspect the crime scene.",
                        'next_node_id': 'c2_scene_1_vault_entry',
                        'energy_delta': 0,
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
                'text': "Rowan Brooks, head of security, logs the vault sealing at 10:42 PM. The door never opened. At 01:30 AM, Julian allegedly called over the intercom saying: 'Do not disturb me until the board meeting.' Yet the coroner estimates death at 02:00 AM.",
                'audio_cue': None,
                'clue_unlock': None,
                'energy_delta': 0,
                'choices_json': [
                    {
                        'id': 'c2_c1_proceed_vault',
                        'text': "An impossible locked-room puzzle. Lead me into the vault.",
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
                'text': "The Obsidian Study is freezing cold. Julian Sterling sits slumped motionless over his black marble desk. The 500-lb reinforced vault door is sealed tight with a glowing biometric thumb scanner. On the wall hums an automated climate control panel.",
                'audio_cue': None,
                'clue_unlock': None,
                'energy_delta': 0,
                'choices_json': [
                    {
                        'id': 'c2_c1_body_potassium',
                        'text': "Extract ocular fluid from Julian's eye with the ion spectrometer.",
                        'next_node_id': 'c2_scene_1_vitreous',
                        'energy_delta': 10,
                        'clue_unlock': 'E1'
                    },
                    {
                        'id': 'c2_c1_hvac',
                        'text': "Inspect the automated climate control unit on the wall.",
                        'next_node_id': 'c2_scene_1_hvac',
                        'energy_delta': 10,
                        'clue_unlock': 'E2'
                    },
                    {
                        'id': 'c2_c1_scanner_swab',
                        'text': "Swab the recessed glass rim of the vault thumbprint scanner.",
                        'next_node_id': 'c2_scene_1_scanner',
                        'energy_delta': 10,
                        'clue_unlock': 'E3'
                    },
                    {
                        'id': 'c2_c1_kick_door',
                        'text': "Attempt to shoulder-charge the heavy Faraday vault door.",
                        'next_node_id': 'c2_scene_1_kick',
                        'energy_delta': -15,
                        'clue_unlock': None
                    },
                    {
                        'id': 'c2_c1_to_scene2',
                        'text': "Physical crime scene documented. Let's question Julian's eldest daughter, Vivienne Sterling.",
                        'next_node_id': 'c2_scene_2_vivienne_intro',
                        'energy_delta': 0,
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
                'text': "The ion spectrometer beeps: [K+] concentration is 14.8 mmol/L. Vitreous potassium degrades at a constant rate regardless of ambient chill. Julian died between 10:30 PM and 10:50 PM! The coroner's 02:00 AM estimate was an illusion! (Clue E1 Acquired)",
                'audio_cue': 'clue',
                'clue_unlock': 'E1',
                'energy_delta': 10,
                'choices_json': [
                    {
                        'id': 'c2_c1_v_to_hvac',
                        'text': "Inspect the automated climate control unit on the wall.",
                        'next_node_id': 'c2_scene_1_hvac',
                        'energy_delta': 10,
                        'clue_unlock': 'E2'
                    },
                    {
                        'id': 'c2_c1_v_to_scanner',
                        'text': "Swab the biometric thumbprint scanner glass rim.",
                        'next_node_id': 'c2_scene_1_scanner',
                        'energy_delta': 10,
                        'clue_unlock': 'E3'
                    },
                    {
                        'id': 'c2_c1_v_to_hub',
                        'text': "Return to the study center.",
                        'next_node_id': 'c2_scene_1_vault_entry',
                        'energy_delta': 0,
                        'clue_unlock': None
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
                        'id': 'c2_c1_h_to_vitreous',
                        'text': "Extract ocular fluid from Julian's eye with the ion spectrometer.",
                        'next_node_id': 'c2_scene_1_vitreous',
                        'energy_delta': 10,
                        'clue_unlock': 'E1'
                    },
                    {
                        'id': 'c2_c1_h_to_scanner',
                        'text': "Swab the biometric thumbprint scanner glass rim.",
                        'next_node_id': 'c2_scene_1_scanner',
                        'energy_delta': 10,
                        'clue_unlock': 'E3'
                    },
                    {
                        'id': 'c2_c1_h_to_hub',
                        'text': "Return to the study center.",
                        'next_node_id': 'c2_scene_1_vault_entry',
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
                        'id': 'c2_c1_s_to_vitreous',
                        'text': "Extract ocular fluid from Julian's eye with the ion spectrometer.",
                        'next_node_id': 'c2_scene_1_vitreous',
                        'energy_delta': 10,
                        'clue_unlock': 'E1'
                    },
                    {
                        'id': 'c2_c1_s_to_hvac',
                        'text': "Inspect the automated climate control unit on the wall.",
                        'next_node_id': 'c2_scene_1_hvac',
                        'energy_delta': 10,
                        'clue_unlock': 'E2'
                    },
                    {
                        'id': 'c2_c1_s_to_hub',
                        'text': "Return to the study center.",
                        'next_node_id': 'c2_scene_1_vault_entry',
                        'energy_delta': 0,
                        'clue_unlock': None
                    }
                ]
            },

            # ===================== SCENE 2: VIVIENNE STERLING'S SUITE =====================
            {
                'node_id': 'c2_scene_2_vivienne_intro',
                'scene_number': 2,
                'background': 'bg_obsidian_study',
                'speaker': 'VIVIENNE STERLING',
                'sprite': 'vivienne_neutral',
                'text': "Detective. My legal counsel is already en route. I spent the entire evening on camera at the Metropolitan Neuro-Gala downtown until 02:30 AM with three city councilors. You have no legal standing to harass me.",
                'audio_cue': None,
                'clue_unlock': None,
                'energy_delta': 0,
                'choices_json': [
                    {
                        'id': 'c2_c2_vivienne_safe',
                        'text': "Inspect the desktop safe and her damp gala trench coat draped over the chair.",
                        'next_node_id': 'c2_scene_2_safe',
                        'energy_delta': 10,
                        'clue_unlock': 'E5'
                    },
                    {
                        'id': 'c2_c2_vivienne_trust',
                        'text': "Inquire about her father's multi-billion-dollar estate trust.",
                        'next_node_id': 'c2_scene_2_vivienne_trust',
                        'energy_delta': 0,
                        'clue_unlock': None
                    },
                    {
                        'id': 'c2_c2_vivienne_reckless',
                        'text': "Accuse Vivienne of putting poison in Julian's evening scotch.",
                        'next_node_id': 'c2_scene_2_vivienne_reckless',
                        'energy_delta': -15,
                        'clue_unlock': None
                    }
                ]
            },
            {
                'node_id': 'c2_scene_2_vivienne_trust',
                'scene_number': 2,
                'background': 'bg_obsidian_study',
                'speaker': 'VIVIENNE STERLING',
                'sprite': 'vivienne_defensive',
                'text': "Father built Sterling Neural Dynamics through ruthless paranoia. He treated his own children like hostile corporate acquisitions. But I didn't murder him—I didn't need to.",
                'audio_cue': None,
                'clue_unlock': None,
                'energy_delta': 0,
                'choices_json': [
                    {
                        'id': 'c2_c2_trust_to_safe',
                        'text': "Inspect the desktop safe and her damp gala trench coat.",
                        'next_node_id': 'c2_scene_2_safe',
                        'energy_delta': 10,
                        'clue_unlock': 'E5'
                    },
                    {
                        'id': 'c2_c2_trust_to_intro',
                        'text': "Return to questioning Vivienne.",
                        'next_node_id': 'c2_scene_2_vivienne_intro',
                        'energy_delta': 0,
                        'clue_unlock': None
                    }
                ]
            },
            {
                'node_id': 'c2_scene_2_vivienne_reckless',
                'scene_number': 2,
                'background': 'bg_obsidian_study',
                'speaker': 'VIVIENNE STERLING',
                'sprite': 'vivienne_defensive',
                'text': "Julian's scotch was completely untouched on his desk, you incompetent amateur! The forensic team already confirmed zero oral ingestion. Slander me without proof again and I will see your badge revoked! (-15 AP)",
                'audio_cue': 'penalty',
                'clue_unlock': None,
                'energy_delta': -15,
                'choices_json': [
                    {
                        'id': 'c2_c2_reckless_to_safe',
                        'text': "Focus on hard evidence: examine the desktop safe.",
                        'next_node_id': 'c2_scene_2_safe',
                        'energy_delta': 10,
                        'clue_unlock': 'E5'
                    },
                    {
                        'id': 'c2_c2_reckless_to_intro',
                        'text': "Apologize and step back.",
                        'next_node_id': 'c2_scene_2_vivienne_intro',
                        'energy_delta': 0,
                        'clue_unlock': None
                    }
                ]
            },
            {
                'node_id': 'c2_scene_2_safe',
                'scene_number': 2,
                'background': 'bg_obsidian_study',
                'speaker': 'DETECTIVE',
                'sprite': None,
                'text': "The safe pops open! An unsent holographic codicil timestamped 09:00 PM contains DNA confirmation that Dr. Cedric Laurent is Julian's illegitimate biological son ('The Phantom Heir')! But Julian discovered Cedric was trafficking neural patents on the black market and completely disinherited him! (Clue E5 Acquired)",
                'audio_cue': 'clue',
                'clue_unlock': 'E5',
                'energy_delta': 10,
                'choices_json': [
                    {
                        'id': 'c2_c2_safe_to_security',
                        'text': "The disinheritance motive is explosive. Proceed to the Manor Security Center to question Rowan Brooks.",
                        'next_node_id': 'c2_scene_3_security',
                        'energy_delta': 0,
                        'clue_unlock': None
                    },
                    {
                        'id': 'c2_c2_confront_codicil',
                        'text': "Confront Vivienne with this secret disinheritance codicil.",
                        'next_node_id': 'c2_scene_2_vivienne_confront_codicil',
                        'energy_delta': 0,
                        'clue_unlock': None
                    }
                ]
            },
            {
                'node_id': 'c2_scene_2_vivienne_confront_codicil',
                'scene_number': 2,
                'background': 'bg_obsidian_study',
                'speaker': 'VIVIENNE STERLING',
                'sprite': 'vivienne_defensive',
                'text': "A secret brother?! Cedric... that quiet neurologist was father's blood all along?! And father cut him off completely hours before dying?! Detective... whoever controlled the manor's systems killed him, not me!",
                'audio_cue': None,
                'clue_unlock': None,
                'energy_delta': 0,
                'choices_json': [
                    {
                        'id': 'c2_c2_confront_to_security',
                        'text': "Head immediately to the Manor Security Operations Hub to question Rowan Brooks.",
                        'next_node_id': 'c2_scene_3_security',
                        'energy_delta': 0,
                        'clue_unlock': None
                    }
                ]
            },

            # ===================== SCENE 3: MANOR SECURITY OPERATIONS HUB =====================
            {
                'node_id': 'c2_scene_3_security',
                'scene_number': 3,
                'background': 'bg_manor_security',
                'speaker': 'ROWAN BROOKS',
                'sprite': 'rowan_neutral',
                'text': "Detective. I'm Rowan Brooks, head of manor security. The perimeter was sealed tight. At 10:42 PM, the master vault door locked from the inside. At 01:30 AM, Julian himself called over the security intercom telling us not to disturb him until morning. Here's the audio file.",
                'audio_cue': None,
                'clue_unlock': None,
                'energy_delta': 0,
                'choices_json': [
                    {
                        'id': 'c2_c3_analyze_audio',
                        'text': "Run spectral waveform audio analysis and digital filtering on the 01:30 AM intercom recording.",
                        'next_node_id': 'c2_scene_3_audio',
                        'energy_delta': 10,
                        'clue_unlock': 'E6'
                    },
                    {
                        'id': 'c2_c3_rowan_protocol',
                        'text': "Ask Brooks why no one visually checked on Julian after the intercom call.",
                        'next_node_id': 'c2_scene_3_rowan_protocol',
                        'energy_delta': 0,
                        'clue_unlock': None
                    },
                    {
                        'id': 'c2_c3_rowan_wild',
                        'text': "Accuse Brooks of shooting Julian through the vault door.",
                        'next_node_id': 'c2_scene_3_rowan_wild',
                        'energy_delta': -15,
                        'clue_unlock': None
                    }
                ]
            },
            {
                'node_id': 'c2_scene_3_rowan_protocol',
                'scene_number': 3,
                'background': 'bg_manor_security',
                'speaker': 'ROWAN BROOKS',
                'sprite': 'rowan_neutral',
                'text': "Julian was obsessive about his biometric privacy vault. His protocol was absolute: when that vault door locks, no guard disturbs him under penalty of immediate termination.",
                'audio_cue': None,
                'clue_unlock': None,
                'energy_delta': 0,
                'choices_json': [
                    {
                        'id': 'c2_c3_proto_to_audio',
                        'text': "Run spectral audio analysis on that 01:30 AM intercom call.",
                        'next_node_id': 'c2_scene_3_audio',
                        'energy_delta': 10,
                        'clue_unlock': 'E6'
                    }
                ]
            },
            {
                'node_id': 'c2_scene_3_rowan_wild',
                'scene_number': 3,
                'background': 'bg_manor_security',
                'speaker': 'ROWAN BROOKS',
                'sprite': 'rowan_tense',
                'text': "Shooting through an 8-inch Faraday-shielded titanium door? Are you out of your mind, Detective? That door stops anti-tank rounds. Think before you slander my men. (-15 AP)",
                'audio_cue': 'penalty',
                'clue_unlock': None,
                'energy_delta': -15,
                'choices_json': [
                    {
                        'id': 'c2_c3_wild_to_audio',
                        'text': "Calm down and analyze the 01:30 AM intercom recording.",
                        'next_node_id': 'c2_scene_3_audio',
                        'energy_delta': 10,
                        'clue_unlock': 'E6'
                    }
                ]
            },
            {
                'node_id': 'c2_scene_3_audio',
                'scene_number': 3,
                'background': 'bg_manor_security',
                'speaker': 'DETECTIVE',
                'sprite': None,
                'text': "Spectral waveform analysis flags a 19.2 kHz high-frequency digital aliasing artifact and an acoustic codec watermark matching 'VocalSynth-Pro'! The voice call was an AI deepfake calibrated on lab neural synthesis software! (Clue E6 Acquired)",
                'audio_cue': 'clue',
                'clue_unlock': 'E6',
                'energy_delta': 10,
                'choices_json': [
                    {
                        'id': 'c2_c3_to_clinic',
                        'text': "The deepfake was calibrated on clinical neural software. Proceed to Dr. Cedric Laurent's clinic annex.",
                        'next_node_id': 'c2_scene_4_clinic',
                        'energy_delta': 0,
                        'clue_unlock': None
                    },
                    {
                        'id': 'c2_c3_audio_followup',
                        'text': "Question Brooks about who had access to VocalSynth-Pro.",
                        'next_node_id': 'c2_scene_3_audio_followup',
                        'energy_delta': 0,
                        'clue_unlock': None
                    }
                ]
            },
            {
                'node_id': 'c2_scene_3_audio_followup',
                'scene_number': 3,
                'background': 'bg_manor_security',
                'speaker': 'ROWAN BROOKS',
                'sprite': 'rowan_tense',
                'text': "VocalSynth-Pro? That's proprietary neural speech synthesis firmware. Only Dr. Laurent's laboratory workstations run that suite. If that call was faked, someone in the clinic engineered it.",
                'audio_cue': None,
                'clue_unlock': None,
                'energy_delta': 0,
                'choices_json': [
                    {
                        'id': 'c2_c3_followup_to_clinic',
                        'text': "Proceed immediately to the Neural Dynamics Clinic Annex.",
                        'next_node_id': 'c2_scene_4_clinic',
                        'energy_delta': 0,
                        'clue_unlock': None
                    }
                ]
            },

            # ===================== SCENE 4: NEURAL DYNAMICS CLINIC ANNEX =====================
            {
                'node_id': 'c2_scene_4_clinic',
                'scene_number': 4,
                'background': 'bg_neural_lab',
                'speaker': 'DR. CEDRIC LAURENT',
                'sprite': 'cedric_neutral',
                'text': "Welcome, Detective. A heartbreaking tragedy. I was monitoring Julian's experimental neural telemetry right here all night. His brainwave readings were completely stable until a sudden catastrophic cardiac collapse at 02:00 AM.",
                'audio_cue': None,
                'clue_unlock': None,
                'energy_delta': 0,
                'choices_json': [
                    {
                        'id': 'c2_c4_telemetry',
                        'text': "Audit the raw mathematical Fourier transform pattern of Julian's recorded EEG feed on the medical console.",
                        'next_node_id': 'c2_scene_4_telemetry',
                        'energy_delta': 10,
                        'clue_unlock': 'E4'
                    },
                    {
                        'id': 'c2_c4_cedric_chat',
                        'text': "Ask Dr. Laurent about his medical relationship with Julian and his neural research.",
                        'next_node_id': 'c2_scene_4_cedric_chat',
                        'energy_delta': 0,
                        'clue_unlock': None
                    },
                    {
                        'id': 'c2_c4_cedric_reckless',
                        'text': "Blurt out that you know he poisoned Julian's bedtime pills.",
                        'next_node_id': 'c2_scene_4_cedric_reckless',
                        'energy_delta': -15,
                        'clue_unlock': None
                    }
                ]
            },
            {
                'node_id': 'c2_scene_4_cedric_chat',
                'scene_number': 4,
                'background': 'bg_neural_lab',
                'speaker': 'DR. CEDRIC LAURENT',
                'sprite': 'cedric_neutral',
                'text': "Julian was a pioneer, but demanding. I dedicated years of my life to perfecting his neural implant architecture. His mind was brilliant, right until his heart failed at 02:00 AM.",
                'audio_cue': None,
                'clue_unlock': None,
                'energy_delta': 0,
                'choices_json': [
                    {
                        'id': 'c2_c4_chat_to_telemetry',
                        'text': "Audit the raw mathematical EEG telemetry on his workstation.",
                        'next_node_id': 'c2_scene_4_telemetry',
                        'energy_delta': 10,
                        'clue_unlock': 'E4'
                    }
                ]
            },
            {
                'node_id': 'c2_scene_4_cedric_reckless',
                'scene_number': 4,
                'background': 'bg_neural_lab',
                'speaker': 'DR. CEDRIC LAURENT',
                'sprite': 'cedric_neutral',
                'text': "Julian took zero medication tonight, Detective. His vitals showed no metabolic breakdown from oral toxins. Wild accusations without clinical data will only embarrass you in court. (-15 AP)",
                'audio_cue': 'penalty',
                'clue_unlock': None,
                'energy_delta': -15,
                'choices_json': [
                    {
                        'id': 'c2_c4_reckless_to_telemetry',
                        'text': "Examine the raw EEG server logs on his console.",
                        'next_node_id': 'c2_scene_4_telemetry',
                        'energy_delta': 10,
                        'clue_unlock': 'E4'
                    }
                ]
            },
            {
                'node_id': 'c2_scene_4_telemetry',
                'scene_number': 4,
                'background': 'bg_neural_lab',
                'speaker': 'DETECTIVE',
                'sprite': None,
                'text': "Found the glitch! The EEG telemetry transmitted between 11:00 PM and 02:00 AM has an identical mathematical Fourier transform to an archive baseline recorded three days ago! The 'live vitals' were an automated playback loop running on a scheduled cron-job! (Clue E4 Acquired)",
                'audio_cue': 'clue',
                'clue_unlock': 'E4',
                'energy_delta': 10,
                'choices_json': [
                    {
                        'id': 'c2_c4_to_interrogate',
                        'text': "All 6 forensic clues verified. Summon all three suspects to the Interrogation Wing!",
                        'next_node_id': 'c2_scene_5_interrogation_intro',
                        'energy_delta': 0,
                        'clue_unlock': None
                    }
                ]
            },

            # ===================== SCENE 5: SUSPECT CONFRONTATION & GRAND INDICTMENT =====================
            {
                'node_id': 'c2_scene_5_interrogation_intro',
                'scene_number': 5,
                'background': 'bg_interrogation_room',
                'speaker': 'OFFICER MILLER',
                'sprite': 'officer_miller_neutral',
                'text': "All three suspects have been isolated in the interview wing: Vivienne Sterling, Rowan Brooks, and Dr. Cedric Laurent. Use your collected forensic evidence to shatter their alibis.",
                'audio_cue': None,
                'clue_unlock': None,
                'energy_delta': 0,
                'choices_json': [
                    {
                        'id': 'c2_open_interrogation',
                        'text': "Open Interrogation Chamber: Expose Suspect Contradictions [I]",
                        'next_node_id': 'c2_scene_5_interrogation_active',
                        'energy_delta': 0,
                        'clue_unlock': None
                    },
                    {
                        'id': 'c2_open_accusation_choice',
                        'text': "I have gathered all the evidence. Proceed to the Final Indictment [A]",
                        'next_node_id': 'c2_scene_5_accusation',
                        'energy_delta': 0,
                        'clue_unlock': None
                    }
                ]
            },
            {
                'node_id': 'c2_scene_5_interrogation_active',
                'scene_number': 5,
                'background': 'bg_interrogation_room',
                'speaker': 'DETECTIVE',
                'sprite': None,
                'text': "Select a suspect from the dossier to present evidence. Breaking Vivienne's gala alibi (E1) or Rowan's security log (E2) will expose their secret agendas and narrow down the killer.",
                'audio_cue': None,
                'clue_unlock': None,
                'energy_delta': 0,
                'choices_json': [
                    {
                        'id': 'c2_open_accusation_choice',
                        'text': "Proceed to Final Indictment & Warrant Execution Board [A]",
                        'next_node_id': 'c2_scene_5_accusation',
                        'energy_delta': 0,
                        'clue_unlock': None
                    },
                    {
                        'id': 'c2_back_to_room',
                        'text': "Review suspect statements with Officer Miller.",
                        'next_node_id': 'c2_scene_5_interrogation_intro',
                        'energy_delta': 0,
                        'clue_unlock': None
                    }
                ]
            },
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
                        'id': 'open_accusation_choice',
                        'text': "Deliver Grand Indictment Warrant to Prosecutor [A]",
                        'next_node_id': 'c2_scene_5_accusation',
                        'energy_delta': 0,
                        'clue_unlock': None
                    },
                    {
                        'id': 'to_interrogate',
                        'text': "Return to Interrogation Room to re-examine suspect alibis [I]",
                        'next_node_id': 'c2_scene_5_interrogation_intro',
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
