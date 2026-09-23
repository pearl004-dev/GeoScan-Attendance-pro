from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import AttendanceSession


class AttendanceSessionView(APIView):

    def post(self, request):
        class_name = request.data.get('class_name')
        date = request.data.get('date')
        start_time = request.data.get('start_time')
        end_time = request.data.get('end_time')

        if not class_name or not date or not start_time or not end_time:
            return Response(
                {"error": "All fields are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        session = AttendanceSession.objects.create(
            class_name=class_name,
            date=date,
            start_time=start_time,
            end_time=end_time
        )

        return Response(
            {
                "message": "Attendance session created successfully.",
                "session_id": session.id
            },
            status=status.HTTP_201_CREATED
        )


