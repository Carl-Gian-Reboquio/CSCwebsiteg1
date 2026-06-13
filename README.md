# Civil Service Examination Online Application Portal

A web-based Civil Service Examination Application Portal that allows applicants to:

* Submit Civil Service Examination applications online
* Create applicant accounts
* Log in to view application details
* View assigned examination schedules

---

## Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MySQL

---

## Features

### Applicant Registration

* Multi-step application form
* Educational information
* Employment information
* PWD information
* Examination history

### Account Creation

* Email and password registration
* Login authentication

### Dashboard

* View applicant information
* View application details
* View examination schedule
* Logout functionality

### Automated Features

* Application Number Generation
* Examination Date Assignment
* Database Storage using MySQL

---

# Project Structure

```text
CSCwebsiteg1
│
├── backend
│   ├── db
│   │   └── connection.js
│   │
│   ├── routes
│   │   ├── applicationRoutes.js
│   │   ├── loginRoutes.js
│   │   └── dashboardRoutes.js
│   │
│   ├── package.json
│   └── server.js
│
├── css
│   └── style.css
│
├── js
│   ├── application.js
│   ├── reviewPage.js
│   ├── loginPage.js
│   └── dashboard.js
│
├── pages
│   ├── application.html
│   ├── reviewPage.html
│   ├── successPage.html
│   ├── loginPage.html
│   └── dashboard.html
│
├── images
│
└── index.html
```

---

# Installation

## 1. Clone the Repository

```bash
git clone <repository-url>
```

Navigate into the project folder:

```bash
cd CSCwebsiteg1
```

---

## 2. Install Dependencies

Navigate to the backend folder:

```bash
cd backend
```

Install all required packages:

```bash
npm install
```

---

## 3. Create the Database

Open MySQL and create the database:

```sql
CREATE DATABASE civil_service_db;
```

Run the provided SQL schema file to create all required tables.

---

## 4. Configure Database Connection

Open:

```text
backend/db/connection.js
```

Update the following values according to your MySQL configuration:

```javascript
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "YOUR_PASSWORD",
  database: "civil_service_db",
});
```

---

# Running the Application

## Start Backend Server

Inside the backend directory:

```bash
node server.js
```

Expected output:

```text
Server running at http://localhost:3000
```

---

## Start Frontend

Open the project folder in Visual Studio Code.

Start Live Server and open:

```text
index.html
```

---

# Application Flow

```text
Home Page
    ↓
Application Form
    ↓
Review Application
    ↓
Create Account
    ↓
Save to Database
    ↓
Success Page
    ↓
Login
    ↓
Dashboard
```

---

# Database Tables

The system uses the following tables:

* applicant
* account
* application
* pwdinfo
* examhistory

Relationships are managed through:

* Person_ID
* Application_No

---

# Important Notes

* Ensure MySQL is running before starting the backend server.
* Ensure the backend server is running on port 3000.
* Open the frontend using Live Server.
* Do not upload the `node_modules` folder to GitHub.

Recommended `.gitignore`:

```gitignore
node_modules/
.env
```

---

# Developers

Group 1

Civil Service Examination Online Application Portal

Developed using HTML, CSS, JavaScript, Node.js, Express.js, and MySQL.
