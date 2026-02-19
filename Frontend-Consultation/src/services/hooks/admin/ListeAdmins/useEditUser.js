import { useState } from "react";
import utilisateurService from "../../../api/utilisateurService";

/**
 * Hook pour modifier un utilisateur (admin)
 * @returns {{ editUser: Function, loading: boolean, error: any, data: any, reset: Function }}
 * @example
 * const { editUser, loading, error, data } = useEditUser();
 * await editUser(21, { nom: "NouveauNom" });
 */
export default function useEditUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const editUser = async (id, utilisateur) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await utilisateurService.updateAdmin(id, utilisateur);
      setData(response);
      return response;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setData(null);
    setLoading(false);
  };

  return { editUser, loading, error, data, reset };
}
