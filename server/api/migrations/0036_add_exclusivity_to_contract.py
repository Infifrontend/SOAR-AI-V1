

# Generated manually to fix missing exclusivity column

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0035_add_performance_bonus_to_contract'),
    ]

    operations = [
        migrations.AddField(
            model_name='contract',
            name='exclusivity',
            field=models.BooleanField(default=False),
        ),
    ]

