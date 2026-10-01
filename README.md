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
│   ├── src/
│   │   └── app/
│   │       ├── main.py
│   │       ├── api/
│   │       │   └── routes/
│   │       │       └── books.py
│   │       ├── schemas/
│   │       │   └── book.py
│   │       └── services/
│   │           └── book.py
│   │
│   ├── tests/
│   │   └── test_main.py
│   │
│   ├── .dockerignore
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
| 3 | **test_get_book_not_found** | Verifica a busca de um livro inexistente. |
| 4 | **test_create_book** | Verifica a criação de um novo livro e sua inclusão na lista de livros. |
| 5 | **test_update_book** | Verifica a atualização completa de um livro existente. |
| 6 | **test_update_book_not_found** | Verifica o comportamento ao tentar atualizar um livro inexistente. |
| 7 | **test_patch_book** | Verifica a atualização parcial de um livro existente. |
| 8 | **test_patch_book_not_found** | Verifica o comportamento ao tentar atualizar parcialmente um livro inexistente. |
| 9 | **test_delete_book** | Verifica a exclusão de um livro existente. |
| 10 | **test_delete_book_not_found** | Verifica o comportamento ao tentar excluir um livro inexistente. |  

Os testes executados de `routes` são:  

| # | Teste | Descrição |
|----|------|-----------|
| 1 | **test_list_books** | Verifica a listagem de livros pela rota `GET "/"`. |
| 2 | **test_get_book** | Verifica a busca de um livro existente pela rota `GET "/{book_id}"`. |
| 3 | **test_get_book_not_found** | Verifica o comportamento ao buscar um livro inexistente. |
| 4 | **test_create_book** | Verifica a criação de um novo livro pela rota `POST "/"`. |
| 5 | **test_update_book** | Verifica a atualização completa de um livro pela rota `PUT "/{book_id}"`. |
| 6 | **test_update_book_not_found** | Verifica o comportamento ao tentar atualizar um livro inexistente. |
| 7 | **test_patch_book** | Verifica a atualização parcial de um livro pela rota `PATCH "/{book_id}"`. |
| 8 | **test_patch_book_not_found** | Verifica o comportamento ao tentar atualizar parcialmente um livro inexistente. |
| 9 | **test_delete_book** | Verifica a exclusão de um livro pela rota `DELETE "/{book_id}"`. |
| 10 | **test_delete_book_not_found** | Verifica o comportamento ao tentar excluir um livro inexistente. |
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
| 3 | **test_get_book_not_found** | Verifica o retorno de erro ao buscar livros inexistentes, utilizando parametrização. |
| 4 | **test_create_book** | Verifica a criação de um novo livro pela rota `POST "/books/"`. |
| 5 | **test_create_book_invalid_data** | Verifica o retorno de erro ao enviar dados inválidos na criação de um livro. |
| 6 | **test_update_book** | Verifica a atualização completa de um livro pela rota `PUT "/books/{book_id}"`. |
| 7 | **test_update_book_not_found** | Verifica o retorno de erro ao tentar atualizar um livro inexistente. |
| 8 | **test_update_book_invalid_data** | Verifica o retorno de erro ao enviar dados inválidos na atualização de um livro. |
| 9 | **test_patch_book** | Verifica a atualização parcial de um livro pela rota `PATCH "/books/{book_id}"`. |
| 10 | **test_patch_book_not_found** | Verifica o retorno de erro ao tentar atualizar parcialmente um livro inexistente. |
| 11 | **test_delete_book** | Verifica a exclusão de um livro pela rota `DELETE "/books/{book_id}"` e confirma que o livro não está mais disponível. |
| 12 | **test_delete_book_not_found** | Verifica o retorno de erro ao tentar excluir um livro inexistente. |

## :robot: Integração Contínua (CI)
Esse projeto possui um pipeline, por meio do GitHub Actions, configurado para a automação de testes e verificações de código em eventos de `push` e `pull_request` que alterem arquivos do backend ou o próprio workflow.

São executados:
- Ruff para formatação e análise do código;
- Pytest para execução dos testes automatizados.

## :busts_in_silhouette: Colaboradores
Virgínia Letícia Afonso - [VLAfonso](https://github.com/VLAfonso)

## :scroll: Licença
Este projeto está licenciado sob a MIT License.