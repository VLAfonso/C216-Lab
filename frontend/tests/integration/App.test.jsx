import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import App from "../../src/App";

const toy = {
  id: 1,
  name: "Blocos de Montar",
  description: "Caixa com peças para montar construções.",
  price: "49.90",
  category: "Blocos de Montar",
  brand: "LEGO",
  age_range: "6 a 12 anos",
  quantity: 10,
};

function jsonResponse(data, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  };
}

function renderApp(initialEntry = "/brinquedos") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <App />
    </MemoryRouter>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

it("exibe o estado de carregamento", () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() => new Promise(() => {})),
  );

  renderApp();

  expect(screen.getByText("Carregando brinquedos...")).toBeInTheDocument();
});

it("carrega e exibe os brinquedos da API", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse([toy])));

  renderApp();

  expect(
    await screen.findByText(toy.name, { selector: "p.font-medium" }),
  ).toBeInTheDocument();
  expect(screen.getByText(`Descrição: ${toy.description}`)).toBeInTheDocument();
  expect(screen.getByText("Preço: R$ 49,90")).toBeInTheDocument();
  expect(screen.getByText(`Categoria: ${toy.category}`)).toBeInTheDocument();
  expect(screen.getByText(`Marca: ${toy.brand}`)).toBeInTheDocument();
  expect(
    screen.getByText(`Faixa etária: ${toy.age_range}`),
  ).toBeInTheDocument();
  expect(screen.getByText(`Quantidade: ${toy.quantity}`)).toBeInTheDocument();
});

it("exibe uma mensagem quando a lista está vazia", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse([])));

  renderApp();

  expect(
    await screen.findByText("Nenhum brinquedo cadastrado."),
  ).toBeInTheDocument();
});

it("exibe erro quando não consegue carregar os brinquedos", async () => {
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network Error")));

  renderApp();

  expect(
    await screen.findByText("Não foi possível conectar à API."),
  ).toBeInTheDocument();
});

it("cadastra um brinquedo e atualiza a lista", async () => {
  const user = userEvent.setup();

  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce(jsonResponse([]))
    .mockResolvedValueOnce(jsonResponse(toy, 201))
    .mockResolvedValueOnce(jsonResponse([toy]));

  vi.stubGlobal("fetch", fetchMock);

  renderApp();

  await user.click(screen.getByRole("link", { name: "Adicionar brinquedo" }));

  await user.type(screen.getByLabelText("Nome do brinquedo"), toy.name);
  await user.type(screen.getByLabelText("Descrição"), toy.description);
  await user.type(screen.getByLabelText("Preço"), "49.90");
  await user.type(screen.getByLabelText("Categoria"), toy.category);
  await user.type(screen.getByLabelText("Marca"), toy.brand);
  await user.type(screen.getByLabelText("Faixa etária"), toy.age_range);
  await user.type(screen.getByLabelText("Quantidade"), String(toy.quantity));

  await user.click(screen.getByRole("button", { name: "Adicionar brinquedo" }));

  expect(
    await screen.findByText(toy.name, { selector: "p.font-medium" }),
  ).toBeInTheDocument();
  expect(screen.getByText(`Descrição: ${toy.description}`)).toBeInTheDocument();
  expect(screen.getByText("Preço: R$ 49,90")).toBeInTheDocument();

  expect(fetchMock).toHaveBeenCalledTimes(3);
  expect(fetchMock.mock.calls[1][1].method).toBe("POST");
});

it("exibe erro ao cadastrar um brinquedo duplicado", async () => {
  const user = userEvent.setup();

  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce(jsonResponse([]))
    .mockResolvedValueOnce(
      jsonResponse({ detail: "Já existe um brinquedo com esse nome!" }, 409),
    );

  vi.stubGlobal("fetch", fetchMock);

  renderApp();

  await user.click(screen.getByRole("link", { name: "Adicionar brinquedo" }));

  await user.type(screen.getByLabelText("Nome do brinquedo"), toy.name);
  await user.type(screen.getByLabelText("Descrição"), toy.description);
  await user.type(screen.getByLabelText("Preço"), "49.90");
  await user.type(screen.getByLabelText("Categoria"), toy.category);
  await user.type(screen.getByLabelText("Marca"), toy.brand);
  await user.type(screen.getByLabelText("Faixa etária"), toy.age_range);
  await user.type(screen.getByLabelText("Quantidade"), String(toy.quantity));

  await user.click(screen.getByRole("button", { name: "Adicionar brinquedo" }));

  expect(
    await screen.findByText("Já existe um brinquedo com esse nome!"),
  ).toBeInTheDocument();

  expect(screen.getByLabelText("Nome do brinquedo")).toHaveValue(toy.name);
  expect(screen.getByLabelText("Descrição")).toHaveValue(toy.description);
  expect(screen.getByLabelText("Preço")).toHaveValue(49.9);
  expect(screen.getByLabelText("Categoria")).toHaveValue(toy.category);
  expect(screen.getByLabelText("Marca")).toHaveValue(toy.brand);
  expect(screen.getByLabelText("Faixa etária")).toHaveValue(toy.age_range);
  expect(screen.getByLabelText("Quantidade")).toHaveValue(10);
});

it("carrega os dados do brinquedo no formulário de edição", async () => {
  const fetchMock = vi.fn().mockResolvedValueOnce(jsonResponse(toy));

  vi.stubGlobal("fetch", fetchMock);

  renderApp("/brinquedos/1/editar");

  expect(await screen.findByLabelText("Nome do brinquedo")).toHaveValue(
    toy.name,
  );

  expect(screen.getByLabelText("Descrição")).toHaveValue(toy.description);
  expect(screen.getByLabelText("Preço")).toHaveValue(49.9);
  expect(screen.getByLabelText("Categoria")).toHaveValue(toy.category);
  expect(screen.getByLabelText("Marca")).toHaveValue(toy.brand);
  expect(screen.getByLabelText("Faixa etária")).toHaveValue(toy.age_range);
  expect(screen.getByLabelText("Quantidade")).toHaveValue(10);

  expect(fetchMock).toHaveBeenCalledWith(
    "http://localhost:8000/toys/1",
    undefined,
  );
});

it("atualiza um brinquedo e retorna à listagem", async () => {
  const user = userEvent.setup();

  const updatedToy = { ...toy, name: "Blocos Atualizados" };

  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce(jsonResponse(toy))
    .mockResolvedValueOnce(jsonResponse(updatedToy))
    .mockResolvedValueOnce(jsonResponse([updatedToy]));

  vi.stubGlobal("fetch", fetchMock);

  renderApp("/brinquedos/1/editar");

  const nameInput = await screen.findByLabelText("Nome do brinquedo");

  await user.clear(nameInput);
  await user.type(nameInput, updatedToy.name);

  await user.click(screen.getByRole("button", { name: "Salvar alterações" }));

  expect(
    await screen.findByText(updatedToy.name, {
      selector: "p.font-medium",
    }),
  ).toBeInTheDocument();

  expect(fetchMock).toHaveBeenCalledTimes(3);
  expect(fetchMock.mock.calls[1][0]).toBe("http://localhost:8000/toys/1");
  expect(fetchMock.mock.calls[1][1].method).toBe("PUT");
});

it("exibe erro ao tentar editar um brinquedo inexistente", async () => {
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValue(
        jsonResponse({ detail: "Brinquedo não encontrado!" }, 404),
      ),
  );

  renderApp("/brinquedos/9999/editar");

  expect(
    await screen.findByText("Brinquedo não encontrado!"),
  ).toBeInTheDocument();

  expect(screen.queryByLabelText("Nome do brinquedo")).not.toBeInTheDocument();
});


it("não exclui um brinquedo quando a confirmação é cancelada", async () => {
  const user = userEvent.setup();

  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce(jsonResponse([toy]));

  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(window, "confirm").mockReturnValue(false);

  renderApp();

  expect(
    await screen.findByText(toy.name, { selector: "p.font-medium" }),
  ).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Excluir" }));

  expect(window.confirm).toHaveBeenCalledWith(
    `Deseja realmente excluir "${toy.name}"?`,
  );

  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(
    screen.getByText(toy.name, { selector: "p.font-medium" }),
  ).toBeInTheDocument();
});

it("exclui um brinquedo e atualiza a lista", async () => {
  const user = userEvent.setup();

  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce(jsonResponse([toy]))
    .mockResolvedValueOnce(jsonResponse(null, 204));

  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(window, "confirm").mockReturnValue(true);

  renderApp();

  expect(
    await screen.findByText(toy.name, { selector: "p.font-medium" }),
  ).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Excluir" }));

  expect(
    await screen.findByText("Nenhum brinquedo cadastrado."),
  ).toBeInTheDocument();

  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(fetchMock.mock.calls[1][0]).toBe(
    "http://localhost:8000/toys/1",
  );
  expect(fetchMock.mock.calls[1][1].method).toBe("DELETE");
});

it("exibe erro quando não consegue excluir um brinquedo", async () => {
  const user = userEvent.setup();

  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce(jsonResponse([toy]))
    .mockResolvedValueOnce(
      jsonResponse({ detail: "Erro ao excluir o brinquedo." }, 500),
    );

  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(window, "confirm").mockReturnValue(true);

  renderApp();

  expect(
    await screen.findByText(toy.name, { selector: "p.font-medium" }),
  ).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Excluir" }));

  expect(
    await screen.findByText("Erro ao excluir o brinquedo."),
  ).toBeInTheDocument();

  expect(
    screen.getByText(toy.name, { selector: "p.font-medium" }),
  ).toBeInTheDocument();

  expect(fetchMock).toHaveBeenCalledTimes(2);
});
