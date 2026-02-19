import { useCallback, useState } from "react";
import patientService from "../../api/patientService";

const useUpdatePatient = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updatePatient = useCallback(async (id, patientData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await patientService.updatePatient(id, patientData);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.message || "Erreur lors de la mise à jour du patient";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, updatePatient };
};

export default useUpdatePatient;
