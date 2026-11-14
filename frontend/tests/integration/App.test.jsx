import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import App from "../../src/App";

const book = {
  id: 1,
  name: "Dom Casmurro",
  author: "Machado de Assis",
  publisher: "Garnier",
};

function jsonResponse(data, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

it("exibe o estado de carregamento", () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() => new Promise(() => {})),
  );

  render(<App />);

  expect(screen.getByText("Carregando livros...")).toBeInTheDocument();
});

it("carrega e exibe os livros da API", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse([book])));

  render(<App />);

  expect(await screen.findByText("Dom Casmurro")).toBeInTheDocument();
  expect(screen.getByText("Autor: Machado de Assis")).toBeInTheDocument();
  expect(screen.getByText("Editora: Garnier")).toBeInTheDocument();
});

it("exibe uma mensagem quando a lista está vazia", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse([])));

  render(<App />);

  expect(
    await screen.findByText("Nenhum livro cadastrado."),
  ).toBeInTheDocument();
});

it("exibe erro quando não consegue carregar os livros", async () => {
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network Error")));

  render(<App />);

  expect(
    await screen.findByText("Não foi possível conectar à API."),
  ).toBeInTheDocument();
});

it("cadastra um livro e atualiza a lista", async () => {
  const user = userEvent.setup();

  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce(jsonResponse([]))
    .mockResolvedValueOnce(jsonResponse(book, 201));

  vi.stubGlobal("fetch", fetchMock);

  render(<App />);

  await user.type(screen.getByLabelText("Nome do livro"), book.name);
  await user.type(screen.getByLabelText("Autor"), book.author);
  await user.type(screen.getByLabelText("Editora"), book.publisher);

  await user.click(screen.getByRole("button", { name: "Adicionar livro" }));

  expect(await screen.findByText("Dom Casmurro")).toBeInTheDocument();
  expect(screen.getByText("Autor: Machado de Assis")).toBeInTheDocument();
  expect(screen.getByText("Editora: Garnier")).toBeInTheDocument();

  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(fetchMock.mock.calls[1][1].method).toBe("POST");
});

it("exibe erro ao cadastrar um livro duplicado", async () => {
  const user = userEvent.setup();

  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce(jsonResponse([]))
    .mockResolvedValueOnce(
      jsonResponse({ detail: "Já existe um livro com esse nome!" }, 409),
    );

  vi.stubGlobal("fetch", fetchMock);

  render(<App />);

  await user.type(screen.getByLabelText("Nome do livro"), book.name);
  await user.type(screen.getByLabelText("Autor"), book.author);
  await user.type(screen.getByLabelText("Editora"), book.publisher);

  await user.click(screen.getByRole("button", { name: "Adicionar livro" }));

  expect(
    await screen.findByText("Já existe um livro com esse nome!"),
  ).toBeInTheDocument();

  expect(screen.getByLabelText("Nome do livro")).toHaveValue(book.name);
  expect(screen.getByLabelText("Autor")).toHaveValue(book.author);
  expect(screen.getByLabelText("Editora")).toHaveValue(book.publisher);
});
