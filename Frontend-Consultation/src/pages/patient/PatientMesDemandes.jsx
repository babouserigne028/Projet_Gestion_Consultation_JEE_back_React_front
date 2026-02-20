import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaClock,
  FaCalendarAlt,
  FaBriefcaseMedical,
  FaEye,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaFilter,
  FaSearch,
} from "react-icons/fa";
import { useRendezVousPatient, useAnnulerRendezVous } from "../../services";

function PatientMesDemandes() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const patientId = currentUser?.patientId;

  const {
    rendezVous: rdvFromApi,
    loading,
    error,
    fetchRendezVousPatient,
  } = useRendezVousPatient();
  const { loading: loadingAnnulation, annulerRendezVous } =
    useAnnulerRendezVous();

  const [demandes, setDemandes] = useState([]);
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [recherche, setRecherche] = useState("");

  // Charger les rendez-vous au montage
  useEffect(() => {
    if (patientId) {
      fetchRendezVousPatient(patientId);
    }
  }, [patientId, fetchRendezVousPatient]);

  // Transformer et filtrer les données API pour les demandes
  useEffect(() => {
    if (rdvFromApi) {
      const transformedDemandes = rdvFromApi.map((rdv) => ({
        id: rdv.id,
        dateCreation: rdv.dateCreation,
        dateRdv: rdv.creneau?.dateDay,
        heureRdv: rdv.creneau?.heureDebut?.substring(0, 5) || "",
        motif: rdv.motif || "Consultation",
        statut: rdv.statutRdv?.toLowerCase() || "en_attente",
      }));
      setDemandes(transformedDemandes);
    }
  }, [rdvFromApi]);

  const getStatutBadge = (statut) => {
    const statutLower = statut?.toLowerCase();
    switch (statutLower) {
      case "en_attente":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700">
            <FaClock className="text-xs" />
            En attente
          </span>
        );
      case "confirme":
      case "confirmé":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
            <FaCheckCircle className="text-xs" />
            Confirmé
          </span>
        );
      case "refuse":
      case "refusé":
      case "annule":
      case "annulé":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
            <FaTimesCircle className="text-xs" />
            {statutLower.includes("annul") ? "Annulé" : "Refusé"}
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
    // Si c'est un tableau [année, mois, jour, heure, minute, seconde] (format LocalDateTime Java)
    if (Array.isArray(dateString)) {
      date = new Date(
        dateString[0],
        dateString[1] - 1,
        dateString[2],
        dateString[3] || 0,
        dateString[4] || 0,
      );
    } else {
      date = new Date(dateString);
    }

    if (isNaN(date.getTime())) return "Date invalide";

    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateSimple = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  const filtrerDemandes = () => {
    return demandes.filter((demande) => {
      const correspondRecherche =
        recherche === "" ||
        demande.motif?.toLowerCase().includes(recherche.toLowerCase()) ||
        demande.dateRdv?.includes(recherche);

      // Normaliser les statuts pour la comparaison
      const statutNormalise = demande.statut?.toLowerCase().replace("é", "e");
      const filtreStatutNormalise = filtreStatut
        .toLowerCase()
        .replace("é", "e");
      const correspondStatut =
        filtreStatut === "tous" || statutNormalise === filtreStatutNormalise;

      return correspondRecherche && correspondStatut;
    });
  };

  const handleSupprimerDemande = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir annuler cette demande ?")) {
      const result = await annulerRendezVous(id, patientId);
      if (result.success) {
        // Rafraîchir les données
        fetchRendezVousPatient(patientId);
      } else {
        alert(
          "Erreur lors de l'annulation: " +
            (result.error || "Veuillez réessayer"),
        );
      }
    }
  };

  const handleModifierDemande = (id) => {
    // Ici on peut implémenter la logique de modification
    console.log("Modifier demande:", id);
  };

  const demandesFiltrees = filtrerDemandes();

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-blue-600 font-medium">
            Chargement de vos demandes...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full space-y-6">
      <h1 className="text-2xl font-extrabold text-blue-800 mb-6 flex items-center gap-2">
        <FaClock className="text-blue-600" />
        Mes Demandes de Rendez-vous
      </h1>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-50/50 border border-yellow-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-extrabold text-yellow-700">
            {demandes.filter((d) => d.statut === "en_attente").length}
          </div>
          <div className="text-sm text-yellow-600 font-medium">En attente</div>
        </div>
        <div className="bg-green-50/50 border border-green-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-extrabold text-green-700">
            {
              demandes.filter((d) =>
                ["confirme", "confirmé"].includes(d.statut?.toLowerCase()),
              ).length
            }
          </div>
          <div className="text-sm text-green-600 font-medium">Confirmées</div>
        </div>
        <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-extrabold text-blue-700">
            {demandes.length}
          </div>
          <div className="text-sm text-blue-600 font-medium">Total</div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white/90 border border-blue-200 rounded-2xl shadow-xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Barre de recherche */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
            <input
              type="text"
              placeholder="Rechercher par médecin, service, motif..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Filtre par statut */}
          <div className="md:w-48">
            <select
              value={filtreStatut}
              onChange={(e) => setFiltreStatut(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="tous">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="confirme">Confirmé</option>
              <option value="annule">Annulé</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
          <FaFilter />
          {demandesFiltrees.length} demande
          {demandesFiltrees.length > 1 ? "s" : ""} trouvée
          {demandesFiltrees.length > 1 ? "s" : ""}
        </div>
      </div>

      {/* Liste des demandes */}
      <div className="space-y-4">
        {demandesFiltrees.length > 0 ? (
          demandesFiltrees.map((demande) => (
            <div
              key={demande.id}
              className="bg-white/90 border border-blue-200 rounded-2xl shadow-xl p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* En-tête de la demande */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-extrabold text-blue-900 text-lg">
                      Demande #{demande.id}
                    </span>
                    {getStatutBadge(demande.statut)}
                  </div>

                  {/* Informations principales */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-blue-700">
                      <FaCalendarAlt className="text-blue-500" />
                      <div>
                        <div className="text-xs text-blue-500 font-medium">
                          Date du rendez-vous
                        </div>
                        <div className="font-semibold">
                          {formatDateSimple(demande.dateRdv)} à{" "}
                          {demande.heureRdv}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-blue-700">
                      <FaBriefcaseMedical className="text-blue-500" />
                      <div>
                        <div className="text-xs text-blue-500 font-medium">
                          Motif
                        </div>
                        <div className="font-semibold">{demande.motif}</div>
                      </div>
                    </div>
                  </div>

                  {/* Informations supplémentaires selon le statut */}
                  {["confirme", "confirmé"].includes(
                    demande.statut?.toLowerCase(),
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

                  {/* Date de création */}
                  <div className="text-xs text-blue-500">
                    Demande créée le {formatDate(demande.dateCreation)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() =>
                      alert(
                        `Détails de la demande #${demande.id}\n\nDate: ${formatDateSimple(demande.dateRdv)} à ${demande.heureRdv}\nMotif: ${demande.motif}\nStatut: ${demande.statut}`,
                      )
                    }
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="Voir les détails"
                  >
                    <FaEye />
                  </button>

                  {demande.statut === "en_attente" && (
                    <>
                      <button
                        onClick={() => handleModifierDemande(demande.id)}
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleSupprimerDemande(demande.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white/90 border border-blue-200 rounded-2xl shadow-xl p-12 text-center">
            <FaClock className="mx-auto text-4xl text-blue-300 mb-4" />
            <h3 className="text-xl font-extrabold text-blue-800 mb-2">
              Aucune demande trouvée
            </h3>
            <p className="text-blue-600 mb-6">
              {recherche || filtreStatut !== "tous"
                ? "Aucune demande ne correspond à vos critères de recherche."
                : "Vous n'avez pas encore fait de demande de rendez-vous."}
            </p>
            <button
              onClick={() => navigate("/patient/prendre-rdv")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all"
            >
              Prendre un nouveau RDV
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientMesDemandes;
