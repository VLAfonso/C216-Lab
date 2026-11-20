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
          className="text-sm text-blue-600 hover:underline"
        >
          Voltar para os brinquedos
        </Link>

        <h2 className="text-xl font-semibold">
          {isEditing ? "Editar brinquedo" : "Adicionar brinquedo"}
        </h2>
      </div>

      {loading && <p>Carregando brinquedo...</p>}

      {loadError && <p className="text-red-600">{loadError}</p>}

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
