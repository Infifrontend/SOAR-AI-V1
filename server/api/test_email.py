
"""
Email configuration testing utility for SOAR-AI
"""

from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.utils.html import strip_tags
from .email_template_service import EmailTemplateService


def test_email_configuration(recipient_email="test@example.com"):
    """
    Test email configuration with standard SOAR-AI template
    
    Args:
        recipient_email: Email address to send test email to
        
    Returns:
        dict: Test results
    """
    try:
        # Test content
        test_subject = "SOAR-AI Email Configuration Test"
        test_content = """
        <p>This is a test email to verify that the SOAR-AI email configuration is working correctly.</p>
        <p>Key features being tested:</p>
        <ul>
            <li>SMTP connectivity</li>
            <li>HTML email rendering</li>
            <li>Standard template layout</li>
            <li>Professional styling</li>
        </ul>
        <p>If you received this email, your configuration is working properly!</p>
        """
        
        # Generate standard template
        html_content, plain_text_content = EmailTemplateService.get_standard_template(
            subject=test_subject,
            content=test_content,
            recipient_name="Test User",
            template_type="test"
        )
        
        # Create email
        email = EmailMultiAlternatives(
            subject=test_subject,
            body=plain_text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient_email],
        )
        
        # Attach HTML alternative
        email.attach_alternative(html_content, "text/html")
        
        # Send email
        result = email.send(fail_silently=False)
        
        return {
            'success': True,
            'message': f'Test email sent successfully to {recipient_email}',
            'smtp_host': settings.EMAIL_HOST,
            'smtp_port': settings.EMAIL_PORT,
            'from_email': settings.DEFAULT_FROM_EMAIL,
            'result': result
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'smtp_host': getattr(settings, 'EMAIL_HOST', 'Not configured'),
            'smtp_port': getattr(settings, 'EMAIL_PORT', 'Not configured'),
            'from_email': getattr(settings, 'DEFAULT_FROM_EMAIL', 'Not configured')
        }


def get_email_configuration_summary():
    """
    Get summary of current email configuration
    
    Returns:
        dict: Configuration summary
    """
    return {
        'smtp_host': getattr(settings, 'EMAIL_HOST', 'Not configured'),
        'smtp_port': getattr(settings, 'EMAIL_PORT', 'Not configured'),
        'use_tls': getattr(settings, 'EMAIL_USE_TLS', False),
        'from_email': getattr(settings, 'DEFAULT_FROM_EMAIL', 'Not configured'),
        'backend': getattr(settings, 'EMAIL_BACKEND', 'Not configured'),
        'timeout': getattr(settings, 'EMAIL_TIMEOUT', 'Not configured'),
        'template_service': 'Standard SOAR-AI Template Service Available'
    }
