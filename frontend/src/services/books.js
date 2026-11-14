export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const BOOKS_URL = `${API_URL}/books/`;

async function request(url, options, fallbackMessage) {
  let response;

  try {
    response = await fetch(url, options);
  } catch {
    throw new Error("Não foi possível conectar à API.");
  }

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.detail || fallbackMessage);
  }

  return response.json();
}

export function listBooks() {
  return request(BOOKS_URL, undefined, "Erro ao carregar os livros.");
}

export function createBook({ name, author, publisher }) {
  return request(
    BOOKS_URL,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, author, publisher }),
    },
    "Erro ao cadastrar o livro.",
  );
}
