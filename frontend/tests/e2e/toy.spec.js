import { expect, test } from "@playwright/test";

test("cadastra um brinquedo e ele persiste após recarregar a página", async ({
  page,
}) => {
  const name = `Brinquedo E2E ${Date.now()}`;

  await page.goto("/brinquedos/novo");

  await page.getByLabel("Nome do brinquedo").fill(name);
  await page.getByLabel("Descrição").fill("Brinquedo de teste E2E");
  await page.getByLabel("Preço").fill("49.90");
  await page.getByLabel("Categoria").fill("Blocos de Montar");
  await page.getByLabel("Marca").fill("LEGO");
  await page.getByLabel("Faixa etária").fill("6 a 12 anos");
  await page.getByLabel("Quantidade").fill("10");

  await page.getByRole("button", { name: "Adicionar brinquedo" }).click();

  await expect(page).toHaveURL(/\/brinquedos$/);

  const toy = page.getByRole("listitem").filter({ hasText: name });

  await expect(toy).toBeVisible();
  await expect(toy).toContainText("Brinquedo de teste E2E");
  await expect(toy).toContainText("49,90");
  await expect(toy).toContainText("Blocos de Montar");
  await expect(toy).toContainText("LEGO");
  await expect(toy).toContainText("6 a 12 anos");
  await expect(toy).toContainText("10");

  await expect(page.getByLabel("Nome do brinquedo")).toHaveCount(0);

  await page.reload();

  await expect(
    page.getByRole("listitem").filter({ hasText: name }),
  ).toBeVisible();
});

test("edita um brinquedo e as alterações persistem após recarregar a página", async ({
  page,
}) => {
  const name = `Brinquedo E2E ${Date.now()}`;
  const updatedName = `${name} Editado`;

  await page.goto("/brinquedos/novo");

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

  await toy.getByRole("link", { name: "Editar" }).click();

  await expect(page.getByLabel("Nome do brinquedo")).toHaveValue(name);

  await page.getByLabel("Nome do brinquedo").fill(updatedName);
  await page.getByLabel("Preço").fill("79.90");
  await page.getByLabel("Quantidade").fill("15");

  await page.getByRole("button", { name: "Salvar alterações" }).click();

  const updatedToy = page
    .getByRole("listitem")
    .filter({ hasText: updatedName });

  await expect(updatedToy).toBeVisible();
  await expect(updatedToy).toContainText("79,90");
  await expect(updatedToy).toContainText("15");

  await page.reload();

  await expect(
    page.getByRole("listitem").filter({ hasText: updatedName }),
  ).toBeVisible();
});


test("exclui um brinquedo e ele não aparece após recarregar a página", async ({
  page,
}) => {
  const name = `Brinquedo E2E ${Date.now()}`;

  await page.goto("/brinquedos/novo");

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

  page.on("dialog", (dialog) => dialog.accept());

  await toy.getByRole("button", { name: "Excluir" }).click();

  await expect(toy).toHaveCount(0);

  await page.reload();

  await expect(
    page.getByRole("listitem").filter({ hasText: name }),
  ).toHaveCount(0);
});
