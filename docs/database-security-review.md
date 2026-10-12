# GeoScan Attendance Pro — Database Security Review

**Prepared by:** Person 2 — Database Security Review and Testing

**Status:** Code review and initial isolated security tests completed

**Branch:** `database/security-testing`

## 1. Objective

This review evaluates potential security weaknesses in the GeoScan Attendance Pro database integration, user authentication, attendance-management code, and configuration.

All executed API tests used a local PostgreSQL test database named `geoscan_security_test`. No shared Supabase schema, policies, permissions, or data were changed.

## 2. Findings

### Finding 1: Public registration allows privileged roles

**Priority:** High — confirmed

**Evidence:** A registration request supplying the role `ADMIN` returned HTTP 201. A subsequent read-only database query confirmed that the account `security_test_admin` was stored with role `ADMIN`.

**Risk:** An unauthorised person could potentially obtain administrator privileges through public registration.

**Recommendation:** Public registration should assign `STUDENT` on the server and must not allow clients to assign privileged roles. Lecturer and administrator accounts should be provisioned through an authorised process.

**Status:** Confirmed by isolated API testing and database verification. Fix not yet implemented.

### Finding 2: Duplicate attendance records lack a database constraint

**Priority:** Medium–High

**Evidence:** The attendance view checks for an existing record before creating one, but the inspected `AttendanceRecord` model does not declare a uniqueness constraint on `(session, student)`.

**Risk:** Concurrent requests could both pass the application-level check and create duplicate attendance records.

**Recommendation:** Check for existing duplicates and coordinate a database uniqueness constraint on `(session, student)` with the team. Handle integrity errors in the application.

**Status:** Missing constraint confirmed in the inspected model. Concurrent behaviour and existing database data have not been tested.

### Finding 3: Attendance access is not scoped to lecturers' classes

**Priority:** Medium — requirements review required

**Evidence:** The inspected GET views allow users with `LECTURER` or `ADMIN` roles to retrieve all attendance sessions and records. Student requests were denied.

**Risk:** Lecturers may access information beyond the classes assigned to them if the intended policy requires class-level restrictions.

**Recommendation:** Confirm access requirements with the team and restrict lecturers to their authorised sessions and records where appropriate.

**Status:** Global retrieval behaviour confirmed by code inspection. Lecturer-specific access has not yet been tested.

### Finding 4: Authentication token management requires further review

**Priority:** Medium — further review required

**Evidence:** The login endpoint returned HTTP 200 and a token for the local student test account. Authenticated requests using that token reached the attendance permission checks.

**Risk:** Inadequate token revocation, storage, or transmission controls could allow continued unauthorised account access.

**Recommendation:** Review token revocation, logout behaviour, secure storage and transmission, and procedures for compromised accounts.

**Status:** Token issuance confirmed. Revocation and storage controls remain unverified.

### Finding 5: GPS data integrity requires further verification

**Priority:** Medium — further review required

**Evidence:** Student GPS fields allow null values in the inspected model. The attendance view validates submitted coordinates and calculates distance from the classroom location.

**Risk:** Missing or inaccurate stored coordinates could affect attendance verification or auditing if not handled appropriately.

**Recommendation:** Verify that attendance submissions require valid coordinates, inspect the classroom-coordinate migration and existing data, and confirm appropriate handling of missing GPS values.

**Status:** Model and validation code inspected. Dedicated GPS tests and existing-data verification remain outstanding.

### Finding 6: Production configuration requires review

**Priority:** High if these settings are used in production

**Evidence:** The inspected `config/settings.py` contains `DEBUG = True` and `ALLOWED_HOSTS = []`. Django's system check reported no issues.

**Risk:** Debug mode can expose sensitive technical details in production. Hostnames must be configured correctly for the deployed environment.

**Recommendation:** Disable debug mode in production, configure approved hostnames, and use environment-specific settings or environment variables.

**Status:** Local settings confirmed. Production deployment configuration not verified. The successful Django system check does not establish production security.

## 3. Executed isolated tests

| Test | Result |
|---|---|
| Register with `ADMIN` role | FAIL — privileged registration succeeded (HTTP 201) |
| Verify stored test account role | FAIL — role stored as `ADMIN` |
| Unauthenticated GET sessions | PASS — HTTP 401 |
| Unauthenticated GET records | PASS — HTTP 401 |
| Register a student test account | PASS — HTTP 201 |
| Student GET all attendance records | PASS — HTTP 403 |
| Student GET attendance sessions | PASS — HTTP 403 |
| Django `manage.py check` | PASS — no system-check issues |

Tests were run against the local `geoscan_security_test` database using disposable test accounts. These results do not establish that every security control has been tested.

## 4. Existing security controls observed

- Account creation uses Django's `create_user()` method.
- Login uses Django's `authenticate()` function.
- Invalid login credentials receive a general error message.
- Attendance endpoints require authentication.
- Role checks restrict session and record retrieval to lecturers and administrators.
- Attendance submissions use the authenticated user as the student identity.
- The inspected attendance code validates coordinate ranges, checks QR tokens, verifies the session date and time, and calculates distance from the classroom.

These controls are positive observations, but they do not establish that the entire application is secure.

## 5. Outstanding tests

1. Verify that invalid login credentials are rejected.
2. Test that lecturer and administrator permissions match the intended access policy.
3. Test duplicate attendance submissions and concurrent requests in isolation.
4. Test missing, invalid, and out-of-range GPS coordinates.
5. Review token revocation and storage controls.
6. Verify production settings and deployment configuration.
7. Check for existing duplicate records before proposing a uniqueness constraint.
8. Compare the database schema with Django migrations only through an approved, safe connection.

## 6. Change-control precautions

- No shared Supabase schema, policies, permissions, or data were changed during these tests.
- The executed tests used a local test database.
- No production fixes or schema migrations have been applied as part of this review.
- Proposed schema changes must be discussed with Person 1 and approved by the team.
- Existing records must be checked before adding constraints or correcting data.

## 7. Conclusion

Initial isolated testing confirmed a serious registration role-escalation vulnerability: public registration accepted and stored an `ADMIN` role. Unauthenticated access and student access to the protected session and records endpoints were correctly rejected in the tests performed.

The review also identified a missing database-level duplicate-attendance constraint and configuration and data-access issues requiring further review. Findings should be retested after approved fixes. No claim is made that the application is fully secure.

