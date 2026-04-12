Software Product Management Plan

Team Members & Roles

• Pearl Masinga (Project Manager) – Oversees planning, timelines, and team coordination

• Lehutso Maahlo (Backend Developer) – Develops server logic, QR generation, and GPS validation

• Ntombikayise Msitini (Researcher) – Gathers requirements, investigates QR and location technologies

• Siphuxolo Nocuze (Tester) – Tests app functionality, identifies bugs, ensures reliability

• Lizalise Manyakavu (UI/UX Designer) – Designs user interface and user experience for students and lecturers

Project Timeline

|  |  |  |
| --- | --- | --- |
| Milestone | Task | Deadline |
| Phase 1 | Define product vision, requirements, and wireframes | Week 3 |
| Phase 2 | Set up development environment and database | Week 5 |
| Phase 3 | Implement QR code generation and scanning | Week 7 |
| Phase 4 | Integrate GPS location verification | Week 9 |
| Phase 5 | Testing and debugging | Week 11 |
| Phase 6 | Final improvements and submission | Week 12 |

Risk Management

• Risk: Students sharing QR codes outside class
→ Mitigation: Use GPS verification to ensure users are within the classroom location

• Risk: QR code being reused
→ Mitigation: Generate a unique QR code for every class session

• Risk: Poor internet connectivity
→ Mitigation: Optimize app to work with low data and allow temporary offline storage

• Risk: Technical bugs or crashes
→ Mitigation: Regular testing and use of version control (GitHub)

• Risk: Delays in development
→ Mitigation: Weekly progress meetings and task tracking

Technology Stack

Why this stack:
The chosen technologies support real-time interaction, mobile accessibility, and secure data handling, which are essential for an attendance system using QR codes and GPS.

• Backend: JavaScript (Node.js) or Python

Used to manage server-side logic, create unique QR codes for every class session, and safely validate GPS data. JavaScript can be used on the server thanks to Node.js, which makes it simpler to link the frontend and backend while managing requests and storing attendance information. Python can also be used for backend development, offering powerful frameworks and tools for handling data processing, security, and application logic.

• Frontend: HTML, CSS, and JavaScript

JavaScript is used to manage user interactions like scanning QR codes and transferring attendance data to the backend, while HTML is used to structure the application and CSS is used for styling and layout. For both students and instructors, this combination makes the interface responsive and easy to use.

• Mobile Access(Web-Based)

Students can use their smartphones to share their GPS location and scan QR codes by using the program, which is accessible via a mobile browser. JavaScript APIs make it possible to access device functionalities like location and camera, enabling the system to run without the need for an additional mobile app.

• Database: SQL (MySQL/PostgreSQL)

Student records, class sessions, and attendance data are safely stored in relational databases like MySQL or PostgreSQL. SQL guarantees dependable handling of attendance data, simple querying, and organized storage.

• APIs & Tools:

• QR Code Generator/Scanner libraries (for dynamic QR functionality)

• GPS/Location Services API (for verifying student location)

• GitHub (for version control and collaboration)