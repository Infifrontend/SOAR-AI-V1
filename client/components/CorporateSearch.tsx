import { useState, useEffect, useCallback, useRef } from "react"; // Import useCallback and useRef
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { ScrollArea } from "./ui/scroll-area";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import { CorporateProfile } from "./CorporateProfile";
import { useCompanyApi } from "../hooks/api/useCompanyApi";
import { useLeadApi } from "../hooks/api/useLeadApi";

import {
  Search,
  Filter,
  Star,
  MapPin,
  Users,
  Calendar,
  TrendingUp,
  Award,
  Globe,
  Phone,
  Mail,
  ExternalLink,
  Settings2,
  Building2,
  FileText,
  ArrowRight,
  Eye,
  DollarSign,
  Briefcase,
  Target,
  Activity,
  BarChart3,
  Plane,
  Clock,
  Shield,
  Zap,
  Brain,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  Wallet,
  CreditCard,
  Calendar as CalendarIcon,
  Route,
  PlaneTakeoff,
  Building,
  Factory,
  Banknote,
  Leaf,
  Smartphone,
  LineChart,
  PieChart,
  BarChart4,
  X,
  UserPlus,
  Plus,
  Save,
  AlertCircle as AlertCircleIcon,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Upload, // Import Upload icon
} from "lucide-react";

// Import useDebounce hook
import { useDebounce } from "../hooks/useDebounce";

// Import toast for notifications
import { toast } from "sonner";

// API utility functions

const transformCompanyData = (company) => {
  // Transform backend data to match frontend expectations
  return {
    id: company.id,
    name: company.name,
    move_as_lead: company.move_as_lead || false,
    type: getCompanyTypeDisplay(company.company_type || company.size),
    industry: getIndustryDisplay(company.industry),
    location: company.location,
    aiScore: Math.floor(Math.random() * 20) + 80, // Random AI score for demo
    rating: (Math.random() * 1 + 4).toFixed(1), // Random rating 4.0-5.0
    established:
      company.year_established ||
      (company.created_at ? new Date(company.created_at).getFullYear() : 2020),
    employees: company.employee_count || Math.floor(Math.random() * 5000) + 100,
    specialties: company.specialties
      ? company.specialties
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s)
          .slice(0, 5)
      : ["Business Services", "Corporate Solutions"],
    travelBudget: company.travel_budget
      ? `${(company.travel_budget / 1000000).toFixed(1)}M`
      : "1.0M",
    annualTravelVolume:
      company.annual_travel_volume ||
      `${Math.floor(Math.random() * 5000) + 1000} trips`,
    contracts: Math.floor(Math.random() * 20) + 1,
    revenue:
      company.annual_revenue || Math.floor(Math.random() * 50000000) + 10000000,
    phone:
      company.phone ||
      "+1 (555) " +
        Math.floor(Math.random() * 900 + 100) +
        "-" +
        Math.floor(Math.random() * 9000 + 1000),
    email:
      company.email ||
      `contact@${company.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
    website:
      company.website ||
      `www.${company.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
    aiRecommendation: generateAIRecommendation(company),
    compliance: Math.floor(Math.random() * 20) + 80,
    financialStability: Math.floor(Math.random() * 20) + 80,
    travelFrequency: company.travel_frequency || getRandomTravelFrequency(),
    destinations: getRandomDestinations(),
    preferredClass: company.preferred_class || getRandomPreferredClass(),
    teamSize: Math.floor((company.employee_count || 1000) * 0.1),
    travelManagers: Math.floor(Math.random() * 5) + 1,
    currentAirlines: company.current_airlines
      ? company.current_airlines
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s)
          .slice(0, 5)
      : getRandomAirlines(),
    paymentTerms: company.payment_terms || getRandomPaymentTerms(),
    creditRating: company.credit_rating || getRandomCreditRating(),
    sustainabilityFocus:
      company.sustainability_focus || getRandomSustainabilityFocus(),
    technologyIntegration: company.technology_integration
      ? company.technology_integration
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s)
          .slice(0, 5)
      : getRandomTechIntegration(),
    seasonality: getRandomSeasonality(),
    meetingTypes: getRandomMeetingTypes(),
    companySize: getSizeDisplay(company.size),
    marketSegment: getIndustryDisplay(company.industry),
    decisionMakers: Math.floor(Math.random() * 8) + 2,
    contractValue: Math.floor(Math.random() * 3000000) + 500000,
    competitorAirlines: Math.floor(Math.random() * 5) + 1,
    loyaltyPotential: Math.floor(Math.random() * 30) + 70,
    expansionPlans: company.expansion_plans || getRandomExpansionPlans(),
    riskLevel: company.risk_level || getRandomRiskLevel(),
    created_at: company.created_at,
    updated_at: company.updated_at
  };
};

// Helper functions
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

interface CorporateSearchProps {
  initialFilters?: any;
  onNavigate?: (section: string, filters?: any) => void;
}

export function CorporateSearch({
  initialFilters,
  onNavigate,
}: CorporateSearchProps) {
  const [searchParams, setSearchParams] = useState({
    industry: "",
    location: "",
    travelBudget: "",
    companySize: "",
    travelFrequency: "",
    globalSearch: "",
    ...initialFilters,
  });

  // Debounce search parameters
  const debouncedSearchParams = useDebounce(searchParams, 500); // 500ms debounce delay

  // Initialize company API hook
  const {
    searchCompanies,
    createCompany,
    moveToLead,
    bulkUploadCompanies,
    downloadSampleExcel,
  } = useCompanyApi();

  // Initialize lead API hook for sending messages
  const leadApi = useLeadApi();

  const [filteredCorporates, setFilteredCorporates] = useState([]);
  const [displayedCorporates, setDisplayedCorporates] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showCorporateProfile, setShowCorporateProfile] = useState(false);
  const [showAddCompanyDialog, setShowAddCompanyDialog] = useState(false);
  const [error, setError] = useState("");

  // Sort, Filter, and Pagination states
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [nameFilter, setNameFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  // Advanced filter states
  const [advancedFilters, setAdvancedFilters] = useState({
    industries: [],
    maturity: [],
    employeeRange: [100, 10000],
    travelFrequency: "",
    preferredClass: "",
    annualTravelVolume: [100, 20000],
    revenueRange: "",
    creditRating: "",
    travelBudgetRange: [0.5, 10],
    techRequirements: [],
    sustainabilityLevel: "",
  });

  const [selectedCorporate, setSelectedCorporate] = useState(null);
  const [movedAsLeadIds, setMovedAsLeadIds] = useState(new Set());
  const [existingLeadCompanies, setExistingLeadCompanies] = useState(new Set());
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New company form state
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

  const [contactForm, setContactForm] = useState({
    method: "Email",
    subject: "",
    message: "",
    followUpDate: "",
    followUpMode: "",
    corporateData: null,
  });
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false); // Spinner loader state
  const [showMoveAsLeadDialog, setShowMoveAsLeadDialog] = useState(false);
  const [selectedCorporateForMove, setSelectedCorporateForMove] =
    useState(null);
  const [isMovingAsLead, setIsMovingAsLead] = useState(false);


  // Upload Company states
  const [showUploadCompanyDialog, setShowUploadCompanyDialog] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  
  // File input ref for clearing after upload
  const fileInputRef = useRef(null);

  // Function to handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadFile(file);
      setUploadError(""); // Clear previous errors
      setUploadSuccess(""); // Clear previous success messages
    }
  };

  // Function to download the sample Excel template
  const handleDownloadSample = async () => {
    try {
      await downloadSampleExcel();
      toast.success("Sample template downloaded successfully");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download sample template");
    }
  };

  // Function to handle the upload process
  const handleUpload = async () => {
    if (!uploadFile) {
      setUploadError("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError("");
    setUploadSuccess("");

    try {
      const formData = new FormData();
      formData.append("file", uploadFile); // Use 'file' to match the backend expectation

      const response = await bulkUploadCompanies(
        uploadFile,
        (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(percentCompleted);
        },
      );

      // Handle successful response
      if (response.success !== false) {
        setUploadSuccess(
          `Upload successful! Created ${response.created_count || 0} companies, skipped ${response.skipped_count || 0} duplicates.`,
        );
        // Refresh the company list
        loadCompanies({});

        // Clear the file input
        setUploadFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        // Handle validation errors or other issues reported by the API
        setUploadError(
          `Upload failed: ${response.errors?.join(", ") || response.message || "Unknown error"}`,
        );
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadError(
        `Upload failed: ${error.message || "Please check the file format and content."}`,
      );
    } finally {
      setIsUploading(false);
    }
  };

  const loadCompanies = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError("");

    try {
      const companies = await searchCompanies(filters); // Use searchCompanies from useCompanyApi
      const transformedCompanies = companies.map(transformCompanyData);
      console.log(companies, "companies");
      setFilteredCorporates(transformedCompanies);
      applyFiltersAndSort(transformedCompanies);

      // Check which companies already exist as leads
      if (transformedCompanies.length > 0) {
        await checkCompaniesLeadStatus(transformedCompanies);
      }
    } catch (error) {
      console.error("Error loading companies:", error);
      setError("Failed to load companies. Please try again.");
      setFilteredCorporates([]);
    } finally {
      setIsLoading(false);
    }
  }, []); // Remove companyApi dependency to prevent recreation

  // Function to check if companies exist as leads
  const checkCompaniesLeadStatus = useCallback(async (companies) => {
    try {
      // Check move_as_lead flag directly from company data
      const existingLeads = new Set();
      companies.forEach((company) => {
        if (company.move_as_lead) {
          existingLeads.add(company.name);
        }
      });

      setExistingLeadCompanies(existingLeads);
    } catch (error) {
      console.error("Error checking lead status:", error);
      // Don't show error to user as this is not critical functionality
    }
  }, []);

  // Load companies on component mount - use a separate effect with direct API call
  useEffect(() => {
    const initialLoad = async () => {
      setIsLoading(true);
      setError("");

      try {
        const companies = await searchCompanies({}); // Use searchCompanies from useCompanyApi
        const transformedCompanies = companies.map(transformCompanyData);
        setFilteredCorporates(transformedCompanies);
        applyFiltersAndSort(transformedCompanies);
        console.log(companies, "companies");
      } catch (error) {
        console.error("Error loading companies:", error);
        setError("Failed to load companies. Please try again.");
        setFilteredCorporates([]);
      } finally {
        setIsLoading(false);
      }
    };

    initialLoad();
  }, []); // Only run once on mount

  // Optimize handleSearch to prevent duplicate calls
  const handleSearch = useCallback(async () => {
    // Prevent multiple simultaneous searches
    if (isSearching) {
      return;
    }

    setIsSearching(true);
    setError("");

    try {
      // Merge basic search params with advanced filters
      const mergedFilters = {
        ...searchParams, // Use searchParams directly instead of debouncedSearchParams
        ...advancedFilters,
      };

      // Call the API directly instead of through loadCompanies to avoid dependency issues
      const companies = await searchCompanies(mergedFilters); // Use searchCompanies from useCompanyApi
      const transformedCompanies = companies.map(transformCompanyData);
      setFilteredCorporates(transformedCompanies);
      applyFiltersAndSort(transformedCompanies);

      // Check which companies already exist as leads
      if (transformedCompanies.length > 0) {
        await checkCompaniesLeadStatus(transformedCompanies);
      }
    } catch (error) {
      console.error("Error searching companies:", error);
      setError("Search failed. Please try again.");
      setFilteredCorporates([]);
    } finally {
      setIsSearching(false);
    }
  }, [isSearching, searchParams, advancedFilters]); // Use searchParams instead of debouncedSearchParams

  const handleViewProfile = (corporate) => {
    setSelectedCorporate(corporate);
    setShowCorporateProfile(true);
  };

  // Sort and filter logic
  const applyFiltersAndSort = useCallback(
    (companies) => {
      let filtered = [...companies];
      console.log("eeefilteredfilteredeeee", filtered);
      // Apply name filter
      if (nameFilter.trim()) {
        filtered = filtered.filter((company) =>
          company.name.toLowerCase().includes(nameFilter.toLowerCase()),
        );
      }

      // Apply sorting
      filtered.sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
          case "name":
            comparison = a.name.localeCompare(b.name);
            break;
          case "aiScore":
            comparison = a.aiScore - b.aiScore;
            break;
          case "rating":
            comparison = parseFloat(a.rating) - parseFloat(b.rating);
            break;
          case "employees":
            comparison = a.employees - b.employees;
            break;
          case "revenue":
            comparison = a.revenue - b.revenue;
            break;
          case "established":
            comparison = a.established - b.established;
            break;
          default:
            comparison = 0;

        }

        return sortOrder === "asc" ? comparison : -comparison;
      });
      filtered.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));


      // Calculate pagination
      const totalItems = filtered.length;
      const calculatedTotalPages = Math.ceil(totalItems / itemsPerPage);
      setTotalPages(calculatedTotalPages);

      // Reset to page 1 if current page exceeds total pages
      const validCurrentPage =
        currentPage > calculatedTotalPages ? 1 : currentPage;
      if (validCurrentPage !== currentPage) {
        setCurrentPage(validCurrentPage);
      }

      // Apply pagination
      const startIndex = (validCurrentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedCompanies = filtered.slice(startIndex, endIndex);

      setDisplayedCorporates(paginatedCompanies);
    },
    [nameFilter, sortBy, sortOrder, currentPage, itemsPerPage],
  );

  // Effect to reapply filters when dependencies change
  useEffect(() => {
    if (filteredCorporates.length > 0) {
      applyFiltersAndSort(filteredCorporates);
    }
  }, [filteredCorporates, applyFiltersAndSort]);

  const handleSortChange = (newSortBy) => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handleNameFilterChange = (value) => {
    setNameFilter(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleClearFilters = () => {
    // Reset search parameters
    setSearchParams({
      industry: "",
      location: "",
      travelBudget: "",
      companySize: "",
      travelFrequency: "",
      globalSearch: "",
    });

    // Reset advanced filters
    setAdvancedFilters({
      industries: [],
      maturity: [],
      employeeRange: [100, 10000],
      travelFrequency: "",
      preferredClass: "",
      annualTravelVolume: [100, 20000],
      revenueRange: "",
      creditRating: "",
      travelBudgetRange: [0.5, 10],
      techRequirements: [],
      sustainabilityLevel: "",
    });

    // Reset sort and filter states
    setNameFilter("");
    setSortBy("name");
    setSortOrder("asc");
    setCurrentPage(1);

    // Reset existing leads state
    setExistingLeadCompanies(new Set());
    setMovedAsLeadIds(new Set());

    // Reload companies with no filters
    loadCompanies({});
  };

  const handleMoveAsLead = (corporate) => {
    setSelectedCorporateForMove(corporate);
    setShowMoveAsLeadDialog(true);
  };

  const confirmMoveAsLead = async () => {
    if (!selectedCorporateForMove) return;

    setIsMovingAsLead(true);
    const corporate = selectedCorporateForMove;

    try {
      // Prepare the lead data in the format expected by the Django backend
      const leadData = {
        name: corporate.name, // Add the company name at the top level
        company: {
          name: corporate.name,
          industry:
            corporate.industry === "Technology & Software"
              ? "technology"
              : corporate.industry === "Finance & Banking"
                ? "finance"
                : corporate.industry === "Business Services"
                  ? "consulting"
                  : "other",
          location: corporate.location,
          size: corporate.companySize?.toLowerCase() || "medium",
          annual_revenue: corporate.revenue || null,
          travel_budget: corporate.contractValue || null,
          employee_count: corporate.employees || null,
        },
        contact: {
          first_name: "Contact", // Default contact info - would be better to get from user input
          last_name: "Person",
          email: corporate.email,
          phone: corporate.phone || "",
          position: "Decision Maker",
          is_decision_maker: true,
        },
        status: "new",
        source: "corporate_search",
        priority:
          corporate.aiScore >= 80
            ? "high"
            : corporate.aiScore >= 60
              ? "medium"
              : "low",
        score: corporate.aiScore,
        estimated_value: corporate.contractValue || null,
        notes: `Moved from corporate search. AI Score: ${corporate.aiScore}. ${corporate.aiRecommendation}. Specialties: ${corporate.specialties?.join(", ") || "N/A"}. Travel Frequency: ${corporate.travelFrequency || "N/A"}. Preferred Class: ${corporate.preferredClass || "N/A"}.`,
      };

      // Call the API to create the lead
      const createdLead = await moveToLead(leadData); // Use moveToLead from useCompanyApi

      // Mark the company as moved to lead via API call to update the backend
      try {
        const response = await fetch(
          `${import.meta.env?.VITE_API_URL || "/api"}/companies/${corporate.id}/mark_as_moved_to_lead/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          console.warn("Failed to mark company as moved to lead in backend");
        }
      } catch (markError) {
        console.warn("Error marking company as moved to lead:", markError);
      }

      // Update the filtered corporates list to mark this company as moved
      setFilteredCorporates((prev) =>
        prev.map((c) =>
          c.id === corporate.id ? { ...c, move_as_lead: true } : c,
        ),
      );

      // Update displayed corporates as well
      setDisplayedCorporates((prev) =>
        prev.map((c) =>
          c.id === corporate.id ? { ...c, move_as_lead: true } : c,
        ),
      );

      // Add to moved leads tracking
      setMovedAsLeadIds((prev) => new Set([...prev, corporate.id]));
      setExistingLeadCompanies((prev) => new Set([...prev, corporate.name]));

      // Show success message
      setSuccessMessage(
        `${corporate.name} has been successfully moved to leads management`,
      );
      setTimeout(() => setSuccessMessage(""), 5000);

      // Navigate to leads if onNavigate is available
      if (onNavigate) {
        onNavigate("leads-list", {
          message: `${corporate.name} has been successfully moved to leads management`,
        });
      }
    } catch (error) {
      console.error("Error moving corporate as lead:", error);
      setSuccessMessage(
        `Error: Failed to move ${corporate.name} as lead. Please try again.`,
      );
      setTimeout(() => setSuccessMessage(""), 5000);
    } finally {
      setIsMovingAsLead(false);
      setShowMoveAsLeadDialog(false);
      setSelectedCorporateForMove(null);
    }
  };

  const handleBackToSearch = () => {
    setShowCorporateProfile(false);
    setSelectedCorporate(null);
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
        creditRating: newCompany.creditRating,
        paymentTerms: newCompany.paymentTerms,

        // Travel Profile
        travel_budget: newCompany.travelBudget
          ? parseFloat(newCompany.travelBudget) * 1000000
          : null, // Convert millions to actual amount
        annual_travel_volume: newCompany.annualTravelVolume,
        travel_frequency: newCompany.travelFrequency,
        preferredClass: newCompany.preferredClass,
        sustainabilityFocus: newCompany.sustainabilityFocus,
        riskLevel: newCompany.riskLevel,
        currentAirlines: newCompany.currentAirlines,

        // Additional Info
        expansionPlans: newCompany.expansionPlans,
        specialties: newCompany.specialties,
        technologyIntegration: newCompany.technologyIntegration,
        description: newCompany.notes || "",
      };

      console.log("Sending company data:", companyData);

      const savedCompany = await createCompany(companyData); // Use createCompany from useCompanyApi

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
        `${newCompany.name} has been successfully added to the corporate database.`,
      );

      // Refresh the companies list to show the new company
      try {
        setIsLoading(true);
        const companies = await searchCompanies(searchParams); // Use searchCompanies from useCompanyApi
        const transformedCompanies = companies.map(transformCompanyData);
        setFilteredCorporates(transformedCompanies);
        applyFiltersAndSort(transformedCompanies);
      } catch (refreshError) {
        console.error("Error refreshing companies list:", refreshError);
      } finally {
        setIsLoading(false);
      }

      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Error saving company:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to save company";
      setSuccessMessage(`Error: ${errorMessage}`);
      setTimeout(() => setSuccessMessage(""), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      newCompany.name.trim() !== "" &&
      newCompany.industry !== "" &&
      newCompany.companySize !== "" &&
      newCompany.location.trim() !== "" &&
      newCompany.email.trim() !== ""
    );
  };

  // Show specific components based on state
  if (showCorporateProfile && selectedCorporate) {
    return (
      <Dialog
        open={showCorporateProfile}
        onOpenChange={setShowCorporateProfile}
      >
        <h1>nagusafdjsf</h1>
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
  // Function to open dialog for contacting a lead
  const handleContactCorporate = (corporate: any) => {
    setContactForm({
      method: "Email",
      subject: `Partnership Opportunity - ${corporate.name}`,
      message: `Hi ,

        I hope this message finds you well. I wanted to follow up regarding our corporate travel solutions that could benefit ${corporate.name}.

        Based on your organization's profile, I believe we can help optimize your travel operations and reduce costs.

        Would you be available for a brief call this week to discuss how we can support your travel needs?

        Best regards,
        SOAR-AI Team`,
      followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // 7 days from now
      followUpMode: "",
      corporateData: corporate,
    });
    setShowContactDialog(true);
  };

  // Function to send message to corporate contact
  const handleSendMessage = async () => {
    if (!contactForm.corporateData || !contactForm.subject || !contactForm.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSendingMessage(true); // Start spinner

    try {
      // Use the leadApi to send message (we'll use company data to create a temporary lead-like structure)
      const response = await leadApi.sendMessage(contactForm.corporateData.id, {
        method: contactForm.method,
        subject: contactForm.subject,
        message: contactForm.message,
        followUpDate: contactForm.followUpDate,
        followUpMode: contactForm.followUpMode,
        // Add corporate-specific data
        recipient_email: contactForm.corporateData.email,
        recipient_name: contactForm.corporateData.name,
        contact_type: "corporate",
      });

      if (response && response.success) {
        setSuccessMessage(
          `Email sent to ${contactForm.corporateData.name} successfully!`,
        );
        setTimeout(() => setSuccessMessage(""), 5000);
        toast.success("Email sent successfully");
      } else {
        throw new Error(response?.message || "Failed to send email");
      }

      // Close dialog and reset state
      setShowContactDialog(false);
      setContactForm({
        method: "Email",
        subject: "",
        message: "",
        followUpDate: "",
        followUpMode: "",
        corporateData: null,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to send message";
      toast.error(errorMessage);
    } finally {
      setIsSendingMessage(false); // Stop spinner
    }
  };
  return (
    <div className="w-full h-full bg-gray-50 p-6">
      {/* Success Message */}
      {successMessage && (
        <Alert className="bg-green-50 border-green-200 mb-4">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Search className="h-6 w-6 text-gray-600" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Corporate Client Discovery
            </h1>
            <p className="text-sm text-gray-600">
              AI-powered search to discover and evaluate potential corporate
              travel partnerships
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowAddCompanyDialog(true)}
            className="cls-addcomapany"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Company
          </Button>
          <Button
            onClick={() => setShowUploadCompanyDialog(true)}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Company
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        {/* Global Search Row */}
        {/* <div className="mb-6">
          <Label className="text-sm font-medium text-gray-900 mb-2 block">Global Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by company name..."
              value={searchParams.globalSearch || ''}
              onChange={(e) => setSearchParams({...searchParams, globalSearch: e.target.value})}
              className="pl-10 h-10 bg-white border-gray-300"
            />
          </div>
        </div> */}

        {/* Top Row - 3 columns */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">
              Industry Sector
            </Label>
            <Select
              value={searchParams.industry}
              onValueChange={(value) =>
                setSearchParams({ ...searchParams, industry: value })
              }
            >
              <SelectTrigger className="h-10 bg-white border-gray-300 text-gray-500">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="financial services">
                  Financial Services
                </SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="energy">Energy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">
              Geographic Focus
            </Label>
            <Select
              value={searchParams.location}
              onValueChange={(value) =>
                setSearchParams({ ...searchParams, location: value })
              }
            >
              <SelectTrigger className="h-10 bg-white border-gray-300 text-gray-500">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="north-america">North America</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                <SelectItem value="global">Global Operations</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">
              Annual Travel Budget
            </Label>
            <Select
              value={searchParams.travelBudget}
              onValueChange={(value) =>
                setSearchParams({ ...searchParams, travelBudget: value })
              }
            >
              <SelectTrigger className="h-10 bg-white border-gray-300 text-gray-500">
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-500k">Under $500K</SelectItem>
                <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                <SelectItem value="1m-3m">$1M - $3M</SelectItem>
                <SelectItem value="3m-5m">$3M - $5M</SelectItem>
                <SelectItem value="above-5m">Above $5M</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bottom Row - 2 columns */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">
              Company Size
            </Label>
            <Select
              value={searchParams.companySize}
              onValueChange={(value) =>
                setSearchParams({ ...searchParams, companySize: value })
              }
            >
              <SelectTrigger className="h-10 bg-white border-gray-300 text-gray-500">
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

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">
              Travel Frequency
            </Label>
            <Select
              value={searchParams.travelFrequency}
              onValueChange={(value) =>
                setSearchParams({ ...searchParams, travelFrequency: value })
              }
            >
              <SelectTrigger className="h-10 bg-white border-gray-300 text-gray-500">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily Travel</SelectItem>
                <SelectItem value="weekly">Weekly Travel</SelectItem>
                <SelectItem value="monthly">Monthly Travel</SelectItem>
                <SelectItem value="quarterly">Quarterly Travel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 items-center">
          <Button
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                AI Processing...
              </>
            ) : (
              "Search Corporates"
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowAdvancedFilters(true)}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Advanced Filters
          </Button>

          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Alert className="bg-red-50 border-red-200 mb-4">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Results Header with Sort and Filter Controls */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Search Results
            </h2>
            <p className="text-sm text-gray-600">
              {isLoading
                ? "Loading..."
                : `${filteredCorporates.length} total prospects found • Showing ${displayedCorporates.length} results`}
            </p>
          </div>

          {/* Sort and Filter Controls */}
          {!isLoading && filteredCorporates.length > 0 && (
            <div className="flex items-center gap-4">
              {/* Name Filter */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Filter by company name..."
                  value={nameFilter}
                  onChange={(e) => handleNameFilterChange(e.target.value)}
                  className="pl-10 w-64 h-9 cls-search-filter"
                />
                {nameFilter && (
                  <button
                    onClick={() => handleNameFilterChange("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              {/* <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-48 h-9">
                  <div className="flex items-center gap-2">
                    {sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Company Name</SelectItem>
                  <SelectItem value="aiScore">AI Score</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="employees">Employee Count</SelectItem>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="established">Year Established</SelectItem>
                </SelectContent>
              </Select> */}
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-gray-600">Loading corporate data...</span>
        </div>
      )}

      {/* No Results State */}
      {!isLoading && filteredCorporates.length === 0 && !error && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No companies found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or add a new company to get
            started.
          </p>
          <Button
            onClick={() => setShowAddCompanyDialog(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Company
          </Button>
        </div>
      )}

      {/* No Filtered Results State */}
      {!isLoading &&
        filteredCorporates.length > 0 &&
        displayedCorporates.length === 0 &&
        nameFilter.trim() !== "" && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No matches found
            </h3>
            <p className="text-gray-600 mb-4">
              No companies match your filter "{nameFilter}". Try a different
              search term.
            </p>
            <Button
              onClick={() => setNameFilter("")}
              variant="outline"
              className="border-gray-300"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filter
            </Button>
          </div>
        )}

      {/* Results List */}
      {!isLoading && displayedCorporates.length > 0 && (
        <>
          <div className="space-y-4">
            {displayedCorporates.map((corporate) => (
              <Card
                key={corporate.id}
                className="bg-white border border-gray-200"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Company Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>

                    {/* Company Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {corporate.name}
                            </h3>
                            <Badge
                              variant="secondary"
                              className="bg-orange-500 hover:bg-orange-600 text-white text-xs"
                            >
                              AI Score {corporate.aiScore}
                            </Badge>
                          </div>
                          <p className="text-sm text-red-600 mb-1">
                            {corporate.type} • {corporate.industry}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {corporate.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {corporate.employees.toLocaleString()} employees
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Est. {corporate.established}
                            </span>
                            {/* <span className="flex items-center gap-1 cls-link">
                              <Globe className="h-3 w-3" />
                              {corporate.website}
                            </span> */}
                            <a
                              href={corporate.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              <Globe className="h-3 w-3" />
                              {corporate.website}
                            </a>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-medium text-sm">
                              {corporate.rating}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            ${corporate.travelBudget} budget
                          </div>
                        </div>
                      </div>

                      {/* Company Details */}
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-4 text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span>
                            Revenue: ${(corporate.revenue / 1000000).toFixed(1)}
                            M
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-blue-600" />
                          <span>Credit: {corporate.creditRating}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Plane className="h-4 w-4 text-purple-600" />
                          <span>Travel: {corporate.annualTravelVolume}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-orange-600" />
                          <span>Class: {corporate.preferredClass}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-600" />
                          <span>Frequency: {corporate.travelFrequency}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-red-600" />
                          <span>Risk: {corporate.riskLevel}</span>
                        </div>
                      </div>

                      {/* Specialties */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Specialties
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {corporate.specialties.map((specialty, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* AI Recommendation */}
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start gap-2">
                          <Brain className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-blue-900">
                              AI Partnership Recommendation
                            </p>
                            <p className="text-sm text-blue-800 mt-1">
                              {corporate.aiRecommendation}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewProfile(corporate)}
                          className="border-gray-300"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Full Profile
                        </Button>

                        {corporate.move_as_lead ||
                        movedAsLeadIds.has(corporate.id) ||
                        existingLeadCompanies.has(corporate.name) ? (
                          <span className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-800 bg-green-100 border border-green-200 rounded-md">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                            Already moved to Lead
                          </span>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMoveAsLead(corporate)}
                            disabled={isMovingAsLead}
                            className="border-gray-300 cls-addcomapany"
                          >
                            {isMovingAsLead &&
                            selectedCorporateForMove?.id === corporate.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mr-2"></div>
                                Moving...
                              </>
                            ) : (
                              <>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Move as Lead
                              </>
                            )}
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-300"
                          onClick={() => handleContactCorporate(corporate)}
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredCorporates.length,
                  )}{" "}
                  of {filteredCorporates.length} results
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
                      startPage = Math.max(1, endPage - maxVisiblePages + 1);
                    }

                    // Add first page and ellipsis if needed
                    if (startPage > 1) {
                      pages.push(
                        <Button
                          key={1}
                          variant={1 === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(1)}
                          className={`w-9 h-9 p-0 ${1 === currentPage ? "bg-orange-500 hover:bg-orange-600 text-white" : "border-gray-300"}`}
                        >
                          1
                        </Button>,
                      );
                      if (startPage > 2) {
                        pages.push(
                          <span key="ellipsis1" className="px-2 text-gray-500">
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
                          variant={i === currentPage ? "default" : "outline"}
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
                          <span key="ellipsis2" className="px-2 text-gray-500">
                            ...
                          </span>,
                        );
                      }
                      pages.push(
                        <Button
                          key={totalPages}
                          variant={
                            totalPages === currentPage ? "default" : "outline"
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

      {/* Advanced Filters Dialog */}
      <Dialog open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
        <DialogContent
          className="max-w-[60rem] w-[95vw] max-h-[85vh] overflow-y-auto"
          style={{
            maxWidth: "min(var(--modal-width-xl, 80rem), calc(100% - 2rem))",
          }}
        >
          <DialogHeader className="pb-6">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <Filter className="h-6 w-6 text-orange-500" />
              Advanced Search Filters
            </DialogTitle>
            <DialogDescription className="text-base mt-2 cls-gray">
              Apply detailed criteria to discover the most relevant corporate
              travel prospects for your business
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8">
            <Tabs defaultValue="business" className="w-full">
              <TabsList className="grid w-full grid-cols-4 h-12 bg-gray-100 rounded-lg p-1">
                <TabsTrigger
                  value="business"
                  className="text-[14px] px-5 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-orange-500"
                >
                  Business Criteria
                </TabsTrigger>
                <TabsTrigger
                  value="travel"
                  className="text-[14px] px-5 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-orange-500"
                >
                  Travel Patterns
                </TabsTrigger>
                <TabsTrigger
                  value="financial"
                  className="text-[14px] px-5 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-orange-500"
                >
                  Financial Profile
                </TabsTrigger>
                <TabsTrigger
                  value="technology"
                  className="text-[14px] px-5 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-orange-500"
                >
                  Technology & Preferences
                </TabsTrigger>
              </TabsList>

              <TabsContent value="business" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Industry Specialization
                    </Label>
                    <div className="space-y-3">
                      {[
                        "Technology",
                        "Finance",
                        "Manufacturing",
                        "Healthcare",
                        "Energy",
                        "Consulting",
                      ].map((industry) => (
                        <div
                          key={industry}
                          className="flex items-center space-x-3"
                        >
                          <Checkbox
                            id={industry.toLowerCase()}
                            checked={advancedFilters.industries.includes(
                              industry.toLowerCase(),
                            )}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setAdvancedFilters((prev) => ({
                                  ...prev,
                                  industries: [
                                    ...prev.industries,
                                    industry.toLowerCase(),
                                  ],
                                }));
                              } else {
                                setAdvancedFilters((prev) => ({
                                  ...prev,
                                  industries: prev.industries.filter(
                                    (i) => i !== industry.toLowerCase(),
                                  ),
                                }));
                              }
                            }}
                          />
                          <Label
                            htmlFor={industry.toLowerCase()}
                            className="text-sm cursor-pointer"
                          >
                            {industry}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Company Maturity
                    </Label>
                    <div className="space-y-3">
                      {[
                        "Startup (1-3 years)",
                        "Growth (4-10 years)",
                        "Established (11-25 years)",
                        "Enterprise (25+ years)",
                      ].map((maturity) => (
                        <div
                          key={maturity}
                          className="flex items-center space-x-3"
                        >
                          <Checkbox
                            id={maturity.toLowerCase().replace(/\s+/g, "-")}
                          />
                          <Label
                            htmlFor={maturity
                              .toLowerCase()
                              .replace(/\s+/g, "-")}
                            className="text-sm cursor-pointer"
                          >
                            {maturity}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Employee Count Range
                  </Label>
                  <Slider
                    value={advancedFilters.employeeRange}
                    onValueChange={(value) =>
                      setAdvancedFilters((prev) => ({
                        ...prev,
                        employeeRange: value,
                      }))
                    }
                    max={10000}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{advancedFilters.employeeRange[0]}</span>
                    <span>{advancedFilters.employeeRange[1]}+</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="travel" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Travel Frequency
                    </Label>
                    <Select
                      value={advancedFilters.travelFrequency}
                      onValueChange={(value) =>
                        setAdvancedFilters((prev) => ({
                          ...prev,
                          travelFrequency: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily Travel</SelectItem>
                        <SelectItem value="weekly">Weekly Travel</SelectItem>
                        <SelectItem value="monthly">Monthly Travel</SelectItem>
                        <SelectItem value="quarterly">
                          Quarterly Travel
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Preferred Class
                    </Label>
                    <Select
                      value={advancedFilters.preferredClass}
                      onValueChange={(value) =>
                        setAdvancedFilters((prev) => ({
                          ...prev,
                          preferredClass: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select class preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="economy">Economy</SelectItem>
                        <SelectItem value="premium-economy">
                          Premium Economy
                        </SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="first">First Class</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Annual Travel Volume (Trips)
                  </Label>
                  <Slider
                    defaultValue={[1000]}
                    max={20000}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>100</span>
                    <span>20,000+</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="financial" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Annual Revenue Range
                    </Label>
                    <Select
                      value={advancedFilters.revenueRange}
                      onValueChange={(value) =>
                        setAdvancedFilters((prev) => ({
                          ...prev,
                          revenueRange: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select revenue range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-10m">Under $10M</SelectItem>
                        <SelectItem value="10m-50m">$10M - $50M</SelectItem>
                        <SelectItem value="50m-100m">$50M - $100M</SelectItem>
                        <SelectItem value="100m-500m">$100M - $500M</SelectItem>
                        <SelectItem value="above-500m">Above $500M</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Credit Rating</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select minimum rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aaa">AAA</SelectItem>
                        <SelectItem value="aa">AA</SelectItem>
                        <SelectItem value="a">A</SelectItem>
                        <SelectItem value="bbb">BBB</SelectItem>
                        <SelectItem value="bb">BB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Travel Budget Range (Annual)
                  </Label>
                  <Slider
                    defaultValue={[1]}
                    max={10}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>$500K</span>
                    <span>$10M+</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="technology" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Technology Integration Requirements
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        "API Integration",
                        "Mobile App",
                        "Expense Management",
                        "Real-time Booking",
                        "Carbon Tracking",
                        "Reporting Tools",
                      ].map((tech) => (
                        <div key={tech} className="flex items-center space-x-3">
                          <Checkbox
                            id={tech.toLowerCase().replace(/\s+/g, "-")}
                          />
                          <Label
                            htmlFor={tech.toLowerCase().replace(/\s+/g, "-")}
                            className="text-sm cursor-pointer"
                          >
                            {tech}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Sustainability Focus
                    </Label>
                    <Select
                      value={advancedFilters.sustainabilityLevel}
                      onValueChange={(value) =>
                        setAdvancedFilters((prev) => ({
                          ...prev,
                          sustainabilityLevel: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sustainability level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="very-high">Very High</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter className="pt-6 border-t border-gray-300 gap-3">
            <Button
              variant="ghost"
              className="text-gray-500 hover:text-gray-700 cls-addcomapany"
              onClick={() => {
                setAdvancedFilters({
                  industries: [],
                  maturity: [],
                  employeeRange: [100, 10000],
                  travelFrequency: "",
                  preferredClass: "",
                  annualTravelVolume: [100, 20000],
                  revenueRange: "",
                  creditRating: "",
                  travelBudgetRange: [0.5, 10],
                  techRequirements: [],
                  sustainabilityLevel: "",
                });
              }}
            >
              Reset All
            </Button>
            <Button
              variant="outline"
              className="cls-cancel text-gray-500 hover:text-gray-700"
              onClick={() => setShowAdvancedFilters(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowAdvancedFilters(false);
                handleSearch();
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Company Dialog */}
      <Dialog 
        open={showAddCompanyDialog}
        onOpenChange={setShowAddCompanyDialog}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader className="pb-[24px] pt-[0px] pr-[0px] pl-[0px] m-[0px]">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <Plus className="h-6 w-6 text-orange-500" />
              Add New Company
            </DialogTitle>
            <DialogDescription
              className="text-base mt-2"
              style={{ color: "#717182" }}
            >
              Add a new company to the corporate database for potential
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
                  Add Company
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Company Dialog */}
      <Dialog
        open={showUploadCompanyDialog}
        onOpenChange={setShowUploadCompanyDialog}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-green-600" />
              Upload Companies via Excel
            </DialogTitle>
            <DialogDescription>
              Download a template, fill it with company data, and upload it
              here.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Download Template Button */}
            <Button
              variant="outline"
              onClick={handleDownloadSample}
              className="w-full border-gray-300 text-gray-700 flex items-center justify-center"
            >
              <FileText className="h-4 w-4 mr-2" />
              Download Sample Excel Template
            </Button>

            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Drag and drop your Excel file here
              </label>
              <p className="text-xs text-gray-500 mb-4">
                Supports .xlsx and .xls formats. Or click below to browse files.
              </p>

              <div className="mb-4">
                <Button
                  variant="outline"
                  onClick={() =>
                    document.getElementById("file-upload-input")?.click()
                  }
                  className="border-gray-300"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Browse Files
                </Button>
                <Input
                  id="file-upload-input"
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {uploadFile && (
                <p className="text-sm text-gray-800 font-medium">
                  Selected File: {uploadFile.name}
                </p>
              )}
            </div>

            {/* Upload Progress and Error/Success Messages */}
            {isUploading && (
              <div className="mt-4">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Upload Progress
                </Label>
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-sm text-center mt-1">
                  {uploadProgress}% uploaded
                </p>
              </div>
            )}

            {uploadError && (
              <Alert className="bg-red-50 border-red-200 mt-4">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-800">
                  {uploadError}
                </AlertDescription>
              </Alert>
            )}

            {uploadSuccess && (
              <Alert className="bg-green-50 border-green-200 mt-4">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-800">
                  {uploadSuccess}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter className="flex gap-2 pt-6 border-t border-gray-300">
            <Button
              variant="outline"
              onClick={() => {
                setShowUploadCompanyDialog(false);
                setUploadFile(null); // Clear selected file
                setUploadProgress(0);
                setUploadError("");
                setUploadSuccess("");
              }}
              className="text-gray-600 border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!uploadFile || isUploading}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Move as Lead Confirmation Dialog */}
      <Dialog
        open={showMoveAsLeadDialog}
        onOpenChange={setShowMoveAsLeadDialog}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-orange-600" />
              Move Company to Leads
            </DialogTitle>
            <DialogDescription>
              Do you want to move{" "}
              <span className="font-semibold">
                {selectedCorporateForMove?.name}
              </span>{" "}
              as a lead?
            </DialogDescription>
          </DialogHeader>

          {selectedCorporateForMove && (
            <div className="py-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">
                    {selectedCorporateForMove.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-3 w-3" />
                  <span>{selectedCorporateForMove.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-3 w-3" />
                  <span>
                    {selectedCorporateForMove.employees?.toLocaleString()}{" "}
                    employees
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge
                    variant="secondary"
                    className="bg-orange-500 hover:bg-orange-600 text-white text-xs"
                  >
                    AI Score {selectedCorporateForMove.aiScore}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowMoveAsLeadDialog(false);
                setSelectedCorporateForMove(null);
              }}
              disabled={isMovingAsLead}
              className="text-gray-600 border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmMoveAsLead}
              disabled={isMovingAsLead}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isMovingAsLead ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Moving...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Move as Lead
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Lead Dialog - Remains the same, contact is part of the lead/company info */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-orange-600" />
              Contact {contactForm?.corporateData?.name}
            </DialogTitle>
            <DialogDescription>
              Send a personalized message to {contactForm?.corporateData?.name}
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
                  {/* <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="In-Person Meeting">In-Person Meeting</SelectItem> */}
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
                <Label className="text-sm font-medium text-gray-700 mb-2 ">
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
          <DialogFooter className=" flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowContactDialog(false);
                setContactForm({
                  method: "Email",
                  subject: "",
                  message: "",
                  followUpDate: "",
                  followUpMode: "",
                  corporateData: null,
                });
              }}
              className="text-gray-600 border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              className="bg-orange-500 hover:bg-orange-600 text-white"
              disabled={
                !contactForm.subject || !contactForm.message || isSendingMessage
              }
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
    </div>
  );
}