
import { useState, useCallback } from 'react';
import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface EmailTemplate {
  id: number;
  name: string;
  description: string;
  template_type: string;
  subject_line: string;
  content: string;
  variables: string[];
  company: number | null;
  company_name: string | null;
  is_global: boolean;
  is_active: boolean;
  created_by: number | null;
  created_by_name: string;
  variable_count: number;
  created_at: string;
  updated_at: string;
}

interface CreateEmailTemplateData {
  name: string;
  description?: string;
  template_type: string;
  subject_line?: string;
  content: string;
  company?: number | null;
  is_global?: boolean;
}

export const useEmailTemplateApi = () => {
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

  // Get all email templates
  const getEmailTemplates = useCallback(async (filters?: any): Promise<EmailTemplate[]> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<EmailTemplate[]> = await axios.get(
        `${API_BASE_URL}/email-templates/`,
        { params: filters }
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch email templates';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Create new email template
  const createEmailTemplate = useCallback(async (templateData: CreateEmailTemplateData): Promise<EmailTemplate> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<EmailTemplate> = await axios.post(
        `${API_BASE_URL}/email-templates/`,
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
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create email template';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Update email template
  const updateEmailTemplate = useCallback(async (id: number, templateData: Partial<CreateEmailTemplateData>): Promise<EmailTemplate> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<EmailTemplate> = await axios.put(
        `${API_BASE_URL}/email-templates/${id}/`,
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
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update email template';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Delete email template
  const deleteEmailTemplate = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await axios.delete(`${API_BASE_URL}/email-templates/${id}/`);
      return;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete email template';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  // Get email template by ID
  const getEmailTemplateById = useCallback(async (id: number): Promise<EmailTemplate> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<EmailTemplate> = await axios.get(
        `${API_BASE_URL}/email-templates/${id}/`
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch email template';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Preview email template
  const previewEmailTemplate = useCallback(async (id: number, sampleData?: any): Promise<any> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<any> = await axios.post(
        `${API_BASE_URL}/email-templates/${id}/preview/`,
        { sample_data: sampleData || {} },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to preview email template';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Duplicate email template
  const duplicateEmailTemplate = useCallback(async (id: number): Promise<EmailTemplate> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<EmailTemplate> = await axios.post(
        `${API_BASE_URL}/email-templates/${id}/duplicate/`
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to duplicate email template';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Get available template variables
  const getTemplateVariables = useCallback(async (): Promise<any> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<any> = await axios.get(
        `${API_BASE_URL}/email-templates/variables/`
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch template variables';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  return {
    ...state,
    getEmailTemplates,
    createEmailTemplate,
    updateEmailTemplate,
    deleteEmailTemplate,
    getEmailTemplateById,
    previewEmailTemplate,
    duplicateEmailTemplate,
    getTemplateVariables,
  };
};
