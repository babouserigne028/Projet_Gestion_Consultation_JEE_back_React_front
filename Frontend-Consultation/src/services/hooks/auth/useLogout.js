import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCurrentUser } from "../../../store/userSlice";
import authService from "../../api/authService";

/**
 * Hook de déconnexion utilisateur
 * Appelle l'API backend pour /logout puis nettoie le store et redirige.
 */
export default function useLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      // Ignorer l'erreur, on nettoie quand même côté client
    }
    sessionStorage.removeItem("token");
    dispatch(clearCurrentUser());
    navigate("/login");
  };

  return { logout };
}
