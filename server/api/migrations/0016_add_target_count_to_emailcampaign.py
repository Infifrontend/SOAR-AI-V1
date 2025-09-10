
# Generated migration for adding target_count field

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_fix_duplicate_column'),
    ]

    operations = [
        migrations.AddField(
            model_name='emailcampaign',
            name='target_count',
            field=models.IntegerField(default=0),
        ),
    ]
