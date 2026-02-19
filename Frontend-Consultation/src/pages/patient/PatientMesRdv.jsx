import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  FaCalendarCheck,
  FaCalendarAlt,
  FaBriefcaseMedical,
  FaClock,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaFilter,
  FaCalendarTimes,
} from "react-icons/fa";
import { useRendezVousPatient, useAnnulerRendezVous } from "../../services";

function PatientMesRdv() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const patientId = currentUser?.patientId;

  const {
    rendezVous: rdvFromApi,
    loading,
    error,
    fetchRendezVousPatient,
  } = useRendezVousPatient();
  const { loading: loadingAnnulation, annulerRendezVous } =
    useAnnulerRendezVous();

  const [rendezVous, setRendezVous] = useState([]);
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [filtrePeriode, setFiltrePeriode] = useState("tous");
  const [recherche, setRecherche] = useState("");

  // Charger les rendez-vous au montage
  useEffect(() => {
    if (patientId) {
      fetchRendezVousPatient(patientId);
    }
  }, [patientId, fetchRendezVousPatient]);

  // Transformer les données API en format local
  useEffect(() => {
    if (rdvFromApi) {
      const transformedRdv = rdvFromApi.map((rdv) => ({
        id: rdv.id,
        date: rdv.creneau?.dateDay,
        heure: rdv.creneau?.heureDebut?.substring(0, 5) || "",
        motif: rdv.motif || "Consultation",
        statut: rdv.statutRdv?.toLowerCase() || "en_attente",
        dateCreation: rdv.dateCreation,
      }));
      setRendezVous(transformedRdv);
    }
  }, [rdvFromApi]);

  const getStatutBadge = (statut) => {
    const statutLower = statut?.toLowerCase();
    switch (statutLower) {
      case "confirme":
      case "confirmé":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
            <FaCheckCircle className="text-xs" />
            Confirmé
          </span>
        );
      case "en_attente":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700">
            <FaClock className="text-xs" />
            En attente
          </span>
        );
      case "programme":
      case "programmé":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
            <FaClock className="text-xs" />
            Programmé
          </span>
        );
      case "termine":
      case "terminé":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700">
            <FaCheckCircle className="text-xs" />
            Terminé
          </span>
        );
      case "annule":
      case "annulé":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
            <FaTimesCircle className="text-xs" />
            Annulé
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700">
            {statut}
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date inconnue";

    let date;
    if (Array.isArray(dateString)) {
      date = new Date(dateString[0], dateString[1] - 1, dateString[2]);
    } else {
      date = new Date(dateString);
    }

    if (isNaN(date.getTime())) return "Date invalide";

    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Demain";
    if (diffDays === -1) return "Hier";
    if (diffDays > 1 && diffDays <= 7) return `Dans ${diffDays} jours`;
    if (diffDays < -1 && diffDays >= -7)
      return `Il y a ${Math.abs(diffDays)} jours`;

    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateSimple = (dateString) => {
    if (!dateString) return "";
    let date;
    if (Array.isArray(dateString)) {
      date = new Date(dateString[0], dateString[1] - 1, dateString[2]);
    } else {
      date = new Date(dateString);
    }
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("fr-FR");
  };

  const estProchainement = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  const filtrerRendezVous = () => {
    return rendezVous.filter((rdv) => {
      const correspondRecherche =
        recherche === "" ||
        rdv.motif?.toLowerCase().includes(recherche.toLowerCase()) ||
        rdv.date?.includes(recherche);

      // Normaliser le statut pour la comparaison
      const statutNormalise = rdv.statut?.toLowerCase().replace("é", "e");
      const filtreStatutNormalise = filtreStatut
        .toLowerCase()
        .replace("é", "e");
      const correspondStatut =
        filtreStatut === "tous" || statutNormalise === filtreStatutNormalise;

      let correspondPeriode = true;
      if (filtrePeriode !== "tous") {
        const dateRdv = new Date(rdv.date);
        const today = new Date();

        switch (filtrePeriode) {
          case "prochains":
            correspondPeriode = dateRdv >= today;
            break;
          case "passes":
            correspondPeriode = dateRdv < today;
            break;
          case "cette_semaine":
            const endOfWeek = new Date(today);
            endOfWeek.setDate(today.getDate() + 7);
            correspondPeriode = dateRdv >= today && dateRdv <= endOfWeek;
            break;
        }
      }

      return correspondRecherche && correspondStatut && correspondPeriode;
    });
  };

  const handleAnnulerRdv = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir annuler ce rendez-vous ?")) {
      const result = await annulerRendezVous(id, patientId);
      if (result.success) {
        // Mettre à jour l'état local
        setRendezVous((prev) =>
          prev.map((rdv) =>
            rdv.id === id
              ? {
                  ...rdv,
                  statut: "annule",
                  motifAnnulation: "Annulé par le patient",
                }
              : rdv,
          ),
        );
        // Rafraîchir depuis l'API
        fetchRendezVousPatient(patientId);
      } else {
        alert(
          "Erreur lors de l'annulation: " +
            (result.error || "Veuillez réessayer"),
        );
      }
    }
  };

  const rdvFiltres = filtrerRendezVous().sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-blue-600 font-medium">
            Chargement de vos rendez-vous...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full space-y-6">
      <h1 className="text-2xl font-extrabold text-blue-800 mb-6 flex items-center gap-2">
        <FaCalendarCheck className="text-blue-600" />
        Mes Rendez-vous
      </h1>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-extrabold text-blue-700">
            {
              rendezVous
                .filter((rdv) =>
                  [
                    "confirme",
                    "confirmé",
                    "en_attente",
                    "programme",
                    "programmé",
                  ].includes(rdv.statut?.toLowerCase()),
                )
                .filter((rdv) => new Date(rdv.date) >= new Date()).length
            }
          </div>
          <div className="text-sm text-blue-600 font-medium">À venir</div>
        </div>

        <div className="bg-green-50/50 border border-green-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-extrabold text-green-700">
            {
              rendezVous.filter((rdv) =>
                ["confirme", "confirmé"].includes(rdv.statut?.toLowerCase()),
              ).length
            }
          </div>
          <div className="text-sm text-green-600 font-medium">Confirmés</div>
        </div>

        <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-extrabold text-gray-700">
            {
              rendezVous.filter((rdv) =>
                ["termine", "terminé"].includes(rdv.statut?.toLowerCase()),
              ).length
            }
          </div>
          <div className="text-sm text-gray-600 font-medium">Terminés</div>
        </div>

        <div className="bg-red-50/50 border border-red-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-extrabold text-red-700">
            {
              rendezVous.filter((rdv) =>
                ["annule", "annulé"].includes(rdv.statut?.toLowerCase()),
              ).length
            }
          </div>
          <div className="text-sm text-red-600 font-medium">Annulés</div>
        </div>
      </div>

      {/* Prochains rendez-vous en évidence */}
      {rendezVous.filter(
        (rdv) =>
          estProchainement(rdv.date) &&
          [
            "confirme",
            "confirmé",
            "en_attente",
            "programme",
            "programmé",
          ].includes(rdv.statut?.toLowerCase()),
      ).length > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-green-200 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-extrabold text-green-800 mb-4 flex items-center gap-2">
            <FaCalendarCheck className="text-green-600" />
            Rendez-vous à venir cette semaine
          </h2>
          <div className="space-y-3">
            {rendezVous
              .filter(
                (rdv) =>
                  estProchainement(rdv.date) &&
                  [
                    "confirme",
                    "confirmé",
                    "en_attente",
                    "programme",
                    "programmé",
                  ].includes(rdv.statut?.toLowerCase()),
              )
              .map((rdv) => (
                <div
                  key={rdv.id}
                  className="bg-white/70 border border-green-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-lg font-extrabold text-green-900">
                          {formatDate(rdv.date)}
                        </div>
                        <div className="text-sm text-green-700">
                          {rdv.heure}
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-green-900">
                          {rdv.motif}
                        </div>
                      </div>
                    </div>
                    {getStatutBadge(rdv.statut)}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Filtres et recherche */}
      <div className="bg-white/90 border border-blue-200 rounded-2xl shadow-xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Barre de recherche */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
            <input
              type="text"
              placeholder="Rechercher par motif ou date..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Filtre par statut */}
          <div className="lg:w-48">
            <select
              value={filtreStatut}
              onChange={(e) => setFiltreStatut(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="tous">Tous les statuts</option>
              <option value="confirmé">Confirmé</option>
              <option value="programmé">Programmé</option>
              <option value="terminé">Terminé</option>
              <option value="annulé">Annulé</option>
            </select>
          </div>

          {/* Filtre par période */}
          <div className="lg:w-48">
            <select
              value={filtrePeriode}
              onChange={(e) => setFiltrePeriode(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="tous">Toutes les périodes</option>
              <option value="prochains">À venir</option>
              <option value="cette_semaine">Cette semaine</option>
              <option value="passes">Passés</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
          <FaFilter />
          {rdvFiltres.length} rendez-vous trouvé
          {rdvFiltres.length > 1 ? "s" : ""}
        </div>
      </div>

      {/* Liste des rendez-vous */}
      <div className="space-y-4">
        {rdvFiltres.length > 0 ? (
          rdvFiltres.map((rdv) => (
            <div
              key={rdv.id}
              className="bg-white/90 border border-blue-200 rounded-2xl shadow-xl p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* En-tête du rendez-vous */}
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="font-extrabold text-blue-900 text-lg">
                      RDV #{rdv.id}
                    </span>
                    {getStatutBadge(rdv.statut)}
                  </div>

                  {/* Informations principales */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-blue-700">
                      <FaCalendarAlt className="text-blue-500" />
                      <div>
                        <div className="text-xs text-blue-500 font-medium">
                          Date et heure
                        </div>
                        <div className="font-semibold">
                          {formatDateSimple(rdv.date)} à {rdv.heure}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-blue-700">
                      <FaBriefcaseMedical className="text-blue-500" />
                      <div>
                        <div className="text-xs text-blue-500 font-medium">
                          Motif
                        </div>
                        <div className="font-semibold">{rdv.motif}</div>
                      </div>
                    </div>
                  </div>

                  {/* Informations supplémentaires selon le statut */}
                  {["confirme", "confirmé"].includes(
                    rdv.statut?.toLowerCase(),
                  ) && (
                    <div className="bg-green-50/50 border border-green-200 rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-2 text-green-700 mb-1">
                        <FaCheckCircle className="text-sm" />
                        <span className="font-semibold text-sm">
                          Rendez-vous confirmé
                        </span>
                      </div>
                      <div className="text-green-600 text-xs mt-1">
                        Vous recevrez un rappel 24h avant le rendez-vous
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() =>
                      alert(
                        `Détails du RDV #${rdv.id}\n\nDate: ${formatDateSimple(rdv.date)} à ${rdv.heure}\nMotif: ${rdv.motif}\nStatut: ${rdv.statut}`,
                      )
                    }
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="Voir détails"
                  >
                    <FaEye />
                  </button>

                  {["confirme", "confirmé", "en_attente"].includes(
                    rdv.statut?.toLowerCase(),
                  ) && (
                    <>
                      {new Date(rdv.date) > new Date() && (
                        <button
                          onClick={() => handleAnnulerRdv(rdv.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Annuler"
                        >
                          <FaCalendarTimes />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white/90 border border-blue-200 rounded-2xl shadow-xl p-12 text-center">
            <FaCalendarCheck className="mx-auto text-4xl text-blue-300 mb-4" />
            <h3 className="text-xl font-extrabold text-blue-800 mb-2">
              Aucun rendez-vous trouvé
            </h3>
            <p className="text-blue-600 mb-6">
              {recherche || filtreStatut !== "tous" || filtrePeriode !== "tous"
                ? "Aucun rendez-vous ne correspond à vos critères de recherche."
                : "Vous n'avez pas encore de rendez-vous programmé."}
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all">
              Prendre un nouveau RDV
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientMesRdv;
