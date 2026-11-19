import { Navigate, Route, Routes } from "react-router-dom";
import { ToyFormPage } from "./pages/ToyFormPage";
import { ToyListPage } from "./pages/ToyListPage";

export default function App() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl space-y-6 p-4 sm:p-6">
      <h1 className="text-3xl font-bold">Gerenciador de Brinquedos</h1>

      <Routes>
        <Route path="/" element={<Navigate to="/brinquedos" replace />} />
        <Route path="/brinquedos" element={<ToyListPage />} />
        <Route path="/brinquedos/novo" element={<ToyFormPage />} />
      </Routes>
    </main>
  );
}
