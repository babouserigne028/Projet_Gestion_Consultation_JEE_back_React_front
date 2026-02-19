import { useEffect, useState } from "react";
import utilisateurService from "../../../api/utilisateurService";

/**
 * Hook pour récupérer la liste des utilisateurs admins
 * @returns {{ data: Array, loading: boolean, error: any, refetch: Function }}
 * @example
 * const { data: admins, loading, error, refetch } = useFetchListeAdmins();
 */
export default function useFetchListeAdmins() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await utilisateurService.getAdmins();
      setData(response);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return { data, loading, error, refetch: fetchAdmins };
}
