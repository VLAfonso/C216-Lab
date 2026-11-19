import { Link, useNavigate } from "react-router-dom";
import { ToyForm } from "../components/ToyForm";
import { createToy } from "../services/toys";

export function ToyFormPage() {
  const navigate = useNavigate();

  async function handleSubmit(values) {
    await createToy(values);
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

        <h2 className="text-xl font-semibold">Adicionar brinquedo</h2>
      </div>

      <ToyForm onSubmit={handleSubmit} />
    </section>
  );
}
