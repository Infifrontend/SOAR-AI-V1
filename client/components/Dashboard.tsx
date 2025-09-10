import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  FileText, 
  TrendingUp,
  TrendingDown, 
  Users, 
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  Bell,
  Shield,
  Target,
  ExternalLink
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (section: string, filters?: any) => void;
}

// Mock data
const renewalTimelineData = [
  { month: 'Jan', upcoming: 4, completed: 12 },
  { month: 'Feb', upcoming: 8, completed: 9 },
  { month: 'Mar', upcoming: 6, completed: 11 },
  { month: 'Apr', upcoming: 10, completed: 8 },
  { month: 'May', upcoming: 5, completed: 13 },
  { month: 'Jun', upcoming: 7, completed: 10 }
];

const breachTrendsData = [
  { quarter: 'Q1', breaches: 8, resolved: 7, pending: 1 },
  { quarter: 'Q2', breaches: 5, resolved: 4, pending: 1 },
  { quarter: 'Q3', breaches: 3, resolved: 3, pending: 0 },
  { quarter: 'Q4', breaches: 4, resolved: 3, pending: 1 }
];

const contractStatusData = [
  { name: 'Active', value: 156, color: '#10b981' },
  { name: 'Pending', value: 18, color: '#eab308' },
  { name: 'At Risk', value: 4, color: '#ef4444' },
  { name: 'Expired', value: 12, color: '#6b7280' }
];

const notifications = [
  {
    id: 1,
    type: 'contract',
    severity: 'high',
    title: 'Contract Renewal Due',
    message: 'Global Travel Solutions contract expires in 15 days. Schedule renewal meeting.',
    time: '2 hours ago',
    action: 'Schedule Meeting'
  },
  {
    id: 2,
    type: 'breach',
    severity: 'medium',
    title: 'SLA Breach Alert',
    message: 'Premier Voyage Group has exceeded response time SLA for the second time this quarter.',
    time: '4 hours ago',
    action: 'Review Performance'
  },
  {
    id: 3,
    type: 'vendor',
    severity: 'low',
    title: 'New Vendor Application',
    message: 'Elite Business Solutions has submitted a partnership application for review.',
    time: '1 day ago',
    action: 'Review Application'
  },
  {
    id: 4,
    type: 'opportunity',
    severity: 'high',
    title: 'High-Value Opportunity',
    message: 'TechCorp International showing strong engagement. Consider priority outreach.',
    time: '1 day ago',
    action: 'Contact Now'
  }
];

const topVendors = [
  {
    name: 'Global Travel Solutions',
    contracts: 12,
    revenue: 2800000,
    riskLevel: 'Low',
    score: 98
  },
  {
    name: 'Corporate Journey Ltd',
    contracts: 8,
    revenue: 1950000,
    riskLevel: 'Low',
    score: 95
  },
  {
    name: 'Elite Business Travel',
    contracts: 6,
    revenue: 1680000,
    riskLevel: 'Medium',
    score: 92
  },
  {
    name: 'Premier Voyage Group',
    contracts: 4,
    revenue: 890000,
    riskLevel: 'High',
    score: 78
  },
  {
    name: 'Business Travel Pro',
    contracts: 3,
    revenue: 650000,
    riskLevel: 'Low',
    score: 88
  }
];

export function Dashboard({ onNavigate }: DashboardProps) {
  const Custom3DTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-700">
                {entry.name}: {entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const getSeverityIcon = (type: string) => {
    switch (type) {
      case 'contract': return Calendar;
      case 'breach': return AlertTriangle;
      case 'vendor': return Users;
      case 'opportunity': return Target;
      default: return Bell;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const handleNotificationAction = (notification: any) => {
    switch (notification.type) {
      case 'contract':
        onNavigate('contracts', { focus: 'renewals' });
        break;
      case 'breach':
        onNavigate('breach-monitoring');
        break;
      case 'vendor':
        onNavigate('vendor-search');
        break;
      case 'opportunity':
        onNavigate('qualified-leads');
        break;
      default:
        break;
    }
  };

  const handleVendorClick = (vendor: any) => {
    onNavigate('vendor-search', { vendor: vendor.name });
  };

  return (
    <div className="space-y-8 p-5">
      {/* SVG Gradients and Filters Definition */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          {/* Gradient Definitions */}
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
            <stop offset="50%" stopColor="#1e40af" stopOpacity={0.7} />
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity={0.4} />
          </linearGradient>
          <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
            <stop offset="50%" stopColor="#047857" stopOpacity={0.7} />
            <stop offset="100%" stopColor="#065f46" stopOpacity={0.4} />
          </linearGradient>
          <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9} />
            <stop offset="50%" stopColor="#d97706" stopOpacity={0.7} />
            <stop offset="100%" stopColor="#b45309" stopOpacity={0.4} />
          </linearGradient>
          <linearGradient id="redGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
            <stop offset="50%" stopColor="#dc2626" stopOpacity={0.7} />
            <stop offset="100%" stopColor="#b91c1c" stopOpacity={0.4} />
          </linearGradient>
          <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
            <stop offset="50%" stopColor="#7c3aed" stopOpacity={0.7} />
            <stop offset="100%" stopColor="#6d28d9" stopOpacity={0.4} />
          </linearGradient>
          <linearGradient id="indigoGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
            <stop offset="50%" stopColor="#4f46e5" stopOpacity={0.7} />
            <stop offset="100%" stopColor="#4338ca" stopOpacity={0.4} />
          </linearGradient>
          <linearGradient id="tealGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.9} />
            <stop offset="50%" stopColor="#0f766e" stopOpacity={0.7} />
            <stop offset="100%" stopColor="#0d544d" stopOpacity={0.4} />
          </linearGradient>
        </defs>
      </svg>

      {/* Modern Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          className="cursor-pointer group hover:shadow-lg transition-all duration-300 border border-gray-100 bg-white"
          onClick={() => onNavigate('contracts', { status: 'Active' })}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Contracts</p>
                  <p className="text-2xl font-bold text-gray-900">156</p>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-50">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500 font-medium">+12%</span>
              </div>
              <span className="text-gray-500">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer group hover:shadow-lg transition-all duration-300 border border-gray-100 bg-white"
          onClick={() => onNavigate('contracts', { dateRange: 'expiring-soon' })}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                  <p className="text-2xl font-bold text-gray-900">18</p>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-orange-600 transition-colors duration-300" />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-50">
                <Clock className="h-3 w-3 text-orange-600" />
                <span className="text-orange-600 font-medium">Next 30 days</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer group hover:shadow-lg transition-all duration-300 border border-gray-100 bg-white"
          onClick={() => onNavigate('breach-monitoring')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Breaches Reported</p>
                  <p className="text-2xl font-bold text-gray-900">4</p>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-red-600 transition-colors duration-300" />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-50">
                <TrendingDown className="h-3 w-3 text-green-500" />
                <span className="text-green-500 font-medium">-2</span>
              </div>
              <span className="text-gray-500">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer group hover:shadow-lg transition-all duration-300 border border-gray-100 bg-white"
          onClick={() => onNavigate('contracts', { tab: 'analytics' })}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">$3.58M</p>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-green-500 transition-colors duration-300" />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-50">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500 font-medium">+18%</span>
              </div>
              <span className="text-gray-500">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced 3D Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card 
          className="cursor-pointer group hover:shadow-lg transition-all duration-300 border border-gray-100 bg-white"
          onClick={() => onNavigate('contracts', { tab: 'analytics', focus: 'renewals' })}
        >
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="text-gray-900 font-semibold">
                Contract Renewal Timeline
              </span>
              <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
            </CardTitle>
            <CardDescription className="text-gray-600">Upcoming and completed contract renewals - Click to view details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative p-4 rounded-lg bg-gray-50/30">
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={renewalTimelineData}>
                  <defs>
                    <linearGradient id="upcomingGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FD9646" stopOpacity={0.8}/>
                      <stop offset="50%" stopColor="#FD9646" stopOpacity={0.6}/>
                      <stop offset="100%" stopColor="#FD9646" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#717182" stopOpacity={0.8}/>
                      <stop offset="50%" stopColor="#717182" stopOpacity={0.6}/>
                      <stop offset="100%" stopColor="#717182" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.6} />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
                  />
                  <Tooltip content={<Custom3DTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="upcoming" 
                    stackId="1" 
                    stroke="#FD9646" 
                    strokeWidth={4}
                    fill="url(#upcomingGradient)"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="completed" 
                    stackId="1" 
                    stroke="#717182" 
                    strokeWidth={4}
                    fill="url(#completedGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer group hover:shadow-lg transition-all duration-300 border border-gray-100 bg-white"
          onClick={() => onNavigate('breach-monitoring', { tab: 'analytics' })}
        >
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="text-gray-900 font-semibold">
                Breach Trends
              </span>
              <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors duration-300" />
            </CardTitle>
            <CardDescription className="text-gray-600">Quarterly breach reports and resolution status - Click to view details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative p-4 rounded-lg bg-gray-50/30">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={breachTrendsData} barGap={15}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.6} />
                  <XAxis 
                    dataKey="quarter" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
                  />
                  <Tooltip content={<Custom3DTooltip />} />
                  <Bar 
                    dataKey="breaches" 
                    fill="url(#redGradient)" 
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar 
                    dataKey="resolved" 
                    fill="url(#greenGradient)" 
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar 
                    dataKey="pending" 
                    fill="url(#yellowGradient)" 
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications Panel and Enhanced 3D Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <Card className="border border-gray-100 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-4 text-lg">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Bell className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-gray-900 font-semibold">
                  Real-time Alerts & Notifications
                </span>
              </CardTitle>
              <CardDescription className="text-gray-600 ml-16">
                Critical alerts, deadlines, and AI recommendations - Click actions to navigate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => {
                  const Icon = getSeverityIcon(notification.type);
                  return (
                    <Alert 
                      key={notification.id} 
                      className={`${getSeverityColor(notification.severity)} hover:shadow-md transition-all duration-300 border flex items-start`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex items-start justify-between w-full" style={{ marginLeft: '20px' }}>
                        <div className="flex-1 min-w-0">
                          <AlertDescription className="font-semibold mb-1 text-sm">
                            {notification.title}
                          </AlertDescription>
                          <AlertDescription className="text-sm text-gray-600 leading-relaxed">
                            {notification.message}
                          </AlertDescription>
                        </div>
                        <div className="flex items-center gap-3 ml-6 flex-shrink-0">
                          <span className="text-xs text-gray-500 font-medium">{notification.time}</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNotificationAction(notification);
                            }}
                            className="transition-all duration-300 bg-white hover:bg-gray-50 font-medium"
                          >
                            {notification.action}
                          </Button>
                        </div>
                      </div>
                    </Alert>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card 
          className="cursor-pointer group hover:shadow-lg transition-all duration-300 border border-gray-100 bg-white"
          onClick={() => onNavigate('contracts', { focus: 'status-overview' })}
        >
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="text-gray-900 font-semibold">
                Contract Status Overview
              </span>
              <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
            </CardTitle>
            <CardDescription className="text-gray-600">Current status distribution - Click to view details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative p-4 rounded-lg bg-gray-50/20 px-[16px] py-[10px]">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={contractStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={95}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {contractStatusData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke="#ffffff"
                        strokeWidth={3}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<Custom3DTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              {contractStatusData.map((item) => (
                <div 
                  key={item.name} 
                  className="group/item flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50/60 cursor-pointer transition-all duration-300 border border-gray-50 bg-gray-50/20 hover:shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('contracts', { status: item.name });
                  }}
                >
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ 
                      backgroundColor: item.color
                    }}
                  />
                  <span className="text-sm font-semibold text-gray-700">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Vendors */}
      <Card className="border border-gray-100 bg-white">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center justify-between text-xl">
            <span className="text-gray-900 font-semibold">
              Top Performing Vendors
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onNavigate('vendor-search')}
              className="hover:shadow-md transition-all duration-300 border border-gray-200 bg-white hover:bg-gray-50 font-medium"
            >
              View All Vendors
            </Button>
          </CardTitle>
          <CardDescription className="text-gray-600">AI-powered vendor ranking with risk indicators - Click vendors for details</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="space-y-2">
            {topVendors.map((vendor, index) => {
              const gradientColors = [
                'from-blue-100 to-blue-200',
                'from-green-100 to-green-200', 
                'from-orange-100 to-orange-200',
                'from-purple-100 to-purple-200',
                'from-indigo-100 to-indigo-200'
              ];
              return (
                <div 
                  key={vendor.name} 
                  className="group flex items-center justify-between p-3 border-b border-gray-100 rounded-xl cursor-pointer hover:shadow-lg transition-all duration-300 bg-gray-50/20 hover:bg-gray-50/40"
                  onClick={() => handleVendorClick(vendor)}
                >
                  <div className="flex items-center gap-6">
                    <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br ${gradientColors[index]} text-gray-700 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300`}>
                      <span className="font-bold text-lg">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 text-lg">{vendor.name}</h4>
                      <p className="text-sm text-gray-600 font-medium">
                        {vendor.contracts} contracts • ${(vendor.revenue / 1000).toFixed(0)}K revenue
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-sm font-semibold mb-2 text-gray-700">Risk Level</div>
                      <Badge 
                        variant={
                          vendor.riskLevel === 'Low' ? 'default' :
                          vendor.riskLevel === 'Medium' ? 'secondary' : 'destructive'
                        } 
                        className="shadow-sm px-3 py-1 font-medium"
                      >
                        {vendor.riskLevel}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold mb-2 text-gray-700">AI Score</div>
                      <Badge 
                        variant={vendor.score >= 95 ? "default" : vendor.score >= 90 ? "secondary" : "outline"}
                        className="shadow-sm bg-green-500 text-white border-0 px-3 py-1 font-medium"
                      >
                        {vendor.score}/100
                      </Badge>
                    </div>
                    <div className="relative">
                      <Progress value={vendor.score} className="w-28 h-3 bg-gray-200" />
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-full shadow-sm" 
                        style={{ width: `${vendor.score}%` }}
                      ></div>
                    </div>
                    <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Smart AI Recommendations */}
      <Card className="border border-gray-100 bg-white">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-4 text-xl">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-gray-900 font-semibold">
              AI-Powered Smart Recommendations
            </span>
          </CardTitle>
          <CardDescription className="text-gray-600 ml-16">Proactive insights and risk management suggestions - Click recommendations to take action</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                gradient: 'from-blue-50 to-blue-100',
                iconGradient: 'from-blue-100 to-blue-200',
                textColor: 'text-blue-800',
                icon: TrendingUp,
                title: 'Renewal Opportunity:',
                content: 'Elite Business Travel contract shows strong performance metrics. Consider early renewal with improved terms.',
                onClick: () => onNavigate('contracts', { vendor: 'Elite Business Travel', focus: 'renewal' })
              },
              {
                gradient: 'from-yellow-50 to-yellow-100',
                iconGradient: 'from-yellow-100 to-yellow-200',
                textColor: 'text-yellow-800',
                icon: Shield,
                title: 'Risk Mitigation:',
                content: 'Skyline Travel Partners showing declining performance indicators. Recommend contract review within 30 days.',
                onClick: () => onNavigate('vendor-search', { vendor: 'Skyline Travel Partners', focus: 'risk' })
              },
              {
                gradient: 'from-green-50 to-green-100',
                iconGradient: 'from-green-100 to-green-200',
                textColor: 'text-green-800',
                icon: CheckCircle,
                title: 'Cost Optimization:',
                content: 'Consolidating contracts with Global Travel Solutions could save an estimated $150K annually.',
                onClick: () => onNavigate('contracts', { focus: 'cost-optimization' })
              },
              {
                gradient: 'from-purple-50 to-purple-100',
                iconGradient: 'from-purple-100 to-purple-200',
                textColor: 'text-purple-800',
                icon: Calendar,
                title: 'Market Intelligence:',
                content: 'New vendors in Asia-Pacific region showing competitive rates. Consider RFP process for route expansion.',
                onClick: () => onNavigate('vendor-search', { region: 'Asia-Pacific', focus: 'market-expansion' })
              }
            ].map((item, index) => (
              <Alert 
                key={index}
                className="border border-gray-50 bg-gray-50/20 cursor-pointer hover:shadow-lg transition-all duration-300 flex items-start"
                onClick={item.onClick}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.iconGradient} flex items-center justify-center flex-shrink-0`}>
                  <item.icon className="h-5 w-5 text-gray-700" />
                </div>
                <div className="flex items-start justify-between w-full" style={{ marginLeft: '20px' }}>
                  <AlertDescription className="text-gray-800 flex-1">
                    <div className="leading-relaxed">
                      <span className="font-semibold">{item.title}</span> {item.content}
                    </div>
                  </AlertDescription>
                  <ExternalLink className="h-5 w-5 ml-4 flex-shrink-0 text-gray-400" />
                </div>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}