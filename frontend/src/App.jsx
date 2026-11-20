import { Navigate, Route, Routes } from "react-router-dom";
import { ToyFormPage } from "./pages/ToyFormPage";
import { ToyListPage } from "./pages/ToyListPage";

export default function App() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl space-y-8 p-4 sm:p-6">
      <header className="border-b border-slate-200 pb-5">
        <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Sistema de Gerenciamento
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
          Estoque de Loja de Brinquedos
        </h1>
      </header>

      <Routes>
        <Route path="/" element={<Navigate to="/brinquedos" replace />} />
        <Route path="/brinquedos" element={<ToyListPage />} />
        <Route path="/brinquedos/novo" element={<ToyFormPage />} />
        <Route path="/brinquedos/:id/editar" element={<ToyFormPage />} />
      </Routes>
    </main>
  );
}
