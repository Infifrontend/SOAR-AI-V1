
import os
import django
from datetime import datetime, timedelta
import re

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'soar_backend.settings')
django.setup()

from django.utils import timezone
from api.models import Lead, LeadHistory

def migrate_agent_assignments():
    """Migrate agent assignment data from lead notes to LeadHistory entries"""
    print("Starting agent assignment migration...")
    
    leads = Lead.objects.all()
    migrated_count = 0
    
    for lead in leads:
        if not lead.notes:
            continue
            
        # Extract agent assignments from notes
        agent_assignments = re.findall(
            r'\[Agent Assignment - ([^\]]+)\]\s*Assigned to: ([^\n]+)\s*Priority: ([^\n]+)(?:\s*Assignment Notes: ([^\n]+))?', 
            lead.notes
        )
        
        if not agent_assignments:
            continue
            
        print(f"Processing lead {lead.id} - {lead.company.name}")
        
        for idx, (date_str, agent_name, priority, assignment_notes) in enumerate(agent_assignments):
            try:
                # Parse the date
                assignment_time = datetime.strptime(date_str, '%Y-%m-%d %H:%M')
                assignment_time = timezone.make_aware(assignment_time)
            except:
                # Fallback to lead creation time + offset
                assignment_time = lead.created_at + timedelta(hours=idx + 1)
            
            # Determine if this is an assignment or reassignment
            history_type = 'agent_reassignment' if idx > 0 else 'agent_assignment'
            previous_agent = agent_assignments[idx-1][1] if idx > 0 else None
            
            # Create action text
            if history_type == 'agent_reassignment':
                action_text = f'Agent reassigned from {previous_agent} to {agent_name}'
                details = f'Lead reassigned from {previous_agent} to {agent_name} with {priority.lower()}.'
            else:
                action_text = f'Agent assigned: {agent_name}'
                details = f'Lead assigned to {agent_name} with {priority.lower()}.'
            
            if assignment_notes:
                details += f' Assignment notes: {assignment_notes}'
            
            # Check if this history entry already exists
            existing_entry = LeadHistory.objects.filter(
                lead=lead,
                history_type=history_type,
                timestamp=assignment_time
            ).first()
            
            if not existing_entry:
                # Create the history entry
                LeadHistory.objects.create(
                    lead=lead,
                    history_type=history_type,
                    action=action_text,
                    details=details,
                    icon='user',
                    metadata={
                        'agent_name': agent_name,
                        'previous_agent': previous_agent,
                        'priority': priority,
                        'assignment_notes': assignment_notes or ''
                    },
                    timestamp=assignment_time
                )
                migrated_count += 1
                print(f"  Created {history_type} entry for {agent_name}")
        
        # Clean up the notes field
        original_notes = lead.notes
        cleaned_notes = re.sub(r'\[Agent Assignment[^\]]*\][^\n]*\n?', '', lead.notes)
        cleaned_notes = cleaned_notes.strip()
        
        if cleaned_notes != original_notes:
            lead.notes = cleaned_notes
            lead.save()
            print(f"  Cleaned up notes for lead {lead.id}")
    
    print(f"Migration completed! Created {migrated_count} new history entries.")

if __name__ == '__main__':
    migrate_agent_assignments()
