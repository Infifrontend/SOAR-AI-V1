
# Generated migration for adding email_template field to EmailCampaign

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0029_emailtemplate'),
    ]

    operations = [
        migrations.AddField(
            model_name='emailcampaign',
            name='email_template',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.emailtemplate'),
        ),
    ]
