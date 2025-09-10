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
  Lightbulb
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

const steps = [
  { id: 1, name: 'Campaign Setup', description: 'Basic campaign configuration' },
  { id: 2, name: 'Audience & Targeting', description: 'Define target audience and segmentation' },
  { id: 3, name: 'Content Creation', description: 'Create campaign content and messaging' },
  { id: 4, name: 'Schedule & Settings', description: 'Set timing and campaign settings' },
  { id: 5, name: 'Review & Launch', description: 'Final review and campaign launch' }
];

export function MarketingCampaignWizard({ onNavigate, initialCampaignData, editMode = false, selectedLeads: propSelectedLeads }: MarketingCampaignWizardProps) {
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
    if (editMode && initialCampaignData) {
      return {
        name: initialCampaignData.name || '',
        description: initialCampaignData.description || '',
        objective: initialCampaignData.objective || 'lead-nurturing',
        channels: initialCampaignData.channels || ['email'],
        targetAudience: [],
        content: initialCampaignData.content || {
          email: {
            subject: initialCampaignData.content?.email?.subject || '',
            body: initialCampaignData.content?.email?.body || '',
            cta: initialCampaignData.content?.email?.cta || ''
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

  // Use actual selectedLeads from props instead of mock data
  const selectedLeads = propSelectedLeads || [];

  const targetLeads = selectedLeads; // Alias for clarity in case 5

  const { 
    getTemplates, 
    createTemplate, 
    loading: apiLoading, 
    error: apiError 
  } = useTemplateApi();

  const { 
    launchCampaign,
    updateLead,
    loading: campaignLoading,
    error: campaignError,
    createCampaign // Assuming createCampaign is available from useCampaignApi
  } = useLeadApi();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const allTemplates = await getTemplates();
      setTemplates(allTemplates);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
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
          <tr>
            <td class="header">
              <h2 style="margin:0; font-size:24px;">SOAR-AI</h2>
              <p style="margin:8px 0 0 0; font-size:14px; opacity:0.9;">Corporate Travel Solutions</p>
            </td>
          </tr>

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
              <p class="p" style="font-size:13px;color:#6b7280;">
                If the button doesn't work, copy and paste the following URL into your browser: <br />
                <a href="${ctaLink}" style="color:#007bff;">${ctaLink}</a>
              </p>
              ` : ''}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer">
              <p style="margin:0 0 8px 0;">SOAR-AI • Transforming Corporate Travel</p>
              <p style="margin:0 0 8px 0;">
                <a href="#" style="color:#8b94a6;">Unsubscribe</a> | 
                <a href="#" style="color:#8b94a6;">Privacy Policy</a>
              </p>
              <p style="margin:0;">&copy; ${new Date().getFullYear()} SOAR-AI. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </div>
    </body>
    </html>
  `;

  const handleTemplateSelect = (template: any) => {
    if (!template) return;

    const subject = template.subject_line || `Partnership Opportunity - ${template.name}`;
    const ctaLink = campaignData.content?.email?.cta_link || template.cta_link || 'https://soarai.infinitisoftware.net/';
    
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
          cta_text: templateVariables.cta_text || template.cta || 'Learn More',
          company_address: templateVariables.company_address || '123 Business Ave, City, State 12345',
          unsubscribe_url: templateVariables.unsubscribe_url || 'https://soar-ai.com/unsubscribe',
          year: templateVariables.year || new Date().getFullYear().toString()
        });
      } catch (error) {
        console.error('Error parsing standard template content:', error);
        // Fallback to custom template rendering
        renderedContent = renderEmailTemplate(
          template.content || '', 
          template.cta || 'Learn More', 
          ctaLink,
          subject
        );
      }
    } else {
      // For custom templates, use the existing rendering method
      renderedContent = renderEmailTemplate(
        template.content || '', 
        template.cta || 'Learn More', 
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
          cta: template.cta || 'Learn More',
          cta_link: ctaLink
        }
      }
    }));
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
          cta_url: campaignData.content?.email?.cta_link || 'https://calendly.com/soar-ai/discovery-call',
          cta_text: campaignData.content?.email?.cta || 'Schedule Discovery Call',
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

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium text-gray-900">Campaign Templates</Label>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowCreateTemplate(true)}
                  className="text-orange-600 border-orange-300 hover:bg-orange-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>
              <p className="text-sm text-gray-600">Choose a template to get started quickly</p>

              {apiLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading templates...</span>
                </div>
              )}

              {apiError && (
                <Alert>
                  <AlertDescription>
                    Error loading templates: {apiError}
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFilteredTemplates().map((template) => (
                  <Card 
                    key={template.id}
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
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience & Targeting</h3>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  Selected Leads ({selectedLeads.length})
                </CardTitle>
                <CardDescription>Leads selected for this campaign</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedLeads.slice(0, 10).map((lead, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                      <div>
                        <p className="font-medium text-sm">{lead.company || `Company ${index + 1}`}</p>
                        <p className="text-xs text-gray-600">{lead.contact || 'Contact'} • {lead.industry || 'Industry'}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Score: {lead.score || Math.floor(Math.random() * 40) + 60}
                      </Badge>
                    </div>
                  ))}
                  {selectedLeads.length > 10 && (
                    <div className="text-center py-2 text-sm text-gray-600">
                      ... and {selectedLeads.length - 10} more leads
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedLeads.length}</div>
                  <p className="text-xs text-gray-600">Total Leads</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(selectedLeads.reduce((sum, lead) => sum + (lead.score || 65), 0) / selectedLeads.length) || 65}
                  </div>
                  <p className="text-xs text-gray-600">Avg Score</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {new Set(selectedLeads.map(l => l.industry)).size || 3}
                  </div>
                  <p className="text-xs text-gray-600">Industries</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.round(selectedLeads.filter(l => (l.score || 65) >= 75).length / selectedLeads.length * 100) || 60}%
                  </div>
                  <p className="text-xs text-gray-600">High Quality</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Creation</h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Content Tabs */}
              <div className="lg:col-span-2 space-y-6">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => {}}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
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
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
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
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
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

                {/* Email Content Tab */}
                {campaignData.channels.includes('email') && (
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <Label htmlFor="email-subject" className="text-sm font-medium text-gray-700">
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
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email-body" className="text-sm font-medium text-gray-700">
                          Email Body
                        </Label>

                        <div>
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
                          <Label htmlFor="email-cta" className="text-sm font-medium text-gray-700">
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
                            placeholder="See Compliance Demo"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email-cta-link" className="text-sm font-medium text-gray-700">
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
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Available Personalization Variables (moved inside RichTextEditor placeholder for now) */}
              </div>

              {/* Content Preview */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Content Preview</CardTitle>
                    <CardDescription className="text-sm">See how your content will look to recipients</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Preview for TechCorp Solutions */}
                    <div className="text-sm text-gray-600 mb-2">Preview for TechCorp Solutions</div>

                    {/* Email Preview */}
                    <div className="border rounded-lg p-4 bg-white">
                      <div className="mb-2">
                        <span className="font-medium text-sm text-gray-700">Subject: </span>
                        <span className="text-sm">
                          {campaignData.content.email.subject?.replace('{{company_name}}', 'TechCorp Solutions') || 'Ensure 100% travel policy compliance at TechCorp Solutions'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 mb-2">
                        <span className="font-medium">Hi Sarah Johnson,</span>
                      </div>
                      <div className="text-sm text-gray-700 whitespace-pre-wrap mb-4">
                        {campaignData.content.email.body?.replace('{{contact_name}}', 'Sarah Johnson')
                          .replace('{{employees}}', '2,500')
                          .replace('{{industry}}', 'Technology')
                          .replace('{{company_name}}', 'TechCorp Solutions') || 
                        `Managing travel compliance for 2,500 employees can be challenging. SOAR-AI ensures 100% policy adherence while maintaining traveler satisfaction.

Key compliance features for Technology companies:
• Automated policy enforcement
• Real-time approval workflows
• Expense management integration
• Regulatory compliance reporting
• Instant policy violation alerts

TechCorp Solutions can achieve complete travel governance without slowing down your team.`}
                      </div>
                      {campaignData.content.email.cta && (
                        campaignData.content.email.cta_link ? (
                          <a 
                            href={campaignData.content.email.cta_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block"
                          >
                            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                              {campaignData.content.email.cta}
                            </Button>
                          </a>
                        ) : (
                          <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                            {campaignData.content.email.cta}
                          </Button>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
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
                      checked={campaignData.settings.trackOpens}
                      onCheckedChange={(checked) => setCampaignData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, trackOpens: checked as boolean }
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Track Clicks</Label>
                    <Checkbox
                      checked={campaignData.settings.trackClicks}
                      onCheckedChange={(checked) => setCampaignData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, trackClicks: checked as boolean }
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Auto Follow-up</Label>
                    <Checkbox
                      checked={campaignData.settings.autoFollowUp}
                      onCheckedChange={(checked) => setCampaignData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, autoFollowUp: checked as boolean }
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
                    <div className="border rounded-lg overflow-hidden bg-white">
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
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
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
          <Button 
            onClick={handleNext}
            disabled={
              (currentStep === 1 && (!campaignData.name || campaignData.channels.length === 0)) ||
              (currentStep === 3 && campaignData.channels.includes('email') && (!campaignData.content.email.subject || !campaignData.content.email.body))
            }
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {currentStep === 5 ? 'Launch Campaign' : 'Next'}
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
    </div>
  );
}