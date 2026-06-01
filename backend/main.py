# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.catalogue import router as catalogue_router
from routes.cart import router as cart_router
from routes.orders import router as orders_router
from routes.staff import router as staff_router

app = FastAPI(title="Favourite Books API")

# Allow React frontend to talk to the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(catalogue_router)
app.include_router(cart_router)
app.include_router(orders_router)
app.include_router(staff_router)

@app.get("/")
def root():
    return {"message": "Favourite Books API is running."}