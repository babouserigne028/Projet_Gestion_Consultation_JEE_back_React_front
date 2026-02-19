import { useCallback, useState } from "react";
import rendezVousService from "../../api/rendezVousService";

/**
 * Hook pour récupérer tous les rendez-vous d'un patient
 */
const useRendezVousPatient = () => {
  const [rendezVous, setRendezVous] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRendezVousPatient = useCallback(async (patientId) => {
    if (!patientId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await rendezVousService.getRendezVousPatient(patientId);
      setRendezVous(data || []);
      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err.message || "Erreur lors de la récupération des rendez-vous";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { rendezVous, loading, error, fetchRendezVousPatient };
};

export default useRendezVousPatient;
