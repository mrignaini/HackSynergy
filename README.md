# SHRAMIKK — Digital Cooperative Labour Chowk

> **Turning informal work into a trusted, portable digital work identity.**

[![Hackathon](https://img.shields.io/badge/CODE%20BUILD%201.0-Round%202-blue)](#)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20TypeScript-61DAFB)](#)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933)](#)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%7C%20Neon-336791)](#)
[![ORM](https://img.shields.io/badge/ORM-Prisma-2D3748)](#)

---

## What is SHRAMIKK?

**SHRAMIKK** is a digital cooperative platform designed to connect local workers with households, contractors, and community service seekers through **skill + location-based matching**.

Unlike a conventional job-listing platform, SHRAMIKK focuses on what happens **after a worker gets a job**.

Every completed work opportunity can contribute to a worker's:

**Work Experience → Reputation → Payment Record → Digital Work Identity → Financial Visibility**

The goal is to transform fragmented informal work into a **persistent, trusted and portable digital work history**.

---

## The Problem

Millions of local and informal workers depend heavily on fragmented offline networks such as:

- Local labour chowks
- Word-of-mouth referrals
- Personal contacts
- Contractors
- Informal community networks

This creates several challenges:

### For Workers

- Difficult to consistently discover nearby opportunities
- Limited portable proof of previous work
- Reputation often remains offline
- Work and income records can become fragmented
- Previous experience may not automatically help with the next opportunity

### For Households & Hirers

- Difficult to identify suitable skilled workers
- Limited information before hiring
- Reliability and previous experience can be difficult to evaluate
- Hiring often depends on informal recommendations

### The Core Gap

Existing solutions may help people **find a job or service**, but SHRAMIKK focuses on creating a continuous loop where **completed work strengthens the worker's future digital identity**.

---

# Our Solution

SHRAMIKK creates a two-sided digital ecosystem connecting:

**WORKERS ↔ WORK ↔ HIRERS**

through:

- Skill-based discovery
- Location-aware opportunities
- Worker and hirer profiles
- Job posting
- Applications
- Hiring workflow
- Work lifecycle tracking
- Payment records
- Two-way ratings
- Digital Work Identity
- Financial visibility
- Worker assistance through AI Saathi / Safety Net functionality

---

# What Makes SHRAMIKK Different?

SHRAMIKK is not designed as just another job marketplace.

Its core innovation is the **Trust & Identity Layer**.

### Traditional Informal Work

```text
Find Work
   ↓
Complete Work
   ↓
Payment
   ↓
Next opportunity starts from zero


SHRAMIKK
Find Work
   ↓
Get Hired
   ↓
Complete Work
   ↓
Payment Record
   ↓
Rating
   ↓
Verified Work History
   ↓
Digital Work Identity
   ↓
Stronger Future Opportunities

Every completed job has the potential to strengthen the worker's digital profile.

  Core SHRAMIKK Loop
REGISTER
    ↓
POST / FIND WORK
    ↓
SKILL + LOCATION MATCH
    ↓
APPLY
    ↓
HIRE
    ↓
COMPLETE WORK
    ↓
PAYMENT RECORD
    ↓
TWO-WAY RATING
    ↓
DIGITAL WORK IDENTITY
    ↓
FINANCIAL VISIBILITY
  Worker Journey

A worker can:

Register on SHRAMIKK
Create a worker profile
Add skills and relevant information
Discover suitable local work opportunities
Apply for jobs
Get hired
Complete the assigned work
Maintain payment/work records
Receive ratings
Build a persistent Digital Work Identity
View financial/work history
  Hirer / Service Seeker Journey

A household, contractor, or service seeker can:

Register
Create a profile
Post a work requirement
Discover suitable workers
Review worker profiles
Consider skills and ratings
Receive applications
Hire a worker
Complete the work lifecycle
Record payment
Provide a rating
 Trust Model

Trust is one of the central design principles of SHRAMIKK.

             COMPLETED WORK
                   ↓
            WORK RECORD
                   ↓
                RATING
                   ↓
          STRONGER PROFILE
                   ↓
                TRUST
                   ↓
       BETTER FUTURE OPPORTUNITIES

This creates a continuous trust loop rather than treating every new job as an isolated transaction.

 Digital Work Identity

One of SHRAMIKK's key differentiators is the concept of a Digital Work Identity.

Instead of a worker's experience remaining scattered across:

different employers
phone contacts
verbal recommendations
paper records

SHRAMIKK aims to create a persistent digital representation of work experience.

The Digital Work Identity can connect:

Worker profile
Skills
Completed work
Ratings
Work history
Payment records

This gives the worker a more portable representation of their professional journey.

 Financial Visibility

SHRAMIKK also introduces a Financial Hub concept.

The platform can organize relevant work and payment information so workers can gain better visibility into their work-linked financial history.

The goal is not merely to facilitate a transaction, but to help create a structured record around work and earnings.

 AI Saathi / Worker Assistance

SHRAMIKK includes an AI-assisted worker support direction through AI Saathi / Safety Net functionality.

The objective is to make the platform more useful beyond job discovery by helping workers navigate relevant assistance and welfare-related information.

Any external government or financial integration is considered future scope unless explicitly implemented and connected in the deployed version.

 ## Key Features
Feature	Purpose
Worker Profiles	Represent skills and worker information
Hirer Profiles	Allow service seekers to create requirements
Job Posting	Create local work opportunities
Job Discovery	Discover relevant opportunities
Skill Matching	Connect opportunities with relevant skills
Location Matching	Improve local opportunity discovery
Applications	Workers can apply for jobs
Hiring	Hirers can select and hire workers
Work Lifecycle	Track work from hiring to completion
Payment Records	Maintain work-linked payment information
Two-Way Ratings	Build trust between workers and hirers
Digital Work Identity	Build a persistent work history
Financial Hub	Provide work/payment visibility
AI Saathi	Worker assistance and welfare discovery
Admin Layer	Support platform-level management
 System Architecture
┌───────────────────────────────────────┐
│          SHRAMIKK FRONTEND            │
│       React + TypeScript + Vite       │
│         Tailwind CSS Interface        │
└───────────────────┬───────────────────┘
                    │
                    │ REST API
                    ▼
┌───────────────────────────────────────┐
│              BACKEND                  │
│     Node.js + Express + TypeScript    │
│                                       │
│ Authentication                        │
│ Business Logic                        │
│ API Routes                            │
│ Authorization                          │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│                PRISMA                 │
│              ORM Layer                │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│        PostgreSQL / Neon Database     │
│                                       │
│ Users                                 │
│ Jobs                                  │
│ Applications                          │
│ Hiring                                │
│ Work Records                          │
│ Ratings                               │
│ Payments                              │
│ Digital Identity                      │
└───────────────────────────────────────┘
 ## Technology Stack
Frontend
React
TypeScript
Vite
Tailwind CSS
Responsive UI
Backend
Node.js
Express.js
TypeScript
REST API
Database
PostgreSQL
Neon PostgreSQL
ORM
Prisma
Development Tools
Git
GitHub
VS Code
npm

 ## Project Structure

The repository is organized around a separate frontend and backend architecture.

SHRAMIKK/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── ...
│
├── README.md
└── ...

The exact folder structure may vary slightly depending on the current repository version.

🔌 Core API / Backend Modules

The backend is designed around REST APIs supporting the major platform workflows.

Authentication

Handles user authentication and authorization.

Users & Profiles

Stores worker and hirer profile information.

Jobs

Supports creating and discovering work opportunities.

Applications

Allows workers to apply for available opportunities.

Hiring

Connects successful applications with the hiring workflow.

Work Lifecycle

Supports the transition from hiring to work completion.

Ratings

Supports two-way reputation building.

Payments / Financial Records

Stores relevant work-linked payment information.

Digital Work Identity

Builds a persistent representation of work experience.

Admin

Provides platform-level management functionality.

## Data Persistence

SHRAMIKK uses PostgreSQL with Prisma for persistent application data.

The architecture is designed so that important information is not dependent solely on temporary frontend state.

The persistence layer supports entities and workflows such as:

Users
  ↓
Profiles
  ↓
Jobs
  ↓
Applications
  ↓
Hiring
  ↓
Work
  ↓
Payments
  ↓
Ratings
  ↓
Digital Work Identity
 Security Practices

The project follows practical application security principles including:

Authentication and authorization
Role-based access where applicable
Server-side database access
Environment variables for secrets
Separation of frontend and backend responsibilities
Avoiding hard-coded credentials
Keeping sensitive configuration outside the repository

Never commit .env files, database passwords, API keys, access tokens, or other secrets to GitHub.

## Product Experience

SHRAMIKK is designed with local and mobile-first usage in mind.

The interface aims to reduce complexity for users who may not be highly familiar with digital platforms.

The product direction includes:

Simple onboarding
Clear user roles
Hindi-first / bilingual foundation
Simple job discovery
Straightforward application and hiring flow
Transparent work records
Easy access to identity and financial information
 Demo
Demo Video

https://youtu.be/Pm5t0v38RL8

Live Prototype

https://hack-synergy-git-main-hacksynergy.vercel.app/

 Getting Started
Prerequisites

Make sure the following are installed:

Node.js
npm
Git
PostgreSQL / access to a PostgreSQL-compatible database
1. Clone the Repository
git clone YOUR_GITHUB_REPOSITORY_URL
cd SHRAMIKK
2. Frontend Setup
cd frontend
npm install

Create the required environment configuration according to the project's frontend configuration.

Then run:

npm run dev

The frontend development server will start locally.

3. Backend Setup

Open a new terminal:

cd backend
npm install

Create a .env file using the environment variables required by the backend.

Example structure:

DATABASE_URL=your_database_connection_string
PORT=5000

Do not commit the real database URL or other secrets.

4. Database Setup

After configuring the database connection:

npx prisma generate

Run migrations if required:

npx prisma migrate dev

If the project contains seed data:

npx prisma db seed
5. Start Backend
npm run dev

The backend will run on the configured local port.

  Recommended Demo Flow

For evaluating the project, the recommended demonstration sequence is:

1. Open SHRAMIKK
        ↓
2. Register / Login
        ↓
3. Create Worker or Hirer Profile
        ↓
4. Find / Post Work
        ↓
5. Skill + Location Matching
        ↓
6. Apply
        ↓
7. Hire
        ↓
8. Complete Work
        ↓
9. Record Payment
        ↓
10. Rating
        ↓
11. Digital Work Identity
        ↓
12. Financial Hub
        ↓
13. AI Saathi / Safety Net

This demonstrates the complete value chain rather than showing isolated screens.

 ## Why SHRAMIKK?

SHRAMIKK focuses on a simple but important idea:

A worker should not have to start from zero every time they look for work.

A completed job should have the potential to become part of a worker's long-term digital work journey.

SHRAMIKK therefore combines:

LOCAL WORK DISCOVERY

TRUST & REPUTATION

WORK HISTORY

PAYMENT VISIBILITY

DIGITAL WORK IDENTITY

into one ecosystem.

 Future Scope

The current platform provides the foundation for a larger ecosystem.

Potential future development includes:

1. Advanced Matching

More intelligent skill, location, availability and requirement matching.

2. Multilingual Expansion

Support for more Indian languages to improve accessibility.

3. Stronger Verification

Enhanced worker and service verification mechanisms.

4. Skill Credentials

Integration of verified skill certifications and training records.

5. Production Mobile Application

Further optimization for low-cost smartphones and low-bandwidth environments.

6. City-Level Expansion

Expansion from local communities to larger city-wide worker networks.

7. Financial Ecosystem

Potential integrations with appropriate financial services and formal financial infrastructure.

8. Welfare Ecosystem

Potential integration with relevant government and welfare schemes where technically and legally appropriate.

9. Community Cooperative Model

Expansion toward community-owned and cooperative participation models.

 Scalability Vision
LOCAL COMMUNITY
      ↓
CITY-LEVEL NETWORK
      ↓
MULTI-CITY NETWORK
      ↓
LARGE-SCALE COOPERATIVE ECOSYSTEM

The modular REST API architecture and PostgreSQL-backed persistence provide a foundation for future scaling.

## Impact
For Workers
Easier access to local opportunities
Persistent work history
Portable reputation
Better visibility of work-linked records
Digital representation of skills and experience
For Hirers
Easier worker discovery
Skill-based search
Location-aware opportunities
Better information before hiring
Ratings and work history for trust
For Communities
Digitalization of local service networks
Improved visibility of informal work
Stronger local economic participation
Foundation for cooperative digital infrastructure
 The Bigger Vision

SHRAMIKK is built around a broader principle:

INFORMAL WORK
      ↓
DIGITAL RECORD
      ↓
TRUST
      ↓
IDENTITY
      ↓
VISIBILITY
      ↓
OPPORTUNITY

The long-term vision is to help transform informal work from a series of disconnected transactions into a continuous digital work journey.



Features, integrations, verification mechanisms and ecosystem partnerships described under Future Scope are proposed directions and should not be interpreted as currently deployed integrations unless explicitly demonstrated in the project.

 Built for Real-World Impact

SHRAMIKK

Find Work. Build Trust. Create Identity.

Every completed job can be more than a payment — it can become part of a worker's digital future.


-  https://youtu.be/Pm5t0v38RL8
- `https://hack-synergy-git-main-hacksynergy.vercel.app/
- `[VM Sync / Vishal Raj, Mrig Naini Mudgal /IPEC GZB]`

https://github.com/mrignaini/Shramikk