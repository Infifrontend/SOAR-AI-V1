
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Copy, 
  Save,
  FileText,
  Mail,
  BookOpen,
  Bell,
  FileCheck,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
  X
} from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import { toast } from 'react-toastify';

interface EmailTemplate {
  id: number;
  name: string;
  description: string;
  template_type: string;
  subject_line: string;
  content: string;
  variables: string[];
  company: number | null;
  company_name: string | null;
  is_global: boolean;
  is_active: boolean;
  created_by: number | null;
  created_by_name: string;
  variable_count: number;
  created_at: string;
  updated_at: string;
}

interface TemplateVariable {
  name: string;
  description: string;
}

export function TemplateCreation() {
  const [activeTab, setActiveTab] = useState('templates');
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [availableVariables, setAvailableVariables] = useState<TemplateVariable[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    template_type: 'email_campaign',
    subject_line: '',
    content: '',
    is_global: false
  });

  const templateTypes = [
    { value: 'email_campaign', label: 'Email Campaign', icon: Mail },
    { value: 'contract', label: 'Contract', icon: FileCheck },
    { value: 'proposal', label: 'Proposal', icon: FileText },
    { value: 'newsletter', label: 'Newsletter', icon: BookOpen },
    { value: 'notification', label: 'Notification', icon: Bell }
  ];

  const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    loadTemplates();
    loadAvailableVariables();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/email-templates/`);
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      } else {
        throw new Error('Failed to load templates');
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableVariables = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/email-templates/variables/`);
      if (response.ok) {
        const data = await response.json();
        setAvailableVariables(data.available_variables);
      }
    } catch (error) {
      console.error('Error loading variables:', error);
    }
  };

  const handleCreateTemplate = async () => {
    if (!newTemplate.name.trim()) {
      toast.error('Template name is required');
      return;
    }

    if (!newTemplate.content.trim()) {
      toast.error('Template content is required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/email-templates/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTemplate),
      });

      if (response.ok) {
        const createdTemplate = await response.json();
        setTemplates(prev => [createdTemplate, ...prev]);
        setShowCreateDialog(false);
        setNewTemplate({
          name: '',
          description: '',
          template_type: 'email_campaign',
          subject_line: '',
          content: '',
          is_global: false
        });
        toast.success('Template created successfully');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create template');
      }
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error(error.message || 'Failed to create template');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTemplate = async () => {
    if (!selectedTemplate || !newTemplate.name.trim()) {
      toast.error('Template name is required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/email-templates/${selectedTemplate.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTemplate),
      });

      if (response.ok) {
        const updatedTemplate = await response.json();
        setTemplates(prev => prev.map(t => t.id === selectedTemplate.id ? updatedTemplate : t));
        setShowEditDialog(false);
        setSelectedTemplate(null);
        toast.success('Template updated successfully');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update template');
      }
    } catch (error) {
      console.error('Error updating template:', error);
      toast.error(error.message || 'Failed to update template');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId: number) => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/email-templates/${templateId}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTemplates(prev => prev.filter(t => t.id !== templateId));
        toast.success('Template deleted successfully');
      } else {
        throw new Error('Failed to delete template');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewTemplate = async (template: EmailTemplate) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/email-templates/${template.id}/preview/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sample_data: {
            // Add comprehensive sample data for preview
            company_name: 'TechCorp Solutions',
            contact_name: 'John Smith',
            job_title: 'Travel Manager',
            industry: 'Technology',
            employees: '2,500',
            travel_budget: '$750,000',
            annual_revenue: '$50M',
            location: 'San Francisco, CA',
            phone: '+1 (555) 123-4567',
            email: 'john.smith@techcorp.com',
            website: 'www.techcorp.com'
          }
        }),
      });

      if (response.ok) {
        const preview = await response.json();
        
        // Import EmailTemplateService for complete layout rendering
        const { EmailTemplateService } = await import('../utils/emailTemplateService');
        
        // Create a complete email layout with header and footer
        const completeEmailHtml = EmailTemplateService.renderCorporateContactTemplate(
          preview.sample_data?.contact_name || 'John Smith',
          preview.sample_data?.company_name || 'TechCorp Solutions',
          preview.content,
          preview.subject || template.subject_line || 'Email Template Preview',
          'Schedule Demo',
          'https://calendly.com/soar-ai/demo'
        );
        
        // Update preview data with complete HTML
        setPreviewData({
          ...preview,
          content: completeEmailHtml,
          isCompleteLayout: true
        });
        setSelectedTemplate(template);
        setShowPreviewDialog(true);
      } else {
        throw new Error('Failed to generate preview');
      }
    } catch (error) {
      console.error('Error previewing template:', error);
      toast.error('Failed to generate preview');
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicateTemplate = async (template: EmailTemplate) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/email-templates/${template.id}/duplicate/`, {
        method: 'POST',
      });

      if (response.ok) {
        const duplicatedTemplate = await response.json();
        setTemplates(prev => [duplicatedTemplate, ...prev]);
        toast.success('Template duplicated successfully');
      } else {
        throw new Error('Failed to duplicate template');
      }
    } catch (error) {
      console.error('Error duplicating template:', error);
      toast.error('Failed to duplicate template');
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setNewTemplate({
      name: template.name,
      description: template.description,
      template_type: template.template_type,
      subject_line: template.subject_line,
      content: template.content,
      is_global: template.is_global
    });
    setShowEditDialog(true);
  };

  const resetForm = () => {
    setNewTemplate({
      name: '',
      description: '',
      template_type: 'email_campaign',
      subject_line: '',
      content: '',
      is_global: false
    });
    setSelectedTemplate(null);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || template.template_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    const typeConfig = templateTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.icon : FileText;
  };

  const getTypeLabel = (type: string) => {
    const typeConfig = templateTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.label : type;
  };

  return (
    <div className="space-y-6 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Template Creation</h1>
          <p className="text-muted-foreground">
            Create and manage templates for email campaigns, contracts, and other communications
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {templateTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={loadTemplates} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Templates List */}
      <Card>
        <CardHeader>
          <CardTitle>Templates ({filteredTemplates.length})</CardTitle>
          <CardDescription>
            Manage your email and document templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && templates.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2">Loading templates...</span>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No templates found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || typeFilter !== 'all' 
                  ? 'No templates match your search criteria.' 
                  : 'Get started by creating your first template.'}
              </p>
              {!searchTerm && typeFilter === 'all' && (
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Variables</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.map((template) => {
                  const TypeIcon = getTypeIcon(template.template_type);
                  return (
                    <TableRow key={template.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{template.name}</div>
                          {template.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {template.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <TypeIcon className="h-4 w-4" />
                          <span>{getTypeLabel(template.template_type)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {template.variable_count} variables
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={template.is_global ? "default" : "secondary"}>
                          {template.is_global ? 'Global' : 'Company'}
                        </Badge>
                      </TableCell>
                      <TableCell>{template.created_by_name}</TableCell>
                      <TableCell>
                        {new Date(template.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePreviewTemplate(template)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(template)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDuplicateTemplate(template)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Template Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
            <DialogDescription>
              Create a reusable template for emails, contracts, or other communications
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate(prev => ({...prev, name: e.target.value}))}
                  placeholder="Enter template name"
                />
              </div>
              <div>
                <Label htmlFor="type">Template Type</Label>
                <Select 
                  value={newTemplate.template_type} 
                  onValueChange={(value) => setNewTemplate(prev => ({...prev, template_type: value}))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templateTypes.map(type => {
                      const Icon = type.icon;
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={newTemplate.description}
                onChange={(e) => setNewTemplate(prev => ({...prev, description: e.target.value}))}
                placeholder="Describe when to use this template..."
                rows={2}
              />
            </div>

            {newTemplate.template_type === 'email_campaign' && (
              <div>
                <Label htmlFor="subject">Email Subject Line</Label>
                <Input
                  id="subject"
                  value={newTemplate.subject_line}
                  onChange={(e) => setNewTemplate(prev => ({...prev, subject_line: e.target.value}))}
                  placeholder="Enter email subject line"
                />
              </div>
            )}

            <div>
              <Label>Template Content</Label>
              <RichTextEditor
                value={newTemplate.content}
                onChange={(value) => setNewTemplate(prev => ({...prev, content: value}))}
                placeholder="Enter your template content here..."
                variables={availableVariables.map(v => `{{${v.name}}}`)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isGlobal"
                checked={newTemplate.is_global}
                onChange={(e) => setNewTemplate(prev => ({...prev, is_global: e.target.checked}))}
                className="rounded"
              />
              <Label htmlFor="isGlobal">
                Make this template available globally (visible to all companies)
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {setShowCreateDialog(false); resetForm();}}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateTemplate} 
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {loading ? 'Creating...' : 'Create Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>
              Update the template content and settings
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editName">Template Name</Label>
                <Input
                  id="editName"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate(prev => ({...prev, name: e.target.value}))}
                  placeholder="Enter template name"
                />
              </div>
              <div>
                <Label htmlFor="editType">Template Type</Label>
                <Select 
                  value={newTemplate.template_type} 
                  onValueChange={(value) => setNewTemplate(prev => ({...prev, template_type: value}))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templateTypes.map(type => {
                      const Icon = type.icon;
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="editDescription">Description (Optional)</Label>
              <Textarea
                id="editDescription"
                value={newTemplate.description}
                onChange={(e) => setNewTemplate(prev => ({...prev, description: e.target.value}))}
                placeholder="Describe when to use this template..."
                rows={2}
              />
            </div>

            {newTemplate.template_type === 'email_campaign' && (
              <div>
                <Label htmlFor="editSubject">Email Subject Line</Label>
                <Input
                  id="editSubject"
                  value={newTemplate.subject_line}
                  onChange={(e) => setNewTemplate(prev => ({...prev, subject_line: e.target.value}))}
                  placeholder="Enter email subject line"
                />
              </div>
            )}

            <div>
              <Label>Template Content</Label>
              <RichTextEditor
                value={newTemplate.content}
                onChange={(value) => setNewTemplate(prev => ({...prev, content: value}))}
                placeholder="Enter your template content here..."
                variables={availableVariables.map(v => `{{${v.name}}}`)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="editIsGlobal"
                checked={newTemplate.is_global}
                onChange={(e) => setNewTemplate(prev => ({...prev, is_global: e.target.checked}))}
                className="rounded"
              />
              <Label htmlFor="editIsGlobal">
                Make this template available globally (visible to all companies)
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {setShowEditDialog(false); resetForm();}}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditTemplate} 
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {loading ? 'Updating...' : 'Update Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-7xl max-h-[90vh] cls-custompopup">
          <DialogHeader>
            <DialogTitle>Template Preview</DialogTitle>
            <DialogDescription>
              Preview how the template will look with sample data
            </DialogDescription>
          </DialogHeader>
          
          {previewData && (
            <div className="space-y-4 max-h-[50vh] overflow-y-auto">
              {previewData.subject && (
                <div>
                  <Label className="text-sm font-medium">Subject Line</Label>
                  <div className="p-3 bg-gray-50 rounded border">
                    {previewData.subject}
                  </div>
                </div>
              )}
              
              <div>
                <Label className="text-sm font-medium">Email Preview</Label>
                <div className="text-sm text-gray-600 mb-2">
                  Complete email layout with header, content, and footer
                </div>
                <div className="border rounded overflow-hidden bg-gray-100">
                  {previewData.isCompleteLayout ? (
                    <div
                      className="w-full min-h-[600px] bg-white p-4 overflow-auto rounded"
                      dangerouslySetInnerHTML={{ __html: previewData.content }}
                    />
                  ) : (
                    <div
                      className="p-4 min-h-96 bg-white overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: previewData.content }}
                    />
                  )}
                </div>

              </div>

              {previewData.variables_used && previewData.variables_used.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Variables Used</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {previewData.variables_used.map((variable: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {`{{${variable}}}`}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded">
                <strong>Preview Note:</strong> This preview shows your template content within a complete SOAR-AI email layout including company header, professional styling, and footer. The actual email will be rendered with recipient-specific data when sent.
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TemplateCreation;
