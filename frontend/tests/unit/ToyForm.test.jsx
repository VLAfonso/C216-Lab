import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { ToyForm } from "../../src/components/ToyForm";

it("mostra erro e não chama onSubmit com nome vazio", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(<ToyForm onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText("Preço"), "49.90");
  await user.type(screen.getByLabelText("Quantidade"), "10");

  await user.click(screen.getByRole("button", { name: "Adicionar brinquedo" }));

  expect(screen.getByRole("alert")).toHaveTextContent(
    "O nome do brinquedo é obrigatório.",
  );
  expect(onSubmit).not.toHaveBeenCalled();
});

it("mostra erro e não chama onSubmit com preço vazio", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(<ToyForm onSubmit={onSubmit} />);

  await user.type(
    screen.getByLabelText("Nome do brinquedo"),
    "Blocos de Montar",
  );
  await user.type(screen.getByLabelText("Quantidade"), "10");

  await user.click(screen.getByRole("button", { name: "Adicionar brinquedo" }));

  expect(screen.getByRole("alert")).toHaveTextContent("O preço é obrigatório.");
  expect(onSubmit).not.toHaveBeenCalled();
});

it("mostra erro e não chama onSubmit com quantidade vazia", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(<ToyForm onSubmit={onSubmit} />);

  await user.type(
    screen.getByLabelText("Nome do brinquedo"),
    "Blocos de Montar",
  );
  await user.type(screen.getByLabelText("Preço"), "49.90");

  await user.click(screen.getByRole("button", { name: "Adicionar brinquedo" }));

  expect(screen.getByRole("alert")).toHaveTextContent(
    "A quantidade é obrigatória.",
  );
  expect(onSubmit).not.toHaveBeenCalled();
});
