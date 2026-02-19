import { useCallback, useState } from "react";
import rendezVousService from "../../api/rendezVousService";

const useHistoriqueMedecin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [historique, setHistorique] = useState([]);

  const fetchHistorique = useCallback(async (medecinId, limit = 50) => {
    setLoading(true);
    setError(null);
    try {
      const response = await rendezVousService.getHistoriqueMedecin(
        medecinId,
        limit,
      );
      setHistorique(response);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.message || "Erreur lors de la récupération de l'historique";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, historique, fetchHistorique };
};

export default useHistoriqueMedecin;
