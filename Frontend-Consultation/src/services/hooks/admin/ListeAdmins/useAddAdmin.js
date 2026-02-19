import { useState } from "react";
import utilisateurService from "../../../api/utilisateurService";

/**
 * Hook pour ajouter un nouvel administrateur
 * @returns {{ addAdmin: Function, loading: boolean, error: any, data: any, reset: Function }}
 * @example
 * const { addAdmin, loading, error, data } = useAddAdmin();
 * addAdmin({ nom, prenom, email, motDePasse, telephone, role: "ADMIN" });
 */
export default function useAddAdmin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const addAdmin = async (adminData) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await utilisateurService.registerAdmin(adminData);
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

  return { addAdmin, loading, error, data, reset };
}
