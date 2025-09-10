
class EmailTemplateService:
    """Service for managing SOAR-AI standard email templates"""
    
    @staticmethod
    def get_standard_template(subject, content, recipient_name="Valued Partner", template_type="standard"):
        """
        Generate standard SOAR-AI email template
        
        Args:
            subject: Email subject line
            content: Main email content (can be HTML or plain text)
            recipient_name: Name of the recipient
            template_type: Type of template (standard, corporate, campaign)
        
        Returns:
            tuple: (html_content, plain_text_content)
        """
        from django.utils.html import strip_tags
        from datetime import datetime
        
        # Clean content if it's already HTML
        if content.strip().startswith('<!DOCTYPE') or content.strip().startswith('<html'):
            return content, strip_tags(content)
        
        # Standard SOAR-AI template
        html_template = f"""<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{subject}</title>
    <style>
        /* Reset styles for email client compatibility */
        body {{ margin:0; padding:0; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; }}
        table {{ border-spacing:0; border-collapse:collapse; }}
        img {{ border:0; display:block; max-width:100%; height:auto; }}
        a {{ color:inherit; text-decoration:none; }}
        
        /* Main layout */
        .email-wrapper {{ width:100%; background-color:#f8fafc; padding:20px 0; }}
        .email-container {{ max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }}
        
        /* Header */
        .email-header {{ 
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); 
            padding:24px 20px; 
            text-align:center; 
        }}
        .logo {{ color:#ffffff; font-size:32px; font-weight:800; margin:0; letter-spacing:-0.5px; }}
        .tagline {{ color:#dbeafe; font-size:14px; margin:8px 0 0 0; font-weight:500; }}
        
        /* Main content area */
        .email-body {{ padding:32px 24px; }}
        .greeting {{ font-size:20px; color:#1f2937; margin:0 0 24px 0; font-weight:600; }}
        .content-section {{ font-size:16px; color:#374151; line-height:1.7; margin:0 0 20px 0; }}
        .content-section p {{ margin:0 0 16px 0; }}
        .content-section ul {{ margin:16px 0; padding-left:24px; }}
        .content-section li {{ margin:8px 0; }}
        .content-section strong {{ color:#1f2937; }}
        
        /* Call-to-action button */
        .cta-section {{ text-align:center; margin:32px 0; }}
        .cta-button {{ 
            display:inline-block; 
            background:#2563eb; 
            color:#ffffff; 
            padding:14px 28px; 
            text-decoration:none; 
            border-radius:6px; 
            font-weight:600; 
            font-size:16px;
            transition: background-color 0.2s;
        }}
        .cta-button:hover {{ background:#1d4ed8; }}
        
        /* Footer */
        .email-footer {{ 
            background:#f9fafb; 
            border-top:1px solid #e5e7eb; 
            padding:24px; 
            text-align:center; 
        }}
        .footer-logo {{ color:#374151; font-size:24px; font-weight:700; margin:0 0 12px 0; }}
        .footer-description {{ color:#6b7280; font-size:14px; margin:0 0 16px 0; }}
        .footer-links {{ margin:16px 0; }}
        .footer-links a {{ 
            color:#2563eb; 
            text-decoration:none; 
            margin:0 12px; 
            font-size:14px;
        }}
        .footer-links a:hover {{ text-decoration:underline; }}
        .footer-copyright {{ 
            color:#9ca3af; 
            font-size:12px; 
            margin:16px 0 0 0; 
        }}
        
        /* Responsive design */
        @media only screen and (max-width: 600px) {{
            .email-wrapper {{ padding:10px; }}
            .email-body {{ padding:24px 16px; }}
            .email-header {{ padding:20px 16px; }}
            .logo {{ font-size:28px; }}
            .greeting {{ font-size:18px; }}
            .content-section {{ font-size:15px; }}
        }}
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {{
            .email-wrapper {{ background-color:#111827; }}
            .email-container {{ background:#1f2937; }}
            .email-body {{ color:#f9fafb; }}
            .greeting {{ color:#f9fafb; }}
            .content-section {{ color:#e5e7eb; }}
            .email-footer {{ background:#374151; border-top-color:#4b5563; }}
            .footer-logo {{ color:#f9fafb; }}
        }}
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-container">
            <!-- Header -->
            <div class="email-header">
                <h1 class="logo">SOAR-AI</h1>
                <p class="tagline">Corporate Travel Solutions</p>
            </div>
            
            <!-- Main Content -->
            <div class="email-body">
                <h2 class="greeting">Dear {recipient_name},</h2>
                
                <div class="content-section">
                    {content}
                </div>
                
                <div class="content-section">
                    <p>We're committed to transforming your corporate travel experience with innovative solutions tailored to your business needs.</p>
                    <p>Best regards,<br><strong>The SOAR-AI Team</strong></p>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="email-footer">
                <h3 class="footer-logo">SOAR-AI</h3>
                <p class="footer-description">Transforming Corporate Travel Through Innovation</p>
                
                <div class="footer-links">
                    <a href="#privacy">Privacy Policy</a>
                    <a href="#terms">Terms of Service</a>
                    <a href="#support">Support</a>
                    <a href="#unsubscribe">Unsubscribe</a>
                </div>
                
                <p class="footer-copyright">
                    © {datetime.now().year} SOAR-AI Corporation. All rights reserved.
                </p>
            </div>
        </div>
    </div>
</body>
</html>"""

        plain_text = strip_tags(html_template)
        return html_template, plain_text
    
    @staticmethod
    def get_campaign_template(subject, content, recipient_name="Valued Customer", cta_text="", cta_link=""):
        """
        Generate campaign-specific email template
        
        Args:
            subject: Email subject line
            content: Main email content
            recipient_name: Name of the recipient
            cta_text: Call-to-action button text
            cta_link: Call-to-action button link
        
        Returns:
            tuple: (html_content, plain_text_content)
        """
        from django.utils.html import strip_tags
        from datetime import datetime
        
        cta_section = ""
        if cta_text and cta_link:
            cta_section = f"""
                <div class="cta-section">
                    <a href="{cta_link}" class="cta-button">{cta_text}</a>
                </div>
            """
        
        html_template = f"""<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{subject}</title>
    <style>
        body {{ margin:0; padding:0; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; }}
        .email-wrapper {{ width:100%; background-color:#f8fafc; padding:20px 0; }}
        .email-container {{ max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }}
        .email-header {{ background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding:24px 20px; text-align:center; }}
        .logo {{ color:#ffffff; font-size:32px; font-weight:800; margin:0; letter-spacing:-0.5px; }}
        .tagline {{ color:#dbeafe; font-size:14px; margin:8px 0 0 0; font-weight:500; }}
        .email-body {{ padding:32px 24px; }}
        .greeting {{ font-size:20px; color:#1f2937; margin:0 0 24px 0; font-weight:600; }}
        .content-section {{ font-size:16px; color:#374151; line-height:1.7; margin:0 0 20px 0; }}
        .content-section p {{ margin:0 0 16px 0; }}
        .cta-section {{ text-align:center; margin:32px 0; }}
        .cta-button {{ display:inline-block; background:#2563eb; color:#ffffff; padding:14px 28px; text-decoration:none; border-radius:6px; font-weight:600; font-size:16px; }}
        .email-footer {{ background:#f9fafb; border-top:1px solid #e5e7eb; padding:24px; text-align:center; }}
        .footer-logo {{ color:#374151; font-size:24px; font-weight:700; margin:0 0 12px 0; }}
        .footer-description {{ color:#6b7280; font-size:14px; margin:0 0 16px 0; }}
        .footer-links a {{ color:#2563eb; text-decoration:none; margin:0 12px; font-size:14px; }}
        .footer-copyright {{ color:#9ca3af; font-size:12px; margin:16px 0 0 0; }}
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-container">
            <div class="email-header">
                <h1 class="logo">SOAR-AI</h1>
                <p class="tagline">Corporate Travel Solutions</p>
            </div>
            <div class="email-body">
                <h2 class="greeting">Dear {recipient_name},</h2>
                <div class="content-section">
                    {content}
                </div>
                {cta_section}
                <div class="content-section">
                    <p>Thank you for your interest in SOAR-AI's corporate travel solutions.</p>
                    <p>Best regards,<br><strong>The SOAR-AI Marketing Team</strong></p>
                </div>
            </div>
            <div class="email-footer">
                <h3 class="footer-logo">SOAR-AI</h3>
                <p class="footer-description">Transforming Corporate Travel Through Innovation</p>
                <div class="footer-links">
                    <a href="#privacy">Privacy Policy</a>
                    <a href="#unsubscribe">Unsubscribe</a>
                </div>
                <p class="footer-copyright">
                    © {datetime.now().year} SOAR-AI Corporation. All rights reserved.
                </p>
            </div>
        </div>
    </div>
</body>
</html>"""

        plain_text = strip_tags(html_template)
        return html_template, plain_text
