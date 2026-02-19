import { useCallback, useState } from "react";
import rendezVousService from "../../api/rendezVousService";

const useStatsJourMedecin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const fetchStatsJour = useCallback(async (medecinId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await rendezVousService.getStatsJourMedecin(medecinId);
      setStats(response);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.message ||
        "Erreur lors de la récupération des statistiques du jour";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, stats, fetchStatsJour };
};

export default useStatsJourMedecin;
