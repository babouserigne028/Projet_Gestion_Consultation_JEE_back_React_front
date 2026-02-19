import { useCallback, useState } from "react";
import crenauxService from "../../api/crenauxService";

const useChangerStatutCreneau = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const changerStatutCreneau = useCallback(async (creneauId, statut) => {
    setLoading(true);
    setError(null);
    try {
      const response = await crenauxService.changerStatutCreneau(
        creneauId,
        statut,
      );
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.message || "Erreur lors du changement de statut du créneau";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, changerStatutCreneau };
};

export default useChangerStatutCreneau;
