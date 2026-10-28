import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { BookForm } from "../../src/components/BookForm";

it("mostra erro e não chama onAdd com nome vazio", async () => {
  const user = userEvent.setup();
  const onAdd = vi.fn();
  render(<BookForm onAdd={onAdd} />);

  await user.type(screen.getByLabelText("Autor"), "Machado de Assis");
  await user.type(screen.getByLabelText("Editora"), "Garnier");

  await user.click(screen.getByRole("button", { name: "Adicionar livro" }));

  expect(screen.getByRole("alert")).toHaveTextContent(
    "O nome do livro é obrigatório.",
  );
  expect(onAdd).not.toHaveBeenCalled();
});

it("mostra erro e não chama onAdd com autor vazio", async () => {
  const user = userEvent.setup();
  const onAdd = vi.fn();
  render(<BookForm onAdd={onAdd} />);

  await user.type(screen.getByLabelText("Nome do livro"), "Dom Casmurro");
  await user.type(screen.getByLabelText("Editora"), "Garnier");

  await user.click(screen.getByRole("button", { name: "Adicionar livro" }));

  expect(screen.getByRole("alert")).toHaveTextContent("O autor é obrigatório.");
  expect(onAdd).not.toHaveBeenCalled();
});

it("mostra erro e não chama onAdd com editora vazia", async () => {
  const user = userEvent.setup();
  const onAdd = vi.fn();
  render(<BookForm onAdd={onAdd} />);

  await user.type(screen.getByLabelText("Nome do livro"), "Dom Casmurro");
  await user.type(screen.getByLabelText("Autor"), "Machado de Assis");

  await user.click(screen.getByRole("button", { name: "Adicionar livro" }));

  expect(screen.getByRole("alert")).toHaveTextContent(
    "A editora é obrigatória.",
  );
  expect(onAdd).not.toHaveBeenCalled();
});
