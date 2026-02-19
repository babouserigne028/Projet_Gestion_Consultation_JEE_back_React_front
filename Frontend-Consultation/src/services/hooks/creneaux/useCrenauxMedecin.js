import { useCallback, useState } from "react";
import crenauxService from "../../api/crenauxService";

const useCrenauxMedecin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [creneaux, setCreneaux] = useState([]);

  const fetchCrenauxMedecin = useCallback(
    async (medecinId, date = null, statut = null) => {
      setLoading(true);
      setError(null);
      try {
        const response = await crenauxService.getCrenauxMedecin(
          medecinId,
          date,
          statut,
        );
        setCreneaux(response);
        return { success: true, data: response };
      } catch (err) {
        const errorMessage =
          err.message || "Erreur lors de la récupération des créneaux";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { loading, error, creneaux, fetchCrenauxMedecin };
};

export default useCrenauxMedecin;
