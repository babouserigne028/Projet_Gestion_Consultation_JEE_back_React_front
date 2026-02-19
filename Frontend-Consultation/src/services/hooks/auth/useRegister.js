import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../api/authService";

const useRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = useCallback(
    async (userData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await authService.register(userData);
        // Après inscription réussie, rediriger vers la page de connexion
        navigate("/");
        return { success: true, data: response };
      } catch (err) {
        const errorMessage = err.message || "Erreur lors de l'inscription";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

  return { loading, error, register };
};

export default useRegister;
