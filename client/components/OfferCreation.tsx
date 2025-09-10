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
  Gift,
  Sparkles,
  Target,
  DollarSign,
  Calendar,
  Users,
  Plane,
  Star,
  Send,
  Eye,
  Copy,
  Settings,
  Brain,
  TrendingUp,
  CheckCircle,
  Building2,
  Mail,
  Percent,
  Clock,
  Globe,
  Award,
  Zap,
  Plus,
  ArrowRight
} from 'lucide-react';

interface OfferCreationProps {
  corporateData: any;
  onNavigate?: (section: string, filters?: any) => void;
  onBack: () => void;
}

const aiSuggestedOffers = [
  {
    id: 1,
    title: 'Volume Discount Partnership',
    category: 'Volume-Based',
    confidence: 95,
    description: 'Tiered discount structure based on annual booking volume, perfect for high-volume corporates',
    benefits: [
      '15% discount on bookings over $1M annually',
      '20% discount on bookings over $2M annually',
      'Free seat upgrades for frequent travelers',
      'Priority booking and changes',
      'Dedicated account manager'
    ],
    estimatedSavings: '$375,000',
    validityPeriod: '12 months',
    targetAudience: 'High-volume corporate clients',
    aiReasoning: [
      'Corporate has $2.5M annual travel budget',
      '5,000+ trips annually indicates high volume',
      'Current business class preference shows premium willingness',
      'Strong financial stability (98%) ensures commitment'
    ],
    terms: {
      minimumSpend: '$1,000,000',
      validRoutes: 'All international routes',
      bookingWindow: '24/7 corporate booking portal',
      changePolicy: 'Flexible changes up to 24 hours',
      paymentTerms: 'Net 30 days'
    },
    matchScore: 95
  },
  {
    id: 2,
    title: 'Sustainability Partnership',
    category: 'Green Travel',
    confidence: 88,
    description: 'Carbon-neutral travel program with offset credits and sustainable aviation fuel options',
    benefits: [
      '100% carbon offset for all flights',
      'Sustainable Aviation Fuel (SAF) option',
      'Monthly sustainability reports',
      'Green travel rewards program',
      'Priority access to new eco-friendly aircraft'
    ],
    estimatedSavings: '$125,000',
    validityPeriod: '24 months',
    targetAudience: 'Sustainability-focused organizations',
    aiReasoning: [
      'Corporate has "High" sustainability focus',
      'Technology company likely has ESG commitments',
      'Carbon tracking in their technology requirements',
      'Premium positioning aligns with sustainability values'
    ],
    terms: {
      carbonOffset: 'Included in all bookings',
      safSurcharge: '5% premium for SAF flights',
      reporting: 'Monthly detailed carbon reporting',
      certification: 'Third-party verified offsets',
      renewableEnergy: 'Ground operations powered by renewables'
    },
    matchScore: 88
  },
  {
    id: 3,
    title: 'Technology Integration Offer',
    category: 'Digital Solutions',
    confidence: 92,
    description: 'Seamless API integration with corporate systems and advanced travel management tools',
    benefits: [
      'Free API integration and setup',
      'Real-time booking and management',
      'Automated expense reporting',
      'Mobile app with corporate branding',
      'Advanced analytics dashboard'
    ],
    estimatedSavings: '$85,000',
    validityPeriod: '18 months',
    targetAudience: 'Technology-forward companies',
    aiReasoning: [
      'Corporate requires API integration capabilities',
      'Mobile app and real-time booking preferences',
      'Large team (2,500 employees) needs automation',
      'Technology company values digital solutions'
    ],
    terms: {
      integrationCost: 'Waived (normally $25,000)',
      maintenanceFee: 'Included for first 18 months',
      apiLimits: 'Unlimited API calls',
      supportLevel: '24/7 technical support',
      customization: 'Full white-label mobile app'
    },
    matchScore: 92
  },
  {
    id: 4,
    title: 'Executive Travel Program',
    category: 'Premium Services',
    confidence: 85,
    description: 'VIP treatment for C-level executives with first-class upgrades and concierge services',
    benefits: [
      'Automatic first-class upgrades for C-level',
      'Airport lounge access for all travelers',
      'Priority boarding and baggage',
      'Concierge travel planning service',
      'Emergency travel support 24/7'
    ],
    estimatedSavings: '$95,000',
    validityPeriod: '12 months',
    targetAudience: 'Large enterprises with executive travel',
    aiReasoning: [
      'Large enterprise (2,500 employees) has executive team',
      'Current business class preference shows premium orientation',
      'High travel frequency suggests executive travel needs',
      'Strong financial position supports premium services'
    ],
    terms: {
      eligibleTravelers: 'C-level and VP-level executives',
      upgradePolicy: 'Subject to availability',
      loungeAccess: 'Global partner lounges included',
      conciergeHours: '24/7 availability',
      emergencySupport: 'Dedicated hotline'
    },
    matchScore: 85
  },
  {
    id: 5,
    title: 'Flexible Booking Solution',
    category: 'Operational Efficiency',
    confidence: 90,
    description: 'Maximum flexibility for changing business needs with minimal change fees',
    benefits: [
      'Zero change fees on all bookings',
      'Free cancellation up to 2 hours before',
      'Flexible date and route changes',
      'Group booking management tools',
      'Automated rebooking for disruptions'
    ],
    estimatedSavings: '$150,000',
    validityPeriod: '12 months',
    targetAudience: 'Companies with unpredictable travel schedules',
    aiReasoning: [
      'Weekly travel frequency suggests dynamic needs',
      'Technology sector often has changing project requirements',
      'Large team size requires flexible booking management',
      'Current airlines likely charging high change fees'
    ],
    terms: {
      changeFees: 'Waived completely',
      cancellationFees: 'Free up to 2 hours before departure',
      rebookingPolicy: 'Automatic for weather/operational delays',
      groupBookings: 'Bulk management tools included',
      notificationSystem: 'Proactive flight alerts'
    },
    matchScore: 90
  }
];

export function OfferCreation({ corporateData, onNavigate, onBack }: OfferCreationProps) {
  const [activeStep, setActiveStep] = useState('ai-suggestions');
  const [selectedOffers, setSelectedOffers] = useState([]);
  const [customOffer, setCustomOffer] = useState({
    title: '',
    category: '',
    description: '',
    benefits: [],
    terms: '',
    validityPeriod: '12',
    estimatedSavings: '',
    targetRoutes: []
  });
  const [emailSettings, setEmailSettings] = useState({
    subject: `Exclusive Travel Offer for ${corporateData?.name}`,
    body: `Dear ${corporateData?.name} Team,

We're excited to present exclusive travel offers designed specifically for your organization's needs.

Based on our analysis of your travel patterns and requirements, we've crafted these personalized offers to deliver maximum value and enhance your travel experience.

These offers are valid for a limited time and have been tailored to your specific travel profile and preferences.

We look forward to partnering with you to make your corporate travel more efficient, cost-effective, and sustainable.

Best regards,
SOAR Airlines Partnership Team`,
    recipients: corporateData?.email || '',
    ccRecipients: '',
    priority: 'medium'
  });

  const handleOfferSelect = (offer) => {
    setSelectedOffers(prev => {
      const isSelected = prev.some(o => o.id === offer.id);
      if (isSelected) {
        return prev.filter(o => o.id !== offer.id);
      } else {
        return [...prev, offer];
      }
    });
  };

  const handleCreateCustomOffer = () => {
    setActiveStep('custom-offer');
  };

  const handleSendOffers = () => {
    console.log('Sending offers:', selectedOffers);
    console.log('Email settings:', emailSettings);
    alert(`Offers sent successfully to ${corporateData.name}! ${selectedOffers.length} offer(s) included in the email.`);
    if (onNavigate) {
      onNavigate('active-offers');
    }
  };

  const renderAISuggestions = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain className="h-8 w-8 text-blue-500" />
          <Sparkles className="h-6 w-6 text-yellow-500" />
        </div>
        <h3 className="text-2xl font-bold mb-2">AI-Recommended Offers</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our AI has analyzed {corporateData.name}'s travel patterns, preferences, and requirements to suggest the most relevant offers
        </p>
      </div>

      <div className="grid gap-6">
        {aiSuggestedOffers.map((offer) => (
          <Card 
            key={offer.id} 
            className={`transition-all duration-200 hover:shadow-lg ${
              selectedOffers.some(o => o.id === offer.id) ? 'ring-2 ring-primary border-primary' : ''
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-xl font-semibold">{offer.title}</h4>
                    <Badge variant="outline">{offer.category}</Badge>
                    <Badge variant="default" className="bg-green-100 text-green-700">
                      <Brain className="h-3 w-3 mr-1" />
                      {offer.confidence}% match
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{offer.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Estimated Savings</p>
                        <p className="font-semibold">{offer.estimatedSavings}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Validity</p>
                        <p className="font-semibold">{offer.validityPeriod}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Match Score</p>
                        <p className="font-semibold">{offer.matchScore}%</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <Button 
                    variant={selectedOffers.some(o => o.id === offer.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleOfferSelect(offer)}
                  >
                    {selectedOffers.some(o => o.id === offer.id) ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Selected
                      </>
                    ) : (
                      <>
                        <Gift className="h-4 w-4 mr-1" />
                        Select Offer
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="benefits" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="benefits">Benefits</TabsTrigger>
                  <TabsTrigger value="ai-reasoning">AI Analysis</TabsTrigger>
                  <TabsTrigger value="terms">Terms</TabsTrigger>
                </TabsList>
                
                <TabsContent value="benefits" className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {offer.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="ai-reasoning" className="space-y-3">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-800 mb-2">Why this offer matches {corporateData.name}:</h5>
                    <ul className="space-y-2">
                      {offer.aiReasoning.map((reason, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-blue-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="terms" className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {Object.entries(offer.terms).map(([key, value]) => (
                      <div key={key}>
                        <p className="font-medium text-muted-foreground">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</p>
                        <p className="font-semibold">{value}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between pt-6 border-t">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Selected Offers:</span>
          <Badge variant="default">{selectedOffers.length}</Badge>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleCreateCustomOffer}>
            <Plus className="h-4 w-4 mr-2" />
            Create Custom Offer
          </Button>
          <Button 
            onClick={() => setActiveStep('review-send')}
            disabled={selectedOffers.length === 0}
          >
            Continue with Selected Offers
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderCustomOffer = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Create Custom Offer</h3>
          <p className="text-muted-foreground">Design a personalized offer for {corporateData.name}</p>
        </div>
        <Button variant="outline" onClick={() => setActiveStep('ai-suggestions')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to AI Suggestions
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Offer Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Offer Title</Label>
              <Input
                id="title"
                value={customOffer.title}
                onChange={(e) => setCustomOffer({...customOffer, title: e.target.value})}
                placeholder="Enter offer title"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={customOffer.category} onValueChange={(value) => setCustomOffer({...customOffer, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="volume-based">Volume-Based</SelectItem>
                  <SelectItem value="premium-services">Premium Services</SelectItem>
                  <SelectItem value="digital-solutions">Digital Solutions</SelectItem>
                  <SelectItem value="sustainability">Sustainability</SelectItem>
                  <SelectItem value="operational-efficiency">Operational Efficiency</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={customOffer.description}
              onChange={(e) => setCustomOffer({...customOffer, description: e.target.value})}
              placeholder="Describe the offer and its value proposition"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="estimatedSavings">Estimated Savings</Label>
              <Input
                id="estimatedSavings"
                value={customOffer.estimatedSavings}
                onChange={(e) => setCustomOffer({...customOffer, estimatedSavings: e.target.value})}
                placeholder="e.g., $100,000"
              />
            </div>
            <div>
              <Label htmlFor="validityPeriod">Validity Period (months)</Label>
              <Select value={customOffer.validityPeriod} onValueChange={(value) => setCustomOffer({...customOffer, validityPeriod: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 months</SelectItem>
                  <SelectItem value="12">12 months</SelectItem>
                  <SelectItem value="18">18 months</SelectItem>
                  <SelectItem value="24">24 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="terms">Terms & Conditions</Label>
            <Textarea
              id="terms"
              value={customOffer.terms}
              onChange={(e) => setCustomOffer({...customOffer, terms: e.target.value})}
              placeholder="Enter detailed terms and conditions"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Save as Template</Button>
        <Button onClick={() => setActiveStep('review-send')}>
          Add to Selected Offers
        </Button>
      </div>
    </div>
  );

  const renderReviewSend = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Review & Send Offers</h3>
          <p className="text-muted-foreground">Final review before sending to {corporateData.name}</p>
        </div>
        <Button variant="outline" onClick={() => setActiveStep('ai-suggestions')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Selection
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Selected Offers ({selectedOffers.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedOffers.map((offer) => (
                <div key={offer.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{offer.title}</h4>
                      <p className="text-sm text-muted-foreground">{offer.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{offer.estimatedSavings}</p>
                      <p className="text-xs text-muted-foreground">estimated savings</p>
                    </div>
                  </div>
                  <p className="text-sm mb-3">{offer.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Valid for {offer.validityPeriod}</span>
                    <span>•</span>
                    <span>{offer.confidence}% AI match</span>
                  </div>
                </div>
              ))}

              <Alert>
                <Gift className="h-4 w-4" />
                <AlertDescription>
                  These offers will be packaged into a professional proposal email with detailed terms and next steps.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="emailSubject">Subject</Label>
                <Input
                  id="emailSubject"
                  value={emailSettings.subject}
                  onChange={(e) => setEmailSettings({...emailSettings, subject: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="recipients">Recipients</Label>
                <Input
                  id="recipients"
                  value={emailSettings.recipients}
                  onChange={(e) => setEmailSettings({...emailSettings, recipients: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="ccRecipients">CC (Optional)</Label>
                <Input
                  id="ccRecipients"
                  value={emailSettings.ccRecipients}
                  onChange={(e) => setEmailSettings({...emailSettings, ccRecipients: e.target.value})}
                  placeholder="additional@email.com"
                />
              </div>
              <div>
                <Label htmlFor="emailBody">Message</Label>
                <Textarea
                  id="emailBody"
                  value={emailSettings.body}
                  onChange={(e) => setEmailSettings({...emailSettings, body: e.target.value})}
                  rows={8}
                />
              </div>
              <div>
                <Label>Priority</Label>
                <Select value={emailSettings.priority} onValueChange={(value) => setEmailSettings({...emailSettings, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  Detailed offer documents will be automatically attached to the email.
                </AlertDescription>
              </Alert>

              <Button className="w-full" onClick={handleSendOffers}>
                <Send className="h-4 w-4 mr-2" />
                Send Offers via Email
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
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Corporate Search
          </Button>
          <div>
            <h1 className="text-3xl font-bold">AI Offer Creation</h1>
            <div className="flex items-center gap-2 mt-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Creating offers for</span>
              <Badge variant="outline">{corporateData.name}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-2">
          {[
            { id: 'ai-suggestions', label: 'AI Suggestions', icon: Brain },
            { id: 'custom-offer', label: 'Custom Offer', icon: Settings },
            { id: 'review-send', label: 'Review & Send', icon: Send }
          ].map((step, index, array) => {
            const isActive = activeStep === step.id;
            const isCompleted = ['ai-suggestions', 'custom-offer'].indexOf(activeStep) > ['ai-suggestions', 'custom-offer'].indexOf(step.id);
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
      {activeStep === 'ai-suggestions' && renderAISuggestions()}
      {activeStep === 'custom-offer' && renderCustomOffer()}
      {activeStep === 'review-send' && renderReviewSend()}
    </div>
  );
}