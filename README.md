#  Laboratório de C216 - Sistemas Distribuídos
Repositório destinado aos códigos desenvolvidos no laboratório da disciplina C216 - Sistemas Distribuídos.

## :open_file_folder: Estrutura do Projeto
```text
C216-Lab/
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
├── .env
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

## :busts_in_silhouette: Colaboradores
Virgínia Letícia Afonso - [VLAfonso](https://github.com/VLAfonso)

## :scroll: Licença
Este projeto está licenciado sob a MIT License.