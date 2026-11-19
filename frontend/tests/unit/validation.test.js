import { describe, expect, it } from "vitest";
import { validateToy } from "../../src/validation";

describe("validateToy", () => {
  it("rejeita nome vazio ou só com espaços", () => {
    const { errors } = validateToy({
      name: "   ",
      description: "",
      price: "49.90",
      category: "Blocos de Montar",
      brand: "LEGO",
      age_range: "6 a 12 anos",
      quantity: "10",
    });

    expect(errors.name).toBeDefined();
  });

  it("rejeita preço vazio ou só com espaços", () => {
    const { errors } = validateToy({
      name: "Blocos de Montar",
      description: "",
      price: "   ",
      category: "Blocos de Montar",
      brand: "LEGO",
      age_range: "6 a 12 anos",
      quantity: "10",
    });

    expect(errors.price).toBeDefined();
  });

  it("rejeita quantidade vazia ou só com espaços", () => {
    const { errors } = validateToy({
      name: "Blocos de Montar",
      description: "",
      price: "49.90",
      category: "Blocos de Montar",
      brand: "LEGO",
      age_range: "6 a 12 anos",
      quantity: "   ",
    });

    expect(errors.quantity).toBeDefined();
  });
});
