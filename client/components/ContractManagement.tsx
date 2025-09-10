import { useState, useEffect, useCallback, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContractApi } from "../hooks/api/useContractApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { Checkbox } from "./ui/checkbox";
import {
  FileText,
  Plus,
  Eye,
  Edit,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Send,
  PenTool,
  Calendar,
  DollarSign,
  User,
  Filter,
  Search,
  Shield,
  MessageSquare,
  Paperclip,
  Target,
  Brain,
  TrendingUp,
  TrendingDown,
  Zap,
  RefreshCw,
  XCircle,
  CheckCircle2,
  Info,
  Lightbulb,
  BarChart3,
  Users,
  Star,
  Activity,
  ArrowRight,
  Package,
  Tag,
  Percent,
  FileDown,
  Save,
  ExternalLink,
} from "lucide-react";

const mockOffers = [
  {
    id: "OFF-001",
    title: "Premium Business Class Package",
    corporate: "TechCorp International",
    type: "Route-based",
    status: "Active",
    discount: 25,
    validFrom: "2024-01-15",
    validTo: "2024-12-31",
    appliedDiscounts: ["DISC-001", "DISC-003"],
    promoCodes: ["PROMO-001"],
    description:
      "Comprehensive business class travel package for TechCorp International with flexible routing options and enhanced service features.",
  },
  {
    id: "OFF-002",
    title: "Economy Plus Group Rates",
    corporate: "Global Manufacturing Ltd",
    type: "Volume-based",
    status: "Active",
    discount: 15,
    validFrom: "2024-02-01",
    validTo: "2024-11-30",
    appliedDiscounts: ["DISC-002"],
    promoCodes: ["PROMO-002"],
    description:
      "Volume-based pricing structure for Global Manufacturing with guaranteed group discounts and flexible travel dates.",
  },
  {
    id: "OFF-003",
    title: "Financial Services Executive",
    corporate: "Sunrise Financial Services",
    type: "Flexible",
    status: "Draft",
    discount: 30,
    validFrom: "2024-03-01",
    validTo: "2024-12-31",
    appliedDiscounts: ["DISC-001", "DISC-004"],
    promoCodes: ["PROMO-003"],
    description:
      "Premium first-class travel package for Sunrise Financial executives with maximum flexibility and luxury amenities.",
  },
  {
    id: "OFF-004",
    title: "Regional Travel Package",
    corporate: "Regional Operations Corp",
    type: "Route-based",
    status: "Active",
    discount: 18,
    validFrom: "2024-02-15",
    validTo: "2024-11-15",
    appliedDiscounts: ["DISC-002"],
    promoCodes: ["PROMO-001"],
    description:
      "Cost-effective regional travel solution with optimized routes and competitive pricing.",
  },
];

// Mock discounts data
const mockDiscounts = [
  {
    id: "DISC-001",
    name: "Early Bird Discount",
    type: "Percentage",
    value: 15,
    description: "Discount for bookings made 60 days in advance",
  },
  {
    id: "DISC-002",
    name: "Volume Discount",
    type: "Percentage",
    value: 20,
    description: "Bulk booking discount for 10+ passengers",
  },
  {
    id: "DISC-003",
    name: "Student Discount",
    type: "Fixed",
    value: 100,
    description: "Fixed discount for verified students",
  },
  {
    id: "DISC-004",
    name: "Corporate Premium Discount",
    type: "Percentage",
    value: 25,
    description: "Premium discount for enterprise clients",
  },
];

// Mock promo codes data
const mockPromoCodes = [
  {
    id: "PROMO-001",
    code: "SAVE2024",
    name: "New Year Promotion",
    type: "Percentage",
    value: 10,
    description: "New Year special offer for all bookings",
  },
  {
    id: "PROMO-002",
    code: "BIZTRAVEL",
    name: "Business Travel Special",
    type: "Fixed",
    value: 75,
    description: "Special promotion for business travelers",
  },
  {
    id: "PROMO-003",
    code: "SUMMER20",
    name: "Summer Vacation Deal",
    type: "Percentage",
    value: 20,
    description: "Summer holiday discount for leisure travel",
  },
];

const contractTemplates = [
  {
    id: 1,
    name: "Master Service Agreement",
    category: "Primary",
    description: "Comprehensive service agreement template",
  },
  {
    id: 2,
    name: "Service Level Agreement",
    category: "Performance",
    description: "SLA template with KPIs and metrics",
  },
  {
    id: 3,
    name: "Non-Disclosure Agreement",
    category: "Legal",
    description: "Standard NDA template",
  },
  {
    id: 4,
    name: "Partnership Agreement",
    category: "Strategic",
    description: "Strategic partnership template",
  },
  {
    id: 5,
    name: "Amendment Template",
    category: "Modification",
    description: "Contract modification template",
  },
];

// AI Recommendations based on contract analysis
const aiRecommendations = {
  "CTR-2024-001": {
    recommendation: "Renegotiate",
    confidence: 78,
    reasoning: [
      "High breach count (2) indicates performance issues",
      "SLA compliance at 85% - below industry standard",
      "Strong market position allows for better terms negotiation",
      "Cost efficiency at 92% demonstrates value but needs performance improvement",
    ],
    actions: [
      "Schedule performance review meeting within 2 weeks",
      "Renegotiate SLA terms with stricter penalties",
      "Implement monthly performance monitoring",
      "Consider 6-month probationary renewal",
    ],
    expectedImpact: "Improved service quality, reduced breach risk by 60%",
    timeline: "30-45 days",
    riskLevel: "Medium",
  },
  "CTR-2024-002": {
    recommendation: "Renew",
    confidence: 92,
    reasoning: [
      "Excellent performance score (88%) and SLA compliance (96%)",
      "High customer satisfaction (4.3/5) and zero breaches",
      "Strong financial health and technical capabilities",
      "Cost-effective solution with competitive positioning",
    ],
    actions: [
      "Initiate renewal discussions 60 days before expiration",
      "Negotiate volume discounts for extended term",
      "Include performance bonuses for sustained excellence",
      "Consider expanding scope of services",
    ],
    expectedImpact: "Continued high performance, potential 10-15% cost savings",
    timeline: "15-20 days",
    riskLevel: "Low",
  },
  "CTR-2024-003": {
    recommendation: "Renew",
    confidence: 95,
    reasoning: [
      "Outstanding performance metrics across all areas",
      "Perfect compliance record with no breaches",
      "Premium market position with excellent relationship score",
      "High customer satisfaction (4.7/5) and technical excellence",
    ],
    actions: [
      "Fast-track renewal process due to excellent performance",
      "Negotiate multi-year agreement with favorable terms",
      "Explore strategic partnership opportunities",
      "Consider preferred vendor status",
    ],
    expectedImpact:
      "Long-term strategic partnership, enhanced service delivery",
    timeline: "10-15 days",
    riskLevel: "Very Low",
  },
  "CTR-2024-004": {
    recommendation: "Terminate",
    confidence: 89,
    reasoning: [
      "Poor performance score (45%) with multiple unresolved breaches",
      "Low SLA compliance (62%) and customer satisfaction (2.8/5)",
      "Concerning financial health and declining market position",
      "Multiple alternative vendors available with better track records",
    ],
    actions: [
      "Issue formal termination notice within 30 days",
      "Begin vendor transition planning immediately",
      "Document all breach instances for legal protection",
      "Initiate procurement process for replacement vendor",
    ],
    expectedImpact: "Risk reduction by 80%, improved service quality expected",
    timeline: "60-90 days transition",
    riskLevel: "High",
  },
};

interface ContractManagementProps {
  initialFilters?: any;
}

export function ContractManagement({
  initialFilters,
}: ContractManagementProps) {
  // Helper function to map contract types to backend values
  const mapContractType = (frontendType: string) => {
    const typeMapping = {
      "Master Service Agreement": "master_agreement",
      "Service Level Agreement": "service_agreement",
      "Non-Disclosure Agreement": "nda",
      "Partnership Agreement": "other",
      "Amendment Template": "other",
      "Corporate Travel Agreement": "corporate_travel",
      "Vendor Contract": "vendor_contract",
    };
    return typeMapping[frontendType] || "corporate_travel";
  };

  // Helper function to get payment terms in days
  const getPaymentTermsDays = (paymentTerms: string) => {
    const termsMapping = {
      net_15: 15,
      net_30: 30,
      net_45: 45,
      net_60: 60,
      "Net 15": 15,
      "Net 30": 30,
      "Net 45": 45,
      "Net 60": 60,
    };
    return termsMapping[paymentTerms] || 30;
  };
  const {
    getContracts,
    createContract,
    updateContract,
    uploadDocument,
    getContractDocuments,
    downloadDocument,
    addComment,
    getClosedWonOpportunities,
  } = useContractApi(); // Use createContract from hook

  // Helper function to get display value for select components
  const getSelectDisplayValue = (value: string) => {
    return value === "" ? "all" : value;
  };
  const [selectedContract, setSelectedContract] = useState(null);
  const [isCreatingContract, setIsCreatingContract] = useState(false);
  const [showContractDetail, setShowContractDetail] = useState(false);
  const [showAIRecommendation, setShowAIRecommendation] = useState(false);
  const [showOfferDetail, setShowOfferDetail] = useState(false);
  const [showChangeOffer, setShowChangeOffer] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState("summary");
  const [isEditingContract, setIsEditingContract] = useState(false);
  const [editContract, setEditContract] = useState({
    id: "",
    vendor: "",
    client: "",
    type: "",
    value: "",
    startDate: "",
    endDate: "",
    parties: "",
    milestones: "",
    terms: "",
    attachedOffer: "none",
    paymentTerms: "net_30",
    vendorEmail: "",
    slaRequirements: "",
    autoRenewal: false,
    performanceBonus: false,
    exclusivity: false,
    customClauses: "",
  });
  const [filters, setFilters] = useState({
    status: "",
    client: "",
    riskLevel: "",
    dateRange: "",
    recommendation: "",
    ...initialFilters,
  });
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // State for error messages
  const [availableVendors, setAvailableVendors] = useState<string[]>([]); // Dynamic vendor names from closed won opportunities
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [downloadingDocument, setDownloadingDocument] = useState(false);
  const [documentUploadError, setDocumentUploadError] = useState<string | null>(
    null
  );
  const isFetchingRef = useRef(false); // Ref to track if fetch is in progress
  const hasInitializedRef = useRef(false); // Ref to track if initial fetch happened
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<{
    name: string;
    url: string;
    type: string;
  } | null>(null);
  const [showCommentModal, setShowCommentModal] = useState(false); // State for the comment modal
  const [newComment, setNewComment] = useState(""); // State for the new comment input
  const [addingComment, setAddingComment] = useState(false); // State for tracking comment submission

  // Fetch vendor names from closed won opportunities
  const fetchVendorNames = useCallback(async () => {
    try {
      console.log("Fetching vendor names from closed won opportunities...");
      const result = await getClosedWonOpportunities();

      if (
        result.success &&
        Array.isArray(result.data) &&
        result.data.length > 0
      ) {
        setAvailableVendors(result.data);
        console.log("✓ Vendor names loaded:", result.data.length, "vendors");

        // Show info message if using fallback data
        if (result.error) {
          console.info("Note:", result.error);
        }
      } else {
        console.warn("No vendor names returned from API, using default list");
        // Fallback to some default vendors if API fails
        const defaultVendors = [
          "Global Travel Solutions",
          "Corporate Journey Ltd",
          "Elite Business Travel",
          "Premier Voyage Group",
          "Business Travel Partners",
          "Executive Travel Services",
        ];
        setAvailableVendors(defaultVendors);
      }
    } catch (error) {
      console.error("Error fetching vendor names:", error);
      // Fallback to default vendors
      const defaultVendors = [
        "Global Travel Solutions",
        "Corporate Journey Ltd",
        "Elite Business Travel",
        "Premier Voyage Group",
        "Business Travel Partners",
        "Executive Travel Services",
      ];
      setAvailableVendors(defaultVendors);
    }
  }, [getClosedWonOpportunities]);

  // Fetch contracts from API
  const fetchContracts = useCallback(
    async (forceRefresh = false) => {
      // Prevent multiple concurrent calls
      if (isFetchingRef.current) {
        console.log("Fetch already in progress, skipping...");
        return;
      }

      // Don't fetch again if already initialized unless forced
      if (!forceRefresh && hasInitializedRef.current) {
        console.log("Already initialized, skipping fetch...");
        return;
      }

      isFetchingRef.current = true;
      setIsLoading(true);
      setError(null); // Clear previous errors

      try {
        console.log("Starting contract fetch...");
        const result = await getContracts();
        console.log("Fetched contracts result:", result);
        console.log("Result success:", result.success);
        console.log("Result data type:", typeof result.data);
        console.log("Result data is array:", Array.isArray(result.data));
        console.log("Result data length:", result.data?.length);
        console.log("Full result data:", result);

        if (result.success) {
          // The data should already be processed correctly by the API hook
          let contractsData = [];

          if (Array.isArray(result.data)) {
            contractsData = result.data;
            console.log(
              "✓ Using result.data directly as array:",
              contractsData.length,
              "contracts"
            );
            console.log("✓ Sample contract data:", contractsData[0]);
          } else {
            console.warn(
              "❌ Expected array but got:",
              typeof result.data,
              result.data
            );
            contractsData = [];
          }

          console.log(
            "✓ Setting contracts state with:",
            contractsData.length,
            "contracts"
          );
          setContracts(contractsData);
          setError(null); // Clear error on success

          if (!forceRefresh) {
            hasInitializedRef.current = true; // Mark as initialized only for initial fetch
          }

          console.log("✓ Contract fetch completed successfully");
        } else {
          console.error("❌ API returned error:", result.error);
          setError(result.error || "Failed to fetch contracts");
          // Don't clear existing contracts if this is a refresh attempt
          if (!forceRefresh) {
            setContracts([]);
          }
        }
      } catch (error) {
        console.error("❌ Exception during contract fetch:", error);
        setError("Failed to fetch contracts");
        // Don't clear existing contracts if this is a refresh attempt
        if (!forceRefresh) {
          setContracts([]);
        }
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false; // Reset fetching flag
        console.log("Contract fetch process completed");
      }
    },
    [] // Remove getContracts from dependencies to prevent infinite loops
  );

  useEffect(() => {
    if (!hasInitializedRef.current && !isFetchingRef.current) {
      fetchContracts();
      fetchVendorNames(); // Also fetch vendor names on component mount
    }
  }, []); // Empty dependency array to run only once on mount

  // Apply filters to the contracts data
  const contractsToDisplay = contracts.filter((contract) => {
    // Only apply filters if they are actually set (not empty string)
    const statusMatch =
      filters.status && filters.status !== ""
        ? contract.status === filters.status
        : true;
    const clientMatch =
      filters.client && filters.client !== ""
        ? contract.client === filters.client
        : true;
    const riskMatch =
      filters.riskLevel && filters.riskLevel !== ""
        ? contract.breachRisk === filters.riskLevel
        : true;

    let dateMatch = true;
    if (filters.dateRange && filters.dateRange !== "") {
      const days = getDaysUntilExpiration(contract.endDate);
      switch (filters.dateRange) {
        case "expired":
          dateMatch = days < 0;
          break;
        case "critical":
          dateMatch = days >= 0 && days <= 30;
          break;
        case "warning":
          dateMatch = days > 30 && days <= 60;
          break;
        case "caution":
          dateMatch = days > 60 && days <= 90;
          break;
        default:
          dateMatch = true;
      }
    }

    const recommendationMatch =
      filters.recommendation && filters.recommendation !== ""
        ? aiRecommendations[contract.id]?.recommendation.toLowerCase() ===
          filters.recommendation.toLowerCase()
        : true;

    return (
      statusMatch &&
      clientMatch &&
      riskMatch &&
      dateMatch &&
      recommendationMatch
    );
  });

  const [newContract, setNewContract] = useState({
    vendor: "",
    client: "",
    type: "",
    value: "",
    startDate: "",
    endDate: "",
    parties: "",
    milestones: "",
    terms: "",
    attachedOffer: "none",
    paymentTerms: "net_30", // Default payment terms
    vendorEmail: "",
    slaRequirements: "",
    autoRenewal: false,
    performanceBonus: false,
    exclusivity: false,
    customClauses: "",
  });

  // Helper functions
  const getDaysUntilExpiration = (endDate: string) => {
    const today = new Date();
    const expiry = new Date(endDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpirationStatus = (endDate: string) => {
    const days = getDaysUntilExpiration(endDate);
    if (days < 0)
      return { status: "expired", color: "destructive", label: "Expired" };
    if (days <= 30)
      return {
        status: "critical",
        color: "destructive",
        label: `${days} days left`,
      };
    if (days <= 60)
      return {
        status: "warning",
        color: "secondary",
        label: `${days} days left`,
      };
    if (days <= 90)
      return {
        status: "caution",
        color: "outline",
        label: `${days} days left`,
      };
    return { status: "normal", color: "default", label: "Active" };
  };

  const getRecommendationColor = (recommendation?: string) => {
    if (!recommendation) return "outline";
    switch (recommendation) {
      case "Renew":
        return "default";
      case "Renegotiate":
        return "secondary";
      case "Terminate":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getRecommendationIcon = (recommendation?: string) => {
    if (!recommendation) return Info;
    switch (recommendation) {
      case "Renew":
        return CheckCircle2;
      case "Renegotiate":
        return RefreshCw;
      case "Terminate":
        return XCircle;
      default:
        return Info;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
      case "Pending Signature":
        return "secondary";
      case "Draft":
        return "outline";
      case "At Risk":
        return "destructive";
      case "Expired":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return CheckCircle;
      case "Pending Signature":
        return Clock;
      case "Draft":
        return Edit;
      case "At Risk":
        return AlertTriangle;
      case "Expired":
        return AlertTriangle;
      default:
        return FileText;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High":
        return "destructive";
      case "Medium":
        return "secondary";
      case "Low":
        return "default";
      default:
        return "outline";
    }
  };

  const getMilestoneStatus = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "in-progress":
        return "secondary";
      case "pending":
        return "outline";
      case "upcoming":
        return "outline";
      case "overdue":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Handler for opening edit contract dialog
  const handleEditContract = (contract) => {
    setEditContract({
      id: contract.id,
      vendor: contract.vendor,
      client: contract.client,
      type: contract.type,
      value: contract.value.toString(),
      startDate: contract.startDate,
      endDate: contract.endDate,
      parties: contract.parties.join(", "),
      milestones: contract.milestones
        ? contract.milestones.map((m) => `${m.name}: ${m.date}`).join("\n")
        : "",
      terms: contract.terms || "",
      attachedOffer: contract.attachedOffer?.id || "none",
      paymentTerms: "net_30", // Default since not in current data structure
      vendorEmail: "", // Default since not in current data structure
      slaRequirements: "", // Default since not in current data structure
      autoRenewal: false,
      performanceBonus: false,
      exclusivity: false,
      customClauses: "",
    });
    setIsEditingContract(true);
  };

  // Updated handleCreateContract function
  const handleCreateContract = async () => {
    // Validate required fields
    if (!newContract.vendor || !newContract.type || !newContract.value) {
      toast.error("Please fill in all required fields (Vendor, Type, Value)");
      return;
    }

    setIsLoading(true);

    // Prepare contract data for API - matching backend expectations
    const contractData = {
      company_name: newContract.vendor,
      company_email: newContract.vendorEmail || "",
      title: `${newContract.type} - ${newContract.vendor}`,
      contract_type: mapContractType(newContract.type),
      client_department: newContract.client,
      value: parseFloat(newContract.value) || 0,
      start_date: newContract.startDate,
      end_date: newContract.endDate,
      terms:
        newContract.terms ||
        "Standard corporate travel agreement terms and conditions",
      sla_requirements: newContract.slaRequirements || "",
      payment_terms_days: getPaymentTermsDays(newContract.paymentTerms),
      auto_renewal: newContract.autoRenewal || false,
      performance_bonus: newContract.performanceBonus || false,
      exclusivity: newContract.exclusivity || false,
      custom_clauses: newContract.customClauses || newContract.milestones || "",
    };

    console.log("Creating contract with data:", contractData);

    try {
      // Use the imported createContract function
      const result = await createContract(contractData);

      if (result.success) {
        console.log("Contract created successfully:", result.data);

        // Close dialog and reset form first
        setIsCreatingContract(false);
        setNewContract({
          vendor: "",
          client: "",
          type: "",
          value: "",
          startDate: "",
          endDate: "",
          parties: "",
          milestones: "",
          terms: "",
          attachedOffer: "none",
          paymentTerms: "net_30",
          vendorEmail: "",
          slaRequirements: "",
          autoRenewal: false,
          performanceBonus: false,
          exclusivity: false,
          customClauses: "",
        });

        toast.success("Contract created successfully!");

        // Immediately refresh the contracts list from server
        await fetchContracts(true);
      } else {
        console.error("Failed to create contract:", result.error);
        toast.error(
          `Failed to create contract: ${result.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error creating contract:", error);
      toast.error("Failed to create contract. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for updating existing contract
  const handleUpdateContract = async () => {
    // Validate required fields
    if (!editContract.vendor || !editContract.type || !editContract.value) {
      toast.error("Please fill in all required fields (Vendor, Type, Value)");
      return;
    }

    setIsLoading(true);

    // Prepare contract data for API - matching backend expectations
    const contractData = {
      company_name: editContract.vendor,
      company_email: editContract.vendorEmail || "",
      title: `${editContract.type} - ${editContract.vendor}`,
      contract_type: mapContractType(editContract.type),
      client_department: editContract.client,
      value: parseFloat(editContract.value) || 0,
      start_date: editContract.startDate,
      end_date: editContract.endDate,
      terms:
        editContract.terms ||
        "Standard corporate travel agreement terms and conditions",
      sla_requirements: editContract.slaRequirements || "",
      payment_terms_days: getPaymentTermsDays(editContract.paymentTerms),
      auto_renewal: editContract.autoRenewal || false,
      performance_bonus: editContract.performanceBonus || false,
      exclusivity: editContract.exclusivity || false,
      custom_clauses:
        editContract.customClauses || editContract.milestones || "",
    };

    console.log("Updating contract with data:", contractData);

    try {
      // Use the updateContract function from the hook
      const result = await updateContract(editContract.id, contractData);

      if (result.success) {
        // Refresh contracts list
        await fetchContracts(true); // Force refresh

        // Close dialog and reset form
        setIsEditingContract(false);
        setEditContract({
          id: "",
          vendor: "",
          client: "",
          type: "",
          value: "",
          startDate: "",
          endDate: "",
          parties: "",
          milestones: "",
          terms: "",
          attachedOffer: "none",
          paymentTerms: "net_30",
          vendorEmail: "",
          slaRequirements: "",
          autoRenewal: false,
          performanceBonus: false,
          exclusivity: false,
          customClauses: "",
        });

        toast.success("Contract updated successfully!");
      } else {
        console.error("Failed to update contract:", result.error);
        toast.error(
          `Failed to update contract: ${result.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error updating contract:", error);
      toast.error("Failed to update contract. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewOffer = (contract) => {
    if (contract.attachedOffer) {
      setSelectedContract(contract);
      setSelectedOffer(contract.attachedOffer);
      setShowOfferDetail(true);
    }
  };

  const handleChangeOffer = (contract) => {
    setSelectedContract(contract);
    setSelectedOffer(contract.attachedOffer); // Pre-select current offer
    setShowChangeOffer(true);
  };

  const renderPromoCodesAndDiscounts = (
    appliedDiscounts = [],
    promoCodes = []
  ) => {
    return (
      <div className="flex flex-wrap gap-1">
        {appliedDiscounts.map((discountId) => {
          const discount = mockDiscounts.find((d) => d.id === discountId);
          return discount ? (
            <Badge key={discountId} variant="secondary" className="text-xs">
              <Percent className="h-3 w-3 mr-1" />
              {discount.name}
            </Badge>
          ) : null;
        })}
        {promoCodes.map((promoId) => {
          const promo = mockPromoCodes.find((p) => p.id === promoId);
          return promo ? (
            <Badge key={promoId} variant="outline" className="text-xs">
              <Tag className="h-3 w-3 mr-1" />
              {promo.code}
            </Badge>
          ) : null;
        })}
      </div>
    );
  };

  const loadContractDocuments = async (contractId: string) => {
    try {
      const result = await getContractDocuments(contractId);
      console.log(result.data);
      if (result.success) {
        return result.data || [];
      } else {
        console.error("Failed to load documents:", result.error);
        return [];
      }
    } catch (error) {
      console.error("Error loading documents:", error);
      return [];
    }
  };

  const handleViewContract = async (contract) => {
    // Set the contract and open modal immediately
    setSelectedContract(contract);
    setActiveDetailTab("summary");
    setShowContractDetail(true);

    // Load documents asynchronously after modal is open
    const documents = await loadContractDocuments(contract.id);

    // Update contract with loaded documents
    const contractWithDocuments = {
      ...contract,
      attachments: documents,
    };

    setSelectedContract(contractWithDocuments);
  };

  const handleShowAIRecommendation = (contract) => {
    setSelectedContract(contract);
    setShowAIRecommendation(true);
  };

  const handleDocumentUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !selectedContract) return;

    // Reset previous errors
    setDocumentUploadError(null);
    setUploadingDocument(true);

    try {
      // Use the API hook to upload the document
      const result = await uploadDocument(selectedContract.id, file);

      if (result.success) {
        console.log("Document upload response:", result);

        // The document data is in result.data.document
        const newAttachment = result.data?.document || {
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          uploadDate: new Date().toISOString().split("T")[0],
          type: getDocumentType(file.name),
          document_id:
            result.data?.document?.document_id || `temp-${Date.now()}`, // Ensure document_id is available
        };

        // Reload documents from server to ensure consistency
        const updatedDocuments = await loadContractDocuments(
          selectedContract.id
        );

        // Update the selected contract with fresh documents from server
        const contractWithUpdatedDocuments = {
          ...selectedContract,
          attachments: updatedDocuments,
        };

        setSelectedContract(contractWithUpdatedDocuments);

        // Update the contract in the contracts list
        setContracts((prevContracts) =>
          prevContracts.map((contract) =>
            contract.id === selectedContract.id
              ? { ...contract, attachments: updatedDocuments }
              : contract
          )
        );

        // Clear the input
        event.target.value = "";

        console.log(`Document ${file.name} uploaded successfully to server`);
      } else {
        setDocumentUploadError(result.error || "Failed to upload document");
        event.target.value = ""; // Clear the input on error
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      setDocumentUploadError("Failed to upload document. Please try again.");
      event.target.value = ""; // Clear the input on error
    } finally {
      setUploadingDocument(false);
    }
  };

  const getDocumentType = (fileName: string) => {
    const extension = fileName
      .toLowerCase()
      .substring(fileName.lastIndexOf("."));
    switch (extension) {
      case ".pdf":
        return "PDF Document";
      case ".doc":
      case ".docx":
        return "Word Document";
      case ".xls":
      case ".xlsx":
        return "Excel Spreadsheet";
      case ".txt":
        return "Text Document";
      case ".rtf":
        return "Rich Text Document";
      default:
        return "Document";
    }
  };

  // Function to handle document download
  const handleDocumentDownload = async (
    documentId: string,
    documentName: string
  ) => {
    try {
      console.log(
        `Starting download for document ${documentId}: ${documentName}`
      );

      // Clear any previous errors
      setDocumentUploadError(null);

      // Pass the contract ID if we have a selected contract
      const contractId = selectedContract?.id;

      if (!contractId) {
        throw new Error(
          "No contract selected. Please select a contract first."
        );
      }

      console.log(`Using contract ID: ${contractId} for document download`);

      // Show loading state in UI
      setDownloadingDocument(true);

      const url = await downloadDocument(documentId, contractId);
      if (url) {
        // Create a temporary link element for downloading
        const link = document.createElement("a");
        link.href = url;
        link.download = documentName || "document"; // Use provided name or fallback
        link.style.display = "none"; // Hide the link
        document.body.appendChild(link);

        // Trigger the download
        link.click();

        // Clean up
        document.body.removeChild(link);

        // Clean up the blob URL after a short delay
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 1000);

        console.log(`Document ${documentName} downloaded successfully`);

        // Show success message to user (optional - could be removed if too intrusive)
        // alert(`Document "${documentName}" has been downloaded successfully.`);
      } else {
        console.error(
          `Failed to get download URL for document ${documentName}`
        );
        throw new Error("Failed to generate download URL");
      }
    } catch (error) {
      console.error(`Error downloading document ${documentName}:`, error);

      // Provide more specific error messages based on error type
      let errorMessage = `Failed to download "${documentName}".`;

      if (error.message) {
        if (error.message.includes("No data received from server")) {
          errorMessage +=
            " The document file may be missing or corrupted on the server.";
        } else if (error.message.includes("Document not found on server")) {
          errorMessage += " The document was not found on the server.";
        } else if (error.message.includes("Access denied")) {
          errorMessage +=
            " You do not have permission to download this document.";
        } else if (error.message.includes("Server error")) {
          errorMessage += " There was a server error processing your request.";
        } else if (error.message.includes("Network error")) {
          errorMessage +=
            " Please check your internet connection and try again.";
        } else if (error.message.includes("Request timed out")) {
          errorMessage +=
            " The download request timed out. The file may be too large.";
        } else {
          errorMessage += ` Error: ${error.message}`;
        }
      }

      errorMessage +=
        " Please try again or contact support if the issue persists.";

      // Set document error state for UI feedback
      setDocumentUploadError(errorMessage);

      // Clear error after 10 seconds
      setTimeout(() => {
        setDocumentUploadError(null);
      }, 10000);
    } finally {
      // Always clear loading state
      setDownloadingDocument(false);
    }
  };

  // Function to handle document view - uses embedded viewer
  const handleDocumentView = async (documentId: string, fileName: string) => {
    try {
      console.log(
        `Viewing document ${documentId} for contract ${selectedContract?.id}`
      );

      if (!selectedContract?.id) {
        throw new Error("No contract selected");
      }

      // Create the direct URL to the document endpoint
      const baseUrl =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
      const documentUrl = `${baseUrl}/api/contracts/${selectedContract.id}/download_document/?document_id=${documentId}`;

      console.log(`Setting up document viewer for: ${documentUrl}`);

      // Set up the document viewer modal
      setViewingDocument({
        name: fileName,
        url: documentUrl,
        type: getDocumentType(fileName),
      });
      setShowDocumentViewer(true);
    } catch (error) {
      console.error(`Error opening document ${fileName} for viewing:`, error);
      setDocumentUploadError(
        `Failed to open document: ${error.message || "Unknown error"}`
      );
    }
  };

  const handleDownloadContract = (contract) => {
    // Helper function to escape CSV values
    const escapeCSV = (value) => {
      if (value === null || value === undefined) return "";
      const str = String(value);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    // Get AI recommendation data
    const aiRec = aiRecommendations[contract.id];

    // Create CSV headers and data
    const csvHeaders = [
      "Contract ID",
      "Vendor",
      "Client",
      "Type",
      "Value",
      "Status",
      "Start Date",
      "End Date",
      "Signed Date",
      "Parties",
      "Terms",
      "Description",
      "Performance Score",
      "SLA Compliance",
      "Customer Satisfaction",
      "Cost Efficiency",
      "Breach Count",
      "AI Recommendation",
      "AI Confidence",
      "Risk Level",
      "Market Position",
      "Financial Health",
      "Technical Capability",
      "Relationship Score",
      "Attached Offer ID",
      "Attached Offer Title",
      "Attached Offer Discount",
      "Export Date",
      "Exported By",
    ];

    const csvData = [
      escapeCSV(contract.id),
      escapeCSV(contract.vendor),
      escapeCSV(contract.client),
      escapeCSV(contract.type),
      escapeCSV(contract.value),
      escapeCSV(contract.status),
      escapeCSV(contract.startDate),
      escapeCSV(contract.endDate),
      escapeCSV(contract.signedDate || ""),
      escapeCSV(contract.parties ? contract.parties.join("; ") : ""),
      escapeCSV(contract.terms || ""),
      escapeCSV(contract.description || ""),
      escapeCSV(contract.performanceScore),
      escapeCSV(contract.slaCompliance),
      escapeCSV(contract.customerSatisfaction),
      escapeCSV(contract.costEfficiency),
      escapeCSV(contract.breachCount),
      escapeCSV(aiRec?.recommendation || ""),
      escapeCSV(aiRec?.confidence || ""),
      escapeCSV(aiRec?.riskLevel || ""),
      escapeCSV(contract.marketPosition || ""),
      escapeCSV(contract.financialHealth || ""),
      escapeCSV(contract.technicalCapability || ""),
      escapeCSV(contract.relationshipScore || ""),
      escapeCSV(contract.attachedOffer?.id || ""),
      escapeCSV(contract.attachedOffer?.title || ""),
      escapeCSV(contract.attachedOffer?.discount || ""),
      escapeCSV(new Date().toISOString().split("T")[0]),
      escapeCSV("Current User"),
    ];

    // Combine headers and data
    const csvContent = [csvHeaders.join(","), csvData.join(",")].join("\n");

    // Create and download file
    const dataBlob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${contract.id}_Contract_Details_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Show success message
    console.log(`Contract ${contract.id} downloaded successfully as CSV`);
  };

  const getExpiringContracts = () => {
    return contracts.filter((contract) => {
      const days = getDaysUntilExpiration(contract.endDate);
      return days <= 90 && days >= 0;
    });
  };

  // Handler for adding a new comment
  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedContract) return;

    setAddingComment(true);
    try {
      const result = await addComment(selectedContract.id, newComment);
      if (result.success) {
        // Update the contract's comments in the state
        const updatedContract = {
          ...selectedContract,
          comments: [
            ...(selectedContract.comments || []),
            {
              id: result.data.comment?.id || Date.now(), // Use returned comment ID or fallback
              author: result.data.comment?.author || "Current User", // Use returned author or fallback
              date:
                result.data.comment?.date ||
                new Date().toISOString().split("T")[0], // Use returned date or fallback
              content: newComment,
            },
          ],
        };
        setSelectedContract(updatedContract);

        // Update the contract in the main contracts list
        setContracts((prevContracts) =>
          prevContracts.map((contract) =>
            contract.id === selectedContract.id ? updatedContract : contract
          )
        );

        toast.success("Comment added successfully!");
        setNewComment(""); // Clear the input
        setShowCommentModal(false); // Close the modal
      } else {
        console.error("Failed to add comment:", result.error);
        toast.error(
          `Failed to add comment: ${result.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment. Please try again.");
    } finally {
      setAddingComment(false);
    }
  };

  return (
    <div className="space-y-6 p-5">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Contract Management</h2>
          <p className="text-muted-foreground">
            Manage contracts with AI-powered renewal recommendations and
            expiration tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => fetchContracts(true)} // Call fetchContracts with true to force refresh
            className="flex items-center gap-2 cls-addcomapany"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Dialog
            open={isCreatingContract}
            onOpenChange={setIsCreatingContract}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 cls-addcomapany" variant="outline">
                <Plus className="h-4 w-4" />
                New Contract
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Contract</DialogTitle>
                <DialogDescription>
                  Generate a new contract with comprehensive details and
                  milestone tracking
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vendor">Vendor</Label>
                  <Select
                    value={newContract.vendor}
                    onValueChange={(value) =>
                      setNewContract({ ...newContract, vendor: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVendors.length > 0 ? (
                        availableVendors.map((vendor) => (
                          <SelectItem key={vendor} value={vendor}>
                            {vendor}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no_vendors_available" disabled>
                          No vendors available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="client">Client Department</Label>
                  <Select
                    value={newContract.client}
                    onValueChange={(value) =>
                      setNewContract({ ...newContract, client: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select client department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Airline Operations">
                        Airline Operations
                      </SelectItem>
                      <SelectItem value="Business Travel Dept">
                        Business Travel Dept
                      </SelectItem>
                      <SelectItem value="Executive Services">
                        Executive Services
                      </SelectItem>
                      <SelectItem value="Regional Operations">
                        Regional Operations
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type">Contract Type</Label>
                  <Select
                    value={newContract.type}
                    onValueChange={(value) =>
                      setNewContract({ ...newContract, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select contract type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corporate_travel">
                        Corporate Travel Agreement
                      </SelectItem>
                      <SelectItem value="service_level_agreement">
                        Service Level Agreement
                      </SelectItem>
                      <SelectItem value="master_service_agreement">
                        Master Service Agreement
                      </SelectItem>
                      <SelectItem value="vendor_contract">
                        Vendor Contract
                      </SelectItem>
                      <SelectItem value="nda">
                        Non-Disclosure Agreement
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="attachedOffer">
                    Attached Offer (Optional)
                  </Label>
                  <Select
                    value={newContract.attachedOffer}
                    onValueChange={(value) =>
                      setNewContract({ ...newContract, attachedOffer: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select offer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Offer</SelectItem>
                      {mockOffers.map((offer) => (
                        <SelectItem key={offer.id} value={offer.id}>
                          {offer.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="value">Contract Value ($)</Label>
                  <Input
                    id="value"
                    type="number"
                    placeholder="0"
                    value={newContract.value}
                    onChange={(e) =>
                      setNewContract({ ...newContract, value: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newContract.startDate}
                    onChange={(e) =>
                      setNewContract({
                        ...newContract,
                        startDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newContract.endDate}
                    onChange={(e) =>
                      setNewContract({
                        ...newContract,
                        endDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="parties">Parties Involved</Label>
                  <Input
                    id="parties"
                    placeholder="e.g., SOAR-AI Airlines, Vendor Name, Third Party"
                    value={newContract.parties}
                    onChange={(e) =>
                      setNewContract({
                        ...newContract,
                        parties: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="milestones">
                    Key Milestones & Obligations
                  </Label>
                  <Textarea
                    id="milestones"
                    placeholder="Define key milestones, deliverables, and obligations..."
                    value={newContract.milestones}
                    onChange={(e) =>
                      setNewContract({
                        ...newContract,
                        milestones: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="terms">Special Terms & Conditions</Label>
                  <Textarea
                    id="terms"
                    placeholder="Enter any special terms, conditions, or requirements..."
                    value={newContract.terms}
                    onChange={(e) =>
                      setNewContract({ ...newContract, terms: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreatingContract(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCreateContract}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    "Generate Contract"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Contract Dialog */}
          <Dialog open={isEditingContract} onOpenChange={setIsEditingContract}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Contract - {editContract.id}</DialogTitle>
                <DialogDescription>
                  Modify contract details and terms
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-vendor">Vendor</Label>
                  <Select
                    value={editContract.vendor}
                    onValueChange={(value) =>
                      setEditContract({ ...editContract, vendor: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVendors.length > 0 ? (
                        availableVendors.map((vendor) => (
                          <SelectItem key={vendor} value={vendor}>
                            {vendor}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no_vendors_available" disabled>
                          No vendors available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-vendorEmail">Vendor Email</Label>
                  <Input
                    id="edit-vendorEmail"
                    type="email"
                    placeholder="vendor@company.com"
                    value={editContract.vendorEmail}
                    onChange={(e) =>
                      setEditContract({
                        ...editContract,
                        vendorEmail: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-client">Client Department</Label>
                  <Select
                    value={editContract.client}
                    onValueChange={(value) =>
                      setEditContract({ ...editContract, client: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select client department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Airline Operations">
                        Airline Operations
                      </SelectItem>
                      <SelectItem value="Business Travel Dept">
                        Business Travel Dept
                      </SelectItem>
                      <SelectItem value="Executive Services">
                        Executive Services
                      </SelectItem>
                      <SelectItem value="Regional Operations">
                        Regional Operations
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-type">Contract Type</Label>
                  <Select
                    value={editContract.type}
                    onValueChange={(value) =>
                      setEditContract({ ...editContract, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select contract type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Master Service Agreement">
                        Master Service Agreement
                      </SelectItem>
                      <SelectItem value="Service Level Agreement">
                        Service Level Agreement
                      </SelectItem>
                      <SelectItem value="Non-Disclosure Agreement">
                        Non-Disclosure Agreement
                      </SelectItem>
                      <SelectItem value="Partnership Agreement">
                        Partnership Agreement
                      </SelectItem>
                      <SelectItem value="Amendment Template">
                        Amendment Template
                      </SelectItem>
                      <SelectItem value="nda - Elite Business Travel">
                        NDA - Elite Business Travel
                      </SelectItem>
                      <SelectItem value="nda - Premier Voyage Group">
                        NDA - Premier Voyage Group
                      </SelectItem>
                      <SelectItem value="service_level_agreement - Premier Voyage Group">
                        Service Level Agreement - Premier Voyage Group
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-value">Contract Value ($)</Label>
                  <Input
                    id="edit-value"
                    type="number"
                    placeholder="0"
                    value={editContract.value}
                    onChange={(e) =>
                      setEditContract({
                        ...editContract,
                        value: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-paymentTerms">Payment Terms</Label>
                  <Select
                    value={editContract.paymentTerms}
                    onValueChange={(value) =>
                      setEditContract({ ...editContract, paymentTerms: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="net_30">Net 30</SelectItem>
                      <SelectItem value="net_60">Net 60</SelectItem>
                      <SelectItem value="net_90">Net 90</SelectItem>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="on_delivery">On Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-startDate">Start Date</Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={editContract.startDate}
                    onChange={(e) =>
                      setEditContract({
                        ...editContract,
                        startDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-endDate">End Date</Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={editContract.endDate}
                    onChange={(e) =>
                      setEditContract({
                        ...editContract,
                        endDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit-parties">Parties Involved</Label>
                  <Input
                    id="edit-parties"
                    placeholder="e.g., SOAR-AI Airlines, Vendor Name, Third Party"
                    value={editContract.parties}
                    onChange={(e) =>
                      setEditContract({
                        ...editContract,
                        parties: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit-slaRequirements">SLA Requirements</Label>
                  <Textarea
                    id="edit-slaRequirements"
                    placeholder="Enter SLA requirements and performance metrics..."
                    value={editContract.slaRequirements}
                    onChange={(e) =>
                      setEditContract({
                        ...editContract,
                        slaRequirements: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit-milestones">
                    Key Milestones & Obligations
                  </Label>
                  <Textarea
                    id="edit-milestones"
                    placeholder="Define key milestones, deliverables, and obligations..."
                    value={editContract.milestones}
                    onChange={(e) =>
                      setEditContract({
                        ...editContract,
                        milestones: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit-terms">Special Terms & Conditions</Label>
                  <Textarea
                    id="edit-terms"
                    placeholder="Enter any special terms, conditions, or requirements..."
                    value={editContract.terms}
                    onChange={(e) =>
                      setEditContract({
                        ...editContract,
                        terms: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium mb-3 block">
                    Contract Options
                  </Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="edit-autoRenewal"
                        checked={editContract.autoRenewal}
                        onCheckedChange={(checked) =>
                          setEditContract({
                            ...editContract,
                            autoRenewal: checked,
                          })
                        }
                      />
                      <Label htmlFor="edit-autoRenewal" className="text-sm">
                        Auto Renewal
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="edit-performanceBonus"
                        checked={editContract.performanceBonus}
                        onCheckedChange={(checked) =>
                          setEditContract({
                            ...editContract,
                            performanceBonus: checked,
                          })
                        }
                      />
                      <Label
                        htmlFor="edit-performanceBonus"
                        className="text-sm"
                      >
                        Performance Bonus
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="edit-exclusivity"
                        checked={editContract.exclusivity}
                        onCheckedChange={(checked) =>
                          setEditContract({
                            ...editContract,
                            exclusivity: checked,
                          })
                        }
                      />
                      <Label htmlFor="edit-exclusivity" className="text-sm">
                        Exclusivity
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsEditingContract(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateContract} disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Contract"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button className="cls-addcomapany" variant="outline">Import Contract</Button>
        </div>
      </div>

      {/* Expiration Alert Banner */}
      {getExpiringContracts().length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <Clock className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Contracts Expiring Soon:</strong>{" "}
            {getExpiringContracts().length} contract
            {getExpiringContracts().length > 1 ? "s" : ""} require
            {getExpiringContracts().length === 1 ? "s" : ""} attention within
            the next 90 days.
            <Button
              variant="link"
              className="p-0 ml-2 text-yellow-800 underline"
            >
              View Details
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Enhanced Filters */}
      <Card>
        <CardHeader>
        <div className="h-5 flex items-center gap-2  justify-between">
              <div className="flex items-center gap-2 ">
                <Filter className="w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 ">
                  Contract Filters
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setFilters({
                      status: "",
                      client: "",
                      riskLevel: "",
                      dateRange: "",
                      recommendation: "",
                    })
                  }
                  className="flex items-center gap-2 "
                >
                  <XCircle className="h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            </div>
        </CardHeader>
        <CardContent>
     
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label>Status</Label>
              <Select
                value={getSelectDisplayValue(filters.status)}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    status: value === "all" ? "" : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Pending Signature">
                    Pending Signature
                  </SelectItem>
                  <SelectItem value="Active">Active</SelectItem>

                  {/* <SelectItem value="At Risk">At Risk</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Client Department</Label>
              <Select
                value={getSelectDisplayValue(filters.client)}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    client: value === "all" ? "" : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All clients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Airline Operations">
                    Airline Operations
                  </SelectItem>
                  <SelectItem value="Business Travel Dept">
                    Business Travel Dept
                  </SelectItem>
                  <SelectItem value="Executive Services">
                    Executive Services
                  </SelectItem>
                  <SelectItem value="Regional Operations">
                    Regional Operations
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Risk Level</Label>
              <Select
                value={getSelectDisplayValue(filters.riskLevel)}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    riskLevel: value === "all" ? "" : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All risk levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="High">High Risk</SelectItem>
                  <SelectItem value="Medium">Medium Risk</SelectItem>
                  <SelectItem value="Low">Low Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Expiration</Label>
              <Select
                value={getSelectDisplayValue(filters.dateRange)}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    dateRange: value === "all" ? "" : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All periods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Periods</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="critical">Critical (≤30 days)</SelectItem>
                  <SelectItem value="warning">Warning (≤60 days)</SelectItem>
                  <SelectItem value="caution">Caution (≤90 days)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>AI Recommendation</Label>
              <Select
                value={getSelectDisplayValue(filters.recommendation)}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    recommendation: value === "all" ? "" : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All recommendations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Recommendations</SelectItem>
                  <SelectItem value="renew">Renew</SelectItem>
                  <SelectItem value="renegotiate">Renegotiate</SelectItem>
                  <SelectItem value="terminate">Terminate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="contract-list" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6 bg-gray-50/50 p-1 rounded-xl border border-gray-200/50">
          <TabsTrigger
            value="contract-list"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            Contract List
          </TabsTrigger>
          <TabsTrigger
            value="expiring-soon"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            Expiring Soon
          </TabsTrigger>
          <TabsTrigger
            value="ai-recommendations"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            AI Recommendations
          </TabsTrigger>
          <TabsTrigger
            value="templates"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            Templates
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contract-list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contract Overview</CardTitle>
              <CardDescription>
                All contracts with expiration tracking, breach indicators and AI
                recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-2">
                      Loading contracts...
                    </p>
                  </div>
                ) : error ? ( // Display error message if exists
                  <Alert variant="destructive" className="my-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : contractsToDisplay.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                      No Contracts Found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {contracts.length === 0
                        ? "No contracts have been created yet. Create your first contract to get started."
                        : "No contracts match the current filters. Try adjusting your search criteria."}
                    </p>

                    {/* Debug information */}
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg text-left text-sm">
                      <h4 className="font-medium mb-2">Debug Information:</h4>
                      <p>
                        <strong>Total contracts loaded:</strong>{" "}
                        {contracts.length}
                      </p>
                      <p>
                        <strong>Contracts after filters:</strong>{" "}
                        {contractsToDisplay.length}
                      </p>
                      <p>
                        <strong>Active filters:</strong>{" "}
                        {Object.entries(filters)
                          .filter(([_, value]) => value && value !== "")
                          .map(([key, value]) => `${key}=${value}`)
                          .join(", ") || "None"}
                      </p>
                      <p>
                        <strong>Is Loading:</strong> {isLoading.toString()}
                      </p>
                      <p>
                        <strong>Error:</strong> {error || "None"}
                      </p>
                      {contracts.length > 0 && (
                        <div className="mt-2 space-y-2">
                          <p>
                            <strong>First few contract IDs:</strong>{" "}
                            {contracts
                              .slice(0, 3)
                              .map((c) => c.id)
                              .join(", ")}
                          </p>
                          <p>
                            <strong>Unique statuses:</strong>{" "}
                            {[...new Set(contracts.map((c) => c.status))].join(
                              ", "
                            )}
                          </p>
                          <p>
                            <strong>Unique clients:</strong>{" "}
                            {[...new Set(contracts.map((c) => c.client))].join(
                              ", "
                            )}
                          </p>
                          <details className="mt-2">
                            <summary className="cursor-pointer font-medium">
                              Sample contract for debugging
                            </summary>
                            <pre className="mt-2 text-xs overflow-auto max-h-40 bg-white p-2 rounded border">
                              {JSON.stringify(contracts[0], null, 2)}
                            </pre>
                          </details>
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={() => setIsCreatingContract(true)}
                      className="mt-4"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Contract
                    </Button>
                  </div>
                ) : (
                  contractsToDisplay.map((contract) => {
                    const StatusIcon = getStatusIcon(contract.status);
                    const expirationStatus = getExpirationStatus(
                      contract.endDate
                    );
                    const aiRec = aiRecommendations[contract.id];
                    const RecommendationIcon = getRecommendationIcon(
                      aiRec?.recommendation
                    );

                    return (
                      <Card key={contract.id} className="relative">
                        <CardContent className="p-6">
                          {/* Expiration Warning Strip */}
                          {(expirationStatus.status === "critical" ||
                            expirationStatus.status === "warning") && (
                            <div
                              className={`absolute top-0 left-0 right-0 h-1 ${
                                expirationStatus.status === "critical"
                                  ? "bg-red-500"
                                  : "bg-yellow-500"
                              }`}
                            />
                          )}

                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center justify-center w-12 h-12 bg-muted rounded-lg">
                                <FileText className="h-6 w-6" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold">
                                    {contract.id}
                                  </h3>
                                  {contract.breachCount > 0 && (
                                    <Badge
                                      variant="destructive"
                                      className="flex items-center gap-1"
                                    >
                                      <AlertTriangle className="h-3 w-3" />
                                      {contract.breachCount} breach
                                      {contract.breachCount > 1 ? "es" : ""}
                                    </Badge>
                                  )}
                                  {/* Expiration Badge */}
                                  {expirationStatus.status !== "normal" && (
                                    <Badge
                                      variant={expirationStatus.color}
                                      className="flex items-center gap-1"
                                    >
                                      <Clock className="h-3 w-3" />
                                      {expirationStatus.label}
                                    </Badge>
                                  )}
                                </div>
                                <p className="font-medium">{contract.vendor}</p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                  <span>{contract.client}</span>
                                  <span>{contract.type}</span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {contract.startDate} - {contract.endDate}
                                  </span>
                                </div>
                                {/* Attached Offer Display */}
                                {contract.attachedOffer && (
                                  <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Target className="h-4 w-4 text-blue-600" />
                                        <div>
                                          <p className="text-sm font-medium text-blue-800">
                                            {contract.attachedOffer.title}
                                          </p>
                                          <div className="flex items-center gap-2 mt-1">
                                            <Badge
                                              variant="outline"
                                              className="text-xs"
                                            >
                                              {contract.attachedOffer.discount}%
                                              discount
                                            </Badge>
                                            <Badge className="text-xs bg-blue-100 text-blue-800">
                                              {contract.attachedOffer.status}
                                            </Badge>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex gap-1">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() =>
                                            handleViewOffer(contract)
                                          }
                                          title="View Offer Details"
                                        >
                                          <Eye className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() =>
                                            handleChangeOffer(contract)
                                          }
                                          title="Change Offer"
                                        >
                                          <ArrowRight className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                    {/* Display Promo Codes and Discounts */}
                                    {(contract.attachedOffer.appliedDiscounts
                                      ?.length > 0 ||
                                      contract.attachedOffer.promoCodes
                                        ?.length > 0) && (
                                      <div className="mt-2">
                                        {renderPromoCodesAndDiscounts(
                                          contract.attachedOffer
                                            .appliedDiscounts,
                                          contract.attachedOffer.promoCodes
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-right space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={getStatusColor(contract.status)}
                                >
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {contract.status}
                                </Badge>
                                <Badge
                                  variant={getRiskColor(contract.breachRisk)}
                                >
                                  <Shield className="h-3 w-3 mr-1" />
                                  {contract.breachRisk} Risk
                                </Badge>
                              </div>
                              <div className="text-sm font-medium">
                                {contract.value > 0
                                  ? `$${(contract.value / 1000).toFixed(0)}K`
                                  : "N/A"}
                              </div>
                            </div>
                          </div>

                          {/* AI Recommendation Banner */}
                          {aiRec && aiRec.recommendation && (
                            <Alert
                              className={`mb-4 ${
                                aiRec.recommendation === "Renew"
                                  ? "border-green-200 bg-green-50"
                                  : aiRec.recommendation === "Terminate"
                                  ? "border-red-200 bg-red-50"
                                  : "border-yellow-200 bg-yellow-50"
                              }`}
                            >
                              <Brain className="h-4 w-4" />
                              <AlertDescription className="flex items-center justify-between">
                                <div>
                                  <strong>AI Recommendation: </strong>
                                  <Badge
                                    variant={getRecommendationColor(
                                      aiRec.recommendation
                                    )}
                                    className="ml-2"
                                  >
                                    <RecommendationIcon className="h-3 w-3 mr-1" />
                                    {aiRec.recommendation}
                                  </Badge>
                                  <span className="ml-2 text-sm">
                                    Confidence: {aiRec.confidence}%
                                  </span>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleShowAIRecommendation(contract)
                                  }
                                >
                                  View Details
                                </Button>
                              </AlertDescription>
                            </Alert>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <Label className="text-xs">Parties</Label>
                                <p className="text-sm">
                                  {contract.parties.join(", ")}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <Label className="text-xs">Performance</Label>
                                <p className="text-sm">
                                  {contract.performanceScore}%
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Activity className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <Label className="text-xs">
                                  SLA Compliance
                                </Label>
                                <p className="text-sm">
                                  {contract.slaCompliance}%
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <Label className="text-xs">Comments</Label>
                                <p className="text-sm">
                                  {contract.comments?.length || 0} notes
                                </p>
                              </div>
                            </div>
                          </div>

                          <Separator className="my-4" />

                          <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                              Last activity: {contract.lastActivity}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditContract(contract)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit Contract
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewContract(contract)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleShowAIRecommendation(contract)
                                }
                              >
                                <Brain className="h-4 w-4 mr-1" />
                                AI Insights
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadContract(contract)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                              {contract.status === "Pending Signature" && (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    console.log(
                                      "Initiating digital signature for:",
                                      contract.id
                                    )
                                  }
                                >
                                  <PenTool className="h-4 w-4 mr-1" />
                                  Sign
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expiring Soon Tab */}
        <TabsContent value="expiring-soon" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Contracts Expiring Soon
              </CardTitle>
              <CardDescription>
                Contracts requiring renewal decisions within the next 90 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getExpiringContracts().map((contract) => {
                  const expirationStatus = getExpirationStatus(
                    contract.endDate
                  );
                  const aiRec = aiRecommendations[contract.id];
                  const RecommendationIcon = getRecommendationIcon(
                    aiRec?.recommendation
                  );
                  const daysLeft = getDaysUntilExpiration(contract.endDate);

                  return (
                    <Card
                      key={contract.id}
                      className={`border-l-4 ${
                        daysLeft <= 30
                          ? "border-l-red-500"
                          : daysLeft <= 60
                          ? "border-l-yellow-500"
                          : "border-l-blue-500"
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">
                                {contract.id}
                              </h3>
                              <Badge
                                variant={expirationStatus.color}
                                className="flex items-center gap-1"
                              >
                                <Clock className="h-3 w-3" />
                                {daysLeft} days left
                              </Badge>
                              {aiRec && aiRec.recommendation && (
                                <Badge
                                  variant={getRecommendationColor(
                                    aiRec.recommendation
                                  )}
                                >
                                  <RecommendationIcon className="h-3 w-3 mr-1" />
                                  {aiRec.recommendation}
                                </Badge>
                              )}
                            </div>
                            <p className="font-medium text-lg">
                              {contract.vendor}
                            </p>
                            <p className="text-muted-foreground">
                              {contract.client} • {contract.type}
                            </p>
                            <div className="mt-2 text-sm">
                              <span className="font-medium">
                                Contract Value:
                              </span>{" "}
                              ${(contract.value / 1000).toFixed(0)}K
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold mb-1">
                              {daysLeft}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              days remaining
                            </div>
                            <div className="text-sm mt-2">
                              Expires:{" "}
                              <span className="font-medium">
                                {contract.endDate}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">
                              Performance
                            </div>
                            <div className="font-semibold">
                              {contract.performanceScore}%
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">
                              SLA Compliance
                            </div>
                            <div className="font-semibold">
                              {contract.slaCompliance}%
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">
                              Satisfaction
                            </div>
                            <div className="font-semibold">
                              {contract.customerSatisfaction}/5
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">
                              Breaches
                            </div>
                            <div className="font-semibold">
                              {contract.breachCount}
                            </div>
                          </div>
                        </div>

                        {/* AI Recommendation */}
                        {aiRec && aiRec.recommendation && (
                          <Alert
                            className={`mb-4 ${
                              aiRec.recommendation === "Renew"
                                ? "border-green-200 bg-green-50"
                                : aiRec.recommendation === "Terminate"
                                ? "border-red-200 bg-red-50"
                                : "border-yellow-200 bg-yellow-50"
                            }`}
                          >
                            <Brain className="h-4 w-4" />
                            <AlertDescription>
                              <div className="flex items-center justify-between">
                                <div>
                                  <strong>
                                    AI Recommendation: {aiRec.recommendation}
                                  </strong>
                                  <div className="text-sm mt-1">
                                    Confidence: {aiRec.confidence}% •{" "}
                                    {aiRec.expectedImpact}
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleShowAIRecommendation(contract)
                                  }
                                >
                                  View Analysis
                                </Button>
                              </div>
                            </AlertDescription>
                          </Alert>
                        )}

                        <div className="flex gap-2">
                          <Button className="flex-1">
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Initiate Renewal
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleShowAIRecommendation(contract)}
                          >
                            <Brain className="h-4 w-4 mr-1" />
                            AI Analysis
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleViewContract(contract)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Contract
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Recommendations Tab */}
        <TabsContent value="ai-recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI-Powered Contract Recommendations
              </CardTitle>
              <CardDescription>
                Intelligent analysis and recommendations for all contracts based
                on performance, risk, and market data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {contracts.map((contract) => {
                  const aiRec = aiRecommendations[contract.id];
                  const RecommendationIcon = getRecommendationIcon(
                    aiRec?.recommendation
                  );

                  if (!aiRec) return null;

                  return (
                    <Card
                      key={contract.id}
                      className={`border-l-4 ${
                        aiRec.recommendation === "Renew"
                          ? "border-l-green-500"
                          : aiRec.recommendation === "Terminate"
                          ? "border-l-red-500"
                          : "border-l-yellow-500"
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">
                                {contract.id} - {contract.vendor}
                              </h3>
                              <Badge
                                variant={getRecommendationColor(
                                  aiRec.recommendation
                                )}
                                className="flex items-center gap-1"
                              >
                                <RecommendationIcon className="h-3 w-3" />
                                {aiRec.recommendation}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground">
                              {contract.client} • {contract.type}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold mb-1">
                              {aiRec.confidence}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Confidence Score
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <Card>
                            <CardContent className="p-4">
                              <div className="text-center">
                                <div className="text-sm text-muted-foreground mb-1">
                                  Risk Level
                                </div>
                                <Badge
                                  variant={
                                    aiRec.riskLevel === "High"
                                      ? "destructive"
                                      : aiRec.riskLevel === "Medium"
                                      ? "secondary"
                                      : "default"
                                  }
                                >
                                  {aiRec.riskLevel}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <div className="text-center">
                                <div className="text-sm text-muted-foreground mb-1">
                                  Timeline
                                </div>
                                <div className="font-medium">
                                  {aiRec.timeline}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <div className="text-center">
                                <div className="text-sm text-muted-foreground mb-1">
                                  Expected Impact
                                </div>
                                <div className="font-medium text-sm">
                                  {aiRec.expectedImpact}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              Key Analysis Points
                            </Label>
                            <ul className="space-y-1">
                              {aiRec.reasoning.map((reason, index) => (
                                <li
                                  key={index}
                                  className="text-sm flex items-start gap-2"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                  {reason}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              Recommended Actions
                            </Label>
                            <ul className="space-y-1">
                              {aiRec.actions.map((action, index) => (
                                <li
                                  key={index}
                                  className="text-sm flex items-start gap-2"
                                >
                                  <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button className="w-1/4 px-[0px] py-[8px]">
                            <Target className="h-4 w-4 mr-1" />
                            Implement Recommendation
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleViewContract(contract)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Contract
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleDownloadContract(contract)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Export Analysis
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contract Templates</CardTitle>
              <CardDescription>
                Pre-configured templates for quick contract creation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contractTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold">{template.name}</h4>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {template.description}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Preview
                        </Button>
                        <Button size="sm" className="flex-1">
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Contracts
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contracts.length}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">
                    {getExpiringContracts().length} expiring soon
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Value
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $
                  {(
                    contracts.reduce((sum, c) => sum + c.value, 0) / 1000000
                  ).toFixed(1)}
                  M
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">Active contracts</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg Performance
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    contracts.reduce((sum, c) => sum + c.performanceScore, 0) /
                      contracts.length
                  )}
                  %
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-yellow-600">Mixed performance</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  AI Recommendations
                </CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Object.keys(aiRecommendations).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-blue-600">Analysis complete</span>
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Contract Performance Overview</CardTitle>
              <CardDescription>
                Performance metrics and renewal recommendations across all
                contracts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contracts.map((contract) => {
                  const aiRec = aiRecommendations[contract.id];
                  return (
                    <div
                      key={contract.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{contract.vendor}</h4>
                        <p className="text-sm text-muted-foreground">
                          {contract.id}
                        </p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">
                            Performance
                          </div>
                          <div className="font-semibold">
                            {contract.performanceScore}%
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">
                            SLA
                          </div>
                          <div className="font-semibold">
                            {contract.slaCompliance}%
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">
                            Satisfaction
                          </div>
                          <div className="font-semibold">
                            {contract.customerSatisfaction}/5
                          </div>
                        </div>
                        {aiRec && aiRec.recommendation ? (
                          <Badge
                            variant={getRecommendationColor(
                              aiRec.recommendation
                            )}
                          >
                            {aiRec.recommendation}
                          </Badge>
                        ) : (
                          <Badge variant="outline">No AI Analysis</Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Contract Details Dialog */}
      <Dialog open={showContractDetail} onOpenChange={setShowContractDetail}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contract Details - {selectedContract?.id}</DialogTitle>
            <DialogDescription>
              {selectedContract?.vendor} • {selectedContract?.type}
            </DialogDescription>
          </DialogHeader>
          {selectedContract && (
            <Tabs value={activeDetailTab} onValueChange={setActiveDetailTab}>
              <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-50/50 p-1 rounded-xl border border-gray-200/50">
                <TabsTrigger
                  value="summary"
                  className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
                >
                  Summary
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
                >
                  Documents
                </TabsTrigger>
                <TabsTrigger
                  value="timeline"
                  className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
                >
                  Timeline
                </TabsTrigger>
                <TabsTrigger
                  value="comments"
                  className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
                >
                  Comments
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Contract ID
                      </Label>
                      <p className="font-medium">{selectedContract.id}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Vendor
                      </Label>
                      <p className="font-medium">{selectedContract.vendor}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Client Department
                      </Label>
                      <p className="font-medium">{selectedContract.client}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Contract Type
                      </Label>
                      <p className="font-medium">{selectedContract.type}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Contract Value
                      </Label>
                      <p className="font-medium">
                        ${selectedContract.value.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Status
                      </Label>
                      <Badge variant={getStatusColor(selectedContract.status)}>
                        {selectedContract.status}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Contract Period
                      </Label>
                      <p className="font-medium">
                        {selectedContract.startDate} to{" "}
                        {selectedContract.endDate}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Signed Date
                      </Label>
                      <p className="font-medium">
                        {selectedContract.signedDate || "Not signed"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Next Action Required
                      </Label>
                      <p className="font-medium">
                        {selectedContract.nextAction}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Risk Level
                      </Label>
                      <Badge
                        variant={getRiskColor(selectedContract.breachRisk)}
                      >
                        {selectedContract.breachRisk} Risk
                      </Badge>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Parties Involved
                  </Label>
                  <div className="mt-1">
                    {selectedContract.parties.map((party, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="mr-2 mb-1"
                      >
                        {party}
                      </Badge>
                    ))}
                  </div>
                </div>
                {selectedContract.description && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Description
                    </Label>
                    <p className="mt-1 p-3 bg-gray-50 rounded-lg">
                      {selectedContract.description}
                    </p>
                  </div>
                )}
                {selectedContract.terms && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Terms & Conditions
                    </Label>
                    <p className="mt-1 p-3 bg-gray-50 rounded-lg">
                      {selectedContract.terms}
                    </p>
                  </div>
                )}
                {/* Performance Metrics */}
                <div>
                  <Label className="text-sm font-medium text-gray-600 mb-3 block">
                    Performance Metrics
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 border rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedContract.performanceScore}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Performance Score
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {selectedContract.slaCompliance}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        SLA Compliance
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {selectedContract.customerSatisfaction}/5
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Satisfaction
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg text-center">
                      <p className="text-2xl font-bold text-orange-600">
                        {selectedContract.breachCount}
                      </p>
                      <p className="text-sm text-muted-foreground">Breaches</p>
                    </div>
                  </div>
                </div>
                {/* Attached Offer */}
                {selectedContract.attachedOffer && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600 mb-3 block">
                      Attached Offer
                    </Label>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">
                              {selectedContract.attachedOffer.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {selectedContract.attachedOffer.id}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline">
                                {selectedContract.attachedOffer.discount}%
                                discount
                              </Badge>
                              <Badge className="bg-blue-100 text-blue-800">
                                {selectedContract.attachedOffer.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewOffer(selectedContract)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Offer
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleChangeOffer(selectedContract)
                              }
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Change
                            </Button>
                          </div>
                        </div>
                        {(selectedContract.attachedOffer.appliedDiscounts
                          ?.length > 0 ||
                          selectedContract.attachedOffer.promoCodes?.length >
                            0) && (
                          <div className="mt-3 pt-3 border-t">
                            {renderPromoCodesAndDiscounts(
                              selectedContract.attachedOffer.appliedDiscounts,
                              selectedContract.attachedOffer.promoCodes
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Contract Documents</h4>
                  <div className="relative">
                    <input
                      type="file"
                      id="document-upload"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.rtf"
                      onChange={handleDocumentUpload}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("document-upload")?.click()
                      }
                      disabled={uploadingDocument || downloadingDocument}
                    >
                      {uploadingDocument ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-1"></div>
                          Uploading...
                        </>
                      ) : downloadingDocument ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-1"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-1" />
                          Add Document
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {documentUploadError && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{documentUploadError}</AlertDescription>
                  </Alert>
                )}

                <div className="text-xs text-muted-foreground mb-4">
                  Supported file types: PDF, DOC, DOCX, XLS, XLSX, TXT, RTF (Max
                  size: 10MB)
                </div>
                {selectedContract.attachments &&
                selectedContract.attachments.length > 0 ? (
                  <div className="space-y-2">
                    {selectedContract.attachments.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.size} • {doc.uploadDate} • {doc.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleDocumentView(doc.document_id, doc.name)
                            }
                            title="View Document"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleDocumentDownload(doc.document_id, doc.name)
                            }
                            title="Download Document"
                            disabled={downloadingDocument}
                          >
                            {downloadingDocument ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No documents attached to this contract
                  </p>
                )}
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4">
                <h4 className="font-medium">Contract Milestones</h4>
                <div className="space-y-4">
                  {selectedContract.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <Badge variant={getMilestoneStatus(milestone.status)}>
                        {milestone.status}
                      </Badge>
                      <div className="flex-1">
                        <p className="font-medium">{milestone.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {milestone.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="comments" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Contract Comments</h4>
                    <Button
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => setShowCommentModal(true)}
                    >
                      <MessageSquare className="h-4 w-4" />
                      Add Comment
                    </Button>
                  </div>
                  {selectedContract?.comments &&
                  selectedContract.comments.length > 0 ? (
                    <div className="space-y-3">
                      {selectedContract.comments.map((comment, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {comment.author
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-sm">
                                  {comment.author}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {comment.date}
                                </p>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No comments yet</p>
                      <p className="text-sm">
                        Add the first comment to start the conversation
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowContractDetail(false)}
            >
              Close
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDownloadContract(selectedContract)}
            >
              <Download className="h-4 w-4 mr-1" />
              Download Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Recommendation Dialog */}
      <Dialog
        open={showAIRecommendation}
        onOpenChange={setShowAIRecommendation}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Contract Analysis - {selectedContract?.id}
            </DialogTitle>
            <DialogDescription>
              Comprehensive AI-powered analysis and recommendations for{" "}
              {selectedContract?.vendor}
            </DialogDescription>
          </DialogHeader>
          {selectedContract && aiRecommendations[selectedContract.id] && (
            <div className="space-y-6">
              {(() => {
                const aiRec = aiRecommendations[selectedContract.id];
                const RecommendationIcon = getRecommendationIcon(
                  aiRec.recommendation
                );

                return (
                  <>
                    {/* Recommendation Header */}
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <RecommendationIcon className="h-8 w-8" />
                        <div>
                          <h3 className="text-xl font-semibold">
                            Recommendation: {aiRec.recommendation}
                          </h3>
                          <p className="text-muted-foreground">
                            Confidence Score: {aiRec.confidence}%
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={getRecommendationColor(aiRec.recommendation)}
                        className="text-lg p-2"
                      >
                        {aiRec.recommendation}
                      </Badge>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold">
                            {selectedContract.performanceScore}%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Performance Score
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold">
                            {selectedContract.slaCompliance}%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            SLA Compliance
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold">
                            {selectedContract.customerSatisfaction}/5
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Satisfaction
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold">
                            {selectedContract.breachCount}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Breaches
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Analysis Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            Key Analysis Points
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {aiRec.reasoning.map((reason, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            Recommended Actions
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {aiRec.actions.map((action, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <Target className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{action}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Impact & Timeline */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-1">
                              Expected Impact
                            </div>
                            <div className="font-medium">
                              {aiRec.expectedImpact}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-1">
                              Implementation Timeline
                            </div>
                            <div className="font-medium">{aiRec.timeline}</div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-1">
                              Risk Level
                            </div>
                            <Badge
                              variant={
                                aiRec.riskLevel === "High"
                                  ? "destructive"
                                  : aiRec.riskLevel === "Medium"
                                  ? "secondary"
                                  : "default"
                              }
                            >
                              {aiRec.riskLevel}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Market Context */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Market Context & Alternatives
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium">
                              Vendor Market Position
                            </Label>
                            <p className="mt-1">
                              {selectedContract.marketPosition}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">
                              Financial Health
                            </Label>
                            <p className="mt-1">
                              {selectedContract.financialHealth}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">
                              Technical Capability
                            </Label>
                            <p className="mt-1">
                              {selectedContract.technicalCapability}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">
                              Relationship Score
                            </Label>
                            <p className="mt-1">
                              {selectedContract.relationshipScore}/5
                            </p>
                          </div>
                        </div>

                        {selectedContract.alternativeVendors.length > 0 && (
                          <div className="mt-4">
                            <Label className="text-sm font-medium">
                              Alternative Vendors
                            </Label>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {selectedContract.alternativeVendors.map(
                                (vendor, index) => (
                                  <Badge key={index} variant="outline">
                                    {vendor}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </>
                );
              })()}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAIRecommendation(false)}
            >
              Close
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDownloadContract(selectedContract)}
            >
              <Download className="h-4 w-4 mr-1" />
              Export Analysis
            </Button>
            <Button>
              <Target className="h-4 w-4 mr-1" />
              Implement Recommendation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Offer Dialog */}
      <Dialog open={showOfferDetail} onOpenChange={setShowOfferDetail}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Attached Offer Details</DialogTitle>
            <DialogDescription>
              Details of the offer attached to contract {selectedContract?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedOffer && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedOffer.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedOffer.id}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-blue-100 text-blue-800">
                    {selectedOffer.status}
                  </Badge>
                  <Badge variant="outline">
                    {selectedOffer.discount}% discount
                  </Badge>
                </div>
              </div>

              {/* Applied Promo Codes and Discounts */}
              {(selectedOffer.appliedDiscounts?.length > 0 ||
                selectedOffer.promoCodes?.length > 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Applied Promotions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedOffer.appliedDiscounts?.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium text-gray-600 mb-2 block">
                            Applied Discounts
                          </Label>
                          <div className="space-y-2">
                            {selectedOffer.appliedDiscounts.map(
                              (discountId) => {
                                const discount = mockDiscounts.find(
                                  (d) => d.id === discountId
                                );
                                return discount ? (
                                  <div
                                    key={discountId}
                                    className="flex items-center justify-between p-3 border rounded-lg"
                                  >
                                    <div className="flex items-center gap-3">
                                      <Percent className="h-4 w-4 text-blue-600" />
                                      <div>
                                        <p className="font-medium text-sm">
                                          {discount.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {discount.description}
                                        </p>
                                      </div>
                                    </div>
                                    <Badge variant="secondary">
                                      {discount.type === "Percentage"
                                        ? `${discount.value}%`
                                        : `$${discount.value}`}
                                    </Badge>
                                  </div>
                                ) : null;
                              }
                            )}
                          </div>
                        </div>
                      )}

                      {selectedOffer.promoCodes?.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium text-gray-600 mb-2 block">
                            Applied Promo Codes
                          </Label>
                          <div className="space-y-2">
                            {selectedOffer.promoCodes.map((promoId) => {
                              const promo = mockPromoCodes.find(
                                (p) => p.id === promoId
                              );
                              return promo ? (
                                <div
                                  key={promoId}
                                  className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                  <div className="flex items-center gap-3">
                                    <Tag className="h-4 w-4 text-blue-600" />
                                    <div>
                                      <p className="font-medium text-sm font-mono text-blue-600">
                                        {promo.code}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {promo.description}
                                      </p>
                                    </div>
                                  </div>
                                  <Badge variant="outline">
                                    {promo.type === "Percentage"
                                      ? `${promo.value}%`
                                      : `$${promo.value}`}
                                  </Badge>
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Valid Period
                    </Label>
                    <p>
                      {selectedOffer.validFrom} to {selectedOffer.validTo}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Discount
                    </Label>
                    <p>{selectedOffer.discount}%</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Type
                    </Label>
                    <p>{selectedOffer.type}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Status
                    </Label>
                    <Badge className="bg-blue-100 text-blue-800">
                      {selectedOffer.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedOffer.description && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Description
                  </Label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg">
                    {selectedOffer.description}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOfferDetail(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setShowOfferDetail(false);
                handleChangeOffer(selectedContract);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Change Offer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Offer Dialog */}
      <Dialog open={showChangeOffer} onOpenChange={setShowChangeOffer}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Change Attached Offer</DialogTitle>
            <DialogDescription>
              Select a different offer to attach to contract{" "}
              {selectedContract?.id}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Current Contract</h4>
              <p>
                {selectedContract?.id} - {selectedContract?.vendor}
              </p>
              {selectedContract?.attachedOffer && (
                <p className="text-sm text-muted-foreground">
                  Currently attached: {selectedContract.attachedOffer.title}
                </p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">
                Available Offers
              </Label>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                <div
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                  onClick={() => {
                    setSelectedContract((prev) =>
                      prev ? { ...prev, attachedOffer: null } : null
                    );
                    setShowChangeOffer(false);
                  }}
                >
                  <div>
                    <p className="font-medium text-sm">No Offer</p>
                    <p className="text-xs text-muted-foreground">
                      Remove the attached offer
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Select
                  </Button>
                </div>
                {mockOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedContract((prev) =>
                        prev ? { ...prev, attachedOffer: offer } : null
                      );
                      setShowChangeOffer(false);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{offer.title}</p>
                          <Badge variant="outline" className="text-xs">
                            {offer.discount}% discount
                          </Badge>
                          <Badge className="text-xs bg-blue-100 text-blue-800">
                            {offer.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {offer.description}
                        </p>
                        {(offer.appliedDiscounts?.length > 0 ||
                          offer.promoCodes?.length > 0) && (
                          <div className="mt-2">
                            {renderPromoCodesAndDiscounts(
                              offer.appliedDiscounts,
                              offer.promoCodes
                            )}
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant={
                          selectedContract?.attachedOffer?.id === offer.id
                            ? "default"
                            : "outline"
                        }
                        disabled={
                          selectedContract?.attachedOffer?.id === offer.id
                        }
                      >
                        {selectedContract?.attachedOffer?.id === offer.id
                          ? "Current"
                          : "Select"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChangeOffer(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowChangeOffer(false)}>
              Update Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Viewer Modal - Embedded document viewer */}
      <Dialog open={showDocumentViewer} onOpenChange={setShowDocumentViewer}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Viewer - {viewingDocument?.name}
            </DialogTitle>
            <DialogDescription>
              Viewing document in embedded viewer
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            {viewingDocument && (
              <div className="h-[70vh] w-full border rounded-lg overflow-hidden bg-white">
                {viewingDocument.type === "PDF Document" ||
                viewingDocument.name.toLowerCase().endsWith(".pdf") ? (
                  <iframe
                    src={viewingDocument.url}
                    className="w-full h-full border-0"
                    title={`PDF Viewer - ${viewingDocument.name}`}
                  />
                ) : viewingDocument.name
                    .toLowerCase()
                    .match(/\.(jpg|jpeg|png|gif|svg)$/i) ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <img
                      src={viewingDocument.url}
                      alt={viewingDocument.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col">
                    <div className="flex-1 bg-gray-50 flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="h-16 w-16 mb-4 text-gray-400 mx-auto" />
                        <h3 className="text-lg font-semibold mb-2">
                          Document Preview Not Available
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          This file type cannot be previewed directly in the
                          browser.
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                          File: {viewingDocument.name}
                        </p>
                        <div className="flex gap-3 justify-center">
                          <Button
                            onClick={() => {
                              window.open(viewingDocument.url, "_blank");
                            }}
                            className="flex items-center gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Open in New Tab
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = viewingDocument.url;
                              link.download = viewingDocument.name;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className="flex items-center gap-2"
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setShowDocumentViewer(false);
                setViewingDocument(null);
              }}
            >
              Close
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  if (viewingDocument?.url) {
                    window.open(viewingDocument.url, "_blank");
                  }
                }}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Open in New Tab
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (viewingDocument?.url) {
                    const link = document.createElement("a");
                    link.href = viewingDocument.url;
                    link.download = viewingDocument.name;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }
                }}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Comment Modal */}
      <Dialog open={showCommentModal} onOpenChange={setShowCommentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Comment</DialogTitle>
            <DialogDescription>
              Add a comment to {selectedContract?.id || "this contract"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                placeholder="Enter your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCommentModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddComment}
              disabled={addingComment || !newComment.trim()}
            >
              {addingComment ? "Adding..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
