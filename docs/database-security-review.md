\# GeoScan Attendance Pro — Database Security Review



\*\*Prepared by:\*\* Person 2 — Database Security Review and Testing  

\*\*Status:\*\* Initial code review  

\*\*Branch:\*\* `database/security-testing`



\## 1. Objective



The purpose of this review is to identify potential security weaknesses in the GeoScan Attendance Pro database integration, user authentication, and attendance-management code.



The review is read-only. No changes have been made to the shared Supabase database.



\## 2. Findings



\### Finding 1: Registration role assignment



\*\*Priority:\*\* High — requires verification



The registration endpoint accepts a role from the client's request and passes it to `User.objects.create\_user()`.



\*\*Risk:\*\* A user may be able to register with the `ADMIN` or `LECTURER` role if no other validation prevents it.



\*\*Recommendation:\*\* Assign `STUDENT` by default during public registration. Allow privileged roles to be assigned only through an authorised administrative process.



\*\*Status:\*\* Potential vulnerability identified in code review; safe testing required.



\### Finding 2: Duplicate attendance records



\*\*Priority:\*\* Medium–High



The attendance view checks whether a student has already attended a session. However, the inspected model and migrations do not define a database uniqueness constraint on the session and student combination.



\*\*Risk:\*\* Concurrent requests could potentially create duplicate attendance records.



\*\*Recommendation:\*\* Propose a database uniqueness constraint on `(session, student)` and handle duplicate-record errors in the application.



\*\*Status:\*\* Confirmed absence of a constraint in the inspected source; database state and safe implementation require verification.



\### Finding 3: Attendance data access



\*\*Priority:\*\* Medium — requirements review required



The attendance views allow lecturers and administrators to retrieve all attendance sessions and records.



\*\*Risk:\*\* Lecturers may be able to access information beyond the classes assigned to them, depending on the intended access rules.



\*\*Recommendation:\*\* Confirm the access requirements with the team and restrict lecturers to authorised sessions and records where appropriate.



\*\*Status:\*\* Access-control review required.



\### Finding 4: Authentication token management



\*\*Priority:\*\* Medium — further review required



The login endpoint issues or retrieves a DRF authentication token.



\*\*Risk:\*\* If tokens are not revoked when required or are exposed to unauthorised parties, accounts could remain accessible.



\*\*Recommendation:\*\* Review logout and token revocation, secure token storage and transmission, and procedures for compromised accounts.



\*\*Status:\*\* Token issuance confirmed; revocation and storage controls not yet verified.



\### Finding 5: GPS data integrity



\*\*Priority:\*\* Medium — further review required



Student GPS fields allow null values. Classroom coordinates were added in migration `0004` using a temporary default of zero.



\*\*Risk:\*\* Missing student coordinates or incorrect classroom coordinates could affect attendance verification if not handled correctly.



\*\*Recommendation:\*\* Confirm that the application requires valid GPS coordinates for attendance and audit existing classroom coordinates before proposing data corrections.



\*\*Status:\*\* Model and migration findings confirmed; live data requires verification.



\### Finding 6: Production configuration



\*\*Priority:\*\* High if insecure settings are used in production



The inspected settings file contains `DEBUG = True` and `ALLOWED\_HOSTS = \[]`.



\*\*Risk:\*\* Debug mode can expose sensitive technical information if enabled in production. Host validation must be configured correctly for deployment.



\*\*Recommendation:\*\* Use environment-specific settings, disable debug mode in production, and configure the permitted hostnames.



\*\*Status:\*\* Settings observed locally; production deployment configuration not yet verified.



\## 3. Existing security controls observed



\- Django's `create\_user()` is used for account creation, supporting Django's password-hashing process.

\- Login uses Django's `authenticate()` function.

\- Login returns a general invalid-credentials message.

\- Attendance endpoints require authentication.

\- Role checks are present in the attendance views.

\- GPS coordinates and attendance distance are validated in the inspected attendance code.

\- Attendance submissions use the authenticated user as the student identity.



These controls are positive findings but do not establish that the entire application is secure.



\## 4. Testing plan



Testing must use an isolated test database and test accounts.



1\. Verify that public registration cannot grant administrator or lecturer privileges.

2\. Verify that invalid login credentials are rejected.

3\. Verify that unauthenticated users cannot access protected attendance endpoints.

4\. Verify that lecturers cannot access unauthorised classes or attendance records.

5\. Test duplicate attendance submissions, including concurrent requests.

6\. Verify GPS validation and rejection of missing or out-of-range coordinates.

7\. Review token revocation and production configuration.

8\. Compare the live schema with the Django migrations once an approved, safe connection is available.



\## 5. Change-control precautions



\- No shared Supabase schema, policies, or permissions were changed during this review.

\- No migrations or test records were applied to the shared database.

\- Proposed database changes must be discussed with Person 1 and approved by the team.

\- Existing records must be checked before adding constraints or correcting data.



\## 6. Conclusion



The initial review identified potential weaknesses involving registration role assignment, duplicate attendance prevention, access control, token management, GPS data integrity, and production configuration.



Further isolated testing and team review are required before implementing fixes. Findings must be updated as verification is completed.

