# models/cart.py
from dataclasses import dataclass, field
from typing import List

@dataclass
class CartItem:
    """
    Temporary item in a shopping cart.
    Simpler than OrderItem - no pricing snapshot yet.
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
    def from_dict(data: dict) -> "CartItem":
        return CartItem(**data)


@dataclass
class ShoppingCart:
    """
    Temporary collection of books selected by a customer.
    Corresponds to the ShoppingCart class in the A2 design.
    Lives only for the duration of a session - converted to
    an Order at checkout.
    """
    customer_id: str
    items: List[CartItem] = field(default_factory=list)

    @property
    def total(self) -> float:
        return sum(item.subtotal for item in self.items)

    def add_item(self, item: CartItem):
        for existing in self.items:
            if existing.book_id == item.book_id:
                existing.quantity += item.quantity
                return
        self.items.append(item)

    def remove_item(self, book_id: str):
        self.items = [i for i in self.items if i.book_id != book_id]

    def clear(self):
        self.items = []

    def to_dict(self) -> dict:
        return {
            "customer_id": self.customer_id,
            "items": [item.to_dict() for item in self.items],
            "total": self.total
        }

    @staticmethod
    def from_dict(data: dict) -> "ShoppingCart":
        return ShoppingCart(
            customer_id=data["customer_id"],
            items=[CartItem.from_dict(i) for i in data.get("items", [])]
        )