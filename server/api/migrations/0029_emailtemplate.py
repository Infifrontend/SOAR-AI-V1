
# Generated migration for EmailTemplate model

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0028_add_role_menu_permissions'),
    ]

    operations = [
        migrations.CreateModel(
            name='EmailTemplate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True)),
                ('template_type', models.CharField(choices=[('email_campaign', 'Email Campaign'), ('contract', 'Contract'), ('proposal', 'Proposal'), ('newsletter', 'Newsletter'), ('notification', 'Notification')], default='email_campaign', max_length=20)),
                ('subject_line', models.CharField(blank=True, max_length=255)),
                ('content', models.TextField()),
                ('variables', models.JSONField(blank=True, default=list)),
                ('is_global', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('company', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='email_templates', to='api.company')),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.AddIndex(
            model_name='emailtemplate',
            index=models.Index(fields=['template_type', 'is_active'], name='api_emailte_templat_a9b3e4_idx'),
        ),
        migrations.AddIndex(
            model_name='emailtemplate',
            index=models.Index(fields=['company', 'is_active'], name='api_emailte_company_1c5a8f_idx'),
        ),
    ]
