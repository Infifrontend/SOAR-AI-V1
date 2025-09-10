
#!/usr/bin/env python
import os
import sys
import subprocess
from datetime import datetime

def export_database():
    """Export database schema and data for local setup"""
    
    # Get database URL from environment
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        print("Error: DATABASE_URL environment variable not found")
        return False
    
    # Create timestamp for filename
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    # Export complete dump with schema and data
    complete_file = f"soar_ai_complete_dump_{timestamp}.sql"
    print(f"Exporting complete database to {complete_file}...")
    
    try:
        # Export complete database with options for local compatibility
        complete_cmd = [
            'pg_dump',
            '--no-owner',
            '--no-privileges',
            '--clean',
            '--if-exists',
            '--column-inserts',
            '--verbose',
            database_url
        ]
        
        with open(complete_file, 'w') as f:
            result = subprocess.run(complete_cmd, stdout=f, stderr=subprocess.PIPE, text=True)
            if result.returncode != 0:
                print(f"Error exporting complete database: {result.stderr}")
                return False
        
        print(f"✓ Complete database exported successfully to {complete_file}")
        
        # Create a separate schema-only file
        schema_file = f"soar_ai_schema_only_{timestamp}.sql"
        print(f"Exporting schema only to {schema_file}...")
        
        schema_cmd = [
            'pg_dump',
            '--schema-only',
            '--no-owner',
            '--no-privileges',
            '--clean',
            '--if-exists',
            database_url
        ]
        
        with open(schema_file, 'w') as f:
            result = subprocess.run(schema_cmd, stdout=f, stderr=subprocess.PIPE, text=True)
            if result.returncode != 0:
                print(f"Error exporting schema: {result.stderr}")
                return False
        
        print(f"✓ Schema exported successfully to {schema_file}")
        
        # Create a data-only file
        data_file = f"soar_ai_data_only_{timestamp}.sql"
        print(f"Exporting data only to {data_file}...")
        
        data_cmd = [
            'pg_dump',
            '--data-only',
            '--no-owner',
            '--no-privileges',
            '--column-inserts',
            database_url
        ]
        
        with open(data_file, 'w') as f:
            result = subprocess.run(data_cmd, stdout=f, stderr=subprocess.PIPE, text=True)
            if result.returncode != 0:
                print(f"Error exporting data: {result.stderr}")
                return False
        
        print(f"✓ Data exported successfully to {data_file}")
        
        print("\n" + "="*60)
        print("SOAR AI DATABASE EXPORT COMPLETED")
        print("="*60)
        print(f"Files created:")
        print(f"  - {complete_file} (complete database - RECOMMENDED)")
        print(f"  - {schema_file} (schema only)")
        print(f"  - {data_file} (data only)")
        print("\nTo import in your local PostgreSQL:")
        print(f"  1. Create database: createdb soar_ai_local")
        print(f"  2. Import data: psql -d soar_ai_local < {complete_file}")
        print("\nAlternatively, for Django setup:")
        print("  1. Update your local settings.py with PostgreSQL config")
        print("  2. Run: python manage.py migrate")
        print(f"  3. Import data: psql -d your_local_db < {data_file}")
        
        return True
        
    except Exception as e:
        print(f"Error during export: {str(e)}")
        return False

if __name__ == '__main__':
    if export_database():
        sys.exit(0)
    else:
        sys.exit(1)
