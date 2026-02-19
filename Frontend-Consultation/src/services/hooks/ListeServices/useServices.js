import { useState, useEffect } from "react";
import servicesService from "../../api/servicesService";

// Hook pour récupérer tous les services
export function useFetchServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await servicesService.getAll();
      setServices(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return { services, loading, error, fetchServices };
}

// Hook pour récupérer un service par id
export function useFetchServiceById(id) {
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

// Hook pour créer un service
export function useCreateService() {
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

// Hook pour modifier un service
export function useUpdateService() {
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

// Hook pour supprimer un service
export function useDeleteService() {
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

// Hook pour récupérer les stats
export function useServiceStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await servicesService.getStats();
      setStats(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, fetchStats };
}
