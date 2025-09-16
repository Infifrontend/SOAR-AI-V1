
import { useState, useCallback } from 'react';
import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string;
  last_login: string | null;
  groups: number[];
  user_permissions: number[];
  profile?: {
    role: string;
    department: string;
    phone: string;
    avatar?: string;
  };
}

interface CreateUserData {
  username?: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  is_active?: boolean;
  is_staff?: boolean;
  groups?: number[];
  profile?: {
    role: string;
    department: string;
    phone: string;
  };
}

export const useUserApi = () => {
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

  // Get all users
  const getUsers = useCallback(async (): Promise<User[]> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<User[]> = await axios.get(
        `${API_BASE_URL}/users/`
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch users';
      setError(errorMessage);
      console.error('Error fetching users:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Get user by ID
  const getUserById = useCallback(async (id: number): Promise<User | null> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<User> = await axios.get(
        `${API_BASE_URL}/users/${id}/`
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch user';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Create new user
  const createUser = useCallback(async (userData: CreateUserData): Promise<User> => {
    setLoading(true);
    setError(null);

    try {
      // Ensure username is provided - generate from email if not provided
      const userDataWithUsername = {
        ...userData,
        username: userData.username || userData.email.split('@')[0] || `user_${Date.now()}`
      };

      const response: AxiosResponse<User> = await axios.post(
        `${API_BASE_URL}/users/`,
        userDataWithUsername,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.username?.[0] || error.message || 'Failed to create user';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Update user
  const updateUser = useCallback(async (id: number, userData: Partial<User>): Promise<User> => {
    setLoading(true);
    setError(null);

    try {
      // Ensure username is provided if updating user data
      const userDataForUpdate = { ...userData };
      if (userData.email && !userData.username) {
        userDataForUpdate.username = userData.email.split('@')[0];
      }

      const response: AxiosResponse<User> = await axios.put(
        `${API_BASE_URL}/users/${id}/`,
        userDataForUpdate,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.username?.[0] || error.response?.data?.message || error.message || 'Failed to update user';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Delete user
  const deleteUser = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await axios.delete(`${API_BASE_URL}/users/${id}/`);
      setData(null);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete user';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Change user password
  const changePassword = useCallback(async (id: number, passwordData: { old_password: string; new_password: string }): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await axios.post(
        `${API_BASE_URL}/users/${id}/change_password/`,
        passwordData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to change password';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  return {
    ...state,
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    changePassword,
  };
};
