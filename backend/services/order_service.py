# services/order_service.py
import json
import uuid
import os
from datetime import datetime
from models.order import Order, OrderItem
from models.payment import Payment, InvoiceReceipt
from models.shipment import Shipment
from services.cart_service import get_cart, clear_cart
from services.catalogue_service import get_book_by_id, update_book

DATA_DIR = os.path.join(os.path.dirname(__file__), "../data")

def _load_json(filename: str) -> list:
    path = os.path.join(DATA_DIR, filename)
    with open(path, "r") as f:
        return json.load(f)

def _save_json(filename: str, data: list):
    path = os.path.join(DATA_DIR, filename)
    with open(path, "w") as f:
        json.dump(data, f, indent=2)

def checkout(customer_id: str, payment_method: str,
             shipping_address: str, payment_details: dict = None) -> dict:
    """
    Converts ShoppingCart into an Order, processes payment,
    generates InvoiceReceipt and Shipment on success.
    Corresponds to Scenario 3 - full checkout workflow.
    """
    cart = get_cart(customer_id)

    if not cart.items:
        raise ValueError("Cannot checkout with an empty cart.")

    # Validate stock for all items before creating order
    for item in cart.items:
        book = get_book_by_id(item.book_id)
        if book["stock"] < item.quantity:
            raise ValueError(
                f"Insufficient stock for '{item.title}'. "
                f"Only {book['stock']} available."
            )

    # Create Order from cart
    order_id = f"order_{uuid.uuid4().hex[:8]}"
    order_items = [
        OrderItem(
            book_id=item.book_id,
            title=item.title,
            quantity=item.quantity,
            unit_price=item.unit_price
        )
        for item in cart.items
    ]

    order = Order(
        order_id=order_id,
        customer_id=customer_id,
        items=order_items,
        status="pending",
        shipping_address=shipping_address,
        created_at=datetime.now().isoformat()
    )

    # Simulate payment gateway
    # In a real system this would call an external API
    payment_approved = True  # Simulated approval

    payment_id = f"pay_{uuid.uuid4().hex[:8]}"
    payment = Payment(
        payment_id=payment_id,
        order_id=order_id,
        amount=order.total,
        method=payment_method,
        status="approved" if payment_approved else "rejected",
        transaction_ref=f"TXN_{uuid.uuid4().hex[:6].upper()}"
    )

    if not payment_approved:
        order.status = "failed"
        orders = _load_json("orders.json")
        orders.append(order.to_dict())
        _save_json("orders.json", orders)
        return {"success": False, "message": "Payment rejected."}

    # Payment approved - update order status
    order.status = "paid"

    # Decrement stock for each book
    for item in order.items:
        book = get_book_by_id(item.book_id)
        update_book(item.book_id, {"stock": book["stock"] - item.quantity})

    # Generate InvoiceReceipt
    receipt = InvoiceReceipt(
        receipt_id=f"rec_{uuid.uuid4().hex[:8]}",
        order_id=order_id,
        customer_id=customer_id,
        payment_id=payment_id,
        total=order.total,
        issued_at=datetime.now().isoformat()
    )

    # Create Shipment
    shipment = Shipment(
        shipment_id=f"ship_{uuid.uuid4().hex[:8]}",
        order_id=order_id,
        customer_id=customer_id,
        address=shipping_address,
        status="preparing",
        created_at=datetime.now().isoformat()
    )

    # Persist everything
    orders = _load_json("orders.json")
    orders.append(order.to_dict())
    _save_json("orders.json", orders)

    # Clear the cart after successful checkout
    clear_cart(customer_id)

    return {
        "success": True,
        "order": order.to_dict(),
        "receipt": receipt.to_dict(),
        "shipment": shipment.to_dict(),
        "payment": payment.to_dict()
    }

def get_orders_by_customer(customer_id: str) -> list:
    orders = _load_json("orders.json")
    return [o for o in orders if o["customer_id"] == customer_id]

def get_all_orders() -> list:
    return _load_json("orders.json")