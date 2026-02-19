import { useState, useEffect } from "react";
import servicesService from "../../../api/servicesService";

/**
 * Hook pour récupérer le nombre total de services médicaux
 * Utilise servicesService.getStats()
 * Retourne : { stats, loading, error, refetch }
 */
export const useTotalServices = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await servicesService.getStats();
      setStats(response);
    } catch (err) {
      setError("Erreur lors de la récupération du nombre de services médicaux");
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
