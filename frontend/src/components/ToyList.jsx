export function ToyList({ toys }) {
  if (toys.length === 0) {
    return <p className="text-slate-600">Nenhum brinquedo cadastrado.</p>;
  }

  return (
    <ul className="space-y-2">
      {toys.map((toy) => (
        <li
          key={toy.id}
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
        >
          <p className="font-medium">{toy.name}</p>
          <p className="text-sm text-slate-600">
            Descrição: {toy.description || "Não informada"}
          </p>
          <p className="text-sm text-slate-600">
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
        </li>
      ))}
    </ul>
  );
}
