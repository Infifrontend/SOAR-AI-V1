import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Zap,
  Calendar,
  Phone,
  Mail,
  MessageCircle,
  Globe,
  Star,
  Award,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowRight,
  Filter,
  Download,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  HelpCircle,
  Eye
} from 'lucide-react';

// Mock data for dashboard
const ticketStatusData = [
  { status: 'Open', count: 45, color: '#f59e0b', percentage: 25 },
  { status: 'In Progress', count: 32, color: '#3b82f6', percentage: 18 },
  { status: 'AI to Address', count: 28, color: '#8b5cf6', percentage: 16 },
  { status: 'Moved to Passenger', count: 38, color: '#f97316', percentage: 21 },
  { status: 'Resolved', count: 35, color: '#10b981', percentage: 20 }
];

const agentPerformanceData = [
  { name: 'Assigned', value: 178, color: '#3b82f6' },
  { name: 'Resolved', value: 142, color: '#10b981' }
];

const categoryTrendData = [
  { month: 'Jan', Complaints: 45, Feedback: 32, Suggestions: 28, Requests: 52 },
  { month: 'Feb', Complaints: 38, Feedback: 28, Suggestions: 35, Requests: 48 },
  { month: 'Mar', Complaints: 42, Feedback: 35, Suggestions: 32, Requests: 55 },
  { month: 'Apr', Complaints: 35, Feedback: 42, Suggestions: 38, Requests: 48 },
  { month: 'May', Complaints: 48, Feedback: 38, Suggestions: 42, Requests: 62 },
  { month: 'Jun', Complaints: 52, Feedback: 45, Suggestions: 35, Requests: 58 }
];

const channelDistribution = [
  { channel: 'Email', count: 85, percentage: 35, color: '#3b82f6' },
  { channel: 'WhatsApp', count: 72, percentage: 30, color: '#10b981' },
  { channel: 'Website', count: 58, percentage: 24, color: '#8b5cf6' },
  { channel: 'Chatbot', count: 28, percentage: 11, color: '#f59e0b' }
];

const efficiencyMetrics = [
  { metric: 'Avg Response Time', value: '2.3 hrs', trend: 'down', change: '12%', color: 'text-green-600' },
  { metric: 'Resolution Rate', value: '89%', trend: 'up', change: '5%', color: 'text-green-600' },
  { metric: 'Customer Satisfaction', value: '4.6/5', trend: 'up', change: '3%', color: 'text-green-600' },
  { metric: 'First Contact Resolution', value: '76%', trend: 'up', change: '8%', color: 'text-green-600' }
];

const recentTickets = [
  {
    id: 'TKT-2024-001',
    channel: 'WhatsApp',
    category: 'Complaint',
    priority: 'High',
    status: 'Open',
    customer: 'John Smith',
    subject: 'Flight delay compensation',
    createdAt: '2024-06-17 09:30',
    expectedResolution: '2024-06-17 17:30'
  },
  {
    id: 'TKT-2024-002',
    channel: 'Email',
    category: 'Request',
    priority: 'Medium',
    status: 'In Progress',
    customer: 'Sarah Johnson',
    subject: 'Seat upgrade request',
    createdAt: '2024-06-17 08:15',
    expectedResolution: '2024-06-18 08:15'
  },
  {
    id: 'TKT-2024-003',
    channel: 'Website',
    category: 'Feedback',
    priority: 'Low',
    status: 'Resolved',
    customer: 'Mike Davis',
    subject: 'Service appreciation',
    createdAt: '2024-06-16 15:45',
    expectedResolution: '2024-06-17 15:45'
  }
];

interface CustomerSupportDashboardProps {
  onNavigate?: (screen: string, filters?: any) => void;
}

// Custom 3D Tooltip
const Custom3DTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gradient-to-br from-white via-gray-50/95 to-white backdrop-blur-xl border-0 shadow-2xl rounded-2xl p-5 transform transition-all duration-200 ease-out border border-white/20">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 rounded-2xl"></div>
        <div className="relative z-10">
          <p className="font-bold text-gray-800 mb-3 text-sm tracking-wide">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-3 text-sm mb-2 last:mb-0">
              <div 
                className="w-4 h-4 rounded-full shadow-lg ring-2 ring-white/50" 
                style={{ 
                  background: `linear-gradient(135deg, ${entry.color}, ${entry.color}DD)`,
                  boxShadow: `0 4px 12px ${entry.color}40`
                }}
              />
              <span className="font-semibold text-gray-700">
                {entry.name}: {entry.value}
              </span>
            </div>
          ))}
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-20 blur-sm"></div>
      </div>
    );
  }
  return null;
};

export function CustomerSupportDashboard({ onNavigate }: CustomerSupportDashboardProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');
  const [selectedMetric, setSelectedMetric] = useState('all');

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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Complaint': return AlertTriangle;
      case 'Feedback': return ThumbsUp;
      case 'Suggestion': return HelpCircle;
      case 'Request': return MessageCircle;
      default: return MessageSquare;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'WhatsApp': return Phone;
      case 'Email': return Mail;
      case 'Website': return Globe;
      case 'Chatbot': return MessageCircle;
      default: return MessageSquare;
    }
  };

  const handleStatusClick = (status: string) => {
    if (onNavigate) {
      onNavigate('ticket-list', { status });
    }
  };

  const handleTicketClick = (ticketId: string) => {
    if (onNavigate) {
      onNavigate('ticket-details', { ticketId });
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Customer Support Dashboard</h2>
          <p className="text-muted-foreground">Monitor and manage customer tickets efficiently with AI-powered insights</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {ticketStatusData.map((item, index) => (
          <Card 
            key={item.status} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleStatusClick(item.status)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.status}</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.count}</div>
              <p className="text-xs text-muted-foreground">
                {item.percentage}% of total
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Alert>
        <Activity className="h-4 w-4" />
        <AlertDescription>
          <strong>Performance Update:</strong> You've resolved 142 out of 178 assigned tickets (79.8% resolution rate).
          <Button variant="link" className="p-0 ml-1">
            View detailed analytics &rarr;
          </Button>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Performance Overview
            </CardTitle>
            <CardDescription>Ticket assignment and resolution performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Assigned Tickets</span>
                <span className="font-medium">178</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Resolved Tickets</span>
                <span className="font-medium">142</span>
              </div>
              <Progress value={(142 / 178) * 100} className="h-2" />
            </div>
            
            <div className="text-center mt-6 p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-500">79.8%</div>
              <div className="text-sm text-muted-foreground">Resolution Rate</div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest ticket interactions and status changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTickets.slice(0, 4).map((ticket) => (
                <div key={ticket.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <MessageSquare className="h-4 w-4 mt-0.5 text-blue-600" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{ticket.id}</p>
                    <p className="text-sm text-muted-foreground">{ticket.subject}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={getStatusColor(ticket.status)} className="text-xs">
                        {ticket.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{ticket.createdAt}</span>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-green-500">
                    {ticket.priority}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Channel Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Channel Distribution
            </CardTitle>
            <CardDescription>Communication channels breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {channelDistribution.map((channel, index) => {
                const ChannelIcon = getChannelIcon(channel.channel);
                return (
                  <div key={channel.channel} className="flex items-center gap-3 p-3 border rounded-lg">
                    <ChannelIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{channel.channel}</div>
                      <div className="text-xs text-muted-foreground">{channel.count} tickets ({channel.percentage}%)</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Efficiency Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Efficiency Metrics
            </CardTitle>
            <CardDescription>Performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {efficiencyMetrics.map((metric, index) => {
              const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
              return (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="text-sm font-medium">{metric.metric}</div>
                    <div className="text-xl font-bold">{metric.value}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendIcon className={`h-4 w-4 ${metric.color}`} />
                    <span className={`text-sm font-medium ${metric.color}`}>{metric.change}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              AI Insights
            </CardTitle>
            <CardDescription>Smart recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <AlertCircle className="h-4 w-4 mt-0.5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Priority Alert</p>
                <p className="text-sm text-muted-foreground">3 high-priority complaints require immediate attention</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Star className="h-4 w-4 mt-0.5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Opportunity</p>
                <p className="text-sm text-muted-foreground">12 tickets can be auto-resolved using AI suggestions</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Award className="h-4 w-4 mt-0.5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Achievement</p>
                <p className="text-sm text-muted-foreground">You're performing 15% above team average this week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tickets */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Tickets
              </CardTitle>
              <CardDescription>Latest customer support tickets</CardDescription>
            </div>
            <Button variant="outline" onClick={() => onNavigate && onNavigate('ticket-list')}>
              <Eye className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTickets.map((ticket) => {
              const CategoryIcon = getCategoryIcon(ticket.category);
              const ChannelIcon = getChannelIcon(ticket.channel);
              
              return (
                <div 
                  key={ticket.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleTicketClick(ticket.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                      <CategoryIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{ticket.id}</h4>
                        <Badge variant={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {ticket.subject} • {ticket.customer}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <ChannelIcon className="h-3 w-3" />
                          {ticket.channel}
                        </span>
                        <span>{ticket.category}</span>
                        <span className={`font-medium ${getPriorityColor(ticket.priority) === 'destructive' ? 'text-red-600' : getPriorityColor(ticket.priority) === 'secondary' ? 'text-yellow-600' : 'text-green-600'}`}>
                          {ticket.priority} priority
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">{ticket.createdAt.split(' ')[0]}</div>
                      <div className="text-xs text-muted-foreground">{ticket.expectedResolution.split(' ')[0]}</div>
                    </div>
                    <Button size="sm" variant="outline">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate && onNavigate('ticket-kanban')}>
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <h3 className="font-medium">Ticket Board</h3>
            <p className="text-sm text-muted-foreground mt-1">Kanban view of tickets</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate && onNavigate('ticket-list')}>
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <h3 className="font-medium">All Tickets</h3>
            <p className="text-sm text-muted-foreground mt-1">Complete ticket list</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Zap className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <h3 className="font-medium">AI Suggestions</h3>
            <p className="text-sm text-muted-foreground mt-1">Smart recommendations</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-orange-600" />
            <h3 className="font-medium">Schedule</h3>
            <p className="text-sm text-muted-foreground mt-1">Manage your schedule</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}