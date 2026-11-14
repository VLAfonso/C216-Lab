import { expect, test } from "@playwright/test";

test("cadastra um livro e ele persiste após recarregar a página", async ({
  page,
}) => {
  const name = `Livro E2E ${Date.now()}`;

  await page.goto("/");

  await page.getByLabel("Nome do livro").fill(name);
  await page.getByLabel("Autor").fill("Machado de Assis");
  await page.getByLabel("Editora").fill("Garnier");

  await page.getByRole("button", { name: "Adicionar livro" }).click();

  const book = page.getByRole("listitem").filter({ hasText: name });

  await expect(book).toBeVisible();
  await expect(book).toContainText("Machado de Assis");
  await expect(book).toContainText("Garnier");

  await page.reload();

  await expect(
    page.getByRole("listitem").filter({ hasText: name }),
  ).toBeVisible();
});
