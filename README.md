# Favourite Books — Online Bookstore Demo

A full-stack bookstore application built for **SWE30003 Software Architectures and Design, Assignment 3 (Group 6)**. The project explores how a React frontend, FastAPI backend, domain models, and separate service layers can support a small shopping workflow.

**This is a coursework demonstration, not a live store. All included customer, staff, account, and order records are synthetic test fixtures. No real payments are processed.**

## Features

- Register and sign in as a customer using the demo account system.
- Browse and search the book catalogue.
- Add books to a cart and manage quantities.
- Complete a **simulated** card or PayPal checkout.
- View a generated receipt and shipment record.
- Use a staff dashboard to manage catalogue items and inspect sales summaries.

## Stack and structure

| Area | Technology |
| --- | --- |
| Frontend | React, Vite, React Router, Axios |
| Backend | Python, FastAPI, Pydantic |
| Persistence | Local JSON files in `backend/data/` |
| Design | API routes, service-layer business logic, domain models |

```text
backend/
  main.py        FastAPI application
  routes/        Auth, cart, catalogue, orders, staff API routes
  services/      Business logic and JSON persistence
  models/        Account, book, cart, order, payment, shipment models
  data/          Synthetic fixtures and locally modified records
frontend/
  src/pages/     Customer and staff screens
  src/context/   Frontend authentication state
  src/api/       API client
```

## Run locally

**Requirements:** Python 3.13+, a current Node.js version compatible with this repository's Vite dependency, and npm.

Clone:

```bash
git clone https://github.com/R1T-DEYE/favourite-books.git
cd favourite-books
```

### 1. Backend

From the repository root:

```bash
cd backend
python -m venv .venv
```

Activate the environment:

```bash
# Windows PowerShell
.venv\Scripts\Activate.ps1

# macOS / Linux (use this instead)
source .venv/bin/activate
```

Install dependencies and start the API:

```bash
python -m pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The backend is available at <http://localhost:8000/> and the generated API docs at <http://localhost:8000/docs>.

### 2. Frontend

Open a second terminal from the repository root:

```bash
cd frontend
npm ci
npm run dev
```

Visit <http://localhost:5173/>. The backend currently allows requests from that development origin.

### Demo accounts

The following **fictional test credentials** are pre-seeded in `backend/data/accounts.json`:

| Role | Email | Password |
| --- | --- | --- |
| Staff | `staff@favouritebooks.com` | `admin123` |
| Customer | `john@test.com` | `password123` |

You can also register another local demo customer.

## How checkout works

The UI collects a shipping address and demo card/PayPal fields, then calls the FastAPI order endpoint. The backend **simulates successful payment approval**; it does not contact a bank, PayPal, or payment provider. It creates an order, receipt, and shipment record in the application workflow and updates the local JSON store.

**Never enter genuine card numbers, CVVs, real addresses, or personal credentials.** Use made-up values only.

## Security and limitations

This project is intentionally a teaching prototype and **must not be deployed as a real public storefront without substantial security work**:

- Passwords are currently hashed using unsalted SHA-256 instead of a password-specific algorithm such as Argon2id or bcrypt.
- Login returns account data for frontend state; the app does not provide a production session/token and server-side authorization system.
- JSON files are not a transactional database and are unsuitable for multi-user concurrent writes.
- Payment fields are demonstration inputs only, and payment is always approved by the current backend.
- Test account passwords are intentionally published for local demonstration; never reuse them elsewhere.

The goal is to illustrate application structure and the core user journeys, **not to claim secure production authentication or payment handling**.

## Academic context

Built for a group university assignment. This README describes the shared product; it does not make unverified claims about individual team members' contributions.
