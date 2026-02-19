import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarCheck,
  FaClock,
  FaUserInjured,
  FaStethoscope,
  FaSync,
} from "react-icons/fa";
import {
  useStatsJourMedecin,
  useGetAllMedecins,
  usePatientsRecentsMedecin,
} from "../../services";

function MedecinDashboard() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const [medecinId, setMedecinId] = useState(null);

  const {
    stats: statsJour,
    fetchStatsJour,
    loading: loadingStats,
    error: errorStats,
  } = useStatsJourMedecin();

  const {
    medecins,
    fetchMedecins,
    loading: loadingMedecins,
  } = useGetAllMedecins();

  const {
    patients: patientsRecents,
    fetchPatientsRecents,
    loading: loadingPatients,
  } = usePatientsRecentsMedecin();

  // Récupérer la liste des médecins au montage
  useEffect(() => {
    if (currentUser?.email && medecins.length === 0 && !loadingMedecins) {
      fetchMedecins();
    }
  }, [currentUser?.email, medecins.length, loadingMedecins, fetchMedecins]);

  // Trouver l'ID médecin correspondant à l'utilisateur connecté
  useEffect(() => {
    if (medecins.length > 0 && currentUser?.email) {
      const medecin = medecins.find((m) => m.email === currentUser.email);
      if (medecin) {
        setMedecinId(medecin.id);
      }
    }
  }, [medecins, currentUser]);

  // Charger les données du dashboard quand on a l'ID médecin
  useEffect(() => {
    if (medecinId) {
      fetchStatsJour(medecinId);
      fetchPatientsRecents(medecinId, 5);
    }
  }, [medecinId, fetchStatsJour, fetchPatientsRecents]);

  // Fonction de rafraîchissement
  const handleRefresh = () => {
    if (medecinId) {
      fetchStatsJour(medecinId);
      fetchPatientsRecents(medecinId, 5);
    }
  };

  // Gestion de l'état de chargement général
  const loading = loadingStats || loadingMedecins || loadingPatients;
  const error = errorStats;

  // Afficher un message si nous n'avons pas l'utilisateur connecté
  if (!currentUser) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <FaStethoscope className="text-6xl text-blue-300 mx-auto mb-4" />
          <p className="text-blue-600">
            Chargement des informations médecin...
          </p>
        </div>
      </div>
    );
  }

  // Vérifier le rôle utilisateur
  if (currentUser.role !== "MEDECIN") {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <FaStethoscope className="text-6xl text-red-300 mx-auto mb-4" />
          <p className="text-red-600">
            Accès non autorisé. Vous devez être connecté en tant que médecin.
          </p>
        </div>
      </div>
    );
  }

  // Affichage pendant la recherche de l'ID médecin
  if (!medecinId && !loadingMedecins) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <FaStethoscope className="text-6xl text-orange-300 mx-auto mb-4" />
          <p className="text-orange-600">
            Profil médecin introuvable. Veuillez contacter l'administrateur.
          </p>
        </div>
      </div>
    );
  }

  // Construire les stats depuis les données récupérées
  const stats = statsJour?.stats
    ? statsJour.stats.map((stat, index) => ({
        ...stat,
        icon: index === 0 ? FaCalendarCheck : FaClock,
      }))
    : [
        {
          title: "RDV Aujourd'hui",
          value: "0",
          icon: FaCalendarCheck,
          color: "blue",
          bgGradient: "from-blue-400 to-blue-600",
        },
        {
          title: "Créneaux Libres",
          value: "0",
          icon: FaClock,
          color: "green",
          bgGradient: "from-green-400 to-green-600",
        },
      ];

  // Utiliser les RDV d'aujourd'hui depuis l'API ou données par défaut
  const rdvAujourdhui = statsJour?.rdvAujourdhui || [];

  return (
    <div className="w-full h-full space-y-6">
      {/* En-tête */}
      <div className="bg-white/90 border border-blue-200 rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-blue-800 mb-2">
              Bonjour Dr {currentUser?.prenom} {currentUser?.nom}
            </h1>
            <p className="text-blue-600">
              Bienvenue sur votre espace médecin. Voici un aperçu de votre
              journée.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <FaSync className={`${loading ? "animate-spin" : ""}`} />
            Actualiser
          </button>
        </div>
      </div>

      {/* Statistiques */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {[1, 2].map((index) => (
            <div
              key={index}
              className="bg-white/90 border border-blue-100 rounded-2xl shadow-lg p-6"
            >
              <div className="animate-pulse">
                <div className="h-4 bg-blue-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-blue-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          Erreur lors du chargement des statistiques : {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/90 border border-blue-100 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${stat.bgGradient || "from-blue-400 to-blue-600"} shadow-lg`}
                >
                  {stat.icon ? (
                    <stat.icon className="text-white text-xl" />
                  ) : (
                    <FaCalendarCheck className="text-white text-xl" />
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold text-blue-800">
                    {stat.value}
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-blue-600">
                {stat.title}
              </h3>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Planning du jour */}
        <div className="bg-white/90 border border-blue-100 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-extrabold text-blue-800 mb-4 flex items-center gap-2">
            <FaCalendarCheck className="text-blue-600" />
            Planning d'aujourd'hui
          </h2>
          <div className="space-y-3">
            {loading ? (
              // État de chargement
              <div className="space-y-3">
                {[1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-blue-50/50 border border-blue-100 rounded-xl"
                  >
                    <div className="w-12 h-12 bg-blue-200 rounded-xl animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-blue-200 rounded w-3/4 mb-2 animate-pulse"></div>
                      <div className="h-3 bg-blue-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : rdvAujourdhui.length > 0 ? (
              // RDV existants
              rdvAujourdhui.map((rdv, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 rounded-xl hover:bg-blue-100/50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                      {rdv.heure}
                    </div>
                    <div>
                      <div className="font-semibold text-blue-900">
                        {rdv.patient}
                      </div>
                      <div className="text-sm text-blue-600">
                        {rdv.type || "Consultation"}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      rdv.statut === "confirmé"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {rdv.statut}
                  </span>
                </div>
              ))
            ) : (
              // Aucun RDV
              <div className="text-center py-8">
                <FaCalendarCheck className="text-4xl text-blue-300 mx-auto mb-4" />
                <p className="text-blue-600">
                  Aucun rendez-vous prévu aujourd'hui
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Patients récents */}
        {patientsRecents.length > 0 && (
          <div className="bg-white/90 border border-blue-100 rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-extrabold text-blue-800 mb-4 flex items-center gap-2">
              <FaUserInjured className="text-blue-600" />
              Patients récents
            </h2>
            <div className="space-y-3">
              {patientsRecents.slice(0, 3).map((patient, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-blue-50/50 border border-blue-100 rounded-xl hover:bg-blue-100/50 transition-all"
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {patient.utilisateur?.prenom?.charAt(0)}
                    {patient.utilisateur?.nom?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-blue-900">
                      {patient.utilisateur?.prenom} {patient.utilisateur?.nom}
                    </div>
                    <div className="text-sm text-blue-600">
                      Tel: {patient.utilisateur?.telephone || "N/A"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions rapides */}
        <div className="bg-white/90 border border-blue-100 rounded-2xl shadow-xl p-6 lg:col-span-1">
          <h2 className="text-xl font-extrabold text-blue-800 mb-4">
            Actions rapides
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/medecin/planning")}
              className="w-full p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
            >
              Planning semaine
            </button>
            <button
              onClick={() => navigate("/medecin/creneaux")}
              className="w-full p-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
            >
              Gérer créneaux
            </button>
            <button
              onClick={() => navigate("/medecin/historique")}
              className="w-full p-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
            >
              Historique RDV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedecinDashboard;
