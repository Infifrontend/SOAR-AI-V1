import React, { useRef, useCallback, useMemo, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Input } from './ui/input';

// Custom styles for the editor
const editorStyles = `
  .ql-editor {
    min-height: 200px;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    line-height: 1.6;
  }

  .ql-toolbar {
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
  }

  .ql-container {
    border-bottom: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
  }

  .personalization-variable {
    background-color: #e3f2fd;
    color: #1976d2;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 500;
    border: 1px solid #bbdefb;
  }

  .variables-panel {
    max-height: 300px;
    overflow-y: auto;
  }
`;

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  showVariables?: boolean;
  variables?: { name: string; value: string; description: string; category?: string }[];
}

const commonVariables = [
    { name: 'Contact Name', value: '{{contact_name}}', description: 'Recipient\'s full name', category: 'contact' },
    { name: 'Contact Email', value: '{{contact_email}}', description: 'Recipient\'s email address', category: 'contact' },
    { name: 'Job Title', value: '{{job_title}}', description: 'Recipient\'s position', category: 'contact' },
    { name: 'Company Name', value: '{{company_name}}', description: 'Company or organization name', category: 'company' },
    { name: 'Industry', value: '{{industry}}', description: 'Company industry sector', category: 'company' },
    { name: 'Employees', value: '{{employees}}', description: 'Number of employees', category: 'company' },
    { name: 'Company Location', value: '{{location}}', description: 'Company location', category: 'company' },
    { name: 'Annual Revenue', value: '{{annual_revenue}}', description: 'Company annual revenue', category: 'company' },
    { name: 'Travel Budget', value: '{{travel_budget}}', description: 'Annual travel budget' },
    { name: 'Sender Name', value: '{{sender_name}}', description: 'Your name or team name' },
    { name: 'Company Website', value: '{{website}}', description: 'Company website URL', category: 'company' },
    { name: 'Phone Number', value: '{{phone}}', description: 'Contact phone number', category: 'contact' },
  ];

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
  className = "",
  showVariables = true,
  variables = commonVariables
}: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill>(null);
  const [customVariable, setCustomVariable] = useState('');

  // Insert styles
  React.useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = editorStyles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const insertVariable = useCallback((variable: string) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection(true);

      // Insert the variable with special formatting
      editor.insertText(range.index, variable);

      // Format the inserted variable
      editor.formatText(range.index, variable.length, {
        'background': '#e3f2fd',
        'color': '#1976d2',
        'bold': true
      });

      // Move cursor after the variable
      editor.setSelection(range.index + variable.length);
      editor.focus();
    }
  }, []);

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link'],
      ['blockquote', 'code-block'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  }), []);

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'indent',
    'align', 'link', 'blockquote', 'code-block'
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Editor Section */}
        <div className="lg:col-span-2">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Content Editor
          </Label>
          <div className="border rounded-lg overflow-hidden">
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              modules={modules}
              formats={formats}
              style={{
                backgroundColor: 'white'
              }}
            />
          </div>

          {/* Editor Tips */}
          <div className="mt-2 text-xs text-gray-500">
            <p>💡 <strong>Tips:</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>Use the toolbar above to format your text</li>
              <li>Click on variables to insert them at cursor position</li>
              <li>Variables will be automatically replaced with actual data when sent</li>
            </ul>
          </div>
        </div>

        {/* Variables Panel */}
        {showVariables && (
          <div className="lg:col-span-1">
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Personalization Variables
            </Label>
            <div className="space-y-4">
              {/* Variable Categories */}
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Contact Variables</div>
                  <div className="grid grid-cols-1 gap-1">
                    {variables.filter(v => v.category === 'contact').map((variable) => (
                      <Button
                        key={variable.name}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => insertVariable(variable.value)}
                        className="justify-start text-left h-auto p-2 hover:bg-green-50 hover:border-green-300"
                      >
                        <div className="w-full">
                          <div className="font-medium text-xs text-green-700">
                            {variable.value}
                          </div>
                          <div className="text-xs text-gray-500">
                            {variable.description}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Company Variables</div>
                  <div className="grid grid-cols-1 gap-1">
                    {variables.filter(v => v.category === 'company').map((variable) => (
                      <Button
                        key={variable.name}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => insertVariable(variable.value)}
                        className="justify-start text-left h-auto p-2 hover:bg-blue-50 hover:border-blue-300"
                      >
                        <div className="w-full">
                          <div className="font-medium text-xs text-blue-700">
                            {variable.value}
                          </div>
                          <div className="text-xs text-gray-500">
                            {variable.description}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Other Variables</div>
                  <div className="grid grid-cols-1 gap-1">
                    {variables.filter(v => !v.category || (v.category !== 'contact' && v.category !== 'company')).map((variable) => (
                      <Button
                        key={variable.name}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => insertVariable(variable.value)}
                        className="justify-start text-left h-auto p-2 hover:bg-purple-50 hover:border-purple-300"
                      >
                        <div className="w-full">
                          <div className="font-medium text-xs text-purple-700">
                            {variable.value}
                          </div>
                          <div className="text-xs text-gray-500">
                            {variable.description}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Custom Variable Input */}
              {/* <div className="pt-3 border-t">
                <Label className="text-xs font-medium text-gray-600 mb-2 block">
                  Add Custom Variable
                </Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="variable_name"
                      value={customVariable}
                      onChange={(e) => setCustomVariable(e.target.value)}
                      className="text-sm h-8"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (customVariable.trim()) {
                          insertVariable(`{{${customVariable.trim()}}}`);
                          setCustomVariable('');
                        }
                      }}
                      className="h-8 px-3 text-xs bg-orange-500 text-white hover:bg-orange-600"
                    >
                      Insert
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500">
                    Variables will be replaced with actual data when emails are sent.
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 flex-wrap">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            if (quillRef.current) {
              const editor = quillRef.current.getEditor();
              const text = editor.getText();
              if (text.trim()) {
                const confirmed = window.confirm('Are you sure you want to clear all content?');
                if (confirmed) {
                  editor.setText('');
                  onChange('');
                }
              }
            }
          }}
        >
          Clear Content
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const sampleText = `<p>Dear {{contact_name}},</p>

        <p>I hope this email finds you well. I'm reaching out regarding <strong>{{company_name}}</strong>'s travel management needs.</p>

        <p>As a leading company in the <strong>{{industry}}</strong> industry with <strong>{{employees}}</strong> employees, I believe <strong>{{company_name}}</strong> would benefit significantly from our comprehensive travel solutions.</p>

        <p>Our services include:</p>
        <ul class="list">
          <li>Corporate travel booking and management</li>
          <li>Policy compliance monitoring</li>
          <li>24/7 travel support</li>
          <li>Cost optimization strategies</li>
        </ul>

        <p>I'd love to schedule a brief call to discuss how we can help optimize <strong>{{company_name}}</strong>'s travel budget of <strong>{{travel_budget}}</strong>.</p>

        <a class="cta" href="{{cta_link}}">Schedule a call</a>

        <p class="signature">Best regards,<br>{{sender_name}}</p>`;

            onChange(sampleText);
          }}
        >
          Insert Sample Content
        </Button>
      </div>
    </div>
  );
}

export default RichTextEditor;