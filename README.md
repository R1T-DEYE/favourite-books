# Favourite Books Online Bookstore
SWE30003 Assignment 3 - Group 6

## Prerequisites
Make sure you have these installed before anything else:
- [Python 3.13+](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org/)
- [Git](https://git-scm.com/)

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
- **Scenario 1:** Customer registration and login
- **Scenario 2:** Browse catalogue and add books to cart
- **Scenario 3:** Checkout and payment
- **Scenario 4:** Staff catalogue management and sales report

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
