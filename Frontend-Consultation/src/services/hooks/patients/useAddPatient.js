import { useCallback, useState } from "react";
import patientService from "../../api/patientService";

const useAddPatient = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addPatient = useCallback(async (patientData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await patientService.addPatient(patientData);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || "Erreur lors de l'ajout du patient";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, addPatient };
};

export default useAddPatient;
