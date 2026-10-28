import { expect, test } from "@playwright/test";

test("cadastra um livro e o exibe na listagem", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Nome do livro").fill("Dom Casmurro");
  await page.getByLabel("Autor").fill("Machado de Assis");
  await page.getByLabel("Editora").fill("Garnier");
  await page.getByRole("button", { name: "Adicionar livro" }).click();

  await expect(page.getByRole("listitem")).toContainText("Dom Casmurro");
  await expect(page.getByText("Autor: Machado de Assis")).toBeVisible();
  await expect(page.getByText("Editora: Garnier")).toBeVisible();

  await expect(page.getByText("Nenhum livro cadastrado.")).toBeHidden();
});
