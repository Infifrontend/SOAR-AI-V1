import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
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
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { useLeadApi } from "../hooks/api/useLeadApi";
import { toast } from "sonner";
import { CorporateProfile } from './CorporateProfile';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Users,
  Building2,
  Phone,
  Mail,
  Globe,
  Star,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Edit,
  Eye,
  Filter,
  Search,
  Download,
  RefreshCw,
  Target,
  BarChart3,
  Activity,
  FileText,
  Handshake,
  Gift,
  Calculator,
  PieChart,
  Award,
  Zap,
  ArrowRight,
  History,
  MessageCircle,
  User,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface OpportunitiesProps {
  initialFilters?: any;
  onNavigate: (screen: string, filters?: any) => void;
}

// Define opportunity interface based on your Django model
interface Activity {
  id: number;
  type: string;
  type_display: string;
  description: string;
  date: string;
  created_at: string;
  created_by_name: string;
}

interface Opportunity {
  id: number;
  leadId?: number;
  name: string;
  stage: string;
  probability: number;
  value: number;
  estimated_close_date: string;
  actual_close_date?: string;
  description?: string;
  next_steps?: string;
  created_at: string;
  updated_at: string;
  activities?: Activity[];
  latest_activities?: Activity[];
  lead_info?: {
    company: {
      id: number;
      name: string;
      industry: string;
      location: string;
      employee_count?: number;
      size?: string;
    };
    contact: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      phone?: string;
      position?: string;
    };
  };
}

const stages = [
  {
    id: "discovery",
    label: "Qualified",
    color: "bg-blue-500",
    headerColor: "bg-blue-50",
    probability: 25,
  },
  {
    id: "proposal",
    label: "Proposal",
    color: "bg-orange-500",
    headerColor: "bg-orange-50",
    probability: 65,
  },
  {
    id: "negotiation",
    label: "Negotiation",
    color: "bg-purple-500",
    headerColor: "bg-purple-50",
    probability: 80,
  },
  {
    id: "closed_won",
    label: "Deal Won",
    color: "bg-green-500",
    headerColor: "bg-green-50",
    probability: 100,
  },
  {
    id: "closed_lost",
    label: "Deal Lost",
    color: "bg-red-500",
    headerColor: "bg-red-50",
    probability: 0,
  },
];

const ItemTypes = {
  OPPORTUNITY: "opportunity",
};

// Activity Accordion Component
interface ActivityAccordionProps {
  activities: Activity[];
}

const ActivityAccordion = memo(({ activities }: ActivityAccordionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);


  const displayedActivities = isExpanded ? activities : activities.slice(0, 1);
  const remainingCount = activities.length - 1;

  return (
    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center justify-between mb-2">
        <div className="text-blue-900 font-medium text-sm">
          Recent Activities ({activities.length})
        </div>
        {activities.length > 1 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
          >
            {isExpanded ? (
              <>
                <span>Show less</span>
                <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                <span>Show {remainingCount} more</span>
                <ChevronDown className="h-3 w-3" />
              </>
            )}
          </button>
        )}
      </div>
      <div className="space-y-2">
        {displayedActivities.map((activity) => (
          <div
            key={activity.id}
            className="text-xs text-blue-700 p-2 bg-white rounded border border-blue-100"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
              <span className="font-medium">{activity.type_display}</span>
              <span className="text-blue-600">
                {new Date(activity.date).toLocaleDateString()}
              </span>
              <span className="text-blue-500 ml-auto">
                by {activity.created_by_name}
              </span>
            </div>
            <div className="text-blue-600 ml-3">{activity.description}</div>
          </div>
        ))}
      </div>
    </div>
  );

});
ActivityAccordion.displayName = "ActivityAccordion";

// Opportunity Card Component matching the design in the image
interface OpportunityCardProps {
  opportunity: Opportunity;
  onEdit: (opportunity: Opportunity) => void;
  onAddActivity: (opportunity: Opportunity) => void;
  onViewHistory: (opportunity: Opportunity) => void;
  onSendProposal?: (opportunity: Opportunity) => void;
  onMoveToNegotiation?: (opportunity: Opportunity) => void;
  onCloseDeal?: (opportunity: Opportunity, status: string) => void;
  handleViewProfile: (profileId: string) => void;
  isDraftLoading?: boolean;
  loadingOpportunityId?: number | null;
}




const OpportunityCard = memo(
  ({
    opportunity,
    onEdit,
    onAddActivity,
    onViewHistory,
    onSendProposal,
    onMoveToNegotiation,
    onCloseDeal,
    handleViewProfile,
    isDraftLoading,
    loadingOpportunityId

  }: OpportunityCardProps) => {


    const [{ isDragging }, drag] = useDrag(() => ({
      type: ItemTypes.OPPORTUNITY,
      item: { id: opportunity.id, stage: opportunity.stage },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    const company = opportunity.lead_info?.company || {
      name: "Unknown Company",
      industry: "Unknown",
      location: "Unknown",
      employee_count: 0,
    };
    const contact = opportunity.lead_info?.contact || {
      first_name: "Unknown",
      last_name: "Contact",
      email: "",
      phone: "",
      position: "",
    };

    const getBadgeColor = (stage: string) => {
      switch (stage) {
        case "discovery":
          return "bg-blue-100 text-blue-800";
        case "proposal":
          return "bg-orange-100 text-orange-800";
        case "negotiation":
          return "bg-purple-100 text-purple-800";
        case "closed_won":
          return "bg-green-100 text-green-800";
        case "closed_lost":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    const formatCurrency = useCallback((amount: number | null | undefined) => {
      // Handle null, undefined, or NaN values
      const numAmount = Number(amount);
      if (!numAmount || isNaN(numAmount)) {
        return "$0";
      }

      if (numAmount >= 1000000) {
        return `$${(numAmount / 1000000).toFixed(1)}M`;
      } else if (numAmount >= 1000) {
        return `$${(numAmount / 1000).toFixed(0)}K`;
      } else {
        return `$${numAmount.toFixed(0)}`;
      }
    }, []);

    const formatDate = useCallback((dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }, []);



    return (
      <div
        ref={drag}
        className={`bg-white border border-gray-200 rounded-lg p-5 mb-3 cursor-pointer hover:shadow-md transition-all duration-200 ${
          isDragging ? "opacity-50 rotate-1 scale-105" : ""
        }`}
      >
        {/* Header with Company and Contact Info */}
        <div className="flex items-start justify-between p-2 mb-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg flex-shrink-0">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-base text-gray-900 truncate">
                  {company.name}
                </h4>
                <Badge
                  className={`text-xs px-2 py-1 ${getBadgeColor(opportunity.stage)}`}
                >
                  {stages.find((s) => s.id === opportunity.stage)?.label ||
                    opportunity.stage}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <span>
                  {contact.first_name} {contact.last_name}
                </span>
                {contact.position && (
                  <>
                    <span>•</span>
                    <span>{contact.position}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-lg font-bold text-green-600">
              {formatCurrency(opportunity.value)}
            </div>
            <div className="text-sm text-gray-500">
              {opportunity.probability}% probability
            </div>
          </div>
        </div>

        {/* Probability Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">
              Probability: {opportunity.probability}%
            </span>
          </div>
          <Progress value={opportunity.probability} className="h-2" />
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
          <div>
            <span className="text-gray-500">Industry:</span>
            <span className="ml-1 text-gray-900">{company.industry}</span>
          </div>
          <div>
            <span className="text-gray-500">Created:</span>
            <span className="ml-1 text-gray-900">
              {formatDate(opportunity.created_at)}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Company Size:</span>
            <span className="ml-1 text-gray-900">
              {company.employee_count || "Unknown"} employees
            </span>
          </div>
          <div>
            <span className="text-gray-500">Last Activity:</span>
            <span className="ml-1 text-gray-900">
              {formatDate(opportunity.updated_at)}
            </span>
          </div>
        </div>

        {/* Contact Information */}
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
          {contact.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              <span className="truncate max-w-[120px]">{contact.email}</span>
            </div>
          )}
          {contact.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>{contact.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            <span>{company.location}</span>
          </div>
        </div>

        {/* Next Action Section */}
        <div className="mb-3">
          <div className="flex items-start gap-2 mb-2 rounded-lg border px-4 py-3 text-sm bg-blue-100">
            <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <span className="text-blue-600 font-medium text-sm">
                Next Action:
              </span>
              <div className="text-blue-600 text-sm">
                {opportunity.next_steps || "Contract terms discussion"}
              </div>
            </div>
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-gray-900 font-medium text-sm mb-1">Notes:</div>
            <div className="text-gray-600 text-sm">
              {opportunity.description ||
                "Focused on cost optimization across multiple manufacturing sites"}
            </div>
          </div>

          {/* Recent Activities Section */}
          {opportunity.latest_activities &&
            opportunity.latest_activities.length > 0 && (
              <ActivityAccordion activities={opportunity.latest_activities} />
            )}
        </div>

        {/* Tags/Badges */}
        <div className="flex flex-wrap gap-1 mb-3">
          <Badge variant="outline" className="text-xs">
            {company.industry}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {company.size || "Enterprise"}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Decision Maker
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-between">
          <div className="flex gap-2">
            <Button
              size="sm"
              className="h-8 px-3 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(opportunity);
              }}
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md font-medium"
              onClick={(e) => {
                e.stopPropagation();
                onAddActivity(opportunity);
              }}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Activity
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md font-medium"
              onClick={(e) => {
                e.stopPropagation();
                onViewHistory(opportunity);
              }}
            >
              <History className="h-3 w-3 mr-1" />
              History
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md font-medium"
              onClick={(e) => {
                e.stopPropagation();
                handleViewProfile(String(opportunity.lead_info?.company?.id));
              }}
            >
              <Eye className="h-3 w-3 mr-1" />
              Details
            </Button>
          </div>
          <div className="flex gap-2">
            {/* Status-driven flow buttons */}
            {opportunity.stage === "discovery" && (
              <Button
                size="sm"
                className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium disabled:opacity-50"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSendProposal) {
                    onSendProposal(opportunity);
                  }
                }}
                disabled={isDraftLoading}
              >
                {isDraftLoading ? (
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <FileText className="h-3 w-3 mr-1" />
                )}
                {isDraftLoading ? "Loading..." : "Send Proposal"}
              </Button>
            )}

            {opportunity.stage === "proposal" && (
              <Button
                size="sm"
                className="h-8 px-3 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium disabled:opacity-50"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onMoveToNegotiation) {
                    onMoveToNegotiation(opportunity);
                  }
                }}
                disabled={isDraftLoading}
              >
                {isDraftLoading ? (
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <ArrowRight className="h-3 w-3 mr-1" />
                )}
                {isDraftLoading ? "Loading..." : "Negotiate"}
              </Button>
            )}

            {(opportunity.stage === "negotiation" || opportunity.stage === "proposal") && (
              <div className="relative group">
                <Button
                  size="sm"
                  className="h-8 px-3 text-xs bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-all duration-200"
                >
                  <Handshake className="h-3 w-3 mr-1" />
                  Close Deal
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>

                {/* Hover dropdown - positioned below the button and centered */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden min-w-[160px]">
                    <div className="p-1">
                      <button
                        className="w-full px-4 py-3 text-xs text-center hover:bg-green-50 flex items-center justify-center gap-2 text-green-700 font-medium rounded-md transition-colors duration-150 disabled:opacity-50"
                        disabled={loadingOpportunityId === opportunity.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onCloseDeal) {
                            onCloseDeal(opportunity, "closed_won");
                          }
                        }}
                      >
                        {loadingOpportunityId === opportunity.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                        Deal Won
                      </button>
                      <button
                        className="w-full px-4 py-3 text-xs text-center hover:bg-red-50 flex items-center justify-center gap-2 text-red-700 font-medium rounded-md transition-colors duration-150 mt-1 disabled:opacity-50"
                        disabled={loadingOpportunityId === opportunity.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onCloseDeal) {
                            onCloseDeal(opportunity, "closed_lost");
                          }
                        }}
                      >
                        {loadingOpportunityId === opportunity.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <AlertTriangle className="h-4 w-4" />
                        )}
                        Deal Lost
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

OpportunityCard.displayName = "OpportunityCard";

// Pipeline Column Component
interface PipelineColumnProps {
  stage: any;
  opportunities: Opportunity[];
  onDrop: (opportunityId: string, newStage: string) => void;
  onEdit: (opportunity: Opportunity) => void;
  onAddActivity: (opportunity: Opportunity) => void;
  onViewHistory: (opportunity: Opportunity) => void;
  onSendProposal?: (opportunity: Opportunity) => void;
  onMoveToNegotiation?: (opportunity: Opportunity) => void;
  onCloseDeal?: (opportunity: Opportunity, status: string) => void;
  handleViewProfile: (opportunity: Opportunity) => void;
  loadingOpportunityId?: number | null;
}

const PipelineColumn = memo(
  ({
    stage,
    opportunities,
    onDrop,
    onEdit,
    onAddActivity,
    onViewHistory,
    onSendProposal,
    onMoveToNegotiation,
    onCloseDeal,
    handleViewProfile,
    loadingOpportunityId,
  }: PipelineColumnProps) => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: ItemTypes.OPPORTUNITY,
      drop: (item: { id: string; stage: string }) => {
        if (item.stage !== stage.id) {
          onDrop(item.id, stage.id);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }));

    const formatCurrency = useCallback((amount: number | null | undefined) => {
      // Handle null, undefined, or NaN values
      const numAmount = Number(amount);
      if (!numAmount || isNaN(numAmount)) {
        return "$0";
      }

      if (numAmount >= 1000000) {
        return `$${(numAmount / 1000000).toFixed(1)}M`;
      } else if (numAmount >= 1000) {
        return `$${(numAmount / 1000).toFixed(0)}K`;
      } else {
        return `$${numAmount.toFixed(0)}`;
      }
    }, []);

    const totalValue = useMemo(
      () => opportunities.reduce((sum, opp) => sum + opp.value, 0),
      [opportunities],
    );

    return (
      <div
        ref={drop}
        className={`flex-1 min-w-80 ${isOver ? "ring-2 ring-blue-400 ring-opacity-50" : ""}`}
      >
        <div
          className={`${stage.headerColor} border-b-2 border-${stage.color.split("-")[1]}-500 p-3 rounded-t-lg`}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm text-gray-900">{stage.label}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {opportunities.length}
              </Badge>
              <span className="text-xs text-muted-foreground font-medium">
                {formatCurrency(totalValue)}
              </span>
            </div>
          </div>
        </div>

        <ScrollArea
          className={`${stage.color.replace("bg-", "bg-").replace("-500", "-50")} border-2 border-t-0 border-${stage.color.split("-")[1]}-200 rounded-b-lg min-h-[600px] p-3`}
        >
          <div className="space-y-3">
            {opportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                onEdit={onEdit}
                onAddActivity={onAddActivity}
                onViewHistory={onViewHistory}
                onSendProposal={onSendProposal}
                onMoveToNegotiation={onMoveToNegotiation}
                onCloseDeal={onCloseDeal}
                handleViewProfile={handleViewProfile}
                isDraftLoading={loadingOpportunityId === opportunity.id}
                loadingOpportunityId={loadingOpportunityId}
              />
            ))}

            {opportunities.length === 0 && (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <Target className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">No opportunities</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    );
  },
);

PipelineColumn.displayName = "PipelineColumn";

export function Opportunities({
  initialFilters,
  onNavigate,
}: OpportunitiesProps) {
  const {
    getOpportunities,
    updateOpportunityStage,
    addOpportunityActivity,
    getOpportunityActivities,
    getOpportunityHistory,
    getHistory,
    getProposalDraft,
    saveProposalDraft,
    updateProposalDraft,
    deleteProposalDraft,
    getAttachmentDownloadUrl,
    sendProposal,
  } = useLeadApi();


  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showProposalDialog, setShowProposalDialog] = useState(false);
  const [proposalDialogMode, setProposalDialogMode] = useState<'proposal' | 'negotiation'>('proposal');
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [emailPreviewContent, setEmailPreviewContent] = useState("");
  const [isDraftLoading, setIsDraftLoading] = useState(false);
  const [loadingOpportunityId, setLoadingOpportunityId] = useState<number | null>(null);
  const [currentView, setCurrentView] = useState("list");
  const [filters, setFilters] = useState({
    stage: "all",
    search: "",
  });
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isSavingActivity, setIsSavingActivity] = useState(false);
  const [showNegotiationDialog, setShowNegotiationDialog] = useState(false);
  const [isSavingNegotiation, setIsSavingNegotiation] = useState(false);  
const leadApi = useLeadApi();
 const [selectedCorporate, setSelectedCorporate] = useState();
    const [showCorporateProfile, setShowCorporateProfile] = useState(false);   
    const [leadData,setleads] = useState([]);

  const handleViewProfile = (opportunityId: string) => {
    const companyName = opportunities.find(opp => String(opp.id) === opportunityId)?.lead_info?.company?.name;
    console.log(leadData,'leadData');

    const item = leadData.find(entry => entry.company === companyName);
    console.log(item, 'item');
    setSelectedCorporate(item);
    setShowCorporateProfile(true);
  };
  console.log(showCorporateProfile,'showCorporateProfile',selectedCorporate); 

 const fetchLeads = async () => {
        try {
          // Apply current filters when fetching
          const filterParams = {
            search: '',
            status: '',
            industry: '',
            score: '',
            engagement: ''
          };

          console.log('Fetching leads with filters:', filterParams);
          const apiResponse = await leadApi.getLeads(filterParams);
          console.log('Raw API response:', apiResponse);

          // Handle different response formats
          let apiLeads = [];
          if (Array.isArray(apiResponse)) {
            apiLeads = apiResponse;
          } else if (apiResponse && Array.isArray(apiResponse.results)) {
            apiLeads = apiResponse.results;
          } else if (apiResponse && apiResponse.data && Array.isArray(apiResponse.data)) {
            apiLeads = apiResponse.data;
          } else {
            console.warn('Unexpected API response format:', apiResponse);
            apiLeads = [];
          }

          console.log('Processed leads array:', apiLeads);

          // Transform leads - history_entries are not included here as they are fetched on demand
          const transformedLeads = apiLeads.map((apiLead: any) => {
            console.log('Transforming lead:', apiLead);
            return transformApiLeadToUILead(apiLead);
          });

          const transformedLeadsforViewProfile = apiLeads.map((apiLead: any) => {
            console.log('Transforming lead for view profile:', apiLead);
            return transformCompanyDataForViewProfile(apiLead);
          });

          console.log("Transformed leads for view profile:", transformedLeadsforViewProfile);
          setleads(transformedLeadsforViewProfile); // Use the correct transformed data

        } catch (error) {
          console.error('Error fetching leads:', error);
          console.error('Error details:', error?.response?.data);
          // Don't show toast error for leads since it's optional for opportunities view
          // Set empty array on error to avoid showing static data
          setleads([]);
        }
      };
      useEffect(() => {
    // Always fetch leads on component mount
    fetchLeads();
  }, []); // Keep empty dependency array to run only once on mount
    const transformApiLeadToUILead = (apiLead: any) => {
    // Get the latest note from lead_notes array if available
    const latestNote = apiLead.lead_notes && apiLead.lead_notes.length > 0 
      ? apiLead.lead_notes[0] // Notes are ordered by -created_at in the backend
      : null;

    // Combine original notes with latest lead notes
    const combinedNotes = [
      apiLead.notes || '',
      latestNote ? `[${new Date(latestNote.created_at).toLocaleDateString()}] ${latestNote.note}` : ''
    ].filter(Boolean).join(' | ');
    console.log(apiLead,'cgecj');

    return {
      id: apiLead.id,
      company: apiLead.contact.company_name || 'Unknown Company',
      type: getCompanyTypeDisplay(apiLead.company.company_type || apiLead.company.size),
      contact: `${apiLead.full_name || ''} ${apiLead.contact.last_name || ''}`.trim() || 'Unknown Contact',
      title: apiLead.contact.position || 'Unknown Position',
      email: apiLead.contact.email || 'unknown@email.com',
      phone: apiLead.contact.phone || 'N/A',
      website: apiLead.company.website || `https://wwwwww. ${(apiLead.company.name || 'company').toLowerCase().replace(/\s+/g, '')}.com`,
      aiScore: Math.floor(Math.random() * 20) + 80, // Random AI score for demo
      industry: apiLead.company.industry || 'Unknown',
      employees: apiLead.company.employee_count ,
      specialties: apiLead.company.specialties ? apiLead.company.specialties.split(',').map(s => s.trim()).filter(s => s).slice(0, 5) : ["Business Services", "Corporate Solutions"],
      revenue: apiLead.company.annual_revenue ,
      location: apiLead.company.location || 'Unknown Location',
      status: apiLead.status || 'new',
      score: apiLead.score || 50,
      established: apiLead.company.year_established || (apiLead.company.created_at ? new Date(apiLead.company.created_at).getFullYear() : 2020),
      companySize: getSizeDisplay(apiLead.company.size),
      source: apiLead.source || 'Unknown',
      lastContact: apiLead.last_contact_at ? new Date(apiLead.last_contact_at).toISOString().split('T')[0] : apiLead.created_at ? new Date(apiLead.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      nextAction: apiLead.next_action || 'Follow up',
      destinations: getRandomDestinations(),
      financialStability: Math.floor(Math.random() * 20) + 80,
      notes: combinedNotes,
      leadNotes: apiLead.lead_notes || [], // Store all notes for display
      engagement: apiLead.score >= 80 ? 'High' : apiLead.score >= 60 ? 'Medium' : 'Low',
      travelBudget: apiLead.company?.travel_budget ? `${Math.floor(apiLead.company.travel_budget / 1000)}K` : '$0K',
      annualTravelVolume: apiLead.company.annual_travel_volume || `${Math.floor(Math.random() * 5000) + 1000} trips`,
      paymentTerms: apiLead.company.payment_terms || getRandomPaymentTerms(),
      creditRating: apiLead.company.credit_rating || getRandomCreditRating(),
      sustainabilityFocus: apiLead.company.sustainability_focus || getRandomSustainabilityFocus(),
      marketSegment: getIndustryDisplay(apiLead.company.industry),
      aiRecommendation: generateAIRecommendation(apiLead.company),
      technologyIntegration: apiLead.company.technology_integration ? apiLead.company.technology_integration.split(',').map(s => s.trim()).filter(s => s).slice(0, 5) : getRandomTechIntegration(),
      compliance: Math.floor(Math.random() * 20) + 80,
      decisionMaker: apiLead.contact?.is_decision_maker || Math.random() > 0.5,
      urgency: apiLead.priority || 'Medium', // Assuming 'priority' field maps to urgency
      aiSuggestion: `AI Score: ${apiLead.score}. ${apiLead.score >= 80 ? 'High priority lead - contact immediately' : apiLead.score >= 60 ? 'Medium priority - follow up within 2 days' : 'Low priority - add to nurture campaign'}`,
      tags: [apiLead.company?.industry || 'General', apiLead.status || 'New'],
      contractReady: apiLead.status === 'qualified',
      lastActivity: apiLead.updated_at ? new Date(apiLead.updated_at).toISOString().split('T')[0] : apiLead.created_at ? new Date(apiLead.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      followUpDate: apiLead.next_action_date || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignedAgent: apiLead.assigned_to?.username || null,
      assigned_agent_details: apiLead.assigned_to ? { // Map assigned agent details if available
        name: apiLead.assigned_to.full_name || apiLead.assigned_to.username,
        email: apiLead.assigned_to.email || `${apiLead.assigned_to.username}@soarai.com`,
        specialties: apiLead.assigned_to.specialties || [], // Assuming specialties field exists
        current_leads: apiLead.assigned_to.current_leads || 0, // Assuming current_leads field exists
      } : undefined,
      // History will be fetched separately via API and mapped in the dialog
      history_entries: [] // This will be populated via getHistory API call
    };
  };
  const transformCompanyDataForViewProfile = (apiLead) => {
  // console.log(apiLead, "apilead for view profile")
  // Transform backend data to match frontend expectations
  console.log(apiLead,'final');

  return {
    id: apiLead.id,
    name: apiLead.contact.company_name,
    type: getCompanyTypeDisplay(apiLead.company.company_type || apiLead.company.size),
    industry: getIndustryDisplay(apiLead.company.industry),
    location: apiLead.company.location,
    aiScore: Math.floor(Math.random() * 20) + 80, // Random AI score for demo
    rating: (Math.random() * 1 + 4).toFixed(1), // Random rating 4.0-5.0
    established: apiLead.company.year_established || (apiLead.company.created_at ? new Date(apiLead.company.created_at).getFullYear() : 2020),
    employees: apiLead.company.employee_count || Math.floor(Math.random() * 5000) + 100,
    specialties: apiLead.company.specialties ? apiLead.company.specialties.split(',').map(s => s.trim()).filter(s => s).slice(0, 5) : ["Business Services", "Corporate Solutions"],
    travelBudget: apiLead.company.travel_budget ? `${(apiLead.company.travel_budget / 1000000).toFixed(1)}M` : "1.0M",
    annualTravelVolume: apiLead.company.annual_travel_volume || `${Math.floor(Math.random() * 5000) + 1000} trips`,
    contracts: Math.floor(Math.random() * 20) + 1,
    revenue: apiLead.company.annual_revenue || Math.floor(Math.random() * 50000000) + 10000000,
    phone: apiLead.company.phone || "+1 (555) " + Math.floor(Math.random() * 900 + 100) + "-" + Math.floor(Math.random() * 9000 + 1000),
    email: apiLead.company.email || `contact@${apiLead.company.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    website: apiLead.company.website || `www.${apiLead.company.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    aiRecommendation: generateAIRecommendation(apiLead.company),
    compliance: Math.floor(Math.random() * 20) + 80,
    financialStability: Math.floor(Math.random() * 20) + 80,
    travelFrequency: apiLead.company.travel_frequency || getRandomTravelFrequency(),
    destinations: getRandomDestinations(),
    preferredClass: apiLead.company.preferred_class || getRandomPreferredClass(),
    teamSize: Math.floor((apiLead.company.employee_count || 1000) * 0.1),
    travelManagers: Math.floor(Math.random() * 5) + 1,
    currentAirlines: apiLead.company.current_airlines ? apiLead.company.current_airlines.split(',').map(s => s.trim()).filter(s => s).slice(0, 5) : getRandomAirlines(),
    paymentTerms: apiLead.company.payment_terms || getRandomPaymentTerms(),
    creditRating: apiLead.company.credit_rating || getRandomCreditRating(),
    sustainabilityFocus: apiLead.company.sustainability_focus || getRandomSustainabilityFocus(),
    technologyIntegration: apiLead.company.technology_integration ? apiLead.company.technology_integration.split(',').map(s => s.trim()).filter(s => s).slice(0, 5) : getRandomTechIntegration(),
    seasonality: getRandomSeasonality(),
    meetingTypes: getRandomMeetingTypes(),
    companySize: getSizeDisplay(apiLead.company.size),
    marketSegment: getIndustryDisplay(apiLead.company.industry),
    decisionMakers: Math.floor(Math.random() * 8) + 2,
    contractValue: Math.floor(Math.random() * 3000000) + 500000,
    competitorAirlines: Math.floor(Math.random() * 5) + 1,
    loyaltyPotential: Math.floor(Math.random() * 30) + 70,
    expansionPlans: apiLead.company.expansion_plans || getRandomExpansionPlans(),
    riskLevel: apiLead.company.risk_level || getRandomRiskLevel(),
    assigned_agent_details: apiLead.assigned_to ? { // Map assigned agent details if available
        name: apiLead.assigned_to.full_name || apiLead.assigned_to.username,
        email: apiLead.assigned_to.email || `${apiLead.assigned_to.username}@soarai.com`,
        specialties: apiLead.assigned_to.specialties || [], // Assuming specialties field exists
        current_leads: apiLead.assigned_to.current_leads || 0, // Assuming current_leads field exists
      } : undefined,
  };
};
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
    nonprofit: "Non-Profit"
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
    other: "Other"
  };
  return industries[industry] || "Business Services";
};

const getSizeDisplay = (size) => {
  const sizes = {
    startup: "Startup",
    small: "Small",
    medium: "Medium",
    large: "Large",
    enterprise: "Enterprise"
  };
  return sizes[size] || "Medium";
};

const generateAIRecommendation = (company) => {
  const recommendations = [
    "High-potential corporate client with strong growth indicators. Excellent opportunity for partnership.",
    "Established company with consistent business patterns. Good candidate for long-term contracts.",
    "Growing organization with expanding travel needs. Consider volume-based pricing strategies.",
    "Premium client with sophisticated requirements. Focus on high-service offerings.",
    "Cost-conscious organization seeking value. Emphasize efficiency and competitive pricing."
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
    ["Global", "Emerging Markets"]
  ];
  return destinations[Math.floor(Math.random() * destinations.length)];
};

const getRandomPreferredClass = () => {
  const classes = ["Economy", "Economy Plus", "Business", "First", "Business/First"];
  return classes[Math.floor(Math.random() * classes.length)];
};

const getRandomAirlines = () => {
  const airlines = [
    ["United", "Delta"],
    ["American", "Southwest"],
    ["Emirates", "Singapore Airlines"],
    ["British Airways", "Lufthansa"],
    ["Air France", "KLM"]
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
    ["Corporate Portal", "Reporting"]
  ];
  return tech[Math.floor(Math.random() * tech.length)];
};

const getRandomSeasonality = () => {
  const patterns = ["Year-round", "Q1/Q3 Heavy", "Spring/Summer Peak", "Holiday Heavy"];
  return patterns[Math.floor(Math.random() * patterns.length)];
};

const getRandomMeetingTypes = () => {
  const types = [
    ["Business Meetings", "Conferences"],
    ["Client Visits", "Trade Shows"],
    ["Team Offsites", "Training"],
    ["Site Visits", "Regulatory Meetings"]
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
  const [editForm, setEditForm] = useState({
    stage: "",
    probability: "",
    value: "",
    estimated_close_date: "",
    next_steps: "",
    description: "",
  });

  const [activityForm, setActivityForm] = useState({
    type: "call",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [proposalForm, setProposalForm] = useState({
    title: "",
    description: "",
    validityPeriod: "30",
    specialTerms: "",
    deliveryMethod: "email",
    attachedFile: null,
  });

  const [attachmentInfo, setAttachmentInfo] = useState({
    exists: false,
    filename: "",
    path: "",
  });

  // Persistent draft management using API
  const saveDraft = useCallback(async (opportunityId: number, formData: any, file?: File) => {
    try {
      setIsDraftLoading(true);

      // Prepare draft data for API
      const draftData = {
        // Proposal Information
        title: formData.title || '',
        description: formData.description || '',
        validity_period: formData.validityPeriod || '30',
        special_terms: formData.specialTerms || '',
        delivery_method: formData.deliveryMethod || 'email',

        // Volume Commitment - get from negotiationData if available
        travel_frequency: formData.negotiationData?.travelFrequency || 'monthly',
        annual_booking_volume: formData.negotiationData?.annualBookingVolume || '',
        projected_spend: formData.negotiationData?.projectedSpend || '',
        preferredRoutes: formData.negotiationData?.preferredRoutes || '',
        domesticEconomy: formData.negotiationData?.domesticEconomy !== undefined ? formData.negotiationData.domesticEconomy : 60,
        domesticBusiness: formData.negotiationData?.domesticBusiness !== undefined ? formData.negotiationData.domesticBusiness : 25,
        international: formData.negotiationData?.international !== undefined ? formData.negotiationData.international : 15,

        // Discount/Offer Terms
        baseDiscount: formData.negotiationData?.baseDiscount || '',
        routeDiscounts: formData.negotiationData?.routeDiscounts || [],
        loyaltyBenefits: formData.negotiationData?.loyaltyBenefits || {},
        volumeIncentives: formData.negotiationData?.volumeIncentives || '',

        // Financial & Contract Terms
        contractDuration: formData.negotiationData?.contractDuration || '24',
        autoRenewal: formData.negotiationData?.autoRenewal !== undefined ? formData.negotiationData.autoRenewal : true,
        paymentTerms: formData.negotiationData?.paymentTerms || 'net_30',
        settlementType: formData.negotiationData?.settlementType || 'bsp',

        // Negotiation Strategy
        airlineConcessions: formData.negotiationData?.airlineConcessions || '',
        corporateCommitments: formData.negotiationData?.corporateCommitments || '',
        internalNotes: formData.negotiationData?.internalNotes || '',
        priorityLevel: formData.negotiationData?.priorityLevel || 'medium',

        // Approvals Workflow
        discountApprovalRequired: formData.negotiationData?.discountApprovalRequired !== undefined ? formData.negotiationData.discountApprovalRequired : false,
        revenueManagerAssigned: formData.negotiationData?.revenueManagerAssigned || '',
        legalApprovalRequired: formData.negotiationData?.legalApprovalRequired !== undefined ? formData.negotiationData.legalApprovalRequired : false
      };

      // Try to update existing draft first, then create if it doesn't exist
      try {
        const response = await updateProposalDraft(opportunityId, draftData, file);
        // Update attachment info from response
        if (response.data?.attachment_info) {
          setAttachmentInfo(response.data.attachment_info);
        }
      } catch (error) {
        // If update fails (draft doesn't exist), create new one
        const response = await saveProposalDraft(opportunityId, draftData, file);
        // Update attachment info from response
        if (response.data?.attachment_info) {
          setAttachmentInfo(response.data.attachment_info);
        }
      }

      console.log(`Draft saved for opportunity ${opportunityId}:`, draftData);
    } catch (error) {
      console.error("Error saving draft:", error);
      throw error;
    } finally {
      setIsDraftLoading(false);
    }
  }, [saveProposalDraft, updateProposalDraft]);

  const loadDraft = useCallback(async (opportunityId: number) => {
    try {
      setIsDraftLoading(true);
      const response = await getProposalDraft(opportunityId);
      console.log(`Draft loaded for opportunity ${opportunityId}:`, response);

      // Handle attachment info if present
      const draftData = response?.data || response;
      if (draftData?.attachment_info) {
        setAttachmentInfo(draftData.attachment_info);
      } else {
        setAttachmentInfo({ exists: false, filename: "", path: "" });
      }

      return response;
    } catch (error) {
      if (error.response?.status === 404) {
        console.log(`No draft found for opportunity ${opportunityId}`);
        setAttachmentInfo({ exists: false, filename: "", path: "" });
        return null;
      }
      console.error("Error loading draft:", error);
      setAttachmentInfo({ exists: false, filename: "", path: "" });
      return null;
    } finally {
      setIsDraftLoading(false);
    }
  }, [getProposalDraft]);

  const clearDraft = useCallback(async (opportunityId: number) => {
    try {
      await deleteProposalDraft(opportunityId);
      console.log(`Draft cleared for opportunity ${opportunityId}`);
    } catch (error) {
      console.error("Error clearing draft:", error);
    }
  }, [deleteProposalDraft]);

  // Format currency function - moved here to avoid hoisting issues
  const formatCurrency = useCallback((amount: number | null | undefined) => {
    // Handle null, undefined, or NaN values
    const numAmount = Number(amount);
    if (!numAmount || isNaN(numAmount)) {
      return "$0";
    }

    if (numAmount >= 1000000) {
      return `$${(numAmount / 1000000).toFixed(1)}M`;
    } else if (numAmount >= 1000) {
      return `$${(numAmount / 1000).toFixed(0)}K`;
    } else {
      return `$${numAmount.toFixed(0)}`;
    }
  }, []);

  const generateEmailPreview = useCallback(() => {
    if (!selectedOpportunity) return "";

    const company = selectedOpportunity.lead_info?.company;
    const contact = selectedOpportunity.lead_info?.contact;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Travel Solutions Proposal</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #ddd; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #ddd; border-top: none; }
        .highlight { background: #e3f2fd; padding: 15px; border-left: 4px solid #2196f3; margin: 20px 0; }
        .terms { background: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0; }
        .button { display: inline-block; background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🛫 Travel Solutions Proposal</h1>
        <p>Your Corporate Travel Partnership Opportunity</p>
    </div>

    <div class="content">
        <p><strong>Dear ${contact?.first_name} ${contact?.last_name},</strong></p>

        <p>Thank you for your interest in our corporate travel solutions. We are pleased to present this comprehensive proposal for <strong>${company?.name}</strong>.</p>

        <div class="highlight">
            <h3>📋 ${proposalForm.title}</h3>
            <p>${proposalForm.description}</p>
        </div>

        <h3>🎯 Key Benefits for ${company?.name}:</h3>
        <ul>
            <li><strong>Cost Optimization:</strong> Significant savings through corporate rates and volume discounts</li>
            <li><strong>Travel Policy Compliance:</strong> Automated policy enforcement and reporting</li>
            <li><strong>24/7 Support:</strong> Dedicated account management and emergency assistance</li>
            <li><strong>Advanced Analytics:</strong> Comprehensive reporting and travel insights</li>
            <li><strong>Seamless Integration:</strong> Easy integration with your existing systems</li>
        </ul>

        <h3>💼 Proposal Details:</h3>
        <div class="terms">
            <p><strong>Delivery Method:</strong> ${proposalForm.deliveryMethod === 'email' ? 'Email Delivery' : 
              proposalForm.deliveryMethod === 'secure_portal' ? 'Secure Portal Access' :
              proposalForm.deliveryMethod === 'in_person' ? 'In-Person Presentation' : 'Video Call Presentation'}</p>
            <p><strong>Proposal Validity:</strong> ${proposalForm.validityPeriod} days from date of receipt</p>
            <p><strong>Estimated Deal Value:</strong> ${formatCurrency(selectedOpportunity?.value)}</p>
            <p><strong>Expected Implementation:</strong> 2-4 weeks after contract signing</p>
        </div>

        ${proposalForm.specialTerms ? `
        <h3>📝 Special Terms & Conditions:</h3>
        <div class="terms">
            <p>${proposalForm.specialTerms}</p>
        </div>
        ` : ''}

        <h3>🚀 Next Steps:</h3>
        <ol>
            <li>Review the attached detailed proposal document</li>
            <li>Schedule a presentation meeting with our team</li>
            <li>Discuss customization requirements</li>
            <li>Finalize contract terms and implementation timeline</li>
        </ol>

        <div class="highlight">
            <p><strong>⏰ This proposal is valid until:</strong> ${new Date(Date.now() + parseInt(proposalForm.validityPeriod) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
        </div>

        <p>We are excited about the opportunity to partner with ${company?.name} and help optimize your corporate travel program. Our team is ready to answer any questions and provide additional information as needed.</p>

        <p>Thank you for considering our proposal. We look forward to hearing from you soon.</p>

        <p>Best regards,<br>
        <strong>SOAR AI Corporate Travel Team</strong><br>
        📧 corporate@soar-ai.com<br>
        📞 +1 (555) 123-4567</p>
    </div>

    <div class="footer">
        <p><small>This proposal is confidential and intended solely for ${company?.name}. Please do not distribute without permission.</small></p>
        <p><small>© 2024 SOAR AI. All rights reserved.</small></p>
    </div>
</body>
</html>
    `.trim();
  }, [selectedOpportunity, proposalForm, formatCurrency]);

  const [negotiationForm, setNegotiationForm] = useState({
    // Header Section
    dealTitle: "",
    corporateContact: "",
    airlineAccountManager: "",
    expectedCloseDate: "",

    // Volume Commitment
    annualBookingVolume: "",
    projectedSpend: "",
    preferredRoutes: "",
    domesticEconomy: 60,
    domesticBusiness: 25,
    international: 15,
    travelFrequency: "monthly",

    // Discount/Offer Terms
    baseDiscount: "",
    routeDiscounts: [
      { route: "", discount: "", conditions: "" }
    ],
    loyaltyBenefits: {
      extraMiles: false,
      priorityBoarding: false,
      loungeAccess: false
    },
    volumeIncentives: "",

    // Financial & Contract Terms
    contractDuration: "24",
    autoRenewal: true,
    paymentTerms: "net_30",
    settlementType: "bsp",

    // Negotiation Strategy
    airlineConcessions: "",
    corporateCommitments: "",
    internalNotes: "",
    priorityLevel: "medium",

    // Approvals Workflow
    discountApprovalRequired: false,
    revenueManagerAssigned: "",
    legalApprovalRequired: false,

    // Document Attachments
    attachedFile: null
  });

  const [isDragging, setIsDragging] = useState(false);

  // Fetch opportunities data on component mount and when filters change
  useEffect(() => {
    const fetchOpportunities = async () => {
      setIsLoading(true);
      setCurrentPage(1); // Reset to first page on filter change
      try {
        console.log("Fetching opportunities with filters:", filters);
        const data = await getOpportunities({ ...filters }); // Fetch all opportunities
        console.log("Fetched opportunities data:", data);

        // Handle different API response formats
        let opportunitiesArray = [];
        if (Array.isArray(data)) {
          opportunitiesArray = data;
        } else if (data && Array.isArray(data.results)) {
          opportunitiesArray = data.results;
        } else if (data && Array.isArray(data.opportunities)) {
          opportunitiesArray = data.opportunities;
        } else if (data && data.data && Array.isArray(data.data)) {
          opportunitiesArray = data.data;
        } else {
          console.warn("Unexpected opportunities data format:", data);
          opportunitiesArray = [];
        }

        console.log("Setting opportunities:", opportunitiesArray);
        setOpportunities(opportunitiesArray);
        fetchLeads(); // Fetch leads for profile viewing
      } catch (error) {
        console.error("Error fetching opportunities:", error);
        setOpportunities([]);
        toast.error("Failed to fetch opportunities. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();

  }, [filters.stage, filters.search]); // Remove getOpportunities from dependencies to prevent loops


  // Handle new opportunity from leads - process only once
  useEffect(() => {
    if (initialFilters?.newOpportunity && opportunities.length > 0) {
      // Check if this opportunity was already added to prevent duplicates
      const existingOpportunity = opportunities.find(opp => 
        opp.leadId === initialFilters.newOpportunity.leadId ||
        opp.lead_info?.company?.name === initialFilters.newOpportunity.company
      );

      if (!existingOpportunity) {
        const newOpportunity = {
          id:
            initialFilters.newOpportunity.id ||
            Math.max(...opportunities.map((o) => o.id), 0) + 1,
          leadId: initialFilters.newOpportunity.leadId || null,
          name: `${initialFilters.newOpportunity.company || "Unknown Company"} - Corporate Travel Solution`,
          stage: initialFilters.newOpportunity.stage || "discovery",
          probability: initialFilters.newOpportunity.probability || 25,
          value:
            initialFilters.newOpportunity.value ||
            initialFilters.newOpportunity.dealValue ||
            250000,
          estimated_close_date:
            initialFilters.newOpportunity.estimated_close_date ||
            initialFilters.newOpportunity.expectedCloseDate ||
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
          description:
            initialFilters.newOpportunity.description ||
            initialFilters.newOpportunity.notes ||
            "Converted from qualified lead",
          next_steps:
            initialFilters.newOpportunity.next_steps ||
            "Send initial proposal and schedule presentation",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          lead_info: {
            company: {
              id: 1,
              name: initialFilters.newOpportunity.company || "Unknown Company",
              industry: initialFilters.newOpportunity.industry || "Unknown",
              location:
                initialFilters.newOpportunity.location || "Unknown Location",
              employee_count: initialFilters.newOpportunity.employees || 0,
            },
            contact: {
              id: 1,
              first_name:
                initialFilters.newOpportunity.contact?.split(" ")[0] || "Unknown",
              last_name:
                initialFilters.newOpportunity.contact
                  ?.split(" ")
                  .slice(1)
                  .join(" ") || "Contact",
              email: initialFilters.newOpportunity.email || "unknown@email.com",
              phone: initialFilters.newOpportunity.phone || "N/A",
              position: initialFilters.newOpportunity.title || "Contact",
            },
          },
        };

        setOpportunities((prev) => [newOpportunity, ...prev]);
        setSuccessMessage(
          initialFilters.message ||
            `${newOpportunity.lead_info.company.name} has been converted to an opportunity`,
        );
        setTimeout(() => setSuccessMessage(""), 5000);
      }
    }
  }, [initialFilters?.newOpportunity]); // Only depend on the newOpportunity data

  // Calculate pipeline metrics
  const safeOpportunities = useMemo(
    () => (Array.isArray(opportunities) ? opportunities : []),
    [opportunities],
  );
  const totalValue = useMemo(() => {
    return safeOpportunities.reduce((sum, opp) => {
      const oppValue =
        typeof opp?.value === "string"
          ? parseFloat(opp.value)
          : opp?.value || 0;
      return sum + oppValue;
    }, 0);
  }, [safeOpportunities]);

  const weightedValue = useMemo(() => {
    return safeOpportunities.reduce((sum, opp) => {
      const oppValue =
        typeof opp?.value === "string"
          ? parseFloat(opp.value)
          : opp?.value || 0;
      const oppProbability = opp?.probability || 0;
      return sum + (oppValue * oppProbability) / 100;
    }, 0);
  }, [safeOpportunities]);

  const avgDealSize = useMemo(() => {
    return safeOpportunities.length > 0
      ? totalValue / safeOpportunities.length
      : 0;
  }, [safeOpportunities, totalValue]);

  const winRate = useMemo(() => {
    if (safeOpportunities.length === 0) return 0;
    const closedWonCount = safeOpportunities.filter(
      (opp) => opp?.stage === "closed_won",
    ).length;
    return (closedWonCount / safeOpportunities.length) * 100;
  }, [safeOpportunities]);

  const stageMetrics = useMemo(
    () =>
      stages.map((stage) => {
        const stageOpps = safeOpportunities.filter(
          (opp) => opp?.stage === stage.id,
        );
        const stageValue = stageOpps.reduce((sum, opp) => {
          const oppValue =
            typeof opp?.value === "string"
              ? parseFloat(opp.value)
              : opp?.value || 0;
          return sum + oppValue;
        }, 0);

        return {
          ...stage,
          count: stageOpps.length,
          value: stageValue,
        };
      }),
    [safeOpportunities],
  );

  // Filtered opportunities
  const filteredOpportunities = useMemo(
    () =>
      safeOpportunities.filter((opp) => {
        if (!opp) return false;
        if (
          filters.stage &&
          filters.stage !== "all" &&
          opp.stage !== filters.stage
        )
          return false;
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          const companyName = opp.lead_info?.company?.name?.toLowerCase() || "";
          const firstName =
            opp.lead_info?.contact?.first_name?.toLowerCase() || "";
          const lastName =
            opp.lead_info?.contact?.last_name?.toLowerCase() || "";

          if (
            !companyName.includes(searchLower) &&
            !firstName.includes(searchLower) &&
            !lastName.includes(searchLower)
          ) {
            return false;
          }
        }
        return true;
      }),
    [safeOpportunities, filters],
  );



  // Pagination calculations
  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Sort opportunities by created date in descending order (latest first) for list view
  const sortedOpportunities = [...filteredOpportunities].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return dateB - dateA; // Descending order (latest first)
  });

  const paginatedOpportunities = sortedOpportunities.slice(
    startIndex,
    endIndex,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Event handlers
  const handleEditOpportunity = useCallback((opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setEditForm({
      stage: opportunity.stage,
      probability: opportunity.probability.toString(),
      value: opportunity.value.toString(),
      estimated_close_date: opportunity.estimated_close_date,
      next_steps: opportunity.next_steps || "",
      description: opportunity.description || "",
    });
    setShowEditDialog(true);
  }, []);

  const handleAddActivity = useCallback((opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setActivityForm({
      type: "call",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
    setShowActivityDialog(true);
  }, []);

  const handleViewHistory = useCallback(
    async (opportunity: Opportunity) => {
      setSelectedOpportunity(opportunity);
      setIsLoadingHistory(true);
      setHistoryData([]);
      setShowHistoryDialog(true);

      try {
        // Use the new comprehensive history API endpoint
        const historyData = await getOpportunityHistory(opportunity.id);
          console.log(historyData,'Fetched opportunity history')
        // Ensure we have an array, even if empty
        const formattedHistory = Array.isArray(historyData.data) ? historyData.data : [];
  console.log("Fetched opportunity history:",formattedHistory)
        setHistoryData(historyData.data);

        // Show success message if we got data, info if empty
        if (formattedHistory.length > 0) {
          console.log(`Loaded ${formattedHistory.length} history items`);
        } else {
          console.log("No history data available for this opportunity");
        }
      } catch (error) {
        console.error("Error fetching opportunity history:", error);
        // Don't show toast error since we handle it gracefully now
        setHistoryData([]);
      } finally {
        setIsLoadingHistory(false);
      }
    },
    [getOpportunityHistory],
  );

  const handleSendProposal = useCallback(async (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setLoadingOpportunityId(opportunity.id);
    setProposalDialogMode('proposal'); // Set mode to proposal

    try {
      // Try to load existing draft
      const response = await loadDraft(opportunity.id);

      // Handle API response - extract data from response object
      const existingDraft = response?.data || response;

      if (existingDraft && Object.keys(existingDraft).length > 0) {
        console.log("Loading existing draft:", existingDraft);

        // Load proposal form data from draft
        setProposalForm({
          title: existingDraft.title || `Travel Solutions Proposal - ${opportunity.lead_info?.company?.name}`,
          description: existingDraft.description || `Comprehensive travel management solution tailored for ${opportunity.lead_info?.company?.name}'s needs including cost optimization, policy compliance, and reporting analytics.`,
          validityPeriod: existingDraft.validity_period || "30",
          specialTerms: existingDraft.special_terms || "",
          deliveryMethod: existingDraft.delivery_method || "email",
          attachedFile: null, // File is not saved in draft
        });

        // Load negotiation form data from draft
        setNegotiationForm(prevForm => ({
          ...prevForm,
          dealTitle: existingDraft.deal_title || `${opportunity.lead_info?.company?.name} Corporate Travel Agreement`,
          corporateContact: existingDraft.corporate_contact || `${opportunity.lead_info?.contact?.first_name} ${opportunity.lead_info?.contact?.last_name}`,
          airlineAccountManager: existingDraft.airline_account_manager || "Current User",
          expectedCloseDate: existingDraft.expected_close_date || opportunity.estimated_close_date,
          travelFrequency: existingDraft.travel_frequency || prevForm.travelFrequency,
          annualBookingVolume: existingDraft.annual_booking_volume || prevForm.annualBookingVolume,
          projectedSpend: existingDraft.projected_spend || prevForm.projectedSpend,
          preferredRoutes: existingDraft.preferred_routes || prevForm.preferredRoutes,
          domesticEconomy: existingDraft.domestic_economy !== undefined ? existingDraft.domestic_economy : prevForm.domesticEconomy,
          domesticBusiness: existingDraft.domestic_business !== undefined ? existingDraft.domesticBusiness : prevForm.domesticBusiness,
          international: existingDraft.international !== undefined ? existingDraft.international : prevForm.international,
          baseDiscount: existingDraft.base_discount || prevForm.baseDiscount,
          routeDiscounts: Array.isArray(existingDraft.route_discounts) ? existingDraft.route_discounts : prevForm.routeDiscounts,
          loyaltyBenefits: typeof existingDraft.loyalty_benefits === 'object' ? existingDraft.loyalty_benefits : prevForm.loyaltyBenefits,
          volumeIncentives: existingDraft.volume_incentives || prevForm.volumeIncentives,
          contractDuration: existingDraft.contract_duration || prevForm.contractDuration,
          autoRenewal: existingDraft.auto_renewal !== undefined ? existingDraft.autoRenewal : prevForm.autoRenewal,
          paymentTerms: existingDraft.payment_terms || prevForm.paymentTerms,
          settlementType: existingDraft.settlement_type || prevForm.settlementType,
          airlineConcessions: existingDraft.airline_concessions || prevForm.airlineConcessions,
          corporateCommitments: existingDraft.corporate_commitments || `Annual volume commitment based on ${opportunity.lead_info?.company?.employee_count || 'N/A'} employees. Projected spend: ${formatCurrency(opportunity.value)}.`,
          internalNotes: existingDraft.internalNotes || prevForm.internalNotes,
          priorityLevel: existingDraft.priorityLevel || prevForm.priorityLevel,
          discountApprovalRequired: existingDraft.discountApprovalRequired !== undefined ? existingDraft.discountApprovalRequired : prevForm.discountApprovalRequired,
          revenueManagerAssigned: existingDraft.revenueManagerAssigned || prevForm.revenueManagerAssigned,
          legalApprovalRequired: existingDraft.legalApprovalRequired !== undefined ? existingDraft.legalApprovalRequired : prevForm.legalApprovalRequired
        }));

        // Handle attachment info
        if (existingDraft.attachment_info) {
          setAttachmentInfo(existingDraft.attachment_info);
        } else {
          setAttachmentInfo({ exists: false, filename: "", path: "" });
        }

        toast.success(`Draft loaded successfully! Last saved: ${existingDraft.updated_at ? new Date(existingDraft.updated_at).toLocaleString() : 'Recently'}`);
      } else {
        console.log("No existing draft found, setting default values");

        // Set default values
        setProposalForm({
          title: `Travel Solutions Proposal - ${opportunity.lead_info?.company?.name}`,
          description: `Comprehensive travel management solution tailored for ${opportunity.lead_info?.company?.name}'s needs including cost optimization, policy compliance, and reporting analytics.`,
          validityPeriod: "30",
          specialTerms: "",
          deliveryMethod: "email",
          attachedFile: null,
        });

        // Reset negotiation form to defaults for this opportunity
        setNegotiationForm(prevForm => ({
          ...prevForm,
          dealTitle: `${opportunity.lead_info?.company?.name} Corporate Travel Agreement`,
          corporateContact: `${opportunity.lead_info?.contact?.first_name} ${opportunity.lead_info?.contact?.last_name}`,
          airlineAccountManager: "Current User",
          expectedCloseDate: opportunity.estimated_close_date,
          corporateCommitments: `Annual volume commitment based on ${opportunity.lead_info?.company?.employee_count || 'N/A'} employees. Projected spend: ${formatCurrency(opportunity.value)}.`
        }));

        // Reset attachment info
        setAttachmentInfo({ exists: false, filename: "", path: "" });
      }
    } catch (error) {
      console.error("Error loading draft:", error);
      console.error("Error details:", error.response?.data);

      // Only show error if it's not a 404 (no draft found)
      if (error.response?.status !== 404) {
        toast.error("Failed to load draft data");
      }

      // Set default values as fallback
      setProposalForm({
        title: `Travel Solutions Proposal - ${opportunity.lead_info?.company?.name}`,
        description: `Comprehensive travel management solution tailored for ${opportunity.lead_info?.company?.name}'s needs including cost optimization, policy compliance, and reporting analytics.`,
        validityPeriod: "30",
        specialTerms: "",
        deliveryMethod: "email",
        attachedFile: null,
      });

      setNegotiationForm(prevForm => ({
        ...prevForm,
        dealTitle: `${opportunity.lead_info?.company?.name} Corporate Travel Agreement`,
        corporateContact: `${opportunity.lead_info?.contact?.first_name} ${opportunity.lead_info?.contact?.last_name}`,
        airlineAccountManager: "Current User",
        expectedCloseDate: opportunity.estimated_close_date,
        corporateCommitments: `Annual volume commitment based on ${opportunity.lead_info?.company?.employee_count || 'N/A'} employees. Projected spend: ${formatCurrency(opportunity.value)}.`
      }));

      // Reset attachment info on error
      setAttachmentInfo({ exists: false, filename: "", path: "" });
    } finally {
      setLoadingOpportunityId(null);
    }

    setShowProposalDialog(true);
  }, [loadDraft, formatCurrency]);

  const handleMoveToNegotiation = useCallback(async (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setLoadingOpportunityId(opportunity.id);
    setProposalDialogMode('negotiation'); // Set mode to negotiation

    try {
      // Try to load existing draft
      const response = await loadDraft(opportunity.id);

      // Handle API response - extract data from response object
      const existingDraft = response?.data || response;

      if (existingDraft && Object.keys(existingDraft).length > 0) {
        console.log("Loading existing draft for negotiation:", existingDraft);

        // Load proposal form data from draft
        setProposalForm({
          title: existingDraft.title || `Negotiation Terms - ${opportunity.lead_info?.company?.name}`,
          description: existingDraft.description || `Updated negotiation terms and conditions for ${opportunity.lead_info?.company?.name}'s corporate travel agreement.`,
          validityPeriod: existingDraft.validity_period || "30",
          specialTerms: existingDraft.special_terms || "",
          deliveryMethod: existingDraft.delivery_method || "email",
          attachedFile: null, // File is not saved in draft
        });

        // Load negotiation form data from draft
        setNegotiationForm(prevForm => ({
          ...prevForm,
          dealTitle: existingDraft.deal_title || `${opportunity.lead_info?.company?.name} Corporate Travel Agreement - Negotiation`,
          corporateContact: existingDraft.corporate_contact || `${opportunity.lead_info?.contact?.first_name} ${opportunity.lead_info?.contact?.last_name}`,
          airlineAccountManager: existingDraft.airline_account_manager || "Current User",
          expectedCloseDate: existingDraft.expected_close_date || opportunity.estimated_close_date,
          travelFrequency: existingDraft.travel_frequency || prevForm.travelFrequency,
          annualBookingVolume: existingDraft.annual_booking_volume || prevForm.annualBookingVolume,
          projectedSpend: existingDraft.projected_spend || prevForm.projectedSpend,
          preferredRoutes: existingDraft.preferred_routes || prevForm.preferredRoutes,
          domesticEconomy: existingDraft.domestic_economy !== undefined ? existingDraft.domestic_economy : prevForm.domesticEconomy,
          domesticBusiness: existingDraft.domestic_business !== undefined ? existingDraft.domesticBusiness : prevForm.domesticBusiness,
          international: existingDraft.international !== undefined ? existingDraft.international : prevForm.international,
          baseDiscount: existingDraft.base_discount || prevForm.baseDiscount,
          routeDiscounts: Array.isArray(existingDraft.route_discounts) ? existingDraft.route_discounts : prevForm.routeDiscounts,
          loyaltyBenefits: typeof existingDraft.loyalty_benefits === 'object' ? existingDraft.loyalty_benefits : prevForm.loyaltyBenefits,
          volumeIncentives: existingDraft.volume_incentives || prevForm.volumeIncentives,
          contractDuration: existingDraft.contract_duration || prevForm.contractDuration,
          autoRenewal: existingDraft.auto_renewal !== undefined ? existingDraft.autoRenewal : prevForm.autoRenewal,
          paymentTerms: existingDraft.payment_terms || prevForm.paymentTerms,
          settlementType: existingDraft.settlement_type || prevForm.settlementType,
          airlineConcessions: existingDraft.airline_concessions || prevForm.airlineConcessions,
          corporateCommitments: existingDraft.corporate_commitments || `Annual volume commitment based on ${opportunity.lead_info?.company?.employee_count || 'N/A'} employees. Projected spend: ${formatCurrency(opportunity.value)}.`,
          internalNotes: existingDraft.internalNotes || prevForm.internalNotes,
          priorityLevel: existingDraft.priorityLevel || prevForm.priorityLevel,
          discountApprovalRequired: existingDraft.discountApprovalRequired !== undefined ? existingDraft.discountApprovalRequired : prevForm.discountApprovalRequired,
          revenueManagerAssigned: existingDraft.revenueManagerAssigned || prevForm.revenueManagerAssigned,
          legalApprovalRequired: existingDraft.legalApprovalRequired !== undefined ? existingDraft.legalApprovalRequired : prevForm.legalApprovalRequired
        }));

        // Handle attachment info
        if (existingDraft.attachment_info) {
          setAttachmentInfo(existingDraft.attachment_info);
        } else {
          setAttachmentInfo({ exists: false, filename: "", path: "" });
        }

        toast.success(`Negotiation data loaded! Last saved: ${existingDraft.updated_at ? new Date(existingDraft.updated_at).toLocaleString() : 'Recently'}`);
      } else {
        console.log("No existing draft found, setting default negotiation values");

        // Set default values for negotiation
        setProposalForm({
          title: `Negotiation Terms - ${opportunity.lead_info?.company?.name}`,
          description: `Updated negotiation terms and conditions for ${opportunity.lead_info?.company?.name}'s corporate travel agreement.`,
          validityPeriod: "30",
          specialTerms: "",
          deliveryMethod: "email",
          attachedFile: null,
        });

        // Reset negotiation form to defaults for this opportunity
        setNegotiationForm(prevForm => ({
          ...prevForm,
          dealTitle: `${opportunity.lead_info?.company?.name} Corporate Travel Agreement - Negotiation`,
          corporateContact: `${opportunity.lead_info?.contact?.first_name} ${opportunity.lead_info?.contact?.last_name}`,
          airlineAccountManager: "Current User",
          expectedCloseDate: opportunity.estimated_close_date,
          corporateCommitments: `Annual volume commitment based on ${opportunity.lead_info?.company?.employee_count || 'N/A'} employees. Projected spend: ${formatCurrency(opportunity.value)}.`
        }));

        // Reset attachment info
        setAttachmentInfo({ exists: false, filename: "", path: "" });
      }
    } catch (error) {
      console.error("Error loading draft for negotiation:", error);
      console.error("Error details:", error.response?.data);

      // Only show error if it's not a 404 (no draft found)
      if (error.response?.status !== 404) {
        toast.error("Failed to load negotiation data");
      }

      // Set default values as fallback
      setProposalForm({
        title: `Negotiation Terms - ${opportunity.lead_info?.company?.name}`,
        description: `Updated negotiation terms and conditions for ${opportunity.lead_info?.company?.name}'s corporate travel agreement.`,
        validityPeriod: "30",
        specialTerms: "",
        deliveryMethod: "email",
        attachedFile: null,
      });

      setNegotiationForm(prevForm => ({
        ...prevForm,
        dealTitle: `${opportunity.lead_info?.company?.name} Corporate Travel Agreement - Negotiation`,
        corporateContact: `${opportunity.lead_info?.contact?.first_name} ${opportunity.lead_info?.contact?.last_name}`,
        airlineAccountManager: "Current User",
        expectedCloseDate: opportunity.estimated_close_date,
        corporateCommitments: `Annual volume commitment based on ${opportunity.lead_info?.company?.employee_count || 'N/A'} employees. Projected spend: ${formatCurrency(opportunity.value)}.`
      }));

      // Reset attachment info on error
      setAttachmentInfo({ exists: false, filename: "", path: "" });
    } finally {
      setLoadingOpportunityId(null);
    }

    setShowProposalDialog(true);
  }, [loadDraft, formatCurrency]);

  const handleCloseDeal = useCallback(async (opportunity: Opportunity, status: string) => {
    try {
      // Set loading state for the close deal button
      setLoadingOpportunityId(opportunity.id);

      const updateData = {
        stage: status,
        probability: status === "closed_won" ? 100 : 0,
        actual_close_date: new Date().toISOString().split("T")[0],
      };

      console.log("Closing deal with data:", updateData);

      // Update opportunity stage via API
      await updateOpportunityStage(opportunity.id, updateData);

      // Update local state to reflect the changes
      const updatedOpportunity = {
        ...opportunity,
        ...updateData,
        updated_at: new Date().toISOString(),
      };

      setOpportunities((prev) =>
        prev.map((opp) => (opp.id === opportunity.id ? updatedOpportunity : opp)),
      );

      const message = status === "closed_won" 
        ? `${opportunity.lead_info?.company?.name} deal closed successfully! 🎉`
        : `${opportunity.lead_info?.company?.name} deal marked as Deal Lost`;

      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(""), 5000);
      toast.success(message);
    } catch (error) {
      console.error("Error closing deal:", error);
      toast.error("Failed to close deal. Please try again.");
    } finally {
      // Clear loading state
      setLoadingOpportunityId(null);
    }
  }, [updateOpportunityStage]);

  const handleSaveEdit = useCallback(async () => {
    if (!selectedOpportunity) return;

    // Validate and convert data types properly
    const probability = parseInt(editForm.probability);
    const value = parseFloat(editForm.value);

    // Validate inputs
    if (isNaN(probability) || probability < 0 || probability > 100) {
      toast.error("Probability must be a number between 0 and 100");
      return;
    }

    if (isNaN(value) || value < 0) {
      toast.error("Value must be a positive number");
      return;
    }

    if (!editForm.estimated_close_date) {
      toast.error("Estimated close date is required");
      return;
    }

    const updateData = {
      stage: editForm.stage,
      probability: probability,
      value: value,
      estimated_close_date: editForm.estimated_close_date,
      next_steps: editForm.next_steps || "",
      description: editForm.description || "",
    };

    setIsSavingEdit(true);

    try {
      console.log("Updating opportunity with data:", updateData);

      // Update via API
      const response = await updateOpportunityStage(
        selectedOpportunity.id,
        updateData,
      );

      console.log("Update response:", response);

      const updatedOpportunity = {
        ...selectedOpportunity,
        ...updateData,
        updated_at: new Date().toISOString(),
      };

      // Update local state with the response or optimistic update
      setOpportunities((prev) =>
        prev.map((opp) =>
          opp.id === selectedOpportunity.id ? updatedOpportunity : opp,
        ),
      );

      setShowEditDialog(false);
      setSuccessMessage(
        `${selectedOpportunity.lead_info?.company?.name} opportunity has been updated`,
      );
      setTimeout(() => setSuccessMessage(""), 5000);

      toast.success(
        `${selectedOpportunity.lead_info?.company?.name} opportunity updated successfully!`,
      );
    } catch (error) {
      console.error("Error updating opportunity:", error);
      console.error("Error details:", error.response?.data);

      // Show specific error message if available
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update opportunity. Please try again.";
      toast.error(errorMessage);

      // Optionally refresh opportunities to ensure consistency
      try {
        const data = await getOpportunities({ ...filters });
        const opportunitiesArray = Array.isArray(data)
          ? data
          : data?.results || data?.opportunities || [];
        setOpportunities(opportunitiesArray);
      } catch (refreshError) {
        console.error("Error refreshing opportunities:", refreshError);
      }
    } finally {
      setIsSavingEdit(false);
    }
  }, [
    selectedOpportunity,
    editForm,
    updateOpportunityStage,
    getOpportunities,
    filters,
  ]);

  const handleSaveActivity = useCallback(async () => {
    if (!selectedOpportunity) return;

    if (!activityForm.description.trim()) {
      toast.error("Activity description is required");
      return;
    }

    setIsSavingActivity(true);

    try {
      // Add user information to the activity data
      const activityWithUser = {
        ...activityForm,
        created_by_name: "Current User", // In a real app, this would come from auth context
      };

      const response = await addOpportunityActivity(
        selectedOpportunity.id,
        activityWithUser,
      );

      // Refresh opportunities to show the new activity
      const updatedOpportunities = await getOpportunities({ ...filters });
      const opportunitiesArray = Array.isArray(updatedOpportunities)
        ? updatedOpportunities
        : updatedOpportunities?.results ||
          updatedOpportunities?.opportunities ||
          [];
      setOpportunities(opportunitiesArray);

      setShowActivityDialog(false);
      setSuccessMessage(
        `Activity added to ${selectedOpportunity.lead_info?.company?.name} opportunity`,
      );
      setTimeout(() => setSuccessMessage(""), 5000);
      toast.success("Activity added successfully!");
    } catch (error) {
      console.error("Error saving activity:", error);
      toast.error("Failed to save activity. Please try again.");
    } finally {
      setIsSavingActivity(false);
    }
  }, [
    selectedOpportunity,
    activityForm,
    addOpportunityActivity,
    getOpportunities,
    filters,
    setOpportunities,
  ]);

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setProposalForm({ ...proposalForm, attachedFile: file });
      }
    },
    [proposalForm],
  );

  const handleFileDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer.files[0];
      if (file) {
        setProposalForm({ ...proposalForm, attachedFile: file });
      }
    },
    [proposalForm],
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(true);
    },
    [],
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
    },
    [],
  );

  const removeAttachedFile = useCallback(() => {
    setProposalForm({ ...proposalForm, attachedFile: null });
    // If there was a stored attachment and we're removing a new file, keep the stored one visible
    // The stored attachment will only be hidden if user explicitly removes it via the separate remove button
  }, [proposalForm]);

  const handleSaveProposal = useCallback(async () => {
    if (!selectedOpportunity) return;

    try {
      // Set loading state for the send proposal button
      setLoadingOpportunityId(selectedOpportunity.id);

      // Prepare proposal data for sending
      const proposalData = {
        opportunity_id: selectedOpportunity.id,
        subject: proposalForm.title || `Travel Solutions Proposal - ${selectedOpportunity.lead_info?.company?.name}`,
        email_content: generateEmailPreview(),
        delivery_method: proposalForm.deliveryMethod,
        validity_period: proposalForm.validityPeriod,
        special_terms: proposalForm.specialTerms,
      };

      console.log("Sending proposal with data:", proposalData);

      // Send proposal via API
      await sendProposal(selectedOpportunity.id, proposalData);

      // Clear the draft since proposal is being sent
      clearDraft(selectedOpportunity.id);

      // Update opportunity stage via API
      await updateOpportunityStage(selectedOpportunity.id, {
        stage: "proposal",
        probability: 65,
      });

      // Update local state to reflect the changes
      const updatedOpportunity = {
        ...selectedOpportunity,
        stage: "proposal",
        probability: 65,
        updated_at: new Date().toISOString(),
      };

      setOpportunities((prev) =>
        prev.map((opp) => 
          opp.id === selectedOpportunity.id ? updatedOpportunity : opp
        ),
      );

      setShowProposalDialog(false);
      setSuccessMessage(
        `Proposal sent to ${selectedOpportunity.lead_info?.company?.name} and moved to Proposal stage`,
      );
      setTimeout(() => setSuccessMessage(""), 5000);
      toast.success("Proposal sent successfully!");
    } catch (error) {
      console.error("Error sending proposal:", error);
      toast.error("Failed to send proposal. Please try again.");
    } finally {
      // Clear loading state
      setLoadingOpportunityId(null);
    }
  }, [selectedOpportunity, proposalForm, generateEmailPreview, sendProposal, clearDraft, updateOpportunityStage]);

  const handleSaveDraft = useCallback(async () => {
    if (!selectedOpportunity) return;

    try {
      setIsDraftLoading(true);

      // Combine proposal and negotiation form data
      const combinedFormData = {
        ...proposalForm,
        negotiationData: negotiationForm
      };

      await saveDraft(selectedOpportunity.id, combinedFormData, proposalForm.attachedFile);
      toast.success("Draft saved successfully");

      // Close the proposal dialog after successful save
      setShowProposalDialog(false);
    } catch (error: any) {
      console.error("Error saving draft:", error);
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to save draft";
      toast.error(errorMessage);
    } finally {
      setIsDraftLoading(false);
    }
  }, [selectedOpportunity, proposalForm, negotiationForm, saveDraft]);

  const handlePreviewEmail = useCallback(() => {
    const previewContent = generateEmailPreview();
    setEmailPreviewContent(previewContent);
    setShowEmailPreview(true);
  }, [generateEmailPreview]);

  const handleSaveNegotiationDraft = useCallback(() => {
    if (!selectedOpportunity) return;

    console.log("Saving negotiation draft:", negotiationForm);
    toast.success("Negotiation draft saved successfully!");
  }, [selectedOpportunity, negotiationForm]);

  const handleStartNegotiation = useCallback(() => {
    if (!selectedOpportunity) return;

    // Validate required fields
    if (!negotiationForm.dealTitle || !negotiationForm.expectedCloseDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSavingNegotiation(true);

    // Move opportunity to negotiation stage
    const updatedOpportunity = {
      ...selectedOpportunity,
      stage: "negotiation",
      probability: 80,
      updated_at: new Date().toISOString(),
    };

    setOpportunities((prev) =>
      prev.map((opp) => 
        opp.id === selectedOpportunity.id ? updatedOpportunity : opp
      ),
    );

    setTimeout(() => {
      setIsSavingNegotiation(false);
      setShowNegotiationDialog(false);
      setSuccessMessage(
        `Negotiation started with ${selectedOpportunity.lead_info?.company?.name}`,
      );
      setTimeout(() => setSuccessMessage(""), 5000);
    }, 1000);
  }, [selectedOpportunity, negotiationForm]);

  const handleGenerateRevisedProposal = useCallback(async () => {
    if (!selectedOpportunity) return;

    try {
      // Set loading state for the send revised proposal button
      setLoadingOpportunityId(selectedOpportunity.id);

      // Prepare proposal data for sending (same as Send Proposal)
      const proposalData = {
        opportunity_id: selectedOpportunity.id,
        subject: proposalForm.title || `Negotiation Terms - ${selectedOpportunity.lead_info?.company?.name}`,
        email_content: generateEmailPreview(),
        delivery_method: proposalForm.deliveryMethod,
        validity_period: proposalForm.validityPeriod,
        special_terms: proposalForm.specialTerms,
      };

      console.log("Sending revised proposal with data:", proposalData);

      // Send proposal via API (same as Send Proposal)
      await sendProposal(selectedOpportunity.id, proposalData);

      // Clear the draft since proposal is being sent
      clearDraft(selectedOpportunity.id);

      // Update opportunity stage to negotiation (different from Send Proposal)
      await updateOpportunityStage(selectedOpportunity.id, {
        stage: "negotiation",
        probability: 80,
      });

      // Update local state to reflect the changes
      const updatedOpportunity = {
        ...selectedOpportunity,
        stage: "negotiation",
        probability: 80,
        updated_at: new Date().toISOString(),
      };

      setOpportunities((prev) =>
        prev.map((opp) => 
          opp.id === selectedOpportunity.id ? updatedOpportunity : opp
        ),
      );

      setShowProposalDialog(false);
      setSuccessMessage(
        `Revised proposal sent to ${selectedOpportunity.lead_info?.company?.name} and moved to Negotiation stage`,
      );
      setTimeout(() => setSuccessMessage(""), 5000);
      toast.success("Revised proposal sent successfully!");
    } catch (error) {
      console.error("Error sending revised proposal:", error);
      toast.error("Failed to send revised proposal. Please try again.");
    } finally {
      // Clear loading state
      setLoadingOpportunityId(null);
    }
  }, [selectedOpportunity, proposalForm, generateEmailPreview, sendProposal, clearDraft, updateOpportunityStage]);

  const addRouteDiscount = useCallback(() => {
    setNegotiationForm({
      ...negotiationForm,
      routeDiscounts: [
        ...negotiationForm.routeDiscounts,
        { route: "", discount: "", conditions: "" }
      ]
    });
  }, [negotiationForm]);

  const removeRouteDiscount = useCallback((index: number) => {
    const newRouteDiscounts = negotiationForm.routeDiscounts.filter((_, i) => i !== index);
    setNegotiationForm({
      ...negotiationForm,
      routeDiscounts: newRouteDiscounts
    });
  }, [negotiationForm]);

  const updateRouteDiscount = useCallback((index: number, field: string, value: string) => {
    const newRouteDiscounts = [...negotiationForm.routeDiscounts];
    newRouteDiscounts[index] = { ...newRouteDiscounts[index], [field]: value };
    setNegotiationForm({
      ...negotiationForm,
      routeDiscounts: newRouteDiscounts
    });
  }, [negotiationForm]);

  // Drag and Drop Handler
  const handleDrop = useCallback(
    async (opportunityId: string, newStage: string) => {
      if (!opportunityId || !newStage) {
        toast.error("Invalid opportunity or stage data");
        return;
      }

      try {
        // Update via API
        await updateOpportunityStage(parseInt(opportunityId), {
          stage: newStage,
        });

        // Update local state
        setOpportunities((prevOpportunities) =>
          prevOpportunities.map((opportunity) =>
            opportunity.id === parseInt(opportunityId)
              ? {
                  ...opportunity,
                  stage: newStage,
                  probability:
                    stages.find((s) => s.id === newStage)?.probability ||
                    opportunity.probability,
                  updated_at: new Date().toISOString(),
                }
              : opportunity,
          ),
        );

        const stageName =
          stages.find((s) => s.id === newStage)?.label || newStage;
        const oppName =
          opportunities.find((o) => o.id === parseInt(opportunityId))?.lead_info
            ?.company?.name || "Opportunity";
        setSuccessMessage(`${oppName} moved to ${stageName} stage`);
        setTimeout(() => setSuccessMessage(""), 5000);
      } catch (error) {
        console.error("Error updating opportunity stage:", error);
        toast.error("Failed to update opportunity stage. Please try again.");

        // Refresh opportunities to revert any optimistic updates
        try {
          const data = await getOpportunities({
            ...filters,
            page: currentPage,
            limit: 25,
          });
          setOpportunities(Array.isArray(data) ? data : []);
        } catch (refreshError) {
          console.error("Error refreshing opportunities:", refreshError);
        }
      }
    },
    [
      opportunities,
      stages,
      updateOpportunityStage,
      getOpportunities,
      filters,
      currentPage,
    ],
  );

  const getOpportunitiesForStage = useCallback(
    (stageId: string) => {
      return filteredOpportunities.filter(
        (opportunity) => opportunity.stage === stageId,
      );
    },
    [filteredOpportunities],
  );

  return (
    <>
       {showCorporateProfile && selectedCorporate && (
  <Dialog open={showCorporateProfile} onOpenChange={setShowCorporateProfile}>
    <DialogContent className="max-w-2xl cls-corporate-profile">
      <div className="mt-4 max-h-[90vh] overflow-y-auto">
        <CorporateProfile
          corporateData={selectedCorporate}
          onBack={() => setShowCorporateProfile(false)}
        />
      </div>
    </DialogContent>
  </Dialog>
)}

    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
        {/* Success Message */}
        {successMessage && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Sales Opportunities
            </h2>
            <p className="text-gray-600">
              Manage your sales pipeline and track deal progress
            </p>
          </div>
          <div className="flex gap-2">
            {/* <Button variant="outline" className="flex items-center gap-2 cls-addcomapany">
              <Download className="h-4 w-4" />
              Export
            </Button> */}
            <Button
              variant="outline"
              className="flex items-center gap-2 cls-addcomapany"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Pipeline Metrics - Matching the design */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Pipeline Value
              </CardTitle>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalValue)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {opportunities.length} opportunities
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Weighted Pipeline
              </CardTitle>
              <Target className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(weightedValue)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Probability adjusted value
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg Deal Size
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(avgDealSize)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Average opportunity value
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Win Rate
              </CardTitle>
              <Award className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {winRate.toFixed(0)}%
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Deal Won percentage
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pipeline by Stage - Matching the design */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Pipeline by Stage
            </CardTitle>
            <CardDescription className="text-gray-600">
              Opportunities distribution across sales stages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-8">
              {stageMetrics.map((stage, index) => (
                <div key={stage.id} className="text-center">
                  <div
                    className={`w-16 h-16 rounded-full ${stage.color} text-white flex items-center justify-center mx-auto mb-3 text-lg font-bold`}
                  >
                    {stage.count}
                  </div>
                  <p className="font-medium text-sm text-gray-900 mb-1">
                    {stage.label}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatCurrency(stage.value)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
          <div className="flex gap-4 flex-1">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search opportunities..."
                className="pl-10"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />
            </div>
            <Select
              value={filters.stage}
              onValueChange={(value) =>
                setFilters({ ...filters, stage: value })
              }
            >
              <SelectTrigger className="w-80">
                <SelectValue placeholder="All Stages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {stages.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id}>
                    {stage.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* View Toggle */}
        <Tabs
          value={currentView}
          onValueChange={setCurrentView}
          className="w-full"
        >
          <div className="flex items-center justify-center mb-6">
            <TabsList className="grid w-100 grid-cols-2">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="kanban">Pipeline View</TabsTrigger>
            </TabsList>
          </div>

          {/* List View */}
          <TabsContent value="list" className="space-y-4">
            {isLoading ? (
              // Optimized loading skeleton
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                          <div>
                            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-24"></div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="h-5 bg-gray-200 rounded w-16 mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-12"></div>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded w-full mb-3"></div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredOpportunities.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">
                    No Opportunities Found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {opportunities.length === 0 
                      ? "No opportunities available. Create your first opportunity from the leads section."
                      : "No opportunities match your current filters. Try adjusting your search criteria."
                    }
                  </p>
                  <Button 
                    onClick={() => onNavigate('leads')}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Go to Leads
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="space-y-4">
                  {paginatedOpportunities.map((opportunity) => (
                    <OpportunityCard
                      key={opportunity.id}
                      opportunity={opportunity}
                      onEdit={handleEditOpportunity}
                      onAddActivity={handleAddActivity}
                      onViewHistory={handleViewHistory}
                      onSendProposal={handleSendProposal}
                      onMoveToNegotiation={handleMoveToNegotiation}
                      onCloseDeal={handleCloseDeal}
                      handleViewProfile={handleViewProfile}
                      isDraftLoading={loadingOpportunityId === opportunity.id}
                      loadingOpportunityId={loadingOpportunityId}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>
                        Showing {startIndex + 1}-
                        {Math.min(endIndex, filteredOpportunities.length)} of{" "}
                        {filteredOpportunities.length} opportunities
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Previous Page Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="border-gray-300"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>

                      {/* Page Numbers */}
                      <div className="flex items-center gap-1">
                        {(() => {
                          const pages = [];
                          const maxVisiblePages = 5;
                          let startPage = Math.max(
                            1,
                            currentPage - Math.floor(maxVisiblePages / 2),
                          );
                          let endPage = Math.min(
                            totalPages,
                            startPage + maxVisiblePages - 1,
                          );

                          // Adjust start page if we're near the end
                          if (endPage - startPage + 1 < maxVisiblePages) {
                            startPage = Math.max(
                              1,
                              endPage - maxVisiblePages + 1,
                            );
                          }

                          // Add first page and ellipsis if needed
                          if (startPage > 1) {
                            pages.push(
                              <Button
                                key={1}
                                variant={
                                  1 === currentPage ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => handlePageChange(1)}
                                className={`w-9 h-9 p-0 ${1 === currentPage ? "bg-orange-500 hover:bg-orange-600 text-white" : "border-gray-300"}`}
                              >
                                1
                              </Button>,
                            );
                            if (startPage > 2) {
                              pages.push(
                                <span
                                  key="ellipsis1"
                                  className="px-2 text-gray-500"
                                >
                                  ...
                                </span>,
                              );
                            }
                          }

                          // Add visible page numbers
                          for (let i = startPage; i <= endPage; i++) {
                            pages.push(
                              <Button
                                key={i}
                                variant={
                                  i === currentPage ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => handlePageChange(i)}
                                className={`w-9 h-9 p-0 ${i === currentPage ? "bg-orange-500 hover:bg-orange-600 text-white" : "border-gray-300"}`}
                              >
                                {i}
                              </Button>,
                            );
                          }

                          // Add ellipsis and last page if needed
                          if (endPage < totalPages) {
                            if (endPage < totalPages - 1) {
                              pages.push(
                                <span
                                  key="ellipsis2"
                                  className="px-2 text-gray-500"
                                >
                                  ...
                                </span>,
                              );
                            }
                            pages.push(
                              <Button
                                key={totalPages}
                                variant={
                                  totalPages === currentPage
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => handlePageChange(totalPages)}
                                className={`w-9 h-9 p-0 ${totalPages === currentPage ? "bg-orange-500 hover:bg-orange-600 text-white" : "border-gray-300"}`}
                              >
                                {totalPages}
                              </Button>,
                            );
                          }

                          return pages;
                        })()}
                      </div>

                      {/* Next Page Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="border-gray-300"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Pipeline View - Kanban Board */}
          <TabsContent value="kanban" className="space-y-4">
            <div className="flex gap-6 overflow-x-auto pb-4">
              {stages.map((stage) => (
                <PipelineColumn
                  key={stage.id}
                  stage={stage}
                  opportunities={getOpportunitiesForStage(stage.id)}
                  onDrop={handleDrop}
                  onEdit={handleEditOpportunity}
                  onAddActivity={handleAddActivity}
                  onViewHistory={handleViewHistory}
                  onSendProposal={handleSendProposal}
                  onMoveToNegotiation={handleMoveToNegotiation}
                  onCloseDeal={handleCloseDeal}
                  handleViewProfile={handleViewProfile}
                  loadingOpportunityId={loadingOpportunityId}
                />
              ))}
            </div>

            {/* Pipeline Instructions */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium mb-2">Pipeline Instructions</h4>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded" />
                        <span>Qualified</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded" />
                        <span>Proposal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded" />
                        <span>Negotiation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded" />
                        <span>Deal Won</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded" />
                        <span>Deal Lost</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Drag opportunities between columns to change their stage
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Opportunity Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Edit Opportunity -{" "}
                {selectedOpportunity?.lead_info?.company?.name}
              </DialogTitle>
              <DialogDescription>
                Update opportunity details and stage information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Stage</Label>
                  <Select
                    value={editForm.stage}
                    onValueChange={(value) =>
                      setEditForm({ ...editForm, stage: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map((stage) => (
                        <SelectItem key={stage.id} value={stage.id}>
                          {stage.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Probability (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={editForm.probability}
                    onChange={(e) =>
                      setEditForm({ ...editForm, probability: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Deal Value ($)</Label>
                  <Input
                    type="number"
                    value={editForm.value}
                    onChange={(e) =>
                      setEditForm({ ...editForm, value: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Expected Close Date</Label>
                  <Input
                    type="date"
                    value={editForm.estimated_close_date}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        estimated_close_date: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label>Next Steps</Label>
                <Input
                  value={editForm.next_steps}
                  onChange={(e) =>
                    setEditForm({ ...editForm, next_steps: e.target.value })
                  }
                  placeholder="Describe the next steps to take..."
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  placeholder="Add opportunity description..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                disabled={isSavingEdit}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={isSavingEdit}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isSavingEdit ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                {isSavingEdit ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* History Dialog */}
        <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <History className="h-5 w-5" />
                Opportunity History - {selectedOpportunity?.lead_info?.company?.name}
              </DialogTitle>
              <DialogDescription>
                Complete history and activity timeline for this opportunity
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] pr-4">
              {isLoadingHistory ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                        <div className="w-3 h-3 bg-gray-200 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-full"></div>
                        </div>
                        <div className="w-20 h-3 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : historyData.length > 0 ? (
                <div className="space-y-4">
                  {historyData.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {item.action || item.type || 'Activity'}
                          </h4>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {item.timestamp ? new Date(item.timestamp).toLocaleString() : 
                             item.created_at ? new Date(item.created_at).toLocaleString() :
                             item.date ? new Date(item.date).toLocaleString() : 'Unknown date'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          {item.description || item.details || item.note || 'No description available'}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {item.user && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {item.user}
                            </span>
                          )}
                          {item.entity_type && (
                            <span className="px-2 py-1 bg-gray-200 rounded-full">
                              {item.entity_type}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No History Available</h3>
                  <p className="text-gray-600">
                    No historical data found for this opportunity. Activities and changes will appear here once recorded.
                  </p>
                </div>
              )}
            </ScrollArea>
            <div className="flex justify-end pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowHistoryDialog(false)}
                className="border-gray-300"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Activity Dialog */}
        <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Add Activity - {selectedOpportunity?.lead_info?.company?.name}
              </DialogTitle>
              <DialogDescription>
                Record a new activity for this opportunity
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Activity Type</Label>
                  <Select
                    value={activityForm.type}
                    onValueChange={(value) =>
                      setActivityForm({ ...activityForm, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="call">Phone Call</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="demo">Demo</SelectItem>
                      <SelectItem value="proposal">Proposal</SelectItem>
                      <SelectItem value="negotiation">Negotiation</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={activityForm.date}
                    onChange={(e) =>
                      setActivityForm({ ...activityForm, date: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={activityForm.description}
                  onChange={(e) =>
                    setActivityForm({
                      ...activityForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Detailed description of what happened..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowActivityDialog(false)}
                disabled={isSavingActivity}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveActivity}
                disabled={isSavingActivity}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-md "
              >
                {isSavingActivity ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                {isSavingActivity ? "Adding..." : "Add Activity"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Send Proposal Dialog */}
        <Dialog open={showProposalDialog} onOpenChange={setShowProposalDialog}>
          <DialogContent className="max-w-5xl max-h-[95vh] p-0">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 rounded-t-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3 text-xl">
                    {proposalDialogMode === 'proposal' ? <FileText className="h-6 w-6" /> : <Handshake className="h-6 w-6" /> }
                    {proposalDialogMode === 'proposal' ? 'Send Proposal' : 'Negotiate'} - {selectedOpportunity?.lead_info?.company?.name}
                  </DialogTitle>
                  <DialogDescription className="mt-2">
                    {proposalDialogMode === 'proposal'
                      ? `Create and send a comprehensive proposal to advance this opportunity for ${selectedOpportunity?.lead_info?.contact?.first_name} ${selectedOpportunity?.lead_info?.contact?.last_name}`
                      : `Define and confirm negotiation terms for ${selectedOpportunity?.lead_info?.company?.name}'s corporate travel agreement.`
                    }
                  </DialogDescription>
                </DialogHeader>
              </div>

              {/* Email Info */}
              {/* <div className="px-6 py-4 bg-gray-50 border-b">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">To:</span>
                    <span className="ml-2">{selectedOpportunity?.lead_info?.contact?.email}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">From:</span>
                    <span className="ml-2">corporate@soar-ai.com</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Subject:</span>
                    <span className="ml-2">{proposalForm.title}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Delivery:</span>
                    <span className="ml-2 capitalize">
                      {proposalForm.deliveryMethod.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div> */}

              {/* Scrollable Content */}
              <ScrollArea className="flex-1 px-6 py-4">
                <div className="space-y-8">
                  {/* 1. Basic Proposal Information */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Proposal Information</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="proposalTitle" className="text-sm font-medium">Proposal Title *</Label>
                        <Input
                          id="proposalTitle"
                          value={proposalForm.title}
                          onChange={(e) =>
                            setProposalForm({ ...proposalForm, title: e.target.value })
                          }
                          placeholder="Enter proposal title..."
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="corporateContact" className="text-sm font-medium">Corporate Contact</Label>
                        <Input
                          id="corporateContact"
                          value={`${selectedOpportunity?.lead_info?.contact?.first_name || ''} ${selectedOpportunity?.lead_info?.contact?.last_name || ''}`}
                          readOnly
                          className="mt-1 bg-gray-50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="validityPeriod" className="text-sm font-medium">Validity Period</Label>
                        <Select
                          value={proposalForm.validityPeriod}
                          onValueChange={(value) =>
                            setProposalForm({
                              ...proposalForm,
                              validityPeriod: value,
                            })
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 days</SelectItem>
                            <SelectItem value="30">30 days</SelectItem>
                            <SelectItem value="45">45 days</SelectItem>
                            <SelectItem value="60">60 days</SelectItem>
                            <SelectItem value="90">90 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="deliveryMethod" className="text-sm font-medium">Delivery Method</Label>
                        <Select
                          value={proposalForm.deliveryMethod}
                          onValueChange={(value) =>
                            setProposalForm({
                              ...proposalForm,
                              deliveryMethod: value,
                            })
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="secure_portal">Secure Portal</SelectItem>
                            <SelectItem value="in_person">In-Person Presentation</SelectItem>
                            <SelectItem value="video_call">Video Call Presentation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="proposalDescription" className="text-sm font-medium">Proposal Description</Label>
                      <Textarea
                        id="proposalDescription"
                        value={proposalForm.description}
                        onChange={(e) =>
                          setProposalForm({
                            ...proposalForm,
                            description: e.target.value,
                          })
                        }
                        placeholder="Describe the proposed solution and key benefits..."
                        className="mt-1"
                        rows={4}
                      />
                    </div>
                  </div>

                  {/* 2. Volume Commitment (Corporate Side) */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart3 className="h-5 w-5 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Volume Commitment (Corporate Side)</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="travelFrequency" className="text-sm font-medium">Travel Frequency Commitment</Label>
                        <Select
                          value={negotiationForm.travelFrequency}
                          onValueChange={(value) => setNegotiationForm({...negotiationForm, travelFrequency: value})}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="annualVolume" className="text-sm font-medium">Booking Volume</Label>
                        <Input
                          id="annualVolume"
                          type="number"
                          value={negotiationForm.annualBookingVolume}
                          onChange={(e) => setNegotiationForm({...negotiationForm, annualBookingVolume: e.target.value})}
                          placeholder="Enter bookings volume..."
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="projectedSpend" className="text-sm font-medium">Projected Spend</Label>
                        <Input
                          id="projectedSpend"
                          type="number"
                          value={negotiationForm.projectedSpend}
                          onChange={(e) => setNegotiationForm({...negotiationForm, projectedSpend: e.target.value})}
                          placeholder="Enter projected spend..."
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="preferredRoutes" className="text-sm font-medium">Preferred Routes / Hubs</Label>
                        <Input
                          id="preferredRoutes"
                          value={negotiationForm.preferredRoutes}
                          onChange={(e) => setNegotiationForm({...negotiationForm, preferredRoutes: e.target.value})}
                          placeholder="e.g., JFK-LAX, SFO-CHI, NYC-LON..."
                          className="mt-1"
                        />
                      </div>

                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-3 block">Cabin Class Mix (%)</Label>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label className="text-xs text-gray-600">Domestic Economy</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={negotiationForm.domesticEconomy}
                              onChange={(e) => setNegotiationForm({...negotiationForm, domesticEconomy: parseInt(e.target.value) || 0})}
                              className="w-20"
                            />
                            <span className="text-sm">%</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-600">Business</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={negotiationForm.domesticBusiness}
                              onChange={(e) => setNegotiationForm({...negotiationForm, domesticBusiness: parseInt(e.target.value) || 0})}
                              className="w-20"
                            />
                            <span className="text-sm">%</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-600">International</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={negotiationForm.international}
                              onChange={(e) => setNegotiationForm({...negotiationForm, international: parseInt(e.target.value) || 0})}
                              className="w-20"
                            />
                            <span className="text-sm">%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Discount / Offer Terms (Airline Side) */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Gift className="h-5 w-5 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Discount / Offer Terms (Airline Side)</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="baseDiscount" className="text-sm font-medium">Base Discount Offered (%)</Label>
                        <Input
                          id="baseDiscount"
                          type="number"
                          min="0"
                          max="100"
                          value={negotiationForm.baseDiscount}
                          onChange={(e) => setNegotiationForm({...negotiationForm, baseDiscount: e.target.value})}
                          placeholder="Enter base discount percentage..."
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-sm font-medium">Route-Specific Discounts</Label>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={addRouteDiscount}
                          className="h-8 px-3"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Route
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {negotiationForm.routeDiscounts.map((route, index) => (
                          <div key={index} className="grid grid-cols-4 gap-3 items-end">
                            <div>
                              <Label className="text-xs text-gray-600">Route</Label>
                              <Input
                                placeholder="e.g., JFK-LAX"
                                value={route.route}
                                onChange={(e) => updateRouteDiscount(index, 'route', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-gray-600">Discount %</Label>
                              <Input
                                type="number"
                                placeholder="15"
                                value={route.discount}
                                onChange={(e) => updateRouteDiscount(index, 'discount', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-gray-600">Conditions</Label>
                              <Input
                                placeholder="Min 50 bookings/year"
                                value={route.conditions}
                                onChange={(e) => updateRouteDiscount(index, 'conditions', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => removeRouteDiscount(index)}
                              className="h-9 w-9 p-0"
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-3 block">Loyalty Program Benefits</Label>
                      <div className="grid grid-cols-3 gap-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={negotiationForm.loyaltyBenefits.extraMiles}
                            onChange={(e) => setNegotiationForm({
                              ...negotiationForm,
                              loyaltyBenefits: { ...negotiationForm.loyaltyBenefits, extraMiles: e.target.checked }
                            })}
                            className="rounded"
                          />
                          <span className="text-sm">Extra Miles</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={negotiationForm.loyaltyBenefits.priorityBoarding}
                            onChange={(e) => setNegotiationForm({
                              ...negotiationForm,
                              loyaltyBenefits: { ...negotiationForm.loyaltyBenefits, priorityBoarding: e.target.checked }
                            })}
                            className="rounded"
                          />
                          <span className="text-sm">Priority Boarding</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={negotiationForm.loyaltyBenefits.loungeAccess}
                            onChange={(e) => setNegotiationForm({
                              ...negotiationForm,
                              loyaltyBenefits: { ...negotiationForm.loyaltyBenefits, loungeAccess: e.target.checked }
                            })}
                            className="rounded"
                          />
                          <span className="text-sm">Lounge Access</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="volumeIncentives" className="text-sm font-medium">Incentives for Exceeding Volume</Label>
                      <Textarea
                        id="volumeIncentives"
                        value={negotiationForm.volumeIncentives}
                        onChange={(e) => setNegotiationForm({...negotiationForm, volumeIncentives: e.target.value})}
                        placeholder="Describe additional incentives for volume overachievement..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* 4. Financial & Contract Terms */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <DollarSign className="h-5 w-5 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Financial & Contract Terms</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm font-medium">Contract Duration</Label>
                        <div className="flex gap-4 mt-2">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="contractDuration"
                              value="12"
                              checked={negotiationForm.contractDuration === "12"}
                              onChange={(e) => setNegotiationForm({...negotiationForm, contractDuration: e.target.value})}
                            />
                            <span className="text-sm">12 months</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="contractDuration"
                              value="24"
                              checked={negotiationForm.contractDuration === "24"}
                              onChange={(e) => setNegotiationForm({...negotiationForm, contractDuration: e.target.value})}
                            />
                            <span className="text-sm">24 months</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="contractDuration"
                              value="36"
                              checked={negotiationForm.contractDuration === "36"}
                              onChange={(e) => setNegotiationForm({...negotiationForm, contractDuration: e.target.value})}
                            />
                            <span className="text-sm">36 months</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Auto-Renewal</Label>
                        <div className="flex items-center space-x-2 mt-2">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="autoRenewal"
                              checked={negotiationForm.autoRenewal === true}
                              onChange={() => setNegotiationForm({...negotiationForm, autoRenewal: true})}
                            />
                            <span className="text-sm">Yes</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="autoRenewal"
                              checked={negotiationForm.autoRenewal === false}
                              onChange={() => setNegotiationForm({...negotiationForm, autoRenewal: false})}
                            />
                            <span className="text-sm">No</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Payment Terms</Label>
                        <Select
                          value={negotiationForm.paymentTerms}
                          onValueChange={(value) => setNegotiationForm({...negotiationForm, paymentTerms: value})}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="net_30">Net 30</SelectItem>
                            <SelectItem value="net_45">Net 45</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Settlement Type</Label>
                        <Select
                          value={negotiationForm.settlementType}
                          onValueChange={(value) => setNegotiationForm({...negotiationForm, settlementType: value})}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bsp">BSP</SelectItem>
                            <SelectItem value="direct_billing">Direct Billing</SelectItem>
                            <SelectItem value="corporate_card">Corporate Card</SelectItem>
                            <SelectItem value="wallet">Wallet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* 5. Negotiation Strategy */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="h-5 w-5 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Negotiation Strategy</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="airlineConcessions" className="text-sm font-medium">Concessions by Airline</Label>
                        <Textarea
                          id="airlineConcessions"
                          value={negotiationForm.airlineConcessions}
                          onChange={(e) => setNegotiationForm({...negotiationForm, airlineConcessions: e.target.value})}
                          placeholder="List concessions offered by airline..."
                          className="mt-1"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="corporateCommitments" className="text-sm font-medium">Commitments by Corporate</Label>
                        <Textarea
                          id="corporateCommitments"
                          value={negotiationForm.corporateCommitments}
                          readOnly
                          className="mt-1 bg-gray-50"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="internalNotes" className="text-sm font-medium">Internal Notes</Label>
                        <Textarea
                          id="internalNotes"
                          value={negotiationForm.internalNotes}
                          onChange={(e) => setNegotiationForm({...negotiationForm, internalNotes: e.target.value})}
                          placeholder="Internal notes for airline team..."
                          className="mt-1"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Priority Level</Label>
                        <Select
                          value={negotiationForm.priorityLevel}
                          onValueChange={(value) => setNegotiationForm({...negotiationForm, priorityLevel: value})}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* 6. Approvals Workflow */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="h-5 w-5 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Approvals Workflow</h3>
                    </div>

                    <div className="space-y-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={negotiationForm.discountApprovalRequired}
                          onChange={(e) => setNegotiationForm({...negotiationForm, discountApprovalRequired: e.target.checked})}
                          className="rounded"
                        />
                        <span className="text-sm font-medium">Discount Approval Required?</span>
                        <span className="text-xs text-gray-500">(auto-checked if discount  threshold)</span>
                      </label>

                      <div>
                        <Label htmlFor="revenueManager" className="text-sm font-medium">Revenue Manager Assigned</Label>
                        <Select
                          value={negotiationForm.revenueManagerAssigned}
                          onValueChange={(value) => setNegotiationForm({...negotiationForm, revenueManagerAssigned: value})}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select revenue manager..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manager_1">Sarah Johnson</SelectItem>
                            <SelectItem value="manager_2">Mike Chen</SelectItem>
                            <SelectItem value="manager_3">Lisa Rodriguez</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Legal/Compliance Approval</Label>
                        <div className="flex items-center space-x-2 mt-2">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="legalApproval"
                              checked={negotiationForm.legalApprovalRequired === true}
                              onChange={() => setNegotiationForm({...negotiationForm, legalApprovalRequired: true})}
                            />
                            <span className="text-sm">Yes</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="legalApproval"
                              checked={negotiationForm.legalApprovalRequired === false}
                              onChange={() => setNegotiationForm({...negotiationForm, legalApprovalRequired: false})}
                            />
                            <span className="text-sm">No</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 7. Document Attachments */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Document Attachments</h3>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-3 block">Attach Supporting Documents</Label>
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                          isDragging
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        onDrop={handleFileDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                      >
                        {negotiationForm.attachedFile ? (
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-blue-600" />
                              <div className="text-left">
                                <p className="text-sm font-medium text-gray-900">
                                  {negotiationForm.attachedFile.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(
                                    negotiationForm.attachedFile.size /
                                    1024 /
                                    1024
                                  ).toFixed(2)}{" "}
                                  MB
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setNegotiationForm({...negotiationForm, attachedFile: null})}
                              className="h-8 w-8 p-0"
                            >
                              ×
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <div className="space-y-2">
                              <p className="text-sm text-gray-600">
                                Drag and drop your contract documents here, or click to browse
                              </p>
                              <p className="text-xs text-gray-500">
                                PDF, DOC, DOCX, XLS, XLSX files up to 10MB
                              </p>
                            </div>
                            <input
                              type="file"
                              id="negotiation-file-input"
                              className="hidden"
                              accept=".pdf,.doc,.docx,.xls,.xlsx"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setNegotiationForm({...negotiationForm, attachedFile: file});
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              className="mt-4"
                              onClick={() =>
                                document
                                  .getElementById("negotiation-file-input")
                                  ?.click()
                              }
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Browse Files
                            </Button>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Supported formats: Contract drafts, terms sheets, legal documents, compliance certificates
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              {/* Actions (sticky at bottom) */}
              <div className="border-t bg-white px-6 py-4">
                <div className="flex justify-between items-center">
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowProposalDialog(false)}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      Cancel
                    </Button>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handlePreviewEmail}
                      disabled={!proposalForm.title}
                      className="border-blue-300 text-blue-600 hover:bg-blue-50"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview Email
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleSaveDraft}
                      disabled={isDraftLoading}
                      className="border-gray-300"
                    >
                      {isDraftLoading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <FileText className="h-4 w-4 mr-2" />
                      )}
                      {isDraftLoading ? "Saving..." : "Save Draft"}
                    </Button>
                    <Button
                      onClick={() => {
                        if (proposalDialogMode === 'proposal') {
                          handleSaveProposal();
                        } else {
                          handleGenerateRevisedProposal();
                        }
                      }}
                      disabled={
                        (!proposalForm.title && proposalDialogMode === 'proposal') ||
                        (selectedOpportunity && loadingOpportunityId === selectedOpportunity.id)
                      }
                      className={
                        proposalDialogMode === 'proposal'
                          ? "bg-orange-500 hover:bg-orange-600 text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }
                    >
                      {selectedOpportunity && loadingOpportunityId === selectedOpportunity.id ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : proposalDialogMode === 'proposal' ? (
                        <Mail className="h-4 w-4 mr-2" />
                      ) : (
                        <FileText className="h-4 w-4 mr-2" />
                      )}
                      {selectedOpportunity && loadingOpportunityId === selectedOpportunity.id ? (
                        proposalDialogMode === 'proposal' ? "Sending..." : "Sending..."
                      ) : proposalDialogMode === 'proposal' ? (
                        "Send Proposal"
                      ) : (
                        "Send Revised Proposal"
                      )}
                    </Button>
                  </div>

                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Email Preview Dialog */}
        <Dialog open={showEmailPreview} onOpenChange={setShowEmailPreview}>
          <DialogContent className="max-w-4xl max-h-[95vh] p-0">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3 text-xl">
                    <Mail className="h-6 w-6" />
                    Email Preview - Proposal for {selectedOpportunity?.lead_info?.company?.name}
                  </DialogTitle>
                  <DialogDescription className="mt-2">
                    Preview how your proposal email will appear to the recipient
                  </DialogDescription>
                </DialogHeader>
              </div>

              {/* Email Info */}
              <div className="px-6 py-4 bg-gray-50 border-b">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">To:</span>
                    <span className="ml-2">{selectedOpportunity?.lead_info?.contact?.email}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">From:</span>
                    <span className="ml-2">corporate@soar-ai.com</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Subject:</span>
                    <span className="ml-2">{proposalForm.title}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Delivery:</span>
                    <span className="ml-2 capitalize">
                      {proposalForm.deliveryMethod.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Email Content */}
              <ScrollArea className="flex-1 p-6">
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: emailPreviewContent }}
                />
              </ScrollArea>

              {/* Actions */}
              <div className="border-t bg-white px-6 py-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    This is a preview of how your email will appear to the recipient
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowEmailPreview(false)}
                      className="border-gray-300"
                    >
                      Close Preview
                    </Button>
                    {/* <Button
                      onClick={() => {
                        setShowEmailPreview(false);
                        setShowProposalDialog(true); // Re-open proposal dialog
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Proposal
                    </Button> */}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DndProvider>
    </>

  );

}