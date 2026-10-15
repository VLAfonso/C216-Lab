.PHONY: up down ps logs build up-build clean shell install test test-unit test-integration lint format run help db-upgrade db-downgrade db-current db-history db-migration db-psql

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

test-unit:
	$(PYTEST) tests/unit

test-integration:
	$(PYTEST) tests/integration

lint:
	$(POETRY) ruff check .

format:
	$(POETRY) ruff format .

run:
	$(POETRY) uvicorn src.app.main:app --reload

db-upgrade:
	$(COMPOSE) exec api alembic upgrade head

db-downgrade:
	$(COMPOSE) exec api alembic downgrade -1

db-current:
	$(COMPOSE) exec api alembic current

db-history:
	$(COMPOSE) exec api alembic history

db-migration:
	@test -n "$(MSG)" || (echo "Uso: make db-migration MSG=\"descricao\"" && exit 1)
	$(COMPOSE) run --rm -v "$(CURDIR)/backend/alembic/versions:/app/alembic/versions" api alembic revision --autogenerate -m "$(MSG)"

db-psql:
	$(COMPOSE) exec db sh -c 'psql -U $$POSTGRES_USER -d $$POSTGRES_DB'

help:
	@echo "Comandos disponiveis:"
	@echo "  make install  			              - instala dependencias"
	@echo "  make test     			              - executa todos testes"
	@echo "  make test-unit                       - executa os testes unitarios"
	@echo "  make test-integration                - executa os testes de integracao"
	@echo "  make lint     			              - verifica o codigo"
	@echo "  make format   			              - formata o codigo"
	@echo "  make run      			              - inicia o servidor"
	@echo "  make up       			              - inicia containers em segundo plano"
	@echo "  make down     			              - para e remove os containers"
	@echo "  make ps       			              - mostra status dos containers"
	@echo "  make logs     			              - exibe logs containers em tempo real"
	@echo "  make build    			              - controi as imagens"
	@echo "  make up-build 			              - constroi e inicia os containers"
	@echo "  make clean    			              - para, remove os containers e seus volumes"
	@echo "  make shell    			              - abre o terminal do container api"
	@echo "  make db-upgrade                      - aplica as migrations pendentes"
	@echo "  make db-downgrade                    - desfaz a ultima migration"
	@echo "  make db-current                      - mostra a versao atual do banco"
	@echo "  make db-history                      - lista o historico de migrations"
	@echo "  make db-migration MSG=\"descricao\"  - gera uma nova migration"
	@echo "  make db-psql                         - abre o psql no container db"