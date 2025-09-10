
export interface EmailTemplateSection {
  type: 'header' | 'body' | 'footer' | 'cta' | 'spacer' | 'hero' | 'intro';
  content: string;
  styles?: Record<string, string>;
}

export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  sections: EmailTemplateSection[];
  variables: string[];
  layout?: 'standard' | 'custom';
}

export interface StandardLayoutVariables {
  subject?: string;
  preheader?: string;
  logo_url?: string;
  company_name?: string;
  main_heading?: string;
  intro_paragraph?: string;
  body_content?: string;
  cta_url?: string;
  cta_text?: string;
  company_address?: string;
  unsubscribe_url?: string;
  year?: string;
}

export class EmailTemplateService {
  private static standardLayoutTemplate = `<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{subject}}</title>
    <style>
      /* CLIENT-SAFE, INLINE-FRIENDLY STYLES (keep minimal) */
      body { margin:0; padding:0; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
      table { border-spacing:0; }
      img { border:0; display:block; }
      a { color:inherit; text-decoration:none; }
      .wrapper { width:100%; background-color:#f5f7fb; padding:20px 0; }
      .content { max-width:600px; margin:0 auto; background:#ffffff; border-radius:6px; overflow:hidden; }
      .header { padding:20px; text-align:center; }
      .logo { max-width:160px; height:auto; }
      .preheader { display:none !important; visibility:hidden; opacity:0; color:transparent; height:0; width:0; }
      .main { padding:24px; font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; color:#333333; font-size:16px; line-height:24px; }
      .h1 { font-size:22px; margin:0 0 10px 0; color:#111827; }
      .p { margin:0 0 16px 0; }
      .button { display:inline-block; padding:12px 20px; border-radius:6px; background:#ff7a00; color:#ffffff; font-weight:600; }
      .footer { padding:16px 20px; font-size:12px; color:#8b94a6; text-align:center; }
      @media screen and (max-width:480px) {
        .content { width:100% !important; border-radius:0; }
        .main { padding:16px; }
        .h1 { font-size:20px; }
      }
    </style>
  </head>
  <body>
    <!-- Preheader: invisible preview text -->
    <div class="preheader">{{preheader}}</div>

    <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center">
          <table class="content" width="600" cellpadding="0" cellspacing="0" role="presentation">

            <!-- Header -->
            <tr>
              <td class="header">
                <!-- Logo -->
                <img src="{{logo_url}}" alt="{{company_name}}" class="logo" width="160" />
              </td>
            </tr>

            <!-- Hero / Body -->
            <tr>
              <td class="main">
                <!-- Main heading -->
                <h1 class="h1">{{main_heading}}</h1>

                <!-- Intro paragraph -->
               <!-- <p class="p">{{intro_paragraph}}</p> -->

                <!-- Content block (use for dynamic HTML/content) -->
                <div>{{body_content}}</div>

                <!-- CTA -->


                <!-- Small note / fallback link -->

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td class="footer">
                <p style="margin:0 0 8px 0;">{{company_name}} • {{company_address}}</p>
                <p style="margin:0;">&copy; {{year}} {{company_name}}. All rights reserved.</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  private static defaultStyles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      lineHeight: '1.6',
      color: '#333333',
      backgroundColor: '#ffffff',
      margin: '0',
      padding: '0'
    },
    header: {
      backgroundColor: '#2563eb',
      color: '#ffffff',
      padding: '20px',
      textAlign: 'center' as const,
      fontSize: '24px',
      fontWeight: 'bold'
    },
    body: {
      padding: '30px 20px',
      backgroundColor: '#ffffff'
    },
    footer: {
      backgroundColor: '#f8fafc',
      padding: '20px',
      textAlign: 'center' as const,
      fontSize: '12px',
      color: '#64748b',
      borderTop: '1px solid #e2e8f0'
    },
    cta: {
      textAlign: 'center' as const,
      margin: '30px 0'
    },
    ctaButton: {
      backgroundColor: '#10b981',
      color: '#ffffff',
      padding: '12px 24px',
      textDecoration: 'none',
      borderRadius: '6px',
      fontWeight: 'bold',
      display: 'inline-block'
    }
  };

  static generateStandardLayoutHTML(variables: StandardLayoutVariables): string {
    let html = this.standardLayoutTemplate;
    
    // Set default values
    const defaultVariables: StandardLayoutVariables = {
      subject: variables.subject || 'SOAR-AI Email',
      preheader: variables.preheader || 'Your corporate travel solution',
      logo_url: variables.logo_url || 'https://via.placeholder.com/160x60/2563eb/ffffff?text=SOAR-AI',
      company_name: variables.company_name || 'SOAR-AI',
      main_heading: variables.main_heading || 'Welcome to SOAR-AI',
      intro_paragraph: variables.intro_paragraph || 'We\'re excited to help transform your corporate travel experience.',
      body_content: variables.body_content || '<p>Your content goes here...</p>',
      cta_url: variables.cta_url || '#',
      cta_text: variables.cta_text || 'Get Started',
      company_address: variables.company_address || '123 Business Ave, City, State 12345',
      unsubscribe_url: variables.unsubscribe_url || '#',
      year: variables.year || new Date().getFullYear().toString()
    };

    // Replace all variables
    Object.entries(defaultVariables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, value || '');
    });
    
    return html;
  }

  static generateEmailHTML(template: EmailTemplate, variables: Record<string, string> = {}): string {
    if (template.layout === 'standard') {
      return this.generateStandardLayoutHTML(variables as StandardLayoutVariables);
    }

    // Fallback to old method for custom layouts
    let html = this.getBaseTemplate();
    
    // Replace template sections
    const sectionsHTML = template.sections.map(section => {
      return this.renderSection(section, variables);
    }).join('');
    
    html = html.replace('{{CONTENT}}', sectionsHTML);
    
    // Replace any remaining variables
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, value);
    });
    
    return html;
  }

  private static getBaseTemplate(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    <style>
        body {
            font-family: ${this.defaultStyles.container.fontFamily};
            font-size: ${this.defaultStyles.container.fontSize};
            line-height: ${this.defaultStyles.container.lineHeight};
            color: ${this.defaultStyles.container.color};
            background-color: ${this.defaultStyles.container.backgroundColor};
            margin: ${this.defaultStyles.container.margin};
            padding: ${this.defaultStyles.container.padding};
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            background-color: ${this.defaultStyles.header.backgroundColor};
            color: ${this.defaultStyles.header.color};
            padding: ${this.defaultStyles.header.padding};
            text-align: ${this.defaultStyles.header.textAlign};
            font-size: ${this.defaultStyles.header.fontSize};
            font-weight: ${this.defaultStyles.header.fontWeight};
        }
        .email-body {
            padding: ${this.defaultStyles.body.padding};
            background-color: ${this.defaultStyles.body.backgroundColor};
        }
        .email-footer {
            background-color: ${this.defaultStyles.footer.backgroundColor};
            padding: ${this.defaultStyles.footer.padding};
            text-align: ${this.defaultStyles.footer.textAlign};
            font-size: ${this.defaultStyles.footer.fontSize};
            color: ${this.defaultStyles.footer.color};
            border-top: ${this.defaultStyles.footer.borderTop};
        }
        .email-cta {
            text-align: ${this.defaultStyles.cta.textAlign};
            margin: ${this.defaultStyles.cta.margin};
        }
        .cta-button {
            background-color: ${this.defaultStyles.ctaButton.backgroundColor};
            color: ${this.defaultStyles.ctaButton.color};
            padding: ${this.defaultStyles.ctaButton.padding};
            text-decoration: ${this.defaultStyles.ctaButton.textDecoration};
            border-radius: ${this.defaultStyles.ctaButton.borderRadius};
            font-weight: ${this.defaultStyles.ctaButton.fontWeight};
            display: ${this.defaultStyles.ctaButton.display};
        }
        .spacer {
            height: 20px;
        }
        .text-center { text-align: center; }
        .text-left { text-align: left; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        .font-semibold { font-weight: 600; }
        .text-sm { font-size: 12px; }
        .text-lg { font-size: 18px; }
        .text-xl { font-size: 20px; }
        .mb-4 { margin-bottom: 16px; }
        .mt-4 { margin-top: 16px; }
    </style>
</head>
<body>
    <div class="email-container">
        {{CONTENT}}
    </div>
</body>
</html>`;
  }

  private static renderSection(section: EmailTemplateSection, variables: Record<string, string>): string {
    let content = section.content;
    
    // Replace variables in content
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      content = content.replace(regex, value);
    });

    switch (section.type) {
      case 'header':
        return `<div class="email-header">${content}</div>`;
      
      case 'body':
        return `<div class="email-body">${content}</div>`;
      
      case 'footer':
        return `<div class="email-footer">${content}</div>`;
      
      case 'cta':
        const isButton = content.includes('<a') || content.includes('href');
        if (isButton) {
          return `<div class="email-cta">${content}</div>`;
        } else {
          return `<div class="email-cta"><a href="#" class="cta-button">${content}</a></div>`;
        }
      
      case 'spacer':
        return `<div class="spacer"></div>`;
      
      default:
        return `<div>${content}</div>`;
    }
  }

  static getStandardTemplates(): EmailTemplate[] {
    return [
      {
        id: 'corporate-welcome-standard',
        name: 'Corporate Welcome (Standard Layout)',
        description: 'Professional welcome template with standardized sections including header, body, and footer',
        layout: 'standard',
        variables: [
          'subject',
          'preheader', 
          'main_heading',
          'intro_paragraph',
          'body_content',
          'cta_text',
          'cta_url',
          'company_name',
          'company_address',
          'logo_url',
          'unsubscribe_url',
          'year'
        ],
        sections: [] // Not used for standard layout
      },
      {
        id: 'cost-savings-standard',
        name: 'Cost Savings (Standard Layout)',
        description: 'Highlight cost savings and ROI with professional layout including header, personalized content, and clear call-to-action',
        layout: 'standard',
        variables: [
          'subject',
          'preheader',
          'main_heading', 
          'intro_paragraph',
          'body_content',
          'cta_text',
          'cta_url',
          'company_name',
          'company_address',
          'logo_url',
          'unsubscribe_url',
          'year'
        ],
        sections: [] // Not used for standard layout
      },
      {
        id: 'corporate-welcome',
        name: 'Corporate Welcome Template',
        description: 'Standard welcome template for new corporate clients',
        layout: 'custom',
        variables: ['company_name', 'contact_name', 'industry', 'employees'],
        sections: [
          {
            type: 'header',
            content: 'Welcome to SOAR-AI!'
          },
          {
            type: 'body',
            content: `
              <p>Dear {{contact_name}},</p>
              
              <p>Welcome to SOAR-AI! We're excited to help {{company_name}} transform your corporate travel experience.</p>
              
              <p>Based on your {{industry}} background and {{employees}} team size, we've identified several opportunities to optimize your travel operations:</p>
              
              <ul>
                <li>✈️ Reduce travel costs by up to 35%</li>
                <li>📊 Streamline booking and approval processes</li>
                <li>🌍 Access our global partner network</li>
                <li>🤖 AI-powered travel recommendations</li>
              </ul>
              
              <p>Ready to see how we can help? Let's schedule a 15-minute discovery call.</p>
            `
          },
          {
            type: 'cta',
            content: '<a href="{{cta_link}}" class="cta-button">Schedule Discovery Call</a>'
          },
          {
            type: 'footer',
            content: `
              <p>Best regards,<br>
              The SOAR-AI Team</p>
              
              <p>© 2024 SOAR-AI. All rights reserved.<br>
              <a href="#" style="color: #64748b;">Unsubscribe</a> | <a href="#" style="color: #64748b;">Privacy Policy</a></p>
            `
          }
        ]
      }
    ];
  }

  static createStandardLayoutTemplate(
    name: string,
    description: string,
    templateVariables: StandardLayoutVariables
  ): EmailTemplate {
    return {
      id: `standard-${Date.now()}`,
      name,
      description,
      layout: 'standard',
      sections: [], // Not used for standard layout
      variables: Object.keys(templateVariables)
    };
  }

  static createCustomTemplate(
    name: string,
    description: string,
    headerContent: string,
    bodyContent: string,
    footerContent: string,
    ctaContent?: string,
    variables: string[] = []
  ): EmailTemplate {
    const sections: EmailTemplateSection[] = [
      {
        type: 'header',
        content: headerContent
      },
      {
        type: 'body',
        content: bodyContent
      }
    ];

    if (ctaContent) {
      sections.push({
        type: 'cta',
        content: ctaContent
      });
    }

    sections.push({
      type: 'footer',
      content: footerContent
    });

    return {
      id: `custom-${Date.now()}`,
      name,
      description,
      layout: 'custom',
      sections,
      variables
    };
  }

  static extractVariables(content: string): string[] {
    const variableRegex = /{{(\w+)}}/g;
    const variables: string[] = [];
    let match;

    while ((match = variableRegex.exec(content)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }

    return variables;
  }

//   static generateStandardLayoutHTML(variables: StandardLayoutVariables): string {
//     return `
// <!DOCTYPE html>
// <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
// <head>
//   <meta charset="utf-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>${variables.subject}</title>
//   <style>
//     body { margin:0; padding:0; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; font-family: Arial, sans-serif; }
//     table { border-spacing:0; }
//     img { border:0; display:block; }
//     a { color:inherit; text-decoration:none; }
//     .wrapper { width:100%; background-color:#f5f7fb; padding:20px 0; }
//     .content { max-width:600px; margin:0 auto; background:#ffffff; border-radius:6px; overflow:hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
//     .header { padding:20px; text-align:center; background-color:#007bff; color:#ffffff; }
//     .main { padding:24px; font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; color:#333333; font-size:16px; line-height:24px; }
//     .h1 { font-size:22px; margin:0 0 16px 0; color:#111827; font-weight:600; }
//     .p { margin:0 0 16px 0; }
//     .button { display:inline-block; padding:12px 24px; border-radius:6px; background:#007bff; color:#ffffff; font-weight:600; text-decoration:none; margin:20px 0; }
//     .button:hover { background:#0056b3; }
//     .footer { padding:16px 20px; font-size:12px; color:#8b94a6; text-align:center; background-color:#f1f1f1; }
//     .cta-container { text-align:center; margin:24px 0; }
//     @media screen and (max-width:480px) {
//       .content { width:100% !important; border-radius:0; margin:0; }
//       .main { padding:16px; }
//       .h1 { font-size:20px; }
//       .header { padding:16px; }
//     }
//   </style>
// </head>
// <body>
//   <div class="wrapper">
//     <table class="content" width="600" cellpadding="0" cellspacing="0" role="presentation">
//       <!-- Header -->
//       <tr>
//         <td class="header">
//           <h2 style="margin:0; font-size:24px;">${variables.company_name}</h2>
//           <p style="margin:8px 0 0 0; font-size:14px; opacity:0.9;">Corporate Travel Solutions</p>
//         </td>
//       </tr>

//       <!-- Main Content -->
//       <tr>
//         <td class="main">
//           <h1 class="h1">${variables.main_heading}</h1>
//           <p class="p">${variables.intro_paragraph}</p>
          
//           <div>${variables.body_content}</div>

//           ${variables.cta_text && variables.cta_url ? `
//          <!-- <div class="cta-container">
//             <a href="${variables.cta_url}" class="button" target="_blank">
//               ${variables.cta_text}
//             </a>
//           </div> 
//           <p class="p" style="font-size:13px;color:#6b7280;">
//             If the button doesn't work, copy and paste the following URL into your browser: <br /> -->
//             <a href="${variables.cta_url}" style="color:#007bff;">${variables.cta_url}</a>
//           </p>
//           ` : ''}
//         </td>
//       </tr>

//       <!-- Footer -->
//       <tr>
//         <td class="footer">
//           <p style="margin:0 0 8px 0;">${variables.company_name} • Transforming Corporate Travel</p>
//       <!-- <p style="margin:0 0 8px 0;">
//            <a href="${variables.unsubscribe_url}" style="color:#8b94a6;">Unsubscribe</a> | 
//             <a href="#" style="color:#8b94a6;">Privacy Policy</a>
//           </p> -->
//           <p style="margin:0;">&copy; ${variables.year} ${variables.company_name}. All rights reserved.</p>
//         </td>
//       </tr>
//     </table>
//   </div>
// </body>
// </html>
//     `;
//   }

  static validateTemplate(template: EmailTemplate): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!template.name || template.name.trim() === '') {
      errors.push('Template name is required');
    }

    if (template.layout === 'custom') {
      if (!template.sections || template.sections.length === 0) {
        errors.push('Custom template must have at least one section');
      }

      const hasHeader = template.sections.some(section => section.type === 'header');
      const hasBody = template.sections.some(section => section.type === 'body');
      const hasFooter = template.sections.some(section => section.type === 'footer');

      if (!hasHeader) {
        errors.push('Custom template should have a header section');
      }

      if (!hasBody) {
        errors.push('Custom template must have a body section');
      }

      if (!hasFooter) {
        errors.push('Custom template should have a footer section');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static getStandardLayoutVariables(): string[] {
    return [
      'subject',
      'preheader',
      'logo_url',
      'company_name',
      'main_heading',
      'intro_paragraph',
      'body_content',
      'cta_url',
      'cta_text',
      'company_address',
      'unsubscribe_url',
      'year'
    ];
  }

  static renderTemplateWithBaseLayout(
    content: string, 
    subject: string, 
    cta?: string, 
    ctaLink?: string, 
    companyName: string = 'SOAR-AI'
  ): string {
    return `
      <!DOCTYPE html>
      <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          /* CLIENT-SAFE, INLINE-FRIENDLY STYLES */
          body { margin:0; padding:0; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; font-family: Arial, sans-serif; }
          table { border-spacing:0; }
          img { border:0; display:block; }
          a { color:inherit; text-decoration:none; }
          .wrapper { width:100%; background-color:#f5f7fb; padding:20px 0; }
          .content { max-width:600px; margin:0 auto; background:#ffffff; border-radius:6px; overflow:hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
          .header { padding:20px; text-align:center; background-color:#007bff; color:#ffffff; }
          .main { padding:24px; font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; color:#333333; font-size:16px; line-height:24px; }
          .h1 { font-size:22px; margin:0 0 16px 0; color:#111827; font-weight:600; }
          .p { margin:0 0 16px 0; }
          .button { display:inline-block; padding:12px 24px; border-radius:6px; background:#007bff; color:#ffffff; font-weight:600; text-decoration:none; margin:20px 0; }
          .button:hover { background:#0056b3; }
          .footer { padding:16px 20px; font-size:12px; color:#8b94a6; text-align:center; background-color:#f1f1f1; }
          .cta-container { text-align:center; margin:24px 0; }
          @media screen and (max-width:480px) {
            .content { width:100% !important; border-radius:0; margin:0; }
            .main { padding:16px; }
            .h1 { font-size:20px; }
            .header { padding:16px; }
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <table class="content" width="600" cellpadding="0" cellspacing="0" role="presentation">
            <!-- Header -->
            <tr>
              <td class="header">
                <h2 style="margin:0; font-size:24px;">${companyName}</h2>
                <p style="margin:8px 0 0 0; font-size:14px; opacity:0.9;">Corporate Travel Solutions</p>
              </td>
            </tr>

            <!-- Main Content -->
            <tr>
              <td class="main">
                <div>${content}</div>
                
                ${cta && ctaLink ? `
                <div class="cta-container">
                  <a href="${ctaLink}" class="button" target="_blank">
                    ${cta}
                  </a>
                </div>
                <p class="p" style="font-size:13px;color:#6b7280;">
                  If the button doesn't work, copy and paste the following URL into your browser: <br />
                  <a href="${ctaLink}" style="color:#007bff;">${ctaLink}</a>
                </p>
                ` : ''}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td class="footer">
                <p style="margin:0 0 8px 0;">${companyName} • Transforming Corporate Travel</p>
                <p style="margin:0 0 8px 0;">
                  <a href="#" style="color:#8b94a6;">Unsubscribe</a> | 
                  <a href="#" style="color:#8b94a6;">Privacy Policy</a>
                </p>
                <p style="margin:0;">&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </div>
      </body>
      </html>
    `;
  }
}
