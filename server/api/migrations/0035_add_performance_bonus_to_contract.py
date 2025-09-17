

# Generated manually to fix missing performance_bonus column

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0034_add_payment_terms_days_to_contract'),
    ]

    operations = [
        migrations.AddField(
            model_name='contract',
            name='performance_bonus',
            field=models.BooleanField(default=False),
        ),
    ]

