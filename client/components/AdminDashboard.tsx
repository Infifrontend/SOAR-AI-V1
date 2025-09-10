import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  ComposedChart,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  Phone,
  Mail,
  Globe,
  MessageCircle,
  Target,
  Award,
  Zap,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Settings,
  Bell,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Star,
  HelpCircle,
  Flame,
  Shield,
  Timer,
  ArrowUp,
  ArrowDown,
  Minus,
  Hash,
  Percent,
  TrendingUpIcon,
  TrendingDownIcon,
  AlertCircle,
  Info,
  CheckCircle2,
  XCircle,
  User,
  Trophy,
  Gauge,
  Bolt,
  BarChart4,
  TrendingUpDown,
  UserCheck,
  Clock4,
  Target as TargetIcon,
  Crown,
  Medal,
  Sparkles
} from 'lucide-react';

// Enhanced agent performance data
const agentPerformanceData = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'SJ',
    email: 'sarah.johnson@company.com',
    department: 'Senior Support',
    status: 'online',
    // Efficiency Metrics
    ticketsResolved: 42,
    ticketsAssigned: 45,
    resolutionRate: 93.3,
    avgResolutionTime: 2.3,
    firstResponseTime: 0.8,
    // Throughput Metrics
    ticketsPerHour: 5.2,
    ticketsPerDay: 42,
    workingHours: 8,
    utilization: 94,
    // Quality Metrics
    customerSatisfaction: 4.8,
    qualityScore: 96,
    escalationRate: 4.4,
    reopenRate: 2.1,
    // Performance Indicators
    slaCompliance: 94,
    responseTimeCompliance: 98,
    activeTickets: 3,
    overdueTasks: 0,
    efficiency: 93,
    productivity: 89,
    weeklyTrend: 5.2,
    monthlyGrowth: 12.3
  },
  {
    id: 2,
    name: 'Mike Davis',
    avatar: 'MD',
    email: 'mike.davis@company.com',
    department: 'General Support',
    status: 'online',
    ticketsResolved: 33,
    ticketsAssigned: 38,
    resolutionRate: 86.8,
    avgResolutionTime: 3.1,
    firstResponseTime: 1.2,
    ticketsPerHour: 4.1,
    ticketsPerDay: 33,
    workingHours: 8,
    utilization: 87,
    customerSatisfaction: 4.5,
    qualityScore: 88,
    escalationRate: 7.9,
    reopenRate: 3.5,
    slaCompliance: 87,
    responseTimeCompliance: 92,
    activeTickets: 5,
    overdueTasks: 1,
    efficiency: 87,
    productivity: 82,
    weeklyTrend: -2.1,
    monthlyGrowth: 7.8
  },
  {
    id: 3,
    name: 'Lisa Wong',
    avatar: 'LW',
    email: 'lisa.wong@company.com',
    department: 'Technical Support',
    status: 'online',
    ticketsResolved: 39,
    ticketsAssigned: 42,
    resolutionRate: 92.9,
    avgResolutionTime: 2.7,
    firstResponseTime: 0.9,
    ticketsPerHour: 4.9,
    ticketsPerDay: 39,
    workingHours: 8,
    utilization: 92,
    customerSatisfaction: 4.7,
    qualityScore: 94,
    escalationRate: 5.2,
    reopenRate: 1.8,
    slaCompliance: 93,
    responseTimeCompliance: 96,
    activeTickets: 3,
    overdueTasks: 0,
    efficiency: 93,
    productivity: 91,
    weeklyTrend: 3.8,
    monthlyGrowth: 15.2
  },
  {
    id: 4,
    name: 'John Smith',
    avatar: 'JS',
    email: 'john.smith@company.com',
    department: 'General Support',
    status: 'away',
    ticketsResolved: 30,
    ticketsAssigned: 35,
    resolutionRate: 85.7,
    avgResolutionTime: 3.5,
    firstResponseTime: 1.5,
    ticketsPerHour: 3.8,
    ticketsPerDay: 30,
    workingHours: 8,
    utilization: 86,
    customerSatisfaction: 4.3,
    qualityScore: 85,
    escalationRate: 8.6,
    reopenRate: 4.2,
    slaCompliance: 86,
    responseTimeCompliance: 89,
    activeTickets: 5,
    overdueTasks: 2,
    efficiency: 86,
    productivity: 78,
    weeklyTrend: -1.5,
    monthlyGrowth: 4.1
  },
  {
    id: 5,
    name: 'Emma Wilson',
    avatar: 'EW',  
    email: 'emma.wilson@company.com',
    department: 'Premium Support',
    status: 'online',
    ticketsResolved: 37,
    ticketsAssigned: 40,
    resolutionRate: 92.5,
    avgResolutionTime: 2.9,
    firstResponseTime: 1.0,
    ticketsPerHour: 4.6,
    ticketsPerDay: 37,
    workingHours: 8,
    utilization: 93,
    customerSatisfaction: 4.6,
    qualityScore: 91,
    escalationRate: 6.0,
    reopenRate: 2.7,
    slaCompliance: 93,
    responseTimeCompliance: 95,
    activeTickets: 3,
    overdueTasks: 0,
    efficiency: 93,
    productivity: 87,
    weeklyTrend: 2.9,
    monthlyGrowth: 9.7
  }
];

// Team performance comparison data
const teamPerformanceData = [
  { department: 'Senior Support', efficiency: 93, throughput: 5.2, satisfaction: 4.8, agents: 1 },
  { department: 'Technical Support', efficiency: 93, throughput: 4.9, satisfaction: 4.7, agents: 1 },
  { department: 'Premium Support', efficiency: 93, throughput: 4.6, satisfaction: 4.6, agents: 1 },
  { department: 'General Support', efficiency: 86.5, throughput: 4.0, satisfaction: 4.4, agents: 2 }
];

// Performance trends data
const performanceTrendData = [
  { week: 'Week 1', efficiency: 89, throughput: 4.2, satisfaction: 4.3 },
  { week: 'Week 2', efficiency: 91, throughput: 4.5, satisfaction: 4.4 },
  { week: 'Week 3', efficiency: 88, throughput: 4.1, satisfaction: 4.2 },
  { week: 'Week 4', efficiency: 92, throughput: 4.7, satisfaction: 4.6 }
];

// Enhanced mock data with more comprehensive metrics
const volumeAnalyticsData = [
  { 
    period: 'Week 1', 
    totalTickets: 156, 
    complaints: 89, 
    requests: 45, 
    feedback: 22, 
    escalations: 12,
    avgWaitTime: 2.3,
    peakHour: '14:00',
    lowPoint: '04:00'
  },
  { 
    period: 'Week 2', 
    totalTickets: 134, 
    complaints: 76, 
    requests: 38, 
    feedback: 20, 
    escalations: 8,
    avgWaitTime: 1.9,
    peakHour: '15:00',
    lowPoint: '03:00'
  },
  { 
    period: 'Week 3', 
    totalTickets: 178, 
    complaints: 102, 
    requests: 54, 
    feedback: 22, 
    escalations: 15,
    avgWaitTime: 2.8,
    peakHour: '13:00',
    lowPoint: '05:00'
  },
  { 
    period: 'Week 4', 
    totalTickets: 165, 
    complaints: 94, 
    requests: 48, 
    feedback: 23, 
    escalations: 11,
    avgWaitTime: 2.2,
    peakHour: '14:00',
    lowPoint: '04:00'
  }
];

const channelAnalyticsData = [
  { 
    channel: 'Email', 
    volume: 156, 
    percentage: 42, 
    satisfaction: 4.3, 
    avgResolutionTime: 4.2,
    firstResponseTime: 1.2,
    escalationRate: 8.5,
    costPerTicket: 12.5,
    agentUtilization: 87,
    repeatCustomers: 23
  },
  { 
    channel: 'WhatsApp', 
    volume: 134, 
    percentage: 36, 
    satisfaction: 4.6, 
    avgResolutionTime: 2.8,
    firstResponseTime: 0.8,
    escalationRate: 5.2,
    costPerTicket: 8.3,
    agentUtilization: 92,
    repeatCustomers: 18
  },
  { 
    channel: 'Website Chat', 
    volume: 58, 
    percentage: 16, 
    satisfaction: 4.1, 
    avgResolutionTime: 3.5,
    firstResponseTime: 1.5,
    escalationRate: 12.1,
    costPerTicket: 15.2,
    agentUtilization: 78,
    repeatCustomers: 31
  },
  { 
    channel: 'Phone', 
    volume: 22, 
    percentage: 6, 
    satisfaction: 4.8, 
    avgResolutionTime: 1.2,
    firstResponseTime: 0.3,
    escalationRate: 3.8,
    costPerTicket: 25.7,
    agentUtilization: 95,
    repeatCustomers: 12
  }
];

const sentimentAnalyticsData = [
  { 
    week: 'Week 1', 
    positive: 65, 
    neutral: 25, 
    negative: 10, 
    avgRating: 4.2,
    veryPositive: 28,
    veryNegative: 3,
    emotionalIntensity: 7.2,
    keywordSentiment: { praise: 34, complaint: 8, suggestion: 23 }
  },
  { 
    week: 'Week 2', 
    positive: 68, 
    neutral: 22, 
    negative: 10, 
    avgRating: 4.3,
    veryPositive: 31,
    veryNegative: 2,
    emotionalIntensity: 7.5,
    keywordSentiment: { praise: 38, complaint: 6, suggestion: 24 }
  },
  { 
    week: 'Week 3', 
    positive: 62, 
    neutral: 28, 
    negative: 10, 
    avgRating: 4.1,
    veryPositive: 25,
    veryNegative: 4,
    emotionalIntensity: 6.8,
    keywordSentiment: { praise: 29, complaint: 12, suggestion: 21 }
  },
  { 
    week: 'Week 4', 
    positive: 70, 
    neutral: 20, 
    negative: 10, 
    avgRating: 4.4,
    veryPositive: 35,
    veryNegative: 2,
    emotionalIntensity: 7.8,
    keywordSentiment: { praise: 42, complaint: 5, suggestion: 23 }
  }
];

const slaAnalyticsData = [
  { 
    category: 'Critical Issues', 
    target: 2, 
    current: 1.8, 
    compliance: 94,
    breaches: 3,
    totalTickets: 48,
    avgResolution: 1.8,
    withinTarget: 45,
    escalated: 2
  },
  { 
    category: 'Standard Requests', 
    target: 4, 
    current: 3.2, 
    compliance: 89,
    breaches: 8,
    totalTickets: 156,
    avgResolution: 3.2,
    withinTarget: 139,
    escalated: 9
  },
  { 
    category: 'Low Priority', 
    target: 8, 
    current: 6.8, 
    compliance: 96,
    breaches: 2,
    totalTickets: 89,
    avgResolution: 6.8,
    withinTarget: 85,
    escalated: 2
  },
  { 
    category: 'General Inquiries', 
    target: 6, 
    current: 4.9, 
    compliance: 92,
    breaches: 5,
    totalTickets: 78,
    avgResolution: 4.9,
    withinTarget: 72,
    escalated: 1
  }
];

const volumeTrendData = [
  { time: '00:00', volume: 5, complaints: 2, requests: 2, feedback: 1 },
  { time: '02:00', volume: 3, complaints: 1, requests: 1, feedback: 1 },
  { time: '04:00', volume: 2, complaints: 1, requests: 1, feedback: 0 },
  { time: '06:00', volume: 8, complaints: 4, requests: 3, feedback: 1 },
  { time: '08:00', volume: 25, complaints: 12, requests: 10, feedback: 3 },
  { time: '10:00', volume: 35, complaints: 18, requests: 12, feedback: 5 },
  { time: '12:00', volume: 42, complaints: 22, requests: 15, feedback: 5 },
  { time: '14:00', volume: 38, complaints: 20, requests: 13, feedback: 5 },
  { time: '16:00', volume: 45, complaints: 25, requests: 15, feedback: 5 },
  { time: '18:00', volume: 32, complaints: 18, requests: 10, feedback: 4 },
  { time: '20:00', volume: 18, complaints: 10, requests: 6, feedback: 2 },
  { time: '22:00', volume: 12, complaints: 6, requests: 4, feedback: 2 }
];

interface AdminDashboardProps {
  onNavigate?: (screen: string, params?: any) => void;
}

// Enhanced 3D Tooltip
const Custom3DTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gradient-to-br from-white via-purple-50/95 to-white backdrop-blur-xl border-0 shadow-2xl rounded-2xl p-5 transform transition-all duration-200 ease-out border border-white/20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-pink-500/5 rounded-2xl"></div>
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
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 blur-sm"></div>
      </div>
    );
  }
  return null;
};

// Agent performance helper functions
const getPerformanceColor = (value: number, threshold: { excellent: number, good: number }) => {
  if (value >= threshold.excellent) return 'text-green-500';
  if (value >= threshold.good) return 'text-yellow-600';
  return 'text-red-600';
};

const getPerformanceBadge = (value: number, threshold: { excellent: number, good: number }) => {
  if (value >= threshold.excellent) return 'default';
  if (value >= threshold.good) return 'secondary';
  return 'destructive';
};

const getEfficiencyRank = (agents: typeof agentPerformanceData) => {
  return agents
    .sort((a, b) => b.efficiency - a.efficiency)
    .map((agent, index) => ({ ...agent, rank: index + 1 }));
};

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState<string>('all');

  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))'
  ];

  const rankedAgents = getEfficiencyRank(agentPerformanceData);
  const topPerformer = rankedAgents[0];
  const teamAvgEfficiency = agentPerformanceData.reduce((sum, agent) => sum + agent.efficiency, 0) / agentPerformanceData.length;
  const teamAvgThroughput = agentPerformanceData.reduce((sum, agent) => sum + agent.ticketsPerHour, 0) / agentPerformanceData.length;
  const teamAvgSatisfaction = agentPerformanceData.reduce((sum, agent) => sum + agent.customerSatisfaction, 0) / agentPerformanceData.length;

  return (
    <div className="space-y-6 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive analytics for volume, channels, sentiment, SLA management, and agent performance</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
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

      <Tabs defaultValue="agents" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6 bg-gray-50/50 p-1 rounded-xl border border-gray-200/50">
          <TabsTrigger value="agents">
            Agent Performance
          </TabsTrigger>
          <TabsTrigger value="volumes">
            Volume Analytics
          </TabsTrigger>
          <TabsTrigger value="channels">
            Channel Analysis
          </TabsTrigger>
          <TabsTrigger 
            value="sentiment"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            Sentiment Trends
          </TabsTrigger>
          <TabsTrigger 
            value="sla"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            SLA Management
          </TabsTrigger>
        </TabsList>

        {/* Agent Performance Tab */}
        <TabsContent value="agents" className="space-y-6">
          {/* Team Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Efficiency</CardTitle>
                <Gauge className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teamAvgEfficiency.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+2.3%</span> vs last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Throughput</CardTitle>
                <Bolt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teamAvgThroughput.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">tickets/hour</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Satisfaction</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teamAvgSatisfaction.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">out of 5.0</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
                <Crown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{topPerformer.name}</div>
                <p className="text-xs text-muted-foreground">{topPerformer.efficiency}% efficiency</p>
              </CardContent>
            </Card>
          </div>

          {/* Agent Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Individual Agent Performance
              </CardTitle>
              <CardDescription>Comprehensive performance metrics for each team member</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left p-4 font-semibold text-gray-700">Agent</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Efficiency</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Throughput</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Satisfaction</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Resolution Rate</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Avg Time</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Active</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankedAgents.map((agent, index) => (
                      <tr key={agent.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-gradient-to-br from-secondary to-secondary text-primary font-semibold">
                                  {agent.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                agent.status === 'online' ? 'bg-primary' : 'bg-muted-foreground'
                              }`}></div>
                              {agent.rank <= 3 && (
                                <div className="absolute -top-2 -left-2">
                                  {agent.rank === 1 && <Crown className="h-4 w-4 text-primary" />}
                                  {agent.rank === 2 && <Medal className="h-4 w-4 text-muted-foreground" />}
                                  {agent.rank === 3 && <Medal className="h-4 w-4 text-muted-foreground" />}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-semibold">{agent.name}</div>
                              <div className="text-sm text-gray-500">{agent.department}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-center p-4">
                          <div className="flex flex-col items-center gap-1">
                            <div className={`font-bold text-lg ${getPerformanceColor(agent.efficiency, { excellent: 90, good: 80 })}`}>
                              {agent.efficiency}%
                            </div>
                            <Progress value={agent.efficiency} className="w-16 h-2" />
                          </div>
                        </td>
                        <td className="text-center p-4">
                          <div className="font-semibold text-lg">{agent.ticketsPerHour}</div>
                          <div className="text-sm text-gray-500">tickets/hr</div>
                        </td>
                        <td className="text-center p-4">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-semibold">{agent.customerSatisfaction}</span>
                          </div>
                        </td>
                        <td className="text-center p-4">
                          <Badge variant={getPerformanceBadge(agent.resolutionRate, { excellent: 90, good: 80 })}>
                            {agent.resolutionRate.toFixed(1)}%
                          </Badge>
                        </td>
                        <td className="text-center p-4">
                          <span className="font-semibold">{agent.avgResolutionTime}h</span>
                        </td>
                        <td className="text-center p-4">
                          <div className="flex flex-col items-center">
                            <span className="font-bold">{agent.activeTickets}</span>
                            {agent.overdueTasks > 0 && (
                              <span className="text-xs text-red-600">
                                {agent.overdueTasks} overdue
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="text-center p-4">
                          <div className="flex items-center justify-center">
                            {agent.status === 'online' ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <Clock className="h-5 w-5 text-yellow-600" />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Performance Charts */}
          <div 
            className="grid grid-cols-1 lg:grid-cols-2" 
            style={{ 
              gap: 'var(--space-3xl)', /* 16px consistent with theme */
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-lg)', /* 18px consistent body text */
              lineHeight: '1.4'
            }}
          >
            <Card style={{ 
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              border: '1px solid #E6EAEF',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--card)',
              fontFamily: 'var(--font-family)'
            }}>
              <CardHeader style={{ 
                paddingTop: 'var(--space-3xl)', /* 16px */
                paddingBottom: 'var(--space-xl)', /* 8px */
                paddingLeft: 'var(--space-3xl)', /* 16px */
                paddingRight: 'var(--space-3xl)' /* 16px */
              }}>
                <CardTitle 
                  className="flex items-center gap-2" 
                  style={{ 
                    fontSize: 'var(--text-xl)', /* 20px */
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--foreground)',
                    fontFamily: 'var(--font-family)',
                    lineHeight: '1.2',
                    marginBottom: 'var(--space-sm)' /* 2px */
                  }}
                >
                  <TrendingUp className="h-5 w-5" style={{ color: 'var(--primary)' }} />
                  Performance Trends
                </CardTitle>
                <CardDescription style={{ 
                  fontSize: 'var(--text-base)', /* 16px */
                  color: 'var(--muted-foreground)',
                  fontFamily: 'var(--font-family)',
                  lineHeight: '1.3',
                  marginBottom: '0'
                }}>
                  Weekly team performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent style={{ 
                paddingTop: '0',
                paddingBottom: 'var(--space-3xl)', /* 16px */
                paddingLeft: 'var(--space-3xl)', /* 16px */
                paddingRight: 'var(--space-3xl)' /* 16px */
              }}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceTrendData}>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="var(--border)" 
                      opacity={0.3}
                    />
                    <XAxis 
                      dataKey="week" 
                      tick={{ 
                        fontSize: 'var(--text-sm)', /* 14px */
                        fontFamily: 'var(--font-family)',
                        fill: 'var(--muted-foreground)'
                      }}
                      axisLine={{ stroke: 'var(--border)' }}
                      tickLine={{ stroke: 'var(--border)' }}
                    />
                    <YAxis 
                      tick={{ 
                        fontSize: 'var(--text-sm)', /* 14px */
                        fontFamily: 'var(--font-family)',
                        fill: 'var(--muted-foreground)'
                      }}
                      axisLine={{ stroke: 'var(--border)' }}
                      tickLine={{ stroke: 'var(--border)' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'var(--popover)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--popover-foreground)',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                      labelStyle={{
                        color: 'var(--foreground)',
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--foreground)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="efficiency" 
                      stroke="hsl(var(--chart-1))" 
                      strokeWidth={2.5} 
                      name="Efficiency %" 
                      dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: 'hsl(var(--chart-1))', stroke: 'var(--card)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="throughput" 
                      stroke="hsl(var(--chart-2))" 
                      strokeWidth={2.5} 
                      name="Throughput" 
                      dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: 'hsl(var(--chart-2))', stroke: 'var(--card)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="satisfaction" 
                      stroke="hsl(var(--chart-3))" 
                      strokeWidth={2.5} 
                      name="Satisfaction" 
                      dot={{ fill: 'hsl(var(--chart-3))', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: 'hsl(var(--chart-3))', stroke: 'var(--card)' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card style={{ 
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              border: '1px solid #E6EAEF',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--card)',
              fontFamily: 'var(--font-family)'
            }}>
              <CardHeader style={{ 
                paddingTop: 'var(--space-3xl)', /* 16px */
                paddingBottom: 'var(--space-xl)', /* 8px */
                paddingLeft: 'var(--space-3xl)', /* 16px */
                paddingRight: 'var(--space-3xl)' /* 16px */
              }}>
                <CardTitle 
                  className="flex items-center gap-2" 
                  style={{ 
                    fontSize: 'var(--text-xl)', /* 20px */
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--foreground)',
                    fontFamily: 'var(--font-family)',
                    lineHeight: '1.2',
                    marginBottom: 'var(--space-sm)' /* 2px */
                  }}
                >
                  <BarChart3 className="h-5 w-5" style={{ color: 'var(--primary)' }} />
                  Department Comparison
                </CardTitle>
                <CardDescription style={{ 
                  fontSize: 'var(--text-base)', /* 16px */
                  color: 'var(--muted-foreground)',
                  fontFamily: 'var(--font-family)',
                  lineHeight: '1.3',
                  marginBottom: '0'
                }}>
                  Performance metrics by department
                </CardDescription>
              </CardHeader>
              <CardContent style={{ 
                paddingTop: '0',
                paddingBottom: 'var(--space-3xl)', /* 16px */
                paddingLeft: 'var(--space-3xl)', /* 16px */
                paddingRight: 'var(--space-3xl)' /* 16px */
              }}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={teamPerformanceData}>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="var(--border)" 
                      opacity={0.3}
                    />
                    <XAxis 
                      dataKey="department" 
                      tick={{ 
                        fontSize: 'var(--text-sm)', /* 14px */
                        fontFamily: 'var(--font-family)',
                        fill: 'var(--muted-foreground)'
                      }}
                      axisLine={{ stroke: 'var(--border)' }}
                      tickLine={{ stroke: 'var(--border)' }}
                    />
                    <YAxis 
                      tick={{ 
                        fontSize: 'var(--text-sm)', /* 14px */
                        fontFamily: 'var(--font-family)',
                        fill: 'var(--muted-foreground)'
                      }}
                      axisLine={{ stroke: 'var(--border)' }}
                      tickLine={{ stroke: 'var(--border)' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'var(--popover)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--popover-foreground)',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                      labelStyle={{
                        color: 'var(--foreground)',
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--foreground)'
                      }}
                    />
                    <Bar 
                      dataKey="efficiency" 
                      fill="var(--primary)" 
                      name="Efficiency %" 
                      radius={[2, 2, 0, 0]}
                      stroke="var(--primary)"
                      strokeWidth={1}
                    />
                    <Bar 
                      dataKey="throughput" 
                      fill="hsl(var(--chart-2))" 
                      name="Throughput" 
                      radius={[2, 2, 0, 0]}
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={1}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Volume Analytics Tab */}
        <TabsContent value="volumes" className="space-y-6">
          {/* Volume Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">633</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+8.2%</span> vs last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">158</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-600">-2.1%</span> vs last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Peak Hour</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">14:00</div>
                <p className="text-xs text-muted-foreground">45 tickets at peak</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Escalation Rate</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7.2%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">-1.8%</span> improvement
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Volume Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  24-Hour Volume Distribution
                </CardTitle>
                <CardDescription>Hourly ticket volume breakdown by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={volumeTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="volume" 
                      stroke="#f97316" 
                      strokeWidth={2}
                      fill="#f97316"
                      fillOpacity={0.1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Category Breakdown
                </CardTitle>
                <CardDescription>Volume distribution by ticket category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={volumeAnalyticsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="complaints" fill="#ef4444" name="Complaints" />
                    <Bar dataKey="requests" fill="#3b82f6" name="Requests" />
                    <Bar dataKey="feedback" fill="#10b981" name="Feedback" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Channel Analysis Tab */}
        <TabsContent value="channels" className="space-y-6">
          {/* Channel Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Channel</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Email</div>
                <p className="text-xs text-muted-foreground">42% of volume</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Best Satisfaction</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Phone</div>
                <p className="text-xs text-muted-foreground">4.8/5 rating</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Most Efficient</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">WhatsApp</div>
                <p className="text-xs text-muted-foreground">2.8h avg time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cost Leader</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">WhatsApp</div>
                <p className="text-xs text-muted-foreground">$8.30 per ticket</p>
              </CardContent>
            </Card>
          </div>

          {/* Channel Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Channel Performance Analysis
              </CardTitle>
              <CardDescription>Comprehensive metrics across all communication channels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left p-4 font-semibold text-gray-700">Channel</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Volume</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Satisfaction</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Avg Resolution</th>
                      <th className="text-center p-4 font-semibold text-gray-700">First Response</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Escalation Rate</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Cost/Ticket</th>
                    </tr>
                  </thead>
                  <tbody>
                    {channelAnalyticsData.map((channel, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-purple-200">
                              {channel.channel === 'Email' && <Mail className="h-4 w-4 text-blue-600" />}
                              {channel.channel === 'WhatsApp' && <MessageCircle className="h-4 w-4 text-green-600" />}
                              {channel.channel === 'Website Chat' && <Globe className="h-4 w-4 text-purple-600" />}
                              {channel.channel === 'Phone' && <Phone className="h-4 w-4 text-orange-600" />}
                            </div>
                            <span className="font-semibold">{channel.channel}</span>
                          </div>
                        </td>
                        <td className="text-center p-4">
                          <div className="font-bold text-lg">{channel.volume}</div>
                          <div className="text-sm text-gray-600">{channel.percentage}%</div>
                        </td>
                        <td className="text-center p-4">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-semibold">{channel.satisfaction}</span>
                          </div>
                        </td>
                        <td className="text-center p-4">
                          <span className="font-semibold">{channel.avgResolutionTime}h</span>
                        </td>
                        <td className="text-center p-4">
                          <span className="font-semibold">{channel.firstResponseTime}h</span>
                        </td>
                        <td className="text-center p-4">
                          <Badge variant={channel.escalationRate > 10 ? "destructive" : channel.escalationRate > 5 ? "secondary" : "default"}>
                            {channel.escalationRate}%
                          </Badge>
                        </td>
                        <td className="text-center p-4">
                          <span className="font-semibold">${channel.costPerTicket}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sentiment Trends Tab */}
        <TabsContent value="sentiment" className="space-y-6">
          {/* Sentiment Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Positive Sentiment</CardTitle>
                <ThumbsUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+3.2%</span> vs last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Neutral Sentiment</CardTitle>
                <Minus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">22%</div>
                <p className="text-xs text-muted-foreground">Stable range</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Negative Sentiment</CardTitle>
                <ThumbsDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">10%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">-1.1%</span> improvement
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.3</div>
                <p className="text-xs text-muted-foreground">Out of 5.0</p>
              </CardContent>
            </Card>
          </div>

          {/* Sentiment Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Sentiment Trends Over Time
                </CardTitle>
                <CardDescription>Weekly sentiment analysis tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sentimentAnalyticsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={2} name="Positive" />
                    <Line type="monotone" dataKey="neutral" stroke="#6b7280" strokeWidth={2} name="Neutral" />
                    <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2} name="Negative" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Current Sentiment Distribution
                </CardTitle>
                <CardDescription>This week's sentiment breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Positive', value: 70, fill: '#10b981' },
                        { name: 'Neutral', value: 20, fill: '#6b7280' },
                        { name: 'Negative', value: 10, fill: '#ef4444' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {[{ name: 'Positive', value: 70, fill: '#10b981' },
                        { name: 'Neutral', value: 20, fill: '#6b7280' },
                        { name: 'Negative', value: 10, fill: '#ef4444' }].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SLA Management Tab */}
        <TabsContent value="sla" className="space-y-6">
          {/* SLA Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-600">-2.3%</span> vs last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Breaches</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Resolution</CardTitle>
                <Timer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2h</div>
                <p className="text-xs text-muted-foreground">Across all categories</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
                <Flame className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94%</div>
                <p className="text-xs text-muted-foreground">Within 2h target</p>
              </CardContent>
            </Card>
          </div>

          {/* SLA Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                SLA Performance by Category
              </CardTitle>
              <CardDescription>Detailed breakdown of service level agreement compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left p-4 font-semibold text-gray-700">Category</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Target</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Current Avg</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Compliance</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Breaches</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Total Tickets</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slaAnalyticsData.map((sla, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${
                              sla.category === 'Critical Issues' ? 'from-red-100 to-orange-200' :
                              sla.category === 'Standard Requests' ? 'from-blue-100 to-cyan-200' :
                              sla.category === 'Low Priority' ? 'from-green-100 to-emerald-200' :
                              'from-purple-100 to-pink-200'
                            }`}>
                              {sla.category === 'Critical Issues' && <Flame className="h-4 w-4 text-red-600" />}
                              {sla.category === 'Standard Requests' && <MessageSquare className="h-4 w-4 text-blue-600" />}
                              {sla.category === 'Low Priority' && <Info className="h-4 w-4 text-green-600" />}
                              {sla.category === 'General Inquiries' && <HelpCircle className="h-4 w-4 text-purple-600" />}
                            </div>
                            <span className="font-semibold">{sla.category}</span>
                          </div>
                        </td>
                        <td className="text-center p-4">
                          <span className="font-bold text-lg">{sla.target}h</span>
                        </td>
                        <td className="text-center p-4">
                          <div className={`font-semibold ${sla.current <= sla.target ? 'text-green-600' : 'text-red-600'}`}>
                            {sla.current}h
                          </div>
                        </td>
                        <td className="text-center p-4">
                          <div className="flex items-center justify-center gap-2">
                            <Progress value={sla.compliance} className="w-16 h-2" />
                            <span className="font-semibold">{sla.compliance}%</span>
                          </div>
                        </td>
                        <td className="text-center p-4">
                          <Badge variant={sla.breaches > 5 ? "destructive" : sla.breaches > 2 ? "secondary" : "default"}>
                            {sla.breaches}
                          </Badge>
                        </td>
                        <td className="text-center p-4">
                          <span className="font-semibold">{sla.totalTickets}</span>
                        </td>
                        <td className="text-center p-4">
                          <div className="flex items-center justify-center">
                            {sla.compliance >= 95 ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : sla.compliance >= 90 ? (
                              <AlertCircle className="h-5 w-5 text-yellow-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}