import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToyList } from "../components/ToyList";
import { deleteToy, listToys } from "../services/toys";

export function ToyListPage() {
  const [toys, setToys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("name");
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    listToys()
      .then(setToys)
      .catch((error) => setLoadError(error.message))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    ...new Set(toys.map((toy) => toy.category).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b, "pt-BR"));

  const filteredToys = toys
    .filter((toy) => {
      const searchValue = search.trim().toLocaleLowerCase("pt-BR");

      const matchesSearch = [toy.name, toy.brand, toy.category].some((value) =>
        value?.toLocaleLowerCase("pt-BR").includes(searchValue),
      );

      const matchesCategory = !category || toy.category === category;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sort) {
        case "price":
          return Number(a.price) - Number(b.price);
        case "quantity":
          return a.quantity - b.quantity;
        default:
          return a.name.localeCompare(b.name, "pt-BR");
      }
    });

  async function handleDelete(toy) {
    const confirmed = window.confirm(`Deseja realmente excluir "${toy.name}"?`);

    if (!confirmed) return;

    try {
      await deleteToy(toy.id);
      setToys((currentToys) =>
        currentToys.filter((item) => item.id !== toy.id),
      );
      setDeleteError("");
    } catch (error) {
      setDeleteError(error.message);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-800">
          Brinquedos cadastrados
        </h2>

        <Link
          to="/brinquedos/novo"
          className="rounded-lg bg-slate-700 px-4 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-slate-800"
        >
          Adicionar brinquedo
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1 sm:col-span-3">
          <label
            htmlFor="toy-search"
            className="text-sm font-medium text-slate-700"
          >
            Pesquisar
          </label>
          <input
            id="toy-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Nome, marca ou categoria..."
            className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-700 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="toy-category-filter"
            className="text-sm font-medium text-slate-700"
          >
            Categoria
          </label>
          <select
            id="toy-category-filter"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-700 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          >
            <option value="">Todas as categorias</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="toy-sort"
            className="text-sm font-medium text-slate-700"
          >
            Ordenar por
          </label>
          <select
            id="toy-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-700 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          >
            <option value="name">Nome (A-Z)</option>
            <option value="price">Menor preço</option>
            <option value="quantity">Menor quantidade</option>
          </select>
        </div>
      </div>

      {loading && (
        <p className="text-sm text-slate-500">Carregando brinquedos...</p>
      )}

      {loadError && (
        <p role="alert" className="text-sm text-red-700">
          {loadError}
        </p>
      )}

      {deleteError && (
        <p role="alert" className="text-sm text-red-700">
          {deleteError}
        </p>
      )}

      {!loading && !loadError && (
        <ToyList toys={filteredToys} onDelete={handleDelete} />
      )}
    </section>
  );
}
