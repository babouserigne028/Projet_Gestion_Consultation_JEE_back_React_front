import { useCallback, useState } from "react";
import crenauxService from "../../api/crenauxService";

const useGenererCreneaux = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const genererCreneaux = useCallback(async (medecinId, configCreneaux) => {
    setLoading(true);
    setError(null);
    try {
      const response = await crenauxService.genererCreneaux(
        medecinId,
        configCreneaux,
      );
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.message || "Erreur lors de la génération des créneaux";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, genererCreneaux };
};

export default useGenererCreneaux;
