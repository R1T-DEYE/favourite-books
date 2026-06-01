# routes/orders.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.order_service import (
    checkout, get_orders_by_customer, get_all_orders
)

router = APIRouter(prefix="/orders", tags=["orders"])

class CheckoutRequest(BaseModel):
    customer_id: str
    payment_method: str
    shipping_address: str

@router.post("/checkout")
def place_order(req: CheckoutRequest):
    try:
        return checkout(
            customer_id=req.customer_id,
            payment_method=req.payment_method,
            shipping_address=req.shipping_address
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/customer/{customer_id}")
def customer_orders(customer_id: str):
    return get_orders_by_customer(customer_id)

@router.get("/")
def all_orders():
    return get_all_orders()