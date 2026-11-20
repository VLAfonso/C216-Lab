import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import { ToyList } from "../../src/components/ToyList";

it("exibe uma mensagem quando não existem brinquedos", () => {
  render(
    <MemoryRouter>
      <ToyList toys={[]} />
    </MemoryRouter>,
  );

  expect(screen.getByText("Nenhum brinquedo cadastrado.")).toBeInTheDocument();
});

it("exibe os brinquedos recebidos", () => {
  const toys = [
    {
      id: 1,
      name: "Blocos de Montar",
      description: "Caixa com peças para montar construções.",
      price: "49.90",
      category: "Blocos de Montar",
      brand: "LEGO",
      age_range: "6 a 12 anos",
      quantity: 10,
    },
  ];

  render(
    <MemoryRouter>
      <ToyList toys={toys} />
    </MemoryRouter>,
  );

  expect(screen.getByText("Blocos de Montar")).toBeInTheDocument();
  expect(
    screen.getByText(`Descrição: ${toys[0].description}`),
  ).toBeInTheDocument();
  expect(screen.getByText("Preço: R$ 49,90")).toBeInTheDocument();
  expect(screen.getByText("Categoria: Blocos de Montar")).toBeInTheDocument();
  expect(screen.getByText("Marca: LEGO")).toBeInTheDocument();
  expect(screen.getByText("Faixa etária: 6 a 12 anos")).toBeInTheDocument();
  expect(screen.getByText("Quantidade: 10")).toBeInTheDocument();
});
