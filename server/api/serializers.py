from rest_framework import serializers
from django.contrib.auth.models import User, Group, Permission
from .models import (
    Company, Contact, Lead, Opportunity, Contract, ContractBreach, EmailCampaign, EmailTemplate, TravelOffer, SupportTicket, RevenueForecast, ActivityLog, AIConversation, LeadNote, LeadHistory, CampaignTemplate,
    EmailTracking, OpportunityActivity, ProposalDraft, AirportCode, UserProfile, RoleMenuPermission
)

class CompanySerializer(serializers.ModelSerializer):
    contacts_count = serializers.SerializerMethodField()
    leads_count = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = '__all__'

    def get_contacts_count(self, obj):
        return obj.contacts.count()

    def get_leads_count(self, obj):
        return obj.lead_set.count()

    def validate_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Company name is required.")
        return value.strip()

    def validate_industry(self, value):
        valid_industries = [choice[0] for choice in Company.INDUSTRIES]
        if value not in valid_industries:
            raise serializers.ValidationError(f"Invalid industry. Must be one of: {valid_industries}")
        return value

    def validate_size(self, value):
        valid_sizes = [choice[0] for choice in Company.COMPANY_SIZES]
        if value not in valid_sizes:
            raise serializers.ValidationError(f"Invalid size. Must be one of: {valid_sizes}")
        return value

    def validate_email(self, value):
        if value and not '@' in value:
            raise serializers.ValidationError("Invalid email format.")
        return value

    def validate_annual_revenue(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Annual revenue cannot be negative.")
        return value

    def validate_employee_count(self, value):
        if value is not None and value < 1:
            raise serializers.ValidationError("Employee count must be at least 1.")
        return value

    def validate_travel_budget(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Travel budget cannot be negative.")
        return value

class ContactSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Contact
        fields = '__all__'

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

class LeadNoteSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = LeadNote
        fields = '__all__'

class LeadHistorySerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    user_role = serializers.SerializerMethodField()
    formatted_timestamp = serializers.SerializerMethodField()
    assigned_agent = serializers.SerializerMethodField()
    previous_agent = serializers.SerializerMethodField()
    assignment_priority = serializers.SerializerMethodField()
    assignment_notes = serializers.SerializerMethodField()
    contact_tooltip = serializers.SerializerMethodField()
    status_change_details = serializers.SerializerMethodField()

    class Meta:
        model = LeadHistory
        fields = ['id', 'history_type', 'action', 'details', 'icon', 'timestamp', 'metadata', 'user_name', 'user_role', 'formatted_timestamp', 'assigned_agent', 'previous_agent', 'assignment_priority', 'assignment_notes', 'contact_message', 'previous_status', 'new_status', 'contact_tooltip', 'status_change_details']

    def get_user_name(self, obj):
        if obj.user:
            return obj.user.get_full_name() or obj.user.username
        return 'superadmin'

    def get_user_role(self, obj):
        return 'Agent' if obj.user else 'superadmin'

    def get_formatted_timestamp(self, obj):
        return obj.timestamp.strftime('%m/%d/%Y at %I:%M %p')

    def get_assigned_agent(self, obj):
        if obj.user:
            return obj.user.get_full_name() or obj.user.username
        return None

    def get_user_name(self, obj):
        if obj.user:
            return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username
        return "superadmin"

    def get_user_role(self, obj):
        if obj.user:
            # You can customize this based on your user model
            if obj.user.is_staff:
                return "Sales Manager"
            return "Sales Representative"
        return "superadmin"

    def get_formatted_timestamp(self, obj):
        from django.utils import timezone
        from datetime import datetime

        if obj.timestamp:
            # Format as "08-07-2024 at 9:15:00 AM"
            return obj.timestamp.strftime('%d-%m-%Y at %I:%M:%S %p')
        return ""

    def get_assigned_agent(self, obj):
        """Extract assigned agent name from metadata or action text"""
        if obj.history_type in ['agent_assignment', 'agent_reassignment']:
            # First try to get from metadata
            if hasattr(obj, 'metadata') and obj.metadata:
                agent_name = obj.metadata.get('agent_name')
                if agent_name:
                    return agent_name

            # Fallback to extracting from action text
            if 'assigned to' in obj.action.lower() or 'reassigned to' in obj.action.lower():
                import re
                match = re.search(r'(?:assigned|reassigned) to (.+)', obj.action, re.IGNORECASE)
                if match:
                    return match.group(1).strip()
            elif 'assigned:' in obj.action.lower():
                parts = obj.action.split(': ')
                if len(parts) > 1:
                    return parts[1].strip()
        return obj.lead.assigned_agent if obj.lead else None

    def get_previous_agent(self, obj):
        """Extract previous agent name from metadata"""
        if obj.history_type == 'agent_reassignment' and hasattr(obj, 'metadata') and obj.metadata:
            return obj.metadata.get('previous_agent')
        return None

    def get_assignment_priority(self, obj):
        """Extract assignment priority from metadata"""
        if obj.history_type in ['agent_assignment', 'agent_reassignment'] and hasattr(obj, 'metadata') and obj.metadata:
            return obj.metadata.get('priority')
        return None

    def get_assignment_notes(self, obj):
        """Extract assignment notes from metadata"""
        if obj.history_type in ['agent_assignment', 'agent_reassignment'] and hasattr(obj, 'metadata') and obj.metadata:
            return obj.metadata.get('assignment_notes')
        return None

    def get_contact_tooltip(self, obj):
        """Get contact message for tooltip display"""
        if obj.history_type in ['contact_made', 'call_made', 'email_sent', 'contact_response', 'phone_call_completed', 'email_response', 'meeting_completed'] and obj.contact_message:
            return {
                'message': obj.contact_message,
                'type': obj.history_type,
                'timestamp': obj.timestamp.strftime('%m/%d/%Y at %I:%M %p') if obj.timestamp else ''
            }
        return None

    def get_status_change_details(self, obj):
        """Get status change details for display"""
        if obj.history_type == 'status_change' and obj.previous_status and obj.new_status:
            return {
                'previous_status': obj.previous_status,
                'new_status': obj.new_status,
                'changed_by': obj.user.get_full_name() if obj.user else 'superadmin',
                'timestamp': obj.timestamp.strftime('%m/%d/%Y at %I:%M %p') if obj.timestamp else ''
            }
        return None

class LeadSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)
    contact = ContactSerializer(read_only=True)
    assigned_to = serializers.StringRelatedField(read_only=True)
    assigned_agent = serializers.CharField(read_only=True)
    assigned_agent_details = serializers.SerializerMethodField()
    lead_notes = LeadNoteSerializer(many=True, read_only=True)
    all_notes = serializers.SerializerMethodField()
    history_entries = serializers.SerializerMethodField()
    campaign_count = serializers.SerializerMethodField()

    class Meta:
        model = Lead
        fields = '__all__'

    def get_history_entries(self, obj):
        """
        Get history entries, handling case where LeadHistory table doesn't exist yet
        """
        try:
            from .models import LeadHistory
            history_entries = obj.history_entries.all()
            return LeadHistorySerializer(history_entries, many=True).data
        except Exception:
            # Return empty list if LeadHistory table doesn't exist
            return []

    def get_company(self, obj):
        return {
            'id': obj.company.id,
            'name': obj.company.name,
            'industry': obj.company.industry,
            'location': obj.company.location,
        }

    def get_contact(self, obj):
        return {
            'id': obj.contact.id,
            'first_name': obj.contact.first_name,
            'last_name': obj.contact.last_name,
            'email': obj.contact.email,
            'phone': obj.contact.phone,
            'position': obj.contact.position,
        }

    def get_assigned_to(self, obj):
        if obj.assigned_to:
            return {
                'id': obj.assigned_to.id,
                'username': obj.assigned_to.username,
                'first_name': obj.assigned_to.first_name,
                'last_name': obj.assigned_to.last_name,
            }
        return None

    def get_days_since_created(self, obj):
        from django.utils import timezone
        return (timezone.now() - obj.created_at).days

    def get_all_notes(self, obj):
        """Get all lead notes formatted as an array of objects"""
        notes = obj.lead_notes.all().order_by('-created_at')
        return LeadNoteSerializer(notes, many=True).data

    def get_campaign_count(self, obj):
        """Get the number of email campaigns that targeted this lead"""
        return obj.emailcampaign_set.count()

    def get_assigned_agent_details(self, obj):
        """Get detailed information about the assigned agent"""
        if not obj.assigned_agent:
            return None

        # Map agent names to their details (in a real system, this would come from a User/Agent model)
        agent_details = {
            'John Smith': {
                'name': 'John Smith',
                'email': 'john.smith@soarai.com',
                'specialties': ['Enterprise', 'Technology'],
                'current_leads': 12,
                'role': 'Senior Sales Representative'
            },
            'Jane Smith': {
                'name': 'Jane Smith',
                'email': 'jane.smith@soarai.com',
                'specialties': ['Healthcare', 'Manufacturing'],
                'current_leads': 15,
                'role': 'Sales Representative'
            },
            'Sarah Wilson': {
                'name': 'Sarah Wilson',
                'email': 'sarah.wilson@soarai.com',
                'specialties': ['Manufacturing', 'Healthcare'],
                'current_leads': 7,
                'role': 'Sales Representative'
            },
            'Mike Johnson': {
                'name': 'Mike Johnson',
                'email': 'mike.johnson@soarai.com',
                'specialties': ['Energy', 'Manufacturing'],
                'current_leads': 9,
                'role': 'Sales Representative'
            },
            'David Brown': {
                'name': 'David Brown',
                'email': 'david.brown@soarai.com',
                'specialties': ['Healthcare', 'Government'],
                'current_leads': 4,
                'role': 'Sales Representative'
            }
        }

        return agent_details.get(obj.assigned_agent)

class OptimizedLeadSerializer(serializers.ModelSerializer):
    """Optimized serializer for list views with minimal data"""
    company = serializers.SerializerMethodField()
    contact = serializers.SerializerMethodField()
    assigned_to = serializers.CharField(source='assigned_agent', read_only=True)

    class Meta:
        model = Lead
        fields = [
            'id', 'status', 'source', 'priority', 'score', 'estimated_value',
            'notes', 'next_action', 'next_action_date', 'created_at', 'updated_at',
            'company', 'contact', 'assigned_to'
        ]

    def get_company(self, obj):
        """Get minimal company data"""
        return {
            'id': obj.company.id,
            'name': obj.company.name,
            'industry': obj.company.industry,
            'location': obj.company.location,
            'employee_count': obj.company.employee_count,
            'size': obj.company.size
        }

    def get_contact(self, obj):
        """Get minimal contact data"""
        return {
            'id': obj.contact.id,
            'first_name': obj.contact.first_name,
            'last_name': obj.contact.last_name,
            'email': obj.contact.email,
            'phone': obj.contact.phone,
            'position': obj.contact.position
        }


class OpportunityActivitySerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()
    type_display = serializers.CharField(source='get_type_display', read_only=True)

    class Meta:
        model = OpportunityActivity
        fields = '__all__'

    def get_created_by_name(self, obj):
        if obj.created_by:
            return f"{obj.created_by.first_name} {obj.created_by.last_name}".strip() or obj.created_by.username
        return 'superadmin'

class OpportunitySerializer(serializers.ModelSerializer):
    lead_info = serializers.SerializerMethodField()
    weighted_value = serializers.SerializerMethodField()
    activities = OpportunityActivitySerializer(many=True, read_only=True)
    latest_activities = serializers.SerializerMethodField()

    class Meta:
        model = Opportunity
        fields = '__all__'

    def get_weighted_value(self, obj):
        return float(obj.value) * (obj.probability / 100)

    def get_latest_activities(self, obj):
        latest_activities = obj.activities.all()[:3]  # Get latest 3 activities
        return OpportunityActivitySerializer(latest_activities, many=True).data

    def validate_probability(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError("Probability must be between 0 and 100")
        return value

    def validate_value(self, value):
        if value < 0:
            raise serializers.ValidationError("Value must be positive")
        return value

    def validate_stage(self, value):
        valid_stages = [choice[0] for choice in Opportunity.OPPORTUNITY_STAGES]
        if value not in valid_stages:
            raise serializers.ValidationError(f"Invalid stage. Must be one of: {valid_stages}")
        return value

    def get_lead_info(self, obj):
        if obj.lead:
            return {
                'company': {
                    'id': obj.lead.company.id,
                    'name': obj.lead.company.name,
                    'industry': obj.lead.company.industry,
                    'location': obj.lead.company.location,
                    'employee_count': obj.lead.company.employee_count,
                    'size': obj.lead.company.size,
                },
                'contact': {
                    'id': obj.lead.contact.id,
                    'first_name': obj.lead.contact.first_name,
                    'last_name': obj.lead.contact.last_name,
                    'email': obj.lead.contact.email,
                    'phone': obj.lead.contact.phone,
                    'position': obj.lead.contact.position,
                }
            }
        return None


class OptimizedOpportunitySerializer(serializers.ModelSerializer):
    """Optimized serializer for opportunity list views with minimal data"""
    lead_info = serializers.SerializerMethodField()
    weighted_value = serializers.SerializerMethodField()
    latest_activities = serializers.SerializerMethodField()

    class Meta:
        model = Opportunity
        fields = [
            'id', 'name', 'stage', 'probability', 'value',
            'estimated_close_date', 'created_at', 'updated_at',
            'description', 'next_steps', 'lead_info', 'weighted_value',
            'latest_activities','lead_id'
        ]

    def get_lead_info(self, obj):
        if obj.lead:
            return {
                'company': {
                    'id': obj.lead.company.id,
                    'name': obj.lead.company.name,
                    'industry': obj.lead.company.industry,
                    'location': obj.lead.company.location,
                    'employee_count': obj.lead.company.employee_count,
                    'size': obj.lead.company.size
                },
                'contact': {
                    'id': obj.lead.contact.id,
                    'first_name': obj.lead.contact.first_name,
                    'last_name': obj.lead.contact.last_name,
                    'email': obj.lead.contact.email,
                    'phone': obj.lead.contact.phone,
                    'position': obj.lead.contact.position
                }
            }
        return None

    def get_weighted_value(self, obj):
        return float(obj.value) * (obj.probability / 100)

    def get_latest_activities(self, obj):
        latest_activities = obj.activities.all()[:3]  # Get latest 3 activities
        return OpportunityActivitySerializer(latest_activities, many=True).data

class ContractBreachSerializer(serializers.ModelSerializer):
    contract_title = serializers.CharField(source='contract.title', read_only=True)

    class Meta:
        model = ContractBreach
        fields = '__all__'

class ContractSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    breaches = ContractBreachSerializer(many=True, read_only=True)

    days_until_expiry = serializers.SerializerMethodField()
    breach_count = serializers.SerializerMethodField()

    class Meta:
        model = Contract
        fields = '__all__'

    def get_days_until_expiry(self, obj):
        from django.utils import timezone
        return (obj.end_date - timezone.now().date()).days

    def get_breach_count(self, obj):
        return obj.breaches.filter(is_resolved=False).count()

class EmailTrackingSerializer(serializers.ModelSerializer):
    lead_name = serializers.CharField(source='lead.company.name', read_only=True)
    contact_name = serializers.SerializerMethodField()

    class Meta:
        model = EmailTracking
        fields = '__all__'

    def get_contact_name(self, obj):
        return f"{obj.lead.contact.first_name} {obj.lead.contact.last_name}"

class EmailCampaignSerializer(serializers.ModelSerializer):
    target_leads_count = serializers.SerializerMethodField()
    open_rate = serializers.SerializerMethodField()
    click_rate = serializers.SerializerMethodField()
    click_to_open_rate = serializers.SerializerMethodField()
    engagement_metrics = serializers.SerializerMethodField()
    email_template_name = serializers.CharField(source='email_template.name', read_only=True)

    class Meta:
        model = EmailCampaign
        fields = ['id', 'name', 'description', 'campaign_type', 'status', 'subject_line', 
                 'email_content', 'email_template', 'email_template_name', 'cta_link', 'scheduled_date', 'sent_date', 'emails_sent', 'emails_opened', 
                 'emails_clicked', 'target_leads', 'created_at', 'updated_at',
                 'target_leads_count', 'open_rate', 'click_rate', 'click_to_open_rate', 'engagement_metrics']

    def get_target_leads_count(self, obj):
        return obj.target_leads.count()

    def get_open_rate(self, obj):
        if obj.emails_sent == 0:
            return 0
        return round((obj.emails_opened / obj.emails_sent) * 100, 2)

    def get_click_rate(self, obj):
        if obj.emails_sent == 0:
            return 0
        return round((obj.emails_clicked / obj.emails_sent) * 100, 2)

    def get_click_to_open_rate(self, obj):
        if obj.emails_opened == 0:
            return 0
        return round((obj.emails_clicked / obj.emails_opened) * 100, 2)

    def get_engagement_metrics(self, obj):
        from django.db import models as django_models
        from django.db import connection

        try:
            # Check if connection is alive, if not reconnect
            connection.ensure_connection()

            tracking_records = obj.email_tracking.all()
            total_opens = tracking_records.aggregate(total=django_models.Sum('open_count'))['total'] or 0
            total_clicks = tracking_records.aggregate(total=django_models.Sum('click_count'))['total'] or 0

            return {
                'total_opens': total_opens,
                'total_clicks': total_clicks,
                'unique_opens': obj.emails_opened,
                'unique_clicks': obj.emails_clicked,
                'engaged_leads': tracking_records.filter(
                    django_models.Q(open_count__gt=1) | django_models.Q(click_count__gt=0)
                ).count()
            }
        except Exception as e:
            print(f"Error getting engagement metrics: {str(e)}")
            # Return default values if database connection fails
            return {
                'total_opens': 0,
                'total_clicks': 0,
                'unique_opens': obj.emails_opened or 0,
                'unique_clicks': obj.emails_clicked or 0,
                'engaged_leads': 0
            }

class TravelOfferSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    target_companies_count = serializers.SerializerMethodField()
    conversion_rate = serializers.SerializerMethodField()

    class Meta:
        model = TravelOffer
        fields = '__all__'

    def get_target_companies_count(self, obj):
        return obj.target_companies.count()

    def get_conversion_rate(self, obj):
        if obj.target_companies.count() == 0:
            return 0
        return (obj.bookings_count / obj.target_companies.count()) * 100

class SupportTicketSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    contact_name = serializers.SerializerMethodField()
    assigned_to_name = serializers.CharField(source='assigned_to.username', read_only=True)
    age_in_hours = serializers.SerializerMethodField()

    class Meta:
        model = SupportTicket
        fields = '__all__'

    def get_contact_name(self, obj):
        return f"{obj.contact.first_name} {obj.contact.last_name}"

    def get_age_in_hours(self, obj):
        from django.utils import timezone
        return int((timezone.now() - obj.created_at).total_seconds() / 3600)

class RevenueForecastSerializer(serializers.ModelSerializer):
    accuracy_percentage = serializers.SerializerMethodField()
    variance = serializers.SerializerMethodField()

    class Meta:
        model = RevenueForecast
        fields = '__all__'

    def get_accuracy_percentage(self, obj):
        if not obj.actual_revenue:
            return None
        variance = abs(obj.forecasted_revenue - obj.actual_revenue)
        accuracy = ((obj.forecasted_revenue - variance) / obj.forecasted_revenue) * 100
        return max(0, accuracy)

    def get_variance(self, obj):
        if not obj.actual_revenue:
            return None
        return obj.actual_revenue - obj.forecasted_revenue

class ActivityLogSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    user_full_name = serializers.SerializerMethodField()

    class Meta:
        model = ActivityLog
        fields = ['id', 'user', 'action_type', 'action', 'entity_type', 'entity_id', 'details', 'ip_address', 'timestamp']

    def get_user_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}" if obj.user.first_name else obj.user.username

class AIConversationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = AIConversation
        fields = '__all__'

class CampaignTemplateSerializer(serializers.ModelSerializer):
    """Serializer for Campaign Templates"""
    linkedin_type = serializers.CharField(required=False, allow_blank=True, allow_null=True, read_only=True)
    is_custom = serializers.BooleanField(default=False, read_only=True)
    created_by = serializers.CharField(default='superadmin', read_only=True)

    class Meta:
        model = CampaignTemplate
        fields = ['id', 'name', 'description', 'channel_type', 'target_industry', 
                 'subject_line', 'content', 'cta', 'linkedin_type', 'estimated_open_rate', 
                 'estimated_click_rate', 'is_custom', 'created_by', 'created_at', 'updated_at', 'is_standard_layout']
        extra_kwargs = {
            'linkedin_type': {'required': False, 'read_only': True},
            'is_custom': {'default': False, 'read_only': True},
            'created_by': {'default': 'superadmin', 'read_only': True}
        }

    def to_internal_value(self, data):
        # Remove fields that don't exist in the model or are read-only
        data = data.copy() if hasattr(data, 'copy') else dict(data)
        data.pop('linkedin_type', None)
        data.pop('is_custom', None)
        data.pop('created_by', None)
        return super().to_internal_value(data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Add linkedin_type as None for compatibility with frontend
        data['linkedin_type'] = None
        # Set is_custom based on whether it's a default template or not
        data['is_custom'] = not str(instance.id).startswith(('welcome-series', 'cost-savings', 'linkedin-connection', 'multi-channel-sequence'))
        # Set created_by for display
        data['created_by'] = 'superadmin'
        return data

    def validate_content(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Content cannot be empty.")
        return value

    def validate_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Template name is required.")
        return value.strip()

class ProposalDraftSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProposalDraft
        fields = '__all__'

class AirportCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AirportCode
        fields = ['code', 'name', 'city', 'country_code', 'country']


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['phone', 'department', 'role', 'avatar']


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(required=False)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                 'is_active', 'is_staff', 'is_superuser', 'date_joined', 
                 'last_login', 'groups', 'user_permissions', 'profile', 'full_name']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username

    def create(self, validated_data):
        profile_data = validated_data.pop('profile', {})
        groups_data = validated_data.pop('groups', [])
        user_permissions_data = validated_data.pop('user_permissions', [])
        password = validated_data.pop('password')

        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()

        # Handle many-to-many relationships separately
        if groups_data:
            user.groups.set(groups_data)
        if user_permissions_data:
            user.user_permissions.set(user_permissions_data)

        UserProfile.objects.create(user=user, **profile_data)
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        groups_data = validated_data.pop('groups', None)
        user_permissions_data = validated_data.pop('user_permissions', None)

        # Update user fields (excluding many-to-many fields)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Handle many-to-many relationships separately
        if groups_data is not None:
            instance.groups.set(groups_data)
        if user_permissions_data is not None:
            instance.user_permissions.set(user_permissions_data)

        # Update or create profile
        if profile_data:
            profile, created = UserProfile.objects.get_or_create(user=instance)
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save()

        return instance


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'name', 'content_type', 'codename']


class RoleMenuPermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoleMenuPermission
        fields = ['menu_list']


class RoleSerializer(serializers.ModelSerializer):
    description = serializers.SerializerMethodField(read_only=True)
    allowed_menus = serializers.SerializerMethodField(read_only=True)
    menu_permissions = serializers.ListField(child=serializers.CharField(), required=False, write_only=True)
    role_description = serializers.CharField(required=False, write_only=True)

    class Meta:
        model = Group
        fields = ['id', 'name', 'description', 'allowed_menus', 'menu_permissions', 'role_description']

    def get_description(self, obj):
        try:
            menu_perms = RoleMenuPermission.objects.get(role=obj)
            return menu_perms.description or f"{obj.name} role"
        except RoleMenuPermission.DoesNotExist:
            return f"{obj.name} role"

    def get_allowed_menus(self, obj):
        try:
            menu_perms = RoleMenuPermission.objects.get(role=obj)
            return menu_perms.menu_list
        except RoleMenuPermission.DoesNotExist:
            return []

    def create(self, validated_data):
        from .models import RoleMenuPermission

        # Extract menu permissions and description
        menu_permissions = validated_data.pop('menu_permissions', [])
        role_description = validated_data.pop('role_description', '')

        # Create the group
        group = Group.objects.create(**validated_data)

        # Handle menu permissions and description
        RoleMenuPermission.objects.create(
            role=group,
            menu_list=menu_permissions,
            description=role_description or f"{group.name} role"
        )

        return group

    def update(self, instance, validated_data):
        from .models import RoleMenuPermission

        menu_permissions = validated_data.pop('menu_permissions', None)
        role_description = validated_data.pop('role_description', None)

        # Update group fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update menu permissions and description
        menu_perm, created = RoleMenuPermission.objects.get_or_create(role=instance)
        if menu_permissions is not None:
            menu_perm.menu_list = menu_permissions
        if role_description is not None:
            menu_perm.description = role_description
        menu_perm.save()

        return instance


class CreateUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    profile = UserProfileSerializer(required=False)
    username = serializers.CharField(required=False)  # Make username optional

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 
                 'is_active', 'is_staff', 'groups', 'profile']

    def validate(self, attrs):
        # Ensure username is provided - generate from email if not provided
        if not attrs.get('username') and attrs.get('email'):
            attrs['username'] = attrs['email'].split('@')[0] or f"user_{timezone.now().timestamp()}"
        return attrs

    def create(self, validated_data):
        profile_data = validated_data.pop('profile', {})
        groups_data = validated_data.pop('groups', [])
        password = validated_data.pop('password')

        # Ensure username is set
        if not validated_data.get('username') and validated_data.get('email'):
            validated_data['username'] = validated_data['email'].split('@')[0] or f"user_{timezone.now().timestamp()}"

        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()

        # Handle many-to-many relationships separately
        if groups_data:
            user.groups.set(groups_data)

        UserProfile.objects.create(user=user, **profile_data)
        return user


class EmailTemplateSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()
    company_name = serializers.CharField(source='company.name', read_only=True)
    variable_count = serializers.SerializerMethodField()

    class Meta:
        model = EmailTemplate
        fields = ['id', 'name', 'description', 'template_type', 'subject_line', 
                 'content', 'variables', 'company', 'company_name', 'is_global', 
                 'is_active', 'created_by', 'created_by_name', 'variable_count',
                 'created_at', 'updated_at']
        read_only_fields = ['variables', 'created_by', 'created_at', 'updated_at']

    def get_created_by_name(self, obj):
        if obj.created_by:
            return f"{obj.created_by.first_name} {obj.created_by.last_name}".strip() or obj.created_by.username
        return 'superadmin'

    def get_variable_count(self, obj):
        return len(obj.variables) if obj.variables else 0

    def create(self, validated_data):
        # Set created_by from request context
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['created_by'] = request.user
        return super().create(validated_data)

    def validate_content(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Content cannot be empty.")
        return value

    def validate_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Template name is required.")
        return value.strip()