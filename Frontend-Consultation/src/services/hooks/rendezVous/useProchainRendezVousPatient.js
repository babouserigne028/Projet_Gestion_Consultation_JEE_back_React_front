import { useCallback, useState } from "react";
import rendezVousService from "../../api/rendezVousService";

/**
 * Hook pour récupérer le prochain rendez-vous d'un patient
 */
const useProchainRendezVousPatient = () => {
  const [prochainRdv, setProchainRdv] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProchainRdv = useCallback(async (patientId) => {
    if (!patientId) return;

    setLoading(true);
    setError(null);
    try {
      const data =
        await rendezVousService.getProchainRendezVousPatient(patientId);
      // Si aucun RDV, l'API retourne {message: "Aucun rendez-vous à venir"}
      if (data.message) {
        setProchainRdv(null);
      } else {
        setProchainRdv(data);
      }
      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err.message || "Erreur lors de la récupération du prochain rendez-vous";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { prochainRdv, loading, error, fetchProchainRdv };
};

export default useProchainRendezVousPatient;
