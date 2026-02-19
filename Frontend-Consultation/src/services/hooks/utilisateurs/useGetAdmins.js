import { useCallback, useState } from "react";
import utilisateurService from "../../api/utilisateurService";

const useGetAdmins = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [admins, setAdmins] = useState([]);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await utilisateurService.getAdmins();
      setAdmins(response);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.message || "Erreur lors de la récupération des admins";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, admins, fetchAdmins };
};

export default useGetAdmins;
