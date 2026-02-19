import { useCallback, useState } from "react";
import rendezVousService from "../../api/rendezVousService";

/**
 * Hook pour annuler un rendez-vous (par le patient)
 */
const useAnnulerRendezVous = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const annulerRendezVous = useCallback(async (rdvId, patientId) => {
    if (!rdvId || !patientId) {
      return {
        success: false,
        error: "ID du rendez-vous et du patient requis",
      };
    }

    setLoading(true);
    setError(null);
    try {
      const data = await rendezVousService.annulerRendezVousPatient(
        rdvId,
        patientId,
      );
      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err.message || "Erreur lors de l'annulation du rendez-vous";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, annulerRendezVous };
};

export default useAnnulerRendezVous;
