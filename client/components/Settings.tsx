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
import { useUserApi } from '../hooks/api/useUserApi';
import { useRoleApi } from '../hooks/api/useRoleApi';

// Available main menus for role permissions
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
    type: 'single',
    category: 'Primary Module',
    defaultEnabled: true,
    canDisable: true
  },
  {
    id: 'contraq',
    name: 'CONTRAQ',
    description: 'Corporate Oversight for Negotiated Tracking, Renewals, Analytics & Quality',
    icon: Shield,
    type: 'single',
    category: 'Primary Module',
    defaultEnabled: true,
    canDisable: true
  },
  {
    id: 'convoy',
    name: 'CONVOY',
    description: 'CONnecting Voices Of Your passengers - Customer Support System',
    icon: Headphones,
    type: 'single',
    category: 'Primary Module',
    defaultEnabled: true,
    canDisable: true
  },
  {
    id: 'offer-management',
    name: 'Offer Management',
    description: 'Comprehensive offer and order management system for airlines',
    icon: Gift,
    type: 'single',
    category: 'Primary Module',
    defaultEnabled: true,
    canDisable: true
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
  },
  {
    id: 'cocast',
    name: 'COCAST',
    description: 'Corporate Cost Analytics and Spending Trends',
    icon: TrendingUp,
    type: 'single',
    category: 'Primary Module',
    defaultEnabled: true,
    canDisable: true
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
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isEditingRole, setIsEditingRole] = useState(false);

  // API hooks
  const userApi = useUserApi();
  const roleApi = useRoleApi();

  // State for users and roles data
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

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
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    is_active: true,
    groups: [],
    profile: {
      department: 'other',
      role: 'agent',
      phone: ''
    }
  });

  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: [] // Will store screen IDs instead of database permission IDs
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

  // Load data on component mount
  useEffect(() => {
    if (activeTab === 'users' || activeTab === 'roles') {
      loadData();
    }
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, rolesData, permissionsData] = await Promise.all([
        userApi.getUsers(),
        roleApi.getRoles(),
        roleApi.getPermissions()
      ]);

      setUsers(usersData);
      setRoles(rolesData);
      setPermissions(permissionsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleCreateUser = async () => {
    try {
      setLoading(true);
      await userApi.createUser(newUser);
      await loadData();
      setIsCreatingUser(false);
      setNewUser({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        is_active: true,
        groups: [],
        profile: {
          department: 'other',
          role: 'agent',
          phone: ''
        }
      });
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async () => {
    try {
      setLoading(true);
      await roleApi.createRole(newRole);
      await loadData();
      setIsCreatingRole(false);
      setNewRole({ name: '', description: '', permissions: [] });
    } catch (error) {
      console.error('Error creating role:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setLoading(true);
        await userApi.deleteUser(userId);
        await loadData();
      } catch (error) {
        console.error('Error deleting user:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        setLoading(true);
        await roleApi.deleteRole(roleId);
        await loadData();
      } catch (error) {
        console.error('Error deleting role:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      setLoading(true);
      await userApi.updateUser(userId, { is_active: !users.find(u => u.id === userId).is_active });
      await loadData();
    } catch (error) {
      console.error('Error toggling user status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (permissionId: number, checked: boolean, type: 'user' | 'role') => {
    if (type === 'user') {
      setNewUser(prev => ({
        ...prev,
        groups: checked 
          ? [...prev.groups, permissionId]
          : prev.groups.filter(p => p !== permissionId)
      }));
    } else {
      setNewRole(prev => ({
        ...prev,
        permissions: checked 
          ? [...prev.permissions, permissionId]
          : prev.permissions.filter(p => p !== permissionId)
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
                    <Button disabled={loading}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New User</DialogTitle>
                      <DialogDescription>
                        Add a new user to the system with appropriate roles and permissions
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={newUser.first_name}
                            onChange={(e) => setNewUser({...newUser, first_name: e.target.value})}
                            placeholder="Enter first name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={newUser.last_name}
                            onChange={(e) => setNewUser({...newUser, last_name: e.target.value})}
                            placeholder="Enter last name"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            value={newUser.username}
                            onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                            placeholder="Enter username"
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
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                          placeholder="Enter password"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="department">Department</Label>
                          <Select 
                            value={newUser.profile.department} 
                            onValueChange={(value) => setNewUser({
                              ...newUser, 
                              profile: {...newUser.profile, department: value}
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="executive">Executive</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                              <SelectItem value="hr">Human Resources</SelectItem>
                              <SelectItem value="operations">Operations</SelectItem>
                              <SelectItem value="travel">Travel Management</SelectItem>
                              <SelectItem value="procurement">Procurement</SelectItem>
                              <SelectItem value="it">IT</SelectItem>
                              <SelectItem value="marketing">Marketing</SelectItem>
                              <SelectItem value="sales">Sales</SelectItem>
                              <SelectItem value="support">Customer Support</SelectItem>
                              <SelectItem value="legal">Legal & Compliance</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="role">Role</Label>
                          <Select 
                            value={newUser.profile.role} 
                            onValueChange={(value) => setNewUser({
                              ...newUser, 
                              profile: {...newUser.profile, role: value}
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="administrator">Administrator</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="agent">Agent</SelectItem>
                              <SelectItem value="analyst">Analyst</SelectItem>
                              <SelectItem value="specialist">Specialist</SelectItem>
                              <SelectItem value="coordinator">Coordinator</SelectItem>
                              <SelectItem value="supervisor">Supervisor</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="userPhone">Phone Number</Label>
                        <Input
                          id="userPhone"
                          value={newUser.profile.phone}
                          onChange={(e) => setNewUser({
                            ...newUser, 
                            profile: {...newUser.profile, phone: e.target.value}
                          })}
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div>
                        <Label>Assign Roles</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
                          {roles.map((role) => (
                            <div key={role.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`role-${role.id}`}
                                checked={newUser.groups.includes(role.id)}
                                onCheckedChange={(checked) => handlePermissionChange(role.id, checked, 'user')}
                              />
                              <Label htmlFor={`role-${role.id}`} className="text-sm">
                                {role.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isActive"
                          checked={newUser.is_active}
                          onCheckedChange={(checked) => setNewUser({...newUser, is_active: checked})}
                        />
                        <Label htmlFor="isActive">Active User</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreatingUser(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateUser} disabled={loading}>
                        {loading ? 'Creating...' : 'Create User'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin" />
                </div>
              ) : (
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
                        <TableCell className="font-medium">
                          {user.full_name || `${user.first_name} ${user.last_name}`.trim() || user.username}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {user.profile?.role || 'No Role'}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.profile?.department || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant={user.is_active ? 'default' : 'secondary'}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleToggleUserStatus(user.id)}
                              disabled={loading}
                            >
                              {user.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={loading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles & Access Tab */}
        <TabsContent value="roles" className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Shield className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Roles & Access Control</h2>
                <p className="text-sm text-gray-500">Manage user roles and their system permissions</p>
              </div>
            </div>
            <Dialog open={isCreatingRole} onOpenChange={setIsCreatingRole}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white" disabled={loading}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Role
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">Create New Role</DialogTitle>
                  <DialogDescription className="text-gray-500">
                    Define a new role with specific permissions
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="roleName" className="text-sm font-medium text-gray-700">Role Name</Label>
                    <Input
                      id="roleName"
                      value={newRole.name}
                      onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                      placeholder="Enter role name"
                      className="mt-1 border-orange-200 focus:border-orange-300 focus:ring-orange-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="roleDescription" className="text-sm font-medium text-gray-700">Description</Label>
                    <Textarea
                      id="roleDescription"
                      value={newRole.description}
                      onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                      placeholder="Describe the role's purpose and responsibilities"
                      className="mt-1 border-orange-200 focus:border-orange-300 focus:ring-orange-200"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Menu Permissions</Label>
                    <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                      {availableScreens.map((screen) => (
                        <div key={screen.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`screen-${screen.id}`}
                            checked={newRole.permissions.includes(screen.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewRole({...newRole, permissions: [...newRole.permissions, screen.id]});
                              } else {
                                setNewRole({...newRole, permissions: newRole.permissions.filter(p => p !== screen.id)});
                              }
                            }}
                            className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                          />
                          <Label htmlFor={`screen-${screen.id}`} className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <screen.icon className="h-4 w-4" />
                            {screen.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsCreatingRole(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateRole} 
                    disabled={loading}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    {loading ? 'Creating...' : 'Create Role'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Role Cards Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Administrator Role */}
              <Card className="border border-gray-200 hover:shadow-sm transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Administrator</h3>
                      <p className="text-sm text-gray-500 mb-3">Full system access with user management capabilities</p>
                    </div>
                    <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                      1 user
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <Label className="text-xs font-medium text-gray-600">Menu Access:</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">Dashboard</Badge>
                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">COINHUB</Badge>
                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">CONTRAQ</Badge>
                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">+3 more</Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="flex-1 text-gray-600 hover:text-gray-800">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-600">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Contract Manager Role */}
              <Card className="border border-gray-200 hover:shadow-sm transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Contract Manager</h3>
                      <p className="text-sm text-gray-500 mb-3">Contract oversight and breach monitoring access</p>
                    </div>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                      3 users
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <Label className="text-xs font-medium text-gray-600">Menu Access:</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">Dashboard</Badge>
                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">CONTRAQ</Badge>
                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">Breach Monitoring</Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="flex-1 text-gray-600 hover:text-gray-800">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-600">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Offer Manager Role */}
              <Card className="border border-gray-200 hover:shadow-sm transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Offer Manager</h3>
                      <p className="text-sm text-gray-500 mb-3">Offer creation and management capabilities</p>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                      2 users
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <Label className="text-xs font-medium text-gray-600">Menu Access:</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">Dashboard</Badge>
                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">Offer Management</Badge>
                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">Create Offers</Badge>
                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">+1 more</Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="flex-1 text-gray-600 hover:text-gray-800">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-600">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Support Agent Role */}
              <Card className="border border-gray-200 hover:shadow-sm transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Support Agent</h3>
                      <p className="text-sm text-gray-500 mb-3">Customer support and ticket management access</p>
                    </div>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
                      5 users
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <Label className="text-xs font-medium text-gray-600">Menu Access:</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">Dashboard</Badge>
                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">CONVOY</Badge>
                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">Support Dashboard</Badge>
                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">+1 more</Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="flex-1 text-gray-600 hover:text-gray-800">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-600">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Analyst Role */}
              <Card className="border border-gray-200 hover:shadow-sm transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Analyst</h3>
                      <p className="text-sm text-gray-500 mb-3">Read-only access to dashboards and reports</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                      4 users
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <Label className="text-xs font-medium text-gray-600">Menu Access:</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">Dashboard</Badge>
                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">Revenue Prediction</Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="flex-1 text-gray-600 hover:text-gray-800">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-600">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Display actual roles from API if available */}
              {roles.filter(role => !['Administrator', 'Contract Manager', 'Offer Manager', 'Support Agent', 'Analyst'].includes(role.name)).map((role) => (
                <Card key={role.id} className="border border-gray-200 hover:shadow-sm transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{role.name}</h3>
                        <p className="text-sm text-gray-500 mb-3">Custom role with specific permissions</p>
                      </div>
                      <Badge variant="outline">
                        {role.user_count || 0} user{(role.user_count || 0) !== 1 ? 's' : ''}
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <Label className="text-xs font-medium text-gray-600">Menu Access:</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {role.permissions?.slice(0, 3).map((permissionId) => {
                          // Find the screen by ID
                          const screen = availableScreens.find(s => s.id === permissionId) || 
                                       availableScreens.find(s => s.children?.some(c => c.id === permissionId))?.children?.find(c => c.id === permissionId);
                          return screen ? (
                            <Badge key={permissionId} variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                              {screen.name}
                            </Badge>
                          ) : null;
                        })}
                        {(role.permissions?.length || 0) > 3 && (
                          <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                            +{(role.permissions?.length || 0) - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="flex-1 text-gray-600 hover:text-gray-800">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteRole(role.id)}
                        disabled={loading}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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