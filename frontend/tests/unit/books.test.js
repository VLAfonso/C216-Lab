import { afterEach, describe, expect, it, vi } from "vitest";
import { createBook, listBooks } from "../../src/services/books";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("books service", () => {
  it("lista os livros da API", async () => {
    const books = [
      {
        id: 1,
        name: "Dom Casmurro",
        author: "Machado de Assis",
        publisher: "Garnier",
      },
    ];

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => books,
      }),
    );

    await expect(listBooks()).resolves.toEqual(books);
  });

  it("cadastra um livro na API", async () => {
    const book = {
      id: 1,
      name: "Dom Casmurro",
      author: "Machado de Assis",
      publisher: "Garnier",
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => book,
    });

    vi.stubGlobal("fetch", fetchMock);

    await expect(
      createBook({
        name: book.name,
        author: book.author,
        publisher: book.publisher,
      }),
    ).resolves.toEqual(book);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/books/"),
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

    await expect(listBooks()).rejects.toThrow(
      "Não foi possível conectar à API.",
    );
  });

  it("exibe a mensagem enviada pela API quando ocorre um erro HTTP", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          detail: "Já existe um livro com esse nome!",
        }),
      }),
    );

    await expect(
      createBook({
        name: "Dom Casmurro",
        author: "Machado de Assis",
        publisher: "Garnier",
      }),
    ).rejects.toThrow("Já existe um livro com esse nome!");
  });
});
