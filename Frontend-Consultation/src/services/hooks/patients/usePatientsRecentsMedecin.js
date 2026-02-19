import { useCallback, useState } from "react";
import patientService from "../../api/patientService";

const usePatientsRecentsMedecin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [patients, setPatients] = useState([]);

  const fetchPatientsRecents = useCallback(async (medecinId, limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const response = await patientService.getPatientsRecentsMedecin(
        medecinId,
        limit,
      );
      setPatients(response);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.message || "Erreur lors de la récupération des patients récents";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, patients, fetchPatientsRecents };
};

export default usePatientsRecentsMedecin;
