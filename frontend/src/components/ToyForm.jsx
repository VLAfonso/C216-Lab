import { useState } from "react";
import { validateToy } from "../validation";

export function ToyForm({
  initialValues = {},
  onSubmit,
  submitLabel = "Adicionar brinquedo",
}) {
  const [name, setName] = useState(initialValues.name ?? "");
  const [description, setDescription] = useState(
    initialValues.description ?? "",
  );
  const [price, setPrice] = useState(
    initialValues.price != null ? String(initialValues.price) : "",
  );
  const [category, setCategory] = useState(initialValues.category ?? "");
  const [brand, setBrand] = useState(initialValues.brand ?? "");
  const [ageRange, setAgeRange] = useState(initialValues.age_range ?? "");
  const [quantity, setQuantity] = useState(
    initialValues.quantity != null ? String(initialValues.quantity) : "",
  );
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const result = validateToy({
      name,
      description,
      price,
      category,
      brand,
      age_range: ageRange,
      quantity,
    });

    setErrors(result.errors);

    if (Object.keys(result.errors).length > 0) return;

    setSaving(true);
    setSubmitError("");

    try {
      await onSubmit(result.values);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="grid gap-5">
        <div className="space-y-1">
          <label
            htmlFor="toy-name"
            className="block text-sm font-medium text-slate-700"
          >
            Nome do brinquedo
          </label>
          <input
            id="toy-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "toy-name-error" : undefined}
            className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-700 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
          {errors.name && (
            <p
              id="toy-name-error"
              role="alert"
              className="text-sm text-red-700"
            >
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="toy-description"
            className="block text-sm font-medium text-slate-700"
          >
            Descrição
          </label>
          <textarea
            id="toy-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            aria-invalid={errors.description ? "true" : "false"}
            aria-describedby={
              errors.description ? "toy-description-error" : undefined
            }
            className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-700 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            rows={3}
          />
          {errors.description && (
            <p
              id="toy-description-error"
              role="alert"
              className="text-sm text-red-700"
            >
              {errors.description}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="toy-price"
            className="block text-sm font-medium text-slate-700"
          >
            Preço
          </label>
          <input
            id="toy-price"
            type="number"
            min="0.01"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            aria-invalid={errors.price ? "true" : "false"}
            aria-describedby={errors.price ? "toy-price-error" : undefined}
            className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-700 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
          {errors.price && (
            <p
              id="toy-price-error"
              role="alert"
              className="text-sm text-red-700"
            >
              {errors.price}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="toy-category"
            className="block text-sm font-medium text-slate-700"
          >
            Categoria
          </label>
          <input
            id="toy-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-invalid={errors.category ? "true" : "false"}
            aria-describedby={
              errors.category ? "toy-category-error" : undefined
            }
            className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-700 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
          {errors.category && (
            <p
              id="toy-category-error"
              role="alert"
              className="text-sm text-red-700"
            >
              {errors.category}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="toy-brand"
            className="block text-sm font-medium text-slate-700"
          >
            Marca
          </label>
          <input
            id="toy-brand"
            value={brand}
            onChange={(event) => setBrand(event.target.value)}
            aria-invalid={errors.brand ? "true" : "false"}
            aria-describedby={errors.brand ? "toy-brand-error" : undefined}
            className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-700 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
          {errors.brand && (
            <p
              id="toy-brand-error"
              role="alert"
              className="text-sm text-red-700"
            >
              {errors.brand}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="toy-age-range"
            className="block text-sm font-medium text-slate-700"
          >
            Faixa etária
          </label>
          <input
            id="toy-age-range"
            value={ageRange}
            onChange={(event) => setAgeRange(event.target.value)}
            aria-invalid={errors.age_range ? "true" : "false"}
            aria-describedby={
              errors.age_range ? "toy-age-range-error" : undefined
            }
            className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-700 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
          {errors.age_range && (
            <p
              id="toy-age-range-error"
              role="alert"
              className="text-sm text-red-700"
            >
              {errors.age_range}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="toy-quantity"
            className="block text-sm font-medium text-slate-700"
          >
            Quantidade
          </label>
          <input
            id="toy-quantity"
            type="number"
            min="0"
            step="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            aria-invalid={errors.quantity ? "true" : "false"}
            aria-describedby={
              errors.quantity ? "toy-quantity-error" : undefined
            }
            className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-700 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
          {errors.quantity && (
            <p
              id="toy-quantity-error"
              role="alert"
              className="text-sm text-red-700"
            >
              {errors.quantity}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-lg bg-slate-700 px-4 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {saving ? "Salvando..." : submitLabel}
      </button>

      {submitError && (
        <p role="alert" className="text-sm text-red-700">
          {submitError}
        </p>
      )}
    </form>
  );
}
