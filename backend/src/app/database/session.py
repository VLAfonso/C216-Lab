import os
from collections.abc import Iterator

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

# Carregar a URL do banco de dados
load_dotenv()
database_url = os.getenv("DATABASE_URL")

if not database_url:
    raise RuntimeError("A variável DATABASE_URL não foi definida.")

# O engine é criado uma única vez e mantém o pool de conexões.
engine = create_engine(database_url, pool_pre_ping=True)

SessionLocal = sessionmaker(bind=engine, autoflush=False)


def get_db() -> Iterator[Session]:
    """Dependência do FastAPI: uma sessão por requisição, sempre fechada."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
