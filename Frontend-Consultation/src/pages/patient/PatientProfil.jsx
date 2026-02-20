import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FaUser,
  FaEdit,
  FaSave,
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaKey,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaHistory,
  FaSpinner,
  FaCamera,
} from "react-icons/fa";
import { useUpdatePatient, useStatsPatient } from "../../services";
import { updateUser } from "../../store/userSlice";
import patientService from "../../services/api/patientService";

function PatientProfil() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const patientId = currentUser?.patientId;

  const {
    loading: loadingUpdate,
    error: errorUpdate,
    updatePatient,
  } = useUpdatePatient();
  const { stats, loading: loadingStats, fetchStatsPatient } = useStatsPatient();

  const [patientData, setPatientData] = useState(null);
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [modeEdition, setModeEdition] = useState(false);
  const [ongletActif, setOngletActif] = useState("profil");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // États pour les formulaires
  const [profilData, setProfilData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    dateNaissance: "",
    adresse: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Charger les données du patient et les statistiques
  useEffect(() => {
    const fetchPatientData = async () => {
      if (patientId) {
        setLoadingPatient(true);
        try {
          const data = await patientService.getById(patientId);
          setPatientData(data);
        } catch (error) {
          console.error("Erreur lors du chargement du patient:", error);
        } finally {
          setLoadingPatient(false);
        }
        // Charger les statistiques
        fetchStatsPatient(patientId);
      } else {
        setLoadingPatient(false);
      }
    };
    fetchPatientData();
  }, [patientId, fetchStatsPatient]);

  // Initialiser les données du profil depuis l'API ou currentUser
  useEffect(() => {
    const userData = patientData?.utilisateur || currentUser;
    if (userData) {
      setProfilData({
        nom: userData.nom || "",
        prenom: userData.prenom || "",
        email: userData.email || "",
        telephone: userData.telephone || "",
        dateNaissance: patientData?.dateNaissance || "",
        adresse: patientData?.adresse || "",
      });
    }
  }, [currentUser, patientData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfilData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfil = async () => {
    if (!patientId) {
      setMessage({ type: "error", text: "ID patient non trouvé" });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setLoading(true);
    try {
      // Préparer les données pour l'API
      const patientUpdateData = {
        id: patientId,
        dateNaissance: profilData.dateNaissance,
        adresse: profilData.adresse,
        utilisateur: {
          id: currentUser.id,
          nom: profilData.nom,
          prenom: profilData.prenom,
          email: profilData.email,
          telephone: profilData.telephone,
          actif: true,
        },
      };

      const result = await updatePatient(patientId, patientUpdateData);

      if (result.success) {
        // Mettre à jour le store Redux avec les nouvelles données
        dispatch(
          updateUser({
            nom: profilData.nom,
            prenom: profilData.prenom,
            email: profilData.email,
            telephone: profilData.telephone,
          }),
        );

        setModeEdition(false);
        setMessage({ type: "success", text: "Profil mis à jour avec succès!" });
      } else {
        throw new Error(result.error || "Erreur lors de la mise à jour");
      }

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Erreur lors de la mise à jour du profil.",
      });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({
        type: "error",
        text: "Les mots de passe ne correspondent pas.",
      });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Le mot de passe doit contenir au moins 6 caractères.",
      });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setLoading(true);
    try {
      // Simulation d'appel API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Changement de mot de passe:", passwordData);

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setMessage({
        type: "success",
        text: "Mot de passe modifié avec succès!",
      });

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erreur lors du changement de mot de passe.",
      });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setModeEdition(false);
    // Réinitialiser les données depuis l'API ou currentUser
    const userData = patientData?.utilisateur || currentUser;
    if (userData) {
      setProfilData({
        nom: userData.nom || "",
        prenom: userData.prenom || "",
        email: userData.email || "",
        telephone: userData.telephone || "",
        dateNaissance: patientData?.dateNaissance || "",
        adresse: patientData?.adresse || "",
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  const calculerAge = (dateNaissance) => {
    if (!dateNaissance) return "";
    const today = new Date();
    const birth = new Date(dateNaissance);
    const age = today.getFullYear() - birth.getFullYear();
    return age;
  };

  return (
    <div className="w-full h-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-blue-800 flex items-center gap-2">
          <FaUser className="text-blue-600" />
          Mon Profil
        </h1>

        {!modeEdition && ongletActif === "profil" && (
          <button
            onClick={() => setModeEdition(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-all flex items-center gap-2"
          >
            <FaEdit />
            Modifier
          </button>
        )}
      </div>

      {/* Message de notification */}
      {message && (
        <div
          className={`border rounded-lg p-4 ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Onglets */}
      <div className="bg-white/90 border border-blue-200 rounded-2xl shadow-xl">
        <div className="flex border-b border-blue-200">
          {[
            { id: "profil", label: "Informations Personnelles", icon: FaUser },
            { id: "securite", label: "Sécurité", icon: FaShieldAlt },
            { id: "statistiques", label: "Mes Statistiques", icon: FaHistory },
          ].map((onglet) => (
            <button
              key={onglet.id}
              onClick={() => setOngletActif(onglet.id)}
              className={`flex-1 p-4 text-center font-semibold flex items-center justify-center gap-2 transition-all ${
                ongletActif === onglet.id
                  ? "text-blue-700 border-b-2 border-blue-600 bg-blue-50/50"
                  : "text-blue-600 hover:bg-blue-50/30"
              }`}
            >
              <onglet.icon />
              <span className="hidden md:inline">{onglet.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Onglet Profil */}
          {ongletActif === "profil" && (
            <div className="space-y-6">
              {/* Photo de profil */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {currentUser?.prenom?.[0]}
                  {currentUser?.nom?.[0]}
                </div>
                {modeEdition && (
                  <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 mx-auto">
                    <FaCamera />
                    Changer la photo
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nom */}
                <div>
                  <label className="block text-blue-700 font-semibold mb-2">
                    Nom
                  </label>
                  {modeEdition ? (
                    <input
                      type="text"
                      name="nom"
                      value={profilData.nom}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-blue-50/30 border border-blue-100 rounded-lg text-blue-900">
                      {profilData.nom || "Non renseigné"}
                    </div>
                  )}
                </div>

                {/* Prénom */}
                <div>
                  <label className="block text-blue-700 font-semibold mb-2">
                    Prénom
                  </label>
                  {modeEdition ? (
                    <input
                      type="text"
                      name="prenom"
                      value={profilData.prenom}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-blue-50/30 border border-blue-100 rounded-lg text-blue-900">
                      {profilData.prenom || "Non renseigné"}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-blue-700 font-semibold mb-2 flex items-center gap-2">
                    <FaEnvelope />
                    Email
                  </label>
                  {modeEdition ? (
                    <input
                      type="email"
                      name="email"
                      value={profilData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-blue-50/30 border border-blue-100 rounded-lg text-blue-900">
                      {profilData.email || "Non renseigné"}
                    </div>
                  )}
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-blue-700 font-semibold mb-2 flex items-center gap-2">
                    <FaPhone />
                    Téléphone
                  </label>
                  {modeEdition ? (
                    <input
                      type="tel"
                      name="telephone"
                      value={profilData.telephone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-blue-50/30 border border-blue-100 rounded-lg text-blue-900">
                      {profilData.telephone || "Non renseigné"}
                    </div>
                  )}
                </div>

                {/* Date de naissance */}
                <div>
                  <label className="block text-blue-700 font-semibold mb-2 flex items-center gap-2">
                    <FaCalendarAlt />
                    Date de naissance
                  </label>
                  {modeEdition ? (
                    <input
                      type="date"
                      name="dateNaissance"
                      value={profilData.dateNaissance}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-blue-50/30 border border-blue-100 rounded-lg text-blue-900">
                      {profilData.dateNaissance
                        ? `${formatDate(profilData.dateNaissance)} (${calculerAge(profilData.dateNaissance)} ans)`
                        : "Non renseigné"}
                    </div>
                  )}
                </div>

                {/* Adresse */}
                <div className="md:col-span-2">
                  <label className="block text-blue-700 font-semibold mb-2 flex items-center gap-2">
                    <FaMapMarkerAlt />
                    Adresse
                  </label>
                  {modeEdition ? (
                    <input
                      type="text"
                      name="adresse"
                      placeholder="Adresse"
                      value={profilData.adresse}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-blue-50/30 border border-blue-100 rounded-lg text-blue-900">
                      {profilData.adresse || "Non renseigné"}
                    </div>
                  )}
                </div>
              </div>

              {modeEdition && (
                <div className="flex gap-4 pt-4 border-t border-blue-200">
                  <button
                    onClick={handleSaveProfil}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <FaSave />
                    {loading ? "Sauvegarde..." : "Sauvegarder"}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition-all flex items-center gap-2"
                  >
                    <FaTimes />
                    Annuler
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Onglet Sécurité */}
          {ongletActif === "securite" && (
            <div className="space-y-6">
              <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-extrabold text-blue-800 mb-4 flex items-center gap-2">
                  <FaKey />
                  Changer le mot de passe
                </h3>

                <div className="space-y-4">
                  {/* Mot de passe actuel */}
                  <div>
                    <label className="block text-blue-700 font-semibold mb-2">
                      Mot de passe actuel
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.current ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 pr-10 rounded-lg border border-blue-200 bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            current: !prev.current,
                          }))
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500"
                      >
                        {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {/* Nouveau mot de passe */}
                  <div>
                    <label className="block text-blue-700 font-semibold mb-2">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.new ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 pr-10 rounded-lg border border-blue-200 bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            new: !prev.new,
                          }))
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500"
                      >
                        {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {/* Confirmer nouveau mot de passe */}
                  <div>
                    <label className="block text-blue-700 font-semibold mb-2">
                      Confirmer le nouveau mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 pr-10 rounded-lg border border-blue-200 bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            confirm: !prev.confirm,
                          }))
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500"
                      >
                        {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleChangePassword}
                    disabled={
                      loading ||
                      !passwordData.currentPassword ||
                      !passwordData.newPassword ||
                      !passwordData.confirmPassword
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all disabled:opacity-50"
                  >
                    {loading ? "Modification..." : "Changer le mot de passe"}
                  </button>
                </div>
              </div>

              {/* Conseils de sécurité */}
              <div className="bg-green-50/50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">
                  Conseils de sécurité
                </h4>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Utilisez un mot de passe d'au moins 8 caractères</li>
                  <li>
                    • Mélangez lettres majuscules, minuscules, chiffres et
                    symboles
                  </li>
                  <li>• Ne partagez jamais votre mot de passe</li>
                  <li>• Changez régulièrement votre mot de passe</li>
                </ul>
              </div>
            </div>
          )}

          {/* Onglet Statistiques */}
          {ongletActif === "statistiques" && (
            <div className="space-y-6">
              {/* Indicateur de chargement */}
              {loadingStats && (
                <div className="flex items-center justify-center py-4">
                  <FaSpinner className="animate-spin text-blue-600 text-xl mr-2" />
                  <span className="text-blue-600">
                    Chargement des statistiques...
                  </span>
                </div>
              )}

              {/* Statistiques générales */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 text-center">
                  <div className="text-2xl font-extrabold text-blue-700">
                    {(stats?.rdvEnAttente ?? 0) +
                      (stats?.rdvConfirmes ?? 0) +
                      (stats?.rdvTermines ?? 0)}
                  </div>
                  <div className="text-sm text-blue-600 font-medium">
                    Total consultations
                  </div>
                </div>

                <div className="bg-green-50/50 border border-green-200 rounded-xl p-4 text-center">
                  <div className="text-2xl font-extrabold text-green-700">
                    {stats?.rdvConfirmes ?? 0}
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    Confirmés
                  </div>
                </div>

                <div className="bg-yellow-50/50 border border-yellow-200 rounded-xl p-4 text-center">
                  <div className="text-2xl font-extrabold text-yellow-700">
                    {stats?.rdvEnAttente ?? 0}
                  </div>
                  <div className="text-sm text-yellow-600 font-medium">
                    En attente
                  </div>
                </div>

                <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-4 text-center">
                  <div className="text-2xl font-extrabold text-gray-700">
                    {stats?.rdvTermines ?? 0}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Terminés
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientProfil;
