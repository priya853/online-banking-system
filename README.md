# Online Banking System

A full-stack Online Banking application built with Java, Spring Boot, Spring Security, JWT, React.js, and MySQL. The project provides banking operations through REST APIs and a React-based user interface.

## Project Overview

The Online Banking System is designed to demonstrate full-stack development, REST API integration, authentication, authorization, database connectivity, and banking transaction management.

## Technology Stack

### Backend
- Java 25
- Spring Boot 4+
- Spring Security
- JWT Authentication
- Spring Data JPA and Hibernate
- MySQL
- Maven
- Swagger UI / OpenAPI

### Frontend
- React.js
- React Router
- Vite
- JavaScript
- HTML and CSS
- jsPDF and jsPDF-AutoTable for PDF-related functionality

### Tools
- IntelliJ IDEA
- Visual Studio Code
- MySQL
- Postman
- Git and GitHub

## Features

### Authentication and Security
- User registration and login
- JWT-based authentication
- Role-based authorization
- Password hashing with BCrypt
- Protected API endpoints

### Banking Operations
- Bank account creation and account details
- Account balance management
- Deposits and withdrawals
- Money transfers
- Transaction history

### User Dashboard
- Dashboard information
- Account and transaction details

### Administration
- User and bank account management
- User blocking and activation
- Administrative access controls

### Frontend
- React-based user interface
- Integration with backend REST APIs
- User and admin sections
- Client-side navigation

> Available features and access permissions depend on the implemented application code and configuration.

## Project Structure

```text
online-banking/
├── src/
│   └── main/
│       ├── java/com/onlinebanking/
│       │   ├── config/
│       │   ├── controller/
│       │   ├── dto/
│       │   ├── entity/
│       │   ├── repository/
│       │   ├── security/
│       │   └── service/
│       └── resources/
│           └── application-example.properties
├── online-banking-frontend/
│   ├── src/
│   │   ├── admin/
│   │   ├── assets/
│   │   └── pages/
│   ├── package.json
│   └── vite.config.js
├── pom.xml
└── README.md
```

## Prerequisites

Install the following before running the project:

- Java JDK 25
- MySQL Server
- Node.js and npm
- Git

## Backend Setup

### 1. Clone the repository

```bash
git clone https://github.com/priya853/online-banking-system.git
cd online-banking-system
```

### 2. Create the database

Create a MySQL database:

```sql
CREATE DATABASE online_banking;
```

### 3. Configure application properties

The example configuration is located at:

`src/main/resources/application-example.properties`

Create your local configuration file by copying the example:

```powershell
Copy-Item "src\main\resources\application-example.properties" "src\main\resources\application.properties"
```

Update the local `application.properties` with your own database credentials and required JWT and admin settings.

Configure these environment variables as required by the example:

- `DB_PASSWORD`
- `JWT_SECRET`
- `ADMIN_PASSWORD`

Set `DB_USERNAME` if your MySQL username is not `root`.

**Security:** Do not commit `application.properties`, database passwords, JWT secrets, or other credentials to GitHub. Use strong, private values for local configuration.

### 4. Build the backend

From the project root:

```powershell
.\mvnw.cmd -DskipTests package
```

### 5. Run the backend

```powershell
.\mvnw.cmd spring-boot:run
```

The backend is configured to run at:

`http://localhost:8080`

## Frontend Setup

Open another terminal:

```powershell
Set-Location "C:\Spring Boot\online-banking\online-banking-frontend"
npm install
npm run dev
```

Vite will display the local frontend URL in the terminal, usually:

`http://localhost:5173`

If port 5173 is already in use, Vite may select another available port. Open the URL displayed in your terminal.

### Create a production build

```powershell
npm run build
```

The generated production files are placed in the `dist` directory.

## API Documentation

When the backend is running, open Swagger UI:

`http://localhost:8080/swagger-ui/index.html`

Use Swagger UI or Postman to inspect and test the API endpoints implemented by the application.

### Main API areas

| Area | Example endpoint | Purpose |
|---|---|---|
| Authentication | `/api/auth/login` | User login |
| Users | `/api/users` | User management |
| Bank accounts | `/api/accounts` | Account operations |
| Transfers | `/api/transfers` | Money transfer operations |
| Transactions | `/api/transactions` | Transaction information |
| Dashboard | `/api/dashboard` | Dashboard information |

Exact routes, HTTP methods, request bodies, and authorization requirements should be verified in Swagger UI and the source code.

## Database

The application uses MySQL for persistent storage. Database tables are managed through the application's JPA entity and configuration setup.

Database name:

`online_banking`

## Testing and Verification

The following checks have been performed during project development:

- Backend Maven package build
- Frontend Vite production build

Use Postman or Swagger UI to test authentication and the banking APIs. A successful build does not, by itself, verify every API workflow or security scenario.

## Skills Demonstrated

- Java and object-oriented programming
- Spring Boot application development
- REST API development and integration
- Spring Security and JWT
- JPA/Hibernate database integration
- MySQL database connectivity
- React.js frontend development
- API testing with Postman and Swagger UI
- Git and GitHub version control

## Future Enhancements

Potential improvements include:

- Automated unit and integration tests
- Email and OTP verification
- Password recovery
- Pagination and advanced search
- Bank statement downloads
- Docker deployment and cloud hosting

## Author

**Priyanka Chavan**

Java Full Stack Developer

GitHub: [online-banking-system](https://github.com/priya853/online-banking-system)

---

This project was developed for learning and demonstration purposes. It is not intended for handling real banking transactions or production financial data.
