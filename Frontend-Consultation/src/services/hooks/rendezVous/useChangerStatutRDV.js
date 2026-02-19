import { useCallback, useState } from "react";
import rendezVousService from "../../api/rendezVousService";

const useChangerStatutRDV = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const changerStatutRDV = useCallback(async (rdvId, statut) => {
    setLoading(true);
    setError(null);
    try {
      const response = await rendezVousService.changerStatutRDV(rdvId, statut);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.message || "Erreur lors du changement de statut du rendez-vous";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, changerStatutRDV };
};

export default useChangerStatutRDV;
