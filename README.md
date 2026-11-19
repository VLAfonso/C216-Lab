# Laboratório de C216 - Sistemas Distribuídos
Repositório destinado aos códigos desenvolvidos no laboratório da disciplina C216 - Sistemas Distribuídos. 

<!-- Produzir um README.md coerente com a implementação, contendo: objetivo e tema, funcionalidades, tecnologias, estrutura resumida, pré-requisitos, variáveis de ambiente, comandos de execução, migrações, testes e instruções para acessar a aplicação. -->

# :teddy_bear: Projeto Final
O objetivo do projeto é desenvolver uma aplicação web full-stack original e funcional, aplicando de forma integrada os conhecimentos das sete práticas do semestre.

O tema definido foi **Loja de Brinquedos**, sendo possível cadastrar **brinquedos** e contendo as informações: nome, descrição, preço, categoria, marca, faixa etária e quantidade. 

# :open_file_folder: Estrutura do Projeto
```text
C216-Lab/
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
│   │       │       └── toys.py
│   │       ├── database/
│   │       │   ├── base.py
│   │       │   └── session.py
│   │       ├── models/
│   │       │   ├── __init__.py
│   │       │   └── toy.py
│   │       ├── repositories/
│   │       │   └── toy.py
│   │       ├── schemas/
│   │       │   └── toy.py
│   │       └── services/
│   │           └── toy.py
│   │
│   ├── tests/
│   │   ├── integration/
│   │   │   ├── conftest.py
│   │   │   └── test_toy_routes.py
│   │   └── unit/
│   │       ├── test_toy_routes.py
│   │       └── test_toy_services.py
│   │
│   ├── .dockerignore
│   ├── alembic.ini
│   ├── Dockerfile
│   ├── poetry.lock
│   └── pyproject.toml
│
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ToyForm.jsx
│   │   │   └── ToyList.jsx
│   │   ├── services/
│   │   │   └── toys.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── validation.js
│   │
│   ├── tests/
│   │   ├── e2e/
│   │   │   └── toys.spec.js
│   │   ├── integration/
│   │   │   └── App.test.jsx
│   │   ├── unit/
│   │   │   ├── ToyForm.test.jsx
│   │   │   ├── ToyList.test.jsx
│   │   │   ├── toys.test.js
│   │   │   └── validation.test.js
│   │   └── setup.js
│   │
│   ├── .dockerignore
│   ├── .gitignore
│   ├── biome.json
│   ├── Dockerfile
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── playwright.config.js
│   └── vite.config.js
│
│
├── .gitignore
├── compose.yaml
├── LICENSE
├── Makefile
└── README.md
```

# :gear: Instalação e Execução
<!-- Citar pré-requisitos, variáveis de ambiente, comandos de execução, migrações e instruções para acessar a aplicação. Não esquecer da seed com brinquedos iniciais -->

# :puzzle_piece: Funcionalidades
<!-- O nome do brinquedo deve ser único (regra de negócio) -->

# :hammer_and_wrench: Tecnologias

# :white_check_mark: Testes

# :robot: Integração Contínua (CI)

# :busts_in_silhouette: Colaboradores
Virgínia Letícia Afonso - [VLAfonso](https://github.com/VLAfonso)

# :scroll: Licença
Este projeto está licenciado sob a MIT License.