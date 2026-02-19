import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaCalendarCheck,
  FaClock,
  FaUserMd,
  FaBriefcaseMedical,
  FaChartLine,
  FaCalendarPlus,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
  FaSpinner,
} from "react-icons/fa";
import { useProchainRendezVousPatient, useStatsPatient } from "../../services";

function PatientDashboard() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const patientId = currentUser?.patientId;

  // Hooks pour les données API
  const {
    prochainRdv,
    loading: loadingProchain,
    error: errorProchain,
    fetchProchainRdv,
  } = useProchainRendezVousPatient();
  const {
    stats,
    loading: loadingStats,
    error: errorStats,
    fetchStatsPatient,
  } = useStatsPatient();

  // Chargement des données au montage
  useEffect(() => {
    if (patientId) {
      fetchProchainRdv(patientId);
      fetchStatsPatient(patientId);
    }
  }, [patientId, fetchProchainRdv, fetchStatsPatient]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Demain";
    if (diffDays > 1 && diffDays <= 7) return `Dans ${diffDays} jours`;

    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const getStatutBadge = (statut) => {
    const statutLower = statut?.toLowerCase();
    switch (statutLower) {
      case "confirme":
      case "confirmé":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            <FaCheckCircle className="text-xs" />
            Confirmé
          </span>
        );
      case "en_attente":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
            <FaClock className="text-xs" />
            En attente
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            <FaInfoCircle className="text-xs" />
            {statut}
          </span>
        );
    }
  };

  const isLoading = loadingProchain || loadingStats;

  return (
    <div className="w-full h-full space-y-6">
      {/* En-tête de bienvenue */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl font-extrabold mb-2 flex items-center gap-2">
          <FaHome />
          Bonjour {currentUser?.prenom || currentUser?.nom || "Patient"} 👋
        </h1>
        <p className="text-blue-100">
          Bienvenue dans votre espace personnel. Gérez vos rendez-vous et
          consultations facilement.
        </p>
      </div>

      {/* Indicateur de chargement */}
      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <FaSpinner className="animate-spin text-blue-600 text-2xl mr-2" />
          <span className="text-blue-600">Chargement des données...</span>
        </div>
      )}

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
        <div className="bg-white/90 border border-blue-200 rounded-2xl shadow-xl p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
            <FaCalendarCheck className="text-green-600 text-xl" />
          </div>
          <div className="text-2xl font-extrabold text-blue-900 mb-1">
            {stats?.rdvConfirmes ?? 0}
          </div>
          <div className="text-sm text-blue-600 font-medium">RDV confirmés</div>
        </div>

        <div className="bg-white/90 border border-blue-200 rounded-2xl shadow-xl p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
            <FaUserMd className="text-blue-600 text-xl" />
          </div>
          <div className="text-2xl font-extrabold text-blue-900 mb-1">
            {stats?.rdvTermines ?? 0}
          </div>
          <div className="text-sm text-blue-600 font-medium">
            Consultations terminées
          </div>
        </div>

        <div className="bg-white/90 border border-blue-200 rounded-2xl shadow-xl p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
            <FaChartLine className="text-purple-600 text-xl" />
          </div>
          <div className="text-2xl font-extrabold text-blue-900 mb-1">
            {(stats?.rdvEnAttente ?? 0) +
              (stats?.rdvConfirmes ?? 0) +
              (stats?.rdvTermines ?? 0)}
          </div>
          <div className="text-sm text-blue-600 font-medium">
            Total consultations
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Prochain rendez-vous */}
        <div className="bg-white/90 border border-blue-200 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-extrabold text-blue-800 mb-4 flex items-center gap-2">
            <FaCalendarCheck className="text-blue-600" />
            Prochain Rendez-vous
          </h2>

          {prochainRdv ? (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="font-extrabold text-green-900 text-lg">
                    {formatDate(prochainRdv.creneau?.dateDay)} à{" "}
                    {prochainRdv.creneau?.heureDebut}
                  </div>
                  {prochainRdv.motif && (
                    <div className="text-green-700 font-medium">
                      Motif: {prochainRdv.motif}
                    </div>
                  )}
                </div>
                {getStatutBadge(prochainRdv.statutRdv)}
              </div>

              <div className="mt-3 text-xs text-green-600">
                💡 N'oubliez pas d'arriver 15 minutes avant votre rendez-vous
              </div>
            </div>
          ) : (
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6 text-center">
              <div className="text-blue-400 mb-2">
                <FaCalendarPlus className="mx-auto text-2xl" />
              </div>
              <div className="text-blue-600 font-medium mb-2">
                Aucun rendez-vous à venir
              </div>
              <button
                onClick={() => navigate("/patient/prendre-rdv")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-all text-sm"
              >
                Prendre un RDV
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;
