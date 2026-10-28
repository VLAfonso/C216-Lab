import { useState } from "react";
import { BookForm } from "./components/BookForm";
import { BookList } from "./components/BookList";

export default function App() {
  const [books, setBooks] = useState([]);

  // Na Prática 7, esta função passará a chamar a API (POST /books).
  function addBook({ name, author, publisher }) {
    setBooks((current) => [
      ...current,
      { id: crypto.randomUUID(), name, author, publisher },
    ]);
  }

  return (
    <main className="mx-auto min-h-screen max-w-xl space-y-6 p-4 sm:p-6">
      <h1 className="text-3xl font-bold">Gerenciador de Livros</h1>

      <BookForm onAdd={addBook} />

      <section aria-labelledby="books-heading" className="space-y-3">
        <h2 id="books-heading" className="text-xl font-semibold">
          Livros cadastrados
        </h2>
        <BookList books={books} />
      </section>
    </main>
  );
}
