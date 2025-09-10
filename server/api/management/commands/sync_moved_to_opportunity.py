
#!/usr/bin/env python
from django.core.management.base import BaseCommand
from api.models import Lead, Opportunity

class Command(BaseCommand):
    help = 'Sync moved_to_opportunity field with actual opportunities in database'

    def handle(self, *args, **options):
        self.stdout.write("Starting moved_to_opportunity field synchronization...")
        
        # Get all leads
        all_leads = Lead.objects.all()
        updated_count = 0
        
        for lead in all_leads:
            # Check if this lead exists in the opportunity table
            has_opportunity_in_db = Opportunity.objects.filter(lead=lead).exists()
            
            # The moved_to_opportunity field should be True ONLY if lead exists in opportunity table
            # If lead is in opportunity table: moved_to_opportunity = True
            # If lead is NOT in opportunity table: moved_to_opportunity = False
            correct_value = has_opportunity_in_db
            
            # Check if the field value matches the correct database state
            if lead.moved_to_opportunity != correct_value:
                # Update the field to match the correct database state
                lead.moved_to_opportunity = correct_value
                lead.save(update_fields=['moved_to_opportunity'])
                updated_count += 1
                
                status = "moved to opportunity" if correct_value else "not moved to opportunity"
                self.stdout.write(f"Updated lead {lead.id} ({lead.company.name}) - {status}")
        
        # Summary
        total_leads = all_leads.count()
        total_opportunities = Opportunity.objects.count()
        leads_with_flag = Lead.objects.filter(moved_to_opportunity=True).count()
        
        self.stdout.write(f"\n=== SYNCHRONIZATION COMPLETE ===")
        self.stdout.write(f"Total leads: {total_leads}")
        self.stdout.write(f"Total opportunities: {total_opportunities}")
        self.stdout.write(f"Leads with moved_to_opportunity=True: {leads_with_flag}")
        self.stdout.write(f"Updated leads: {updated_count}")
        
        if total_opportunities == leads_with_flag:
            self.stdout.write(self.style.SUCCESS("✅ All data is now synchronized!"))
        else:
            self.stdout.write(self.style.WARNING("⚠️  Data mismatch detected - manual review may be needed"))
        
        # Report any potential issues
        leads_with_flag_but_no_opp = Lead.objects.filter(moved_to_opportunity=True).exclude(
            id__in=Opportunity.objects.values_list('lead_id', flat=True)
        ).count()
        
        opportunities_without_flag = Opportunity.objects.exclude(
            lead__moved_to_opportunity=True
        ).count()
        
        if leads_with_flag_but_no_opp > 0:
            self.stdout.write(self.style.ERROR(f"❌ {leads_with_flag_but_no_opp} leads have moved_to_opportunity=True but no opportunity record"))
        
        if opportunities_without_flag > 0:
            self.stdout.write(self.style.ERROR(f"❌ {opportunities_without_flag} opportunities exist but lead has moved_to_opportunity=False"))
