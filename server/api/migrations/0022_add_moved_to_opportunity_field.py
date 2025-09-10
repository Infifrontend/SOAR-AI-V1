
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0021_airportcode'),
    ]

    operations = [
        migrations.AddField(
            model_name='lead',
            name='moved_to_opportunity',
            field=models.BooleanField(default=False),
        ),
    ]
