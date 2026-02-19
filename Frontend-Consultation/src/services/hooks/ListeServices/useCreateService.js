import { useState } from "react";
import servicesService from "../../api/servicesService";

export default function useCreateService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createService = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await servicesService.create(data);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createService, loading, error };
}
