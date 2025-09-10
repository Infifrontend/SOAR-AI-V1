
from django.core.management.base import BaseCommand
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from api.email_template_service import EmailTemplateService


class Command(BaseCommand):
    help = 'Test email configuration with SOAR-AI standard template'

    def add_arguments(self, parser):
        parser.add_argument(
            '--email',
            type=str,
            default='test@example.com',
            help='Email address to send test email to'
        )
        parser.add_argument(
            '--config-only',
            action='store_true',
            help='Only show configuration, do not send test email'
        )

    def handle(self, *args, **options):
        email_address = options['email']
        config_only = options['config_only']
        
        self.stdout.write(
            self.style.SUCCESS('SOAR-AI Email Configuration Test')
        )
        self.stdout.write('=' * 50)
        
        # Show configuration
        self.stdout.write(f"SMTP Host: {getattr(settings, 'EMAIL_HOST', 'Not configured')}")
        self.stdout.write(f"SMTP Port: {getattr(settings, 'EMAIL_PORT', 'Not configured')}")
        self.stdout.write(f"Use TLS: {getattr(settings, 'EMAIL_USE_TLS', False)}")
        self.stdout.write(f"From Email: {getattr(settings, 'DEFAULT_FROM_EMAIL', 'Not configured')}")
        self.stdout.write(f"Backend: {getattr(settings, 'EMAIL_BACKEND', 'Not configured')}")
        
        if config_only:
            return
        
        self.stdout.write('\n' + '=' * 50)
        self.stdout.write('Sending test email...')
        
        try:
            # Test content
            test_subject = "SOAR-AI Email Configuration Test"
            test_content = """
            <p>This is a test email to verify that the SOAR-AI email configuration is working correctly.</p>
            <p>Key features being tested:</p>
            <ul>
                <li>SMTP connectivity and authentication</li>
                <li>HTML email rendering with standard template</li>
                <li>Professional styling and layout</li>
                <li>Multi-part MIME structure (HTML + plain text)</li>
            </ul>
            <p><strong>If you received this email, your configuration is working properly!</strong></p>
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
                to=[email_address],
            )
            
            # Attach HTML alternative
            email.attach_alternative(html_content, "text/html")
            
            # Send email
            result = email.send(fail_silently=False)
            
            if result == 1:
                self.stdout.write(
                    self.style.SUCCESS(f'✓ Test email sent successfully to {email_address}')
                )
                self.stdout.write('Check your inbox for the test email with SOAR-AI branding.')
            else:
                self.stdout.write(
                    self.style.ERROR('✗ Email sending failed - no error but result was 0')
                )
                
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'✗ Email sending failed: {str(e)}')
            )
            
        self.stdout.write('\n' + '=' * 50)
        self.stdout.write('Test completed.')
