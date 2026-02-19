import { useCallback, useState } from "react";
import rendezVousService from "../../api/rendezVousService";

const useRendezVousStats = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await rendezVousService.getStats();
      setStats(response);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.message || "Erreur lors de la récupération des statistiques";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, stats, fetchStats };
};

export default useRendezVousStats;
