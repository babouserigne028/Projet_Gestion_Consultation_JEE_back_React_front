// DEBUG: Affiche le state form en temps réel
// À retirer après le debug
// <pre>{JSON.stringify(form, null, 2)}</pre>
import { useState, useEffect, useRef } from "react";
import useEditMedecin from "../../../services/hooks/admin/ListeMedecins/useEditMedecin";
import useFetchServices from "../../../services/hooks/ListeServices/useFetchServices";

export default function ModalEditMedecin({ open, onClose, onSubmit, medecin }) {
  const { editMedecin, loading, error, data, reset } = useEditMedecin();
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
    serviceId: "",
  });

  // On mémorise l'id du dernier médecin chargé
  const lastMedecinId = useRef(null);
  useEffect(() => {
    // Réinitialise le formulaire uniquement si le modal s'ouvre ou si l'id du médecin change
    if (open && medecin && medecin.id !== lastMedecinId.current) {
      setForm({
        nom: medecin.nom ? String(medecin.nom) : "",
        prenom: medecin.prenom ? String(medecin.prenom) : "",
        email: medecin.email ? String(medecin.email) : "",
        telephone: medecin.telephone ? String(medecin.telephone) : "",
        specialite: medecin.specialite ? String(medecin.specialite) : "",
        dureeSeance:
          medecin.dureeSeance !== undefined && medecin.dureeSeance !== null
            ? String(medecin.dureeSeance)
            : "",
        adresseCabinet: medecin.adresseCabinet
          ? String(medecin.adresseCabinet)
          : "",
        serviceId:
          medecin.serviceId !== undefined && medecin.serviceId !== null
            ? String(medecin.serviceId)
            : "",
      });
      lastMedecinId.current = medecin.id;
    }
    if (!open) {
      setForm({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        specialite: "",
        dureeSeance: "",
        adresseCabinet: "",
        serviceId: "",
      });
      lastMedecinId.current = null;
      reset();
    }
  }, [open, medecin?.id]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      {/* DEBUG: Affiche le state form en temps réel */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          background: "#fff",
          zIndex: 9999,
          fontSize: 12,
          maxWidth: 400,
          overflow: "auto",
        }}
      >
        <pre>{JSON.stringify(form, null, 2)}</pre>
      </div>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-8 relative animate-fade-in">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold"
          onClick={onClose}
          aria-label="Fermer"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold text-blue-800 mb-6 text-center">
          Modifier un médecin
        </h2>
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!medecin || !medecin.id) {
              alert("Erreur : l'identifiant du médecin est manquant.");
              return;
            }
            const res = await editMedecin(medecin.id, form);
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
          {error && (
            <div className="text-red-600 text-sm text-center font-semibold">
              Erreur lors de la modification :{" "}
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
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
