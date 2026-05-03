# Technology Stack

- Backend: Django (Python)
- Frontend: HTML, CSS, JavaScript (with React.js)
- Database: PostgreSQL
- Hosting: Heroku (for development/staging)/ AWS (for production)

## Justification
- Django (Python): Django's robust built-in capabilities, such as admin dashboards and authentication, and its ability to facilitate quick development make it a good choice for this project. This is helpful for keeping track of attendance, instructors, and students. Additionally, it addresses security issues that are crucial for an attendance system, such as blocking unwanted access.

- HTML, CSS, and JavaScript (React.js): JavaScript provides interactivity, while HTML and CSS are used to organize and style the user interface. By enabling dynamic and responsive elements like entering attendance codes, displaying real-time validation (correct code or incorrect code), and instantaneously displaying attendance status, React.js enhances the user experience.

- PostgreSQL: PostgreSQL is perfect for storing structured data like student information, class schedules, and attendance records. It effectively manages numerous users and guarantees data integrity

- Heroku with AWS: Heroku is easy to use for testing and development, enabling rapid deployment. Because AWS offers performance and scalability, which are crucial when numerous students use the app simultaneously, it is preferable for production.