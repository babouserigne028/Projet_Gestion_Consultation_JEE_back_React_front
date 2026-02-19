import { useState, useEffect } from "react";
import consultationService from "../../../api/consultationService";

/**
 * Hook pour récupérer les statistiques globales des consultations (rendez-vous)
 * Utilise consultationService.getStats()
 * Retourne : { stats, loading, error, refetch }
 */
export const useTotalConsultation = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await consultationService.getStats();
      setStats(response);
    } catch (err) {
      setError("Erreur lors de la récupération des statistiques consultations");
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
