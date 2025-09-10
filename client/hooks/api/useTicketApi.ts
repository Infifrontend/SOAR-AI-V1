
import { useState, useCallback } from 'react';
import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = '/api';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface Ticket {
  id: string;
  channel: string;
  category: string;
  priority: string;
  status: string;
  customer: string;
  subject: string;
  description: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  expectedResolution: string;
  tags: string[];
  attachments: any[];
}

export const useTicketApi = () => {
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

  // Get all tickets
  const getTickets = useCallback(async (filters?: any) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<Ticket[]> = await axios.get(
        `${API_BASE_URL}/tickets/`,
        { params: filters }
      );
      
      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch tickets';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Get ticket by ID
  const getTicketById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<Ticket> = await axios.get(
        `${API_BASE_URL}/tickets/${id}/`
      );
      
      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch ticket';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Create new ticket
  const createTicket = useCallback(async (ticketData: Partial<Ticket>) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<Ticket> = await axios.post(
        `${API_BASE_URL}/tickets/`,
        ticketData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create ticket';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Update ticket
  const updateTicket = useCallback(async (id: string, ticketData: Partial<Ticket>) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<Ticket> = await axios.put(
        `${API_BASE_URL}/tickets/${id}/`,
        ticketData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update ticket';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Update ticket status
  const updateTicketStatus = useCallback(async (id: string, status: string) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<Ticket> = await axios.patch(
        `${API_BASE_URL}/tickets/${id}/status/`,
        { status },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update ticket status';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Assign ticket
  const assignTicket = useCallback(async (id: string, assignedTo: string) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<Ticket> = await axios.patch(
        `${API_BASE_URL}/tickets/${id}/assign/`,
        { assignedTo },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to assign ticket';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  return {
    ...state,
    getTickets,
    getTicketById,
    createTicket,
    updateTicket,
    updateTicketStatus,
    assignTicket,
  };
};
