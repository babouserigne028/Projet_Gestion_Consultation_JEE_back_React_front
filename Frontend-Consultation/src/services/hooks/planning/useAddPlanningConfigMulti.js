import { useCallback, useState } from "react";
import planningConfigService from "../../api/planningConfigService";

const useAddPlanningConfigMulti = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addPlanningConfigMulti = useCallback(
    async (medecinId, dates, heureDebut, heureFin) => {
      setLoading(true);
      setError(null);
      try {
        const response = await planningConfigService.addPlanningConfigMulti(
          medecinId,
          dates,
          heureDebut,
          heureFin,
        );
        return { success: true, data: response };
      } catch (err) {
        const errorMessage =
          err.message ||
          "Erreur lors de l'ajout des configurations de planning multiples";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { loading, error, addPlanningConfigMulti };
};

export default useAddPlanningConfigMulti;
