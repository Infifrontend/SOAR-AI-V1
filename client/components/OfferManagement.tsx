import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Alert, AlertDescription } from './ui/alert';
import { Switch } from './ui/switch';
import { 
  Search, 
  Filter,
  Plus,
  Edit,
  Trash2,
  Send,
  Eye,
  Download,
  Upload,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  Plane,
  Target,
  Award,
  AlertCircle,
  CheckCircle2,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Zap,
  Brain,
  Sparkles,
  FileText,
  Globe,
  Settings,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Calendar as CalendarIcon,
  MapPin,
  Route,
  Star,
  Heart,
  ThumbsUp,
  Share2,
  Copy,
  ExternalLink,
  Database,
  Cloud,
  Server,
  Layers,
  Shield,
  Lock,
  Unlock,
  PlayCircle,
  PauseCircle,
  StopCircle,
  ShoppingCart,
  X,
  Package2,
  Percent,
  CreditCard,
  Calendar as CalendarDays,
  Tag,
  Ticket
} from 'lucide-react';

// Mock data for offers
const mockOffers = [
  {
    id: 'OFF-001',
    title: 'Premium Business Class Package',
    corporate: 'TechCorp International',
    type: 'Route-based',
    status: 'Active',
    validFrom: '2024-01-15',
    validTo: '2024-12-31',
    discount: 25,
    usage: 85,
    conversion: 78,
    revenue: 2450000,
    bookings: 1247,
    routes: ['NYC-LON', 'SFO-FRA', 'LAX-NRT'],
    cabin: 'Business',
    atpcoStatus: 'Filed',
    atpcoReference: 'ATP-2024-001',
    lastModified: '2024-01-20',
    template: 'Corporate Premium',
    priority: 'High',
    description: 'Comprehensive business class travel package for TechCorp International with flexible routing options and enhanced service features.',
    terms: 'Valid for bookings made 30 days in advance. Includes lounge access, priority boarding, and 2 free changes per ticket.',
    minSpend: 100000,
    maxDiscount: 30,
    contactPerson: 'Sarah Johnson',
    contactEmail: 'sarah.johnson@techcorp.com',
    approvalStatus: 'Approved',
    createdBy: 'John Smith',
    lastEditedBy: 'Alice Brown',
    appliedDiscounts: ['DISC-001', 'DISC-003'],
    promoCodes: ['PROMO-001']
  },
  {
    id: 'OFF-002',
    title: 'Economy Plus Group Rates',
    corporate: 'Global Manufacturing Ltd',
    type: 'Volume-based',
    status: 'Active',
    validFrom: '2024-02-01',
    validTo: '2024-11-30',
    discount: 15,
    usage: 62,
    conversion: 65,
    revenue: 1780000,
    bookings: 892,
    routes: ['ORD-FRA', 'DET-MUC'],
    cabin: 'Economy Plus',
    atpcoStatus: 'Pending',
    atpcoReference: 'ATP-2024-002',
    lastModified: '2024-02-05',
    template: 'Volume Discount',
    priority: 'Medium',
    description: 'Volume-based pricing structure for Global Manufacturing with guaranteed group discounts and flexible travel dates.',
    terms: 'Minimum 50 passengers per booking period. Group discounts apply automatically. Free seat selection for Economy Plus.',
    minSpend: 75000,
    maxDiscount: 20,
    contactPerson: 'Mike Wilson',
    contactEmail: 'mike.wilson@globalmanuf.com',
    approvalStatus: 'Approved',
    createdBy: 'Jane Doe',
    lastEditedBy: 'John Smith',
    appliedDiscounts: ['DISC-002'],
    promoCodes: ['PROMO-002']
  },
  {
    id: 'OFF-003',
    title: 'Financial Services Executive',
    corporate: 'Sunrise Financial Services',
    type: 'Flexible',
    status: 'Draft',
    validFrom: '2024-03-01',
    validTo: '2024-12-31',
    discount: 30,
    usage: 0,
    conversion: 0,
    revenue: 0,
    bookings: 0,
    routes: ['JFK-LHR', 'LAX-HKG', 'SFO-SIN'],
    cabin: 'First',
    atpcoStatus: 'Not Filed',
    atpcoReference: '',
    lastModified: '2024-02-28',
    template: 'Executive Premium',
    priority: 'High',
    description: 'Premium first-class travel package for Sunrise Financial executives with maximum flexibility and luxury amenities.',
    terms: 'Unlimited changes allowed. Includes concierge service, private car transfers, and premium hotel partnerships.',
    minSpend: 200000,
    maxDiscount: 35,
    contactPerson: 'David Chen',
    contactEmail: 'david.chen@sunrise.com',
    approvalStatus: 'Pending Review',
    createdBy: 'Alice Brown',
    lastEditedBy: 'Alice Brown',
    appliedDiscounts: ['DISC-001', 'DISC-004'],
    promoCodes: ['PROMO-003']
  }
];

// Mock data for discounts
const mockDiscounts = [
  {
    id: 'DISC-001',
    name: 'Early Bird Discount',
    type: 'Percentage',
    value: 15,
    description: 'Discount for bookings made 60 days in advance',
    status: 'Active',
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    minSpend: 500,
    maxDiscount: 200,
    usageLimit: 1000,
    usedCount: 245,
    applicableRoutes: 'All Routes',
    corporateOnly: false,
    createdBy: 'John Smith',
    lastModified: '2024-01-15'
  },
  {
    id: 'DISC-002',
    name: 'Volume Discount',
    type: 'Percentage',
    value: 20,
    description: 'Bulk booking discount for 10+ passengers',
    status: 'Active',
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    minSpend: 5000,
    maxDiscount: 1000,
    usageLimit: 500,
    usedCount: 89,
    applicableRoutes: 'International',
    corporateOnly: true,
    createdBy: 'Jane Doe',
    lastModified: '2024-01-12'
  },
  {
    id: 'DISC-003',
    name: 'Student Discount',
    type: 'Fixed',
    value: 100,
    description: 'Fixed discount for verified students',
    status: 'Active',
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    minSpend: 300,
    maxDiscount: 100,
    usageLimit: 2000,
    usedCount: 567,
    applicableRoutes: 'All Routes',
    corporateOnly: false,
    createdBy: 'Mike Wilson',
    lastModified: '2024-01-10'
  },
  {
    id: 'DISC-004',
    name: 'Corporate Premium Discount',
    type: 'Percentage',
    value: 25,
    description: 'Premium discount for enterprise clients',
    status: 'Active',
    validFrom: '2024-02-01',
    validTo: '2024-12-31',
    minSpend: 10000,
    maxDiscount: 2500,
    usageLimit: 100,
    usedCount: 23,
    applicableRoutes: 'All Routes',
    corporateOnly: true,
    createdBy: 'Sarah Johnson',
    lastModified: '2024-02-01'
  }
];

// Mock data for promo codes
const mockPromoCodes = [
  {
    id: 'PROMO-001',
    code: 'SAVE2024',
    name: 'New Year Promotion',
    type: 'Percentage',
    value: 10,
    description: 'New Year special offer for all bookings',
    status: 'Active',
    validFrom: '2024-01-01',
    validTo: '2024-03-31',
    usageLimit: 5000,
    usedCount: 1234,
    minSpend: 200,
    maxDiscount: 150,
    singleUse: false,
    corporateOnly: false,
    createdBy: 'John Smith',
    lastModified: '2024-01-01'
  },
  {
    id: 'PROMO-002',
    code: 'BIZTRAVEL',
    name: 'Business Travel Special',
    type: 'Fixed',
    value: 75,
    description: 'Special promotion for business travelers',
    status: 'Active',
    validFrom: '2024-02-01',
    validTo: '2024-06-30',
    usageLimit: 1000,
    usedCount: 342,
    minSpend: 800,
    maxDiscount: 75,
    singleUse: true,
    corporateOnly: true,
    createdBy: 'Jane Doe',
    lastModified: '2024-02-01'
  },
  {
    id: 'PROMO-003',
    code: 'SUMMER20',
    name: 'Summer Vacation Deal',
    type: 'Percentage',
    value: 20,
    description: 'Summer holiday discount for leisure travel',
    status: 'Draft',
    validFrom: '2024-06-01',
    validTo: '2024-08-31',
    usageLimit: 3000,
    usedCount: 0,
    minSpend: 500,
    maxDiscount: 300,
    singleUse: false,
    corporateOnly: false,
    createdBy: 'Mike Wilson',
    lastModified: '2024-02-15'
  },
  {
    id: 'PROMO-004',
    code: 'FIRSTCLASS',
    name: 'First Class Upgrade',
    type: 'Percentage',
    value: 30,
    description: 'Exclusive discount for first class bookings',
    status: 'Active',
    validFrom: '2024-01-15',
    validTo: '2024-12-31',
    usageLimit: 200,
    usedCount: 45,
    minSpend: 2000,
    maxDiscount: 1000,
    singleUse: true,
    corporateOnly: false,
    createdBy: 'David Chen',
    lastModified: '2024-01-15'
  }
];

// Mock templates data
const mockTemplates = [
  {
    id: 'TPL-001',
    name: 'Corporate Premium',
    description: 'Premium offers for large corporates with business class focus',
    discount: '20-30%',
    cabin: 'Business/First',
    usage: 156,
    category: 'Premium',
    features: ['Lounge Access', 'Priority Boarding', 'Flexible Changes', 'Premium Seats'],
    basePrice: 5000,
    validityPeriod: '12 months'
  },
  {
    id: 'TPL-002',
    name: 'Volume Discount',
    description: 'Volume-based pricing for frequent travelers and large groups',
    discount: '10-20%',
    cabin: 'All Classes',
    usage: 98,
    category: 'Volume',
    features: ['Group Discounts', 'Flexible Dates', 'Free Seat Selection', 'Bulk Booking'],
    basePrice: 3000,
    validityPeriod: '6 months'
  },
  {
    id: 'TPL-003',
    name: 'Executive Premium',
    description: 'Executive level travel packages with maximum luxury',
    discount: '25-35%',
    cabin: 'First',
    usage: 67,
    category: 'Executive',
    features: ['Concierge Service', 'Private Transfers', 'Hotel Partnerships', 'Unlimited Changes'],
    basePrice: 8000,
    validityPeriod: '24 months'
  },
  {
    id: 'TPL-004',
    name: 'SME Business',
    description: 'Tailored offers for small and medium enterprises',
    discount: '12-18%',
    cabin: 'Economy Plus',
    usage: 89,
    category: 'SME',
    features: ['Cost Effective', 'Flexible Booking', 'Basic Amenities', 'Online Management'],
    basePrice: 2500,
    validityPeriod: '9 months'
  }
];

// Mock analytics data with real visualizations
const analyticsData = {
  overview: {
    totalOffers: 124,
    activeOffers: 89,
    totalRevenue: 12450000,
    averageConversion: 72,
    totalBookings: 5678,
    topPerformer: 'TechCorp International'
  },
  performance: {
    conversionTrend: [
      { month: 'Jan', conversion: 65, revenue: 2100000, bookings: 450 },
      { month: 'Feb', conversion: 68, revenue: 2300000, bookings: 520 },
      { month: 'Mar', conversion: 71, revenue: 2450000, bookings: 580 },
      { month: 'Apr', conversion: 74, revenue: 2600000, bookings: 620 },
      { month: 'May', conversion: 72, revenue: 2550000, bookings: 610 },
      { month: 'Jun', conversion: 75, revenue: 2700000, bookings: 650 },
      { month: 'Jul', conversion: 78, revenue: 2850000, bookings: 680 }
    ],
    topPerformingOffers: [
      { name: 'Premium Business Class Package', conversion: 85, revenue: 2450000 },
      { name: 'Economy Plus Group Rates', conversion: 62, revenue: 1780000 },
      { name: 'Executive First Class', conversion: 78, revenue: 1890000 }
    ],
    corporatePerformance: [
      { corporate: 'TechCorp International', usage: 85, conversion: 78, revenue: 2450000 },
      { corporate: 'Global Manufacturing Ltd', usage: 62, conversion: 65, revenue: 1780000 },
      { corporate: 'Sunrise Financial Services', usage: 45, conversion: 58, revenue: 1340000 }
    ]
  },
  predictions: {
    nextQuarter: {
      expectedRevenue: 3200000,
      expectedConversion: 82,
      confidence: 85,
      projectedBookings: 750
    },
    recommendations: [
      {
        id: 'rec-1',
        text: 'Increase discount for TechCorp by 2% to boost conversion from 78% to 85%',
        impact: '+$180K revenue',
        applied: false
      },
      {
        id: 'rec-2',
        text: 'Target healthcare sector with new route-based offers - potential 15% revenue increase',
        impact: '+$350K revenue',
        applied: false
      },
      {
        id: 'rec-3',
        text: 'Optimize validity periods for seasonal travel patterns - could improve usage by 12%',
        impact: '+8% usage',
        applied: false
      },
      {
        id: 'rec-4',
        text: 'Introduce weekend travel discounts for leisure corporate travel',
        impact: '+25% bookings',
        applied: false
      },
      {
        id: 'rec-5',
        text: 'Expand business class offerings to emerging markets',
        impact: '+$220K revenue',
        applied: false
      }
    ]
  }
};

// Mock order data
const mockOrders = [
  {
    id: 'ORD-001',
    corporate: 'TechCorp International',
    offer: 'Premium Business Class Package',
    status: 'Confirmed',
    value: 125000,
    date: '2024-01-15',
    passengers: 15,
    routes: ['SFO-LON', 'LON-SFO'],
    travelDates: ['2024-03-15', '2024-03-22'],
    contactPerson: 'Sarah Johnson',
    bookingReference: 'TC-2024-001',
    paymentStatus: 'Paid',
    specialRequests: 'Vegetarian meals for 3 passengers, wheelchair assistance for 1 passenger',
    appliedDiscounts: ['DISC-001'],
    promoCodes: ['PROMO-001']
  },
  {
    id: 'ORD-002',
    corporate: 'Global Manufacturing Ltd',
    offer: 'Economy Plus Group Rates',
    status: 'Processing',
    value: 89000,
    date: '2024-01-14',
    passengers: 25,
    routes: ['ORD-FRA', 'FRA-ORD'],
    travelDates: ['2024-02-20', '2024-02-27'],
    contactPerson: 'Mike Wilson',
    bookingReference: 'GM-2024-002',
    paymentStatus: 'Pending',
    specialRequests: 'Group seating arrangement, conference room booking at destination',
    appliedDiscounts: ['DISC-002'],
    promoCodes: ['PROMO-002']
  },
  {
    id: 'ORD-003',
    corporate: 'Sunrise Financial Services',
    offer: 'Financial Services Executive',
    status: 'Completed',
    value: 245000,
    date: '2024-01-13',
    passengers: 8,
    routes: ['JFK-HKG', 'HKG-JFK'],
    travelDates: ['2024-01-20', '2024-01-25'],
    contactPerson: 'David Chen',
    bookingReference: 'SF-2024-003',
    paymentStatus: 'Paid',
    specialRequests: 'Private lounge access, priority customs clearance, ground transportation',
    appliedDiscounts: ['DISC-001', 'DISC-004'],
    promoCodes: ['PROMO-003']
  }
];

interface OfferManagementProps {
  initialTab?: string;
  initialFilters?: any;
}

export function OfferManagement({ initialTab = 'dashboard', initialFilters }: OfferManagementProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [offers, setOffers] = useState(mockOffers);
  const [templates, setTemplates] = useState(mockTemplates);
  const [recommendations, setRecommendations] = useState(analyticsData.predictions.recommendations);
  const [filteredOffers, setFilteredOffers] = useState(mockOffers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [corporateFilter, setCorporateFilter] = useState('');
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCreateTemplateDialog, setShowCreateTemplateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showAtpcoDialog, setShowAtpcoDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newOffer, setNewOffer] = useState({
    title: '',
    corporate: '',
    type: '',
    discount: 0,
    validFrom: '',
    validTo: '',
    routes: '',
    cabin: [],
    description: '',
    terms: '',
    minSpend: 0,
    maxDiscount: 0,
    contactPerson: '',
    contactEmail: '',
    appliedDiscounts: [],
    promoCodes: []
  });
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category: '',
    discount: '',
    cabin: '',
    features: [],
    basePrice: 0,
    validityPeriod: ''
  });

  // Filter offers based on search and filters
  useEffect(() => {
    let filtered = offers;
    
    if (searchQuery) {
      filtered = filtered.filter(offer => 
        offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.corporate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(offer => offer.status === statusFilter);
    }
    
    if (corporateFilter && corporateFilter !== 'all') {
      filtered = filtered.filter(offer => offer.corporate === corporateFilter);
    }
    
    setFilteredOffers(filtered);
  }, [offers, searchQuery, statusFilter, corporateFilter]);

  const handleCreateOffer = () => {
    setNewOffer({
      title: '',
      corporate: '',
      type: '',
      discount: 0,
      validFrom: '',
      validTo: '',
      routes: '',
      cabin: [],
      description: '',
      terms: '',
      minSpend: 0,
      maxDiscount: 0,
      contactPerson: '',
      contactEmail: '',
      appliedDiscounts: [],
      promoCodes: []
    });
    setShowCreateDialog(true);
  };

  const handleCreateTemplate = () => {
    setNewTemplate({
      name: '',
      description: '',
      category: '',
      discount: '',
      cabin: '',
      features: [],
      basePrice: 0,
      validityPeriod: ''
    });
    setShowCreateTemplateDialog(true);
  };

  const handleEditOffer = (offer) => {
    setSelectedOffer(offer);
    setNewOffer({
      title: offer.title,
      corporate: offer.corporate,
      type: offer.type,
      discount: offer.discount,
      validFrom: offer.validFrom,
      validTo: offer.validTo,
      routes: offer.routes.join(', '),
      cabin: Array.isArray(offer.cabin) ? offer.cabin : [offer.cabin.toLowerCase()],
      description: offer.description,
      terms: offer.terms,
      minSpend: offer.minSpend,
      maxDiscount: offer.maxDiscount,
      contactPerson: offer.contactPerson,
      contactEmail: offer.contactEmail,
      appliedDiscounts: offer.appliedDiscounts || [],
      promoCodes: offer.promoCodes || []
    });
    setShowEditDialog(true);
  };

  const handleViewOffer = (offer) => {
    setSelectedOffer(offer);
    setShowViewDialog(true);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDialog(true);
  };

  const handleDeleteOffer = (offerId) => {
    setOffers(prev => prev.filter(offer => offer.id !== offerId));
  };

  const handleSendOffer = (offer) => {
    setSelectedOffer(offer);
    setShowSendDialog(true);
  };

  const handleAtpcoFiling = (offer) => {
    setSelectedOffer(offer);
    setShowAtpcoDialog(true);
  };

  const handleUseTemplate = (template) => {
    setNewOffer({
      title: `${template.name} Offer`,
      corporate: '',
      type: template.category.toLowerCase(),
      discount: parseInt(template.discount.split('-')[0]),
      validFrom: '',
      validTo: '',
      routes: '',
      cabin: template.cabin === 'All Classes' ? ['economy', 'business', 'first'] : [template.cabin.toLowerCase().replace('/', '_')],
      description: template.description,
      terms: `Based on ${template.name} template. ${template.features.join(', ')}.`,
      minSpend: template.basePrice * 10,
      maxDiscount: parseInt(template.discount.split('-')[1].replace('%', '')),
      contactPerson: '',
      contactEmail: '',
      appliedDiscounts: [],
      promoCodes: []
    });
    setShowCreateDialog(true);
  };

  const handleSaveOffer = () => {
    const offerData = {
      ...newOffer,
      id: selectedOffer ? selectedOffer.id : `OFF-${String(offers.length + 1).padStart(3, '0')}`,
      status: selectedOffer ? selectedOffer.status : 'Draft',
      usage: selectedOffer ? selectedOffer.usage : 0,
      conversion: selectedOffer ? selectedOffer.conversion : 0,
      revenue: selectedOffer ? selectedOffer.revenue : 0,
      bookings: selectedOffer ? selectedOffer.bookings : 0,
      routes: newOffer.routes.split(',').map(route => route.trim()).filter(route => route),
      atpcoStatus: selectedOffer ? selectedOffer.atpcoStatus : 'Not Filed',
      atpcoReference: selectedOffer ? selectedOffer.atpcoReference : '',
      lastModified: new Date().toISOString().split('T')[0],
      template: selectedOffer ? selectedOffer.template : 'Custom',
      priority: selectedOffer ? selectedOffer.priority : 'Medium',
      approvalStatus: selectedOffer ? selectedOffer.approvalStatus : 'Pending Review',
      createdBy: selectedOffer ? selectedOffer.createdBy : 'Current User',
      lastEditedBy: 'Current User'
    };
    
    if (selectedOffer) {
      setOffers(prev => prev.map(offer => offer.id === selectedOffer.id ? offerData : offer));
      setShowEditDialog(false);
    } else {
      setOffers(prev => [...prev, offerData]);
      setShowCreateDialog(false);
    }
    
    setSelectedOffer(null);
    // Show success message
    console.log('Offer saved successfully:', offerData);
  };

  const handleSaveTemplate = () => {
    const templateData = {
      ...newTemplate,
      id: `TPL-${String(templates.length + 1).padStart(3, '0')}`,
      usage: 0
    };
    
    setTemplates(prev => [...prev, templateData]);
    setShowCreateTemplateDialog(false);
    
    // Show success message
    console.log('Template created successfully:', templateData);
  };

  const handleApplyRecommendation = (recommendationId) => {
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === recommendationId 
          ? { ...rec, applied: true }
          : rec
      )
    );
    
    // Show success message
    console.log(`Applied recommendation: ${recommendationId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAtpcoStatusColor = (status) => {
    switch (status) {
      case 'Filed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Not Filed': return 'bg-gray-100 text-gray-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCabinChange = (cabin, checked) => {
    setNewOffer(prev => ({
      ...prev,
      cabin: checked 
        ? [...prev.cabin, cabin]
        : prev.cabin.filter(c => c !== cabin)
    }));
  };

  const handleDiscountChange = (discountId, checked) => {
    setNewOffer(prev => ({
      ...prev,
      appliedDiscounts: checked 
        ? [...prev.appliedDiscounts, discountId]
        : prev.appliedDiscounts.filter(d => d !== discountId)
    }));
  };

  const handlePromoCodeChange = (promoCodeId, checked) => {
    setNewOffer(prev => ({
      ...prev,
      promoCodes: checked 
        ? [...prev.promoCodes, promoCodeId]
        : prev.promoCodes.filter(p => p !== promoCodeId)
    }));
  };

  const handleTemplateFeatureChange = (feature, checked) => {
    setNewTemplate(prev => ({
      ...prev,
      features: checked 
        ? [...prev.features, feature]
        : prev.features.filter(f => f !== feature)
    }));
  };

  const renderPromoCodesAndDiscounts = (appliedDiscounts = [], promoCodes = []) => {
    return (
      <div className="flex flex-wrap gap-1">
        {appliedDiscounts.map(discountId => {
          const discount = mockDiscounts.find(d => d.id === discountId);
          return discount ? (
            <Badge key={discountId} variant="secondary" className="text-xs">
              <Percent className="h-3 w-3 mr-1" />
              {discount.name}
            </Badge>
          ) : null;
        })}
        {promoCodes.map(promoId => {
          const promo = mockPromoCodes.find(p => p.id === promoId);
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

  return (
    <div className="space-y-6 p-5">
      {/* Header */}
      <Card style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }}>

      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 mb-6 bg-gray-50/50 p-1 rounded-xl border border-gray-200/50">
          <TabsTrigger 
            value="dashboard"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger 
            value="create"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            Create Offers
          </TabsTrigger>
          <TabsTrigger 
            value="manage"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            Manage Offers
          </TabsTrigger>
          <TabsTrigger 
            value="insights"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            Insights
          </TabsTrigger>
          <TabsTrigger 
            value="filing"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            Offers Filing
          </TabsTrigger>
          <TabsTrigger 
            value="orders"
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200"
          >
            Order Management
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Offers Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search offers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={corporateFilter} onValueChange={setCorporateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Corporate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Corporates</SelectItem>
                    <SelectItem value="TechCorp International">TechCorp International</SelectItem>
                    <SelectItem value="Global Manufacturing Ltd">Global Manufacturing Ltd</SelectItem>
                    <SelectItem value="Sunrise Financial Services">Sunrise Financial Services</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Offers</p>
                        <p className="text-2xl font-bold">{analyticsData.overview.totalOffers}</p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Target className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">+12% from last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Revenue</p>
                        <p className="text-2xl font-bold">${(analyticsData.overview.totalRevenue / 1000000).toFixed(1)}M</p>
                      </div>
                      <div className="p-2 bg-green-100 rounded-lg">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">+18% from last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Avg Conversion</p>
                        <p className="text-2xl font-bold">{analyticsData.overview.averageConversion}%</p>
                      </div>
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Activity className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">+5% from last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Bookings</p>
                        <p className="text-2xl font-bold">{analyticsData.overview.totalBookings.toLocaleString()}</p>
                      </div>
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Users className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">+23% from last month</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Recent Offers Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Offers Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredOffers.slice(0, 5).map((offer) => (
                  <div key={offer.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Target className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4>{offer.title}</h4>
                        <p className="text-sm text-muted-foreground">{offer.corporate}</p>
                        {/* Display Promo Codes and Discounts */}
                        {(offer.appliedDiscounts?.length > 0 || offer.promoCodes?.length > 0) && (
                          <div className="mt-2">
                            {renderPromoCodesAndDiscounts(offer.appliedDiscounts, offer.promoCodes)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Usage</p>
                        <p>{offer.usage}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Conversion</p>
                        <p>{offer.conversion}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p>${(offer.revenue / 1000000).toFixed(1)}M</p>
                      </div>
                      <Badge className={getStatusColor(offer.status)}>
                        {offer.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create Offers Tab */}
        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Offers Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Active Offers
                  </div>
                  <Button onClick={handleCreateOffer}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Offer
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {offers.filter(offer => offer.status === 'Active').map((offer) => (
                    <div key={offer.id} className="p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{offer.title}</h4>
                        <Badge className={getStatusColor(offer.status)}>{offer.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{offer.corporate}</p>
                      <div className="flex justify-between text-xs mb-2">
                        <span>Usage: {offer.usage}%</span>
                        <span>Conversion: {offer.conversion}%</span>
                        <span>${(offer.revenue / 1000000).toFixed(1)}M</span>
                      </div>
                      {/* Display Promo Codes and Discounts */}
                      {(offer.appliedDiscounts?.length > 0 || offer.promoCodes?.length > 0) && (
                        <div className="mb-2">
                          {renderPromoCodesAndDiscounts(offer.appliedDiscounts, offer.promoCodes)}
                        </div>
                      )}
                      <div className="flex gap-1 mt-2">
                        <Button size="sm" variant="ghost" onClick={() => handleViewOffer(offer)}>
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleEditOffer(offer)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Templates Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Offer Templates
                  </div>
                  <Button onClick={handleCreateTemplate} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    New Template
                  </Button>
                </CardTitle>
                <CardDescription>Use pre-built templates to create offers quickly</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {templates.map((template) => (
                    <div key={template.id} className="p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{template.name}</h4>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{template.description}</p>
                      <div className="flex justify-between text-xs text-muted-foreground mb-2">
                        <span>Discount: {template.discount}</span>
                        <span>Used: {template.usage}x</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {template.features.slice(0, 2).map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {template.features.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{template.features.length - 2} more
                          </Badge>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full" 
                        onClick={() => handleUseTemplate(template)}
                      >
                        Use Template
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Manage Offers Tab */}
        <TabsContent value="manage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Manage Active Offers
                </div>
                <Button onClick={handleCreateOffer}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Offer
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Search and Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search offers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={corporateFilter} onValueChange={setCorporateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Corporate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Corporates</SelectItem>
                    <SelectItem value="TechCorp International">TechCorp International</SelectItem>
                    <SelectItem value="Global Manufacturing Ltd">Global Manufacturing Ltd</SelectItem>
                    <SelectItem value="Sunrise Financial Services">Sunrise Financial Services</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              {/* Offers Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Offer Details</TableHead>
                      <TableHead>Corporate</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Promo Codes & Discounts</TableHead>
                      <TableHead>Validity</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOffers.map((offer) => (
                      <TableRow key={offer.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{offer.title}</p>
                            <p className="text-sm text-muted-foreground">{offer.id}</p>
                            <div className="flex gap-1 mt-1">
                              <Badge variant="outline" className="text-xs">{offer.type}</Badge>
                              <Badge variant="outline" className="text-xs">{offer.cabin}</Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            {offer.corporate}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(offer.status)}>
                            {offer.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Usage:</span>
                              <span>{offer.usage}%</span>
                            </div>
                            <Progress value={offer.usage} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Conv: {offer.conversion}%</span>
                              <span>{offer.bookings} bookings</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {renderPromoCodesAndDiscounts(offer.appliedDiscounts, offer.promoCodes)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{offer.validFrom}</p>
                            <p className="text-muted-foreground">to {offer.validTo}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handleViewOffer(offer)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleEditOffer(offer)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleSendOffer(offer)}>
                              <Send className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteOffer(offer.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
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

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Offer Analytics & Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Search analytics..." className="pl-10" />
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Time Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                    <SelectItem value="90d">Last 90 Days</SelectItem>
                    <SelectItem value="1y">Last Year</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Corporate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Corporates</SelectItem>
                    <SelectItem value="techcorp">TechCorp International</SelectItem>
                    <SelectItem value="globalmanuf">Global Manufacturing Ltd</SelectItem>
                    <SelectItem value="sunrise">Sunrise Financial Services</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Performance Analytics with Data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Conversion & Revenue Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.performance.conversionTrend.map((data, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">{data.month}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Conversion: {data.conversion}%</p>
                          <p className="text-xs text-muted-foreground">Bookings: {data.bookings}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">${(data.revenue / 1000000).toFixed(1)}M</p>
                        <div className="flex items-center gap-1">
                          {index > 0 && data.revenue > analyticsData.performance.conversionTrend[index - 1].revenue ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          ) : index > 0 ? (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                          ) : null}
                          <span className="text-xs text-muted-foreground">Revenue</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Top Performing Offers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.performance.topPerformingOffers.map((offer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-orange-600">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{offer.name}</p>
                          <p className="text-xs text-muted-foreground">Conversion: {offer.conversion}%</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">${(offer.revenue / 1000000).toFixed(1)}M</p>
                        <Progress value={offer.conversion} className="h-2 w-16 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Predictions & Forecasts with Enhanced Data and Apply Functionality */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI Predictions & Forecasts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Next Quarter Forecast</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm text-muted-foreground">Expected Revenue:</span>
                      <span className="font-medium text-blue-600">${(analyticsData.predictions.nextQuarter.expectedRevenue / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm text-muted-foreground">Expected Conversion:</span>
                      <span className="font-medium text-green-600">{analyticsData.predictions.nextQuarter.expectedConversion}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm text-muted-foreground">Projected Bookings:</span>
                      <span className="font-medium text-purple-600">{analyticsData.predictions.nextQuarter.projectedBookings}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="text-sm text-muted-foreground">Confidence Level:</span>
                      <span className="font-medium text-orange-600">{analyticsData.predictions.nextQuarter.confidence}%</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <h4 className="font-medium mb-4">AI Recommendations</h4>
                  <div className="space-y-3">
                    {recommendations.map((rec, index) => (
                      <Alert key={index} className={`border-l-4 ${rec.applied ? 'border-l-green-500 bg-green-50' : 'border-l-blue-500'}`}>
                        <Zap className="h-4 w-4" />
                        <AlertDescription className="flex items-center justify-between">
                          <div className="flex-1">
                            <span className="text-sm">{rec.text}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {rec.impact}
                              </Badge>
                              {rec.applied && (
                                <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                                  Applied
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant={rec.applied ? "secondary" : "outline"}
                            className="ml-4"
                            onClick={() => handleApplyRecommendation(rec.id)}
                            disabled={rec.applied}
                          >
                            {rec.applied ? 'Applied' : 'Apply'}
                          </Button>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Corporate Performance Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Corporate Usage Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.performance.corporatePerformance.map((corp, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{corp.corporate}</h4>
                        <p className="text-sm text-muted-foreground">Performance Metrics</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Usage Rate</p>
                        <p className="text-lg font-medium">{corp.usage}%</p>
                        <Progress value={corp.usage} className="h-2 w-16 mt-1" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Success Rate</p>
                        <p className="text-lg font-medium">{corp.conversion}%</p>
                        <Progress value={corp.conversion} className="h-2 w-16 mt-1" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="text-lg font-medium">${(corp.revenue / 1000000).toFixed(1)}M</p>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-green-500">+15%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Offers Filing Tab */}
        <TabsContent value="filing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                ATPCO Filing Management
              </CardTitle>
              <CardDescription>
                Manage ATPCO filings for your offers with real-time status tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Bulk File to ATPCO
                </Button>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Filing Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Filed">Filed</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Not Filed">Not Filed</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Status
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ATPCO Filing Table */}
          <Card>
            <CardHeader>
              <CardTitle>Offer Filing Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Offer Details</TableHead>
                      <TableHead>Corporate</TableHead>
                      <TableHead>ATPCO Status</TableHead>
                      <TableHead>Promo Codes & Discounts</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {offers.map((offer) => (
                      <TableRow key={offer.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{offer.title}</p>
                            <p className="text-sm text-muted-foreground">{offer.id}</p>
                          </div>
                        </TableCell>
                        <TableCell>{offer.corporate}</TableCell>
                        <TableCell>
                          <Badge className={getAtpcoStatusColor(offer.atpcoStatus)}>
                            {offer.atpcoStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {renderPromoCodesAndDiscounts(offer.appliedDiscounts, offer.promoCodes)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {offer.atpcoReference ? (
                              <>
                                <span className="font-mono text-sm">{offer.atpcoReference}</span>
                                <Button size="sm" variant="ghost">
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{offer.lastModified}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={offer.priority === 'High' ? 'destructive' : offer.priority === 'Medium' ? 'default' : 'secondary'}>
                            {offer.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handleViewOffer(offer)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {offer.atpcoStatus === 'Not Filed' && (
                              <Button size="sm" onClick={() => handleAtpcoFiling(offer)}>
                                <Upload className="h-4 w-4 mr-1" />
                                File
                              </Button>
                            )}
                            {offer.atpcoStatus === 'Filed' && (
                              <Button size="sm" variant="outline">
                                <ExternalLink className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            )}
                            <Button size="sm" variant="ghost">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* ATPCO Integration Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                ATPCO Integration Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="font-medium">Connection Status</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Connected to ATPCO</p>
                  <p className="text-xs text-green-600">Last sync: 2 minutes ago</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Filing Queue</span>
                  </div>
                  <p className="text-sm text-muted-foreground">3 offers pending</p>
                  <p className="text-xs text-blue-600">Est. processing: 15 min</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">Compliance</span>
                  </div>
                  <p className="text-sm text-muted-foreground">All filings compliant</p>
                  <p className="text-xs text-purple-600">Last audit: Passed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Order Management Tab */}
        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Order Management
              </CardTitle>
              <CardDescription>
                Track and manage orders from accepted offers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Search orders..." className="pl-10" />
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Order Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Corporate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Corporates</SelectItem>
                    <SelectItem value="techcorp">TechCorp International</SelectItem>
                    <SelectItem value="globalmanuf">Global Manufacturing Ltd</SelectItem>
                    <SelectItem value="sunrise">Sunrise Financial Services</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Orders
                </Button>
              </div>

              {/* Order Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Orders</p>
                        <p className="text-2xl font-bold">1,247</p>
                      </div>
                      <ShoppingCart className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Active Orders</p>
                        <p className="text-2xl font-bold">89</p>
                      </div>
                      <Activity className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Order Value</p>
                        <p className="text-2xl font-bold">$8.9M</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Avg Order Size</p>
                        <p className="text-2xl font-bold">$7.1K</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Orders Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Corporate</TableHead>
                      <TableHead>Offer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Promo Codes & Discounts</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono">{order.id}</TableCell>
                        <TableCell>{order.corporate}</TableCell>
                        <TableCell>{order.offer}</TableCell>
                        <TableCell>
                          <Badge className={
                            order.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {renderPromoCodesAndDiscounts(order.appliedDiscounts, order.promoCodes)}
                        </TableCell>
                        <TableCell>${order.value.toLocaleString()}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handleViewOrder(order)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleViewOrder(order)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Download className="h-4 w-4" />
                            </Button>
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

      {/* Create New Offer Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Travel Offer</DialogTitle>
            <DialogDescription>
              Create a comprehensive travel offer with detailed terms and conditions
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Offer Title *</Label>
                <Input 
                  placeholder="Enter descriptive offer title"
                  value={newOffer.title}
                  onChange={(e) => setNewOffer({...newOffer, title: e.target.value})}
                />
              </div>
              <div>
                <Label>Corporate Client *</Label>
                <Select value={newOffer.corporate} onValueChange={(value) => setNewOffer({...newOffer, corporate: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select corporate client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TechCorp International">TechCorp International</SelectItem>
                    <SelectItem value="Global Manufacturing Ltd">Global Manufacturing Ltd</SelectItem>
                    <SelectItem value="Sunrise Financial Services">Sunrise Financial Services</SelectItem>
                    <SelectItem value="Healthcare Plus Inc">Healthcare Plus Inc</SelectItem>
                    <SelectItem value="Energy Solutions Corp">Energy Solutions Corp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Offer Type *</Label>
                <Select value={newOffer.type} onValueChange={(value) => setNewOffer({...newOffer, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select offer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="route-based">Route-based</SelectItem>
                    <SelectItem value="volume-based">Volume-based</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                    <SelectItem value="seasonal">Seasonal</SelectItem>
                    <SelectItem value="corporate-rate">Corporate Rate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Discount Percentage *</Label>
                <div className="relative">
                  <Input 
                    type="number" 
                    placeholder="0"
                    value={newOffer.discount}
                    onChange={(e) => setNewOffer({...newOffer, discount: parseInt(e.target.value) || 0})}
                  />
                  <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Promo Codes and Discounts Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-600 mb-3 block">Apply Discounts</Label>
                <div className="border rounded-lg p-4 max-h-48 overflow-y-auto">
                  {mockDiscounts.filter(d => d.status === 'Active').map((discount) => (
                    <div key={discount.id} className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id={`discount-${discount.id}`}
                        checked={newOffer.appliedDiscounts.includes(discount.id)}
                        onCheckedChange={(checked) => handleDiscountChange(discount.id, checked)}
                      />
                      <Label htmlFor={`discount-${discount.id}`} className="text-sm flex-1">
                        <div>
                          <span className="font-medium">{discount.name}</span>
                          <span className="text-muted-foreground ml-2">
                            ({discount.type === 'Percentage' ? `${discount.value}%` : `$${discount.value}`})
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{discount.description}</p>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600 mb-3 block">Apply Promo Codes</Label>
                <div className="border rounded-lg p-4 max-h-48 overflow-y-auto">
                  {mockPromoCodes.filter(p => p.status === 'Active').map((promo) => (
                    <div key={promo.id} className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id={`promo-${promo.id}`}
                        checked={newOffer.promoCodes.includes(promo.id)}
                        onCheckedChange={(checked) => handlePromoCodeChange(promo.id, checked)}
                      />
                      <Label htmlFor={`promo-${promo.id}`} className="text-sm flex-1">
                        <div>
                          <span className="font-medium font-mono text-blue-600">{promo.code}</span>
                          <span className="text-muted-foreground ml-2">
                            ({promo.type === 'Percentage' ? `${promo.value}%` : `$${promo.value}`})
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{promo.description}</p>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Validity Period */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Valid From *</Label>
                <Input 
                  type="date"
                  value={newOffer.validFrom}
                  onChange={(e) => setNewOffer({...newOffer, validFrom: e.target.value})}
                />
              </div>
              <div>
                <Label>Valid Until *</Label>
                <Input 
                  type="date"
                  value={newOffer.validTo}
                  onChange={(e) => setNewOffer({...newOffer, validTo: e.target.value})}
                />
              </div>
            </div>

            {/* Routes and Cabin Selection */}
            <div className="space-y-4">
              <div>
                <Label>Routes *</Label>
                <Textarea 
                  placeholder="Enter routes (e.g., NYC-LON, SFO-FRA, LAX-NRT)"
                  value={newOffer.routes}
                  onChange={(e) => setNewOffer({...newOffer, routes: e.target.value})}
                />
              </div>

              <div>
                <Label>Cabin Class *</Label>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="economy" 
                      checked={newOffer.cabin.includes('economy')}
                      onCheckedChange={(checked) => handleCabinChange('economy', checked)}
                    />
                    <Label htmlFor="economy">Economy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="business" 
                      checked={newOffer.cabin.includes('business')}
                      onCheckedChange={(checked) => handleCabinChange('business', checked)}
                    />
                    <Label htmlFor="business">Business</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="first" 
                      checked={newOffer.cabin.includes('first')}
                      onCheckedChange={(checked) => handleCabinChange('first', checked)}
                    />
                    <Label htmlFor="first">First</Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Minimum Spend (USD)</Label>
                <div className="relative">
                  <Input 
                    type="number" 
                    placeholder="0"
                    value={newOffer.minSpend}
                    onChange={(e) => setNewOffer({...newOffer, minSpend: parseInt(e.target.value) || 0})}
                  />
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div>
                <Label>Maximum Discount (%)</Label>
                <Input 
                  type="number" 
                  placeholder="0"
                  value={newOffer.maxDiscount}
                  onChange={(e) => setNewOffer({...newOffer, maxDiscount: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Contact Person</Label>
                <Input 
                  placeholder="Primary contact name"
                  value={newOffer.contactPerson}
                  onChange={(e) => setNewOffer({...newOffer, contactPerson: e.target.value})}
                />
              </div>
              <div>
                <Label>Contact Email</Label>
                <Input 
                  type="email" 
                  placeholder="contact@company.com"
                  value={newOffer.contactEmail}
                  onChange={(e) => setNewOffer({...newOffer, contactEmail: e.target.value})}
                />
              </div>
            </div>

            {/* Description and Terms */}
            <div className="space-y-4">
              <div>
                <Label>Offer Description *</Label>
                <Textarea 
                  placeholder="Detailed description of the offer, its benefits, and target audience"
                  rows={3}
                  value={newOffer.description}
                  onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
                />
              </div>

              <div>
                <Label>Terms & Conditions *</Label>
                <Textarea 
                  placeholder="Enter detailed terms and conditions, restrictions, booking requirements, etc."
                  rows={4}
                  value={newOffer.terms}
                  onChange={(e) => setNewOffer({...newOffer, terms: e.target.value})}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button variant="outline" onClick={handleSaveOffer}>
              Save as Draft
            </Button>
            <Button onClick={handleSaveOffer}>
              <Plus className="h-4 w-4 mr-2" />
              Create Offer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Offer Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Travel Offer</DialogTitle>
            <DialogDescription>
              Update the travel offer details
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Offer Title *</Label>
                <Input 
                  placeholder="Enter descriptive offer title"
                  value={newOffer.title}
                  onChange={(e) => setNewOffer({...newOffer, title: e.target.value})}
                />
              </div>
              <div>
                <Label>Corporate Client *</Label>
                <Select value={newOffer.corporate} onValueChange={(value) => setNewOffer({...newOffer, corporate: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select corporate client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TechCorp International">TechCorp International</SelectItem>
                    <SelectItem value="Global Manufacturing Ltd">Global Manufacturing Ltd</SelectItem>
                    <SelectItem value="Sunrise Financial Services">Sunrise Financial Services</SelectItem>
                    <SelectItem value="Healthcare Plus Inc">Healthcare Plus Inc</SelectItem>
                    <SelectItem value="Energy Solutions Corp">Energy Solutions Corp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Promo Codes and Discounts Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-600 mb-3 block">Applied Discounts</Label>
                <div className="border rounded-lg p-4 max-h-48 overflow-y-auto">
                  {mockDiscounts.filter(d => d.status === 'Active').map((discount) => (
                    <div key={discount.id} className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id={`edit-discount-${discount.id}`}
                        checked={newOffer.appliedDiscounts.includes(discount.id)}
                        onCheckedChange={(checked) => handleDiscountChange(discount.id, checked)}
                      />
                      <Label htmlFor={`edit-discount-${discount.id}`} className="text-sm flex-1">
                        <div>
                          <span className="font-medium">{discount.name}</span>
                          <span className="text-muted-foreground ml-2">
                            ({discount.type === 'Percentage' ? `${discount.value}%` : `$${discount.value}`})
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{discount.description}</p>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600 mb-3 block">Applied Promo Codes</Label>
                <div className="border rounded-lg p-4 max-h-48 overflow-y-auto">
                  {mockPromoCodes.filter(p => p.status === 'Active').map((promo) => (
                    <div key={promo.id} className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id={`edit-promo-${promo.id}`}
                        checked={newOffer.promoCodes.includes(promo.id)}
                        onCheckedChange={(checked) => handlePromoCodeChange(promo.id, checked)}
                      />
                      <Label htmlFor={`edit-promo-${promo.id}`} className="text-sm flex-1">
                        <div>
                          <span className="font-medium font-mono text-blue-600">{promo.code}</span>
                          <span className="text-muted-foreground ml-2">
                            ({promo.type === 'Percentage' ? `${promo.value}%` : `$${promo.value}`})
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{promo.description}</p>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Rest of the form fields would be similar to create dialog */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Valid From *</Label>
                <Input 
                  type="date"
                  value={newOffer.validFrom}
                  onChange={(e) => setNewOffer({...newOffer, validFrom: e.target.value})}
                />
              </div>
              <div>
                <Label>Valid Until *</Label>
                <Input 
                  type="date"
                  value={newOffer.validTo}
                  onChange={(e) => setNewOffer({...newOffer, validTo: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label>Offer Description *</Label>
              <Textarea 
                placeholder="Detailed description of the offer, its benefits, and target audience"
                rows={3}
                value={newOffer.description}
                onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveOffer}>
              <Plus className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create New Template Dialog */}
      <Dialog open={showCreateTemplateDialog} onOpenChange={setShowCreateTemplateDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
            <DialogDescription>
              Create a reusable template for offer creation
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Template Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Template Name *</Label>
                <Input 
                  placeholder="Enter template name"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                />
              </div>
              <div>
                <Label>Category *</Label>
                <Select value={newTemplate.category} onValueChange={(value) => setNewTemplate({...newTemplate, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Volume">Volume</SelectItem>
                    <SelectItem value="Executive">Executive</SelectItem>
                    <SelectItem value="SME">SME</SelectItem>
                    <SelectItem value="Seasonal">Seasonal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Description *</Label>
              <Textarea 
                placeholder="Describe the template and its intended use"
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
              />
            </div>

            {/* Template Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Discount Range</Label>
                <Input 
                  placeholder="e.g., 10-20%"
                  value={newTemplate.discount}
                  onChange={(e) => setNewTemplate({...newTemplate, discount: e.target.value})}
                />
              </div>
              <div>
                <Label>Cabin Class</Label>
                <Select value={newTemplate.cabin} onValueChange={(value) => setNewTemplate({...newTemplate, cabin: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cabin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Economy">Economy</SelectItem>
                    <SelectItem value="Economy Plus">Economy Plus</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="First">First</SelectItem>
                    <SelectItem value="Business/First">Business/First</SelectItem>
                    <SelectItem value="All Classes">All Classes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Base Price (USD)</Label>
                <Input 
                  type="number"
                  placeholder="0"
                  value={newTemplate.basePrice}
                  onChange={(e) => setNewTemplate({...newTemplate, basePrice: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label>Validity Period</Label>
                <Select value={newTemplate.validityPeriod} onValueChange={(value) => setNewTemplate({...newTemplate, validityPeriod: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3 months">3 months</SelectItem>
                    <SelectItem value="6 months">6 months</SelectItem>
                    <SelectItem value="9 months">9 months</SelectItem>
                    <SelectItem value="12 months">12 months</SelectItem>
                    <SelectItem value="18 months">18 months</SelectItem>
                    <SelectItem value="24 months">24 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Template Features */}
            <div>
              <Label>Template Features</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {['Lounge Access', 'Priority Boarding', 'Flexible Changes', 'Premium Seats', 'Group Discounts', 'Flexible Dates', 'Free Seat Selection', 'Bulk Booking', 'Concierge Service', 'Private Transfers', 'Hotel Partnerships', 'Unlimited Changes', 'Cost Effective', 'Online Management', 'Basic Amenities'].map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={`feature-${feature}`}
                      checked={newTemplate.features.includes(feature)}
                      onCheckedChange={(checked) => handleTemplateFeatureChange(feature, checked)}
                    />
                    <Label htmlFor={`feature-${feature}`} className="text-sm">{feature}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowCreateTemplateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Offer Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Offer Details</DialogTitle>
            <DialogDescription>
              Complete information about the selected offer
            </DialogDescription>
          </DialogHeader>
          
          {selectedOffer && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="text-lg font-semibold">{selectedOffer.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedOffer.id}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(selectedOffer.status)}>
                    {selectedOffer.status}
                  </Badge>
                  <Badge variant="outline">{selectedOffer.type}</Badge>
                </div>
              </div>

              {/* Applied Promo Codes and Discounts */}
              {(selectedOffer.appliedDiscounts?.length > 0 || selectedOffer.promoCodes?.length > 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Applied Promotions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedOffer.appliedDiscounts?.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium text-gray-600 mb-2 block">Applied Discounts</Label>
                          <div className="space-y-2">
                            {selectedOffer.appliedDiscounts.map(discountId => {
                              const discount = mockDiscounts.find(d => d.id === discountId);
                              return discount ? (
                                <div key={discountId} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <Percent className="h-4 w-4 text-blue-600" />
                                    <div>
                                      <p className="font-medium text-sm">{discount.name}</p>
                                      <p className="text-xs text-muted-foreground">{discount.description}</p>
                                    </div>
                                  </div>
                                  <Badge variant="secondary">
                                    {discount.type === 'Percentage' ? `${discount.value}%` : `$${discount.value}`}
                                  </Badge>
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                      
                      {selectedOffer.promoCodes?.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium text-gray-600 mb-2 block">Applied Promo Codes</Label>
                          <div className="space-y-2">
                            {selectedOffer.promoCodes.map(promoId => {
                              const promo = mockPromoCodes.find(p => p.id === promoId);
                              return promo ? (
                                <div key={promoId} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <Tag className="h-4 w-4 text-blue-600" />
                                    <div>
                                      <p className="font-medium text-sm font-mono text-blue-600">{promo.code}</p>
                                      <p className="text-xs text-muted-foreground">{promo.description}</p>
                                    </div>
                                  </div>
                                  <Badge variant="outline">
                                    {promo.type === 'Percentage' ? `${promo.value}%` : `$${promo.value}`}
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
                    <Label className="text-sm font-medium text-gray-600">Corporate Client</Label>
                    <p>{selectedOffer.corporate}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Contact Person</Label>
                    <p>{selectedOffer.contactPerson}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Contact Email</Label>
                    <p>{selectedOffer.contactEmail}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Cabin Class</Label>
                    <p>{selectedOffer.cabin}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Discount</Label>
                    <p>{selectedOffer.discount}%</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Valid Period</Label>
                    <p>{selectedOffer.validFrom} to {selectedOffer.validTo}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Minimum Spend</Label>
                    <p>${selectedOffer.minSpend?.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Maximum Discount</Label>
                    <p>{selectedOffer.maxDiscount}%</p>
                  </div>
                </div>
              </div>

              {/* Routes */}
              <div>
                <Label className="text-sm font-medium text-gray-600">Routes</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedOffer.routes?.map((route, index) => (
                    <Badge key={index} variant="secondary">{route}</Badge>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <Label className="text-sm font-medium text-gray-600">Description</Label>
                <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedOffer.description}</p>
              </div>

              {/* Terms & Conditions */}
              <div>
                <Label className="text-sm font-medium text-gray-600">Terms & Conditions</Label>
                <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedOffer.terms}</p>
              </div>

              {/* Performance Metrics */}
              <div>
                <Label className="text-sm font-medium text-gray-600 mb-3 block">Performance Metrics</Label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-3 border rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600">{selectedOffer.usage}%</p>
                    <p className="text-sm text-muted-foreground">Usage Rate</p>
                  </div>
                  <div className="p-3 border rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">{selectedOffer.conversion}%</p>
                    <p className="text-sm text-muted-foreground">Conversion</p>
                  </div>
                  <div className="p-3 border rounded-lg text-center">
                    <p className="text-2xl font-bold text-purple-600">{selectedOffer.bookings}</p>
                    <p className="text-sm text-muted-foreground">Bookings</p>
                  </div>
                  <div className="p-3 border rounded-lg text-center">
                    <p className="text-2xl font-bold text-orange-600">${(selectedOffer.revenue / 1000000).toFixed(1)}M</p>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Created By:</span>
                    <span className="text-sm">{selectedOffer.createdBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Last Modified:</span>
                    <span className="text-sm">{selectedOffer.lastModified}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Approval Status:</span>
                    <Badge variant="outline">{selectedOffer.approvalStatus}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Priority:</span>
                    <Badge variant={selectedOffer.priority === 'High' ? 'destructive' : 'secondary'}>
                      {selectedOffer.priority}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              Close
            </Button>
            {selectedOffer && (
              <Button onClick={() => {
                setShowViewDialog(false);
                handleEditOffer(selectedOffer);
              }}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Offer
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Order Dialog */}
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Complete information about the selected order
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="text-lg font-semibold">Order {selectedOrder.id}</h3>
                  <p className="text-sm text-muted-foreground">Booking Reference: {selectedOrder.bookingReference}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={
                    selectedOrder.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                    selectedOrder.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                    selectedOrder.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {selectedOrder.status}
                  </Badge>
                  <Badge variant="outline">{selectedOrder.paymentStatus}</Badge>
                </div>
              </div>

              {/* Applied Promo Codes and Discounts */}
              {(selectedOrder.appliedDiscounts?.length > 0 || selectedOrder.promoCodes?.length > 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Applied Promotions in Order</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedOrder.appliedDiscounts?.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium text-gray-600 mb-2 block">Applied Discounts</Label>
                          <div className="space-y-2">
                            {selectedOrder.appliedDiscounts.map(discountId => {
                              const discount = mockDiscounts.find(d => d.id === discountId);
                              return discount ? (
                                <div key={discountId} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <Percent className="h-4 w-4 text-blue-600" />
                                    <div>
                                      <p className="font-medium text-sm">{discount.name}</p>
                                      <p className="text-xs text-muted-foreground">{discount.description}</p>
                                    </div>
                                  </div>
                                  <Badge variant="secondary">
                                    {discount.type === 'Percentage' ? `${discount.value}%` : `$${discount.value}`}
                                  </Badge>
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                      
                      {selectedOrder.promoCodes?.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium text-gray-600 mb-2 block">Applied Promo Codes</Label>
                          <div className="space-y-2">
                            {selectedOrder.promoCodes.map(promoId => {
                              const promo = mockPromoCodes.find(p => p.id === promoId);
                              return promo ? (
                                <div key={promoId} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <Tag className="h-4 w-4 text-blue-600" />
                                    <div>
                                      <p className="font-medium text-sm font-mono text-blue-600">{promo.code}</p>
                                      <p className="text-xs text-muted-foreground">{promo.description}</p>
                                    </div>
                                  </div>
                                  <Badge variant="outline">
                                    {promo.type === 'Percentage' ? `${promo.value}%` : `$${promo.value}`}
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

              {/* Order Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Corporate Client</Label>
                    <p>{selectedOrder.corporate}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Contact Person</Label>
                    <p>{selectedOrder.contactPerson}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Order Date</Label>
                    <p>{selectedOrder.date}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Number of Passengers</Label>
                    <p>{selectedOrder.passengers}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Offer</Label>
                    <p>{selectedOrder.offer}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Order Value</Label>
                    <p className="text-lg font-bold">${selectedOrder.value.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Payment Status</Label>
                    <Badge variant={selectedOrder.paymentStatus === 'Paid' ? 'default' : 'secondary'}>
                      {selectedOrder.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Travel Details */}
              <div>
                <Label className="text-sm font-medium text-gray-600 mb-3 block">Travel Information</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Routes</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedOrder.routes?.map((route, index) => (
                        <Badge key={index} variant="secondary">{route}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Travel Dates</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedOrder.travelDates?.map((date, index) => (
                        <Badge key={index} variant="outline">{date}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              {selectedOrder.specialRequests && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Special Requests</Label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedOrder.specialRequests}</p>
                </div>
              )}

              {/* Order Summary */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3">Order Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Base Value:</span>
                    <span>${(selectedOrder.value * 0.9).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & Fees:</span>
                    <span>${(selectedOrder.value * 0.1).toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total Amount:</span>
                    <span>${selectedOrder.value.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOrderDialog(false)}>
              Close
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </Button>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Offer Dialog */}
      <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Offer</DialogTitle>
            <DialogDescription>
              Send this offer to the corporate client
            </DialogDescription>
          </DialogHeader>
          
          {selectedOffer && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium">{selectedOffer.title}</h4>
                <p className="text-sm text-muted-foreground">{selectedOffer.corporate}</p>
              </div>
              
              <div>
                <Label>Recipient Email</Label>
                <Input type="email" defaultValue={selectedOffer.contactEmail} />
              </div>
              
              <div>
                <Label>Message</Label>
                <Textarea placeholder="Add a personal message..." />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="copy-sender" />
                <Label htmlFor="copy-sender">Send copy to sender</Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSendDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowSendDialog(false)}>
              <Send className="h-4 w-4 mr-2" />
              Send Offer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ATPCO Filing Dialog */}
      <Dialog open={showAtpcoDialog} onOpenChange={setShowAtpcoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>File Offer to ATPCO</DialogTitle>
            <DialogDescription>
              Submit this offer to ATPCO for filing and distribution
            </DialogDescription>
          </DialogHeader>
          
          {selectedOffer && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium">{selectedOffer.title}</h4>
                <p className="text-sm text-muted-foreground">{selectedOffer.corporate}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Filing Priority</Label>
                  <Select defaultValue="Medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High Priority</SelectItem>
                      <SelectItem value="Medium">Medium Priority</SelectItem>
                      <SelectItem value="Low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Effective Date</Label>
                  <Input type="date" defaultValue={selectedOffer.validFrom} />
                </div>
              </div>
              
              <div>
                <Label>Filing Notes</Label>
                <Textarea placeholder="Add any special filing instructions..." />
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This offer will be submitted to ATPCO for review and filing. Processing typically takes 2-4 hours.
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAtpcoDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowAtpcoDialog(false)}>
              <Upload className="h-4 w-4 mr-2" />
              Submit to ATPCO
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}