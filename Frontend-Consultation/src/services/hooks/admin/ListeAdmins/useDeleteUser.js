import { useState } from "react";
import utilisateurService from "../../../api/utilisateurService";

/**
 * Hook pour supprimer un utilisateur (admin)
 * @returns {{ deleteUser: Function, loading: boolean, error: any, success: boolean, reset: Function }}
 * @example
 * const { deleteUser, loading, error, success } = useDeleteUser();
 * await deleteUser(21);
 */
export default function useDeleteUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteUser = async (id) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await utilisateurService.deleteAdmin(id);
      setSuccess(true);
      return true;
    } catch (err) {
      setError(err);
      setSuccess(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  };

  return { deleteUser, loading, error, success, reset };
}
