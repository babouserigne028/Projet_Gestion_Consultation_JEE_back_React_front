export const API_URL = "http://localhost:8080/Projet_Gestion_Consultation-1.0-SNAPSHOT";
export const buildApiUrl = (endpoint) => {
  return `${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
};
