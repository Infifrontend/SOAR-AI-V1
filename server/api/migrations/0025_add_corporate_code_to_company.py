
# Generated migration to add corporate_code field

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0024_add_is_standard_layout_field'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='corporate_code',
            field=models.CharField(blank=True, max_length=10, null=True, unique=True),
        ),
    ]
