import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToyForm } from "../components/ToyForm";
import { createToy, getToy, updateToy } from "../services/toys";

export function ToyFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [toy, setToy] = useState(null);
  const [loading, setLoading] = useState(isEditing);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!isEditing) return;

    async function loadToy() {
      try {
        const data = await getToy(id);
        setToy(data);
      } catch (error) {
        setLoadError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadToy();
  }, [id, isEditing]);

  async function handleSubmit(values) {
    if (isEditing) {
      await updateToy(id, values);
    } else {
      await createToy(values);
    }

    navigate("/brinquedos");
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <Link
          to="/brinquedos"
          className="inline-flex items-center text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 hover:underline"
        >
          Voltar para os brinquedos
        </Link>

        <h2 className="text-2xl font-semibold text-slate-800">
          {isEditing ? "Editar brinquedo" : "Adicionar brinquedo"}
        </h2>
      </div>

      {loading && (
        <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500">
          Carregando brinquedo...
        </p>
      )}

      {loadError && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {loadError}
        </p>
      )}

      {!loading && !loadError && (
        <ToyForm
          initialValues={toy ?? {}}
          onSubmit={handleSubmit}
          submitLabel={isEditing ? "Salvar alterações" : "Adicionar brinquedo"}
        />
      )}
    </section>
  );
}
