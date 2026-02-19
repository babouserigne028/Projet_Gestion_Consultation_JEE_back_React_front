import apiClient from "./client";

export const authService = {
  /**
   * Connexion d'un utilisateur
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe
   * @returns {Promise<Object>} Token et informations utilisateur
   */
  login: (email, password) => {
    return apiClient.post("/api/auth/login", { email, motDePasse: password });
  },

  /**
   * Déconnexion d'un utilisateur
   * @returns {Promise<Object>} Message de confirmation
   */
  logout: () => {
    return apiClient.post("/api/auth/logout");
  },

  /**
   * Inscription d'un nouvel utilisateur (patient, médecin ou admin)
   * @param {Object} userData - Données d'inscription
   * @returns {Promise<Object>} Utilisateur créé
   */
  register: (userData) => {
    return apiClient.post("/api/auth/register", userData);
  },
};

export default authService;
