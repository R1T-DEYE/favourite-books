# routes/auth.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.auth_service import register_customer, login

router = APIRouter(prefix="/auth", tags=["auth"])

class RegisterRequest(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str
    address: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register")
def register(req: RegisterRequest):
    try:
        return register_customer(
            first_name=req.first_name,
            last_name=req.last_name,
            email=req.email,
            phone=req.phone,
            address=req.address,
            password=req.password
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
def login_user(req: LoginRequest):
    try:
        return login(email=req.email, password=req.password)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))