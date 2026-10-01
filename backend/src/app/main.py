from fastapi import FastAPI

from app.api.routes.books import router as books_router

app = FastAPI()

app.include_router(books_router)
