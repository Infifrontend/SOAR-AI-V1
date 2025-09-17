
# Generated migration for adding sla_requirements field to Contract model

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0032_add_contact_history_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='contract',
            name='sla_requirements',
            field=models.TextField(blank=True),
        ),
    ]
