from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import (
    CompanyViewSet, ContactViewSet, LeadViewSet, OpportunityViewSet,
    OpportunityActivityViewSet, ContractViewSet, ContractBreachViewSet,
    CampaignTemplateViewSet, EmailCampaignViewSet, TravelOfferViewSet,
    SupportTicketViewSet, RevenueForecastViewSet, LeadNoteViewSet,
    LeadHistoryViewSet, ActivityLogViewSet, AIConversationViewSet,
    ProposalDraftViewSet, AirportCodeViewSet
)

# Define a router for ViewSets
router = DefaultRouter()
router.register(r'companies', CompanyViewSet)
router.register(r'contacts', ContactViewSet)
router.register(r'leads', LeadViewSet)
router.register(r'opportunities', OpportunityViewSet)
router.register(r'opportunity-activities', OpportunityActivityViewSet)
router.register(r'contracts', ContractViewSet)
router.register(r'contract-breaches', ContractBreachViewSet)
router.register(r'campaign-templates', CampaignTemplateViewSet)
router.register(r'campaigns', EmailCampaignViewSet)
router.register(r'email-campaigns', EmailCampaignViewSet)
router.register(r'travel-offers', TravelOfferViewSet)
router.register(r'support-tickets', SupportTicketViewSet)
router.register(r'revenue-forecasts', RevenueForecastViewSet)
router.register(r'activity-logs', ActivityLogViewSet)
router.register(r'ai-conversations', AIConversationViewSet)
router.register(r'lead-notes', LeadNoteViewSet)
router.register(r'lead-history', LeadHistoryViewSet)
router.register(r'proposal-drafts', ProposalDraftViewSet)
router.register(r'airport-codes', AirportCodeViewSet)

# Define URL patterns
urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),

    # Health check endpoint
    path('health/', views.health_check, name='health_check'),  # Use views.health_check directly

    # Custom lead dashboard endpoints
    path('leads/dashboard/stats/', views.lead_dashboard_stats, name='lead_dashboard_stats'),
    path('leads/dashboard/recent-activity/', views.recent_lead_activity, name='recent_activity'),
    path('leads/dashboard/top-qualified/', views.top_qualified_leads, name='top_qualified_leads'),

    # Company bulk operations
    path('companies/upload/', views.CompanyViewSet.as_view({'post': 'upload'}), name='bulk_upload_companies'),
    path('companies/download-sample/', views.CompanyViewSet.as_view({'get': 'download_sample'}), name='download_sample_excel'),

    # SMTP status endpoints - Removed as per instructions
    # path('email-campaigns/smtp-status/', views.check_smtp_status, name='check_smtp_status'),
    # path('email-campaigns/<int:campaign_id>/smtp-status/', views.check_smtp_status, name='check_campaign_smtp_status'),

    # Email campaign performance tracking - Removed as per instructions
    # path('email-campaigns/performance/', views.email_campaign_performance, name='email_campaign_performance'),
    # path('email-campaigns/<int:campaign_id>/track-open/', views.track_email_open, name='track_email_open'),
    # path('email-campaigns/<int:campaign_id>/track-click/', views.track_email_click, name='track_email_click'),

    # Corporate message sending - Removed as per instructions
    # path('leads/send_message/', views.send_corporate_message, name='send_corporate_message'),
    # path('send-corporate-message/', views.send_corporate_message, name='send_corporate_message'),

    # Proposal Draft Management
    path('opportunities/<int:opportunity_id>/proposal-draft/', views.proposal_draft_detail, name='proposal-draft-detail'),
    # path('opportunities/<int:opportunity_id>/proposal-draft/attachment/', views.download_proposal_attachment, name='proposal-draft-attachment'), # Removed as per instructions
    # path('proposal-attachment/<int:opportunity_id>/', views.download_proposal_attachment, name='download_proposal_attachment'), # Removed as per instructions

    # Revenue data upload endpoint
    # Revenue data management
    path('upload-revenue-data/', views.upload_revenue_data, name='upload_revenue_data'),
    path('list-revenue-files/', views.list_revenue_files, name='list_revenue_files'),
    path('delete-revenue-file/<str:filename>/', views.delete_revenue_file, name='delete_revenue_file'),
    path('get-revenue-prediction-data/', views.get_revenue_prediction_data, name='get_revenue_prediction_data'),

    # Generic history endpoint
    path('get-history/', views.get_history, name='get_history'),

    # Send proposal endpoint
    path('opportunities/<int:pk>/send-proposal/', views.OpportunityViewSet.as_view({'post': 'send_proposal'}), name='send_proposal'),
    path('contracts/<str:pk>/download_document/', views.ContractViewSet.as_view({'get': 'download_document'}), name='contract-download-document'),
    path('opportunities/closed-won-opportunities/', views.OpportunityViewSet.as_view({'get': 'closed_won_opportunities'}), name='closed-won-opportunities'),

    # Email tracking endpoints - Removed as per instructions
    # path('email-tracking/open/<uuid:tracking_id>/', views.track_email_open_pixel, name='track_email_open_pixel'),
    # path('email-tracking/click/<uuid:tracking_id>/', views.track_email_click_redirect, name='track_email_click_redirect'),

    # Email campaign real-time stats URLs
    path('email-campaigns/<int:pk>/real_time_stats/', views.EmailCampaignViewSet.as_view({'get': 'real_time_stats'}), name='campaign-real-time-stats'),
    path('email-campaigns/<int:pk>/tracking_details/', views.EmailCampaignViewSet.as_view({'get': 'tracking_details'}), name='campaign-tracking-details'),

    # Email tracking endpoints
    path('track/open/<uuid:tracking_id>/', views.track_email_open, name='track_email_open'),
    path('track/click/<uuid:tracking_id>/', views.track_email_click, name='track_email_click'),

    # SMTP status check
    path('campaigns/smtp-status/', views.check_smtp_status, name='check_smtp_status'),
]