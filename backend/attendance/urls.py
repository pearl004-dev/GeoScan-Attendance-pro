from django.urls import path
from .views import AttendanceSessionView, AttendanceRecordView

urlpatterns = [
    path('sessions/', AttendanceSessionView.as_view(), name='attendance-sessions'),
    path('records/', AttendanceRecordView.as_view(), name='attendance-records'),
]