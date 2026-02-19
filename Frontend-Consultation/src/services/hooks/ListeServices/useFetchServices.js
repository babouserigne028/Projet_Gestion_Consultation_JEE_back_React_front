import { useEffect, useState } from "react";
import servicesService from "../../api/servicesService";

/**
 * Hook pour récupérer la liste des services médicaux
 * @returns {Object} { services, loading, error, refetch }
 */
export default function useFetchServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await servicesService.getAll();
      setServices(response.data || response);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();

  }, []);

  return { services, loading, error, refetch: fetchServices };
}
