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
│   │       └── main.py
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

Os testes executados são:
| # | Teste | Descrição |
|----|------|-----------|
| 1 | **test_home** | Verifica acesso à rota inicial `/` e seu retorno. |
| 2 | **test_hello** | Verifica retorno da rota `/hello/{name}` para diferentes nomes, por meio de parametrização. |
| 3 | **test_hello_empty_name** | Verifica acesso à rota `/hello/` sem informar o nome. |
| 4 | **test_home_wrong_method** | Verifica requisição com método HTTP não permitido na rota `/`. |
| 5 | **test_route_not_found** | Verifica acesso a uma rota inexistente. |

## :robot: Integração Contínua (CI)
Esse projeto possui um pipeline, por meio do GitHub Actions, configurado para a automação de testes e verificações de código em eventos de `push` e `pull_request` que alterem arquivos do backend ou o próprio workflow.

São executados:
- Ruff para formatação e análise do código;
- Pytest para execução dos testes automatizados.

## :busts_in_silhouette: Colaboradores
Virgínia Letícia Afonso - [VLAfonso](https://github.com/VLAfonso)

## :scroll: Licença
Este projeto está licenciado sob a MIT License.