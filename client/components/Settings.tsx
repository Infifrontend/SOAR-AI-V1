import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { 
  Settings as SettingsIcon, 
  Users, 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  Lock,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Key,
  Database,
  Server,
  Monitor,
  Smartphone,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Info,
  LayoutDashboard,
  Search,
  FileText,
  Building2,
  Target,
  RotateCcw,
  Gift,
  ShoppingCart,
  Package,
  TrendingUp,
  Activity,
  Headphones,
  BarChart3,
  List
} from 'lucide-react';

// Mock data for users
const users = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@soar-ai.com',
    role: 'Administrator',
    department: 'IT Operations',
    status: 'Active',
    lastLogin: '2024-06-16 09:30',
    permissions: ['Dashboard', 'COINHUB', 'CONTRAQ', 'Offer Management', 'Settings'],
    phone: '+1 (555) 123-4567',
    joinDate: '2023-01-15'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@soar-ai.com',
    role: 'Contract Manager',
    department: 'Legal & Compliance',
    status: 'Active',
    lastLogin: '2024-06-16 08:45',
    permissions: ['Dashboard', 'CONTRAQ'],
    phone: '+1 (555) 234-5678',
    joinDate: '2023-03-20'
  },
  {
    id: 3,
    name: 'Mike Davis',
    email: 'mike.davis@soar-ai.com',
    role: 'Offer Manager',
    department: 'Sales & Marketing',
    status: 'Active',
    lastLogin: '2024-06-15 16:22',
    permissions: ['Dashboard', 'COINHUB', 'Offer Management'],
    phone: '+1 (555) 345-6789',
    joinDate: '2023-05-10'
  },
  {
    id: 4,
    name: 'Lisa Wong',
    email: 'lisa.wong@soar-ai.com',
    role: 'Analyst',
    department: 'Business Analytics',
    status: 'Inactive',
    lastLogin: '2024-06-10 14:15',
    permissions: ['Dashboard'],
    phone: '+1 (555) 456-7890',
    joinDate: '2023-08-05'
  }
];

// Mock data for roles
const roles = [
  {
    id: 1,
    name: 'Administrator',
    description: 'Full system access with user management capabilities',
    permissions: ['Dashboard', 'COINHUB', 'CONTRAQ', 'Offer Management', 'Settings', 'User Management'],
    userCount: 1,
    color: 'destructive'
  },
  {
    id: 2,
    name: 'Contract Manager',
    description: 'Contract oversight and breach monitoring access',
    permissions: ['Dashboard', 'CONTRAQ', 'Breach Monitoring'],
    userCount: 3,
    color: 'default'
  },
  {
    id: 3,
    name: 'Offer Manager',
    description: 'Offer creation and management capabilities',
    permissions: ['Dashboard', 'Offer Management', 'Create Offers', 'Active Offers'],
    userCount: 2,
    color: 'secondary'
  },
  {
    id: 4,
    name: 'Support Agent',
    description: 'Customer support and ticket management access',
    permissions: ['Dashboard', 'CONVOY', 'Support Dashboard', 'Ticket Management'],
    userCount: 5,
    color: 'secondary'
  },
  {
    id: 5,
    name: 'Analyst',
    description: 'Read-only access to dashboards and reports',
    permissions: ['Dashboard', 'Reports'],
    userCount: 4,
    color: 'outline'
  }
];

// Available screens configuration with hierarchical structure
const availableScreens = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'System overview and key metrics',
    icon: LayoutDashboard,
    type: 'single',
    category: 'Core',
    defaultEnabled: true,
    canDisable: false // Dashboard cannot be disabled
  },
  {
    id: 'coinhub',
    name: 'COINHUB',
    description: 'Corporate Intelligent Hub - Main vendor management module',
    icon: Building2,
    type: 'group',
    category: 'Primary Module',
    defaultEnabled: true,
    canDisable: true,
    children: [
      {
        id: 'vendor-search',
        name: 'Vendor Search',
        description: 'AI-powered vendor discovery and evaluation',
        icon: Search,
        type: 'single',
        category: 'COINHUB Sub-module',
        defaultEnabled: true,
        canDisable: true
      },
      {
        id: 'contracts',
        name: 'Contract Management',
        description: 'Contract lifecycle management with AI recommendations',
        icon: FileText,
        type: 'single',
        category: 'COINHUB Sub-module',
        defaultEnabled: true,
        canDisable: true
      }
    ]
  },
  {
    id: 'contraq',
    name: 'CONTRAQ',
    description: 'Corporate Oversight for Negotiated Tracking, Renewals, Analytics & Quality',
    icon: Shield,
    type: 'group',
    category: 'Primary Module',
    defaultEnabled: true,
    canDisable: true,
    children: [
      {
        id: 'breach-monitoring',
        name: 'Breach Monitoring',
        description: 'Contract breach tracking and risk assessment',
        icon: AlertTriangle,
        type: 'single',
        category: 'CONTRAQ Sub-module',
        defaultEnabled: true,
        canDisable: true
      }
    ]
  },
  {
    id: 'offer-management',
    name: 'Offer Management',
    description: 'Comprehensive offer and order management system for airlines',
    icon: Gift,
    type: 'group',
    category: 'Primary Module',
    defaultEnabled: true,
    canDisable: true,
    children: [
      {
        id: 'create-offers',
        name: 'Create Offers',
        description: 'Create new offers for travel agencies and corporates',
        icon: Plus,
        type: 'single',
        category: 'Offer Management Sub-module',
        defaultEnabled: true,
        canDisable: true
      },
      {
        id: 'active-offers',
        name: 'Active Offers',
        description: 'Monitor and manage all active offers',
        icon: Target,
        type: 'single',
        category: 'Offer Management Sub-module',
        defaultEnabled: true,
        canDisable: true
      },
      {
        id: 'order-management',
        name: 'Order Management',
        description: 'Track and fulfill orders from accepted offers',
        icon: ShoppingCart,
        type: 'single',
        category: 'Offer Management Sub-module',
        defaultEnabled: true,
        canDisable: true
      },
      {
        id: 'offer-templates',
        name: 'Offer Templates',
        description: 'Manage offer templates and presets',
        icon: Package,
        type: 'single',
        category: 'Offer Management Sub-module',
        defaultEnabled: true,
        canDisable: true
      },
      {
        id: 'offer-analytics',
        name: 'Offer Analytics',
        description: 'Analyze offer performance and success rates',
        icon: TrendingUp,
        type: 'single',
        category: 'Offer Management Sub-module',
        defaultEnabled: true,
        canDisable: true
      }
    ]
  },
  {
    id: 'convoy',
    name: 'CONVOY',
    description: 'CONnecting Voices Of Your passengers - Customer Support System',
    icon: Headphones,
    type: 'group',
    category: 'Primary Module',
    defaultEnabled: true,
    canDisable: true,
    children: [
      {
        id: 'support-dashboard',
        name: 'Support Dashboard',
        description: 'Customer support agent dashboard and analytics',
        icon: BarChart3,
        type: 'single',
        category: 'CONVOY Sub-module',
        defaultEnabled: true,
        canDisable: true
      },
      {
        id: 'admin-dashboard',
        name: 'Admin Dashboard',
        description: 'Comprehensive customer support administration and analytics',
        icon: Activity,
        type: 'single',
        category: 'CONVOY Sub-module',
        defaultEnabled: true,
        canDisable: true
      },
      {
        id: 'ticket-list',
        name: 'Ticket List',
        description: 'View and manage customer support tickets',
        icon: List,
        type: 'single',
        category: 'CONVOY Sub-module',
        defaultEnabled: true,
        canDisable: true
      },
      {
        id: 'ticket-kanban',
        name: 'Ticket Board',
        description: 'Drag and drop ticket status management',
        icon: Target,
        type: 'single',
        category: 'CONVOY Sub-module',
        defaultEnabled: true,
        canDisable: true
      },
      {
        id: 'ticket-details',
        name: 'Ticket Details',
        description: 'Detailed ticket view and conversation history',
        icon: Eye,
        type: 'single',
        category: 'CONVOY Sub-module',
        defaultEnabled: true,
        canDisable: true
      }
    ]
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'System administration and configuration',
    icon: SettingsIcon,
    type: 'single',
    category: 'Administration',
    defaultEnabled: true,
    canDisable: false // Settings cannot be disabled
  }
];

interface ScreenManagementProps {
  onScreenVisibilityChange?: (screenId: string, visible: boolean) => void;
}

export function Settings({ onScreenVisibilityChange }: ScreenManagementProps) {
  const [activeTab, setActiveTab] = useState('screen-management');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isCreatingRole, setIsCreatingRole] = useState(false);

  // Screen visibility state
  const [screenVisibility, setScreenVisibility] = useState(() => {
    // Initialize from localStorage or use defaults
    const saved = localStorage.getItem('soar-ai-screen-visibility');
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Create default visibility state
    const defaultState = {};
    const processScreens = (screens) => {
      screens.forEach(screen => {
        defaultState[screen.id] = screen.defaultEnabled;
        if (screen.children) {
          processScreens(screen.children);
        }
      });
    };
    processScreens(availableScreens);
    return defaultState;
  });

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Analyst',
    department: '',
    phone: '',
    permissions: []
  });

  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: []
  });

  const [systemSettings, setSystemSettings] = useState({
    sessionTimeout: '30',
    passwordExpiry: '90',
    maxLoginAttempts: '3',
    dataRetention: '365',
    backupFrequency: 'daily',
    notifications: {
      email: true,
      browser: true,
      breach: true,
      renewal: true,
      offers: true,
      orders: true,
      support: true,
      system: false
    },
    theme: 'light',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timezone: 'UTC-5'
  });

  // Save screen visibility to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('soar-ai-screen-visibility', JSON.stringify(screenVisibility));
  }, [screenVisibility]);

  const handleScreenToggle = (screenId: string, enabled: boolean) => {
    const newVisibility = { ...screenVisibility, [screenId]: enabled };
    
    // If disabling a parent, disable all children
    const findScreen = (screens, id) => {
      for (const screen of screens) {
        if (screen.id === id) return screen;
        if (screen.children) {
          const found = findScreen(screen.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    const screen = findScreen(availableScreens, screenId);
    if (screen && screen.children && !enabled) {
      // Disable all children when parent is disabled
      screen.children.forEach(child => {
        newVisibility[child.id] = false;
      });
    }

    setScreenVisibility(newVisibility);
    
    // Notify parent component about the change
    if (onScreenVisibilityChange) {
      onScreenVisibilityChange(screenId, enabled);
    }
  };

  const handleBulkToggle = (enabled: boolean) => {
    const newVisibility = { ...screenVisibility };
    const processScreens = (screens) => {
      screens.forEach(screen => {
        if (screen.canDisable) {
          newVisibility[screen.id] = enabled;
        }
        if (screen.children) {
          processScreens(screen.children);
        }
      });
    };
    processScreens(availableScreens);
    setScreenVisibility(newVisibility);
  };

  const handleResetToDefaults = () => {
    const defaultState = {};
    const processScreens = (screens) => {
      screens.forEach(screen => {
        defaultState[screen.id] = screen.defaultEnabled;
        if (screen.children) {
          processScreens(screen.children);
        }
      });
    };
    processScreens(availableScreens);
    setScreenVisibility(defaultState);
  };

  const getEnabledCount = () => {
    return Object.values(screenVisibility).filter(Boolean).length;
  };

  const getTotalCount = () => {
    return Object.keys(screenVisibility).length;
  };

  const handleCreateUser = () => {
    console.log('Creating user:', newUser);
    setIsCreatingUser(false);
    setNewUser({ name: '', email: '', role: 'Analyst', department: '', phone: '', permissions: [] });
  };

  const handleCreateRole = () => {
    console.log('Creating role:', newRole);
    setIsCreatingRole(false);
    setNewRole({ name: '', description: '', permissions: [] });
  };

  const handlePermissionChange = (permission: string, checked: boolean, type: 'user' | 'role') => {
    if (type === 'user') {
      setNewUser(prev => ({
        ...prev,
        permissions: checked 
          ? [...prev.permissions, permission]
          : prev.permissions.filter(p => p !== permission)
      }));
    } else {
      setNewRole(prev => ({
        ...prev,
        permissions: checked 
          ? [...prev.permissions, permission]
          : prev.permissions.filter(p => p !== permission)
      }));
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Administrator': return 'destructive';
      case 'Contract Manager': return 'default';
      case 'Offer Manager': return 'secondary';
      case 'Support Agent': return 'secondary';
      case 'Analyst': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'default' : 'secondary';
  };

  const handleSaveSettings = () => {
    console.log('Saving settings:', systemSettings);
    // Here you would typically save to your backend
  };

  const renderScreenItem = (screen, level = 0) => {
    const Icon = screen.icon;
    const isEnabled = screenVisibility[screen.id];
    const isDisabled = !screen.canDisable;
    
    return (
      <div key={screen.id} className={`${level > 0 ? 'ml-6 border-l border-border pl-4' : ''}`}>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{screen.name}</h4>
                <Badge variant="outline" className="text-xs">
                  {screen.category}
                </Badge>
                {!screen.canDisable && (
                  <Badge variant="secondary" className="text-xs">
                    Required
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{screen.description}</p>
              {screen.type === 'group' && screen.children && (
                <p className="text-xs text-muted-foreground mt-1">
                  Contains {screen.children.length} sub-module{screen.children.length > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              {isEnabled ? 'Enabled' : 'Disabled'}
            </div>
            <Switch
              checked={isEnabled}
              onCheckedChange={(checked) => handleScreenToggle(screen.id, checked)}
              disabled={isDisabled}
            />
          </div>
        </div>
        
        {/* Render children if they exist and parent is enabled */}
        {screen.children && isEnabled && (
          <div className="mt-2 space-y-2">
            {screen.children.map(child => renderScreenItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">System Settings</h1>
          <p className="text-muted-foreground">
            Manage users, permissions, screen visibility, and system configuration
          </p>
        </div>
        <Button onClick={handleSaveSettings} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save All Changes
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-6 bg-gray-50/50 p-1 rounded-xl border border-gray-200/50">
          <TabsTrigger 
            value="users" 
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger 
            value="roles" 
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            Roles & Access
          </TabsTrigger>
          <TabsTrigger 
            value="screen-management" 
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 flex items-center gap-2"
          >
            <Monitor className="h-4 w-4" />
            Screen Management
          </TabsTrigger>
          <TabsTrigger 
            value="security" 
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 flex items-center gap-2"
          >
            <Lock className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger 
            value="system" 
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 flex items-center gap-2"
          >
            <Server className="h-4 w-4" />
            System
          </TabsTrigger>
          <TabsTrigger 
            value="preferences" 
            className="rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 flex items-center gap-2"
          >
            <Palette className="h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </CardTitle>
                  <CardDescription>
                    Manage system users and their access permissions
                  </CardDescription>
                </div>
                <Dialog open={isCreatingUser} onOpenChange={setIsCreatingUser}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New User</DialogTitle>
                      <DialogDescription>
                        Add a new user to the system with appropriate permissions
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="userName">Full Name</Label>
                          <Input
                            id="userName"
                            value={newUser.name}
                            onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                            placeholder="Enter full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="userEmail">Email Address</Label>
                          <Input
                            id="userEmail"
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                            placeholder="Enter email address"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="userRole">Role</Label>
                          <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Administrator">Administrator</SelectItem>
                              <SelectItem value="Contract Manager">Contract Manager</SelectItem>
                              <SelectItem value="Offer Manager">Offer Manager</SelectItem>
                              <SelectItem value="Support Agent">Support Agent</SelectItem>
                              <SelectItem value="Analyst">Analyst</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="userDepartment">Department</Label>
                          <Input
                            id="userDepartment"
                            value={newUser.department}
                            onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                            placeholder="Enter department"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="userPhone">Phone Number</Label>
                        <Input
                          id="userPhone"
                          value={newUser.phone}
                          onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreatingUser(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateUser}>
                        Create User
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
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

        {/* Roles & Access Tab */}
        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Roles & Access Control
                  </CardTitle>
                  <CardDescription>
                    Manage user roles and their system permissions
                  </CardDescription>
                </div>
                <Dialog open={isCreatingRole} onOpenChange={setIsCreatingRole}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Role</DialogTitle>
                      <DialogDescription>
                        Define a new role with specific permissions
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="roleName">Role Name</Label>
                        <Input
                          id="roleName"
                          value={newRole.name}
                          onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                          placeholder="Enter role name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="roleDescription">Description</Label>
                        <Textarea
                          id="roleDescription"
                          value={newRole.description}
                          onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                          placeholder="Describe the role's purpose and responsibilities"
                        />
                      </div>
                      <div>
                        <Label>Permissions</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {['Dashboard', 'COINHUB', 'CONTRAQ', 'Offer Management', 'CONVOY', 'Settings'].map((permission) => (
                            <div key={permission} className="flex items-center space-x-2">
                              <Checkbox
                                id={permission}
                                checked={newRole.permissions.includes(permission)}
                                onCheckedChange={(checked) => handlePermissionChange(permission, checked, 'role')}
                              />
                              <Label htmlFor={permission} className="text-sm">
                                {permission}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreatingRole(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateRole}>
                        Create Role
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles.map((role) => (
                  <Card key={role.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{role.name}</h4>
                        <Badge variant={role.color}>
                          {role.userCount} user{role.userCount !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                      <div className="space-y-1">
                        <Label className="text-xs font-medium">Permissions:</Label>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.slice(0, 3).map((permission) => (
                            <Badge key={permission} variant="outline" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                          {role.permissions.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{role.permissions.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Screen Management Tab */}
        <TabsContent value="screen-management" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Screen & Menu Management
                  </CardTitle>
                  <CardDescription>
                    Control which screens and menu items are visible to users in the navigation
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {getEnabledCount()} of {getTotalCount()} enabled
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Bulk Actions */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <h4 className="font-medium">Bulk Actions</h4>
                  <p className="text-sm text-muted-foreground">
                    Quickly enable or disable multiple screens at once
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkToggle(true)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Enable All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkToggle(false)}
                  >
                    <EyeOff className="h-4 w-4 mr-1" />
                    Disable All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetToDefaults}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset to Defaults
                  </Button>
                </div>
              </div>

              {/* Screen List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Available Screens</h4>
                  <p className="text-sm text-muted-foreground">
                    Toggle individual screens on or off. Disabled screens will not appear in the navigation.
                  </p>
                </div>
                
                <div className="space-y-3">
                  {availableScreens.map(screen => renderScreenItem(screen))}
                </div>
              </div>

              {/* Status Summary */}
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Screen Management Notes</h4>
                      <ul className="text-sm text-blue-800 mt-2 space-y-1">
                        <li>• Dashboard and Settings cannot be disabled as they are core system components</li>
                        <li>• Disabling a parent module will automatically disable all its sub-modules</li>
                        <li>• Changes take effect immediately and apply to all users</li>
                        <li>• Users currently viewing disabled screens will be redirected to the Dashboard</li>
                        <li>• The CONVOY module includes comprehensive customer support management features</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Authentication Settings
                </CardTitle>
                <CardDescription>Configure security and authentication policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Select value={systemSettings.sessionTimeout} onValueChange={(value) => setSystemSettings({...systemSettings, sessionTimeout: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Select value={systemSettings.passwordExpiry} onValueChange={(value) => setSystemSettings({...systemSettings, passwordExpiry: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="never">Never expire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Select value={systemSettings.maxLoginAttempts} onValueChange={(value) => setSystemSettings({...systemSettings, maxLoginAttempts: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 attempts</SelectItem>
                      <SelectItem value="5">5 attempts</SelectItem>
                      <SelectItem value="10">10 attempts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Management
                </CardTitle>
                <CardDescription>Configure data retention and backup policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="dataRetention">Data Retention (days)</Label>
                  <Select value={systemSettings.dataRetention} onValueChange={(value) => setSystemSettings({...systemSettings, dataRetention: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="180">6 months</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                      <SelectItem value="730">2 years</SelectItem>
                      <SelectItem value="1095">3 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select value={systemSettings.backupFrequency} onValueChange={(value) => setSystemSettings({...systemSettings, backupFrequency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-medium">Security Alerts</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Failed Login Alerts</Label>
                      <p className="text-sm text-muted-foreground">Alert on suspicious login attempts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Data Export Alerts</Label>
                      <p className="text-sm text-muted-foreground">Alert on large data exports</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure system notifications and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send notifications via email</p>
                    </div>
                    <Switch 
                      checked={systemSettings.notifications.email}
                      onCheckedChange={(checked) => setSystemSettings({
                        ...systemSettings,
                        notifications: {...systemSettings.notifications, email: checked}
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Browser Notifications</Label>
                      <p className="text-sm text-muted-foreground">Show browser push notifications</p>
                    </div>
                    <Switch 
                      checked={systemSettings.notifications.browser}
                      onCheckedChange={(checked) => setSystemSettings({
                        ...systemSettings,
                        notifications: {...systemSettings.notifications, browser: checked}
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Breach Alerts</Label>
                      <p className="text-sm text-muted-foreground">Immediate breach notifications</p>
                    </div>
                    <Switch 
                      checked={systemSettings.notifications.breach}
                      onCheckedChange={(checked) => setSystemSettings({
                        ...systemSettings,
                        notifications: {...systemSettings.notifications, breach: checked}
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Contract Renewals</Label>
                      <p className="text-sm text-muted-foreground">Contract renewal reminders</p>
                    </div>
                    <Switch 
                      checked={systemSettings.notifications.renewal}
                      onCheckedChange={(checked) => setSystemSettings({
                        ...systemSettings,
                        notifications: {...systemSettings.notifications, renewal: checked}
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Offer Updates</Label>
                      <p className="text-sm text-muted-foreground">Offer status and response notifications</p>
                    </div>
                    <Switch 
                      checked={systemSettings.notifications.offers}
                      onCheckedChange={(checked) => setSystemSettings({
                        ...systemSettings,
                        notifications: {...systemSettings.notifications, offers: checked}
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Support Tickets</Label>
                      <p className="text-sm text-muted-foreground">Customer support ticket notifications</p>
                    </div>
                    <Switch 
                      checked={systemSettings.notifications.support}
                      onCheckedChange={(checked) => setSystemSettings({
                        ...systemSettings,
                        notifications: {...systemSettings.notifications, support: checked}
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  System Information
                </CardTitle>
                <CardDescription>Current system status and information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">System Version:</span>
                    <span className="text-sm font-medium">SOAR-AI v2.1.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Last Update:</span>
                    <span className="text-sm font-medium">June 17, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Database Status:</span>
                    <Badge variant="default" className="text-xs">Online</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Backup Status:</span>
                    <Badge variant="default" className="text-xs">Current</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Active Users:</span>
                    <span className="text-sm font-medium">47</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Storage Used:</span>
                    <span className="text-sm font-medium">2.3 GB / 10 GB</span>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Check for Updates
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Database className="h-4 w-4 mr-2" />
                    Run System Diagnostics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance Settings
                </CardTitle>
                <CardDescription>Customize the look and feel of the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={systemSettings.theme} onValueChange={(value) => setSystemSettings({...systemSettings, theme: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light Mode</SelectItem>
                      <SelectItem value="dark">Dark Mode</SelectItem>
                      <SelectItem value="system">System Default</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select value={systemSettings.language} onValueChange={(value) => setSystemSettings({...systemSettings, language: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Regional Settings
                </CardTitle>
                <CardDescription>Configure date, time, and regional preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select value={systemSettings.dateFormat} onValueChange={(value) => setSystemSettings({...systemSettings, dateFormat: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={systemSettings.timezone} onValueChange={(value) => setSystemSettings({...systemSettings, timezone: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="UTC+0">GMT (UTC+0)</SelectItem>
                      <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}