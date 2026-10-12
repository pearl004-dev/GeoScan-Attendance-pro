# GeoScan Attendance Pro — Database Schema

## 1. Purpose

This document describes the main Django models and their corresponding PostgreSQL tables.

## 2. Tables

### 2.1 users_user

Stores user accounts. The custom User model extends Django's AbstractUser.

| Field | Description |
|---|---|
| id | Primary key inherited from AbstractUser |
| username | User's login name |
| role | STUDENT, LECTURER, or ADMIN |
| Other fields | Standard Django user account fields |

The role defaults to STUDENT.

### 2.2 attendance_attendancesession

Stores attendance sessions created by lecturers or administrators.

| Field | Type / purpose |
|---|---|
| id | Primary key |
| class_name | Class name, up to 100 characters |
| date | Session date |
| start_time | Session start time |
| end_time | Session end time |
| qr_token | UUID token, generated automatically |
| classroom_latitude | Classroom latitude |
| classroom_longitude | Classroom longitude |
| allowed_radius | Permitted distance in metres; defaults to 100 |

### 2.3 attendance_attendancerecord

Stores attendance submitted by students.

| Field | Type / purpose |
|---|---|
| id | Primary key |
| session_id | Foreign key to attendance_attendancesession |
| student_id | Foreign key to users_user |
| attended_at | Timestamp set automatically when created |
| student_latitude | Student latitude; nullable |
| student_longitude | Student longitude; nullable |

## 3. Relationships

- One attendance session can have multiple attendance records.
- One user can have multiple attendance records.
- Each attendance record references one session and one user.
- Both foreign keys currently use CASCADE deletion.
- A database-level unique constraint on (session_id, student_id) was not found in the current audit.

## 4. Integrity and Validation Notes

- Primary keys and both attendance-record foreign keys were verified.
- The current data audit found no duplicate student-session pairs or orphaned attendance records.
- The application checks QR tokens, session dates and times, student coordinates, and distance from the classroom.
- Student GPS coordinates are nullable in the database schema.
- Three existing sessions have classroom coordinates (0.0, 0.0). Their intended values should be verified before any changes.
- Session creation should receive additional date and time validation review.

## 5. Security and Maintenance

- Review database access permissions and row-level security configuration with the team.
- Consider a database-level unique constraint for each student and session.
- Verify classroom coordinates and investigate historical records with missing GPS coordinates.
- Apply schema migrations only after team review and coordination.
- This document describes the models and audit findings; it is not a substitute for a fresh production schema inspection.
