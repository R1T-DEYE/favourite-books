# models/book.py
from dataclasses import dataclass
from typing import Optional

@dataclass
class Book:
    """
    Represents a book available in the online bookstore.
    Corresponds to the Book class in the A2 design.
    """
    book_id: str
    title: str
    author: str
    genre: str
    category: str
    price: float
    stock: int
    description: Optional[str] = ""

    def is_in_stock(self, quantity: int = 1) -> bool:
        return self.stock >= quantity

    def decrement_stock(self, quantity: int):
        if not self.is_in_stock(quantity):
            raise ValueError(f"Insufficient stock for '{self.title}'")
        self.stock -= quantity

    def to_dict(self) -> dict:
        return {
            "book_id": self.book_id,
            "title": self.title,
            "author": self.author,
            "genre": self.genre,
            "category": self.category,
            "price": self.price,
            "stock": self.stock,
            "description": self.description
        }

    @staticmethod
    def from_dict(data: dict) -> "Book":
        return Book(**data)