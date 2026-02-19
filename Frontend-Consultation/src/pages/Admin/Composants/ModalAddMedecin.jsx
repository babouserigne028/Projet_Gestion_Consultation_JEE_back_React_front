import { useState, useEffect } from "react";
import useFetchServices from "../../../services/hooks/ListeServices/useFetchServices";
import useAddMedecin from "../../../services/hooks/admin/ListeMedecins/useAddMedecin";

export default function ModalAddMedecin({ open, onClose, onSubmit }) {
  const { addMedecin, loading, error, data, reset } = useAddMedecin();
  const {
    services,
    loading: loadingServices,
    error: errorServices,
  } = useFetchServices();
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    specialite: "",
    dureeSeance: "",
    adresseCabinet: "",
    motDePasse: "",
    actif: true,
    serviceId: "", // Added serviceId to the form state
  });

  useEffect(() => {
    if (!open) {
      setForm({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        specialite: "",
        dureeSeance: "",
        adresseCabinet: "",
        motDePasse: "",
        actif: true,
      });
    }
  }, [open]);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

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
          Ajouter un médecin
        </h2>
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const res = await addMedecin(form);
            if (res) {
              onSubmit && onSubmit(res);
              onClose();
            }
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
            name="specialite"
            type="text"
            placeholder="Spécialité"
            required
            value={form.specialite}
            onChange={(e) =>
              setForm((f) => ({ ...f, specialite: e.target.value }))
            }
            className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="dureeSeance"
            type="number"
            placeholder="Durée de séance (min)"
            required
            value={form.dureeSeance}
            onChange={(e) =>
              setForm((f) => ({ ...f, dureeSeance: e.target.value }))
            }
            className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="adresseCabinet"
            type="text"
            placeholder="Adresse du cabinet"
            required
            value={form.adresseCabinet}
            onChange={(e) =>
              setForm((f) => ({ ...f, adresseCabinet: e.target.value }))
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
          <select
            name="serviceId"
            required
            value={form.serviceId || ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, serviceId: e.target.value }))
            }
            className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={loadingServices}
          >
            <option value="" disabled>
              {loadingServices
                ? "Chargement des services..."
                : "Sélectionner un service"}
            </option>
            {services &&
              Array.isArray(services) &&
              services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nom}
                </option>
              ))}
          </select>
          {errorServices && (
            <div className="text-red-600 text-xs mt-1">
              Erreur lors du chargement des services
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              id="actif"
              name="actif"
              type="checkbox"
              checked={form.actif}
              onChange={(e) =>
                setForm((f) => ({ ...f, actif: e.target.checked }))
              }
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="actif" className="text-sm text-gray-700">
              Actif
            </label>
          </div>
          {error && (
            <div className="text-red-600 text-sm text-center font-semibold">
              Erreur lors de l'ajout :{" "}
              {error.message || "Vérifiez les champs et réessayez."}
            </div>
          )}
          <div className="flex justify-end mt-6 gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow"
              disabled={loading}
            >
              {loading ? "Ajout..." : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
