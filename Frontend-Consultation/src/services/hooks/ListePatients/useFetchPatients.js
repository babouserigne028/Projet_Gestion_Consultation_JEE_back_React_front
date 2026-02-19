import { useState, useEffect } from "react";
import utilisateurService from "../../api/utilisateurService";

export default function useFetchPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await utilisateurService.getPatients();
      setPatients(response);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return { patients, loading, error, fetchPatients };
}
