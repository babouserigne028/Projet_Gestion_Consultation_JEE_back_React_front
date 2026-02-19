import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FaUserMd,
  FaEdit,
  FaSave,
  FaTimes,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaSpinner,
} from "react-icons/fa";
import useUpdateCurrentUser from "../../services/hooks/utilisateurs/useUpdateCurrentUser";
import useUpdateMedecin from "../../services/hooks/medecins/useUpdateMedecin";
import { updateUser } from "../../store/userSlice";

function MedecinProfil() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState(false);

  // Hooks pour l'API
  const {
    loading: loadingUser,
    error: errorUser,
    updateCurrentUser,
  } = useUpdateCurrentUser();
  const {
    loading: loadingMedecin,
    error: errorMedecin,
    updateMedecin,
  } = useUpdateMedecin();

  // Calculer les données du profil de manière dérivée pour éviter les boucles infinies
  const profilData = useMemo(() => {
    if (!currentUser) {
      return {
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        specialite: "Médecine générale",
        dureeSeance: 30,
        adresseCabinet: "",
      };
    }

    return {
      nom: currentUser.nom || "",
      prenom: currentUser.prenom || "",
      email: currentUser.email || "",
      telephone: currentUser.telephone || "",
      specialite: currentUser.medecin?.specialite || "Médecine générale",
      dureeSeance: currentUser.medecin?.dureeSeance || 30,
      adresseCabinet: currentUser.medecin?.adresseCabinet || "",
    };
  }, [currentUser]);

  const [formData, setFormData] = useState(() => profilData);

  // Ne mettre à jour formData que lors de l'annulation ou au changement d'utilisateur en dehors du mode édition
  useEffect(() => {
    if (!editMode) {
      setFormData(profilData);
    }
  }, [currentUser?.id, editMode]); // Dépendance seulement sur l'ID de l'utilisateur

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!currentUser?.id) {
      alert("Erreur : utilisateur non connecté");
      return;
    }

    try {
      // Mettre à jour les informations utilisateur de base
      const userData = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
      };

      const userResult = await updateCurrentUser(userData);

      if (!userResult.success) {
        alert(
          "Erreur lors de la mise à jour des informations personnelles : " +
            userResult.error,
        );
        return;
      }

      // Mettre à jour les informations spécifiques médecin
      const medecinData = {
        specialite: formData.specialite,
        dureeSeance: parseInt(formData.dureeSeance),
        adresseCabinet: formData.adresseCabinet,
      };

      const medecinResult = await updateMedecin(currentUser.id, medecinData);

      if (!medecinResult.success) {
        alert(
          "Erreur lors de la mise à jour des informations médecin : " +
            medecinResult.error,
        );
        return;
      }

      // Mettre à jour le store Redux avec les nouvelles données
      const updatedUser = {
        ...currentUser,
        ...userData,
        medecin: {
          ...currentUser.medecin,
          ...medecinData,
        },
      };
      dispatch(updateUser(updatedUser));

      setEditMode(false);
      alert("🎉 Profil mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Erreur lors de la sauvegarde du profil");
    }
  };

  const handleCancel = () => {
    setFormData(profilData);
    setEditMode(false);
  };

  // Affichage des erreurs
  if (errorUser || errorMedecin) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p className="font-bold">Erreur</p>
          <p>{errorUser || errorMedecin}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
          >
            Recharger la page
          </button>
        </div>
      </div>
    );
  }

  const isLoading = loadingUser || loadingMedecin;

  return (
    <div className="w-full h-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-blue-800 flex items-center gap-2">
          <FaUserMd className="text-blue-600" />
          Mon Profil Médecin
        </h1>

        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            disabled={isLoading}
            className={`flex items-center gap-2 font-semibold px-4 py-2 rounded-lg transition-all shadow-lg ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : <FaEdit />}
            {isLoading ? "Chargement..." : "Modifier"}
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className={`flex items-center gap-2 font-semibold px-4 py-2 rounded-lg transition-all shadow-lg ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {isLoading ? <FaSpinner className="animate-spin" /> : <FaSave />}
              {isLoading ? "Sauvegarde..." : "Sauvegarder"}
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className={`flex items-center gap-2 font-semibold px-4 py-2 rounded-lg transition-all shadow-lg ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-gray-600 hover:bg-gray-700 text-white"
              }`}
            >
              <FaTimes />
              Annuler
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations personnelles */}
        <div className="bg-white/90 border border-blue-200 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-extrabold text-blue-800 mb-4">
            Informations personnelles
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-blue-700 font-semibold mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="w-full px-4 py-3 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-70"
                />
              </div>
              <div>
                <label className="block text-blue-700 font-semibold mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="w-full px-4 py-3 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-70"
                />
              </div>
            </div>

            <div>
              <label className="block text-blue-700 font-semibold mb-2">
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-70"
                />
              </div>
            </div>

            <div>
              <label className="block text-blue-700 font-semibold mb-2">
                Téléphone
              </label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-70"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Informations professionnelles */}
        <div className="bg-white/90 border border-blue-200 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-extrabold text-blue-800 mb-4">
            Informations professionnelles
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-blue-700 font-semibold mb-2">
                  Spécialité
                </label>
                <input
                  type="text"
                  name="specialite"
                  value={formData.specialite}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="w-full px-4 py-3 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-70"
                />
              </div>
            </div>

            <div>
              <label className="block text-blue-700 font-semibold mb-2">
                Adresse du cabinet
              </label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
                <input
                  type="text"
                  name="adresseCabinet"
                  value={formData.adresseCabinet}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-70"
                  placeholder="Adresse complète du cabinet"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-blue-700 font-semibold mb-2">
                  Durée consultation (min)
                </label>
                <div className="relative">
                  <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
                  <select
                    name="dureeSeance"
                    value={formData.dureeSeance}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-70"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={20}>20 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 heure</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedecinProfil;
