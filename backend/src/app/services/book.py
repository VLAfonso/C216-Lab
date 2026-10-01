books = [
    {
        "id": 1,
        "name": "A Vida Invisível de Addie LaRue",
        "author": "V. E. Schwab",
        "publisher": "Galera Record",
    },
    {
        "id": 2,
        "name": "Amanhã, amanhã e ainda outro amanhã",
        "author": "A. J. Fikry",
        "publisher": "Rocco",
    },
]


def list_books():
    return books


def get_book(book_id: int):
    for book in books:
        if book["id"] == book_id:
            return book

    return None


def create_book(book_data):
    next_id = max((book["id"] for book in books), default=0) + 1

    book = {
        "id": next_id,
        "name": book_data.name,
        "author": book_data.author,
        "publisher": book_data.publisher,
    }

    books.append(book)

    return book


def update_book(book_id: int, book):
    existing_book = get_book(book_id)

    if existing_book is None:
        return None

    existing_book.update(book.model_dump())

    return existing_book


def patch_book(book_id: int, book):
    existing_book = get_book(book_id)

    if existing_book is None:
        return None

    existing_book.update(book.model_dump(exclude_unset=True))

    return existing_book


def delete_book(book_id: int):
    book = get_book(book_id)

    if book is None:
        return None

    books.remove(book)

    return book
