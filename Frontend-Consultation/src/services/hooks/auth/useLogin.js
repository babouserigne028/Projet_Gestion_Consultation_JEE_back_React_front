import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import authService from "../../api/authService";
import { setCurrentUser } from "../../../store/userSlice";

const useLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(
    async (email, password) => {
      setLoading(true);
      setError(null);
      try {
        const response = await authService.login(email, password);
        console.log("Login response:", response); // DEBUG: voir si patientId est présent
        if (response.token && response.user) {
          sessionStorage.setItem("token", response.token);
          // Inclure patientId ou medecinId dans l'objet user stocké
          const userWithIds = {
            ...response.user,
            patientId: response.patientId || null,
            medecinId: response.medecinId || null,
          };
          dispatch(setCurrentUser(userWithIds));
          if (response.user.role === "PATIENT") {
            navigate("/patient/dashboard");
          } else if (response.user.role === "MEDECIN") {
            navigate("/medecin/dashboard");
          } else if (response.user.role === "ADMIN") {
            navigate("/admin/dashboard");
          }
          return { success: true, data: response };
        } else {
          setError("Identifiant ou Mot de passe Incorrecte");
          return {
            success: false,
            error: "Identifiant ou Mot de passe Incorrecte",
          };
        }
      } catch (err) {
        const errorMessage = err.message || "Erreur de connexion";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [navigate, dispatch],
  );
  return { loading, error, login };
};

export default useLogin;
