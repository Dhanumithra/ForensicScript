import uuid
from django.db import models

class Case(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    title = models.CharField(max_length=200)
    synopsis = models.TextField()
    location = models.CharField(max_length=200, default='Sector 7 Class-1 Cleanroom, Aether Biometrix')
    min_evidence_required = models.IntegerField(default=3)
    total_evidence = models.IntegerField(default=6)
    initial_node_id = models.CharField(max_length=100, default='scene_1_intro')

    def __str__(self):
        return f"{self.id} - {self.title}"


class Clue(models.Model):
    clue_id = models.CharField(max_length=20, primary_key=True)
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name='clues')
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    summary = models.TextField()
    inference = models.TextField()
    contradiction = models.TextField(blank=True, default='')
    icon = models.CharField(max_length=50, default='file')

    def __str__(self):
        return f"{self.clue_id}: {self.name}"


class DialogueNode(models.Model):
    node_id = models.CharField(max_length=100, primary_key=True)
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name='dialogue_nodes')
    scene_number = models.IntegerField(default=1)
    background = models.CharField(max_length=100, default='bg_cleanroom_int')
    speaker = models.CharField(max_length=100)
    sprite = models.CharField(max_length=100, blank=True, null=True)
    text = models.TextField()
    audio_cue = models.CharField(max_length=50, blank=True, null=True)
    clue_unlock = models.CharField(max_length=50, blank=True, null=True)
    energy_delta = models.IntegerField(default=0)
    choices_json = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"[{self.node_id}] {self.speaker}: {self.text[:30]}"


class GameSession(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('game_over', 'Game Over'),
        ('solved', 'Solved'),
    ]

    session_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name='sessions')
    energy = models.IntegerField(default=50)
    unlocked_clues = models.JSONField(default=list, blank=True)
    current_node_id = models.CharField(max_length=100, default='scene_1_intro')
    detective_gender = models.CharField(max_length=10, default='f')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    visited_nodes = models.JSONField(default=list, blank=True)
    is_completed = models.BooleanField(default=False)
    grade = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Session {self.session_id} - AP: {self.energy} ({self.status})"
