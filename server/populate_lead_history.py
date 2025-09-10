
#!/usr/bin/env python
import os
import sys
import django
from datetime import datetime, timedelta
from django.utils import timezone

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'soar_backend.settings')
django.setup()

from api.models import Lead, LeadHistory, User
from django.contrib.auth.models import User as AuthUser

def populate_lead_history():
    """Populate LeadHistory table with realistic historical data for existing leads"""
    
    print("Starting lead history population...")
    
    # Get or create a system user for historical entries
    system_user, created = AuthUser.objects.get_or_create(
        username='system',
        defaults={
            'email': 'system@company.com',
            'first_name': 'System',
            'last_name': 'User'
        }
    )
    
    # Get all existing leads
    leads = Lead.objects.all()
    
    if not leads.exists():
        print("No leads found. Please run populate_data command first.")
        return
    
    history_count = 0
    
    for lead in leads:
        print(f"Creating history for lead: {lead.company.name}")
        
        # Clear existing history to avoid duplicates
        LeadHistory.objects.filter(lead=lead).delete()
        
        # Base timestamp - start from lead creation date
        base_time = lead.created_at
        current_time = base_time
        
        # 1. Lead Creation Entry
        LeadHistory.objects.create(
            lead=lead,
            history_type='creation',
            action='Lead created',
            details=f'Lead created from {lead.source} source. Initial contact information collected for {lead.company.name}.',
            icon='plus',
            user=system_user,
            timestamp=current_time
        )
        history_count += 1
        
        # 2. Initial Assignment (if assigned)
        if lead.assigned_to:
            current_time += timedelta(hours=2)
            LeadHistory.objects.create(
                lead=lead,
                history_type='assignment',
                action='Lead assigned',
                details=f'Lead assigned to {lead.assigned_to.first_name} {lead.assigned_to.last_name} for follow-up.',
                icon='user',
                user=system_user,
                timestamp=current_time
            )
            history_count += 1
        
        # 3. Score Update (if score > 0)
        if lead.score > 0:
            current_time += timedelta(hours=6)
            LeadHistory.objects.create(
                lead=lead,
                history_type='score_update',
                action=f'Lead score updated to {lead.score}',
                details=f'Lead score updated to {lead.score} based on engagement metrics and profile analysis.',
                icon='trending-up',
                user=system_user,
                timestamp=current_time
            )
            history_count += 1
        
        # 4. Status-specific history entries
        if lead.status == 'contacted':
            current_time += timedelta(days=1)
            LeadHistory.objects.create(
                lead=lead,
                history_type='contact_made',
                action='Initial contact made',
                details=f'Initial contact made with {lead.contact.first_name}. Outreach sent via email.',
                icon='mail',
                user=lead.assigned_to or system_user,
                timestamp=current_time
            )
            history_count += 1
            
            # Status change entry
            current_time += timedelta(hours=1)
            LeadHistory.objects.create(
                lead=lead,
                history_type='status_change',
                action='Status changed to Contacted',
                details='Lead status updated from new to contacted. Lead is now contacted.',
                icon='mail',
                user=lead.assigned_to or system_user,
                timestamp=current_time
            )
            history_count += 1
        
        elif lead.status == 'qualified':
            # Add progression: contacted -> qualified
            current_time += timedelta(days=1)
            LeadHistory.objects.create(
                lead=lead,
                history_type='contact_made',
                action='Initial contact made',
                details=f'Initial contact made with {lead.contact.first_name}. Outreach sent via email.',
                icon='mail',
                user=lead.assigned_to or system_user,
                timestamp=current_time
            )
            history_count += 1
            
            current_time += timedelta(days=2)
            LeadHistory.objects.create(
                lead=lead,
                history_type='call_made',
                action='Discovery call completed',
                details='Scheduled and completed 30-minute discovery call. Discussed travel requirements and current pain points.',
                icon='phone',
                user=lead.assigned_to or system_user,
                timestamp=current_time
            )
            history_count += 1
            
            current_time += timedelta(hours=2)
            LeadHistory.objects.create(
                lead=lead,
                history_type='qualification',
                action='Lead qualified',
                details=f'Lead qualified based on budget ({lead.estimated_value or "TBD"}), authority, and timeline. Ready for proposal stage.',
                icon='check-circle',
                user=lead.assigned_to or system_user,
                timestamp=current_time
            )
            history_count += 1
            
            # Status change entry
            current_time += timedelta(minutes=30)
            LeadHistory.objects.create(
                lead=lead,
                history_type='status_change',
                action='Status changed to Qualified',
                details='Lead status updated from contacted to qualified. Lead is now qualified.',
                icon='check-circle',
                user=lead.assigned_to or system_user,
                timestamp=current_time
            )
            history_count += 1
        
        elif lead.status == 'unqualified':
            current_time += timedelta(days=1)
            LeadHistory.objects.create(
                lead=lead,
                history_type='contact_made',
                action='Initial contact made',
                details=f'Initial contact made with {lead.contact.first_name}. Outreach sent via email.',
                icon='mail',
                user=lead.assigned_to or system_user,
                timestamp=current_time
            )
            history_count += 1
            
            current_time += timedelta(days=3)
            LeadHistory.objects.create(
                lead=lead,
                history_type='disqualification',
                action='Lead disqualified',
                details='Lead disqualified due to budget constraints or timeline mismatch. Moved to nurture campaign.',
                icon='x-circle',
                user=lead.assigned_to or system_user,
                timestamp=current_time
            )
            history_count += 1
            
            # Status change entry
            current_time += timedelta(minutes=15)
            LeadHistory.objects.create(
                lead=lead,
                history_type='status_change',
                action='Status changed to Unqualified',
                details='Lead status updated from contacted to unqualified. Lead is now unqualified.',
                icon='x-circle',
                user=lead.assigned_to or system_user,
                timestamp=current_time
            )
            history_count += 1
        
        elif lead.status == 'proposal_sent':
            # Add full progression
            current_time += timedelta(days=1)
            LeadHistory.objects.create(
                lead=lead,
                history_type='contact_made',
                action='Initial contact made',
                details=f'Initial contact made with {lead.contact.first_name}. Outreach sent via email.',
                icon='mail',
                user=lead.assigned_to or system_user,
                timestamp=current_time
            )
            history_count += 1
            
            current_time += timedelta(days=2)
            LeadHistory.objects.create(
                lead=lead,
                history_type='qualification',
                action='Lead qualified',
                details='Lead qualified and moved to proposal stage.',
                icon='check-circle',
                user=lead.assigned_to or system_user,
                timestamp=current_time
            )
            history_count += 1
            
            current_time += timedelta(days=3)
            LeadHistory.objects.create(
                lead=lead,
                history_type='proposal_sent',
                action='Proposal sent',
                details='Comprehensive travel management proposal sent to decision maker.',
                icon='file-text',
                user=lead.assigned_to or system_user,
                timestamp=current_time
            )
            history_count += 1
            
            # Status change entry
            current_time += timedelta(minutes=30)
            LeadHistory.objects.create(
                lead=lead,
                history_type='status_change',
                action='Status changed to Proposal Sent',
                details='Lead status updated from qualified to proposal_sent. Lead is now proposal sent.',
                icon='file-text',
                user=lead.assigned_to or system_user,
                timestamp=current_time
            )
            history_count += 1
        
        elif lead.status == 'negotiation':
            # Full progression to negotiation
            current_time += timedelta(days=1)
            LeadHistory.objects.create(
                lead=lead,
                history_type='contact_made',
                action='Initial contact made',
                details=f'Initial contact made with {lead.contact.first_name}. Outreach sent via email.',
                icon='mail',
                user=lead.assigned_to or system_user,
                timestamp=current_time
            )
            history_count += 1
            
            current_time += timedelta(days=2)
            LeadHistory.objects.create(
                lead=lead,
                history_type='qualification',
                action='Lead qualified',
                details='Lead qualified and moved to proposal stage.',
                icon='check-circle',
                user=lead.assigned_to or system_user,
                timestamp=current_time
            )
            history_count += 1
            
            current_time += timedelta(days=3)
            LeadHistory.objects.create(
                lead=lead,
                history_type='proposal_sent',
                action='Proposal sent',
                details='Comprehensive travel management proposal sent to decision maker.',
                icon='file-text',
                user=lead.assigned_to or system_user,
                timestamp=current_time
            )
            history_count += 1
            
            current_time += timedelta(days=5)
            LeadHistory.objects.create(
                lead=lead,
                history_type='negotiation_started',
                action='Negotiation started',
                details='Client responded to proposal. Negotiating terms and pricing.',
                icon='handshake',
                user=lead.assigned_to or system_user,
                timestamp=current_time
            )
            history_count += 1
            
            # Status change entry
            current_time += timedelta(minutes=30)
            LeadHistory.objects.create(
                lead=lead,
                history_type='status_change',
                action='Status changed to In Negotiation',
                details='Lead status updated from proposal_sent to negotiation. Lead is now in negotiation.',
                icon='handshake',
                user=lead.assigned_to or system_user,
                timestamp=current_time
            )
            history_count += 1
        
        elif lead.status == 'won':
            # Complete successful progression
            current_time += timedelta(days=1)
            LeadHistory.objects.create(
                lead=lead,
                history_type='contact_made',
                action='Initial contact made',
                details=f'Initial contact made with {lead.contact.first_name}. Outreach sent via email.',
                icon='mail',
                user=lead.assigned_to or system_user,
                timestamp=current_time
            )
            history_count += 1
            
            current_time += timedelta(days=2)
            LeadHistory.objects.create(
                lead=lead,
                history_type='qualification',
                action='Lead qualified',
                details='Lead qualified and moved to proposal stage.',
                icon='check-circle',
                user=lead.assigned_to or system_user,
                timestamp=current_time
            )
            history_count += 1
            
            current_time += timedelta(days=3)
            LeadHistory.objects.create(
                lead=lead,
                history_type='proposal_sent',
                action='Proposal sent',
                details='Comprehensive travel management proposal sent to decision maker.',
                icon='file-text',
                user=lead.assigned_to or system_user,
                timestamp=current_time
            )
            history_count += 1
            
            current_time += timedelta(days=5)
            LeadHistory.objects.create(
                lead=lead,
                history_type='negotiation_started',
                action='Negotiation completed',
                details='Successfully negotiated terms and pricing.',
                icon='handshake',
                user=lead.assigned_to or system_user,
                timestamp=current_time
            )
            history_count += 1
            
            current_time += timedelta(days=2)
            LeadHistory.objects.create(
                lead=lead,
                history_type='won',
                action='Lead won!',
                details=f'Successfully closed deal! Contract signed for ${lead.estimated_value or "TBD"}.',
                icon='trophy',
                user=lead.assigned_to or system_user,
                timestamp=current_time
            )
            history_count += 1
            
            # Status change entry
            current_time += timedelta(minutes=30)
            LeadHistory.objects.create(
                lead=lead,
                history_type='status_change',
                action='Status changed to Won',
                details='Lead status updated from negotiation to won. Lead is now won.',
                icon='trophy',
                user=lead.assigned_to or system_user,
                timestamp=current_time
            )
            history_count += 1
        
        elif lead.status == 'lost':
            # Progression that didn't convert
            current_time += timedelta(days=1)
            LeadHistory.objects.create(
                lead=lead,
                history_type='contact_made',
                action='Initial contact made',
                details=f'Initial contact made with {lead.contact.first_name}. Outreach sent via email.',
                icon='mail',
                user=lead.assigned_to or system_user,
                timestamp=current_time
            )
            history_count += 1
            
            current_time += timedelta(days=2)
            LeadHistory.objects.create(
                lead=lead,
                history_type='qualification',
                action='Lead qualified',
                details='Lead qualified and moved to proposal stage.',
                icon='check-circle',
                user=lead.assigned_to or system_user,
                timestamp=current_time
            )
            history_count += 1
            
            current_time += timedelta(days=3)
            LeadHistory.objects.create(
                lead=lead,
                history_type='proposal_sent',
                action='Proposal sent',
                details='Comprehensive travel management proposal sent to decision maker.',
                icon='file-text',
                user=lead.assigned_to or system_user,
                timestamp=current_time
            )
            history_count += 1
            
            current_time += timedelta(days=10)
            LeadHistory.objects.create(
                lead=lead,
                history_type='lost',
                action='Lead lost',
                details='Lead chose competitor solution. Opportunity closed as lost.',
                icon='x',
                user=lead.assigned_to or system_user,
                timestamp=current_time
            )
            history_count += 1
            
            # Status change entry
            current_time += timedelta(minutes=30)
            LeadHistory.objects.create(
                lead=lead,
                history_type='status_change',
                action='Status changed to Lost',
                details='Lead status updated from proposal_sent to lost. Lead is now lost.',
                icon='x',
                user=lead.assigned_to or system_user,
                timestamp=current_time
            )
            history_count += 1
        
        # Add some notes-related history for qualified+ leads
        if lead.status in ['qualified', 'proposal_sent', 'negotiation', 'won']:
            current_time += timedelta(days=1, hours=3)
            LeadHistory.objects.create(
                lead=lead,
                history_type='note_added',
                action='Follow-up note added',
                details='Added follow-up notes regarding client requirements and next steps.',
                icon='message-square',
                user=lead.assigned_to or system_user,
                timestamp=current_time
            )
            history_count += 1
    
    print(f"Successfully created {history_count} history entries for {leads.count()} leads!")
    print("Lead history population completed.")

if __name__ == '__main__':
    populate_lead_history()
