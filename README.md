# Buckner Crane Selector

Repo for our COMP523 project for our client, Buckner Heavylift Cranes 

## Features

- **Request Flow**: Select a crane and request a quote
- **Crane Wizard**: Answer questions to find the right crane for your project
- **Salesforce Integration**: Quotes automatically saved to Salesforce

---

## Quick Start with Docker

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Salesforce credentials (username, password, security token)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/crane-selector.git
   cd crane-selector
   ```

2. **Set up Salesforce credentials**
   ```bash
   cp backend/.env.example backend/.env
   ```
   
   Edit `backend/.env` with your Salesforce information:
   ```env
   LOGIN_URL=https://test.salesforce.com
   USERNAME=your_username@company.com.sandbox
   PASSWORD=YourPasswordYourSecurityToken
   ```
   
   **Important**: `PASSWORD` is your Salesforce password and security token combined with no space.
   

3. **Start the application**
   ```bash
   docker compose up
   ```
   
4. **Open in your browser**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8080

5. **Stop the application**
   
   Press `Ctrl+C` or run:
   ```bash
   docker compose down
   ```

---

## Manual Setup (Without Docker)

### What You Need

- Node.js 20+
- Salesforce credentials

### Setup Steps

1. **Clone and setup environment**
   ```bash
   git clone https://github.com/your-org/crane-selector.git
   cd crane-selector
   cp backend/.env.example backend/.env
   ```
   
   Edit `backend/.env` with your Salesforce credentials (same format as Docker setup above)

2. **Start the backend** (in one terminal)
   ```bash
   cd backend
   npm install
   npm start
   ```

3. **Start the frontend** (in another terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Open in your browser**
   - Frontend: http://localhost:5173

---

## Getting Your Salesforce Security Token

1. Log into Salesforce
2. Click your profile → **Settings**
3. Search for "Reset My Security Token"
4. Click **Reset Security Token**
5. Check your email for the token
6. Combine your password + token in the `.env` file (no space between them)

---
