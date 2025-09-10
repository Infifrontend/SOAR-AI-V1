
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { EmailTemplateService, StandardLayoutVariables } from '../utils/emailTemplateService';
import RichTextEditor from './RichTextEditor';

interface StandardEmailTemplateCreatorProps {
  onSave?: (template: any) => void;
  onCancel?: () => void;
  initialData?: any;
}

export function StandardEmailTemplateCreator({
  onSave,
  onCancel,
  initialData
}: StandardEmailTemplateCreatorProps) {
  const [templateName, setTemplateName] = useState(initialData?.name || '');
  const [templateDescription, setTemplateDescription] = useState(initialData?.description || '');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  const [templateVariables, setTemplateVariables] = useState<StandardLayoutVariables>({
    subject: initialData?.subject || 'Welcome to SOAR-AI',
    preheader: initialData?.preheader || 'Your corporate travel solution awaits',
    logo_url: initialData?.logo_url || 'https://via.placeholder.com/160x60/2563eb/ffffff?text=SOAR-AI',
    company_name: initialData?.company_name || 'SOAR-AI',
    main_heading: initialData?.main_heading || 'Welcome to {{contact_name}}!',
    intro_paragraph: initialData?.intro_paragraph || 'We\'re excited to help {{company_name}} transform your corporate travel experience.',
    body_content: initialData?.body_content || `
      <p>Based on your {{industry}} background and {{employees}} team size, we've identified several opportunities to optimize your travel operations:</p>
      
      <ul>
        <li>✈️ Reduce travel costs by up to 35%</li>
        <li>📊 Streamline booking and approval processes</li>
        <li>🌍 Access our global partner network</li>
        <li>🤖 AI-powered travel recommendations</li>
      </ul>
      
      <p>Ready to see how we can help? Let's schedule a 15-minute discovery call.</p>
    `,
    cta_url: initialData?.cta_url || 'https://calendly.com/soar-ai/discovery-call',
    cta_text: initialData?.cta_text || 'Schedule Discovery Call',
    company_address: initialData?.company_address || '123 Business Ave, City, State 12345',
    unsubscribe_url: initialData?.unsubscribe_url || 'https://soar-ai.com/unsubscribe',
    year: initialData?.year || new Date().getFullYear().toString()
  });

  const availableVariables = [
    '{{contact_name}}',
    '{{company_name}}',
    '{{industry}}',
    '{{employees}}',
    '{{travel_budget}}',
    '{{job_title}}',
    '{{location}}',
    '{{annual_revenue}}',
    '{{phone}}',
    '{{email}}',
    '{{website}}'
  ];

  const handleVariableUpdate = (key: keyof StandardLayoutVariables, value: string) => {
    setTemplateVariables(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    if (!templateName.trim()) {
      alert('Please enter a template name');
      return;
    }

    const template = {
      name: templateName,
      description: templateDescription,
      variables: templateVariables,
      isStandardLayout: true
    };
    
    onSave?.(template);
  };

  const generatePreview = () => {
    const sampleData = {
      ...templateVariables,
      contact_name: 'John Smith',
      company_name: 'TechCorp Solutions',
      industry: 'Technology',
      employees: '500',
      travel_budget: '$250,000',
      job_title: 'Travel Manager'
    };
    
    return EmailTemplateService.generateStandardLayoutHTML(sampleData);
  };

  const insertVariable = (variable: string, field: keyof StandardLayoutVariables) => {
    const currentValue = templateVariables[field] || '';
    handleVariableUpdate(field, currentValue + variable);
  };

  return (
    <div className="">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Create Standard Email Template</span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsPreviewMode(!isPreviewMode)}
              >
                {isPreviewMode ? 'Edit' : 'Preview'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isPreviewMode ? (
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="header">Header</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="footer">Footer & CTA</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="templateName">Template Name</Label>
                    <Input
                      id="templateName"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="e.g., Welcome Email Template"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Email Subject</Label>
                    <Input
                      id="subject"
                      value={templateVariables.subject}
                      onChange={(e) => handleVariableUpdate('subject', e.target.value)}
                      placeholder="Email subject line"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="templateDescription">Template Description</Label>
                  <Textarea
                    id="templateDescription"
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                    placeholder="Describe when to use this template..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="preheader">Preheader Text</Label>
                  <Input
                    id="preheader"
                    value={templateVariables.preheader}
                    onChange={(e) => handleVariableUpdate('preheader', e.target.value)}
                    placeholder="Preview text that appears in email clients"
                  />
                </div>
              </TabsContent>

              <TabsContent value="header" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input
                      id="logoUrl"
                      value={templateVariables.logo_url}
                      onChange={(e) => handleVariableUpdate('logo_url', e.target.value)}
                      placeholder="https://your-domain.com/logo.png"
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={templateVariables.company_name}
                      onChange={(e) => handleVariableUpdate('company_name', e.target.value)}
                      placeholder="Your company name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="mainHeading">Main Heading</Label>
                  <Input
                    id="mainHeading"
                    value={templateVariables.main_heading}
                    onChange={(e) => handleVariableUpdate('main_heading', e.target.value)}
                    placeholder="Welcome {{contact_name}}!"
                  />
                </div>

                <div>
                  <Label htmlFor="introText">Intro Paragraph</Label>
                  <Textarea
                    id="introText"
                    value={templateVariables.intro_paragraph}
                    onChange={(e) => handleVariableUpdate('intro_paragraph', e.target.value)}
                    placeholder="Opening paragraph text..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Available Variables</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {availableVariables.map((variable) => (
                      <Badge
                        key={variable}
                        variant="outline"
                        className="cursor-pointer hover:bg-blue-50"
                        onClick={() => insertVariable(variable, 'main_heading')}
                      >
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Email Body Content</Label>
                  <RichTextEditor
                    content={templateVariables.body_content || ''}
                    onChange={(value) => handleVariableUpdate('body_content', value)}
                    placeholder="Enter your email content here..."
                  />
                </div>
              </TabsContent>

              <TabsContent value="footer" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ctaText">Call-to-Action Text</Label>
                    <Input
                      id="ctaText"
                      value={templateVariables.cta_text}
                      onChange={(e) => handleVariableUpdate('cta_text', e.target.value)}
                      placeholder="Get Started"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ctaUrl">Call-to-Action URL</Label>
                    <Input
                      id="ctaUrl"
                      value={templateVariables.cta_url}
                      onChange={(e) => handleVariableUpdate('cta_url', e.target.value)}
                      placeholder="https://your-website.com/action"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="companyAddress">Company Address</Label>
                  <Textarea
                    id="companyAddress"
                    value={templateVariables.company_address}
                    onChange={(e) => handleVariableUpdate('company_address', e.target.value)}
                    placeholder="123 Business Ave, City, State 12345"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="unsubscribeUrl">Unsubscribe URL</Label>
                  <Input
                    id="unsubscribeUrl"
                    value={templateVariables.unsubscribe_url}
                    onChange={(e) => handleVariableUpdate('unsubscribe_url', e.target.value)}
                    placeholder="https://your-website.com/unsubscribe"
                  />
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Email Preview</h3>
                <p className="text-sm text-muted-foreground">
                  This preview shows how your email will look with sample data
                </p>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  srcDoc={generatePreview()}
                  style={{
                    width: '100%',
                    height: '600px',
                    border: 'none'
                  }}
                  title="Email Preview"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} className='bg-orange-500 hover:bg-orange-600 text-white'>
              Save Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default StandardEmailTemplateCreator;
