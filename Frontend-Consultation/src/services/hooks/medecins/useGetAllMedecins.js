import { useCallback, useState } from "react";
import medecinService from "../../api/medecinService";

const useGetAllMedecins = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [medecins, setMedecins] = useState([]);

  const fetchMedecins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await medecinService.getAllMedecins();
      setMedecins(response);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.message || "Erreur lors de la récupération des médecins";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, medecins, fetchMedecins };
};

export default useGetAllMedecins;
