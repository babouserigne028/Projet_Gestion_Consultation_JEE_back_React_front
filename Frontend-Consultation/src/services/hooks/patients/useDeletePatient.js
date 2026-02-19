import { useCallback, useState } from "react";
import patientService from "../../api/patientService";

const useDeletePatient = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deletePatient = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await patientService.deletePatient(id);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err.message || "Erreur lors de la suppression du patient";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, deletePatient };
};

export default useDeletePatient;
