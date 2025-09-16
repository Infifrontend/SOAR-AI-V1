from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from .models import EmailTracking
import urllib.parse
import uuid
import logging
import json

# Import pandas at the top level
try:
    import pandas as pd
    PANDAS_AVAILABLE = True
except ImportError:
    PANDAS_AVAILABLE = False

logger = logging.getLogger(__name__)

from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q, Sum, Count, Avg
from django.utils import timezone
from datetime import datetime, timedelta
from django.contrib.auth.models import User, Group, Permission
from .models import (Company, Contact, Lead, Opportunity, OpportunityActivity,
                     Contract, ContractBreach, CampaignTemplate, EmailCampaign,
                     EmailTemplate, TravelOffer, SupportTicket, RevenueForecast, LeadNote,
                     LeadHistory, ActivityLog, AIConversation, ProposalDraft,
                     AirportCode, UserProfile)
from .serializers import (CompanySerializer, ContactSerializer, LeadSerializer,
                          OpportunitySerializer, OpportunityActivitySerializer,
                          ContractSerializer, ContractBreachSerializer,
                          CampaignTemplateSerializer, EmailCampaignSerializer,
                          EmailTemplateSerializer, TravelOfferSerializer, SupportTicketSerializer,
                          RevenueForecastSerializer, LeadNoteSerializer,
                          LeadHistorySerializer, ActivityLogSerializer,
                          AIConversationSerializer, ProposalDraftSerializer,
                          AirportCodeSerializer, UserSerializer, RoleSerializer,
                          PermissionSerializer, CreateUserSerializer)


# User Management ViewSets
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateUserSerializer
        return UserSerializer

    def update(self, request, *args, **kwargs):
        """Handle user updates with proper username and groups handling"""
        try:
            instance = self.get_object()
            data = request.data.copy()
            
            # Ensure username is provided for updates
            if not data.get('username') and data.get('email'):
                data['username'] = data['email'].split('@')[0] or instance.username
            elif not data.get('username'):
                data['username'] = instance.username
            
            # Handle groups properly - convert selected_role_id to groups array
            if 'selected_role_id' in data and data['selected_role_id']:
                data['groups'] = [data['selected_role_id']]
            elif 'groups' not in data:
                # Preserve existing groups if not specified
                data['groups'] = list(instance.groups.values_list('id', flat=True))
            
            serializer = self.get_serializer(instance, data=data, partial=kwargs.get('partial', False))
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response({
                    'error': 'Validation failed',
                    'details': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'error': f'Update failed: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get current user details"""
        if request.user.is_authenticated:
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        return Response({'error': 'Not authenticated'}, status=401)

    @action(detail=True, methods=['post'])
    def change_password(self, request, pk=None):
        """Change user password"""
        user = self.get_object()
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not user.check_password(old_password):
            return Response({'error': 'Invalid old password'}, status=400)

        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password changed successfully'})

    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        """Toggle user active status"""
        user = self.get_object()
        user.is_active = not user.is_active
        user.save()
        return Response({
            'message': f'User {"activated" if user.is_active else "deactivated"}',
            'is_active': user.is_active
        })


class RoleViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = RoleSerializer

    def create(self, request, *args, **kwargs):
        """Create a new role with proper validation"""
        try:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                role = serializer.save()
                return Response(
                    RoleSerializer(role).data,
                    status=status.HTTP_201_CREATED
                )
            else:
                return Response(
                    {'error': 'Invalid data', 'details': serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            return Response(
                {'error': f'Failed to create role: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def assign_permissions(self, request, pk=None):
        """Assign permissions to role"""
        role = self.get_object()
        permission_ids = request.data.get('permission_ids', [])
        
        permissions = Permission.objects.filter(id__in=permission_ids)
        role.permissions.set(permissions)
        
        serializer = self.get_serializer(role)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def assign_users(self, request, pk=None):
        """Assign users to role"""
        role = self.get_object()
        user_ids = request.data.get('user_ids', [])
        
        users = User.objects.filter(id__in=user_ids)
        role.user_set.set(users)
        
        serializer = self.get_serializer(role)
        return Response(serializer.data)


class PermissionViewSet(viewsets.ModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer

    @action(detail=False, methods=['get'])
    def by_content_type(self, request):
        """Get permissions grouped by content type"""
        content_type = request.query_params.get('content_type')
        if content_type:
            permissions = self.queryset.filter(content_type__model=content_type)
        else:
            permissions = self.queryset.all()
        
        serializer = self.get_serializer(permissions, many=True)
        return Response(serializer.data)


class EmailTemplateViewSet(viewsets.ModelViewSet):
    queryset = EmailTemplate.objects.all()
    serializer_class = EmailTemplateSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_queryset(self):
        queryset = self.queryset.filter(is_active=True)
        
        # Filter by template type
        template_type = self.request.query_params.get('template_type')
        if template_type:
            queryset = queryset.filter(template_type=template_type)
        
        # Filter by company or global templates
        company_id = self.request.query_params.get('company_id')
        if company_id:
            queryset = queryset.filter(
                models.Q(company_id=company_id) | models.Q(is_global=True)
            )
        # If no company filter specified, return all active templates
        # This allows the frontend to see all templates
        
        return queryset.order_by('-created_at')

    @action(detail=True, methods=['post'])
    def preview(self, request, pk=None):
        """Preview template with sample data"""
        template = self.get_object()
        sample_data = request.data.get('sample_data', {})
        
        # Default sample data
        default_data = {
            'company_name': 'Acme Corporation',
            'contact_name': 'John Smith',
            'job_title': 'Travel Manager',
            'industry': 'Technology',
            'employees': '500',
            'travel_budget': '$250,000',
            'annual_revenue': '$50M',
            'location': 'San Francisco, CA',
            'phone': '+1 (555) 123-4567',
            'email': 'john.smith@acme.com',
            'website': 'www.acme.com',
            'sender_name': 'Sarah Johnson',
            'sender_title': 'Sales Representative',
            'sender_company': 'SOAR-AI'
        }
        
        # Merge with provided sample data
        preview_data = {**default_data, **sample_data}
        
        # Render template with sample data
        from django.template import Template, Context
        
        try:
            subject_template = Template(template.subject_line or '')
            content_template = Template(template.content)
            
            rendered_subject = subject_template.render(Context(preview_data))
            rendered_content = content_template.render(Context(preview_data))
            
            return Response({
                'success': True,
                'subject': rendered_subject,
                'content': rendered_content,
                'variables_used': template.variables,
                'sample_data': preview_data
            })
        except Exception as e:
            return Response({
                'success': False,
                'error': f'Template rendering error: {str(e)}'
            }, status=400)

    @action(detail=True, methods=['post'])
    def duplicate(self, request, pk=None):
        """Duplicate a template"""
        original_template = self.get_object()
        
        # Create a copy
        duplicate = EmailTemplate.objects.create(
            name=f"{original_template.name} (Copy)",
            description=original_template.description,
            template_type=original_template.template_type,
            subject_line=original_template.subject_line,
            content=original_template.content,
            company=original_template.company,
            is_global=False,  # Duplicates are not global by default
            created_by=request.user if request.user.is_authenticated else None
        )
        
        serializer = self.get_serializer(duplicate)
        return Response(serializer.data, status=201)

    @action(detail=False, methods=['get'])
    def variables(self, request):
        """Get all available template variables"""
        return Response({
            'available_variables': [
                {'name': 'company_name', 'description': 'Company name'},
                {'name': 'contact_name', 'description': 'Contact person full name'},
                {'name': 'job_title', 'description': 'Contact job title'},
                {'name': 'industry', 'description': 'Company industry'},
                {'name': 'employees', 'description': 'Number of employees'},
                {'name': 'travel_budget', 'description': 'Annual travel budget'},
                {'name': 'annual_revenue', 'description': 'Company annual revenue'},
                {'name': 'location', 'description': 'Company location'},
                {'name': 'phone', 'description': 'Contact phone number'},
                {'name': 'email', 'description': 'Contact email address'},
                {'name': 'website', 'description': 'Company website'},
                {'name': 'sender_name', 'description': 'Sender full name'},
                {'name': 'sender_title', 'description': 'Sender job title'},
                {'name': 'sender_company', 'description': 'Sender company name'}
            ]
        })

    def perform_destroy(self, instance):
        # Soft delete by setting is_active to False
        instance.is_active = False
        instance.save()


# Helper function to create lead history entries
def create_lead_history(lead,
                        history_type,
                        action,
                        details,
                        icon=None,
                        user=None):
    """Creates a LeadHistory entry if the table exists."""
    try:
        from .models import LeadHistory
        LeadHistory.objects.create(lead=lead,
                                   history_type=history_type,
                                   action=action,
                                   details=details,
                                   icon=icon or 'plus',
                                   user=user,
                                   metadata={},
                                   timestamp=timezone.now())
    except Exception as e:
        # Log the error but don't fail the main operation
        print(f"Error creating lead history: {str(e)}")
        pass


@csrf_exempt
def track_email_open(request, tracking_id):
    """Track email opens with a 1x1 pixel"""
    try:
        from .models import EmailTracking
        tracking = get_object_or_404(EmailTracking, tracking_id=tracking_id)
        
        # Update tracking record
        if not tracking.first_opened:
            tracking.first_opened = timezone.now()
        tracking.last_opened = timezone.now()
        tracking.open_count += 1
        tracking.user_agent = request.META.get('HTTP_USER_AGENT', '')
        tracking.ip_address = request.META.get('REMOTE_ADDR')
        tracking.save()

        # Return 1x1 transparent pixel
        from django.http import HttpResponse
        # Create a 1x1 transparent PNG
        pixel_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x01\x03\x00\x00\x00%\xdbV\xca\x00\x00\x00\x03PLTE\x00\x00\x00\xa7z=\xda\x00\x00\x00\x01tRNS\x00@\xe6\xd8f\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xdb\x00\x00\x00\x00IEND\xaeB`\x82'
        response = HttpResponse(pixel_data, content_type='image/png')
        response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response['Pragma'] = 'no-cache'
        response['Expires'] = '0'
        return response
    except Exception as e:
        # Return empty pixel even if tracking fails
        from django.http import HttpResponse
        pixel_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x01\x03\x00\x00\x00%\xdbV\xca\x00\x00\x00\x03PLTE\x00\x00\x00\xa7z=\xda\x00\x00\x00\x01tRNS\x00@\xe6\xd8f\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xdb\x00\x00\x00\x00IEND\xaeB`\x82'
        response = HttpResponse(pixel_data, content_type='image/png')
        return response


@csrf_exempt
def track_email_click(request, tracking_id):
    """Track email clicks and redirect to target URL"""
    try:
        from .models import EmailTracking
        tracking = get_object_or_404(EmailTracking, tracking_id=tracking_id)
        
        # Get target URL from query params
        target_url = request.GET.get('url', 'https://soar-ai.com')
        
        # Decode URL if it's encoded
        import urllib.parse
        target_url = urllib.parse.unquote(target_url)
        
        # Update tracking record
        if not tracking.first_clicked:
            tracking.first_clicked = timezone.now()
        tracking.last_clicked = timezone.now()
        tracking.click_count += 1
        tracking.user_agent = request.META.get('HTTP_USER_AGENT', '')
        tracking.ip_address = request.META.get('REMOTE_ADDR')
        tracking.save()

        # Redirect to target URL
        return HttpResponseRedirect(target_url)
    except Exception as e:
        # Redirect to default URL if tracking fails
        return HttpResponseRedirect('https://soar-ai.com')


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    @csrf_exempt
    @action(detail=False, methods=['post'])
    def search(self, request):
        # Extract filters from request body
        filters = request.data
        query = filters.get('q', '')
        industry = filters.get('industry', '')
        size = filters.get('size', '')
        location = filters.get('location', '')
        travel_budget = filters.get('travelBudget', '')
        travel_frequency = filters.get('travelFrequency', '')
        company_size = filters.get('companySize', '')
        global_search = filters.get('globalSearch',
                                    '')  # Added global search parameter

        # Advanced filters support
        industries = filters.get('industries', [])
        employee_range = filters.get('employeeRange', [])
        revenue_range = filters.get('revenueRange', '')
        credit_rating = filters.get('creditRating', '')
        sustainability_level = filters.get('sustainabilityLevel', '')
        preferred_class = filters.get('preferredClass', '')

        companies = self.queryset.filter(is_active=True)

        # Apply global search filter (company name)
        if global_search:
            companies = companies.filter(name__icontains=global_search)

        if query:
            companies = companies.filter(
                Q(name__icontains=query) | Q(location__icontains=query)
                | Q(description__icontains=query))

        if industry:
            companies = companies.filter(industry=industry)

        if size:
            companies = companies.filter(size=size)

        if location:
            # Handle location filtering with different mapping
            location_mapping = {
                'north-america':
                ['USA', 'United States', 'North America', 'Canada', 'Mexico'],
                'europe': [
                    'Europe', 'UK', 'Germany', 'France', 'Italy', 'Spain',
                    'Netherlands'
                ],
                'asia-pacific': [
                    'Asia', 'Asia-Pacific', 'Japan', 'Singapore', 'Australia',
                    'China', 'India'
                ],
                'global': ['Global', 'Worldwide', 'International'],
                'emerging':
                ['Brazil', 'India', 'South Africa', 'Eastern Europe']
            }

            if location in location_mapping:
                location_filters = Q()
                for loc in location_mapping[location]:
                    location_filters |= Q(location__icontains=loc)
                companies = companies.filter(location_filters)
            else:
                companies = companies.filter(location__icontains=location)

        # Handle travel budget filtering
        if travel_budget:
            budget_ranges = {
                'under-500k': (0, 500000),
                '500k-1m': (500000, 1000000),
                '1m-3m': (1000000, 3000000),
                '3m-5m': (3000000, 5000000),
                'above-5m': (5000000, float('inf'))
            }

            if travel_budget in budget_ranges:
                min_budget, max_budget = budget_ranges[travel_budget]
                if max_budget == float('inf'):
                    companies = companies.filter(travel_budget__gte=min_budget)
                else:
                    companies = companies.filter(travel_budget__gte=min_budget,
                                                 travel_budget__lt=max_budget)

        # Handle company size filtering
        if company_size:
            size_mapping = {
                'startup': ['startup'],
                'small': ['small'],
                'medium': ['medium'],
                'large': ['large'],
                'enterprise': ['enterprise']
            }

            if company_size in size_mapping:
                companies = companies.filter(
                    size__in=size_mapping[company_size])

        # Handle multiple industries filter (advanced filter)
        if industries:
            companies = companies.filter(industry__in=industries)

        # Handle employee range filter (advanced filter)
        if employee_range and len(employee_range) == 2:
            min_employees, max_employees = employee_range
            companies = companies.filter(employee_count__gte=min_employees,
                                         employee_count__lte=max_employees)

        # Handle revenue range filter (advanced filter)
        if revenue_range:
            revenue_ranges = {
                'under-10m': (0, 10000000),
                '10m-50m': (10000000, 50000000),
                '50m-100m': (50000000, 100000000),
                '100m-500m': (100000000, 500000000),
                'above-500m': (500000000, float('inf'))
            }

            if revenue_range in revenue_ranges:
                min_revenue, max_revenue = revenue_ranges[revenue_range]
                if max_revenue == float('inf'):
                    companies = companies.filter(
                        annual_revenue__gte=min_revenue)
                else:
                    companies = companies.filter(
                        annual_revenue__gte=min_revenue,
                        annual_revenue__lt=max_revenue)

        serializer = self.get_serializer(companies, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        stats = {
            'total_companies':
            self.queryset.filter(is_active=True).count(),
            'by_industry':
            dict(
                self.queryset.values_list('industry').annotate(
                    count=Count('id'))),
            'by_size':
            dict(
                self.queryset.values_list('size').annotate(count=Count('id'))),
            'total_revenue':
            self.queryset.aggregate(total=Sum('annual_revenue'))['total'] or 0,
            'total_employees':
            self.queryset.aggregate(total=Sum('employee_count'))['total'] or 0,
        }
        return Response(stats)

    @action(detail=False, methods=['post'])
    def check_leads_status(self, request):
        """Check if companies have been moved to leads"""
        company_names = request.data.get('company_names', [])

        if not company_names:
            return Response({'error': 'No company names provided'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Find companies that exist as leads
        existing_leads = Lead.objects.select_related('company').filter(
            company__name__in=company_names).values_list('company__name',
                                                         flat=True)

        # Create a mapping of company name to lead status
        lead_status = {}
        for name in company_names:
            lead_status[name] = name in existing_leads

        return Response(lead_status)

    @action(detail=True, methods=['post'])
    def mark_as_moved_to_lead(self, request, pk=None):
        """Mark a company as moved to lead"""
        try:
            company = self.get_object()
            company.move_as_lead = True
            company.save()

            return Response({
                'message': f'{company.name} has been marked as moved to lead',
                'move_as_lead': True
            })
        except Exception as e:
            return Response(
                {
                    'error':
                    f'Failed to mark company as moved to lead: {str(e)}'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def upload(self, request):
        """Upload companies from Excel/CSV file"""
        import io

        try:
            # Check if pandas is available
            if not PANDAS_AVAILABLE:
                return Response(
                    {
                        'error':
                        'Pandas library is not installed. Please install it to use file upload functionality.'
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            if 'file' not in request.FILES:
                return Response({'error': 'No file provided'},
                                status=status.HTTP_400_BAD_REQUEST)

            uploaded_file = request.FILES['file']

            # Validate file type
            allowed_extensions = ['.xlsx', '.xls', '.csv']
            file_extension = uploaded_file.name.lower().split('.')[-1]
            if f'.{file_extension}' not in allowed_extensions:
                return Response(
                    {
                        'error':
                        'Invalid file type. Please upload Excel (.xlsx, .xls) or CSV (.csv) files only.'
                    },
                    status=status.HTTP_400_BAD_REQUEST)

            # Validate file size (10MB limit)
            if uploaded_file.size > 10 * 1024 * 1024:
                return Response({'error': 'File size exceeds 10MB limit'},
                                status=status.HTTP_400_BAD_REQUEST)

            # Read the file
            try:
                if file_extension == 'csv':
                    df = pd.read_csv(io.BytesIO(uploaded_file.read()))
                else:
                    # Specify engine explicitly based on file extension
                    if file_extension == 'xlsx':
                        df = pd.read_excel(io.BytesIO(uploaded_file.read()),
                                           engine='openpyxl')
                    elif file_extension == 'xls':
                        df = pd.read_excel(io.BytesIO(uploaded_file.read()),
                                           engine='xlrd')
                    else:
                        # Fallback to openpyxl for unknown Excel formats
                        df = pd.read_excel(io.BytesIO(uploaded_file.read()),
                                           engine='openpyxl')
            except Exception as e:
                return Response({'error': f'Failed to read file: {str(e)}'},
                                status=status.HTTP_400_BAD_REQUEST)

            # Validate required columns
            required_columns = [
                'Company Name', 'Company Type', 'Industry',
                'Number of Employees', 'Location', 'Email'
            ]

            missing_columns = [
                col for col in required_columns if col not in df.columns
            ]
            if missing_columns:
                return Response(
                    {
                        'error':
                        f'Missing required columns: {", ".join(missing_columns)}'
                    },
                    status=status.HTTP_400_BAD_REQUEST)

            # Process the data
            created_count = 0
            skipped_count = 0
            errors = []

            for index, row in df.iterrows():
                try:
                    # Skip rows with empty required fields
                    if pd.isna(row['Company Name']) or not str(
                            row['Company Name']).strip():
                        skipped_count += 1
                        continue

                    company_name = str(row['Company Name']).strip()

                    # Check if company already exists
                    if Company.objects.filter(
                            name__iexact=company_name).exists():
                        skipped_count += 1
                        continue

                    # Map form fields to model fields
                    company_data = {
                        'name':
                        company_name,
                        'industry':
                        self._map_industry(
                            str(row.get('Industry', '')).strip()),
                        'size':
                        self._map_company_size(
                            str(row.get('Company Size Category', '')).strip()),
                        'location':
                        str(row.get('Location', '')).strip(),
                        'email':
                        str(row.get('Email', '')).strip(),
                        'phone':
                        str(row.get('Phone', '')).strip(),
                        'website':
                        str(row.get('Website', '')).strip(),
                        'company_type':
                        self._map_company_type(
                            str(row.get('Company Type', '')).strip()),
                        'year_established':
                        self._safe_int(row.get('Year Established')),
                        'employee_count':
                        self._safe_int(row.get('Number of Employees')),
                        'annual_revenue':
                        self._safe_decimal(
                            row.get('Annual Revenue (Millions)'),
                            multiplier=1000000),
                        'travel_budget':
                        self._safe_decimal(
                            row.get('Annual Travel Budget (Millions)'),
                            multiplier=1000000),
                        'annual_travel_volume':
                        str(row.get('Annual Travel Volume', '')).strip(),
                        'travel_frequency':
                        self._map_travel_frequency(
                            str(row.get('Travel Frequency', '')).strip()),
                        'preferred_class':
                        self._map_preferred_class(
                            str(row.get('Preferred Class', '')).strip()),
                        'credit_rating':
                        self._map_credit_rating(
                            str(row.get('Credit Rating', '')).strip()),
                        'payment_terms':
                        self._map_payment_terms(
                            str(row.get('Payment Terms', '')).strip()),
                        'sustainability_focus':
                        self._map_sustainability(
                            str(row.get('Sustainability Focus', '')).strip()),
                        'risk_level':
                        self._map_risk_level(
                            str(row.get('Risk Level', '')).strip()),
                        'expansion_plans':
                        self._map_expansion_plans(
                            str(row.get('Expansion Plans', '')).strip()),
                        'specialties':
                        str(row.get('Specialties (comma-separated)',
                                    '')).strip(),
                        'technology_integration':
                        str(
                            row.get('Technology Integration (comma-separated)',
                                    '')).strip(),
                        'current_airlines':
                        str(row.get('Current Airlines (comma-separated)',
                                    '')).strip(),
                        'description':
                        str(row.get('Notes', '')).strip(),
                        'is_active':
                        True
                    }

                    # Remove empty strings and None values
                    company_data = {
                        k: v
                        for k, v in company_data.items()
                        if v not in ['', None, 'nan']
                    }

                    # Create the company
                    Company.objects.create(**company_data)
                    created_count += 1

                except Exception as e:
                    errors.append(f'Row {index + 2}: {str(e)}')
                    continue

            response_data = {
                'success': True,
                'message': f'Upload completed successfully',
                'created_count': created_count,
                'skipped_count': skipped_count,
                'total_rows': len(df)
            }

            if errors:
                response_data[
                    'errors'] = errors[:10]  # Limit to first 10 errors
                response_data['total_errors'] = len(errors)

            return Response(response_data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': f'Upload failed: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _map_industry(self, industry):
        """Map industry values to model choices"""
        industry_mapping = {
            'technology': 'technology',
            'tech': 'technology',
            'finance': 'finance',
            'finance & banking': 'finance',
            'banking': 'finance',
            'healthcare': 'healthcare',
            'health': 'healthcare',
            'manufacturing': 'manufacturing',
            'retail': 'retail',
            'consulting': 'consulting',
            'telecommunications': 'telecommunications',
            'telecom': 'telecommunications',
            'energy': 'energy',
            'energy & utilities': 'energy',
            'utilities': 'energy',
            'transportation': 'transportation',
            'education': 'education',
            'government': 'government',
            'other': 'other'
        }
        return industry_mapping.get(industry.lower(), 'other')

    def _map_company_size(self, size):
        """Map company size values to model choices"""
        size_mapping = {
            'startup': 'startup',
            'startup (1-50)': 'startup',
            'small': 'small',
            'small (51-200)': 'small',
            'medium': 'medium',
            'medium (201-1000)': 'medium',
            'large': 'large',
            'large (1001-5000)': 'large',
            'enterprise': 'enterprise',
            'enterprise (5000+)': 'enterprise'
        }
        return size_mapping.get(size.lower(), 'medium')

    def _map_company_type(self, company_type):
        """Map company type values to model choices"""
        type_mapping = {
            'corporation': 'corporation',
            'llc': 'llc',
            'partnership': 'partnership',
            'nonprofit': 'nonprofit',
            'non-profit': 'nonprofit'
        }
        return type_mapping.get(company_type.lower(), 'corporation')

    def _map_travel_frequency(self, frequency):
        """Map travel frequency values to model choices"""
        frequency_mapping = {
            'daily': 'Daily',
            'weekly': 'Weekly',
            'monthly': 'Monthly',
            'quarterly': 'Quarterly',
            'bi-weekly': 'Bi-weekly'
        }
        return frequency_mapping.get(frequency.lower(), '')

    def _map_preferred_class(self, pref_class):
        """Map preferred class values to model choices"""
        class_mapping = {
            'economy': 'Economy',
            'economy plus': 'Economy Plus',
            'business': 'Business',
            'first': 'First',
            'first class': 'First',
            'business/first': 'Business/First'
        }
        return class_mapping.get(pref_class.lower(), '')

    def _map_credit_rating(self, rating):
        """Map credit rating values to model choices"""
        rating_mapping = {
            'aaa': 'AAA',
            'aa': 'AA',
            'a': 'A',
            'bbb': 'BBB',
            'bb': 'BB'
        }
        return rating_mapping.get(rating.lower(), '')

    def _map_payment_terms(self, terms):
        """Map payment terms values to model choices"""
        terms_mapping = {
            'net 15': 'Net 15',
            'net 30': 'Net 30',
            'net 45': 'Net 45',
            'net 60': 'Net 60'
        }
        return terms_mapping.get(terms.lower(), '')

    def _map_sustainability(self, sustainability):
        """Map sustainability values to model choices"""
        sustainability_mapping = {
            'very high': 'Very High',
            'high': 'High',
            'medium': 'Medium',
            'low': 'Low'
        }
        return sustainability_mapping.get(sustainability.lower(), '')

    def _map_risk_level(self, risk):
        """Map risk level values to model choices"""
        risk_mapping = {
            'very low': 'Very Low',
            'low': 'Low',
            'medium': 'Medium',
            'high': 'High'
        }
        return risk_mapping.get(risk.lower(), '')

    def _map_expansion_plans(self, plans):
        """Map expansion plans values to model choices"""
        plans_mapping = {
            'aggressive': 'Aggressive',
            'moderate': 'Moderate',
            'conservative': 'Conservative',
            'rapid': 'Rapid',
            'stable': 'Stable'
        }
        return plans_mapping.get(plans.lower(), '')

    def _safe_int(self, value):
        """Safely convert value to integer"""
        if pd.isna(value) or value == '':
            return None
        try:
            return int(float(value))
        except (ValueError, TypeError):
            return None

    def _safe_decimal(self, value, multiplier=1):
        """Safely convert value to decimal with optional multiplier"""
        if pd.isna(value) or value == '':
            return None
        try:
            return float(value) * multiplier
        except (ValueError, TypeError):
            return None

    @action(detail=False, methods=['get'], url_path='download-sample')
    def download_sample(self, request):
        """Download sample Excel template for company upload"""
        from django.http import HttpResponse
        import io

        try:
            # Check if pandas is available
            if not PANDAS_AVAILABLE:
                return Response(
                    {
                        'error':
                        'Pandas library is not installed. Please install it to use file download functionality.'
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            # Create sample data with all required columns
            sample_data = {
                'Company Name': [
                    'TechCorp Solutions', 'Global Manufacturing Inc',
                    'Healthcare Plus'
                ],
                'Industry': ['Technology', 'Manufacturing', 'Healthcare'],
                'Company Size Category': [
                    'Large (1001-5000)', 'Enterprise (5000+)',
                    'Medium (201-1000)'
                ],
                'Location': ['San Francisco, CA', 'Chicago, IL', 'Boston, MA'],
                'Email': [
                    'contact@techcorp.com', 'info@globalmanufacturing.com',
                    'admin@healthcareplus.com'
                ],
                'Phone': [
                    '+1 (555) 123-4567', '+1 (555) 987-6543',
                    '+1 (555) 456-7890'
                ],
                'Website': [
                    'www.techcorp.com', 'www.globalmanufacturing.com',
                    'www.healthcareplus.com'
                ],
                'Company Type': ['Corporation', 'Corporation', 'Corporation'],
                'Year Established': [2010, 1995, 2005],
                'Number of Employees': [2500, 8000, 750],
                'Annual Revenue (Millions)': [150, 500, 80],
                'Annual Travel Budget (Millions)': [5, 15, 3],
                'Annual Travel Volume':
                ['500+ trips/year', '1000+ trips/year', '200+ trips/year'],
                'Travel Frequency': ['Weekly', 'Daily', 'Monthly'],
                'Preferred Class': ['Business', 'Economy Plus', 'Economy'],
                'Credit Rating': ['AAA', 'AA', 'A'],
                'Payment Terms': ['Net 30', 'Net 15', 'Net 45'],
                'Sustainability Focus': ['High', 'Very High', 'Medium'],
                'Risk Level': ['Low', 'Very Low', 'Medium'],
                'Expansion Plans': ['Aggressive', 'Moderate', 'Conservative'],
                'Specialties (comma-separated)': [
                    'Software Development, Cloud Services',
                    'Heavy Machinery, Industrial Equipment',
                    'Medical Devices, Telemedicine'
                ],
                'Technology Integration (comma-separated)': [
                    'API Integration, Mobile Apps', 'IoT, Automation Systems',
                    'EMR Systems, Patient Portals'
                ],
                'Current Airlines (comma-separated)': [
                    'Delta, United, American', 'Southwest, JetBlue',
                    'Alaska, Spirit'
                ],
                'Notes': [
                    'High-growth tech company looking for corporate travel solutions',
                    'Large manufacturing company with global operations',
                    'Healthcare provider expanding regionally'
                ]
            }

            # Create DataFrame
            df = pd.DataFrame(sample_data)

            # Create Excel file in memory
            output = io.BytesIO()
            with pd.ExcelWriter(output, engine='openpyxl') as writer:
                df.to_excel(writer, sheet_name='Companies', index=False)

                # Get the workbook and worksheet
                workbook = writer.book
                worksheet = writer.sheets['Companies']

                # Auto-adjust column widths
                for column in worksheet.columns:
                    max_length = 0
                    column_letter = column[0].column_letter
                    for cell in column:
                        try:
                            if len(str(cell.value)) > max_length:
                                max_length = len(str(cell.value))
                        except:
                            pass
                    adjusted_width = min(max_length + 2, 50)
                    worksheet.column_dimensions[
                        column_letter].width = adjusted_width

            output.seek(0)

            # Create HTTP response
            response = HttpResponse(
                output.getvalue(),
                content_type=
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            response[
                'Content-Disposition'] = 'attachment; filename="corporate_data_sample_template.xlsx"'

            return response

        except Exception as e:
            return Response(
                {'error': f'Failed to generate sample file: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

    @action(detail=False, methods=['get'])
    def decision_makers(self, request):
        contacts = self.queryset.filter(is_decision_maker=True)
        serializer = self.get_serializer(contacts, many=True)
        return Response(serializer.data)


class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.select_related('company', 'contact',
                                           'assigned_to').all()
    serializer_class = LeadSerializer

    def create(self, request, *args, **kwargs):
        data = request.data

        # Extract company and contact data
        company_data = data.get('company', {})
        contact_data = data.get('contact', {})

        try:
            # Create or get company
            company, created = Company.objects.get_or_create(
                name=company_data.get('name'),
                defaults={
                    'industry': company_data.get('industry', ''),
                    'location': company_data.get('location', ''),
                    'size': company_data.get('size', ''),
                    'annual_revenue': company_data.get('annual_revenue'),
                    'travel_budget': company_data.get('travel_budget'),
                    'is_active': True
                })

            # Create contact
            contact = Contact.objects.create(
                company=company,
                first_name=contact_data.get('first_name'),
                last_name=contact_data.get('last_name'),
                email=contact_data.get('email'),
                phone=contact_data.get('phone', ''),
                position=contact_data.get('position', ''),
                is_decision_maker=contact_data.get('is_decision_maker', False))

            # Create the lead
            lead = Lead.objects.create(
                company=company,
                contact=contact,
                status=data.get('status', 'new'),
                source=data.get('source'),
                priority=data.get('priority', 'medium'),
                score=data.get('score', 0),
                estimated_value=data.get('estimated_value'),
                notes=data.get('notes', ''),
                next_action=data.get('next_action', ''),
                next_action_date=data.get('next_action_date'))

            # Mark company as moved to lead
            company.move_as_lead = True
            company.save()

            # Create initial history entry
            create_lead_history(
                lead=lead,
                history_type='creation',
                action='Lead created',
                details=
                f"Lead created from {lead.source}. Initial contact information collected for {lead.company.name}.",
                icon='plus',
                user=self.request.user
                if self.request.user.is_authenticated else None)

            # Serialize and return the created lead
            serializer = self.get_serializer(lead)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)},
                            status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        """Create lead and initial history entry"""
        lead = serializer.save()

        # Create initial history entry
        try:
            LeadHistory.objects.create(
                lead=lead,
                history_type='creation',
                action='Lead created',
                details=
                f'Lead created from {lead.source} source. Initial contact information collected for {lead.company.name}.',
                icon='plus',
                user=self.request.user
                if self.request.user.is_authenticated else None)
        except Exception as e:
            print(f"Error creating initial lead history: {e}")

    def get_queryset(self):
        queryset = self.queryset
        status = self.request.query_params.get('status', None)
        industry = self.request.query_params.get('industry', None)
        score = self.request.query_params.get('score', None)
        search = self.request.query_params.get('search', None)

        if status and status != 'all':
            queryset = queryset.filter(status=status)

        if industry and industry != 'all':
            queryset = queryset.filter(company__industry=industry)

        if score and score != 'all':
            if score == 'high':
                queryset = queryset.filter(score__gte=70)
            elif score == 'medium':
                queryset = queryset.filter(score__gte=40, score__lt=70)
            elif score == 'low':
                queryset = queryset.filter(score__lt=40)

        if search:
            queryset = queryset.filter(
                Q(company__name__icontains=search)
                | Q(contact__first_name__icontains=search)
                | Q(contact__last_name__icontains=search)
                | Q(contact__email__icontains=search))

        return queryset.order_by('-created_at')

    @action(detail=False, methods=['get'])
    def pipeline_stats(self, request):
        stats = {}
        total_leads = self.queryset.count()

        for status, status_label in Lead.LEAD_STATUS_CHOICES:
            count = self.queryset.filter(status=status).count()
            stats[status] = {
                'count': count,
                'label': status_label,
                'percentage':
                (count / total_leads * 100) if total_leads > 0 else 0
            }

        stats['summary'] = {
            'total_leads':
            total_leads,
            'qualified_leads':
            self.queryset.filter(status='qualified').count(),
            'unqualified_leads':
            self.queryset.filter(status='unqualified').count(),
            'active_leads':
            self.queryset.filter(
                status__in=['new', 'contacted', 'qualified']).count(),
            'conversion_rate':
            (self.queryset.filter(status='won').count() /
             max(Lead.objects.count(), 1)) if total_leads > 0 else 0
        }

        return Response(stats)

    @action(detail=False, methods=['post'])
    def search(self, request):
        """
        Optimized POST endpoint for searching leads with filters, notes and campaign counts
        """
        try:
            filters = request.data if hasattr(request, 'data') else {}

            search_term = filters.get('search', '')
            status_filter = filters.get('status', '')
            industry_filter = filters.get('industry', '')
            score = filters.get('score', '')
            engagement = filters.get('engagement', '')

            # Limit results for better performance
            limit = min(int(filters.get('limit', 50)), 100)  # Max 100 records

            # Start with optimized queryset with prefetch for notes and campaigns
            leads = Lead.objects.select_related(
                'company', 'contact').prefetch_related(
                    'lead_notes', 'emailcampaign_set').only(
                        'id', 'status', 'source', 'priority', 'score',
                        'estimated_value', 'notes', 'next_action',
                        'next_action_date', 'created_at', 'updated_at',
                        'assigned_agent', 'company__id', 'company__name',
                        'company__industry', 'company__location',
                        'company__size', 'company__employee_count',
                        'contact__id', 'contact__first_name',
                        'contact__last_name', 'contact__email',
                        'contact__phone', 'contact__position')

            # Apply filters efficiently
            if status_filter and status_filter != 'all':
                leads = leads.filter(status=status_filter)
            if industry_filter and industry_filter != 'all':
                leads = leads.filter(company__industry=industry_filter)

            if search_term:
                leads = leads.filter(
                    Q(company__name__icontains=search_term)
                    | Q(contact__first_name__icontains=search_term)
                    | Q(contact__last_name__icontains=search_term))

            # Combine score and engagement filters (they're the same logic)
            score_filter = score or engagement
            if score_filter and score_filter != 'all':
                if score_filter in ['high', 'High']:
                    leads = leads.filter(score__gte=80)
                elif score_filter in ['medium', 'Medium']:
                    leads = leads.filter(score__gte=60, score__lt=80)
                elif score_filter in ['low', 'Low']:
                    leads = leads.filter(score__lt=60)

            # Order and limit for performance
            leads = leads.order_by('-updated_at', '-created_at')[:limit]

            # Build response data with notes and campaign counts
            results = []
            for lead in leads:
                # Get notes count efficiently (already prefetched)
                notes_count = lead.lead_notes.count()

                # Get campaign count efficiently (already prefetched)
                campaign_count = lead.emailcampaign_set.count()

                # Get recent notes for display (limit to 3 most recent)
                recent_notes = lead.lead_notes.all()[:3]

                # Check if lead has been moved to opportunity by checking the actual opportunity table
                # Use the database state as the source of truth without updating during search
                has_opportunity_in_db = Opportunity.objects.filter(
                    lead=lead).exists()

                # Use the database state directly - don't update during search to prevent race conditions
                has_opportunity = has_opportunity_in_db

                lead_data = {
                    'id':
                    lead.id,
                    'status':
                    lead.status,
                    'source':
                    lead.source,
                    'priority':
                    lead.priority,
                    'score':
                    lead.score,
                    'estimated_value':
                    lead.estimated_value,
                    'notes':
                    lead.notes,
                    'next_action':
                    lead.next_action,
                    'next_action_date':
                    lead.next_action_date,
                    'created_at':
                    lead.created_at,
                    'updated_at':
                    lead.updated_at,
                    'assigned_to':
                    lead.assigned_agent,
                    'has_opportunity':
                    has_opportunity,
                    'company': {
                        'id': lead.company.id,
                        'name': lead.company.name,
                        'industry': lead.company.industry,
                        'location': lead.company.location,
                        'size': lead.company.size,
                        'employee_count': lead.company.employee_count
                    },
                    'contact': {
                        'id': lead.contact.id,
                        'first_name': lead.contact.first_name,
                        'last_name': lead.contact.last_name,
                        'email': lead.contact.email,
                        'phone': lead.contact.phone,
                        'position': lead.contact.position
                    },
                    'notes_count':
                    notes_count,
                    'campaign_count':
                    campaign_count,
                    'leadNotes': [{
                        'id':
                        note.id,
                        'note':
                        note.note,
                        'next_action':
                        note.next_action,
                        'urgency':
                        note.urgency,
                        'created_at':
                        note.created_at.isoformat()
                        if note.created_at else None,
                        'created_by':
                        note.created_by.username if note.created_by else None
                    } for note in recent_notes]
                }
                print(lead_data),
                results.append(lead_data)

            return Response({
                'results': results,
                'count': len(results),
                'limit': limit
            })

        except Exception as e:
            print(f"Error in leads search: {str(e)}")
            return Response(
                {
                    'error': f'Search failed: {str(e)}',
                    'results': [],
                    'count': 0
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def qualified_leads(self, request):
        leads = self.queryset.filter(status='qualified').order_by(
            '-score', '-created_at')
        serializer = self.get_serializer(leads, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def batch_notes_and_campaigns(self, request):
        """
        Get notes and campaign counts for multiple leads efficiently
        """
        try:
            lead_ids = request.data.get('lead_ids', [])

            if not lead_ids:
                return Response({'error': 'lead_ids array is required'},
                                status=status.HTTP_400_BAD_REQUEST)

            # Fetch leads with prefetched notes and campaigns
            leads = Lead.objects.filter(id__in=lead_ids).prefetch_related(
                'lead_notes',
                'emailcampaign_set').select_related('company', 'contact')

            batch_data = {}

            for lead in leads:
                # Get notes count and recent notes
                notes_count = lead.lead_notes.count()
                recent_notes = lead.lead_notes.all()[:5]  # Get 5 most recent

                # Get campaign count
                campaign_count = lead.emailcampaign_set.count()

                batch_data[str(lead.id)] = {
                    'notes_count':
                    notes_count,
                    'campaign_count':
                    campaign_count,
                    'recent_notes': [{
                        'id':
                        note.id,
                        'note':
                        note.note,
                        'urgency':
                        note.urgency,
                        'created_at':
                        note.created_at.isoformat()
                        if note.created_at else None
                    } for note in recent_notes]
                }

            return Response({
                'success': True,
                'data': batch_data,
                'processed_count': len(batch_data)
            })

        except Exception as e:
            return Response({'error': f'Batch operation failed: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def unqualified_leads(self, request):
        leads = self.queryset.filter(
            status='unqualified').order_by('-created_at')
        serializer = self.get_serializer(leads, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def update_score(self, request, pk=None):
        lead = self.get_object()
        score = request.data.get('score', 0)
        old_score = lead.score
        lead.score = score
        lead.save()

        # Create history entry for score update
        create_lead_history(
            lead=lead,
            history_type='score_update',
            action=f'Lead score updated to {lead.score}',
            details=
            f'Lead score updated from {old_score} to {lead.score} based on engagement metrics and profile analysis.',
            icon='trending-up',
            user=request.user if request.user.is_authenticated else None)

        return Response({'status': 'score updated', 'new_score': lead.score})

    @action(detail=True, methods=['post'])
    def qualify(self, request, pk=None):
        try:
            lead = self.get_object()
            old_status = lead.status
            lead.status = 'qualified'
            lead.save()

            # Create history entry for qualification
            try:
                from .models import LeadHistory
                LeadHistory.objects.create(
                    lead=lead,
                    history_type='qualification',
                    action='Lead qualified',
                    details=self._get_status_change_details(
                        old_status, lead.status, lead),
                    icon=self._get_status_icon(lead.status),
                    user=request.user
                    if request.user.is_authenticated else None,
                    metadata={},
                    timestamp=timezone.now())
            except Exception as history_error:
                print(f"Error creating qualification history: {history_error}")

            return Response({'status': 'lead qualified'})
        except Exception as e:
            return Response({'error': str(e)},
                            status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def disqualify(self, request, pk=None):
        try:
            lead = self.get_object()

            # Handle different request data formats
            if hasattr(request, 'data') and request.data:
                if isinstance(request.data, dict):
                    reason = request.data.get('reason', '')
                    created_by = request.data.get('created_by', '')
                else:
                    # If request.data is a string, try to extract reason
                    reason = str(request.data) if request.data else ''
                    created_by = ''
            else:
                reason = ''
                created_by = ''

            old_status = lead.status

            lead.status = 'unqualified'
            # Append disqualification reason to notes
            timestamp = timezone.now().strftime('%Y-%m-%d %H:%M')
            disqualify_note = f"[{timestamp}] Disqualified: {reason}" if reason else f"[{timestamp}] Disqualified"

            if lead.notes:
                lead.notes = f"{lead.notes}\n\n{disqualify_note}"
            else:
                lead.notes = disqualify_note

            lead.save()

            # Create history entry for disqualification
            create_lead_history(
                lead=lead,
                history_type='disqualification',
                action='Lead disqualified',
                details=f'Lead disqualified. Reason: {reason}'
                if reason else 'Lead disqualified.',
                icon='x-circle',
                user=request.user if request.user.is_authenticated else None)

            # Create history entry for status change
            create_lead_history(
                lead=lead,
                history_type='status_change',
                action=f'Status changed from {old_status} to {lead.status}',
                details=self._get_status_change_details(
                    old_status, lead.status, lead),
                icon=self._get_status_icon(lead.status),
                user=request.user if request.user.is_authenticated else None)

            return Response({'message': 'Lead disqualified successfully'},
                            status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Disqualify error: {str(e)}")
            print(f"Request data: {request.data}")
            print(f"Request data type: {type(request.data)}")
            return Response({'error': str(e)},
                            status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def notes(self, request, pk=None):
        """
        Get all notes for a specific lead with count
        """
        try:
            lead = self.get_object()
            notes = lead.lead_notes.all().order_by('-created_at')
            serializer = LeadNoteSerializer(notes, many=True)
            return Response(
                {
                    'notes': serializer.data,
                    'count': notes.count(),
                    'lead_id': lead.id
                },
                status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': f'Failed to fetch notes: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get'])
    def campaign_count(self, request, pk=None):
        """
        Get campaign count for a specific lead
        """
        try:
            lead = self.get_object()
            campaign_count = lead.emailcampaign_set.count()
            return Response(
                {
                    'lead_id': lead.id,
                    'campaign_count': campaign_count
                },
                status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': f'Failed to fetch campaign count: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get'])
    def campaigns(self, request, pk=None):
        """
        Get all campaigns for a specific lead
        """
        try:
            lead = self.get_object()
            campaigns = lead.emailcampaign_set.all().order_by('-created_at')
            campaigns_data = []

            for campaign in campaigns:
                campaigns_data.append({
                    'id':
                    campaign.id,
                    'name':
                    campaign.name,
                    'status':
                    campaign.status,
                    'subject_line':
                    campaign.subject_line,
                    'emails_sent':
                    campaign.emails_sent,
                    'emails_opened':
                    campaign.emails_opened,
                    'open_rate':
                    campaign.open_rate,
                    'created_at':
                    campaign.created_at.isoformat()
                    if campaign.created_at else None
                })

            return Response(
                {
                    'campaigns': campaigns_data,
                    'count': len(campaigns_data),
                    'lead_id': lead.id
                },
                status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': f'Failed to fetch campaigns: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'])
    def add_note(self, request, pk=None):
        """
        Add a note to a lead
        """
        lead = self.get_object()
        note_text = request.data.get('note', '')
        next_action = request.data.get('nextAction', '')
        urgency = request.data.get('urgency', 'Medium')

        if not note_text:
            return Response({'error': 'Note text is required'},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            # Create the note
            note = LeadNote.objects.create(lead=lead,
                                           note=note_text,
                                           next_action=next_action,
                                           urgency=urgency)

            # Update lead's next action if provided
            if next_action:
                lead.next_action = next_action
                lead.save()

            # Create history entry
            create_lead_history(
                lead=lead,
                history_type='note_added',
                action=
                f'Note added: {note_text[:50]}{"..." if len(note_text) > 50 else ""}',
                details=
                f'Note: {note_text}\nNext Action: {next_action}\nUrgency: {urgency}',
                user=request.user if request.user.is_authenticated else None,
                icon='message-square')

            # Serialize the note and updated lead
            note_serializer = LeadNoteSerializer(note)
            lead_serializer = LeadSerializer(lead)

            return Response(
                {
                    'message': 'Note added successfully',
                    'note': note_serializer.data,
                    'lead': lead_serializer.data
                },
                status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': f'Failed to add note: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, *args, **kwargs):
        """Handle opportunity updates with proper validation"""
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance,
                                             data=request.data,
                                             partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                print(f"Validation errors: {serializer.errors}")
                return Response(
                    {
                        'error': 'Validation failed',
                        'details': serializer.errors
                    },
                    status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Error updating opportunity: {str(e)}")
            return Response({'error': f'Update failed: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _get_status_change_details(self, old_status, new_status, lead):
        """Get detailed description for status changes"""
        details_map = {
            'contacted':
            f'Initial contact made with {lead.contact.first_name}. Outreach sent via email.',
            'responded':
            f'{lead.contact.first_name} responded to initial outreach. Expressed interest in travel solutions.',
            'qualified':
            f'Lead qualified based on budget ({f"${int(lead.estimated_value/1000)}K" if lead.estimated_value else "TBD"}), authority, and timeline. Ready for proposal stage.',
            'unqualified':
            'Lead disqualified due to budget constraints or timeline mismatch. Moved to nurture campaign.',
            'proposal_sent':
            'Proposal sent to prospect. Awaiting response and feedback.',
            'negotiation':
            'Entered negotiation phase. Discussing terms and pricing.',
            'won': 'Lead successfully converted to customer. Deal closed!',
            'lost': 'Lead was lost to competitor or decided not to proceed.'
        }
        return details_map.get(
            new_status, f'Status updated from {old_status} to {new_status}.')

    def _get_status_icon(self, status):
        """Get appropriate icon for status"""
        icon_map = {
            'contacted': 'mail',
            'responded': 'message-circle',
            'qualified': 'check-circle',
            'unqualified': 'x-circle',
            'proposal_sent': 'file-text',
            'negotiation': 'handshake',
            'won': 'trophy',
            'lost': 'x'
        }
        return icon_map.get(status, 'plus')

    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        """Get history for a specific lead"""
        try:
            lead = self.get_object()
            history_entries = lead.history_entries.all().order_by('timestamp')

            # If no history entries exist, create comprehensive history
            if not history_entries.exists():
                try:
                    current_time = lead.created_at

                    # 1. Lead creation
                    LeadHistory.objects.create(
                        lead=lead,
                        history_type='creation',
                        action='Lead created',
                        details=
                        f'Lead created from {lead.source} source. Initial contact information collected for {lead.company.name}.',
                        icon='plus',
                        user=None,
                        timestamp=current_time)

                    # 2. Parse agent assignments from notes if they exist
                    if lead.notes and '[Agent Assignment' in lead.notes:
                        import re
                        # Extract agent assignments from notes
                        agent_assignments = re.findall(
                            r'\[Agent Assignment - ([^\]]+)\]\s*Assigned to: ([^\n]+)\s*Priority: ([^\n]+)(?:\s*Assignment Notes: ([^\n]+))?',
                            lead.notes)

                        for idx, (date_str, agent_name, priority,
                                  assignment_notes
                                  ) in enumerate(agent_assignments):
                            try:
                                # Parse the date
                                import datetime
                                assignment_time = datetime.strptime(
                                    date_str, '%Y-%m-%d %H:%M')
                                assignment_time = timezone.make_aware(
                                    assignment_time)
                            except:
                                assignment_time = current_time + timedelta(
                                    hours=idx + 1)

                            history_type = 'agent_reassignment' if idx > 0 else 'agent_assignment'
                            action = f'Agent {"reassigned" if idx > 0 else "assigned"} to {agent_name}'
                            details = f'Lead {"reassigned" if idx > 0 else "assigned"} to {agent_name} with {priority.lower()}.'
                            if assignment_notes:
                                details += f' Assignment notes: {assignment_notes}'

                            LeadHistory.objects.create(
                                lead=lead,
                                history_type=history_type,
                                action=action,
                                details=details,
                                icon='user',
                                user=lead.assigned_to,
                                timestamp=assignment_time)

                    # 3. Agent assignment (if assigned and not already processed from notes)
                    elif lead.assigned_agent or lead.assigned_to:
                        current_time += timedelta(hours=1)
                        agent_name = lead.assigned_agent or (
                            f"{lead.assigned_to.first_name} {lead.assigned_to.last_name}"
                            .strip() if lead.assigned_to else "Unknown Agent")
                        LeadHistory.objects.create(
                            lead=lead,
                            history_type='agent_assignment',
                            action=f'Lead assigned to {agent_name}',
                            details=
                            f'Lead assigned to {agent_name} for follow-up and qualification.',
                            icon='user',
                            user=lead.assigned_to,
                            timestamp=current_time)

                    # 4. Status-specific entries
                    if lead.status == 'contacted':
                        current_time += timedelta(hours=2)
                        LeadHistory.objects.create(
                            lead=lead,
                            history_type='contact_made',
                            action='Initial contact made',
                            details=
                            f'Initial contact made with {lead.contact.first_name}. Email sent introducing our travel solutions.',
                            icon='mail',
                            user=lead.assigned_to,
                            timestamp=current_time)

                        # Add call entry
                        current_time += timedelta(hours=3)
                        LeadHistory.objects.create(
                            lead=lead,
                            history_type='call_made',
                            action='Discovery call completed',
                            details=
                            f'30-minute discovery call with {lead.contact.first_name}. Discussed travel requirements and current pain points.',
                            icon='phone',
                            user=lead.assigned_to,
                            timestamp=current_time)

                    elif lead.status == 'qualified':
                        current_time += timedelta(days=1)
                        LeadHistory.objects.create(
                            lead=lead,
                            history_type='qualification',
                            action='Lead qualified',
                            details=
                            f'Lead qualified based on budget ({f"${int(lead.estimated_value/1000)}K" if lead.estimated_value else "TBD"}), authority, and timeline. Ready for proposal stage.',
                            icon='check-circle',
                            user=lead.assigned_to,
                            timestamp=current_time)

                    elif lead.status == 'unqualified':
                        current_time += timedelta(days=1)
                        LeadHistory.objects.create(
                            lead=lead,
                            history_type='disqualification',
                            action='Lead disqualified',
                            details=
                            'Lead disqualified due to budget constraints or timeline mismatch. Moved to nurture campaign.',
                            icon='x-circle',
                            user=lead.assigned_to,
                            timestamp=current_time)

                    # 5. Add notes from lead_notes (excluding agent assignment entries)
                    for note in lead.lead_notes.all()[:3]:  # Latest 3 notes
                        current_time += timedelta(hours=1)
                        LeadHistory.objects.create(
                            lead=lead,
                            history_type='note_added',
                            action=f'Note added: "{note.note[:30]}..."',
                            details=
                            f'Note: {note.note}. Next action: {note.next_action or "None"}. Urgency: {note.urgency or "Medium"}.',
                            icon='message-square',
                            user=note.created_by,
                            timestamp=current_time)

                    # 6. Score update (if score > 50)
                    if lead.score > 50:
                        current_time += timedelta(hours=1)
                        LeadHistory.objects.create(
                            lead=lead,
                            history_type='score_update',
                            action=f'Lead score updated to {lead.score}',
                            details=
                            f'Lead score updated to {lead.score} based on engagement metrics and profile analysis.',
                            icon='trending-up',
                            user=None,
                            timestamp=current_time)

                    # Fetch again after creation
                    history_entries = lead.history_entries.all().order_by(
                        'timestamp')
                except Exception as create_error:
                    print(f"Error creating initial history: {create_error}")

            serializer = LeadHistorySerializer(history_entries, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"History fetch error: {e}")
            # If LeadHistory table doesn't exist, return empty list
            return Response([])

    @action(detail=True, methods=['post'])
    def move_to_opportunity(self, request, pk=None):
        """Move a qualified lead to opportunities"""
        try:
            lead = self.get_object()

            # Check if lead is qualified
            if lead.status != 'qualified':
                return Response(
                    {
                        'error':
                        'Only qualified leads can be moved to opportunities'
                    },
                    status=status.HTTP_400_BAD_REQUEST)

            # Check if lead has already been moved to opportunity
            if Opportunity.objects.filter(lead=lead).exists():
                return Response(
                    {
                        'error':
                        'This lead has already been moved to opportunities'
                    },
                    status=status.HTTP_400_BAD_REQUEST)

            from django.db import transaction
            try:
                with transaction.atomic():
                    # Lock the lead record
                    locked_lead = Lead.objects.select_for_update().get(
                        id=lead.id)

                    # Final check inside transaction
                    if Opportunity.objects.filter(lead=locked_lead).exists():
                        return Response(
                            {
                                'error':
                                'This lead has already been moved to opportunities'
                            },
                            status=status.HTTP_400_BAD_REQUEST)

                    # Get opportunity data
                    opportunity_data = request.data

                    # Validate and process value
                    try:
                        opp_value = opportunity_data.get(
                            'value', locked_lead.estimated_value or 250000)
                        if isinstance(opp_value, str):
                            import re
                            opp_value = re.sub(r'[^\d.]', '', str(opp_value))
                            opp_value = float(
                                opp_value) if opp_value else 250000
                    except (ValueError, TypeError):
                        opp_value = 250000

                    # ✅ Handle estimated_close_date safely
                    est_close_raw = opportunity_data.get(
                        'estimated_close_date',
                        (timezone.now().date() + timedelta(days=30)))

                    if isinstance(est_close_raw, str):
                        try:
                            # Try YYYY-MM-DD first
                            est_close_date = datetime.strptime(
                                est_close_raw, "%Y-%m-%d").date()
                        except ValueError:
                            try:
                                # Try DD-MM-YYYY if first fails
                                est_close_date = datetime.strptime(
                                    est_close_raw, "%d-%m-%Y").date()
                            except ValueError:
                                # Fallback: 30 days from now
                                est_close_date = timezone.now().date(
                                ) + timedelta(days=30)
                    else:
                        est_close_date = est_close_raw

                    # Create the opportunity
                    opportunity = Opportunity.objects.create(
                        lead=locked_lead,
                        name=opportunity_data.get(
                            'name',
                            f"{locked_lead.company.name} - Corporate Travel Solution"
                        ),
                        stage=opportunity_data.get('stage', 'discovery'),
                        probability=int(opportunity_data.get(
                            'probability', 65)),
                        estimated_close_date=est_close_date,
                        value=opp_value,
                        description=opportunity_data.get(
                            'description',
                            f"Opportunity created from qualified lead. {locked_lead.notes or 'No additional notes.'}"
                        ),
                        next_steps=opportunity_data.get(
                            'next_steps',
                            'Send initial proposal and schedule presentation'))

                    # Update lead
                    locked_lead.moved_to_opportunity = True
                    timestamp = timezone.now().strftime('%Y-%m-%d %H:%M')
                    move_note = f"[{timestamp}] Lead moved to opportunities - {opportunity.name}"

                    if locked_lead.notes:
                        locked_lead.notes = f"{locked_lead.notes}\n\n{move_note}"
                    else:
                        locked_lead.notes = move_note

                    locked_lead.save()

                    # Create history entry
                    try:
                        from .models import LeadHistory
                        LeadHistory.objects.create(
                            lead=locked_lead,
                            history_type='opportunity_created',
                            action='Lead moved to opportunity',
                            details=
                            (f'Lead successfully moved to sales opportunity: '
                             f'{opportunity.name}. Deal value: ${opp_value:,.0f}. '
                             'Lead remains in leads table for tracking.'),
                            icon='briefcase',
                            user=request.user
                            if request.user.is_authenticated else None,
                            timestamp=timezone.now())
                    except Exception as history_error:
                        print(f"Error creating lead history: {history_error}")
                        # Continue even if history creation fails

            except Exception as e:
                print(f"Error in transaction: {str(e)}")
                return Response(
                    {'error': f'Failed to create opportunity: {str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Serialize and return
            opportunity_serializer = OpportunitySerializer(opportunity)
            return Response(
                {
                    'success': True,
                    'message':
                    f'{lead.company.name} has been successfully moved to opportunities',
                    'opportunity': opportunity_serializer.data,
                    'lead_id': lead.id,
                    'has_opportunity': True
                },
                status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Error in move_to_opportunity: {str(e)}")
            return Response(
                {'error': f'Failed to move lead to opportunity: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def create_lead_from_company(self, request):
        """Create a lead from corporate search data"""
        try:
            data = request.data
            company_data = data.get('company', {})
            # print("Company data:", company_data)

            # Extract company information - prioritize top-level name if company.name is missing
            company_name = company_data.get('name') or data.get('name')
            if not company_name:
                return Response({'error': 'Company name is required'},
                                status=status.HTTP_400_BAD_REQUEST)

            company_data_to_save = {
                'name': company_name,
                'industry': company_data.get('industry', 'other'),
                'location': company_data.get('location', ''),
                'size': company_data.get('size', 'medium'),
                'annual_revenue': company_data.get('annual_revenue'),
                'travel_budget': company_data.get('travel_budget'),
                'employee_count': company_data.get('employee_count'),
                'email': company_data.get('email', ''),
                'phone': company_data.get('phone', ''),
                'description': data.get('notes', '')
            }

            # print("Company data to save:", company_data_to_save)

            # Create or get company
            company, created = Company.objects.get_or_create(
                name=company_name, defaults=company_data_to_save)

            # Ensure company has email before binding
            if not company.email and company_data.get('email'):
                company.email = company_data.get('email')
                company.save()

            # Create default contact
            # print("Creating contact for company:", company)
            contact, contact_created = Contact.objects.get_or_create(
                company=company,
                # email=company_data.get('email', f"contact@{company_name.lower().replace(' ', '')}.com"),
                defaults={
                    'first_name':
                    company_name.split(' ')[0],
                    'last_name':
                    company_name.split(' ')[-1]
                    if len(company_name.split(' ')) > 1 else '',
                    'phone':
                    company_data.get('phone', ''),
                    'email':
                    company.email,
                    'position':
                    'Decision Maker',
                    'is_decision_maker':
                    True
                })
            # print("Contact created:", contact)

            # Create the lead
            lead = Lead.objects.create(
                company=company,
                contact=contact,
                status='new',
                source='manual_entry',
                priority='medium',
                score=50,  # Default score
                estimated_value=company_data_to_save.get('travel_budget'),
                notes=
                f"Lead created from company entry. {data.get('notes', '')}",
                next_action='Initial outreach and qualification')

            # Create initial history entry
            create_lead_history(
                lead=lead,
                history_type='lead_created',
                action='Lead created from company data',
                details=
                f"Lead created from manual company entry. Company: {company.name}. Initial contact information collected.",
                icon='plus',
                user=request.user if request.user.is_authenticated else None)

            # Serialize and return the created lead
            serializer = LeadSerializer(lead)
            return Response(
                {
                    'lead':
                    serializer.data,
                    'message':
                    f'{company.name} has been successfully added as a lead'
                },
                status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)},
                            status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def assign_agent(self, request, pk=None):
        """Assign or reassign an agent to a lead"""
        try:
            lead = self.get_object()
            # Handle both 'agent_name' and 'agent' field names for compatibility
            agent_name = request.data.get('agent_name') or request.data.get(
                'agent')
            priority = request.data.get('priority', 'Medium Priority')
            assignment_notes = request.data.get('notes', '')

            if not agent_name:
                return Response(
                    {
                        'error':
                        'Agent name is required (use agent_name or agent field)'
                    },
                    status=status.HTTP_400_BAD_REQUEST)

            # Store previous agent for history
            previous_agent = lead.assigned_agent

            # Update lead with assignment info
            lead.assigned_agent = agent_name

            # Update priority based on assignment priority
            priority_mapping = {
                'Low Priority': 'low',
                'Medium Priority': 'medium',
                'High Priority': 'high',
                'Urgent': 'urgent'
            }
            lead.priority = priority_mapping.get(priority, 'medium')
            lead.save()

            # Create history entry for agent assignment
            if previous_agent and previous_agent != agent_name:
                history_type = 'agent_reassignment'
                action_text = f'Agent reassigned from {previous_agent} to {agent_name}'
                details = f'Lead reassigned from {previous_agent} to {agent_name} with {priority.lower()}.'
            else:
                history_type = 'agent_assignment'
                action_text = f'Agent assigned: {agent_name}'
                details = f'Lead assigned to {agent_name} with {priority.lower()}.'

            if assignment_notes:
                details += f' Assignment notes: {assignment_notes}'

            # Create the history entry with agent metadata
            try:
                from .models import LeadHistory
                LeadHistory.objects.create(
                    lead=lead,
                    history_type=history_type,
                    action=action_text,
                    details=details,
                    icon='user',
                    metadata={
                        'agent_name': agent_name,
                        'previous_agent': previous_agent,
                        'priority': priority,
                        'assignment_notes': assignment_notes
                    },
                    user=request.user
                    if request.user.is_authenticated else None)
            except Exception as e:
                print(f"Error creating lead history: {e}")

            # Clean up old assignment notes from the lead notes field
            if lead.notes:
                import re
                # Remove old agent assignment entries from notes
                lead.notes = re.sub(r'\[Agent Assignment[^\]]*\][^\n]*\n?', '',
                                    lead.notes)
                lead.save()

            # Return updated lead
            serializer = LeadSerializer(lead)
            return Response(
                {
                    'message': f'Lead successfully assigned to {agent_name}',
                    'lead': serializer.data
                },
                status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': f'Failed to assign agent: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        """Send email with proper HTML rendering using standard templates"""
        try:
            lead = self.get_object()
            subject = request.data.get("subject", "")
            message = request.data.get("message", "")
            recipient_email = request.data.get("recipient_email") or getattr(
                lead.contact, "email", None)
            recipient_name = request.data.get("recipient_name", "")
            contact_type = request.data.get("contact_type", "lead")
            template_used = request.data.get("template_used", "")

            if not subject or not message:
                return Response({"error": "Subject and message are required"},
                                status=400)

            if not recipient_email:
                return Response({"error": "No recipient email found"},
                                status=400)

            # Always use standard template layout design like test_email
            from django.utils.html import strip_tags
            from django.core.mail import send_mail
            from django.conf import settings
            from .email_template_service import EmailTemplateService

            # Check if message is already complete HTML (standard template)
            is_complete_html = message.strip().startswith(
                '<!DOCTYPE') or message.strip().startswith('<html')

            if is_complete_html:
                # Message is already complete HTML (from standard template)
                html_message = message
                plain_text_message = strip_tags(message)
                print(
                    f"Using pre-formatted standard template: {template_used}")
            else:
                # Apply standard SOAR-AI template layout using EmailTemplateService
                html_message, plain_text_message = EmailTemplateService.get_standard_template(
                    subject=subject,
                    content=message,
                    recipient_name=recipient_name or "Valued Partner",
                    template_type="lead")

            # Use simple send_mail with html_message parameter for proper HTML rendering
            send_mail(
                subject=subject,
                message=plain_text_message,  # Plain text version
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[recipient_email],
                html_message=html_message,  # HTML version
                fail_silently=False,
            )

            return Response({
                "success": True,
                "message":
                f"Email sent to {recipient_email} using standard SOAR-AI template",
                "subject": subject,
                "recipient": recipient_email,
                "recipient_name": recipient_name,
                "contact_type": contact_type,
                "template_used": "Standard SOAR-AI Template",
                "method": "Email"
            })

        except Exception as e:
            return Response({"error": f"Failed to send email: {str(e)}"},
                            status=500)

    @action(detail=False, methods=['post'], url_path='send_message')
    def send_corporate_message(self, request):
        """Send message to corporate contacts (general endpoint for non-lead contacts)"""
        try:
            contact_type = request.data.get('contact_type', '')

            if contact_type != 'corporate':
                return Response(
                    {
                        "error":
                        "Invalid contact type or missing required parameters"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            recipient_email = request.data.get('recipient_email', '')
            recipient_name = request.data.get('recipient_name', '')
            method = request.data.get('method', 'Email')
            subject = request.data.get('subject', '')
            message = request.data.get('message', '')  # expected full HTML

            if not recipient_email or not subject or not message:
                return Response(
                    {
                        "error":
                        "Recipient email, subject and message are required"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if method == 'Email':
                from django.core.mail import send_mail
                from django.conf import settings
                from django.utils.html import strip_tags
                from .email_template_service import EmailTemplateService

                try:
                    # Check if message is already complete HTML (standard template)
                    is_complete_html = message.strip().startswith(
                        '<!DOCTYPE') or message.strip().startswith('<html')

                    if is_complete_html:
                        # Message is already complete HTML (from standard template)
                        html_content = message
                        plain_text_message = strip_tags(message)
                    else:
                        # Apply standard SOAR-AI template layout like test_email
                        html_content, plain_text_message = EmailTemplateService.get_standard_template(
                            subject=subject,
                            content=message,
                            recipient_name=recipient_name or "Valued Partner",
                            template_type="corporate")

                    # Use simple send_mail with html_message parameter for proper HTML rendering
                    send_mail(
                        subject=subject,
                        message=plain_text_message,  # Plain text version
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[recipient_email],
                        html_message=html_content,  # HTML version
                        fail_silently=False,
                    )

                    return Response(
                        {
                            "success":
                            True,
                            "message":
                            f"Email sent successfully to {recipient_name} ({recipient_email})",
                        },
                        status=status.HTTP_200_OK,
                    )

                except Exception as email_error:
                    return Response(
                        {
                            "success": False,
                            "error":
                            f"Failed to send email: {str(email_error)}"
                        },
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )

            else:
                # For non-email channels (SMS, WhatsApp, etc.), just log success
                return Response(
                    {
                        "success":
                        True,
                        "message":
                        f"{method} message logged successfully for {recipient_name}",
                    },
                    status=status.HTTP_200_OK,
                )

        except Exception as e:
            return Response(
                {"error": f"Failed to send message: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class OpportunityViewSet(viewsets.ModelViewSet):
    queryset = Opportunity.objects.prefetch_related('activities').all()
    serializer_class = OpportunitySerializer

    def update(self, request, *args, **kwargs):
        """Handle opportunity updates with proper validation"""
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance,
                                             data=request.data,
                                             partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                print(f"Validation errors: {serializer.errors}")
                return Response(
                    {
                        'error': 'Validation failed',
                        'details': serializer.errors
                    },
                    status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Error updating opportunity: {str(e)}")
            return Response({'error': f'Update failed: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'])
    def add_activity(self, request, pk=None):
        """Add activity to opportunity"""
        try:
            opportunity = self.get_object()

            activity_data = {
                'opportunity': opportunity.id,
                'type': request.data.get('type', 'call'),
                'description': request.data.get('description', ''),
                'date': request.data.get('date',
                                         timezone.now().date()),
            }

            activity_serializer = OpportunityActivitySerializer(
                data=activity_data)
            if activity_serializer.is_valid():
                # Save with user information
                activity = activity_serializer.save(
                    created_by=request.user if request.user.
                    is_authenticated else None)

                # Return the activity with updated serializer data including user info
                response_data = OpportunityActivitySerializer(activity).data

                return Response(
                    {
                        'message': f'Activity added to {opportunity.name}',
                        'activity': response_data
                    },
                    status=status.HTTP_201_CREATED)
            else:
                return Response(
                    {
                        'error': 'Invalid activity data',
                        'details': activity_serializer.errors
                    },
                    status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print(f"Error adding activity: {str(e)}")
            return Response({'error': f'Failed to add activity: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get'])
    def activities(self, request, pk=None):
        """Get all activities for opportunity"""
        try:
            opportunity = self.get_object()
            activities = opportunity.activities.all()
            serializer = OpportunityActivitySerializer(activities, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': f'Failed to fetch activities: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        """Get comprehensive history for opportunity including lead history"""
        try:
            opportunity = self.get_object()

            # Get opportunity activities
            activities = opportunity.activities.all().order_by('-created_at')
            history_items = []

            # Format activities as history items
            for activity in activities:
                try:
                    # Handle created_by user safely
                    user_name = 'System'
                    if activity.created_by:
                        user_name = f"{activity.created_by.first_name} {activity.created_by.last_name}".strip(
                        )
                        if not user_name:
                            user_name = activity.created_by.username

                    # Format timestamp safely
                    formatted_timestamp = 'Recently'
                    if activity.created_at:
                        try:
                            formatted_timestamp = activity.created_at.strftime(
                                '%B %d, %Y at %I:%M %p')
                        except:
                            formatted_timestamp = str(activity.created_at)

                    history_items.append({
                        'id':
                        f"opportunity_activity_{activity.id}",
                        'history_type':
                        activity.type,
                        'action':
                        activity.type.replace('_', ' ').title(),
                        'details':
                        activity.description,
                        'icon':
                        'activity',
                        'timestamp':
                        activity.created_at.isoformat()
                        if activity.created_at else '',
                        'user_name':
                        user_name,
                        'user_role':
                        'Sales Representative',
                        'formatted_timestamp':
                        formatted_timestamp,
                        'metadata': {
                            'activity_type': activity.type,
                            'activity_date': str(activity.date)
                        }
                    })
                except Exception as activity_error:
                    print(
                        f"Error processing activity {activity.id}: {activity_error}"
                    )
                    continue

            # If opportunity is linked to a lead, get lead history
            if hasattr(opportunity, 'lead') and opportunity.lead:
                try:
                    lead_history = LeadHistory.objects.filter(
                        lead=opportunity.lead).order_by('-timestamp')
                    for history in lead_history:
                        try:
                            # Handle user safely
                            user_name = 'System'
                            user_role = 'System'
                            if history.user:
                                user_name = f"{history.user.first_name} {history.user.last_name}".strip(
                                )
                                if not user_name:
                                    user_name = history.user.username
                                user_role = 'Sales Manager' if history.user.is_staff else 'Sales Representative'

                            # Handle metadata safely
                            metadata = {}
                            if hasattr(history,
                                       'metadata') and history.metadata:
                                metadata = history.metadata

                            # Format timestamp
                            formatted_timestamp = 'Recently'
                            if history.timestamp:
                                try:
                                    formatted_timestamp = history.timestamp.strftime(
                                        '%B %d, %Y at %I:%M %p')
                                except:
                                    formatted_timestamp = str(
                                        history.timestamp)

                            history_items.append({
                                'id':
                                f"lead_history_{history.id}",
                                'history_type':
                                history.history_type,
                                'action':
                                history.action,
                                'details':
                                history.details,
                                'icon':
                                history.icon,
                                'timestamp':
                                history.timestamp.isoformat()
                                if history.timestamp else '',
                                'user_name':
                                user_name,
                                'user_role':
                                user_role,
                                'formatted_timestamp':
                                formatted_timestamp,
                                'metadata':
                                metadata
                            })
                        except Exception as history_error:
                            print(
                                f"Error processing lead history {history.id}: {history_error}"
                            )
                            continue
                except Exception as lead_history_error:
                    print(f"Error fetching lead history: {lead_history_error}")

            # Sort by timestamp (newest first)
            history_items.sort(key=lambda x: x['timestamp']
                               if x['timestamp'] else '',
                               reverse=True)

            return Response(history_items)

        except Exception as e:
            print(f"Error in opportunity history endpoint: {str(e)}")
            return Response(
                {
                    'error': f'Failed to fetch opportunity history: {str(e)}',
                    'history': []
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def pipeline_value(self, request):
        pipeline = {}
        total_value = 0
        total_weighted_value = 0

        for stage, stage_label in Opportunity.OPPORTUNITY_STAGES:
            opportunities = self.queryset.filter(stage=stage)
            stage_value = sum(float(opp.value) for opp in opportunities)
            weighted_value = sum(
                float(opp.value) * (opp.probability / 100)
                for opp in opportunities)

            pipeline[stage] = {
                'count': opportunities.count(),
                'label': stage_label,
                'total_value': stage_value,
                'weighted_value': weighted_value
            }

            total_value += stage_value
            total_weighted_value += weighted_value

        pipeline['summary'] = {
            'total_opportunities':
            self.queryset.count(),
            'total_value':
            total_value,
            'total_weighted_value':
            total_weighted_value,
            'average_deal_size':
            total_value /
            self.queryset.count() if self.queryset.count() > 0 else 0
        }

        return Response(pipeline)

    @action(detail=False, methods=['get'])
    def closing_soon(self, request):
        days = int(request.query_params.get('days', 30))
        end_date = timezone.now().date() + timedelta(days=days)

        opportunities = self.queryset.filter(
            estimated_close_date__lte=end_date,
            stage__in=['proposal',
                       'negotiation']).order_by('estimated_close_date')

        serializer = self.get_serializer(opportunities, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def send_proposal(self, request, pk=None):
        """Send proposal email for opportunity"""
        try:
            opportunity = self.get_object()

            subject = request.data.get(
                'subject',
                f'Travel Solutions Proposal - {opportunity.lead.company.name if opportunity.lead else "Opportunity"}'
            )
            email_content = request.data.get('email_content', '')
            delivery_method = request.data.get('delivery_method', 'email')
            validity_period = request.data.get('validity_period', '30')
            special_terms = request.data.get('special_terms', '')

            if not email_content:
                return Response({'error': 'Email content is required'},
                                status=status.HTTP_400_BAD_REQUEST)

            # Get recipient email from opportunity's lead contact
            if not opportunity.lead or not opportunity.lead.contact or not opportunity.lead.contact.email:
                return Response(
                    {
                        'error':
                        'No valid email address found for this opportunity'
                    },
                    status=status.HTTP_400_BAD_REQUEST)

            recipient_email = opportunity.lead.contact.email

            # Send email via SMTP if delivery method is email
            if delivery_method == 'email':
                from django.core.mail import send_mail
                from django.conf import settings
                from django.utils.html import strip_tags

                try:
                    # Create plain text version
                    plain_text_content = strip_tags(email_content)

                    # Use simple send_mail with html_message parameter for proper HTML rendering
                    send_mail(
                        subject=subject,
                        message=plain_text_content,  # Plain text version
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[recipient_email],
                        html_message=email_content,  # HTML version
                        fail_silently=False,
                    )

                    # Create activity record for the proposal
                    OpportunityActivity.objects.create(
                        opportunity=opportunity,
                        type='proposal',
                        description=
                        f'Proposal email sent to {recipient_email}. Subject: {subject}',
                        date=timezone.now().date(),
                        created_by=request.user
                        if request.user.is_authenticated else None)

                    return Response(
                        {
                            'success': True,
                            'message':
                            f'Proposal email sent successfully to {recipient_email}',
                            'recipient': recipient_email
                        },
                        status=status.HTTP_200_OK)

                except Exception as email_error:
                    return Response(
                        {
                            'success': False,
                            'error':
                            f'Failed to send email: {str(email_error)}'
                        },
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            else:
                # For non-email methods, just create an activity record
                OpportunityActivity.objects.create(
                    opportunity=opportunity,
                    type='proposal',
                    description=
                    f'Proposal sent via {delivery_method}. {special_terms}',
                    date=timezone.now().date(),
                    created_by=request.user
                    if request.user.is_authenticated else None)

                return Response(
                    {
                        'success':
                        True,
                        'message':
                        f'Proposal sent successfully via {delivery_method}',
                    },
                    status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': f'Failed to send proposal: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'], url_path='closed-won-opportunities')
    def closed_won_opportunities(self, request):
        """
        Get list of closed won opportunities for contract creation
        """
        try:
            # Get all closed won opportunities with related data
            closed_won_opps = Opportunity.objects.filter(
                stage='closed_won').select_related(
                    'lead__company', 'lead__contact').prefetch_related(
                        'activities').order_by('-created_at')

            # Use the optimized serializer to return full opportunity data
            from .serializers import OptimizedOpportunitySerializer
            serializer = OptimizedOpportunitySerializer(closed_won_opps,
                                                        many=True)

            return Response(serializer.data, status=200)

        except Exception as e:
            logger.error(f"Error fetching closed won opportunities: {str(e)}")
            return Response({'error': str(e)}, status=500)

    @action(detail=False, methods=['post'])
    def search(self, request):
        """
        Search opportunities with filters and pagination
        """
        filters = request.data

        queryset = self.queryset.select_related('lead__company',
                                                'lead__contact')

        search = filters.get('search', '')
        stage = filters.get('stage', '')
        owner = filters.get('owner', '')
        industry = filters.get('industry', '')
        limit = int(filters.get('limit', 100))  # Default limit of 100
        page = int(filters.get('page', 1))

        if search:
            queryset = queryset.filter(
                Q(name__icontains=search)
                | Q(lead__company__name__icontains=search)
                | Q(lead__contact__first_name__icontains=search)
                | Q(lead__contact__last_name__icontains=search))

        if stage and stage != 'all':
            queryset = queryset.filter(stage=stage)

        if industry and industry != 'all':
            queryset = queryset.filter(lead__company__industry=industry)

        # Order by probability and value for better prioritization
        queryset = queryset.order_by('-probability', '-value')

        # Apply pagination
        offset = (page - 1) * limit
        queryset = queryset[offset:offset + limit]

        # Use optimized serializer for faster response
        from .serializers import OptimizedOpportunitySerializer
        serializer = OptimizedOpportunitySerializer(queryset, many=True)
        return Response(serializer.data)


class OpportunityActivityViewSet(viewsets.ModelViewSet):
    queryset = OpportunityActivity.objects.all()
    serializer_class = OpportunityActivitySerializer

    def get_queryset(self):
        queryset = self.queryset
        opportunity_id = self.request.query_params.get('opportunity_id', None)

        if opportunity_id:
            queryset = queryset.filter(opportunity_id=opportunity_id)

        return queryset.order_by('-date', '-created_at')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user if self.request.user.
                        is_authenticated else None)


class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer

    @action(detail=False, methods=['get'])
    def renewal_alerts(self, request):
        days_ahead = int(request.query_params.get('days', 30))
        alert_date = timezone.now().date() + timedelta(days=days_ahead)

        contracts = self.queryset.filter(end_date__lte=alert_date,
                                         status='active').order_by('end_date')

        serializer = self.get_serializer(contracts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def at_risk(self, request):
        contracts = self.queryset.filter(
            Q(status='at_risk') | Q(risk_score__gte=7)).order_by('-risk_score')

        serializer = self.get_serializer(contracts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        total_contracts = self.queryset.count()
        active_contracts = self.queryset.filter(status='active').count()
        expiring_soon = self.queryset.filter(
            end_date__lte=timezone.now().date() + timedelta(days=30),
            status='active').count()

        stats = {
            'total_contracts':
            total_contracts,
            'active_contracts':
            active_contracts,
            'expiring_soon':
            expiring_soon,
            'total_value':
            self.queryset.aggregate(total=Sum('value'))['total'] or 0,
            'average_value':
            self.queryset.aggregate(avg=Avg('value'))['avg'] or 0,
            'breach_count':
            ContractBreach.objects.filter(is_resolved=False).count()
        }

        return Response(stats)


class ContractBreachViewSet(viewsets.ModelViewSet):
    queryset = ContractBreach.objects.all()
    serializer_class = ContractBreachSerializer

    @action(detail=False, methods=['get'])
    def active_breaches(self, request):
        breaches = self.queryset.filter(is_resolved=False).order_by(
            '-severity', '-detected_date')
        serializer = self.get_serializer(breaches, many=True)
        return Response(breaches.data)

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        breach = self.get_object()
        breach.is_resolved = True
        breach.resolved_date = timezone.now()
        breach.resolution_notes = request.data.get('notes', '')
        breach.save()

        return Response({'status': 'breach resolved'})


class CampaignTemplateViewSet(viewsets.ModelViewSet):
    queryset = CampaignTemplate.objects.all()
    serializer_class = CampaignTemplateSerializer

    def list(self, request, *args, **kwargs):
        """Get all templates including both custom and default templates"""
        try:
            # Get custom templates from database
            custom_templates = []
            try:
                custom_templates_queryset = self.get_queryset()
                custom_templates_serializer = self.get_serializer(
                    custom_templates_queryset, many=True)
                custom_templates = custom_templates_serializer.data
            except Exception as e:
                print(f"Error getting custom templates: {e}")
                custom_templates = []

            # Define default templates
            default_templates = [{
                'id': 'welcome-series',
                'name': 'Welcome Series',
                'description': 'Multi-touch welcome sequence for new leads',
                'channel_type': 'email',
                'target_industry': 'All',
                'subject_line':
                'Welcome to the future of corporate travel - {{company_name}}',
                'content': '''Hi {{contact_name}},

Welcome to SOAR-AI! We're excited to help {{company_name}} transform your corporate travel experience.

Based on your {{industry}} background and {{employees}} team size, we've identified several opportunities to optimize your travel operations:

✈️ Reduce travel costs by up to 35%
📊 Streamline booking and approval processes  
🌍 Access our global partner network
🤖 AI-powered travel recommendations

Ready to see how we can help? Let's schedule a 15-minute discovery call.''',
                'cta': 'Schedule Discovery Call',
                'linkedin_type': None,
                'estimated_open_rate': 45.0,
                'estimated_click_rate': 12.0,
                'is_custom': False,
                'created_by': 'System',
                'created_at': '2024-01-01T00:00:00Z',
                'updated_at': '2024-01-01T00:00:00Z'
            }, {
                'id': 'cost-savings',
                'name': 'Cost Savings Focus',
                'description': 'Emphasizes ROI and cost reduction benefits',
                'channel_type': 'email',
                'target_industry': 'Manufacturing',
                'subject_line':
                '{{company_name}}: Cut travel costs by 35% with SOAR-AI',
                'content': '''{{contact_name}},

Companies like {{company_name}} in the {{industry}} sector are saving an average of 35% on travel costs with SOAR-AI.

Here's what {{company_name}} could save annually:
• Current estimated budget: {{travel_budget}}
• Potential savings: {{calculated_savings}}
• ROI timeline: 3-6 months

Our AI-powered platform optimizes:
- Flight routing and pricing
- Hotel negotiations
- Policy compliance
- Expense management

Ready to see your personalized savings analysis?''',
                'cta': 'View Savings Report',
                'linkedin_type': None,
                'estimated_open_rate': 52.0,
                'estimated_click_rate': 15.0,
                'is_custom': False,
                'created_by': 'System',
                'created_at': '2024-01-01T00:00:00Z',
                'updated_at': '2024-01-01T00:00:00Z'
            }, {
                'id': 'linkedin-connection',
                'name': 'LinkedIn Connection Request',
                'description':
                'Professional connection request for LinkedIn outreach',
                'channel_type': 'linkedin',
                'target_industry': 'All',
                'subject_line': None,
                'content': '''Hi {{contact_name}},

I noticed {{company_name}} is expanding in the {{industry}} space. I'd love to connect and share how we're helping similar companies optimize their corporate travel operations.

Would you be open to connecting?''',
                'cta': 'Connect on LinkedIn',
                'linkedin_type': 'connection',
                'estimated_open_rate': 65.0,
                'estimated_click_rate': 25.0,
                'is_custom': False,
                'created_by': 'System',
                'created_at': '2024-01-01T00:00:00Z',
                'updated_at': '2024-01-01T00:00:00Z'
            }, {
                'id': 'multi-channel-sequence',
                'name': 'Multi-Channel Sequence',
                'description':
                'Coordinated outreach across email, LinkedIn, and WhatsApp',
                'channel_type': 'mixed',
                'target_industry': 'All',
                'subject_line':
                'Partnership opportunity with {{company_name}}',
                'content': '''Hi {{contact_name}},

I hope this message finds you well. I've been researching {{company_name}} and I'm impressed by your growth in the {{industry}} sector.

We're helping companies like yours:
• Reduce travel costs by 25-40%
• Improve policy compliance
• Streamline approval workflows
• Access exclusive corporate rates

Would you be interested in a brief conversation about how we could support {{company_name}}'s travel operations?''',
                'cta': 'Schedule 15-min Call',
                'linkedin_type': 'message',
                'estimated_open_rate': 58.0,
                'estimated_click_rate': 18.0,
                'is_custom': False,
                'created_by': 'System',
                'created_at': '2024-01-01T00:00:00Z',
                'updated_at': '2024-01-01T00:00:00Z'
            }]

            # Combine default templates first, then custom templates
            all_templates = default_templates + custom_templates
            return Response(all_templates)

        except Exception as e:
            print(f"Error in CampaignTemplateViewSet.list: {e}")
            # Return just default templates if there's any error
            default_templates = [{
                'id': 'welcome-series',
                'name': 'Welcome Series',
                'description': 'Multi-touch welcome sequence for new leads',
                'channel_type': 'email',
                'target_industry': 'All',
                'subject_line': 'Welcome to the future of corporate travel',
                'content': 'Welcome to SOAR-AI!',
                'cta': 'Schedule Discovery Call',
                'linkedin_type': None,
                'estimated_open_rate': 45.0,
                'estimated_click_rate': 12.0,
                'is_custom': False,
                'created_by': 'System',
                'created_at': '2024-01-01T00:00:00Z',
                'updated_at': '2024-01-01T00:00:00Z'
            }]
            return Response(default_templates)

    @action(detail=False, methods=['get'])
    def default_templates(self, request):
        """Get default/built-in campaign templates (legacy endpoint)"""
        default_templates = [{
            'id': 'welcome-series',
            'name': 'Welcome Series',
            'description': 'Multi-touch welcome sequence for new leads',
            'channel_type': 'email',
            'target_industry': 'All',
            'subject_line':
            'Welcome to the future of corporate travel - {{company_name}}',
            'content': '''Hi {{contact_name}},

Welcome to SOAR-AI! We're excited to help {{company_name}} transform your corporate travel experience.

Based on your {{industry}} background and {{employees}} team size, we've identified several opportunities to optimize your travel operations:

✈️ Reduce travel costs by up to 35%
📊 Streamline booking and approval processes  
🌍 Access our global partner network
🤖 AI-powered travel recommendations

Ready to see how we can help? Let's schedule a 15-minute discovery call.''',
            'cta': 'Schedule Discovery Call',
            'linkedin_type': None,
            'estimated_open_rate': 45.0,
            'estimated_click_rate': 12.0,
            'is_custom': False,
            'created_by': 'System',
            'created_at': '2024-01-01T00:00:00Z',
            'updated_at': '2024-01-01T00:00:00Z'
        }, {
            'id': 'cost-savings',
            'name': 'Cost Savings Focus',
            'description': 'Emphasizes ROI and cost reduction benefits',
            'channel_type': 'email',
            'target_industry': 'Manufacturing',
            'subject_line':
            '{{company_name}}: Cut travel costs by 35% with SOAR-AI',
            'content': '''{{contact_name}},

Companies like {{company_name}} in the {{industry}} sector are saving an average of 35% on travel costs with SOAR-AI.

Here's what {{company_name}} could save annually:
• Current estimated budget: {{travel_budget}}
• Potential savings: {{calculated_savings}}
• ROI timeline: 3-6 months

Our AI-powered platform optimizes:
- Flight routing and pricing
- Hotel negotiations
- Policy compliance
- Expense management

Ready to see your personalized savings analysis?''',
            'cta': 'View Savings Report',
            'linkedin_type': None,
            'estimated_open_rate': 52.0,
            'estimated_click_rate': 15.0,
            'is_custom': False,
            'created_by': 'System',
            'created_at': '2024-01-01T00:00:00Z',
            'updated_at': '2024-01-01T00:00:00Z'
        }, {
            'id': 'linkedin-connection',
            'name': 'LinkedIn Connection Request',
            'description':
            'Professional connection request for LinkedIn outreach',
            'channel_type': 'linkedin',
            'target_industry': 'All',
            'subject_line': None,
            'content': '''Hi {{contact_name}},

I noticed {{company_name}} is expanding in the {{industry}} space. I'd love to connect and share how we're helping similar companies optimize their corporate travel operations.

Would you be open to connecting?''',
            'cta': 'Connect on LinkedIn',
            'linkedin_type': 'connection',
            'estimated_open_rate': 65.0,
            'estimated_click_rate': 25.0,
            'is_custom': False,
            'created_by': 'System',
            'created_at': '2024-01-01T00:00:00Z',
            'updated_at': '2024-01-01T00:00:00Z'
        }, {
            'id': 'multi-channel-sequence',
            'name': 'Multi-Channel Sequence',
            'description':
            'Coordinated outreach across email, LinkedIn, and WhatsApp',
            'channel_type': 'mixed',
            'target_industry': 'All',
            'subject_line': 'Partnership opportunity with {{company_name}}',
            'content': '''Hi {{contact_name}},

I hope this message finds you well. I've been researching {{company_name}} and I'm impressed by your growth in the {{industry}} sector.

We're helping companies like yours:
• Reduce travel costs by 25-40%
• Improve policy compliance
• Streamline approval workflows
• Access exclusive corporate rates

Would you be interested in a brief conversation about how we could support {{company_name}}'s travel operations?''',
            'cta': 'Schedule 15-min Call',
            'linkedin_type': 'message',
            'estimated_open_rate': 58.0,
            'estimated_click_rate': 18.0,
            'is_custom': False,
            'created_by': 'System',
            'created_at': '2024-01-01T00:00:00Z',
            'updated_at': '2024-01-01T00:00:00Z'
        }]

        return Response(default_templates)

    def create(self, request, *args, **kwargs):
        """Create a new campaign template, handling standard layout templates"""
        try:
            data = request.data.copy()

            # Handle standard layout templates
            if data.get('is_standard_layout'):
                # For standard layout, the content should be stored as JSON string
                if 'variables' in data and isinstance(data['variables'], dict):
                    data['content'] = json.dumps(data['variables'])

                # Set is_standard_layout field
                data['is_standard_layout'] = True
            else:
                # For regular templates, ensure is_standard_layout is False
                data['is_standard_layout'] = False

            # Remove fields that don't exist in the model
            if 'linkedin_type' in data:
                data.pop('linkedin_type')
            if 'is_custom' in data:
                data.pop('is_custom')
            if 'variables' in data:
                data.pop('variables')

            # Ensure required fields have defaults
            if not data.get('subject_line'):
                data['subject_line'] = data.get('name', 'Default Subject')
            if not data.get('estimated_open_rate'):
                data['estimated_open_rate'] = 40.0
            if not data.get('estimated_click_rate'):
                data['estimated_click_rate'] = 10.0
            if not data.get('channel_type'):
                data['channel_type'] = 'email'

            serializer = self.get_serializer(data=data)
            if serializer.is_valid():
                template = serializer.save()

                # Return the created template with proper formatting
                response_data = serializer.data
                response_data['is_custom'] = True
                response_data['linkedin_type'] = None
                response_data['created_by'] = 'System'

                return Response(response_data, status=status.HTTP_201_CREATED)
            else:
                print(
                    f"Template creation validation errors: {serializer.errors}"
                )
                return Response(
                    {
                        'error': 'Validation failed',
                        'details': serializer.errors
                    },
                    status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            print(f"Template creation error: {error_details}")
            return Response({'error': f'Failed to create template: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def proposal_draft_detail(request, opportunity_id):
    """
    Handle proposal draft operations for a specific opportunity
    """
    import os
    import uuid
    from django.core.files.storage import default_storage
    from django.core.files.base import ContentFile

    try:
        opportunity = Opportunity.objects.get(id=opportunity_id)
    except Opportunity.DoesNotExist:
        return Response({'error': 'Opportunity not found'},
                        status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        # Get existing draft if it exists
        try:
            draft = ProposalDraft.objects.get(opportunity=opportunity)
            serializer = ProposalDraftSerializer(draft)
            draft_data = serializer.data

            # Include attachment information if exists
            if draft.attachment_path and os.path.exists(draft.attachment_path):
                draft_data['attachment_info'] = {
                    'filename': draft.attachment_original_name,
                    'path': draft.attachment_path,
                    'exists': True
                }
            else:
                draft_data['attachment_info'] = {'exists': False}

            return Response(draft_data, status=status.HTTP_200_OK)
        except ProposalDraft.DoesNotExist:
            return Response({'message': 'No draft found'},
                            status=status.HTTP_404_NOT_FOUND)

    elif request.method == 'POST' or request.method == 'PUT':
        # Handle file upload if present
        attachment_path = None
        attachment_original_name = None

        if 'attachment' in request.FILES:
            uploaded_file = request.FILES['attachment']

            # Create unique filename with corporate ID and timestamp
            file_extension = os.path.splitext(uploaded_file.name)[1]
            unique_filename = f"proposal_{opportunity.lead.company.id}_{opportunity.id}_{uuid.uuid4().hex[:8]}{file_extension}"

            # Create attachments directory if it doesn't exist
            attachments_dir = 'proposal_attachments'
            os.makedirs(attachments_dir, exist_ok=True)

            # Save file with unique name
            attachment_path = os.path.join(attachments_dir, unique_filename)

            # Write file to disk
            with open(attachment_path, 'wb') as f:
                for chunk in uploaded_file.chunks():
                    f.write(chunk)

            attachment_original_name = uploaded_file.name

        # Prepare data for serializer
        data = request.data.copy()
        if attachment_path:
            data['attachment_path'] = attachment_path
            data['attachment_original_name'] = attachment_original_name

        # Create or update draft
        try:
            draft = ProposalDraft.objects.get(opportunity=opportunity)
            serializer = ProposalDraftSerializer(draft,
                                                 data=data,
                                                 partial=True)
        except ProposalDraft.DoesNotExist:
            data['opportunity'] = opportunity.id
            serializer = ProposalDraftSerializer(data=data)

        if serializer.is_valid():
            saved_draft = serializer.save()

            # Include attachment info in response
            response_data = serializer.data
            if saved_draft.attachment_path and os.path.exists(
                    saved_draft.attachment_path):
                response_data['attachment_info'] = {
                    'filename': saved_draft.attachment_original_name,
                    'path': saved_draft.attachment_path,
                    'exists': True
                }

            return Response(response_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        # Delete draft and associated files
        try:
            draft = ProposalDraft.objects.get(opportunity=opportunity)

            # Delete attachment file if exists
            if draft.attachment_path and os.path.exists(draft.attachment_path):
                try:
                    os.remove(draft.attachment_path)
                except OSError:
                    pass  # File might be already deleted

            draft.delete()
            return Response({'message': 'Draft deleted successfully'},
                            status=status.HTTP_200_OK)
        except ProposalDraft.DoesNotExist:
            return Response({'message': 'No draft found'},
                            status=status.HTTP_404_NOT_FOUND)

    elif request.method == 'DELETE':
        # Delete draft
        try:
            draft = ProposalDraft.objects.get(opportunity=opportunity)
            draft.delete()
            return Response({'message': 'Draft deleted successfully'},
                            status=status.HTTP_200_OK)
        except ProposalDraft.DoesNotExist:
            return Response({'message': 'No draft found'},
                            status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([AllowAny])
def lead_dashboard_stats(request):
    """Get lead dashboard statistics"""
    try:
        time_period = request.GET.get('period', 'all_time')

        # Calculate date range based on period
        end_date = timezone.now()
        if time_period == 'last_30_days':
            start_date = end_date - timedelta(days=30)
        elif time_period == 'last_90_days':
            start_date = end_date - timedelta(days=90)
        elif time_period == 'this_year':
            start_date = end_date.replace(month=1,
                                          day=1,
                                          hour=0,
                                          minute=0,
                                          second=0,
                                          microsecond=0)
        else:
            start_date = None

        # Base queryset
        leads_queryset = Lead.objects.all()
        if start_date:
            leads_queryset = leads_queryset.filter(created_at__gte=start_date)

        # Calculate basic stats
        total_leads = leads_queryset.count()
        qualified_leads = leads_queryset.filter(status='qualified').count()
        unqualified_leads = leads_queryset.filter(status='unqualified').count()
        contacted_leads = leads_queryset.filter(status='contacted').count()
        responded_leads = leads_queryset.filter(status='responded').count()

        # Calculate conversion rate
        conversion_rate = (qualified_leads / total_leads *
                           100) if total_leads > 0 else 0

        # Calculate email stats (mock data for now - can be enhanced with actual email tracking)
        email_open_rate = 68.5  # This would come from email campaign data
        email_open_rate_change = 5.2

        # Calculate average response time (mock data)
        avg_response_time = "2.4 hours"
        avg_response_time_change = "15% faster"

        # Calculate period-over-period changes
        if start_date:
            previous_period_start = start_date - (end_date - start_date)
            previous_leads = Lead.objects.filter(
                created_at__gte=previous_period_start,
                created_at__lt=start_date).count()
            total_change = ((total_leads - previous_leads) /
                            max(previous_leads, 1) *
                            100) if previous_leads > 0 else 0
        else:
            total_change = 12.5  # Mock data for all time

        stats = {
            'totalLeads': total_leads,
            'qualifiedLeads': qualified_leads,
            'unqualified': unqualified_leads,
            'contacted': contacted_leads,
            'responded': responded_leads,
            'conversionRate': round(conversion_rate, 1),
            'emailOpenRate': email_open_rate,
            'emailOpenRateChange': email_open_rate_change,
            'avgResponseTime': avg_response_time,
            'avgResponseTimeChange': avg_response_time_change,
            'totalChange': round(total_change, 1),
            'period': time_period
        }

        return Response(stats)

    except Exception as e:
        return Response(
            {
                'error': f'Failed to fetch lead stats: {str(e)}',
                'totalLeads': 0,
                'qualifiedLeads': 0,
                'unqualified': 0,
                'contacted': 0,
                'responded': 0,
                'conversionRate': 0,
                'emailOpenRate': 0,
                'emailOpenRateChange': 0,
                'avgResponseTime': '0 hours',
                'avgResponseTimeChange': 'No change',
                'totalChange': 0
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def list_revenue_files(request):
    """
    List files in the revenue_prediction folder
    """
    import os

    try:
        # Get the revenue_prediction folder path
        revenue_folder = os.path.join(
            os.path.dirname(os.path.dirname(__file__)), 'revenue_prediction')

        if not os.path.exists(revenue_folder):
            return Response({
                'success':
                True,
                'files': [],
                'message':
                'Revenue prediction folder does not exist yet'
            })

        files = []
        for filename in os.listdir(revenue_folder):
            file_path = os.path.join(revenue_folder, filename)
            if os.path.isfile(file_path):
                # Get file stats
                file_stat = os.stat(file_path)

                files.append({
                    'name':
                    filename,
                    'size':
                    file_stat.st_size,
                    'uploadDate':
                    datetime.fromtimestamp(file_stat.st_mtime).isoformat() +
                    'Z'
                })

        # Sort by upload date (newest first)
        files.sort(key=lambda x: x['uploadDate'], reverse=True)

        return Response({'success': True, 'files': files, 'count': len(files)})

    except Exception as e:
        return Response(
            {
                'success': False,
                'error': f'Failed to list files: {str(e)}'
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_revenue_prediction_data(request):
    """
    Process XLSX/CSV files from revenue_prediction folder and return structured + simulated KPIs
    """
    import os
    import pandas as pd
    from datetime import datetime

    try:
        # Get the revenue_prediction folder path
        revenue_folder = os.path.join(
            os.path.dirname(os.path.dirname(__file__)), 'revenue_prediction')

        if not os.path.exists(revenue_folder):
            return Response(
                {
                    'success': False,
                    'error': 'Revenue prediction folder does not exist'
                },
                status=status.HTTP_404_NOT_FOUND)

        # Get all XLSX/CSV files
        xlsx_files = [
            f for f in os.listdir(revenue_folder)
            if f.endswith(('.xlsx', '.xls', '.csv'))
        ]

        if not xlsx_files:
            return Response(
                {
                    'success': False,
                    'error': 'No data files found in revenue_prediction folder'
                },
                status=status.HTTP_404_NOT_FOUND)

        # Use the most recent file
        latest_file = max(
            xlsx_files,
            key=lambda f: os.path.getmtime(os.path.join(revenue_folder, f)))
        file_path = os.path.join(revenue_folder, latest_file)

        # Read the file
        if latest_file.endswith('.csv'):
            df = pd.read_csv(file_path)
        else:
            df = pd.read_excel(file_path)

        # Ensure Booking_Month is in datetime format
        if "Booking_Month" in df.columns:
            df["Booking_Month"] = pd.to_datetime(df["Booking_Month"],
                                                 errors="coerce")

        # Process structured revenue insights
        processed_data = process_revenue_data(df, latest_file)

        return Response({
            'success': True,
            'data': processed_data,
            'source_file': latest_file,
            'last_updated': datetime.now().isoformat()
        })

    except Exception as e:
        return Response(
            {
                'success': False,
                'error': f'Failed to process revenue data: {str(e)}'
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def process_revenue_data(df, filename):
    """
    Process corporate bookings data and generate insights + KPIs
    """
    import random

    # ================= REAL DATA INSIGHTS =================

    # --- Business Performance Overview ---
    business_performance = {
        "totalBookings": int(df["Booking_ID"].nunique()),
        "totalRevenue": float(df["Total_Fare_Amount"].sum()),
        "activeClients": int(df["Corporate_Account_Code"].nunique()),
        "avgBookingValue": round(float(df["Total_Fare_Amount"].mean()), 2)
    }

    # --- Top Destinations ---
    top_destinations = (df.groupby("Destination_Airport_Code").agg(
        bookings=("Booking_ID", "count"),
        revenue=("Total_Fare_Amount", "sum")).reset_index().sort_values(
            by="bookings", ascending=False).head(5).to_dict(orient="records"))

    # --- Monthly Booking Trends ---
    # Group by month and create a proper date column for sorting
    monthly_data = df.groupby(df["Booking_Month"].dt.to_period("M")).agg(
        bookings=("Booking_ID", "count"),
        revenue=("Total_Fare_Amount", "sum")).reset_index()

    # Convert period to string format and sort in descending order (latest first)
    monthly_data["month"] = monthly_data["Booking_Month"].dt.strftime("%b %Y")
    monthly_trends = (
        monthly_data.sort_values("Booking_Month",
                                 ascending=False)  # Latest first
        .drop("Booking_Month", axis=1).to_dict(orient="records"))

    # --- Yearly Forecast ---
    # Calculate yearly forecast by summing monthly revenues
    yearly_revenue = df.groupby(df['Booking_Month'].dt.year).agg(
        total_revenue=('Total_Fare_Amount', 'sum'),
        total_bookings=('Booking_ID', 'count')).reset_index()

    yearly_forecast = []
    for index, row in yearly_revenue.iterrows():
        yearly_forecast.append({
            'year': int(row['Booking_Month']),
            'totalRevenue': float(row['total_revenue']),
            'totalBookings': int(row['total_bookings'])
        })

    # --- Enhanced Corporate Analysis ---
    # Group by Corporate_Account_Code and calculate metrics for each corporate client
    corporate_analysis = df.groupby("Corporate_Account_Code").agg(
        current_revenue=("Total_Fare_Amount", "sum"),
        total_bookings=("Booking_ID", "count"),
        unique_destinations=("Destination_Airport_Code", "nunique"),
        avg_booking_value=("Total_Fare_Amount", "mean")).reset_index()

    # Calculate predictions and metrics for each corporate client
    corporate_revenue_data = []
    for index, corp in corporate_analysis.iterrows():
        corp_code = corp["Corporate_Account_Code"]
        current_rev = float(corp["current_revenue"])
        total_bookings = int(corp["total_bookings"])

        # Filter data for this specific corporate client
        corp_data = df[df["Corporate_Account_Code"] == corp_code].copy()

        # Generate monthly data for this corporate client
        monthly_corp_data = corp_data.groupby(corp_data["Booking_Month"].dt.to_period("M")).agg(
            revenue=("Total_Fare_Amount", "sum"),
            bookings=("Booking_ID", "count")
        ).reset_index()
        monthly_corp_data["month"] = monthly_corp_data["Booking_Month"].dt.strftime("%b %Y")
        monthly_breakdown = monthly_corp_data.sort_values("Booking_Month", ascending=False).drop("Booking_Month", axis=1).to_dict(orient="records")

        # Generate yearly data for this corporate client
        yearly_corp_data = corp_data.groupby(corp_data["Booking_Month"].dt.year).agg(
            revenue=("Total_Fare_Amount", "sum"),
            bookings=("Booking_ID", "count")
        ).reset_index()
        yearly_corp_data.rename(columns={"Booking_Month": "year"}, inplace=True)
        yearly_breakdown = yearly_corp_data.to_dict(orient="records")

        # Generate quarterly data for this corporate client
        quarterly_corp_data = corp_data.groupby(corp_data["Booking_Month"].dt.to_period("Q")).agg(
            revenue=("Total_Fare_Amount", "sum"),
            bookings=("Booking_ID", "count")
        ).reset_index()
        quarterly_corp_data["quarter"] = quarterly_corp_data["Booking_Month"].dt.strftime("Q%q %Y")
        quarterly_breakdown = quarterly_corp_data.sort_values("Booking_Month", ascending=False).drop("Booking_Month", axis=1).to_dict(orient="records")

        # Calculate growth rate based on booking patterns
        growth_multiplier = min(
            1.5, 1 + (total_bookings / 100) *
            0.1)  # Higher bookings = higher growth potential
        base_growth = random.uniform(8, 25)

        # Calculate predicted revenue with growth
        predicted_revenue = current_rev * growth_multiplier * (
            1 + base_growth / 100)

        # Calculate growth percentage
        growth_rate = ((predicted_revenue - current_rev) / current_rev *
                       100) if current_rev > 0 else 0

        # Calculate confidence based on booking volume and revenue stability
        confidence_score = min(
            95, 60 + (total_bookings / 10) + random.uniform(-5, 10))

        # Calculate active deals (simulate based on booking frequency)
        active_deals = max(1, int(total_bookings * random.uniform(0.1, 0.3)))

        # Calculate probability based on current performance
        if current_rev > 1000000:
            probability = random.uniform(75, 95)
        elif current_rev > 500000:
            probability = random.uniform(60, 85)
        else:
            probability = random.uniform(45, 75)

        corporate_revenue_data.append({
            "CompanyName":
            f"{corp_code}",
            "CurrentRevenue":
            round(current_rev, 2),
            "PredictedRevenue":
            round(predicted_revenue, 2),
            "GrowthRate":
            round(growth_rate, 1),
            "Confidence":
            round(confidence_score, 1),
            "ActiveDeals":
            active_deals,
            "Probability":
            round(probability, 1),
            "TotalBookings":
            total_bookings,
            "AvgBookingValue":
            round(float(corp["avg_booking_value"]), 2),
            "MonthlyData":
            monthly_breakdown,
            "YearlyData":
            yearly_breakdown,
            "QuarterlyData":
            quarterly_breakdown
        })

    # Sort by current revenue (highest first)
    corporate_revenue_data.sort(key=lambda x: x["CurrentRevenue"],
                                reverse=True)

    # ================= SIMULATED KPI METRICS =================

    total_rows = len(df)
    current_revenue = df["Total_Fare_Amount"].sum()
    base_revenue = current_revenue // 12 if current_revenue > 0 else 4000000

    growth_rate = random.uniform(5, 20)

    # Business Stats (simulated)
    business_stats = {
        "newClientsThisMonth": random.randint(50, 120),
        "bookingGrowthRate": round(abs(growth_rate), 1),
        "revenueGrowthRate":
        round(abs(growth_rate) + random.uniform(-5, 5), 1),
        "clientRetentionRate": round(85 + random.uniform(-5, 10), 1),
        "averageLeadTime": round(12 + random.uniform(-3, 8), 1),
        "cancelationRate": round(3 + random.uniform(-1, 3), 1),
        "repeatBookingRate": round(60 + random.uniform(-10, 15), 1),
        "avgDealClosure": random.randint(20, 40)
    }

    # Key Metrics (simulated)
    key_metrics = {
        "totalPipelineValue": max(current_revenue * 1.25, 125000000),
        "weightedPipelineValue": max(current_revenue * 0.75, 75000000),
        "averageDealSize": max(current_revenue // 100, 850000),
        "conversionRate": round(20 + random.uniform(-5, 10), 1),
        "salesCycleLength": random.randint(35, 55),
        "forecastAccuracy": round(88 + random.uniform(-5, 8), 1),
        "quarterlyGrowthRate":
        round(abs(growth_rate) + random.uniform(-3, 8), 1),
        "yearOverYearGrowth": round(abs(growth_rate), 1)
    }

    # Simulated predicted growth data
    predicted_growth = {
        "nextQuarter":
        round(current_revenue * (1 + random.uniform(0.05, 0.15)), 2),
        "nextYear": round(current_revenue * (1 + random.uniform(0.10, 0.25)),
                          2)
    }

    # Simulated insights
    insights = [
        f"Processed {total_rows} rows from {filename}",
        f"Detected {business_performance['activeClients']} active clients",
        f"Total revenue of {business_performance['totalRevenue']:.2f}",
        f"Growth rate simulated at {growth_rate:.1f}%",
        f"Corporate analysis generated for {len(corporate_revenue_data)} clients"
    ]

    return {
        "dataSource": {
            "filename": filename,
            "totalRows": total_rows,
            "totalRevenue": current_revenue,
        },
        "businessPerformanceOverview": business_performance,
        "topDestinations": top_destinations,
        "monthlyBookingTrends": monthly_trends,
        "yearlyForecast": yearly_forecast,
        "corporateRevenue":corporate_revenue_data,  # New corporate analysis data
        "businessStats": business_stats,
        "keyMetrics": key_metrics,
        "insights": insights,
        "predictedGrowth": predicted_growth,
    }


@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_revenue_file(request, filename):
    """
    Delete a specific file from the revenue_prediction folder
    """
    import os

    try:
        # Get the revenue_prediction folder path
        revenue_folder = os.path.join(
            os.path.dirname(os.path.dirname(__file__)), 'revenue_prediction')
        file_path = os.path.join(revenue_folder, filename)

        if not os.path.exists(file_path):
            return Response({
                'success': False,
                'error': 'File not found'
            },
                            status=status.HTTP_404_NOT_FOUND)

        # Delete the file
        os.remove(file_path)

        return Response({
            'success': True,
            'message': f'File "{filename}" deleted successfully'
        })

    except Exception as e:
        return Response(
            {
                'success': False,
                'error': f'Failed to delete file: {str(e)}'
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def upload_revenue_data(request):
    """
    Upload revenue prediction data files to server/revenue_prediction folder
    """
    import os
    import uuid
    from django.conf import settings

    try:
        if 'file' not in request.FILES:
            return Response({'error': 'No file provided'},
                            status=status.HTTP_400_BAD_REQUEST)

        uploaded_file = request.FILES['file']
        folder = request.POST.get('folder', 'revenue_prediction')

        # Validate file type
        allowed_extensions = ['.csv', '.xlsx', '.xls']
        file_extension = os.path.splitext(uploaded_file.name)[1].lower()
        if file_extension not in allowed_extensions:
            return Response(
                {
                    'error':
                    'Invalid file type. Please upload CSV or Excel files only.'
                },
                status=status.HTTP_400_BAD_REQUEST)

        # Validate file size (100MB limit)
        if uploaded_file.size > 100 * 1024 * 1024:
            return Response({'error': 'File size exceeds 50MB limit'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Create revenue_prediction directory if it doesn't exist
        upload_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)),
                                  folder)
        os.makedirs(upload_dir, exist_ok=True)

        # Generate unique filename to prevent conflicts
        base_name = os.path.splitext(uploaded_file.name)[0]
        unique_filename = f"{base_name}_{uuid.uuid4().hex[:8]}{file_extension}"
        file_path = os.path.join(upload_dir, unique_filename)

        # Save the file
        with open(file_path, 'wb') as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)

        # Analyze file for row/column count if it's CSV
        rows = 0
        columns = 0
        try:
            if file_extension == '.csv':
                import pandas as pd
                df = pd.read_csv(file_path)
                rows = len(df)
                columns = len(df.columns)
            elif file_extension in ['.xlsx', '.xls']:
                import pandas as pd
                df = pd.read_excel(file_path)
                rows = len(df)
                columns = len(df.columns)
        except Exception as e:
            print(f"Error analyzing file: {e}")

        return Response(
            {
                'success': True,
                'message':
                f'File "{uploaded_file.name}" uploaded successfully to {folder} folder',
                'filename': unique_filename,
                'original_name': uploaded_file.name,
                'file_path': file_path,
                'size': uploaded_file.size,
                'rows': rows,
                'columns': columns,
                'folder': folder
            },
            status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': f'Upload failed: {str(e)}'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def recent_lead_activity(request):
    """Get recent lead activity for dashboard"""
    try:
        limit = int(request.GET.get('limit', 10))

        activities = []

        # Get recent lead history entries
        try:
            recent_history = LeadHistory.objects.select_related(
                'lead').order_by('-timestamp')[:limit]

            for history in recent_history:
                activity_type = 'qualification' if 'qualified' in history.action.lower() else \
                              'disqualification' if 'disqualified' in history.action.lower() else \
                              'email' if 'email' in history.action.lower() else \
                              'response'

                activities.append({
                    'id':
                    history.id,
                    'type':
                    activity_type,
                    'lead':
                    f"{history.lead.company.name}",
                    'action':
                    history.action,
                    'time':
                    history.timestamp.strftime('%d %b %Y, %I:%M %p'),
                    'status':
                    history.lead.status,
                    'value':
                    f"Score: {history.lead.score}"
                    if history.lead.score else "No score"
                })
        except Exception as activity_error:
            print(f"Error processing history {history.id}: {activity_error}")
            # continue

        # If no history available, get recent leads as activities
        if not activities:
            recent_leads = Lead.objects.select_related('company').order_by(
                '-updated_at')[:5]

            for i, lead in enumerate(recent_leads):
                activities.append({
                    'id':
                    lead.id,
                    'type':
                    'qualification'
                    if lead.status == 'qualified' else 'response',
                    'lead':
                    lead.company.name,
                    'action':
                    f'Lead {lead.status} - Recent update',
                    'time':
                    lead.updated_at.strftime('%d %b %Y, %I:%M %p'),
                    'status':
                    lead.status,
                    'value':
                    f"${int(lead.estimated_value/1000)}K"
                    if lead.estimated_value else "No value set"
                })

        # If no activities found, return empty list
        if not activities:
            return Response([])

        return Response(activities)
    except Exception as e:
        return Response({'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def top_qualified_leads(request):
    """Get top qualified leads for dashboard"""
    try:
        limit = int(request.GET.get('limit', 5))

        # Get top qualified leads ordered by score and estimated value
        top_leads = Lead.objects.select_related('company', 'contact').filter(
            status='qualified').order_by('-score', '-estimated_value')[:limit]

        leads_data = []
        for lead in top_leads:
            try:
                # Determine engagement level based on score
                if lead.score >= 80:
                    engagement = 'High'
                elif lead.score >= 60:
                    engagement = 'Medium'
                else:
                    engagement = 'Low'

                lead_data = {
                    'id':
                    lead.id,
                    'company':
                    lead.company.name if lead.company else 'Unknown Company',
                    'contact':
                    f"{lead.contact.first_name} {lead.contact.last_name}"
                    if lead.contact else 'Unknown Contact',
                    'title':
                    lead.contact.position
                    if lead.contact else 'Unknown Position',
                    'industry':
                    lead.company.industry.title()
                    if lead.company and lead.company.industry else 'Unknown',
                    'employees':
                    lead.company.employee_count if lead.company else 0,
                    'status':
                    lead.status,
                    'score':
                    lead.score,
                    'value':
                    f"${int(lead.estimated_value/1000)}K"
                    if lead.estimated_value else 'TBD',
                    'engagement':
                    engagement,
                    'nextAction':
                    lead.next_action or 'Follow up required',
                    'lastContact':
                    lead.updated_at.strftime('%m/%d/%Y')
                    if lead.updated_at else 'Unknown'
                }
                leads_data.append(lead_data)

            except Exception as lead_error:
                print(f"Error processing lead {lead.id}: {lead_error}")
                continue

        return Response(leads_data)

    except Exception as e:
        print(f"Error in top leads endpoint: {str(e)}")
        return Response([], status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TravelOfferViewSet(viewsets.ModelViewSet):
    queryset = TravelOffer.objects.all()
    serializer_class = TravelOfferSerializer

    @action(detail=False, methods=['get'])
    def active_offers(self, request):
        """Get active travel offers"""
        offers = self.queryset.filter(status='active')
        serializer = self.get_serializer(offers, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """Get offers by type"""
        offer_type = request.query_params.get('type')
        if offer_type:
            offers = self.queryset.filter(offer_type=offer_type)
        else:
            offers = self.queryset.all()
        serializer = self.get_serializer(offers, many=True)
        return Response(serializer.data)


class SupportTicketViewSet(viewsets.ModelViewSet):
    queryset = SupportTicket.objects.all()
    serializer_class = SupportTicketSerializer

    @action(detail=False, methods=['get'])
    def by_priority(self, request):
        """Get tickets by priority"""
        priority = request.query_params.get('priority')
        if priority:
            tickets = self.queryset.filter(priority=priority)
        else:
            tickets = self.queryset.all()
        serializer = self.get_serializer(tickets, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_status(self, request):
        """Get tickets by status"""
        status_filter = request.query_params.get('status')
        if status_filter:
            tickets = self.queryset.filter(status=status_filter)
        else:
            tickets = self.queryset.all()
        serializer = self.get_serializer(tickets, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        ticket = self.get_object()
        ticket.status = 'resolved'
        ticket.resolved_at = timezone.now()
        ticket.save()
        return Response({'message': 'Ticket resolved successfully'})


class RevenueForecastViewSet(viewsets.ModelViewSet):
    queryset = RevenueForecast.objects.all()
    serializer_class = RevenueForecastSerializer


class ActivityLogViewSet(viewsets.ModelViewSet):
    queryset = ActivityLog.objects.all()
    serializer_class = ActivityLogSerializer


class AIConversationViewSet(viewsets.ModelViewSet):
    queryset = AIConversation.objects.all()
    serializer_class = AIConversationSerializer


class LeadNoteViewSet(viewsets.ModelViewSet):
    queryset = LeadNote.objects.all()
    serializer_class = LeadNoteSerializer


class LeadHistoryViewSet(viewsets.ModelViewSet):
    queryset = LeadHistory.objects.all()
    serializer_class = LeadHistorySerializer


class ProposalDraftViewSet(viewsets.ModelViewSet):
    queryset = ProposalDraft.objects.all()
    serializer_class = ProposalDraftSerializer


class AirportCodeViewSet(viewsets.ModelViewSet):
    queryset = AirportCode.objects.all()
    serializer_class = AirportCodeSerializer

    @action(detail=False, methods=['get'])
    def lookup(self, request):
        """Lookup airport name by code"""
        code = request.query_params.get('code', '').upper()
        if not code:
            return Response({'error': 'Airport code is required'},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            airport = AirportCode.objects.get(code=code)
            serializer = self.get_serializer(airport)
            return Response(serializer.data)
        except AirportCode.DoesNotExist:
            return Response(
                {
                    'code': code,
                    'name': f'{code} Airport',
                    'city': code,
                    'country': 'Unknown'
                },
                status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def all_codes(self, request):
        """Get all airport codes for mapping"""
        airports = self.queryset.all()
        airport_dict = {
            airport.code: {
                'name': airport.name,
                'city': airport.city,
                'country': airport.country
            }
            for airport in airports
        }
        return Response(airport_dict)


class EmailCampaignViewSet(viewsets.ModelViewSet):
    queryset = EmailCampaign.objects.all()
    serializer_class = EmailCampaignSerializer
    pagination_class = None  # Disable pagination to return all campaigns

    def list(self, request, *args, **kwargs):
        """Override list method to handle database connection issues"""
        from django.db import connection
        from django.db.utils import OperationalError, ProgrammingError
        from django.db import IntegrityError

        try:
            # Ensure database connection is alive
            connection.ensure_connection()
            return super().list(request, *args, **kwargs)
        except (OperationalError, ProgrammingError, IntegrityError) as e:
            error_message = str(e).lower()
            if ('ssl connection has been closed' in error_message
                    or 'connection' in error_message
                    or 'column' in error_message
                    and 'does not exist' in error_message):
                # Try to close and reopen connection
                connection.close()
                try:
                    return super().list(request, *args, **kwargs)
                except Exception as retry_error:
                    print(f"Retry failed: {str(retry_error)}")
                    # Return empty list if still failing
                    return Response([], status=200)
            else:
                print(f"Database error in EmailCampaignViewSet.list: {str(e)}")
                return Response([], status=200)
        except Exception as e:
            print(f"Unexpected error in EmailCampaignViewSet.list: {str(e)}")
            return Response([], status=200)

    def get_queryset(self):
        """Override get_queryset to handle connection issues"""
        from django.db import connection
        try:
            connection.ensure_connection()
            return self.queryset.select_related().prefetch_related(
                'target_leads')
        except Exception as e:
            print(f"Error in get_queryset: {str(e)}")
            return self.queryset.none()

    @action(detail=False, methods=['post'])
    def launch(self, request):
        """Launch an email campaign"""
        try:
            data = request.data
            template_id = data.get('templateId')
            target_leads = data.get('targetLeads', [])
            target_lead_ids = data.get('target_leads', [])

            # Handle nested email content structure
            email_content = data.get('content', {}).get('email', {})
            subject_line = (data.get('subjectLine', '')
                            or data.get('subject_line', '')
                            or email_content.get('subject', ''))
            message_content = (data.get('messageContent', '')
                               or data.get('email_content', '')
                               or email_content.get('body', ''))

            # Handle CTA and CTA link
            cta_text = email_content.get('cta', '') or data.get('cta', '')
            cta_link = email_content.get('cta_link', '') or data.get(
                'cta_link', '')

            campaign_name = data.get('name',
                                     '') or f"Campaign - {subject_line[:50]}"

            # Handle both targetLeads and target_leads formats
            all_target_leads = target_leads + target_lead_ids

            if not subject_line:
                return Response({'error': 'Subject line is required'},
                                status=status.HTTP_400_BAD_REQUEST)

            if not message_content:
                return Response({'error': 'Message content is required'},
                                status=status.HTTP_400_BAD_REQUEST)

            # Create the campaign
            campaign = EmailCampaign.objects.create(
                name=campaign_name,
                description=data.get('description', ''),
                campaign_type=data.get('campaign_type', 'nurture'),
                status='active',
                subject_line=subject_line,
                email_content=message_content,
                cta_link=cta_link if cta_link else None,
                scheduled_date=timezone.now(),
                sent_date=timezone.now(),
                target_count=len(all_target_leads))

            # Add target leads to campaign
            valid_leads_count = 0
            for lead_id in all_target_leads:
                try:
                    lead = Lead.objects.get(id=lead_id)
                    campaign.target_leads.add(lead)
                    valid_leads_count += 1
                except (Lead.DoesNotExist, ValueError):
                    continue

            if valid_leads_count == 0:
                return Response({'error': 'No valid target leads found'},
                                status=status.HTTP_400_BAD_REQUEST)

            # Store CTA text temporarily for email sending
            if cta_text:
                campaign._temp_cta_text = cta_text

            # Send emails
            result = campaign.send_emails()

            serializer = self.get_serializer(campaign)
            return Response(
                {
                    'success':
                    True,
                    'campaign':
                    serializer.data,
                    'campaign_id':
                    campaign.id,
                    'message':
                    result.get('message', 'Campaign launched successfully'),
                    'emails_sent':
                    result.get('emails_sent', 0),
                    'failed_count':
                    result.get('failed_count', 0),
                    'smtp_responses':
                    result.get('smtp_responses', []),
                    'smtp_details':
                    result.get('smtp_details', {}),
                    'log_file':
                    result.get('log_file', '')
                },
                status=status.HTTP_201_CREATED)

        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            print(f"Campaign launch error: {error_details}")
            return Response(
                {
                    'error': f'Failed to launch campaign: {str(e)}',
                    'details': error_details
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get'])
    def real_time_stats(self, request, pk=None):
        """Get real-time stats for a campaign"""
        try:
            from django.db import connection

            # Ensure database connection is alive
            connection.ensure_connection()

            campaign = self.get_object()

            # Get tracking data from EmailTracking model with connection handling
            try:
                from django.db import models as db_models
                tracking_records = EmailTracking.objects.filter(
                    campaign=campaign)
                total_opened = tracking_records.filter(
                    open_count__gt=0).count()
                total_clicked = tracking_records.filter(
                    click_count__gt=0).count()

                # Get aggregate data safely
                open_sum = tracking_records.aggregate(
                    total=db_models.Sum('open_count'))['total'] or 0
                click_sum = tracking_records.aggregate(
                    total=db_models.Sum('click_count'))['total'] or 0

            except Exception as db_error:
                print(f"Database error in real_time_stats: {str(db_error)}")
                # Use campaign stored values as fallback
                total_opened = campaign.emails_opened or 0
                total_clicked = campaign.emails_clicked or 0
                open_sum = total_opened
                click_sum = total_clicked

            total_sent = campaign.emails_sent or 0

            # Update campaign stats in real-time
            try:
                campaign.emails_opened = total_opened
                campaign.emails_clicked = total_clicked
                campaign.save(
                    update_fields=['emails_opened', 'emails_clicked'])
            except Exception as save_error:
                print(f"Error saving campaign stats: {str(save_error)}")

            # Calculate rates
            open_rate = (total_opened / total_sent *
                         100) if total_sent > 0 else 0
            click_rate = (total_clicked / total_sent *
                          100) if total_sent > 0 else 0

            stats = {
                'campaign_id':
                campaign.id,
                'campaign_name':
                campaign.name,
                'emails_sent':
                total_sent,
                'emails_opened':
                total_opened,
                'emails_clicked':
                total_clicked,
                'open_rate':
                round(open_rate, 2),
                'click_rate':
                round(click_rate, 2),
                'status':
                campaign.status,
                'sent_date':
                campaign.sent_date.isoformat() if campaign.sent_date else None,
                'total_opens':
                open_sum,
                'total_clicks':
                click_sum
            }

            return Response(stats)

        except Exception as e:
            print(f"Error in real_time_stats: {str(e)}")
            return Response(
                {'error': f'Failed to get campaign stats: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get'])
    def tracking_details(self, request, pk=None):
        """Get detailed tracking information for a campaign"""
        try:
            campaign = self.get_object()

            # Get all tracking records for this campaign
            tracking_records = EmailTracking.objects.filter(
                campaign=campaign).select_related('lead')

            tracking_data = []
            for tracking in tracking_records:
                tracking_data.append({
                    'tracking_id':
                    str(tracking.tracking_id),
                    'lead_id':
                    tracking.lead.id if tracking.lead else None,
                    'lead_name':
                    f"{tracking.lead.company.name}"
                    if tracking.lead and tracking.lead.company else 'Unknown',
                    'contact_email':
                    tracking.lead.contact.email
                    if tracking.lead and tracking.lead.contact else 'Unknown',
                    'open_count':
                    tracking.open_count,
                    'click_count':
                    tracking.click_count,
                    'first_opened':
                    tracking.first_opened.isoformat()
                    if tracking.first_opened else None,
                    'last_opened':
                    tracking.last_opened.isoformat()
                    if tracking.last_opened else None,
                    'first_clicked':
                    tracking.first_clicked.isoformat()
                    if tracking.first_clicked else None,
                    'last_clicked':
                    tracking.last_clicked.isoformat()
                    if tracking.last_clicked else None,
                    'user_agent':
                    tracking.user_agent,
                    'ip_address':
                    tracking.ip_address
                })

            return Response({
                'campaign_id': campaign.id,
                'campaign_name': campaign.name,
                'total_tracking_records': len(tracking_data),
                'tracking_details': tracking_data
            })

        except Exception as e:
            return Response(
                {'error': f'Failed to get tracking details: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET','POST'])
@permission_classes([AllowAny])
def get_history(request):
    """Get history for leads or opportunities"""
    try:
        lead_id = request.data.get('lead_id')
        entity_type = request.data.get('entity_type')
        entity_id = request.data.get('entity_id')

        if lead_id:
            # Get lead history
            try:
                lead = Lead.objects.get(id=lead_id)
                history_entries = lead.history_entries.all().order_by(
                    '-timestamp')
                serializer = LeadHistorySerializer(history_entries, many=True)
                return Response(serializer.data)
            except Lead.DoesNotExist:
                return Response({'error': 'Lead not found'},
                                status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response([], status=status.HTTP_200_OK)

        elif entity_type == 'opportunity' and entity_id:
            # Get opportunity history
            try:
                opportunity = Opportunity.objects.get(id=entity_id)
                activities = opportunity.activities.all().order_by(
                    '-created_at')
                activity_data = []

                for activity in activities:
                    activity_data.append({
                        'id':
                        activity.id,
                        'type':
                        activity.type,
                        'action':
                        activity.get_type_display(),
                        'details':
                        activity.description,
                        'timestamp':
                        activity.created_at.isoformat(),
                        'user_name':
                        activity.created_by.get_full_name()
                        if activity.created_by else 'System',
                        'date':
                        activity.date.isoformat() if activity.date else ''
                    })

                return Response(activity_data)
            except Opportunity.DoesNotExist:
                return Response({'error': 'Opportunity not found'},
                                status=status.HTTP_404_NOT_FOUND)

        return Response({'error': 'Invalid parameters'},
                        status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def track_email_open(request, tracking_id):
    """Track email opens via tracking pixel"""
    try:
        print(f"🔵 OPEN TRACKING: Request received for {tracking_id}")
        print(
            f"🔵 OPEN TRACKING: User-Agent: {request.META.get('HTTP_USER_AGENT', 'None')}"
        )
        print(
            f"🔵 OPEN TRACKING: IP: {request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', 'None'))}"
        )

        tracking = get_object_or_404(EmailTracking, tracking_id=tracking_id)

        # Update open tracking
        now = timezone.now()
        was_first_open = not tracking.first_opened

        if not tracking.first_opened:
            tracking.first_opened = now
        tracking.last_opened = now
        tracking.open_count += 1

        # Get user agent and IP
        tracking.user_agent = request.META.get('HTTP_USER_AGENT',
                                               '')[:500]  # Limit length
        tracking.ip_address = request.META.get(
            'HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', ''))

        tracking.save()

        # Update campaign stats only if this is the first open for this lead
        if was_first_open:
            campaign = tracking.campaign
            # Count unique recipients who have opened at least once
            unique_opens = campaign.email_tracking.filter(first_opened__isnull=False).count()
            campaign.emails_opened = unique_opens
            campaign.save(update_fields=['emails_opened'])

        print(
            f"🟢 OPEN TRACKING SUCCESS: {tracking_id} for campaign {campaign.name}"
        )
        print(
            f"🟢 OPEN TRACKING: Open count: {tracking.open_count}, Campaign opens: {campaign.emails_opened}"
        )
        logger.info(
            f"Email open tracked: {tracking_id} for campaign {campaign.name} (first={was_first_open})"
        )

        # Return 1x1 transparent pixel
        from django.http import HttpResponse
        pixel_data = b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\x21\xF9\x04\x01\x00\x00\x00\x00\x2C\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x04\x01\x00\x3B'
        response = HttpResponse(pixel_data, content_type='image/gif')
        response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response['Pragma'] = 'no-cache'
        response['Expires'] = '0'
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET'
        response['Access-Control-Allow-Headers'] = '*'
        return response

    except EmailTracking.DoesNotExist:
        print(f"🔴 OPEN TRACKING ERROR: Tracking not found for {tracking_id}")
        logger.error(f"Email tracking not found: {tracking_id}")
        # Still return pixel to avoid broken images
        from django.http import HttpResponse
        pixel_data = b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\x21\xF9\x04\x01\x00\x00\x00\x00\x2C\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x04\x01\x00\x3B'
        return HttpResponse(pixel_data, content_type='image/gif')
    except Exception as e:
        print(f"🔴 OPEN TRACKING ERROR: {str(e)}")
        logger.error(f"Error tracking email open: {str(e)}")
        from django.http import HttpResponse
        pixel_data = b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x00\x00\x21\xF9\x04\x01\x00\x00\x00\x00\x2C\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x04\x01\x00\x3B'
        return HttpResponse(pixel_data, content_type='image/gif')


@api_view(['GET'])
@permission_classes([AllowAny])
def track_email_click(request, tracking_id):
    """Track email clicks and redirect to target URL"""
    try:
        tracking = get_object_or_404(EmailTracking, tracking_id=tracking_id)
        target_url = request.GET.get('url', '')

        if not target_url:
            return HttpResponseRedirect(
                'https://soarai.com')  # Default redirect

        # Decode the URL
        original_url = urllib.parse.unquote(target_url)

        # Find and update tracking record
        try:
            tracking = EmailTracking.objects.get(tracking_id=tracking_id)
            tracking.click_count += 1
            tracking.last_clicked = timezone.now()
            if not tracking.first_clicked:
                tracking.first_clicked = timezone.now()

            # Capture user agent and IP
            tracking.user_agent = request.META.get('HTTP_USER_AGENT',
                                                   '')[:500]  # Limit length
            tracking.ip_address = request.META.get('REMOTE_ADDR')
            tracking.save()

            logger.info(
                f"Email click tracked: {tracking_id} -> {original_url}")
        except EmailTracking.DoesNotExist:
            logger.warning(f"Tracking record not found: {tracking_id}")

        # Redirect to original URL
        return HttpResponseRedirect(original_url)

    except Exception as e:
        logger.error(f"Error tracking email click: {str(e)}")
        return HttpResponseRedirect('https://soarai.com')  # Safe fallback


@api_view(['GET'])
@permission_classes([AllowAny])
def check_smtp_status(request):
    """Check SMTP server connection status"""
    try:
        from django.core.mail import get_connection
        from django.conf import settings

        # Test SMTP connection
        connection = get_connection()
        connection.open()
        connection.close()

        return Response({
            'status': 'connected',
            'message': f'SMTP server ({settings.EMAIL_HOST}) is accessible',
            'backend': settings.EMAIL_BACKEND,
            'host': settings.EMAIL_HOST,
            'port': settings.EMAIL_PORT,
            'use_tls': settings.EMAIL_USE_TLS,
        })

    except Exception as e:
        return Response(
            {
                'status': 'error',
                'message': f'SMTP connection failed: {str(e)}',
                'backend': getattr(settings, 'EMAIL_BACKEND', 'unknown'),
                'host': getattr(settings, 'EMAIL_HOST', 'unknown'),
                'port': getattr(settings, 'EMAIL_PORT', 'unknown'),
            },
            status=500)


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Health check endpoint to verify server status"""
    try:
        return Response(
            {
                'status': 'healthy',
                'message': 'SOAR Backend API is running',
                'timestamp': timezone.now().isoformat()
            },
            status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        },
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def campaign_analytics(request):
    """Get campaign analytics data"""
    try:
        campaigns = EmailCampaign.objects.all()
        analytics_data = []

        for campaign in campaigns:
            open_rate = (campaign.emails_opened / campaign.emails_sent *
                         100) if campaign.emails_sent > 0 else 0
            click_rate = (campaign.emails_clicked / campaign.emails_sent *
                          100) if campaign.emails_sent > 0 else 0

            analytics_data.append({
                'id': campaign.id,
                'name': campaign.name,
                'status': campaign.status,
                'emails_sent': campaign.emails_sent,
                'emails_opened': campaign.emails_opened,
                'emails_clicked': campaign.emails_clicked,
                'open_rate': round(open_rate, 2),
                'click_rate': round(click_rate, 2),
                'created_at': campaign.created_at
            })

        return Response({'success': True, 'analytics': analytics_data})
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        },
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer

    def get_queryset(self):
        """Return contracts with company info"""
        return Contract.objects.select_related('company').all().order_by(
            '-created_at')

    def get_object(self):
        """Get contract by ID or contract_number"""
        lookup_value = self.kwargs.get('pk')

        try:
            # First try to get by database ID
            if lookup_value.isdigit():
                return Contract.objects.select_related('company').get(
                    id=int(lookup_value))
            else:
                # Try to get by contract_number
                return Contract.objects.select_related('company').get(
                    contract_number=lookup_value)
        except Contract.DoesNotExist:
            # Fallback to default behavior
            return super().get_object()

    def list(self, request, *args, **kwargs):
        """Override list to return formatted contract data"""
        try:
            # Add request tracking
            print(f"ContractViewSet.list called - Request ID: {id(request)}")

            # Get all contracts with related company data
            contracts = Contract.objects.select_related(
                'company').all().order_by('-created_at')

            print(
                f"Database query executed - Found {contracts.count()} contracts"
            )

            # If no contracts found, return empty array
            if not contracts.exists():
                print("No contracts found in database")
                return Response([], status=200)

            # Format data for frontend compatibility
            formatted_contracts = []
            for contract in contracts:
                try:
                    # Safely handle the formatting with more defensive checks
                    contract_id = getattr(
                        contract, 'contract_number',
                        None) or f"CTR-{getattr(contract, 'id', 'unknown')}"
                    company_name = getattr(
                        contract.company, 'name', 'Unknown Company'
                    ) if contract.company else 'Unknown Company'

                    formatted_contract = {
                        'id':
                        contract_id,
                        'vendor':
                        company_name,
                        'client':
                        getattr(contract, 'client_department', None)
                        or 'SOAR-AI Airlines',
                        'type':
                        getattr(contract, 'title', None) or 'Contract',
                        'value':
                        float(getattr(contract, 'value', 0)) if getattr(
                            contract, 'value', None) else 0,
                        'status':
                        getattr(contract, 'status', 'draft'),
                        'startDate':
                        contract.start_date.strftime('%Y-%m-%d') if getattr(
                            contract, 'start_date', None) else None,
                        'endDate':
                        contract.end_date.strftime('%Y-%m-%d') if getattr(
                            contract, 'end_date', None) else None,
                        'signedDate':
                        None,
                        'progress':
                        75 if getattr(contract, 'status', '') == 'active' else
                        50 if getattr(contract, 'status',
                                      '') == 'pending_signature' else 25,
                        'nextAction':
                        self._get_next_action(
                            getattr(contract, 'status', 'draft')),
                        'documents':
                        1,
                        'breachRisk':
                        self._calculate_breach_risk(contract),
                        'breachCount':
                        0,  # Simplified for now to avoid errors
                        'parties': [company_name],
                        'attachedOffer':
                        None,
                        'milestones': [{
                            'name':
                            'Contract Creation',
                            'date':
                            contract.start_date.strftime('%Y-%m-%d')
                            if getattr(contract, 'start_date', None) else None,
                            'status':
                            'completed'
                        }],
                        'comments':
                        getattr(contract, 'comments', []) if isinstance(
                            getattr(contract, 'comments', []), list) else [],
                        'attachments':
                        self._get_contract_documents_safe(contract),
                        'lastActivity':
                        contract.updated_at.strftime('%Y-%m-%d') if getattr(
                            contract, 'updated_at', None) else None,
                        'performanceScore':
                        85,
                        'slaCompliance':
                        92,
                        'customerSatisfaction':
                        4.2,
                        'costEfficiency':
                        88,
                        'breachHistory': [],
                        'marketPosition':
                        'Preferred',
                        'alternativeVendors': [],
                        'financialHealth':
                        'Good',
                        'technicalCapability':
                        'Advanced',
                        'relationshipScore':
                        87,
                        'terms':
                        getattr(contract, 'terms', None)
                        or 'Standard terms and conditions',
                        'description':
                        f"Contract with {company_name}"
                    }
                    formatted_contracts.append(formatted_contract)
                    print(f"Successfully formatted contract: {contract_id}")

                except Exception as contract_error:
                    print(
                        f"Error formatting contract {getattr(contract, 'id', 'unknown')}: {str(contract_error)}"
                    )
                    # Continue processing other contracts instead of failing completely
                    continue

            print(
                f"Successfully formatted {len(formatted_contracts)} contracts")
            return Response(formatted_contracts, status=200)

        except Exception as e:
            print(f"Error in ContractViewSet.list: {str(e)}")
            import traceback
            traceback.print_exc()
            # Return a proper error response instead of 500
            return Response(
                {
                    'error': 'Failed to fetch contracts',
                    'detail': str(e)
                },
                status=500)

    def create(self, request, *args, **kwargs):
        """Create a new contract"""
        try:
            data = request.data
            print(f"Contract creation data received: {data}")

            # Find or create company
            company_name = data.get('company_name', '')
            company_email = data.get('company_email', '')

            if not company_name:
                return Response({'error': 'Company name is required'},
                                status=status.HTTP_400_BAD_REQUEST)

            # Try to find existing company or create new one
            company, created = Company.objects.get_or_create(
                name=company_name,
                defaults={
                    'email': company_email,
                    'industry': 'other',
                    'location': 'Unknown',
                    'size': 'medium',
                    'is_active': True
                })

            # Generate contract number
            import uuid
            contract_number = f"CTR-{timezone.now().strftime('%Y')}-{str(uuid.uuid4())[:8].upper()}"

            # Validate contract type
            contract_type = data.get('contract_type', 'corporate_travel')
            valid_types = [choice[0] for choice in Contract.CONTRACT_TYPES]
            if contract_type not in valid_types:
                contract_type = 'other'

            # Parse and validate dates
            from datetime import datetime
            start_date = None
            end_date = None

            try:
                if data.get('start_date'):
                    if isinstance(data.get('start_date'), str):
                        start_date = datetime.strptime(data.get('start_date'),
                                                       '%Y-%m-%d').date()
                    else:
                        start_date = data.get('start_date')

                if data.get('end_date'):
                    if isinstance(data.get('end_date'), str):
                        end_date = datetime.strptime(data.get('end_date'),
                                                     '%Y-%m-%d').date()
                    else:
                        end_date = data.get('end_date')
            except ValueError as date_error:
                return Response(
                    {'error': f'Invalid date format: {str(date_error)}'},
                    status=status.HTTP_400_BAD_REQUEST)

            # Validate required fields before creation
            if not start_date or not end_date:
                return Response(
                    {'error': 'Both start_date and end_date are required'},
                    status=status.HTTP_400_BAD_REQUEST)

            # Ensure value is a valid number
            try:
                contract_value = float(data.get('value', 0))
                if contract_value < 0:
                    contract_value = 0
            except (ValueError, TypeError):
                contract_value = 0

            # Create contract with all required fields - ensuring single insertion
            contract_data = {
                'company':
                company,
                'contract_number':
                contract_number,
                'title':
                data.get('title', f"Contract - {company_name}"),
                'contract_type':
                contract_type,
                'status':
                'draft',
                'start_date':
                start_date,
                'end_date':
                end_date,
                'value':
                contract_value,
                'terms':
                data.get(
                    'terms',
                    'Standard corporate travel agreement terms and conditions'
                ),
                'renewal_terms':
                data.get(
                    'renewal_terms',
                    'Auto-renewal for 12 months unless terminated with 30 days notice'
                ),
                'auto_renewal':
                data.get('auto_renewal', False),
                'notice_period_days':
                int(data.get('notice_period_days', 30)),
                'risk_score':
                int(data.get('risk_score', 0)),
                'sla_requirements':
                data.get('sla_requirements', ''),
                'payment_terms_days':
                self._get_payment_terms_days(
                    data.get('payment_terms', 'net_30')),
                'performance_bonus':
                data.get('performance_bonus', False),
                'exclusivity':
                data.get('exclusivity', False),
                'custom_clauses':
                data.get('custom_clauses', ''),
                'client_department':
                data.get('client_department', ''),
                'company_email':
                company_email or ''
            }

            # Create single contract record
            contract = Contract.objects.create(**contract_data)

            serializer = self.get_serializer(contract)
            return Response(
                {
                    'success': True,
                    'message':
                    f'Contract {contract.contract_number} created successfully',
                    'contract': serializer.data
                },
                status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Error creating contract: {str(e)}")
            return Response({'error': f'Failed to create contract: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _get_payment_terms_days(self, payment_terms):
        """Convert payment terms string to days"""
        terms_mapping = {
            'net_15': 15,
            'net_30': 30,
            'net_45': 45,
            'net_60': 60,
            'Net 15': 15,
            'Net 30': 30,
            'Net 45': 45,
            'Net 60': 60
        }
        return terms_mapping.get(payment_terms, 30)

    def _get_next_action(self, status):
        """Get appropriate next action based on contract status"""
        action_mapping = {
            'draft': 'Review contract terms',
            'pending_signature': 'Obtain signatures',
            'active': 'Monitor performance',
            'expired': 'Initiate renewal',
            'terminated': 'Archive contract',
            'at_risk': 'Risk mitigation',
            'breach': 'Resolve breach'
        }
        return action_mapping.get(status, 'Review contract')

    def _calculate_breach_risk(self, contract):
        """Calculate breach risk level based on contract data"""
        if contract.risk_score >= 7:
            return 'High'
        elif contract.risk_score >= 4:
            return 'Medium'
        else:
            return 'Low'

    @action(detail=False, methods=['get'])
    def renewal_alerts(self, request):
        days_ahead = int(request.query_params.get('days', 30))
        alert_date = timezone.now().date() + timedelta(days=days_ahead)

        contracts = self.queryset.filter(end_date__lte=alert_date,
                                         status='active').order_by('end_date')

        serializer = self.get_serializer(contracts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def at_risk(self, request):
        contracts = self.queryset.filter(
            Q(status='at_risk') | Q(risk_score__gte=7)).order_by('-risk_score')

        serializer = self.get_serializer(contracts, many=True)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        """Update an existing contract"""
        try:
            instance = self.get_object()
            data = request.data
            print(
                f"Updating contract {instance.contract_number} with data: {data}"
            )

            # Update company information if provided
            if data.get('company_name'):
                company_name = data.get('company_name')
                company_email = data.get('company_email', '')

                # Update or create company
                company, created = Company.objects.get_or_create(
                    name=company_name,
                    defaults={
                        'email': company_email,
                        'industry': 'other',
                        'location': 'Unknown',
                        'size': 'medium',
                        'is_active': True
                    })
                instance.company = company

            # Update contract fields
            if data.get('title'):
                instance.title = data.get('title')

            if data.get('contract_type'):
                contract_type = data.get('contract_type')
                valid_types = [choice[0] for choice in Contract.CONTRACT_TYPES]
                if contract_type in valid_types:
                    instance.contract_type = contract_type

            if data.get('client_department'):
                instance.client_department = data.get('client_department')

            if data.get('value') is not None:
                try:
                    instance.value = float(data.get('value'))
                except (ValueError, TypeError):
                    pass

            # Handle date updates
            if data.get('start_date'):
                try:
                    from datetime import datetime
                    if isinstance(data.get('start_date'), str):
                        instance.start_date = datetime.strptime(
                            data.get('start_date'), '%Y-%m-%d').date()
                    else:
                        instance.start_date = data.get('start_date')
                except ValueError:
                    pass

            if data.get('end_date'):
                try:
                    from datetime import datetime
                    if isinstance(data.get('end_date'), str):
                        instance.end_date = datetime.strptime(
                            data.get('end_date'), '%Y-%m-%d').date()
                    else:
                        instance.end_date = data.get('end_date')
                except ValueError:
                    pass

            # Update other fields
            if data.get('terms'):
                instance.terms = data.get('terms')

            if data.get('sla_requirements'):
                instance.sla_requirements = data.get('sla_requirements')

            if data.get('payment_terms_days'):
                instance.payment_terms_days = int(
                    data.get('payment_terms_days'))

            if data.get('auto_renewal') is not None:
                instance.auto_renewal = data.get('auto_renewal')

            if data.get('performance_bonus') is not None:
                instance.performance_bonus = data.get('performance_bonus')

            if data.get('exclusivity') is not None:
                instance.exclusivity = data.get('exclusivity')

            if data.get('custom_clauses'):
                instance.custom_clauses = data.get('custom_clauses')

            if data.get('company_email'):
                instance.company_email = data.get('company_email')

            # Save the updated instance
            instance.save()

            # Return the updated data
            serializer = self.get_serializer(instance)
            return Response(
                {
                    'success': True,
                    'message':
                    f'Contract {instance.contract_number} updated successfully',
                    'contract': serializer.data
                },
                status=status.HTTP_200_OK)

        except Contract.DoesNotExist:
            return Response({'error': 'Contract not found'},
                            status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error updating contract: {str(e)}")
            return Response({'error': f'Failed to update contract: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'])
    def upload_document(self, request, pk=None):
        """Upload a document for a specific contract"""
        try:
            contract = self.get_object()

            if 'document' not in request.FILES:
                return Response({'error': 'No file provided'},
                                status=status.HTTP_400_BAD_REQUEST)

            uploaded_file = request.FILES['document']

            # Validate file type
            allowed_extensions = [
                '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt', '.rtf'
            ]
            allowed_mime_types = [
                'application/pdf', 'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'text/plain', 'application/rtf'
            ]

            file_extension = uploaded_file.name.lower().split('.')[-1]
            if f'.{file_extension}' not in allowed_extensions and uploaded_file.content_type not in allowed_mime_types:
                return Response(
                    {
                        'error':
                        'Invalid file type. Only PDF, DOC, DOCX, XLS, XLSX, TXT, RTF files are allowed.'
                    },
                    status=status.HTTP_400_BAD_REQUEST)

            # Validate file size (10MB limit)
            max_size = 10 * 1024 * 1024  # 10MB
            if uploaded_file.size > max_size:
                return Response({'error': 'File size exceeds 10MB limit.'},
                                status=status.HTTP_400_BAD_REQUEST)

            # Create documents directory if it doesn't exist
            import os
            documents_dir = os.path.join('Documents', 'contracts')
            if not os.path.exists(documents_dir):
                os.makedirs(documents_dir)

            # Generate unique filename
            import uuid
            file_name = f"{contract.contract_number}_{uuid.uuid4().hex[:8]}_{uploaded_file.name}"
            file_path = os.path.join(documents_dir, file_name)

            # Save the file
            with open(file_path, 'wb+') as destination:
                for chunk in uploaded_file.chunks():
                    destination.write(chunk)

            # Store document metadata in contract's custom_clauses field as JSON
            import json
            document_metadata = {
                'name': uploaded_file.name,
                'file_path': file_path,
                'size': uploaded_file.size,
                'content_type': uploaded_file.content_type,
                'uploaded_at': timezone.now().isoformat(),
                'document_id': uuid.uuid4().hex[:8]
            }

            # Get existing documents from custom_clauses
            existing_docs = []
            if contract.custom_clauses:
                try:
                    # Try to parse existing documents
                    if contract.custom_clauses.startswith('['):
                        existing_docs = json.loads(contract.custom_clauses)
                    else:
                        # If custom_clauses is not JSON, preserve it as text
                        existing_docs = [{
                            'type': 'text',
                            'content': contract.custom_clauses
                        }]
                except json.JSONDecodeError:
                    # If it's not JSON, treat as text and preserve it
                    existing_docs = [{
                        'type': 'text',
                        'content': contract.custom_clauses
                    }]

            # Add new document
            existing_docs.append({
                'type': 'document',
                'metadata': document_metadata
            })

            # Update contract with new document list
            contract.custom_clauses = json.dumps(existing_docs)
            contract.save()

            return Response(
                {
                    'success': True,
                    'message':
                    f'Document {uploaded_file.name} uploaded successfully',
                    'document': {
                        'name': uploaded_file.name,
                        'size': f"{uploaded_file.size / 1024 / 1024:.2f} MB",
                        'uploadDate': timezone.now().strftime('%Y-%m-%d'),
                        'type': self._get_document_type(uploaded_file.name),
                        'file_path': file_path
                    }
                },
                status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': f'Failed to upload document: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get'])
    def get_documents(self, request, pk=None):
        """Get all documents for a specific contract"""
        try:
            contract = self.get_object()
            documents = []

            import os
            import glob
            from datetime import datetime

            # First, try to get documents from filesystem
            search_patterns = [
                f"Documents/contracts/{contract.contract_number}_*",
                f"contract_documents/{contract.contract_number}_*"
            ]

            for pattern in search_patterns:
                for file_path in glob.glob(pattern):
                    if os.path.isfile(file_path):
                        file_name = os.path.basename(file_path)
                        file_size = os.path.getsize(file_path)
                        file_mtime = os.path.getmtime(file_path)

                        # Extract document_id and original name from filename
                        # Pattern: contract_number_document_id_original_name
                        parts = file_name.split('_', 2)
                        document_id = parts[1] if len(
                            parts) >= 2 else file_name
                        original_name = parts[2] if len(
                            parts) >= 3 else file_name

                        documents.append({
                            'name':
                            original_name,
                            'size':
                            f"{file_size / 1024 / 1024:.2f} MB",
                            'uploadDate':
                            datetime.fromtimestamp(file_mtime).strftime(
                                '%Y-%m-%d'),
                            'type':
                            self._get_document_type(original_name),
                            'file_path':
                            file_path,
                            'document_id':
                            document_id
                        })

            # If no files found in filesystem, try to get from custom_clauses metadata
            if not documents and contract.custom_clauses:
                try:
                    import json
                    if contract.custom_clauses.startswith('['):
                        clauses_data = json.loads(contract.custom_clauses)
                        if isinstance(clauses_data, list):
                            for item in clauses_data:
                                if isinstance(item, dict) and item.get(
                                        'type') == 'document':
                                    metadata = item.get('metadata', {})
                                    documents.append({
                                        'name':
                                        metadata.get('name', ''),
                                        'size':
                                        f"{metadata.get('size', 0) / 1024 / 1024:.2f} MB",
                                        'uploadDate':
                                        metadata.get('uploaded_at',
                                                     '').split('T')[0]
                                        if metadata.get('uploaded_at') else '',
                                        'type':
                                        self._get_document_type(
                                            metadata.get('name', '')),
                                        'file_path':
                                        metadata.get('file_path', ''),
                                        'document_id':
                                        metadata.get('document_id', '')
                                    })
                except (json.JSONDecodeError, AttributeError):
                    # If custom_clauses is not JSON, ignore
                    pass

            return Response({'success': True, 'documents': documents})

        except Exception as e:
            return Response(
                {'error': f'Failed to retrieve documents: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _get_document_type(self, filename):
        """Get document type based on file extension"""
        extension = filename.lower().split('.')[-1]
        type_mapping = {
            'pdf': 'PDF Document',
            'doc': 'Word Document',
            'docx': 'Word Document',
            'xls': 'Excel Spreadsheet',
            'xlsx': 'Excel Spreadsheet',
            'txt': 'Text Document',
            'rtf': 'Rich Text Document'
        }
        return type_mapping.get(extension, 'Document')

    def _get_contract_documents_safe(self, contract):
        """Safely get documents for a contract from filesystem and metadata"""
        try:
            return self._get_contract_documents(contract)
        except Exception as e:
            print(
                f"Error getting documents for contract {getattr(contract, 'id', 'unknown')}: {str(e)}"
            )
            return []  # Return empty list on error

    def _get_contract_documents(self, contract):
        """Get documents for a contract from filesystem and metadata"""
        documents = []

        try:
            import os
            import glob
            from datetime import datetime

            contract_number = getattr(contract, 'contract_number', None)
            if not contract_number:
                return documents

            # Search for files in filesystem
            search_patterns = [
                f"Documents/contracts/{contract_number}_*",
                f"contract_documents/{contract_number}_*"
            ]

            for pattern in search_patterns:
                try:
                    matching_files = glob.glob(pattern)
                    for file_path in matching_files:
                        if os.path.isfile(file_path):
                            file_name = os.path.basename(file_path)
                            file_size = os.path.getsize(file_path)
                            file_mtime = os.path.getmtime(file_path)

                            # Extract document_id and original name from filename
                            parts = file_name.split('_', 2)
                            document_id = parts[1] if len(
                                parts) >= 2 else file_name
                            original_name = parts[2] if len(
                                parts) >= 3 else file_name

                            documents.append({
                                'name':
                                original_name,
                                'size':
                                f"{file_size / 1024 / 1024:.2f} MB",
                                'uploadDate':
                                datetime.fromtimestamp(file_mtime).strftime(
                                    '%Y-%m-%d'),
                                'type':
                                self._get_document_type(original_name),
                                'file_path':
                                file_path,
                                'document_id':
                                document_id
                            })
                except Exception as pattern_error:
                    print(
                        f"Error processing pattern {pattern}: {str(pattern_error)}"
                    )
                    continue

            # If no files found, try to get from custom_clauses metadata
            if not documents and contract.custom_clauses:
                try:
                    import json
                    if contract.custom_clauses.startswith('['):
                        clauses_data = json.loads(contract.custom_clauses)
                        if isinstance(clauses_data, list):
                            for item in clauses_data:
                                if isinstance(item, dict) and item.get(
                                        'type') == 'document':
                                    metadata = item.get('metadata', {})
                                    documents.append({
                                        'name':
                                        metadata.get('name', ''),
                                        'size':
                                        f"{metadata.get('size', 0) / 1024 / 1024:.2f} MB",
                                        'uploadDate':
                                        metadata.get('uploaded_at',
                                                     '').split('T')[0]
                                        if metadata.get('uploaded_at') else '',
                                        'type':
                                        self._get_document_type(
                                            metadata.get('name', '')),
                                        'file_path':
                                        metadata.get('file_path', ''),
                                        'document_id':
                                        metadata.get('document_id', '')
                                    })
                except (json.JSONDecodeError, AttributeError) as json_error:
                    print(
                        f"Error parsing custom_clauses JSON: {str(json_error)}"
                    )
                    pass

        except Exception as e:
            print(f"Error in _get_contract_documents: {str(e)}")

        return documents

    @action(detail=True, methods=['get'])
    def download_document(self, request, pk=None):
        """Download a specific document for a contract"""
        try:
            contract = self.get_object()
            document_id = request.query_params.get('document_id')

            if not document_id:
                return Response({'error': 'Document ID is required'},
                                status=status.HTTP_400_BAD_REQUEST)

            import os
            import glob

            # Look for files in both possible directories
            search_patterns = [
                f"Documents/contracts/{contract.contract_number}_{document_id}_*",
                f"contract_documents/{contract.contract_number}_{document_id}_*",
                f"Documents/contracts/*{document_id}*",
                f"contract_documents/*{document_id}*"
            ]

            file_path = None
            original_name = None

            # Search for the file using different patterns
            for pattern in search_patterns:
                matching_files = glob.glob(pattern)
                if matching_files:
                    file_path = matching_files[0]  # Take the first match
                    original_name = os.path.basename(file_path)
                    # Extract original name from filename pattern: contract_id_document_id_original_name
                    parts = original_name.split('_', 2)
                    if len(parts) >= 3:
                        original_name = parts[2]
                    break

            # If still not found, try to get from custom_clauses metadata
            if not file_path and contract.custom_clauses:
                try:
                    import json
                    if contract.custom_clauses.startswith('['):
                        clauses_data = json.loads(contract.custom_clauses)
                        if isinstance(clauses_data, list):
                            for item in clauses_data:
                                if (isinstance(item, dict)
                                        and item.get('type') == 'document'
                                        and item.get('metadata',
                                                     {}).get('document_id')
                                        == document_id):
                                    metadata = item.get('metadata', {})
                                    file_path = metadata.get('file_path')
                                    original_name = metadata.get('name')
                                    break
                except (json.JSONDecodeError, AttributeError):
                    pass

            if not file_path or not os.path.exists(file_path):
                return Response(
                    {
                        'error':
                        f'Document file not found. Searched for document_id: {document_id} in contract: {contract.contract_number}'
                    },
                    status=status.HTTP_404_NOT_FOUND)

            # Serve the file for viewing (inline) instead of download
            from django.http import FileResponse
            from django.utils.encoding import smart_str
            import mimetypes

            try:
                # Determine content type based on file extension
                content_type, _ = mimetypes.guess_type(file_path)
                if not content_type:
                    content_type = 'application/octet-stream'

                response = FileResponse(open(file_path, 'rb'),
                                        content_type=content_type)

                # Set headers for inline viewing instead of download
                response[
                    'Content-Disposition'] = f'inline; filename="{smart_str(original_name or os.path.basename(file_path))}"'

                # Add headers to prevent caching issues
                response[
                    'Cache-Control'] = 'no-cache, no-store, must-revalidate'
                response['Pragma'] = 'no-cache'
                response['Expires'] = '0'

                return response
            except Exception as e:
                return Response(
                    {'error': f'Failed to serve document: {str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            return Response(
                {'error': f'Failed to download document: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        """Add a comment to a specific contract"""
        try:
            contract = self.get_object()
            comment_text = request.data.get('comment', '').strip()
            author = request.data.get('author', 'Anonymous')

            if not comment_text:
                return Response({'error': 'Comment text is required'},
                                status=status.HTTP_400_BAD_REQUEST)

            # Create comment object
            new_comment = {
                'id': len(contract.comments) + 1,
                'author': author,
                'date': timezone.now().strftime('%Y-%m-%d'),
                'content': comment_text,
                'timestamp': timezone.now().isoformat()
            }

            # Add comment to contract's comments list
            if not isinstance(contract.comments, list):
                contract.comments = []

            contract.comments.append(new_comment)
            contract.save()

            return Response(
                {
                    'success': True,
                    'message': 'Comment added successfully',
                    'comment': new_comment
                },
                status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': f'Failed to add comment: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        total_contracts = self.queryset.count()
        active_contracts = self.queryset.filter(status='active').count()
        expiring_soon = self.queryset.filter(
            end_date__lte=timezone.now().date() + timedelta(days=30),
            status='active').count()

        stats = {
            'total_contracts':
            total_contracts,
            'active_contracts':
            active_contracts,
            'expiring_soon':
            expiring_soon,
            'total_value':
            self.queryset.aggregate(total=Sum('value'))['total'] or 0,
            'average_value':
            self.queryset.aggregate(avg=Avg('value'))['avg'] or 0,
            'breach_count':
            ContractBreach.objects.filter(is_resolved=False).count()
        }

        return Response(stats)


# New helper function for updating contracts
def update_contract(request, contract_id):
    """Update an existing contract"""
    if request.method == 'PUT':
        try:
            # Get the contract to update
            contract = Contract.objects.get(id=contract_id)

            # Update contract with new data
            serializer = ContractSerializer(contract,
                                            data=request.data,
                                            partial=True)
            if serializer.is_valid():
                contract = serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(
                    {
                        'error': 'Invalid data',
                        'details': serializer.errors
                    },
                    status=status.HTTP_400_BAD_REQUEST)
        except Contract.DoesNotExist:
            return Response({'error': 'Contract not found'},
                            status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error updating contract: {str(e)}")
            return Response({'error': f'Failed to update contract: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({'error': 'Method not allowed'},
                    status=status.HTTP_405_METHOD_NOT_ALLOWED)


class ContractBreachViewSet(viewsets.ModelViewSet):
    queryset = ContractBreach.objects.all()
    serializer_class = ContractBreachSerializer

    @action(detail=False, methods=['get'])
    def active_breaches(self, request):
        breaches = self.queryset.filter(is_resolved=False).order_by(
            '-severity', '-detected_date')
        serializer = self.get_serializer(breaches, many=True)
        return Response(breaches.data)

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        breach = self.get_object()
        breach.is_resolved = True
        breach.resolved_date = timezone.now()
        breach.resolution_notes = request.data.get('notes', '')
        breach.save()

        return Response({'status': 'breach resolved'})


# Email tracking functions are defined below


@api_view(['GET'])
@permission_classes([AllowAny])
def track_email_open(request, tracking_id):
    """Track email opens via tracking pixel"""
    try:
        tracking = EmailTracking.objects.get(tracking_id=tracking_id)

        # Update open tracking
        if not tracking.first_opened:
            tracking.first_opened = timezone.now()
        tracking.last_opened = timezone.now()
        tracking.open_count += 1

        # Capture user agent and IP
        tracking.user_agent = request.META.get('HTTP_USER_AGENT', '')
        tracking.ip_address = request.META.get(
            'REMOTE_ADDR') or request.META.get('HTTP_X_FORWARDED_FOR',
                                               '').split(',')[0].strip()

        tracking.save()

        # Return a 1x1 transparent GIF pixel
        from django.http import HttpResponse
        import base64

        # 1x1 transparent GIF pixel
        pixel_data = base64.b64decode(
            'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
        response = HttpResponse(pixel_data, content_type='image/gif')
        response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response['Pragma'] = 'no-cache'
        response['Expires'] = '0'
        return response

    except EmailTracking.DoesNotExist:
        # Return pixel even if tracking not found
        from django.http import HttpResponse
        import base64
        pixel_data = base64.b64decode(
            'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
        return HttpResponse(pixel_data, content_type='image/gif')
    except Exception as e:
        logger.error(f"Error tracking email open: {str(e)}")
        from django.http import HttpResponse
        import base64
        pixel_data = base64.b64decode(
            'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
        return HttpResponse(pixel_data, content_type='image/gif')


@api_view(['GET'])
@permission_classes([AllowAny])
def track_email_click(request, tracking_id):
    """Track email clicks and redirect to original URL"""
    try:
        # Get the original URL from query parameters
        original_url = request.GET.get('url')
        if not original_url:
            return HttpResponseRedirect(
                'https://soarai.com')  # Default redirect

        # Decode the URL
        original_url = urllib.parse.unquote(original_url)

        # Find and update tracking record
        try:
            tracking = EmailTracking.objects.get(tracking_id=tracking_id)
            tracking.click_count += 1
            tracking.last_clicked = timezone.now()
            if not tracking.first_clicked:
                tracking.first_clicked = timezone.now()

            # Capture user agent and IP
            tracking.user_agent = request.META.get('HTTP_USER_AGENT',
                                                   '')[:500]  # Limit length
            tracking.ip_address = request.META.get('REMOTE_ADDR')
            tracking.save()

            logger.info(
                f"Email click tracked: {tracking_id} -> {original_url}")
        except EmailTracking.DoesNotExist:
            logger.warning(f"Tracking record not found: {tracking_id}")

        # Redirect to original URL
        return HttpResponseRedirect(original_url)

    except Exception as e:
        logger.error(f"Error tracking email click: {str(e)}")
        return HttpResponseRedirect('https://soarai.com')  # Safe fallback


@api_view(['GET'])
@permission_classes([AllowAny])
def check_smtp_status(request):
    """Check SMTP server connection status"""
    try:
        from django.core.mail import get_connection
        from django.conf import settings

        # Test SMTP connection
        connection = get_connection()
        connection.open()
        connection.close()

        return Response({
            'status': 'connected',
            'message': f'SMTP server ({settings.EMAIL_HOST}) is accessible',
            'backend': settings.EMAIL_BACKEND,
            'host': settings.EMAIL_HOST,
            'port': settings.EMAIL_PORT,
            'use_tls': settings.EMAIL_USE_TLS,
        })

    except Exception as e:
        return Response(
            {
                'status': 'error',
                'message': f'SMTP connection failed: {str(e)}',
                'backend': getattr(settings, 'EMAIL_BACKEND', 'unknown'),
                'host': getattr(settings, 'EMAIL_HOST', 'unknown'),
                'port': getattr(settings, 'EMAIL_PORT', 'unknown'),
            },
            status=500)