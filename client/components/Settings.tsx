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
  List,
  MailPlus // Added MailPlus icon for Template Creation
} from 'lucide-react';
import { useUserApi } from '../hooks/api/useUserApi';
import { useRoleApi } from '../hooks/api/useRoleApi';
import { useTemplateApi } from '../hooks/api/useTemplateApi'; // Import the template API hook
import ReactQuill from 'react-quill'; // Import ReactQuill for WYSIWYG editor
import 'react-quill/dist/quill.snow.css'; // Import ReactQuill styles

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

// --- Template Creation Component ---
interface Template {
  id: number;
  name: string;
  subject: string;
  content: string;
  company_id: number; // Assuming company_id is relevant
}

const TemplateCreation: React.FC = () => {
  const templateApi = useTemplateApi(); // Hook for template API calls
  const [templates, setTemplates] = useState<Template[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [newTemplate, setNewTemplate] = useState<Omit<Template, 'id'> & { company_id?: number }>({
    name: '',
    subject: '',
    content: '',
    company_id: 1, // Default company ID, replace with actual logic if needed
  });
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await templateApi.getTemplates(); // Assuming getTemplates exists
      setTemplates(data);
    } catch (err: any) {
      setError(`Failed to fetch templates: ${err.message}`);
      console.error('Error fetching templates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof newTemplate, value: string) => {
    setNewTemplate(prev => ({ ...prev, [field]: value }));
  };

  const handleContentChange = (content: string) => {
    setNewTemplate(prev => ({ ...prev, content }));
  };

  const handleCreateTemplate = async () => {
    if (!newTemplate.name.trim() || !newTemplate.subject.trim()) {
      setError('Template name and subject are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await templateApi.createTemplate(newTemplate); // Assuming createTemplate exists
      setNewTemplate({ name: '', subject: '', content: '', company_id: 1 }); // Reset form
      setIsCreating(false);
      fetchTemplates(); // Refresh list
    } catch (err: any) {
      setError(`Failed to create template: ${err.message}`);
      console.error('Error creating template:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setNewTemplate({ ...template });
    setIsCreating(false); // Ensure create mode is off
  };

  const handleUpdateTemplate = async () => {
    if (!editingTemplate || !newTemplate.name.trim() || !newTemplate.subject.trim()) {
      setError('Template name and subject are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await templateApi.updateTemplate(editingTemplate.id, newTemplate); // Assuming updateTemplate exists
      setEditingTemplate(null);
      fetchTemplates(); // Refresh list
    } catch (err: any) {
      setError(`Failed to update template: ${err.message}`);
      console.error('Error updating template:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    setLoading(true);
    setError('');
    try {
      await templateApi.deleteTemplate(id); // Assuming deleteTemplate exists
      fetchTemplates(); // Refresh list
    } catch (err: any) {
      setError(`Failed to delete template: ${err.message}`);
      console.error('Error deleting template:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MailPlus className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle>Template Creation</CardTitle>
                <CardDescription>Create, manage, and use email templates for campaigns.</CardDescription>
              </div>
            </div>
            <Dialog open={isCreating || !!editingTemplate} onOpenChange={(isOpen) => {
              if (!isOpen) {
                setIsCreating(false);
                setEditingTemplate(null);
                setNewTemplate({ name: '', subject: '', content: '', company_id: 1 });
                setError('');
              }
            }}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setIsCreating(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>{editingTemplate ? 'Edit Template' : 'Create New Template'}</DialogTitle>
                  <DialogDescription>Manage your email campaign templates.</DialogDescription>
                </DialogHeader>
                {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                <div className="space-y-4 max-h-[70vh] overflow-y-auto p-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="templateName">Template Name</Label>
                      <Input
                        id="templateName"
                        value={newTemplate.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="e.g., Welcome Email"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="templateSubject">Email Subject</Label>
                      <Input
                        id="templateSubject"
                        value={newTemplate.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        placeholder="e.g., Welcome to Our Service!"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="templateContent">Email Content (HTML)</Label>
                    <div className="mt-1 border border-gray-200 rounded-md">
                      <ReactQuill
                        theme="snow"
                        value={newTemplate.content}
                        onChange={handleContentChange}
                        placeholder="Start writing your template content here..."
                        modules={{
                          toolbar: [
                            [{ header: [1, 2, 3, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ list: 'bullet' }, { list: 'ordered' }],
                            ['link', 'image'],
                            ['clean'],
                          ],
                        }}
                        className="h-80"
                      />
                    </div>
                  </div>
                  {/* Add company selection if needed */}
                  {/* <div>
                    <Label htmlFor="companyId">Company</Label>
                    <Select value={String(newTemplate.company_id)} onValueChange={(value) => handleInputChange('company_id', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Company" />
                      </SelectTrigger>
                      <SelectContent>
                         {/* Map through companies fetched from an API */}
                  {/* <SelectItem value="1">Company A</SelectItem>
                         <SelectItem value="2">Company B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div> */}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setIsCreating(false);
                    setEditingTemplate(null);
                    setNewTemplate({ name: '', subject: '', content: '', company_id: 1 });
                    setError('');
                  }}>
                    Cancel
                  </Button>
                  <Button
                    onClick={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
                    disabled={loading}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    {loading ? 'Saving...' : (editingTemplate ? 'Update Template' : 'Create Template')}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </TabsContent>

        {/* Screen Management Tab */}
        <TabsContent value="screen-management" className="space-y-6" style={{ marginTop: 'var(--space-lg)' }}>
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