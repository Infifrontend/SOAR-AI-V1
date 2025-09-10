import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { 
  ArrowLeft,
  Bell,
  Mail,
  Calendar,
  Clock,
  Send,
  Eye,
  Copy,
  Settings,
  Users,
  Target,
  Zap,
  CheckCircle,
  AlertCircle,
  Building2,
  Repeat
} from 'lucide-react';

interface NotificationSystemProps {
  corporateData: any;
  onBack: () => void;
}

const emailTemplates = [
  {
    id: 1,
    name: 'Partnership Invitation',
    category: 'Business Development',
    subject: 'Exclusive Partnership Opportunity - [AIRLINE_NAME] & [CORPORATE_NAME]',
    body: `Dear [CORPORATE_NAME] Travel Team,

I hope this message finds you well.

We at [AIRLINE_NAME] have been impressed by [CORPORATE_NAME]'s commitment to excellence and global reach. Given your substantial travel requirements ([TRAVEL_VOLUME] annually), we would like to explore a strategic partnership that could deliver significant value to your organization.

What we can offer:
• Preferential rates for business travel
• Dedicated account management
• Priority booking and flexible change policies
• Corporate sustainability reporting
• Seamless integration with your expense management systems

We believe a partnership between our organizations could result in substantial cost savings while enhancing your travel experience.

Would you be available for a brief call next week to discuss this opportunity?

Best regards,
[SENDER_NAME]
Corporate Partnerships Team
[AIRLINE_NAME]`,
    variables: ['AIRLINE_NAME', 'CORPORATE_NAME', 'TRAVEL_VOLUME', 'SENDER_NAME'],
    frequency: 'One-time',
    priority: 'High'
  },
  {
    id: 2,
    name: 'Quarterly Travel Report',
    category: 'Relationship Management',
    subject: 'Q[QUARTER] Travel Performance Report - [CORPORATE_NAME]',
    body: `Dear [CORPORATE_NAME] Team,

We're pleased to share your quarterly travel performance report and insights.

Travel Summary for Q[QUARTER]:
• Total flights: [FLIGHT_COUNT]
• Total savings: $[SAVINGS_AMOUNT]
• On-time performance: [ON_TIME_RATE]%
• Carbon offset: [CARBON_OFFSET] kg CO2

Key Highlights:
• [HIGHLIGHT_1]
• [HIGHLIGHT_2]
• [HIGHLIGHT_3]

Upcoming Opportunities:
We've identified several opportunities to further optimize your travel program in the next quarter.

Let's schedule a review meeting to discuss these insights and plan for the upcoming quarter.

Best regards,
[ACCOUNT_MANAGER]
Account Management Team
[AIRLINE_NAME]`,
    variables: ['QUARTER', 'CORPORATE_NAME', 'FLIGHT_COUNT', 'SAVINGS_AMOUNT', 'ON_TIME_RATE', 'CARBON_OFFSET', 'HIGHLIGHT_1', 'HIGHLIGHT_2', 'HIGHLIGHT_3', 'ACCOUNT_MANAGER', 'AIRLINE_NAME'],
    frequency: 'Quarterly',
    priority: 'Medium'
  },
  {
    id: 3,
    name: 'New Route Announcement',
    category: 'Product Updates',
    subject: 'New Route Alert: [ROUTE] - Perfect for [CORPORATE_NAME]',
    body: `Dear [CORPORATE_NAME] Travel Team,

Great news! We're excited to announce a new route that aligns perfectly with your travel patterns.

New Route Details:
• Route: [ROUTE]
• Launch Date: [LAUNCH_DATE]
• Frequency: [FREQUENCY] flights per week
• Aircraft: [AIRCRAFT_TYPE]

Based on your travel data, this route could benefit approximately [AFFECTED_TRAVELERS] of your travelers and potentially save $[ESTIMATED_SAVINGS] annually.

Special Launch Offer:
For the first 30 days, we're offering a 15% discount on this route for all [CORPORATE_NAME] bookings.

To take advantage of this offer or to discuss how this route fits into your travel strategy, please contact your dedicated account manager.

Best regards,
[ROUTE_MANAGER]
Network Planning Team
[AIRLINE_NAME]`,
    variables: ['ROUTE', 'CORPORATE_NAME', 'LAUNCH_DATE', 'FREQUENCY', 'AIRCRAFT_TYPE', 'AFFECTED_TRAVELERS', 'ESTIMATED_SAVINGS', 'ROUTE_MANAGER', 'AIRLINE_NAME'],
    frequency: 'As needed',
    priority: 'Medium'
  },
  {
    id: 4,
    name: 'Contract Renewal Reminder',
    category: 'Contract Management',
    subject: 'Contract Renewal - 90 Days Notice | [CORPORATE_NAME]',
    body: `Dear [CORPORATE_NAME] Team,

This is a friendly reminder that your corporate travel agreement is approaching its renewal date.

Contract Details:
• Agreement ID: [CONTRACT_ID]
• Current Term: [CURRENT_TERM]
• Renewal Date: [RENEWAL_DATE]
• Notice Period: 90 days (as per agreement)

Your Partnership Success:
Over the past year, our partnership has delivered:
• Total flights: [TOTAL_FLIGHTS]
• Cost savings: $[TOTAL_SAVINGS]
• Average on-time performance: [PERFORMANCE]%
• Traveler satisfaction: [SATISFACTION]/5

We value our partnership and would like to discuss renewal options that continue to deliver value to [CORPORATE_NAME].

Available for the new term:
• Enhanced service levels
• Improved pricing structure
• New technology integrations
• Expanded route network benefits

Let's schedule a renewal discussion meeting within the next 30 days.

Best regards,
[CONTRACT_MANAGER]
Contract Management Team
[AIRLINE_NAME]`,
    variables: ['CORPORATE_NAME', 'CONTRACT_ID', 'CURRENT_TERM', 'RENEWAL_DATE', 'TOTAL_FLIGHTS', 'TOTAL_SAVINGS', 'PERFORMANCE', 'SATISFACTION', 'CONTRACT_MANAGER', 'AIRLINE_NAME'],
    frequency: 'Annually',
    priority: 'High'
  },
  {
    id: 5,
    name: 'Travel Advisory Alert',
    category: 'Service Updates',
    subject: 'Travel Advisory: [DESTINATION] - [CORPORATE_NAME] Travelers',
    body: `Dear [CORPORATE_NAME] Travel Team,

We want to ensure your travelers are informed about current conditions affecting travel to [DESTINATION].

Advisory Details:
• Affected Destination: [DESTINATION]
• Type: [ADVISORY_TYPE]
• Effective: [EFFECTIVE_DATE]
• Duration: [DURATION]

Impact on Your Travel:
• Affected routes: [AFFECTED_ROUTES]
• Recommended actions: [RECOMMENDATIONS]
• Alternative options: [ALTERNATIVES]

We're monitoring the situation closely and will update you as conditions change. Our customer service team is available 24/7 for any rebooking assistance.

Current [CORPORATE_NAME] bookings affected: [AFFECTED_BOOKINGS]

For immediate assistance, your travelers can contact our dedicated corporate hotline or reach out to their account manager.

Stay safe and travel smart.

Best regards,
[OPERATIONS_MANAGER]
Operations Team
[AIRLINE_NAME]`,
    variables: ['CORPORATE_NAME', 'DESTINATION', 'ADVISORY_TYPE', 'EFFECTIVE_DATE', 'DURATION', 'AFFECTED_ROUTES', 'RECOMMENDATIONS', 'ALTERNATIVES', 'AFFECTED_BOOKINGS', 'OPERATIONS_MANAGER', 'AIRLINE_NAME'],
    frequency: 'As needed',
    priority: 'Urgent'
  }
];

export function NotificationSystem({ corporateData, onBack }: NotificationSystemProps) {
  const [activeStep, setActiveStep] = useState('select-template');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [emailData, setEmailData] = useState({
    to: corporateData?.email || '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
    priority: 'medium'
  });
  const [autoSettings, setAutoSettings] = useState({
    enabled: false,
    frequency: 'monthly',
    startDate: '',
    conditions: [],
    recipients: [corporateData?.email || '']
  });
  const [variables, setVariables] = useState({});

  // Helper function to safely replace template variables
  const replaceTemplateVariables = (text, variableMap) => {
    if (!text || typeof text !== 'string') return text;
    
    let result = text;
    Object.entries(variableMap).forEach(([key, value]) => {
      const placeholder = `[${key}]`;
      result = result.split(placeholder).join(String(value || ''));
    });
    return result;
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    
    // Create default variable values based on corporate data
    const defaultVariables = {};
    
    // Set default values for all possible variables
    const variableDefaults = {
      AIRLINE_NAME: 'SOAR Airlines',
      CORPORATE_NAME: corporateData?.name || 'Corporate Client',
      TRAVEL_VOLUME: corporateData?.annualTravelVolume || '5,000 trips',
      SENDER_NAME: '[Your Name]',
      QUARTER: 'Q1',
      FLIGHT_COUNT: '450',
      SAVINGS_AMOUNT: '125,000',
      ON_TIME_RATE: '94',
      CARBON_OFFSET: '2,450',
      HIGHLIGHT_1: 'Achieved 94% on-time performance',
      HIGHLIGHT_2: 'Reduced average booking time by 25%',
      HIGHLIGHT_3: 'Carbon footprint reduced by 15%',
      ACCOUNT_MANAGER: '[Account Manager Name]',
      ROUTE: 'New York to London',
      LAUNCH_DATE: '2024-09-01',
      FREQUENCY: '7',
      AIRCRAFT_TYPE: 'Boeing 787-9',
      AFFECTED_TRAVELERS: '150',
      ESTIMATED_SAVINGS: '75,000',
      ROUTE_MANAGER: '[Route Manager Name]',
      CONTRACT_ID: `CTR-${corporateData?.id || '001'}`,
      CURRENT_TERM: '24 months',
      RENEWAL_DATE: '2024-12-31',
      TOTAL_FLIGHTS: '1,200',
      TOTAL_SAVINGS: '350,000',
      PERFORMANCE: '96',
      SATISFACTION: '4.5',
      CONTRACT_MANAGER: '[Contract Manager Name]',
      DESTINATION: 'Europe',
      ADVISORY_TYPE: 'Weather Advisory',
      EFFECTIVE_DATE: '2024-07-15',
      DURATION: '48 hours',
      AFFECTED_ROUTES: 'All European destinations',
      RECOMMENDATIONS: 'Allow extra travel time',
      ALTERNATIVES: 'Alternative routing via Frankfurt',
      AFFECTED_BOOKINGS: '12',
      OPERATIONS_MANAGER: '[Operations Manager Name]'
    };

    // Only include variables that are used in the selected template
    template.variables.forEach(variable => {
      defaultVariables[variable] = variableDefaults[variable] || `[${variable}]`;
    });
    
    setVariables(defaultVariables);
    
    // Populate email with template data
    const populatedSubject = replaceTemplateVariables(template.subject, defaultVariables);
    const populatedBody = replaceTemplateVariables(template.body, defaultVariables);
    
    setEmailData({
      ...emailData,
      subject: populatedSubject,
      body: populatedBody,
      priority: template.priority.toLowerCase()
    });
    
    setActiveStep('configure');
  };

  const handleVariableChange = (key, value) => {
    const updatedVariables = { ...variables, [key]: value };
    setVariables(updatedVariables);
    
    // Update email with new variables
    if (selectedTemplate) {
      const populatedSubject = replaceTemplateVariables(selectedTemplate.subject, updatedVariables);
      const populatedBody = replaceTemplateVariables(selectedTemplate.body, updatedVariables);
      
      setEmailData({
        ...emailData,
        subject: populatedSubject,
        body: populatedBody
      });
    }
  };

  const handleSendEmail = () => {
    console.log('Sending email:', emailData);
    console.log('Auto settings:', autoSettings);
    alert('Email sent successfully! ' + (autoSettings.enabled ? 'Auto-notifications have been configured.' : ''));
    onBack();
  };

  const renderTemplateSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Choose Email Template</h3>
        <p className="text-muted-foreground">Select a template for communicating with {corporateData?.name}</p>
      </div>

      <div className="grid gap-6">
        {emailTemplates.map((template) => (
          <Card 
            key={template.id} 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedTemplate?.id === template.id ? 'ring-2 ring-primary border-primary' : ''
            }`}
            onClick={() => handleTemplateSelect(template)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold">{template.name}</h4>
                    <Badge variant="outline">{template.category}</Badge>
                    <Badge variant={template.priority === 'High' ? 'destructive' : template.priority === 'Urgent' ? 'destructive' : 'default'}>
                      {template.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    <strong>Subject:</strong> {template.subject.replace(/\[[^\]]+\]/g, '[Dynamic]')}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {template.body.substring(0, 200)}...
                  </p>
                  
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1">
                      <Repeat className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{template.frequency}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{template.variables.length} variables</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button size="sm" onClick={() => handleTemplateSelect(template)}>
                    Use Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderConfiguration = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Configure Email & Notifications</h3>
          <p className="text-muted-foreground">Template: {selectedTemplate?.name}</p>
        </div>
        <Button variant="outline" onClick={() => setActiveStep('select-template')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Templates
        </Button>
      </div>

      <Tabs defaultValue="email-content" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="email-content">Email Content</TabsTrigger>
          <TabsTrigger value="variables">Variables</TabsTrigger>
          <TabsTrigger value="recipients">Recipients</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="email-content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="to">To</Label>
                  <Input
                    id="to"
                    value={emailData.to}
                    onChange={(e) => setEmailData({...emailData, to: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={emailData.priority} onValueChange={(value) => setEmailData({...emailData, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cc">CC (Optional)</Label>
                  <Input
                    id="cc"
                    value={emailData.cc}
                    onChange={(e) => setEmailData({...emailData, cc: e.target.value})}
                    placeholder="additional@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="bcc">BCC (Optional)</Label>
                  <Input
                    id="bcc"
                    value={emailData.bcc}
                    onChange={(e) => setEmailData({...emailData, bcc: e.target.value})}
                    placeholder="manager@airline.com"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="body">Message Body</Label>
                <Textarea
                  id="body"
                  value={emailData.body}
                  onChange={(e) => setEmailData({...emailData, body: e.target.value})}
                  rows={15}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variables" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Template Variables</CardTitle>
              <CardDescription>Customize the dynamic content in your email template</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedTemplate?.variables.map((variable) => (
                  <div key={variable}>
                    <Label htmlFor={variable}>{variable.replace(/_/g, ' ')}</Label>
                    <Input
                      id={variable}
                      value={variables[variable] || ''}
                      onChange={(e) => handleVariableChange(variable, e.target.value)}
                      placeholder={`Enter ${variable.replace(/_/g, ' ').toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recipients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recipient Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Building2 className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-semibold">{corporateData?.name}</p>
                    <p className="text-sm text-muted-foreground">Primary Contact</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{corporateData?.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Travel Managers</p>
                    <p className="font-medium">{corporateData?.travelManagers} contacts</p>
                  </div>
                </div>
              </div>
              
              <Alert>
                <Users className="h-4 w-4" />
                <AlertDescription>
                  Additional recipients can be added in the CC/BCC fields in the Email Content tab.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Auto-Notification Settings</CardTitle>
              <CardDescription>Set up automated email notifications for this corporate client</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="autoEnabled" 
                  checked={autoSettings.enabled}
                  onCheckedChange={(checked) => setAutoSettings({...autoSettings, enabled: !!checked})}
                />
                <Label htmlFor="autoEnabled">Enable automatic notifications</Label>
              </div>

              {autoSettings.enabled && (
                <div className="space-y-4 pl-6 border-l-2 border-blue-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="frequency">Frequency</Label>
                      <Select value={autoSettings.frequency} onValueChange={(value) => setAutoSettings({...autoSettings, frequency: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="annually">Annually</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={autoSettings.startDate}
                        onChange={(e) => setAutoSettings({...autoSettings, startDate: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Trigger Conditions</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="condition1" />
                        <Label htmlFor="condition1" className="text-sm">Contract renewal approaching (90 days)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="condition2" />
                        <Label htmlFor="condition2" className="text-sm">New route matching travel patterns</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="condition3" />
                        <Label htmlFor="condition3" className="text-sm">Monthly performance report</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="condition4" />
                        <Label htmlFor="condition4" className="text-sm">Travel advisory alerts</Label>
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <Zap className="h-4 w-4" />
                    <AlertDescription>
                      Automated notifications will be sent based on the selected frequency and conditions. You can modify or disable them at any time.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Save Draft</Button>
        <Button variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          Preview Email
        </Button>
        <Button onClick={handleSendEmail}>
          <Send className="h-4 w-4 mr-2" />
          Send Email
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Corporate Search
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Notification System</h1>
            <div className="flex items-center gap-2 mt-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Managing notifications for</span>
              <Badge variant="outline">{corporateData?.name}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-2">
          {[
            { id: 'select-template', label: 'Template', icon: Mail },
            { id: 'configure', label: 'Configure', icon: Settings },
            { id: 'send', label: 'Send', icon: Send }
          ].map((step, index, array) => {
            const isActive = activeStep === step.id;
            const isCompleted = ['select-template'].indexOf(activeStep) > ['select-template'].indexOf(step.id);
            const StepIcon = step.icon;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive ? 'bg-primary text-primary-foreground' : 
                  isCompleted ? 'bg-green-100 text-green-700' : 
                  'bg-muted text-muted-foreground'
                }`}>
                  <StepIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">{step.label}</span>
                </div>
                {index < array.length - 1 && (
                  <div className="w-8 h-px bg-border mx-2" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      {activeStep === 'select-template' && renderTemplateSelection()}
      {activeStep === 'configure' && renderConfiguration()}
    </div>
  );
}