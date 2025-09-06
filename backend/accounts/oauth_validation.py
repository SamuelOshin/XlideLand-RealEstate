"""
Validation utilities for Google OAuth2 backend configuration
"""
import logging
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured

logger = logging.getLogger(__name__)


class GoogleOAuth2ConfigValidator:
    """Validate Google OAuth2 configuration"""
    
    REQUIRED_SETTINGS = [
        'GOOGLE_OAUTH2_CLIENT_ID',
        'GOOGLE_OAUTH2_CLIENT_SECRET',
    ]
    
    @classmethod
    def validate_configuration(cls):
        """
        Validate that all required Google OAuth2 settings are configured
        
        Raises:
            ImproperlyConfigured: If any required settings are missing or invalid
        """
        missing_settings = []
        
        # Check for required settings
        for setting_name in cls.REQUIRED_SETTINGS:
            value = getattr(settings, setting_name, None)
            
            if not value:
                missing_settings.append(setting_name)
            elif not isinstance(value, str) or not value.strip():
                missing_settings.append(f"{setting_name} (empty or invalid)")
        
        if missing_settings:
            raise ImproperlyConfigured(
                f"Missing or invalid Google OAuth2 settings: {', '.join(missing_settings)}. "
                "Please check your environment variables and settings configuration."
            )
        
        # Additional validations
        cls._validate_client_id()
        cls._validate_cors_settings()
        
        logger.info("Google OAuth2 configuration validation passed")
    
    @classmethod
    def _validate_client_id(cls):
        """Validate Google Client ID format"""
        client_id = getattr(settings, 'GOOGLE_OAUTH2_CLIENT_ID', '')
        
        if client_id and not client_id.endswith('.apps.googleusercontent.com'):
            logger.warning(
                f"Google Client ID format may be incorrect: {client_id[:20]}... "
                "Expected format: xxx.apps.googleusercontent.com"
            )
    
    @classmethod
    def _validate_cors_settings(cls):
        """Validate CORS settings for OAuth2"""
        cors_origins = getattr(settings, 'CORS_ALLOWED_ORIGINS', [])
        
        if not cors_origins:
            logger.warning(
                "CORS_ALLOWED_ORIGINS is empty. This may prevent OAuth2 from working properly."
            )
        else:
            logger.info(f"CORS configured for origins: {cors_origins}")
    
    @classmethod
    def is_configured(cls) -> bool:
        """
        Check if Google OAuth2 is properly configured
        
        Returns:
            bool: True if properly configured, False otherwise
        """
        try:
            cls.validate_configuration()
            return True
        except ImproperlyConfigured:
            return False
    
    @classmethod
    def get_configuration_status(cls) -> dict:
        """
        Get detailed configuration status
        
        Returns:
            dict: Configuration status details
        """
        status = {
            'configured': False,
            'issues': [],
            'warnings': []
        }
        
        try:
            cls.validate_configuration()
            status['configured'] = True
        except ImproperlyConfigured as e:
            status['issues'].append(str(e))
        
        # Check for warnings
        client_id = getattr(settings, 'GOOGLE_OAUTH2_CLIENT_ID', '')
        if client_id and not client_id.endswith('.apps.googleusercontent.com'):
            status['warnings'].append("Google Client ID format may be incorrect")
        
        cors_origins = getattr(settings, 'CORS_ALLOWED_ORIGINS', [])
        if not cors_origins:
            status['warnings'].append("CORS_ALLOWED_ORIGINS is not configured")
        
        return status


def validate_google_oauth2_config():
    """
    Convenience function to validate Google OAuth2 configuration
    Should be called during Django startup
    """
    try:
        GoogleOAuth2ConfigValidator.validate_configuration()
    except ImproperlyConfigured as e:
        logger.error(f"Google OAuth2 configuration error: {e}")
        if settings.DEBUG:
            logger.info(
                "To fix this:\n"
                "1. Set up Google OAuth2 credentials in Google Cloud Console\n"
                "2. Add GOOGLE_OAUTH2_CLIENT_ID and GOOGLE_OAUTH2_CLIENT_SECRET to your .env file\n"
                "3. Restart your Django server\n"
                "See docs/GOOGLE_OAUTH2_SETUP.md for detailed instructions"
            )
        raise


# Auto-validate configuration when module is imported (optional)
if hasattr(settings, 'GOOGLE_OAUTH2_CLIENT_ID'):
    try:
        validate_google_oauth2_config()
    except ImproperlyConfigured:
        # Don't fail silently in production, but allow development to continue
        if not settings.DEBUG:
            raise