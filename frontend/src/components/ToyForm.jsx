import { useState } from "react";
import { validateToy } from "../validation";

export function ToyForm({ onAdd }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [quantity, setQuantity] = useState("");
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
      await onAdd(result.values);

      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setBrand("");
      setAgeRange("");
      setQuantity("");
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
      className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="space-y-1">
        <label htmlFor="toy-name" className="block text-sm font-medium">
          Nome do brinquedo
        </label>
        <input
          id="toy-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={errors.name ? "toy-name-error" : undefined}
          className="w-full rounded border border-slate-300 p-2"
        />
        {errors.name && (
          <p id="toy-name-error" role="alert" className="text-sm text-red-700">
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="toy-description" className="block text-sm font-medium">
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
          className="w-full rounded border border-slate-300 p-2"
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
        <label htmlFor="toy-price" className="block text-sm font-medium">
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
          className="w-full rounded border border-slate-300 p-2"
        />
        {errors.price && (
          <p id="toy-price-error" role="alert" className="text-sm text-red-700">
            {errors.price}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="toy-category" className="block text-sm font-medium">
          Categoria
        </label>
        <input
          id="toy-category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-invalid={errors.category ? "true" : "false"}
          aria-describedby={errors.category ? "toy-category-error" : undefined}
          className="w-full rounded border border-slate-300 p-2"
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
        <label htmlFor="toy-brand" className="block text-sm font-medium">
          Marca
        </label>
        <input
          id="toy-brand"
          value={brand}
          onChange={(event) => setBrand(event.target.value)}
          aria-invalid={errors.brand ? "true" : "false"}
          aria-describedby={errors.brand ? "toy-brand-error" : undefined}
          className="w-full rounded border border-slate-300 p-2"
        />
        {errors.brand && (
          <p id="toy-brand-error" role="alert" className="text-sm text-red-700">
            {errors.brand}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="toy-age-range" className="block text-sm font-medium">
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
          className="w-full rounded border border-slate-300 p-2"
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
        <label htmlFor="toy-quantity" className="block text-sm font-medium">
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
          aria-describedby={errors.quantity ? "toy-quantity-error" : undefined}
          className="w-full rounded border border-slate-300 p-2"
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

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
      >
        {saving ? "Salvando..." : "Adicionar brinquedo"}
      </button>

      {submitError && (
        <p role="alert" className="text-sm text-red-700">
          {submitError}
        </p>
      )}
    </form>
  );
}
