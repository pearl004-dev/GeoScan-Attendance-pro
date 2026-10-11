
import math

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

from .models import AttendanceSession, AttendanceRecord
from users.models import User


class AttendanceSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role not in ["LECTURER", "ADMIN"]:
            return Response(
                {"error": "You are not allowed to view sessions."},
                status=status.HTTP_403_FORBIDDEN
            )

        sessions = AttendanceSession.objects.all().order_by("-date")
        data = [
            {
                "session_id": s.id,
                "class_name": s.class_name,
                "date": s.date,
                "start_time": s.start_time,
                "end_time": s.end_time,
            }
            for s in sessions
        ]
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        if request.user.role not in ["LECTURER", "ADMIN"]:
            return Response(
                {"error": "Only lecturers can create sessions."},
                status=status.HTTP_403_FORBIDDEN
            )

        class_name = request.data.get("class_name")
        date = request.data.get("date")
        start_time = request.data.get("start_time")
        end_time = request.data.get("end_time")
        latitude = request.data.get("classroom_latitude")
        longitude = request.data.get("classroom_longitude")
        radius = request.data.get("allowed_radius", 100)

        if not all([
            class_name, date, start_time, end_time,
            latitude is not None, longitude is not None
        ]):
            return Response(
                {"error": "All fields and classroom coordinates are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            latitude = float(latitude)
            longitude = float(longitude)
            radius = float(radius)

            if not -90 <= latitude <= 90:
                raise ValueError
            if not -180 <= longitude <= 180:
                raise ValueError
            if radius <= 0:
                raise ValueError

            session = AttendanceSession.objects.create(
                class_name=class_name,
                date=date,
                start_time=start_time,
                end_time=end_time,
                classroom_latitude=latitude,
                classroom_longitude=longitude,
                allowed_radius=radius
            )
        except (ValueError, TypeError):
            return Response(
                {"error": "Enter valid coordinates and a positive radius."},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {
                "message": "Attendance session created successfully.",
                "session_id": session.id,
                "qr_token": str(session.qr_token)
            },
            status=status.HTTP_201_CREATED
        )


class AttendanceRecordView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role not in ["LECTURER", "ADMIN"]:
            return Response(
                {"error": "Only lecturers and admins can view all records."},
                status=status.HTTP_403_FORBIDDEN
            )

        records = AttendanceRecord.objects.select_related(
            "session", "student"
        ).all().order_by("-attended_at")

        data = [
            {
                "record_id": r.id,
                "session_id": r.session.id,
                "class_name": r.session.class_name,
                "student_id": r.student.id,
                "username": r.student.username,
                "attended_at": r.attended_at,
            }
            for r in records
        ]
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        if request.user.role != "STUDENT":
            return Response(
                {"error": "Only students can record attendance."},
                status=status.HTTP_403_FORBIDDEN
            )

        session_id = request.data.get("session_id")
        qr_token = request.data.get("qr_token")
        latitude = request.data.get("latitude")
        longitude = request.data.get("longitude")

        if not all([
            session_id, qr_token,
            latitude is not None, longitude is not None
        ]):
            return Response(
                {"error": "Session, QR token and GPS coordinates are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            latitude = float(latitude)
            longitude = float(longitude)

            if not -90 <= latitude <= 90:
                raise ValueError
            if not -180 <= longitude <= 180:
                raise ValueError

            session = AttendanceSession.objects.get(id=session_id)

        except (ValueError, TypeError):
            return Response(
                {"error": "Invalid coordinates or session ID."},
                status=status.HTTP_400_BAD_REQUEST
            )
        except AttendanceSession.DoesNotExist:
            return Response(
                {"error": "Attendance session not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        student = request.user

        if str(session.qr_token) != str(qr_token):
            return Response(
                {"error": "Invalid QR token."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if session.date != timezone.localdate():
            return Response(
                {"error": "Attendance is only allowed on the session date."},
                status=status.HTTP_400_BAD_REQUEST
            )

        now = timezone.localtime().time()
        if now < session.start_time or now > session.end_time:
            return Response(
                {"error": "Attendance is outside the session time."},
                status=status.HTTP_400_BAD_REQUEST
            )

        earth_radius = 6371000
        lat1 = math.radians(session.classroom_latitude)
        lat2 = math.radians(latitude)
        lat_diff = math.radians(latitude - session.classroom_latitude)
        lon_diff = math.radians(longitude - session.classroom_longitude)

        a = (
            math.sin(lat_diff / 2) ** 2
            + math.cos(lat1) * math.cos(lat2)
            * math.sin(lon_diff / 2) ** 2
        )
        distance = 2 * earth_radius * math.asin(
            math.sqrt(min(1, a))
        )

        if distance > session.allowed_radius:
            return Response(
                {"error": "You are outside the classroom attendance area."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if AttendanceRecord.objects.filter(
            session=session, student=student
        ).exists():
            return Response(
                {"error": "Student already recorded attendance."},
                status=status.HTTP_400_BAD_REQUEST
            )

        record = AttendanceRecord.objects.create(
            session=session,
            student=student,
            student_latitude=latitude,
            student_longitude=longitude
        )

        return Response(
            {
                "message": "Attendance recorded successfully.",
                "record_id": record.id,
                "distance_metres": round(distance, 2)
            },
            status=status.HTTP_201_CREATED
        )
