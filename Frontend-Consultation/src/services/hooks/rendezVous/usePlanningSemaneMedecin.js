import { useCallback, useState } from "react";
import rendezVousService from "../../api/rendezVousService";

const usePlanningSemaneMedecin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [planning, setPlanning] = useState(null);

  const fetchPlanningSemaine = useCallback(async (medecinId) => {
    setLoading(true);
    setError(null);
    try {
      const response =
        await rendezVousService.getPlanningSemaneMedecin(medecinId);
      setPlanning(response);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.message ||
        "Erreur lors de la récupération du planning de la semaine";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, planning, fetchPlanningSemaine };
};

export default usePlanningSemaneMedecin;
