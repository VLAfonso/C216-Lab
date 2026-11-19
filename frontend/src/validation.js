export const MAX_LENGTH = 255;

export function validateToy({
  name,
  description,
  price,
  category,
  brand,
  age_range,
  quantity,
}) {
  const errors = {};

  const trimmedName = name.trim();
  const trimmedDescription = description.trim();
  const trimmedCategory = category.trim();
  const trimmedBrand = brand.trim();
  const trimmedAgeRange = age_range.trim();

  if (!trimmedName) {
    errors.name = "O nome do brinquedo é obrigatório.";
  } else if (trimmedName.length > MAX_LENGTH) {
    errors.name = `O nome do brinquedo deve ter no máximo ${MAX_LENGTH} caracteres.`;
  }

  if (trimmedDescription.length > 1000) {
    errors.description = "A descrição deve ter no máximo 1000 caracteres.";
  }

  const numericPrice = Number(price);
  const priceParts = price.trim().split(".");

  if (!price.trim()) {
    errors.price = "O preço é obrigatório.";
  } else if (
    !Number.isFinite(numericPrice) ||
    numericPrice <= 0 ||
    !/^\d+(\.\d{1,2})?$/.test(price.trim()) ||
    priceParts[0].length > 8
  ) {
    errors.price =
      "Informe um preço válido, maior que zero e com até duas casas decimais.";
  }

  if (trimmedCategory.length > MAX_LENGTH) {
    errors.category = `A categoria deve ter no máximo ${MAX_LENGTH} caracteres.`;
  }

  if (trimmedBrand.length > MAX_LENGTH) {
    errors.brand = `A marca deve ter no máximo ${MAX_LENGTH} caracteres.`;
  }

  if (trimmedAgeRange.length > 50) {
    errors.age_range = "A faixa etária deve ter no máximo 50 caracteres.";
  }

  const numericQuantity = Number(quantity);

  if (!quantity.trim()) {
    errors.quantity = "A quantidade é obrigatória.";
  } else if (
    !Number.isInteger(numericQuantity) ||
    numericQuantity < 0 ||
    numericQuantity > 999999
  ) {
    errors.quantity =
      "A quantidade deve ser um número inteiro entre 0 e 999999.";
  }

  return {
    errors,
    values: {
      name: trimmedName,
      description: trimmedDescription || null,
      price: numericPrice,
      category: trimmedCategory || null,
      brand: trimmedBrand || null,
      age_range: trimmedAgeRange || null,
      quantity: numericQuantity,
    },
  };
}
