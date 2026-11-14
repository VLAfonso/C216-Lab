from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from src.app.database.session import get_db
from src.app.repositories.book import BookRepository
from src.app.schemas.book import BookCreate, BookRead, BookUpdate
from src.app.services.book import BookAlreadyExistsError, BookNotFoundError, BookService

router = APIRouter(prefix="/books", tags=["Books"])

NOT_FOUND = "Livro não encontrado!"
ALREADY_EXISTS = "Já existe um livro com esse nome!"


def get_book_service(db: Annotated[Session, Depends(get_db)]) -> BookService:
    return BookService(BookRepository(db))


ServiceDep = Annotated[BookService, Depends(get_book_service)]


@router.get("/", response_model=list[BookRead])
def list_books(service: ServiceDep, skip: int = 0, limit: int = 100):
    return service.list_books(skip, limit)


@router.get("/{book_id}", response_model=BookRead)
def get_book(book_id: int, service: ServiceDep):
    try:
        return service.get_book(book_id)
    except BookNotFoundError:
        raise HTTPException(status.HTTP_404_NOT_FOUND, NOT_FOUND) from None


@router.post("/", response_model=BookRead, status_code=status.HTTP_201_CREATED)
def create_book(book_data: BookCreate, service: ServiceDep):
    try:
        return service.create_book(book_data)
    except BookAlreadyExistsError:
        raise HTTPException(status.HTTP_409_CONFLICT, ALREADY_EXISTS) from None


@router.put("/{book_id}", response_model=BookRead)
def update_book(book_id: int, book_data: BookCreate, service: ServiceDep):
    try:
        return service.update_book(book_id, book_data)
    except BookNotFoundError:
        raise HTTPException(status.HTTP_404_NOT_FOUND, NOT_FOUND) from None
    except BookAlreadyExistsError:
        raise HTTPException(status.HTTP_409_CONFLICT, ALREADY_EXISTS) from None


@router.patch("/{book_id}", response_model=BookRead)
def patch_book(book_id: int, book_data: BookUpdate, service: ServiceDep):
    try:
        return service.patch_book(book_id, book_data)
    except BookNotFoundError:
        raise HTTPException(status.HTTP_404_NOT_FOUND, NOT_FOUND) from None
    except BookAlreadyExistsError:
        raise HTTPException(status.HTTP_409_CONFLICT, ALREADY_EXISTS) from None


@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_book(book_id: int, service: ServiceDep):
    try:
        service.delete_book(book_id)
    except BookNotFoundError:
        raise HTTPException(status.HTTP_404_NOT_FOUND, NOT_FOUND) from None
    return Response(status_code=status.HTTP_204_NO_CONTENT)
