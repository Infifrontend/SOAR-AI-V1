
# Generated manually to fix missing sla_requirements column

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
