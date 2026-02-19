import { useState } from "react";
import utilisateurService from "../../../api/utilisateurService";

/**
 * Hook pour éditer un médecin
 * @returns {{ editMedecin: Function, loading: boolean, error: any, data: any, reset: Function }}
 * @example
 * const { editMedecin, loading, error, data } = useEditMedecin();
 * editMedecin(id, { specialite, dureeSeance, adresseCabinet, serviceId });
 */
export default function useEditMedecin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const editMedecin = async (id, updateData) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await utilisateurService.updateMedecin(id, updateData);
      setData(response);
      return response;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setData(null);
    setLoading(false);
  };

  return { editMedecin, loading, error, data, reset };
}
