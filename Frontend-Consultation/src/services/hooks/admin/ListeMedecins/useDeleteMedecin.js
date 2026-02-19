import { useState } from "react";
import utilisateurService from "../../../api/utilisateurService";

/**
 * Hook pour supprimer un médecin par son id
 * @returns {Object} { deleteMedecin, loading, error, data, reset }
 */
export default function useDeleteMedecin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const deleteMedecin = async (id) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      await utilisateurService.deleteMedecin(id);
      setData({ success: true });
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setData(null);
  };

  return { deleteMedecin, loading, error, data, reset };
}
