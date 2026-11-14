import { useState } from "react";
import { validateBook } from "../validation";

export function BookForm({ onAdd }) {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const result = validateBook({ name, author, publisher });
    setErrors(result.errors);

    if (Object.keys(result.errors).length > 0) return;

    setSaving(true);
    setSubmitError("");

    try {
      await onAdd(result.values);

      setName("");
      setAuthor("");
      setPublisher("");
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
        <label htmlFor="book-name" className="block text-sm font-medium">
          Nome do livro
        </label>
        <input
          id="book-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={errors.name ? "book-name-error" : undefined}
          className="w-full rounded border border-slate-300 p-2"
        />
        {errors.name && (
          <p id="book-name-error" role="alert" className="text-sm text-red-700">
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="book-author" className="block text-sm font-medium">
          Autor
        </label>
        <input
          id="book-author"
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          aria-invalid={errors.author ? "true" : "false"}
          aria-describedby={errors.author ? "book-author-error" : undefined}
          className="w-full rounded border border-slate-300 p-2"
        />
        {errors.author && (
          <p
            id="book-author-error"
            role="alert"
            className="text-sm text-red-700"
          >
            {errors.author}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="book-publisher" className="block text-sm font-medium">
          Editora
        </label>
        <input
          id="book-publisher"
          value={publisher}
          onChange={(event) => setPublisher(event.target.value)}
          aria-invalid={errors.publisher ? "true" : "false"}
          aria-describedby={
            errors.publisher ? "book-publisher-error" : undefined
          }
          className="w-full rounded border border-slate-300 p-2"
        />
        {errors.publisher && (
          <p
            id="book-publisher-error"
            role="alert"
            className="text-sm text-red-700"
          >
            {errors.publisher}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
      >
        {saving ? "Salvando..." : "Adicionar livro"}
      </button>

      {submitError && (
        <p role="alert" className="text-sm text-red-700">
          {submitError}
        </p>
      )}
    </form>
  );
}
