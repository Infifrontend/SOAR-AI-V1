
#!/usr/bin/env python
import os
import django
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'soar_backend.settings')
django.setup()

from django.db import connection, transaction
from django.core.management import execute_from_command_line

def fix_database():
    """Fix database schema and migration issues"""
    print("🔧 Starting database repair...")
    
    with connection.cursor() as cursor:
        try:
            # Check if django_content_type table exists and has name column
            cursor.execute("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='django_content_type' 
                ORDER BY ordinal_position
            """)
            columns = [row[0] for row in cursor.fetchall()]
            print(f"✓ Current django_content_type columns: {columns}")
            
            # Add missing name column if it doesn't exist
            if 'name' not in columns:
                print("➕ Adding missing 'name' column...")
                cursor.execute('ALTER TABLE django_content_type ADD COLUMN name VARCHAR(100)')
                print("✓ Name column added")
            else:
                print("✓ Name column already exists")
            
            # Clear problematic migration records
            cursor.execute("""
                DELETE FROM django_migrations 
                WHERE (app = 'contenttypes' AND name = '0002_remove_content_type_name') 
                   OR (app = 'auth' AND name IN ('0011_update_proxy_permissions', '0012_alter_user_first_name_max_length'))
                   OR (app = 'api' AND name LIKE '%0026%')
            """)
            print("✓ Cleared problematic migration records")
            
            # Check if RevenueForecast table exists
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_name='api_revenueforecast'
            """)
            table_exists = cursor.fetchone()
            
            if not table_exists:
                print("➕ Creating RevenueForecast table...")
                cursor.execute("""
                    CREATE TABLE api_revenueforecast (
                        id SERIAL PRIMARY KEY,
                        period VARCHAR(20) NOT NULL,
                        quarter INTEGER,
                        year INTEGER NOT NULL,
                        forecasted_revenue DECIMAL(15, 2) NOT NULL,
                        actual_revenue DECIMAL(15, 2),
                        confidence_level DECIMAL(5, 2) DEFAULT 85.0,
                        forecast_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        notes TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                """)
                print("✓ RevenueForecast table created")
            
            print("✅ Database repair completed successfully")
            
        except Exception as e:
            print(f"❌ Error during database repair: {str(e)}")
            raise

if __name__ == "__main__":
    fix_database()
