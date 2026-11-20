import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.app.api.routes.toys import router as toys_router

load_dotenv()

app = FastAPI(
    title="API - Loja de Brinquedos",
    description="API para gerenciamento de brinquedos.",
    version="1.0.0",
)

CORS_ORIGINS = os.getenv("CORS_ORIGINS").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Content-Type"],
)

app.include_router(toys_router)


@app.get("/")
def home():
    return {"message": "Bem-vindo à API da Loja de Brinquedos!"}
