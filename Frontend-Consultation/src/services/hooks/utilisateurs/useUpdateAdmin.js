import { useCallback, useState } from "react";
import utilisateurService from "../../api/utilisateurService";

const useUpdateAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateAdmin = useCallback(async (id, utilisateur) => {
    setLoading(true);
    setError(null);
    try {
      const response = await utilisateurService.updateAdmin(id, utilisateur);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.message || "Erreur lors de la mise à jour de l'administrateur";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, updateAdmin };
};

export default useUpdateAdmin;
