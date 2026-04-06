# Job Tracker API
<img width="1440" height="900" alt="Screenshot 2026-04-06 at 14 05 54" src="https://github.com/user-attachments/assets/ad643996-ee03-4449-89ba-c82ca6527f41" />
<img width="1440" height="900" alt="Screenshot 2026-04-06 at 14 05 47" src="https://github.com/user-attachments/assets/6f9e9a94-aed9-4c69-a157-3f96f10906f1" />
<img width="1440" height="900" alt="Screenshot 2026-04-06 at 13 59 35" src="https://github.com/user-attachments/assets/05a107e3-7a7b-49e5-ae22-d45259f904e0" />
<img width="1440" height="900" alt="Screenshot 2026-04-06 at 13 59 31" src="https://github.com/user-attachments/assets/98529681-bb03-401d-bb0e-bcbd911a0450" />
<img width="1440" height="900" alt="Screenshot 2026-04-06 at 13 59 24" src="https://github.com/user-attachments/assets/9e151db3-a3ee-4c41-b8b0-985aa0425bc7" />

The Job Tracker API is a robust backend service designed to manage job applications, providing functionalities for users to track their application process. It includes features for user authentication and secure data management, ensuring that job application data is organized and accessible.

## Table of Contents
- [Project Description](#project-description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup (Prisma)](#database-setup-prisma)
  - [Running the Application](#running-the-application)
    - [Locally](#locally)
    - [Using Docker](#using-docker)
    - [Using Docker Compose (for services)](#using-docker-compose-for-services)
- [Authentication](#authentication)
- [Troubleshooting](#troubleshooting)

## Project Description

The Job Tracker API facilitates the tracking and management of job applications. Users can create, view, update, and delete their job application records, including details such as company name, job title, application status, and notes. The API is secured with user authentication, ensuring that each user's data remains private and accessible only to them.

## Features

- **User Authentication:** Secure user registration, login, and session management using JWT.
- **Job Application Management:** CRUD operations for job application records (create, read, update, delete).
- **Relational Data:** Link job applications to specific users.

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (with Prisma ORM)
- **Authentication:** JWT (JSON Web Tokens), Bcrypt (for password hashing)
- **Containerization:** Docker, Docker Compose
- **Language:** TypeScript
- **Other:** Redis (for potential caching/session management)

## Getting Started

Follow these instructions to set up and run the Job Tracker API on your local machine.

### Prerequisites

Ensure you have the following installed:

- **Node.js**: Version 20.x or later. You can download it from [nodejs.org](https://nodejs.org/).
- **npm**: Comes with Node.js.
- **PostgreSQL**: A running PostgreSQL instance is required for the database.
- **Redis**: A running Redis instance is recommended (used by Docker Compose setup).
- **Docker & Docker Compose**: (Optional) For running services or the application in containers.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [repository-url]
    cd job-tracker-api
    ```
    (Note: Replace `[repository-url]` with the actual repository URL)

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Database Setup (Prisma)

The application uses Prisma as its ORM to interact with a PostgreSQL database.

1.  **Ensure your `.env` file is configured with your PostgreSQL database URL.**
    Example `.env` entry:
    ```
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/jobtracker?schema=public"
    ```

2.  **Run database migrations:**
    This command applies all pending migrations to your database, creating necessary tables.
    ```bash
    npx prisma migrate dev --name init_application
    ```
    *(Note: The `--name` flag is used for the initial migration. Subsequent migrations might use different names based on changes.)*

3.  **Generate Prisma Client:**
    ```bash
    npx prisma generate
    ```

4.  **Seed the database (Optional):**
    If you have a `prisma/seed.ts` file, you can populate your database with initial data.
    ```bash
    npx prisma db seed
    ```
    *(Troubleshooting seed script issues: Ensure `prisma.config.ts` has `seed: "ts-node prisma/seed.ts"` and `prisma/seed.ts` includes `import 'dotenv/config';` and imports the shared prisma singleton `import { prisma } from '../src/utils/prisma';`)*

5.  **View the database (Optional):**
    Open Prisma Studio to inspect and edit your database data in a browser.
    ```bash
    npx prisma studio
    ```

### Running the Application

#### Locally

To run the application directly using `ts-node`:

```bash
npx ts-node src/app.ts
```

The API will typically run on `http://localhost:5000` (or another port as configured in `src/app.ts` or environment variables).

#### Using Docker

1.  **Build the Docker image:**
    ```bash
    docker build -t job-tracker-api .
    ```

2.  **Run the Docker container:**
    ```bash
    docker run -p 5000:5000 job-tracker-api
    ```

    The application will be accessible via `http://localhost:5000`.

#### Using Docker Compose (for services)

You can use Docker Compose to spin up the PostgreSQL database and Redis instances. The application itself can then connect to these services.

1.  **Start the database and Redis services:**
    ```bash
    docker-compose up -d postgres redis
    ```

2.  **Connect your locally running application or Docker container to these services.** Ensure your `DATABASE_URL` and Redis connection strings in your `.env` file match the Docker Compose service configurations (e.g., `localhost:5432` for postgres, `localhost:6379` for redis).

<h2>Authentication</h2>

The API implements JWT-based authentication.

-   **JWT Signing:** Uses `HS256` algorithm explicitly to prevent algorithmic
    vulnerabilities.
    *   **HS256:** HMAC (Hash-based Message Authentication Code) with SHA-256, using a shared secret.

-   **Password Hashing:** Passwords are securely hashed using `bcrypt`.
    *   **One-way Hashing:** Passwords cannot be reversed from their hash.
    *   **Salting:** Random data mixed with passwords before hashing ensures unique hashes for identical passwords.
    *   **Cost Factor:** Controls hashing computational intensity, balancing security and performance (typically 10-12).

<h2>Troubleshooting</h2>

<h3>Prisma Seed Script Failure</h3>

**Issue:** Persistent `PrismaClientConstructorValidationError` when running `npx prisma db seed`. This often occurs due to misconfiguration or incompatibility when `ts-node` attempts to run the seed script with Prisma.

**Solution:**
1.  **Ensure `prisma.config.ts` is correctly configured:**
    ```typescript
    migrations: {
      path: "prisma/migrations",
      seed: "ts-node prisma/seed.ts", // This line is crucial
    },
    ```
2.  **Verify `prisma/seed.ts`:**
    *   Add `import 'dotenv/config';` at the top to load environment variables.
    *   Import the shared Prisma singleton: `import { prisma } from '../src/utils/prisma';` (instead of instantiating a new PrismaClient locally).
    *   If using a driver adapter (e.g., for PostgreSQL), ensure `src/utils/prisma.ts` correctly initializes `PrismaClient` with the adapter.

<h3>Migration Errors (e.g., adding non-nullable column)</h3>

**Issue:** When adding a new non-nullable column (e.g., `userId` to `Application`), existing records prevent the migration from applying directly.

**Solution:** For development environments, resetting the database is often the quickest solution.
```bash
npx prisma migrate reset
```
*(Caution: This command will delete all data in your database and re-run all migrations. Use with extreme care in non-development environments.)*

<h3>General Prisma Connection Issues</h3>

-   **`.env` file:** Double-check that `DATABASE_URL` is correctly set in your `.env` file and points to an accessible PostgreSQL instance.
-   **Prisma Singleton:** The `src/utils/prisma.ts` file ensures a single `PrismaClient` instance (connection pool) is used throughout the application. The actual connection is established only when the first query is run.

```
Full Flow (super simple): ⭐️⭐️⭐️

.env file
→ Contains DATABASE_URL (just the address + username + password)

Singleton file (prisma.ts)
→ Creates one PrismaClient + one connection pool using that URL.
→ But it does not open the real connection yet.

Repository (your ApplicationRepository)
→ Just calls methods like prisma.application.create(...)

When a ***route is called*** (e.g. POST /applications or GET /applications)
→ Repository runs a query → only then the real connection to the database is opened using the pool from the singleton.
```
