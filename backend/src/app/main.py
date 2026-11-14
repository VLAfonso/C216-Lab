import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.app.api.routes.books import router as books_router

load_dotenv()

app = FastAPI()

CORS_ORIGINS = os.getenv("CORS_ORIGINS").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

app.include_router(books_router)


@app.get("/")
def home():
    return {"message": "Olá, Sistemas Distribuídos!"}
