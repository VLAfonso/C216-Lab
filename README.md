#  Laboratório de C216 - Sistemas Distribuídos
Repositório destinado aos códigos desenvolvidos no laboratório da disciplina C216 - Sistemas Distribuídos.

## :open_file_folder: Estrutura do Projeto
```text
C216-Lab/
├── .github
│   ├── workflows
│   │   └── ci-backend.yml
│
├── backend/
│   ├── alembic/
│   │   ├── versions/
│   │   └── env.py
│   │
│   ├── src/
│   │   └── app/
│   │       ├── main.py
│   │       ├── api/
│   │       │   └── routes/
│   │       │       └── books.py
│   │       ├── database/
│   │       │   ├── base.py
│   │       │   └── session.py
│   │       ├── models/
│   │       │   ├── __init__.py
│   │       │   └── book.py
│   │       ├── repositories/
│   │       │   └── book.py
│   │       ├── schemas/
│   │       │   └── book.py
│   │       └── services/
│   │           └── book.py
│   │
│   ├── tests/
│   │   ├── integration/
│   │       ├── conftest.py
│   │   │   └── test_book_routes.py
│   │   └── unit/
│   │       ├── test_book_routes.py
│   │       └── test_book_services.py
│   │
│   ├── .dockerignore
│   ├── alembic.ini
│   ├── Dockerfile
│   ├── poetry.lock
│   └── pyproject.toml
│
├── .env.example
├── .gitignore
├── compose.yaml
├── LICENSE
├── Makefile
└── README.md
```

## :gear: Instalação e Execução
> :pushpin: **Pré-requisito:** Docker com Docker Compose  
> Make também será utilizado, mas pode ser substituído por comandos `docker compose` diretamente.

1. Clonar o repositório
```bash
git clone https://github.com/VLAfonso/C216-Lab.git
cd C216-Lab
```

2. Configurar as variáveis de ambiente  
Utilize `.env.example` como base, copie suas informações para `.env` e ajuste os valores conforme necessário
```bash
cp .env.example .env #Linux
Copy-Item .env.example .env #Windows PowerShell
```

3. Subir o ambiente
```bash
make up-build
```
> docker compose up --build

4. Acessar API  
A API estará disponível em http://localhost:8000.

5. Parar o ambiente
```bash
make down
```
> docker compose down

## :white_check_mark: Testes
Após a instalação da aplicação, os testes poderão ser executados por meio do comando:
```bash
make test
```
> cd backend && poetry run pytest

### Testes Unitários
Os testes unitários são divididos entre os testes de `routes` e de `services`.  
Podem ser executados por meio do comando:
```bash
make test-unit
```
> cd backend && poetry run pytest tests/unit

Os testes executados de `services` são:  
| # | Teste | Descrição |
|----|------|-----------|
| 1 | **test_list_books** | Verifica a listagem dos livros disponíveis no serviço. |
| 2 | **test_get_book_existing** | Verifica a busca de um livro existente pelo seu ID. |
| 3 | **test_get_book_not_found** | Verifica o comportamento ao tentar a busca de um livro inexistente. |
| 4 | **test_create_book** | Verifica a criação de um novo livro e sua inclusão na lista de livros. |
| 5 | **test_create_book_duplicate_name** | Verifica o comportamento ao tentar a criação de um livro já existente. |
| 6 | **test_update_book** | Verifica a atualização completa de um livro existente. |
| 7 | **test_update_book_not_found** | Verifica o comportamento ao tentar a atualização completa um livro inexistente. |
| 8 | **test_update_book_duplicate_name** | Verifica o comportamento ao tentar a atualização completa de um livro já existente. |
| 9 | **test_patch_book_name** | Verifica a atualização parcial (apenas o nome) de um livro existente. |
| 10 | **test_patch_book_author** | Verifica a atualização parcial (apenas o autor) de um livro existente. |
| 11 | **test_patch_book_not_found** | Verifica o comportamento ao tentar a atualização parcial um livro inexistente. |
| 12 | **test_patch_book_duplicate_name** | Verifica o comportamento ao tentar a atualização parcial de um livro já existente. |
| 13 | **test_delete_book** | Verifica a exclusão de um livro existente. |
| 14 | **test_delete_book_not_found** | Verifica o comportamento ao tentar a exclução um livro inexistente. |  
> Utiliza mocks de `repository`

Os testes executados de `routes` são:  

| # | Teste | Descrição |
|----|------|-----------|
| 1 | **test_list_books** | Verifica a listagem de livros pela rota `GET "/"`. |
| 2 | **test_get_book** | Verifica a busca de um livro existente pela rota `GET "/{book_id}"`. |
| 3 | **test_get_book_not_found** | Verifica o comportamento ao tentar a busca por um livro inexistente. |
| 4 | **test_create_book** | Verifica a criação de um novo livro pela rota `POST "/"`. |
| 5 | **test_create_book_already_exists** | Verifica o comportamento ao tentar a criação de um livro já existente com o mesmo nome. |
| 6 | **test_update_book** | Verifica a atualização completa de um livro pela rota `PUT "/{book_id}"`. |
| 7 | **test_update_book_not_found** | Verifica o comportamento ao tentar a atualização completa de um livro inexistente. |
| 8 | **test_update_book_already_exists** | Verifica o comportamento ao tentar a atualização completa de um livro existente com o mesmo nome. |
| 9 | **test_patch_book** | Verifica a atualização parcial de um livro pela rota `PATCH "/{book_id}"`. |
| 10 | **test_patch_book_not_found** | Verifica o comportamento ao tentar a atualização parcial de um livro inexistente. |
| 11 | **test_patch_book_already_exists** | Verifica o comportamento ao tentar a atualização parcial de um livro existente com o mesmo nome. |
| 12 | **test_delete_book** | Verifica a exclusão de um livro pela rota `DELETE "/{book_id}"`. |
| 13 | **test_delete_book_not_found** | Verifica o comportamento ao tentar a exclusão de um livro inexistente. |
> Utiliza mocks de `services`

### Testes de Integração
Os testes de integração validam o comportamento das rotas de forma integrada. 
Podem ser executados por meio do comando:
```bash
make test-integration
```
> cd backend && poetry run pytest tests/integration

Os testes executados são:  
| # | Teste | Descrição |
|----|------|-----------|
| 1 | **test_list_books** | Verifica a listagem de livros pela rota `GET "/books/"`. |
| 2 | **test_get_book_existing** | Verifica a busca de um livro existente pela rota `GET "/books/{book_id}"`. |
| 3 | **test_get_book_not_found** | Verifica o retorno de erro ao tentar a busca de livros inexistentes, utilizando parametrização. |
| 4 | **test_create_book** | Verifica a criação de um novo livro pela rota `POST "/books/"`. |
| 5 | **test_create_book_invalid_data** | Verifica o retorno de erro ao tentar enviar dados inválidos na criação de um livro. |
| 6 | **test_create_book_already_exists** | Verifica o retorno de erro ao tentar a criação de um livro existente existente com o mesmo nome. |
| 7 | **test_update_book** | Verifica a atualização completa de um livro pela rota `PUT "/books/{book_id}"`. |
| 8 | **test_update_book_not_found** | Verifica o retorno de erro ao tentar a atualização um livro inexistente. |
| 9 | **test_update_book_invalid_data** | Verifica o retorno de erro ao tentar enviar dados inválidos na atualização de um livro. |
| 10 | **test_update_book_already_exists** | Verifica o retorno de erro ao tentar a atualização completa de um livro existente com o mesmo nome. |
| 11 | **test_patch_book** | Verifica a atualização parcial de um livro pela rota `PATCH "/books/{book_id}"`. |
| 12 | **test_patch_book_not_found** | Verifica o retorno de erro ao tentar a atualização parcial um livro inexistente. |
| 13 | **test_patch_book_already_exists** | Verifica o retorno de erro ao tentar a atualização parcial um livro existente com o mesmo nome. |
| 14 | **test_delete_book** | Verifica a exclusão de um livro pela rota `DELETE "/books/{book_id}"` e confirma que o livro não está mais disponível. |
| 15 | **test_delete_book_not_found** | Verifica o retorno de erro ao tentar excluir um livro inexistente. |

## :robot: Integração Contínua (CI)
Esse projeto possui um pipeline, por meio do GitHub Actions, configurado para a automação de testes e verificações de código em eventos de `push` e `pull_request` que alterem arquivos do backend ou o próprio workflow.

São executados:
- Ruff para formatação e análise do código;
- Pytest para execução dos testes automatizados.

## :busts_in_silhouette: Colaboradores
Virgínia Letícia Afonso - [VLAfonso](https://github.com/VLAfonso)

## :scroll: Licença
Este projeto está licenciado sob a MIT License.