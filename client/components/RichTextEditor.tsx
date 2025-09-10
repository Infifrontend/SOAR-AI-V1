
import React, { useRef, useCallback, useMemo } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';

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
  variables?: string[];
}

const defaultVariables = [
  '{{company_name}}',
  '{{contact_name}}',
  '{{job_title}}',
  '{{industry}}',
  '{{employees}}',
  '{{travel_budget}}',
  '{{annual_revenue}}',
  '{{location}}',
  '{{phone}}',
  '{{email}}',
  '{{website}}',
  '{{sender_name}}',
  '{{sender_title}}',
  '{{sender_company}}'
];

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
  className = "",
  showVariables = true,
  variables = defaultVariables
}: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill>(null);

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
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  }), []);

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'indent',
    'align', 'link'
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
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Personalization Variables
            </Label>
            <div className="border rounded-lg p-4 bg-gray-50 variables-panel">
              <p className="text-xs text-gray-600 mb-3">
                Click any variable to insert it into your content:
              </p>
              <div className="grid grid-cols-1 gap-2">
                {variables.map((variable, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="justify-start cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors p-2 text-xs"
                    onClick={() => insertVariable(variable)}
                  >
                    <span className="font-mono">{variable}</span>
                  </Badge>
                ))}
              </div>
              
              {/* Variable Descriptions */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-700 mb-2">Variable Descriptions:</p>
                <div className="space-y-1 text-xs text-gray-600">
                  <div><code>company_name</code> - Company name</div>
                  <div><code>contact_name</code> - Contact person's full name</div>
                  <div><code>job_title</code> - Contact's job title</div>
                  <div><code>industry</code> - Company industry</div>
                  <div><code>employees</code> - Number of employees</div>
                  <div><code>travel_budget</code> - Annual travel budget</div>
                </div>
              </div>
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
            const sampleText = `Dear {{contact_name}},

I hope this email finds you well. I'm reaching out regarding {{company_name}}'s travel management needs.

As a leading company in the {{industry}} industry with {{employees}} employees, I believe {{company_name}} would benefit significantly from our comprehensive travel solutions.

Our services include:
• Corporate travel booking and management
• Policy compliance monitoring  
• 24/7 travel support
• Cost optimization strategies

I'd love to schedule a brief call to discuss how we can help optimize {{company_name}}'s travel budget of {{travel_budget}}.

Best regards,
{{sender_name}}`;
            
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
