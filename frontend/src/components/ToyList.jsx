import { Link } from "react-router-dom";

export function ToyList({ toys, onDelete, emptyMessage }) {
  if (toys.length === 0) {
    return (
      <p className="rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-500">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {toys.map((toy) => (
        <li
          key={toy.id}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <p className="mb-3 text-lg font-semibold text-slate-800">
            {toy.name}
          </p>

          <div className="space-y-1.5">
            <p className="text-sm text-slate-600">
              Descrição: {toy.description || "Não informada"}
            </p>
            <p className="text-sm font-medium text-slate-700">
              Preço: R$ {Number(toy.price).toFixed(2).replace(".", ",")}
            </p>
            <p className="text-sm text-slate-600">
              Categoria: {toy.category || "Não informada"}
            </p>
            <p className="text-sm text-slate-600">
              Marca: {toy.brand || "Não informada"}
            </p>
            <p className="text-sm text-slate-600">
              Faixa etária: {toy.age_range || "Não informada"}
            </p>
            <p className="text-sm text-slate-600">Quantidade: {toy.quantity}</p>
          </div>

          <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
            <Link
              to={`/brinquedos/${toy.id}/editar`}
              className="rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
            >
              Editar
            </Link>

            <button
              type="button"
              onClick={() => onDelete(toy)}
              className="rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
            >
              Excluir
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
