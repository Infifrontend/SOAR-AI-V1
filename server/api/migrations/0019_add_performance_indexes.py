
# Generated migration for performance optimization

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0018_emailcampaign_target_leads'),
    ]

    operations = [
        migrations.RunSQL(
            "CREATE INDEX IF NOT EXISTS idx_lead_updated_at ON api_lead(updated_at DESC);",
            reverse_sql="DROP INDEX IF EXISTS idx_lead_updated_at;"
        ),
        migrations.RunSQL(
            "CREATE INDEX IF NOT EXISTS idx_lead_status ON api_lead(status);",
            reverse_sql="DROP INDEX IF EXISTS idx_lead_status;"
        ),
        migrations.RunSQL(
            "CREATE INDEX IF NOT EXISTS idx_lead_score ON api_lead(score);",
            reverse_sql="DROP INDEX IF EXISTS idx_lead_score;"
        ),
        migrations.RunSQL(
            "CREATE INDEX IF NOT EXISTS idx_company_industry ON api_company(industry);",
            reverse_sql="DROP INDEX IF EXISTS idx_company_industry;"
        ),
        migrations.RunSQL(
            "CREATE INDEX IF NOT EXISTS idx_company_name ON api_company(name);",
            reverse_sql="DROP INDEX IF EXISTS idx_company_name;"
        ),
        migrations.RunSQL(
            "CREATE INDEX IF NOT EXISTS idx_contact_name ON api_contact(first_name, last_name);",
            reverse_sql="DROP INDEX IF EXISTS idx_contact_name;"
        ),
    ]
