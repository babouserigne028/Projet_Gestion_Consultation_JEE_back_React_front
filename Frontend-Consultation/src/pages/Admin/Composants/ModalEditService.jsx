import { useState, useEffect } from "react";

export default function ModalEditService({ open, onClose, onEdit, service }) {
  const [form, setForm] = useState({ nom: "", description: "" });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (service) {
      setForm({
        nom: service.nom || "",
        description: service.description || "",
      });
    }
    setError(null);
  }, [service, open]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nom) {
      setError("Le nom du service est obligatoire.");
      return;
    }
    setError(null);
    onEdit({ ...service, ...form });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative border border-blue-200">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-blue-100">
          <h2 className="text-2xl font-extrabold text-blue-700">
            Modifier le service
          </h2>
          <button
            className="text-3xl text-blue-400 hover:text-blue-700 font-bold focus:outline-none"
            onClick={onClose}
            aria-label="Fermer"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1 text-blue-800">
              Nom du service
            </label>
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-blue-800">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 min-h-[80px]"
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm font-semibold text-center mt-2">
              {error}
            </div>
          )}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-blue-700 font-bold border border-blue-200 shadow-sm"
              onClick={onClose}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-bold shadow-md"
            >
              Modifier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
