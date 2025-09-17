
import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'soar_backend.settings')
django.setup()

from api.models import Lead, LeadHistory
from django.db import connection

def debug_lead_history():
    print("=== Lead History Debug ===")
    
    # Check if LeadHistory table exists
    with connection.cursor() as cursor:
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='api_leadhistory';")
        table_exists = cursor.fetchone()
        print(f"LeadHistory table exists: {table_exists is not None}")
        
        if table_exists:
            cursor.execute("SELECT COUNT(*) FROM api_leadhistory;")
            count = cursor.fetchone()[0]
            print(f"Total LeadHistory entries in database: {count}")
            
            # Show some sample data
            cursor.execute("SELECT id, lead_id, history_type, action FROM api_leadhistory LIMIT 5;")
            sample_data = cursor.fetchall()
            print("Sample data:")
            for row in sample_data:
                print(f"  ID: {row[0]}, Lead ID: {row[1]}, Type: {row[2]}, Action: {row[3]}")
    
    # Check leads
    leads = Lead.objects.all()
    print(f"\nTotal leads: {leads.count()}")
    
    for lead in leads:
        print(f"\nLead {lead.id} ({lead.company.name}):")
        
        # Try direct query
        history_count = LeadHistory.objects.filter(lead=lead).count()
        print(f"  History entries (ORM): {history_count}")
        
        # Try raw query
        with connection.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM api_leadhistory WHERE lead_id = ?", [lead.id])
            raw_count = cursor.fetchone()[0]
            print(f"  History entries (Raw): {raw_count}")
        
        if history_count > 0:
            latest_history = LeadHistory.objects.filter(lead=lead).order_by('-timestamp').first()
            print(f"  Latest: {latest_history.action} ({latest_history.timestamp})")

if __name__ == "__main__":
    debug_lead_history()
