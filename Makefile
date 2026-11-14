.PHONY: up down ps logs build up-build clean shell install test test-unit test-integration lint format run help db-upgrade db-downgrade db-current db-history db-migration db-psql frontend-install frontend-dev frontend-lint frontend-format frontend-check frontend-test frontend-test-e2e frontend-build e2e check-all

BACKEND := cd backend
POETRY := $(BACKEND) && poetry run
PYTEST := $(POETRY) pytest
COMPOSE := docker compose
NPM := npm --prefix frontend
E2E_COMPOSE = API_PORT=8001 FRONTEND_PORT=5174 VITE_API_URL=http://localhost:8001 CORS_ORIGINS=http://localhost:5174,http://127.0.0.1:5174 $(COMPOSE) -p lab-e2e

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

frontend-install:
	$(NPM) ci

frontend-dev:
	$(NPM) run dev

frontend-lint:
	$(NPM) run lint

frontend-format:
	$(NPM) run format

frontend-check:
	$(NPM) run check

frontend-test:
	$(NPM) run test

frontend-test-e2e:
	$(NPM) run test:e2e

frontend-build:
	$(NPM) run build


e2e:
	@set -e; \
	trap '$(E2E_COMPOSE) down -v' EXIT; \
	$(E2E_COMPOSE) up --build -d; \
	$(E2E_COMPOSE) run --rm api alembic upgrade head; \
	E2E_BASE_URL=http://localhost:5174 $(NPM) run test:e2e

check-all: lint test frontend-check frontend-test frontend-build e2e

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
	@echo "  make frontend-install                - instala dependencias do frontend"
	@echo "  make frontend-dev                    - inicia o servidor de desenvolvimento"
	@echo "  make frontend-lint                   - verifica o codigo do frontend"
	@echo "  make frontend-format                 - formata o codigo do frontend"
	@echo "  make frontend-check                  - executa as verificacoes do frontend"
	@echo "  make frontend-test                   - executa os testes do frontend"
	@echo "  make frontend-test-e2e               - executa os testes E2E"
	@echo "  make frontend-build                  - gera o build de producao"
	@echo "  make check-all                       - executa todas as verificacoes"