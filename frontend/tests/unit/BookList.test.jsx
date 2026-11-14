import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { BookList } from "../../src/components/BookList";

it("exibe uma mensagem quando não existem livros", () => {
  render(<BookList books={[]} />);

  expect(screen.getByText("Nenhum livro cadastrado.")).toBeInTheDocument();
});

it("exibe os livros recebidos", () => {
  const books = [
    {
      id: 1,
      name: "Dom Casmurro",
      author: "Machado de Assis",
      publisher: "Garnier",
    },
  ];

  render(<BookList books={books} />);

  expect(screen.getByText("Dom Casmurro")).toBeInTheDocument();
  expect(screen.getByText("Autor: Machado de Assis")).toBeInTheDocument();
  expect(screen.getByText("Editora: Garnier")).toBeInTheDocument();
});
