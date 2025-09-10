
import { useState, useCallback } from 'react';
import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = '/api';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface Offer {
  id: string;
  title: string;
  corporate: string;
  type: string;
  status: string;
  validFrom: string;
  validTo: string;
  routes: string[];
  cabinClass: string;
  discountType: string;
  discountValue: number;
  minSpend: number;
  maxDiscount: number;
  commission: number;
  usage: number;
  conversion: number;
  revenue: number;
  bookings: number;
  atpcoStatus: string;
  atpcoReference: string;
  lastModified: string;
}

export const useOfferApi = () => {
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

  // Get all offers
  const getOffers = useCallback(async (filters?: any) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<Offer[]> = await axios.get(
        `${API_BASE_URL}/offers/`,
        { params: filters }
      );
      
      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch offers';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Get offer by ID
  const getOfferById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<Offer> = await axios.get(
        `${API_BASE_URL}/offers/${id}/`
      );
      
      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch offer';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Create new offer
  const createOffer = useCallback(async (offerData: Partial<Offer>) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<Offer> = await axios.post(
        `${API_BASE_URL}/offers/`,
        offerData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create offer';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Update offer
  const updateOffer = useCallback(async (id: string, offerData: Partial<Offer>) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<Offer> = await axios.put(
        `${API_BASE_URL}/offers/${id}/`,
        offerData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update offer';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Delete offer
  const deleteOffer = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await axios.delete(`${API_BASE_URL}/offers/${id}/`);
      setData(null);
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete offer';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // File offer with ATPCO
  const fileOfferWithAtpco = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<any> = await axios.post(
        `${API_BASE_URL}/offers/${id}/file-atpco/`
      );
      
      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to file offer with ATPCO';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  return {
    ...state,
    getOffers,
    getOfferById,
    createOffer,
    updateOffer,
    deleteOffer,
    fileOfferWithAtpco,
  };
};
