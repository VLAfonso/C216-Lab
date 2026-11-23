# Laboratório de C216 - Sistemas Distribuídos
Repositório destinado aos códigos desenvolvidos no laboratório da disciplina C216 - Sistemas Distribuídos. 

# :teddy_bear: Projeto Final
O objetivo deste projeto é desenvolver uma aplicação web full-stack original e funcional, aplicando de forma integrada os conhecimentos das sete práticas do semestre.

O tema escolhido foi **Gerenciamento de Estoque de uma Loja de Brinquedos**. A aplicação permite consultar, cadastrar, editar e excluir **brinquedos**, armazenando informações como nome, descrição, preço, categoria, marca, faixa etária e quantidade em estoque. 

### :movie_camera: **Vídeo de apresentação:** 
O vídeo da apresentação está disponível no [YouTube](https://youtu.be/jWC1Uy3VZd0).

# :jigsaw: Funcionalidades
A aplicação desenvolvida no projeto oferece as seguintes funcionalidades para o gerenciamento do estoque:
- **Cadastro de brinquedos:** permite registrar brinquedos com nome, descrição, preço, categoria, marca, faixa etária e quantidade.
- **Consulta de brinquedos:** exibe os brinquedos cadastrados e suas respectivas informações.
- **Edição de brinquedos:** permite atualizar os dados de um brinquedo existente.
- **Exclusão de brinquedos:** permite remover um brinquedo.
- **Busca e filtragem:** permite localizar brinquedos pelo nome, marca ou categoria, além de filtrar a listagem por categoria.
- **Ordenação:** permite organizar a listagem por nome, preço ou quantidade.

Além das funcionalidades, o sistema possui validações para garantir a integridade dos dados. O nome do brinquedo é obrigatório e único, não sendo permitido cadastrar dois brinquedos com o mesmo nome. Os campos também são validados no frontend e no backend.

# :hammer_and_wrench: Tecnologias
As principais tecnologias e ferramentas utilizadas no desenvolvimento do projeto foram:

**Backend**
- [Python](https://www.python.org/) – linguagem de programação.
- [FastAPI](https://fastapi.tiangolo.com/) – construção da API REST.
- [SQLAlchemy](https://www.sqlalchemy.org/) – mapeamento objeto-relacional (ORM) e interação com o banco de dados.
- [Pydantic](https://docs.pydantic.dev/) – validação e estruturação dos dados.
- [Alembic](https://alembic.sqlalchemy.org/) – gerenciamento de migrações do banco de dados.
- [Poetry](https://python-poetry.org/) – gerenciamento de dependências e ambiente Python.

**Frontend**
- [JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript) – linguagem de programação.
- [React](https://react.dev/) – construção da interface.
- [Vite](https://vite.dev/) – ferramenta de desenvolvimento e build.
- [Tailwind CSS](https://tailwindcss.com/) – estilização da interface.
- [React Router](https://reactrouter.com/) – gerenciamento de rotas e navegação.

**Banco de dados**
- [PostgreSQL](https://www.postgresql.org/) – armazenamento persistente dos dados.

**Testes e qualidade de código**
- [Pytest](https://docs.pytest.org/) – testes do backend.
- [Vitest](https://vitest.dev/) – testes unitários e de integração do frontend.
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) – testes dos componentes React.
- [Playwright](https://playwright.dev/) – testes ponta a ponta (E2E).
- [Ruff](https://docs.astral.sh/ruff/) – análise e formatação do código Python.
- [Biome](https://biomejs.dev/) – análise e formatação do código JavaScript.

**Infraestrutura e integração contínua**
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) – conteinerização e execução dos serviços.
- [GitHub Actions](https://github.com/features/actions) – automação dos processos de integração contínua (CI).

# :open_file_folder: Estrutura do Projeto
```text
C216-Lab/
├── .github/
│   └── workflows/
│       ├── ci-backend.yml
│       └── ci-frontend.yml
│
├── backend/
│   ├── alembic/
│   │   └── versions/
│   ├── scripts/
│   │   └── seed.py
│   ├── src/
│   │   └── app/
│   │       ├── api/routes/
│   │       ├── database/
│   │       ├── models/
│   │       ├── repositories/
│   │       ├── schemas/
│   │       ├── services/
│   │       └── main.py
│   ├── tests/
│   │   ├── integration/
│   │   └── unit/
│   ├── Dockerfile
│   ├── alembic.ini
│   ├── pyproject.toml
│   └── poetry.lock
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── validation.js
│   ├── tests/
│   │   ├── e2e/
│   │   ├── integration/
│   │   ├── unit/
│   │   └── setup.js
│   ├── Dockerfile
│   ├── biome.json
│   ├── package.json
│   ├── package-lock.json
│   ├── playwright.config.js
│   └── vite.config.js
│
├── .env.example
├── compose.yaml
├── Makefile
├── LICENSE
└── README.md
```

# :gear: Instalação e Execução
> :pushpin: **Pré-requisitos:** Docker com Docker Compose e GNU Make.  
> O Make pode ser substituído pelos comandos `docker compose` correspondentes.

1. Clonar o repositório
```bash
git clone https://github.com/VLAfonso/C216-Lab.git
cd C216-Lab
```

2. Configurar as variáveis de ambiente
Utilize `.env.example` como base, copie suas informações para `.env` e ajuste os valores conforme necessário.
```bash
cp .env.example .env #Linux
Copy-Item .env.example .env #Windows PowerShell
```
As variáveis de ambiente são:

| Variável | Descrição |
|---|---|
| `POSTGRES_DB` | Nome do banco de dados do PostgreSQL. |
| `POSTGRES_USER` | Usuário do PostgreSQL. |
| `POSTGRES_PASSWORD` | Senha do PostgreSQL. |
| `DATABASE_URL` | URL de conexão utilizada pelo backend quando executado fora do Docker. |
| `CORS_ORIGINS` | Origens autorizadas a acessar a API. |
| `VITE_API_URL` | Endereço da API utilizado pelo frontend. |


3. Subir o ambiente
```bash
make up-build
```
> docker compose up --build

4. Preparar o banco de dados
Aplique as migrações e cadastre os brinquedos iniciais:
```bash
make db-upgrade
make seed
```

5. Acessar a aplicação
- Frontend: [http://localhost:5173](http://localhost:5173)    
- API: [http://localhost:8000](http://localhost:8000)
- Documentação da API: [http://localhost:8000/docs](http://localhost:8000/docs)

6. Parar o ambiente
```bash
make down
```
> docker compose down

# :white_check_mark: Testes
O projeto possui testes unitários, de integração e ponta a ponta (E2E), abrangendo o backend e o frontend.

## Backend
Os testes do backend podem ser executados por meio do comando:
```bash
make test
```
> `cd backend && poetry run pytest`

### **Testes Unitários**
Os testes unitários são divididos entre `services` e `routes`.  
Podem ser executados por meio do comando:
```
make test-unit
```
> `cd backend && poetry run pytest tests/unit`

Os testes de `services` verificam as regras de negócio relacionadas ao cadastro, consulta, atualização e exclusão de brinquedos, incluindo o tratamento de registros inexistentes e nomes duplicados.
> Utiliza mocks de `repositories`.

Os testes de `routes` verificam o comportamento dos endpoints da API, incluindo as respostas para operações válidas e situações de erro.
> Utiliza mocks de `services`.

### **Testes de Integração**
Os testes de integração validam o comportamento das rotas em conjunto com os demais componentes do backend, incluindo a comunicação com o banco de dados.  
Podem ser executados por meio do comando:
```
make test-integration
```
> `cd backend && poetry run pytest tests/integration`

Os testes verificam:
- Listagem e consulta de brinquedos.
- Cadastro, atualização e exclusão de registros.
- Tratamento de dados inválidos.
- Tratamento de registros inexistentes e nomes duplicados.

## **Frontend**
Os testes unitários e de integração podem ser executados por meio do comando:
```
make frontend-test
```
> `npm --prefix frontend run test`

### **Testes Unitários**
Os testes unitários abrangem os componentes e módulos `ToyForm`, `ToyList`, `toys` e `validation`.  
Os testes de `ToyForm` verificam a validação dos campos e o comportamento do formulário.  
Os testes de `ToyList` verificam a exibição dos brinquedos e o comportamento da listagem.  
Os testes de `toys` verificam a comunicação com a API, incluindo operações e tratamento de erros.  
Os testes de `validation` verificam as regras de validação dos dados informados.

### **Testes de Integração**
Os testes de integração validam o comportamento da aplicação, verificando a interação entre os componentes e os serviços.   
Os testes verificam:
- Exibição dos estados de carregamento e lista vazia.
- Carregamento e exibição dos brinquedos.
- Tratamento de erros na comunicação com a API.
- Cadastro e edição de brinquedos.
- Tratamento de erros durante o cadastro e a edição.
- Exclusão de brinquedos e tratamento de erros.
- Exibição das mensagens de sucesso e erro.
- Busca por nome, marca e categoria.
- Busca sem diferenciar letras maiúsculas e minúsculas.
- Exibição de mensagem quando nenhum brinquedo é encontrado.
- Filtragem por categoria.
- Ordenação por nome, preço e quantidade.
- Combinação de busca e filtros.

### **Testes E2E**
Os testes ponta a ponta verificam os principais fluxos da aplicação, simulando a interação do usuário com o sistema.  
Podem ser executados por meio do comando:
```
make e2e
```
Os cenários implementados verificam:
- Cadastro de um brinquedo, exibição da mensagem de sucesso e persistência após recarregar a página.
- Edição de um brinquedo, exibição da mensagem de sucesso e persistência das alterações após recarregar a página.
- Exclusão de um brinquedo, exibição da mensagem de sucesso e confirmação de que ele não aparece mais na listagem.

## Verificação Geral
O projeto possui um comando para executar as principais verificações de qualidade e funcionamento de forma integrada:
```bash
make check-all
```

Ele executa, em sequência:
- Ruff: verifica a qualidade do código Python.
- Pytest: executa todos os testes do backend.
- Biome: verifica a qualidade e a formatação do código JavaScript.
- Vitest: executa os testes unitários e de integração do frontend.
- Build: verifica a geração do build de produção do frontend.
- Playwright: executa os testes ponta a ponta (E2E) em um ambiente isolado.

O comando é interrompido caso alguma etapa apresente falha, permitindo identificar problemas antes de integrar as alterações ao projeto.

# :robot: Integração Contínua (CI)
O projeto utiliza GitHub Actions para automatizar as verificações de qualidade, os testes e a construção da aplicação.  
Os workflows são executados em eventos de `push` e `pull_request`, quando há alterações nos arquivos definidos em suas configurações.

### Backend
O workflow `ci-backend.yml` possui duas etapas:
1. **Ruff (Lint & Format):** verifica a formatação e a qualidade do código Python.
2. **Pytest:** executa os testes automatizados do backend, após a aprovação da etapa anterior.

### Frontend
O workflow `ci-frontend.yml` possui duas etapas:
1. **Linter:** verifica a qualidade do código JavaScript utilizando Biome.
2. **Formatação, Testes, Build e Playwright:** verifica a formatação do código, executa os testes unitários e de integração, realiza o build de produção e executa os testes E2E com Playwright.

Em caso de falha, o relatório do Playwright é disponibilizado como artefato do workflow.

# :busts_in_silhouette: Colaboradores
Virgínia Letícia Afonso - [VLAfonso](https://github.com/VLAfonso)

# :scroll: Licença
Este projeto está licenciado sob a [MIT License](LICENSE)..