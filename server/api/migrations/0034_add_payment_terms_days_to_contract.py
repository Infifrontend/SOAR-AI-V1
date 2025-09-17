
# Generated manually to fix missing payment_terms_days column

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0033_add_sla_requirements_to_contract'),
    ]

    operations = [
        migrations.AddField(
            model_name='contract',
            name='payment_terms_days',
            field=models.IntegerField(default=30),
        ),
    ]
