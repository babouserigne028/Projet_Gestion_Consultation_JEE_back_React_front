import { useCallback, useState } from "react";
import rendezVousService from "../../api/rendezVousService";

/**
 * Hook pour récupérer les statistiques des rendez-vous d'un patient
 */
const useStatsPatient = () => {
  const [stats, setStats] = useState({
    rdvAVenir: 0,
    rdvTermines: 0,
    rdvAnnules: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStatsPatient = useCallback(async (patientId) => {
    if (!patientId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await rendezVousService.getStatsPatient(patientId);
      setStats(
        data || { rdvAVenir: 0, rdvTermines: 0, rdvAnnules: 0, total: 0 },
      );
      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err.message || "Erreur lors de la récupération des statistiques";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { stats, loading, error, fetchStatsPatient };
};

export default useStatsPatient;
