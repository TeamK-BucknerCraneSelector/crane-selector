# Client Handoff Documentation

> Complete guide for Buckner Heavy Lift Cranes to maintain and operate the Crane Selector application

---

## 📋 Table of Contents

- [Application Overview](#application-overview)
- [What You're Getting](#what-youre-getting)
- [How to Access](#how-to-access)
- [Daily Operations](#daily-operations)
- [Managing Quotes](#managing-quotes)
- [Updating Content](#updating-content)
- [Troubleshooting](#troubleshooting)
- [Costs & Billing](#costs--billing)
- [Support & Maintenance](#support--maintenance)

---

## Application Overview

### What It Does

The Crane Selector helps your customers find and request quotes for the right crane in two ways:

**1. Request Flow** (For experienced customers)
- Browse all 12 available cranes
- View specifications (load, height, radius)
- Select a crane and request a quote
- **Best for**: Contractors who know what they need

**2. Wizard Flow** (For new customers)
- Answer 5 simple questions about their project
- Get 3 personalized crane recommendations
- Select a recommended crane and request a quote
- **Best for**: First-time renters needing guidance

### What Happens to Quotes

All quote requests automatically go to your **Salesforce sandbox** as "Crane Quote Request" records. Your team can then:
- View customer contact information
- See project details
- Follow up with pricing
- Track quote status (New → Contacted → Quoted → Won/Lost)

---

## What You're Getting

### 1. Live Application

**Production Website**: https://crane-selector.vercel.app/

This is live and ready for customers to use right now.

### 2. Code Repository

**GitHub**: https://github.com/TeamK-BucknerCraneSelector/crane-selector

This contains all the source code for the application.

### 3. AWS Infrastructure

- **Backend API**: Running on AWS App Runner
- **Image Storage**: Stored in Docker container
- **Access**: You have the AWS account credentials

### 4. Salesforce Integration

- **Sandbox Environment**: Currently connected to your test Salesforce
- **Custom Object**: `Crane_Quote_Request__c` (already created)
- **Ready for Production**: Can easily switch to production Salesforce

### 5. Documentation

All documentation is in the GitHub repository:
- `README.md` - How to run and develop
- `DEPLOYMENT.md` - How to deploy updates
- `CLIENT_HANDOFF.md` - This document

---

## How to Access

### Customer-Facing Website

**URL**: https://crane-selector.vercel.app/

Anyone can access this - it's your public website.

### Salesforce (To View Quotes)

1. Go to https://test.salesforce.com
2. Log in with your credentials
3. Click the App Launcher (⋮⋮⋮ grid icon)
4. Search for "Crane Quote Request"
5. View all submitted quotes

### AWS Console (Backend Management)

1. Go to https://console.aws.amazon.com/
2. Log in with AWS credentials
3. Region: **US East (Ohio) / us-east-2**
4. Service: **App Runner**
5. Service name: `crane-finder-backend`

### Vercel (Frontend Management)

1. Go to https://vercel.com/
2. Log in with GitHub account
3. Project: `crane-selector`
4. View deployments and logs

### GitHub (Code)

1. Go to https://github.com/TeamK-BucknerCraneSelector/crane-selector
2. Log in with GitHub account
3. View all source code

---

## Daily Operations

### Checking for New Quotes

**Option 1: Salesforce Dashboard** (Recommended)

1. Log into Salesforce
2. Open "Crane Quote Request" app
3. View list of all quotes
4. Filter by "Quote Status" = "New"
5. Follow up with customers

**Option 2: Salesforce Reports**

You can create custom reports to:
- See daily quote volume
- Track conversion rates
- Monitor popular cranes
- Analyze by source (Request vs Wizard)

### Typical Daily Workflow

```
Morning:
1. Log into Salesforce
2. Check for new quotes (Status = "New")
3. Review customer details and requirements

Follow-up:
4. Contact customers via email/phone
5. Provide pricing and availability
6. Update quote status to "Contacted"

Closing:
7. Send formal quotes
8. Update status to "Quoted"
9. Mark as "Won" or "Lost" when resolved
```

---

## Managing Quotes

### Quote Fields Explained

When a customer submits a quote, you'll see:

| Field | What It Contains | Example |
|-------|------------------|---------|
| **Name** | Auto-generated quote number | QR-00001 |
| **Crane Model** | Which crane they selected | LIEBHERR LTR 1100 |
| **Customer Name** | Their full name | John Smith |
| **Email** | Contact email | john@construction.com |
| **Phone** | Contact phone | (919) 555-1234 |
| **Company** | Company name (optional) | ABC Construction |
| **Project Details** | What they wrote about their project | Need crane for 3-story building |
| **Quote Status** | Current status | New |
| **Source Flow** | How they found the crane | Request Flow or Wizard Flow |
| **Created Date** | When submitted | 1/15/2025 10:30 AM |

### Updating Quote Status

1. Open the quote in Salesforce
2. Click **Edit**
3. Change "Quote Status" to:
   - **New** - Just submitted
   - **Contacted** - You've reached out
   - **Quoted** - You've sent pricing
   - **Won** - Customer accepted
   - **Lost** - Customer declined
4. Click **Save**

---

## Updating Content

### Adding or Removing Cranes

**Important**: This requires a code change and redeployment.

**Steps**:
1. Contact your development team or:
2. Edit `backend/cranes.json` in GitHub
3. Add/remove/edit crane objects
4. Redeploy backend (see DEPLOYMENT.md)

**Crane Object Format**:
```json
{
  "model": "LIEBHERR LTR 1100",
  "max_load": 110,
  "max_height": 272,
  "max_radius": 195,
  "image_path": "images/LTR1100.jpg"
}
```

### Updating Crane Images

1. Prepare new image (JPEG or PNG)
2. Name it exactly like the crane model
3. Add to `backend/images/` folder
4. Redeploy backend

**Image Requirements**:
- Format: JPEG or PNG
- Recommended size: 400x300 pixels
- File naming: Match the model name (e.g., `LTR1100.jpg`)

### Changing Text/Copy

Most text is in the frontend React components. You'll need:
1. Developer access to GitHub
2. Edit files in `frontend/src/components/`
3. Redeploy frontend

**Common text locations**:
- Homepage: `frontend/src/components/Home/Home.tsx`
- Request Flow: `frontend/src/components/Request/RequestFlow.tsx`
- Wizard: `frontend/src/components/Wizard/`

---

## Troubleshooting

### Website is Down

**Check 1: Frontend (Vercel)**
1. Go to https://vercel.com/
2. Check if deployment failed
3. View error logs
4. Rollback to previous version if needed

**Check 2: Backend (AWS App Runner)**
1. Go to AWS Console → App Runner
2. Check service status
3. View application logs
4. Restart service if needed

**Check 3: Salesforce**
1. Log into Salesforce
2. Verify API is accessible
3. Check user permissions

### Quotes Not Appearing in Salesforce

**Possible Causes**:

1. **Wrong Salesforce Environment**
   - Check backend is pointing to correct Salesforce URL
   - Sandbox: `https://test.salesforce.com`
   - Production: `https://login.salesforce.com`

2. **Expired Security Token**
   - Reset security token in Salesforce
   - Update backend environment variable
   - Redeploy backend

3. **API Limits Reached**
   - Salesforce has daily API limits
   - Check usage in Salesforce Setup
   - Resets at midnight

4. **Permission Issues**
   - Verify Salesforce user has API access
   - Check object permissions

### Images Not Loading

1. Check backend service is running
2. Verify images exist in `backend/images/` folder
3. Check image file names match `cranes.json`
4. Check browser console for 404 errors

### Customer Can't Submit Quote

1. Check all required fields are filled
2. Verify email format is valid
3. Check backend logs for errors
4. Test quote submission yourself
5. Check Salesforce is accessible

---

## Switching to Production Salesforce

Currently connected to **Sandbox**. When ready for production:

### Steps to Switch

1. **Get Production Credentials**
   - Production username
   - Production password + security token
   - Production Connected App credentials

2. **Update Backend Environment Variables**
   - In AWS App Runner console
   - Change `LOGIN_URL` to `https://login.salesforce.com`
   - Update `USERNAME` to production username
   - Update `PASSWORD` to production password+token
   - Update `SF_CLIENT_ID` and `SF_CLIENT_SECRET`

3. **Verify Custom Object**
   - Ensure `Crane_Quote_Request__c` exists in production
   - Check all fields are created
   - Verify permissions

4. **Test**
   - Submit a test quote
   - Verify it appears in production Salesforce
   - Delete test record

5. **Deploy**
   - Redeploy backend with new credentials
   - Monitor for 24 hours
   - Verify quotes are flowing correctly

---

## Quick Reference

### Important URLs

| What | URL |
|------|-----|
| **Customer Website** | https://crane-selector.vercel.app/ |
| **Salesforce Login** | https://test.salesforce.com |
| **AWS Console** | https://console.aws.amazon.com/ |
| **Vercel Dashboard** | https://vercel.com/ |
| **GitHub Code** | https://github.com/TeamK-BucknerCraneSelector/crane-selector |

---

## Training Checklist

Before considering the handoff complete, ensure your team can:

- [ ] Access the customer-facing website
- [ ] Log into Salesforce and find quotes
- [ ] View quote details and customer information
- [ ] Update quote status (New → Contacted → Quoted → Won/Lost)
- [ ] Access AWS Console and view backend logs
- [ ] Access Vercel and view frontend deployments
- [ ] Access GitHub repository
- [ ] Submit a test quote through the website
- [ ] Verify test quote appears in Salesforce
- [ ] Know who to contact for different issues
- [ ] Understand monthly costs
- [ ] Know how to switch to production Salesforce

---