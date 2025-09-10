
from django.db import connection
from django.db.utils import OperationalError
from django.http import JsonResponse
import logging

logger = logging.getLogger(__name__)

class DatabaseConnectionMiddleware:
    """
    Middleware to handle database connection issues, especially SSL connection problems
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_exception(self, request, exception):
        if isinstance(exception, OperationalError):
            error_message = str(exception).lower()
            
            # Handle SSL connection issues specifically
            if any(phrase in error_message for phrase in [
                'ssl connection has been closed',
                'connection already closed',
                'server closed the connection',
                'connection was killed'
            ]):
                logger.warning(f"Database connection issue detected: {str(exception)}")
                
                # Close the connection to force reconnection
                connection.close()
                
                # Return a proper JSON error response for API endpoints
                if request.path.startswith('/api/'):
                    return JsonResponse({
                        'error': 'Database connection issue. Please try again.',
                        'details': 'Connection was reset due to inactivity.'
                    }, status=503)
        
        return None
