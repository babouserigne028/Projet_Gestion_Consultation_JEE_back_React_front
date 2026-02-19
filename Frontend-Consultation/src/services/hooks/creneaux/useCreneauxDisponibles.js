import { useCallback, useState } from "react";
import crenauxService from "../../api/crenauxService";

/**
 * Hook pour récupérer les créneaux disponibles d'un médecin
 */
const useCreneauxDisponibles = () => {
  const [creneaux, setCreneaux] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCreneauxDisponibles = useCallback(async (medecinId) => {
    if (!medecinId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await crenauxService.getCreneauxDisponibles(medecinId);
      setCreneaux(data || []);
      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err.message || "Erreur lors de la récupération des créneaux";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Réinitialiser les créneaux
  const resetCreneaux = useCallback(() => {
    setCreneaux([]);
    setError(null);
  }, []);

  return { creneaux, loading, error, fetchCreneauxDisponibles, resetCreneaux };
};

export default useCreneauxDisponibles;
