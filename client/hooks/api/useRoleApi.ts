
import { useState, useCallback } from 'react';
import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface Permission {
  id: number;
  name: string;
  content_type: number;
  codename: string;
}

interface Role {
  id: number;
  name: string;
  permissions: number[];
  permission_details?: Permission[];
  user_count?: number;
}

interface CreateRoleData {
  name: string;
  description?: string;
  permissions?: number[];
  menu_permissions?: string[];
}

export const useRoleApi = () => {
  const [state, setState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setData = useCallback((data: any) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  // Get all roles
  const getRoles = useCallback(async (): Promise<Role[]> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<Role[]> = await axios.get(
        `${API_BASE_URL}/roles/`
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch roles';
      setError(errorMessage);
      console.error('Error fetching roles:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Get role by ID
  const getRoleById = useCallback(async (id: number): Promise<Role | null> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<Role> = await axios.get(
        `${API_BASE_URL}/roles/${id}/`
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch role';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Create new role
  const createRole = useCallback(async (roleData: CreateRoleData): Promise<Role> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<Role> = await axios.post(
        `${API_BASE_URL}/roles/`,
        roleData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create role';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // // Update role
  // const updateRole = useCallback(async (id: number, roleData: Partial<Role>): Promise<Role> => {
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const response: AxiosResponse<Role> = await axios.put(
  //       `${API_BASE_URL}/roles/${id}/`,
  //       roleData,
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );

  //     setData(response.data);
  //     return response.data;
  //   } catch (error: any) {
  //     const errorMessage = error.response?.data?.message || error.message || 'Failed to update role';
  //     setError(errorMessage);
  //     throw error;
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [setLoading, setError, setData]);

  // Delete role
  const deleteRole = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await axios.delete(`${API_BASE_URL}/roles/${id}/`);
      setData(null);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete role';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Get all permissions
  const getPermissions = useCallback(async (): Promise<Permission[]> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<Permission[]> = await axios.get(
        `${API_BASE_URL}/permissions/`
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch permissions';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Update role
  const updateRole = useCallback(async (id: number, roleData: any): Promise<any> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<any> = await axios.put(
        `${API_BASE_URL}/roles/${id}/`,
        roleData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update role';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  return {
    ...state,
    getRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
    getPermissions,
  };
};
