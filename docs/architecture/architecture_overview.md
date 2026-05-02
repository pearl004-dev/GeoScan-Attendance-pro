# System Architecture Overview
## Architectural Style
The GeoScan Attendance Pro system will use a Layered Architecture together with a Client-Server Architecture.
Software architecture refers to the overall organization of a software system, including its components and how they interact with each other. The selected architecture separates the system into different layers, where each layer performs a specific responsibility. This helps improve maintainability, security, reliability, and scalability.
The system will consist of:
-	Presentation Layer
-	Application Layer
-	Data Layer  

The client-server approach will allow users to access the system through a web browser while the server handles processing, business logic, and database communication.

  ## Alternative Architectural Options Considered
### Monolithic Architecture
Monolithic architecture was considered because it is simple to build and deploy for small systems.
However, it was not selected because:
-	The system becomes difficult to maintain as it grows.
-	All components are tightly coupled.
-	Scalability becomes more difficult.

### Microservices Architecture
A microservices architecture was also considered because it supports scalability and independent services.
However, it was not selected because:
-	It increases development complexity,
-	Requires more server management and is too advanced for a small student project.

### Layered Architecture
Layered architecture was selected because:
-	It supports separation of concerns
-	Components are easier to manage
-	Testing becomes simpler, and the system becomes easier to maintain and extend.

This architecture is commonly used for web-based systems.

## Trade-offs

### Advantages
-	Easier maintenance and testing.
-	Better organization of system components.
-	Improved readability of code.
-	Easier teamwork during development.
-	Supports future system expansion.

### Disadvantages
-	Communication between layers may slightly reduce performance.
-	Poor design between layers may create tight coupling.
-	More layers may increase system complexity.

## Potential Architecture Risks or Issues

### Tight Coupling
If layers depend too much on each other, modifying one component may affect others.
### Performance Bottlenecks
The backend server may become overloaded if many students scan QR codes simultaneously.
### GPS Accuracy
Incorrect geolocation data may affect attendance verification.
### Security Risks
Students may attempt to share QR codes or fake locations.
### Internet Dependency
The system depends on stable internet connectivity between the client and server.

## High-Level Architecture Diagram





## Explanation of Layers

### Presentation Layer
This layer handles user interaction through the web application interface.

### Application Layer 
This layer contains the business logic of the system, such as QR code verification, authentication, geolocation validation, and attendance processing.

### Data Layer
This layer handles data storage and retrieval using the PostgreSQL database.


## Justification
The Layered Architecture was selected because it provides a balance between simplicity, maintainability, and scalability.

The architecture separates concerns into independent layers, making the system easier to understand, test, and maintain. It also works well with the selected technologies for the project, including React.js, Node.js and PostgreSQL.

The client-server structure further supports web-based access and centralized data management for attendance records.
