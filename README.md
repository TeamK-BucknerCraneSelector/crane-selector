# Buckner Crane Selector

> **COMP523 Project** | Crane rental web application for Buckner Heavy Lift Cranes

[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Salesforce](https://img.shields.io/badge/Salesforce-Integrated-00A1E0?logo=salesforce&logoColor=white)](https://www.salesforce.com/)

---

## Table of Contents

- [Features](#features)
- [Quick Start (Docker Recommended)](#quick-start-docker-recommended)
- [Manual Setup (Without Docker)](#manual-setup-without-docker)
- [Makefile Commands](#makefile-commands)
- [Salesforce Configuration](#salesforce-configuration)
- [Tech Stack](#tech-stack)
- [Troubleshooting](#troubleshooting)
- [Getting Started Checklist](#getting-started-checklist)

---

## Features

| Feature | Description |
|---------|-------------|
| **Request Flow** | For customers who know which crane they need - browse catalog and request quotes |
| **Crane Wizard** | Guided experience for finding the right crane based on project requirements |
| **Salesforce Integration** | Automatic quote submission to Salesforce CRM |
| **Docker Support** | One-command deployment with Docker Compose |

---

## Quick Start (Docker Recommended)

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Salesforce credentials (username, password, security token)
- Salesforce Connected App credentials (Client ID & Secret)

### Setup in 3 Steps

#### 1. Clone & Setup Environment

```bash
# Clone the repository
git clone https://github.com/TeamK-BucknerCraneSelector/crane-selector.git
cd crane-selector

# Setup environment files (copies .env.example → .env)
make setup
```

#### 2. Configure Salesforce Credentials

Edit `backend/.env` with your Salesforce information:

```env
# Salesforce Login
LOGIN_URL=https://test.salesforce.com
USERNAME=your_username@company.com.sandbox
PASSWORD=YourPasswordYourSecurityToken

# Salesforce Connected App
SF_CLIENT_ID=your_consumer_key_here
SF_CLIENT_SECRET=your_consumer_secret_here

# Server Configuration
PORT=8080
```

<details>
<summary><strong>How to get your Salesforce credentials</strong> (click to expand)</summary>

<br>

**Getting Your Security Token:**

1. Log into Salesforce
2. Click your profile icon → **Settings**
3. Navigate to **My Personal Information** → **Reset My Security Token**
4. Click **Reset Security Token**
5. Check your email for the security token
6. **Combine password and token:** `PASSWORD = YourSalesforcePassword + SecurityToken` (no space)
   - Example: If password is `MyPass123` and token is `AbC987XyZ`, use: `MyPass123AbC987XyZ`

**Getting Connected App Credentials:**

1. Go to **Setup** in Salesforce
2. Navigate to **Apps** → **App Manager**
3. Find **Crane Finder** app
4. Click the dropdown (⋮) → **View**
5. Under **API (Enable OAuth Settings)**, click **Manage Consumer Details**
6. Validate your email if prompted
7. Copy **Consumer Key** → paste into `SF_CLIENT_ID`
8. Copy **Consumer Secret** → paste into `SF_CLIENT_SECRET`

</details>

<br>

Edit `frontend/.env` (optional - defaults work for local development):

```env
# API Configuration
VITE_API_URL=http://localhost:8080
```

#### 3. Start the Application

```bash
# Build and start containers
make up

# Or use Docker Compose directly
docker compose up -d
```

#### 4. Access the Application

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | Main web application |
| **Backend API** | http://localhost:8080 | REST API server |

#### 5. View Quotes in Salesforce

1. Log into your Salesforce org
2. Open the **App Launcher** (⋮⋮⋮ grid icon)
3. Search for **"Crane Quote Request"**
4. View submitted quotes in the app

### Stopping the Application

```bash
# Stop containers
make down

# Or use Docker Compose
docker compose down
```

---

## Manual Setup (Without Docker)

### Prerequisites

- Node.js 20+ ([Download](https://nodejs.org/))
- npm or yarn package manager
- Salesforce credentials

### Setup Steps

#### 1. Clone Repository & Setup Environment

```bash
# Clone the repository
git clone https://github.com/TeamK-BucknerCraneSelector/crane-selector.git
cd crane-selector

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit `backend/.env` with your Salesforce credentials (see [Salesforce Configuration](#salesforce-configuration) section).

#### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

#### 3. Start Backend Server

In a terminal window:

```bash
cd backend
npm start
```

The backend will start on http://localhost:8080

#### 4. Start Frontend Development Server

In a **new** terminal window:

```bash
cd frontend
npm run dev
```

The frontend will start on http://localhost:5173

#### 5. Access the Application

Open your browser and navigate to http://localhost:5173

---

## Makefile Commands

Our project includes a Makefile for convenient operations:

| Command | Description |
|---------|-------------|
| `make setup` | Copy `.env.example` files to `.env` |
| `make build` | Build Docker containers (runs `setup` first) |
| `make up` | Start Docker containers in detached mode (runs `setup` first) |
| `make down` | Stop and remove Docker containers |
| `make clean` | Stop containers, remove volumes, and delete `.env` files |
| `make help` | Display available commands |

### Example Usage

```bash
# First time setup
make setup
# Edit .env files with your credentials
make build
make up

# Daily development
make up      # Start
make down    # Stop

# Clean restart
make clean
make setup
# Edit .env files again
make up
```

---

## Salesforce Configuration

### Required Salesforce Setup

#### 1. Custom Object: Crane Quote Request

Ensure your App Manager has a custom object called `Crane_Quote_Request__c` with the following fields:

| Field API Name | Type | Description |
|----------------|------|-------------|
| `Name` | Auto Number | Record identifier |
| `Crane_Model__c` | Text | Selected crane model |
| `Customer_Name__c` | Text | Customer's full name |
| `Email__c` | Email | Customer's email address |
| `Phone__c` | Phone | Customer's phone number |
| `Company__c` | Text | Customer's company name |
| `Project_Details__c` | Long Text Area | Project description |
| `Quote_Status__c` | Picklist | Quote status (New, Contacted, etc.) |
| `Source_Flow__c` | Text | Entry point (Request Flow / Wizard Flow) |

#### 2. Connected App Configuration

1. In Salesforce Setup, go to **Apps** → **App Manager**
2. Create or configure **Crane Finder** app
3. Enable OAuth Settings:
   - Callback URL: `http://localhost:8080/oauth/callback`
   - Selected OAuth Scopes:
     - Full access (full)
     - Perform requests at any time (refresh_token, offline_access)
4. Save and note down the **Consumer Key** and **Consumer Secret**

#### 3. User Permissions

Ensure your Salesforce user has:
- Read/Write access to `Crane_Quote_Request__c` object
- API Enabled permission

---

## Tech Stack

### Frontend

- **React 19.1** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS 4** - Utility-first styling
- **Radix UI** - Accessible component primitives

### Backend

- **Node.js** - JavaScript runtime
- **Express 5** - Web framework
- **jsforce** - Salesforce integration library
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing

### DevOps

- **Docker & Docker Compose** - Containerization
- **Makefile** - Task automation

---

## Troubleshooting

### Docker Issues

**Problem: Containers won't start**
```bash
# Check Docker is running
docker info

# View container logs
docker compose logs backend
docker compose logs frontend

# Rebuild containers
make clean
make build
make up
```

**Problem: Port already in use**
```bash
# Check what's using ports 5173 or 8080
lsof -i :5173
lsof -i :8080

# Stop conflicting processes or change ports in docker-compose.yml
```

### Backend Issues

**Problem: Salesforce connection fails**

1. Verify credentials in `backend/.env`
2. Check security token is correct (reset if needed)
3. Ensure `PASSWORD` = `YourPassword + SecurityToken` with no space
4. Verify Connected App credentials (`SF_CLIENT_ID`, `SF_CLIENT_SECRET`)
5. Check Salesforce user has API access

**Problem: Images not loading**

1. Ensure `backend/images/` folder exists
2. Verify image files are present
3. Check file permissions
4. Confirm Docker volume mounts in `docker-compose.yml`

### Frontend Issues

**Problem: Can't connect to backend**

1. Check `frontend/.env` has correct `VITE_API_URL`
2. Verify backend is running on port 8080
3. Check browser console for CORS errors
4. Ensure both services are on same Docker network (if using Docker)

**Problem: Blank page or errors**

```bash
# Clear cache and rebuild
cd frontend
rm -rf node_modules dist
npm install
npm run dev
```

### Common Errors

| Error | Solution |
|-------|----------|
| `ECONNREFUSED` | Backend server not running - check `docker compose logs backend` |
| `401 Unauthorized` | Invalid Salesforce credentials - verify `.env` file |
| `Cannot find module` | Run `npm install` in the affected directory |
| `Port 5173 already in use` | Kill process using port or change port in `vite.config.ts` |

---

## Getting Started Checklist

- [ ] Docker Desktop installed and running
- [ ] Repository cloned
- [ ] Ran `make setup`
- [ ] Salesforce credentials configured in `backend/.env`
- [ ] Connected App credentials added to `backend/.env`
- [ ] Ran `make up`
- [ ] Accessed http://localhost:5173
- [ ] Submitted test quote
- [ ] Verified quote in Salesforce