# Feature to Requirements Mapping

## Feature: Dynamic QR code generation for each class session
- **Functional Requirements:**
- The system shall allow the lecturer to manually initiate the generation of a QR code for a class session. 
- The system shall associate each QR code with a specific course, date, and time. 
- The system shall display the QR code on the lecture hall screen for students to scan.
- **Non-Functional Requirements:**
	- The QR code shall be generated within 2 seconds. 
	- The QR code shall be clearly visible and scannable from a distance.
- Each QR code shall be unique and non-reusable.
## Feature: QR Code Scanning for Students
- **Functional Requirements:**
	- The system shall allow students to scan a QR code using their device camera. 
- The system shall record attendance upon successful scan. 
- The system shall prevent multiple scans by the same student for one session.
- **Non-Functional Requirements:**
	- The scanning process shall complete within 3 seconds. 
- The system shall support Android and iOS devices. 
- The interface shall be user-friendly and easy to navigate.
## Feature: GPS-Based Location Verification
- **Functional Requirements:**
	- The system shall capture the student’s GPS location during QR scan. 
- The system shall verify that the student is within a predefined radius of the class location. 
- The system shall reject attendance if the student is outside the allowed area.
- **Non-Functional Requirements:**
	- Location accuracy shall be within ±10 meters. 
- The system shall ensure data privacy and secure handling of location data. 
- GPS verification shall complete within 5 seconds.
## Feature: Automated Session Expiry for QR Codes
- **Functional Requirements:**
	- The system shall automatically deactivate QR codes after a defined time period
	- The system shall prevent scanning of expired QR codes.
	- The system shall notify users when a session has expired.
- **Non-Functional Requirements:**
- Expiry timing shall be accurate and synchronized with server time. 
- The system shall ensure no delayed or invalid scans are accepted. 
- The expiry mechanism shall be reliable under high load.
## Feature: Secure Login System
- **Functional Requirements:**
	- The system shall allow users to log in using Email/Student ID and password.
	- The system shall authenticate users before granting access.
	- The system shall allow users to log out securely.
- **Non-Functional Requirements:**
	- Passwords shall be encrypted (hashed).
	- The system shall protect against unauthorized access.
	- Login response time shall be less than 2 seconds.
## Feature: Role-Based Dashboards
- **Functional Requirements:**
	- The system shall provide separate dashboards for students and lecturers.
	- The system shall restrict access based on user roles.
	- The system shall display relevant features based on the user type.
- **Non-Functional Requirements:**
	- The system shall ensure data isolation between roles.
	- Dashboard loading time shall be under 3 seconds.
	- The interface shall be responsive across devices (mobile and desktop).
