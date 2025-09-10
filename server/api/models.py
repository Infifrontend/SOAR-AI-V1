from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import uuid


class AirportCode(models.Model):
    """Model to store airport codes and their corresponding names"""
    code = models.CharField(max_length=3, unique=True, primary_key=True)
    name = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    country_code = models.CharField(max_length=2)
    country = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.code} - {self.name} ({self.city})"

    class Meta:
        ordering = ['code']


class Company(models.Model):
    COMPANY_SIZES = [
        ('startup', 'Startup (1-50)'),
        ('small', 'Small (51-200)'),
        ('medium', 'Medium (201-1000)'),
        ('large', 'Large (1001-5000)'),
        ('enterprise', 'Enterprise (5000+)'),
        ('corporation', 'Corporation'),
        ('llc', 'LLC'),
        ('partnership', 'Partnership'),
        ('nonprofit', 'Non-Profit'),
    ]

    INDUSTRIES = [
        ('technology', 'Technology'),
        ('finance', 'Finance & Banking'),
        ('healthcare', 'Healthcare'),
        ('manufacturing', 'Manufacturing'),
        ('retail', 'Retail'),
        ('consulting', 'Consulting'),
        ('telecommunications', 'Telecommunications'),
        ('energy', 'Energy & Utilities'),
        ('transportation', 'Transportation'),
        ('education', 'Education'),
        ('government', 'Government'),
        ('other', 'Other'),
    ]

    TRAVEL_FREQUENCY_CHOICES = [
        ('Daily', 'Daily'),
        ('Weekly', 'Weekly'),
        ('Monthly', 'Monthly'),
        ('Quarterly', 'Quarterly'),
        ('Bi-weekly', 'Bi-weekly'),
    ]

    PREFERRED_CLASS_CHOICES = [
        ('Economy', 'Economy'),
        ('Economy Plus', 'Economy Plus'),
        ('Business', 'Business'),
        ('First', 'First Class'),
        ('Business/First', 'Business/First'),
    ]

    CREDIT_RATING_CHOICES = [
        ('AAA', 'AAA'),
        ('AA', 'AA'),
        ('A', 'A'),
        ('BBB', 'BBB'),
        ('BB', 'BB'),
    ]

    PAYMENT_TERMS_CHOICES = [
        ('Net 15', 'Net 15'),
        ('Net 30', 'Net 30'),
        ('Net 45', 'Net 45'),
        ('Net 60', 'Net 60'),
    ]

    SUSTAINABILITY_CHOICES = [
        ('Very High', 'Very High'),
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    ]

    RISK_LEVEL_CHOICES = [
        ('Very Low', 'Very Low'),
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
    ]

    EXPANSION_CHOICES = [
        ('Aggressive', 'Aggressive'),
        ('Moderate', 'Moderate'),
        ('Conservative', 'Conservative'),
        ('Rapid', 'Rapid'),
        ('Stable', 'Stable'),
    ]

    # Basic Info fields
    name = models.CharField(max_length=255)
    company_type = models.CharField(max_length=50,
                                    choices=COMPANY_SIZES,
                                    blank=True)
    industry = models.CharField(max_length=50, choices=INDUSTRIES)
    location = models.CharField(max_length=255)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    website = models.URLField(blank=True, null=True)

    # Business Details fields
    employee_count = models.IntegerField(null=True, blank=True)
    annual_revenue = models.DecimalField(max_digits=15,
                                         decimal_places=2,
                                         null=True,
                                         blank=True)
    year_established = models.IntegerField(null=True, blank=True)
    size = models.CharField(max_length=20, choices=COMPANY_SIZES)
    credit_rating = models.CharField(max_length=10,
                                     choices=CREDIT_RATING_CHOICES,
                                     blank=True)
    payment_terms = models.CharField(max_length=20,
                                     choices=PAYMENT_TERMS_CHOICES,
                                     blank=True)

    # Travel Profile fields
    travel_budget = models.DecimalField(max_digits=12,
                                        decimal_places=2,
                                        null=True,
                                        blank=True)
    annual_travel_volume = models.CharField(max_length=100, blank=True)
    travel_frequency = models.CharField(max_length=20,
                                        choices=TRAVEL_FREQUENCY_CHOICES,
                                        blank=True)
    preferred_class = models.CharField(max_length=20,
                                       choices=PREFERRED_CLASS_CHOICES,
                                       blank=True)
    sustainability_focus = models.CharField(max_length=20,
                                            choices=SUSTAINABILITY_CHOICES,
                                            blank=True)
    risk_level = models.CharField(max_length=20,
                                  choices=RISK_LEVEL_CHOICES,
                                  blank=True)
    current_airlines = models.TextField(
        blank=True)  # Store as comma-separated values

    # Additional Info fields
    expansion_plans = models.CharField(max_length=20,
                                       choices=EXPANSION_CHOICES,
                                       blank=True)
    specialties = models.TextField(
        blank=True)  # Store as comma-separated values
    technology_integration = models.TextField(
        blank=True)  # Store as comma-separated values
    description = models.TextField(
        blank=True)  # This will be used for additional notes

    is_active = models.BooleanField(default=True)
    move_as_lead = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Contact(models.Model):
    DEPARTMENTS = [
        ('executive', 'Executive'),
        ('finance', 'Finance'),
        ('hr', 'Human Resources'),
        ('operations', 'Operations'),
        ('travel', 'Travel Management'),
        ('procurement', 'Procurement'),
        ('it', 'IT'),
        ('marketing', 'Marketing'),
        ('sales', 'Sales'),
        ('other', 'Other'),
    ]

    company = models.ForeignKey(Company,
                                on_delete=models.CASCADE,
                                related_name='contacts')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    position = models.CharField(max_length=100)
    department = models.CharField(max_length=20,
                                  choices=DEPARTMENTS,
                                  blank=True)
    is_decision_maker = models.BooleanField(default=False)
    linkedin_profile = models.URLField(blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.company.name}"


class Lead(models.Model):
    LEAD_STATUS_CHOICES = [
        ('new', 'New'),
        ('qualified', 'Qualified'),
        ('unqualified', 'Unqualified'),
        ('contacted', 'Contacted'),
        ('proposal_sent', 'Proposal Sent'),
        ('negotiation', 'In Negotiation'),
        ('won', 'Won'),
        ('lost', 'Lost'),
    ]

    LEAD_SOURCE_CHOICES = [
        ('website', 'Website'),
        ('referral', 'Referral'),
        ('cold_outreach', 'Cold Outreach'),
        ('marketing', 'Marketing Campaign'),
        ('social_media', 'Social Media'),
        ('corporate_search', 'Corporate Search'),
        ('ai_discovery', 'AI Discovery'),
    ]

    PRIORITY_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE)
    status = models.CharField(max_length=20,
                              choices=LEAD_STATUS_CHOICES,
                              default='new')
    source = models.CharField(max_length=20, choices=LEAD_SOURCE_CHOICES)
    priority = models.CharField(max_length=10,
                                choices=PRIORITY_LEVELS,
                                default='medium')
    score = models.IntegerField(default=0)
    estimated_value = models.DecimalField(max_digits=12,
                                          decimal_places=2,
                                          null=True,
                                          blank=True)
    notes = models.TextField(blank=True)
    assigned_to = models.ForeignKey(User,
                                    on_delete=models.SET_NULL,
                                    null=True,
                                    blank=True)
    assigned_agent = models.CharField(max_length=255, blank=True, null=True)
    next_action = models.CharField(max_length=255, blank=True)
    next_action_date = models.DateTimeField(null=True, blank=True)
    moved_to_opportunity = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Lead: {self.company.name} - {self.status}"


class Opportunity(models.Model):
    OPPORTUNITY_STAGES = [
        ('discovery', 'Discovery'),
        ('proposal', 'Proposal'),
        ('negotiation', 'Negotiation'),
        ('closed_won', 'Closed Won'),
        ('closed_lost', 'Closed Lost'),
    ]

    lead = models.OneToOneField(Lead,
                                on_delete=models.CASCADE,
                                related_name='opportunity')
    name = models.CharField(max_length=255)
    stage = models.CharField(max_length=20,
                             choices=OPPORTUNITY_STAGES,
                             default='discovery')
    probability = models.IntegerField(default=0)
    estimated_close_date = models.DateField()
    actual_close_date = models.DateField(null=True, blank=True)
    value = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField(blank=True)
    next_steps = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.stage}"


class OpportunityActivity(models.Model):
    ACTIVITY_TYPES = [
        ('call', 'Phone Call'),
        ('email', 'Email'),
        ('meeting', 'Meeting'),
        ('demo', 'Demo'),
        ('proposal', 'Proposal'),
        ('negotiation', 'Negotiation'),
        ('other', 'Other'),
    ]

    opportunity = models.ForeignKey(Opportunity,
                                    on_delete=models.CASCADE,
                                    related_name='activities')
    type = models.CharField(max_length=20, choices=ACTIVITY_TYPES)
    description = models.TextField()
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey('auth.User',
                                   on_delete=models.SET_NULL,
                                   null=True,
                                   blank=True)

    class Meta:
        ordering = ['-date', '-created_at']
        verbose_name_plural = 'Opportunity Activities'

    def __str__(self):
        return f"{self.get_type_display()} - {self.opportunity.name}"


class Contract(models.Model):
    CONTRACT_STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('pending_signature', 'Pending Signature'),
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('terminated', 'Terminated'),
        ('at_risk', 'At Risk'),
        ('breach', 'In Breach'),
    ]

    CONTRACT_TYPES = [
        ('corporate_travel', 'Corporate Travel Agreement'),
        ('service_agreement', 'Service Agreement'),
        ('master_agreement', 'Master Service Agreement'),
        ('vendor_contract', 'Vendor Contract'),
        ('nda', 'Non-Disclosure Agreement'),
        ('other', 'Other'),
    ]

    opportunity = models.OneToOneField(Opportunity, on_delete=models.CASCADE, related_name='contract', null=True, blank=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    contract_number = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=255)
    contract_type = models.CharField(max_length=30, choices=CONTRACT_TYPES, default='corporate_travel')
    status = models.CharField(max_length=20, choices=CONTRACT_STATUS_CHOICES, default='draft')
    start_date = models.DateField()
    end_date = models.DateField()
    value = models.DecimalField(max_digits=12, decimal_places=2)
    terms = models.TextField()
    renewal_terms = models.TextField(blank=True)
    auto_renewal = models.BooleanField(default=False)
    notice_period_days = models.IntegerField(default=30)
    risk_score = models.IntegerField(default=0)
    sla_requirements = models.TextField(blank=True)
    payment_terms_days = models.IntegerField(default=30)
    performance_bonus = models.BooleanField(default=False)
    exclusivity = models.BooleanField(default=False)
    custom_clauses = models.TextField(blank=True)
    client_department = models.CharField(max_length=100, blank=True)
    company_email = models.EmailField(blank=True)
    comments = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.contract_number} - {self.title}"

class ContractBreach(models.Model):
    BREACH_TYPES = [
        ('payment', 'Payment Delay'),
        ('service_level', 'Service Level Violation'),
        ('compliance', 'Compliance Issue'),
        ('delivery', 'Delivery Delay'),
        ('quality', 'Quality Issue'),
        ('other', 'Other'),
    ]

    SEVERITY_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]

    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name='breaches')
    breach_type = models.CharField(max_length=20, choices=BREACH_TYPES)
    severity = models.CharField(max_length=10, choices=SEVERITY_LEVELS)
    description = models.TextField()
    detected_date = models.DateTimeField(auto_now_add=True)
    resolved_date = models.DateTimeField(null=True, blank=True)
    is_resolved = models.BooleanField(default=False)
    financial_impact = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    resolution_notes = models.TextField(blank=True)

    def __str__(self):
        return f"Breach: {self.contract.contract_number} - {self.breach_type}"

class CampaignTemplate(models.Model):
    CHANNEL_TYPE_CHOICES = [
        ('email', 'Email'),
        ('whatsapp', 'WhatsApp'),
        ('linkedin', 'LinkedIn'),
        ('mixed', 'Multi-Channel'),
    ]

    LINKEDIN_TYPE_CHOICES = [
        ('message', 'Direct Message'),
        ('post', 'Post/Content'),
        ('connection', 'Connection Request'),
    ]

    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    subject_line = models.CharField(
        max_length=255,
        default="Default Subject",  # ✅ safe default
        null=False,
        blank=False
    )
    content = models.TextField()
    channel_type = models.CharField(max_length=50, default='email')
    target_industry = models.CharField(max_length=100, blank=True)
    cta = models.CharField(max_length=200, blank=True)
    estimated_open_rate = models.FloatField(default=0.0)
    estimated_click_rate = models.FloatField(default=0.0)
    is_standard_layout = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']


class EmailCampaign(models.Model):
    CAMPAIGN_STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('scheduled', 'Scheduled'),
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('completed', 'Completed'),
    ]

    CAMPAIGN_TYPES = [
        ('nurture', 'Lead Nurture'),
        ('follow_up', 'Follow-up'),
        ('promotion', 'Promotional'),
        ('newsletter', 'Newsletter'),
        ('announcement', 'Announcement'),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField()
    campaign_type = models.CharField(max_length=20,
                                     choices=CAMPAIGN_TYPES,
                                     default='nurture')
    status = models.CharField(max_length=20,
                              choices=CAMPAIGN_STATUS_CHOICES,
                              default='draft')
    subject_line = models.CharField(
        max_length=255,
        default="Default Subject",  # ✅ safe default
        null=False,
        blank=False
    )
    email_content = models.TextField()
    cta_link = models.URLField(blank=True, null=True)
    scheduled_date = models.DateTimeField()
    sent_date = models.DateTimeField(null=True, blank=True)
    emails_sent = models.IntegerField(default=0)
    emails_opened = models.IntegerField(default=0)
    emails_clicked = models.IntegerField(default=0)
    target_leads = models.ManyToManyField('Lead', blank=True)
    target_count = models.IntegerField(
        default=0)  # Track number of targeted leads
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    @property
    def open_rate(self):
        if self.emails_sent == 0:
            return 0
        return round((self.emails_opened / self.emails_sent) * 100, 2)

    @property
    def click_rate(self):
        if self.emails_sent == 0:
            return 0
        return round((self.emails_clicked / self.emails_sent) * 100, 2)

    @property
    def target_leads_count(self):
        return self.target_leads.count()

    def send_emails(self):
        """Send emails to target leads with detailed SMTP logging"""
        import logging
        from django.core.mail import get_connection, EmailMessage
        from django.template import Template, Context
        from django.conf import settings
        import smtplib

        # Configure logging for SMTP operations
        logging.basicConfig(level=logging.INFO)
        smtp_logger = logging.getLogger('smtp_email_campaign')

        # Create file handler for email logs
        import os
        log_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)),
                               'logs')
        os.makedirs(log_dir, exist_ok=True)
        log_file = os.path.join(
            log_dir,
            f'email_campaign_{self.id}_{timezone.now().strftime("%Y%m%d_%H%M%S")}.log'
        )

        file_handler = logging.FileHandler(log_file)
        file_handler.setLevel(logging.INFO)
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        file_handler.setFormatter(formatter)
        smtp_logger.addHandler(file_handler)

        if not self.target_leads.exists():
            smtp_logger.warning(
                f"Campaign {self.name} (ID: {self.id}): No target leads found")
            return {'success': False, 'message': 'No target leads found'}

        smtp_logger.info(
            f"Starting email campaign: {self.name} (ID: {self.id})")
        smtp_logger.info(f"Target leads count: {self.target_leads.count()}")

        # Prepare email data
        emails_to_send = []
        sent_count = 0
        failed_count = 0
        smtp_responses = []

        for lead in self.target_leads.all():
            try:
                # Validate email address
                if not lead.contact.email or not lead.contact.email.strip():
                    failed_count += 1
                    smtp_logger.error(
                        f"Skipping lead {lead.company.name} - no valid email address"
                    )
                    continue

                # Validate email format
                email_address = lead.contact.email.strip()
                if '@' not in email_address or '.' not in email_address:
                    failed_count += 1
                    smtp_logger.error(
                        f"Skipping lead {lead.company.name} - invalid email format: {email_address}"
                    )
                    continue

                # Create template context with lead data
                context = Context({
                    'contact_name':
                    f"{lead.contact.first_name} {lead.contact.last_name}".
                    strip() or 'Valued Customer',
                    'company_name':
                    lead.company.name,
                    'industry':
                    lead.company.get_industry_display(),
                    'employees':
                    lead.company.employee_count or 'your team',
                    'travel_budget':
                    f"${int(lead.company.travel_budget/1000000)}M"
                    if lead.company.travel_budget else 'your budget'
                })

                # Create tracking record first
                tracking, created = EmailTracking.objects.get_or_create(
                    campaign=self,
                    lead=lead,
                    defaults={'tracking_id': uuid.uuid4()})

                # Render subject and content with dynamic data
                subject_template = Template(self.subject_line)
                content_template = Template(self.email_content)

                rendered_subject = subject_template.render(context)
                rendered_content = content_template.render(context)

                # Add tracking functionality
                rendered_content_with_tracking = self._add_email_tracking(rendered_content, tracking)

                # Create EmailMessage for individual tracking
                email_msg = EmailMessage(subject=rendered_subject,
                                         body=rendered_content_with_tracking,
                                         from_email=settings.DEFAULT_FROM_EMAIL
                                         or 'noreply@soarai.com',
                                         to=[email_address])
                email_msg.content_subtype = 'html'  # Set as HTML email
                emails_to_send.append((email_msg, lead, tracking))

                smtp_logger.info(
                    f"Prepared email for {email_address} ({lead.company.name})"
                )

            except Exception as e:
                failed_count += 1
                smtp_logger.error(
                    f"Error preparing email for {lead.contact.email if lead.contact.email else 'unknown'}: {str(e)}"
                )

        # Send emails individually with detailed SMTP logging
        try:
            if emails_to_send:
                # Get SMTP connection
                connection = get_connection()

                try:
                    connection.open()
                    smtp_logger.info("SMTP connection opened successfully")

                    for email_msg, lead, tracking in emails_to_send:
                        try:
                            # Send individual email
                            result = connection.send_messages([email_msg])

                            if result == 1:
                                sent_count += 1
                                # Update tracking record
                                tracking.email_sent = timezone.now()
                                tracking.save()

                                smtp_logger.info(
                                    f"✓ Email sent successfully to {lead.contact.email} ({lead.company.name})"
                                )
                                smtp_responses.append({
                                    'email':
                                    lead.contact.email,
                                    'company':
                                    lead.company.name,
                                    'status':
                                    'SUCCESS',
                                    'message':
                                    'Email sent successfully',
                                    'tracking_id':
                                    str(tracking.tracking_id)
                                })
                            else:
                                failed_count += 1
                                smtp_responses.append({
                                    'email':
                                    lead.contact.email,
                                    'company':
                                    lead.company.name,
                                    'status':
                                    'FAILED',
                                    'message':
                                    'Send failed without SMTP error'
                                })

                        except Exception as e:
                            failed_count += 1
                            smtp_responses.append({
                                'email': lead.contact.email,
                                'company': lead.company.name,
                                'status': 'ERROR',
                                'message': str(e)
                            })

                finally:
                    connection.close()
                    smtp_logger.info("SMTP connection closed")

                # Update campaign stats
                self.emails_sent = sent_count
                self.target_count = len(emails_to_send)
                self.status = 'active'
                self.sent_date = timezone.now()
                self.save()

                # Log final summary
                smtp_logger.info(
                    f"Campaign completed: {sent_count} sent, {failed_count} failed"
                )

                return {
                    'success': True,
                    'message':
                    f'Campaign completed: {sent_count} sent, {failed_count} failed',
                    'emails_sent': sent_count,
                    'failed_count': failed_count,
                    'smtp_responses': smtp_responses,
                    'smtp_details': {
                        'total_processed':
                        len(emails_to_send),
                        'success_rate':
                        f'{(sent_count/len(emails_to_send)*100):.1f}%'
                        if emails_to_send else '0%'
                    },
                    'log_file': log_file
                }
            else:
                smtp_logger.warning("No valid emails to send")
                return {'success': False, 'message': 'No valid emails to send'}

        except Exception as e:
            error_msg = f'Failed to send emails: {str(e)}'
            smtp_logger.error(error_msg)
            return {
                'success': False,
                'message': error_msg,
                'emails_sent': sent_count,
                'failed_count': len(emails_to_send) - sent_count,
                'smtp_responses': smtp_responses,
                'log_file': log_file
            }
        finally:
            # Remove the handler to prevent memory leaks
            smtp_logger.removeHandler(file_handler)
            file_handler.close()

    def _add_email_tracking(self, content, tracking):
        """Add tracking pixel and wrap links for click tracking"""
        import re
        from django.conf import settings
        
        # Get base URL for tracking
        base_url = getattr(settings, 'BASE_URL', 'https://f08f172c-ab06-433f-aa2f-30c498986833-00-2n6bjrfy6tvjp.pike.replit.dev:5173')
        
        # Add tracking pixel before closing body tag
        tracking_pixel = f'<img src="{base_url}/api/track/open/{tracking.tracking_id}/" width="1" height="1" style="display:none;" alt="" />'
        
        # Insert tracking pixel before </body> or at the end if no </body>
        if '</body>' in content.lower():
            content = content.replace('</body>', f'{tracking_pixel}</body>')
        else:
            content += tracking_pixel
        
        # Wrap all links for click tracking (excluding mailto and tel links)
        def wrap_link(match):
            full_match = match.group(0)
            href = match.group(1)
            
            # Skip if it's already a tracking link, mailto, tel, or anchor
            if ('/api/track/click/' in href or 
                href.startswith('mailto:') or 
                href.startswith('tel:') or 
                href.startswith('#')):
                return full_match
            
            # Create tracking URL
            import urllib.parse
            encoded_url = urllib.parse.quote(href, safe='')
            tracking_url = f"{base_url}/api/track/click/{tracking.tracking_id}/?url={encoded_url}"
            
            # Replace the href
            return full_match.replace(f'href="{href}"', f'href="{tracking_url}"')
        
        # Find and replace all href attributes
        content = re.sub(r'href="([^"]*)"', wrap_link, content)
        
        return content

    def get_real_time_stats(self):
        """Get real-time statistics from tracking data"""
        tracking_records = self.email_tracking.all()
        
        total_sent = self.emails_sent
        unique_opens = tracking_records.filter(open_count__gt=0).count()
        unique_clicks = tracking_records.filter(click_count__gt=0).count()
        total_opens = tracking_records.aggregate(total=models.Sum('open_count'))['total'] or 0
        total_clicks = tracking_records.aggregate(total=models.Sum('click_count'))['total'] or 0
        
        # Update campaign stats
        self.emails_opened = unique_opens
        self.emails_clicked = unique_clicks
        self.save(update_fields=['emails_opened', 'emails_clicked'])
        
        return {
            'emails_sent': total_sent,
            'unique_opens': unique_opens,
            'unique_clicks': unique_clicks,
            'total_opens': total_opens,
            'total_clicks': total_clicks,
            'open_rate': round((unique_opens / total_sent) * 100, 2) if total_sent > 0 else 0,
            'click_rate': round((unique_clicks / total_sent) * 100, 2) if total_sent > 0 else 0,
            'click_to_open_rate': round((unique_clicks / unique_opens) * 100, 2) if unique_opens > 0 else 0
        }


class EmailTracking(models.Model):
    """Track individual email opens and clicks"""
    campaign = models.ForeignKey(EmailCampaign,
                                 on_delete=models.CASCADE,
                                 related_name='email_tracking')
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE)
    tracking_id = models.UUIDField(default=uuid.uuid4, unique=True)
    email_sent = models.DateTimeField(auto_now_add=True)
    first_opened = models.DateTimeField(null=True, blank=True)
    last_opened = models.DateTimeField(null=True, blank=True)
    open_count = models.IntegerField(default=0)
    first_clicked = models.DateTimeField(null=True, blank=True)
    last_clicked = models.DateTimeField(null=True, blank=True)
    click_count = models.IntegerField(default=0)
    user_agent = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    def __str__(self):
        return f"Tracking {self.campaign.name} - {self.lead.company.name}"

    class Meta:
        unique_together = ['campaign', 'lead']


class TravelOffer(models.Model):
    OFFER_STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('suspended', 'Suspended'),
    ]

    OFFER_TYPES = [
        ('corporate_rate', 'Corporate Rate'),
        ('group_booking', 'Group Booking'),
        ('advance_purchase', 'Advance Purchase'),
        ('flexible', 'Flexible Booking'),
        ('premium', 'Premium Service'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    offer_type = models.CharField(max_length=20, choices=OFFER_TYPES)
    status = models.CharField(max_length=15,
                              choices=OFFER_STATUS_CHOICES,
                              default='draft')
    discount_percentage = models.DecimalField(max_digits=5,
                                              decimal_places=2,
                                              null=True,
                                              blank=True)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    discounted_price = models.DecimalField(max_digits=10,
                                           decimal_places=2,
                                           null=True,
                                           blank=True)
    valid_from = models.DateTimeField()
    valid_until = models.DateTimeField()
    terms_conditions = models.TextField()
    target_companies = models.ManyToManyField(Company, blank=True)
    bookings_count = models.IntegerField(default=0)
    revenue_generated = models.DecimalField(max_digits=12,
                                            decimal_places=2,
                                            default=0)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class SupportTicket(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]

    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('waiting', 'Waiting for Response'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]

    CATEGORY_CHOICES = [
        ('technical', 'Technical Issue'),
        ('billing', 'Billing'),
        ('booking', 'Booking Support'),
        ('account', 'Account Management'),
        ('general', 'General Inquiry'),
        ('complaint', 'Complaint'),
    ]

    ticket_number = models.CharField(max_length=20, unique=True, default='')
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE)
    subject = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=15,
                                choices=CATEGORY_CHOICES,
                                default='general')
    priority = models.CharField(max_length=10,
                                choices=PRIORITY_CHOICES,
                                default='medium')
    status = models.CharField(max_length=15,
                              choices=STATUS_CHOICES,
                              default='open')
    assigned_to = models.ForeignKey(User,
                                    on_delete=models.SET_NULL,
                                    null=True,
                                    blank=True)
    resolution_notes = models.TextField(blank=True)
    satisfaction_rating = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.ticket_number:
            self.ticket_number = f"TKT-{timezone.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:6].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.ticket_number} - {self.subject}"


class RevenueForecast(models.Model):
    PERIOD_TYPES = [
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('yearly', 'Yearly'),
    ]

    period_type = models.CharField(max_length=15,
                                   choices=PERIOD_TYPES,
                                   default='monthly')
    period = models.CharField(max_length=20)
    forecasted_revenue = models.DecimalField(max_digits=15, decimal_places=2)
    actual_revenue = models.DecimalField(max_digits=15,
                                         decimal_places=2,
                                         null=True,
                                         blank=True)
    confidence_level = models.IntegerField(default=80)
    factors = models.JSONField(default=dict, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Revenue Forecast {self.period}"


class LeadNote(models.Model):
    URGENCY_CHOICES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
        ('Urgent', 'Urgent'),
    ]

    lead = models.ForeignKey(Lead,
                             on_delete=models.CASCADE,
                             related_name='lead_notes')
    note = models.TextField()
    next_action = models.CharField(max_length=255, blank=True)
    urgency = models.CharField(max_length=10,
                               choices=URGENCY_CHOICES,
                               default='Medium')
    created_by = models.ForeignKey(User,
                                   on_delete=models.SET_NULL,
                                   null=True,
                                   blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Note for {self.lead.company.name} - {self.created_at.strftime('%Y-%m-%d')}"

    class Meta:
        ordering = ['-created_at']


class LeadHistory(models.Model):
    HISTORY_TYPES = [
        ('creation', 'Lead Created'),
        ('status_change', 'Status Changed'),
        ('note_added', 'Note Added'),
        ('score_update', 'Score Updated'),
        ('agent_assignment', 'Agent Assigned'),
        ('agent_reassignment', 'Agent Reassigned'),
        ('assignment', 'Lead Assigned'),
        ('contact_made', 'Contact Made'),
        ('email_sent', 'Email Sent'),
        ('call_made', 'Call Made'),
        ('meeting_scheduled', 'Meeting Scheduled'),
        ('qualification', 'Lead Qualified'),
        ('disqualification', 'Lead Disqualified'),
        ('opportunity_created', 'Opportunity Created'),
        ('proposal_sent', 'Proposal Sent'),
        ('negotiation_started', 'Negotiation Started'),
        ('won', 'Lead Won'),
        ('lost', 'Lead Lost'),
    ]

    ICON_TYPES = [
        ('plus', 'Plus'),
        ('mail', 'Mail'),
        ('phone', 'Phone'),
        ('message-circle', 'Message Circle'),
        ('message-square', 'Message Square'),
        ('trending-up', 'Trending Up'),
        ('user', 'User'),
        ('check-circle', 'Check Circle'),
        ('x-circle', 'X Circle'),
        ('calendar', 'Calendar'),
        ('briefcase', 'Briefcase'),
        ('file-text', 'File Text'),
        ('handshake', 'Handshake'),
        ('trophy', 'Trophy'),
        ('x', 'X'),
    ]

    lead = models.ForeignKey(Lead,
                             on_delete=models.CASCADE,
                             related_name='history_entries')
    history_type = models.CharField(max_length=255)  # <- this must be here

    action = models.CharField(max_length=255)
    details = models.TextField()
    icon = models.CharField(max_length=20, choices=ICON_TYPES, default='plus')
    user = models.ForeignKey(User,
                             on_delete=models.SET_NULL,
                             null=True,
                             blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.lead.company.name} - {self.action}"

    class Meta:
        ordering = ['timestamp']


class ActivityLog(models.Model):
    ACTION_TYPES = [
        ('create', 'Created'),
        ('update', 'Updated'),
        ('delete', 'Deleted'),
        ('view', 'Viewed'),
        ('export', 'Exported'),
        ('email_sent', 'Email Sent'),
        ('call_made', 'Call Made'),
        ('meeting_scheduled', 'Meeting Scheduled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action_type = models.CharField(max_length=20, choices=ACTION_TYPES)
    action = models.CharField(max_length=255)
    entity_type = models.CharField(max_length=100)
    entity_id = models.IntegerField()
    details = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.action} on {self.entity_type}"

    class Meta:
        ordering = ['-timestamp']


class AIConversation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    session_id = models.UUIDField(default=uuid.uuid4, unique=True)
    query = models.TextField()
    response = models.TextField()
    context = models.JSONField(default=dict, blank=True)
    entities_mentioned = models.JSONField(default=list, blank=True)
    actions_suggested = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"AI Chat - {self.user.username} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"

    class Meta:
        ordering = ['-created_at']


class ProposalDraft(models.Model):
    opportunity = models.OneToOneField(Opportunity,
                                       on_delete=models.CASCADE,
                                       related_name='proposal_draft')

    # Proposal Information
    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    validity_period = models.CharField(max_length=10, default="30")
    special_terms = models.TextField(blank=True)
    delivery_method = models.CharField(max_length=20, default="email")

    # Volume Commitment
    travel_frequency = models.CharField(max_length=20, default="monthly")
    annual_booking_volume = models.CharField(max_length=100, blank=True)
    projected_spend = models.CharField(max_length=100, blank=True)
    preferred_routes = models.TextField(blank=True)
    domestic_economy = models.IntegerField(default=60)
    domestic_business = models.IntegerField(default=25)
    international = models.IntegerField(default=15)

    # Discount/Offer Terms
    base_discount = models.CharField(max_length=10, blank=True)
    route_discounts = models.JSONField(default=list, blank=True)
    loyalty_benefits = models.JSONField(default=dict, blank=True)
    volume_incentives = models.TextField(blank=True)

    # Financial & Contract Terms
    contract_duration = models.CharField(max_length=10, default="24")
    auto_renewal = models.BooleanField(default=True)
    payment_terms = models.CharField(max_length=20, default="net_30")
    settlement_type = models.CharField(max_length=20, default="bsp")

    # Negotiation Strategy
    airline_concessions = models.TextField(blank=True)
    corporate_commitments = models.TextField(blank=True)
    internal_notes = models.TextField(blank=True)
    priority_level = models.CharField(max_length=20, default="medium")

    # Approvals Workflow
    discount_approval_required = models.BooleanField(default=False)
    revenue_manager_assigned = models.CharField(max_length=100, blank=True)
    legal_approval_required = models.BooleanField(default=False)

    # File attachment
    attachment_path = models.CharField(max_length=500, blank=True)
    attachment_original_name = models.CharField(max_length=255, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Draft - {self.opportunity.name}"

    class Meta:
        ordering = ['-updated_at']
