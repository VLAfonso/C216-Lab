.PHONY: up down ps logs build up-build clean shell install test lint format run help

BACKEND := cd backend
POETRY := $(BACKEND) && poetry run
PYTEST := $(POETRY) pytest
COMPOSE := docker compose

up:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

ps:
	$(COMPOSE) ps

logs:
	$(COMPOSE) logs -f

build:
	$(COMPOSE) build

up-build:
	$(COMPOSE) up --build

clean:
	$(COMPOSE) down -v

shell:
	$(COMPOSE) exec api sh

install:
	$(BACKEND) && poetry install

test:
	$(PYTEST)

lint:
	$(POETRY) ruff check .

format:
	$(POETRY) ruff format .

run:
	$(POETRY) uvicorn src.app.main:app --reload

help:
	@echo "Comandos disponiveis:"
	@echo "  make install  - instala dependencias"
	@echo "  make test     - executa testes"
	@echo "  make lint     - verifica o codigo"
	@echo "  make format   - formata o codigo"
	@echo "  make run      - inicia o servidor"
	@echo "  make up       - inicia containers em segundo plano"
	@echo "  make down     - para e remove os containers"
	@echo "  make ps       - mostra status dos containers"
	@echo "  make logs     - exibe logs containers em tempo real"
	@echo "  make build    - controi as imagens"
	@echo "  make up-build - constroi e inicia os containers"
	@echo "  make clean    - para, remove os containers e seus volumes"
	@echo "  make shell    - abre o terminal do container api"