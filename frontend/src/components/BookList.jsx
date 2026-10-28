export function BookList({ books }) {
  if (books.length === 0) {
    return <p className="text-slate-600">Nenhum livro cadastrado.</p>;
  }

  return (
    <ul className="space-y-2">
      {books.map((book) => (
        <li
          key={book.id}
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
        >
          <p className="font-medium">{book.name}</p>
          <p className="text-sm text-slate-600">Autor: {book.author}</p>
          <p className="text-sm text-slate-600">Editora: {book.publisher}</p>
        </li>
      ))}
    </ul>
  );
}
