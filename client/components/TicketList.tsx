import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { 
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  MessageSquare,
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
  Target,
  Zap,
  ArrowUpDown,
  MoreHorizontal,
  RefreshCw,
  Plus
} from 'lucide-react';

// Mock ticket data
const tickets = [
  {
    id: 'TKT-2024-001',
    channel: 'WhatsApp',
    category: 'Complaint',
    subject: 'Flight delay compensation request',
    customer: 'John Smith',
    customerEmail: 'john.smith@email.com',
    priority: 'High',
    status: 'Open',
    createdAt: '2024-06-17 09:30',
    expectedResolution: '2024-06-17 17:30',
    assignedTo: 'Sarah Johnson',
    aiSuggestion: 'Offer compensation voucher worth $200 based on 4-hour delay policy. Reference policy P-DEL-001.',
    description: 'Customer experienced 4-hour flight delay on AA123 from NYC to LAX. Requesting compensation as per airline policy.',
    lastUpdated: '2024-06-17 10:15',
    tags: ['compensation', 'delay', 'domestic']
  },
  {
    id: 'TKT-2024-002',
    channel: 'Email',
    category: 'Request',
    subject: 'Seat upgrade request for business travel',
    customer: 'Sarah Johnson',
    customerEmail: 'sarah.j@company.com',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: '2024-06-17 08:15',
    expectedResolution: '2024-06-18 08:15',
    assignedTo: 'Mike Davis',
    aiSuggestion: 'Check available premium economy seats on flight BA456. Offer upgrade for additional $180.',
    description: 'Corporate traveler requesting seat upgrade for London-Paris flight. Has gold status.',
    lastUpdated: '2024-06-17 14:22',
    tags: ['upgrade', 'business', 'premium']
  },
  {
    id: 'TKT-2024-003',
    channel: 'Website',
    category: 'Feedback',
    subject: 'Excellent service on recent flight',
    customer: 'Mike Davis',
    customerEmail: 'mike.davis@gmail.com',
    priority: 'Low',
    status: 'Resolved',
    createdAt: '2024-06-16 15:45',
    expectedResolution: '2024-06-17 15:45',
    assignedTo: 'Lisa Wong',
    aiSuggestion: 'Send personalized thank you message and offer loyalty points bonus.',
    description: 'Customer praising cabin crew service on international flight. Mentioned excellent meal service.',
    lastUpdated: '2024-06-17 09:30',
    tags: ['positive', 'service', 'international']
  },
  {
    id: 'TKT-2024-004',
    channel: 'Chatbot',
    category: 'Complaint',
    subject: 'Lost baggage claim',
    customer: 'Emma Wilson',
    customerEmail: 'emma.w@email.com',
    priority: 'High',
    status: 'AI to Address',
    createdAt: '2024-06-17 11:20',
    expectedResolution: '2024-06-17 23:20',
    assignedTo: 'John Smith',
    aiSuggestion: 'Initiate baggage tracing with reference BWI2024001. Offer interim compensation of $100.',
    description: 'Baggage not delivered after connecting flight. Contains important business documents.',
    lastUpdated: '2024-06-17 11:45',
    tags: ['baggage', 'lost', 'urgent']
  },
  {
    id: 'TKT-2024-005',
    channel: 'WhatsApp',
    category: 'Suggestion',
    subject: 'Mobile app improvement suggestion',
    customer: 'Alex Thompson',
    customerEmail: 'alex.t@email.com',
    priority: 'Low',
    status: 'Moved to Passenger',
    createdAt: '2024-06-16 16:30',
    expectedResolution: '2024-06-18 16:30',
    assignedTo: 'Sarah Johnson',
    aiSuggestion: 'Forward to product team and acknowledge customer contribution with loyalty points.',
    description: 'Suggests adding real-time seat map feature to mobile app for better user experience.',
    lastUpdated: '2024-06-17 08:15',
    tags: ['app', 'feature', 'product']
  }
];

interface TicketListProps {
  initialFilters?: any;
  onNavigate?: (screen: string, params?: any) => void;
}

export function TicketList({ initialFilters, onNavigate }: TicketListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialFilters?.status || 'all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assignedFilter, setAssignedFilter] = useState('all');
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'WhatsApp': return Phone;
      case 'Email': return Mail;
      case 'Website': return Globe;
      case 'Chatbot': return MessageCircle;
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Complaint': return 'destructive';
      case 'Feedback': return 'default';
      case 'Suggestion': return 'secondary';
      case 'Request': return 'outline';
      default: return 'outline';
    }
  };

  const handleTicketClick = (ticketId: string) => {
    if (onNavigate) {
      onNavigate('ticket-details', { ticketId });
    }
  };

  const handleTicketSelect = (ticketId: string, checked: boolean) => {
    if (checked) {
      setSelectedTickets([...selectedTickets, ticketId]);
    } else {
      setSelectedTickets(selectedTickets.filter(id => id !== ticketId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTickets(filteredTickets.map(ticket => ticket.id));
    } else {
      setSelectedTickets([]);
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesChannel = channelFilter === 'all' || ticket.channel === channelFilter;
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesAssigned = assignedFilter === 'all' || ticket.assignedTo === assignedFilter;
    
    return matchesSearch && matchesStatus && matchesChannel && matchesCategory && matchesPriority && matchesAssigned;
  }).sort((a, b) => {
    const aValue = a[sortBy as keyof typeof a];
    const bValue = b[sortBy as keyof typeof b];
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

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

  return (
    <div className="space-y-6 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ticket Management</h1>
          <p className="text-muted-foreground">View and manage all customer support tickets</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button 
            size="sm"
            onClick={() => onNavigate && onNavigate('ticket-kanban')}
          >
            <Plus className="h-4 w-4 mr-1" />
            Kanban View
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="AI to Address">AI to Address</SelectItem>
                  <SelectItem value="Moved to Passenger">Moved to Passenger</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Channel</Label>
              <Select value={channelFilter} onValueChange={setChannelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All channels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Website">Website</SelectItem>
                  <SelectItem value="Chatbot">Chatbot</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Complaint">Complaint</SelectItem>
                  <SelectItem value="Feedback">Feedback</SelectItem>
                  <SelectItem value="Suggestion">Suggestion</SelectItem>
                  <SelectItem value="Request">Request</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Assigned To</Label>
              <Select value={assignedFilter} onValueChange={setAssignedFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All agents" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agents</SelectItem>
                  <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                  <SelectItem value="Mike Davis">Mike Davis</SelectItem>
                  <SelectItem value="Lisa Wong">Lisa Wong</SelectItem>
                  <SelectItem value="John Smith">John Smith</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredTickets.length} of {tickets.length} tickets
          {selectedTickets.length > 0 && (
            <span className="ml-2">({selectedTickets.length} selected)</span>
          )}
        </div>
        {selectedTickets.length > 0 && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Bulk Assign
            </Button>
            <Button variant="outline" size="sm">
              Bulk Status Change
            </Button>
          </div>
        )}
      </div>

      {/* Tickets Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedTickets.length === filteredTickets.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center gap-1">
                      Ticket ID
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center gap-1">
                      Date & Time
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Expected Resolution</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>AI Suggestion</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => {
                  const ChannelIcon = getChannelIcon(ticket.channel);
                  const CategoryIcon = getCategoryIcon(ticket.category);
                  const timeRemaining = calculateTimeRemaining(ticket.expectedResolution);
                  
                  return (
                    <TableRow 
                      key={ticket.id} 
                      className="hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleTicketClick(ticket.id)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedTickets.includes(ticket.id)}
                          onCheckedChange={(checked) => handleTicketSelect(ticket.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{ticket.id}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {ticket.subject}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ChannelIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{ticket.channel}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                          <Badge variant={getCategoryColor(ticket.category)}>
                            {ticket.category}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{ticket.createdAt.split(' ')[0]}</div>
                          <div className="text-muted-foreground">{ticket.createdAt.split(' ')[1]}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{ticket.expectedResolution.split(' ')[0]}</div>
                          <div className={`${timeRemaining.color}`}>
                            {timeRemaining.value}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{ticket.assignedTo}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[250px]">
                          <div className="flex items-start gap-2">
                            <Zap className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {ticket.aiSuggestion}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {filteredTickets.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No tickets found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or search criteria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}