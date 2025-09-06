"""
Google OAuth2 utilities for token verification and user data extraction
"""
import requests
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


class GoogleOAuth2Verifier:
    """Google OAuth2 token verification and user data extraction"""
    
    @staticmethod
    def verify_google_token(token: str) -> dict:
        """
        Verify Google ID token and extract user information
        
        Args:
            token (str): Google ID token from frontend
            
        Returns:
            dict: User information if token is valid, None otherwise
        """
        try:
            # Verify the token
            idinfo = id_token.verify_oauth2_token(
                token, 
                google_requests.Request(), 
                settings.GOOGLE_OAUTH2_CLIENT_ID
            )
            
            # Verify the issuer
            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                logger.error("Invalid token issuer")
                return None
                
            # Extract user information
            user_data = {
                'google_id': idinfo['sub'],
                'email': idinfo['email'],
                'name': idinfo.get('name', ''),
                'given_name': idinfo.get('given_name', ''),
                'family_name': idinfo.get('family_name', ''),
                'picture': idinfo.get('picture', ''),
                'email_verified': idinfo.get('email_verified', False),
                'locale': idinfo.get('locale', 'en'),
            }
            
            logger.info(f"Successfully verified Google token for user: {user_data['email']}")
            return user_data
            
        except ValueError as e:
            logger.error(f"Invalid Google token: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Error verifying Google token: {str(e)}")
            return None
    
    @staticmethod
    def verify_google_access_token(access_token: str) -> dict:
        """
        Verify Google access token using Google's tokeninfo endpoint
        
        Args:
            access_token (str): Google access token
            
        Returns:
            dict: User information if token is valid, None otherwise
        """
        try:
            # Make request to Google's tokeninfo endpoint
            response = requests.get(
                'https://www.googleapis.com/oauth2/v1/tokeninfo',
                params={'access_token': access_token},
                timeout=10
            )
            
            if response.status_code != 200:
                logger.error(f"Google tokeninfo request failed: {response.status_code}")
                return None
                
            token_data = response.json()
            
            # Verify the audience (client ID)
            if token_data.get('audience') != settings.GOOGLE_OAUTH2_CLIENT_ID:
                logger.error("Invalid token audience")
                return None
                
            # Get user profile information
            profile_response = requests.get(
                'https://www.googleapis.com/oauth2/v1/userinfo',
                params={'access_token': access_token},
                timeout=10
            )
            
            if profile_response.status_code != 200:
                logger.error(f"Google userinfo request failed: {profile_response.status_code}")
                return None
                
            profile_data = profile_response.json()
            
            user_data = {
                'google_id': profile_data.get('id'),
                'email': profile_data.get('email'),
                'name': profile_data.get('name', ''),
                'given_name': profile_data.get('given_name', ''),
                'family_name': profile_data.get('family_name', ''),
                'picture': profile_data.get('picture', ''),
                'email_verified': profile_data.get('verified_email', False),
                'locale': profile_data.get('locale', 'en'),
            }
            
            logger.info(f"Successfully verified Google access token for user: {user_data['email']}")
            return user_data
            
        except requests.RequestException as e:
            logger.error(f"Network error verifying Google token: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Error verifying Google access token: {str(e)}")
            return None


def get_google_user_data(token: str, token_type: str = 'id_token') -> dict:
    """
    Convenience function to get Google user data from token
    
    Args:
        token (str): Google token (ID token or access token)
        token_type (str): Type of token ('id_token' or 'access_token')
        
    Returns:
        dict: User data if successful, None otherwise
    """
    verifier = GoogleOAuth2Verifier()
    
    if token_type == 'id_token':
        return verifier.verify_google_token(token)
    elif token_type == 'access_token':
        return verifier.verify_google_access_token(token)
    else:
        logger.error(f"Invalid token type: {token_type}")
        return None