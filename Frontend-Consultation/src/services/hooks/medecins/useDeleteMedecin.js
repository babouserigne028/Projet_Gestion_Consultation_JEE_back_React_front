import { useCallback, useState } from "react";
import medecinService from "../../api/medecinService";

const useDeleteMedecin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteMedecin = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await medecinService.deleteMedecin(id);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err.message || "Erreur lors de la suppression du médecin";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, deleteMedecin };
};

export default useDeleteMedecin;
