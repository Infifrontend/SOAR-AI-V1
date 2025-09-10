import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { 
  AlertTriangle, 
  Plus, 
  Eye, 
  Edit, 
  Clock, 
  CheckCircle, 
  User, 
  Calendar,
  Target,
  TrendingUp,
  Shield,
  AlertCircle,
  Filter,
  Brain,
  Send,
  Mail,
  MessageSquare,
  FileText,
  History,
  Lightbulb,
  Bell,
  ExternalLink,
  Download,
  CheckCircle2,
  XCircle,
  Timer,
  Users,
  DollarSign,
  Zap
} from 'lucide-react';

const breaches = [
  {
    id: 'BR-2024-001',
    contractId: 'CTR-2024-001',
    vendor: 'Global Travel Solutions',
    breachType: 'SLA Violation',
    severity: 'High',
    date: '2024-06-15',
    description: 'Response time exceeded 4 hours for customer support',
    status: 'In Progress',
    assignedTo: 'John Smith',
    dueDate: '2024-06-30',
    riskScore: 85,
    actionTaken: 'Vendor meeting scheduled, corrective action plan requested',
    impactLevel: 'Critical',
    financialImpact: 25000,
    affectedCustomers: 47,
    vendorContact: 'support@globaltravelsolutions.com',
    timeline: [
      { date: '2024-06-15 09:30', event: 'Breach detected by monitoring system', type: 'system' },
      { date: '2024-06-15 10:00', event: 'Breach reported by John Smith', type: 'user' },
      { date: '2024-06-15 14:30', event: 'Initial vendor notification sent', type: 'notification' },
      { date: '2024-06-16 09:00', event: 'Vendor acknowledgment received', type: 'vendor' },
      { date: '2024-06-17 15:00', event: 'Corrective action plan requested', type: 'action' }
    ],
    rootCause: 'Insufficient staffing during peak hours',
    contractClause: 'Section 3.2 - Service Level Requirements'
  },
  {
    id: 'BR-2024-002',
    contractId: 'CTR-2024-002',
    vendor: 'Corporate Journey Ltd',
    breachType: 'Performance',
    severity: 'Medium',
    date: '2024-06-10',
    description: 'Booking accuracy below 95% threshold',
    status: 'Resolved',
    assignedTo: 'Sarah Johnson',
    dueDate: '2024-06-25',
    riskScore: 45,
    actionTaken: 'Training provided to vendor staff, process improvements implemented',
    impactLevel: 'Moderate',
    financialImpact: 8500,
    affectedCustomers: 23,
    vendorContact: 'operations@corporatejourney.com',
    timeline: [
      { date: '2024-06-10 08:00', event: 'Performance metrics review flagged issue', type: 'system' },
      { date: '2024-06-10 11:30', event: 'Breach documented by Sarah Johnson', type: 'user' },
      { date: '2024-06-11 09:00', event: 'Vendor training session scheduled', type: 'action' },
      { date: '2024-06-14 14:00', event: 'Training completed, process improvements deployed', type: 'resolution' },
      { date: '2024-06-18 16:00', event: 'Performance metrics verified - breach resolved', type: 'resolution' }
    ],
    rootCause: 'Outdated booking system interface causing user errors',
    contractClause: 'Section 4.1 - Performance Standards'
  },
  {
    id: 'BR-2024-003',
    contractId: 'CTR-2024-004',
    vendor: 'Premier Voyage Group',
    breachType: 'Financial',
    severity: 'High',
    date: '2024-06-08',
    description: 'Late payment penalty clause triggered',
    status: 'Pending Review',
    assignedTo: 'Mike Davis',
    dueDate: '2024-06-28',
    riskScore: 92,
    actionTaken: 'Financial review initiated, penalty assessment in progress',
    impactLevel: 'Critical',
    financialImpact: 45000,
    affectedCustomers: 0,
    vendorContact: 'finance@premiervoyage.com',
    timeline: [
      { date: '2024-06-08 17:00', event: 'Payment deadline missed', type: 'system' },
      { date: '2024-06-09 09:00', event: 'Automatic penalty calculation triggered', type: 'system' },
      { date: '2024-06-09 10:30', event: 'Financial review team notified', type: 'notification' },
      { date: '2024-06-10 14:00', event: 'Vendor contacted for explanation', type: 'vendor' }
    ],
    rootCause: 'Cash flow issues and delayed invoice processing',
    contractClause: 'Section 7.3 - Payment Terms and Penalties'
  },
  {
    id: 'BR-2024-004',
    contractId: 'CTR-2024-003',
    vendor: 'Elite Business Travel',
    breachType: 'Compliance',
    severity: 'Low',
    date: '2024-06-05',
    description: 'Documentation submission delay',
    status: 'Resolved',
    assignedTo: 'Lisa Wong',
    dueDate: '2024-06-20',
    riskScore: 25,
    actionTaken: 'Documents received, compliance verified',
    impactLevel: 'Minor',
    financialImpact: 0,
    affectedCustomers: 0,
    vendorContact: 'compliance@elitebusinesstravel.com',
    timeline: [
      { date: '2024-06-05 12:00', event: 'Documentation deadline missed', type: 'system' },
      { date: '2024-06-05 14:00', event: 'Compliance team notified', type: 'notification' },
      { date: '2024-06-06 09:00', event: 'Vendor contacted for status update', type: 'vendor' },
      { date: '2024-06-07 16:30', event: 'Documents received and verified', type: 'resolution' }
    ],
    rootCause: 'Internal process delay due to staff absence',
    contractClause: 'Section 6.1 - Compliance and Documentation Requirements'
  }
];

const contractRiskScores = [
  { contractId: 'CTR-2024-001', vendor: 'Global Travel Solutions', riskScore: 75, trend: 'increasing', factors: ['SLA violations', 'Performance decline'] },
  { contractId: 'CTR-2024-002', vendor: 'Corporate Journey Ltd', riskScore: 35, trend: 'stable', factors: ['Good performance', 'Minor issues resolved'] },
  { contractId: 'CTR-2024-003', vendor: 'Elite Business Travel', riskScore: 28, trend: 'decreasing', factors: ['Improving metrics', 'Proactive compliance'] },
  { contractId: 'CTR-2024-004', vendor: 'Premier Voyage Group', riskScore: 88, trend: 'increasing', factors: ['Financial issues', 'Multiple breaches'] }
];

const aiRecommendations = {
  'BR-2024-001': [
    {
      type: 'immediate',
      priority: 'High',
      title: 'Implement 24/7 Monitoring',
      description: 'Deploy automated monitoring system to track response times in real-time and trigger alerts before SLA violations occur.',
      impact: 'Reduces future SLA violations by 75%',
      effort: 'Medium',
      timeline: '2-3 weeks'
    },
    {
      type: 'strategic',
      priority: 'High',
      title: 'Renegotiate SLA Terms',
      description: 'Consider adjusting SLA requirements based on realistic vendor capacity during peak periods.',
      impact: 'Balances expectations with operational reality',
      effort: 'Low',
      timeline: '1 week'
    },
    {
      type: 'preventive',
      priority: 'Medium',
      title: 'Vendor Performance Review',
      description: 'Schedule quarterly performance reviews with escalation procedures for consistent underperformance.',
      impact: 'Improves long-term vendor accountability',
      effort: 'Low',
      timeline: 'Ongoing'
    }
  ],
  'BR-2024-002': [
    {
      type: 'immediate',
      priority: 'Medium',
      title: 'System Integration Review',
      description: 'Audit booking system integration points to identify and resolve accuracy bottlenecks.',
      impact: 'Improves booking accuracy to 98%+',
      effort: 'High',
      timeline: '4-6 weeks'
    },
    {
      type: 'training',
      priority: 'Medium',
      title: 'Enhanced User Training',
      description: 'Implement comprehensive training program with certification requirements for booking staff.',
      impact: 'Reduces user errors by 60%',
      effort: 'Medium',
      timeline: '2-3 weeks'
    }
  ],
  'BR-2024-003': [
    {
      type: 'financial',
      priority: 'High',
      title: 'Payment Plan Negotiation',
      description: 'Establish structured payment plan with milestone-based penalty reductions to ensure cash flow recovery.',
      impact: 'Reduces financial risk exposure',
      effort: 'Medium',
      timeline: '1-2 weeks'
    },
    {
      type: 'monitoring',
      priority: 'High',
      title: 'Financial Health Monitoring',
      description: 'Implement monthly financial health assessments with early warning indicators.',
      impact: 'Prevents future financial breaches',
      effort: 'Medium',
      timeline: '2 weeks'
    }
  ],
  'BR-2024-004': [
    {
      type: 'process',
      priority: 'Low',
      title: 'Automated Reminder System',
      description: 'Implement automated reminder system for documentation deadlines with escalation procedures.',
      impact: 'Eliminates documentation delays',
      effort: 'Low',
      timeline: '1 week'
    }
  ]
};

interface BreachMonitoringProps {
  initialFilters?: any;
}

export function BreachMonitoring({ initialFilters }: BreachMonitoringProps) {
  const [selectedBreach, setSelectedBreach] = useState(null);
  const [isCreatingBreach, setIsCreatingBreach] = useState(false);
  const [showBreachDetails, setShowBreachDetails] = useState(false);
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [showVendorNotification, setShowVendorNotification] = useState(false);
  const [filters, setFilters] = useState({
    severity: '',
    status: '',
    assignedTo: '',
    ...initialFilters
  });

  const [newBreach, setNewBreach] = useState({
    contractId: '',
    breachType: '',
    severity: '',
    description: '',
    assignedTo: '',
    dueDate: ''
  });

  const [notificationData, setNotificationData] = useState({
    recipient: '',
    subject: '',
    message: '',
    urgency: 'Medium',
    includeDetails: true,
    requireResponse: true,
    escalationLevel: 'Standard'
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'default';
      case 'In Progress': return 'secondary';
      case 'Pending Review': return 'outline';
      default: return 'outline';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'decreasing': return <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />;
      default: return <div className="h-4 w-4 bg-gray-300 rounded-full" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Critical': return 'text-red-600';
      case 'Moderate': return 'text-yellow-600';
      case 'Minor': return 'text-green-600';
      default: return 'text-gray-600';
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

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'system': return <Zap className="h-4 w-4 text-blue-500" />;
      case 'user': return <User className="h-4 w-4 text-green-500" />;
      case 'notification': return <Bell className="h-4 w-4 text-yellow-500" />;
      case 'vendor': return <ExternalLink className="h-4 w-4 text-purple-500" />;
      case 'action': return <Target className="h-4 w-4 text-orange-500" />;
      case 'resolution': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleCreateBreach = () => {
    console.log('Creating breach:', newBreach);
    setIsCreatingBreach(false);
    setNewBreach({
      contractId: '',
      breachType: '',
      severity: '',
      description: '',
      assignedTo: '',
      dueDate: ''
    });
  };

  const handleViewDetails = (breach) => {
    setSelectedBreach(breach);
    setShowBreachDetails(true);
  };

  const handleShowAIRecommendations = (breach) => {
    setSelectedBreach(breach);
    setShowAIRecommendations(true);
  };

  const handleNotifyVendor = (breach) => {
    setSelectedBreach(breach);
    setNotificationData({
      ...notificationData,
      recipient: breach.vendorContact,
      subject: `Contract Breach Notification - ${breach.id}`,
      message: `Dear ${breach.vendor},\n\nWe have identified a contract breach in your service delivery:\n\nBreach Type: ${breach.breachType}\nSeverity: ${breach.severity}\nDescription: ${breach.description}\n\nImmediate action is required to address this issue. Please provide a corrective action plan within 48 hours.\n\nRegards,\nSOAR-AI Contract Management Team`
    });
    setShowVendorNotification(true);
  };

  const handleSendNotification = () => {
    console.log('Sending notification:', notificationData);
    setShowVendorNotification(false);
    // Here you would integrate with email/notification service
  };

  return (
    <div className="w-full h-full space-y-6 p-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Breach Monitoring</h2>
          <p className="text-muted-foreground">Track contract breaches, risk assessment, and resolution progress</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreatingBreach} onOpenChange={setIsCreatingBreach}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Report Breach
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Report New Breach</DialogTitle>
                <DialogDescription>
                  Document a contract breach and assign resolution responsibility
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contractId">Contract ID</Label>
                  <Select value={newBreach.contractId} onValueChange={(value) => setNewBreach({...newBreach, contractId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select contract" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CTR-2024-001">CTR-2024-001 - Global Travel Solutions</SelectItem>
                      <SelectItem value="CTR-2024-002">CTR-2024-002 - Corporate Journey Ltd</SelectItem>
                      <SelectItem value="CTR-2024-003">CTR-2024-003 - Elite Business Travel</SelectItem>
                      <SelectItem value="CTR-2024-004">CTR-2024-004 - Premier Voyage Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="breachType">Breach Type</Label>
                  <Select value={newBreach.breachType} onValueChange={(value) => setNewBreach({...newBreach, breachType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SLA Violation">SLA Violation</SelectItem>
                      <SelectItem value="Performance">Performance</SelectItem>
                      <SelectItem value="Financial">Financial</SelectItem>
                      <SelectItem value="Compliance">Compliance</SelectItem>
                      <SelectItem value="Security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="severity">Severity</Label>
                  <Select value={newBreach.severity} onValueChange={(value) => setNewBreach({...newBreach, severity: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="assignedTo">Assign To</Label>
                  <Select value={newBreach.assignedTo} onValueChange={(value) => setNewBreach({...newBreach, assignedTo: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="John Smith">John Smith</SelectItem>
                      <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                      <SelectItem value="Mike Davis">Mike Davis</SelectItem>
                      <SelectItem value="Lisa Wong">Lisa Wong</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dueDate">Resolution Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newBreach.dueDate}
                    onChange={(e) => setNewBreach({...newBreach, dueDate: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Breach Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the breach details, impact, and any immediate actions taken..."
                    value={newBreach.description}
                    onChange={(e) => setNewBreach({...newBreach, description: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreatingBreach(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateBreach}>
                  Report Breach
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <Tabs defaultValue="breach-list" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-50/50 p-1 rounded-xl border border-gray-200/50">
          <TabsTrigger 
            value="breach-list"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            Breach Reports
          </TabsTrigger>
          <TabsTrigger 
            value="risk-assessment"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            Risk Assessment
          </TabsTrigger>
          <TabsTrigger 
            value="analytics"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="breach-list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contract Breach Reports</CardTitle>
              <CardDescription>All reported breaches with their resolution status and management actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Breach ID</TableHead>
                    <TableHead>Contract</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {breaches.map((breach) => (
                    <TableRow key={breach.id}>
                      <TableCell className="font-medium">{breach.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{breach.contractId}</div>
                          <div className="text-sm text-muted-foreground">{breach.vendor}</div>
                        </div>
                      </TableCell>
                      <TableCell>{breach.breachType}</TableCell>
                      <TableCell>
                        <Badge variant={getSeverityColor(breach.severity)}>
                          {breach.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>{breach.date}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(breach.status)}>
                          {breach.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="inline-flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{breach.assignedTo}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{breach.dueDate}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewDetails(breach)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleShowAIRecommendations(breach)}
                            title="AI Recommendations"
                          >
                            <Brain className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleNotifyVendor(breach)}
                            title="Notify Vendor"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk-assessment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Contract Risk Assessment
              </CardTitle>
              <CardDescription>AI-powered breach risk scores and trend analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contractRiskScores.map((contract) => (
                  <Card key={contract.contractId}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold">{contract.contractId}</h4>
                          <p className="text-sm text-muted-foreground">{contract.vendor}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-sm font-medium">Risk Trend</div>
                            <div className="flex items-center justify-center">
                              {getTrendIcon(contract.trend)}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium">Risk Score</div>
                            <div className={`text-2xl font-bold ${getRiskColor(contract.riskScore)}`}>
                              {contract.riskScore}
                            </div>
                          </div>
                          <Progress value={contract.riskScore} className="w-24" />
                        </div>
                      </div>
                      <div>
                        <Label>Risk Factors</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {contract.factors.map((factor) => (
                            <Badge key={factor} variant="outline" className="text-xs">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Breaches</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{breaches.length}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-600">2 High severity</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">50%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">2 of 4 resolved</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Resolution Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12 days</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">-3 days</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Breach Resolution Timeline</CardTitle>
              <CardDescription>Track resolution progress and identify bottlenecks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {breaches.filter(b => b.status !== 'Resolved').map((breach) => (
                  <div key={breach.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{breach.id} - {breach.vendor}</h4>
                      <Badge variant={getSeverityColor(breach.severity)}>
                        {breach.severity}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Due: {breach.dueDate}</span>
                      <span>Assigned: {breach.assignedTo}</span>
                      <span>Status: {breach.status}</span>
                    </div>
                    <Progress 
                      value={breach.status === 'In Progress' ? 60 : 30} 
                      className="w-full"
                    />
                    <p className="text-sm">{breach.actionTaken}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Breach Details Dialog */}
      <Dialog open={showBreachDetails} onOpenChange={setShowBreachDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Breach Details - {selectedBreach?.id}
            </DialogTitle>
            <DialogDescription>
              Comprehensive breach information and impact analysis
            </DialogDescription>
          </DialogHeader>
          {selectedBreach && (
            <div className="space-y-6">
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <AlertTriangle className={`h-8 w-8 mx-auto mb-2 ${selectedBreach.severity === 'High' ? 'text-red-500' : selectedBreach.severity === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`} />
                      <div className="font-medium">Severity</div>
                      <Badge variant={getSeverityColor(selectedBreach.severity)}>
                        {selectedBreach.severity}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <DollarSign className="h-8 w-8 mx-auto mb-2 text-red-500" />
                      <div className="font-medium">Financial Impact</div>
                      <div className="text-lg font-bold">${selectedBreach.financialImpact?.toLocaleString()}</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <div className="font-medium">Affected Customers</div>
                      <div className="text-lg font-bold">{selectedBreach.affectedCustomers}</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Target className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                      <div className="font-medium">Risk Score</div>
                      <div className={`text-lg font-bold ${getRiskColor(selectedBreach.riskScore)}`}>
                        {selectedBreach.riskScore}/100
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-50/50 p-1 rounded-xl border border-gray-200/50">
                  <TabsTrigger 
                    value="overview"
                    className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="timeline"
                    className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
                  >
                    Timeline
                  </TabsTrigger>
                  <TabsTrigger 
                    value="impact"
                    className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
                  >
                    Impact Analysis
                  </TabsTrigger>
                  <TabsTrigger 
                    value="contract"
                    className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
                  >
                    Contract Details
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Breach Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Contract ID</Label>
                          <p className="font-medium">{selectedBreach.contractId}</p>
                        </div>
                        <div>
                          <Label>Vendor</Label>
                          <p className="font-medium">{selectedBreach.vendor}</p>
                        </div>
                        <div>
                          <Label>Breach Type</Label>
                          <p className="font-medium">{selectedBreach.breachType}</p>
                        </div>
                        <div>
                          <Label>Status</Label>
                          <Badge variant={getStatusColor(selectedBreach.status)}>
                            {selectedBreach.status}
                          </Badge>
                        </div>
                        <div>
                          <Label>Date Reported</Label>
                          <p className="font-medium">{selectedBreach.date}</p>
                        </div>
                        <div>
                          <Label>Resolution Due</Label>
                          <p className="font-medium">{selectedBreach.dueDate}</p>
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <Label>Description</Label>
                        <p className="mt-1">{selectedBreach.description}</p>
                      </div>
                      <div>
                        <Label>Root Cause Analysis</Label>
                        <p className="mt-1">{selectedBreach.rootCause}</p>
                      </div>
                      <div>
                        <Label>Action Taken</Label>
                        <p className="mt-1">{selectedBreach.actionTaken}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="timeline" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <History className="h-5 w-5" />
                        Breach Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedBreach.timeline?.map((event, index) => (
                          <div key={index} className="flex items-start gap-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                              {getTimelineIcon(event.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium">{event.event}</p>
                                <span className="text-sm text-muted-foreground">{event.date}</span>
                              </div>
                              <Badge variant="outline" className="text-xs mt-1">
                                {event.type}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="impact" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Financial Impact</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span>Direct Costs:</span>
                          <span className="font-medium">${selectedBreach.financialImpact?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estimated Penalties:</span>
                          <span className="font-medium">$5,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Recovery Costs:</span>
                          <span className="font-medium">$2,500</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold">
                          <span>Total Impact:</span>
                          <span>${(selectedBreach.financialImpact + 7500)?.toLocaleString()}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Business Impact</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span>Impact Level:</span>
                          <Badge variant={selectedBreach.impactLevel === 'Critical' ? 'destructive' : selectedBreach.impactLevel === 'Moderate' ? 'secondary' : 'outline'}>
                            {selectedBreach.impactLevel}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Customers Affected:</span>
                          <span className="font-medium">{selectedBreach.affectedCustomers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Service Disruption:</span>
                          <span className="font-medium">4 hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Reputation Impact:</span>
                          <span className={`font-medium ${getImpactColor(selectedBreach.impactLevel)}`}>
                            {selectedBreach.impactLevel}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="contract" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Contract Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Relevant Contract Clause</Label>
                        <p className="mt-1 font-medium">{selectedBreach.contractClause}</p>
                      </div>
                      <div>
                        <Label>Vendor Contact</Label>
                        <p className="mt-1">{selectedBreach.vendorContact}</p>
                      </div>
                      <div>
                        <Label>Contract Manager</Label>
                        <p className="mt-1">{selectedBreach.assignedTo}</p>
                      </div>
                      <Separator />
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Download Contract
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                          <ExternalLink className="h-4 w-4" />
                          View Full Contract
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBreachDetails(false)}>
              Close
            </Button>
            <Button onClick={() => handleShowAIRecommendations(selectedBreach)}>
              Get AI Recommendations
            </Button>
            <Button onClick={() => handleNotifyVendor(selectedBreach)}>
              Notify Vendor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Recommendations Dialog */}
      <Dialog open={showAIRecommendations} onOpenChange={setShowAIRecommendations}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Recommendations - {selectedBreach?.id}
            </DialogTitle>
            <DialogDescription>
              Intelligent suggestions for breach resolution and prevention
            </DialogDescription>
          </DialogHeader>
          {selectedBreach && aiRecommendations[selectedBreach.id] && (
            <div className="space-y-4">
              <Alert className="border-blue-200 bg-blue-50">
                <Lightbulb className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Our AI system has analyzed similar breaches, contract terms, and vendor performance to generate these recommendations.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                {aiRecommendations[selectedBreach.id].map((recommendation, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant={getPriorityColor(recommendation.priority)}>
                            {recommendation.priority}
                          </Badge>
                          <Badge variant="outline">{recommendation.type}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Timeline: {recommendation.timeline}
                        </div>
                      </div>
                      
                      <h4 className="font-semibold mb-2">{recommendation.title}</h4>
                      <p className="text-sm mb-3">{recommendation.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label>Expected Impact</Label>
                          <p className="text-green-600 font-medium">{recommendation.impact}</p>
                        </div>
                        <div>
                          <Label>Implementation Effort</Label>
                          <Badge variant={recommendation.effort === 'High' ? 'destructive' : recommendation.effort === 'Medium' ? 'secondary' : 'outline'}>
                            {recommendation.effort}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Recommended Action Plan</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-green-700">
                    <li>Implement immediate monitoring for {selectedBreach.breachType} violations</li>
                    <li>Schedule vendor meeting within 48 hours to discuss corrective actions</li>
                    <li>Document all communications and agreements for compliance tracking</li>
                    <li>Set up automated alerts for similar breach patterns</li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAIRecommendations(false)}>
              Close
            </Button>
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Recommendations
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Vendor Notification Dialog */}
      <Dialog open={showVendorNotification} onOpenChange={setShowVendorNotification}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Notify Vendor - {selectedBreach?.vendor}
            </DialogTitle>
            <DialogDescription>
              Send breach notification and corrective action request to vendor
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="recipient">Recipient Email</Label>
                <Input
                  id="recipient"
                  value={notificationData.recipient}
                  onChange={(e) => setNotificationData({...notificationData, recipient: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select value={notificationData.urgency} onValueChange={(value) => setNotificationData({...notificationData, urgency: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High - Immediate Response Required</SelectItem>
                    <SelectItem value="Medium">Medium - Response within 48 hours</SelectItem>
                    <SelectItem value="Low">Low - Response within 1 week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={notificationData.subject}
                onChange={(e) => setNotificationData({...notificationData, subject: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={8}
                value={notificationData.message}
                onChange={(e) => setNotificationData({...notificationData, message: e.target.value})}
              />
            </div>

            <div className="space-y-3">
              <Label>Notification Options</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeDetails"
                    checked={notificationData.includeDetails}
                    onCheckedChange={(checked) => setNotificationData({...notificationData, includeDetails: checked})}
                  />
                  <Label htmlFor="includeDetails">Include detailed breach information</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requireResponse"
                    checked={notificationData.requireResponse}
                    onCheckedChange={(checked) => setNotificationData({...notificationData, requireResponse: checked})}
                  />
                  <Label htmlFor="requireResponse">Require acknowledgment response</Label>
                </div>
              </div>
            </div>

            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                This notification will be logged in the breach timeline and tracked for vendor response.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVendorNotification(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendNotification} className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Send Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}