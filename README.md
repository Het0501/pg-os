# PG OS — Property & PG Operations Management System

> A modern property/PG operations management prototype for managing properties, rooms & beds, tenants, rent, expenses, maintenance, vacancies, leads, onboarding, public listings, reports, and operational workflows from one dashboard.

## 📌 Project Overview

**PG OS** centralizes the day-to-day operations of a Paying Guest / property business into one application.

The project evolved incrementally from the core property-management foundation into a broader operational prototype covering:

- Property management
- Rooms & beds management
- Tenant management
- Rent & payment tracking
- Expense tracking
- Maintenance management
- Vacancy management
- Lead CRM
- Tenant onboarding
- Public property listings
- Website enquiries connected to CRM
- Financial dashboard and reports
- Global search
- Notifications
- Role-aware demo navigation
- Responsive/mobile layouts

> **Current status:** Working product/UI/workflow prototype. It is not yet a complete production SaaS backend.

---

## 🎯 Goals

PG OS is built around the idea:

> **Everything required to operate a PG should have a place inside one system.**

The prototype focuses on:

1. Centralized operational data
2. Simple workflows for property operators
3. Connected property → room → bed → tenant relationships
4. Connected listing enquiry → lead → onboarding → tenant workflows
5. Financial visibility
6. Vacancy visibility
7. Maintenance tracking
8. Modern responsive UX

---

# ✨ Features

## 🏢 Properties

- Property listing
- Property cards
- Property details
- Property-level summaries
- Occupancy information
- Room/bed relationships
- Property navigation

## 🛏️ Rooms & Beds

- Room management
- Room details
- Bed management
- Bed availability
- Bed assignment
- Vacancy-aware room/bed state
- Room search
- Bed search

## 👤 Tenants

- Tenant listing
- Tenant details
- Tenant creation/editing
- Tenant navigation
- Tenant/property/room relationships
- Connected admission workflow

## 💰 Rent & Payments

- Rent management
- Payment recording
- Payment status
- Rent visibility
- Tenant-level rent information

## 💸 Expenses

- Expense management
- Expense creation
- Expense categories
- Expense records
- Financial visibility

## 🔧 Maintenance

- Maintenance tracking
- Maintenance records
- Operational status
- Maintenance management interface

## 🟢 Vacancies

- Vacancy management
- Available bed visibility
- Property/room vacancy information
- Vacancy-aware workflows

## 📈 Dashboard & Financials

The dashboard acts as the operational command center and includes:

- Property overview
- Occupancy information
- Tenant information
- Rent information
- Expense information
- Vacancy information
- Maintenance information
- Financial charts
- Operational summaries

## 🎯 Lead CRM

Leads can originate from:

- Internal/manual lead creation
- Public property listings
- Website enquiries

Workflow:

```text
Public Listing
      ↓
Listing Detail
      ↓
Website Enquiry
      ↓
Lead CRM
      ↓
Lead Management
      ↓
Onboarding
      ↓
Bed Assignment
      ↓
Tenant Admission
```

## 📝 Tenant Onboarding

```text
Lead
  ↓
Onboarding Application
  ↓
Review
  ↓
Approval
  ↓
Bed Assignment
  ↓
Tenant Admission
```

The prototype uses a shared admission workflow so onboarding and vacancy/bed state remain connected.

## 🌐 Public Listings

Users can:

- Browse available listings
- Search/filter listings
- Open listing details
- View property information
- Submit an enquiry
- Create a connected CRM lead

Listing data is derived from operational property/room/bed state.

## 🔎 Global Search

Shared search supports operational entities such as:

- Properties
- Rooms
- Beds
- Tenants

Search results navigate to relevant destinations.

## 🔔 Notifications

The prototype includes:

- Notification display
- Individual read state
- Mark-all-as-read behavior
- Operational notification information

## 👥 Demo Role-Aware Navigation

The prototype includes demo role handling for different operational contexts:

- Role selection
- Role-specific module visibility
- Workspace context
- Navigation restrictions

## 📊 Reports

The project includes reports and financial reporting utilities.

---

# 🎨 UI / UX

The interface has been progressively polished into a modern light operational dashboard.

Design direction:

- Clean light surfaces
- Strong typography hierarchy
- Soft borders
- Controlled shadows
- Rounded cards
- Clear status indicators
- Responsive layouts
- Consistent spacing
- Shared UI primitives
- Operational dashboard aesthetics
- Mobile-friendly navigation

Shared design tokens and reusable components are preferred over page-by-page visual patches.

---

# 🧱 Technology Stack

### Frontend

- **Next.js 16.3.3**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui-style components**
- **Recharts**
- **SWR**
- **date-fns**
- **Lucide icon system**

### Development

- Node.js
- npm
- Git
- GitHub

---

# 📁 Project Structure

```text
PG-OS-v1.0-FINAL-PROTOTYPE/
│
├── app/
│   ├── (auth)/
│   │   └── login/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── expenses/
│   │   ├── leads/
│   │   ├── maintenance/
│   │   ├── onboarding/
│   │   ├── properties/
│   │   ├── rent/
│   │   ├── reports/
│   │   ├── rooms/
│   │   ├── tenants/
│   │   └── vacancies/
│   ├── listings/
│   │   └── [id]/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── expenses/
│   ├── layout/
│   ├── leads/
│   ├── listings/
│   ├── operations/
│   ├── properties/
│   ├── rent/
│   ├── rooms/
│   ├── tenants/
│   └── ui/
│
├── lib/
│   ├── demo-role.ts
│   ├── expenses.ts
│   ├── financials.ts
│   ├── global-search.ts
│   ├── leads.ts
│   ├── listings.ts
│   ├── maintenance.ts
│   ├── notifications.ts
│   ├── properties.ts
│   ├── prototype-store.ts
│   ├── rent.ts
│   ├── report-export.ts
│   ├── rooms.ts
│   ├── tenants.ts
│   ├── utils.ts
│   └── vacancies.ts
│
├── public/
├── components.json
├── next.config.mjs
├── package.json
├── package-lock.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.mjs
├── tsconfig.json
└── .gitignore
```

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/Het0501/pg-os.git
```

Then:

```bash
cd pg-os
```

## 2. Install dependencies

```bash
npm install
```

The repository contains `package-lock.json`, so npm is the recommended package manager.

## 3. Start development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🏗️ Production Build

Create a production build:

```bash
npm run build
```

Then start it:

```bash
npm start
```

### Important

Use:

```bash
npm run build
```

**Not:**

```bash
npm build
```

`npm start` requires a successful `.next` production build.

---

# 🧪 Validation

TypeScript:

```bash
npx tsc --noEmit
```

Production build:

```bash
npm run build
```

Production server:

```bash
npm start
```

---

# 🔄 Development Workflow

```text
Clone repository
      ↓
npm install
      ↓
npm run dev
      ↓
Develop
      ↓
npx tsc --noEmit
      ↓
npm run build
      ↓
npm start
      ↓
Test
      ↓
git status
      ↓
git add .
      ↓
git commit
      ↓
git push
```

---

# 🌿 Git Workflow

Check changes:

```bash
git status
```

Stage:

```bash
git add .
```

Commit:

```bash
git commit -m "Describe your change"
```

Push:

```bash
git push origin main
```

Before starting new work:

```bash
git pull origin main
```

For larger features:

```bash
git checkout -b feature/feature-name
```

Example:

```bash
git checkout -b feature/maintenance-improvements
```

Push the branch:

```bash
git push -u origin feature/maintenance-improvements
```

Then create a Pull Request on GitHub.

---

# 👨‍💻 Collaborating With a Friend

After giving the collaborator access to the GitHub repository, they can run:

```bash
git clone https://github.com/Het0501/pg-os.git
cd pg-os
npm install
npm run dev
```

Recommended workflow:

```bash
git pull origin main
```

Make changes, then:

```bash
git add .
git commit -m "Describe changes"
git push origin main
```

For larger changes, use a feature branch and Pull Request.

---

# 🔐 Environment Variables

If future integrations require secrets, use:

```text
.env.local
```

Never commit:

- API keys
- Database passwords
- Authentication secrets
- Private credentials
- Production secrets

Keep local environment files in `.gitignore`.

---

# 🗃️ Architecture

The current prototype is primarily a frontend/local-state prototype.

Simplified architecture:

```text
Next.js App Router
        │
        ├── Pages / Routes
        │
        ├── Shared Components
        │
        ├── UI Primitives
        │
        └── Shared Prototype Store
                 │
                 ├── Properties
                 ├── Rooms
                 ├── Beds
                 ├── Tenants
                 ├── Rent
                 ├── Expenses
                 ├── Maintenance
                 ├── Vacancies
                 ├── Leads
                 ├── Onboarding
                 ├── Listings
                 └── Notifications
```

---

# 🔗 Connected Workflows

## Property → Room → Bed

```text
Property
   ↓
Rooms
   ↓
Beds
   ↓
Availability
```

## Bed → Tenant

```text
Available Bed
      ↓
Assignment
      ↓
Tenant
      ↓
Occupied Bed
```

## Website → CRM

```text
Public Listing
      ↓
Enquiry Form
      ↓
Lead
      ↓
CRM
```

## CRM → Onboarding → Tenant

```text
Lead
 ↓
Onboarding
 ↓
Approval
 ↓
Bed Assignment
 ↓
Tenant Admission
```

## Vacancy → Listing

```text
Available Bed
      ↓
Vacancy State
      ↓
Public Listing
      ↓
Website Enquiry
```

---

# 📱 Responsive Design

The application is designed for:

- Desktop
- Laptop
- Tablet
- Mobile

Mobile support includes:

- Responsive layouts
- Mobile navigation
- Collapsible navigation
- Responsive listing views
- Mobile-friendly forms
- Mobile property details
- Mobile public listings

---

# 🧭 Main Routes

```text
/
/login

/dashboard
/properties
/properties/[id]
/rooms
/tenants
/rent
/expenses
/maintenance
/vacancies
/leads
/onboarding
/reports

/listings
/listings/[id]
```

---

# 🛠️ Future Production Evolution

The current project is a frontend/product prototype. A production SaaS version can introduce:

### Backend

- REST/GraphQL API
- Authentication
- Role-based access control
- Server-side validation
- PostgreSQL
- Transactions
- Audit logging

### Payments

- UPI
- Payment gateway integration
- Payment reconciliation
- Automated rent reminders
- Receipts

### Infrastructure

- Production deployment
- Database backups
- Monitoring
- Error tracking
- CI/CD
- Secure environment configuration

### Security

- Secure authentication
- Session management
- Authorization
- Input validation
- Rate limiting
- Audit trails
- Secret management

---

# ⚠️ Prototype Status

This repository represents a **working product prototype** demonstrating the operational UX and connected workflows.

It should not yet be treated as a fully deployed production SaaS system. Production backend infrastructure, persistent database architecture, authentication hardening, payment integrations, monitoring, and other deployment requirements can be added in later stages.

---

# 🤝 Collaboration

Recommended areas for future contributors:

- Frontend / UI
- Backend/API
- Database
- Authentication & authorization
- Payments
- Infrastructure
- Testing
- Product/design

Suggested commit prefixes:

```text
feat: add tenant onboarding flow
fix: correct vacancy status
ui: polish property cards
feat: add maintenance workflow
fix: connect listing enquiry to CRM
refactor: simplify shared store
```

---

# 👤 Project Owner

**Het Prajapati**

Project: **PG OS**

Repository:

```text
https://github.com/Het0501/pg-os
```

---

# 📌 Quick Start

```bash
git clone https://github.com/Het0501/pg-os.git
cd pg-os
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

For production testing:

```bash
npm run build
npm start
```

---

## 🚀 PG OS

**One system for running the entire PG operation.**
