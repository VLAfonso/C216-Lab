from fastapi import APIRouter, HTTPException

from src.app.schemas.book import BookCreate, BookUpdate
from src.app.services import book as book_service

router = APIRouter(prefix="/books", tags=["Books"])

@router.get("/")
def list_books():
    return book_service.list_books()

@router.get("/{book_id}")
def get_book(book_id: int):
    book = book_service.get_book(book_id)

    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")

    return book

@router.post("/")
def create_book(book: BookCreate):
    return book_service.create_book(book)

@router.put("/{book_id}")
def update_book(book_id: int, book: BookCreate):
    updated_book = book_service.update_book(book_id, book)

    if updated_book is None:
        raise HTTPException(status_code=404, detail="Book not found")

    return updated_book

@router.patch("/{book_id}")
def patch_book(book_id: int, book: BookUpdate):
    updated_book = book_service.patch_book(book_id, book)

    if updated_book is None:
        raise HTTPException(status_code=404, detail="Book not found")

    return updated_book

@router.delete("/{book_id}")
def delete_book(book_id: int):
    deleted_book = book_service.delete_book(book_id)

    if deleted_book is None:
        raise HTTPException(status_code=404, detail="Book not found")

    return deleted_book
