import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarPlus,
  FaUserMd,
  FaBriefcaseMedical,
  FaClock,
  FaMapMarkerAlt,
  FaEuroSign,
  FaCheck,
  FaSpinner,
} from "react-icons/fa";
import {
  useFetchServices,
  useMedecinsByService,
  useCreneauxDisponibles,
  usePrendreRendezVous,
} from "../../services";

function PatientPrendreRdv() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const patientId = currentUser?.patientId;

  console.log("currentUser:", currentUser); // DEBUG
  console.log("patientId:", patientId); // DEBUG

  const [etapeActuelle, setEtapeActuelle] = useState(1);
  const [serviceSelectionne, setServiceSelectionne] = useState(null);
  const [medecinSelectionne, setMedecinSelectionne] = useState(null);
  const [creneauSelectionne, setCreneauSelectionne] = useState(null);
  const [motifConsultation, setMotifConsultation] = useState("");

  // Hooks API
  const {
    services,
    loading: loadingServices,
    error: errorServices,
  } = useFetchServices();
  const {
    medecins,
    loading: loadingMedecins,
    fetchMedecinsByService,
    resetMedecins,
  } = useMedecinsByService();
  const {
    creneaux,
    loading: loadingCreneaux,
    fetchCreneauxDisponibles,
    resetCreneaux,
  } = useCreneauxDisponibles();
  const {
    loading: loadingReservation,
    error: errorReservation,
    prendreRendezVous,
  } = usePrendreRendezVous();

  const handleSelectionService = async (service) => {
    setServiceSelectionne(service);
    setMedecinSelectionne(null);
    setCreneauSelectionne(null);
    resetCreneaux();
    await fetchMedecinsByService(service.id);
    setEtapeActuelle(2);
  };

  const handleSelectionMedecin = async (medecin) => {
    setMedecinSelectionne(medecin);
    setCreneauSelectionne(null);
    await fetchCreneauxDisponibles(medecin.id);
    setEtapeActuelle(3);
  };

  const handleSelectionCreneau = (creneau) => {
    setCreneauSelectionne(creneau);
    setEtapeActuelle(4);
  };

  const handleConfirmerReservation = async () => {
    if (!patientId || !creneauSelectionne?.id) {
      alert("Erreur: informations manquantes pour la réservation");
      return;
    }

    const result = await prendreRendezVous(
      patientId,
      creneauSelectionne.id,
      motifConsultation || null,
    );

    if (result.success) {
      alert(
        "Demande de rendez-vous envoyée avec succès! Vous recevrez une confirmation.",
      );
      // Reset du formulaire
      setEtapeActuelle(1);
      setServiceSelectionne(null);
      setMedecinSelectionne(null);
      setCreneauSelectionne(null);
      setMotifConsultation("");
      resetMedecins();
      resetCreneaux();
      // Rediriger vers les demandes
      navigate("/patient/mes-demandes");
    } else {
      alert(
        "Erreur lors de la réservation: " +
          (result.error || "Veuillez réessayer"),
      );
    }
  };

  const retournerEtape = (etape) => {
    setEtapeActuelle(etape);
    if (etape < 2) {
      setServiceSelectionne(null);
      setMedecinSelectionne(null);
      setCreneauSelectionne(null);
      resetMedecins();
      resetCreneaux();
    }
    if (etape < 3) {
      setMedecinSelectionne(null);
      setCreneauSelectionne(null);
      resetCreneaux();
    }
    if (etape < 4) {
      setCreneauSelectionne(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Formater l'heure depuis HH:mm:ss vers HH:mm
  const formatHeure = (heureString) => {
    if (!heureString) return "";
    return heureString.substring(0, 5);
  };

  return (
    <div className="w-full h-full space-y-6">
      <h1 className="text-2xl font-extrabold text-blue-800 mb-6 flex items-center gap-2">
        <FaCalendarPlus className="text-blue-600" />
        Prendre un Rendez-vous
      </h1>

      {/* Indicateur d'étapes */}
      <div className="bg-white/90 border border-blue-200 rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: "Service", icon: FaBriefcaseMedical },
            { num: 2, label: "Médecin", icon: FaUserMd },
            { num: 3, label: "Créneau", icon: FaClock },
            { num: 4, label: "Confirmation", icon: FaCheck },
          ].map((etape, index) => (
            <div key={etape.num} className="flex items-center">
              <button
                onClick={() => retournerEtape(etape.num)}
                disabled={etape.num > etapeActuelle}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  etape.num <= etapeActuelle
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-200 text-gray-400"
                } ${etape.num < etapeActuelle ? "hover:bg-blue-700 cursor-pointer" : ""}`}
              >
                <etape.icon />
              </button>
              <div className="ml-2">
                <div
                  className={`text-sm font-semibold ${etape.num <= etapeActuelle ? "text-blue-600" : "text-gray-400"}`}
                >
                  {etape.label}
                </div>
              </div>
              {index < 3 && (
                <div
                  className={`w-16 h-1 mx-4 ${etape.num < etapeActuelle ? "bg-blue-600" : "bg-gray-200"}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Étape 1: Sélection du service */}
      {etapeActuelle === 1 && (
        <div className="bg-white/90 border border-blue-200 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-extrabold text-blue-800 mb-4 flex items-center gap-2">
            <FaBriefcaseMedical className="text-blue-600" />
            Choisissez votre service médical
          </h2>

          {loadingServices ? (
            <div className="flex items-center justify-center py-8">
              <FaSpinner className="animate-spin text-blue-600 text-2xl mr-2" />
              <span className="text-blue-600">Chargement des services...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services?.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleSelectionService(service)}
                  className="p-6 border border-blue-100 rounded-xl hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer bg-gradient-to-br from-blue-50/50 to-white"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">🏥</div>
                    <h3 className="font-extrabold text-blue-900 text-lg mb-2">
                      {service.nom}
                    </h3>
                    <p className="text-sm text-blue-600 mb-3">
                      {service.description || "Service médical disponible"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Étape 2: Sélection du médecin */}
      {etapeActuelle === 2 && serviceSelectionne && (
        <div className="bg-white/90 border border-blue-200 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-extrabold text-blue-800 mb-4 flex items-center gap-2">
            <FaUserMd className="text-blue-600" />
            Choisissez votre médecin en {serviceSelectionne.nom}
          </h2>

          {loadingMedecins ? (
            <div className="flex items-center justify-center py-8">
              <FaSpinner className="animate-spin text-blue-600 text-2xl mr-2" />
              <span className="text-blue-600">Chargement des médecins...</span>
            </div>
          ) : medecins && medecins.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {medecins.map((medecin) => (
                <div
                  key={medecin.id}
                  onClick={() => handleSelectionMedecin(medecin)}
                  className="p-6 border border-blue-100 rounded-xl hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {medecin.utilisateur?.prenom?.[0] || "M"}
                      {medecin.utilisateur?.nom?.[0] || "D"}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-extrabold text-blue-900 text-lg">
                        Dr {medecin.utilisateur?.prenom}{" "}
                        {medecin.utilisateur?.nom}
                      </h3>
                      <p className="text-blue-600 font-medium mb-2">
                        {medecin.specialite || serviceSelectionne.nom}
                      </p>
                      <div className="space-y-1 text-sm">
                        {medecin.adresseCabinet && (
                          <div className="flex items-center gap-2 text-blue-700">
                            <FaMapMarkerAlt className="text-xs" />
                            {medecin.adresseCabinet}
                          </div>
                        )}
                        {medecin.dureeSeance && (
                          <div className="flex items-center gap-2 text-blue-700">
                            <FaClock className="text-xs" />
                            Consultation: {medecin.dureeSeance} min
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-blue-600">
              Aucun médecin disponible pour ce service pour le moment.
            </div>
          )}
        </div>
      )}

      {/* Étape 3: Sélection du créneau */}
      {etapeActuelle === 3 && medecinSelectionne && (
        <div className="bg-white/90 border border-blue-200 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-extrabold text-blue-800 mb-4 flex items-center gap-2">
            <FaClock className="text-blue-600" />
            Choisissez un créneau avec Dr{" "}
            {medecinSelectionne.utilisateur?.prenom}{" "}
            {medecinSelectionne.utilisateur?.nom}
          </h2>

          {loadingCreneaux ? (
            <div className="flex items-center justify-center py-8">
              <FaSpinner className="animate-spin text-blue-600 text-2xl mr-2" />
              <span className="text-blue-600">Chargement des créneaux...</span>
            </div>
          ) : creneaux && creneaux.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {creneaux.map((creneau) => (
                <div
                  key={creneau.id}
                  onClick={() => handleSelectionCreneau(creneau)}
                  className="p-4 border border-blue-100 rounded-xl hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer text-center"
                >
                  <div className="font-extrabold text-blue-900 text-lg mb-2">
                    {formatHeure(creneau.heureDebut)}
                  </div>
                  <div className="text-sm text-blue-600">
                    {formatDate(creneau.date || creneau.dateDay)}
                  </div>
                  <div className="mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Disponible
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-blue-600">
              Aucun créneau disponible pour ce médecin pour le moment.
            </div>
          )}
        </div>
      )}

      {/* Étape 4: Confirmation */}
      {etapeActuelle === 4 && creneauSelectionne && (
        <div className="bg-white/90 border border-blue-200 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-extrabold text-blue-800 mb-4 flex items-center gap-2">
            <FaCheck className="text-blue-600" />
            Confirmation de votre rendez-vous
          </h2>

          <div className="space-y-6">
            {/* Récapitulatif */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6">
              <h3 className="font-extrabold text-blue-900 mb-4">
                Récapitulatif
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-semibold text-blue-700">
                    Service
                  </div>
                  <div className="text-blue-900">{serviceSelectionne?.nom}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-blue-700">
                    Médecin
                  </div>
                  <div className="text-blue-900">
                    Dr {medecinSelectionne?.utilisateur?.prenom}{" "}
                    {medecinSelectionne?.utilisateur?.nom}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-blue-700">
                    Date
                  </div>
                  <div className="text-blue-900">
                    {formatDate(
                      creneauSelectionne?.date || creneauSelectionne?.dateDay,
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-blue-700">
                    Heure
                  </div>
                  <div className="text-blue-900">
                    {formatHeure(creneauSelectionne?.heureDebut)}
                  </div>
                </div>
                {medecinSelectionne?.adresseCabinet && (
                  <div className="md:col-span-2">
                    <div className="text-sm font-semibold text-blue-700">
                      Adresse
                    </div>
                    <div className="text-blue-900">
                      {medecinSelectionne.adresseCabinet}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Motif de consultation */}
            <div>
              <label className="block text-blue-700 font-semibold mb-2">
                Motif de la consultation (optionnel)
              </label>
              <textarea
                value={motifConsultation}
                onChange={(e) => setMotifConsultation(e.target.value)}
                placeholder="Décrivez brièvement le motif de votre consultation..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            {/* Information importante */}
            <div className="bg-yellow-50/50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-yellow-800">
                <strong>Important :</strong> Votre demande de rendez-vous sera
                transmise au médecin. Vous recevrez une confirmation par email
                ou SMS une fois validée par le praticien.
              </p>
            </div>

            {/* Erreur éventuelle */}
            {errorReservation && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-800">{errorReservation}</p>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="flex gap-4">
              <button
                onClick={() => retournerEtape(3)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-all"
                disabled={loadingReservation}
              >
                Retour
              </button>
              <button
                onClick={handleConfirmerReservation}
                className="flex-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                disabled={loadingReservation}
              >
                {loadingReservation ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <FaCheck />
                    Confirmer la demande
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientPrendreRdv;
