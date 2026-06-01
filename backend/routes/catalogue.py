# routes/catalogue.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.catalogue_service import (
    get_all_books, search_books, get_book_by_id,
    add_book, update_book, delete_book
)

router = APIRouter(prefix="/catalogue", tags=["catalogue"])

class AddBookRequest(BaseModel):
    title: str
    author: str
    genre: str
    category: str
    price: float
    stock: int
    description: Optional[str] = ""

class UpdateBookRequest(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    genre: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    description: Optional[str] = None

@router.get("/")
def get_catalogue(search: Optional[str] = None):
    try:
        if search:
            return search_books(search)
        return get_all_books()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{book_id}")
def get_book(book_id: str):
    try:
        return get_book_by_id(book_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/")
def create_book(req: AddBookRequest):
    try:
        return add_book(
            title=req.title,
            author=req.author,
            genre=req.genre,
            category=req.category,
            price=req.price,
            stock=req.stock,
            description=req.description
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{book_id}")
def edit_book(book_id: str, req: UpdateBookRequest):
    try:
        updates = {k: v for k, v in req.model_dump().items() if v is not None}
        return update_book(book_id, updates)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/{book_id}")
def remove_book(book_id: str):
    try:
        return delete_book(book_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))