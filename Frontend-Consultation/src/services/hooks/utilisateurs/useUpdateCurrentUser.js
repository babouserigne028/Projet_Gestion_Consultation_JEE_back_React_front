import { useCallback, useState } from "react";
import utilisateurService from "../../api/utilisateurService";

const useUpdateCurrentUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateCurrentUser = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await utilisateurService.updateCurrentUser(data);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.message || "Erreur lors de la mise à jour du profil";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, updateCurrentUser };
};

export default useUpdateCurrentUser;
