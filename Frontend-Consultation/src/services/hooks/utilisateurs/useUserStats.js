import { useCallback, useState } from "react";
import utilisateurService from "../../api/utilisateurService";

const useUserStats = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const fetchUserStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await utilisateurService.getUserStats();
      setStats(response);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.message ||
        "Erreur lors de la récupération des statistiques utilisateurs";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, stats, fetchUserStats };
};

export default useUserStats;
