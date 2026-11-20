import { render, screen, within } from "@testing-library/react";
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

const toys = [
  {
    id: 1,
    name: "Boneca Barbie",
    description: "Boneca articulada.",
    price: "129.90",
    category: "Bonecas",
    brand: "Barbie",
    age_range: "3 a 8 anos",
    quantity: 5,
  },
  {
    id: 2,
    name: "Carro Hot Wheels",
    description: "Carrinho em miniatura.",
    price: "19.90",
    category: "Carrinhos",
    brand: "Hot Wheels",
    age_range: "5 a 10 anos",
    quantity: 30,
  },
  {
    id: 3,
    name: "Blocos de Montar",
    description: "Caixa com peças para montar.",
    price: "49.90",
    category: "Blocos",
    brand: "LEGO",
    age_range: "6 a 12 anos",
    quantity: 10,
  },
];

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

function expectToyOrder(expectedNames) {
  const list = screen.getByRole("list");
  const items = within(list).getAllByRole("listitem");

  expect(items).toHaveLength(expectedNames.length);

  expectedNames.forEach((name, index) => {
    expect(
      within(items[index]).getByText(name, { selector: "p" }),
    ).toBeInTheDocument();
  });
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
    await screen.findByText(toy.name, { selector: "p.font-semibold" }),
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
    await screen.findByText(toy.name, { selector: "p.font-semibold" }),
  ).toBeInTheDocument();
  expect(screen.getByText(`Descrição: ${toy.description}`)).toBeInTheDocument();
  expect(screen.getByText("Preço: R$ 49,90")).toBeInTheDocument();

  expect(screen.getByRole("status")).toHaveTextContent(
    "Brinquedo cadastrado com sucesso!",
  );

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
      selector: "p.font-semibold",
    }),
  ).toBeInTheDocument();

  expect(screen.getByRole("status")).toHaveTextContent(
    "Brinquedo atualizado com sucesso!",
  );

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

  const fetchMock = vi.fn().mockResolvedValueOnce(jsonResponse([toy]));

  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(window, "confirm").mockReturnValue(false);

  renderApp();

  expect(
    await screen.findByText(toy.name, { selector: "p.font-semibold" }),
  ).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Excluir" }));

  expect(window.confirm).toHaveBeenCalledWith(
    `Deseja realmente excluir "${toy.name}"?`,
  );

  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(
    screen.getByText(toy.name, { selector: "p.font-semibold" }),
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
    await screen.findByText(toy.name, { selector: "p.font-semibold" }),
  ).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Excluir" }));

  expect(
    await screen.findByText("Nenhum brinquedo cadastrado."),
  ).toBeInTheDocument();

  expect(screen.getByRole("status")).toHaveTextContent(
    "Brinquedo excluído com sucesso!",
  );

  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(fetchMock.mock.calls[1][0]).toBe("http://localhost:8000/toys/1");
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
    await screen.findByText(toy.name, { selector: "p.font-semibold" }),
  ).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Excluir" }));

  expect(
    await screen.findByText("Erro ao excluir o brinquedo."),
  ).toBeInTheDocument();

  expect(screen.queryByRole("status")).not.toBeInTheDocument();

  expect(
    screen.getByText(toy.name, { selector: "p.font-semibold" }),
  ).toBeInTheDocument();

  expect(fetchMock).toHaveBeenCalledTimes(2);
});

it("filtra os brinquedos pelo nome", async () => {
  const user = userEvent.setup();

  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(toys)));

  renderApp();

  await screen.findByText("Boneca Barbie", {
    selector: "p.font-semibold",
  });

  await user.type(screen.getByLabelText("Pesquisar"), "Barbie");

  expectToyOrder(["Boneca Barbie"]);
});

it("filtra os brinquedos pela marca", async () => {
  const user = userEvent.setup();

  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(toys)));

  renderApp();

  await screen.findByText("Boneca Barbie", {
    selector: "p.font-semibold",
  });

  await user.type(screen.getByLabelText("Pesquisar"), "LEGO");

  expectToyOrder(["Blocos de Montar"]);
});

it("filtra os brinquedos pela categoria pesquisada", async () => {
  const user = userEvent.setup();

  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(toys)));

  renderApp();

  await screen.findByText("Boneca Barbie", {
    selector: "p.font-semibold",
  });

  await user.type(screen.getByLabelText("Pesquisar"), "Carrinhos");

  expectToyOrder(["Carro Hot Wheels"]);
});

it("filtra os brinquedos pela categoria selecionada", async () => {
  const user = userEvent.setup();

  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(toys)));

  renderApp();

  await screen.findByText("Boneca Barbie", {
    selector: "p.font-semibold",
  });

  await user.selectOptions(screen.getByLabelText("Categoria"), "Bonecas");

  expectToyOrder(["Boneca Barbie"]);
});

it("ordena os brinquedos pelo nome", async () => {
  const user = userEvent.setup();

  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(toys)));

  renderApp();

  await screen.findByText("Boneca Barbie", {
    selector: "p.font-semibold",
  });

  await user.selectOptions(screen.getByLabelText("Ordenar por"), "name");

  expectToyOrder(["Blocos de Montar", "Boneca Barbie", "Carro Hot Wheels"]);
});

it("ordena os brinquedos pelo menor preço", async () => {
  const user = userEvent.setup();

  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(toys)));

  renderApp();

  await screen.findByText("Boneca Barbie", {
    selector: "p.font-semibold",
  });

  await user.selectOptions(screen.getByLabelText("Ordenar por"), "price");

  expectToyOrder(["Carro Hot Wheels", "Blocos de Montar", "Boneca Barbie"]);
});

it("ordena os brinquedos pela menor quantidade em estoque", async () => {
  const user = userEvent.setup();

  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(toys)));

  renderApp();

  await screen.findByText("Boneca Barbie", {
    selector: "p.font-semibold",
  });

  await user.selectOptions(screen.getByLabelText("Ordenar por"), "quantity");

  expectToyOrder(["Boneca Barbie", "Blocos de Montar", "Carro Hot Wheels"]);
});

it("combina a pesquisa com o filtro de categoria", async () => {
  const user = userEvent.setup();

  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(toys)));

  renderApp();

  await screen.findByText("Boneca Barbie", {
    selector: "p.font-semibold",
  });

  await user.type(screen.getByLabelText("Pesquisar"), "a");

  await user.selectOptions(screen.getByLabelText("Categoria"), "Carrinhos");

  expectToyOrder(["Carro Hot Wheels"]);
});

it("exibe mensagem quando a busca não encontra brinquedos", async () => {
  const user = userEvent.setup();

  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(toys)));

  renderApp();

  await screen.findByText("Boneca Barbie");

  await user.type(screen.getByLabelText("Pesquisar"), "Inexistente");

  expect(
    screen.getByText(
      "Nenhum brinquedo encontrado com os filtros selecionados.",
    ),
  ).toBeInTheDocument();
});

it("realiza busca sem diferenciar letras maiúsculas e minúsculas", async () => {
  const user = userEvent.setup();

  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(toys)));

  renderApp();

  await screen.findByText("Boneca Barbie");

  await user.type(screen.getByLabelText("Pesquisar"), "bArBiE");

  expect(screen.getByText("Boneca Barbie")).toBeInTheDocument();
  expect(screen.queryByText("Carro Hot Wheels")).not.toBeInTheDocument();
  expect(screen.queryByText("Blocos de Montar")).not.toBeInTheDocument();
});
