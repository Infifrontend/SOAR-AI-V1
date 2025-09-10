
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Skeleton } from './ui/skeleton';
import { useLeadApi } from '../hooks/api/useLeadApi';
import { toast } from 'sonner';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Mail, 
  Phone, 
  Calendar, 
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Filter,
  Download,
  Send,
  Eye,
  Edit,
  BarChart3,
  MessageSquare,
  Star,
  ArrowRight,
  Zap,
  Brain,
  Globe,
  Building2,
  DollarSign,
  ExternalLink
} from 'lucide-react';

interface LeadManagementProps {
  onNavigate: (screen: string, filters?: any) => void;
}

export function LeadManagement({ onNavigate }: LeadManagementProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('all_time');
  const { getLeadStats, getRecentActivity, getTopLeads } = useLeadApi();
  const [leadStats, setLeadStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [topLeads, setTopLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setDataError(null);
      
      try {
        // Fetch all data in parallel for better performance
        const [stats, activity, leads] = await Promise.allSettled([
          getLeadStats(selectedPeriod),
          getRecentActivity(10),
          getTopLeads(5)
        ]);

        // Handle lead statistics
        if (stats.status === 'fulfilled') {
          setLeadStats(stats.value);
        } else {
          console.error('Failed to fetch lead stats:', stats.reason);
          setLeadStats({
            totalLeads: 0,
            qualifiedLeads: 0,
            unqualified: 0,
            contacted: 0,
            responded: 0,
            conversionRate: 0,
            emailOpenRate: 0,
            emailOpenRateChange: 0,
            avgResponseTime: '0 hours',
            avgResponseTimeChange: 'No change',
            totalChange: 0
          });
        }

        // Handle recent activity
        if (activity.status === 'fulfilled') {
          setRecentActivity(activity.value);
        } else {
          console.error('Failed to fetch recent activity:', activity.reason);
          setRecentActivity([]);
        }

        // Handle top leads
        if (leads.status === 'fulfilled') {
          setTopLeads(leads.value);
        } else {
          console.error('Failed to fetch top leads:', leads.reason);
          setTopLeads([]);
        }

        // Check if all requests failed
        const allFailed = [stats, activity, leads].every(result => result.status === 'rejected');
        if (allFailed) {
          setDataError('Failed to load dashboard data. Please check your connection and try again.');
        }

      } catch (error) {
        console.error('Error fetching lead data:', error);
        setDataError('An unexpected error occurred while loading the dashboard.');
        toast.error('Failed to fetch lead data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [getLeadStats, getRecentActivity, getTopLeads, selectedPeriod]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'qualified': return 'default';
      case 'contacted': return 'secondary';
      case 'responded': return 'outline';
      case 'unqualified': return 'destructive';
      default: return 'outline';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'qualification': return UserCheck;
      case 'email': return Mail;
      case 'response': return MessageSquare;
      case 'disqualification': return UserX;
      default: return Activity;
    }
  };

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case 'High': return 'text-green-500';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Refresh dashboard data
  const refreshDashboard = async () => {
    setIsLoading(true);
    setDataError(null);
    
    try {
      const [stats, activity, leads] = await Promise.allSettled([
        getLeadStats(selectedPeriod),
        getRecentActivity(10),
        getTopLeads(5)
      ]);

      if (stats.status === 'fulfilled') setLeadStats(stats.value);
      if (activity.status === 'fulfilled') setRecentActivity(activity.value);
      if (leads.status === 'fulfilled') setTopLeads(leads.value);

      toast.success('Dashboard data refreshed successfully');
    } catch (error) {
      setDataError('Failed to refresh dashboard data');
      toast.error('Failed to refresh dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to render skeleton loaders
  const renderKeyMetricSkeleton = () => (
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="bg-gray-200 h-4 w-1/2" />
        <Skeleton className="bg-gray-200 h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="bg-gray-200 h-8 w-1/3 mb-1" />
        <Skeleton className="bg-gray-200 h-3 w-1/2" />
      </CardContent>
    </Card>
  );

  const renderActivitySkeleton = () => (
    <div className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg bg-white">
      <Skeleton className="bg-gray-200  w-4 h-4 rounded-full mt-0.5" />
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-2">
            <Skeleton className="bg-gray-200 h-4 w-32" />
            <Skeleton className="bg-gray-200 h-3 w-48" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Skeleton className="bg-gray-200 h-5 w-20" />
            <Skeleton className="bg-gray-200 h-3 w-16" />
          </div>
        </div>
        <Skeleton className="bg-gray-200 h-5 w-24" />
      </div>
    </div>
  );

  const renderTopLeadSkeleton = () => (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-white border-gray-100">
      <div className="flex items-center gap-4">
        <Skeleton className="flex items-center justify-center w-10 h-10 rounded-lg" />
        <div>
          <div className="flex items-center gap-2">
            <Skeleton className="bg-gray-200 h-4 w-24" />
            <Skeleton className="bg-gray-200 h-5 w-16" />
          </div>
          <Skeleton className="bg-gray-200 h-3 w-32 mt-1" />
          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
            <Skeleton className="bg-gray-200 h-3 w-16" />
            <Skeleton className="bg-gray-200 h-3 w-24" />
            <Skeleton className="bg-gray-200 h-3 w-20" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <Skeleton className="bg-gray-200 h-4 w-20 mb-1" />
          <Skeleton className="bg-gray-200 h-3 w-12" />
        </div>
        <div className="text-right">
          <Skeleton className="bg-gray-200 h-3 w-24" />
          <Skeleton className="bg-gray-200 h-3 w-16" />
        </div>
        <Skeleton className="bg-gray-200 h-8 w-8" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/30 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-600 mt-1">Manage qualified and disqualified leads with automated email campaigns</p>
          {dataError && (
            <Alert className="mt-2 bg-red-50 border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {dataError}
                <Button 
                  variant="link" 
                  className="p-0 ml-2 text-red-700 hover:text-red-800" 
                  onClick={refreshDashboard}
                  disabled={isLoading}
                >
                  Try again
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="bg-white border-gray-200 hover:bg-gray-50 cls-addcomapany" 
            onClick={refreshDashboard}
            disabled={isLoading}
          >
            <Activity className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </Button>
          <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50 cls-addcomapany" onClick={() => onNavigate('email-campaigns')}>
            <Mail className="h-4 w-4 mr-2" />
            Email Campaigns
          </Button>
          <Button className="bg-[#FD9646] hover:bg-[#FD9646]/90 text-white" onClick={() => onNavigate('leads-list')}>
            <Users className="h-4 w-4 mr-2" />
            View All Leads
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isLoading ? (
          <>
            {renderKeyMetricSkeleton()}
            {renderKeyMetricSkeleton()}
            {renderKeyMetricSkeleton()}
            {renderKeyMetricSkeleton()}
          </>
        ) : (
          <>
            <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-600">Total Leads</CardTitle>
                  <div className="text-3xl font-bold text-gray-900 mt-2">{leadStats?.totalLeads?.toLocaleString() || '0'}</div>
                </div>
                <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-500">
                  <span className="text-green-500 font-medium">+{leadStats?.totalChange || 0}%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-600">Qualified Leads</CardTitle>
                  <div className="text-3xl font-bold text-gray-900 mt-2">{leadStats?.qualifiedLeads || '0'}</div>
                </div>
                <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-500">
                  <span className="text-green-500 font-medium">+{leadStats?.conversionRate || 0}%</span> conversion rate
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-600">Email Open Rate</CardTitle>
                  <div className="text-3xl font-bold text-gray-900 mt-2">{leadStats?.emailOpenRate || '0'}%</div>
                </div>
                <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Mail className="h-6 w-6 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-500">
                  <span className="text-green-500 font-medium">+{leadStats?.emailOpenRateChange || 0}%</span> from last campaign
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-600">Avg Response Time</CardTitle>
                  <div className="text-3xl font-bold text-gray-900 mt-2">{leadStats?.avgResponseTime || '0'}</div>
                </div>
                <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-500">
                  <span className="text-green-500 font-medium">{leadStats?.avgResponseTimeChange || 'No change'}</span> improvement
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8 bg-white border border-gray-200 p-1 rounded-lg">
          <TabsTrigger 
            value="overview"
            className="rounded-md px-4 py-2 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 font-medium text-gray-600 hover:text-gray-900 transition-all duration-200"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="qualified"
            className="rounded-md px-4 py-2 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 font-medium text-gray-600 hover:text-gray-900 transition-all duration-200"
          >
            Qualified Leads
          </TabsTrigger>
          <TabsTrigger 
            value="unqualified"
            className="rounded-md px-4 py-2 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 font-medium text-gray-600 hover:text-gray-900 transition-all duration-200"
          >
            Disqualified Leads
          </TabsTrigger>
          <TabsTrigger 
            value="campaigns"
            className="rounded-md px-4 py-2 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 font-medium text-gray-600 hover:text-gray-900 transition-all duration-200"
          >
            Email Campaigns
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          {/* Lead Pipeline and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Lead Pipeline Card */}
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                      <Target className="h-5 w-5 text-gray-700" />
                      Lead Pipeline
                    </CardTitle>
                    <CardDescription className="text-gray-500 mt-1">Current lead distribution and conversion funnel</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="bg-gray-200 h-4 w-full" />
                    <Skeleton className="bg-gray-200 h-4 w-full" />
                    <Skeleton className="bg-gray-200 h-4 w-full" />
                    <Skeleton className="bg-gray-200 h-4 w-full" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Total Leads</span>
                        <span className="font-bold text-lg text-gray-900">{leadStats?.totalLeads?.toLocaleString() || 0}</span>
                      </div>
                      <Progress value={100} className="h-3 bg-gray-100" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Contacted</span>
                        <span className="font-bold text-lg text-gray-900">{leadStats?.contacted || 0}</span>
                      </div>
                      <Progress 
                        value={leadStats ? (leadStats.contacted / leadStats.totalLeads) * 100 : 0} 
                        className="h-3 bg-gray-100"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Qualified</span>
                        <span className="font-bold text-lg text-gray-900">{leadStats?.qualifiedLeads || 0}</span>
                      </div>
                      <Progress 
                        value={leadStats ? (leadStats.qualifiedLeads / leadStats.totalLeads) * 100 : 0} 
                        className="h-3 bg-gray-100"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Responded</span>
                        <span className="font-bold text-lg text-gray-900">{leadStats?.responded || 0}</span>
                      </div>
                      <Progress 
                        value={leadStats ? (leadStats.responded / leadStats.totalLeads) * 100 : 0} 
                        className="h-3 bg-gray-100"
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity Card */}
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Activity className="h-5 w-5 text-gray-700" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-gray-500 mt-1">Latest lead interactions and status changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4  max-h-[60vh] overflow-y-auto">
                  {isLoading ? (
                    <>
                      {[...Array(4)].map((_, index) => (
                        <div key={index}>
                          {renderActivitySkeleton()}
                        </div>
                      ))}
                    </>
                  ) : recentActivity.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No recent activity found</p>
                    </div>
                  ) : (
                    recentActivity.map((activity, index) => {
                      const getActivityIcon = (type: string) => {
                        switch (type) {
                          case 'qualification': return <UserCheck className="h-4 w-4 text-green-500" />;
                          case 'disqualification': return <UserX className="h-4 w-4 text-red-500" />;
                          case 'email': return <Mail className="h-4 w-4 text-blue-500" />;
                          case 'response': return <MessageSquare className="h-4 w-4 text-purple-500" />;
                          default: return <CheckCircle className="h-4 w-4 text-gray-500" />;
                        }
                      };

                      const getStatusBadge = (status: string) => {
                        switch (status) {
                          case 'qualified': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-0">Qualified</Badge>;
                          case 'unqualified': return <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">Unqualified</Badge>;
                          case 'contacted': return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Contacted</Badge>;
                          case 'responded': return <Badge variant="outline" className="border-gray-300">Responded</Badge>;
                          default: return <Badge variant="outline" className="border-gray-300">Unknown</Badge>;
                        }
                      };

                      return (
                        <div key={index} className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex-shrink-0 mt-0.5">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-medium text-gray-900">{activity.lead}</h4>
                                <p className="text-sm text-gray-600 mt-1">{activity.action}</p>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                {getStatusBadge(activity.status)}
                                <span className="text-xs text-gray-500">{activity.time}</span>
                              </div>
                            </div>
                            <div className="mt-2">
                              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                {activity.value}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Qualified Leads Section */}
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <Star className="h-5 w-5 text-gray-700" />
                    Top Qualified Leads
                  </CardTitle>
                  <CardDescription className="text-gray-500 mt-1">High-priority leads requiring immediate attention</CardDescription>
                </div>
                <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50" onClick={() => onNavigate('leads-list',{
                search: "",
                status: "qualified",
                industry: "",
                score: "",
                engagement: ""
              })}>
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <>
                    {[...Array(3)].map((_, index) => (
                      <div key={index}>
                        {renderTopLeadSkeleton()}
                      </div>
                    ))}
                  </>
                ) : topLeads.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No qualified leads found</p>
                  </div>
                ) : (
                  topLeads.map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                          <Building2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">{lead.company}</h4>
                            <Badge variant={getStatusColor(lead.status)} className="text-xs">
                              {lead.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {lead.contact} • {lead.title}
                          </p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                            <span>{lead.industry}</span>
                            <span>{lead.employees?.toLocaleString()} employees</span>
                            <span className={`font-medium ${getEngagementColor(lead.engagement)}`}>
                              {lead.engagement} engagement
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium text-green-600">{lead.value}</div>
                          <div className="text-sm text-gray-500">Score: {lead.score}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-700">{lead.nextAction}</div>
                          <div className="text-xs text-gray-500">Last: {lead.lastContact}</div>
                        </div>
                        {/* <Button size="sm" variant="outline" className="hover:bg-gray-50">
                          <ArrowRight className="h-4 w-4" />
                        </Button> */}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-green-50 border-green-200" onClick={() => onNavigate('leads-list',{
                search: "",
                status: "qualified",
                industry: "",
                score: "",
                engagement: ""
              })}>
              <CardContent className="p-6 text-center">
                <UserCheck className="h-8 w-8 mx-auto mb-3 text-green-600" />
                <h3 className="font-semibold text-gray-900">Qualified Leads</h3>
                <p className="text-sm text-gray-600 mt-2">Manage high-potential prospects</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-red-50 border-red-200" onClick={() => onNavigate('leads-list',{
                search: "",
                status: "unqualified",
                industry: "",
                score: "",
                engagement: ""
              })}>
              <CardContent className="p-6 text-center">
                <UserX className="h-8 w-8 mx-auto mb-3 text-red-600" />
                <h3 className="font-semibold text-gray-900">Disqualified Leads</h3>
                <p className="text-sm text-gray-600 mt-2">Review and nurture prospects</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-blue-50 border-blue-200" onClick={() => onNavigate('email-campaigns')}>
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Email Campaigns</h3>
                <p className="text-sm text-gray-600 mt-2">Automated outreach and follow-ups</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-purple-50 border-purple-200" onClick={() => onNavigate('leads-list')}>
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Lead Analytics</h3>
                <p className="text-sm text-gray-600 mt-2">Performance and conversion metrics</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="qualified">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              You have {leadStats?.qualifiedLeads || 0} qualified leads. 
              <Button variant="link" className="p-0 ml-1 text-green-700 hover:text-green-800" onClick={() => onNavigate('leads-list',{
                search: "",
                status: "qualified",
                industry: "",
                score: "",
                engagement: ""
              })}>
                View detailed qualified leads &rarr;
              </Button>
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="unqualified">
          <Alert className="bg-red-50 border-red-200">
            <UserX className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              You have {leadStats?.unqualified || 0} disqualified leads that may need attention.
              <Button variant="link" className="p-0 ml-1 text-red-700 hover:text-red-800" onClick={() => { 
                const filters = {
                  search: "",
                  status: "unqualified",
                  industry: "",
                  score: "",
                  engagement: ""
                };
                onNavigate('leads-list', filters);
              }}>
                Review disqualified leads &rarr;
              </Button>
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="campaigns">
          <Alert className="bg-blue-50 border-blue-200">
            <Mail className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Email campaigns are running with {leadStats?.emailOpenRate || 0}% open rate.
              <Button variant="link" className="p-0 ml-1 text-blue-700 hover:text-blue-800" onClick={() => onNavigate('email-campaigns')}>
                Manage email campaigns &rarr;
              </Button>
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
}
