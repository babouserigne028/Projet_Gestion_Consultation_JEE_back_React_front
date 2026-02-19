import { useCallback, useState } from "react";
import medecinService from "../../api/medecinService";

const useRegisterMedecin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const registerMedecin = useCallback(async (medecinData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await medecinService.registerMedecin(medecinData);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.message || "Erreur lors de l'inscription du médecin";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, registerMedecin };
};

export default useRegisterMedecin;
