import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'your-secret-key-here-change-in-production')

DEBUG = True

ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'api',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'api.middleware.DatabaseConnectionMiddleware',  # Add our custom middleware
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'soar_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'soar_backend.wsgi.application'

# Database configuration
if os.getenv('DATABASE_URL'):
    # Use PostgreSQL if DATABASE_URL is available (production/Replit database)
    import dj_database_url
    
    # Parse the database URL
    db_config = dj_database_url.parse(os.getenv('DATABASE_URL'))
    
    # Add connection pooling and SSL settings for better reliability
    db_config.update({
        'CONN_MAX_AGE': 0,  # Force new connections for each request to avoid stale connections
        'CONN_HEALTH_CHECKS': True,  # Enable connection health checks
        'OPTIONS': {
            'sslmode': 'prefer',  # Use SSL but fallback to non-SSL if needed
            'connect_timeout': 10,
            'application_name': 'soar_backend',
        },
        'DISABLE_SERVER_SIDE_CURSORS': True,  # Disable server-side cursors to reduce connection overhead
    })
    
    DATABASES = {
        'default': db_config
    }
else:
    # Use SQLite for development
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS settings for React frontend
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://0.0.0.0:5173",
    "http://0.0.0.0:5174",
    "https://f08f172c-ab06-433f-aa2f-30c498986833-00-2n6bjrfy6tvjp.pike.replit.dev",
]

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Additional CORS settings
CORS_ALLOW_CREDENTIALS = True
CORS_PREFLIGHT_MAX_AGE = 86400

# Disable CSRF for API endpoints to avoid cross-origin issues
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://0.0.0.0:5173",
    "http://0.0.0.0:5174",
    "https://f08f172c-ab06-433f-aa2f-30c498986833-00-2n6bjrfy6tvjp.pike.replit.dev",
]

# REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    # Removed pagination for email campaigns to get all data at once
    # 'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    # 'PAGE_SIZE': 20,
    'DEFAULT_ORDERING': '-created_at'
}

# Email settings
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', 'agencyautofe-notify@infinitisoftware.net')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', 'yesgctuubrtchrsp')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'agencyautofe-notify@infinitisoftware.net')

# Base URL for email tracking
BASE_URL = 'https://f08f172c-ab06-433f-aa2f-30c498986833-00-2n6bjrfy6tvjp.pike.replit.dev:5173'

# Always use SMTP backend for email sending
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# Only use console backend if explicitly requested
if os.getenv('USE_CONSOLE_EMAIL_BACKEND') == 'true':
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
    print("Using console email backend - emails will be printed to console")
else:
    print("Using SMTP email backend for actual email sending")

# Logging configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'WARNING',
            'propagate': False,
        },
        'api.middleware': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}


# Domain URL for email tracking
DOMAIN_URL = 'https://f08f172c-ab06-433f-aa2f-30c498986833-00-2n6bjrfy6tvjp.pike.replit.dev'

# CSRF exemption for API endpoints to avoid CORS issues
CSRF_EXEMPT_URLS = [r'^/api/.*$']