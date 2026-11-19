from decimal import Decimal

from src.app.database.session import SessionLocal
from src.app.repositories.toy import ToyRepository

TOYS = [
    {
        "name": "Caixa de Blocos de Montar LEGO",
        "price": Decimal("249.90"),
        "quantity": 15,
        "description": (
            "Caixa com 500 peças de montar para criar diferentes construções."
        ),
        "category": "Blocos de Montar",
        "brand": "LEGO",
        "age_range": "6 a 12 anos",
    },
    {
        "name": "Boneca Barbie Bailarina",
        "price": Decimal("129.90"),
        "quantity": 10,
        "description": (
            "Boneca Barbie com roupa de bailarina e acessórios para brincadeiras."
        ),
        "category": "Bonecas",
        "brand": "Barbie",
        "age_range": "3 a 10 anos",
    },
    {
        "name": "Carro Hot Wheels Vermelho",
        "price": Decimal("19.90"),
        "quantity": 30,
        "description": ("Carrinho em miniatura vermelho para brincar e colecionar."),
        "category": "Carrinhos",
        "brand": "Hot Wheels",
        "age_range": "3 a 12 anos",
    },
    {
        "name": "Carro Hot Wheels Azul",
        "price": Decimal("19.90"),
        "quantity": 25,
        "description": (
            "Carrinho esportivo em miniatura azul para brincar e colecionar."
        ),
        "category": "Carrinhos",
        "brand": "Hot Wheels",
        "age_range": "3 a 12 anos",
    },
    {
        "name": "Monopoly",
        "price": Decimal("149.90"),
        "quantity": 8,
        "description": ("Jogo de tabuleiro de compra e negociação de propriedades."),
        "category": "Jogos de Tabuleiro",
        "brand": "Hasbro",
        "age_range": "8 anos ou mais",
    },
    {
        "name": "Urso de Pelúcia",
        "price": Decimal("79.90"),
        "quantity": 12,
        "description": (
            "Urso de pelúcia marrom, macio e ideal para abraçar e decorar."
        ),
        "category": "Pelúcias",
        "brand": "Genérica",
        "age_range": "Todas as idades",
    },
    {
        "name": "UNO",
        "price": Decimal("39.90"),
        "quantity": 20,
        "description": (
            "Jogo de cartas em que os participantes combinam cores e números para "
            "descartar suas cartas."
        ),
        "category": "Jogos de Cartas",
        "brand": "Mattel",
        "age_range": "7 anos ou mais",
    },
]


# Cadastra os brinquedos iniciais caso ainda não existam no banco.
def seed():
    db = SessionLocal()

    try:
        repository = ToyRepository(db)
        created = 0

        for toy_data in TOYS:
            if repository.get_by_name(toy_data["name"]):
                print(f"Já cadastrado: {toy_data['name']}")
                continue

            repository.create(**toy_data)
            created += 1
            print(f"Cadastrado: {toy_data['name']}")

        print(f"\nSeed finalizado: {created} brinquedo(s) cadastrado(s).")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed()
