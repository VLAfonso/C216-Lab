import { useEffect, useState } from "react";
import { BookForm } from "./components/BookForm";
import { BookList } from "./components/BookList";
import { createBook, listBooks } from "./services/books";

export default function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    listBooks()
      .then(setBooks)
      .catch((error) => setLoadError(error.message))
      .finally(() => setLoading(false));
  }, []);

  async function addBook(values) {
    const created = await createBook(values);
    setBooks((current) => [...current, created]);
  }

  return (
    <main className="mx-auto min-h-screen max-w-xl space-y-6 p-4 sm:p-6">
      <h1 className="text-3xl font-bold">Gerenciador de Livros</h1>

      <BookForm onAdd={addBook} />

      <section aria-labelledby="books-heading" className="space-y-3">
        <h2 id="books-heading" className="text-xl font-semibold">
          Livros cadastrados
        </h2>

        {loading && <p>Carregando livros...</p>}

        {loadError && <p role="alert">{loadError}</p>}

        {!loading && !loadError && <BookList books={books} />}
      </section>
    </main>
  );
}
