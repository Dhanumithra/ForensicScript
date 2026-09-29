from rest_framework import serializers
from .models import Case, Clue, DialogueNode, GameSession

class ClueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clue
        fields = ['clue_id', 'name', 'category', 'summary', 'inference', 'contradiction', 'icon']


class DialogueNodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DialogueNode
        fields = [
            'node_id', 'scene_number', 'background', 'speaker', 'sprite',
            'text', 'audio_cue', 'clue_unlock', 'energy_delta', 'choices_json'
        ]


class CaseDetailSerializer(serializers.ModelSerializer):
    clues = ClueSerializer(many=True, read_only=True)

    class Meta:
        model = Case
        fields = [
            'id', 'title', 'synopsis', 'location', 'min_evidence_required',
            'total_evidence', 'initial_node_id', 'clues'
        ]


class GameSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameSession
        fields = [
            'session_id', 'case', 'energy', 'unlocked_clues',
            'current_node_id', 'detective_gender', 'status', 'grade',
            'created_at', 'updated_at'
        ]


class StartSessionSerializer(serializers.Serializer):
    case_id = serializers.CharField(required=False, default='sector-7')
    detective_gender = serializers.ChoiceField(choices=['f', 'm'], default='f')
    energy = serializers.IntegerField(required=False, allow_null=True)


class ActionRequestSerializer(serializers.Serializer):
    session_id = serializers.UUIDField()
    next_node_id = serializers.CharField()
    energy_delta = serializers.IntegerField(required=False, default=0)
    clue_unlock = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    current_energy = serializers.IntegerField(required=False, allow_null=True)


class AccuseRequestSerializer(serializers.Serializer):
    session_id = serializers.UUIDField()
    culprit = serializers.CharField()
    method = serializers.CharField()


class InterrogateRequestSerializer(serializers.Serializer):
    session_id = serializers.UUIDField()
    suspect = serializers.CharField() # 'elena', 'kevin', 'vance'
    clue_id = serializers.CharField() # 'E3', 'E4', 'E5'


class ReinvestigateRequestSerializer(serializers.Serializer):
    session_id = serializers.UUIDField()
    energy = serializers.IntegerField(required=False, allow_null=True)


class SyncEnergyRequestSerializer(serializers.Serializer):
    session_id = serializers.UUIDField()
    energy = serializers.IntegerField()
