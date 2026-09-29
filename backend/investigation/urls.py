from django.urls import path
from .views import (
    StartSessionView,
    SessionDetailView,
    CaseDetailView,
    DialogueNodeView,
    ActionView,
    InterrogateView,
    AccuseView,
    ReinvestigateView,
    SyncEnergyView
)

urlpatterns = [
    path('sessions/start/', StartSessionView.as_view(), name='session_start'),
    path('sessions/reinvestigate/', ReinvestigateView.as_view(), name='session_reinvestigate'),
    path('sessions/sync-energy/', SyncEnergyView.as_view(), name='session_sync_energy'),
    path('sessions/<uuid:session_id>/', SessionDetailView.as_view(), name='session_detail'),
    path('sessions/action/', ActionView.as_view(), name='session_action'),
    path('sessions/interrogate/', InterrogateView.as_view(), name='session_interrogate'),
    path('sessions/accuse/', AccuseView.as_view(), name='session_accuse'),
    path('cases/<str:case_id>/', CaseDetailView.as_view(), name='case_detail'),
    path('dialogue/<str:node_id>/', DialogueNodeView.as_view(), name='dialogue_node'),
]
