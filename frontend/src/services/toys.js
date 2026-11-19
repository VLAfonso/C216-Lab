export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const TOYS_URL = `${API_URL}/toys/`;

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

export function listToys() {
  return request(TOYS_URL, undefined, "Erro ao carregar os brinquedos.");
}

export function createToy({
  name,
  description,
  price,
  category,
  brand,
  age_range,
  quantity,
}) {
  return request(
    TOYS_URL,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        price,
        category,
        brand,
        age_range,
        quantity,
      }),
    },
    "Erro ao cadastrar o brinquedo.",
  );
}
