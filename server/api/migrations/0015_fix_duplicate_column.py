
from django.db import migrations, models, connection

def check_column_exists(apps, schema_editor):
    """Check if the column already exists"""
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='api_proposaldraft' 
            AND column_name='attachment_original_name'
        """)
        return cursor.fetchone() is not None

def fix_column_state(apps, schema_editor):
    """Ensure the column exists in the database and Django state is synced"""
    if not check_column_exists(apps, schema_editor):
        # If column doesn't exist, add it
        with connection.cursor() as cursor:
            cursor.execute("""
                ALTER TABLE api_proposaldraft 
                ADD COLUMN attachment_original_name VARCHAR(255) DEFAULT ''
            """)

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_proposaldraft_attachment_original_name_and_more'),
    ]

    operations = [
        migrations.RunPython(fix_column_state, migrations.RunPython.noop),
    ]
