import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useTemplateApi } from '../hooks/api/useTemplateApi';
import { useCampaignApi } from '../hooks/api/useCampaignApi';
import { useLeadApi } from '../hooks/api/useLeadApi';
import { useEmailTemplateApi } from '../hooks/api/useEmailTemplateApi';
import { EmailTemplateService } from '../utils/emailTemplateService';
import { toast } from 'react-toastify';
import RichTextEditor from './RichTextEditor';
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  MessageSquare,
  Linkedin,
  Plus,
  CheckCircle,
  X,
  Save,
  Loader2,
  Brain,
  RefreshCw,
  Send,
  Eye,
  FileText,
  Lightbulb,
  AlertTriangle,
  Info,
  Users,
  Search
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';


interface MarketingCampaignWizardProps {
  onNavigate: (screen: string, filters?: any) => void;
  initialCampaignData?: any;
  editMode?: boolean;
  selectedLeads?: any[];
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
  layout?: 'standard' | 'custom'; // Added for layout differentiation
}

interface Lead {
  id: string | number;
  company: string | { name: string; industry: string; [key: string]: any };
  contact: string | { first_name: string; last_name: string; position: string; email: string; [key: string]: any };
  title: string;
  email: string;
  industry: string;
  status: string;
  score: number;
  // other properties if any
}


const steps = [
  { id: 1, name: 'Campaign Setup', description: 'Basic campaign configuration' },
  { id: 2, name: 'Audience & Targeting', description: 'Define target audience and segmentation' },
  { id: 3, name: 'Content Creation', description: 'Create campaign content and messaging' },
  { id: 4, name: 'Schedule & Settings', description: 'Set timing and campaign settings' },
  { id: 5, name: 'Review & Launch', description: 'Final review and campaign launch' }
];

export function MarketingCampaignWizard({ onNavigate, initialCampaignData: initialData, editMode = false, selectedLeads: propSelectedLeads }: MarketingCampaignWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [templates, setTemplates] = useState<CampaignTemplate[]>([]);
  const [templateData, setTemplateData] = useState({
    name: '',
    channel_type: 'email' as 'email' | 'whatsapp' | 'linkedin' | 'mixed',
    target_industry: 'All',
    description: '',
    subject_line: '',
    content: '',
    cta: '',
    cta_link: '',
    linkedin_type: 'message' as 'message' | 'post' | 'connection',
    layout: 'custom' as 'standard' | 'custom' // Default to custom
  });
  const [campaignData, setCampaignData] = useState(() => {
    if (editMode && initialData) {
      return {
        name: initialData.name || '',
        description: initialData.description || '',
        objective: initialData.objective || 'lead-nurturing',
        channels: initialData.channels || ['email'],
        targetAudience: [], // This might need to be populated from initialData if it exists
        content: {
          email: {
            subject: initialData.content?.email?.subject || '',
            body: initialData.content?.email?.body || '',
            cta: initialData.content?.email?.cta || ''
          },
          whatsapp: {
            message: '',
            cta: ''
          },
          linkedin: {
            type: 'message',
            content: '',
            cta: ''
          }
        },
        settings: {
          sendTime: 'immediate',
          scheduleDate: '',
          scheduleTime: '09:00',
          followUp: false,
          followUpDays: 3,
          trackingEnabled: true
        },
        selectedTemplate: null
      };
    }

    return {
      name: '',
      description: '',
      objective: 'lead-nurturing',
      channels: ['email'],
      targetAudience: [],
      content: {
        email: {
          subject: '',
          body: '',
          cta: ''
        },
        whatsapp: {
          message: '',
          cta: ''
        },
        linkedin: {
          type: 'message',
          content: '',
          cta: ''
        }
      },
      settings: {
        sendTime: 'immediate',
        scheduleDate: '',
        scheduleTime: '09:00',
        followUp: false,
        followUpDays: 3,
        trackingEnabled: true
      },
      selectedTemplate: null
    };
  });
  const [isLaunching, setIsLaunching] = useState(false);
  const [emailTemplates, setEmailTemplates] = useState<any[]>([]);
  const [loadingEmailTemplates, setLoadingEmailTemplates] = useState(false);
  const [emailTemplateError, setEmailTemplateError] = useState<string | null>(null);
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState<any>(null); // State to track selected email template
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  const [templatePreviewData, setTemplatePreviewData] = useState<any>(null);
  const [showContentPreview, setShowContentPreview] = useState(false);

  // State for available leads section
  const [availableLeads, setAvailableLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');

  // Use actual selectedLeads from props instead of mock data
  const [selectedLeads, setSelectedLeads] = useState<Lead[]>(propSelectedLeads || []);

  const targetLeads = selectedLeads; // Alias for clarity in case 5

  const {
    getTemplates,
    createTemplate,
    loading: apiLoading,
    error: apiError
  } = useTemplateApi();

  const {
    getEmailTemplates,
    // loading: emailTemplateLoading, // This is already defined as loadingEmailTemplates
    // error: emailTemplateError // This is already defined as emailTemplateError
  } = useEmailTemplateApi();

  const {
    launchCampaign,
    updateLead,
    loading: campaignLoading,
    error: campaignError,
    createCampaign // Assuming createCampaign is available from useCampaignApi
  } = useLeadApi();

  useEffect(() => {
    // loadTemplates(); // This function is commented out in the original code, so keeping it commented
    loadEmailTemplates();
    loadAvailableLeads(); // Load available leads when the component mounts
  }, []);

  // Initialize data from navigation props if provided
  useEffect(() => {
    if (initialData?.templateMode && initialData?.selectedTemplate) {
      const template = initialData.selectedTemplate;
      setCampaignData(prev => ({
        ...prev,
        name: template.name,
        description: template.description,
        content: {
          ...prev.content,
          email: {
            subject: template.subject_line || '',
            body: template.content || '',
            cta: template.cta || ''
          }
        }
      }));
      // This handles campaign templates, not email templates from settings
      // setSelectedTemplate(template); // Already handled by setCampaignData
    } else if (initialData?.templateMode && initialData.selectedEmailTemplate) {
      // Handle email template from new template system
      const template = initialData.selectedEmailTemplate;
      setCampaignData(prev => ({
        ...prev,
        name: `Campaign from ${template.name}`,
        description: template.description || '',
        content: {
          ...prev.content,
          email: {
            subject: template.subject_line || '',
            body: template.content || '',
            cta: 'Learn More'
          }
        }
      }));
      // This needs to also set selectedEmailTemplate to match
      setSelectedEmailTemplate({
        id: `email-${template.id}`, // Prefix to distinguish from campaign templates
        name: template.name,
        description: template.description,
        variables: template.variables || [],
        sections: [{ type: 'body', content: template.content }],
        layout: 'custom',
        is_global: template.is_global,
        created_by_name: template.created_by_name,
        template_type: template.template_type
      });
      setCampaignData(prev => ({
        ...prev,
        selectedTemplate: {
          id: `email-${template.id}`, // Prefix to distinguish from campaign templates
          name: template.name,
          description: template.description,
          channel_type: 'email', // Assuming email templates are always email channel
          subject_line: template.subject_line,
          content: template.content, // This will be rendered in handleEmailTemplateSelect
          cta: 'Learn More',
          estimated_open_rate: 45, // Default values for email templates
          estimated_click_rate: 12,
          is_custom: !template.is_global, // Assuming global templates are not custom
          created_by: template.created_by_name || 'System',
          template_type: 'email_template',
          variables: template.variables || []
        }
      }));
    }
  }, [initialData]);

  const loadTemplates = async () => {
    try {
      const allTemplates = await getTemplates();
      setTemplates(allTemplates);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  // Load email templates from Settings Template Creation
  const loadEmailTemplates = async () => {
    setLoadingEmailTemplates(true);
    setEmailTemplateError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/email-templates/`);
      if (response.ok) {
        const templates = await response.json();
        console.log('Loaded email templates:', templates);
        setEmailTemplates(templates);
      } else {
        const errorText = await response.text();
        throw new Error(`Failed to load email templates: ${response.status} ${errorText}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error loading email templates';
      setEmailTemplateError(errorMessage);
      console.error('Error loading email templates:', error);
    } finally {
      setLoadingEmailTemplates(false);
    }
  };

  // Load available leads
  const loadAvailableLeads = async () => {
    setLoadingLeads(true);
    try {
      // Replace with actual API call to fetch leads
      const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/leads/`);
      if (response.ok) {
        const leads = await response.json();
        setAvailableLeads(leads);
      } else {
        throw new Error('Failed to fetch leads');
      }
    } catch (error) {
      console.error('Error loading available leads:', error);
      toast.error('Failed to load available leads.');
    } finally {
      setLoadingLeads(false);
    }
  };


  // Filter available leads based on search term and filters
  const filteredAvailableLeads = availableLeads.filter(lead => {
    const matchesSearchTerm = (typeof lead.company === 'object' ? lead.company?.name : lead.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (typeof lead.contact === 'object' ? `${lead.contact?.first_name || ''} ${lead.contact?.last_name || ''}`.trim() : lead.contact || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (typeof lead.contact === 'object' ? lead.contact?.email : lead.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatusFilter = statusFilter === 'all' || lead.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesIndustryFilter = industryFilter === 'all' || (typeof lead.company === 'object' ? (lead.company?.industry || '').toLowerCase() : lead.industry.toLowerCase()) === industryFilter.toLowerCase();
    return matchesSearchTerm && matchesStatusFilter && matchesIndustryFilter;
  });

  // Function to add a lead to selected leads
  const handleAddLead = (leadToAdd: Lead) => {
    // Check if the lead is already selected
    if (!selectedLeads.some(lead => lead.id === leadToAdd.id)) {
      setSelectedLeads(prevSelectedLeads => [...prevSelectedLeads, leadToAdd]);
      toast.success(`${typeof leadToAdd.contact === 'object' ? leadToAdd.contact?.first_name : leadToAdd.contact} from ${typeof leadToAdd.company === 'object' ? leadToAdd.company?.name : leadToAdd.company} added to campaign.`);
    } else {
      toast.warn(`${typeof leadToAdd.contact === 'object' ? leadToAdd.contact?.first_name : leadToAdd.contact} from ${typeof leadToAdd.company === 'object' ? leadToAdd.company?.name : leadToAdd.company} is already selected.`);
    }
  };

  // Function to remove a lead from selected leads
  const handleRemoveLead = (leadId: string | number) => {
    setSelectedLeads(prevSelectedLeads => prevSelectedLeads.filter(lead => lead.id !== leadId));
    toast.info(`Lead removed from campaign.`);
  };

  // Function to clear all selected leads
  const handleClearAllLeads = () => {
    setSelectedLeads([]);
    toast.info('All selected leads cleared.');
  };


  // Standard layout with proper email structure
  const renderEmailTemplate = (content: string, cta: string, ctaLink: string, subject: string) => `
    <!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        /* CLIENT-SAFE, INLINE-FRIENDLY STYLES */
        body { margin:0; padding:0; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; font-family: Arial, sans-serif; }
        table { border-spacing:0; }
        img { border:0; display:block; }
        a { color:inherit; text-decoration:none; }
        .wrapper { width:100%; background-color:#f5f7fb; padding:20px 0; }
        .content { max-width:600px; margin:0 auto; background:#ffffff; border-radius:6px; overflow:hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { padding:20px; text-align:center; background-color:#007bff; color:#ffffff; }
        .main { padding:24px; font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; color:#333333; font-size:16px; line-height:24px; }
        .h1 { font-size:22px; margin:0 0 16px 0; color:#111827; font-weight:600; }
        .p { margin:0 0 16px 0; }
        .button { display:inline-block; padding:12px 24px; border-radius:6px; background:#007bff; color:#ffffff; font-weight:600; text-decoration:none; margin:20px 0; }
        .button:hover { background:#0056b3; }
        .footer { padding:16px 20px; font-size:12px; color:#8b94a6; text-align:center; background-color:#f1f1f1; }
        .cta-container { text-align:center; margin:24px 0; }
        @media screen and (max-width:480px) {
          .content { width:100% !important; border-radius:0; margin:0; }
          .main { padding:16px; }
          .h1 { font-size:20px; }
          .header { padding:16px; }
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <table class="content" width="600" cellpadding="0" cellspacing="0" role="presentation">
          <!-- Header -->
          <!--<tr>
            <td class="header">
              <h2 style="margin:0; font-size:24px;">SOAR-AI</h2>
              <p style="margin:8px 0 0 0; font-size:14px; opacity:0.9;">Corporate Travel Solutions</p>
            </td>
          </tr> -->

          <!-- Main Content -->
          <tr>
            <td class="main">
              <div>${content}</div>
                ${cta && ctaLink && ctaLink !== '#' ? `
              <div class="cta-container">
                <a href="${ctaLink}" class="button" target="_blank">
                  ${cta}
                </a>
              </div>
              ` : ''}
            </td>
          </tr>

          <!-- Footer -->
          <!-- <tr>
            <td class="footer">
              <p style="margin:0 0 8px 0;">SOAR-AI • Transforming Corporate Travel</p>
              <p style="margin:0;">&copy; ${new Date().getFullYear()} SOAR-AI. All rights reserved.</p>
            </td>
          </tr> -->
        </table>
      </div>
    </body>
    </html>
  `;

  const handleTemplateSelect = (template: any) => {
    if (!template) return;

    const subject = template.subject_line || `Partnership Opportunity - ${template.name}`;
    const ctaLink = template.cta_link || 'https://calendly.com/soar-ai/demo';

    let renderedContent = '';

    // Check if this is a standard layout template
    if (template.layout === 'standard' || template.is_standard_layout) {
      // For standard layout, parse the JSON content and generate HTML
      try {
        const templateVariables = typeof template.content === 'string'
          ? JSON.parse(template.content)
          : template.content;

        // Use EmailTemplateService to generate proper HTML
        renderedContent = EmailTemplateService.generateStandardLayoutHTML({
          subject: templateVariables.subject || subject,
          preheader: templateVariables.preheader || 'Your corporate travel solution awaits',
          logo_url: templateVariables.logo_url || 'https://soarai.infinitisoftware.net/assets/SOAR%20Logo-Bnqz16_i.svg',
          company_name: templateVariables.company_name || 'SOAR-AI',
          main_heading: templateVariables.main_heading || 'Welcome to {{contact_name}}!',
          intro_paragraph: templateVariables.intro_paragraph || 'We\'re excited to help {{company_name}} transform your corporate travel experience.',
          body_content: templateVariables.body_content || '',
          cta_url: templateVariables.cta_url || ctaLink,
          cta_text: templateVariables.cta_text || template.cta || 'Schedule Demo',
          company_address: templateVariables.company_address || '123 Business Ave, City, State 12345',
          unsubscribe_url: templateVariables.unsubscribe_url || 'https://soar-ai.com/unsubscribe',
          year: templateVariables.year || new Date().getFullYear().toString()
        });
      } catch (error) {
        console.error('Error parsing standard template content:', error);
        // Fallback to custom template rendering
        renderedContent = renderEmailTemplate(
          template.content || '',
          template.cta || 'Schedule Demo',
          ctaLink,
          subject
        );
      }
    } else {
      // For custom templates, use the existing rendering method
      renderedContent = renderEmailTemplate(
        template.content || '',
        template.cta || 'Schedule Demo',
        ctaLink,
        subject
      );
    }

    setCampaignData(prev => ({
      ...prev,
      selectedTemplate: template,
      channels: template.channel_type === 'mixed'
        ? ['email', 'whatsapp', 'linkedin']
        : [template.channel_type],
      content: {
        ...prev.content,
        email: {
          subject: subject,
          body: renderedContent,
          cta: template.cta || 'Schedule Demo',
          cta_link: ctaLink
        }
      }
    }));
  };

  const handleEmailTemplateSelect = (template: any) => {
    if (!template) return;

    const subject = template.subject_line || `Partnership Opportunity - ${template.name}`;
    const ctaLink = 'https://calendly.com/soar-ai/demo';

    // For email templates, use the content directly or wrap it in standard layout
    let renderedContent = '';

    if (template.content && (template.content.startsWith('<!DOCTYPE') || template.content.startsWith('<html'))) {
      // Content is already complete HTML
      renderedContent = template.content;
    } else {
      // Wrap content in standard email template
      renderedContent = renderEmailTemplate(
        template.content || '',
        'Schedule Demo',
        ctaLink,
        subject
      );
    }

    // Create a template object that matches the expected structure for campaignData.selectedTemplate
    const newSelectedTemplate = {
      id: `email-${template.id}`, // Prefix to distinguish from campaign templates
      name: template.name,
      description: template.description || 'Email template',
      channel_type: 'email', // Email templates are email-only
      subject_line: template.subject_line,
      content: template.content, // Store original content for potential reuse or reference
      cta: 'Schedule Demo',
      cta_link: ctaLink,
      estimated_open_rate: 45, // Default values for email templates
      estimated_click_rate: 12,
      is_custom: !template.is_global, // Assuming global templates are not custom
      created_by: template.created_by_name || 'System',
      template_type: 'email_template',
      variables: template.variables || []
    };

    setSelectedEmailTemplate(newSelectedTemplate); // Set the selected email template state
    setCampaignData(prev => ({
      ...prev,
      selectedTemplate: newSelectedTemplate, // Also set it as the selected template for the campaign
      channels: ['email'], // Email templates are email-only
      content: {
        ...prev.content,
        email: {
          subject: subject,
          body: renderedContent, // Use the rendered content for the campaign's email body
          cta: 'Schedule Demo',
          cta_link: ctaLink
        }
      }
    }));
  };

  // Function to handle previewing an email template
  const handlePreviewEmailTemplate = async (template: any) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/email-templates/${template.id}/preview/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sample_data: {
            company_name: 'TechCorp Solutions',
            contact_name: 'John Smith',
            job_title: 'Travel Manager',
            industry: 'Technology',
            employees: '2,500',
            travel_budget: '$750,000',
            annual_revenue: '$50M',
            location: 'San Francisco, CA',
            phone: '+1 (555) 123-4567',
            email: 'john.smith@techcorp.com',
            website: 'www.techcorp.com'
          }
        }),
      });

      if (response.ok) {
        const preview = await response.json();

        // Import EmailTemplateService for complete layout rendering
        const { EmailTemplateService } = await import('../utils/emailTemplateService');

        // Create a complete email layout with header and footer
        const completeEmailHtml = EmailTemplateService.renderCorporateContactTemplate(
          preview.sample_data?.contact_name || 'John Smith',
          preview.sample_data?.company_name || 'TechCorp Solutions',
          preview.content,
          preview.subject || template.subject_line || 'Email Template Preview',
          'Schedule Demo',
          'https://calendly.com/soar-ai/demo'
        );

        setTemplatePreviewData({
          template,
          preview: {
            ...preview,
            content: completeEmailHtml,
            isCompleteLayout: true
          }
        });
        setShowTemplatePreview(true);
      } else {
        throw new Error('Failed to generate preview');
      }
    } catch (error) {
      console.error('Error previewing template:', error);
      toast.error('Failed to generate template preview');
    }
  };


  const handleChannelChange = (channel: string, checked: boolean) => {
    setCampaignData(prev => ({
      ...prev,
      channels: checked
        ? [...prev.channels, channel]
        : prev.channels.filter(c => c !== channel)
    }));
  };

  const insertPersonalizationVariable = (variable: string) => {
    const textarea = document.getElementById('template-content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const newText = text.substring(0, start) + variable + text.substring(end);

      setTemplateData(prev => ({ ...prev, content: newText }));

      // Set cursor position after the inserted variable
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    }
  };

  const handleCreateTemplate = async () => {
    if (!templateData.name || !templateData.content) {
      return;
    }

    try {
      const newTemplate = await createTemplate({
        name: templateData.name,
        description: templateData.description,
        channel_type: templateData.channel_type,
        target_industry: templateData.target_industry,
        subject_line: templateData.subject_line,
        content: templateData.content,
        cta: templateData.cta,
        cta_link: templateData.cta_link,
        linkedin_type: templateData.linkedin_type,
        layout: templateData.layout, // Include layout
        estimated_open_rate: 40,
        estimated_click_rate: 10,
        is_custom: true,
        created_by: 'User'
      });

      // Add to local templates array
      setTemplates(prev => [newTemplate, ...prev]);

      // Reset form
      setTemplateData({
        name: '',
        channel_type: 'email',
        target_industry: 'All',
        description: '',
        subject_line: '',
        content: '',
        cta: '',
        cta_link: '',
        linkedin_type: 'message',
        layout: 'custom'
      });

      setShowCreateTemplate(false);
    } catch (error) {
      console.error('Failed to create template:', error);
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(campaignData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Add onBack function
  const onBack = () => {
    onNavigate('email-campaigns');
  };

  // Add onComplete function
  const onComplete = (campaignResult: any) => {
    console.log('Campaign completed:', campaignResult);
    // Navigate back to email campaigns
    onNavigate('email-campaigns');
  };

  // Placeholder for validation, replace with actual validation logic
  const validateCampaign = () => {
    // Basic validation for required fields
    if (!campaignData.name) {
      toast.error("Campaign name is required.");
      return false;
    }
    if (campaignData.channels.length === 0) {
      toast.error("At least one channel must be selected.");
      return false;
    }
    if (campaignData.channels.includes('email') && (!campaignData.content.email.subject || !campaignData.content.email.body)) {
      toast.error("Email subject and body are required for email campaigns.");
      return false;
    }
    if (!campaignData.selectedTemplate) {
      toast.error("Please select a template.");
      return false;
    }
    return true;
  };

  const handleLaunchCampaign = async () => {
    if (!validateCampaign()) return;

    setIsLaunching(true);
    try {
      // Get the rendered content based on template type
      let renderedContent = campaignData.content?.email?.body || '';

      if (campaignData.selectedTemplate?.layout === 'standard') {
        // For standard layout, use the template service to render properly
        const templateVariables = {
          subject: campaignData.content?.email?.subject || 'Welcome to SOAR-AI',
          preheader: 'Your corporate travel solution awaits',
          logo_url: 'https://soarai.infinitisoftware.net/assets/SOAR%20Logo-Bnqz16_i.svg',
          company_name: 'SOAR-AI',
          main_heading: 'Welcome to {{contact_name}}!',
          intro_paragraph: 'We\'re excited to help {{company_name}} transform your corporate travel experience.',
          body_content: campaignData.content?.email?.body || '',
          // cta_url: campaignData.content?.email?.cta_link || 'https://calendly.com/soar-ai/discovery-call',
          // cta_text: campaignData.content?.email?.cta || 'Schedule Discovery Call',
          company_address: '123 Business Ave, City, State 12345',
          unsubscribe_url: 'https://soar-ai.com/unsubscribe',
          year: new Date().getFullYear().toString()
        };

        renderedContent = EmailTemplateService.generateStandardLayoutHTML(templateVariables);
      } else {
        // For custom templates, use the existing rendering method
        renderedContent = renderEmailTemplate(
          campaignData.content?.email?.body || '',
          campaignData.content?.email?.cta || 'Learn More',
          campaignData.content?.email?.cta_link || 'https://soarai.infinitisoftware.net/',
          campaignData.content?.email?.subject || 'Default Subject'
        );
      }

      const campaignPayload = {
        name: campaignData.name,
        description: campaignData.description,
        objective: campaignData.objective,
        channels: campaignData.channels,
        content: {
          ...campaignData.content,
          email: {
            ...campaignData.content?.email,
            body: renderedContent
          }
        },
        targetAudience: selectedLeads, // Use selectedLeads directly
        target_leads: selectedLeads.map(lead => lead.id), // Ensure lead IDs are passed
        settings: campaignData.settings,

        // Enhanced template integration
        selectedTemplate: campaignData.selectedTemplate,
        templateId: campaignData.selectedTemplate?.id,
        templateName: campaignData.selectedTemplate?.name,

        // Template-specific fields for API compatibility
        subjectLine: campaignData.content?.email?.subject || campaignData.selectedTemplate?.subject_line || '',
        messageContent: renderedContent, // Use the rendered HTML content here too
        cta: campaignData.content?.email?.cta || campaignData.selectedTemplate?.cta || '',
        cta_link: campaignData.content?.email?.cta_link || campaignData.selectedTemplate?.cta_link || 'https://soarai.infinitisoftware.net/',

        // Campaign type and template info
        campaign_type: campaignData.objective === 'lead-nurturing' ? 'nurture' : campaignData.objective,
        template_type: campaignData.selectedTemplate?.channel_type || 'email',
        is_custom_template: campaignData.selectedTemplate?.is_custom || false,

        // Performance expectations from template
        expected_open_rate: campaignData.selectedTemplate?.estimated_open_rate || 40,
        expected_click_rate: campaignData.selectedTemplate?.estimated_click_rate || 10
      };

      console.log('Launching campaign with enhanced payload:', campaignPayload);

      // Launch the campaign via API
      const response = await launchCampaign(campaignPayload);

      console.log('Campaign launch response:', response);

      // After successful campaign launch, update lead statuses
      if (response && response.success) {
        try {
          // Update status for leads that were 'new' to 'contacted'
          const leadsToUpdate = selectedLeads.filter(lead => lead.status === 'new');

          if (leadsToUpdate.length > 0) {
            console.log(`Updating ${leadsToUpdate.length} leads from 'new' to 'contacted'`);

            // Update each lead's status
            const updatePromises = leadsToUpdate.map(async (lead) => {
              try {
                const updatedLead = await updateLead(lead.id, {
                  status: 'contacted'
                });
                console.log(`Updated lead ${lead.id} status to contacted`);
                return { leadId: lead.id, success: true, updatedLead };
              } catch (error) {
                console.error(`Error updating lead ${lead.id}:`, error);
                return { leadId: lead.id, success: false, error };
              }
            });

            const updateResults = await Promise.all(updatePromises);
            const successfulUpdates = updateResults.filter(result => result.success);

            console.log(`Successfully updated ${successfulUpdates.length} lead statuses`);
          }
        } catch (error) {
          console.error('Error updating lead statuses:', error);
          // Don't fail the entire operation if lead updates fail
        }

        // Show success and complete with enhanced template info
        onComplete({
          ...campaignData,
          campaignId: response.campaign_id,
          launched: true,
          launchDate: new Date().toISOString(),
          response: response,
          emailsSent: response.emails_sent,
          targetLeadsProcessed: response.target_leads_processed,
          templateUsed: campaignData.selectedTemplate?.name,
          templateType: campaignData.selectedTemplate?.channel_type,
          performanceExpected: {
            opens: Math.round((selectedLeads.length * (campaignData.selectedTemplate?.estimated_open_rate || 40)) / 100),
            clicks: Math.round((selectedLeads.length * (campaignData.selectedTemplate?.estimated_click_rate || 10)) / 100)
          }
        });
      } else {
        throw new Error(response?.message || 'Campaign launch failed');
      }
    } catch (error: any) {
      console.error('Failed to launch campaign:', error);
      toast.error(`Failed to launch campaign: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsLaunching(false);
    }
  };


  const getFilteredTemplates = () => {
    return templates.filter(template =>
      campaignData.channels.includes(template.channel_type) ||
      (template.channel_type === 'mixed' && campaignData.channels.length > 1)
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Setup</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="campaign-name">Campaign Name</Label>
                  <Input
                    id="campaign-name"
                    value={campaignData.name}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Q4 Enterprise Outreach"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-objective">Campaign Objective</Label>
                  <Select value={campaignData.objective} onValueChange={(value) => setCampaignData(prev => ({ ...prev, objective: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lead Nurturing">Lead Nurturing</SelectItem>
                      <SelectItem value="Lead Conversion">Lead Conversion</SelectItem>
                      <SelectItem value="Re-engagement">Re-engagement</SelectItem>
                      <SelectItem value="Onboarding">New Client Onboarding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium text-gray-900">Communication Channels</Label>
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="email"
                    checked={campaignData.channels.includes('email')}
                    onCheckedChange={(checked) => handleChannelChange('email', checked as boolean)}
                  />
                  <Label htmlFor="email" className="flex items-center gap-2 cursor-pointer">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span>Email</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="whatsapp"
                    checked={campaignData.channels.includes('whatsapp')}
                    onCheckedChange={(checked) => handleChannelChange('whatsapp', checked as boolean)}
                  />
                  <Label htmlFor="whatsapp" className="flex items-center gap-2 cursor-pointer">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                    <span>WhatsApp</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="linkedin"
                    checked={campaignData.channels.includes('linkedin')}
                    onCheckedChange={(checked) => handleChannelChange('linkedin', checked as boolean)}
                  />
                  <Label htmlFor="linkedin" className="flex items-center gap-2 cursor-pointer">
                    <Linkedin className="h-4 w-4 text-blue-700" />
                    <span>LinkedIn</span>
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium text-gray-900">Templates</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log('Navigating to Settings Template Creation');
                    onNavigate('settings', { activeTab: 'template-creation' });
                  }}
                  className="text-orange-600 border-orange-300 hover:bg-orange-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>
              <p className="text-sm text-gray-600">Choose a template to get started quickly</p>

              {/* {(apiLoading || loadingEmailTemplates) && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading templates...</span>
                </div>
              )} */}

              {(apiError || emailTemplateError) && (
                <Alert>
                  <AlertDescription>
                    Error loading templates: {apiError || emailTemplateError}
                  </AlertDescription>
                </Alert>
              )}

              {/* Campaign Templates Section */}
              {/* <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Campaign Templates</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {getFilteredTemplates().map((template) => (
                    <Card
                      key={`campaign-${template.id}`}
                      className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                        campaignData.selectedTemplate?.id === template.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium">{template.name}</CardTitle>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">
                              {template.channel_type === 'email' && <Mail className="h-3 w-3 mr-1" />}
                              {template.channel_type === 'whatsapp' && <MessageSquare className="h-3 w-3 mr-1" />}
                              {template.channel_type === 'linkedin' && <Linkedin className="h-3 w-3 mr-1" />}
                              {template.channel_type}
                            </Badge>
                            {template.is_custom && (
                              <Badge variant="secondary" className="text-xs">
                                Custom
                              </Badge>
                            )}
                            {template.layout && (
                              <Badge variant="outline" className="text-xs capitalize">
                                {template.layout}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardDescription className="text-xs">{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Open: {template.estimated_open_rate}%</span>
                          <span>Click: {template.estimated_click_rate}%</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div> */}

              {/* Email Templates Section */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Templates ({emailTemplates.length})
                  {loadingEmailTemplates && (
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  )}
                </h4>

                {loadingEmailTemplates ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="border-gray-200">
                        <CardContent className="p-4">
                          <div className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded mb-3 w-3/4"></div>
                            <div className="h-2 bg-gray-200 rounded mb-2"></div>
                            <div className="h-2 bg-gray-200 rounded mb-3 w-1/2"></div>
                            <div className="flex gap-2">
                              <div className="h-8 bg-gray-200 rounded flex-1"></div>
                              <div className="h-8 bg-gray-200 rounded flex-1"></div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {emailTemplates.map((template) => (
                      <Card
                        key={`email-template-${template.id}`}
                        className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                          selectedEmailTemplate?.id === `email-${template.id}` ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'
                        }`}
                        onClick={() => handleEmailTemplateSelect(template)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm leading-tight pr-2">{template.name}</h4>
                            <div className="flex gap-1 flex-shrink-0">
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                <Mail className="h-3 w-3 mr-1" />
                                Email
                              </Badge>
                              {template.is_global && (
                                <Badge variant="default" className="text-xs bg-green-100 text-green-800 border-green-200">
                                  Global
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="mb-2">
                            <Badge variant="secondary" className="text-xs capitalize">
                              {template.template_type.replace('_', ' ')}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {template.description || 'Professional email template for campaigns'}
                          </p>

                          {template.subject_line && (
                            <div className="mb-3 p-2 bg-gray-50 rounded">
                              <span className="text-xs text-gray-500">Subject: </span>
                              <span className="text-xs font-medium">{template.subject_line}</span>
                            </div>
                          )}

                          {template.variables && template.variables.length > 0 && (
                            <div className="mb-3">
                              <div className="text-xs text-gray-500 mb-1">Variables:</div>
                              <div className="flex flex-wrap gap-1">
                                {template.variables.slice(0, 2).map((variable: string, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {variable.startsWith('{{') ? variable : `{{${variable}}}`}
                                  </Badge>
                                ))}
                                {template.variables.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{template.variables.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
                            <span>By: {template.created_by_name || 'System'}</span>
                            <span>{new Date(template.created_at).toLocaleDateString()}</span>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePreviewEmailTemplate(template);
                              }}
                              className="flex-1 text-xs"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Preview
                            </Button>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEmailTemplateSelect(template);
                              }}
                              className="flex-1 bg-orange-500 hover:bg-orange-600 text-xs"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Select
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {emailTemplates.length === 0 && !loadingEmailTemplates && (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                    <Mail className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Email Templates</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Create email templates in Settings to use them in campaigns
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => onNavigate('settings', { activeTab: 'template-creation' })}
                      className="text-orange-600 border-orange-300 hover:bg-orange-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Email Template
                    </Button>
                  </div>
                )}

                {emailTemplateError && (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-red-400" />
                    <p className="text-sm text-red-600">
                      Error loading email templates: {emailTemplateError}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadEmailTemplates}
                      className="mt-2"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {(campaignData.selectedTemplate) && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Template Selected: {campaignData.selectedTemplate?.name}
                  </span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  {campaignData.selectedTemplate.is_custom ? 'Custom Campaign Template' : 'Standard Email Template'}
                </p>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Audience & Targeting
              </CardTitle>
              <CardDescription>Define your target audience and manage lead selection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Selected Leads Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-medium">Selected Leads ({selectedLeads.length})</Label>
                  {selectedLeads.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearAllLeads}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Clear All
                    </Button>
                  )}
                </div>

                {selectedLeads.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-4 bg-blue-50">
                    {selectedLeads.map((lead) => (
                      <div key={lead.id} className="flex items-center justify-between p-3 bg-white rounded border">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {typeof lead.company === 'object' ? lead.company?.name || 'Unknown Company' : lead.company || 'Unknown Company'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {typeof lead.contact === 'object'
                              ? `${lead.contact?.first_name || ''} ${lead.contact?.last_name || ''}`.trim() || 'Unknown Contact'
                              : lead.contact || 'Unknown Contact'} - {lead.title || lead.contact?.position || 'Unknown Title'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {typeof lead.contact === 'object' ? lead.contact?.email || lead.email || 'No email' : lead.email || 'No email'} • {typeof lead.company === 'object' ? lead.company?.industry || 'Unknown Industry' : lead.industry || 'Unknown Industry'}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{lead.status}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveLead(lead.id)}
                            className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 border rounded-lg bg-gray-50">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium mb-2">No leads selected</p>
                    <p>Add leads from the available leads section below</p>
                  </div>
                )}
              </div>

              {/* Available Leads Section */}
              <div className="space-y-4">
                <Label className="text-lg font-medium">Available Leads</Label>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search leads..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="unqualified">Unqualified</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={industryFilter} onValueChange={setIndustryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industries</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={loadAvailableLeads}
                    disabled={loadingLeads}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${loadingLeads ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>

                {/* Available Leads List */}
                {loadingLeads ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    <span className="ml-2">Loading leads...</span>
                  </div>
                ) : filteredAvailableLeads.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-4">
                    {filteredAvailableLeads.map((lead) => (
                      <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {typeof lead.company === 'object' ? lead.company?.name || 'Unknown Company' : lead.company || 'Unknown Company'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {typeof lead.contact === 'object'
                              ? `${lead.contact?.first_name || ''} ${lead.contact?.last_name || ''}`.trim() || 'Unknown Contact'
                              : lead.contact || 'Unknown Contact'} - {lead.title || lead.contact?.position || 'Unknown Title'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {typeof lead.contact === 'object' ? lead.contact?.email || lead.email || 'No email' : lead.email || 'No email'} • {typeof lead.company === 'object' ? lead.company?.industry || 'Unknown Industry' : lead.industry || 'Unknown Industry'}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{lead.status}</Badge>
                          <Badge variant="secondary" className="text-xs">Score: {lead.score}</Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddLead(lead)}
                            className="h-8 px-3"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 border rounded-lg">
                    <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium mb-2">No leads found</p>
                    <p>Try adjusting your search criteria or refresh the list</p>
                  </div>
                )}
              </div>

              {/* Campaign Summary */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Campaign Summary</span>
                </div>
                <div className="text-sm text-blue-800">
                  <p>• Selected leads: <strong>{selectedLeads.length}</strong></p>
                  <p>• Target channels: <strong>{campaignData.channels.join(', ')}</strong></p>
                  {selectedLeads.length > 0 && (
                    <p>• Estimated reach: <strong>{selectedLeads.length} contacts</strong></p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Content Creation</h3>
              <p className="text-gray-600">Create compelling content for your marketing campaign</p>
            </div>

            {/* Channel Tabs */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Campaign Content</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowContentPreview(true)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Preview Content
                  </Button>
                </div>
                <div className="border-b border-gray-200 mt-4">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => {}}
                      className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                        campaignData.channels.includes('email')
                          ? 'border-orange-500 text-orange-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Mail className="h-4 w-4 inline mr-2" />
                      Email Content
                    </button>
                    <button
                      onClick={() => {}}
                      className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                        campaignData.channels.includes('whatsapp')
                          ? 'border-green-500 text-green-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                      disabled={!campaignData.channels.includes('whatsapp')}
                    >
                      <MessageSquare className="h-4 w-4 inline mr-2" />
                      WhatsApp Content
                    </button>
                    <button
                      onClick={() => {}}
                      className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                        campaignData.channels.includes('linkedin')
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                      disabled={!campaignData.channels.includes('linkedin')}
                    >
                      <Linkedin className="h-4 w-4 inline mr-2" />
                      LinkedIn Content
                    </button>
                  </nav>
                </div>
              </CardHeader>

              {/* Email Content Form */}
              {campaignData.channels.includes('email') && (
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <Label htmlFor="email-subject" className="text-base font-medium text-gray-900 mb-2 block">
                        Email Subject Line
                      </Label>
                      <Input
                        id="email-subject"
                        value={campaignData.content.email.subject}
                        onChange={(e) => setCampaignData(prev => ({
                          ...prev,
                          content: {
                            ...prev.content,
                            email: { ...prev.content.email, subject: e.target.value }
                          }
                        }))}
                        placeholder="Ensure 100% travel policy compliance at {{company_name}}"
                        className="text-base h-12"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Use variables like {{company_name}} for personalization
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="email-body" className="text-base font-medium text-gray-900 mb-2 block">
                        Email Content
                      </Label>
                      <div className="bg-gray-50 rounded-lg p-1">
                        <RichTextEditor
                          value={campaignData.content.email.body || ''}
                          onChange={(value) => setCampaignData(prev => ({
                            ...prev,
                            content: {
                              ...prev.content,
                              email: { ...prev.content.email, body: value }
                            }
                          }))}
                          placeholder="Hi {{contact_name}},\n\nManaging travel compliance for {{employees}} employees can be challenging. SOAR-AI ensures 100% policy adherence while maintaining traveler satisfaction.\n\nKey compliance features for {{industry}} companies:\n• Automated policy enforcement\n• Real-time approval workflows\n• Expense management integration\n• Regulatory compliance reporting\n• Instant policy violation alerts\n\n{{company_name}} can achieve complete travel governance without slowing down your team."
                          showVariables={true}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email-cta" className="text-base font-medium text-gray-900 mb-2 block">
                          Call-to-Action Button Text
                        </Label>
                        <Input
                          id="email-cta"
                          value={campaignData.content.email.cta}
                          onChange={(e) => setCampaignData(prev => ({
                            ...prev,
                            content: {
                              ...prev.content,
                              email: { ...prev.content.email, cta: e.target.value }
                            }
                          }))}
                          placeholder="Schedule Demo"
                          className="text-base h-12"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email-cta-link" className="text-base font-medium text-gray-900 mb-2 block">
                          Call-to-Action Link (Optional)
                        </Label>
                        <Input
                          id="email-cta-link"
                          type="url"
                          value={campaignData.content.email.cta_link || ''}
                          onChange={(e) => setCampaignData(prev => ({
                            ...prev,
                            content: {
                              ...prev.content,
                              email: { ...prev.content.email, cta_link: e.target.value }
                            }
                          }))}
                          placeholder="https://calendly.com/soar-ai/demo"
                          className="text-base h-12"
                        />
                      </div>
                    </div>

                    {/* Content Tips */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900 mb-2">Content Creation Tips</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Keep your subject line under 50 characters for better open rates</li>
                            <li>• Use personalization variables to make emails more relevant</li>
                            <li>• Include a clear call-to-action that drives engagement</li>
                            <li>• Test your content with the preview before launching</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule & Settings</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Campaign Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="send-time">Send Time</Label>
                    <Input
                      id="send-time"
                      type="time"
                      defaultValue="09:00"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select defaultValue="immediate">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Send Immediately</SelectItem>
                        <SelectItem value="once">Send Once</SelectItem>
                        <SelectItem value="weekly">Weekly Follow-up</SelectItem>
                        <SelectItem value="monthly">Monthly Nurture</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Campaign Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Track Opens</Label>
                    <Checkbox
                      checked={campaignData.settings.trackingEnabled} // Assuming trackingEnabled covers both
                      onCheckedChange={(checked) => setCampaignData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, trackingEnabled: checked as boolean }
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Track Clicks</Label>
                    <Checkbox
                      checked={campaignData.settings.trackingEnabled} // Assuming trackingEnabled covers both
                      onCheckedChange={(checked) => setCampaignData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, trackingEnabled: checked as boolean }
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Auto Follow-up</Label>
                    <Checkbox
                      checked={campaignData.settings.followUp}
                      onCheckedChange={(checked) => setCampaignData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, followUp: checked as boolean }
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 5:
        // Calculate AI predictions based on selected template and leads
        const calculateAIPredictions = () => {
          const leadsCount = selectedLeads.length;
          const template = campaignData.selectedTemplate;

          if (!template || leadsCount === 0) {
            return { opens: 0, clicks: 0, responses: 0, conversions: 0 };
          }

          const expectedOpens = Math.round((leadsCount * template.estimated_open_rate) / 100);
          const expectedClicks = Math.round((leadsCount * template.estimated_click_rate) / 100);
          const expectedResponses = Math.round(expectedClicks * 0.3); // 30% of clicks respond
          const expectedConversions = Math.round(expectedResponses * 0.2); // 20% of responses convert

          return {
            opens: expectedOpens,
            clicks: expectedClicks,
            responses: expectedResponses,
            conversions: expectedConversions
          };
        };

        const predictions = calculateAIPredictions();

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Campaign Summary */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Campaign Summary</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b">
                      <span className="text-gray-600 font-medium">Campaign Name:</span>
                      <span className="font-semibold text-gray-900">{campaignData.name || 'Untitled Campaign'}</span>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b">
                      <span className="text-gray-600 font-medium">Objective:</span>
                      <span className="font-semibold text-gray-900 capitalize">{campaignData.objective.replace('-', ' ')}</span>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b">
                      <span className="text-gray-600 font-medium">Channels:</span>
                      <div className="flex items-center gap-2">
                        {campaignData.channels.map(channel => (
                          <div key={channel} className="flex items-center gap-1">
                            {channel === 'email' && <Mail className="h-4 w-4 text-blue-600" />}
                            {channel === 'whatsapp' && <MessageSquare className="h-4 w-4 text-green-600" />}
                            {channel === 'linkedin' && <Linkedin className="h-4 w-4 text-blue-700" />}
                            <span className="font-semibold text-gray-900 text-sm capitalize">{channel}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b">
                      <span className="text-gray-600 font-medium">Template:</span>
                      <span className="font-semibold text-gray-900">{campaignData.selectedTemplate?.name || 'No template selected'}</span>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b">
                      <span className="text-gray-600 font-medium">Target Leads:</span>
                      <span className="font-semibold text-gray-900">{selectedLeads.length}</span>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b">
                      <span className="text-gray-600 font-medium">Start Date:</span>
                      <span className="font-semibold text-gray-900">{new Date().toISOString().split('T')[0]}</span>
                    </div>
                  </div>
                </div>

                {/* AI Predictions Section */}
                <div className="mt-8">
                  <div className="flex items-center gap-2 mb-6">
                    <Brain className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">AI Predictions</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">{predictions.opens}</div>
                      <div className="text-sm text-gray-500">Expected Opens</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">{predictions.clicks}</div>
                      <div className="text-sm text-gray-500">Expected Clicks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">{predictions.responses}</div>
                      <div className="text-sm text-gray-500">Expected Responses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">{predictions.conversions}</div>
                      <div className="text-sm text-gray-500">Expected Conversions</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Final Content Review */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Final Content Review</h3>

                <div className="bg-white border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <h4 className="font-semibold text-gray-900">Email Preview</h4>
                    <p className="text-sm text-gray-600 mt-1">This is how your email will appear to recipients</p>
                  </div>

                  <div className="p-4">
                    {/* Email Header Info */}
                    <div className="bg-gray-50 p-3 rounded-md mb-4 text-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-700">Subject:</span>
                        <span className="text-gray-900">
                          {campaignData.content.email.subject || campaignData.selectedTemplate?.subject_line || 'No subject line'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">From:</span>
                        <span className="text-gray-900">SOAR-AI &lt;corporate@soar-ai.com&gt;</span>
                      </div>
                    </div>

                    {/* Email Body Preview with proper styling */}
                    <div className="border rounded-lg overflow-hidden">
                      <iframe
                        srcDoc={campaignData.content.email.body || `
                          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f7fb;">
                            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 6px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                              <div style="padding: 20px; text-align: center; background-color: #007bff; color: #ffffff;">
                                <h2 style="margin: 0; font-size: 24px;">SOAR-AI</h2>
                                <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Corporate Travel Solutions</p>
                              </div>
                              <div style="padding: 24px; color: #333333; font-size: 16px; line-height: 24px;">
                                <p>Preview not available. Please select a template to see the email preview.</p>
                              </div>
                              <div style="padding: 16px 20px; font-size: 12px; color: #8b94a6; text-align: center; background-color: #f1f1f1;">
                                <p style="margin: 0;">&copy; ${new Date().getFullYear()} SOAR-AI. All rights reserved.</p>
                              </div>
                            </div>
                          </div>
                        `}
                        style={{
                          width: '100%',
                          height: '400px',
                          border: 'none',
                          borderRadius: '4px'
                        }}
                        title="Email Preview"
                      />
                    </div>

                    {/* Template Info and Stats */}
                    {campaignData.selectedTemplate && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                          <div className="text-sm text-blue-800">
                            <div className="font-medium mb-1">Template: {campaignData.selectedTemplate.name}</div>
                            <div className="text-xs text-blue-600">
                              {campaignData.selectedTemplate.description}
                            </div>
                          </div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-md border border-green-200">
                          <div className="text-sm text-green-800">
                            <div className="font-medium mb-1">Expected Performance</div>
                            <div className="text-xs text-green-600">
                              Open Rate: {campaignData.selectedTemplate.estimated_open_rate}% |
                              Click Rate: {campaignData.selectedTemplate.estimated_click_rate}%
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CTA Preview */}
                    {campaignData.content.email.cta && (
                      <div className="mt-4 p-3 bg-orange-50 rounded-md border border-orange-200">
                        <div className="text-sm text-orange-800">
                          <div className="font-medium mb-1">Call-to-Action</div>
                          <div className="flex items-center gap-2">
                            <span className="inline-block bg-orange-600 text-white px-3 py-1 rounded text-xs font-medium">
                              {campaignData.content.email.cta}
                            </span>
                            {campaignData.content.email.cta_link && (
                              <span className="text-xs text-orange-600">
                                → {campaignData.content.email.cta_link}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <div className="flex justify-center mt-12">
              <Button
                onClick={handleLaunchCampaign}
                disabled={isLaunching || campaignLoading || !campaignData.selectedTemplate}
                className="bg-[#FD9646] hover:bg-[#FD9646]/90 text-white px-12 py-4 text-lg font-semibold rounded-lg shadow-lg w-full max-w-md"
                size="lg"
              >
                {(isLaunching || campaignLoading) ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Launching Campaign...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Launch Campaign
                  </>
                )}
              </Button>
            </div>

            {!campaignData.selectedTemplate && (
              <Alert>
                <AlertDescription>
                  Please select a template in step 1 to launch the campaign.
                </AlertDescription>
              </Alert>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Function to determine if the next step can be proceeded to.
  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1: // Campaign Setup
        return campaignData.name.trim() !== '' && campaignData.channels.length > 0 && campaignData.selectedTemplate !== null;
      case 2: // Audience & Targeting
        return true; // Always proceed from this step
      case 3: // Content Creation
        if (campaignData.channels.includes('email')) {
          return campaignData.content.email.subject.trim() !== '' && campaignData.content.email.body.trim() !== '';
        }
        return true; // If email is not a selected channel, this step is considered complete
      case 4: // Schedule & Settings
        return true; // Always proceed from this step
      case 5: // Review & Launch
        return campaignData.selectedTemplate !== null; // Must have a template selected to launch
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">

          <div>
            <h2 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-weight-medium)',
              fontFamily: 'var(--font-family)'
            }}>
              {editMode ? 'Edit Marketing Campaign' : 'Marketing Campaign Wizard'}
            </h2>
            <p style={{
              fontSize: 'var(--text-base)',
              color: 'var(--color-muted-foreground)',
              fontFamily: 'var(--font-family)'
            }}>
              {editMode ? 'Edit your existing marketing campaign' : 'Create targeted marketing campaigns across multiple channels'}
            </p>
          </div>
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Leads
        </Button>
      </div>

      {/* Progress Steps */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Campaign Creation Progress</h2>
            <span className="text-sm text-gray-600">Step {currentStep} of 5</span>
          </div>

          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep === step.id
                    ? 'bg-orange-500 text-white'
                    : currentStep > step.id
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-16 mx-2 ${
                    currentStep >= step.id ? 'bg-orange-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <h3 className="font-medium text-gray-900">{steps[currentStep - 1].name}</h3>
            <p className="text-sm text-gray-600">{steps[currentStep - 1].description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card className="mb-6">
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="text-gray-700 border-gray-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack} className="text-gray-700 border-gray-300">
            Cancel
          </Button>
          {currentStep === 2 && (
            <Button
              variant="outline"
              onClick={() => onNavigate('settings', { activeTab: 'template-creation' })}
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <FileText className="h-4 w-4 mr-2" />
              Browse Templates
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={
              !canProceedToNextStep()
            }
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {currentStep === 5 ? (isLaunching || campaignLoading ? 'Launching...' : 'Launch Campaign') : 'Next'}
            {currentStep < 5 && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>

      {/* Template Creator Dialog */}
      <Dialog open={showCreateTemplate} onOpenChange={setShowCreateTemplate}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Create Custom Template</DialogTitle>
            <DialogDescription className="text-gray-600">
              Design your own campaign template with personalized content
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Template Name and Channel Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="template-name" className="text-sm font-medium text-gray-700">
                  Template Name
                </Label>
                <Input
                  id="template-name"
                  value={templateData.name}
                  onChange={(e) => setTemplateData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter template name"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="channel-type" className="text-sm font-medium text-gray-700">
                  Channel Type
                </Label>
                <Select value={templateData.channel_type} onValueChange={(value: 'email' | 'whatsapp' | 'linkedin' | 'mixed') => setTemplateData(prev => ({ ...prev, channel_type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="mixed">Multi-Channel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Layout Selection */}
            <div className="space-y-2">
              <Label htmlFor="layout" className="text-sm font-medium text-gray-700">
                Template Layout
              </Label>
              <Select value={templateData.layout} onValueChange={(value: 'standard' | 'custom') => setTemplateData(prev => ({ ...prev, layout: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Custom</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Target Industry */}
            <div className="space-y-2">
              <Label htmlFor="target-industry" className="text-sm font-medium text-gray-700">
                Target Industry
              </Label>
              <Select value={templateData.target_industry} onValueChange={(value) => setTemplateData(prev => ({ ...prev, target_industry: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Industries</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </Label>
              <textarea
                id="description"
                value={templateData.description}
                onChange={(e) => setTemplateData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this template"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm resize-none"
              />
            </div>

            {/* Subject Line */}
            {(templateData.channel_type === 'email' || templateData.channel_type === 'linkedin') && (
              <div className="space-y-2">
                <Label htmlFor="subject-line" className="text-sm font-medium text-gray-700">
                  {templateData.channel_type === 'email' ? 'Subject Line' : 'LinkedIn Subject/Connection Note'}
                </Label>
                <Input
                  id="subject-line"
                  value={templateData.subject_line}
                  onChange={(e) => setTemplateData(prev => ({ ...prev, subject_line: e.target.value }))}
                  placeholder="Enter subject line or connection note"
                  className="w-full"
                />
              </div>
            )}

            {/* LinkedIn Type */}
            {templateData.channel_type === 'linkedin' && (
              <div className="space-y-2">
                <Label htmlFor="linkedin-type" className="text-sm font-medium text-gray-700">
                  LinkedIn Type
                </Label>
                <Select value={templateData.linkedin_type} onValueChange={(value: 'message' | 'post' | 'connection') => setTemplateData(prev => ({ ...prev, linkedin_type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="message">Direct Message</SelectItem>
                    <SelectItem value="post">Post/Content</SelectItem>
                    <SelectItem value="connection">Connection Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm font-medium text-gray-700">
                Content
              </Label>
              <div>
                <RichTextEditor
                  value={templateData.content || ''}
                  onChange={(value) => setTemplateData(prev => ({ ...prev, content: value }))}
                  placeholder="Write your template content here..."
                  showVariables={true}
                />
              </div>
            </div>

            {/* Call-to-Action */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cta" className="text-sm font-medium text-gray-700">
                  Call-to-Action Button Text
                </Label>
                <Input
                  id="cta"
                  value={templateData.cta}
                  onChange={(e) => setTemplateData(prev => ({ ...prev, cta: e.target.value }))}
                  placeholder="e.g. Schedule a Demo, Connect, Learn More"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cta-link" className="text-sm font-medium text-gray-700">
                  Call-to-Action Link (Optional)
                </Label>
                <Input
                  id="cta-link"
                  type="url"
                  value={templateData.cta_link}
                  onChange={(e) => setTemplateData(prev => ({ ...prev, cta_link: e.target.value }))}
                  placeholder="https://example.com/schedule-demo"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Dialog Footer */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setShowCreateTemplate(false)}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTemplate}
              disabled={!templateData.name || !templateData.content || apiLoading}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6"
            >
              {apiLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Template
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Preview Dialog */}
      <Dialog open={showTemplatePreview} onOpenChange={setShowTemplatePreview}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0 border-b pb-4">
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              Template Preview - {templatePreviewData?.template?.name}
            </DialogTitle>
            <DialogDescription>
              Preview of "{templatePreviewData?.template?.name}" with sample data
            </DialogDescription>
          </DialogHeader>

          {templatePreviewData && (
            <div className="flex-1 overflow-hidden flex flex-col space-y-4">
              {/* Email Header Info */}
              <div className="flex-shrink-0 bg-gray-50 p-4 rounded-lg border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">Subject:</span>
                    <div className="mt-1 text-gray-900">
                      {templatePreviewData.preview.subject || templatePreviewData.template.subject_line || 'Email Preview'}
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Template Type:</span>
                    <div className="mt-1">
                      <Badge variant="outline" className="capitalize">
                        {templatePreviewData.template.template_type?.replace('_', ' ') || 'Email Campaign'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">From:</span>
                    <div className="mt-1 text-gray-900">SOAR-AI &lt;corporate@soar-ai.com&gt;</div>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">To:</span>
                    <div className="mt-1 text-gray-900">John Smith &lt;john.smith@techcorp.com&gt;</div>
                  </div>
                </div>
              </div>

              {/* Email Content Preview */}
              <div className="flex-1 overflow-hidden">
                <div className="h-full border rounded-lg overflow-hidden bg-white">
                  <iframe
                    srcDoc={templatePreviewData.preview.content}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      borderRadius: '4px'
                    }}
                    title="Email Template Preview"
                  />
                </div>
              </div>

              {/* Template Details Footer */}
              <div className="flex-shrink-0 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-blue-800">Variables Used:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {templatePreviewData.template.variables?.slice(0, 3).map((variable: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {variable.startsWith('{{') ? variable : `{{${variable}}}`}
                        </Badge>
                      ))}
                      {templatePreviewData.template.variables?.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{templatePreviewData.template.variables.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-blue-800">Scope:</span>
                    <div className="mt-1">
                      <Badge variant={templatePreviewData.template.is_global ? "default" : "secondary"} className="text-xs">
                        {templatePreviewData.template.is_global ? 'Global' : 'Company'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-blue-800">Created By:</span>
                    <div className="mt-1 text-blue-700">
                      {templatePreviewData.template.created_by_name || 'System'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex-shrink-0 flex items-center justify-between gap-4 pt-4 border-t">
            <div className="text-xs text-gray-500">
              <Info className="h-4 w-4 inline mr-1" />
              This preview shows your template with sample data and complete SOAR-AI email layout
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowTemplatePreview(false)}>
                Close Preview
              </Button>
              <Button
                onClick={() => {
                  if (templatePreviewData?.template) {
                    handleEmailTemplateSelect(templatePreviewData.template);
                    setShowTemplatePreview(false);
                  }
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Use This Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Content Preview Dialog */}
      <Dialog open={showContentPreview} onOpenChange={setShowContentPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              Content Preview
            </DialogTitle>
            <DialogDescription>
              Preview how your campaign content will appear to recipients
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6">
            {/* Sample Recipients */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-2">Preview Recipients</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Company:</span> TechCorp Solutions
                </div>
                <div>
                  <span className="font-medium">Contact:</span> Sarah Johnson
                </div>
                <div>
                  <span className="font-medium">Industry:</span> Technology
                </div>
                <div>
                  <span className="font-medium">Employees:</span> 2,500
                </div>
              </div>
            </div>

            {/* Email Preview */}
            {campaignData.channels.includes('email') && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Preview
                </h3>

                <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                  {/* Email Header */}
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">From:</span>
                        <span className="ml-2">SOAR-AI &lt;corporate@soar-ai.com&gt;</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">To:</span>
                        <span className="ml-2">Sarah Johnson &lt;sarah.johnson@techcorp.com&gt;</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Subject:</span>
                        <span className="ml-2 font-medium">
                          {campaignData.content.email.subject
                            ?.replace('{{company_name}}', 'TechCorp Solutions')
                            ?.replace('{{contact_name}}', 'Sarah Johnson') ||
                            'Ensure 100% travel policy compliance at TechCorp Solutions'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Email Body */}
                  <div className="p-6">
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: (campaignData.content.email.body || `
                          <p><strong>Hi Sarah Johnson,</strong></p>
                          <p>Managing travel compliance for 2,500 employees can be challenging. SOAR-AI ensures 100% policy adherence while maintaining traveler satisfaction.</p>
                          <p><strong>Key compliance features for Technology companies:</strong></p>
                          <ul>
                            <li>Automated policy enforcement</li>
                            <li>Real-time approval workflows</li>
                            <li>Expense management integration</li>
                            <li>Regulatory compliance reporting</li>
                            <li>Instant policy violation alerts</li>
                          </ul>
                          <p>TechCorp Solutions can achieve complete travel governance without slowing down your team.</p>
                        `)
                        .replace(/{{contact_name}}/g, 'Sarah Johnson')
                        .replace(/{{company_name}}/g, 'TechCorp Solutions')
                        .replace(/{{employees}}/g, '2,500')
                        .replace(/{{industry}}/g, 'Technology')
                        .replace(/{{travel_budget}}/g, '$750,000')
                        .replace(/{{sender_name}}/g, 'SOAR-AI Team')
                      }}
                    />

                    {/* Call-to-Action */}
                    {campaignData.content.email.cta && (
                      <div className="mt-6 text-center">
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
                          {campaignData.content.email.cta}
                        </Button>
                        {campaignData.content.email.cta_link && (
                          <p className="text-xs text-gray-500 mt-2">
                            Links to: {campaignData.content.email.cta_link}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Email Footer */}
                  <div className="bg-gray-50 px-4 py-3 border-t text-xs text-gray-500 text-center">
                    <p>&copy; {new Date().getFullYear()} SOAR-AI. All rights reserved.</p>
                    <p>This is a preview of your campaign content.</p>
                  </div>
                </div>
              </div>
            )}

            {/* WhatsApp Preview (if channel is selected) */}
            {campaignData.channels.includes('whatsapp') && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  WhatsApp Preview
                </h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    WhatsApp content preview would appear here when implemented.
                  </p>
                </div>
              </div>
            )}

            {/* LinkedIn Preview (if channel is selected) */}
            {campaignData.channels.includes('linkedin') && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Linkedin className="h-5 w-5" />
                  LinkedIn Preview
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    LinkedIn content preview would appear here when implemented.
                  </p>
                </div>
              </div>
            )}

            {/* Preview Notes */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-900 mb-1">Preview Notes</h4>
                  <ul className="text-sm text-amber-800 space-y-1">
                    <li>• This preview uses sample data from TechCorp Solutions</li>
                    <li>• Actual emails will use real recipient data and personalization</li>
                    <li>• Variables like {'{{company_name}}'} will be replaced with actual values</li>
                    <li>• The final email design may include additional branding elements</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-500">
              Preview generated for: {selectedLeads.length} selected leads
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowContentPreview(false)}>
                Close Preview
              </Button>
              <Button 
                onClick={() => setShowContentPreview(false)}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Continue Editing
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}