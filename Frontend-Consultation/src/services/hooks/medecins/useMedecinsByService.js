import { useCallback, useState } from "react";
import medecinService from "../../api/medecinService";

/**
 * Hook pour récupérer les médecins d'un service
 */
const useMedecinsByService = () => {
  const [medecins, setMedecins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMedecinsByService = useCallback(async (serviceId) => {
    if (!serviceId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await medecinService.getMedecinsByService(serviceId);
      setMedecins(data || []);
      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err.message || "Erreur lors de la récupération des médecins";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Réinitialiser les médecins
  const resetMedecins = useCallback(() => {
    setMedecins([]);
    setError(null);
  }, []);

  return { medecins, loading, error, fetchMedecinsByService, resetMedecins };
};

export default useMedecinsByService;
