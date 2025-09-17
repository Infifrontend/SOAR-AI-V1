

# Generated manually to fix missing custom_clauses column

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0036_add_exclusivity_to_contract'),
    ]

    operations = [
        migrations.AddField(
            model_name='contract',
            name='custom_clauses',
            field=models.TextField(blank=True),
        ),
    ]

