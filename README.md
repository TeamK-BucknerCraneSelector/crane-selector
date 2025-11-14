# Buckner Crane Selector

> Web application for crane rental selection and quote requests for Buckner Heavy Lift Cranes

[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Salesforce](https://img.shields.io/badge/Salesforce-Integrated-00A1E0?logo=salesforce&logoColor=white)](https://www.salesforce.com/)

**Live Application**: https://crane-selector.vercel.app/  
**Delivered By**: COMP523 Team K - University of North Carolina at Chapel Hill

---

## Quick Links

- [For Clients](#-for-clients) - Non-technical overview
- [For Developers](#-for-developers) - Technical setup
- [Production URLs](#-production-urls)
- [Documentation](#-documentation)

---

## For Clients

### What This Application Does

The Crane Selector helps your customers find and request quotes for the right crane:

1. **Request Flow** - Browse 12 available cranes and request a quote
2. **Wizard Flow** - Answer 5 questions to get personalized recommendations

All quote requests automatically go to your Salesforce CRM.

### Accessing the Application

- **Customer Website**: https://crane-selector.vercel.app/
- **View Quotes**: Log into Salesforce → "Crane Quote Request" app

### Need Help?

- **Client Guide**: See [CLIENT_HANDOFF.md](./CLIENT_HANDOFF.md)
- **Troubleshooting**: See [Troubleshooting section](#-troubleshooting)
- **Contact**: COMP523 Team K

---

## For Developers

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Recommended)
- OR Node.js 22+ and npm

### Quick Start (Docker - Recommended)

```bash
# 1. Clone repository
git clone https://github.com/TeamK-BucknerCraneSelector/crane-selector.git
cd crane-selector

# 2. Setup environment files
make setup

# 3. Configure Salesforce credentials in backend/.env
#    (See Configuration section below)

# 4. Start application
make up

# 5. Access application
# Frontend: http://localhost:5173
# Backend:  http://localhost:8080
```

### Configuration

#### Backend Environment (`backend/.env`)

```env
# Salesforce Credentials
LOGIN_URL=https://test.salesforce.com
USERNAME=your_username@company.com.sandbox
PASSWORD=YourPasswordYourSecurityToken

# Salesforce Connected App
SF_CLIENT_ID=your_consumer_key
SF_CLIENT_SECRET=your_consumer_secret

# Server
PORT=8080
NODE_ENV=development
```

<details>
<summary><strong>How to get Salesforce credentials</strong> (click to expand)</summary>

**Security Token**:
1. Salesforce → Settings → Reset My Security Token
2. Check your email for the token
3. Combine: `PASSWORD = YourPassword + SecurityToken` (no space)

**Connected App Credentials**:
1. Salesforce Setup → Apps → App Manager
2. Find "Crane Finder" → View
3. Manage Consumer Details
4. Copy Consumer Key → `SF_CLIENT_ID`
5. Copy Consumer Secret → `SF_CLIENT_SECRET`

</details>

#### Frontend Environment (`frontend/.env`)

```env
VITE_API_URL=http://localhost:8080
```

---

## Makefile Commands

| Command | Description |
|---------|-------------|
| `make setup` | Copy .env.example files to .env |
| `make build` | Build Docker containers |
| `make up` | Start application |
| `make down` | Stop application |
| `make clean` | Stop and remove all data |
| `make help` | Show all commands |

---

## Production URLs

### Live Services

- **Frontend**: https://crane-selector.vercel.app/
- **Backend API**: https://nn82jveqdk.us-east-2.awsapprunner.com/
- **Salesforce**: https://test.salesforce.com (Sandbox)

### API Endpoints

```bash
# Health check
GET https://nn82jveqdk.us-east-2.awsapprunner.com/health

# Get all cranes
GET https://nn82jveqdk.us-east-2.awsapprunner.com/api/cranes

# Get recommendations
GET https://nn82jveqdk.us-east-2.awsapprunner.com/api/recommendation?weight=150&height=300&radius=200

# Submit quote
POST https://nn82jveqdk.us-east-2.awsapprunner.com/api/submit-quote
```

---

## Tech Stack

### Frontend
- **React 19.1** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Radix UI** for accessible components

### Backend
- **Node.js 22** with Express 5
- **jsforce** for Salesforce integration
- **Docker** for containerization

### Infrastructure
- **Frontend**: Vercel (Free tier)
- **Backend**: AWS App Runner (~$8-12/month)
- **Data**: Salesforce CRM

---

## Documentation

| Document | Purpose | Audience |
|----------|---------|----------|
| [README.md](./README.md) | This file - Quick start guide | Everyone |
| [CLIENT_HANDOFF.md](./CLIENT_HANDOFF.md) | Client operations guide | Clients |


---

## 🔧 Development

### Running Without Docker

**Backend**:
```bash
cd backend
npm install
npm start
# Runs on http://localhost:8080
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### Testing

```bash
# Backend tests
cd backend
npm test

# Frontend (manual testing)
cd frontend
npm run dev
# Test both Request Flow and Wizard Flow
```
---

## Deployment

### Deploy Backend to AWS

```bash
# Build and push to ECR
./ECRupload.sh

# Update App Runner service
# Go to AWS Console → App Runner → Deploy
```

### Deploy Frontend to Vercel

```bash
# Automatic deployment on push to main
git push origin main

# Or manual deployment
cd frontend
vercel --prod
```
---

## Troubleshooting

### Docker Issues

```bash
# Container won't start
docker-compose logs backend
docker-compose logs frontend

# Rebuild from scratch
make clean
make build
make up
```

### Backend Issues

**Salesforce Connection Fails**:
1. Verify credentials in `backend/.env`
2. Check security token is correct
3. Ensure `PASSWORD = YourPassword + SecurityToken` (no space)
4. Reset security token if needed

**Images Not Loading**:
1. Check `backend/images/` folder exists
2. Verify image files are present
3. Check file names match `cranes.json`

### Frontend Issues

**Can't Connect to Backend**:
1. Check `VITE_API_URL` in `frontend/.env`
2. Verify backend is running on port 8080
3. Check browser console for errors

**Blank Page**:
```bash
cd frontend
rm -rf node_modules dist
npm install
npm run dev
```

### Common Errors

| Error | Solution |
|-------|----------|
| `ECONNREFUSED` | Backend not running - run `make up` |
| `401 Unauthorized` | Invalid Salesforce credentials |
| `Cannot find module` | Run `npm install` |
| `Port already in use` | Stop other services using ports 5173 or 8080 |

---

## Security
### CORS Configuration

Allowed origins:
- `http://localhost:5173` (Development)
- `http://localhost:3000` (Docker)
- `https://crane-selector.vercel.app` (Production)
- `*.vercel.app` (Vercel previews)

---

## Features

### Request Flow

1. Customer browses all 12 available cranes
2. Views specifications (max load, height, radius)
3. Selects a crane
4. Fills out quote request form
5. Submits to Salesforce

**Best For**: Experienced contractors who know their requirements

### Wizard Flow

1. Customer answers 5 questions:
   - Project type
   - Weight requirements
   - Height requirements
   - Radius requirements
   - Work environment
2. Algorithm recommends top 3 cranes
3. Customer selects a crane
4. Fills out quote request form
5. Submits to Salesforce

**Best For**: First-time renters needing guidance

### Salesforce Integration

- Automatic quote submission
- Custom object: `Crane_Quote_Request__c`
- Captures: Customer info, crane selection, project details
- Quote status tracking
- Source tracking (Request vs Wizard)

---

## 🎓 Getting Started Checklist

### First Time Setup

- [ ] Docker Desktop installed
- [ ] Repository cloned
- [ ] Ran `make setup`
- [ ] Salesforce credentials configured
- [ ] Ran `make up`
- [ ] Accessed http://localhost:5173
- [ ] Submitted test quote
- [ ] Verified quote in Salesforce

### Ready for Production

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Backend deployed to AWS
- [ ] Frontend deployed to Vercel
- [ ] Production Salesforce connected
- [ ] Team trained on operations
- [ ] Documentation reviewed
- [ ] Monitoring configured

---

**Need Help?** Check [CLIENT_HANDOFF.md](./CLIENT_HANDOFF.md)

**Live Site**: https://crane-selector.vercel.app/