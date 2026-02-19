import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  FaCalendarPlus,
  FaClock,
  FaSave,
  FaTrash,
  FaSpinner,
} from "react-icons/fa";
import useGenererCreneaux from "../../services/hooks/creneaux/useGenererCreneaux";
import usePlanningSemaneMedecin from "../../services/hooks/rendezVous/usePlanningSemaneMedecin";
import useCrenauxMedecin from "../../services/hooks/creneaux/useCrenauxMedecin";

function MedecinPlanning() {
  const utilisateur = useSelector((state) => state.user.currentUser);

  const [planningForm, setPlanningForm] = useState({
    dateDebut: "",
    dateFin: "",
    heureDebut: "08:00",
    heureFin: "18:00",
  });

  // Hooks pour l'API
  const {
    loading: loadingGenerer,
    error: errorGenerer,
    genererCreneaux,
  } = useGenererCreneaux();
  const {
    loading: loadingPlanning,
    error: errorPlanning,
    planning,
    fetchPlanningSemaine,
  } = usePlanningSemaneMedecin();
  const {
    loading: loadingCreneaux,
    creneaux,
    fetchCrenauxMedecin,
  } = useCrenauxMedecin();

  // Charger le planning au montage du composant
  useEffect(() => {
    if (utilisateur && utilisateur.id) {
      fetchPlanningSemaine(utilisateur.id);
      fetchCrenauxMedecin(utilisateur.id); // Pour récupérer les créneaux existants
    }
  }, [utilisateur, fetchPlanningSemaine, fetchCrenauxMedecin]);

  // Adapter les créneaux pour l'affichage
  const creneauxAffiches = React.useMemo(() => {
    if (!creneaux || creneaux.length === 0) return [];

    // Puisque dateDay est @JsonIgnore dans le backend, on ne peut pas grouper par date
    // On affiche directement les créneaux individuels ou on utilise une approche différente
    return creneaux.slice(0, 10).map((creneau, index) => ({
      id: index + 1,
      date: "Date non disponible", // dateDay est @JsonIgnore dans le backend
      heureDebut: creneau.heureDebut || "N/A",
      heureFin: creneau.heureFin || "N/A",
      dureeMinutes: utilisateur?.dureeSeance || 30,
      creneauxGeneres: 1, // Un créneau par ligne
      statut: creneau.statut || "LIBRE",
    }));
  }, [creneaux, utilisateur?.dureeSeance]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlanningForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenererCreneaux = async () => {
    if (!utilisateur?.id) {
      alert("Erreur : utilisateur non connecté");
      return;
    }

    // Validation des champs
    if (!planningForm.dateDebut || !planningForm.dateFin) {
      alert("Veuillez remplir les dates de début et de fin");
      return;
    }

    // Configuration pour l'API
    const configCreneaux = {
      dateDebut: planningForm.dateDebut,
      dateFin: planningForm.dateFin,
      heureDebut: planningForm.heureDebut,
      heureFin: planningForm.heureFin,
      dureeSeance: utilisateur?.dureeSeance || 30, // Utilise la durée du profil médecin
    };

    const result = await genererCreneaux(utilisateur.id, configCreneaux);

    if (result.success) {
      alert(
        `Créneaux générés avec succès ! ${result.data?.length || "Plusieurs"} créneaux créés.`,
      );
      // Recharger les données pour refléter les nouveaux créneaux
      fetchCrenauxMedecin(utilisateur.id);
      fetchPlanningSemaine(utilisateur.id);
      // Réinitialiser le formulaire
      setPlanningForm({
        dateDebut: "",
        dateFin: "",
        heureDebut: "08:00",
        heureFin: "18:00",
      });
    } else {
      alert(
        "Erreur lors de la génération des créneaux : " +
          (result.error || "Erreur inconnue"),
      );
    }
  };

  const handleSupprimerPlanning = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce créneau ?")) {
      // TODO: Implémenter la suppression des créneaux via API
      console.log("Suppression du créneau:", id);
      alert("Fonctionnalité de suppression en cours d'implémentation");
    }
  };

  // Affichage des erreurs
  if (errorGenerer || errorPlanning) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p className="font-bold">Erreur</p>
          <p>{errorGenerer || errorPlanning}</p>
          <button
            onClick={() => {
              if (utilisateur?.id) {
                fetchPlanningSemaine(utilisateur.id);
                fetchCrenauxMedecin(utilisateur.id);
              }
            }}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full space-y-6">
      <h1 className="text-2xl font-extrabold text-blue-800 mb-6 flex items-center gap-2">
        <FaCalendarPlus className="text-blue-600" />
        Gérer mon Planning
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulaire de création de planning */}
        <div className="bg-white/90 border border-blue-200 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-extrabold text-blue-800 mb-4">
            Créer un nouveau planning
          </h2>

          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-blue-700 font-semibold mb-2">
                  Date de début
                </label>
                <input
                  type="date"
                  name="dateDebut"
                  value={planningForm.dateDebut}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="block text-blue-700 font-semibold mb-2">
                  Date de fin
                </label>
                <input
                  type="date"
                  name="dateFin"
                  value={planningForm.dateFin}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-blue-700 font-semibold mb-2">
                  Heure de début
                </label>
                <input
                  type="time"
                  name="heureDebut"
                  value={planningForm.heureDebut}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="block text-blue-700 font-semibold mb-2">
                  Heure de fin
                </label>
                <input
                  type="time"
                  name="heureFin"
                  value={planningForm.heureFin}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>

            {/* Information sur la durée de consultation */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-sm text-blue-700 font-medium">
                Durée de consultation configurée:{" "}
                {utilisateur?.dureeSeance || 30} minutes
              </div>
              <div className="text-xs text-blue-600 mt-1">
                Cette durée est définie dans vos paramètres de profil médecin
              </div>
            </div>
            <button
              type="button"
              onClick={handleGenererCreneaux}
              disabled={loadingGenerer || !utilisateur?.id}
              className={`w-full font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                loadingGenerer || !utilisateur?.id
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
              }`}
            >
              {loadingGenerer ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <FaSave />
                  Générer les créneaux
                </>
              )}
            </button>
          </form>
        </div>

        {/* Liste des créneaux existants */}
        <div className="bg-white/90 border border-blue-200 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-extrabold text-blue-800 mb-4">
            Créneaux récents (10 derniers)
          </h2>

          {/* État de chargement */}
          {loadingPlanning || loadingCreneaux ? (
            <div className="flex items-center justify-center py-8">
              <FaSpinner className="animate-spin text-2xl text-blue-600 mr-3" />
              <span className="text-blue-600">Chargement des créneaux...</span>
            </div>
          ) : (
            <div className="space-y-3">
              {creneauxAffiches.map((creneau) => (
                <div
                  key={creneau.id}
                  className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl hover:bg-blue-100/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-blue-900">
                      Créneau {creneau.id} - {creneau.statut || "LIBRE"}
                    </div>
                    <button
                      onClick={() => handleSupprimerPlanning(creneau.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Supprimer le créneau"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <div className="text-sm text-blue-600 space-y-1">
                    <div>
                      Horaires: {creneau.heureDebut} - {creneau.heureFin}
                    </div>
                    <div>Durée consultation: {creneau.dureeMinutes}min</div>
                    <div className="flex items-center gap-1">
                      <FaClock className="text-blue-500" />
                      Statut: {creneau.statut}
                    </div>
                  </div>
                </div>
              ))}

              {creneauxAffiches.length === 0 &&
                !loadingPlanning &&
                !loadingCreneaux && (
                  <div className="text-center py-8 text-blue-600">
                    <FaCalendarPlus className="text-4xl mx-auto mb-3 opacity-30" />
                    <p className="text-lg font-medium">
                      Aucun créneau créé pour le moment
                    </p>
                    <p className="text-sm mt-2">
                      Générez vos premiers créneaux ci-dessus
                    </p>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MedecinPlanning;
