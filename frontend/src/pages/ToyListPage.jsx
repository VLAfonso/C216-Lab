import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToyList } from "../components/ToyList";
import { listToys } from "../services/toys";

export function ToyListPage() {
  const [toys, setToys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    listToys()
      .then(setToys)
      .catch((error) => setLoadError(error.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Brinquedos cadastrados</h2>

        <Link
          to="/brinquedos/novo"
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          Adicionar brinquedo
        </Link>
      </div>

      {loading && <p>Carregando brinquedos...</p>}

      {loadError && <p role="alert">{loadError}</p>}

      {!loading && !loadError && <ToyList toys={toys} />}
    </section>
  );
}
