import { useState } from 'react';
import { useContractApi } from '../hooks/api/useContractApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { 
  FileText, 
  Plus, 
  Copy,
  Eye,
  Download,
  Send,
  PenTool,
  Calendar,
  DollarSign,
  Users,
  ArrowLeft,
  CheckCircle,
  Clock,
  Target,
  Zap,
  Mail,
  Signature,
  FileCheck,
  AlertCircle,
  Lightbulb,
  Building2,
  Settings
} from 'lucide-react';

interface ContractCreationProps {
  vendorData?: {
    id: number;
    name: string;
    type: string;
    location: string;
    email: string;
    phone: string;
  };
  onNavigate?: (section: string, filters?: any) => void;
  onBack?: () => void;
}

const contractTemplates = [
  {
    id: 1,
    name: 'Master Service Agreement',
    category: 'Comprehensive',
    description: 'Full-service agreement covering all aspects of vendor relationship including services, terms, SLAs, and payment structures',
    duration: '12-36 months',
    complexity: 'High',
    clauses: ['Service Level Agreement', 'Payment Terms', 'Liability & Insurance', 'Termination Clauses', 'Performance Metrics'],
    estimatedTime: '2-3 weeks',
    recommendedFor: ['Long-term partnerships', 'High-value contracts', 'Complex service requirements']
  },
  {
    id: 2,
    name: 'Service Level Agreement',
    category: 'Performance',
    description: 'Focused on service quality metrics, KPIs, penalties, and performance standards with clear measurement criteria',
    duration: '6-24 months',
    complexity: 'Medium',
    clauses: ['Performance KPIs', 'Response Times', 'Quality Standards', 'Penalty Structures', 'Reporting Requirements'],
    estimatedTime: '1-2 weeks',
    recommendedFor: ['Service quality focus', 'Performance-based partnerships', 'Measurable deliverables']
  },
  {
    id: 3,
    name: 'Strategic Partnership Agreement',
    category: 'Strategic',
    description: 'Long-term strategic alliance with revenue sharing, joint marketing, and co-development opportunities',
    duration: '24-60 months',
    complexity: 'High',
    clauses: ['Revenue Sharing', 'Joint Marketing', 'Exclusivity Terms', 'IP Rights', 'Growth Incentives'],
    estimatedTime: '3-4 weeks',
    recommendedFor: ['Strategic alliances', 'Market expansion', 'Co-development projects']
  },
  {
    id: 4,
    name: 'Quick Start Agreement',
    category: 'Standard',
    description: 'Simplified contract for immediate deployment with standard terms and accelerated approval process',
    duration: '3-12 months',
    complexity: 'Low',
    clauses: ['Basic Service Terms', 'Standard Payment', 'Limited Liability', 'Standard Termination', 'Basic SLA'],
    estimatedTime: '3-5 days',
    recommendedFor: ['Urgent requirements', 'Pilot programs', 'Small-scale projects']
  },
  {
    id: 5,
    name: 'Volume-Based Agreement',
    category: 'Volume',
    description: 'Contract with tiered pricing based on volume commitments, with discounts and incentive structures',
    duration: '12-24 months',
    complexity: 'Medium',
    clauses: ['Volume Tiers', 'Discount Structures', 'Commitment Levels', 'Performance Bonuses', 'Volume Penalties'],
    estimatedTime: '1-2 weeks',
    recommendedFor: ['High-volume partnerships', 'Cost optimization', 'Bulk purchasing']
  }
];

export function ContractCreation({ vendorData, onNavigate, onBack }: ContractCreationProps) {
  const [activeStep, setActiveStep] = useState('choose-method');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const { createContract } = useContractApi();
  const [contractData, setContractData] = useState({
    type: '',
    vendor: vendorData?.name || '',
    vendorEmail: vendorData?.email || '',
    client: '',
    value: '',
    startDate: '',
    endDate: '',
    terms: '',
    slaRequirements: '',
    paymentTerms: 'net-30',
    autoRenewal: false,
    performanceBonus: false,
    exclusivity: false,
    customClauses: ''
  });

  const [emailSettings, setEmailSettings] = useState({
    subject: `Contract Proposal - ${vendorData?.name || 'Partnership Agreement'}`,
    body: `Dear ${vendorData?.name || 'Partner'} Team,

We are pleased to propose a partnership agreement based on our recent discussions and evaluation process.

Please find the contract proposal attached for your review. We believe this partnership will be mutually beneficial and look forward to working together.

Key highlights of this proposal:
• Service excellence commitment
• Competitive terms and pricing
• Clear performance metrics
• Streamlined communication channels

We would appreciate your feedback and are available to discuss any questions or modifications you may have.

Best regards,
SOAR-AI Contract Management Team`,
    ccRecipients: '',
    priority: 'normal-priority'
  });

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setContractData({
      ...contractData,
      type: template.name
    });
    setActiveStep('configure');
  };

  const handleCreateFromScratch = () => {
    setSelectedTemplate(null);
    setActiveStep('configure');
  };

  const handleGenerateContract = async () => {
    setIsCreating(true);
    try {
      const result = await createContract({
        ...contractData,
        contractType: selectedTemplate?.name || 'Custom Contract'
      });

      if (result.success) {
        console.log('Contract created successfully:', result.data);
        setActiveStep('review');
      } else {
        alert(`Failed to create contract: ${result.error}`);
      }
    } catch (error) {
      console.error('Error creating contract:', error);
      alert('Failed to create contract. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSendContract = () => {
    console.log('Sending contract to vendor:', {
      vendor: vendorData,
      contract: contractData,
      email: emailSettings
    });
    alert('Contract sent successfully! The vendor will receive an email with the contract proposal and digital signature instructions.');
    if (onNavigate) {
      onNavigate('contracts', { status: 'Pending Signature' });
    }
  };

  const renderChooseMethod = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Choose Contract Creation Method</h3>
        <p className="text-muted-foreground">Select how you'd like to create your contract with {vendorData?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-xl font-semibold mb-3">Use Template</h4>
            <p className="text-muted-foreground mb-6">Choose from pre-approved contract templates with industry best practices</p>
            <div className="space-y-2 text-sm text-left">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Pre-approved legal terms</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Faster approval process</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Reduced legal review time</span>
              </div>
            </div>
            <Button className="w-full mt-6" onClick={() => setActiveStep('templates')}>
              Browse Templates
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center">
              <Plus className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-xl font-semibold mb-3">Create from Scratch</h4>
            <p className="text-muted-foreground mb-6">Build a custom contract tailored to your specific requirements</p>
            <div className="space-y-2 text-sm text-left">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Complete customization</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Unique terms and conditions</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span>Extended legal review required</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-6" onClick={handleCreateFromScratch}>
              Start Custom Contract
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTemplateSelection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Choose Contract Template</h3>
          <p className="text-muted-foreground">Select the template that best fits your partnership needs</p>
        </div>
        <Button variant="outline" onClick={() => setActiveStep('choose-method')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="grid gap-6">
        {contractTemplates.map((template) => (
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
                    <Badge variant={template.complexity === 'High' ? 'destructive' : template.complexity === 'Medium' ? 'secondary' : 'default'}>
                      {template.complexity}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{template.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">DURATION</Label>
                      <p className="font-medium">{template.duration}</p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">ESTIMATED TIME</Label>
                      <p className="font-medium">{template.estimatedTime}</p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">COMPLEXITY</Label>
                      <p className="font-medium">{template.complexity}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <Label className="text-xs font-medium text-muted-foreground">KEY CLAUSES</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.clauses.map((clause, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {clause}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">RECOMMENDED FOR</Label>
                    <ul className="mt-1 space-y-1">
                      {template.recommendedFor.map((item, index) => (
                        <li key={index} className="text-sm flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
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
          <h3 className="text-2xl font-bold">Configure Contract Details</h3>
          <p className="text-muted-foreground">
            {selectedTemplate ? `Customizing: ${selectedTemplate.name}` : 'Creating custom contract'}
          </p>
        </div>
        <Button variant="outline" onClick={() => setActiveStep(selectedTemplate ? 'templates' : 'choose-method')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="terms">Terms & SLA</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contract Parties & Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vendor">Vendor</Label>
                  <Input
                    id="vendor"
                    value={contractData.vendor}
                    onChange={(e) => setContractData({...contractData, vendor: e.target.value})}
                    placeholder="Vendor company name"
                    disabled={!!vendorData}
                  />
                </div>
                <div>
                  <Label htmlFor="vendorEmail">Vendor Email</Label>
                  <Input
                    id="vendorEmail"
                    type="email"
                    value={contractData.vendorEmail}
                    onChange={(e) => setContractData({...contractData, vendorEmail: e.target.value})}
                    placeholder="vendor@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="client">Client Department</Label>
                  <Select value={contractData.client} onValueChange={(value) => setContractData({...contractData, client: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Airline Operations">Airline Operations</SelectItem>
                      <SelectItem value="Business Travel Dept">Business Travel Department</SelectItem>
                      <SelectItem value="Executive Services">Executive Services</SelectItem>
                      <SelectItem value="Regional Operations">Regional Operations</SelectItem>
                      <SelectItem value="Procurement">Procurement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="value">Contract Value ($)</Label>
                  <Input
                    id="value"
                    type="number"
                    value={contractData.value}
                    onChange={(e) => setContractData({...contractData, value: e.target.value})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={contractData.startDate}
                    onChange={(e) => setContractData({...contractData, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={contractData.endDate}
                    onChange={(e) => setContractData({...contractData, endDate: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="terms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Level Agreement & Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="slaRequirements">SLA Requirements</Label>
                <Textarea
                  id="slaRequirements"
                  value={contractData.slaRequirements}
                  onChange={(e) => setContractData({...contractData, slaRequirements: e.target.value})}
                  placeholder="Define response times, uptime requirements, quality standards..."
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="terms">General Terms & Conditions</Label>
                <Textarea
                  id="terms"
                  value={contractData.terms}
                  onChange={(e) => setContractData({...contractData, terms: e.target.value})}
                  placeholder="Enter specific terms, conditions, and requirements..."
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Terms & Structure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="paymentTerms">Payment Terms (Days)</Label>
                <Select value={contractData.paymentTerms} onValueChange={(value) => setContractData({...contractData, paymentTerms: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="net-15">Net 15 Days</SelectItem>
                    <SelectItem value="net-30">Net 30 Days</SelectItem>
                    <SelectItem value="net-45">Net 45 Days</SelectItem>
                    <SelectItem value="net-60">Net 60 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="autoRenewal" 
                    checked={contractData.autoRenewal}
                    onCheckedChange={(checked) => setContractData({...contractData, autoRenewal: !!checked})}
                  />
                  <Label htmlFor="autoRenewal">Enable Auto-Renewal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="performanceBonus" 
                    checked={contractData.performanceBonus}
                    onCheckedChange={(checked) => setContractData({...contractData, performanceBonus: !!checked})}
                  />
                  <Label htmlFor="performanceBonus">Include Performance Bonus Clauses</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="exclusivity" 
                    checked={contractData.exclusivity}
                    onCheckedChange={(checked) => setContractData({...contractData, exclusivity: !!checked})}
                  />
                  <Label htmlFor="exclusivity">Exclusivity Agreement</Label>
                </div>
              </div>
              <div>
                <Label htmlFor="customClauses">Custom Clauses</Label>
                <Textarea
                  id="customClauses"
                  value={contractData.customClauses}
                  onChange={(e) => setContractData({...contractData, customClauses: e.target.value})}
                  placeholder="Add any custom clauses or special requirements..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Save as Draft</Button>
        <Button onClick={handleGenerateContract} disabled={isCreating}>
          <FileCheck className="h-4 w-4 mr-2" />
          {isCreating ? 'Generating...' : 'Generate Contract'}
        </Button>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Review & Send Contract</h3>
          <p className="text-muted-foreground">Review contract details and send to vendor</p>
        </div>
        <Button variant="outline" onClick={() => setActiveStep('configure')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Contract Preview</CardTitle>
              <CardDescription>Generated contract ready for review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
                <div className="text-center border-b pb-4">
                  <h2 className="text-xl font-bold">
                    {selectedTemplate?.name || 'Custom Contract Agreement'}
                  </h2>
                  <p className="text-muted-foreground">Between SOAR-AI Airlines and {contractData.vendor}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Vendor:</strong> {contractData.vendor}
                  </div>
                  <div>
                    <strong>Client:</strong> {contractData.client}
                  </div>
                  <div>
                    <strong>Contract Value:</strong> ${parseInt(contractData.value || '0').toLocaleString()}
                  </div>
                  <div>
                    <strong>Duration:</strong> {contractData.startDate} to {contractData.endDate}
                  </div>
                  <div>
                    <strong>Payment Terms:</strong> Net {contractData.paymentTerms} Days
                  </div>
                  <div>
                    <strong>Auto-Renewal:</strong> {contractData.autoRenewal ? 'Yes' : 'No'}
                  </div>
                </div>

                {contractData.slaRequirements && (
                  <div className="mt-4">
                    <strong className="block mb-2">SLA Requirements:</strong>
                    <p className="text-sm bg-white p-3 rounded border">{contractData.slaRequirements}</p>
                  </div>
                )}

                {contractData.terms && (
                  <div className="mt-4">
                    <strong className="block mb-2">Terms & Conditions:</strong>
                    <p className="text-sm bg-white p-3 rounded border">{contractData.terms}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Full Preview
                </Button>
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Send to Vendor</CardTitle>
              <CardDescription>Configure email settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="emailSubject">Email Subject</Label>
                <Input
                  id="emailSubject"
                  value={emailSettings.subject}
                  onChange={(e) => setEmailSettings({...emailSettings, subject: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="emailBody">Email Body</Label>
                <Textarea
                  id="emailBody"
                  value={emailSettings.body}
                  onChange={(e) => setEmailSettings({...emailSettings, body: e.target.value})}
                  rows={8}
                />
              </div>
              <div>
                <Label htmlFor="ccRecipients">CC Recipients (Optional)</Label>
                <Input
                  id="ccRecipients"
                  value={emailSettings.ccRecipients}
                  onChange={(e) => setEmailSettings({...emailSettings, ccRecipients: e.target.value})}
                  placeholder="additional@email.com"
                />
              </div>
              <div>
                <Label>Priority</Label>
                <Select value={emailSettings.priority} onValueChange={(value) => setEmailSettings({...emailSettings, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low-priority">Low</SelectItem>
                    <SelectItem value="normal-priority">Normal</SelectItem>
                    <SelectItem value="high-priority">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Alert>
                <Signature className="h-4 w-4" />
                <AlertDescription>
                  The vendor will receive signing instructions and can digitally sign the contract online.
                </AlertDescription>
              </Alert>

              <Button className="w-full" onClick={handleSendContract}>
                <Send className="h-4 w-4 mr-2" />
                Send Contract for Signature
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Vendor Search
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold">Contract Creation</h1>
            {vendorData && (
              <div className="flex items-center gap-2 mt-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Creating contract with</span>
                <Badge variant="outline">{vendorData.name}</Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-2">
          {[
            { id: 'choose-method', label: 'Method', icon: Target },
            { id: 'templates', label: 'Template', icon: FileText },
            { id: 'configure', label: 'Configure', icon: Settings },
            { id: 'review', label: 'Review', icon: CheckCircle }
          ].map((step, index, array) => {
            const isActive = activeStep === step.id;
            const isCompleted = ['choose-method', 'templates', 'configure'].indexOf(activeStep) > ['choose-method', 'templates', 'configure'].indexOf(step.id);
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
      {activeStep === 'choose-method' && renderChooseMethod()}
      {activeStep === 'templates' && renderTemplateSelection()}
      {activeStep === 'configure' && renderConfiguration()}
      {activeStep === 'review' && renderReview()}
    </div>
  );
}