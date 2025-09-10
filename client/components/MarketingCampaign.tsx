import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';  
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  ArrowLeft,
  ArrowRight,
  Megaphone,
  Users,
  Mail,
  MessageSquare,
  Target,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  UserMinus,
  Send,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Star,
  Filter,
  Download,
  Calendar,
  Building2,
  Globe,
  Settings,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Phone,
  Smartphone,
  Brain,
  Lightbulb,
  AlertTriangle,
  Info,
  BookOpen,
  FileText,
  Image,
  Video,
  ExternalLink,
  RefreshCw,
  Search,
  Linkedin,
  UserPlus,
  Share,
  Heart,
  MessageCircle,
  Copy,
  Save,
  FolderPlus,
  Archive,
  Bookmark
} from 'lucide-react';

interface MarketingCampaignProps {
  targetLeads: any[];
  onNavigate: (screen: string, filters?: any) => void;
  onBack: () => void;
}

interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  type: 'email' | 'whatsapp' | 'linkedin' | 'mixed';
  industry: string;
  subject?: string;
  content: string;
  cta: string;
  linkedinType?: 'message' | 'post' | 'connection';
  estimatedOpenRate: number;
  estimatedClickRate: number;
  createdBy?: string;
  isCustom?: boolean;
}

const campaignTemplates: CampaignTemplate[] = [
  {
    id: 'welcome-series',
    name: 'Welcome Series',
    description: 'Multi-touch welcome sequence for new leads',
    type: 'email',
    industry: 'All',
    subject: 'Welcome to the future of corporate travel - {{company_name}}',
    content: `Hi {{contact_name}},

Welcome to SOAR-AI! We're excited to help {{company_name}} transform your corporate travel experience.

Based on your {{industry}} background and {{employees}} team size, we've identified several opportunities to optimize your travel operations:

✈️ Reduce travel costs by up to 35%
📊 Streamline booking and approval processes  
🌍 Access our global partner network
🤖 AI-powered travel recommendations

Ready to see how we can help? Let's schedule a 15-minute discovery call.`,
    cta: 'Schedule Discovery Call',
    estimatedOpenRate: 45,
    estimatedClickRate: 12
  },
  {
    id: 'cost-savings',
    name: 'Cost Savings Focus',
    description: 'Emphasizes ROI and cost reduction benefits',
    type: 'email',
    industry: 'Manufacturing',
    subject: '{{company_name}}: Cut travel costs by 35% with SOAR-AI',
    content: `{{contact_name}},

Companies like {{company_name}} in the {{industry}} sector are saving an average of 35% on travel costs with SOAR-AI.

Here's what {{company_name}} could save annually:
• Current estimated budget: {{travel_budget}}
• Potential savings: {{calculated_savings}}
• ROI timeline: 3-6 months

Our Manufacturing clients report:
📉 35% reduction in travel expenses
⏱️ 50% faster booking processes
📋 90% compliance with travel policies
🎯 Better budget predictability

Want to see your personalized savings projection?`,
    cta: 'Get My Savings Report',
    estimatedOpenRate: 52,
    estimatedClickRate: 18
  },
  {
    id: 'compliance-focused',
    name: 'Compliance & Control',
    description: 'Targets compliance and policy management needs',
    type: 'email',
    industry: 'Financial Services',
    subject: 'Ensure 100% travel policy compliance at {{company_name}}',
    content: `Hi {{contact_name}},

Managing travel compliance for {{employees}} employees can be challenging. SOAR-AI ensures 100% policy adherence while maintaining traveler satisfaction.

Key compliance features for {{industry}} companies:
🔒 Automated policy enforcement
📋 Real-time approval workflows  
📊 Comprehensive audit trails
🏛️ Regulatory compliance reporting
⚡ Instant policy violation alerts

{{company_name}} can achieve complete travel governance without slowing down your team.`,
    cta: 'See Compliance Demo',
    estimatedOpenRate: 48,
    estimatedClickRate: 15
  },
  {
    id: 'whatsapp-followup',
    name: 'WhatsApp Follow-up',
    description: 'Quick WhatsApp follow-up for engaged leads',
    type: 'whatsapp',
    industry: 'All',
    content: `Hi {{contact_name}}! 👋

Following up on our email about SOAR-AI's corporate travel solutions for {{company_name}}.

Quick question: What's your biggest travel management challenge right now?

I'd love to show you how we've helped similar {{industry}} companies:
• ✅ {{specific_benefit_1}}
• ✅ {{specific_benefit_2}}
• ✅ {{specific_benefit_3}}

Worth a 10-minute chat? 📞`,
    cta: 'Yes, let\'s chat!',
    estimatedOpenRate: 95,
    estimatedClickRate: 35
  },
  {
    id: 'linkedin-connection',
    name: 'LinkedIn Connection Request',
    description: 'Professional connection request with value proposition',
    type: 'linkedin',
    industry: 'All',
    linkedinType: 'connection',
    content: `Hi {{contact_name}},

I noticed your role as {{job_title}} at {{company_name}} and would love to connect! 

I specialize in helping {{industry}} companies optimize their corporate travel operations. Based on {{company_name}}'s profile, I believe there could be some valuable synergies.

Would you be open to connecting?`,
    cta: 'Connect',
    estimatedOpenRate: 65,
    estimatedClickRate: 25
  },
  {
    id: 'linkedin-message',
    name: 'LinkedIn Direct Message',
    description: 'Professional outreach message with specific value',
    type: 'linkedin',
    industry: 'Technology',
    linkedinType: 'message',
    content: `Hi {{contact_name}},

I hope you're doing well! I came across {{company_name}} and was impressed by your growth in the {{industry}} sector.

I'm reaching out because I've been helping similar tech companies reduce their travel costs by 30-40% while improving employee experience. Given {{company_name}}'s scale ({{employees}} employees), there could be significant opportunities.

Some quick wins I've identified for companies like yours:
🚀 Automated travel policy enforcement
💰 Real-time cost optimization
📱 Mobile-first booking experience
📊 Advanced travel analytics

Would you be interested in a brief 15-minute conversation to explore how this might apply to {{company_name}}?`,
    cta: 'Schedule 15-min call',
    estimatedOpenRate: 70,
    estimatedClickRate: 30
  },
  {
    id: 'linkedin-post-engagement',
    name: 'LinkedIn Post Engagement',
    description: 'Thought leadership post to attract corporate travel managers',
    type: 'linkedin',
    industry: 'All',
    linkedinType: 'post',
    content: `🚀 Corporate Travel Transformation: What we're seeing in 2024

After analyzing 500+ corporate travel programs this year, here are the top 3 trends:

1️⃣ AI-Driven Policy Compliance
Companies are achieving 95%+ policy adherence with automated enforcement. The days of manual expense report reviews are ending.

2️⃣ Predictive Cost Management  
Advanced analytics are helping CFOs predict travel spend 6 months in advance, enabling better budget planning and cost control.

3️⃣ Employee Experience Revolution
The best travel programs now prioritize traveler satisfaction alongside cost savings. Happy travelers = better compliance.

What trends are you seeing in your travel program? 

#CorporateTravel #TravelManagement #BusinessTravel #AI #CostOptimization`,
    cta: 'Engage with post',
    estimatedOpenRate: 85,
    estimatedClickRate: 15
  }
];

const mockCampaignData = {
  emailsSent: 1247,
  delivered: 1189,
  bounced: 58,
  opened: 534,
  uniqueOpened: 398,
  clicked: 142,
  unsubscribed: 23,
  whatsappDelivered: 423,
  whatsappRead: 387,
  linkedinConnections: 156,
  linkedinMessages: 89,
  linkedinPostViews: 2847,
  linkedinEngagements: 234,
  leadsGenerated: 89,
  responses: 156,
  followUpSet: 67
};

export function MarketingCampaign({ targetLeads, onNavigate, onBack }: MarketingCampaignProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showTemplateCreator, setShowTemplateCreator] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<CampaignTemplate[]>([]);
  const [newTemplate, setNewTemplate] = useState<Partial<CampaignTemplate>>({
    name: '',
    description: '',
    type: 'email',
    industry: 'All',
    content: '',
    cta: '',
    linkedinType: 'message'
  });
  const [campaignData, setCampaignData] = useState({
    name: '',
    objective: 'lead-nurturing',
    channels: ['email'],
    targetAudience: targetLeads,
    template: null,
    schedule: {
      startDate: new Date().toISOString().split('T')[0],
      timezone: 'UTC',
      sendTime: '09:00',
      frequency: 'immediate'
    },
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
        cta: '',
        subject: ''
      }
    },
    settings: {
      trackOpens: true,
      trackClicks: true,
      autoFollowUp: false,
      respectUnsubscribe: true,
      abTest: false
    }
  });
  const [selectedTemplate, setSelectedTemplate] = useState<CampaignTemplate | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const [campaignLaunched, setCampaignLaunched] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);

  const steps = [
    { id: 1, name: 'Campaign Setup', description: 'Basic campaign configuration' },
    { id: 2, name: 'Audience & Targeting', description: 'Define target audience and segmentation' },
    { id: 3, name: 'Content Creation', description: 'Create campaign content and messaging' },
    { id: 4, name: 'Schedule & Settings', description: 'Set timing and campaign settings' },
    { id: 5, name: 'Review & Launch', description: 'Final review and campaign launch' }
  ];

  const allTemplates = [...campaignTemplates, ...customTemplates];

  const handleTemplateSelect = (template: CampaignTemplate) => {
    setSelectedTemplate(template);
    setCampaignData(prev => ({
      ...prev,
      channels: template.type === 'mixed' ? ['email', 'whatsapp', 'linkedin'] : [template.type],
      content: {
        ...prev.content,
        email: {
          subject: template.subject || '',
          body: template.type === 'email' ? template.content : '',
          cta: template.cta
        },
        whatsapp: {
          message: template.type === 'whatsapp' ? template.content : '',
          cta: template.cta
        },
        linkedin: {
          type: template.linkedinType || 'message',
          content: template.type === 'linkedin' ? template.content : '',
          cta: template.cta,
          subject: template.subject || ''
        }
      }
    }));
  };

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.content) return;
    
    const template: CampaignTemplate = {
      id: `custom-${Date.now()}`,
      name: newTemplate.name!,
      description: newTemplate.description!,
      type: newTemplate.type!,
      industry: newTemplate.industry!,
      content: newTemplate.content!,
      cta: newTemplate.cta!,
      linkedinType: newTemplate.linkedinType,
      subject: newTemplate.subject,
      estimatedOpenRate: 40, // Default estimate
      estimatedClickRate: 10, // Default estimate
      createdBy: 'User',
      isCustom: true
    };
    
    setCustomTemplates([...customTemplates, template]);
    setShowTemplateCreator(false);
    setNewTemplate({
      name: '',
      description: '',
      type: 'email',
      industry: 'All',
      content: '',
      cta: '',
      linkedinType: 'message'
    });
  };

  const handleLaunchCampaign = async () => {
    setIsLaunching(true);
    
    // Simulate campaign launch
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLaunching(false);
    setCampaignLaunched(true);
    setShowMetrics(true);
  };

  const personalizeContent = (content: string, lead: any) => {
    return content
      .replace(/{{company_name}}/g, lead.company)
      .replace(/{{contact_name}}/g, lead.contact)
      .replace(/{{job_title}}/g, lead.title || 'Decision Maker')
      .replace(/{{industry}}/g, lead.industry)
      .replace(/{{employees}}/g, lead.employees?.toLocaleString() || 'N/A')
      .replace(/{{travel_budget}}/g, lead.travelBudget || 'Not specified')
      .replace(/{{calculated_savings}}/g, calculateSavings(lead.travelBudget))
      .replace(/{{specific_benefit_1}}/g, getBenefitForIndustry(lead.industry, 1))
      .replace(/{{specific_benefit_2}}/g, getBenefitForIndustry(lead.industry, 2))
      .replace(/{{specific_benefit_3}}/g, getBenefitForIndustry(lead.industry, 3));
  };

  const calculateSavings = (budget: string) => {
    if (!budget) return '$50,000+';
    const amount = parseInt(budget.replace(/[^\d]/g, ''));
    const multiplier = budget.includes('M') ? 1000000 : budget.includes('K') ? 1000 : 1;
    const totalBudget = amount * multiplier;
    const savings = Math.round(totalBudget * 0.35);
    
    if (savings >= 1000000) {
      return `$${(savings / 1000000).toFixed(1)}M`;
    } else if (savings >= 1000) {
      return `$${(savings / 1000).toFixed(0)}K`;
    }
    return `$${savings.toLocaleString()}`;
  };

  const getBenefitForIndustry = (industry: string, index: number) => {
    const benefits = {
      'Technology': ['API integrations', 'Automated expense reporting', 'Real-time analytics'],
      'Manufacturing': ['Multi-site coordination', 'Supply chain travel optimization', 'Cost control'],
      'Financial Services': ['Compliance management', 'Audit trail reporting', 'Risk management'],
      'Banking': ['Regulatory compliance', 'Secure booking platform', 'Policy enforcement'],
      'Consulting': ['Client billing integration', 'Project-based travel', 'Flexible policies'],
      'default': ['Cost savings', 'Time efficiency', 'Better compliance']
    };
    
    const industryBenefits = benefits[industry] || benefits.default;
    return industryBenefits[index - 1] || industryBenefits[0];
  };

  const insertPersonalizationVariable = (variable: string) => {
    const textarea = document.querySelector('textarea[placeholder="Write your template content here..."]') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const newText = text.substring(0, start) + variable + text.substring(end);
      setNewTemplate(prev => ({ ...prev, content: newText }));
      
      // Set cursor position after the inserted variable
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Campaign Setup</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Campaign Name</Label>
                  <Input
                    value={campaignData.name}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Q4 Enterprise Outreach"
                  />
                </div>
                <div>
                  <Label>Campaign Objective</Label>
                  <Select value={campaignData.objective} onValueChange={(value) => setCampaignData(prev => ({ ...prev, objective: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lead-nurturing">Lead Nurturing</SelectItem>
                      <SelectItem value="conversion">Lead Conversion</SelectItem>
                      <SelectItem value="reengagement">Re-engagement</SelectItem>
                      <SelectItem value="onboarding">New Client Onboarding</SelectItem>
                      <SelectItem value="upsell">Upsell & Cross-sell</SelectItem>
                      <SelectItem value="brand-awareness">Brand Awareness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Communication Channels</Label>
              <div className="flex gap-4 mt-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="email"
                    checked={campaignData.channels.includes('email')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCampaignData(prev => ({ ...prev, channels: [...prev.channels, 'email'] }));
                      } else {
                        setCampaignData(prev => ({ ...prev, channels: prev.channels.filter(c => c !== 'email') }));
                      }
                    }}
                  />
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="whatsapp"
                    checked={campaignData.channels.includes('whatsapp')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCampaignData(prev => ({ ...prev, channels: [...prev.channels, 'whatsapp'] }));
                      } else {
                        setCampaignData(prev => ({ ...prev, channels: prev.channels.filter(c => c !== 'whatsapp') }));
                      }
                    }}
                  />
                  <Label htmlFor="whatsapp" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    WhatsApp
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="linkedin"
                    checked={campaignData.channels.includes('linkedin')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCampaignData(prev => ({ ...prev, channels: [...prev.channels, 'linkedin'] }));
                      } else {
                        setCampaignData(prev => ({ ...prev, channels: prev.channels.filter(c => c !== 'linkedin') }));
                      }
                    }}
                  />
                  <Label htmlFor="linkedin" className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </Label>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-base font-medium">Campaign Templates</Label>
                <Button variant="outline" onClick={() => setShowTemplateCreator(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Choose a template to get started quickly</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allTemplates.filter(template => 
                  campaignData.channels.includes(template.type) || 
                  (template.type === 'mixed' && campaignData.channels.length > 1)
                ).map((template) => (
                  <Card 
                    key={template.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedTemplate?.id === template.id ? 'ring-2 ring-primary border-primary' : ''
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{template.name}</h4>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline">
                            {template.type === 'email' && <Mail className="h-3 w-3 mr-1" />}
                            {template.type === 'whatsapp' && <MessageSquare className="h-3 w-3 mr-1" />}
                            {template.type === 'linkedin' && <Linkedin className="h-3 w-3 mr-1" />}
                            {template.type === 'mixed' && <Zap className="h-3 w-3 mr-1" />}
                            {template.type}
                          </Badge>
                          {template.isCustom && (
                            <Badge variant="secondary" className="text-xs">
                              Custom
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                      {template.linkedinType && (
                        <p className="text-xs text-blue-600 mb-2">
                          LinkedIn {template.linkedinType}
                        </p>
                      )}
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Open: {template.estimatedOpenRate}%</span>
                        <span>Click: {template.estimatedClickRate}%</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Template Creator Dialog */}
            <Dialog open={showTemplateCreator} onOpenChange={setShowTemplateCreator}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Custom Template</DialogTitle>
                  <DialogDescription>Design your own campaign template with personalized content</DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Template Name</Label>
                      <Input
                        value={newTemplate.name || ''}
                        onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter template name"
                      />
                    </div>
                    <div>
                      <Label>Channel Type</Label>
                      <Select value={newTemplate.type} onValueChange={(value: 'email' | 'whatsapp' | 'linkedin' | 'mixed') => setNewTemplate(prev => ({ ...prev, type: value }))}>
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Target Industry</Label>
                      <Select value={newTemplate.industry} onValueChange={(value) => setNewTemplate(prev => ({ ...prev, industry: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All Industries</SelectItem>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="Financial Services">Financial Services</SelectItem>
                          <SelectItem value="Banking">Banking</SelectItem>
                          <SelectItem value="Consulting">Consulting</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {newTemplate.type === 'linkedin' && (
                      <div>
                        <Label>LinkedIn Type</Label>
                        <Select value={newTemplate.linkedinType} onValueChange={(value: 'message' | 'post' | 'connection') => setNewTemplate(prev => ({ ...prev, linkedinType: value }))}>
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
                  </div>

                  <div>
                    <Label>Template Description</Label>
                    <Input
                      value={newTemplate.description || ''}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of this template"
                    />
                  </div>

                  {(newTemplate.type === 'email' || newTemplate.type === 'linkedin') && (
                    <div>
                      <Label>Subject Line {newTemplate.type === 'linkedin' && newTemplate.linkedinType === 'connection' ? '(Connection Note)' : ''}</Label>
                      <Input
                        value={newTemplate.subject || ''}
                        onChange={(e) => setNewTemplate(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Enter subject line or connection note"
                      />
                    </div>
                  )}

                  <div>
                    <Label>Content</Label>
                    <Textarea
                      value={newTemplate.content || ''}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your template content here..."
                      rows={12}
                    />
                    <div className="mt-2 text-xs text-muted-foreground">
                      <p className="font-medium mb-1">Available personalization variables:</p>
                      <div className="flex flex-wrap gap-2">
                        {['{{company_name}}', '{{contact_name}}', '{{job_title}}', '{{industry}}', '{{employees}}', '{{travel_budget}}'].map(variable => (
                          <Badge 
                            key={variable} 
                            variant="outline" 
                            className="text-xs cursor-pointer hover:bg-gray-100" 
                            onClick={() => insertPersonalizationVariable(variable)}
                          >
                            {variable}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Call-to-Action</Label>
                    <Input
                      value={newTemplate.cta || ''}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, cta: e.target.value }))}
                      placeholder="e.g., Schedule a Demo, Connect, Learn More"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowTemplateCreator(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateTemplate}
                    disabled={!newTemplate.name || !newTemplate.content}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Audience & Targeting</h3>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Target Leads ({targetLeads.length})
                  </CardTitle>
                  <CardDescription>Leads selected for this campaign</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {targetLeads.map((lead) => (
                      <div key={lead.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                            <Building2 className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{lead.company}</p>
                            <p className="text-sm text-muted-foreground">{lead.contact} • {lead.industry}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={lead.status === 'qualified' ? 'default' : 'secondary'}>
                            {lead.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">Score: {lead.score}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Label className="text-base font-medium">Audience Segmentation</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Building2 className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <p className="font-medium">Industries</p>
                    <p className="text-2xl font-bold">{new Set(targetLeads.map(l => l.industry)).size}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p className="font-medium">Company Sizes</p>
                    <p className="text-2xl font-bold">{new Set(targetLeads.map(l => l.employees > 1000 ? 'Large' : 'SMB')).size}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Globe className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <p className="font-medium">Locations</p>
                    <p className="text-2xl font-bold">{new Set(targetLeads.map(l => l.location?.split(',')[1]?.trim() || 'Unknown')).size}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <p className="font-medium">Avg Score</p>
                    <p className="text-2xl font-bold">{Math.round(targetLeads.reduce((sum, l) => sum + l.score, 0) / targetLeads.length)}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Content Creation</h3>
              
              <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="email" disabled={!campaignData.channels.includes('email')}>
                    <Mail className="h-4 w-4 mr-2" />
                    Email Content
                  </TabsTrigger>
                  <TabsTrigger value="whatsapp" disabled={!campaignData.channels.includes('whatsapp')}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    WhatsApp Content
                  </TabsTrigger>
                  <TabsTrigger value="linkedin" disabled={!campaignData.channels.includes('linkedin')}>
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn Content
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="email" className="space-y-4">
                  <div>
                    <Label>Email Subject Line</Label>
                    <Input
                      value={campaignData.content.email.subject}
                      onChange={(e) => setCampaignData(prev => ({
                        ...prev,
                        content: { ...prev.content, email: { ...prev.content.email, subject: e.target.value } }
                      }))}
                      placeholder="Enter compelling subject line..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Use {'{{'} company_name {'}}' }, {'{{'} contact_name {'}}' }, {'{{'} industry {'}}' } for personalization
                    </p>
                  </div>
                  
                  <div>
                    <Label>Email Body</Label>
                    <Textarea
                      value={campaignData.content.email.body}
                      onChange={(e) => setCampaignData(prev => ({
                        ...prev,
                        content: { ...prev.content, email: { ...prev.content.email, body: e.target.value } }
                      }))}
                      placeholder="Write your email content..."
                      rows={12}
                    />
                  </div>

                  <div>
                    <Label>Call-to-Action</Label>
                    <Input
                      value={campaignData.content.email.cta}
                      onChange={(e) => setCampaignData(prev => ({
                        ...prev,
                        content: { ...prev.content, email: { ...prev.content.email, cta: e.target.value } }
                      }))}
                      placeholder="e.g., Schedule a Demo, Get Quote, Learn More"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="whatsapp" className="space-y-4">
                  <div>
                    <Label>WhatsApp Message</Label>
                    <Textarea
                      value={campaignData.content.whatsapp.message}
                      onChange={(e) => setCampaignData(prev => ({
                        ...prev,
                        content: { ...prev.content, whatsapp: { ...prev.content.whatsapp, message: e.target.value } }
                      }))}
                      placeholder="Write your WhatsApp message..."
                      rows={8}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Keep it conversational and under 1000 characters for best results
                    </p>
                  </div>

                  <div>
                    <Label>Call-to-Action</Label>
                    <Input
                      value={campaignData.content.whatsapp.cta}
                      onChange={(e) => setCampaignData(prev => ({
                        ...prev,
                        content: { ...prev.content, whatsapp: { ...prev.content.whatsapp, cta: e.target.value } }
                      }))}
                      placeholder="e.g., Reply YES, Call me, Send details"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="linkedin" className="space-y-4">
                  <div>
                    <Label>LinkedIn Content Type</Label>
                    <Select 
                      value={campaignData.content.linkedin.type} 
                      onValueChange={(value) => setCampaignData(prev => ({
                        ...prev,
                        content: { ...prev.content, linkedin: { ...prev.content.linkedin, type: value } }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="message">Direct Message</SelectItem>
                        <SelectItem value="connection">Connection Request</SelectItem>
                        <SelectItem value="post">LinkedIn Post</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(campaignData.content.linkedin.type === 'message' || campaignData.content.linkedin.type === 'connection') && (
                    <div>
                      <Label>
                        {campaignData.content.linkedin.type === 'connection' ? 'Connection Note' : 'Message Subject'}
                      </Label>
                      <Input
                        value={campaignData.content.linkedin.subject}
                        onChange={(e) => setCampaignData(prev => ({
                          ...prev,
                          content: { ...prev.content, linkedin: { ...prev.content.linkedin, subject: e.target.value } }
                        }))}
                        placeholder={campaignData.content.linkedin.type === 'connection' ? 'Brief connection note...' : 'Message subject...'}
                      />
                    </div>
                  )}

                  <div>
                    <Label>
                      {campaignData.content.linkedin.type === 'post' ? 'Post Content' : 'Message Content'}
                    </Label>
                    <Textarea
                      value={campaignData.content.linkedin.content}
                      onChange={(e) => setCampaignData(prev => ({
                        ...prev,
                        content: { ...prev.content, linkedin: { ...prev.content.linkedin, content: e.target.value } }
                      }))}
                      placeholder={`Write your LinkedIn ${campaignData.content.linkedin.type} content...`}
                      rows={campaignData.content.linkedin.type === 'post' ? 10 : 8}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {campaignData.content.linkedin.type === 'connection' 
                        ? 'Keep connection requests under 300 characters' 
                        : campaignData.content.linkedin.type === 'post'
                          ? 'Use hashtags and @mentions to increase visibility'
                          : 'Professional tone works best for LinkedIn messages'
                      }
                    </p>
                  </div>

                  <div>
                    <Label>Call-to-Action</Label>
                    <Input
                      value={campaignData.content.linkedin.cta}
                      onChange={(e) => setCampaignData(prev => ({
                        ...prev,
                        content: { ...prev.content, linkedin: { ...prev.content.linkedin, cta: e.target.value } }
                      }))}
                      placeholder="e.g., Connect, Schedule Call, View Profile"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              {/* Content Preview */}
              <div className="mt-6">
                <Label className="text-base font-medium">Content Preview</Label>
                <p className="text-sm text-muted-foreground mb-4">See how your content will look to recipients</p>
                
                {targetLeads.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Preview for {targetLeads[0].company}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {campaignData.channels.includes('email') && (
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Email Preview:</h4>
                          <div className="p-3 border rounded bg-gray-50">
                            <p className="font-medium text-sm">Subject: {personalizeContent(campaignData.content.email.subject, targetLeads[0])}</p>
                            <div className="mt-2 text-sm whitespace-pre-wrap">
                              {personalizeContent(campaignData.content.email.body, targetLeads[0])}
                            </div>
                            {campaignData.content.email.cta && (
                              <div className="mt-3">
                                <Button size="sm">{campaignData.content.email.cta}</Button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {campaignData.channels.includes('whatsapp') && (
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">WhatsApp Preview:</h4>
                          <div className="p-3 border rounded bg-green-50">
                            <div className="text-sm whitespace-pre-wrap">
                              {personalizeContent(campaignData.content.whatsapp.message, targetLeads[0])}
                            </div>
                            {campaignData.content.whatsapp.cta && (
                              <div className="mt-2">
                                <Badge variant="outline">{campaignData.content.whatsapp.cta}</Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {campaignData.channels.includes('linkedin') && (
                        <div>
                          <h4 className="font-medium mb-2">LinkedIn Preview:</h4>
                          <div className="p-3 border rounded bg-blue-50">
                            {campaignData.content.linkedin.subject && (
                              <p className="font-medium text-sm mb-2">
                                {campaignData.content.linkedin.type === 'connection' ? 'Connection Note: ' : 'Subject: '}
                                {personalizeContent(campaignData.content.linkedin.subject, targetLeads[0])}
                              </p>
                            )}
                            <div className="text-sm whitespace-pre-wrap">
                              {personalizeContent(campaignData.content.linkedin.content, targetLeads[0])}
                            </div>
                            {campaignData.content.linkedin.cta && (
                              <div className="mt-3">
                                <Button size="sm" variant="outline" className="bg-blue-600 text-white hover:bg-blue-700">
                                  <Linkedin className="h-4 w-4 mr-2" />
                                  {campaignData.content.linkedin.cta}
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Schedule & Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Campaign Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={campaignData.schedule.startDate}
                        onChange={(e) => setCampaignData(prev => ({
                          ...prev,
                          schedule: { ...prev.schedule, startDate: e.target.value }
                        }))}
                      />
                    </div>
                    
                    <div>
                      <Label>Send Time</Label>
                      <Input
                        type="time"
                        value={campaignData.schedule.sendTime}
                        onChange={(e) => setCampaignData(prev => ({
                          ...prev,
                          schedule: { ...prev.schedule, sendTime: e.target.value }
                        }))}
                      />
                    </div>

                    <div>
                      <Label>Frequency</Label>
                      <Select 
                        value={campaignData.schedule.frequency} 
                        onValueChange={(value) => setCampaignData(prev => ({
                          ...prev,
                          schedule: { ...prev.schedule, frequency: value }
                        }))}
                      >
                        <SelectTrigger>
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
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Campaign Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Track Opens</Label>
                      <Switch
                        checked={campaignData.settings.trackOpens}
                        onCheckedChange={(checked) => setCampaignData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, trackOpens: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Track Clicks</Label>
                      <Switch
                        checked={campaignData.settings.trackClicks}
                        onCheckedChange={(checked) => setCampaignData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, trackClicks: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Auto Follow-up</Label>
                      <Switch
                        checked={campaignData.settings.autoFollowUp}
                        onCheckedChange={(checked) => setCampaignData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, autoFollowUp: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>A/B Testing</Label>
                      <Switch
                        checked={campaignData.settings.abTest}
                        onCheckedChange={(checked) => setCampaignData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, abTest: checked }
                        }))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Review & Launch</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Campaign Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Campaign Name:</span>
                        <span className="font-medium">{campaignData.name || 'Untitled Campaign'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Objective:</span>
                        <span className="font-medium capitalize">{campaignData.objective.replace('-', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Channels:</span>
                        <div className="flex gap-1">
                          {campaignData.channels.map(channel => (
                            <Badge key={channel} variant="outline">
                              {channel === 'email' && <Mail className="h-3 w-3 mr-1" />}
                              {channel === 'whatsapp' && <MessageSquare className="h-3 w-3 mr-1" />}
                              {channel === 'linkedin' && <Linkedin className="h-3 w-3 mr-1" />}
                              {channel}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Target Leads:</span>
                        <span className="font-medium">{targetLeads.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Start Date:</span>
                        <span className="font-medium">{campaignData.schedule.startDate}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        AI Predictions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">
                            {Math.round(targetLeads.length * 0.45)}
                          </p>
                          <p className="text-xs text-muted-foreground">Expected Opens</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">
                            {Math.round(targetLeads.length * 0.12)}
                          </p>
                          <p className="text-xs text-muted-foreground">Expected Clicks</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">
                            {Math.round(targetLeads.length * 0.08)}
                          </p>
                          <p className="text-xs text-muted-foreground">Expected Responses</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-orange-600">
                            {Math.round(targetLeads.length * 0.05)}
                          </p>
                          <p className="text-xs text-muted-foreground">Expected Conversions</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Final Content Review</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {campaignData.channels.includes('email') && (
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Email Campaign:</h4>
                          <div className="p-3 border rounded bg-gray-50 text-sm">
                            <p className="font-medium">Subject: {campaignData.content.email.subject}</p>
                            <div className="mt-2 whitespace-pre-wrap line-clamp-4">
                              {campaignData.content.email.body}
                            </div>
                            <div className="mt-2">
                              <Badge variant="outline">{campaignData.content.email.cta}</Badge>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {campaignData.channels.includes('whatsapp') && (
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">WhatsApp Campaign:</h4>
                          <div className="p-3 border rounded bg-green-50 text-sm">
                            <div className="whitespace-pre-wrap line-clamp-4">
                              {campaignData.content.whatsapp.message}
                            </div>
                            <div className="mt-2">
                              <Badge variant="outline">{campaignData.content.whatsapp.cta}</Badge>
                            </div>
                          </div>
                        </div>
                      )}

                      {campaignData.channels.includes('linkedin') && (
                        <div>
                          <h4 className="font-medium mb-2">LinkedIn Campaign:</h4>
                          <div className="p-3 border rounded bg-blue-50 text-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <Linkedin className="h-4 w-4" />
                              <span className="font-medium">{campaignData.content.linkedin.type}</span>
                            </div>
                            {campaignData.content.linkedin.subject && (
                              <p className="font-medium mb-2">
                                Subject: {campaignData.content.linkedin.subject}
                              </p>
                            )}
                            <div className="whitespace-pre-wrap line-clamp-4">
                              {campaignData.content.linkedin.content}
                            </div>
                            <div className="mt-2">
                              <Badge variant="outline">{campaignData.content.linkedin.cta}</Badge>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <div className="mt-6">
                    <Button 
                      onClick={handleLaunchCampaign}
                      disabled={isLaunching}
                      className="w-full"
                      size="lg"
                    >
                      {isLaunching ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Launching Campaign...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Launch Campaign
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (showMetrics && campaignLaunched) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Leads
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Campaign Metrics</h1>
              <p className="text-muted-foreground">{campaignData.name || 'Marketing Campaign'} - Live Dashboard</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Campaign Status */}
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Campaign launched successfully! Real-time metrics are updating automatically.
          </AlertDescription>
        </Alert>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Send className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{mockCampaignData.emailsSent.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Emails Sent</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">{mockCampaignData.delivered.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Delivered</p>
              <p className="text-xs text-green-600">
                {((mockCampaignData.delivered / mockCampaignData.emailsSent) * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <p className="text-2xl font-bold">{mockCampaignData.bounced}</p>
              <p className="text-sm text-muted-foreground">Bounced</p>
              <p className="text-xs text-red-600">
                {((mockCampaignData.bounced / mockCampaignData.emailsSent) * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Eye className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold">{mockCampaignData.opened}</p>
              <p className="text-sm text-muted-foreground">Opened</p>
              <p className="text-xs text-purple-600">
                {((mockCampaignData.opened / mockCampaignData.delivered) * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <MousePointer className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <p className="text-2xl font-bold">{mockCampaignData.clicked}</p>
              <p className="text-sm text-muted-foreground">Clicked</p>
              <p className="text-xs text-orange-600">
                {((mockCampaignData.clicked / mockCampaignData.opened) * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <UserMinus className="h-8 w-8 mx-auto mb-2 text-gray-500" />
              <p className="text-2xl font-bold">{mockCampaignData.unsubscribed}</p>
              <p className="text-sm text-muted-foreground">Unsubscribed</p>
              <p className="text-xs text-gray-600">
                {((mockCampaignData.unsubscribed / mockCampaignData.delivered) * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Channel-Specific Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* WhatsApp Metrics */}
          {campaignData.channels.includes('whatsapp') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  WhatsApp Campaign Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{mockCampaignData.whatsappDelivered}</p>
                    <p className="text-sm text-muted-foreground">Messages Delivered</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{mockCampaignData.whatsappRead}</p>
                    <p className="text-sm text-muted-foreground">Messages Read</p>
                    <p className="text-xs text-blue-600">
                      {((mockCampaignData.whatsappRead / mockCampaignData.whatsappDelivered) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{Math.round(mockCampaignData.whatsappRead * 0.4)}</p>
                    <p className="text-sm text-muted-foreground">Responses</p>
                    <p className="text-xs text-purple-600">
                      {((mockCampaignData.whatsappRead * 0.4) / mockCampaignData.whatsappRead * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{Math.round(mockCampaignData.whatsappRead * 0.25)}</p>
                    <p className="text-sm text-muted-foreground">Engagements</p>
                    <p className="text-xs text-orange-600">
                      {((mockCampaignData.whatsappRead * 0.25) / mockCampaignData.whatsappRead * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* LinkedIn Metrics */}
          {campaignData.channels.includes('linkedin') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Linkedin className="h-5 w-5" />
                  LinkedIn Campaign Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{mockCampaignData.linkedinConnections}</p>
                    <p className="text-sm text-muted-foreground">Connections Sent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{mockCampaignData.linkedinMessages}</p>
                    <p className="text-sm text-muted-foreground">Messages Sent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{mockCampaignData.linkedinPostViews.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Post Views</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{mockCampaignData.linkedinEngagements}</p>
                    <p className="text-sm text-muted-foreground">Engagements</p>
                    <p className="text-xs text-orange-600">
                      {((mockCampaignData.linkedinEngagements / mockCampaignData.linkedinPostViews) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Connection Acceptance Rate:</span>
                    <span className="font-medium">67%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Message Response Rate:</span>
                    <span className="font-medium">34%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Profile Views Generated:</span>
                    <span className="font-medium">145</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Conversion Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Lead Generation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Leads Generated</span>
                  <span className="text-2xl font-bold text-green-600">{mockCampaignData.leadsGenerated}</span>
                </div>
                <Progress value={(mockCampaignData.leadsGenerated / mockCampaignData.clicked) * 100} />
                <p className="text-sm text-muted-foreground">
                  {((mockCampaignData.leadsGenerated / mockCampaignData.clicked) * 100).toFixed(1)}% click to lead conversion
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Response Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Total Responses</span>
                  <span className="text-2xl font-bold text-blue-600">{mockCampaignData.responses}</span>
                </div>
                <Progress value={(mockCampaignData.responses / mockCampaignData.delivered) * 100} />
                <p className="text-sm text-muted-foreground">
                  {((mockCampaignData.responses / mockCampaignData.delivered) * 100).toFixed(1)}% overall response rate
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Sales Funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Follow-ups Set</span>
                  <span className="text-2xl font-bold text-purple-600">{mockCampaignData.followUpSet}</span>
                </div>
                <Progress value={(mockCampaignData.followUpSet / mockCampaignData.responses) * 100} />
                <p className="text-sm text-muted-foreground">
                  {((mockCampaignData.followUpSet / mockCampaignData.responses) * 100).toFixed(1)}% moved to sales funnel
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Campaign Performance Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                <p>Performance chart would be displayed here</p>
                <p className="text-sm">Showing opens, clicks, conversions, and channel performance over time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights & Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>High Performance Alert: </strong>Your LinkedIn outreach is performing 45% above industry average. Consider scaling similar professional content.
                </AlertDescription>
              </Alert>
              
              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertDescription>
                  <strong>Channel Optimization: </strong>LinkedIn connection requests have a 67% acceptance rate vs 12% email open rate. Prioritize LinkedIn for initial outreach.
                </AlertDescription>
              </Alert>
              
              <Alert>
                <Target className="h-4 w-4" />
                <AlertDescription>
                  <strong>Next Action: </strong>89 leads generated and 67 follow-ups scheduled. Set up multi-channel nurture sequence to maintain momentum across all channels.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button onClick={() => onNavigate('leads-list', { status: 'qualified' })}>
            <Users className="h-4 w-4 mr-2" />
            View Generated Leads
          </Button>
          <Button variant="outline" onClick={() => setShowMetrics(false)}>
            <Edit className="h-4 w-4 mr-2" />
            Create Follow-up Campaign
          </Button>
          <Button variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            Duplicate Campaign
          </Button>
          <Button variant="outline">
            <Linkedin className="h-4 w-4 mr-2" />
            Export LinkedIn Leads
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Leads
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Marketing Campaign</h1>
            <p className="text-muted-foreground">Create and launch targeted multi-channel marketing campaigns</p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Campaign Creation Progress</h2>
            <span className="text-sm text-muted-foreground">Step {currentStep} of {steps.length}</span>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep === step.id 
                    ? 'bg-primary text-primary-foreground' 
                    : currentStep > step.id 
                      ? 'bg-green-500 text-white' 
                      : 'bg-muted text-muted-foreground'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-16 mx-2 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h3 className="font-medium">{steps[currentStep - 1].name}</h3>
            <p className="text-sm text-muted-foreground">{steps[currentStep - 1].description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          {currentStep < steps.length && (
            <Button 
              onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
              disabled={
                (currentStep === 1 && !campaignData.name) ||
                (currentStep === 3 && campaignData.channels.includes('email') && !campaignData.content.email.subject)
              }
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}