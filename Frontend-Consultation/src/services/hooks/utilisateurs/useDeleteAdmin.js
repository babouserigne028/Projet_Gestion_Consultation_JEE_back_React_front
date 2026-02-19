import { useCallback, useState } from "react";
import utilisateurService from "../../api/utilisateurService";

const useDeleteAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteAdmin = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await utilisateurService.deleteAdmin(id);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err.message || "Erreur lors de la suppression de l'administrateur";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, deleteAdmin };
};

export default useDeleteAdmin;
