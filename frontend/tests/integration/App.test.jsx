import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import App from "../../src/App";

it("cadastra um livro e o exibe na lista", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.type(screen.getByLabelText("Nome do livro"), "Dom Casmurro");
  await user.type(screen.getByLabelText("Autor"), "Machado de Assis");
  await user.type(screen.getByLabelText("Editora"), "Garnier");

  await user.click(screen.getByRole("button", { name: "Adicionar livro" }));

  expect(screen.getByText("Dom Casmurro")).toBeInTheDocument();
  expect(screen.getByText("Autor: Machado de Assis")).toBeInTheDocument();
  expect(screen.getByText("Editora: Garnier")).toBeInTheDocument();

  expect(
    screen.queryByText("Nenhum livro cadastrado."),
  ).not.toBeInTheDocument();
});
