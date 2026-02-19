import { useCallback, useState } from "react";
import rendezVousService from "../../api/rendezVousService";

const usePrendreRendezVous = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const prendreRendezVous = useCallback(
    async (patientId, creneauId, motif = null) => {
      setLoading(true);
      setError(null);
      try {
        const response = await rendezVousService.prendreRendezVous(
          patientId,
          creneauId,
          motif,
        );
        return { success: true, data: response };
      } catch (err) {
        const errorMessage =
          err.message || "Erreur lors de la prise de rendez-vous";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { loading, error, prendreRendezVous };
};

export default usePrendreRendezVous;
