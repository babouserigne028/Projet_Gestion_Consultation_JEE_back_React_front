import { useCallback, useState } from "react";
import utilisateurService from "../../api/utilisateurService";

const useRegisterAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const registerAdmin = useCallback(async (adminData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await utilisateurService.registerAdmin(adminData);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.message || "Erreur lors de l'inscription de l'administrateur";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, registerAdmin };
};

export default useRegisterAdmin;
