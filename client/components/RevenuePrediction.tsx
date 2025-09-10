import { useState, useEffect } from "react";
import { useRevenueApi } from "../hooks/api/useRevenueApi";
import { useLeadApi } from "../hooks/api/useLeadApi";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
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
} from "./ui/dialog";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Download,
  Filter,
  RefreshCw,
  Settings,
  AlertTriangle,
  CheckCircle,
  Activity,
  Building2,
  Users,
  Calculator,
  Zap,
  Brain,
  Globe,
  Clock,
  ArrowUp,
  ArrowDown,
  Eye,
  Lightbulb,
  Sparkles,
  Database,
  TrendingRight,
  X,
  Info,
  Star,
  Award,
  ChevronRight,
  BarChart2,
  Plane,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  Calendar as CalendarIcon,
  Briefcase,
  Package,
  FileText,
  Percent,
  Timer,
  Route,
  Hotel,
  Car,
  Upload,
  Loader2,
} from "lucide-react";

interface RevenuePredictionProps {
  onNavigate: (screen: string, filters?: any) => void;
}

// Mock data for revenue predictions
const monthlyPredictions = [
  {
    month: "Jan 2024",
    actualRevenue: 2850000,
    predictedRevenue: 2900000,
    deals: 45,
    confidence: 92,
  },
  {
    month: "Feb 2024",
    actualRevenue: 3200000,
    predictedRevenue: 3100000,
    deals: 52,
    confidence: 89,
  },
  {
    month: "Mar 2024",
    actualRevenue: 2980000,
    predictedRevenue: 3000000,
    deals: 48,
    confidence: 91,
  },
  {
    month: "Apr 2024",
    actualRevenue: 3400000,
    predictedRevenue: 3350000,
    deals: 56,
    confidence: 94,
  },
  {
    month: "May 2024",
    actualRevenue: 3650000,
    predictedRevenue: 3600000,
    deals: 61,
    confidence: 88,
  },
  {
    month: "Jun 2024",
    actualRevenue: 3800000,
    predictedRevenue: 3750000,
    deals: 63,
    confidence: 90,
  },
  {
    month: "Jul 2024",
    actualRevenue: null,
    predictedRevenue: 4100000,
    deals: 68,
    confidence: 87,
  },
  {
    month: "Aug 2024",
    actualRevenue: null,
    predictedRevenue: 4350000,
    deals: 72,
    confidence: 85,
  },
  {
    month: "Sep 2024",
    actualRevenue: null,
    predictedRevenue: 4200000,
    deals: 70,
    confidence: 83,
  },
  {
    month: "Oct 2024",
    actualRevenue: null,
    predictedRevenue: 4500000,
    deals: 75,
    confidence: 81,
  },
  {
    month: "Nov 2024",
    actualRevenue: null,
    predictedRevenue: 4800000,
    deals: 80,
    confidence: 79,
  },
  {
    month: "Dec 2024",
    actualRevenue: null,
    predictedRevenue: 5200000,
    deals: 85,
    confidence: 77,
  },
];

const yearlyPredictions = [
  {
    year: "2022",
    actualRevenue: 32500000,
    predictedRevenue: 32800000,
    deals: 580,
    growth: 15.2,
  },
  {
    year: "2023",
    actualRevenue: 38200000,
    predictedRevenue: 38000000,
    deals: 665,
    growth: 17.5,
  },
  {
    year: "2024",
    actualRevenue: null,
    predictedRevenue: 48500000,
    deals: 790,
    growth: 27.0,
  },
  {
    year: "2025",
    actualRevenue: null,
    predictedRevenue: 62800000,
    deals: 950,
    growth: 29.5,
  },
  {
    year: "2026",
    actualRevenue: null,
    predictedRevenue: 81200000,
    deals: 1150,
    growth: 29.3,
  },
];

const corporatePredictions = [
  {
    company: "Global Tech Industries",
    currentRevenue: 2400000,
    predictedRevenue: 3200000,
    growth: 33.3,
    confidence: 89,
    deals: 12,
    probability: "High",
  },
  {
    company: "Enterprise Solutions Inc",
    currentRevenue: 1800000,
    predictedRevenue: 2600000,
    growth: 44.4,
    confidence: 92,
    deals: 8,
    probability: "Very High",
  },
  {
    company: "Innovation Labs Corp",
    currentRevenue: 1500000,
    predictedRevenue: 2100000,
    growth: 40.0,
    confidence: 85,
    deals: 6,
    probability: "High",
  },
  {
    company: "Digital Dynamics Ltd",
    currentRevenue: 2200000,
    predictedRevenue: 2800000,
    growth: 27.3,
    confidence: 87,
    deals: 10,
    probability: "High",
  },
  {
    company: "Business Systems Group",
    currentRevenue: 1200000,
    predictedRevenue: 1800000,
    growth: 50.0,
    confidence: 83,
    deals: 5,
    probability: "Medium",
  },
  {
    company: "Advanced Manufacturing Co",
    currentRevenue: 3000000,
    predictedRevenue: 3600000,
    growth: 20.0,
    confidence: 91,
    deals: 15,
    probability: "Very High",
  },
];

// Generate detailed company-specific predictions
const generateCompanyPredictions = (companyName: string) => {
  const baseRevenue =
    corporatePredictions.find((c) => c.company === companyName)
      ?.currentRevenue || 2000000;
  const growthRate =
    corporatePredictions.find((c) => c.company === companyName)?.growth || 25;

  const monthlyData = [
    {
      month: "Jan 2024",
      actual: Math.round(baseRevenue * 0.07),
      predicted: Math.round(baseRevenue * 0.08),
      confidence: 94,
    },
    {
      month: "Feb 2024",
      actual: Math.round(baseRevenue * 0.08),
      predicted: Math.round(baseRevenue * 0.085),
      confidence: 91,
    },
    {
      month: "Mar 2024",
      actual: Math.round(baseRevenue * 0.075),
      predicted: Math.round(baseRevenue * 0.078),
      confidence: 89,
    },
    {
      month: "Apr 2024",
      actual: Math.round(baseRevenue * 0.09),
      predicted: Math.round(baseRevenue * 0.092),
      confidence: 93,
    },
    {
      month: "May 2024",
      actual: Math.round(baseRevenue * 0.095),
      predicted: Math.round(baseRevenue * 0.098),
      confidence: 87,
    },
    {
      month: "Jun 2024",
      actual: Math.round(baseRevenue * 0.1),
      predicted: Math.round(baseRevenue * 0.102),
      confidence: 90,
    },
    {
      month: "Jul 2024",
      actual: null,
      predicted: Math.round(baseRevenue * 0.11),
      confidence: 85,
    },
    {
      month: "Aug 2024",
      actual: null,
      predicted: Math.round(baseRevenue * 0.115),
      confidence: 83,
    },
    {
      month: "Sep 2024",
      actual: null,
      predicted: Math.round(baseRevenue * 0.12),
      confidence: 81,
    },
    {
      month: "Oct 2024",
      actual: null,
      predicted: Math.round(baseRevenue * 0.125),
      confidence: 79,
    },
    {
      month: "Nov 2024",
      actual: null,
      predicted: Math.round(baseRevenue * 0.13),
      confidence: 77,
    },
    {
      month: "Dec 2024",
      actual: null,
      predicted: Math.round(baseRevenue * 0.135),
      confidence: 75,
    },
  ];

  const yearlyData = [
    {
      year: "2022",
      actual: Math.round(baseRevenue * 0.85),
      predicted: Math.round(baseRevenue * 0.87),
      growth: 12.5,
    },
    {
      year: "2023",
      actual: baseRevenue,
      predicted: Math.round(baseRevenue * 0.98),
      growth: 17.6,
    },
    {
      year: "2024",
      actual: null,
      predicted: Math.round(baseRevenue * (1 + growthRate / 100)),
      growth: growthRate,
    },
    {
      year: "2025",
      actual: null,
      predicted: Math.round(baseRevenue * (1 + growthRate / 100) * 1.25),
      growth: growthRate + 5,
    },
    {
      year: "2026",
      actual: null,
      predicted: Math.round(baseRevenue * (1 + growthRate / 100) * 1.5),
      growth: growthRate + 3,
    },
  ];

  const quarterlyData = [
    {
      quarter: "Q1 2024",
      actual: Math.round(baseRevenue * 0.23),
      predicted: Math.round(baseRevenue * 0.245),
      variance: 6.5,
    },
    {
      quarter: "Q2 2024",
      actual: Math.round(baseRevenue * 0.285),
      predicted: Math.round(baseRevenue * 0.278),
      variance: -2.5,
    },
    {
      quarter: "Q3 2024",
      actual: null,
      predicted: Math.round(baseRevenue * 0.345),
      variance: null,
    },
    {
      quarter: "Q4 2024",
      actual: null,
      predicted: Math.round(baseRevenue * 0.395),
      variance: null,
    },
  ];

  return { monthlyData, yearlyData, quarterlyData };
};

// Business statistics data
const businessStats = {
  totalBookings: 15847,
  totalRevenue: 48500000,
  averageBookingValue: 3058,
  totalFlights: 12456,
  totalHotels: 8234,
  totalCars: 3567,
  activeClients: 1247,
  newClientsThisMonth: 89,
  bookingGrowthRate: 23.5,
  revenueGrowthRate: 27.2,
  clientRetentionRate: 87.3,
  averageLeadTime: 14.2,
  cancelationRate: 3.8,
  repeatBookingRate: 64.2,
  avgDealClosure: 28,
  topDestinations: [
    { city: "New York", bookings: 2345, revenue: 8900000 },
    { city: "London", bookings: 1876, revenue: 7200000 },
    { city: "Tokyo", bookings: 1456, revenue: 6100000 },
    { city: "Singapore", bookings: 1234, revenue: 5400000 },
    { city: "Dubai", bookings: 1123, revenue: 4800000 },
  ],
  bookingTrends: [
    { month: "Jan 2024", bookings: 1234, revenue: 3890000, growth: 12.3 },
    { month: "Feb 2024", bookings: 1567, revenue: 4560000, growth: 26.9 },
    { month: "Mar 2024", bookings: 1345, revenue: 4120000, growth: 8.9 },
    { month: "Apr 2024", bookings: 1678, revenue: 5230000, growth: 24.7 },
    { month: "May 2024", bookings: 1789, revenue: 5680000, growth: 33.1 },
    { month: "Jun 2024", bookings: 1456, revenue: 4890000, growth: 18.5 },
  ],
};

const predictionModels = [
  {
    name: "AI Neural Network",
    accuracy: 94.2,
    description: "Deep learning model trained on historical data patterns",
    lastUpdated: "2024-07-15",
    status: "active",
  },
  {
    name: "Regression Analysis",
    accuracy: 89.7,
    description: "Statistical regression with seasonal adjustments",
    lastUpdated: "2024-07-14",
    status: "active",
  },
  {
    name: "Time Series Forecasting",
    accuracy: 91.3,
    description: "ARIMA model with trend and seasonality components",
    lastUpdated: "2024-07-13",
    status: "active",
  },
  {
    name: "Market Intelligence",
    accuracy: 87.1,
    description: "Industry trends and market condition analysis",
    lastUpdated: "2024-07-12",
    status: "secondary",
  },
];

const keyMetrics = {
  totalPipelineValue: 125000000,
  weightedPipelineValue: 68000000,
  averageDealSize: 850000,
  conversionRate: 23.5,
  salesCycleLength: 45,
  forecastAccuracy: 91.8,
  quarterlyGrowthRate: 28.5,
  yearOverYearGrowth: 27.0,
};

const scenarioPlanning = [
  {
    scenario: "Conservative",
    probability: 85,
    q3Revenue: 12500000,
    q4Revenue: 14200000,
    yearEndRevenue: 45800000,
    description: "Cautious growth with market uncertainties",
  },
  {
    scenario: "Realistic",
    probability: 70,
    q3Revenue: 13800000,
    q4Revenue: 16200000,
    yearEndRevenue: 48500000,
    description: "Expected growth based on current trends",
  },
  {
    scenario: "Optimistic",
    probability: 45,
    q3Revenue: 15200000,
    q4Revenue: 18800000,
    yearEndRevenue: 52600000,
    description: "Aggressive growth with favorable conditions",
  },
];

export function RevenuePrediction({ onNavigate }: RevenuePredictionProps) {
  const { uploadRevenueData, getRevenuePredictionData } = useRevenueApi();
  const { getAirportCodes } = useLeadApi();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTimeframe, setSelectedTimeframe] = useState("yearly");
  const [selectedModel, setSelectedModel] = useState("AI Neural Network");
  const [selectedScenario, setSelectedScenario] = useState("Realistic");
  const [showCompanyDrillDown, setShowCompanyDrillDown] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [companyDrillDownTab, setCompanyDrillDownTab] = useState("monthly");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [fileInfo, setFileInfo] = useState<{
    rows: number;
    columns: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ name: string; size: number; uploadDate: string }>
  >([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dynamicData, setDynamicData] = useState<any>(null);
  const [dataSource, setDataSource] = useState<string>("static");
  const [airportCodes, setAirportCodes] = useState<{[key: string]: {name: string, city: string, country: string}}>({});
  const [filters, setFilters] = useState({
    region: "all",
    industry: "all",
    dealSize: "all",
    confidence: "all",
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600";
    if (confidence >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const getGrowthColor = (growth: number) => {
    if (growth >= 30) return "text-green-600";
    if (growth >= 20) return "text-blue-600";
    if (growth >= 10) return "text-yellow-600";
    return "text-red-600";
  };

  const getProbabilityColor = (probability: string) => {
    switch (probability) {
      case "Very High":
        return "bg-green-100 text-green-800";
      case "High":
        return "bg-blue-100 text-blue-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewCompany = (corporate: any) => {
    setSelectedCompany(corporate);
    setShowCompanyDrillDown(true);
    setCompanyDrillDownTab("monthly");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadFile(file);
      setUploadError("");
      setUploadSuccess("");
      setFileInfo(null);
      analyzeFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (
        file.type === "text/csv" ||
        file.name.endsWith(".csv") ||
        file.name.endsWith(".xlsx") ||
        file.name.endsWith(".xls")
      ) {
        setUploadFile(file);
        setUploadError("");
        setUploadSuccess("");
        setFileInfo(null);
        analyzeFile(file);
      } else {
        setUploadError("Please upload a CSV or Excel file.");
      }
    }
  };

  const analyzeFile = async (file: File) => {
    try {
      if (file.name.endsWith(".csv")) {
        const text = await file.text();
        const lines = text.split("\n").filter((line) => line.trim());
        const columns = lines[0] ? lines[0].split(",").length : 0;
        setFileInfo({ rows: lines.length - 1, columns });
      } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        // For Excel files, we'll show estimated info
        setFileInfo({ rows: 0, columns: 0 });
      }
    } catch (error) {
      console.error("Error analyzing file:", error);
    }
  };

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
      const result = await uploadRevenueData(uploadFile, (progress) => {
        setUploadProgress(progress);
      });

      setUploadProgress(100);
      setUploadSuccess(
        `File "${uploadFile.name}" uploaded successfully to revenue_prediction folder! ${result.rows > 0 ? `(${result.rows} rows, ${result.columns} columns)` : ""}`,
      );

      // Update file info with server response
      if (result.rows > 0) {
        setFileInfo({ rows: result.rows, columns: result.columns });
      }

      setTimeout(() => {
        setShowUploadDialog(false);
        setUploadFile(null);
        setFileInfo(null);
        setUploadProgress(0);
        setUploadSuccess("");
      }, 2000);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadError(
        `Failed to upload file: ${error.message || "Please try again."}`,
      );
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setUploadFile(null);
    setFileInfo(null);
    setUploadError("");
    setUploadSuccess("");
    setUploadProgress(0);
    setIsDragging(false);
  };

  const fetchUploadedFiles = async () => {
    setIsLoadingFiles(true);
    try {
      // Call API to get real files from revenue_prediction folder
      const response = await fetch("/api/list-revenue-files/");
      const data = await response.json();

      if (response.ok && data.success) {
        setUploadedFiles(data.files || []);
      } else {
        throw new Error(data.error || "Failed to fetch files");
      }
    } catch (error) {
      console.error("Error fetching uploaded files:", error);
      setUploadError("Failed to load uploaded files");
      setUploadedFiles([]); // Set empty array on error
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleDeleteFile = async (fileName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${fileName}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/delete-revenue-file/${encodeURIComponent(fileName)}/`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setUploadedFiles((prev) =>
          prev.filter((file) => file.name !== fileName),
        );
        setUploadSuccess(`File "${fileName}" deleted successfully`);

        setTimeout(() => {
          setUploadSuccess("");
        }, 2000);
      } else {
        throw new Error(data.error || "Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      setUploadError(`Failed to delete "${fileName}". Please try again.`);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatUploadDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      const response = await getRevenuePredictionData();

      if (response.success) {
        setDynamicData(response.data);
        setDataSource("dynamic");
        setUploadSuccess(
          `Data refreshed successfully from ${response.source_file}! Using dynamic data from revenue prediction files.`,
        );

        setTimeout(() => {
          setUploadSuccess("");
        }, 3000);
      } else {
        throw new Error(response.error || "Failed to fetch dynamic data");
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      setUploadError(
        `Failed to load dynamic data: ${error.message}. Using static data instead.`,
      );
      setDataSource("static");
      setDynamicData(null);

      setTimeout(() => {
        setUploadError("");
      }, 5000);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Load airport codes
  useEffect(() => {
    const loadAirportCodes = async () => {
      try {
        const codes = await getAirportCodes();
        setAirportCodes(codes);
      } catch (error) {
        console.error("Failed to load airport codes:", error);
      }
    };

    loadAirportCodes();
  }, [getAirportCodes]);

  // Function to get current data (dynamic or static)
  const getCurrentBusinessStats = () => {
    if (dataSource === "dynamic" && dynamicData) {
      // Merge businessPerformanceOverview and businessStats from dynamic data
      return {
        totalBookings:
          dynamicData.businessPerformanceOverview?.totalBookings ||
          businessStats.totalBookings,
        totalRevenue:
          dynamicData.businessPerformanceOverview?.totalRevenue ||
          businessStats.totalRevenue,
        averageBookingValue:
          dynamicData.businessPerformanceOverview?.avgBookingValue ||
          businessStats.averageBookingValue,
        totalFlights: Math.round(
          (dynamicData.businessPerformanceOverview?.totalBookings ||
            businessStats.totalBookings) * 0.78,
        ), // 78% flights
        totalHotels: Math.round(
          (dynamicData.businessPerformanceOverview?.totalBookings ||
            businessStats.totalBookings) * 0.52,
        ), // 52% hotels
        totalCars: Math.round(
          (dynamicData.businessPerformanceOverview?.totalBookings ||
            businessStats.totalBookings) * 0.22,
        ), // 22% cars
        activeClients:
          dynamicData.businessPerformanceOverview?.activeClients ||
          businessStats.activeClients,
        newClientsThisMonth:
          dynamicData.businessStats?.newClientsThisMonth ||
          businessStats.newClientsThisMonth,
        bookingGrowthRate:
          dynamicData.businessStats?.bookingGrowthRate ||
          businessStats.bookingGrowthRate,
        revenueGrowthRate:
          dynamicData.businessStats?.revenueGrowthRate ||
          businessStats.revenueGrowthRate,
        clientRetentionRate:
          dynamicData.businessStats?.clientRetentionRate ||
          businessStats.clientRetentionRate,
        averageLeadTime:
          dynamicData.businessStats?.averageLeadTime ||
          businessStats.averageLeadTime,
        cancelationRate:
          dynamicData.businessStats?.cancelationRate ||
          businessStats.cancelationRate,
        repeatBookingRate:
          dynamicData.businessStats?.repeatBookingRate ||
          businessStats.repeatBookingRate,
        avgDealClosure:
          dynamicData.businessStats?.avgDealClosure ||
          businessStats.avgDealClosure,
        topDestinations: getCurrentTopDestinations(),
      };
    }
    return businessStats;
  };

  const getCurrentKeyMetrics = () => {
    if (dataSource === "dynamic" && dynamicData) {
      return {
        totalPipelineValue:
          dynamicData.keyMetrics?.totalPipelineValue ||
          keyMetrics.totalPipelineValue,
        weightedPipelineValue:
          dynamicData.keyMetrics?.weightedPipelineValue ||
          keyMetrics.weightedPipelineValue,
        averageDealSize:
          dynamicData.keyMetrics?.averageDealSize || keyMetrics.averageDealSize,
        conversionRate:
          dynamicData.keyMetrics?.conversionRate || keyMetrics.conversionRate,
        salesCycleLength:
          dynamicData.keyMetrics?.salesCycleLength ||
          keyMetrics.salesCycleLength,
        forecastAccuracy:
          dynamicData.keyMetrics?.forecastAccuracy ||
          keyMetrics.forecastAccuracy,
        quarterlyGrowthRate:
          dynamicData.keyMetrics?.quarterlyGrowthRate ||
          keyMetrics.quarterlyGrowthRate,
        yearOverYearGrowth:
          dynamicData.keyMetrics?.yearOverYearGrowth ||
          keyMetrics.yearOverYearGrowth,
      };
    }
    return keyMetrics;
  };

  const getCurrentMonthlyPredictions = () => {
    if (
      dataSource === "dynamic" &&
      dynamicData &&
      dynamicData.monthlyBookingTrends
    ) {
      // Transform monthly booking trends to monthly predictions format
      return dynamicData.monthlyBookingTrends.map((trend, index) => ({
        month: trend.month,
        actualRevenue: trend.revenue,
        predictedRevenue: Math.round(trend.revenue * 1.1), // 10% prediction boost
        deals: Math.round(trend.bookings / 2), // Estimate deals as half of bookings
        confidence: 92 - index * 2, // Decreasing confidence over time
      }));
    }
    return monthlyPredictions;
  };

  const getCurrentTopDestinations = () => {
    if (
      dataSource === "dynamic" &&
      dynamicData &&
      dynamicData.topDestinations
    ) {
      console.log(airportCodes,"dynamicData")
      return dynamicData.topDestinations.map((dest) => ({
        city: airportCodes[dest.Destination_Airport_Code]?.name || dest.Destination_Airport_Code, // Use airport name if found, else code
        bookings: dest.bookings,
        revenue: dest.revenue,
      }));
    }
    return businessStats.topDestinations.map((dest) => ({
      city: dest.city, // Use city name from static data
      bookings: dest.bookings,
      revenue: dest.revenue,
    }));
  };

  // Load revenue prediction data on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsRefreshing(true);
        const response = await getRevenuePredictionData();

        if (response.success) {
          setDynamicData(response.data);
          setDataSource("dynamic");
          console.log(
            "Initial revenue prediction data loaded successfully:",
            response.data,
          );
        } else {
          console.log("No dynamic data available, using static data");
          setDataSource("static");
          setDynamicData(null);
        }
      } catch (error) {
        console.error("Error loading initial revenue prediction data:", error);
        setDataSource("static");
        setDynamicData(null);
      } finally {
        setIsRefreshing(false);
      }
    };

    loadInitialData();
  }, []);

  return (
    <div className="space-y-6 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            Revenue Prediction Analytics
          </h2>
          <p className="text-muted-foreground">
            AI-powered revenue forecasting and sales predictions
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setShowUploadDialog(true);
              fetchUploadedFiles();
            }}
            className="cls-addcomapany"
          >
            <Upload className="h-4 w-4 mr-2 " />
            Upload Data
          </Button>
          <Button variant="outline" className="cls-addcomapany">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button
            variant="outline"
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="cls-addcomapany"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Refreshing..." : "Refresh Data"}
          </Button>
        </div>
      </div>

      {/* Data Source Indicator */}
      {dataSource === "dynamic" && dynamicData && (
        <div className="mb-4">
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">
                Using Dynamic Data from:{" "}
                {dynamicData.dataSource?.filename || dynamicData.source_file}
              </p>
              <p className="text-xs text-green-600">
                {dynamicData.dataSource?.totalRows || "Unknown"} rows processed,
                Total Revenue: $
                {(
                  dynamicData.dataSource?.totalRevenue ||
                  dynamicData.businessPerformanceOverview?.totalRevenue ||
                  0
                ).toLocaleString()}
              </p>
              {dynamicData.insights && (
                <div className="mt-2">
                  <p className="text-xs text-green-600 font-medium">
                    Key Insights:
                  </p>
                  <ul className="text-xs text-green-600 ml-2">
                    {dynamicData.insights.slice(0, 2).map((insight, index) => (
                      <li key={index}>• {typeof insight === 'string' ? insight : JSON.stringify(insight)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Messages */}
      {uploadSuccess && (
        <div className="mb-4">
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-sm text-green-700">{uploadSuccess}</p>
          </div>
        </div>
      )}

      {uploadError && (
        <div className="mb-4">
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <p className="text-sm text-red-700">{uploadError}</p>
          </div>
        </div>
      )}

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pipeline Value
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(getCurrentKeyMetrics().totalPipelineValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last quarter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Forecast Accuracy
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(getCurrentKeyMetrics().forecastAccuracy)}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.3%</span> improvement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              YoY Growth Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(getCurrentKeyMetrics().yearOverYearGrowth)}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">Above target</span> of 25%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Deal Size
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(getCurrentKeyMetrics().averageDealSize)}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> increase
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6 bg-gray-50/50 p-1 rounded-xl border border-gray-200/50">
          <TabsTrigger
            value="overview"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="monthly"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            Monthly Forecast
          </TabsTrigger>
          <TabsTrigger
            value="yearly"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            Yearly Forecast
          </TabsTrigger>
          <TabsTrigger
            value="corporate"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            Corporate Analysis
          </TabsTrigger>
          <TabsTrigger
            value="scenarios"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            Scenario Planning
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Business Statistics Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Business Performance Overview
              </CardTitle>
              <CardDescription>
                Comprehensive statistics on bookings, revenue, and key business
                metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card
                  className="border-2"
                  style={{
                    borderColor: "var(--color-blue-brand-200)",
                    backgroundColor: "var(--color-blue-brand-50)",
                  }}
                >
                  <CardContent className="p-4 text-center">
                    <Package
                      className="h-6 w-6 mx-auto mb-2"
                      style={{ color: "var(--color-blue-brand-600)" }}
                    />
                    <div className="text-2xl font-bold">
                      {formatNumber(getCurrentBusinessStats().totalBookings)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Bookings
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "var(--color-blue-brand-600)" }}
                    >
                      +
                      {formatPercentage(
                        getCurrentBusinessStats().bookingGrowthRate,
                      )}{" "}
                      YoY
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="border-2"
                  style={{
                    borderColor: "var(--color-blue-brand-200)",
                    backgroundColor: "var(--color-blue-brand-50)",
                  }}
                >
                  <CardContent className="p-4 text-center">
                    <DollarSign
                      className="h-6 w-6 mx-auto mb-2"
                      style={{ color: "var(--color-blue-brand-600)" }}
                    />
                    <div className="text-2xl font-bold">
                      {formatCurrency(getCurrentBusinessStats().totalRevenue)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Revenue
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "var(--color-blue-brand-600)" }}
                    >
                      +
                      {formatPercentage(
                        getCurrentBusinessStats().revenueGrowthRate,
                      )}{" "}
                      YoY
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="border-2"
                  style={{
                    borderColor: "var(--color-blue-brand-200)",
                    backgroundColor: "var(--color-blue-brand-50)",
                  }}
                >
                  <CardContent className="p-4 text-center">
                    <Building2
                      className="h-6 w-6 mx-auto mb-2"
                      style={{ color: "var(--color-blue-brand-600)" }}
                    />
                    <div className="text-2xl font-bold">
                      {formatNumber(getCurrentBusinessStats().activeClients)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Active Clients
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "var(--color-blue-brand-600)" }}
                    >
                      +{getCurrentBusinessStats().newClientsThisMonth} this
                      month
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="border-2"
                  style={{
                    borderColor: "var(--color-blue-brand-200)",
                    backgroundColor: "var(--color-blue-brand-50)",
                  }}
                >
                  <CardContent className="p-4 text-center">
                    <Calculator
                      className="h-6 w-6 mx-auto mb-2"
                      style={{ color: "var(--color-blue-brand-600)" }}
                    />
                    <div className="text-2xl font-bold">
                      {formatCurrency(
                        getCurrentBusinessStats().averageBookingValue,
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Avg Booking Value
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "var(--color-blue-brand-600)" }}
                    >
                      +15% increase
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Travel Services Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5" />
                Travel Services Breakdown
              </CardTitle>
              <CardDescription>
                Distribution of bookings across different travel services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Plane className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">Flights</div>
                      <div className="text-sm text-muted-foreground">
                        {formatNumber(getCurrentBusinessStats().totalFlights)}{" "}
                        bookings
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      {formatPercentage(
                        (getCurrentBusinessStats().totalFlights /
                          getCurrentBusinessStats().totalBookings) *
                          100,
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      of total
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Hotel className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">Hotels</div>
                      <div className="text-sm text-muted-foreground">
                        {formatNumber(getCurrentBusinessStats().totalHotels)}{" "}
                        bookings
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      {formatPercentage(
                        (getCurrentBusinessStats().totalHotels /
                          getCurrentBusinessStats().totalBookings) *
                          100,
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      of total
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Car className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium">Car Rentals</div>
                      <div className="text-sm text-muted-foreground">
                        {formatNumber(getCurrentBusinessStats().totalCars)}{" "}
                        bookings
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      {formatPercentage(
                        (getCurrentBusinessStats().totalCars /
                          getCurrentBusinessStats().totalBookings) *
                          100,
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      of total
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Key Performance Indicators
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Client Retention Rate</span>
                    <span className="font-medium">
                      {formatPercentage(
                        getCurrentBusinessStats().clientRetentionRate,
                      )}
                    </span>
                  </div>
                  <Progress
                    value={getCurrentBusinessStats().clientRetentionRate}
                    className="h-2"
                  />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Repeat Booking Rate</span>
                    <span className="font-medium">
                      {formatPercentage(
                        getCurrentBusinessStats().repeatBookingRate,
                      )}
                    </span>
                  </div>
                  <Progress
                    value={getCurrentBusinessStats().repeatBookingRate}
                    className="h-2"
                  />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Lead Time</span>
                    <span className="font-medium">
                      {getCurrentBusinessStats().averageLeadTime} days
                    </span>
                  </div>
                  <Progress
                    value={
                      (getCurrentBusinessStats().averageLeadTime / 30) * 100
                    }
                    className="h-2"
                  />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Deal Closure Time</span>
                    <span className="font-medium">
                      {getCurrentBusinessStats().avgDealClosure} days
                    </span>
                  </div>
                  <Progress
                    value={
                      (getCurrentBusinessStats().avgDealClosure / 60) * 100
                    }
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Top Destinations
                </CardTitle>
                <CardDescription>
                  Most popular travel destinations by booking volume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getCurrentTopDestinations().map((destination, index) => (
                    <div
                      key={destination.city}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{destination.city}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatNumber(destination.bookings)} bookings
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {formatCurrency(destination.revenue)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          revenue
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Monthly Booking Trends
              </CardTitle>
              <CardDescription>
                Monthly performance trends showing bookings, revenue, and growth
                rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(dataSource === "dynamic" && dynamicData?.monthlyBookingTrends
                  ? dynamicData.monthlyBookingTrends
                  : businessStats.bookingTrends
                ).map((trend) => {
                  const growthRate =
                    trend.growth ||
                    (dataSource === "dynamic"
                      ? getCurrentBusinessStats().revenueGrowthRate
                      : trend.growth);
                  return (
                    <div
                      key={trend.month}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-medium w-20">
                          {trend.month}
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="font-medium">
                              {formatNumber(trend.bookings)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Bookings
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">
                              {formatCurrency(trend.revenue)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Revenue
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex items-center gap-1 ${growthRate >= 20 ? "text-green-600" : growthRate >= 10 ? "text-blue-600" : "text-yellow-600"}`}
                        >
                          {growthRate >= 0 ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          <span className="font-medium">
                            {formatPercentage(growthRate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">
                      Strong Q3 Performance Expected
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Revenue projected to exceed target by 12%
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Enterprise Segment Growth</p>
                    <p className="text-sm text-muted-foreground">
                      Large deals increasing average contract value
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Seasonal Dip in December</p>
                    <p className="text-sm text-muted-foreground">
                      Plan for typical holiday season slowdown
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="font-medium">2025 Pipeline Building</p>
                    <p className="text-sm text-muted-foreground">
                      Early indicators show 29% growth potential
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-500" />
                  Data Quality & Coverage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Historical Sales Data</span>
                    <Badge variant="outline">100% Complete</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Market Intelligence</span>
                    <Badge variant="outline">Real-time</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Economic Indicators</span>
                    <Badge variant="outline">Daily Updates</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Industry Trends</span>
                    <Badge variant="outline">Weekly Sync</Badge>
                  </div>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      Prediction Confidence
                    </span>
                    <span className="text-sm font-medium">91.8%</span>
                  </div>
                  <Progress value={91.8} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Based on 36 months of historical data and current market
                    conditions
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Monthly Revenue Predictions
                  </CardTitle>
                  <CardDescription>
                    Detailed month-by-month revenue forecasting with confidence
                    intervals
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select
                    value={selectedModel}
                    onValueChange={setSelectedModel}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {predictionModels.map((model) => (
                        <SelectItem key={model.name} value={model.name}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Actual Revenue</TableHead>
                      <TableHead>Predicted Revenue</TableHead>
                      <TableHead>Variance</TableHead>
                      <TableHead>Deals</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getCurrentMonthlyPredictions().map((prediction) => {
                      const variance = prediction.actualRevenue
                        ? ((prediction.actualRevenue -
                            prediction.predictedRevenue) /
                            prediction.predictedRevenue) *
                          100
                        : null;

                      return (
                        <TableRow key={prediction.month}>
                          <TableCell className="font-medium">
                            {prediction.month}
                          </TableCell>
                          <TableCell>
                            {prediction.actualRevenue ? (
                              formatCurrency(prediction.actualRevenue)
                            ) : (
                              <span className="text-muted-foreground">
                                Pending
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(prediction.predictedRevenue)}
                          </TableCell>
                          <TableCell>
                            {variance !== null ? (
                              <span
                                className={
                                  variance >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {variance >= 0 ? "+" : ""}
                                {formatPercentage(variance)}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>{prediction.deals}</TableCell>
                          <TableCell>
                            <span
                              className={getConfidenceColor(
                                prediction.confidence,
                              )}
                            >
                              {formatPercentage(prediction.confidence)}
                            </span>
                          </TableCell>
                          <TableCell>
                            {prediction.month.includes("2024") &&
                            !prediction.actualRevenue ? (
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-4 w-4 text-green-600" />
                                <span className="text-sm text-green-600">
                                  Growing
                                </span>
                              </div>
                            ) : prediction.actualRevenue ? (
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-4 w-4 text-blue-600" />
                                <span className="text-sm text-blue-600">
                                  Actual
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-400">
                                  Future
                                </span>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="yearly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Yearly Revenue Forecasting
              </CardTitle>
              <CardDescription>
                Long-term revenue projections with growth analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-2 border-blue-200 bg-blue-50">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        2024
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Current Year
                      </div>
                      <div className="text-lg font-medium mt-2">
                        {formatCurrency(48500000)}
                      </div>
                      <div className="text-sm text-green-600">+27% growth</div>
                    </CardContent>
                  </Card>
                  <Card className="border-2 border-green-200 bg-green-50">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        2025
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Next Year
                      </div>
                      <div className="text-lg font-medium mt-2">
                        {formatCurrency(62800000)}
                      </div>
                      <div className="text-sm text-green-600">
                        +29.5% growth
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-2 border-purple-200 bg-purple-50">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        2026
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Long-term
                      </div>
                      <div className="text-lg font-medium mt-2">
                        {formatCurrency(81200000)}
                      </div>
                      <div className="text-sm text-green-600">
                        +29.3% growth
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Year</TableHead>
                        <TableHead>Actual Revenue</TableHead>
                        <TableHead>Predicted Revenue</TableHead>
                        <TableHead>Total Deals</TableHead>
                        <TableHead>Growth Rate</TableHead>
                        <TableHead>Accuracy</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {yearlyPredictions.map((prediction) => (
                        <TableRow key={prediction.year}>
                          <TableCell className="font-medium">
                            {prediction.year}
                          </TableCell>
                          <TableCell>
                            {prediction.actualRevenue ? (
                              formatCurrency(prediction.actualRevenue)
                            ) : (
                              <span className="text-muted-foreground">
                                Projected
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(prediction.predictedRevenue)}
                          </TableCell>
                          <TableCell>{prediction.deals}</TableCell>
                          <TableCell>
                            <span className={getGrowthColor(prediction.growth)}>
                              +{formatPercentage(prediction.growth)}
                            </span>
                          </TableCell>
                          <TableCell>
                            {prediction.actualRevenue ? (
                              <Badge
                                variant="outline"
                                className="text-green-600"
                              >
                                Verified
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Forecast</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="corporate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Corporate Revenue Analysis
              </CardTitle>
              <CardDescription>
                Individual corporate client revenue predictions and growth
                opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Region Filter</Label>
                    <Select
                      value={filters.region}
                      onValueChange={(value) =>
                        setFilters({ ...filters, region: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Regions</SelectItem>
                        <SelectItem value="north-america">
                          North America
                        </SelectItem>
                        <SelectItem value="europe">Europe</SelectItem>
                        <SelectItem value="asia-pacific">
                          Asia Pacific
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Industry Filter</Label>
                    <Select
                      value={filters.industry}
                      onValueChange={(value) =>
                        setFilters({ ...filters, industry: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Industries</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="manufacturing">
                          Manufacturing
                        </SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Deal Size</Label>
                    <Select
                      value={filters.dealSize}
                      onValueChange={(value) =>
                        setFilters({ ...filters, dealSize: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sizes</SelectItem>
                        <SelectItem value="enterprise">
                          Enterprise (&gt;$1M)
                        </SelectItem>
                        <SelectItem value="mid-market">
                          Mid-Market ($100K-$1M)
                        </SelectItem>
                        <SelectItem value="small">Small (&lt;$100K)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Confidence Level</Label>
                    <Select
                      value={filters.confidence}
                      onValueChange={(value) =>
                        setFilters({ ...filters, confidence: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="high">High (&gt;90%)</SelectItem>
                        <SelectItem value="medium">Medium (70-90%)</SelectItem>
                        <SelectItem value="low">Low (&lt;70%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Current Revenue</TableHead>
                        <TableHead>Predicted Revenue</TableHead>
                        <TableHead>Growth</TableHead>
                        <TableHead>Confidence</TableHead>
                        <TableHead>Active Deals</TableHead>
                        <TableHead>Probability</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {corporatePredictions.map((corporate) => (
                        <TableRow key={corporate.company}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {corporate.company}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {formatCurrency(corporate.currentRevenue)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(corporate.predictedRevenue)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <ArrowUp className="h-4 w-4 text-green-600" />
                              <span className="text-green-600">
                                +{formatPercentage(corporate.growth)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={getConfidenceColor(
                                corporate.confidence,
                              )}
                            >
                              {formatPercentage(corporate.confidence)}
                            </span>
                          </TableCell>
                          <TableCell>{corporate.deals}</TableCell>
                          <TableCell>
                            <Badge
                              className={getProbabilityColor(
                                corporate.probability,
                              )}
                            >
                              {corporate.probability}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewCompany(corporate)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Scenario Planning & Analysis
              </CardTitle>
              <CardDescription>
                Multiple revenue scenarios based on different market conditions
                and assumptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {scenarioPlanning.map((scenario) => (
                    <Card
                      key={scenario.scenario}
                      className={`cursor-pointer transition-all ${
                        selectedScenario === scenario.scenario
                          ? "border-2 border-blue-500 bg-blue-50"
                          : "border hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedScenario(scenario.scenario)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium">{scenario.scenario}</h3>
                          <Badge variant="outline">
                            {formatPercentage(scenario.probability)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          {scenario.description}
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Q3 Revenue:</span>
                            <span className="font-medium">
                              {formatCurrency(scenario.q3Revenue)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Q4 Revenue:</span>
                            <span className="font-medium">
                              {formatCurrency(scenario.q4Revenue)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm border-t pt-2">
                            <span>Year-End Total:</span>
                            <span className="font-bold">
                              {formatCurrency(scenario.yearEndRevenue)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Scenario Impact Analysis</CardTitle>
                    <CardDescription>
                      Detailed breakdown of the selected scenario:{" "}
                      {selectedScenario}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Key Assumptions</h4>
                        {selectedScenario === "Conservative" && (
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                              • Market uncertainties affect deal closure rates
                            </li>
                            <li>
                              • 15% slower sales cycle due to economic
                              conditions
                            </li>
                            <li>• Average deal size remains stable</li>
                            <li>• Conservative expansion in new markets</li>
                          </ul>
                        )}
                        {selectedScenario === "Realistic" && (
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• Current market trends continue</li>
                            <li>• Normal seasonal variations apply</li>
                            <li>• Expected customer acquisition rate</li>
                            <li>• Steady expansion into new verticals</li>
                          </ul>
                        )}
                        {selectedScenario === "Optimistic" && (
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                              • Favorable market conditions accelerate growth
                            </li>
                            <li>• Successful product launches drive revenue</li>
                            <li>• Higher than expected deal closure rates</li>
                            <li>• Aggressive market expansion succeeds</li>
                          </ul>
                        )}
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-medium">Risk Factors</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Market Risk</span>
                            <Badge
                              variant={
                                selectedScenario === "Conservative"
                                  ? "destructive"
                                  : selectedScenario === "Realistic"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {selectedScenario === "Conservative"
                                ? "High"
                                : selectedScenario === "Realistic"
                                  ? "Medium"
                                  : "Low"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Competition Risk</span>
                            <Badge
                              variant={
                                selectedScenario === "Optimistic"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {selectedScenario === "Optimistic"
                                ? "High"
                                : "Medium"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Execution Risk</span>
                            <Badge
                              variant={
                                selectedScenario === "Optimistic"
                                  ? "destructive"
                                  : selectedScenario === "Realistic"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {selectedScenario === "Optimistic"
                                ? "High"
                                : selectedScenario === "Realistic"
                                  ? "Medium"
                                  : "Low"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upload Data Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="w-[800px] max-w-[800px] p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-600" />
              Revenue Data Management
            </DialogTitle>
            <DialogDescription>
              Upload new files or manage existing revenue data files
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload New File</TabsTrigger>
              <TabsTrigger value="manage">Manage Files</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4 mt-4">
              {/* File Upload Area */}
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
                {uploadFile ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900">
                            {uploadFile.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetUpload}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {fileInfo && uploadFile.name.endsWith(".csv") && (
                      <div className="grid grid-cols-2 gap-4 p-3 bg-blue-50 rounded-lg">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">
                            {fileInfo.rows}
                          </div>
                          <div className="text-sm text-blue-700">Data Rows</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">
                            {fileInfo.columns}
                          </div>
                          <div className="text-sm text-blue-700">Columns</div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Upload className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Drag and drop your file here
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Supports CSV, XLSX, and XLS formats
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() =>
                        document.getElementById("revenue-file-upload")?.click()
                      }
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Browse Files
                    </Button>
                    <input
                      id="revenue-file-upload"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uploading to revenue_prediction folder...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {/* Success Message */}
              {uploadSuccess && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="text-sm text-green-700">{uploadSuccess}</p>
                </div>
              )}

              {/* Error Message */}
              {uploadError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <p className="text-sm text-red-700">{uploadError}</p>
                </div>
              )}

              {/* File Requirements */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  File Requirements
                </h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• CSV files should include headers in the first row</li>
                  <li>• Excel files (.xlsx, .xls) are supported</li>
                  <li>• Maximum file size: 50MB</li>
                  <li>
                    • Files will be stored in the revenue_prediction folder
                  </li>
                  <li>
                    • Recommended columns: date, revenue, deals, confidence
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="manage" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Uploaded Files</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchUploadedFiles}
                  disabled={isLoadingFiles}
                >
                  {isLoadingFiles ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Refresh
                </Button>
              </div>

              {isLoadingFiles ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span className="text-gray-600">Loading files...</span>
                </div>
              ) : uploadedFiles.length === 0 ? (
                <div className="text-center p-8 border rounded-lg bg-gray-50">
                  <Database className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">No files uploaded yet</p>
                  <p className="text-sm text-gray-500">
                    Upload your first revenue data file to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>{formatFileSize(file.size)}</span>
                            <span>•</span>
                            <span>
                              Uploaded {new Date(file.uploadDate).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric"
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Download functionality - you can implement this
                            console.log(`Download ${file.name}`);
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteFile(file.name)}
                          disabled={isDeleting}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Success/Error Messages for file management */}
              {uploadSuccess && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="text-sm text-green-700">{uploadSuccess}</p>
                </div>
              )}

              {uploadError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <p className="text-sm text-red-700">{uploadError}</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUploadDialog(false)}
              disabled={isUploading || isDeleting}
            >
              Close
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!uploadFile || isUploading || isDeleting}
              className="min-w-[120px]  bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2  bg-orange-500 hover:bg-orange-600 text-white" />
                  Upload File
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Company Drill-Down Dialog */}
      <Dialog
        open={showCompanyDrillDown}
        onOpenChange={setShowCompanyDrillDown}
      >
        <DialogContent className="w-[1104px] max-w-[1104px] max-h-[90vh] overflow-y-auto p-6 sm:w-[95vw] sm:max-w-[95vw] md:w-[1104px] md:max-w-[1104px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Revenue Prediction: {selectedCompany?.company}
            </DialogTitle>
            <DialogDescription>
              Detailed revenue forecasting and growth analysis for{" "}
              {selectedCompany?.company}
            </DialogDescription>
          </DialogHeader>

          {selectedCompany && (
            <div className="space-y-6">
              {/* Company Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card
                  className="border-2"
                  style={{
                    borderColor: "var(--color-blue-brand-200)",
                    backgroundColor: "var(--color-blue-brand-50)",
                  }}
                >
                  <CardContent className="p-4 text-center">
                    <DollarSign
                      className="h-6 w-6 mx-auto mb-2"
                      style={{ color: "var(--color-blue-brand-600)" }}
                    />
                    <div className="text-lg font-bold">
                      {formatCurrency(selectedCompany.currentRevenue)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Current Revenue
                    </div>
                  </CardContent>
                </Card>
                <Card
                  className="border-2"
                  style={{
                    borderColor: "var(--color-blue-brand-200)",
                    backgroundColor: "var(--color-blue-brand-50)",
                  }}
                >
                  <CardContent className="p-4 text-center">
                    <TrendingUp
                      className="h-6 w-6 mx-auto mb-2"
                      style={{ color: "var(--color-blue-brand-600)" }}
                    />
                    <div className="text-lg font-bold">
                      {formatCurrency(selectedCompany.predictedRevenue)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Predicted Revenue
                    </div>
                  </CardContent>
                </Card>
                <Card
                  className="border-2"
                  style={{
                    borderColor: "var(--color-blue-brand-200)",
                    backgroundColor: "var(--color-blue-brand-50)",
                  }}
                >
                  <CardContent className="p-4 text-center">
                    <ArrowUp
                      className="h-6 w-6 mx-auto mb-2"
                      style={{ color: "var(--color-blue-brand-600)" }}
                    />
                    <div className="text-lg font-bold">
                      +{formatPercentage(selectedCompany.growth)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Growth Rate
                    </div>
                  </CardContent>
                </Card>
                <Card
                  className="border-2"
                  style={{
                    borderColor: "var(--color-blue-brand-200)",
                    backgroundColor: "var(--color-blue-brand-50)",
                  }}
                >
                  <CardContent className="p-4 text-center">
                    <Target
                      className="h-6 w-6 mx-auto mb-2"
                      style={{ color: "var(--color-blue-brand-600)" }}
                    />
                    <div className="text-lg font-bold">
                      {formatPercentage(selectedCompany.confidence)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Confidence Level
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Tabs
                value={companyDrillDownTab}
                onValueChange={setCompanyDrillDownTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-50/50 p-1 rounded-xl border border-gray-200/50">
                  <TabsTrigger
                    value="monthly"
                    className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
                  >
                    Monthly Breakdown
                  </TabsTrigger>
                  <TabsTrigger
                    value="yearly"
                    className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
                  >
                    Yearly Projections
                  </TabsTrigger>
                  <TabsTrigger
                    value="quarterly"
                    className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
                  >
                    Quarterly Analysis
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="monthly" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Monthly Revenue Predictions for{" "}
                        {selectedCompany.company}
                      </CardTitle>
                      <CardDescription>
                        Detailed month-by-month revenue forecasting with
                        confidence intervals
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Month</TableHead>
                              <TableHead>Actual Revenue</TableHead>
                              <TableHead>Predicted Revenue</TableHead>
                              <TableHead>Variance</TableHead>
                              <TableHead>Confidence</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {generateCompanyPredictions(
                              selectedCompany.company,
                            ).monthlyData.map((data) => {
                              const variance = data.actual
                                ? ((data.actual - data.predicted) /
                                    data.predicted) *
                                  100
                                : null;

                              return (
                                <TableRow key={data.month}>
                                  <TableCell className="font-medium">
                                    {data.month}
                                  </TableCell>
                                  <TableCell>
                                    {data.actual ? (
                                      formatCurrency(data.actual)
                                    ) : (
                                      <span className="text-muted-foreground">
                                        Pending
                                      </span>
                                    )}
                                  </TableCell>
                                  <TableCell className="font-medium">
                                    {formatCurrency(data.predicted)}
                                  </TableCell>
                                  <TableCell>
                                    {variance !== null ? (
                                      <span
                                        className={
                                          variance >= 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                        }
                                      >
                                        {variance >= 0 ? "+" : ""}
                                        {formatPercentage(variance)}
                                      </span>
                                    ) : (
                                      <span className="text-muted-foreground">
                                        -
                                      </span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <span
                                      className={getConfidenceColor(
                                        data.confidence,
                                      )}
                                    >
                                      {formatPercentage(data.confidence)}
                                    </span>
                                  </TableCell>
                                  <TableCell>
                                    {data.actual ? (
                                      <Badge
                                        variant="outline"
                                        className="text-blue-600"
                                      >
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Actual
                                      </Badge>
                                    ) : (
                                      <Badge variant="secondary">
                                        <Clock className="h-3 w-3 mr-1" />
                                        Forecast
                                      </Badge>
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="yearly" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Yearly Revenue Projections for {selectedCompany.company}
                      </CardTitle>
                      <CardDescription>
                        Long-term revenue forecasting with growth trajectory
                        analysis
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Year</TableHead>
                              <TableHead>Actual Revenue</TableHead>
                              <TableHead>Predicted Revenue</TableHead>
                              <TableHead>Growth Rate</TableHead>
                              <TableHead>Revenue Change</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {generateCompanyPredictions(
                              selectedCompany.company,
                            ).yearlyData.map((data) => {
                              const changeFromPrevious =
                                data.actual || data.predicted;

                              return (
                                <TableRow key={data.year}>
                                  <TableCell className="font-medium">
                                    {data.year}
                                  </TableCell>
                                  <TableCell>
                                    {data.actual ? (
                                      formatCurrency(data.actual)
                                    ) : (
                                      <span className="text-muted-foreground">
                                        Projected
                                      </span>
                                    )}
                                  </TableCell>
                                  <TableCell className="font-medium">
                                    {formatCurrency(data.predicted)}
                                  </TableCell>
                                  <TableCell>
                                    <span
                                      className={getGrowthColor(data.growth)}
                                    >
                                      +{formatPercentage(data.growth)}
                                    </span>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-1">
                                      <ArrowUp className="h-4 w-4 text-green-600" />
                                      <span className="text-green-600">
                                        +
                                        {formatCurrency(
                                          (data.predicted || data.actual || 0) *
                                            (data.growth / 100),
                                        )}
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {data.actual ? (
                                      <Badge
                                        variant="outline"
                                        className="text-green-600"
                                      >
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Verified
                                      </Badge>
                                    ) : (
                                      <Badge variant="secondary">
                                        <Clock className="h-3 w-3 mr-1" />
                                        Forecast
                                      </Badge>
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="quarterly" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart2 className="h-5 w-5" />
                        Quarterly Performance Analysis for{" "}
                        {selectedCompany.company}
                      </CardTitle>
                      <CardDescription>
                        Quarterly revenue breakdown with variance analysis
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Quarter</TableHead>
                              <TableHead>Actual Revenue</TableHead>
                              <TableHead>Predicted Revenue</TableHead>
                              <TableHead>Variance</TableHead>
                              <TableHead>Performance</TableHead>
                              <TableHead>Trend</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {generateCompanyPredictions(
                              selectedCompany.company,
                            ).quarterlyData.map((data) => (
                              <TableRow key={data.quarter}>
                                <TableCell className="font-medium">
                                  {data.quarter}
                                </TableCell>
                                <TableCell>
                                  {data.actual ? (
                                    formatCurrency(data.actual)
                                  ) : (
                                    <span className="text-muted-foreground">
                                      Pending
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell className="font-medium">
                                  {formatCurrency(data.predicted)}
                                </TableCell>
                                <TableCell>
                                  {data.variance !== null ? (
                                    <span
                                      className={
                                        data.variance >= 0
                                          ? "text-green-600"
                                          : "text-red-600"
                                      }
                                    >
                                      {data.variance >= 0 ? "+" : ""}
                                      {formatPercentage(data.variance)}
                                    </span>
                                  ) : (
                                    <span className="text-muted-foreground">
                                      -
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {data.variance !== null ? (
                                    data.variance >= 0 ? (
                                      <Badge className="bg-green-100 text-green-800">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        Above Target
                                      </Badge>
                                    ) : (
                                      <Badge className="bg-red-100 text-red-800">
                                        <TrendingDown className="h-3 w-3 mr-1" />
                                        Below Target
                                      </Badge>
                                    )
                                  ) : (
                                    <Badge variant="secondary">
                                      <Clock className="h-3 w-3 mr-1" />
                                      Upcoming
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                    <span className="text-sm text-green-600">
                                      Growing
                                    </span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCompanyDrillDown(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setShowCompanyDrillDown(false);
                onNavigate("corporate-search", {
                  company: selectedCompany?.company,
                });
              }}
            >
              <ChevronRight className="h-4 w-4 mr-2" />
              View Full Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}