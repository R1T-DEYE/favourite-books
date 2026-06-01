# services/catalogue_service.py
import json
import uuid
import os
from models.book import Book

DATA_DIR = os.path.join(os.path.dirname(__file__), "../data")

def _load_books() -> list:
    path = os.path.join(DATA_DIR, "books.json")
    with open(path, "r") as f:
        return json.load(f)

def _save_books(books: list):
    path = os.path.join(DATA_DIR, "books.json")
    with open(path, "w") as f:
        json.dump(books, f, indent=2)

def get_all_books() -> list:
    """Returns all books in the catalogue."""
    return _load_books()

def search_books(query: str) -> list:
    """
    Searches books by title, author, genre or category.
    Corresponds to Scenario 2 - Customer browses catalogue.
    Case-insensitive partial match.
    """
    query = query.lower()
    books = _load_books()
    return [
        b for b in books
        if query in b["title"].lower()
        or query in b["author"].lower()
        or query in b["genre"].lower()
        or query in b["category"].lower()
    ]

def get_book_by_id(book_id: str) -> dict:
    books = _load_books()
    for book in books:
        if book["book_id"] == book_id:
            return book
    raise ValueError(f"Book '{book_id}' not found.")

def add_book(title: str, author: str, genre: str,
             category: str, price: float, stock: int,
             description: str = "") -> dict:
    """
    Adds a new book to the catalogue.
    Corresponds to Scenario 4 - Staff updates catalogue.
    """
    books = _load_books()

    book = Book(
        book_id=f"book_{uuid.uuid4().hex[:8]}",
        title=title,
        author=author,
        genre=genre,
        category=category,
        price=price,
        stock=stock,
        description=description
    )

    books.append(book.to_dict())
    _save_books(books)
    return book.to_dict()

def update_book(book_id: str, updates: dict) -> dict:
    """
    Updates an existing book's details.
    Corresponds to Scenario 4 - Staff updates catalogue.
    """
    books = _load_books()

    for book in books:
        if book["book_id"] == book_id:
            allowed = {"title", "author", "genre", "category",
                       "price", "stock", "description"}
            for key, value in updates.items():
                if key in allowed:
                    book[key] = value
            _save_books(books)
            return book

    raise ValueError(f"Book '{book_id}' not found.")

def delete_book(book_id: str) -> dict:
    books = _load_books()
    remaining = [b for b in books if b["book_id"] != book_id]
    if len(remaining) == len(books):
        raise ValueError(f"Book '{book_id}' not found.")
    _save_books(remaining)
    return {"message": f"Book '{book_id}' deleted."}