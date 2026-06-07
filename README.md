# Favourite Books Online Bookstore
A web-based bookstore application built for SWE30003 Assignment 3 (Group 6).

The system supports customer registration and login, catalogue browsing and cart management, checkout and payment processing, and a staff dashboard for catalogue management and sales reporting.

Built with Python FastAPI (backend) and React + Vite (frontend).

## Prerequisites
Make sure you have these installed before anything else:
- [Python 3.13+](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org/)
- [Git](https://git-scm.com/)

## Test Accounts
A default staff account is pre-seeded in `backend/data/accounts.json`
since there is no staff registration flow.

| Role     | Email                    | Password    |
|----------|--------------------------|-------------|
| Staff    | staff@favouritebooks.com | admin123    |
| Customer | john@test.com            | password123 |

For customer testing, you can also register a new account through the app normally.


## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/R1T-DEYE/favourite-books.git
cd favourite-books
```

### 2. Set up the backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install fastapi uvicorn python-multipart
```

### 3. Set up the frontend
```bash
cd ../frontend
npm install
```

## Running the App

You need **two terminals open at the same time**.

**Terminal 1 - Backend:**
```bash
cd C:\dev\favourite-books\backend
.venv\Scripts\activate
uvicorn main:app --reload
```
Backend runs at: http://localhost:8000

**Terminal 2 - Frontend:**
```bash
cd C:\dev\favourite-books\frontend
npm run dev
```
Frontend runs at: http://localhost:5173

## Project Structure
```text
favourite-books/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── models/              # Data classes (Book, Order, Customer etc.)
│   ├── routes/              # API endpoint handlers
│   ├── services/            # Business logic
│   └── data/                # JSON files for persistent storage
├── frontend/
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── pages/           # Full page views
│       ├── context/         # Auth state management
│       └── api/             # Axios API client
└── README.md
```

## Troubleshooting

**`.venv\Scripts\activate` not working?**
Run this first in PowerShell:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Port already in use?**
Change the backend port:
```bash
uvicorn main:app --reload --port 8001
```

**`npm install` failing?**
Make sure you're inside the `frontend` folder, not the root.

## Scenarios to Implement
## Implemented Features
- **Scenario 1:** Customer registration with email validation and secure login
- **Scenario 2:** Browse and search the book catalogue, manage shopping cart
- **Scenario 3:** Checkout with card or PayPal payment, order confirmation with receipt and shipment details
- **Scenario 4:** Staff dashboard for catalogue management (add, edit, delete books) and date-range sales reporting

## Tech Stack
- **Frontend:** React + Vite
- **Backend:** Python FastAPI
- **Storage:** JSON files (no database required)
- **API Communication:** Axios

## Notes
- Do NOT push the `.venv` folder or `node_modules` - these are in `.gitignore`
- Always activate the virtual environment before running the backend
- If you add a new Python package, run `pip freeze > requirements.txt` and commit it
- If you add a new npm package, the `package.json` updates automatically - just commit that
