import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  FaHistory,
  FaSearch,
  FaCalendarCheck,
  FaEye,
  FaSpinner,
} from "react-icons/fa";
import useHistoriqueMedecin from "../../services/hooks/rendezVous/useHistoriqueMedecin";

function MedecinHistorique() {
  const utilisateur = useSelector((state) => state.user.currentUser);
  const [filtres, setFiltres] = useState({
    dateDebut: "",
    dateFin: "",
    patient: "",
    statut: "tous",
  });

  const [consultationSelectionnee, setConsultationSelectionnee] =
    useState(null);
  const [modalDetail, setModalDetail] = useState(false);

  // Hook pour l'API
  const { loading, error, historique, fetchHistorique } =
    useHistoriqueMedecin();

  // Charger l'historique au montage du composant
  useEffect(() => {
    if (utilisateur && utilisateur.id) {
      fetchHistorique(utilisateur.id, 100); // Récupérer les 100 dernières consultations
    }
  }, [utilisateur, fetchHistorique]);

  // Adapter les données de l'API pour l'interface
  const historiqueAdapte = historique.map((rdv) => ({
    id: rdv.id,
    date: rdv.creneau?.dateCreneau || rdv.date,
    heure: rdv.creneau?.heureDebut || rdv.heure,
    patient: {
      nom: rdv.patient?.nom || rdv.patient?.utilisateur?.nom || "N/A",
      prenom: rdv.patient?.prenom || rdv.patient?.utilisateur?.prenom || "N/A",
      telephone:
        rdv.patient?.telephone || rdv.patient?.utilisateur?.telephone || "N/A",
    },
    motif: rdv.motif || "Non précisé",
    statut: mapStatutFromAPI(rdv.statutRdv),
  }));

  // Mapper les statuts API vers interface
  function mapStatutFromAPI(statutAPI) {
    const mapping = {
      TERMINE: "terminé",
      ANNULE: "annulé",
      CONFIRME: "confirmé",
      EN_ATTENTE: "en attente",
    };
    return mapping[statutAPI] || statutAPI?.toLowerCase() || "inconnu";
  }

  // Utiliser les données de l'API
  const historiqueData = historiqueAdapte;

  const handleFiltreChange = (e) => {
    const { name, value } = e.target;
    setFiltres((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFiltres = () => {
    setFiltres({
      dateDebut: "",
      dateFin: "",
      patient: "",
      statut: "tous",
    });
  };

  const ouvrirDetailConsultation = (consultation) => {
    setConsultationSelectionnee(consultation);
    setModalDetail(true);
  };

  const historiqueFitre = historiqueData.filter((consultation) => {
    const matchDateDebut =
      !filtres.dateDebut || consultation.date >= filtres.dateDebut;
    const matchDateFin =
      !filtres.dateFin || consultation.date <= filtres.dateFin;
    const matchPatient =
      !filtres.patient ||
      `${consultation.patient.prenom} ${consultation.patient.nom}`
        .toLowerCase()
        .includes(filtres.patient.toLowerCase());
    const matchStatut =
      filtres.statut === "tous" || consultation.statut === filtres.statut;

    return matchDateDebut && matchDateFin && matchPatient && matchStatut;
  });

  const stats = {
    total: historiqueFitre.length,
    derniereMsemaine: historiqueFitre.filter((c) => {
      const dateConsult = new Date(c.date);
      const semaineDerniere = new Date();
      semaineDerniere.setDate(semaineDerniere.getDate() - 7);
      return dateConsult >= semaineDerniere;
    }).length,
  };

  // Affichage des erreurs
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p className="font-bold">Erreur</p>
          <p>{error}</p>
          <button
            onClick={() => utilisateur && fetchHistorique(utilisateur.id, 100)}
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
        <FaHistory className="text-blue-600" />
        Historique des Consultations
      </h1>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/90 border border-blue-100 rounded-2xl shadow-lg p-6 text-center">
          <div className="text-3xl font-extrabold text-blue-800 mb-2">
            {loading ? (
              <FaSpinner className="animate-spin mx-auto" />
            ) : (
              stats.total
            )}
          </div>
          <div className="text-blue-600 font-medium">Consultations totales</div>
        </div>
        <div className="bg-white/90 border border-green-100 rounded-2xl shadow-lg p-6 text-center">
          <div className="text-3xl font-extrabold text-green-800 mb-2">
            {loading ? (
              <FaSpinner className="animate-spin mx-auto" />
            ) : (
              stats.derniereMsemaine
            )}
          </div>
          <div className="text-green-600 font-medium">Cette semaine</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white/90 border border-blue-200 rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-extrabold text-blue-800 mb-4 flex items-center gap-2">
          <FaSearch className="text-blue-600" />
          Filtrer l'historique
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-blue-700 font-semibold mb-2">
              Date début
            </label>
            <input
              type="date"
              name="dateDebut"
              value={filtres.dateDebut}
              onChange={handleFiltreChange}
              className="w-full px-3 py-2 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-blue-700 font-semibold mb-2">
              Date fin
            </label>
            <input
              type="date"
              name="dateFin"
              value={filtres.dateFin}
              onChange={handleFiltreChange}
              className="w-full px-3 py-2 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-blue-700 font-semibold mb-2">
              Patient
            </label>
            <input
              type="text"
              name="patient"
              placeholder="Nom ou prénom..."
              value={filtres.patient}
              onChange={handleFiltreChange}
              className="w-full px-3 py-2 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-blue-700 font-semibold mb-2">
              Statut
            </label>
            <select
              name="statut"
              value={filtres.statut}
              onChange={handleFiltreChange}
              className="w-full px-3 py-2 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="tous">Tous</option>
              <option value="terminé">Terminé</option>
              <option value="annulé">Annulé</option>
            </select>
          </div>
        </div>

        <button
          onClick={resetFiltres}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
        >
          Réinitialiser filtres
        </button>
      </div>

      {/* Liste de l'historique */}
      <div className="bg-white/90 border border-blue-200 rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-extrabold text-blue-800 mb-4">
          Consultations ({historiqueFitre.length})
        </h2>

        {/* État de chargement */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <FaSpinner className="animate-spin text-3xl text-blue-600 mr-3" />
            <span className="text-blue-600 text-lg">
              Chargement de l'historique...
            </span>
          </div>
        ) : historiqueFitre.length === 0 ? (
          <div className="text-center py-8 text-blue-600">
            <FaHistory className="text-6xl mb-4 mx-auto opacity-30" />
            <p className="text-xl font-medium">
              Aucune consultation trouvée avec ces critères
            </p>
            <p className="text-sm mt-2">
              Modifiez les filtres ou patientez pour de nouvelles consultations
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700">
                  <th className="py-3 px-4 text-left rounded-tl-xl font-bold">
                    Date/Heure
                  </th>
                  <th className="py-3 px-4 text-left font-bold">Patient</th>
                  <th className="py-3 px-4 text-left font-bold">Motif</th>
                  <th className="py-3 px-4 text-left font-bold">Durée</th>
                  <th className="py-3 px-4 text-left font-bold">Statut</th>
                  <th className="py-3 px-4 text-left rounded-tr-xl font-bold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {historiqueFitre.map((consultation, index) => (
                  <tr
                    key={consultation.id}
                    className={`border-b border-blue-100 hover:bg-blue-50/60 transition ${
                      index % 2 === 0 ? "bg-white" : "bg-blue-50/40"
                    }`}
                  >
                    <td className="py-3 px-4 font-semibold text-blue-900">
                      <div>
                        {consultation.date
                          ? new Date(consultation.date).toLocaleDateString(
                              "fr-FR",
                            )
                          : "N/A"}
                      </div>
                      <div className="text-sm text-blue-600">
                        {consultation.heure}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-blue-900">
                        {consultation.patient.prenom} {consultation.patient.nom}
                      </div>
                      <div className="text-sm text-blue-600">
                        {consultation.patient.telephone}
                      </div>
                    </td>
                    <td
                      className="py-3 px-4 text-blue-900 max-w-xs truncate"
                      title={consultation.motif}
                    >
                      {consultation.motif}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          consultation.statut === "terminé"
                            ? "bg-green-100 text-green-700"
                            : consultation.statut === "annulé"
                              ? "bg-red-100 text-red-700"
                              : consultation.statut === "confirmé"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {consultation.statut}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => ouvrirDetailConsultation(consultation)}
                        className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                      >
                        <FaEye />
                        Voir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal détail consultation */}
      {modalDetail && consultationSelectionnee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-extrabold text-blue-800">
                Détail de la consultation
              </h3>
              <button
                onClick={() => setModalDetail(false)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Informations générales */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50/50 rounded-lg">
                <div>
                  <div className="font-semibold text-blue-700">Date</div>
                  <div className="text-blue-900">
                    {consultationSelectionnee.date
                      ? new Date(
                          consultationSelectionnee.date,
                        ).toLocaleDateString("fr-FR")
                      : "Date non renseignée"}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-blue-700">Heure</div>
                  <div className="text-blue-900">
                    {consultationSelectionnee.heure || "Heure non renseignée"}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-blue-700">Statut</div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      consultationSelectionnee.statut === "terminé"
                        ? "bg-green-100 text-green-700"
                        : consultationSelectionnee.statut === "annulé"
                          ? "bg-red-100 text-red-700"
                          : consultationSelectionnee.statut === "confirmé"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {consultationSelectionnee.statut}
                  </span>
                </div>
              </div>

              {/* Informations patient */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Patient</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-medium">Nom:</span>{" "}
                    {consultationSelectionnee.patient?.nom || "Non renseigné"}
                  </div>
                  <div>
                    <span className="font-medium">Prénom:</span>{" "}
                    {consultationSelectionnee.patient?.prenom ||
                      "Non renseigné"}
                  </div>
                  <div>
                    <span className="font-medium">Téléphone:</span>{" "}
                    {consultationSelectionnee.patient?.telephone ||
                      "Non renseigné"}
                  </div>
                </div>
              </div>

              {/* Consultation */}
              <div className="space-y-3">
                <div>
                  <div className="font-semibold text-blue-700 mb-1">
                    Motif de consultation
                  </div>
                  <div className="p-3 bg-blue-50/50 rounded-lg">
                    {consultationSelectionnee.motif || "Motif non précisé"}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setModalDetail(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-all"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MedecinHistorique;
