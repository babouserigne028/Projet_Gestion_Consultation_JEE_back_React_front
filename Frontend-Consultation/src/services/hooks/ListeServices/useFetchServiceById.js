import { useState, useEffect } from "react";
import servicesService from "../../api/servicesService";

export default function useFetchServiceById(id) {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    servicesService
      .getById(id)
      .then((res) => setService(res.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { service, loading, error };
}
