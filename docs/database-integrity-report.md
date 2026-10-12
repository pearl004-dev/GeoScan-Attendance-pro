# GeoScan Attendance Pro — Database Integrity Report

## 1. Purpose

This report documents the read-only database integrity checks performed on the GeoScan Attendance Pro attendance database using Django and PostgreSQL.

## 2. Checks Performed

| Check | Result |
|---|---|
| Model relationships | Attendance records reference attendance sessions and users. |
| Foreign keys | Both session and student foreign keys were verified. |
| Primary keys | Primary keys were found on both attendance tables. |
| Indexes | Primary-key indexes and indexes on `session_id` and `student_id` were found. |
| Duplicate attendance records | No duplicate student-session pairs were found in the current data. |
| Orphaned attendance records | Zero orphaned records were found. |
| Nullable fields | Required and nullable columns were inspected. |
| Session time ranges | No sessions with end times earlier than or equal to start times were found. |
| Classroom coordinates | No coordinates outside valid latitude and longitude ranges were found. |
| GPS radius | No sessions with a radius of zero or less were found. |
| Duplicate QR tokens | No duplicate QR tokens were found among existing sessions. |
| Null QR tokens | No null QR tokens were found. |

## 3. Observations

- Student GPS coordinates are nullable in the database schema and should be reviewed against the application's GPS verification requirements.
- QR tokens use the PostgreSQL UUID data type.
- The checks did not verify QR token expiry, token generation security, or all application-level attendance rules.
- No database data was intentionally modified during these checks.

## 4. Conclusion

The read-only checks completed so far did not identify duplicate attendance pairs, orphaned attendance records, invalid coordinate ranges, or non-positive GPS radii in the current data.

Further review is required to confirm application-level validation, database constraints, access security, and consistency between Django models and the database schema.

## 5. Next Steps

1. Review Django models and migrations against the database schema.
2. Review GPS validation and duplicate attendance prevention.
3. Document tables, columns, relationships, and constraints.
4. Review database security and backend integration.
5. Record test evidence and recommendations for the development team.
## 6. Additional Findings (11 October 2026)

| Check | Result |
|---|---|
| Database constraints | Primary key and both foreign keys exist on attendance records. |
| Unique student-session constraint | Missing. Recommend adding a Django UniqueConstraint after team review. |
| Duplicate attendance pairs | None found in the current data. |
| Migration consistency | `makemigrations --check --dry-run` returned `No changes detected`. |
| Django system check | `manage.py check` reported no issues. |
| Classroom coordinates | Three sessions contain (0.0, 0.0); verify whether these are test values or placeholders before changing them. |
| Student GPS coordinates | Two existing attendance records have null latitude and longitude. Review whether this is acceptable for historical or test records. |

## 7. Recommendations

1. Discuss and approve a unique constraint on the combination of session and student to prevent duplicate attendance records at database level.
2. Verify the intended classroom coordinates for sessions containing (0.0, 0.0).
3. Review the two records with missing student GPS coordinates.
4. Test session date and time validation and duplicate attendance handling.
5. Do not modify shared database records or apply schema migrations without team coordination.


## 8. Security Review Findings (11 October 2026)

| Check | Result |
|---|---|
| Row Level Security (RLS) | Enabled on all three main tables. |
| Explicit RLS policies | None found for the three tables during the audit. |
| anon and authenticated roles | The checked roles cannot bypass RLS. |
| postgres and service_role | Both roles can bypass RLS and have broad table privileges. |
| Table grants | No grants for anon or authenticated appeared in the inspected results. |

### Security recommendations

1. Confirm the intended database access design with the team before adding or changing RLS policies.
2. Keep privileged database credentials and service-role keys secret; never expose them in frontend code.
3. Verify that the Django backend uses appropriately protected credentials and that public API access is restricted.
4. Recheck table privileges and policies after the team agrees on the security design.
5. Do not change shared database permissions without team approval.
