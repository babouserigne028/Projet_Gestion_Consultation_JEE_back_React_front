import { useState } from "react";

function ModalAddPatient({ open, onClose, onAdd }) {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    motDePasse: "",
    dateNaissance: "",
    adresse: "",
  });
  const [error, setError] = useState(null);
  const [apiError, setApiError] = useState("");

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.nom ||
      !form.prenom ||
      !form.email ||
      !form.telephone ||
      !form.motDePasse ||
      !form.dateNaissance ||
      !form.adresse
    ) {
      setError("Tous les champs sont obligatoires.");
      return;
    }
    setError(null);
    const data = {
      nom: form.nom,
      prenom: form.prenom,
      email: form.email,
      motDePasse: form.motDePasse,
      telephone: form.telephone,
      role: "PATIENT",
      actif: true,
      dateNaissance: form.dateNaissance,
      adresse: form.adresse,
    };
    try {
      await onAdd(data);
      setForm({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        motDePasse: "",
        dateNaissance: "",
        adresse: "",
      });
    } catch (err) {
      // Gestion de l'erreur unique (email ou téléphone déjà existant)
      if (
        err?.response?.data?.message?.toLowerCase().includes("email") ||
        err?.response?.data?.message?.toLowerCase().includes("téléphone") ||
        err?.response?.data?.message?.toLowerCase().includes("telephone")
      ) {
        setApiError(
          "Un utilisateur avec cet email ou ce téléphone existe déjà. Veuillez vérifier les informations saisies.",
        );
      } else {
        setApiError("Erreur lors de l'ajout du patient. Veuillez réessayer.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative border border-blue-200">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-blue-100">
          <h2 className="text-2xl font-extrabold text-blue-700">
            Ajouter un patient
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
              Nom
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
              Prénom
            </label>
            <input
              type="text"
              name="prenom"
              value={form.prenom}
              onChange={handleChange}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-blue-800">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-blue-800">
              Téléphone
            </label>
            <input
              type="tel"
              name="telephone"
              value={form.telephone}
              onChange={handleChange}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-blue-800">
              Mot de passe
            </label>
            <input
              type="password"
              name="motDePasse"
              value={form.motDePasse}
              onChange={handleChange}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-blue-800">
              Date de naissance
            </label>
            <input
              type="date"
              name="dateNaissance"
              value={form.dateNaissance}
              onChange={handleChange}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-blue-800">
              Adresse
            </label>
            <input
              type="text"
              name="adresse"
              value={form.adresse}
              onChange={handleChange}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm font-semibold text-center mt-2">
              {error}
            </div>
          )}
          {apiError && (
            <div className="text-red-600 text-sm font-semibold text-center mt-2">
              {apiError}
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
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalAddPatient;
