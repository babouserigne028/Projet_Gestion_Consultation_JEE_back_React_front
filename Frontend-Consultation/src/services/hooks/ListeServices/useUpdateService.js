import { useState } from "react";
import servicesService from "../../api/servicesService";

export default function useUpdateService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateService = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await servicesService.update(id, data);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateService, loading, error };
}
