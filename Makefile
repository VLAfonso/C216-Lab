.PHONY: \
	up down ps logs build up-build clean shell \
	install test test-unit test-integration lint format run\
	db-upgrade db-downgrade db-current db-history db-migration db-psql seed\
	frontend-install frontend-dev frontend-lint frontend-format \
	frontend-check frontend-test frontend-test-e2e frontend-build \
	e2e check-all help

BACKEND := cd backend
POETRY := $(BACKEND) && poetry run
PYTEST := $(POETRY) pytest
COMPOSE := docker compose
NPM := npm --prefix frontend

E2E_COMPOSE = API_PORT=8001 FRONTEND_PORT=5174 VITE_API_URL=http://localhost:8001 CORS_ORIGINS=http://localhost:5174,http://127.0.0.1:5174 $(COMPOSE) -p lab-e2e

# Docker
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


# Backend
install:
	$(BACKEND) && poetry install

run:
	$(POETRY) uvicorn src.app.main:app --reload

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


## BD e migrações
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

seed:
	$(COMPOSE) exec api python -m scripts.seed


# Frontend
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


# Verificação geral
check-all: lint test frontend-check frontend-test frontend-build e2e


help:
	@printf '%s\n' \
		'Comandos disponiveis:' \
		'' \
		'Docker:' \
		'  make up                 - inicia os containers em segundo plano' \
		'  make down               - para e remove os containers' \
		'  make ps                 - mostra o status dos containers' \
		'  make logs               - exibe os logs em tempo real' \
		'  make build              - constroi as imagens' \
		'  make up-build           - constroi e inicia os containers' \
		'  make clean              - remove containers e volumes' \
		'  make shell              - abre o terminal do container api' \
		'' \
		'Backend:' \
		'  make install            - instala as dependencias' \
		'  make run                - inicia o servidor' \
		'  make test               - executa todos os testes' \
		'  make test-unit          - executa os testes unitarios' \
		'  make test-integration   - executa os testes de integracao' \
		'  make lint               - verifica o codigo com Ruff' \
		'  make format             - formata o codigo com Ruff' \
		'' \
		'Banco de dados:' \
		'  make db-upgrade         - aplica as migrations pendentes' \
		'  make db-downgrade       - desfaz a ultima migration' \
		'  make db-current         - mostra a versao atual do banco' \
		'  make db-history         - lista o historico de migrations' \
		'  make db-migration MSG="descricao" - gera uma nova migration' \
		'  make db-psql            - abre o psql no container db' \
		'  make seed               - executa a seed do banco de dados' \
		'' \
		'Frontend:' \
		'  make frontend-install   - instala as dependencias' \
		'  make frontend-dev       - inicia o servidor de desenvolvimento' \
		'  make frontend-lint      - verifica o codigo com Biome' \
		'  make frontend-format    - formata o codigo com Biome' \
		'  make frontend-check     - executa as verificacoes' \
		'  make frontend-test      - executa os testes unitarios e de integracao' \
		'  make frontend-test-e2e  - executa os testes E2E' \
		'  make frontend-build     - gera o build de producao' \
		'  make e2e                - executa os testes E2E com Docker' \
		'' \
		'Verificacoes gerais:' \
		'  make check-all          - executa todas as verificacoes'