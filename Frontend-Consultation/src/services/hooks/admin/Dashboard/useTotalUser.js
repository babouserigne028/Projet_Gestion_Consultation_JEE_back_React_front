import { useState, useEffect } from "react";
import utilisateurService from "../../../api/utilisateurService";

export const useTotalUser = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await utilisateurService.getUserStats();
      setStats(response);
    } catch (err) {
      setError("Erreur lors de la récupération des statistiques utilisateurs");
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};
