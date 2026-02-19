import { useState } from "react";
import utilisateurService from "../../api/utilisateurService";

export default function useUpdatePatient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updatePatient = async (id, patient) => {
    setLoading(true);
    setError(null);
    try {
      const response = await utilisateurService.updatePatient(id, patient);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updatePatient, loading, error };
}
