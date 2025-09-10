import { useState, useCallback } from 'react';
import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface Campaign {
  id: number;
  name: string;
  description: string;
  campaign_type: string;
  status: string;
  subject_line: string;
  email_content: string;
  emails_sent: number;
  emails_opened: number;
  emails_clicked: number;
  target_leads_count: number;
  open_rate: number;
  click_rate: number;
  created_at: string;
  updated_at: string;
}

interface EmailCampaign {
  id: string;
  name: string;
  description: string;
  campaign_type: string;
  status: string;
  subject_line: string;
  email_content: string;
  emails_sent: number;
  emails_opened: number;
  emails_clicked: number;
  created_at: string;
  updated_at: string;
}

export const useCampaignApi = () => {
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

  // Create new campaign
  const createCampaign = useCallback(async (campaignData: any) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<any> = await axios.post(
        `${API_BASE_URL}/email-campaigns/`,
        {
          name: campaignData.name,
          description: campaignData.description || '',
          campaign_type: campaignData.objective === 'lead-nurturing' ? 'nurture' : campaignData.objective,
          subject_line: campaignData.content?.email?.subject || '',
          email_content: campaignData.content?.email?.body || '',
          target_count: campaignData.targetAudience?.length || 0,
          target_leads: campaignData.targetAudience?.map((lead: any) => lead.id) || [],
          channels: campaignData.channels,
          settings: campaignData.settings
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create campaign';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Get all campaigns
  const getCampaigns = useCallback(async (): Promise<Campaign[]> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<any> = await axios.get(
        `${API_BASE_URL}/email-campaigns/`
      );

      // Handle both paginated and non-paginated responses
      // If there's a results field, it's paginated, otherwise it's a direct array
      let campaignsData;
      if (response.data.results) {
        // Paginated response - collect all pages
        let allCampaigns = [...response.data.results];
        let nextUrl = response.data.next;
        
        // Fetch remaining pages if they exist
        while (nextUrl) {
          const nextResponse = await axios.get(nextUrl);
          allCampaigns = [...allCampaigns, ...nextResponse.data.results];
          nextUrl = nextResponse.data.next;
        }
        
        campaignsData = allCampaigns;
      } else {
        // Non-paginated response
        campaignsData = response.data;
      }
      
      if (!Array.isArray(campaignsData)) {
        console.error('Invalid campaigns data format:', response.data);
        setData([]);
        return [];
      }

      // Transform the API response to match our interface
      const transformedCampaigns: Campaign[] = campaignsData.map((campaign: any) => ({
        id: parseInt(campaign.id.toString()),
        name: campaign.name,
        description: campaign.description,
        campaign_type: campaign.campaign_type,
        status: campaign.status,
        subject_line: campaign.subject_line,
        email_content: campaign.email_content,
        emails_sent: campaign.emails_sent,
        emails_opened: campaign.emails_opened,
        emails_clicked: campaign.emails_clicked,
        target_leads_count: campaign.target_leads_count || 0,
        open_rate: campaign.open_rate || 0,
        click_rate: campaign.click_rate || 0,
        created_at: campaign.created_at,
        updated_at: campaign.updated_at
      }));

      setData(transformedCampaigns);
      return transformedCampaigns;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch campaigns';
      setError(errorMessage);
      console.error('Error fetching campaigns:', error);
      setData([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Get campaign by ID
  const getCampaignById = useCallback(async (id: string): Promise<Campaign> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<EmailCampaign> = await axios.get(
        `${API_BASE_URL}/email-campaigns/${id}/`
      );

      const transformedCampaign: Campaign = {
        id: parseInt(response.data.id.toString()),
        name: response.data.name,
        description: response.data.description,
        campaign_type: response.data.campaign_type,
        status: response.data.status,
        subject_line: response.data.subject_line,
        email_content: response.data.email_content,
        emails_sent: response.data.emails_sent,
        emails_opened: response.data.emails_opened,
        emails_clicked: response.data.emails_clicked,
        target_leads_count: 0,
        open_rate: response.data.emails_sent > 0 ? (response.data.emails_opened / response.data.emails_sent) * 100 : 0,
        click_rate: response.data.emails_sent > 0 ? (response.data.emails_clicked / response.data.emails_sent) * 100 : 0,
        created_at: response.data.created_at,
        updated_at: response.data.updated_at
      };

      setData(transformedCampaign);
      return transformedCampaign;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch campaign';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Update campaign
  const updateCampaign = useCallback(async (id: string, campaignData: Partial<Campaign>) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<EmailCampaign> = await axios.put(
        `${API_BASE_URL}/email-campaigns/${id}/`,
        campaignData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update campaign';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Get campaign analytics
  const getCampaignAnalytics = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<any> = await axios.get(
        `${API_BASE_URL}/email-campaigns/${id}/analytics/`
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch campaign analytics';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Launch campaign and send emails
  const launchCampaign = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<any> = await axios.post(
        `${API_BASE_URL}/email-campaigns/${id}/launch/`
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to launch campaign';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Get campaign performance data
  const getCampaignPerformance = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<any> = await axios.get(
        `${API_BASE_URL}/email-campaigns/performance/`
      );

      setData(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch campaign performance';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  // Check SMTP status
  const checkSmtpStatus = async (campaignId?: string) => {
    try {
      setLoading(true);
      const url = campaignId 
        ? `${API_BASE_URL}/api/campaigns/${campaignId}/smtp-logs/`
        : `${API_BASE_URL}/api/campaigns/smtp-status/`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setError(null); // Clear any previous errors
      return result;
    } catch (err: any) {
      console.error('SMTP Status Check Error:', err);
      const errorMessage = err.message || 'Failed to check SMTP status';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getRealTimeStats = async (campaignId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/email-campaigns/${campaignId}/real_time_stats/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get real-time stats';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getTrackingDetails = async (campaignId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/email-campaigns/${campaignId}/tracking_details/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get tracking details';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    ...state,
    createCampaign,
    getCampaigns,
    getCampaignById,
    updateCampaign,
    launchCampaign,
    getCampaignAnalytics,
    getCampaignPerformance,
    checkSmtpStatus,
    getRealTimeStats,
    getTrackingDetails,
  };
};