import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Search,
  Filter,
  Download,
  RefreshCw,
  Plus,
  MessageSquare,
  Edit,
  BarChart3,
  History,
  User,
  ArrowRight,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Target,
  Eye,
  MoreVertical,
  ExternalLink,
  ChevronDown,
  PhoneCall,
  Video,
  CalendarDays,
  Activity // Imported for Actions dropdown
} from 'lucide-react';
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useLeadApi } from '../hooks/api/useLeadApi';


interface AllLeadsProps {
  onNavigate: (screen: string, filters?: any) => void;
}

interface HistoryEntry {
  id: number;
  history_type: string;
  action: string;
  details: string;
  icon: string;
  user_name: string;
  timestamp: string;
}

interface Lead {
  id: number;
  company: { name: string; industry?: string; size?: string; }; // Added industry and size to Lead interface
  contact: { first_name: string; last_name: string; position: string; email: string; phone: string; };
  status: string;
  source: string;
  priority: string;
  score: number;
  estimated_value: number;
  notes: string;
  assigned_to?: { username: string; };
  created_at: string;
  updated_at: string;
  engagement?: string; // Added engagement to Lead interface
}

const statusColors = {
  'qualified': 'bg-green-100 text-green-800 border-green-200',
  'contacted': 'bg-blue-100 text-blue-800 border-blue-200',
  'new': 'bg-orange-100 text-orange-800 border-orange-200',
  'in-progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'unqualified': 'bg-red-100 text-red-800 border-red-200',
  'proposal_sent': 'bg-purple-100 text-purple-800 border-purple-200',
  'negotiation': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'won': 'bg-green-100 text-green-800 border-green-200',
  'lost': 'bg-gray-100 text-gray-800 border-gray-200'
};

const urgencyColors = {
  'high': 'bg-red-100 text-red-800',
  'medium': 'bg-yellow-100 text-yellow-800',
  'low': 'bg-green-100 text-green-800'
};

const engagementColors = {
  'High': 'text-green-600',
  'Medium': 'text-yellow-600',
  'Low': 'text-red-600'
};

const getHistoryIcon = (iconType: string) => {
  const icons = {
    'plus': Plus,
    'mail': Mail,
    'phone': Phone,
    'message-circle': MessageSquare,
    'message-square': MessageSquare,
    'trending-up': BarChart3,
    'user': User,
    'check-circle': CheckCircle2,
    'x-circle': AlertTriangle,
    'calendar': Calendar,
    'briefcase': Building2,
    'file-text': MessageSquare,
    'handshake': User,
    'trophy': CheckCircle2,
    'x': AlertTriangle
  };
  return icons[iconType] || MessageSquare;
};

export function AllLeads({ onNavigate }: AllLeadsProps) {
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showNewLeadDialog, setShowNewLeadDialog] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [selectedLeadHistory, setSelectedLeadHistory] = useState<HistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedLeadName, setSelectedLeadName] = useState('');
  const [showAssignAgentDialog, setShowAssignAgentDialog] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  const [leadsForViewProfile, setLeadsForViewProfile] = useState<any[]>([]); // State for leads to view profile
  const [selectedCorporate, setSelectedCorporate] = useState(null);
  const [showCorporateProfile, setShowCorporateProfile] = useState(false);  
  const [selectedLeadForNote, setSelectedLeadForNote] = useState<any>(null);

  // Modal states for Actions dropdown
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [showMeetingDialog, setShowMeetingDialog] = useState(false);
  const [showDemoDialog, setShowDemoDialog] = useState(false);
  const [selectedLeadForAction, setSelectedLeadForAction] = useState<any>(null);

  // Initialize API hook
  const leadApi = useLeadApi();

  // Lead form states
  const [newLeadForm, setNewLeadForm] = useState({
    companyName: '',
    firstName: '',
    lastName: '',
    position: '',
    email: '',
    phone: '',
    industry: '',
    location: '',
    companySize: '',
    annualRevenue: '',
    travelBudget: '',
    status: 'new',
    source: 'website',
    score: '0',
    estimatedValue: '',
    notes: '',
    isDecisionMaker: false
  });

  // Fetch leads from API
  const fetchLeads = async () => {
    try {
      const data = await leadApi.getLeads(filters);
      setLeads(data);
    } catch (err) {
      toast.error('Failed to fetch leads');
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchLeads();
    }, 300); // Debounce filter changes

    return () => clearTimeout(timeoutId);
  }, [filters]);

  // Filter states
  const [filters, setFilters] = useState({
    status: 'all',
    industry: 'all',
    score: 'all',
    engagement: 'all',
    search: ''
  });

  // Filter leads based on current filters
  const filteredLeads = leads.filter(lead => {
    if (filters.search && !lead.company.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !lead.contact.first_name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !lead.contact.last_name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    if (filters.status && filters.status !== 'all' && lead.status !== filters.status) {
      return false;
    }

    if (filters.industry && filters.industry !== 'all' && lead.company.industry !== filters.industry) {
      return false;
    }

    if (filters.score && filters.score !== 'all') {
      if (filters.score === 'high' && lead.score < 80) return false;
      if (filters.score === 'medium' && (lead.score < 60 || lead.score >= 80)) return false;
      if (filters.score === 'low' && lead.score >= 60) return false;
    }

    if (filters.engagement && filters.engagement !== 'all' && lead.engagement !== filters.engagement) {
      return false;
    }

    return true;
  });

  // Sync select all state with filtered leads
  useEffect(() => {
    if (selectedLeads.length === 0) {
      setSelectAll(false);
    } else if (filteredLeads.length > 0 && selectedLeads.length === filteredLeads.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedLeads, filteredLeads]);

  const handleSelectLead = (leadId: number, checked: boolean) => {
    if (checked) {
      setSelectedLeads(prev => [...prev, leadId]);
    } else {
      setSelectedLeads(prev => prev.filter(id => id !== leadId));
      setSelectAll(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allLeadIds = filteredLeads.map(lead => lead.id);
      setSelectedLeads(allLeadIds);
      setSelectAll(true);
    } else {
      setSelectedLeads([]);
      setSelectAll(false);
    }
  };

  const clearFilters = () => {
    setFilters({ status: 'all', industry: 'all', score: 'all', engagement: 'all', search: '' });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Handle input change for the new lead form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setNewLeadForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Handle viewing lead history
  const handleViewHistory = async (lead: Lead) => {
    setHistoryLoading(true);
    // Use the lead object directly to set name and open dialog
    setSelectedLeadName(lead.company.name); // Store company name for the title
    setShowHistoryDialog(true);

    try {
      const history = await leadApi.getHistory(lead.id);
      // Map history entries to include an icon, e.g., based on history_type
      const historyWithIcons = history.map(entry => ({
        ...entry,
        icon: getHistoryIconType(entry.history_type) // Helper function to map type to icon key
      }));
      setSelectedLeadHistory(historyWithIcons);
    } catch (error) {
      toast.error('Failed to fetch lead history');
      setSelectedLeadHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Helper to map history_type to an icon key
  const getHistoryIconType = (historyType: string): string => {
    switch (historyType.toLowerCase()) {
      case 'creation':
      case 'note_added':
        return 'message-square'; // Or 'file-text'
      case 'status_change':
        return 'check-circle';
      case 'score_update':
        return 'trending-up';
      case 'assignment':
        return 'user';
      case 'contact_made':
      case 'call_made':
        return 'phone';
      case 'email_sent':
        return 'mail';
      case 'meeting_scheduled':
        return 'calendar';
      case 'qualification':
        return 'target';
      case 'disqualification':
        return 'x';
      case 'opportunity_created':
        return 'dollar-sign';
      case 'proposal_sent':
        return 'file-text';
      case 'negotiation_started':
        return 'handshake';
      case 'won':
        return 'trophy';
      case 'lost':
        return 'x';
      default:
        return 'message-square';
    }
  };

  const handleViewProfile = (lead: any) => {
    console.log(leadsForViewProfile, 'leadsForViewProfile',lead,"lead");
    const item = leadsForViewProfile.find(entry => entry.id === lead.id);
    console.log(item,"item")
    setSelectedCorporate(item);
    setShowCorporateProfile(true);
  };

  // Handlers for Actions dropdown options
  const handleInitiateCall = (lead: any) => {
    setSelectedLeadForAction(lead);
    setShowCallDialog(true);
  };

  const handleScheduleMeeting = (lead: any) => {
    setSelectedLeadForAction(lead);
    setShowMeetingDialog(true);
  };

  const handleScheduleDemo = (lead: any) => {
    setSelectedLeadForAction(lead);
    setShowDemoDialog(true);
  };

  // Handle bulk actions
  const handleStartCampaign = () => {
    if (selectedLeads.length === 0) {
      toast.error('Please select leads first');
      return;
    }

    // Navigate to campaign creation with selected leads
    const selectedLeadData = filteredLeads.filter(lead => selectedLeads.includes(lead.id));
    onNavigate('marketing-campaign', { 
      preSelectedLeads: selectedLeadData,
      campaignType: 'bulk_email'
    });
    toast.success(`Campaign started for ${selectedLeads.length} lead${selectedLeads.length > 1 ? 's' : ''}`);

    // Clear selection after action
    setSelectedLeads([]);
    setSelectAll(false);
  };

  const handleAssignAgent = () => {
    if (selectedLeads.length === 0) {
      toast.error('Please select leads first');
      return;
    }
    setShowAssignAgentDialog(true);
  };

  const handleConfirmAssignAgent = async () => {
    if (!selectedAgent) {
      toast.error('Please select an agent');
      return;
    }

    try {
      // Here you would make API calls to assign the agent to selected leads
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success(`${selectedLeads.length} lead${selectedLeads.length > 1 ? 's' : ''} assigned to ${selectedAgent}`);
      setShowAssignAgentDialog(false);
      setSelectedAgent('');
      handleClearSelection();

      // Refresh leads to show updated assignments
      await fetchLeads();
    } catch (error) {
      toast.error('Failed to assign agent');
    }
  };

  const handleClearSelection = () => {
    setSelectedLeads([]);
    setSelectAll(false);
    toast.success('Selection cleared');
  };

  // Handle form submission for adding a new lead
  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!newLeadForm.companyName.trim() || !newLeadForm.firstName.trim() || !newLeadForm.email.trim() || !newLeadForm.industry.trim()) {
      toast.error('Please fill in all required fields (Company Name, First Name, Email, and Industry)');
      return;
    }

    try {
      const leadData = {
        company: {
          name: newLeadForm.companyName,
          industry: newLeadForm.industry || 'other',
          location: newLeadForm.location || '',
          size: newLeadForm.companySize || 'medium',
          annual_revenue: newLeadForm.annualRevenue ? parseFloat(newLeadForm.annualRevenue.replace(/[^\d.-]/g, '')) : null,
          travel_budget: newLeadForm.travelBudget ? parseFloat(newLeadForm.travelBudget.replace(/[^\d.-]/g, '')) : null
        },
        contact: {
          first_name: newLeadForm.firstName,
          last_name: newLeadForm.lastName,
          position: newLeadForm.position || '',
          email: newLeadForm.email,
          phone: newLeadForm.phone || '',
          is_decision_maker: newLeadForm.isDecisionMaker
        },
        status: newLeadForm.status || 'new',
        source: newLeadForm.source || 'website',
        score: parseInt(newLeadForm.score) || 0,
        estimated_value: newLeadForm.estimatedValue ? parseFloat(newLeadForm.estimatedValue.replace(/[^\d.-]/g, '')) : null,
        notes: newLeadForm.notes || '',
        priority: 'medium'
      };

      const newLead = await leadApi.createLead(leadData);

      // Refresh the leads list from the server to ensure consistency
      await fetchLeads();

      // Reset form
      setNewLeadForm({
        companyName: '',
        firstName: '',
        lastName: '',
        position: '',
        email: '',
        phone: '',
        industry: '',
        location: '',
        companySize: '',
        annualRevenue: '',
        travelBudget: '',
        status: 'new',
        source: 'website',
        score: '0',
        estimatedValue: '',
        notes: '',
        isDecisionMaker: false
      });

      setShowNewLeadDialog(false);
      toast.success('Lead added successfully!');

    } catch (err) {
      toast.error('Failed to add lead. Please try again.');
      console.error('Error creating lead:', err);
    }
  };


  if (leadApi.loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading leads...</p>
          <p className="text-gray-500 text-sm mt-1">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  if (leadApi.error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
        <p className="text-red-600 mb-4">Error: {leadApi.error}</p>
        <Button onClick={fetchLeads}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <button className="flex items-center gap-1 hover:text-orange-600">
          <Users className="h-4 w-4" />
          AI Assistant
        </button>
        <span>/</span>
        <span className="text-gray-900 font-medium">All Leads</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">All Leads</h1>
          <p className="text-gray-600">Comprehensive lead management with status tracking and AI suggestions</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-gray-600 border-gray-300">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" className="text-gray-600 border-gray-300" onClick={fetchLeads}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" className="text-gray-600 border-gray-300">
            <Mail className="h-4 w-4 mr-2" />
            Email Campaign
          </Button>
          <Button
            className="bg-orange-600 hover:bg-orange-700 text-white"
            onClick={() => setShowNewLeadDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Lead
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <CardTitle className="text-lg">Lead Filters</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Company or contact..."
                  className="pl-10 border-gray-300"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="unqualified">Unqualified</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Industry</Label>
              <Select value={filters.industry} onValueChange={(value) => setFilters({...filters, industry: value})}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="All industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All industries</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="Financial Services">Financial Services</SelectItem>
                  <SelectItem value="Banking">Banking</SelectItem>
                  <SelectItem value="Consulting">Consulting</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Score */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Score</Label>
              <Select value={filters.score} onValueChange={(value) => setFilters({...filters, score: value})}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="All scores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All scores</SelectItem>
                  <SelectItem value="high">High (80+)</SelectItem>
                  <SelectItem value="medium">Medium (60-79)</SelectItem>
                  <SelectItem value="low">Low (&lt;60)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Engagement */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Engagement</Label>
              <Select value={filters.engagement} onValueChange={(value) => setFilters({...filters, engagement: value})}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All levels</SelectItem>
                  <SelectItem value="Very High">Very High</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters} className="text-gray-600 border-gray-300">
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Bar - Shows when leads are selected */}
      {selectedLeads.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-orange-500 rounded-full">
                <span className="text-white font-medium text-sm">{selectedLeads.length}</span>
              </div>
              <span className="text-orange-800 font-medium">
                {selectedLeads.length} lead{selectedLeads.length > 1 ? 's' : ''} selected
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                size="sm"
                className="bg-orange-600 hover:bg-orange-700 text-white"
                onClick={handleStartCampaign}
              >
                <Mail className="h-4 w-4 mr-2" />
                Start Campaign
              </Button>

              <Button 
                size="sm"
                variant="outline" 
                className="text-gray-700 border-gray-300 hover:bg-gray-50"
                onClick={handleAssignAgent}
              >
                <User className="h-4 w-4 mr-2" />
                Assign Agent
              </Button>

              <Button 
                size="sm"
                variant="outline" 
                className="text-gray-700 border-gray-300 hover:bg-gray-50"
                onClick={handleClearSelection}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            All Leads ({filteredLeads.length} results)
          </h2>
          <p className="text-sm text-gray-600">Comprehensive lead management with status tracking and AI suggestions</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="select-all"
              checked={selectAll}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="select-all" className="text-sm text-gray-600">Select All</Label>
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {filteredLeads.map((lead) => (
          <Card key={lead.id} className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              {/* Lead Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead.id)}
                    onChange={(e) => handleSelectLead(lead.id, e.target.checked)}
                    className="rounded border-gray-300"
                  />

                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{lead.company.name}</h3>
                      <Badge className={`${statusColors[lead.status] || 'bg-gray-100 text-gray-800'} text-xs px-2 py-1 rounded-md`}>
                        {lead.status === 'contacted' ? 'Contacted Ready' :
                         lead.status === 'qualified' ? 'Decision Maker' :
                         lead.status}
                      </Badge>
                      {lead.status === 'contacted' && (
                        <Badge className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-md">
                          Action Required
                        </Badge>
                      )}
                    </div>

                    <p className="text-gray-700 font-medium">
                      {lead.contact.first_name} {lead.contact.last_name} • {lead.contact.position}
                    </p>

                    <div className="flex items-center gap-6 text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {lead.contact.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {lead.contact.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        San Francisco, CA
                      </span>
                      <span className="flex items-center gap-1 text-blue-600 hover:underline cursor-pointer">
                        <ExternalLink className="h-3 w-3" />
                        Website
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-lg font-bold ${getScoreColor(lead.score)} mb-1`}>
                    Score: {lead.score}
                  </div>
                  <div className="text-green-600 font-semibold">
                    ${lead.estimated_value?.toLocaleString() || '450K'} budget
                  </div>
                  <Badge className={`${urgencyColors['high'] || 'bg-red-100 text-red-800'} text-xs mt-1`}>
                    High urgency
                  </Badge>
                </div>
              </div>

              {/* Next Action Alert */}
              {lead.status === 'contacted' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-red-800">Next Action: Move to contract</p>
                          <p className="text-sm text-red-700">Lead is qualified and ready for contract negotiation.</p>
                        </div>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-300">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Lead Details Grid */}
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Industry:</span> {lead.company.industry || 'N/A'}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Company Size:</span> {lead.company.size || 'N/A'}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Revenue:</span> {lead.company.annual_revenue?.toLocaleString() || 'N/A'}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Source:</span> {lead.source}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Assigned Agent:</span> {lead.assigned_to?.username || 'Unassigned'}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Last Contact:</span>
                    <div className="text-xs text-gray-500">
                    {new Date(lead.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit", 
                      year: "numeric"
                    })}
                  </div>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Follow-up Date:</span> N/A
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Engagement:</span>
                    <span className={`${engagementColors[lead.engagement] || 'text-gray-600'} ml-1`}>{lead.engagement || 'N/A'}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">Enterprise</Badge>
                    <Badge variant="outline" className="text-xs">High-Value</Badge>
                    <Badge variant="outline" className="text-xs">Decision Maker</Badge>
                  </div>
                </div>
              </div>

              {/* AI Suggestion */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-800">AI Suggestion:</p>
                    <p className="text-sm text-blue-700">
                      Schedule product demo within 3 days. High conversion probability.
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {lead.notes && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm">
                    <span className="font-medium">Notes:</span> {lead.notes}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Contacts
                  </Button>
                  <Button size="sm" variant="outline" className="text-gray-700 border-gray-300">
                    <Edit className="h-4 w-4 mr-1" />
                    Add Note
                  </Button>
                  <Button size="sm" variant="outline" className="text-orange-700 border-orange-300 bg-orange-50">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Campaign
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-gray-700 border-gray-300"
                    onClick={() => handleViewHistory(lead)} // Pass the lead object
                  >
                    <History className="h-4 w-4 mr-1" />
                    History
                  </Button>
                  <Button size="sm" variant="outline" className="text-purple-700 border-purple-300 bg-purple-50">
                    <User className="h-4 w-4 mr-1" />
                    Reassign
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                        <Activity className="h-4 w-4 mr-1" />
                        Actions
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-white shadow-lg border border-gray-200 rounded-lg p-1">
                      <DropdownMenuItem 
                        className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded cursor-pointer"
                        onClick={() => handleInitiateCall(lead)}
                      >
                        <PhoneCall className="h-4 w-4 text-blue-500" />
                        Initiate Call
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded cursor-pointer"
                        onClick={() => handleScheduleMeeting(lead)}
                      >
                        <CalendarDays className="h-4 w-4 text-green-500" />
                        Schedule Meeting
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded cursor-pointer"
                        onClick={() => handleScheduleDemo(lead)}
                      >
                        <Video className="h-4 w-4 text-purple-500" />
                        Schedule Demo
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button size="sm" variant="outline" className="text-orange-700 border-orange-300 bg-orange-50">
                    <Target className="h-4 w-4 mr-1" />
                    Create Offer
                  </Button>
                  <Button size="sm" variant="outline" className="text-green-700 border-green-300 bg-green-50">
                    <ArrowRight className="h-4 w-4 mr-1" />
                    Move to Opportunity
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-red-700 border-red-300">
                    Disqualify
                  </Button>
                  <Button size="sm" variant="outline" className="text-gray-700 border-gray-300">
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No leads found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters or add new leads to get started.</p>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={() => setShowNewLeadDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Lead
          </Button>
        </div>
      )}

      {/* New Lead Dialog */}
      <Dialog open={showNewLeadDialog} onOpenChange={setShowNewLeadDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
            <DialogDescription>
              Enter the lead details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddLead}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="companyName" className="text-right">
                  Company Name *
                </Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={newLeadForm.companyName}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="industry" className="text-right">
                  Industry *
                </Label>
                <Select
                  name="industry"
                  value={newLeadForm.industry}
                  onValueChange={(value) => setNewLeadForm(prev => ({...prev, industry: value}))}
                  required
                >
                  <SelectTrigger className="col-span-3 border-gray-300">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="finance">Finance & Banking</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="telecommunications">Telecommunications</SelectItem>
                    <SelectItem value="energy">Energy & Utilities</SelectItem>
                    <SelectItem value="transportation">Transportation</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={newLeadForm.location}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="City, State/Country"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="companySize" className="text-right">
                  Company Size
                </Label>
                <Select
                  name="companySize"
                  value={newLeadForm.companySize}
                  onValueChange={(value) => setNewLeadForm(prev => ({...prev, companySize: value}))}
                >
                  <SelectTrigger className="col-span-3 border-gray-300">
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startup">Startup (1-50)</SelectItem>
                    <SelectItem value="small">Small (51-200)</SelectItem>
                    <SelectItem value="medium">Medium (201-1000)</SelectItem>
                    <SelectItem value="large">Large (1001-5000)</SelectItem>
                    <SelectItem value="enterprise">Enterprise (5000+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="annualRevenue" className="text-right">
                  Annual Revenue
                </Label>
                <Input
                  id="annualRevenue"
                  name="annualRevenue"
                  value={newLeadForm.annualRevenue}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="e.g., $10M, $50M"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="travelBudget" className="text-right">
                  Travel Budget
                </Label>
                <Input
                  id="travelBudget"
                  name="travelBudget"
                  value={newLeadForm.travelBudget}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="e.g., $250K, $500K"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">
                  Contact First Name *
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={newLeadForm.firstName}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">
                  Contact Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={newLeadForm.lastName}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="position" className="text-right">
                  Position
                </Label>
                <Input
                  id="position"
                  name="position"
                  value={newLeadForm.position}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="e.g., Travel Manager, CFO"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newLeadForm.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={newLeadForm.phone}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isDecisionMaker" className="text-right">
                  Decision Maker
                </Label>
                <div className="col-span-3 flex items-center">
                  <input
                    id="isDecisionMaker"
                    name="isDecisionMaker"
                    type="checkbox"
                    checked={newLeadForm.isDecisionMaker}
                    onChange={handleInputChange}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isDecisionMaker" className="ml-2 text-sm">
                    Contact is a decision maker
                  </Label>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Initial Status
                </Label>
                <Select
                  name="status"
                  value={newLeadForm.status}
                  onValueChange={(value) => setNewLeadForm(prev => ({...prev, status: value}))}
                >
                  <SelectTrigger className="col-span-3 border-gray-300">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="unqualified">Unqualified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="source" className="text-right">
                  Lead Source
                </Label>
                <Select
                  name="source"
                  value={newLeadForm.source}
                  onValueChange={(value) => setNewLeadForm(prev => ({...prev, source: value}))}
                >
                  <SelectTrigger className="col-span-3 border-gray-300">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="cold_outreach">Cold Outreach</SelectItem>
                    <SelectItem value="marketing">Marketing Campaign</SelectItem>
                    <SelectItem value="social_media">Social Media</SelectItem>
                    <SelectItem value="corporate_search">Corporate Search</SelectItem>
                    <SelectItem value="ai_discovery">AI Discovery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="estimatedValue" className="text-right">
                  Estimated Value
                </Label>
                <Input
                  id="estimatedValue"
                  name="estimatedValue"
                  value={newLeadForm.estimatedValue}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="e.g., 25000, 450000"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <textarea
                  id="notes"
                  name="notes"
                  value={newLeadForm.notes}
                  onChange={handleInputChange}
                  className="col-span-3 min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Additional notes about this lead..."
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save Lead</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
        <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden">
            <DialogHeader className="border-b border-gray-200 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-xl font-semibold text-gray-900">
                    Lead History - {selectedLeadName}
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 mt-1">
                    Complete activity history for {selectedLeadName}
                  </DialogDescription>
                </div>
                <DialogClose asChild>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </Button>
                </DialogClose>
              </div>
            </DialogHeader>

            <div className="py-4 max-h-[65vh] overflow-y-auto">
              {historyLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mr-3"></div>
                  <p className="text-gray-600">Loading history...</p>
                </div>
              ) : selectedLeadHistory.length === 0 ? (
                <div className="text-center py-12">
                  <History className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 text-lg">No history available for this lead.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {selectedLeadHistory.map((entry, index) => {
                    const IconComponent = getHistoryIcon(entry.icon);

                    const getActionTypeLabel = (type: string) => {
                      const typeMap: { [key: string]: string } = {
                        'creation': 'Note',
                        'status_change': 'Status',
                        'note_added': 'Note',
                        'score_update': 'Score',
                        'assignment': 'Assignment',
                        'contact_made': 'Call',
                        'email_sent': 'Email',
                        'call_made': 'Call',
                        'meeting_scheduled': 'Meeting',
                        'qualification': 'Qualification',
                        'disqualification': 'Disqualification',
                        'opportunity_created': 'Opportunity',
                        'proposal_sent': 'Proposal',
                        'negotiation_started': 'Negotiation',
                        'won': 'Won',
                        'lost': 'Lost'
                      };
                      return typeMap[entry.history_type] || 'Activity';
                    };

                    const getIconColor = (type: string) => {
                      const colorMap: { [key: string]: string } = {
                        'creation': 'bg-blue-100 text-blue-600',
                        'status_change': 'bg-green-100 text-green-600',
                        'note_added': 'bg-purple-100 text-purple-600',
                        'score_update': 'bg-orange-100 text-orange-600',
                        'assignment': 'bg-indigo-100 text-indigo-600',
                        'contact_made': 'bg-blue-100 text-blue-600',
                        'email_sent': 'bg-blue-100 text-blue-600',
                        'call_made': 'bg-green-100 text-green-600',
                        'meeting_scheduled': 'bg-purple-100 text-purple-600',
                        'qualification': 'bg-green-100 text-green-600',
                        'disqualification': 'bg-red-100 text-red-600',
                        'opportunity_created': 'bg-yellow-100 text-yellow-600',
                        'proposal_sent': 'bg-indigo-100 text-indigo-600',
                        'negotiation_started': 'bg-purple-100 text-purple-600',
                        'won': 'bg-green-100 text-green-600',
                        'lost': 'bg-red-100 text-red-600'
                      };
                      return colorMap[entry.history_type] || 'bg-gray-100 text-gray-600';
                    };

                    const formatTimestamp = (timestamp: string) => {
                      const date = new Date(timestamp);
                      return date.toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      }) + ' at ' + date.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      });
                    };

                    return (
                      <div key={entry.id} className="flex items-start gap-4 relative">
                        {/* Timeline line */}
                        {index < selectedLeadHistory.length - 1 && (
                          <div className="absolute left-6 top-12 w-px h-12 bg-gray-200"></div>
                        )}

                        {/* Icon */}
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full flex-shrink-0 ${getIconColor(entry.history_type)}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {getActionTypeLabel(entry.history_type)}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {formatTimestamp(entry.timestamp)}
                                </span>
                              </div>
                              <h4 className="font-medium text-gray-900 mb-2">{entry.action}</h4>
                              <p className="text-gray-600 text-sm leading-relaxed">{entry.details}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                            <User className="h-3 w-3" />
                            <span>by {entry.user_name || 'System'}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <DialogFooter className="border-t border-gray-200 pt-4">
              <Button onClick={() => setShowHistoryDialog(false)} className="bg-[#FD9646] hover:bg-[#FD9646]/90 text-white">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      {/* Assign Agent Dialog */}
      <Dialog open={showAssignAgentDialog} onOpenChange={setShowAssignAgentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Agent</DialogTitle>
            <DialogDescription>
              Assign {selectedLeads.length} selected lead{selectedLeads.length > 1 ? 's' : ''} to an agent.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="agent-select" className="text-sm font-medium text-gray-700">
                  Select Agent
                </Label>
                <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose an agent..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="jane-smith">Jane Smith</SelectItem>
                    <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                    <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                    <SelectItem value="david-brown">David Brown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Selected Leads:</strong> {selectedLeads.length} lead{selectedLeads.length > 1 ? 's' : ''} will be assigned to the selected agent.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleConfirmAssignAgent} className="bg-orange-600 hover:bg-orange-700 text-white">
              Assign Agent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Initiate Call Dialog */}
      <Dialog open={showCallDialog} onOpenChange={setShowCallDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PhoneCall className="h-5 w-5 text-blue-600" />
              Initiate Call with {selectedLeadForAction?.company.name}
            </DialogTitle>
            <DialogDescription>
              Start a phone call with {selectedLeadForAction?.contact.first_name} {selectedLeadForAction?.contact.last_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Contact Information</span>
              </div>
              <p className="text-sm text-blue-800">
                <strong>Phone:</strong> {selectedLeadForAction?.contact.phone}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Email:</strong> {selectedLeadForAction?.contact.email}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Call Notes (Optional)</Label>
              <Textarea
                placeholder="Add any notes or talking points for this call..."
                className="mt-1 min-h-[80px] resize-none"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowCallDialog(false);
                setSelectedLeadForAction(null);
              }}
              className="text-gray-600 border-gray-300"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                // Handle call initiation logic here
                toast.success(`Call initiated with ${selectedLeadForAction?.company.name}`);
                setShowCallDialog(false);
                setSelectedLeadForAction(null);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <PhoneCall className="h-4 w-4 mr-2" />
              Start Call
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Meeting Dialog */}
      <Dialog open={showMeetingDialog} onOpenChange={setShowMeetingDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-green-600" />
              Schedule Meeting with {selectedLeadForAction?.company.name}
            </DialogTitle>
            <DialogDescription>
              Schedule a business meeting with {selectedLeadForAction?.contact.first_name} {selectedLeadForAction?.contact.last_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Meeting Date</Label>
                <Input
                  type="date"
                  className="mt-1"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Meeting Time</Label>
                <Input
                  type="time"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Meeting Type</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select meeting type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discovery">Discovery Call</SelectItem>
                  <SelectItem value="presentation">Business Presentation</SelectItem>
                  <SelectItem value="negotiation">Contract Negotiation</SelectItem>
                  <SelectItem value="follow-up">Follow-up Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Meeting Agenda</Label>
              <Textarea
                placeholder="Brief description of meeting agenda and objectives..."
                className="mt-1 min-h-[80px] resize-none"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowMeetingDialog(false);
                setSelectedLeadForAction(null);
              }}
              className="text-gray-600 border-gray-300"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                // Handle meeting scheduling logic here
                toast.success(`Meeting scheduled with ${selectedLeadForAction?.company.name}`);
                setShowMeetingDialog(false);
                setSelectedLeadForAction(null);
              }}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Demo Dialog */}
      <Dialog open={showDemoDialog} onOpenChange={setShowDemoDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-purple-600" />
              Schedule Demo with {selectedLeadForAction?.company.name}
            </DialogTitle>
            <DialogDescription>
              Schedule a product demonstration for {selectedLeadForAction?.contact.first_name} {selectedLeadForAction?.contact.last_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Demo Date</Label>
                <Input
                  type="date"
                  className="mt-1"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Demo Time</Label>
                <Input
                  type="time"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Demo Type</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select demo type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product-overview">Product Overview</SelectItem>
                  <SelectItem value="technical-demo">Technical Demonstration</SelectItem>
                  <SelectItem value="custom-solution">Custom Solution Demo</SelectItem>
                  <SelectItem value="live-demo">Live System Demo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Demo Duration</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Demo Focus Areas</Label>
              <Textarea
                placeholder="Key features and solutions to demonstrate based on their business needs..."
                className="mt-1 min-h-[80px] resize-none"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowDemoDialog(false);
                setSelectedLeadForAction(null);
              }}
              className="text-gray-600 border-gray-300"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                // Handle demo scheduling logic here
                toast.success(`Demo scheduled with ${selectedLeadForAction?.company.name}`);
                setShowDemoDialog(false);
                setSelectedLeadForAction(null);
              }}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              <Video className="h-4 w-4 mr-2" />
              Schedule Demo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Company Dialog */}
      <Dialog open={showAddCompanyDialog} onOpenChange={setShowAddCompanyDialog}>
      </Dialog>
    </div>
  );
}