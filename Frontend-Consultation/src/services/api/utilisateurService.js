
import apiClient from "./client";

const utilisateurService = {
  /**
   * Récupérer les statistiques globales des utilisateurs (endpoint /stats)
   * @returns {Promise<Object>} Les statistiques utilisateurs (total, patients, medecins, admins)
   * @example
   * const stats = await utilisateurService.getUserStats();
   * // stats = { total: 1240, patients: 900, medecins: 300, admins: 40 }
   */
  getUserStats: () => {
    return apiClient.get("/api/utilisateurs/stats");
  },

  /**
   * Récupérer le nombre de médecins par service (endpoint /medecin-par-service)
   * @returns {Promise<Object>} Un objet { "Cardiologie": 40, "Dermatologie": 25, ... }
   * @example
   * const data = await utilisateurService.getMedecinsParService();
   * // data = { "Cardiologie": 40, "Dermatologie": 25, ... }
   */
  getMedecinsParService: () => {
    return apiClient.get("/api/utilisateurs/medecin-par-service");
  },
  /**
   * Récupérer la liste des utilisateurs admins (endpoint /admins)
   * @returns {Promise<Array>} Liste des utilisateurs admins
   * @example
   * const admins = await utilisateurService.getAdmins();
   * // admins = [ { id: 1, nom: "Dupont", ... }, ... ]
   */
  getAdmins: () => {
    return apiClient.get("/api/utilisateurs/admins");
  },

  /**
   * Enregistrer un nouvel administrateur (endpoint /register)
   * @param {Object} adminData - Données du nouvel admin (nom, prenom, email, motDePasse, telephone, actif, role)
   * @returns {Promise<Object>} L'utilisateur créé
   * @example
   * const newAdmin = await utilisateurService.registerAdmin({ nom, prenom, email, motDePasse, telephone, role: "ADMIN" });
   */
  registerAdmin: (adminData) => {
    return apiClient.post("/api/auth/register", adminData);
  },

  /**
   * Supprimer un administrateur par son id (endpoint /{id})
   * @param {number} id - ID de l'administrateur à supprimer
   * @returns {Promise<void>} Rien si succès
   * @example
   * await utilisateurService.deleteAdmin(21);
   */
  deleteAdmin: (id) => {
    return apiClient.delete(`/api/utilisateurs/${id}`);
  },

  /**
   * Mettre à jour un administrateur par son id (endpoint /{id})
   * @param {number} id - ID de l'administrateur à mettre à jour
   * @param {Object} utilisateur - Données à mettre à jour
   * @returns {Promise<Object>} L'utilisateur modifié
   * @example
   * const updated = await utilisateurService.updateAdmin(21, { nom: "NouveauNom" });
   */
  updateAdmin: (id, utilisateur) => {
    return apiClient.put(`/api/utilisateurs/${id}`, utilisateur);
  },

  /**
   * Récupérer la liste des médecins (endpoint /medecins)
   * @returns {Promise<Array>} Liste des médecins avec leurs informations détaillées
   * @example
   * const medecins = await utilisateurService.getMedecins();
   * // medecins = [ { nom, prenom, email, telephone, role, actif, specialite, dureeSeance, adresseCabinet, serviceId }, ... ]
   */
  getMedecins: () => {
    return apiClient.get("/api/medecins");
  },

  /**
   * Met à jour un médecin par son id
   * @param {number} id - ID du médecin à mettre à jour
   * @param {Object} data - Données à mettre à jour (specialite, dureeSeance, adresseCabinet, serviceId)
   * @returns {Promise<Object>} Le médecin modifié
   * @example
   * const updated = await utilisateurService.updateMedecin(5, { specialite: "Cardiologie", dureeSeance: 30, adresseCabinet: "12 rue X", serviceId: 2 });
   */
  updateMedecin: (id, data) => {
    return apiClient.put(`/api/medecins/${id}`, data);
  },

  /**
   * Récupérer la liste de tous les patients (endpoint /patients)
   * @returns {Promise<Array>} Liste des patients
   * @example
   * const patients = await utilisateurService.getPatients();
   * // patients = [ { id, nom, prenom, ... }, ... ]
   */
  getPatients: () => {
    return apiClient.get("/api/patients");
  },

  /**
   * Ajouter un nouveau patient (endpoint /patients)
   * @param {Object} patient - Données du patient à ajouter (JSON avec utilisateur)
   * @returns {Promise<Object>} Le patient créé
   * @example
   * const newPatient = await utilisateurService.addPatient({ nom, prenom, ... });
   */
  addPatient: (patient) => {
    return apiClient.post("/api/patients", patient);
  },

  /**
   * Mettre à jour un patient existant (endpoint /patients/{id})
   * @param {number} id - ID du patient à mettre à jour
   * @param {Object} patient - Nouvelles données du patient (JSON avec utilisateur)
   * @returns {Promise<Object>} Le patient modifié
   * @example
   * const updated = await utilisateurService.updatePatient(5, { nom: "NouveauNom", ... });
   */
  updatePatient: (id, patient) => {
    return apiClient.put(`/api/patients/${id}`, patient);
  },

  /**
   * Supprimer un patient par son id (endpoint /patients/{id})
   * @param {number} id - ID du patient à supprimer
   * @returns {Promise<void>} Rien si succès
   * @example
   * await utilisateurService.deletePatient(18);
   */
  deletePatient: (id) => {
    return apiClient.delete(`/api/patients/${id}`);
  },

  /**
   * Supprimer un médecin par son id (endpoint /medecins/{id})
   * @param {number} id - ID du médecin à supprimer
   * @returns {Promise<void>} Rien si succès
   * @example
   * await utilisateurService.deleteMedecin(18);
   */
  deleteMedecin: (id) => {
    return apiClient.delete(`/api/medecins/${id}`);
  },

  /**
   * Mettre à jour les informations de l'utilisateur courant (endpoint /me)
   * @param {Object} data - Données à mettre à jour (nom, prenom, email, etc.)
   * @returns {Promise<Object>} L'utilisateur modifié
   * @example
   * const updated = await utilisateurService.updateCurrentUser({ nom: "NouveauNom" });
   */
  updateCurrentUser: (data) => {
    return apiClient.put("/api/utilisateurs/me", data);
  },
};

export default utilisateurService;
