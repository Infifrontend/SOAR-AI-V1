import { useState } from 'react';
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
import { ContractCreation } from './ContractCreation';
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
  HandshakeIcon as Handshake
} from 'lucide-react';

const mockVendors = [
  {
    id: 1,
    name: "Global Travel Solutions",
    type: "Travel Agency",
    location: "New York, USA",
    aiScore: 98,
    rating: 4.9,
    experience: 15,
    employees: 250,
    specialties: ["Corporate Travel", "International", "Group Bookings"],
    pricing: "Competitive",
    response: "< 2 hours",
    contracts: 23,
    revenue: 1250000,
    phone: "+1 (555) 123-4567",
    email: "contact@globaltravelsolutions.com",
    website: "www.globaltravelsolutions.com",
    aiRecommendation: "Highly recommended for large-scale corporate travel programs. Excellent track record and competitive pricing.",
    compliance: 95,
    financialStability: 98,
    passengerVolume: "50K-100K",
    specialization: ["Business", "Group"],
    iataAccredited: true,
    technologyCapability: ["GDS", "Direct API"],
    marketReach: "Global",
    growthPotential: "High",
    creditProfile: "Excellent",
    certifications: ["ISO 9001", "GDPR", "PCI DSS"]
  },
  {
    id: 2,
    name: "Corporate Journey Ltd",
    type: "Corporate Travel",
    location: "London, UK",
    aiScore: 95,
    rating: 4.8,
    experience: 12,
    employees: 180,
    specialties: ["Executive Travel", "Event Management", "Cost Optimization"],
    pricing: "Premium",
    response: "< 1 hour",
    contracts: 18,
    revenue: 980000,
    phone: "+44 20 7123 4567",
    email: "info@corporatejourney.co.uk",
    website: "www.corporatejourney.co.uk",
    aiRecommendation: "Perfect for premium executive travel requirements. Outstanding service quality and rapid response times.",
    compliance: 92,
    financialStability: 94,
    passengerVolume: "25K-50K",
    specialization: ["Business", "MICE"],
    iataAccredited: true,
    technologyCapability: ["GDS", "Direct API", "Mobile App"],
    marketReach: "Regional",
    growthPotential: "Medium",
    creditProfile: "Good",
    certifications: ["ISO 9001", "GDPR"]
  },
  {
    id: 3,
    name: "Elite Business Travel",
    type: "Travel Agency",
    location: "Singapore",
    aiScore: 92,
    rating: 4.7,
    experience: 10,
    employees: 120,
    specialties: ["Asia-Pacific", "Leisure Travel", "Technology Integration"],
    pricing: "Competitive",
    response: "< 3 hours",
    contracts: 15,
    revenue: 750000,
    phone: "+65 6123 4567",
    email: "hello@elitebusinesstravel.sg",
    website: "www.elitebusinesstravel.sg",
    aiRecommendation: "Excellent choice for Asia-Pacific operations. Strong technology platform and regional expertise.",
    compliance: 89,
    financialStability: 91,
    passengerVolume: "10K-25K",
    specialization: ["Leisure", "Business"],
    iataAccredited: true,
    technologyCapability: ["GDS", "Mobile App"],
    marketReach: "Regional",
    growthPotential: "High",
    creditProfile: "Good",
    certifications: ["ISO 9001", "PCI DSS"]
  },
  {
    id: 4,
    name: "Premier Voyage Group",
    type: "Travel Management",
    location: "Dubai, UAE",
    aiScore: 89,
    rating: 4.6,
    experience: 8,
    employees: 95,
    specialties: ["Middle East", "Luxury Travel", "VIP Services"],
    pricing: "Premium",
    response: "< 4 hours",
    contracts: 12,
    revenue: 620000,
    phone: "+971 4 123 4567",
    email: "contact@premiervoyage.ae",
    website: "www.premiervoyage.ae",
    aiRecommendation: "Ideal for Middle East operations and luxury travel requirements. Strong regional presence.",
    compliance: 87,
    financialStability: 88,
    passengerVolume: "5K-10K",
    specialization: ["Leisure", "VIP"],
    iataAccredited: false,
    technologyCapability: ["GDS"],
    marketReach: "Regional",
    growthPotential: "Medium",
    creditProfile: "Fair",
    certifications: ["GDPR"]
  }
];

interface VendorSearchProps {
  initialFilters?: any;
  onNavigate?: (section: string, filters?: any) => void;
}

export function VendorSearch({ initialFilters, onNavigate }: VendorSearchProps) {
  const [searchParams, setSearchParams] = useState({
    serviceType: '',
    location: '',
    budget: '',
    timeline: '',
    specialRequirements: '',
    ...initialFilters
  });

  const [advancedFilters, setAdvancedFilters] = useState({
    passengerVolume: '',
    specialization: [],
    pastAirlineSales: '',
    iataAccreditation: '',
    technologyCapability: [],
    marketReach: '',
    growthPotential: '',
    creditProfile: '',
    certifications: []
  });

  const [filteredVendors, setFilteredVendors] = useState(mockVendors);
  const [isSearching, setIsSearching] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showContractCreation, setShowContractCreation] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const handleSearch = async () => {
    setIsSearching(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setFilteredVendors(mockVendors);
    setIsSearching(false);
  };

  const handleInitiateContract = (vendor) => {
    setSelectedVendor(vendor);
    setShowContractCreation(true);
  };

  const handleBackToSearch = () => {
    setShowContractCreation(false);
    setSelectedVendor(null);
  };

  const applyAdvancedFilters = () => {
    // Apply advanced filtering logic here
    console.log('Applying advanced filters:', advancedFilters);
    setShowAdvancedFilters(false);
  };

  const resetAdvancedFilters = () => {
    setAdvancedFilters({
      passengerVolume: '',
      specialization: [],
      pastAirlineSales: '',
      iataAccreditation: '',
      technologyCapability: [],
      marketReach: '',
      growthPotential: '',
      creditProfile: '',
      certifications: []
    });
  };

  const handleSpecializationChange = (value: string, checked: boolean) => {
    setAdvancedFilters(prev => ({
      ...prev,
      specialization: checked 
        ? [...prev.specialization, value]
        : prev.specialization.filter(item => item !== value)
    }));
  };

  const handleTechnologyChange = (value: string, checked: boolean) => {
    setAdvancedFilters(prev => ({
      ...prev,
      technologyCapability: checked 
        ? [...prev.technologyCapability, value]
        : prev.technologyCapability.filter(item => item !== value)
    }));
  };

  const handleCertificationChange = (value: string, checked: boolean) => {
    setAdvancedFilters(prev => ({
      ...prev,
      certifications: checked 
        ? [...prev.certifications, value]
        : prev.certifications.filter(item => item !== value)
    }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return "text-green-600";
    if (score >= 90) return "text-blue-600";
    if (score >= 85) return "text-yellow-600";
    return "text-gray-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 95) return "default";
    if (score >= 90) return "secondary";
    return "outline";
  };

  // Show ContractCreation if it's active
  if (showContractCreation && selectedVendor) {
    return (
      <ContractCreation 
        vendorData={selectedVendor}
        onNavigate={onNavigate}
        onBack={handleBackToSearch}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Vendor Search Parameters
          </CardTitle>
          <CardDescription>
            Define your requirements to get AI-powered vendor recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="serviceType">Service Type</Label>
              <Select value={searchParams.serviceType} onValueChange={(value) => setSearchParams({...searchParams, serviceType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="travel-agency">Travel Agency</SelectItem>
                  <SelectItem value="corporate-travel">Corporate Travel</SelectItem>
                  <SelectItem value="travel-management">Travel Management</SelectItem>
                  <SelectItem value="ground-services">Ground Services</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Preferred Location</Label>
              <Select value={searchParams.location} onValueChange={(value) => setSearchParams({...searchParams, location: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="north-america">North America</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                  <SelectItem value="middle-east">Middle East</SelectItem>
                  <SelectItem value="global">Global Coverage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="budget">Budget Range</Label>
              <Select value={searchParams.budget} onValueChange={(value) => setSearchParams({...searchParams, budget: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-500k">Under $500K</SelectItem>
                  <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                  <SelectItem value="1m-5m">$1M - $5M</SelectItem>
                  <SelectItem value="above-5m">Above $5M</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="timeline">Implementation Timeline</Label>
              <Select value={searchParams.timeline} onValueChange={(value) => setSearchParams({...searchParams, timeline: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate (1-2 weeks)</SelectItem>
                  <SelectItem value="short">Short term (1-3 months)</SelectItem>
                  <SelectItem value="medium">Medium term (3-6 months)</SelectItem>
                  <SelectItem value="long">Long term (6+ months)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="specialRequirements">Special Requirements</Label>
              <Input
                id="specialRequirements"
                placeholder="e.g., 24/7 support, specific certifications, language requirements"
                value={searchParams.specialRequirements}
                onChange={(e) => setSearchParams({...searchParams, specialRequirements: e.target.value})}
              />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <Button onClick={handleSearch} disabled={isSearching} className="flex items-center gap-2">
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  AI Processing...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Search Vendors
                </>
              )}
            </Button>
            
            <Dialog open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Advanced Filters
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Settings2 className="h-5 w-5" />
                    Advanced Vendor Filtering Criteria
                  </DialogTitle>
                  <DialogDescription>
                    Apply detailed criteria to find vendors that best match your specific requirements
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* All existing advanced filter content */}
                  <div>
                    <Label>Passenger Volume (Monthly/Annual Count)</Label>
                    <Select value={advancedFilters.passengerVolume} onValueChange={(value) => setAdvancedFilters({...advancedFilters, passengerVolume: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select passenger volume range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-5k">Under 5K</SelectItem>
                        <SelectItem value="5k-10k">5K - 10K</SelectItem>
                        <SelectItem value="10k-25k">10K - 25K</SelectItem>
                        <SelectItem value="25k-50k">25K - 50K</SelectItem>
                        <SelectItem value="50k-100k">50K - 100K</SelectItem>
                        <SelectItem value="above-100k">Above 100K</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">Average or forecasted number of passengers they handle/book</p>
                  </div>

                  <div>
                    <Label>Specialization</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {['Leisure', 'Business', 'Group', 'MICE'].map((spec) => (
                        <div key={spec} className="flex items-center space-x-2">
                          <Checkbox
                            id={`spec-${spec}`}
                            checked={advancedFilters.specialization.includes(spec)}
                            onCheckedChange={(checked) => handleSpecializationChange(spec, checked as boolean)}
                          />
                          <Label htmlFor={`spec-${spec}`} className="text-sm">{spec}</Label>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">The segment they primarily operate in</p>
                  </div>
                </div>

                <DialogFooter className="flex justify-between">
                  <Button variant="outline" onClick={resetAdvancedFilters}>
                    Reset Filters
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowAdvancedFilters(false)}>
                      Cancel
                    </Button>
                    <Button onClick={applyAdvancedFilters}>
                      Apply Filters
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              AI-Ranked Vendor Recommendations
            </span>
            <Badge variant="secondary">{filteredVendors.length} vendors found</Badge>
          </CardTitle>
          <CardDescription>
            Vendors ranked by AI algorithm based on your specific requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredVendors.map((vendor, index) => (
              <Card key={vendor.id} className="relative">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-full font-bold">
                        #{index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{vendor.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {vendor.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {vendor.employees} employees
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {vendor.experience} years
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={getScoreBadge(vendor.aiScore)}>
                          AI Score: {vendor.aiScore}/100
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{vendor.rating}</span>
                        </div>
                      </div>
                      <Progress value={vendor.aiScore} className="w-24" />
                    </div>
                  </div>

                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="metrics">Metrics</TabsTrigger>
                      <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
                      <TabsTrigger value="contact">Contact</TabsTrigger>
                      <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Service Type</Label>
                          <p className="font-medium">{vendor.type}</p>
                        </div>
                        <div>
                          <Label>Pricing Model</Label>
                          <p className="font-medium">{vendor.pricing}</p>
                        </div>
                        <div>
                          <Label>Response Time</Label>
                          <p className="font-medium">{vendor.response}</p>
                        </div>
                      </div>
                      <div>
                        <Label>Specialties</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {vendor.specialties.map((specialty) => (
                            <Badge key={specialty} variant="outline">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="metrics" className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{vendor.compliance}%</div>
                          <Label className="text-xs">Compliance Score</Label>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{vendor.financialStability}%</div>
                          <Label className="text-xs">Financial Stability</Label>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{vendor.contracts}</div>
                          <Label className="text-xs">Active Contracts</Label>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">${(vendor.revenue / 1000).toFixed(0)}K</div>
                          <Label className="text-xs">Annual Revenue</Label>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="capabilities" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label>Technology Capabilities</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {vendor.technologyCapability.map((tech) => (
                              <Badge key={tech} variant="secondary">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label>Certifications</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {vendor.certifications.map((cert) => (
                              <Badge key={cert} variant="outline">
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label>Market Reach</Label>
                          <p className="font-medium">{vendor.marketReach}</p>
                        </div>
                        <div>
                          <Label>IATA Accredited</Label>
                          <Badge variant={vendor.iataAccredited ? "default" : "outline"}>
                            {vendor.iataAccredited ? "Yes" : "No"}
                          </Badge>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="contact" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <Label>Phone</Label>
                            <p className="font-medium">{vendor.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <Label>Email</Label>
                            <p className="font-medium">{vendor.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <Label>Website</Label>
                            <a href={`https://${vendor.website}`} className="font-medium text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                              {vendor.website}
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <Label>Location</Label>
                            <p className="font-medium">{vendor.location}</p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="ai-analysis" className="space-y-4">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-500 rounded-lg">
                            <TrendingUp className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <Label className="text-blue-800 font-semibold">AI Recommendation</Label>
                            <p className="text-blue-700 mt-1">{vendor.aiRecommendation}</p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Growth Potential</Label>
                          <Badge variant={vendor.growthPotential === 'High' ? 'default' : 'secondary'}>
                            {vendor.growthPotential}
                          </Badge>
                        </div>
                        <div>
                          <Label>Credit Profile</Label>
                          <Badge variant={vendor.creditProfile === 'Excellent' ? 'default' : 'outline'}>
                            {vendor.creditProfile}
                          </Badge>
                        </div>
                        <div>
                          <Label>Passenger Volume</Label>
                          <p className="font-medium">{vendor.passengerVolume}</p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <Separator className="my-4" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Rank #{index + 1}
                      </Badge>
                      <Badge variant={getScoreBadge(vendor.aiScore)}>
                        {vendor.aiScore}/100 Match
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-1" />
                        Contact
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleInitiateContract(vendor)}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      >
                        <Handshake className="h-4 w-4 mr-1" />
                        Initiate Contract
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}