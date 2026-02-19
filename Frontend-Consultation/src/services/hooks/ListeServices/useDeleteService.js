import { useState } from "react";
import servicesService from "../../api/servicesService";

export default function useDeleteService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteService = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await servicesService.delete(id);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteService, loading, error };
}
