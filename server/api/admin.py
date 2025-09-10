
from django.contrib import admin
from .models import (
    Company, Contact, Lead, Opportunity, Contract, ContractBreach,
    EmailCampaign, TravelOffer, SupportTicket, RevenueForecast, ActivityLog, AIConversation
)

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'industry', 'size', 'location', 'created_at']
    list_filter = ['industry', 'size']
    search_fields = ['name', 'location']

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'email', 'company', 'position']
    list_filter = ['is_decision_maker', 'department']
    search_fields = ['first_name', 'last_name', 'email']

@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ['company', 'contact', 'status', 'source', 'score', 'created_at']
    list_filter = ['status', 'source', 'assigned_to']
    search_fields = ['company__name', 'contact__email']

@admin.register(Opportunity)
class OpportunityAdmin(admin.ModelAdmin):
    list_display = ['name', 'stage', 'probability', 'value', 'estimated_close_date']
    list_filter = ['stage', 'probability']
    search_fields = ['name', 'lead__company__name']

@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ['contract_number', 'title', 'status', 'start_date', 'end_date', 'value']
    list_filter = ['status', 'auto_renewal']
    search_fields = ['contract_number', 'title']

@admin.register(ContractBreach)
class ContractBreachAdmin(admin.ModelAdmin):
    list_display = ['contract', 'breach_type', 'severity', 'detected_date', 'is_resolved']
    list_filter = ['breach_type', 'severity', 'is_resolved']
    search_fields = ['contract__contract_number', 'description']

@admin.register(EmailCampaign)
class EmailCampaignAdmin(admin.ModelAdmin):
    list_display = ['name', 'campaign_type', 'status', 'scheduled_date', 'emails_sent']
    list_filter = ['campaign_type', 'status']
    search_fields = ['name', 'subject_line']

@admin.register(TravelOffer)
class TravelOfferAdmin(admin.ModelAdmin):
    list_display = ['title', 'offer_type', 'status', 'valid_from', 'valid_until', 'discount_percentage']
    list_filter = ['offer_type', 'status']
    search_fields = ['title', 'description']

@admin.register(AIConversation)
class AIConversationAdmin(admin.ModelAdmin):
    list_display = ['user', 'query', 'created_at']
    list_filter = ['user', 'created_at']
    search_fields = ['query', 'response']
    readonly_fields = ['session_id', 'created_at']

@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ['ticket_number', 'subject', 'company', 'priority', 'status', 'created_at']
    list_filter = ['priority', 'status', 'assigned_to']
    search_fields = ['ticket_number', 'subject', 'company__name']

@admin.register(RevenueForecast)
class RevenueForecastAdmin(admin.ModelAdmin):
    list_display = ['period', 'forecasted_revenue', 'actual_revenue', 'confidence_level']
    list_filter = ['confidence_level']
    search_fields = ['period']

@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'action', 'entity_type', 'entity_id', 'timestamp']
    list_filter = ['action', 'entity_type', 'user']
    search_fields = ['action', 'entity_type']
    readonly_fields = ['timestamp']
