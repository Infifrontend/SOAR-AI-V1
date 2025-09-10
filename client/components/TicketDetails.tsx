import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarContent, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { ScrollArea } from './ui/scroll-area';
import { 
  ArrowLeft,
  Send,
  Phone,
  Mail,
  Globe,
  MessageCircle,
  AlertTriangle,
  ThumbsUp,
  HelpCircle,
  Clock,
  User,
  Calendar,
  Tag,
  Paperclip,
  Download,
  Edit,
  Save,
  Zap,
  History,
  MessageSquare,
  FileText,
  Star,
  Flag,
  Eye,
  Copy,
  Printer,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  MoreHorizontal
} from 'lucide-react';

// Mock ticket data with full details
const ticketDetails = {
  id: 'TKT-2024-001',
  subject: 'Flight delay compensation request',
  description: 'I was on flight AA123 from New York (JFK) to Los Angeles (LAX) on June 15th, 2024. The flight was delayed by 4 hours due to mechanical issues. According to your policy, I should be entitled to compensation. I have all my boarding passes and receipts. Please process my compensation claim as soon as possible as this delay caused me to miss an important business meeting.',
  customer: {
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    loyaltyTier: 'Gold',
    loyaltyNumber: 'AA123456789',
    preferredLanguage: 'English',
    timezone: 'EST'
  },
  channel: 'WhatsApp',
  category: 'Complaint',
  priority: 'High',
  status: 'Open',
  assignedTo: {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@soarai.com',
    avatar: 'SJ',
    department: 'Customer Support'
  },
  createdAt: '2024-06-17 09:30:00',
  updatedAt: '2024-06-17 14:22:00',
  expectedResolution: '2024-06-17 17:30:00',
  actualResolution: null,
  tags: ['compensation', 'delay', 'domestic', 'business'],
  flightDetails: {
    flightNumber: 'AA123',
    route: 'JFK → LAX',
    scheduledDeparture: '2024-06-15 08:00',
    actualDeparture: '2024-06-15 12:00',
    delayReason: 'Mechanical Issues',
    delayDuration: '4 hours'
  },
  aiSuggestion: {
    recommendation: 'Offer compensation voucher worth $200 based on 4-hour delay policy.',
    confidence: 95,
    reasoning: 'Customer is eligible for compensation under Policy P-DEL-001. Delay exceeds 3 hours threshold for domestic flights.',
    suggestedActions: [
      'Verify flight delay details in system',
      'Check customer loyalty status for bonus compensation',
      'Generate $200 compensation voucher',
      'Send personalized apology email'
    ],
    policyReference: 'P-DEL-001: Domestic Flight Delay Compensation'
  },
  attachments: [
    { name: 'boarding_pass_AA123.pdf', size: '245 KB', type: 'pdf' },
    { name: 'business_meeting_proof.jpg', size: '1.2 MB', type: 'image' }
  ],
  relatedTickets: [
    { id: 'TKT-2024-015', subject: 'Similar delay complaint', status: 'Resolved' },
    { id: 'TKT-2024-028', subject: 'AA123 delay inquiry', status: 'In Progress' }
  ]
};

const chatHistory = [
  {
    id: 1,
    sender: 'customer',
    senderName: 'John Smith',
    message: 'Hi, I was on flight AA123 yesterday and it was delayed by 4 hours. I need compensation for this delay as I missed my important business meeting.',
    timestamp: '2024-06-17 09:30:00',
    channel: 'WhatsApp',
    read: true
  },
  {
    id: 2,
    sender: 'system',
    senderName: 'System',
    message: 'Ticket TKT-2024-001 has been created & assigned to Customer Support Team.',
    timestamp: '2024-06-17 09:32:00',
    channel: 'System',
    read: true
  },
  {
    id: 3,
    sender: 'agent',
    senderName: 'Sarah Johnson',
    message: 'Hello John, I apologize for the inconvenience caused by the flight delay. I have received your compensation request and I am reviewing your case. Can you please provide your boarding pass and any documentation related to the missed meeting?',
    timestamp: '2024-06-17 10:15:00',
    channel: 'WhatsApp',
    read: true
  },
  {
    id: 4,
    sender: 'customer',
    senderName: 'John Smith',
    message: 'Thank you for the quick response. I have attached my boarding pass and a confirmation email for the business meeting I missed. The meeting was worth a potential $50,000 contract.',
    timestamp: '2024-06-17 10:45:00',
    channel: 'WhatsApp',
    read: true,
    attachments: ['boarding_pass_AA123.pdf', 'business_meeting_proof.jpg']
  },
  {
    id: 5,
    sender: 'agent',
    senderName: 'Sarah Johnson',
    message: 'Thank you for providing the documentation. I can see that you experienced a 4-hour delay which qualifies for compensation under our policy. I am processing a $200 compensation voucher for you right now.',
    timestamp: '2024-06-17 14:22:00',
    channel: 'WhatsApp',
    read: true
  }
];

const ticketHistory = [
  {
    id: 1,
    action: 'Ticket Created',
    description: 'Ticket automatically created from WhatsApp message',
    user: 'System',
    timestamp: '2024-06-17 09:30:00'
  },
  {
    id: 2,
    action: 'Assigned',
    description: 'Ticket assigned to Sarah Johnson',
    user: 'Auto-Assignment System',
    timestamp: '2024-06-17 09:32:00'
  },
  {
    id: 3,
    action: 'Priority Updated',
    description: 'Priority changed from Medium to High',
    user: 'Sarah Johnson',
    timestamp: '2024-06-17 10:00:00'
  },
  {
    id: 4,
    action: 'AI Analysis',
    description: 'AI recommendation generated with 95% confidence',
    user: 'AI System',
    timestamp: '2024-06-17 10:05:00'
  },
  {
    id: 5,
    action: 'Customer Response',
    description: 'Customer provided additional documentation',
    user: 'John Smith',
    timestamp: '2024-06-17 10:45:00'
  },
  {
    id: 6,
    action: 'Status Update',
    description: 'Agent working on compensation processing',
    user: 'Sarah Johnson',
    timestamp: '2024-06-17 14:22:00'
  }
];

interface TicketDetailsProps {
  ticketId?: string;
  onNavigate?: (screen: string, params?: any) => void;
  onClose?: () => void;
}

export function TicketDetails({ ticketId, onNavigate, onClose }: TicketDetailsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editedStatus, setEditedStatus] = useState(ticketDetails.status);
  const [editedPriority, setEditedPriority] = useState(ticketDetails.priority);
  const [editedAssignee, setEditedAssignee] = useState(ticketDetails.assignedTo.name);
  const [newMessage, setNewMessage] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'WhatsApp': return Phone;
      case 'Email': return Mail;
      case 'Website': return Globe;
      case 'Chatbot': return MessageCircle;
      case 'System': return Settings;
      default: return MessageSquare;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Complaint': return AlertTriangle;
      case 'Feedback': return ThumbsUp;
      case 'Suggestion': return HelpCircle;
      case 'Request': return MessageCircle;
      default: return MessageSquare;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'secondary';
      case 'In Progress': return 'default';
      case 'AI to Address': return 'secondary';
      case 'Moved to Passenger': return 'outline';
      case 'Resolved': return 'default';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      setIsSendingMessage(true);
      // Here you would send the message via API
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      console.log('Sending message:', newMessage);
      setNewMessage('');
      setIsSendingMessage(false);
    }
  };

  const handleSaveChanges = () => {
    // Here you would save the changes via API
    console.log('Saving changes:', { status: editedStatus, priority: editedPriority, assignee: editedAssignee });
    setIsEditing(false);
  };

  const handleAddInternalNote = () => {
    if (internalNote.trim()) {
      // Here you would add the internal note via API
      console.log('Adding internal note:', internalNote);
      setInternalNote('');
    }
  };

  const calculateTimeRemaining = (expectedResolution: string) => {
    const now = new Date();
    const resolution = new Date(expectedResolution);
    const diff = resolution.getTime() - now.getTime();

    if (diff < 0) {
      return { value: 'Overdue', color: 'text-red-600' };
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours < 2) {
      return { value: `${hours}h ${minutes}m`, color: 'text-red-600' };
    } else if (hours < 8) {
      return { value: `${hours}h ${minutes}m`, color: 'text-yellow-600' };
    } else {
      return { value: `${hours}h ${minutes}m`, color: 'text-green-600' };
    }
  };

  const timeRemaining = calculateTimeRemaining(ticketDetails.expectedResolution);
  const CategoryIcon = getCategoryIcon(ticketDetails.category);

  return (
    <div className="space-y-6 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate ? onNavigate('ticket-list') : onClose?.()}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Tickets
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{ticketDetails.id}</h1>
            <p className="text-muted-foreground">{ticketDetails.subject}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Copy className="h-4 w-4 mr-1" />
            Copy Link
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-1" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="h-4 w-4 mr-1" />
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
          {isEditing && (
            <Button size="sm" onClick={handleSaveChanges}>
              <Save className="h-4 w-4 mr-1" />
              Save Changes
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="conversation">Conversation</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Ticket Status Banner */}
              <Alert className={`${ticketDetails.priority === 'High' ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}`}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Status Update:</strong> This ticket requires immediate attention. 
                  Expected resolution: {ticketDetails.expectedResolution}
                  <span className={`ml-2 font-medium ${timeRemaining.color}`}>
                    ({timeRemaining.value} remaining)
                  </span>
                </AlertDescription>
              </Alert>

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Name</Label>
                      <p className="text-sm">{ticketDetails.customer.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm">{ticketDetails.customer.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Phone</Label>
                      <p className="text-sm">{ticketDetails.customer.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Loyalty Tier</Label>
                      <Badge variant="default">{ticketDetails.customer.loyaltyTier}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Flight Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Flight Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Flight Number</Label>
                      <p className="text-sm font-mono">{ticketDetails.flightDetails.flightNumber}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Route</Label>
                      <p className="text-sm">{ticketDetails.flightDetails.route}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Scheduled Departure</Label>
                      <p className="text-sm">{ticketDetails.flightDetails.scheduledDeparture}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Actual Departure</Label>
                      <p className="text-sm text-red-600">{ticketDetails.flightDetails.actualDeparture}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Delay Reason</Label>
                      <p className="text-sm">{ticketDetails.flightDetails.delayReason}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Delay Duration</Label>
                      <p className="text-sm font-medium text-red-600">{ticketDetails.flightDetails.delayDuration}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ticket Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{ticketDetails.description}</p>
                </CardContent>
              </Card>

              {/* Related Tickets */}
              <Card>
                <CardHeader>
                  <CardTitle>Related Tickets</CardTitle>
                  <CardDescription>Similar or connected support cases</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {ticketDetails.relatedTickets.map((ticket) => (
                      <div key={ticket.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="text-sm font-medium">{ticket.id}</p>
                          <p className="text-xs text-muted-foreground">{ticket.subject}</p>
                        </div>
                        <Badge variant={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="conversation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Customer Conversation
                  </CardTitle>
                  <CardDescription>Chat history with the customer</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96 w-full pr-4">
                    <div className="space-y-4">
                      {chatHistory.map((message) => {
                        const ChannelIcon = getChannelIcon(message.channel);
                        const isCustomer = message.sender === 'customer';
                        const isAgent = message.sender === 'agent';
                        const isSystem = message.sender === 'system';

                        return (
                          <div 
                            key={message.id} 
                            className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[80%] ${
                              isAgent 
                                ? 'bg-blue-500 text-white' 
                                : isSystem 
                                  ? 'bg-gray-100 border border-gray-200' 
                                  : 'bg-white border border-gray-200'
                            } rounded-lg p-3`}>
                              <div className="flex items-center gap-2 mb-1">
                                <ChannelIcon className="h-3 w-3" />
                                <span className="text-xs font-medium">{message.senderName}</span>
                                <span className="text-xs opacity-70">{message.timestamp}</span>
                              </div>
                              <p className="text-sm">{message.message}</p>
                              {message.attachments && (
                                <div className="mt-2 space-y-1">
                                  {message.attachments.map((attachment, index) => (
                                    <div key={index} className="flex items-center gap-2 text-xs">
                                      <Paperclip className="h-3 w-3" />
                                      <span>{attachment}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>

                  <Separator className="my-4" />

                  <div className="space-y-3">
                    <Textarea
                      placeholder="Type your response to the customer..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      rows={3}
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Paperclip className="h-4 w-4 mr-1" />
                          Attach
                        </Button>
                        <Button variant="outline" size="sm">
                          <Zap className="h-4 w-4 mr-1" />
                          Use AI
                        </Button>
                      </div>
                      <Button 
                        onClick={() => handleSendMessage()}
                        disabled={!newMessage.trim() || isSendingMessage}
                        size="sm"
                        className="rounded-full px-4"
                      >
                        {isSendingMessage ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Ticket History
                  </CardTitle>
                  <CardDescription>All actions and updates on this ticket</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ticketHistory.map((event, index) => (
                      <div key={event.id} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{event.action}</p>
                            <span className="text-xs text-muted-foreground">{event.timestamp}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">by {event.user}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attachments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Paperclip className="h-5 w-5" />
                    Attachments
                  </CardTitle>
                  <CardDescription>Files uploaded by customer and agents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ticketDetails.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{attachment.name}</p>
                            <p className="text-xs text-muted-foreground">{attachment.size}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ticket Details */}
          <Card>
            <CardHeader>
              <CardTitle>Ticket Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Status</Label>
                {isEditing ? (
                  <Select value={editedStatus} onValueChange={setEditedStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="AI to Address">AI to Address</SelectItem>
                      <SelectItem value="Moved to Passenger">Moved to Passenger</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="mt-1">
                    <Badge variant={getStatusColor(ticketDetails.status)}>
                      {ticketDetails.status}
                    </Badge>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium">Priority</Label>
                {isEditing ? (
                  <Select value={editedPriority} onValueChange={setEditedPriority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="mt-1">
                    <Badge variant={getPriorityColor(ticketDetails.priority)}>
                      {ticketDetails.priority}
                    </Badge>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium">Channel</Label>
                <div className="flex items-center gap-2 mt-1">
                  {(() => {
                    const ChannelIcon = getChannelIcon(ticketDetails.channel);
                    return <ChannelIcon className="h-4 w-4 text-muted-foreground" />;
                  })()}
                  <span className="text-sm">{ticketDetails.channel}</span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Category</Label>
                <div className="flex items-center gap-2 mt-1">
                  <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{ticketDetails.category}</span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Assigned To</Label>
                {isEditing ? (
                  <Select value={editedAssignee} onValueChange={setEditedAssignee}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                      <SelectItem value="Mike Davis">Mike Davis</SelectItem>
                      <SelectItem value="Lisa Wong">Lisa Wong</SelectItem>
                      <SelectItem value="John Smith">John Smith</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">{ticketDetails.assignedTo.avatar}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{ticketDetails.assignedTo.name}</span>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium">Created</Label>
                <p className="text-sm text-muted-foreground mt-1">{ticketDetails.createdAt}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Last Updated</Label>
                <p className="text-sm text-muted-foreground mt-1">{ticketDetails.updatedAt}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Expected Resolution</Label>
                <p className={`text-sm mt-1 ${timeRemaining.color}`}>
                  {ticketDetails.expectedResolution}
                  <br />
                  <span className="text-xs">({timeRemaining.value})</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Confidence: {ticketDetails.aiSuggestion.confidence}%
                  </span>
                </div>
                <p className="text-sm text-blue-800 mb-3">
                  {ticketDetails.aiSuggestion.recommendation}
                </p>
                <p className="text-xs text-blue-700 mb-3">
                  <strong>Reasoning:</strong> {ticketDetails.aiSuggestion.reasoning}
                </p>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-blue-800">Suggested Actions:</p>
                  {ticketDetails.aiSuggestion.suggestedActions.map((action, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                      <p className="text-xs text-blue-700">{action}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-2 border-t border-blue-200">
                  <p className="text-xs text-blue-600">
                    <strong>Policy:</strong> {ticketDetails.aiSuggestion.policyReference}
                  </p>
                </div>
              </div>

              <Button className="w-full" size="sm">
                <Zap className="h-4 w-4 mr-1" />
                Apply AI Suggestion
              </Button>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {ticketDetails.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Internal Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Internal Notes</CardTitle>
              <CardDescription>Notes visible only to agents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Add internal note..."
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                rows={3}
              />
              <Button 
                size="sm" 
                className="w-full"
                onClick={handleAddInternalNote}
                disabled={!internalNote.trim()}
              >
                Add Note
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Escalate to Manager
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Flag className="h-4 w-4 mr-2" />
                Mark as Priority
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Star className="h-4 w-4 mr-2" />
                Add to Favorites
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Create Follow-up
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}