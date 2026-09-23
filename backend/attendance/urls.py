from django.urls import path
from .views import AttendanceSessionView

urlpatterns = [
    path('sessions/', AttendanceSessionView.as_view(), name='attendance-sessions'),
]