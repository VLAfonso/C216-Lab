import { afterEach, describe, expect, it, vi } from "vitest";
import { createToy, listToys } from "../../src/services/toys";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("toys service", () => {
  it("lista os brinquedos da API", async () => {
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

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => toys,
      }),
    );

    await expect(listToys()).resolves.toEqual(toys);
  });

  it("cadastra um brinquedo na API", async () => {
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

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => toy,
    });

    vi.stubGlobal("fetch", fetchMock);

    await expect(
      createToy({
        name: toy.name,
        description: toy.description,
        price: 49.9,
        category: toy.category,
        brand: toy.brand,
        age_range: toy.age_range,
        quantity: toy.quantity,
      }),
    ).resolves.toEqual(toy);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/toys/"),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    );
  });

  it("lança erro quando não consegue conectar à API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network Error")),
    );

    await expect(listToys()).rejects.toThrow(
      "Não foi possível conectar à API.",
    );
  });

  it("exibe a mensagem enviada pela API quando ocorre um erro HTTP", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          detail: "Já existe um brinquedo com esse nome!",
        }),
      }),
    );

    await expect(
      createToy({
        name: "Blocos de Montar",
        price: 49.9,
        quantity: 10,
      }),
    ).rejects.toThrow("Já existe um brinquedo com esse nome!");
  });
});
