import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { 
  MessageCircle, 
  Send, 
  Sparkles, 
  Brain, 
  Search, 
  Building2, 
  FileText, 
  Gift, 
  Users, 
  ArrowRight, 
  Lightbulb,
  Target,
  Zap,
  Clock,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Mail,
  Phone,
  Calendar,
  Settings,
  HelpCircle,
  Star,
  Rocket,
  Bot,
  ChevronRight,
  Eye,
  Edit,
  Plus,
  Filter,
  Shield,
  Paperclip,
  Mic,
  CalendarDays,
  User,
  LayoutDashboard
} from 'lucide-react';

interface AIAssistantProps {
  onNavigate: (section: string, filters?: any) => void;
}

export function AIAssistant({ onNavigate }: AIAssistantProps) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [selectedReport, setSelectedReport] = useState('');

  const quickActions = [
    {
      id: 'corporate-search',
      label: 'Corporate Search',
      description: 'Find and discover potential corporate partnerships',
      icon: Search,
      gradient: 'from-blue-50 to-blue-100',
      action: () => onNavigate('corporate-search')
    },
    {
      id: 'lead-management',
      label: 'Lead Management',
      description: 'View and manage your sales pipeline',
      icon: Target,
      gradient: 'from-emerald-50 to-emerald-100',
      action: () => onNavigate('lead-management')
    },
    {
      id: 'qualified-leads',
      label: 'Qualified Leads',
      description: 'High-potential prospects ready for conversion',
      icon: Users,
      gradient: 'from-violet-50 to-violet-100',
      action: () => onNavigate('qualified-leads')
    },
    {
      id: 'email-campaigns',
      label: 'Email Campaigns',
      description: 'Automated outreach and nurturing campaigns',
      icon: Mail,
      gradient: 'from-amber-50 to-amber-100',
      action: () => onNavigate('email-campaigns')
    },
    {
      id: 'opportunities',
      label: 'Opportunities',
      description: 'Sales pipeline tracking and deal management',
      icon: TrendingUp,
      gradient: 'from-teal-50 to-teal-100',
      action: () => onNavigate('opportunities')
    },
    {
      id: 'revenue-prediction',
      label: 'Revenue Prediction',
      description: 'AI-powered revenue forecasting and analytics',
      icon: Brain,
      gradient: 'from-rose-50 to-rose-100',
      action: () => onNavigate('revenue-prediction')
    },
    {
      id: 'contracts',
      label: 'Contract Management',
      description: 'Manage agreements and compliance tracking',
      icon: FileText,
      gradient: 'from-yellow-50 to-yellow-100',
      action: () => onNavigate('contracts')
    },
    {
      id: 'breach-monitoring',
      label: 'Risk Monitoring',
      description: 'Contract breach tracking and risk assessment',
      icon: Shield,
      gradient: 'from-red-50 to-red-100',
      action: () => onNavigate('breach-monitoring')
    }
  ];

  const handleQuickAction = (message: string) => {
    setShowWelcome(false);
    setInput(message);
    handleSendMessage(message);
  };

  const handleSendMessage = (messageText?: string) => {
    const messageContent = messageText || input.trim();
    if (!messageContent || isProcessing) return;

    const userMessage = {
      id: Date.now(),
      type: 'user' as const,
      content: messageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    setShowWelcome(false);

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = generateAIResponse(messageContent);
      setMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('corporate') || lowerMessage.includes('travel report')) {
      return {
        id: Date.now() + 1,
        type: 'assistant' as const,
        content: 'I\'ll help you generate a comprehensive corporate travel report. What specific details would you like to include?',
        timestamp: new Date(),
        filterOptions: [
          { label: 'Travel Dates', value: 'dates', selected: false },
          { label: 'Expense Categories', value: 'expenses', selected: false },
          { label: 'Department Breakdown', value: 'departments', selected: false },
          { label: 'Employee Details', value: 'employees', selected: false }
        ],
        actions: [
          {
            label: 'Corporate Search',
            icon: Search,
            action: () => onNavigate('corporate-search'),
            variant: 'default' as const
          },
          {
            label: 'View Dashboard',
            icon: BarChart3,
            action: () => onNavigate('dashboard'),
            variant: 'outline' as const
          }
        ]
      };
    }

    if (lowerMessage.includes('lead') || lowerMessage.includes('conversion')) {
      return {
        id: Date.now() + 1,
        type: 'assistant' as const,
        content: 'I can help you analyze your lead performance. Would you like to see qualified leads, conversion metrics, or the complete lead pipeline?',
        timestamp: new Date(),
        actions: [
          {
            label: 'View Qualified Leads',
            icon: Users,
            action: () => onNavigate('qualified-leads'),
            variant: 'default' as const
          },
          {
            label: 'Lead Dashboard',
            icon: Target,
            action: () => onNavigate('lead-management'),
            variant: 'outline' as const
          },
          {
            label: 'Opportunities',
            icon: TrendingUp,
            action: () => onNavigate('opportunities'),
            variant: 'outline' as const
          }
        ]
      };
    }

    if (lowerMessage.includes('contract') || lowerMessage.includes('compliance')) {
      return {
        id: Date.now() + 1,
        type: 'assistant' as const,
        content: 'I can help you review contract performance and compliance. Would you like to see active contracts, breach monitoring, or risk assessments?',
        timestamp: new Date(),
        actions: [
          {
            label: 'Contract Management',
            icon: FileText,
            action: () => onNavigate('contracts'),
            variant: 'default' as const
          },
          {
            label: 'Risk Monitoring',
            icon: Shield,
            action: () => onNavigate('breach-monitoring'),
            variant: 'outline' as const
          }
        ]
      };
    }

    if (lowerMessage.includes('revenue') || lowerMessage.includes('financial') || lowerMessage.includes('prediction')) {
      return {
        id: Date.now() + 1,
        type: 'assistant' as const,
        content: 'I can show you revenue predictions and financial analytics. Our AI-powered forecasting provides insights into future performance trends.',
        timestamp: new Date(),
        actions: [
          {
            label: 'Revenue Prediction',
            icon: Brain,
            action: () => onNavigate('revenue-prediction'),
            variant: 'default' as const
          },
          {
            label: 'Analytics Dashboard',
            icon: BarChart3,
            action: () => onNavigate('dashboard'),
            variant: 'outline' as const
          }
        ]
      };
    }

    if (lowerMessage.includes('email') || lowerMessage.includes('campaign') || lowerMessage.includes('outreach')) {
      return {
        id: Date.now() + 1,
        type: 'assistant' as const,
        content: 'I can help you manage email campaigns and automated outreach. Would you like to create a new campaign or review existing performance?',
        timestamp: new Date(),
        actions: [
          {
            label: 'Email Campaigns',
            icon: Mail,
            action: () => onNavigate('email-campaigns'),
            variant: 'default' as const
          },
          {
            label: 'Lead Management',
            icon: Users,
            action: () => onNavigate('lead-management'),
            variant: 'outline' as const
          }
        ]
      };
    }

    if (lowerMessage.includes('custom') || lowerMessage.includes('help')) {
      return {
        id: Date.now() + 1,
        type: 'assistant' as const,
        content: 'I\'m here to help you navigate SOAR-AI\'s features. You can ask me about corporate search, lead management, contracts, revenue predictions, or any other functionality.',
        timestamp: new Date(),
        suggestions: [
          {
            label: 'Find Corporate Clients',
            description: 'Search and discover potential corporate partnerships',
            icon: Search,
            action: () => onNavigate('corporate-search')
          },
          {
            label: 'Manage Leads',
            description: 'View and qualify your sales leads',
            icon: Users,
            action: () => onNavigate('leads-list')
          },
          {
            label: 'Track Opportunities',
            description: 'Monitor your sales pipeline progress',
            icon: Target,
            action: () => onNavigate('opportunities')
          }
        ]
      };
    }

    // Default response
    return {
      id: Date.now() + 1,
      type: 'assistant' as const,
      content: `I understand you're looking for help with "${userMessage}". Let me guide you to the right section of SOAR-AI where you can accomplish this task.`,
      timestamp: new Date(),
      actions: [
        {
          label: 'Explore Dashboard',
          icon: LayoutDashboard,
          action: () => onNavigate('dashboard'),
          variant: 'default' as const
        },
        {
          label: 'Corporate Search',
          icon: Search,
          action: () => onNavigate('corporate-search'),
          variant: 'outline' as const
        }
      ]
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setShowWelcome(true);
    setInput('');
    setSelectedReport('');
  };

  const handleFilterSelect = (messageId: number, filterValue: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId && msg.filterOptions) {
        return {
          ...msg,
          filterOptions: msg.filterOptions.map(filter =>
            filter.value === filterValue
              ? { ...filter, selected: !filter.selected }
              : filter
          )
        };
      }
      return msg;
    }));
  };

  return (
    <div className="w-full h-full flex bg-gray-50 relative p-5">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Fixed Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-6 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-[100] shadow-sm" style={{ marginLeft: '250px' }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-gray-900">SOAR-AI</h1>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <CalendarDays className="h-4 w-4" />

              </div>
            </div>
          </div>

        </div>

        {/* Chat Content - Flexible Height */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Chat Messages Area - Scrollable */}
          <div className="flex-1 overflow-y-auto mt-[0px] mr-[0px] mb-[100px] ml-[0px]">
            {/* Welcome Section */}
            {showWelcome && (
              <div className="h-full flex flex-col items-center justify-center p-8 space-y-8">
                {/* Bot Avatar */}
                <div className="relative">
                  <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center relative">
                    <Bot className="h-10 w-10 text-white" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary rounded-lg flex items-center justify-center">
                      <MessageCircle className="h-3 w-3 text-secondary-foreground" />
                    </div>
                  </div>
                </div>

                {/* Welcome Text */}
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">Welcome!</h2>
                  <p className="text-gray-600">Hello! What report would you like to generate today?</p>
                </div>

                {/* Quick Start Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl w-full">
                  <Button
                    variant="default"
                    onClick={() => handleQuickAction('I need to generate a corporate travel report')}
                    className="h-auto p-4 flex flex-col items-center gap-2 text-center"
                  >
                    <Building2 className="h-5 w-5" />
                    <span className="text-sm font-medium">Corporate Report</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleQuickAction('Show me lead analysis and conversion metrics')}
                    className="h-auto p-4 flex flex-col items-center gap-2 text-center"
                  >
                    <TrendingUp className="h-5 w-5" />
                    <span className="text-sm font-medium">Lead Analysis</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleQuickAction('I want to review contract performance and compliance')}
                    className="h-auto p-4 flex flex-col items-center gap-2 text-center"
                  >
                    <FileText className="h-5 w-5" />
                    <span className="text-sm font-medium">Contract Overview</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleQuickAction('Show me revenue predictions and financial tracking')}
                    className="h-auto p-4 flex flex-col items-center gap-2 text-center"
                  >
                    <BarChart3 className="h-5 w-5" />
                    <span className="text-sm font-medium">Revenue Tracking</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleQuickAction('I need help creating a custom analysis report')}
                    className="h-auto p-4 flex flex-col items-center gap-2 text-center"
                  >
                    <Settings className="h-5 w-5" />
                    <span className="text-sm font-medium">Custom Analysis</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Chat Messages */}
            {!showWelcome && (
              <div className="p-6 pb-0">
                <div className="max-w-4xl mx-auto space-y-4">
                  {/* Welcome Message Section */}
                  <div className="flex justify-center mb-6">
                    <div className="flex flex-col items-center text-center space-y-3 p-4">
                      {/* Bot Avatar */}
                      <div className="relative">
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center relative">
                          <Bot className="h-8 w-8 text-white" />
                          <div className="absolute -top-2 -right-2 px-2 py-1 bg-gradient-to-r from-[#133769] to-[#1a4a7a] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                            <span className="text-xs font-medium tracking-tight">SOAR AI</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Welcome Text */}
                      <div className="space-y-1 mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Hi there!</h2>
                        <p className="text-sm text-gray-600">I'm your SOAR-AI assistant — here to help with clients, contracts, offers, support tickets, and more.<br />What would you like to do today?</p>
                      </div>

                      {/* Quick Suggestions */}
                      <div className="w-full max-w-2xl mx-auto mt-[100px]">
                        <h3 className="text-base font-semibold text-gray-900 mb-4 text-center">Quick suggestions:</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            onClick={() => onNavigate('corporate-search')}
                            className="flex items-start gap-3 p-4 text-left rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300"
                          >
                            <Search className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="font-medium text-gray-700 text-sm">Find Corporate Clients</div>
                              <div className="text-gray-500 text-xs">Search for potential travel partners</div>
                            </div>
                          </button>

                          <button
                            onClick={() => onNavigate('design-travel-offers')}
                            className="flex items-start gap-3 p-4 text-left rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300"
                          >
                            <Gift className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="font-medium text-gray-700 text-sm">Create Travel Offers</div>
                              <div className="text-gray-500 text-xs">Design personalized offers</div>
                            </div>
                          </button>

                          <button
                            onClick={() => onNavigate('dashboard')}
                            className="flex items-start gap-3 p-4 text-left rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300"
                          >
                            <LayoutDashboard className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="font-medium text-gray-700 text-sm">View Dashboard</div>
                              <div className="text-gray-500 text-xs">See system overview</div>
                            </div>
                          </button>

                          <button
                            onClick={() => onNavigate('admin-dashboard')}
                            className="flex items-start gap-3 p-4 text-left rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300"
                          >
                            <Shield className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="font-medium text-gray-700 text-sm">Admin Dashboard</div>
                              <div className="text-gray-500 text-xs">Comprehensive administration panel</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${
                        message.type === 'user'
                          ? 'bg-primary text-white rounded-l-2xl rounded-tr-2xl'
                          : 'bg-white border border-gray-200 rounded-r-2xl rounded-tl-2xl shadow-sm'
                      } p-4`}>
                        {/* Message Header */}
                        {message.type === 'assistant' && (
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                              <Bot className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">AI Assistant</span>
                          </div>
                        )}

                        {/* Message Content */}
                        <div className="space-y-3">
                          <p className={`text-sm ${message.type === 'user' ? 'text-white' : 'text-gray-800'}`}>
                            {message.content}
                          </p>

                          {/* Filter Options */}
                          {message.filterOptions && (
                            <div className="flex flex-wrap gap-2">
                              {message.filterOptions.map((filter) => (
                                <button
                                  key={filter.value}
                                  onClick={() => handleFilterSelect(message.id, filter.value)}
                                  className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                                    filter.selected
                                      ? 'bg-secondary border-secondary text-secondary-foreground'
                                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                  }`}
                                >
                                  {filter.label}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Action Buttons */}
                          {message.actions && (
                            <div className="flex flex-wrap gap-2">
                              {message.actions.map((action, index) => {
                                const ActionIcon = action.icon;
                                return (
                                  <Button
                                    key={index}
                                    size="sm"
                                    variant={action.variant || 'default'}
                                    onClick={action.action}
                                    className="h-8 text-xs"
                                  >
                                    {ActionIcon && <ActionIcon className="h-3 w-3 mr-1" />}
                                    {action.label}
                                  </Button>
                                );
                              })}
                            </div>
                          )}

                          {/* Quick Suggestions Cards */}
                          {message.type === 'assistant' && message.id === messages[0]?.id && (
                            <div className="space-y-3">
                              <h4 className="text-sm font-semibold text-gray-900">Quick suggestions:</h4>
                              <div className="grid grid-cols-2 gap-3">
                                <button
                                  onClick={() => onNavigate('corporate-search')}
                                  className="flex items-start gap-2 p-3 text-left rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300"
                                >
                                  <Search className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                  <div>
                                    <div className="font-medium text-gray-700 text-xs">Find Corporate Clients</div>
                                    <div className="text-gray-500 text-xs">Search for potential travel partners</div>
                                  </div>
                                </button>

                                <button
                                  onClick={() => onNavigate('design-travel-offers')}
                                  className="flex items-start gap-2 p-3 text-left rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300"
                                >
                                  <Gift className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                  <div>
                                    <div className="font-medium text-gray-700 text-xs">Create Travel Offers</div>
                                    <div className="text-gray-500 text-xs">Design personalized offers</div>
                                  </div>
                                </button>

                                <button
                                  onClick={() => onNavigate('dashboard')}
                                  className="flex items-start gap-2 p-3 text-left rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300"
                                >
                                  <LayoutDashboard className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                  <div>
                                    <div className="font-medium text-gray-700 text-xs">View Dashboard</div>
                                    <div className="text-gray-500 text-xs">See system overview</div>
                                  </div>
                                </button>

                                <button
                                  onClick={() => onNavigate('admin-dashboard')}
                                  className="flex items-start gap-2 p-3 text-left rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300"
                                >
                                  <Shield className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                  <div>
                                    <div className="font-medium text-gray-700 text-xs">Admin Dashboard</div>
                                    <div className="text-gray-500 text-xs">Comprehensive administration panel</div>
                                  </div>
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Suggestions */}
                          {message.suggestions && (
                            <div className="space-y-2">
                              <p className="text-xs font-medium text-gray-500">Quick suggestions:</p>
                              {message.suggestions.map((suggestion, index) => {
                                const SuggestionIcon = suggestion.icon;
                                return (
                                  <button
                                    key={index}
                                    onClick={suggestion.action}
                                    className="flex items-center gap-2 w-full p-2 text-left text-xs rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                  >
                                    {SuggestionIcon && <SuggestionIcon className="h-3 w-3 text-gray-500" />}
                                    <div>
                                      <div className="font-medium text-gray-700">{suggestion.label}</div>
                                      <div className="text-gray-500">{suggestion.description}</div>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Timestamp */}
                        <div className={`text-xs mt-2 ${
                          message.type === 'user' ? 'text-primary-foreground opacity-80' : 'text-gray-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Processing Indicator */}
                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 rounded-r-2xl rounded-tl-2xl shadow-sm p-4 max-w-[70%]">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                            <Bot className="h-3 w-3 text-white" />
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                            <span className="text-sm text-gray-600">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Fixed Bottom Section - Always Visible */}
          {!showWelcome && (
            <div className="flex-shrink-0 border-t border-gray-200 bg-white sticky bottom-0 z-50 shadow-lg mt-[0px] mr-[24px] mb-[0px] ml-[0px]">
              {/* Try These Tasks - Above Input */}
              {messages.length === 1 && (
                <div className="bg-gray-50 p-4 border-b border-gray-200">
                  <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <h4 className="text-sm font-medium text-gray-700">Try These Tasks</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction('Find technology companies with high travel budgets')}
                        className="text-xs h-8"
                      >
                        <Search className="h-3 w-3 mr-1" />
                        Find Tech Companies
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction('Show me qualified leads that need follow-up')}
                        className="text-xs h-8"
                      >
                        <Users className="h-3 w-3 mr-1" />
                        Qualified Leads
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction('Create an email campaign for unqualified leads')}
                        className="text-xs h-8"
                      >
                        <Mail className="h-3 w-3 mr-1" />
                        Email Campaign
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction('Review contracts expiring this month')}
                        className="text-xs h-8"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Contract Review
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction('Show revenue predictions for next quarter')}
                        className="text-xs h-8"
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Revenue Forecast
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Input Area - Always Visible */}
              <div className="p-6 mt-[0px] mr-[24px] mb-[0px] ml-[0px]">
                <div className="max-w-4xl mx-auto">
                  <div className="relative flex items-center gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type your message here..."
                        className="w-full px-4 py-3 pr-16 rounded-full border border-gray-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm shadow-sm hover:shadow-md transition-shadow duration-200"
                        disabled={isProcessing}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                          <Paperclip className="h-4 w-4 text-gray-400" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                          <Mic className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleSendMessage()}
                      disabled={!input.trim() || isProcessing}
                      size="sm"
                      className="rounded-full px-4"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick Suggestions - Always Visible at Bottom */}
              <div style={{ 
                backgroundColor: '#f8f9fa',
                padding: 'var(--space-lg)',
                borderTop: '1px solid #E6EAEF',
                marginBottom: '10px',
                marginRight: '8px'
              }}>
                <div className="max-w-4xl mx-auto pl-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
                    <h4 style={{ 
                      fontSize: 'var(--text-sm)', 
                      fontWeight: 'var(--font-weight-medium)',
                      fontFamily: 'var(--font-family)',
                      color: 'var(--color-foreground)'
                    }}>
                      Try These Tasks
                    </h4>
                  </div>
                  <p style={{ 
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-muted-foreground)',
                    fontFamily: 'var(--font-family)',
                    marginBottom: 'var(--space-lg)'
                  }}>
                    Click to quickly fill the chat input with common requests
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div style={{
                      backgroundColor: 'white',
                      border: '1px solid #C9C9C9',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-lg)',
                      cursor: 'pointer',
                      transition: 'box-shadow 0.2s ease-in-out'
                    }}
                    className="hover:shadow-md"
                    onClick={() => handleQuickAction('Find technology companies with high travel budgets')}>
                      <div style={{ 
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-primary)',
                        marginBottom: 'var(--space-sm)'
                      }}>
                        Corporate Search
                      </div>
                      <div style={{ 
                        fontSize: 'var(--text-xs)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-foreground)',
                        lineHeight: '1.3'
                      }}>
                        "Find technology companies with high travel budgets"
                      </div>
                    </div>

                    <div style={{
                      backgroundColor: 'white',
                      border: '1px solid #C9C9C9',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-lg)',
                      cursor: 'pointer',
                      transition: 'box-shadow 0.2s ease-in-out'
                    }}
                    className="hover:shadow-md"
                    onClick={() => handleQuickAction('Create a sustainability-focused travel offer')}>
                      <div style={{ 
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-primary)',
                        marginBottom: 'var(--space-sm)'
                      }}>
                        Offer Creation
                      </div>
                      <div style={{ 
                        fontSize: 'var(--text-xs)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-foreground)',
                        lineHeight: '1.3'
                      }}>
                        "Create a sustainability-focused travel offer"
                      </div>
                    </div>

                    <div style={{
                      backgroundColor: 'white',
                      border: '1px solid #C9C9C9',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-lg)',
                      cursor: 'pointer',
                      transition: 'box-shadow 0.2s ease-in-out'
                    }}
                    className="hover:shadow-md"
                    onClick={() => handleQuickAction('Monitor contract compliance for financial services clients')}>
                      <div style={{ 
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-primary)',
                        marginBottom: 'var(--space-sm)'
                      }}>
                        Contract Management
                      </div>
                      <div style={{ 
                        fontSize: 'var(--text-xs)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-foreground)',
                        lineHeight: '1.3'
                      }}>
                        "Monitor contract compliance for financial services clients"
                      </div>
                    </div>

                    <div style={{
                      backgroundColor: 'white',
                      border: '1px solid #C9C9C9',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-lg)',
                      cursor: 'pointer',
                      transition: 'box-shadow 0.2s ease-in-out'
                    }}
                    className="hover:shadow-md"
                    onClick={() => handleQuickAction('Send notifications to corporate travel managers')}>
                      <div style={{ 
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-primary)',
                        marginBottom: 'var(--space-sm)'
                      }}>
                        Communication
                      </div>
                      <div style={{ 
                        fontSize: 'var(--text-xs)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--color-foreground)',
                        lineHeight: '1.3'
                      }}>
                        "Send notifications to corporate travel managers"
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - System Status First, then Quick Actions */}
      <div className="w-80 bg-white border-l border-gray-200 flex-shrink-0">
        <div className="h-full overflow-y-auto">
          {/* System Status - First */}
          <div className="p-6 border-b border-gray-200">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">System Status</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                <div className="space-y-1">
                  <div>1,247 Corporates</div>
                  <div>324 Qualified Leads</div>
                </div>
                <div className="space-y-1">
                  <div>156 Contracts</div>
                  <div>24 Active Offers</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions - Second */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Quick Actions</h3>
            <p className="text-sm text-gray-600">Navigate directly to key sections</p>
          </div>

          {/* Quick Action Cards */}
          <div className="p-6 space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card 
                  key={action.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md bg-gradient-to-r ${action.gradient} border-0`}
                  onClick={action.action}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <Icon className="h-5 w-5 text-gray-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm mb-1">{action.label}</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">{action.description}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}