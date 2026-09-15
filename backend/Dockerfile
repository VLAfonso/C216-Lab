FROM python:3.14-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY pyproject.toml poetry.lock ./
COPY src ./src

RUN pip install --no-cache-dir poetry \
    && poetry config virtualenvs.create false \
    && poetry install --only main --no-interaction --no-ansi


EXPOSE 8000

CMD ["uvicorn", "src.app.main:app", "--host", "0.0.0.0", "--port", "8000"]