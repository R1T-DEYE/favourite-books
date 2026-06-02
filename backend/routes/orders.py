# routes/orders.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict
from services.order_service import (
    checkout, get_orders_by_customer, get_all_orders
)

router = APIRouter(prefix="/orders", tags=["orders"])

class CheckoutRequest(BaseModel):
    customer_id: str
    payment_method: str
    shipping_address: str
    payment_details: Optional[Dict[str, str]] = None  # Accepts the dynamic card or PayPal fields

@router.post("/checkout")
def place_order(req: CheckoutRequest):
    try:
        # Pass the payment_details into the service layer
        return checkout(
            customer_id=req.customer_id,
            payment_method=req.payment_method,
            shipping_address=req.shipping_address,
            payment_details=req.payment_details  
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/customer/{customer_id}")
def customer_orders(customer_id: str):
    return get_orders_by_customer(customer_id)

@router.get("/")
def all_orders():
    return get_all_orders()