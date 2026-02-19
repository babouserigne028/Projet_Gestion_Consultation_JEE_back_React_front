import { useState } from "react";
import utilisateurService from "../../api/utilisateurService";

export default function useDeletePatient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deletePatient = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await utilisateurService.deletePatient(id);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deletePatient, loading, error };
}
