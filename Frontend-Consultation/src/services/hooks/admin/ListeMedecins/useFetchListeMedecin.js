import { useCallback, useEffect, useState } from "react";
import utilisateurService from "../../../api/utilisateurService";

/**
 * Hook pour récupérer la liste des médecins
 * @returns {Object} { medecins, loading, error, refetch }
 */
export default function useFetchListeMedecin() {
  const [medecins, setMedecins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMedecins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await utilisateurService.getMedecins();
      setMedecins(response.data || response);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedecins();
  }, []);

  return { medecins, loading, error, refetch: fetchMedecins };
}
