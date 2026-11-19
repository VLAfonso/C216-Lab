import { useEffect, useState } from "react";
import { ToyForm } from "./components/ToyForm";
import { ToyList } from "./components/ToyList";
import { createToy, listToys } from "./services/toys";

export default function App() {
  const [toys, setToys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    listToys()
      .then(setToys)
      .catch((error) => setLoadError(error.message))
      .finally(() => setLoading(false));
  }, []);

  async function addToy(values) {
    const created = await createToy(values);
    setToys((current) => [...current, created]);
  }

  return (
    <main className="mx-auto min-h-screen max-w-xl space-y-6 p-4 sm:p-6">
      <h1 className="text-3xl font-bold">Gerenciador de Brinquedos</h1>

      <ToyForm onAdd={addToy} />

      <section aria-labelledby="toys-heading" className="space-y-3">
        <h2 id="toys-heading" className="text-xl font-semibold">
          Brinquedos cadastrados
        </h2>

        {loading && <p>Carregando brinquedos...</p>}

        {loadError && <p role="alert">{loadError}</p>}

        {!loading && !loadError && <ToyList toys={toys} />}
      </section>
    </main>
  );
}
