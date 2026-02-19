import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  FaClock,
  FaCalendarCheck,
  FaUserInjured,
  FaEdit,
  FaTrash,
  FaSpinner,
} from "react-icons/fa";
import useCrenauxMedecin from "../../services/hooks/creneaux/useCrenauxMedecin";
import useChangerStatutCreneau from "../../services/hooks/creneaux/useChangerStatutCreneau";

function MedecinCreneaux() {
  const utilisateur = useSelector((state) => state.user.currentUser);
  const [filtreDate, setFiltreDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [filtreStatut, setFiltreStatut] = useState("tous");

  // Hooks pour l'API
  const {
    loading: loadingCreneaux,
    error: errorCreneaux,
    creneaux,
    fetchCrenauxMedecin,
  } = useCrenauxMedecin();
  const {
    loading: loadingStatut,
    error: errorStatut,
    changerStatutCreneau,
  } = useChangerStatutCreneau();

  // Charger les créneaux au montage et quand les filtres changent
  useEffect(() => {
    if (utilisateur && utilisateur.id) {
      const statutAPI =
        filtreStatut === "tous" ? null : mapStatutToAPI(filtreStatut);
      fetchCrenauxMedecin(utilisateur.id, filtreDate || null, statutAPI);
    }
  }, [utilisateur, filtreDate, filtreStatut, fetchCrenauxMedecin]);

  // Mapping des statuts interface vers API
  const mapStatutToAPI = (statutUI) => {
    const mapping = {
      libre: "LIBRE",
      réservé: "RESERVE",
      confirmé: "OCCUPE",
      bloqué: "BLOQUE",
    };
    return mapping[statutUI] || statutUI;
  };

  // Mapping des statuts API vers interface
  const mapStatutFromAPI = (statutAPI) => {
    const mapping = {
      LIBRE: "libre",
      RESERVE: "réservé",
      OCCUPE: "confirmé",
      BLOQUE: "bloqué",
    };
    return mapping[statutAPI] || statutAPI?.toLowerCase();
  };

  // Utiliser les créneaux de l'API avec mapping des statuts
  const creneauxAvecStatuts = creneaux.map((creneau) => ({
    ...creneau,
    statut: mapStatutFromAPI(creneau.statut),
    // Formatage de la date pour compatibilité
    date: creneau.dateCreneau || creneau.date,
    // Formatage de l'heure
    heure: creneau.heureDebut || creneau.heure,
  }));

  const creneauxFiltres = creneauxAvecStatuts;

  const handleBloquerCreneau = async (id) => {
    const result = await changerStatutCreneau(id, "BLOQUE");
    if (result.success && utilisateur) {
      // Recharger les créneaux pour refléter le changement
      const statutAPI =
        filtreStatut === "tous" ? null : mapStatutToAPI(filtreStatut);
      fetchCrenauxMedecin(utilisateur.id, filtreDate || null, statutAPI);
    }
  };

  const handleDebloquerCreneau = async (id) => {
    const result = await changerStatutCreneau(id, "LIBRE");
    if (result.success && utilisateur) {
      // Recharger les créneaux pour refléter le changement
      const statutAPI =
        filtreStatut === "tous" ? null : mapStatutToAPI(filtreStatut);
      fetchCrenauxMedecin(utilisateur.id, filtreDate || null, statutAPI);
    }
  };

  const handleSupprimerCreneau = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce créneau ?")) {
      // TODO: Implémenter endpoint de suppression de créneau
      console.log("Suppression du créneau:", id);
      // En attendant, on recharge les données
      if (utilisateur) {
        const statutAPI =
          filtreStatut === "tous" ? null : mapStatutToAPI(filtreStatut);
        fetchCrenauxMedecin(utilisateur.id, filtreDate || null, statutAPI);
      }
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case "libre":
        return "bg-green-100 text-green-700 border-green-200";
      case "réservé":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "confirmé":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "bloqué":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case "libre":
        return <FaClock className="text-green-600" />;
      case "réservé":
        return <FaUserInjured className="text-yellow-600" />;
      case "confirmé":
        return <FaCalendarCheck className="text-blue-600" />;
      case "bloqué":
        return <FaEdit className="text-red-600" />;
      default:
        return <FaClock className="text-gray-600" />;
    }
  };

  const statsCreneaux = {
    total: creneauxFiltres.length,
    libres: creneauxFiltres.filter((c) => c.statut === "libre").length,
    réservés: creneauxFiltres.filter((c) => c.statut === "réservé").length,
    confirmés: creneauxFiltres.filter((c) => c.statut === "confirmé").length,
    bloqués: creneauxFiltres.filter((c) => c.statut === "bloqué").length,
  };

  // Affichage des erreurs
  if (errorCreneaux || errorStatut) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p className="font-bold">Erreur</p>
          <p>{errorCreneaux || errorStatut}</p>
          <button
            onClick={() => {
              if (utilisateur) {
                const statutAPI =
                  filtreStatut === "tous" ? null : mapStatutToAPI(filtreStatut);
                fetchCrenauxMedecin(
                  utilisateur.id,
                  filtreDate || null,
                  statutAPI,
                );
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
        <FaClock className="text-blue-600" />
        Mes Créneaux
      </h1>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white/90 border border-blue-100 rounded-xl shadow-lg p-4 text-center">
          <div className="text-2xl font-extrabold text-blue-800">
            {statsCreneaux.total}
          </div>
          <div className="text-sm font-medium text-blue-600">Total</div>
        </div>
        <div className="bg-white/90 border border-green-100 rounded-xl shadow-lg p-4 text-center">
          <div className="text-2xl font-extrabold text-green-800">
            {statsCreneaux.libres}
          </div>
          <div className="text-sm font-medium text-green-600">Libres</div>
        </div>
        <div className="bg-white/90 border border-yellow-100 rounded-xl shadow-lg p-4 text-center">
          <div className="text-2xl font-extrabold text-yellow-800">
            {statsCreneaux.réservés}
          </div>
          <div className="text-sm font-medium text-yellow-600">Réservés</div>
        </div>
        <div className="bg-white/90 border border-blue-100 rounded-xl shadow-lg p-4 text-center">
          <div className="text-2xl font-extrabold text-blue-800">
            {statsCreneaux.confirmés}
          </div>
          <div className="text-sm font-medium text-blue-600">Confirmés</div>
        </div>
        <div className="bg-white/90 border border-red-100 rounded-xl shadow-lg p-4 text-center">
          <div className="text-2xl font-extrabold text-red-800">
            {statsCreneaux.bloqués}
          </div>
          <div className="text-sm font-medium text-red-600">Bloqués</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white/90 border border-blue-200 rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-extrabold text-blue-800 mb-4">Filtres</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-blue-700 font-semibold mb-2">
              Date
            </label>
            <input
              type="date"
              value={filtreDate}
              onChange={(e) => setFiltreDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-blue-700 font-semibold mb-2">
              Statut
            </label>
            <select
              value={filtreStatut}
              onChange={(e) => setFiltreStatut(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="tous">Tous</option>
              <option value="libre">Libres</option>
              <option value="réservé">Réservés</option>
              <option value="confirmé">Confirmés</option>
              <option value="bloqué">Bloqués</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des créneaux */}
      <div className="bg-white/90 border border-blue-200 rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-extrabold text-blue-800 mb-4">
          Créneaux{" "}
          {filtreDate &&
            `du ${new Date(filtreDate).toLocaleDateString("fr-FR")}`}
        </h2>

        {/* État de chargement */}
        {loadingCreneaux ? (
          <div className="flex items-center justify-center py-12">
            <FaSpinner className="animate-spin text-3xl text-blue-600 mr-3" />
            <span className="text-blue-600 text-lg">
              Chargement des créneaux...
            </span>
          </div>
        ) : creneauxFiltres.length === 0 ? (
          <div className="text-center py-8 text-blue-600">
            <FaClock className="text-6xl mb-4 mx-auto opacity-30" />
            <p className="text-xl font-medium">
              Aucun créneau trouvé avec ces filtres
            </p>
            <p className="text-sm mt-2">
              Modifiez les filtres ou générez de nouveaux créneaux
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {creneauxFiltres.map((creneau) => {
              const isLoading = loadingStatut;

              return (
                <div
                  key={creneau.id}
                  className="border border-blue-100 rounded-xl p-4 hover:shadow-lg transition-all duration-300"
                >
                  {/* En-tête du créneau */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatutIcon(creneau.statut)}
                      <span className="font-bold text-blue-900">
                        {creneau.heure}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatutColor(creneau.statut)}`}
                    >
                      {creneau.statut}
                    </span>
                  </div>

                  {/* Informations du créneau */}
                  <div className="space-y-2 mb-4">
                    <div className="text-sm text-blue-600">
                      Durée: {creneau.dureeMinutes || creneau.duree || 30}{" "}
                      minutes
                    </div>
                    {(creneau.rendezVous || creneau.patient) && (
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <div className="text-sm font-semibold text-blue-900">
                          {creneau.rendezVous?.patient?.utilisateur?.prenom ||
                            creneau.patient?.utilisateur?.prenom}{" "}
                          {creneau.rendezVous?.patient?.utilisateur?.nom ||
                            creneau.patient?.utilisateur?.nom}
                        </div>
                        <div className="text-xs text-blue-600">
                          {creneau.rendezVous?.patient?.utilisateur
                            ?.telephone ||
                            creneau.patient?.utilisateur?.telephone}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {creneau.statut === "libre" && (
                      <button
                        onClick={() => handleBloquerCreneau(creneau.id)}
                        disabled={isLoading}
                        className={`flex-1 text-white text-xs py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1 ${
                          isLoading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        {isLoading ? (
                          <FaSpinner className="animate-spin" />
                        ) : null}
                        Bloquer
                      </button>
                    )}
                    {creneau.statut === "bloqué" && (
                      <button
                        onClick={() => handleDebloquerCreneau(creneau.id)}
                        disabled={isLoading}
                        className={`flex-1 text-white text-xs py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1 ${
                          isLoading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {isLoading ? (
                          <FaSpinner className="animate-spin" />
                        ) : null}
                        Débloquer
                      </button>
                    )}
                    <button
                      onClick={() => handleSupprimerCreneau(creneau.id)}
                      disabled={isLoading}
                      className={`px-3 py-2 text-white rounded-lg transition-all ${
                        isLoading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gray-500 hover:bg-gray-600"
                      }`}
                      title="Supprimer"
                    >
                      {isLoading ? (
                        <FaSpinner className="animate-spin text-xs" />
                      ) : (
                        <FaTrash className="text-xs" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MedecinCreneaux;
