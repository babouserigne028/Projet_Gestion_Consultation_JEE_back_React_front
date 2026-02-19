import { useState } from "react";
import utilisateurService from "../../../api/utilisateurService";

/**
 * Hook pour ajouter un nouveau médecin
 * @returns {{ addMedecin: Function, loading: boolean, error: any, data: any, reset: Function }}
 * @example
 * const { addMedecin, loading, error, data } = useAddMedecin();
 * addMedecin({ nom, prenom, email, motDePasse, telephone, specialite, dureeSeance, adresseCabinet, actif, role: "MEDECIN" });
 */
export default function useAddMedecin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const addMedecin = async (medecinData) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      // On force le rôle à MEDECIN
      const response = await utilisateurService.registerAdmin({
        ...medecinData,
        role: "MEDECIN",
      });
      setData(response);
      return response;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setData(null);
    setLoading(false);
  };

  return { addMedecin, loading, error, data, reset };
}
