import { describe, expect, it } from "vitest";
import { validateBook } from "../../src/validation";

describe("validateBook", () => {
  it("rejeita nome vazio ou só com espaços", () => {
    const { errors } = validateBook({
      name: "   ",
      author: "Machado de Assis",
      publisher: "Garnier",
    });

    expect(errors.name).toBeDefined();
  });

  it("rejeita autor vazio ou só com espaços", () => {
    const { errors } = validateBook({
      name: "Dom Casmurro",
      author: "   ",
      publisher: "Garnier",
    });

    expect(errors.author).toBeDefined();
  });

  it("rejeita editora vazia ou só com espaços", () => {
    const { errors } = validateBook({
      name: "Dom Casmurro",
      author: "Machado de Assis",
      publisher: "   ",
    });

    expect(errors.publisher).toBeDefined();
  });
});
