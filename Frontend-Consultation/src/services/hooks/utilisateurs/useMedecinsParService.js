import { useCallback, useState } from "react";
import utilisateurService from "../../api/utilisateurService";

const useMedecinsParService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchMedecinsParService = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await utilisateurService.getMedecinsParService();
      setData(response);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.message ||
        "Erreur lors de la récupération du nombre de médecins par service";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, data, fetchMedecinsParService };
};

export default useMedecinsParService;
