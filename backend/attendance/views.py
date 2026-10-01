from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import AttendanceSession, AttendanceRecord
from users.models import User


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


class AttendanceRecordView(APIView):

    def post(self, request):
        session_id = request.data.get('session_id')
        student_id = request.data.get('student_id')

        if not session_id or not student_id:
            return Response(
                {"error": "Session ID and student ID are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            session = AttendanceSession.objects.get(id=session_id)
            student = User.objects.get(id=student_id)

            if AttendanceRecord.objects.filter(
                session=session,
                student=student
            ).exists():
                return Response(
                    {"error": "Student already recorded attendance."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except AttendanceSession.DoesNotExist:
            return Response(
                {"error": "Attendance session not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        except User.DoesNotExist:
            return Response(
                {"error": "Student not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        record = AttendanceRecord.objects.create(
            session=session,
            student=student
        )

        return Response(
            {
                "message": "Attendance recorded successfully.",
                "record_id": record.id
            },
            status=status.HTTP_201_CREATED
        )