import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import { Skeleton } from "./ui/skeleton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useLeadApi } from "../hooks/api/useLeadApi";
import { useCompanyApi } from "../hooks/api/useCompanyApi";
import {
  Users,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  Search,
  Filter,
  Download,
  RefreshCw,
  Plus,
  MessageSquare,
  Edit,
  History,
  User,
  ArrowRight,
  Building2,
  DollarSign,
  Clock,
  Globe,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Target,
  Gift,
  MapPin,
  Briefcase,
  Activity,
  Bell,
  Settings,
  Info,
  ChevronRight,
  Megaphone,
  PhoneCall,
  CalendarDays,
  Presentation,
  Video,
  UserIcon,
  MessageCircle,
  PhoneCallIcon,
  CalendarIcon,
  ExternalLink,
  ChevronDown,
  Archive,
  TrendingUp as TrendingUpIcon,
  MoreVertical,
  Eye,
  Handshake, // Added for contract_signed
  Award, // Added for deal_won
  Save, // Added for Save button in dialog
  X, // Added for close button in dialog
  FileText, // Added for FileText
  XCircle, // Added for XCircle
  ChevronUp, // Added for ChevronUp
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"; // Added Tabs components
import { CorporateProfile } from "./CorporateProfile";
import { MarketingCampaignWizard } from "./MarketingCampaignWizard";
import { formatDate, formatDateTime } from '../utils/dateFormatter';

interface LeadsListProps {
  initialFilters?: any;
  onNavigate: (screen: string, filters?: any) => void;
}

// Interface for History Entry (as expected from API)
interface HistoryEntry {
  id: string | number;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  author: { username: string }; // Assuming author structure from API
  history_type?: string; // Added for new history types
  action?: string;
  user_name?: string;
  user_role?: string;
  metadata?: any;
  formatted_timestamp?: string;
  assigned_agent?: string; // Added for agent assignment history
  previous_agent?: string; // Added for previous agent in reassignment history
  assignment_priority?: string; // Added for priority in assignment history
  assignment_notes?: string; // Added for notes in assignment history
  icon?: string; // Added for icon mapping
}

// Interface for Lead (simplified for context)
interface Lead {
  id: number;
  company: string;
  contact: string;
  title: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  employees: number | string;
  revenue: string;
  location: string;
  status: string;
  score: number;
  source: string;
  lastContact: string;
  nextAction: string;
  notes: string;
  leadNotes: any[];
  engagement: string;
  travelBudget: string;
  decisionMaker: boolean;
  urgency: string;
  aiSuggestion: string;
  tags: string[];
  contractReady: boolean;
  lastActivity: string;
  followUpDate: string;
  assignedAgent: string | null;
  assigned_agent_details?: {
    // Added for agent details
    name: string;
    email: string;
    specialties: string[];
    current_leads: number;
  };
  campaignCount: number; // Number of email campaigns run against this lead
  history_entries: HistoryEntry[]; // This will be populated from API calls
  has_opportunity: boolean; // Added to track if lead has been converted to an opportunity
}

// Helper function to transform API history entry to a consistent format
const transformHistoryEntry = (entry: any) => {
  // Mapping from API's activity_type to our internal display type and icon
  const typeMap: { [key: string]: { display: string; icon: string } } = {
    lead_created: { display: "Lead Created", icon: "plus" },
    note_added: { display: "Note Added", icon: "message-square" },
    phone_call: { display: "Phone Call", icon: "phone" },
    meeting_scheduled: { display: "Meeting Scheduled", icon: "calendar" },
    lead_qualified: { display: "Lead Qualified", icon: "check-circle" },
    lead_disqualified: { display: "Lead Disqualified", icon: "x-circle" },
    email_sent: { display: "Email Sent", icon: "mail" },
    lead_responded: { display: "Lead Responded", icon: "message-circle" },
    status_change: { display: "Status Change", icon: "refresh-cw" },
    score_updated: { display: "Score Updated", icon: "trending-up" },
    lead_assigned: { display: "Lead Assigned", icon: "user" },
    proposal_sent: { display: "Proposal Sent", icon: "briefcase" },
    contract_signed: { display: "Contract Signed", icon: "handshake" },
    deal_won: { display: "Deal Won", icon: "award" },
    discovery_call_scheduled: {
      display: "Discovery Call Scheduled",
      icon: "phone",
    },
    custom: { display: "Custom Activity", icon: "activity" }, // For generic or unmapped types
  };

  return {
    id: entry.id,
    type: typeMap[entry.activity_type]
      ? typeMap[entry.activity_type].display
      : entry.activity_type
          .replace("_", " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()), // Display type
    action:
      entry.title || typeMap[entry.activity_type]?.display || "Unknown Action", // Title or mapped display
    user: entry.created_by?.username || "Unknown User",
    timestamp: entry.created_at,
    details: entry.description,
    icon: typeMap[entry.activity_type]
      ? typeMap[entry.activity_type].icon
      : "activity", // Default to 'activity'
  };
};

// Transform API lead data to match the component's expected format
const transformApiLeadToUILead = (apiLead: any) => {
  // Get the latest note from latest_note array if available
  const latestNote =
    apiLead.latest_note && apiLead.latest_note.length > 0
      ? apiLead.latest_note[0] // Notes are ordered by -created_at in the backend
      : null;

  // Combine original notes with latest lead notes
  const combinedNotes = [
    apiLead.notes || "",
    latestNote
      ? `[${formatDate(new Date(latestNote.created_at))}] ${latestNote.note}`
      : "",
  ]
    .filter(Boolean)
    .join(" | ");

  return {
    id: apiLead.id,
    company: apiLead.company.name || "Unknown Company",
    contact:
      `${apiLead.full_name || ""} ${apiLead.contact.last_name || ""}`.trim() ||
      "Unknown Contact",
    title: apiLead.contact.position || "Unknown Position",
    email: apiLead.contact.email || "unknown@email.com",
    phone: apiLead.contact.phone || "N/A",
    website:
      apiLead.company.website ||
      `https://wwwwww. ${(apiLead.company.name || "company").toLowerCase().replace(/\s+/g, "")}.com`,
    industry: apiLead.company.industry || "Unknown",
    employees: apiLead.company?.size || 0,
    revenue: apiLead.company?.annual_revenue
      ? `$${Math.floor(apiLead.company.annual_revenue / 1000)}K`
      : "$0K",
    location: apiLead.company.location || "Unknown Location",
    status: apiLead.status || "new",
    score: apiLead.score || 50,
    source: apiLead.source || "Unknown",
    lastContact: apiLead.last_contact_at
      ? formatDate(new Date(apiLead.last_contact_at))
      : apiLead.created_at
        ? formatDate(new Date(apiLead.created_at))
        : formatDate(new Date()),
    nextAction: apiLead.next_action || "Follow up",
    notes: combinedNotes,
    leadNotes: apiLead.leadNotes || [], // Store all notes for display
    engagement:
      apiLead.score >= 80 ? "High" : apiLead.score >= 60 ? "Medium" : "Low",
    travelBudget: apiLead.company?.travel_budget
      ? `$${Math.floor(apiLead.company.travel_budget / 1000)}K`
      : "$0K",
    decisionMaker: apiLead.contact?.is_decision_maker || Math.random() > 0.5,
    urgency: apiLead.priority || "Medium", // Assuming 'priority' field maps to urgency
    aiSuggestion: `AI Score: ${apiLead.score}. ${apiLead.score >= 80 ? "High priority lead - contact immediately" : apiLead.score >= 60 ? "Medium priority - follow up within 2 days" : "Low priority - add to nurture campaign"}`,
    tags: [apiLead.company?.industry || "General", apiLead.status || "New"],
    contractReady: apiLead.status === "qualified",
    lastActivity: apiLead.updated_at
      ? formatDate(new Date(apiLead.updated_at))
      : apiLead.created_at
        ? formatDate(new Date(apiLead.created_at))
        : formatDate(new Date()),
    followUpDate:
      apiLead.next_action_date ||
      formatDate(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)),
    assignedAgent: apiLead.assigned_to?.username || null,
    assigned_agent_details: apiLead.assigned_to
      ? {
          // Map assigned agent details if available
          name: apiLead.assigned_to.full_name || apiLead.assigned_to.username,
          email:
            apiLead.assigned_to.email ||
            `${apiLead.assigned_to.username}@soarai.com`,
          specialties: apiLead.assigned_to.specialties || [], // Assuming specialties field exists
          current_leads: apiLead.assigned_to.current_leads || 0, // Assuming current_leads field exists
        }
      : undefined,
    // Campaign count from API
    campaignCount: apiLead.campaign_count || 0,
    // History will be fetched separately via API and mapped in the dialog
    history_entries: [], // This will be populated via getHistory API call
    has_opportunity: apiLead.has_opportunity || false, // Map has_opportunity from API
  };
};

// Transform API lead data to match the component's expected format for view profile
const transformCompanyDataForViewProfile = (apiLead) => {
  console.log(apiLead, "apilead for view profile");
  // Transform backend data to match frontend expectations
  return {
    id: apiLead.id,
    name: apiLead.company.name,
    type: getCompanyTypeDisplay(
      apiLead.company.company_type || apiLead.company.size,
    ),
    industry: getIndustryDisplay(apiLead.company.industry),
    location: apiLead.company.location,
    aiScore: Math.floor(Math.random() * 20) + 80, // Random AI score for demo
    rating: (Math.random() * 1 + 4).toFixed(1), // Random rating 4.0-5.0
    established:
      apiLead.company.year_established ||
      (apiLead.company.created_at
        ? new Date(apiLead.company.created_at).getFullYear()
        : 2020),
    employees:
      apiLead.company.employee_count || Math.floor(Math.random() * 5000) + 100,
    specialties: apiLead.company.specialties
      ? apiLead.company.specialties
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s)
          .slice(0, 5)
      : ["Business Services", "Corporate Solutions"],
    travelBudget: apiLead.company.travel_budget
      ? `${(apiLead.company.travel_budget / 1000000).toFixed(1)}M`
      : "1.0M",
    annualTravelVolume:
      apiLead.company.annual_travel_volume ||
      `${Math.floor(Math.random() * 5000) + 1000} trips`,
    contracts: Math.floor(Math.random() * 20) + 1,
    revenue:
      apiLead.company.annual_revenue ||
      Math.floor(Math.random() * 50000000) + 10000000,
    phone:
      apiLead.company.phone ||
      "+1 (555) " +
        Math.floor(Math.random() * 900 + 100) +
        "-" +
        Math.floor(Math.random() * 9000 + 1000),
    email:
      apiLead.company.email ||
      `contact@${apiLead.company.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
    website:
      apiLead.company.website ||
      `www.${apiLead.company.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
    aiRecommendation: generateAIRecommendation(apiLead.company),
    compliance: Math.floor(Math.random() * 20) + 80,
    financialStability: Math.floor(Math.random() * 20) + 80,
    travelFrequency:
      apiLead.company.travel_frequency || getRandomTravelFrequency(),
    destinations: getRandomDestinations(),
    preferredClass:
      apiLead.company.preferred_class || getRandomPreferredClass(),
    teamSize: Math.floor((apiLead.company.employee_count || 1000) * 0.1),
    travelManagers: Math.floor(Math.random() * 5) + 1,
    currentAirlines: apiLead.company.current_airlines
      ? apiLead.company.current_airlines
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s)
          .slice(0, 5)
      : getRandomAirlines(),
    paymentTerms: apiLead.company.payment_terms || getRandomPaymentTerms(),
    creditRating: apiLead.company.credit_rating || getRandomCreditRating(),
    sustainabilityFocus:
      apiLead.company.sustainability_focus || getRandomSustainabilityFocus(),
    technologyIntegration: apiLead.company.technology_integration
      ? apiLead.company.technology_integration
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s)
          .slice(0, 5)
      : getRandomTechIntegration(),
    seasonality: getRandomSeasonality(),
    meetingTypes: getRandomMeetingTypes(),
    companySize: getSizeDisplay(apiLead.company.size),
    marketSegment: getIndustryDisplay(apiLead.company.industry),
    decisionMakers: Math.floor(Math.random() * 8) + 2,
    contractValue: Math.floor(Math.random() * 3000000) + 500000,
    competitorAirlines: Math.floor(Math.random() * 5) + 1,
    loyaltyPotential: Math.floor(Math.random() * 30) + 70,
    expansionPlans:
      apiLead.company.expansion_plans || getRandomExpansionPlans(),
    riskLevel: apiLead.company.risk_level || getRandomRiskLevel(),
  };
};

// Helper functions for company profile data transformation
const getCompanyTypeDisplay = (size) => {
  const types = {
    startup: "Startup Company",
    small: "Small Business",
    medium: "Medium Corporation",
    large: "Large Corporation",
    enterprise: "Enterprise Corporation",
    corporation: "Corporation",
    llc: "LLC",
    partnership: "Partnership",
    nonprofit: "Non-Profit",
  };
  return types[size] || "Corporation";
};

const getIndustryDisplay = (industry) => {
  const industries = {
    technology: "Technology & Software",
    finance: "Finance & Banking",
    healthcare: "Healthcare",
    manufacturing: "Manufacturing",
    retail: "Retail & Consumer",
    consulting: "Consulting Services",
    telecommunications: "Telecommunications",
    energy: "Energy & Utilities",
    transportation: "Transportation & Logistics",
    education: "Education",
    government: "Government",
    other: "Other",
  };
  return industries[industry] || "Business Services";
};

const getSizeDisplay = (size) => {
  const sizes = {
    startup: "Startup",
    small: "Small",
    medium: "Medium",
    large: "Large",
    enterprise: "Enterprise",
  };
  return sizes[size] || "Medium";
};

const generateAIRecommendation = (company) => {
  const recommendations = [
    "High-potential corporate client with strong growth indicators. Excellent opportunity for partnership.",
    "Established company with consistent business patterns. Good candidate for long-term contracts.",
    "Growing organization with expanding travel needs. Consider volume-based pricing strategies.",
    "Premium client with sophisticated requirements. Focus on high-service offerings.",
    "Cost-conscious organization seeking value. Emphasize efficiency and competitive pricing.",
  ];
  return recommendations[Math.floor(Math.random() * recommendations.length)];
};

const getRandomTravelFrequency = () => {
  const frequencies = ["Daily", "Weekly", "Monthly", "Bi-weekly", "Quarterly"];
  return frequencies[Math.floor(Math.random() * frequencies.length)];
};

const getRandomDestinations = () => {
  const destinations = [
    ["North America", "Europe"],
    ["Global", "Asia-Pacific", "Europe"],
    ["North America", "Asia-Pacific"],
    ["Domestic", "Regional"],
    ["Global", "Emerging Markets"],
  ];
  return destinations[Math.floor(Math.random() * destinations.length)];
};

const getRandomPreferredClass = () => {
  const classes = [
    "Economy",
    "Economy Plus",
    "Business",
    "First",
    "Business/First",
  ];
  return classes[Math.floor(Math.random() * classes.length)];
};

const getRandomAirlines = () => {
  const airlines = [
    ["United", "Delta"],
    ["American", "Southwest"],
    ["Emirates", "Singapore Airlines"],
    ["British Airways", "Lufthansa"],
    ["Air France", "KLM"],
  ];
  return airlines[Math.floor(Math.random() * airlines.length)];
};

const getRandomPaymentTerms = () => {
  const terms = ["Net 15", "Net 30", "Net 45", "Net 60"];
  return terms[Math.floor(Math.random() * terms.length)];
};

const getRandomCreditRating = () => {
  const ratings = ["AAA", "AA", "A", "BBB", "A+"];
  return ratings[Math.floor(Math.random() * ratings.length)];
};

const getRandomSustainabilityFocus = () => {
  const focus = ["Very High", "High", "Medium", "Low"];
  return focus[Math.floor(Math.random() * focus.length)];
};

const getRandomTechIntegration = () => {
  const tech = [
    ["API", "Mobile App"],
    ["GDS", "Corporate Portal"],
    ["API", "Real-time Booking"],
    ["Mobile App", "Expense Management"],
    ["Corporate Portal", "Reporting"],
  ];
  return tech[Math.floor(Math.random() * tech.length)];
};

const getRandomSeasonality = () => {
  const patterns = [
    "Year-round",
    "Q1/Q3 Heavy",
    "Spring/Summer Peak",
    "Holiday Heavy",
  ];
  return patterns[Math.floor(Math.random() * patterns.length)];
};

const getRandomMeetingTypes = () => {
  const types = [
    ["Business Meetings", "Conferences"],
    ["Client Visits", "Trade Shows"],
    ["Team Offsites", "Training"],
    ["Site Visits", "Regulatory Meetings"],
  ];
  return types[Math.floor(Math.random() * types.length)];
};

const getRandomExpansionPlans = () => {
  const plans = ["Aggressive", "Moderate", "Conservative", "Rapid", "Stable"];
  return plans[Math.floor(Math.random() * plans.length)];
};

const getRandomRiskLevel = () => {
  const risks = ["Very Low", "Low", "Medium", "High"];
  return risks[Math.floor(Math.random() * risks.length)];
};

// This function is now primarily for reference if needed, but history is fetched from API
// It's kept here as a fallback or for understanding the original logic.
const buildLeadHistory = (apiLead: any) => {
  const history = [];
  let historyId = 1;

  // Lead creation
  history.push({
    id: historyId++,
    type: "creation",
    action: "Lead created",
    user: "System",
    timestamp: apiLead.created_at || new Date().toISOString(),
    details: `Lead created from ${apiLead.source || "unknown source"}. Initial contact information collected for ${apiLead.company?.name || "company"}.`,
    icon: "plus",
  });

  // Status changes
  if (apiLead.status === "contacted") {
    history.push({
      id: historyId++,
      type: "status_change",
      action: "Lead contacted",
      user: apiLead.assigned_to?.username || "Sales Team",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      details: `Initial contact made with ${apiLead.contact?.first_name || "contact"}. Outreach sent via email.`,
      icon: "mail",
    });
  }

  if (apiLead.status === "responded") {
    history.push({
      id: historyId++,
      type: "response",
      action: "Lead responded",
      user: apiLead.contact?.first_name || "Contact",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      details: `${apiLead.contact?.first_name || "Contact"} responded to initial outreach. Expressed interest in travel solutions.`,
      icon: "message-circle",
    });
  }

  if (apiLead.status === "in-progress") {
    history.push({
      id: historyId++,
      type: "call",
      action: "Discovery call scheduled",
      user: apiLead.assigned_to?.username || "Sales Team",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      details:
        "Scheduled 30-minute discovery call. Discussed travel requirements and current pain points.",
      icon: "phone",
    });
  }

  if (apiLead.status === "qualified") {
    history.push({
      id: historyId++,
      type: "qualification",
      action: "Lead qualified as high-priority",
      user: apiLead.assigned_to?.username || "Sales Manager",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      details: `Lead qualified based on budget (${apiLead.estimated_value ? `$${Math.floor(apiLead.estimated_value / 1000)}K` : "TBD"}), authority, and timeline. Ready for proposal stage.`,
      icon: "check-circle",
    });
  }

  if (apiLead.status === "unqualified") {
    history.push({
      id: historyId++,
      type: "disqualification",
      action: "Lead disqualified",
      user: apiLead.assigned_to?.username || "Sales Team",
      timestamp: new Date().toISOString(),
      details:
        "Lead disqualified due to budget constraints or timeline mismatch. Moved to nurture campaign.",
      icon: "x-circle",
    });
  }

  // Score updates
  if (apiLead.score && apiLead.score > 50) {
    history.push({
      id: historyId++,
      type: "score_update",
      action: "Lead score updated",
      user: "AI System",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      details: `Lead score updated to ${apiLead.score} based on engagement metrics and profile analysis.`,
      icon: "trending-up",
    });
  }

  // Add all lead notes to history
  if (apiLead.lead_notes && apiLead.lead_notes.length > 0) {
    apiLead.lead_notes.forEach((note: any) => {
      history.push({
        id: historyId++,
        type: "note",
        action: "Note added",
        user: note.created_by?.username || "User",
        timestamp: note.created_at,
        details: note.note,
        icon: "message-square",
        metadata: {
          next_action: note.next_action,
          urgency: note.urgency,
        },
      });
    });
  }

  // Assignment changes
  if (apiLead.assigned_to) {
    history.push({
      id: historyId++,
      type: "assignment",
      action: "Lead assigned",
      user: "Sales Manager",
      timestamp: apiLead.created_at || new Date().toISOString(),
      details: `Lead assigned to ${apiLead.assigned_to.first_name} ${apiLead.assigned_to.last_name} for follow-up.`,
      icon: "user",
    });
  }

  // Sort history by timestamp (oldest first)
  return history.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
};

export function LeadsList({ initialFilters, onNavigate }: LeadsListProps) {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const leadApi = useLeadApi();
  const companyApi = useCompanyApi();
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [selectedLead, setSelectedLead] = useState<any>(null); // State for the lead selected in other dialogs
  const [showNewCompanyDialog, setShowNewCompanyDialog] = useState(false); // Changed from showNewLeadDialog
  const [showDisqualifyDialog, setShowDisqualifyDialog] = useState(false);
  const [selectedLeadForDisqualify, setSelectedLeadForDisqualify] =
    useState<any>(null);
  const [disqualifyReason, setDisqualifyReason] = useState("");
  const [showQualifyDialog, setShowQualifyDialog] = useState(false);
  const [selectedLeadForQualify, setSelectedLeadForQualify] = useState<any>(null);
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [selectedLeadForContact, setSelectedLeadForContact] =
    useState<any>(null);
  const [contactForm, setContactForm] = useState({
    method: "Email",
    subject: "",
    message: "",
    followUpDate: "",
  });
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  const [selectedLeadForNote, setSelectedLeadForNote] = useState<any>(null);
  const [noteForm, setNoteForm] = useState({
    note: "",
    nextAction: "",
    urgency: "Medium",
  });
  const [expandedNotes, setExpandedNotes] = useState<{
    [key: number]: boolean;
  }>({});
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [selectedLeadForHistory, setSelectedLeadForHistory] =
    useState<any>(null);
  const [leadHistory, setLeadHistory] = useState<{
    [key: number]: HistoryEntry[];
  }>({}); // Stores history entries fetched from API
  const [isLoadingHistory, setIsLoadingHistory] = useState(false); // Loading state for history fetch
  const [filters, setFilters] = useState({
    status: initialFilters?.status || "all",
    industry: initialFilters?.industry || "all",
    score: initialFilters?.score || "all",
    engagement: initialFilters?.engagement || "all",
    search: initialFilters?.search || "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 10; // Number of leads to display per page

  // New company form state
  const [newCompanyForm, setNewCompanyForm] = useState({
    name: "",
    type: "", // Added type for company
    industry: "",
    location: "",
    website: "",
    phone: "",
    email: "",
    established: "", // Year established
    employees: "", // Number of employees
    revenue: "", // Annual revenue in millions
    travelBudget: "", // Annual travel budget
    annualTravelVolume: "", // Annual travel volume (e.g., number of trips)
    travelFrequency: "", // How often they travel
    preferredClass: "", // Preferred travel class
    companySize: "", // Category like startup, small, medium, etc.
    creditRating: "",
    paymentTerms: "",
    sustainabilityFocus: "",
    riskLevel: "",
    expansionPlans: "",
    specialties: "", // Comma-separated specialties
    technologyIntegration: "", // Comma-separated tech integrations
    currentAirlines: "", // Comma-separated current airlines used
    notes: "", // Additional notes
  });
  const [newCompany, setNewCompany] = useState({
    name: "",
    type: "",
    industry: "",
    location: "",
    website: "",
    phone: "",
    email: "",
    established: "",
    employees: "",
    revenue: "",
    travelBudget: "",
    annualTravelVolume: "",
    travelFrequency: "",
    preferredClass: "",
    companySize: "",
    creditRating: "",
    paymentTerms: "",
    sustainabilityFocus: "",
    riskLevel: "",
    expansionPlans: "",
    specialties: "",
    technologyIntegration: "",
    currentAirlines: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [qualifyingLeadId, setQualifyingLeadId] = useState<number | null>(null);
  const [disqualifyingLeadId, setDisqualifyingLeadId] = useState<number | null>(
    null,
  );
  const [movingToOpportunityId, setMovingToOpportunityId] = useState<number | null>(null);
  const [leadNotes, setLeadNotes] = useState<{ [key: number]: any[] }>({}); // Stores lead notes fetched from API
  const [isLoadingNotes, setIsLoadingNotes] = useState<{
    [key: number]: boolean;
  }>({}); // Loading state for notes fetch
  const [showAddCompanyDialog, setShowAddCompanyDialog] = useState(false); // State for Add Company Dialog
  const [showMarketingCampaign, setShowMarketingCampaign] = useState(false); // State for Marketing Campaign
  const [showCorporateProfile, setShowCorporateProfile] = useState(false); // State for Corporate Profile
  const [selectedCorporate, setSelectedCorporate] = useState<any>(null); // Selected corporate data
  const [leadsForViewProfile, setLeadsForViewProfile] = useState<any[]>([]); // Leads data for view profile

  // Modal states
  const [showInitiateCallModal, setShowInitiateCallModal] = useState(false);
  const [showScheduleMeetingModal, setShowScheduleMeetingModal] =
    useState(false);
  const [showScheduleDemoModal, setShowScheduleDemoModal] = useState(false);
  const [showAssignAgentModal, setShowAssignAgentModal] = useState(false);
  const [showMoveToOpportunityDialog, setShowMoveToOpportunityDialog] = useState(false); // New state for confirmation dialog
  const [selectedLeadForOpportunity, setSelectedLeadForOpportunity] = useState<any>(null); // State to hold the lead for the confirmation dialog


  // Selected lead for actions
  const [selectedLeadForAction, setSelectedLeadForAction] = useState<any>(null);
  const [selectedLeadForAssign, setSelectedLeadForAssign] = useState<any>(null);

  // Agent assignment states
  const [selectedAgent, setSelectedAgent] = useState("");
  const [assignmentPriority, setAssignmentPriority] =
    useState("Medium Priority");
  const [assignmentNotes, setAssignmentNotes] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  const isFormValid = () => {
    return (
      newCompany.name.trim() !== "" &&
      newCompany.industry !== "" &&
      newCompany.companySize !== "" &&
      newCompany.location.trim() !== "" &&
      newCompany.email.trim() !== ""
    );
  };
  const clearfilter = () => {
    const defaultFilters = {
      status: "all",
      industry: "all",
      score: "all",
      engagement: "all",
      search: "",
    };
    setFilters(defaultFilters);

    // Fetch leads with cleared filters
    // fetchLeadsWithFilters(defaultFilters);
  };

  // Helper function to fetch leads with specific filters
  const fetchLeadsWithFilters = async (filterParams = filters) => {
    try {
      setLoading(true);
      setCurrentPage(1); // Reset to first page on new fetch
      // Apply filter parameters when fetching
      const apiFilterParams = {
        search: filterParams.search || "",
        status: filterParams.status !== "all" ? filterParams.status : "",
        industry: filterParams.industry !== "all" ? filterParams.industry : "",
        score: filterParams.score !== "all" ? filterParams.score : "",
        engagement: filterParams.engagement !== "all" ? filterParams.engagement : "",
      };

      console.log("Fetching leads with filters:", apiFilterParams);
      const apiResponse = await leadApi.getLeads(apiFilterParams);
      console.log("Raw API response:", apiResponse);

      // Handle different response formats
      let apiLeads = [];
      if (Array.isArray(apiResponse)) {
        apiLeads = apiResponse;
      } else if (apiResponse && Array.isArray(apiResponse.results)) {
        apiLeads = apiResponse.results;
      } else if (
        apiResponse &&
        apiResponse.data &&
        Array.isArray(apiResponse.data)
      ) {
        apiLeads = apiResponse.data;
      } else {
        console.warn("Unexpected API response format:", apiResponse);
        apiLeads = [];
      }

      console.log("Processed leads array:", apiLeads);

      // Transform leads
      const transformedLeads = apiLeads.map((apiLead: any) => {
        console.log("Transforming lead:", apiLead);
        return transformApiLeadToUILead(apiLead);
      });

      const transformedLeadsforViewProfile = apiLeads.map((apiLead: any) => {
        console.log("Transforming leadfor view profile:", apiLead);
        return transformCompanyDataForViewProfile(apiLead);
      });

      console.log(
        "Final transformed leads:",
        transformedLeads,
        "transformed leads for view profile:",
        transformedLeadsforViewProfile,
      );
      setLeads(transformedLeads);

      // Initialize leadNotes state with data from the leads response
      const notesData: { [key: number]: any[] } = {};
      apiLeads.forEach((apiLead: any) => {
        notesData[apiLead.id] = apiLead.latest_note || [];
      });
      setLeadNotes(notesData);

      setLeadsForViewProfile(transformedLeadsforViewProfile);
    } catch (error) {
      console.error("Error fetching leads:", error);
      console.error("Error details:", error?.response?.data);
      toast.error("Failed to fetch leads from server");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };
  // Fetch leads from API using current filters
  const fetchLeads = async () => {
    await fetchLeadsWithFilters(filters);
  };

  // Note: fetchLeadNotes function removed since notes are now included in the leads response

  useEffect(() => {
    // Always fetch leads on component mount
    fetchLeads();
  }, []); // Empty dependency array for initial mount

  // Initialize filters from props on mount
  useEffect(() => {
    if (initialFilters) {
      setFilters((prev) => ({
        ...prev,
        ...initialFilters,
      }));

      if (initialFilters.newLead && leads.length > 0) {
        // Logic to handle a new lead created from an external source (like a form submission)
        // This part assumes the lead data is already structured.
        const newLead = {
          id: Math.max(...leads.map((l) => l.id), 0) + 1, // Ensure ID is unique, fallback to 0 if leads is empty
          company: initialFilters.newLead.company,
          contact: initialFilters.newLead.contact || "Contact Name",
          title: initialFilters.newLead.title || "Decision Maker",
          email: initialFilters.newLead.email,
          phone: initialFilters.newLead.phone,
          website:
            initialFilters.newLead.website ||
            `https://wwwwww.${initialFilters.newLead.company.toLowerCase().replace(/\s+/g, "")}.com`,
          industry: initialFilters.newLead.industry,
          employees: initialFilters.newLead.employees,
          revenue: initialFilters.newLead.revenue,
          location: initialFilters.newLead.location,
          status: "new",
          score: initialFilters.newLead.aiScore || 75,
          source: initialFilters.newLead.source || "Corporate Search",
          lastContact: formatDate(new Date()),
          nextAction: "Initial contact and qualification",
          notes: initialFilters.newLead.notes,
          engagement: "Low", // Default engagement
          travelBudget: initialFilters.newLead.travelBudget,
          decisionMaker: initialFilters.newLead.decisionMaker || true,
          urgency: "Medium",
          aiSuggestion: `High-potential lead from corporate search. AI Score: ${initialFilters.newLead.aiScore || 75}. Recommend immediate outreach and qualification.`,
          tags: initialFilters.newLead.tags || ["Corporate Search", "New Lead"],
          contractReady: false,
          lastActivity: formatDate(new Date()),
          followUpDate: formatDate(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)),
          history_entries: [], // Will be fetched if needed, or use the provided notes as initial history
          has_opportunity: false, // Default to false
        };

        // For initial display, we can add a placeholder history entry from the notes
        if (initialFilters.newLead.notes) {
          newLead.history_entries.push({
            id: Date.now(), // Temporary ID
            type: "note",
            title: "Initial Notes",
            description: initialFilters.newLead.notes,
            timestamp: new Date().toISOString(),
            author: { username: "System" },
          });
        }

        setLeads((prev) => [newLead, ...prev]);
        setSuccessMessage(
          initialFilters.message ||
            `${initialFilters.newLead.company} has been successfully added as a lead`,
        );
        setTimeout(() => setSuccessMessage(""), 5000);
      }
    }
  }, [initialFilters]); // Remove leads dependency to prevent infinite loops

  // Remove automatic refetch on filter changes - now only triggered by Search button

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "qualified":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "contacted":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "responded":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "unqualified":
        return "bg-red-100 text-red-700 border-red-200";
      case "new":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getUrgencyBadgeStyle = (urgency: string) => {
    switch (urgency) {
      case "High":
        return "bg-red-100 text-red-700 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const toggleNotesExpansion = (leadId: number) => {
    setExpandedNotes((prev) => ({
      ...prev,
      [leadId]: !prev[leadId],
    }));
  };

  const handleSelectLead = (leadId: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedLeads((prev) => [...prev, leadId]);
    } else {
      setSelectedLeads((prev) => prev.filter((id) => id !== leadId));
      setSelectAll(false);
    }
  };

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedLeads(filteredLeads.map((lead) => lead.id));
      setSelectAll(true);
    } else {
      setSelectedLeads([]);
      setSelectAll(false);
    }
  };

  const handleBackToSearch = () => {
    setShowCorporateProfile(false);
    setSelectedCorporate(null);
  };

  // Function to create a new lead via API
  const handleCreateNewLead = async () => {
    setIsSubmitting(true); // Set submitting state
    try {
      // Basic validation for required fields
      if (
        !newCompanyForm.name.trim() ||
        !newCompanyForm.email.trim() ||
        !newCompanyForm.industry ||
        !newCompanyForm.companySize ||
        !newCompanyForm.location.trim()
      ) {
        toast.error(
          "Please fill in all required fields (Company Name, Email, Industry, Company Size, and Location)",
        );
        setIsSubmitting(false); // Reset submitting state
        return;
      }

      const leadData = {
        company: {
          name: newCompanyForm.name,
          company_type: newCompanyForm.type || null, // Use company type
          industry: newCompanyForm.industry,
          location: newCompanyForm.location,
          website: newCompanyForm.website || null,
          employees: newCompanyForm.employees
            ? parseInt(newCompanyForm.employees)
            : null, // Parse employees to number
          annual_revenue: newCompanyForm.revenue
            ? parseFloat(newCompanyForm.revenue) * 1000000
            : null, // Convert millions to actual value
          established_year: newCompanyForm.established
            ? parseInt(newCompanyForm.established)
            : null, // Parse year to number
          company_size: newCompanyForm.companySize,
          credit_rating: newCompanyForm.creditRating || null,
          payment_terms: newCompanyForm.paymentTerms || null,
          travel_budget: newCompanyForm.travelBudget
            ? parseFloat(newCompanyForm.travelBudget.replace(/[^0-9.]/g, "")) *
              1000
            : null, // Parse budget, assume K
          annual_travel_volume: newCompanyForm.annualTravelVolume || null,
          travel_frequency: newCompanyForm.travelFrequency || null,
          preferredClass: newCompanyForm.preferredClass || null,
          sustainability_focus: newCompanyForm.sustainabilityFocus || null,
          risk_level: newCompanyForm.riskLevel || null,
          expansionPlans: newCompanyForm.expansionPlans || null,
          specialties: newCompanyForm.specialties
            ? newCompanyForm.specialties
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : [],
          technology_integration: newCompanyForm.technologyIntegration
            ? newCompanyForm.technologyIntegration
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : [],
          current_airlines: newCompanyForm.currentAirlines
            ? newCompanyForm.currentAirlines
                .split(",")
                .map((a) => a.trim())
                .filter(Boolean)
            : [],
        },
        contact: {
          // For company leads, contact info might be generic or from the primary contact
          first_name: newCompanyForm.name.split(" ")[0] || "Primary", // Fallback if name is a single word
          last_name:
            newCompanyForm.name.split(" ").slice(1).join(" ") || "Contact",
          email: newCompanyForm.email,
          phone: newCompanyForm.phone || null,
          position: "N/A", // Position is not relevant for a company lead directly
          is_decision_maker: null, // Unknown for a company lead
        },
        status: "new", // Default status for a new lead
        source: "Direct Entry", // Source from manual entry
        priority: "medium", // Default priority/urgency
        score: 50, // Default score
        estimated_value: newCompanyForm.travelBudget
          ? parseFloat(newCompanyForm.travelBudget.replace(/[^0-9.]/g, "")) *
            1000
          : null,
        notes: newCompanyForm.notes || "",
        next_action: "Initial outreach and qualification",
        next_action_date: formatDate(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)), // Default next action in 2 days
      };

      console.log("Creating lead with data:", leadData);

      // const createdLead = await leadApi.createLead(leadData);

      // console.log('Lead created successfully:', createdLead);

      // await fetchLeads(); // Refresh leads list to show the new lead

      setShowNewCompanyDialog(false); // Close the dialog
      setSuccessMessage(
        `New lead "${newCompanyForm.name}" has been created successfully!`,
      );
      setTimeout(() => setSuccessMessage(""), 5000);

      // Reset form
      setNewCompanyForm({
        name: "",
        type: "",
        industry: "",
        location: "",
        website: "",
        phone: "",
        email: "",
        established: "",
        employees: "",
        revenue: "",
        travelBudget: "",
        annualTravelVolume: "",
        travelFrequency: "",
        preferredClass: "",
        companySize: "",
        creditRating: "",
        paymentTerms: "",
        sustainabilityFocus: "",
        riskLevel: "",
        expansionPlans: "",
        specialties: "",
        technologyIntegration: "",
        currentAirlines: "",
        notes: "",
      });

      toast.success("Lead created successfully!");
    } catch (error) {
      console.error("Error creating lead:", error);
      toast.error("Failed to create lead. Please try again.");
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  const handleAddCompany = async () => {
    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      // Map frontend fields to Django model fields - include ALL form sections
      const companyData = {
        // Basic Info
        name: newCompany.name,
        company_type: newCompany.type,
        industry: newCompany.industry,
        location: newCompany.location,
        email: newCompany.email,
        phone: newCompany.phone,
        website: newCompany.website || "",

        // Business Details
        employee_count: newCompany.employees
          ? parseInt(newCompany.employees)
          : null,
        annual_revenue: newCompany.revenue
          ? parseFloat(newCompany.revenue) * 1000000
          : null, // Convert millions to actual amount
        year_established: newCompany.established
          ? parseInt(newCompany.established)
          : null,
        size: newCompany.companySize,
        credit_rating: newCompany.creditRating,
        payment_terms: newCompany.paymentTerms,

        // Travel Profile
        travel_budget: newCompany.travelBudget
          ? parseFloat(newCompany.travelBudget) * 1000000
          : null, // Convert millions to actual amount
        annual_travel_volume: newCompany.annualTravelVolume,
        travel_frequency: newCompany.travelFrequency,
        preferred_class: newCompany.preferredClass,
        sustainability_focus: newCompany.sustainabilityFocus,
        risk_level: newCompany.riskLevel,
        current_airlines: newCompany.currentAirlines,

        // Additional Info
        expansion_plans: newCompany.expansionPlans,
        specialties: newCompany.specialties,
        technology_integration: newCompany.technologyIntegration,
        description: newCompany.notes || "",
      };

      console.log("Step 1: Saving company data:", companyData);

      // Step 1: Save company data using the company API
      const savedCompany = await companyApi.createCompany(companyData);
      console.log(
        "Step 1 completed: Company saved successfully:",
        savedCompany,
      );

      // Step 2: Create lead from the saved company
      console.log("Step 2: Creating lead from company ID:", savedCompany.id);

      const leadData = {
        company: {
          id: savedCompany.id,
          name: savedCompany.name,
          industry: savedCompany.industry,
          location: savedCompany.location,
          size: savedCompany.size,
          annual_revenue: savedCompany.annual_revenue,
          travel_budget: savedCompany.travel_budget,
          employee_count: savedCompany.employee_count,
        },
        contact: {
          first_name: "Contact",
          last_name: "Person",
          email: savedCompany.email,
          phone: savedCompany.phone || "",
          position: "Decision Maker",
          is_decision_maker: true,
        },
        status: "new",
        source: "manual_entry",
        priority: "medium",
        score: 50,
        estimated_value: savedCompany.travel_budget,
        notes: `Lead created from company entry. ${savedCompany.description || ""}`,
        next_action: "Initial outreach and qualification",
      };

      const createdLead = await leadApi.createLead(leadData);
      console.log("Step 2 completed: Lead created successfully:", createdLead);

      // Reset form
      setNewCompany({
        name: "",
        type: "",
        industry: "",
        location: "",
        website: "",
        phone: "",
        email: "",
        established: "",
        employees: "",
        revenue: "",
        travelBudget: "",
        annualTravelVolume: "",
        travelFrequency: "",
        preferredClass: "",
        companySize: "",
        creditRating: "",
        paymentTerms: "",
        sustainabilityFocus: "",
        riskLevel: "",
        expansionPlans: "",
        specialties: "",
        technologyIntegration: "",
        currentAirlines: "",
        notes: "",
      });

      setShowAddCompanyDialog(false);
      setSuccessMessage(
        `${newCompany.name} has been successfully added as a lead!`,
      );

      // Refresh the leads list to show the new lead
      await fetchLeads();

      setTimeout(() => setSuccessMessage(""), 5000);
      toast.success("Company and lead created successfully!");
    } catch (error) {
      console.error("Error in handleAddCompany:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to save company and create lead";
      setSuccessMessage(`Error: ${errorMessage}`);
      setTimeout(() => setSuccessMessage(""), 5000);
      toast.error("Failed to create company and lead. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to open qualify confirmation dialog
  const handleQualifyLead = (lead: any) => {
    setSelectedLeadForQualify(lead);
    setShowQualifyDialog(true);
  };

  // Function to confirm qualification via API
  const handleConfirmQualify = async () => {
    if (!selectedLeadForQualify) return;

    try {
      setQualifyingLeadId(selectedLeadForQualify.id); // Start loading spinner

      await leadApi.qualifyLead(selectedLeadForQualify.id, {
        reason: "Lead meets all qualification criteria",
      });

      // Update the local state
      setLeads((prev) =>
        prev.map((l) => (l.id === selectedLeadForQualify.id ? { ...l, status: "qualified" } : l)),
      );

      // Clear history for this lead to force refresh
      setLeadHistory((prev) => ({
        ...prev,
        [selectedLeadForQualify.id]: [],
      }));

      // Show success popup with updated status
      const message = `🎉 ${selectedLeadForQualify.company} status successfully updated to 'Qualified'!`;
      console.log("Setting success message:", message);
      setSuccessMessage(message);
      setTimeout(() => {
        console.log("Clearing success message");
        setSuccessMessage("");
      }, 7000);

      toast.success("Lead qualified successfully");

      // Close dialog and reset state
      setShowQualifyDialog(false);
      setSelectedLeadForQualify(null);
    } catch (error) {
      console.error("Error qualifying lead:", error);
      toast.error("Failed to qualify lead");
    } finally {
      setQualifyingLeadId(null); // Stop loading spinner
    }
  };

  // Function to open dialog for disqualifying a lead
  const handleDisqualifyLead = (lead: any) => {
    setSelectedLeadForDisqualify(lead);
    setShowDisqualifyDialog(true);
    setDisqualifyReason("");
  };

  // Function to confirm disqualification via API
  const handleConfirmDisqualify = async () => {
    if (!selectedLeadForDisqualify) return;

    try {
      setDisqualifyingLeadId(selectedLeadForDisqualify.id); // Start loading spinner

      // Send reason as an object
      await leadApi.disqualifyLead(selectedLeadForDisqualify.id, {
        reason: disqualifyReason || "No reason provided",
        created_by: "Current User",
      });

      // Update the local state
      setLeads((prev) =>
        prev.map((l) =>
          l.id === selectedLeadForDisqualify.id
            ? { ...l, status: "unqualified" }
            : l,
        ),
      );

      // Clear history for this lead to force refresh
      setLeadHistory((prev) => ({
        ...prev,
        [selectedLeadForDisqualify.id]: [],
      }));

      // Show success popup with updated status
      const message = `🎉 ${selectedLeadForDisqualify.company} status successfully updated to 'disqualify'!`;
      console.log("Setting disqualify success message:", message);
      setSuccessMessage(message);
      setTimeout(() => {
        console.log("Clearing disqualify success message");
        setSuccessMessage("");
      }, 7000);

      toast.success("Lead disqualified successfully");

      // Close dialog and reset state
      setShowDisqualifyDialog(false);
      setSelectedLeadForDisqualify(null);
      setDisqualifyReason("");
    } catch (error: any) {
      console.error("Error disqualifying lead:", error);
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to disqualify lead. Please try again.";
      toast.error(errorMessage);
    } finally {
      setDisqualifyingLeadId(null); // Stop loading spinner
    }
  };

  // Function to open dialog for contacting a lead
  const handleContactLead = (lead: any) => {
    setSelectedLeadForContact(lead);
    setContactForm({
      method: "Email",
      subject: `Partnership Opportunity - ${lead.company}`,
      message: `Hi ${lead.contact.split(" ")[0]},

I hope this message finds you well. I wanted to follow up regarding our corporate travel solutions that could benefit ${lead.company}.

Based on your organization's profile, I believe we can help optimize your travel operations and reduce costs.

Would you be available for a brief call this week to discuss how we can support your travel needs?

Best regards,
SOAR-AI Team`,
      followUpDate: formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7 days from now
      followUpMode: "",
    });
    setShowContactDialog(true);
  };

  // Function to send message (and create history entry) via API
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const handleSendMessage = async () => {
    if (
      !selectedLeadForContact ||
      !contactForm.subject ||
      !contactForm.message
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsSendingMessage(true);

      // Call the backend API to send email via SMTP
      const response = await leadApi.sendMessage(selectedLeadForContact.id, {
        method: contactForm.method,
        subject: contactForm.subject,
        message: contactForm.message,
        followUpDate: contactForm.followUpDate,
        followUpMode: contactForm.followUpMode,
      });

      // Update the lead status locally if the email was sent successfully
      if (response && response.success) {
        setLeads((prev) =>
          prev.map((l) =>
            l.id === selectedLeadForContact.id
              ? {
                  ...l,
                  status: "contacted",
                  lastContact: formatDate(new Date()),
                }
              : l,
          ),
        );

        // Clear history cache for this lead to force refresh
        setLeadHistory((prev) => {
          const newHistory = { ...prev };
          delete newHistory[selectedLeadForContact.id];
          return newHistory;
        });

        setSuccessMessage(
          `Email sent to ${selectedLeadForContact.company} successfully!`,
        );
        setTimeout(() => setSuccessMessage(""), 5000);
        toast.success("Email sent successfully");
      } else {
        throw new Error(response?.message || "Failed to send email");
      }

      // Close dialog and reset state
      setShowContactDialog(false);
      setSelectedLeadForContact(null);
      setContactForm({
        method: "Email",
        subject: "",
        message: "",
        followUpDate: "",
        followUpMode: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to send message";
      toast.error(errorMessage);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Function to open dialog for adding a note
  const handleAddNote = (lead: any) => {
    setSelectedLeadForNote(lead);
    setNoteForm({
      note: "",
      nextAction: lead.nextAction || "",
      urgency: "Medium",
    });
    setShowAddNoteDialog(true);
  };

  // Function to save note via API
  const handleSaveNote = async () => {
    if (!selectedLeadForNote || !noteForm.note.trim()) {
      toast.error("Please enter a note");
      return;
    }

    try {
      setIsSavingNote(true);

      const response = await leadApi.addNote(selectedLeadForNote.id, {
        note: noteForm.note,
        nextAction: noteForm.nextAction,
        urgency: noteForm.urgency,
      });

      // Update the local lead data with the new note and updated lead info
      setLeads((prev) =>
        prev.map((l) => {
          if (l.id === selectedLeadForNote.id) {
            // Add the new note to the beginning of the notes array
            const updatedLeadNotes = [response.note, ...(l.leadNotes || [])];
            return {
              ...l,
              leadNotes: updatedLeadNotes,
              nextAction: response.lead.next_action || l.nextAction,
              urgency: response.lead.priority || l.urgency,
              notes:
                `${l.notes}\n[${formatDate(new Date())}] ${noteForm.note}`.trim(),
            };
          }
          return l;
        }),
      );

      // Update the fetched lead notes as well
      setLeadNotes((prev) => ({
        ...prev,
        [selectedLeadForNote.id]: [
          response.note,
          ...(prev[selectedLeadForNote.id] || []),
        ],
      }));

      // Optionally refresh the leads list to get updated notes from backend
      // This ensures consistency with the backend data
      // fetchLeads();

      setShowAddNoteDialog(false);
      setSelectedLeadForNote(null);
      setNoteForm({
        note: "",
        nextAction: "",
        urgency: "Medium",
      });

      toast.success("Note added successfully");
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note");
    } finally {
      setIsSavingNote(false);
    }
  };

  // Function to open dialog for viewing lead history
  // This function is now correctly named and integrated with the modal state
  const handleHistoryClick = async (lead: Lead) => {
    setSelectedLeadForHistory(lead);
    setShowHistoryDialog(true); // Use the state to control modal visibility

    // Always fetch fresh history data
    setIsLoadingHistory(true);
    try {
      const history = await leadApi.getHistory(lead.id);
      console.log("Fetched history:", history);

      // Transform API response to internal format
      const transformedHistory = history?.data.map((item: any) => ({
        id: item.id,
        history_type: item.history_type, // Use the type from the API response
        action: item.action, // Use the action from the API response
        user_name: item.user_name || "System", // Use user_name if available, else fallback
        user_role: item.user_role,
        timestamp: item.timestamp,
        details: item.details,
        icon: item.icon || "activity", // Use icon from API, or 'activity' as default
        metadata: item.metadata, // Pass metadata directly
        formatted_timestamp: item.formatted_timestamp, // Use formatted timestamp if available from API
        assigned_agent: item.assigned_agent, // Include assigned_agent if available
        previous_agent: item.previous_agent, // Include previous_agent if available
        assignment_priority: item.assignment_priority, // Include priority if available
        assignment_notes: item.assignment_notes, // Include notes if available
      }));

      setLeadHistory((prev) => ({
        ...prev,
        [lead.id]: transformedHistory,
      }));
    } catch (error) {
      console.error("Error fetching history:", error);
      toast.error("Failed to load history for this lead.");
      // Ensure that if an error occurs, the history for this lead is an empty array
      setLeadHistory((prev) => ({
        ...prev,
        [lead.id]: [],
      }));
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Handle action dropdown selections
  const handleInitiateCall = (lead: any) => {
    setSelectedLeadForAction(lead);
    setShowInitiateCallModal(true);
  };

  const handleScheduleMeeting = (lead: any) => {
    setSelectedLeadForAction(lead);
    setShowScheduleMeetingModal(true);
  };

  const handleScheduleDemo = (lead: any) => {
    setSelectedLeadForAction(lead);
    setShowScheduleDemoModal(true);
  };

  // Handle assign/reassign agent
  const handleAssignAgent = (lead: any) => {
    setSelectedLeadForAssign(lead);
    setSelectedAgent("");
    setAssignmentPriority("Medium Priority");
    setAssignmentNotes("");
    setShowAssignAgentModal(true);
  };

  const handleConfirmAssignAgent = async () => {
    if (!selectedAgent || !selectedLeadForAssign) {
      toast.error("Please select an agent");
      return;
    }

    try {
      setIsAssigning(true);

      // Call API to assign agent
      await leadApi.assignAgent(selectedLeadForAssign.id, {
        agent_name: selectedAgent,
        priority: assignmentPriority,
        notes: assignmentNotes,
      });

      // Update local state
      setLeads((prev) =>
        prev.map((l) =>
          l.id === selectedLeadForAssign.id
            ? { ...l, assignedAgent: selectedAgent }
            : l,
        ),
      );

      toast.success(`Lead assigned to ${selectedAgent} successfully!`);
      setShowAssignAgentModal(false);
      setSelectedLeadForAssign(null);
      setSelectedAgent("");
      setAssignmentNotes("");
    } catch (error) {
      console.error("Error assigning agent:", error);
      toast.error("Failed to assign agent. Please try again.");
    } finally {
      setIsAssigning(false);
    }
  };

  // Function to move qualified lead to opportunities
  const handleMoveToOpportunity = async (lead: Lead) => {
    // Open the confirmation dialog first
    setSelectedLeadForOpportunity(lead);
    setShowMoveToOpportunityDialog(true);
  };

  const handleConfirmMoveToOpportunity = async () => {
    if (!selectedLeadForOpportunity) return;

    try {
      // Set loading state for this specific lead
      setMovingToOpportunityId(selectedLeadForOpportunity.id);

      // Prepare opportunity data from lead - match Django Opportunity model fields exactly
      const opportunityData = {
        name: `${selectedLeadForOpportunity.company} - Corporate Travel Solution`,
        stage: "discovery",
        probability: 65,
        estimated_close_date: formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
        value: parseInt(selectedLeadForOpportunity.travelBudget.replace(/[^0-9]/g, "")) || 250000,
        description: `Opportunity created from qualified lead. ${selectedLeadForOpportunity.notes}`,
        next_steps: "Send initial proposal and schedule presentation",
      };

      console.log("Moving lead to opportunity with data:", {
        opportunity: opportunityData,
      });

      // Call the API to move the lead to opportunity
      const response = await leadApi.moveToOpportunity(
        selectedLeadForOpportunity.id,
        opportunityData,
      );

      // Update the local state to mark the lead as having an opportunity
      setLeads((prev) =>
        prev.map((l) =>
          l.id === selectedLeadForOpportunity.id ? { ...l, has_opportunity: true, status: "opportunity" } : l,
        ),
      );

      // Show success popup message based on API response
      const successMessage = response.message || `${selectedLeadForOpportunity.company} has been successfully moved to opportunities!`;
      setSuccessMessage(`🎉 ${successMessage}`);
      console.log("Setting move to opportunity success message:", successMessage);
      setTimeout(() => {
        console.log("Clearing move to opportunity success message");
        setSuccessMessage("");
      }, 7000);

      // Navigate to opportunities page with the new opportunity data
      if (onNavigate) {
        onNavigate("opportunities", {
          newOpportunity: {
            ...response.opportunity,
            leadId: response.lead_id,
            company: selectedLeadForOpportunity.company,
            contact: selectedLeadForOpportunity.contact,
            title: selectedLeadForOpportunity.title,
            email: selectedLeadForOpportunity.email,
            phone: selectedLeadForOpportunity.phone,
            industry: selectedLeadForOpportunity.industry,
            employees:
              typeof selectedLeadForOpportunity.employees === "number"
                ? selectedLeadForOpportunity.employees
                : parseInt(selectedLeadForOpportunity.employees as string) || 0,
            revenue: selectedLeadForOpportunity.revenue,
            location: selectedLeadForOpportunity.location,
            source: selectedLeadForOpportunity.source,
            travelBudget: selectedLeadForOpportunity.travelBudget,
            decisionMaker: selectedLeadForOpportunity.decisionMaker,
            tags: selectedLeadForOpportunity.tags || [selectedLeadForOpportunity.industry, "Qualified Lead"],
            owner: selectedLeadForOpportunity.assignedAgent || "Current User",
          },
          message: successMessage,
        });
      }

      toast.success(`${selectedLeadForOpportunity.company} moved to opportunities successfully!`);

      // Close the confirmation dialog
      setShowMoveToOpportunityDialog(false);
      setSelectedLeadForOpportunity(null);

    } catch (error) {
      console.error("Error moving lead to opportunity:", error);
      const errorMessage = error.response?.data?.error ||
                          error.response?.data?.message ||
                          error.message ||
                          "Failed to move lead to opportunities. Please try again.";

      // Show error message in success message area
      setSuccessMessage(`❌ Error: ${errorMessage}`);
      setTimeout(() => setSuccessMessage(""), 7000);

      toast.error(errorMessage);

      // If there's an error, refresh the leads to ensure consistency
      await fetchLeads();
    } finally {
      // Reset loading state
      setMovingToOpportunityId(null);
    }
  };

  // Filter leads based on current filter settings
  const filteredLeads = leads.filter((lead) => {
    if (
      filters.status &&
      filters.status !== "all" &&
      lead.status !== filters.status
    )
      return false;
    if (
      filters.industry &&
      filters.industry !== "all" &&
      lead.industry !== filters.industry
    )
      return false;
    if (
      filters.score &&
      filters.score !== "all" &&
      ((filters.score === "high" && lead.score < 80) ||
        (filters.score === "medium" && (lead.score < 60 || lead.score >= 80)) ||
        (filters.score === "low" && lead.score >= 60))
    )
      return false;
    if (
      filters.engagement &&
      filters.engagement !== "all" &&
      lead.engagement !== filters.engagement
    )
      return false;
    if (
      filters.search &&
      !lead.company.toLowerCase().includes(filters.search.toLowerCase()) &&
      !lead.contact.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false;
    return true;
  });

  // Calculate pagination details
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
  const startIndex = (currentPage - 1) * leadsPerPage;
  const endIndex = startIndex + leadsPerPage;
  const currentLeads = filteredLeads.slice(startIndex, endIndex);

  // Effect to update selectAll checkbox state based on filtered leads selection
  useEffect(() => {
    if (selectedLeads.length === 0) {
      setSelectAll(false);
    } else if (
      selectedLeads.length === filteredLeads.length &&
      filteredLeads.length > 0
    ) {
      setSelectAll(true);
    } else {
      setSelectAll(false); // Partially selected
    }
  }, [selectedLeads, filteredLeads]);

  // Render spinner loader while loading
  const renderSpinnerLoader = () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Loading leads...</p>
        <p className="text-gray-500 text-sm mt-1">
          Please wait while we fetch your data
        </p>
      </div>
    </div>
  );

  const handleViewProfile = (lead) => {
    console.log(leadsForViewProfile, "leadsForViewProfile", lead, "lead");
    const item = leadsForViewProfile.find((entry) => entry.id === lead.id);
    console.log(item, "item");
    setSelectedCorporate(item);
    setShowCorporateProfile(true);
  };

  const handleStartCampaign = () => {
    if (selectedLeads.length === 0) {
      toast.error("Please select leads first");
      return;
    }

    const selectedLeadData = filteredLeads.filter((lead) =>
      selectedLeads.includes(lead.id),
    );
    setShowMarketingCampaign(true);
  };

  const handleCampaignComplete = async (campaignData) => {
    console.log("Campaign completed with data:", campaignData);

    try {
      // Update status for leads that were 'new' to 'contacted'
      const selectedLeadData = filteredLeads.filter((lead) =>
        selectedLeads.includes(lead.id),
      );

      const newLeadsToUpdate = selectedLeadData.filter(lead => lead.status === 'new');

      if (newLeadsToUpdate.length > 0) {
        // Update each new lead's status to contacted
        const updatePromises = newLeadsToUpdate.map(async (lead) => {
          try {
            const updatedLead = await leadApi.updateLead(lead.id, {
              status: 'contacted'
            });
            console.log(`Updated lead ${lead.id} status to contacted`);
            return { leadId: lead.id, success: true, updatedLead };
          } catch (error) {
            console.error(`Error updating lead ${lead.id}:`, error);
            return { leadId: lead.id, success: false, error };
          }
        });

        const updateResults = await Promise.all(updatePromises);
        const successfulUpdates = updateResults.filter(result => result.success);

        if (successfulUpdates.length > 0) {
          // Update local state for successfully updated leads
          setLeads(prev => prev.map(lead => {
            const successfulUpdate = successfulUpdates.find(update => update.leadId === lead.id);
            if (successfulUpdate) {
              return { ...lead, status: 'contacted' };
            }
            return lead;
          }));

          toast.success(
            `Campaign "${campaignData.name}" launched successfully! ${successfulUpdates.length} lead${successfulUpdates.length > 1 ? 's' : ''} status updated to 'Contacted'.`,
          );
        } else {
          toast.success(
            `Campaign "${campaignData.name}" launched successfully for ${selectedLeads.length} leads!`,
          );
        }
      } else {
        toast.success(
          `Campaign "${campaignData.name}" launched successfully for ${selectedLeads.length} leads!`,
        );
      }
    } catch (error) {
      console.error("Error updating lead statuses:", error);
      toast.success(
        `Campaign "${campaignData.name}" launched successfully for ${selectedLeads.length} leads!`,
      );
      toast.error("Some lead statuses could not be updated. Please check manually.");
    }

    setShowMarketingCampaign(false);
    setSelectedLeads([]);
    setSelectAll(false);
  };

  const handleCampaignBack = () => {
    setShowMarketingCampaign(false);
  };

  // Error state if API call fails
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

  // Show specific components based on state
  if (showMarketingCampaign) {
    const selectedLeadData = filteredLeads.filter((lead) =>
      selectedLeads.includes(lead.id),
    );
    return (
      <MarketingCampaignWizard
        selectedLeads={selectedLeadData}
        onNavigate={handleCampaignBack}
        onBack={handleCampaignBack}
        onComplete={handleCampaignComplete}
      />
    );
  }

  if (showCorporateProfile && selectedCorporate) {
    return (
      <Dialog
        open={showCorporateProfile}
        onOpenChange={setShowCorporateProfile}
      >
        <DialogContent className="max-w-2xl  cls-corporate-profile">
          <div className="mt-4 max-h-[90vh] overflow-y-auto">
            <CorporateProfile
              corporateData={selectedCorporate}
              onBack={handleBackToSearch}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-center gap-3 shadow-2xl animate-in slide-in-from-top-2 max-w-md">
          <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
          <span className="text-green-800 font-medium text-base">{successMessage}</span>
          <button
            onClick={() => {
              console.log("Manual close success message");
              setSuccessMessage("");
            }}
            className="ml-auto text-green-600 hover:text-green-800 transition-colors text-lg font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {filters.status === "qualified"
              ? "Qualified Leads"
              : filters.status === "unqualified"
                ? "Unqualified Leads"
                : "All Leads"}
          </h1>
          <p className="text-gray-600">
            {filters.status === "qualified"
              ? "High-potential leads ready for offer creation and contract initiation"
              : filters.status === "unqualified"
                ? "Leads requiring nurturing, re-engagement, or future follow-up"
                : "Comprehensive lead management with status tracking and AI suggestions"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* <Button
            variant="outline"
            className="text-gray-700  hover:bg-gray-50 cls-addcomapany"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button> */}
          <Button
            variant="outline"
            className="text-gray-700 hover:bg-gray-50 cls-addcomapany"
            onClick={fetchLeads}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            className="text-gray-700 hover:bg-gray-50 cls-addcomapany"
            onClick={() => onNavigate("email-campaigns")}
          >
            <Mail className="h-4 w-4 mr-2" />
            Email Campaign
          </Button>
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => setShowAddCompanyDialog(true)}
          >
            {" "}
            {/* Changed to showNewCompanyDialog */}
            <Plus className="h-4 w-4 mr-2" />
            Add New Lead {/* Changed button text */}
          </Button>
        </div>
      </div>
      {/* Lead Filters */}
      <Card className="mb-6 bg-white border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-5 justify-between">
            <div className="flex items-center gap-2 ">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 ">
                Lead Filters
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* <Button
                variant="outline"
                size="sm"
                className="text-orange-700 border-orange-300 bg-orange-50 hover:bg-orange-100"
                onClick={() => {
                  if (!loading) {
                    fetchLeadsWithFilters(filters);
                  }
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 mr-1"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-1" />
                    Search Leads
                  </>
                )}
              </Button> */}
              <Button
                variant="outline"
                size="sm"
                className="text-gray-600 border-gray-300"
                onClick={() => {
                  clearfilter();
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label className="text-xs text-gray-600 mb-1 block">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Company or contact..."
                  className="pl-10 text-sm border-gray-200"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label className="text-xs text-gray-600 mb-1 block">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value })
                }
              >
                <SelectTrigger className="text-sm border-gray-200">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  {/* <SelectItem value="in-progress">In Progress</SelectItem> */}
                  <SelectItem value="responded">Responded</SelectItem>
                  <SelectItem value="unqualified">Disqualifed </SelectItem>
                  <SelectItem value="new">New</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-gray-600 mb-1 block">
                Industry
              </Label>
              <Select
                value={filters.industry}
                onValueChange={(value) =>
                  setFilters({ ...filters, industry: value })
                }
              >
                <SelectTrigger className="text-sm border-gray-200">
                  <SelectValue placeholder="All industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All industries</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="Financial Services">
                    Financial Services
                  </SelectItem>
                  <SelectItem value="Banking">Banking</SelectItem>
                  <SelectItem value="Consulting">Consulting</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-gray-600 mb-1 block">Score</Label>
              <Select
                value={filters.score}
                onValueChange={(value) =>
                  setFilters({ ...filters, score: value })
                }
              >
                <SelectTrigger className="text-sm border-gray-200">
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
            <div>
              <Label className="text-xs text-gray-600 mb-1 block">
                Engagement
              </Label>
              <Select
                value={filters.engagement}
                onValueChange={(value) =>
                  setFilters({ ...filters, engagement: value })
                }
              >
                <SelectTrigger className="text-sm border-gray-200">
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
          </div>
        </CardContent>
      </Card>

      {/* Metrics Cards Section - Moved to top */}
      <div className="mb-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {loading ? (
            <>
              {[...Array(4)].map((_, index) => (
                <Card key={index} className="bg-white border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Skeleton className="bg-gray-200 h-4 w-24 mb-1" />
                        <Skeleton className="bg-gray-200 h-8 w-12 mb-1" />
                        <Skeleton className="bg-gray-200 h-3 w-32" />
                      </div>
                      <Skeleton className="bg-gray-200 w-10 h-10 rounded-lg" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <>
              {/* Dynamic cards based on status filter */}
              {filters.status === "unqualified" ? (
                // Unqualified Leads View
                <>
                  <Card className="bg-white border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">
                            Disqualifed  Leads
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {
                              filteredLeads.filter(
                                (lead) => lead.status === "unqualified",
                              ).length
                            }
                          </p>
                          <p className="text-xs text-gray-500">
                            Requiring nurturing
                          </p>
                        </div>
                        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                          <UserX className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">
                            Future Potential
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {(() => {
                              const unqualifiedLeads = filteredLeads.filter(
                                (lead) => lead.status === "unqualified",
                              );
                              const highScoreLeads = unqualifiedLeads.filter(
                                (lead) => lead.score >= 60,
                              );
                              return unqualifiedLeads.length > 0
                                ? `${Math.round((highScoreLeads.length / unqualifiedLeads.length) * 100)}%`
                                : "0%";
                            })()}
                          </p>
                          <p className="text-xs text-gray-500">
                            May qualify in 6-12 months
                          </p>
                        </div>
                        <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-yellow-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">
                            Avg Score
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {(() => {
                              const unqualifiedLeads = filteredLeads.filter(
                                (lead) => lead.status === "unqualified",
                              );
                              if (unqualifiedLeads.length === 0) return "0";
                              const avgScore =
                                unqualifiedLeads.reduce(
                                  (sum, lead) => sum + lead.score,
                                  0,
                                ) / unqualifiedLeads.length;
                              return Math.round(avgScore);
                            })()}
                          </p>
                          <p className="text-xs text-gray-500">
                            Below qualification threshold
                          </p>
                        </div>
                        <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg">
                          <Target className="h-5 w-5 text-orange-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">
                            Re-engagement
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {(() => {
                              const unqualifiedLeads = filteredLeads.filter(
                                (lead) => lead.status === "unqualified",
                              );
                              const recentlyContacted = unqualifiedLeads.filter(
                                (lead) => {
                                  const lastContact = new Date(
                                    lead.lastContact,
                                  );
                                  const monthsAgo =
                                    (Date.now() - lastContact.getTime()) /
                                    (1000 * 60 * 60 * 24 * 30);
                                  return monthsAgo <= 3;
                                },
                              );
                              return unqualifiedLeads.length > 0
                                ? `${Math.round((recentlyContacted.length / unqualifiedLeads.length) * 100)}%`
                                : "0%";
                            })()}
                          </p>
                          <p className="text-xs text-gray-500">
                            Re-qualification success rate
                          </p>
                        </div>
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                          <RefreshCw className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                // Default View (All Leads, Qualified, etc.)
                <>
                  <Card className="bg-white border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">
                            Qualified Leads
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {
                              filteredLeads.filter(
                                (lead) => lead.status === "qualified",
                              ).length
                            }
                          </p>
                          <p className="text-xs text-gray-500">
                            High-potential prospects
                          </p>
                        </div>
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">
                            Contract Ready
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {
                              filteredLeads.filter(
                                (lead) =>
                                  lead.status === "qualified" &&
                                  lead.contractReady,
                              ).length
                            }
                          </p>
                          <p className="text-xs text-gray-500">
                            Ready for contract initiation
                          </p>
                        </div>
                        <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">
                            Avg Deal Size
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {(() => {
                              const relevantLeads = filteredLeads.filter(
                                (lead) => lead.status === "qualified",
                              ); // Consider only qualified leads for deal size
                              if (relevantLeads.length === 0) return "$0K";
                              const avgValue =
                                relevantLeads.reduce((sum, lead) => {
                                  const value =
                                    parseInt(
                                      lead.travelBudget.replace(/[^0-9]/g, ""),
                                    ) || 0;
                                  return sum + value;
                                }, 0) / relevantLeads.length;
                              return `$${Math.round(avgValue)}K`;
                            })()}
                          </p>
                          <p className="text-xs text-gray-500">
                            Average qualified deal value
                          </p>
                        </div>
                        <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-lg">
                          <DollarSign className="h-5 w-5 text-yellow-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">
                            Conversion Rate
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {(() => {
                              const totalLeads = leads.length; // Use total leads for overall conversion
                              const qualifiedLeads = filteredLeads.filter(
                                (lead) => lead.status === "qualified",
                              ).length;
                              return totalLeads > 0
                                ? `${Math.round((qualifiedLeads / totalLeads) * 100)}%`
                                : "0%";
                            })()}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qualified to contact rate
                          </p>
                        </div>
                        <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar - Shows when leads are selected */}
      {selectedLeads.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-orange-500 rounded-full">
                <span className="text-white font-medium text-sm">
                  {selectedLeads.length}
                </span>
              </div>
              <span className="text-orange-800 font-medium">
                {selectedLeads.length} lead{selectedLeads.length > 1 ? "s" : ""}{" "}
                selected
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
                onClick={() => {
                  if (selectedLeads.length === 0) {
                    toast.error("Please select leads first");
                    return;
                  }
                  toast.success(
                    `${selectedLeads.length} lead${selectedLeads.length > 1 ? "s" : ""} assigned to agent`,
                  );
                  setSelectedLeads([]);
                  setSelectAll(false);
                }}
              >
                <User className="h-4 w-4 mr-2" />
                Assign Agent
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="text-gray-700 border-gray-300 hover:bg-gray-50"
                onClick={() => {
                  setSelectedLeads([]);
                  setSelectAll(false);
                  toast.success("Selection cleared");
                }}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Leads Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          {loading ? (
            <>
              <h2 className="text-lg font-semibold text-gray-900">
                Search Leads
              </h2>
              <p className="text-sm text-gray-600">Loading...</p>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-gray-900">
                Showing Leads ({filteredLeads.length} results)
              </h2>
              <p className="text-sm text-gray-600">
                Comprehensive lead management with status tracking and AI
                suggestions
              </p>
            </>
          )}
        </div>
        {loading ? (
          ""
        ) : (
          <div className="flex items-center gap-3">
            <Checkbox
              checked={selectAll}
              onCheckedChange={(checked) => handleSelectAll(checked)}
              className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Select All
            </span>
          </div>
        )}
      </div>

      {/* Leads List */}
      {loading ? (
        renderSpinnerLoader()
      ) : (
        <div className="space-y-4">
          {currentLeads.map((lead) => (
            <Card
              key={lead.id}
              className="bg-white border border-gray-200 hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                {/* Lead Header Row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={(e) =>
                        handleSelectLead(lead.id, e.target.checked)
                      }
                      className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                    />
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {lead.company}
                        </h3>
                        <Badge
                          className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeStyle(lead.status)}`}
                        >
                          {lead.status === "qualified"
                            ? "Qualified"
                            : lead.status === "contacted"
                              ? "Contacted"
                              : lead.status === "in-progress"
                                ? "In Progress"
                                : lead.status === "responded"
                                  ? "Responded"
                                  : lead.status === "unqualified"
                                    ? "Disqualifed"
                                    : lead.status === "new"
                                      ? "New"
                                      : lead.status}
                        </Badge>
                        {lead.decisionMaker && (
                          <Badge className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 border-green-200">
                            🏆 Decision Maker
                          </Badge>
                        )}
                        {lead.status === "qualified" && lead.contractReady && (
                          <Badge className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 border-green-200">
                            🤝 Contract Ready
                          </Badge>
                        )}
                        {lead.nextAction === "Move to contract" && (
                          <Badge className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 border-red-200">
                            ⚠️ Action Required
                          </Badge>
                        )}
                        {(lead.campaignCount || 0) >= 0 && (
                          <Badge className="text-xs px-2 py-1 rounded-full text-orange-700 border-orange-200 bg-orange-50">
                            📧 {lead.campaignCount} Campaign{lead.campaignCount !== 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        {lead.contact} • {lead.title}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {lead.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {lead.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {lead.location}
                        </span>
                        <a
                          href={lead.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Website
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-semibold mb-1 ${getScoreColor(lead.score)}`}
                    >
                      Score: {lead.score}
                    </div>
                    <div className="text-sm font-medium text-green-600 mb-1">
                      {lead.travelBudget} budget
                    </div>
                    <Badge
                      className={`text-xs px-2 py-1 rounded-full ${getUrgencyBadgeStyle(lead.urgency)}`}
                    >
                      {lead.urgency} urgency
                    </Badge>
                  </div>
                </div>

                {/* Next Action Alert */}
                {lead.nextAction === "Move to contract" && (
                  <Alert className="mb-4 border-red-200 bg-red-50">
                    <ArrowRight className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <strong>Next Action: {lead.nextAction}</strong>
                          <div className="text-sm mt-1">
                            Lead is qualified and ready for contract
                            negotiation.
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-300"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Lead Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium text-gray-600">
                        Industry:
                      </span>{" "}
                      {lead.industry}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-600">
                        Company Size:
                      </span>{" "}
                      {typeof lead.employees === "number"
                        ? lead.employees.toLocaleString()
                        : lead.employees}{" "}
                      employees
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-600">
                        Revenue:
                      </span>{" "}
                      {lead.revenue}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-600">Source:</span>{" "}
                      {lead.source}
                    </div>
                    {lead.assignedAgent && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-600">
                          Assigned Agent:
                        </span>{" "}
                        {lead.assignedAgent}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium text-gray-600">
                        Last Contact:
                      </span>{" "}
                      {lead.lastContact}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-600">
                        Follow-up Date:
                      </span>{" "}
                      {lead.followUpDate}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-600">
                        Engagement:
                      </span>
                      <span
                        className={`ml-1 ${lead.engagement === "High" ? "text-green-600" : lead.engagement === "Medium" ? "text-yellow-600" : "text-red-600"}`}
                      >
                        {lead.engagement}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {lead.industry && (
                        <Badge variant="outline" className="text-xs">
                          {lead.industry}
                        </Badge>
                      )}
                      {lead.decisionMaker && (
                        <Badge variant="outline" className="text-xs">
                          High-Value
                        </Badge>
                      )}
                      {lead.status === "qualified" && (
                        <Badge variant="outline" className="text-xs">
                          Decision Maker
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* AI Suggestion */}
                <Alert className="mb-4 border-blue-200 bg-blue-50">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>AI Suggestion:</strong>{" "}
                    {lead.status === "qualified"
                      ? "Schedule product demo within 3 days. High conversion probability."
                      : "Send detailed cost comparison proposal. Mention case studies."}
                  </AlertDescription>
                </Alert>

                {/* Notes Section */}
                {(lead.notes ||
                  (lead.leadNotes && lead.leadNotes.length > 0) ||
                  leadNotes[lead.id]?.length > 0) && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <Collapsible
                      open={expandedNotes[lead.id] || false}
                      onOpenChange={() => toggleNotesExpansion(lead.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 font-semibold text-gray-800 hover:bg-transparent flex items-center gap-1"
                          >
                            <MessageSquare className="h-4 w-4" />
                            Notes & Updates
                            <ChevronDown
                              className={`h-3 w-3 transition-transform duration-200 ${expandedNotes[lead.id] ? "rotate-180" : ""}`}
                            />
                          </Button>
                        </CollapsibleTrigger>
                        {Array.isArray(lead.leadNotes) &&
                          lead.leadNotes.length > 0 && (
                            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                              {lead.leadNotes.length} note
                              {lead.leadNotes.length !== 1 ? "s" : ""}
                            </span>
                          )}
                      </div>

                      <CollapsibleContent className="space-y-2">
                        <div>
                          {Array.isArray(lead.leadNotes) &&
                          lead.leadNotes.length > 0 ? (
                            <div className="space-y-2">
                              {lead.leadNotes
                                .slice(
                                  0,
                                  expandedNotes[lead.id]
                                    ? lead.leadNotes.length
                                    : 2,
                                )
                                .map((note: any, index: number) => (
                                  <div
                                    key={note.id || index}
                                    className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                                  >
                                    <div className="flex items-start justify-between mb-2">
                                      <span className="text-xs text-gray-500">
                                        {formatDate(
                                          new Date(
                                            note.created_at,
                                          ),
                                        )}{" "}
                                        at{" "}
                                        {new Date(
                                          note.created_at,
                                        ).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </span>
                                      <div className="text-xs text-gray-500">
                                        By: {note.created_by || "System"}
                                      </div>
                                      <Badge
                                        className={`text-xs ${getUrgencyBadgeStyle(note.urgency)}`}
                                      >
                                        {note.urgency}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-2">
                                      {note.note}
                                    </p>
                                    {note.next_action && (
                                      <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded mb-1">
                                        Next: {note.next_action}
                                      </div>
                                    )}
                                  </div>
                                ))}

                              {lead.leadNotes.length > 2 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleNotesExpansion(lead.id)}
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  {expandedNotes[lead.id] ? (
                                    <>
                                      <ChevronUp className="h-4 w-4 mr-1" />
                                      Show Less
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="h-4 w-4 mr-1" />
                                      Show All ({lead.leadNotes.length} notes)
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          ) :
                            (
                            <div className="text-center py-4">
                              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                              <p className="text-sm text-gray-500 mb-2">
                                {leadNotes[lead.id] !== undefined
                                  ? "No notes available for this lead"
                                  : "Notes not loaded yet"}
                              </p>
                              <div className="flex gap-2 justify-center">
                                {leadNotes[lead.id] === undefined && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => fetchLeadNotes(lead.id)}
                                    className="text-gray-600 border-gray-300 hover:bg-gray-50"
                                  >
                                    <RefreshCw className="h-3 w-3 mr-1" />
                                    Load Notes
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAddNote(lead)}
                                  className="text-blue-600 border-blue-300 hover:bg-blue-50"
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  {leadNotes[lead.id]?.length > 0
                                    ? "Add Note"
                                    : "Add First Note"}
                                </Button>
                              </div>
                            </div>
                          )
                          }
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                      onClick={() => handleContactLead(lead)}
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Contact
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-gray-700 border-gray-300"
                      onClick={() => handleAddNote(lead)}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Add Note
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-orange-700 border-orange-200 bg-orange-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLeads([lead.id]);
                        setShowMarketingCampaign(true);
                      }}
                    >
                      <Megaphone className="h-4 w-4 mr-1" />
                      Campaign
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-gray-700 border-gray-300"
                      onClick={() => handleHistoryClick(lead)} // Use the updated handler
                    >
                      <History className="h-4 w-4 mr-1" />
                      History
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-purple-700 border-purple-200 bg-purple-50"
                      onClick={() => handleAssignAgent(lead)}
                    >
                      <User className="h-4 w-4 mr-1" />
                      {lead.assignedAgent ? "Reassign" : "Assign Agent"}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-blue-700 border-blue-200 bg-blue-50"
                        >
                          <Activity className="h-4 w-4 mr-1" />
                          Actions
                          <ChevronDown className="h-4 w-4 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() => handleInitiateCall(lead)}
                        >
                          <PhoneCall className="h-4 w-4" />
                          Initiate Call
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() => handleScheduleMeeting(lead)}
                        >
                          <CalendarDays className="h-4 w-4" />
                          Schedule Meeting
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() => handleScheduleDemo(lead)}
                        >
                          <Presentation className="h-4 w-4" />
                          Schedule Demo
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {lead.status === "qualified" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-orange-700 border-orange-200 bg-orange-50"
                      >
                        <Gift className="h-4 w-4 mr-1" />
                        Create Offer
                      </Button>
                    )}
                    {lead.status === "qualified" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-white bg-green-100 text-green-700 border-green-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveToOpportunity(lead);
                        }}
                        disabled={movingToOpportunityId === lead.id || lead.contractReady}
                      >
                        {movingToOpportunityId === lead.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                            Moving...
                          </>
                        ) : (
                        !lead.contractReady?
                          <>
                            <ArrowRight className="h-3 w-3 mr-1" />
                            Move to Opportunity
                          </>:<>
                            Already Moved to Opportunity
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {lead.status !== "qualified" &&
                      lead.status !== "Inprogress" &&
                      lead.status !== "new" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-700 border-green-300 hover:bg-green-50"
                          onClick={() => handleQualifyLead(lead)}
                          disabled={qualifyingLeadId === lead.id}
                        >
                          {qualifyingLeadId === lead.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-1"></div>
                              Qualifying...
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4 mr-1" />
                              Qualify
                            </>
                          )}
                        </Button>
                      )}
                    {lead.status !== "unqualified" &&
                      lead.status !== "Inprogress" &&
                      lead.status !== "new" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-700 border-red-300 hover:bg-red-50"
                          onClick={() => handleDisqualifyLead(lead)}
                          disabled={disqualifyingLeadId === lead.id}
                        >
                          {disqualifyingLeadId === lead.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <UserX className="h-4 w-4 mr-1" />
                              Disqualify
                            </>
                          )}
                        </Button>
                      )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-gray-700 border-gray-300"
                      onClick={() => handleViewProfile(lead)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && filteredLeads.length > 0 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>
              Showing {startIndex + 1}-
              {Math.min(endIndex, filteredLeads.length)} of{" "}
              {filteredLeads.length} results
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage <= 1}
              className="text-gray-600 border-gray-300"
            >
              <ChevronDown className="h-4 w-4 rotate-90" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {/* Show page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className={
                      currentPage === pageNum
                        ? "bg-orange-500 hover:bg-orange-600 text-white"
                        : "text-gray-600 border-gray-300"
                    }
                  >
                    {pageNum}
                  </Button>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="text-gray-400 px-1">...</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    className="text-gray-600 border-gray-300"
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage >= totalPages}
              className="text-gray-600 border-gray-300"
            >
              Next
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </Button>
          </div>
        </div>
      )}

      {/* No Results State */}
      {!loading && filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No leads found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters or search criteria.
          </p>
          <Button
            variant="outline"
            onClick={() =>
              setFilters({
                status: "all",
                industry: "all",
                score: "all",
                engagement: "all",
                search: "",
              })
            }
            className="text-gray-600 border-gray-300"
          >
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Contact Lead Dialog - Remains the same, contact is part of the lead/company info */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-orange-600" />
              Contact {selectedLeadForContact?.company}
            </DialogTitle>
            <DialogDescription>
              Send a personalized message to {selectedLeadForContact?.contact}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Contact Method
              </Label>
              <Select
                value={contactForm.method}
                onValueChange={(value) =>
                  setContactForm({ ...contactForm, method: value })
                }
              >
                <SelectTrigger className="border-orange-200 focus:border-orange-500 focus:ring-orange-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Phone">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Subject
              </Label>
              <Input
                value={contactForm.subject}
                onChange={(e) =>
                  setContactForm({ ...contactForm, subject: e.target.value })
                }
                placeholder="Enter subject line..."
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Message
              </Label>
              <Textarea
                value={contactForm.message}
                onChange={(e) =>
                  setContactForm({ ...contactForm, message: e.target.value })
                }
                placeholder="Enter your message..."
                className="min-h-[200px] resize-none border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                rows={10}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Follow-up Date (Optional)
                </Label>
                <Input
                  type="date"
                  value={contactForm.followUpDate}
                  onChange={(e) =>
                    setContactForm({
                      ...contactForm,
                      followUpDate: e.target.value,
                    })
                  }
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Follow-up Mode (Optional)
                </Label>
                <Select
                  value={contactForm.followUpMode || ""}
                  onValueChange={(value) =>
                    setContactForm({
                      ...contactForm,
                      followUpMode: value,
                    })
                  }
                >
                  <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                    <SelectValue placeholder="Select follow-up mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Call">Call</SelectItem>
                    <SelectItem value="In Person">In Person</SelectItem>
                    <SelectItem value="Online Meet">Online Meet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowContactDialog(false);
                setSelectedLeadForContact(null);
                setContactForm({
                  method: "Email",
                  subject: "",
                  message: "",
                  followUpDate: "",
                  followUpMode: "",
                });
              }}
              className="text-gray-600 border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              className="bg-orange-500 hover:bg-orange-600 text-white"
              disabled={!contactForm.subject || !contactForm.message || isSendingMessage}
            >
              {isSendingMessage ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog open={showAddNoteDialog} onOpenChange={setShowAddNoteDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
            <DialogDescription>
              Add a note for {selectedLeadForNote?.company}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="note">Note *</Label>
              <Textarea
                id="note"
                placeholder="Enter your note here..."
                value={noteForm.note}
                onChange={(e) =>
                  setNoteForm((prev) => ({ ...prev, note: e.target.value }))
                }
                className="min-h-[100px]"
              />
            </div>
            <div>
              <Label htmlFor="nextAction">Next Action (Optional)</Label>
              <Input
                id="nextAction"
                placeholder="What's the next step?"
                value={noteForm.nextAction}
                onChange={(e) =>
                  setNoteForm((prev) => ({
                    ...prev,
                    nextAction: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="urgency">Urgency</Label>
              <Select
                value={noteForm.urgency}
                onValueChange={(value) =>
                  setNoteForm((prev) => ({ ...prev, urgency: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddNoteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleSaveNote}
              disabled={isSavingNote || !noteForm.note.trim()}
            >
              {isSavingNote ? (
                <>
                  <RefreshCw className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4 bg-orange-500" />
                  Save Note
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Lead History - {selectedLeadForHistory?.company}
            </DialogTitle>
            <DialogDescription>
              Complete activity history for {selectedLeadForHistory?.contact} at{" "}
              {selectedLeadForHistory?.company}
            </DialogDescription>
          </DialogHeader>

          {isLoadingHistory ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              <span className="ml-2 text-gray-600">Loading history...</span>
            </div>
          ) : (
            <div className="mt-4">
              {leadHistory[selectedLeadForHistory?.id] &&
              leadHistory[selectedLeadForHistory.id].length > 0 ? (
                <div className="space-y-4">
                  {leadHistory[selectedLeadForHistory.id].map(
                    (entry, index) => {
                      const getIconComponent = (iconName: string) => {
                        const iconMap: {
                          [key: string]: React.ComponentType<{
                            className?: string;
                          }>;
                        } = {
                          plus: Plus,
                          mail: Mail,
                          phone: Phone,
                          "message-circle": MessageCircle,
                          "message-square": MessageSquare,
                          "trending-up": TrendingUp,
                          user: User,
                          "check-circle": CheckCircle,
                          "x-circle": X,
                          calendar: Calendar,
                          briefcase: Briefcase,
                          "file-text": FileText,
                          handshake: Handshake,
                          award: Award,
                        };
                        return iconMap[iconName] || Plus;
                      };

                      const IconComponent = getIconComponent(entry.icon);
                      const isAgentAssignment =
                        entry.history_type === "agent_assignment" ||
                        entry.history_type === "agent_reassignment";

                      return (
                        <div
                          key={index}
                          className="flex gap-3 border-b border-gray-100 pb-3 last:border-b-0"
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            {entry.icon === "user" && (
                              <Users className="w-4 h-4 text-blue-600" />
                            )}
                            {entry.icon === "phone" && (
                              <Phone className="w-4 h-4 text-green-600" />
                            )}
                            {entry.icon === "mail" && (
                              <Mail className="w-4 h-4 text-orange-600" />
                            )}
                            {entry.icon === "message-square" && (
                              <MessageSquare className="w-4 h-4 text-purple-600" />
                            )}
                            {entry.icon === "trending-up" && (
                              <TrendingUp className="w-4 h-4 text-red-600" />
                            )}
                            {entry.icon === "check-circle" && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                            {entry.icon === "x-circle" && (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                            {entry.icon === "calendar" && (
                              <Calendar className="w-4 h-4 text-blue-600" />
                            )}
                            {entry.icon === "file-text" && (
                              <FileText className="w-4 h-4 text-gray-600" />
                            )}
                            {![
                              "user",
                              "phone",
                              "mail",
                              "message-square",
                              "trending-up",
                              "check-circle",
                              "x-circle",
                              "calendar",
                              "file-text",
                            ].includes(entry.icon) && (
                              <div className="w-2 h-2 bg-gray-400 rounded-full" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900">
                                  {entry.action}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {entry.details}
                                </p>

                                {(entry.history_type === "agent_assignment" ||
                                  entry.history_type ===
                                    "agent_reassignment") && (
                                  <div className="mt-2 p-2 bg-blue-50 rounded-md border border-blue-200">
                                    <div className="space-y-1 text-xs">
                                      {entry.assigned_agent && (
                                        <div className="flex items-center gap-2">
                                          <Users className="w-3 h-3 text-blue-600" />
                                          <span className="font-medium">
                                            Agent:
                                          </span>
                                          <span className="text-blue-700">
                                            {entry.assigned_agent}
                                          </span>
                                        </div>
                                      )}
                                      {entry.previous_agent && (
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium">
                                            Previous Agent:
                                          </span>
                                          <span className="text-gray-600">
                                            {entry.previous_agent}
                                          </span>
                                        </div>
                                      )}
                                      {entry.assignment_priority && (
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium">
                                            Priority:
                                          </span>
                                          <span
                                            className={`px-1 py-0.5 rounded text-xs ${
                                              entry.assignment_priority ===
                                              "High Priority"
                                                ? "bg-red-100 text-red-700"
                                                : entry.assignment_priority ===
                                                    "Medium Priority"
                                                  ? "bg-yellow-100 text-yellow-700"
                                                  : "bg-gray-100 text-gray-700"
                                            }`}
                                          >
                                            {entry.assignment_priority}
                                          </span>
                                        </div>
                                      )}
                                      {entry.assignment_notes && (
                                        <div className="flex items-start gap-2">
                                          <MessageSquare className="w-3 h-3 text-blue-600 mt-0.5" />
                                          <span className="font-medium">
                                            Notes:
                                          </span>
                                          <span className="text-gray-700">
                                            {entry.assignment_notes}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="text-xs text-gray-500 ml-2 flex-shrink-0">
                                {entry.formatted_timestamp}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                              <span>{entry.user_role}</span>
                              <span>•</span>
                              <span>{entry.user_name}</span>
                            </div>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No history available for this lead.</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="border-t border-gray-200 pt-4">
            <Button
              onClick={() => setShowHistoryDialog(false)}
              className="bg-[#FD9646] hover:bg-[#FD9646]/90 text-white"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Qualify Confirmation Dialog */}
      <Dialog open={showQualifyDialog} onOpenChange={setShowQualifyDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-700">
              <UserCheck className="h-5 w-5" />
              Qualify Lead
            </DialogTitle>
            <DialogDescription>
              Are you sure to qualify this corporate{" "}
              <span className="font-semibold">{selectedLeadForQualify?.company}</span>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowQualifyDialog(false);
                setSelectedLeadForQualify(null);
              }}
              className="text-gray-600 border-gray-300"
            >
              No
            </Button>
            <Button
              onClick={handleConfirmQualify}
              className="bg-green-500 hover:bg-green-600 text-white"
              disabled={qualifyingLeadId !== null}
            >
              {qualifyingLeadId !== null ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Qualifying...
                </>
              ) : (
                "Yes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disqualify Lead Dialog */}
      <Dialog
        open={showDisqualifyDialog}
        onOpenChange={setShowDisqualifyDialog}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <UserX className="h-5 w-5" />
              Disqualify Lead
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for disqualifying{" "}
              {selectedLeadForDisqualify?.company}. This action will remove the
              lead from your active list.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="disqualifyReason"
                className="text-sm font-medium text-gray-700"
              >
                Reason for disqualify
              </Label>
              <Textarea
                id="disqualifyReason"
                value={disqualifyReason}
                onChange={(e) => setDisqualifyReason(e.target.value)}
                placeholder="Enter the reason for disqualifying this lead (optional)..."
                className="mt-1 min-h-[120px] resize-none border-gray-300 focus:border-red-500 focus:ring-red-500"
                rows={5}
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDisqualifyDialog(false);
                setSelectedLeadForDisqualify(null);
                setDisqualifyReason("");
              }}
              className="text-gray-600 border-gray-300"
            >
              Skip
            </Button>
            <Button
              onClick={handleConfirmDisqualify}
              className="bg-orange-500 hover:bg-orange-600 text-white"
              disabled={disqualifyingLeadId !== null}
            >
              {disqualifyingLeadId !== null ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Company Dialog */}
      <Dialog
        open={showAddCompanyDialog}
        onOpenChange={setShowAddCompanyDialog}
      >
        <DialogContent className="max-w-[87rem] w-[95vw]">
          <DialogHeader className="pb-[24px] pt-[0px] pr-[0px] pl-[0px] m-[0px]">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <Plus className="h-6 w-6 text-orange-500" />
              Add New Lead
            </DialogTitle>
            <DialogDescription
              className="text-base mt-2"
              style={{ color: "#717182" }}
            >
              Add a new lead to the corporate database for potential
              partnership opportunities
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-50/50 p-1 rounded-xl border border-gray-200/50">
              <TabsTrigger
                value="basic"
                className="rounded-lg px-5 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:border-b-orange-500 font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 text-[14px]"
              >
                Basic Info
              </TabsTrigger>
              <TabsTrigger
                value="business"
                className="rounded-lg px-5 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:border-b-orange-500 font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 text-[14px]"
              >
                Business Details
              </TabsTrigger>
              <TabsTrigger
                value="travel"
                className="rounded-lg px-5 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:border-b-orange-500 font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 text-[14px]"
              >
                Travel Profile
              </TabsTrigger>
              <TabsTrigger
                value="additional"
                className="rounded-lg px-5 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:border-b-orange-500 font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 text-[14px]"
              >
                Additional Info
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="max-h-[45vh] pr-4 cls-scroll">
              <TabsContent value="basic" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="company-name"
                      className="text-sm font-medium"
                    >
                      Company Name *
                    </Label>
                    <Input
                      id="company-name"
                      placeholder="Enter company name"
                      value={newCompany.name}
                      onChange={(e) =>
                        setNewCompany({ ...newCompany, name: e.target.value })
                      }
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="company-type"
                      className="text-sm font-medium"
                    >
                      Company Type *
                    </Label>
                    <Select
                      value={newCompany.type}
                      onValueChange={(value) =>
                        setNewCompany({ ...newCompany, type: value })
                      }
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select company type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corporation">Corporation</SelectItem>
                        <SelectItem value="llc">LLC</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="nonprofit">Non-Profit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-sm font-medium">
                      Industry *
                    </Label>
                    <Select
                      value={newCompany.industry}
                      onValueChange={(value) =>
                        setNewCompany({ ...newCompany, industry: value })
                      }
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="finance">
                          Finance & Banking
                        </SelectItem>
                        <SelectItem value="manufacturing">
                          Manufacturing
                        </SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="energy">
                          Energy & Utilities
                        </SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="telecommunications">
                          Telecommunications
                        </SelectItem>
                        <SelectItem value="transportation">
                          Transportation
                        </SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium">
                      Location *
                    </Label>
                    <Input
                      id="location"
                      placeholder="City, Country"
                      value={newCompany.location}
                      onChange={(e) =>
                        setNewCompany({
                          ...newCompany,
                          location: e.target.value,
                        })
                      }
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="contact@company.com"
                      value={newCompany.email}
                      onChange={(e) =>
                        setNewCompany({ ...newCompany, email: e.target.value })
                      }
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      placeholder="+1 (555) 123-4567"
                      value={newCompany.phone}
                      onChange={(e) =>
                        setNewCompany({ ...newCompany, phone: e.target.value })
                      }
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="text-sm font-medium">
                    Website
                  </Label>
                  <Input
                    id="website"
                    placeholder="www.company.com"
                    value={newCompany.website}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, website: e.target.value })
                    }
                    className="h-10"
                  />
                </div>
              </TabsContent>

              <TabsContent value="business" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="employees" className="text-sm font-medium">
                      Number of Employees *
                    </Label>
                    <Input
                      id="employees"
                      type="number"
                      placeholder="1000"
                      value={newCompany.employees}
                      onChange={(e) =>
                        setNewCompany({
                          ...newCompany,
                          employees: e.target.value,
                        })
                      }
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="revenue" className="text-sm font-medium">
                      Annual Revenue (Millions)
                    </Label>
                    <Input
                      id="revenue"
                      type="number"
                      placeholder="50"
                      value={newCompany.revenue}
                      onChange={(e) =>
                        setNewCompany({
                          ...newCompany,
                          revenue: e.target.value,
                        })
                      }
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="established"
                      className="text-sm font-medium"
                    >
                      Year Established
                    </Label>
                    <Input
                      id="established"
                      type="number"
                      placeholder="2010"
                      value={newCompany.established}
                      onChange={(e) =>
                        setNewCompany({
                          ...newCompany,
                          established: e.target.value,
                        })
                      }
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="company-size"
                      className="text-sm font-medium"
                    >
                      Company Size Category
                    </Label>
                    <Select
                      value={newCompany.companySize}
                      onValueChange={(value) =>
                        setNewCompany({ ...newCompany, companySize: value })
                      }
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select size category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="startup">Starp (1-50)</SelectItem>
                        <SelectItem value="small">Small (51-200)</SelectItem>
                        <SelectItem value="medium">
                          Medium (201-1000)
                        </SelectItem>
                        <SelectItem value="large">Large (1001-5000)</SelectItem>
                        <SelectItem value="enterprise">
                          Enterprise (5000+)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="credit-rating"
                      className="text-sm font-medium"
                    >
                      Credit Rating
                    </Label>
                    <Select
                      value={newCompany.creditRating}
                      onValueChange={(value) =>
                        setNewCompany({ ...newCompany, creditRating: value })
                      }
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select credit rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AAA">AAA</SelectItem>
                        <SelectItem value="AA">AA</SelectItem>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="BBB">BBB</SelectItem>
                        <SelectItem value="BB">BB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="payment-terms"
                      className="text-sm font-medium"
                    >
                      Payment Terms
                    </Label>
                    <Select
                      value={newCompany.paymentTerms}
                      onValueChange={(value) =>
                        setNewCompany({ ...newCompany, paymentTerms: value })
                      }
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select payment terms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Net 15">Net 15</SelectItem>
                        <SelectItem value="Net 30">Net 30</SelectItem>
                        <SelectItem value="Net 45">Net 45</SelectItem>
                        <SelectItem value="Net 60">Net 60</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="travel" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="travel-budget"
                      className="text-sm font-medium"
                    >
                      Annual Travel Budget *
                    </Label>
                    <Input
                      id="travel-budget"
                      placeholder="e.g., 2.5M"
                      value={newCompany.travelBudget}
                      onChange={(e) =>
                        setNewCompany({
                          ...newCompany,
                          travelBudget: e.target.value,
                        })
                      }
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="annual-travel-volume"
                      className="text-sm font-medium"
                    >
                      Annual Travel Volume
                    </Label>
                    <Input
                      id="annual-travel-volume"
                      placeholder="e.g., 5,000 trips"
                      value={newCompany.annualTravelVolume}
                      onChange={(e) =>
                        setNewCompany({
                          ...newCompany,
                          annualTravelVolume: e.target.value,
                        })
                      }
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="travel-frequency"
                      className="text-sm font-medium"
                    >
                      Travel Frequency
                    </Label>
                    <Select
                      value={newCompany.travelFrequency}
                      onValueChange={(value) =>
                        setNewCompany({ ...newCompany, travelFrequency: value })
                      }
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Daily">Daily</SelectItem>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                        <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="preferred-class"
                      className="text-sm font-medium"
                    >
                      Preferred Travel Class
                    </Label>
                    <Select
                      value={newCompany.preferredClass}
                      onValueChange={(value) =>
                        setNewCompany({ ...newCompany, preferredClass: value })
                      }
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select class preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Economy">Economy</SelectItem>
                        <SelectItem value="Economy Plus">
                          Economy Plus
                        </SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="First">First Class</SelectItem>
                        <SelectItem value="Business/First">
                          Business/First
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="sustainability-focus"
                      className="text-sm font-medium"
                    >
                      Sustainability Focus
                    </Label>
                    <Select
                      value={newCompany.sustainabilityFocus}
                      onValueChange={(value) =>
                        setNewCompany({
                          ...newCompany,
                          sustainabilityFocus: value,
                        })
                      }
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select sustainability level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Very High">Very High</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="risk-level" className="text-sm font-medium">
                      Risk Level
                    </Label>
                    <Select
                      value={newCompany.riskLevel}
                      onValueChange={(value) =>
                        setNewCompany({ ...newCompany, riskLevel: value })
                      }
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select risk level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Very Low">Very Low</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="current-airlines"
                    className="text-sm font-medium"
                  >
                    Current Airlines (comma-separated)
                  </Label>
                  <Input
                    id="current-airlines"
                    placeholder="e.g., United, Delta, American"
                    value={newCompany.currentAirlines}
                    onChange={(e) =>
                      setNewCompany({
                        ...newCompany,
                        currentAirlines: e.target.value,
                      })
                    }
                    className="h-10"
                  />
                </div>
              </TabsContent>

              <TabsContent value="additional" className="space-y-6 mt-0">
                <div className="space-y-2">
                  <Label
                    htmlFor="expansion-plans"
                    className="text-sm font-medium"
                  >
                    Expansion Plans
                  </Label>
                  <Select
                    value={newCompany.expansionPlans}
                    onValueChange={(value) =>
                      setNewCompany({ ...newCompany, expansionPlans: value })
                    }
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select expansion plans" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aggressive">Aggressive</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Conservative">Conservative</SelectItem>
                      <SelectItem value="Rapid">Rapid</SelectItem>
                      <SelectItem value="Stable">Stable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialties" className="text-sm font-medium">
                    Specialties (comma-separated)
                  </Label>
                  <Textarea
                    id="specialties"
                    placeholder="Enterprise Software, Cloud Solutions, AI/ML Services"
                    value={newCompany.specialties}
                    onChange={(e) =>
                      setNewCompany({
                        ...newCompany,
                        specialties: e.target.value,
                      })
                    }
                    className="min-h-[80px] resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="technology-integration"
                    className="text-sm font-medium"
                  >
                    Technology Integration (comma-separated)
                  </Label>
                  <Textarea
                    id="technology-integration"
                    placeholder="API, Mobile App, Expense Management"
                    value={newCompany.technologyIntegration}
                    onChange={(e) =>
                      setNewCompany({
                        ...newCompany,
                        technologyIntegration: e.target.value,
                      })
                    }
                    className="min-h-[80px] resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-medium">
                    Additional Notes
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information about the company..."
                    value={newCompany.notes}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, notes: e.target.value })
                    }
                    className="min-h-[120px] resize-none"
                  />
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>

          <DialogFooter className="pt-6 border-t border-gray-300 gap-3">
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => setShowAddCompanyDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddCompany}
              disabled={!isFormValid() || isSubmitting}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Add Lead
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Initiate Call Modal */}
      <Dialog
        open={showInitiateCallModal}
        onOpenChange={setShowInitiateCallModal}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PhoneCall className="h-5 w-5 text-blue-600" />
              Initiate Call - {selectedLeadForAction?.company}
            </DialogTitle>
            <DialogDescription>
              Schedule a phone call with {selectedLeadForAction?.contact} at{" "}
              {selectedLeadForAction?.company}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Call Type</Label>
                <Select defaultValue="discovery">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discovery">Discovery Call</SelectItem>
                    <SelectItem value="follow-up">Follow-up Call</SelectItem>
                    <SelectItem value="presentation">
                      Sales Presentation
                    </SelectItem>
                    <SelectItem value="negotiation">
                      Contract Discussion
                    </SelectItem>
                    <SelectItem value="check-in">Check-in Call</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">
                  Duration (minutes)
                </Label>
                <Select defaultValue="30">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">
                Scheduled Date & Time
              </Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Input
                  type="date"
                  placeholder="dd-mm-yyyy"
                  min={new Date().toISOString().split("T")[0]}
                />
                <Input type="time" placeholder="--:--" />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Call Agenda</Label>
              <Textarea
                placeholder="Discovery call with Sarah Johnson from TechCorp Solutions to discuss corporate travel needs and potential partnership opportunities."
                className="mt-1 min-h-[80px]"
                defaultValue={`Discovery call with ${selectedLeadForAction?.contact} from ${selectedLeadForAction?.company} to discuss corporate travel needs and potential partnership opportunities.`}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Preparation Notes</Label>
              <Textarea
                placeholder="Any additional preparation notes or context..."
                className="mt-1 min-h-[80px]"
                defaultValue={`Company Profile: ${selectedLeadForAction?.industry} sector, ${selectedLeadForAction?.employees} employees
Budget: ${selectedLeadForAction?.travelBudget}
Current Status: ${selectedLeadForAction?.status}
Key Topics: Travel volume, preferred airlines, booking preferences, cost optimization`}
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowInitiateCallModal(false)}
              className="text-gray-600 border-gray-300"
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                toast.success(
                  `Call scheduled with ${selectedLeadForAction?.contact}`,
                );
                setShowInitiateCallModal(false);
                setSelectedLeadForAction(null);
              }}
            >
              <PhoneCall className="h-4 w-4 mr-2" />
              Schedule Call
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Meeting Modal */}
      <Dialog
        open={showScheduleMeetingModal}
        onOpenChange={setShowScheduleMeetingModal}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <CalendarDays className="h-5 w-5 text-blue-600" />
              Schedule Meeting - {selectedLeadForAction?.company}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Schedule a business meeting with {selectedLeadForAction?.contact}{" "}
              and team
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Meeting Type
                </Label>
                <Select defaultValue="business">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business">Business Meeting</SelectItem>
                    <SelectItem value="discovery">Discovery Call</SelectItem>
                    <SelectItem value="presentation">
                      Solution Presentation
                    </SelectItem>
                    <SelectItem value="negotiation">
                      Contract Negotiation
                    </SelectItem>
                    <SelectItem value="follow-up">Follow-up Meeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Duration (minutes)
                </Label>
                <Select defaultValue="60">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                    <SelectItem value="120">120 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Meeting Title
              </Label>
              <Input
                className="mt-1"
                defaultValue={`Business Meeting - ${selectedLeadForAction?.company}`}
                placeholder="Enter meeting title"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Scheduled Date & Time
                </Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="date"
                    placeholder="dd-mm-yyyy"
                    min={new Date().toISOString().split("T")[0]}
                    className="flex-1"
                  />
                  <Input type="time" placeholder="--:--" className="flex-1" />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Location/Format
                </Label>
                <Select defaultValue="virtual">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="virtual">Virtual Meeting</SelectItem>
                    <SelectItem value="office">Office Meeting</SelectItem>
                    <SelectItem value="client-site">Client Site</SelectItem>
                    <SelectItem value="conference-room">
                      Conference Room
                    </SelectItem>
                    <SelectItem value="phone">Phone Call</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Expected Attendees
              </Label>
              <Input
                className="mt-1"
                defaultValue={`${selectedLeadForAction?.contact} (Procurement Director)`}
                placeholder="Enter attendee names and roles"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Meeting Agenda
              </Label>
              <Textarea
                className="mt-1 min-h-[80px]"
                defaultValue="Travel program requirements, solution presentation, pricing discussion, next steps"
                placeholder="Enter meeting agenda items"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Meeting Objectives
              </Label>
              <Textarea
                className="mt-1 min-h-[80px]"
                defaultValue="Understand travel needs, present SOAR-AI solutions, identify decision makers, establish timeline"
                placeholder="Enter meeting objectives and expected outcomes"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowScheduleMeetingModal(false)}
              className="text-gray-600 border-gray-300"
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                toast.success(
                  `Meeting scheduled with ${selectedLeadForAction?.contact}`,
                );
                setShowScheduleMeetingModal(false);
                setSelectedLeadForAction(null);
              }}
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Demo Modal */}
      <Dialog
        open={showScheduleDemoModal}
        onOpenChange={setShowScheduleDemoModal}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Presentation className="h-5 w-5 text-purple-600" />
              Schedule Demo - TechCorp Solutions
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Schedule a product demonstration for Sarah Johnson and team
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Demo Type
                </Label>
                <Select defaultValue="product">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product">Product Demo</SelectItem>
                    <SelectItem value="platform">Platform Overview</SelectItem>
                    <SelectItem value="custom">Custom Solution Demo</SelectItem>
                    <SelectItem value="integration">
                      Integration Demo
                    </SelectItem>
                    <SelectItem value="mobile">Mobile App Demo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Duration (minutes)
                </Label>
                <Select defaultValue="45">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                    <SelectItem value="120">120 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Demo Title
              </Label>
              <Input
                className="mt-1"
                defaultValue={`SOAR-AI Product Demo - ${selectedLeadForAction?.company}`}
                placeholder="Enter demo title"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Scheduled Date & Time
                </Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="date"
                    placeholder="dd-mm-yyyy"
                    min={new Date().toISOString().split("T")[0]}
                    className="flex-1"
                  />
                  <Input type="time" placeholder="--:--" className="flex-1" />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Demo Format
                </Label>
                <Select defaultValue="virtual">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="virtual">Virtual Demo</SelectItem>
                    <SelectItem value="onsite">On-site Demo</SelectItem>
                    <SelectItem value="hybrid">Hybrid Demo</SelectItem>
                    <SelectItem value="recorded">Recorded Demo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Expected Attendees
              </Label>
              <Input
                className="mt-1"
                defaultValue={`${selectedLeadForAction?.contact} (Procurement Director)`}
                placeholder="Enter attendee names and roles"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Focus Areas
              </Label>
              <Textarea
                className="mt-1 min-h-[80px]"
                defaultValue="Corporate travel booking platform, expense management, travel analytics, policy compliance"
                placeholder="Enter specific features or use cases to highlight during the demo"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Preparation Notes
              </Label>
              <Textarea
                className="mt-1 min-h-[80px]"
                defaultValue={`Prepare demo tailored for ${selectedLeadForAction?.industry} industry. Highlight cost savings and efficiency improvements.`}
                placeholder="Enter any preparation notes or context for the demo"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowScheduleDemoModal(false)}
              className="text-gray-600 border-gray-300"
            >
              Cancel
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => {
                toast.success(
                  `Demo scheduled with ${selectedLeadForAction?.contact}`,
                );
                setShowScheduleDemoModal(false);
                setSelectedLeadForAction(null);
              }}
            >
              <Presentation className="h-4 w-4 mr-2" />
              Schedule Demo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign/Reassign Agent Modal */}
      <Dialog
        open={showAssignAgentModal}
        onOpenChange={setShowAssignAgentModal}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              <User className="h-5 w-5 text-orange-600" />
              {selectedLeadForAssign?.assignedAgent
                ? "Reassign Sales Agent"
                : "Assign Sales Agent"}{" "}
              - {selectedLeadForAssign?.company}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              {selectedLeadForAssign?.assignedAgent
                ? `Reassign this lead from ${selectedLeadForAssign.assignedAgent} to a new sales agent for personalized follow-up and management`
                : "Assign this lead to a sales agent for personalized follow-up and management"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {/* Current Agent Display (for reassignment) */}
            {selectedLeadForAssign?.assigned_agent_details && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <Label className="text-sm font-medium text-blue-900 mb-2 block">
                  Current Agent
                </Label>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-blue-900">
                      {selectedLeadForAssign.assigned_agent_details.name}
                    </div>
                    <div className="text-sm text-blue-700">
                      {selectedLeadForAssign.assigned_agent_details.email}
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      Specialties:{" "}
                      {selectedLeadForAssign.assigned_agent_details.specialties?.join(
                        ", ",
                      )}{" "}
                      •{" "}
                      {
                        selectedLeadForAssign.assigned_agent_details
                          .current_leads
                      }{" "}
                      leads
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                {selectedLeadForAssign?.assignedAgent
                  ? "Select New Sales Agent"
                  : "Select Sales Agent"}
              </Label>
              <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose an agent..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sarah Wilson">
                    <div className="flex flex-col items-start py-1">
                      <div className="font-medium text-gray-900">
                        Sarah Wilson
                      </div>
                      <div className="text-xs text-gray-500">
                        Manufacturing, Healthcare • 8 leads
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="John Doe">
                    <div className="flex flex-col items-start py-1">
                      <div className="font-medium text-gray-900">John Doe</div>
                      <div className="text-xs text-gray-500">
                        Technology, Finance • 12 leads
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="Jane Smith">
                    <div className="flex flex-col items-start py-1">
                      <div className="font-medium text-gray-900">
                        Jane Smith
                      </div>
                      <div className="text-xs text-gray-500">
                        Retail, Consulting • 6 leads
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="Mike Johnson">
                    <div className="flex flex-col items-start py-1">
                      <div className="font-medium text-gray-900">
                        Mike Johnson
                      </div>
                      <div className="text-xs text-gray-500">
                        Energy, Manufacturing • 9 leads
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="David Brown">
                    <div className="flex flex-col items-start py-1">
                      <div className="font-medium text-gray-900">
                        David Brown
                      </div>
                      <div className="text-xs text-gray-500">
                        Healthcare, Government • 4 leads
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Assignment Priority */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Assignment Priority
              </Label>
              <Select
                value={assignmentPriority}
                onValueChange={setAssignmentPriority}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low Priority">Low Priority</SelectItem>
                  <SelectItem value="Medium Priority">
                    Medium Priority
                  </SelectItem>
                  <SelectItem value="High Priority">High Priority</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Assignment Notes */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Assignment Notes
              </Label>
              <Textarea
                value={assignmentNotes}
                onChange={(e) => setAssignmentNotes(e.target.value)}
                placeholder="Any specific instructions or context for the assigned agent..."
                className="min-h-[80px] resize-none"
              />
            </div>

            {/* Lead Summary */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-700 mb-2">
                Lead Summary
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div>Industry: {selectedLeadForAssign?.industry}</div>
                <div>Budget: {selectedLeadForAssign?.travelBudget}</div>
                <div>Score: {selectedLeadForAssign?.score}</div>
                <div>Status: {selectedLeadForAssign?.status}</div>
                <div>
                  AI Suggestion:{" "}
                  {selectedLeadForAssign?.score >= 80
                    ? "Send detailed cost comparison proposal. Mention case studies."
                    : "Add to SMB nurture campaign. Follow up in Q4 for growth stage."}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowAssignAgentModal(false);
                setSelectedLeadForAssign(null);
                setSelectedAgent("");
                setAssignmentNotes("");
              }}
              className="text-gray-600 border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAssignAgent}
              disabled={!selectedAgent || isAssigning}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isAssigning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Assigning...
                </>
              ) : (
                <>
                  <User className="h-4 w-4 mr-2" />
                  {selectedLeadForAssign?.assignedAgent
                    ? "Reassign Agent"
                    : "Assign Agent"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Move to Opportunity Confirmation Dialog */}
      <Dialog open={showMoveToOpportunityDialog} onOpenChange={setShowMoveToOpportunityDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              <ArrowRight className="h-5 w-5 text-green-600" />
              Move to Opportunities
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to move "{selectedLeadForOpportunity?.company}" to the Opportunities menu?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">What happens next?</span>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Lead will be converted to an opportunity</li>
                <li>• Opportunity stage will be set to "Discovery"</li>
                <li>• You'll be redirected to the Opportunities page</li>
                <li>• Lead will remain in the leads list for tracking</li>
              </ul>
            </div>

            {selectedLeadForOpportunity && (
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Company:</span> {selectedLeadForOpportunity.company}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Contact:</span> {selectedLeadForOpportunity.contact}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Estimated Value:</span> {selectedLeadForOpportunity.travelBudget}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowMoveToOpportunityDialog(false);
                setSelectedLeadForOpportunity(null);
              }}
              className="text-gray-600 border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmMoveToOpportunity}
              disabled={movingToOpportunityId === selectedLeadForOpportunity?.id}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {movingToOpportunityId === selectedLeadForOpportunity?.id ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Moving...
                </>
              ) : (
                <>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Move to Opportunities
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}