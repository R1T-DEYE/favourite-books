# models/order.py
from dataclasses import dataclass, field
from typing import List, Literal, Optional

@dataclass
class OrderItem:
    """
    Represents a single book entry within an order.
    Corresponds to the OrderItem class in the A2 design.
    Not the book itself - the book AS PART OF A SPECIFIC PURCHASE.
    """
    book_id: str
    title: str
    quantity: int
    unit_price: float

    @property
    def subtotal(self) -> float:
        return self.quantity * self.unit_price

    def to_dict(self) -> dict:
        return {
            "book_id": self.book_id,
            "title": self.title,
            "quantity": self.quantity,
            "unit_price": self.unit_price,
            "subtotal": self.subtotal
        }

    @staticmethod
    def from_dict(data: dict) -> "OrderItem":
        return OrderItem(
            book_id=data["book_id"],
            title=data["title"],
            quantity=data["quantity"],
            unit_price=data["unit_price"]
        )


@dataclass
class Order:
    """
    Represents a confirmed customer purchase.
    Corresponds to the Order class in the A2 design.
    Created from a ShoppingCart when customer proceeds to checkout.
    """
    order_id: str
    customer_id: str
    items: List[OrderItem]
    status: Literal["pending", "paid", "failed", "shipped"] = "pending"
    shipping_address: str = ""
    created_at: str = ""

    @property
    def total(self) -> float:
        return sum(item.subtotal for item in self.items)

    def to_dict(self) -> dict:
        return {
            "order_id": self.order_id,
            "customer_id": self.customer_id,
            "items": [item.to_dict() for item in self.items],
            "status": self.status,
            "shipping_address": self.shipping_address,
            "created_at": self.created_at,
            "total": self.total
        }

    @staticmethod
    def from_dict(data: dict) -> "Order":
        return Order(
            order_id=data["order_id"],
            customer_id=data["customer_id"],
            items=[OrderItem.from_dict(i) for i in data["items"]],
            status=data["status"],
            shipping_address=data["shipping_address"],
            created_at=data["created_at"]
        )