import { useCallback, useState } from "react";
import medecinService from "../../api/medecinService";

const useUpdateMedecin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateMedecin = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await medecinService.updateMedecin(id, data);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.message || "Erreur lors de la mise à jour du médecin";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, updateMedecin };
};

export default useUpdateMedecin;
