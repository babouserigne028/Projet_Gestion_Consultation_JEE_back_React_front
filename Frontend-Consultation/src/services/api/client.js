import { API_URL } from "../../config/api";

/**
 * Client HTTP centralisé pour tous les appels API
 * Gère automatiquement les headers, le token et les erreurs
 */
class ApiClient {
  constructor(baseURL = API_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Méthode générique pour faire une requête HTTP
   * @param {string} endpoint - L'URL relative (ex: /api/employe)
   * @param {object} options - Options fetch (method, body, headers, etc.)
   * @returns {Promise} - Les données JSON de la réponse
   */
  async request(endpoint, options = {}) {
    const token = sessionStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    try {
      const res = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      // Gestion des erreurs HTTP
      if (!res.ok) {
        if (res.status === 401) {
          if (endpoint === "/api/login") {
            throw new Error("Email ou Mot de Passe Incorrecte");
          }
          // Token invalide ou expiré
          sessionStorage.removeItem("token");
          window.location.href = "/";
          throw new Error("Session expirée, veuillez vous reconnecter");
        }
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      // Si la réponse est vide ou status 204, ne pas parser en JSON
      if (res.status === 204 || res.headers.get("content-length") === "0") {
        return undefined;
      }
      // Si le corps est vide, éviter l'erreur
      const text = await res.text();
      if (!text) return undefined;
      return JSON.parse(text);
    } catch (err) {
      console.error(`Erreur API ${endpoint}:`, err);
      throw err;
    }
  }

  /**
   * Requête GET
   * @param {string} endpoint
   * @returns {Promise}
   */
  get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  }

  /**
   * Requête POST
   * @param {string} endpoint
   * @param {object} data - Les données à envoyer
   * @returns {Promise}
   */
  post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Requête
   * PUT
   * @param {string} endpoint
   * @param {object} data - Les données à envoyer
   * @returns {Promise}
   */
  put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * Requête PATCH
   * @param {string} endpoint
   * @param {object} data - Les données à envoyer
   * @returns {Promise}
   */
  patch(endpoint, data) {
    return this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  /**
   * Requête DELETE
   * @param {string} endpoint
   * @returns {Promise}
   */
  delete(endpoint, data) {
    return this.request(endpoint, {
      method: "DELETE",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Upload de fichier (FormData)
   * @param {string} endpoint
   * @param {FormData} formData
   * @returns {Promise}
   */
  upload(endpoint, formData) {
    const token = sessionStorage.getItem("token");
    return fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    }).then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    });
  }
}

// Export une instance unique (singleton)
export default new ApiClient();
