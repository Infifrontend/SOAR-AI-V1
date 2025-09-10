from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta, date
from decimal import Decimal
import random

from api.models import (
    Company, Contact, Lead, Opportunity, Contract, ContractBreach,
    EmailCampaign, TravelOffer, SupportTicket, RevenueForecast,
    ActivityLog, AIConversation
)

class Command(BaseCommand):
    help = 'Populate database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Starting data population...')

        # Create superuser if it doesn't exist
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
            self.stdout.write('Created admin user')

        # Create comprehensive sample companies
        companies_data = [
            {
                'name': 'TechCorp International',
                'industry': 'technology',
                'size': 'enterprise',
                'location': 'San Francisco, USA',
                'website': 'https://techcorp.com',
                'annual_revenue': Decimal('50000000.00'),
                'employee_count': 2500,
                'travel_budget': Decimal('2500000.00'),
                'description': 'Enterprise Software, Cloud Solutions, AI/ML Services'
            },
            {
                'name': 'Global Manufacturing Ltd',
                'industry': 'manufacturing',
                'size': 'large',
                'location': 'Detroit, USA',
                'website': 'https://globalmanufacturing.com',
                'annual_revenue': Decimal('75000000.00'),
                'employee_count': 5000,
                'travel_budget': Decimal('1800000.00'),
                'description': 'Automotive Parts, Supply Chain, Quality Control'
            },
            {
                'name': 'Sunrise Financial Services',
                'industry': 'finance',
                'size': 'large',
                'location': 'New York, USA',
                'website': 'https://sunrisefinancial.com',
                'annual_revenue': Decimal('120000000.00'),
                'employee_count': 1200,
                'travel_budget': Decimal('3200000.00'),
                'description': 'Investment Banking, Wealth Management, Corporate Finance'
            },
            {
                'name': 'EcoEnergy Solutions',
                'industry': 'energy',
                'size': 'medium',
                'location': 'Austin, USA',
                'website': 'https://ecoenergy.com',
                'annual_revenue': Decimal('25000000.00'),
                'employee_count': 800,
                'travel_budget': Decimal('1200000.00'),
                'description': 'Solar Energy, Wind Power, Sustainability Consulting'
            },
            {
                'name': 'HealthTech Innovations',
                'industry': 'healthcare',
                'size': 'medium',
                'location': 'Boston, USA',
                'website': 'https://healthtech.com',
                'annual_revenue': Decimal('30000000.00'),
                'employee_count': 900,
                'travel_budget': Decimal('1500000.00'),
                'description': 'Medical Devices, Healthcare Software, Telemedicine'
            },
            {
                'name': 'RetailMax Corporation',
                'industry': 'retail',
                'size': 'large',
                'location': 'Chicago, USA',
                'website': 'https://retailmax.com',
                'annual_revenue': Decimal('200000000.00'),
                'employee_count': 15000,
                'travel_budget': Decimal('5000000.00'),
                'description': 'Retail Chain Management, E-commerce, Supply Chain'
            },
            {
                'name': 'ConsultPro Services',
                'industry': 'consulting',
                'size': 'medium',
                'location': 'Washington, DC',
                'website': 'https://consultpro.com',
                'annual_revenue': Decimal('45000000.00'),
                'employee_count': 1500,
                'travel_budget': Decimal('4500000.00'),
                'description': 'Strategy Consulting, Digital Transformation, Change Management'
            },
            {
                'name': 'TeleConnect Systems',
                'industry': 'telecommunications',
                'size': 'large',
                'location': 'Seattle, USA',
                'website': 'https://teleconnect.com',
                'annual_revenue': Decimal('85000000.00'),
                'employee_count': 3500,
                'travel_budget': Decimal('2800000.00'),
                'description': '5G Infrastructure, Network Solutions, IoT Connectivity'
            },
            {
                'name': 'LogisticsPro International',
                'industry': 'transportation',
                'size': 'large',
                'location': 'Memphis, USA',
                'website': 'https://logisticspro.com',
                'annual_revenue': Decimal('95000000.00'),
                'employee_count': 4200,
                'travel_budget': Decimal('3500000.00'),
                'description': 'Global Logistics, Freight Management, Supply Chain Optimization'
            },
            {
                'name': 'EduTech Learning',
                'industry': 'education',
                'size': 'medium',
                'location': 'Cambridge, USA',
                'website': 'https://edutech.com',
                'annual_revenue': Decimal('18000000.00'),
                'employee_count': 600,
                'travel_budget': Decimal('800000.00'),
                'description': 'Online Learning Platforms, Educational Software, Training Solutions'
            },
            {
                'name': 'Innovation Startup Hub',
                'industry': 'technology',
                'size': 'startup',
                'location': 'Palo Alto, USA',
                'website': 'https://innovationstartup.com',
                'annual_revenue': Decimal('2500000.00'),
                'employee_count': 45,
                'travel_budget': Decimal('250000.00'),
                'description': 'AI Startup, Machine Learning, SaaS Products'
            },
            {
                'name': 'GreenCorp Utilities',
                'industry': 'energy',
                'size': 'large',
                'location': 'Portland, USA',
                'website': 'https://greencorp.com',
                'annual_revenue': Decimal('110000000.00'),
                'employee_count': 2800,
                'travel_budget': Decimal('2200000.00'),
                'description': 'Renewable Energy, Smart Grid Technology, Energy Storage'
            }
        ]

        created_count = 0
        for company_data in companies_data:
            company, created = Company.objects.get_or_create(
                name=company_data['name'],
                defaults=company_data
            )
            if created:
                created_count += 1
                self.stdout.write(f'Created company: {company.name}')

        self.stdout.write(
            self.style.SUCCESS(f'Successfully populated database with {created_count} new companies!')
        )