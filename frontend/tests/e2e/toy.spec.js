import { expect, test } from "@playwright/test";

test("cadastra um brinquedo e ele persiste após recarregar a página", async ({
  page,
}) => {
  const name = `Brinquedo E2E ${Date.now()}`;

  await page.goto("/");

  await page.getByLabel("Nome do brinquedo").fill(name);
  await page.getByLabel("Descrição").fill("Brinquedo de teste E2E");
  await page.getByLabel("Preço").fill("49.90");
  await page.getByLabel("Categoria").fill("Blocos de Montar");
  await page.getByLabel("Marca").fill("LEGO");
  await page.getByLabel("Faixa etária").fill("6 a 12 anos");
  await page.getByLabel("Quantidade").fill("10");

  await page.getByRole("button", { name: "Adicionar brinquedo" }).click();

  const toy = page.getByRole("listitem").filter({ hasText: name });

  await expect(toy).toBeVisible();
  await expect(toy).toContainText("Brinquedo de teste E2E");
  await expect(toy).toContainText("49,90");
  await expect(toy).toContainText("Blocos de Montar");
  await expect(toy).toContainText("LEGO");
  await expect(toy).toContainText("6 a 12 anos");
  await expect(toy).toContainText("10");

  await expect(page.getByLabel("Nome do brinquedo")).toHaveValue("");

  await page.reload();

  await expect(
    page.getByRole("listitem").filter({ hasText: name }),
  ).toBeVisible();
});
