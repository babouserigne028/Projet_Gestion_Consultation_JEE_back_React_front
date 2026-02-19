import { useCallback, useState } from "react";
import planningConfigService from "../../api/planningConfigService";

const useAddPlanningConfig = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addPlanningConfig = useCallback(async (medecinId, config) => {
    setLoading(true);
    setError(null);
    try {
      const response = await planningConfigService.addPlanningConfig(
        medecinId,
        config,
      );
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.message || "Erreur lors de l'ajout de la configuration de planning";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, addPlanningConfig };
};

export default useAddPlanningConfig;
