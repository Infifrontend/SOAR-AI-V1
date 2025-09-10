
import { useState, useCallback } from 'react';
import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = '/api';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface CampaignTemplate {
  id?: string | number;
  name: string;
  description: string;
  channel_type: 'email' | 'whatsapp' | 'linkedin' | 'mixed';
  target_industry: string;
  subject_line?: string;
  content: string;
  cta: string;
  cta_link?: string;
  linkedin_type?: 'message' | 'post' | 'connection';
  estimated_open_rate: number;
  estimated_click_rate: number;
  is_custom: boolean;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

export const useTemplateApi = () => {
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

  // Get all templates (both custom and default)
  const getTemplates = useCallback(async (filters?: any) => {
    setLoading(true);
    setError(null);

    try {
      // Get all templates (custom and default) from single endpoint
      const response: AxiosResponse<CampaignTemplate[]> = await axios.get(
        `${API_BASE_URL}/campaign-templates/`,
        { params: filters }
      );

      // Handle both cases: array directly or wrapped in data property
      const allTemplates = Array.isArray(response.data) ? response.data : [];
      setData(allTemplates);
      return allTemplates;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch templates';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Create new template
  const createTemplate = useCallback(async (templateData: Partial<CampaignTemplate>) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<CampaignTemplate> = await axios.post(
        `${API_BASE_URL}/campaign-templates/`,
        templateData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create template';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Update template
  const updateTemplate = useCallback(async (id: string | number, templateData: Partial<CampaignTemplate>) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<CampaignTemplate> = await axios.put(
        `${API_BASE_URL}/campaign-templates/${id}/`,
        templateData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update template';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Delete template
  const deleteTemplate = useCallback(async (id: string | number) => {
    setLoading(true);
    setError(null);

    try {
      await axios.delete(`${API_BASE_URL}/campaign-templates/${id}/`);
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete template';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  // Get template by ID
  const getTemplateById = useCallback(async (id: string | number) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<CampaignTemplate> = await axios.get(
        `${API_BASE_URL}/campaign-templates/${id}/`
      );
      
      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch template';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  return {
    ...state,
    getTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplateById,
  };
};
