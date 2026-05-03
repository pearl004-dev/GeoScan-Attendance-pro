# Deployment Diagram

The Deployment Diagram for the Geo Scan Attendance Pro system illustrates the physical deployment of the system components and how they communicate within the system environment.

The diagram shows how users access the system through web browsers, how the frontend and backend services are hosted, and how the backend communicates with the PostgreSQL database server.

The deployment architecture follows a client-server model where the frontend, backend, and database are deployed on separate logical nodes to improve scalability, maintainability, and security.

## Main Deployment Nodes

### Client Device
The client device represents the devices used by students, lecturers, and university administrators to access the system through web browsers.

Functions:
- Access the web application
- Scan attendance QR codes
- View attendance information
- Manage attendance sessions

### Web Server
The web server hosts the React.js frontend application.

Functions:
- Deliver frontend web pages
- Handle user interface rendering
- Communicate with backend services through APIs

### Application Server
The application server hosts the Node.js and Express.js backend services.

Functions:
- Process attendance requests
- Handle authentication
- Validate QR codes
- Perform geolocation verification
- Manage attendance records

### Database Server
The database server hosts the PostgreSQL database.

Functions:
- Store user information
- Store attendance records
- Store QR session data
- Store geolocation logs


<img width="497" height="877" alt="deployment diagram" src="https://github.com/user-attachments/assets/4d3cf3e9-114a-4db7-84aa-f8a4fae91e80" />

## Explanation of Deployment Relationships

- Client devices access the system through web browsers using HTTPS requests.
- The Web Server delivers the React.js frontend interface to users.
- The frontend communicates with the Application Server through API requests using JSON data.
- The Application Server processes system logic and communicates with the PostgreSQL Database.
- The Database Server stores and retrieves all attendance-related information.

## Justification

The Deployment Diagram provides a clear representation of the physical deployment structure of the Geo Scan Attendance Pro system.

Separating the frontend, backend, and database into different deployment nodes improves:
- system organization,
- maintainability,
- scalability,
- and security.
The client-server deployment model is suitable for web-based attendance systems because it allows centralized management of attendance data while supporting access from multiple devices and users.


