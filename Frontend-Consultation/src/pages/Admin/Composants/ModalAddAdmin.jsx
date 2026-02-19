import { useState, useEffect } from "react";

export default function ModalAddAdmin({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    motDePasse: "passer",
  });

  useEffect(() => {
    if (!open)
      setForm({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        motDePasse: "",
      });
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-8 relative animate-fade-in">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold"
          onClick={onClose}
          aria-label="Fermer"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold text-blue-800 mb-6 text-center">
          Ajouter un administrateur
        </h2>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(form);
          }}
        >
          <div className="flex gap-3">
            <input
              name="nom"
              type="text"
              placeholder="Nom"
              required
              value={form.nom}
              onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
              className="flex-1 border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              name="prenom"
              type="text"
              placeholder="Prénom"
              required
              value={form.prenom}
              onChange={(e) =>
                setForm((f) => ({ ...f, prenom: e.target.value }))
              }
              className="flex-1 border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="telephone"
            type="text"
            placeholder="Téléphone"
            required
            value={form.telephone}
            onChange={(e) =>
              setForm((f) => ({ ...f, telephone: e.target.value }))
            }
            className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="motDePasse"
            type="text"
            placeholder="Mot de passe"
            required
            value={form.motDePasse}
            onChange={(e) =>
              setForm((f) => ({ ...f, motDePasse: e.target.value }))
            }
            className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex justify-end mt-6 gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
