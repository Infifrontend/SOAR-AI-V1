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
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Users,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  Globe,
  Briefcase,
  CreditCard,
  Star,
  TrendingUp,
  BarChart3,
  Target,
  Activity,
  Plane,
  FileText,
  Shield,
  Leaf,
  Route,
  PieChart,
  Upload,
  Download,
  Check,
  X,
  Plus,
  Edit,
  Save,
  Award,
  Percent,
} from "lucide-react";

interface CorporateProfileProps {
  corporateData: any;
  onBack: () => void;
}

export function CorporateProfile({
  corporateData,
  onBack,
}: CorporateProfileProps) {
  return (
    <div
      className="space-y-6 p-5"
      style={{
        fontFamily:
          'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        backgroundColor: "#F7FAFF",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {corporateData.name}
          </h1>
          <p className="text-gray-600 mt-1">
            {corporateData.industry} • {corporateData.location}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="default"
            className="bg-[#FD9646] hover:bg-[#FD9646]/90 text-white"
          >
            AI Score: {corporateData.aiScore}/100
          </Badge>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-gray-900">
              {corporateData.rating}
            </span>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Employees</p>
                <p className="text-2xl font-bold">
                  {corporateData.employees?.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Travel Budget</p>
                <p className="text-2xl font-bold">
                  ${corporateData.travelBudget}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-100">
                <Plane className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Annual Trips</p>
                <p className="text-2xl font-bold">
                  {corporateData.annualTravelVolume}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-orange-100">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">
                  ${(corporateData.revenue / 1000000).toFixed(0)}M
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <Tabs defaultValue="company-info" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-white rounded-lg p-1 border">
          <TabsTrigger
            value="company-info"
            className="text-sm px-4 py-2 rounded-md data-[state=active]:bg-gray-50 data-[state=active]:text-gray-900"
          >
            Company Info
          </TabsTrigger>
          <TabsTrigger
            value="travel-profile"
            className="text-sm px-4 py-2 rounded-md data-[state=active]:bg-gray-50 data-[state=active]:text-gray-900"
          >
            Travel Profile
          </TabsTrigger>
          <TabsTrigger
            value="financial"
            className="text-sm px-4 py-2 rounded-md data-[state=active]:bg-gray-50 data-[state=active]:text-gray-900"
          >
            Financial
          </TabsTrigger>
          <TabsTrigger
            value="contacts"
            className="text-sm px-4 py-2 rounded-md data-[state=active]:bg-gray-50 data-[state=active]:text-gray-900"
          >
            Contacts
          </TabsTrigger>
          <TabsTrigger
            value="partnerships"
            className="text-sm px-4 py-2 rounded-md data-[state=active]:bg-gray-50 data-[state=active]:text-gray-900"
          >
            Partnerships
          </TabsTrigger>
          <TabsTrigger
            value="insights"
            className="text-sm px-4 py-2 rounded-md data-[state=active]:bg-gray-50 data-[state=active]:text-gray-900"
          >
            AI Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company-info" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Company Type
                    </p>
                    <p className="font-semibold">{corporateData.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Industry</p>
                    <p className="font-semibold">{corporateData.industry}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Established</p>
                    <p className="font-semibold">{corporateData.established}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Company Size
                    </p>
                    <p className="font-semibold">{corporateData.companySize}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Core Specialties
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {corporateData.specialties?.map((specialty, index) => (
                      <Badge key={index} variant="outline">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location & Operations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">{corporateData.location}</p>
                    <p className="text-sm text-muted-foreground">
                      Headquarters
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">
                      {corporateData.destinations?.join(", ")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Operating Regions
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">
                      {corporateData.employees?.toLocaleString()} employees
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Global workforce
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="travel-profile" className="space-y-6">
          {/* Travel Spend & Volume Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Travel Spend & Volume Analysis
                </CardTitle>
                <CardDescription>
                  Annual travel expenditure and passenger volume breakdown
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50">
                    <Label className="text-sm text-gray-600 font-medium">
                      Estimated Annual Travel Spend (Airfare Only)
                    </Label>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-2xl font-bold text-gray-900">
                        $2.8M
                      </div>
                      <Edit className="h-4 w-4 text-gray-400 cursor-pointer" />
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                    <Label className="text-sm text-gray-600 font-medium">
                      Total Travel Budget
                    </Label>
                    <div className="text-2xl font-bold text-gray-900 mt-2">
                      ${corporateData.travelBudget}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    Average Monthly Passenger Count
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium">
                          Domestic Travel
                        </Label>
                        <Edit className="h-4 w-4 text-gray-400 cursor-pointer" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        285
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        passengers per month
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium">
                          International Travel
                        </Label>
                        <Edit className="h-4 w-4 text-gray-400 cursor-pointer" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        142
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        passengers per month
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center">
                    <div className="w-1 h-2 bg-gray-400 rounded-sm"></div>
                  </div>
                  Travel Purpose Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-800">
                        Business Meetings
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-900">
                          70%
                        </span>
                        <Edit className="h-4 w-4 text-gray-400 cursor-pointer" />
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-[#FD9646] h-2 rounded-full"
                        style={{ width: "70%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-800">
                        Training & Development
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-900">
                          20%
                        </span>
                        <Edit className="h-4 w-4 text-gray-400 cursor-pointer" />
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-[#FD9646] h-2 rounded-full"
                        style={{ width: "20%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-800">
                        Events & Conferences
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-900">
                          10%
                        </span>
                        <Edit className="h-4 w-4 text-gray-400 cursor-pointer" />
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-[#FD9646] h-2 rounded-full"
                        style={{ width: "10%" }}
                      ></div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-6 flex items-center justify-center gap-2 text-gray-600 border-gray-200 hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" />
                  Add Purpose
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Key Travel Routes & Cabin Class Preferences */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="h-5 w-5" />
                  Key Travel Routes / Sectors
                </CardTitle>
                <CardDescription>
                  Primary travel corridors and route frequency
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">New York ↔ London</p>
                      <p className="text-sm text-gray-500">
                        Bi-weekly • Medium Volume
                      </p>
                    </div>
                    <Edit className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">San Francisco ↔ Tokyo</p>
                      <p className="text-sm text-gray-500">
                        Bi-weekly • Medium Volume
                      </p>
                    </div>
                    <Edit className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">Chicago ↔ Frankfurt</p>
                      <p className="text-sm text-gray-500">
                        Monthly • Medium Volume
                      </p>
                    </div>
                    <Edit className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">Dallas ↔ Mumbai</p>
                      <p className="text-sm text-gray-500">
                        Monthly • Low Volume
                      </p>
                    </div>
                    <Edit className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Route
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="h-5 w-5" />
                  Cabin Class Preferences
                </CardTitle>
                <CardDescription>
                  Preferred cabin class distribution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="font-medium">Economy Class</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">65%</span>
                      <Edit className="h-4 w-4 text-gray-400 cursor-pointer" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="font-medium">Business Class</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">30%</span>
                      <Edit className="h-4 w-4 text-gray-400 cursor-pointer" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="font-medium">First Class</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">5%</span>
                      <Edit className="h-4 w-4 text-gray-400 cursor-pointer" />
                    </div>
                  </div>
                </div>
                <div className="pt-2">
                  <Label className="text-sm text-gray-600 font-medium">
                    Policy Notes
                  </Label>
                  <p className="text-sm text-gray-500 mt-1 p-2 bg-gray-50 rounded">
                    C-level executives: Business class for flights 4 hours...
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Travel Partners & Corporate Programs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Current Travel Partners / Airlines
                </CardTitle>
                <CardDescription>
                  Existing airline partnerships and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Plane className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Delta Air Lines</p>
                        <p className="text-sm text-gray-500">Primary</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[#FD9646] text-white">
                        Contract
                      </Badge>
                      <Edit className="h-4 w-4 text-gray-400 cursor-pointer" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Plane className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold">United Airlines</p>
                        <p className="text-sm text-gray-500">Secondary</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[#FD9646] text-white">
                        Contract
                      </Badge>
                      <Edit className="h-4 w-4 text-gray-400 cursor-pointer" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Plane className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold">British Airways</p>
                        <p className="text-sm text-gray-500">International</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">No Contract</Badge>
                      <Edit className="h-4 w-4 text-gray-400 cursor-pointer" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Plane className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Singapore Airlines</p>
                        <p className="text-sm text-gray-500">Asia-Pacific</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">No Contract</Badge>
                      <Edit className="h-4 w-4 text-gray-400 cursor-pointer" />
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Partner
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Corporate Programs Enrolled
                </CardTitle>
                <CardDescription>
                  Existing airline corporate and loyalty programs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">Delta SkyMiles Corporate</p>
                      <p className="text-sm text-gray-500">Platinum Level</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={true} />
                      <Edit className="h-4 w-4 text-gray-400 cursor-pointer" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">
                        United MileagePlus Corporate
                      </p>
                      <p className="text-sm text-gray-500">Gold Level</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={true} />
                      <Edit className="h-4 w-4 text-gray-400 cursor-pointer" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">American Business Extra</p>
                      <p className="text-sm text-gray-500">Silver Level</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={false} />
                      <Edit className="h-4 w-4 text-gray-400 cursor-pointer" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">
                        British Airways On Business
                      </p>
                      <p className="text-sm text-gray-500">Bronze Level</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={true} />
                      <Edit className="h-4 w-4 text-gray-400 cursor-pointer" />
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Program
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Travel Policy Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Travel Policy Management
              </CardTitle>
              <CardDescription>
                Corporate travel policy documentation and compliance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-semibold">
                      Travel Policy Attached?
                    </Label>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="policy-yes"
                          name="policy"
                          defaultChecked
                        />
                        <Label htmlFor="policy-yes" className="font-medium">
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" id="policy-no" name="policy" />
                        <Label htmlFor="policy-no" className="font-medium">
                          No
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg text-center bg-gray-50">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Current policy: "Corporate_Travel_Policy_2024.pdf"
                    </p>
                    <div className="flex items-center gap-2 justify-center">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Update
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-semibold">
                      Policy Compliance Level
                    </Label>
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-[#FD9646] h-3 rounded-full"
                          style={{ width: "95%" }}
                        ></div>
                      </div>
                      <div className="text-right mt-1">
                        <span className="font-bold text-lg">95%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-semibold">
                      Policy Last Updated
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">March 15, 2024</p>
                  </div>

                  <div>
                    <Label className="text-base font-semibold">
                      Policy Review Schedule
                    </Label>
                    <Select defaultValue="annual">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="semi-annual">Semi-Annual</SelectItem>
                        <SelectItem value="annual">Annual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Key Policy Highlights
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-1">Booking Window</h4>
                    <p className="text-sm text-gray-600">
                      14 days advance booking required
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-1">Approval Limit</h4>
                    <p className="text-sm text-gray-600">
                      $1,500 without pre-approval
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-1">Preferred Suppliers</h4>
                    <p className="text-sm text-gray-600">
                      Must use contracted airlines
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Travel Team Structure */}
          <Card>
            <CardHeader>
              <CardTitle>Travel Team Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    150
                  </div>
                  <p className="text-sm text-gray-500">Regular Travelers</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    3
                  </div>
                  <p className="text-sm text-gray-500">Travel Managers</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    12
                  </div>
                  <p className="text-sm text-gray-500">Active Contracts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Annual Revenue
                    </p>
                    <p className="text-2xl font-bold">
                      ${(corporateData.revenue / 1000000).toFixed(0)}M
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Travel Budget
                    </p>
                    <p className="text-2xl font-bold">
                      ${corporateData.travelBudget}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Credit Rating
                    </p>
                    <Badge
                      variant="default"
                      className="text-lg p-2 bg-[rgb(253,150,70)] text-white"
                    >
                      {corporateData.creditRating}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Payment Terms
                    </p>
                    <p className="font-semibold">
                      {corporateData.paymentTerms}
                    </p>
                  </div>
                </div>
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Financial Stability
                  </p>
                  <div className="flex items-center gap-3">
                    <Progress
                      value={corporateData.financialStability}
                      className="flex-1"
                    />
                    <span className="font-semibold">
                      {corporateData.financialStability}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance & Risk</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Compliance Score</span>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={corporateData.compliance}
                        className="w-20"
                      />
                      <span className="font-semibold">
                        {corporateData.compliance}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sustainability Focus</span>
                    <Badge
                      className="bg-[rgb(253,150,70)] text-white"
                      variant={
                        corporateData.sustainabilityFocus === "High"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {corporateData.sustainabilityFocus}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Market Segment</span>
                    <span className="font-medium">
                      {corporateData.marketSegment}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">{corporateData.phone}</p>
                      <p className="text-sm text-muted-foreground">
                        Main Office
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">{corporateData.email}</p>
                      <p className="text-sm text-muted-foreground">
                        Corporate Travel
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <a
                        href={`https://${corporateData.website}`}
                        className="font-semibold text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {corporateData.website}
                      </a>
                      <p className="text-sm text-muted-foreground">
                        Company Website
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">
                        {corporateData.travelManagers} Travel Managers
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Decision Makers
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">{corporateData.location}</p>
                      <p className="text-sm text-muted-foreground">
                        Headquarters
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partnerships" className="space-y-6">
          {/* <Card>
            <CardHeader>
              <CardTitle>Technology Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {corporateData.technologyIntegration?.map(
                  (tech, index) => (
                    console.log(tech, "technologyIntegration", corporateData),
                    (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-3 border rounded-lg"
                      >
                        <Activity className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">{tech}</span>
                      </div>
                    )
                  ),
                )}
              </div>
            </CardContent>
          </Card> */}

            <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Current Travel Partners / Airlines
                  </CardTitle>
                  <CardDescription>
                    Existing airline partnerships and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Plane className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold">Delta Air Lines</p>
                          <p className="text-sm text-gray-500">Primary</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-[#FD9646] text-white">
                          Contract
                        </Badge>
                        <Edit className="h-4 w-4 text-gray-400 cursor-pointer" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Plane className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold">United Airlines</p>
                          <p className="text-sm text-gray-500">Secondary</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-[#FD9646] text-white">
                          Contract
                        </Badge>
                        <Edit className="h-4 w-4 text-gray-400 cursor-pointer" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Plane className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold">British Airways</p>
                          <p className="text-sm text-gray-500">International</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">No Contract</Badge>
                        <Edit className="h-4 w-4 text-gray-400 cursor-pointer" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Plane className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold">Singapore Airlines</p>
                          <p className="text-sm text-gray-500">Asia-Pacific</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">No Contract</Badge>
                        <Edit className="h-4 w-4 text-gray-400 cursor-pointer" />
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Partner
                  </Button>
                </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Partnership Opportunities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Volume Partnership
                  </h4>
                  <p className="text-sm text-blue-700">
                    High travel volume makes this corporate ideal for volume-based
                    partnerships with tiered benefits.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">
                    Sustainability Initiative
                  </h4>
                  <p className="text-sm text-green-700">
                    Strong sustainability focus aligns with carbon offset programs
                    and eco-friendly travel options.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">
                    Technology Integration
                  </h4>
                  <p className="text-sm text-purple-700">
                    Advanced technology requirements present opportunities for API
                    integration and digital solutions.
                  </p>
                </div>
              </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Partnership Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">
                        Partnership Recommendation
                      </h4>
                      <p className="text-blue-700">
                        {corporateData.aiRecommendation}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-semibold mb-2">Key Strengths</h5>
                    <ul className="space-y-1 text-sm">
                      <li>
                        • High travel volume ({corporateData.annualTravelVolume}
                        )
                      </li>
                      <li>
                        • Strong financial stability (
                        {corporateData.financialStability}%)
                      </li>
                      <li>
                        • Excellent credit rating ({corporateData.creditRating})
                      </li>
                      <li>• Technology-forward approach</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-semibold mb-2">Opportunity Areas</h5>
                    <ul className="space-y-1 text-sm">
                      <li>• Premium class upgrades</li>
                      <li>• Loyalty program enrollment</li>
                      <li>• Corporate sustainability programs</li>
                      <li>• API integration benefits</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-4">
                  <h5 className="font-semibold mb-3">
                    Partnership Score Breakdown
                  </h5>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Travel Volume Potential</span>
                      <div className="flex items-center gap-2">
                        <Progress value={95} className="w-32" />
                        <span className="text-sm font-medium">95%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Financial Reliability</span>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={corporateData.financialStability}
                          className="w-32"
                        />
                        <span className="text-sm font-medium">
                          {corporateData.financialStability}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Technology Readiness</span>
                      <div className="flex items-center gap-2">
                        <Progress value={90} className="w-32" />
                        <span className="text-sm font-medium">90%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Strategic Alignment</span>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={corporateData.aiScore}
                          className="w-32"
                        />
                        <span className="text-sm font-medium">
                          {corporateData.aiScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
