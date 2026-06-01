# routes/cart.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.cart_service import (
    get_cart_dict, add_to_cart,
    remove_from_cart, clear_cart
)

router = APIRouter(prefix="/cart", tags=["cart"])

class AddToCartRequest(BaseModel):
    customer_id: str
    book_id: str
    quantity: int

@router.get("/{customer_id}")
def get_cart(customer_id: str):
    return get_cart_dict(customer_id)

@router.post("/add")
def add_item(req: AddToCartRequest):
    try:
        return add_to_cart(req.customer_id, req.book_id, req.quantity)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{customer_id}/{book_id}")
def remove_item(customer_id: str, book_id: str):
    try:
        return remove_from_cart(customer_id, book_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{customer_id}")
def clear_customer_cart(customer_id: str):
    clear_cart(customer_id)
    return {"message": "Cart cleared."}