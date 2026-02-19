import { useState } from "react";
import utilisateurService from "../../api/utilisateurService";

export default function useAddPatient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addPatient = async (patient) => {
    setLoading(true);
    setError(null);
    try {
      const response = await utilisateurService.registerAdmin(patient);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addPatient, loading, error };
}
