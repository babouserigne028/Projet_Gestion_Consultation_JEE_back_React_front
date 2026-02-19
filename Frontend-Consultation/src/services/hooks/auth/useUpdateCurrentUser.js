import { useState } from "react";
import utilisateurService from "../../api/utilisateurService";

/**
 * Hook pour mettre à jour les informations de l'utilisateur courant
 * @returns {Object} { updateCurrentUser, loading, error }
 */
export default function useUpdateCurrentUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateCurrentUser = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await utilisateurService.updateCurrentUser(data);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateCurrentUser, loading, error };
}
