import { useState, useEffect } from "react";
import utilisateurService from "../../../api/utilisateurService";

/**
 * Hook pour récupérer le nombre de médecins par service (spécialité)
 * Utilise utilisateurService.getMedecinsParService()
 * Retourne : { data, loading, error, refetch }
 */
export const useTotalMedecinBySpecialite = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await utilisateurService.getMedecinsParService();
      setData(response);
    } catch (err) {
      setError("Erreur lors de la récupération des médecins par service");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};
