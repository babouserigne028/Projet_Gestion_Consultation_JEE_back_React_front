import { useCallback, useState } from "react";
import planningConfigService from "../../api/planningConfigService";

const usePlanningsByDateRange = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [plannings, setPlannings] = useState([]);

  const fetchPlanningsByDateRange = useCallback(
    async (medecinId, dateDebut, dateFin) => {
      setLoading(true);
      setError(null);
      try {
        const response = await planningConfigService.getPlanningsByDateRange(
          medecinId,
          dateDebut,
          dateFin,
        );
        setPlannings(response);
        return { success: true, data: response };
      } catch (err) {
        const errorMessage =
          err.message || "Erreur lors de la récupération des plannings";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { loading, error, plannings, fetchPlanningsByDateRange };
};

export default usePlanningsByDateRange;
