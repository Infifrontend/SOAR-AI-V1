import { useState, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarContent, AvatarFallback } from './ui/avatar';
import { 
  Search,
  Filter,
  Plus,
  Clock,
  User,
  MessageSquare,
  Phone,
  Mail,
  Globe,
  MessageCircle,
  AlertTriangle,
  ThumbsUp,
  HelpCircle,
  Zap,
  Calendar,
  MoreHorizontal,
  Eye,
  RefreshCw,
  Settings
} from 'lucide-react';

// Mock ticket data with status distribution
const initialTickets = [
  {
    id: 'TKT-2024-001',
    subject: 'Flight delay compensation',
    customer: 'John Smith',
    channel: 'WhatsApp',
    category: 'Complaint',
    priority: 'High',
    status: 'Open',
    assignedTo: 'Sarah Johnson',
    avatar: 'SJ',
    createdAt: '2024-06-17 09:30',
    expectedResolution: '2024-06-17 17:30',
    description: 'Customer experienced 4-hour flight delay on AA123',
    tags: ['compensation', 'delay'],
    aiSuggestion: 'Offer $200 compensation voucher'
  },
  {
    id: 'TKT-2024-002',
    subject: 'Seat upgrade request',
    customer: 'Sarah Johnson',
    channel: 'Email',
    category: 'Request',
    priority: 'Medium',
    status: 'AI to Address',
    assignedTo: 'Mike Davis',
    avatar: 'MD',
    createdAt: '2024-06-17 08:15',
    expectedResolution: '2024-06-18 08:15',
    description: 'Corporate traveler requesting premium seat',
    tags: ['upgrade', 'business'],
    aiSuggestion: 'Check premium economy availability'
  },
  {
    id: 'TKT-2024-003',
    subject: 'Lost baggage claim',
    customer: 'Emma Wilson',
    channel: 'Chatbot',
    category: 'Complaint',
    priority: 'High',
    status: 'In Progress',
    assignedTo: 'John Smith',
    avatar: 'JS',
    createdAt: '2024-06-17 11:20',
    expectedResolution: '2024-06-17 23:20',
    description: 'Baggage not delivered after connection',
    tags: ['baggage', 'urgent'],
    aiSuggestion: 'Initiate tracing, offer $100 interim'
  },
  {
    id: 'TKT-2024-004',
    subject: 'Excellent service feedback',
    customer: 'Mike Davis',
    channel: 'Website',
    category: 'Feedback',
    priority: 'Low',
    status: 'Moved to Passenger',
    assignedTo: 'Lisa Wong',
    avatar: 'LW',
    createdAt: '2024-06-16 15:45',
    expectedResolution: '2024-06-17 15:45',
    description: 'Positive feedback about cabin crew',
    tags: ['positive', 'service'],
    aiSuggestion: 'Send thank you and loyalty bonus'
  },
  {
    id: 'TKT-2024-005',
    subject: 'Refund processing delay',
    customer: 'Alex Thompson',
    channel: 'WhatsApp',
    category: 'Complaint',
    priority: 'Medium',
    status: 'Resolved',
    assignedTo: 'Sarah Johnson',
    avatar: 'SJ',
    createdAt: '2024-06-16 16:30',
    expectedResolution: '2024-06-18 16:30',
    description: 'Customer waiting for refund processing',
    tags: ['refund', 'processing'],
    aiSuggestion: 'Expedite refund process'
  },
  {
    id: 'TKT-2024-006',
    subject: 'Mobile app bug report',
    customer: 'Sophie Chen',
    channel: 'Email',
    category: 'Suggestion',
    priority: 'Low',
    status: 'Open',
    assignedTo: 'Mike Davis',
    avatar: 'MD',
    createdAt: '2024-06-17 14:20',
    expectedResolution: '2024-06-19 14:20',
    description: 'Reporting checkout issues in mobile app',
    tags: ['app', 'bug', 'mobile'],
    aiSuggestion: 'Forward to tech team, acknowledge issue'
  }
];

const columns = [
  { id: 'Open', title: 'Open Tickets', color: 'bg-yellow-100 border-yellow-300', headerColor: 'bg-yellow-50' },
  { id: 'AI to Address', title: 'AI to Address', color: 'bg-purple-100 border-purple-300', headerColor: 'bg-purple-50' },
  { id: 'Moved to Passenger', title: 'Moved to Passenger', color: 'bg-orange-100 border-orange-300', headerColor: 'bg-orange-50' },
  { id: 'In Progress', title: 'In Progress', color: 'bg-blue-100 border-blue-300', headerColor: 'bg-blue-50' },
  { id: 'Resolved', title: 'Resolved', color: 'bg-green-100 border-green-300', headerColor: 'bg-green-50' }
];

const ItemTypes = {
  TICKET: 'ticket'
};

interface TicketCardProps {
  ticket: any;
  onTicketClick: (ticketId: string) => void;
}

function TicketCard({ ticket, onTicketClick }: TicketCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TICKET,
    item: { id: ticket.id, status: ticket.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
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

  const calculateTimeRemaining = (expectedResolution: string) => {
    const now = new Date();
    const resolution = new Date(expectedResolution);
    const diff = resolution.getTime() - now.getTime();
    
    if (diff < 0) {
      return { value: 'Overdue', color: 'text-red-600' };
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 2) {
      return { value: `${hours}h`, color: 'text-red-600' };
    } else if (hours < 8) {
      return { value: `${hours}h`, color: 'text-yellow-600' };
    } else {
      return { value: `${hours}h`, color: 'text-green-600' };
    }
  };

  const ChannelIcon = getChannelIcon(ticket.channel);
  const CategoryIcon = getCategoryIcon(ticket.category);
  const timeRemaining = calculateTimeRemaining(ticket.expectedResolution);

  return (
    <div
      ref={drag}
      className={`p-3 bg-white border rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 ${
        isDragging ? 'opacity-50 rotate-2 scale-105' : ''
      }`}
      onClick={() => onTicketClick(ticket.id)}
    >
      {/* Priority indicator */}
      <div className={`w-full h-1 ${getPriorityColor(ticket.priority)} rounded-t-lg mb-2`} />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-medium text-sm">{ticket.id}</h4>
          <div className="flex items-center gap-1 mt-1">
            <ChannelIcon className="h-3 w-3 text-muted-foreground" />
            <Badge variant={getCategoryColor(ticket.category)} className="text-xs">
              {ticket.category}
            </Badge>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <MoreHorizontal className="h-3 w-3" />
        </Button>
      </div>

      {/* Subject */}
      <p className="text-sm font-medium mb-2 line-clamp-2">
        {ticket.subject}
      </p>

      {/* Customer */}
      <div className="flex items-center gap-2 mb-2">
        <User className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{ticket.customer}</span>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
        {ticket.description}
      </p>

      {/* Tags */}
      {ticket.tags && ticket.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {ticket.tags.slice(0, 2).map((tag: string) => (
            <span key={tag} className="px-1.5 py-0.5 bg-gray-100 text-xs rounded">
              {tag}
            </span>
          ))}
          {ticket.tags.length > 2 && (
            <span className="px-1.5 py-0.5 bg-gray-100 text-xs rounded">
              +{ticket.tags.length - 2}
            </span>
          )}
        </div>
      )}

      {/* AI Suggestion */}
      <div className="flex items-start gap-2 mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
        <Zap className="h-3 w-3 text-yellow-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-yellow-800 line-clamp-2">
          {ticket.aiSuggestion}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">{ticket.avatar}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{ticket.assignedTo}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className={`text-xs ${timeRemaining.color}`}>
            {timeRemaining.value}
          </span>
        </div>
      </div>
    </div>
  );
}

interface ColumnProps {
  column: any;
  tickets: any[];
  onDrop: (ticketId: string, newStatus: string) => void;
  onTicketClick: (ticketId: string) => void;
}

function Column({ column, tickets, onDrop, onTicketClick }: ColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.TICKET,
    drop: (item: { id: string; status: string }) => {
      if (item.status !== column.id) {
        onDrop(item.id, column.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`flex-1 min-w-0 ${isOver ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}
    >
      <div className={`${column.headerColor} border-b-2 ${column.color.split(' ')[1]} p-3 rounded-t-lg`}>
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">{column.title}</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {tickets.length}
            </Badge>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className={`${column.color} border-2 border-t-0 rounded-b-lg min-h-[600px] p-3 space-y-3`}>
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onTicketClick={onTicketClick}
          />
        ))}
        
        {tickets.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <MessageSquare className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">No tickets</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface TicketKanbanProps {
  onNavigate?: (screen: string, params?: any) => void;
}

export function TicketKanban({ onNavigate }: TicketKanbanProps) {
  const [tickets, setTickets] = useState(initialTickets);
  const [searchTerm, setSearchTerm] = useState('');
  const [assignedFilter, setAssignedFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const handleDrop = useCallback((ticketId: string, newStatus: string) => {
    setTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, status: newStatus }
          : ticket
      )
    );
    
    // Here you would typically make an API call to update the ticket status
    console.log(`Moved ticket ${ticketId} to ${newStatus}`);
  }, []);

  const handleTicketClick = (ticketId: string) => {
    if (onNavigate) {
      onNavigate('ticket-details', { ticketId });
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAssigned = assignedFilter === 'all' || ticket.assignedTo === assignedFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
    
    return matchesSearch && matchesAssigned && matchesPriority && matchesCategory;
  });

  const getTicketsForColumn = (columnId: string) => {
    return filteredTickets.filter(ticket => ticket.status === columnId);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6 p-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Ticket Board</h1>
            <p className="text-muted-foreground">Drag and drop tickets to update their status</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              Customize
            </Button>
            <Button 
              size="sm"
              onClick={() => onNavigate && onNavigate('ticket-list')}
            >
              <Eye className="h-4 w-4 mr-1" />
              List View
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-5 gap-4">
          {columns.map((column) => {
            const columnTickets = getTicketsForColumn(column.id);
            return (
              <Card key={column.id}>
                <CardContent className="p-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{columnTickets.length}</div>
                    <div className="text-sm text-muted-foreground">{column.title}</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Kanban Board */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              tickets={getTicketsForColumn(column.id)}
              onDrop={handleDrop}
              onTicketClick={handleTicketClick}
            />
          ))}
        </div>

        {/* Legend */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium mb-2">Priority Legend</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded" />
                    <span className="text-sm">High Priority</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded" />
                    <span className="text-sm">Medium Priority</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded" />
                    <span className="text-sm">Low Priority</span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Drag tickets between columns to change their status
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DndProvider>
  );
}