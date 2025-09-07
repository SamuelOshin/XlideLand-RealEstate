"""
Notification services for sending emails and WhatsApp messages
"""
import logging
import requests
from typing import Dict, Any, Optional
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.html import strip_tags

logger = logging.getLogger(__name__)


class EmailNotificationService:
    """Service for sending email notifications"""
    
    @staticmethod
    def send_admin_notification(contact_instance) -> bool:
        """
        Send notification email to admin about new contact
        
        Args:
            contact_instance: Contact model instance
            
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        try:
            if not settings.SEND_EMAIL_NOTIFICATIONS:
                logger.info("Email notifications are disabled")
                return True
                
            # Render HTML template
            html_content = render_to_string(
                'contacts/emails/admin_notification.html',
                {'contact': contact_instance}
            )
            
            # Create plain text version
            text_content = strip_tags(html_content)
            
            # Determine subject based on contact type
            subject_map = {
                'consultation': f'🆘 URGENT: Consultation Request from {contact_instance.name}',
                'newsletter': f'📧 Newsletter Subscription: {contact_instance.email}',
                'general': f'📋 New Contact Inquiry from {contact_instance.name}',
                'property_inquiry': f'🏠 Property Inquiry from {contact_instance.name}',
            }
            
            subject = subject_map.get(
                contact_instance.contact_type, 
                f'New Contact: {contact_instance.name}'
            )
            
            # Create email message
            email = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[settings.ADMIN_EMAIL],
            )
            email.attach_alternative(html_content, "text/html")
            
            # Send email
            email.send()
            
            logger.info(f"Admin notification sent for contact #{contact_instance.id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send admin notification for contact #{contact_instance.id}: {str(e)}")
            return False
    
    @staticmethod
    def send_user_confirmation(contact_instance) -> bool:
        """
        Send confirmation email to user
        
        Args:
            contact_instance: Contact model instance
            
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        try:
            if not settings.SEND_USER_CONFIRMATIONS:
                logger.info("User confirmations are disabled")
                return True
                
            # Render HTML template
            html_content = render_to_string(
                'contacts/emails/user_confirmation.html',
                {'contact': contact_instance}
            )
            
            # Create plain text version
            text_content = strip_tags(html_content)
            
            # Determine subject based on contact type
            subject_map = {
                'consultation': f'✅ Your Consultation Request is Confirmed - XlideLand',
                'newsletter': f'🎉 Welcome to XlideLand Newsletter!',
                'general': f'Thank you for contacting XlideLand',
                'property_inquiry': f'Property Inquiry Received - XlideLand',
            }
            
            subject = subject_map.get(
                contact_instance.contact_type, 
                'Thank you for contacting XlideLand'
            )
            
            # Create email message
            email = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[contact_instance.email],
            )
            email.attach_alternative(html_content, "text/html")
            
            # Send email
            email.send()
            
            logger.info(f"User confirmation sent to {contact_instance.email} for contact #{contact_instance.id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send user confirmation for contact #{contact_instance.id}: {str(e)}")
            return False


class WhatsAppNotificationService:
    """Service for sending WhatsApp notifications using WhatsApp Business API"""
    
    BASE_URL = "https://graph.facebook.com/v18.0"
    
    @staticmethod
    def send_admin_notification(contact_instance) -> bool:
        """
        Send WhatsApp notification to admin about new contact
        
        Args:
            contact_instance: Contact model instance
            
        Returns:
            bool: True if message sent successfully, False otherwise
        """
        try:
            if not settings.SEND_WHATSAPP_NOTIFICATIONS:
                logger.info("WhatsApp notifications are disabled")
                return True
                
            if not all([
                settings.WHATSAPP_BUSINESS_API_TOKEN,
                settings.WHATSAPP_BUSINESS_PHONE_NUMBER_ID
            ]):
                logger.warning("WhatsApp Business API credentials not configured")
                return False
            
            # Create message content
            message_template = WhatsAppNotificationService._get_admin_message_template(contact_instance)
            
            # Send message
            return WhatsAppNotificationService._send_text_message(
                phone_number="+2349076614145",  # Admin phone number
                message=message_template
            )
            
        except Exception as e:
            logger.error(f"Failed to send WhatsApp admin notification for contact #{contact_instance.id}: {str(e)}")
            return False
    
    @staticmethod
    def send_user_confirmation(contact_instance) -> bool:
        """
        Send WhatsApp confirmation to user
        
        Args:
            contact_instance: Contact model instance
            
        Returns:
            bool: True if message sent successfully, False otherwise
        """
        try:
            if not settings.SEND_WHATSAPP_NOTIFICATIONS:
                logger.info("WhatsApp notifications are disabled")
                return True
                
            if not contact_instance.phone:
                logger.warning(f"No phone number provided for contact #{contact_instance.id}")
                return False
                
            if not all([
                settings.WHATSAPP_BUSINESS_API_TOKEN,
                settings.WHATSAPP_BUSINESS_PHONE_NUMBER_ID
            ]):
                logger.warning("WhatsApp Business API credentials not configured")
                return False
            
            # Create message content
            message_template = WhatsAppNotificationService._get_user_confirmation_template(contact_instance)
            
            # Send message
            return WhatsAppNotificationService._send_text_message(
                phone_number=contact_instance.phone,
                message=message_template
            )
            
        except Exception as e:
            logger.error(f"Failed to send WhatsApp user confirmation for contact #{contact_instance.id}: {str(e)}")
            return False
    
    @staticmethod
    def _send_text_message(phone_number: str, message: str) -> bool:
        """
        Send a text message via WhatsApp Business API
        
        Args:
            phone_number: Recipient phone number
            message: Message content
            
        Returns:
            bool: True if message sent successfully, False otherwise
        """
        try:
            # Clean phone number (remove spaces, dashes, etc.)
            clean_phone = ''.join(filter(str.isdigit, phone_number))
            if not clean_phone.startswith('234'):  # Nigeria country code
                if clean_phone.startswith('0'):
                    clean_phone = '234' + clean_phone[1:]
                elif clean_phone.startswith('234'):
                    pass  # Already has country code
                else:
                    clean_phone = '234' + clean_phone
            
            url = f"{WhatsAppNotificationService.BASE_URL}/{settings.WHATSAPP_BUSINESS_PHONE_NUMBER_ID}/messages"
            
            headers = {
                'Authorization': f'Bearer {settings.WHATSAPP_BUSINESS_API_TOKEN}',
                'Content-Type': 'application/json',
            }
            
            payload = {
                'messaging_product': 'whatsapp',
                'to': clean_phone,
                'type': 'text',
                'text': {'body': message}
            }
            
            response = requests.post(url, json=payload, headers=headers, timeout=10)
            
            if response.status_code == 200:
                logger.info(f"WhatsApp message sent successfully to {clean_phone}")
                return True
            else:
                logger.error(f"WhatsApp API error: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"Failed to send WhatsApp message to {phone_number}: {str(e)}")
            return False
    
    @staticmethod
    def _get_admin_message_template(contact_instance) -> str:
        """Get admin notification message template"""
        contact_type_emojis = {
            'consultation': '🆘',
            'newsletter': '📧',
            'general': '📋',
            'property_inquiry': '🏠',
        }
        
        emoji = contact_type_emojis.get(contact_instance.contact_type, '📋')
        
        return f"""🏠 *XlideLand - New Contact Alert* {emoji}

*Contact Details:*
👤 Name: {contact_instance.name}
📧 Email: {contact_instance.email}
📱 Phone: {contact_instance.phone}
📋 Type: {contact_instance.get_contact_type_display()}

*Subject:* {contact_instance.subject or 'General Inquiry'}

*Message:*
{contact_instance.message}

*Received:* {contact_instance.contact_date.strftime('%B %d, %Y at %I:%M %p')}

⚡ *Action Required:* Please respond promptly to maintain service quality.

Contact ID: #{contact_instance.id}"""
    
    @staticmethod
    def _get_user_confirmation_template(contact_instance) -> str:
        """Get user confirmation message template"""
        if contact_instance.contact_type == 'consultation':
            return f"""🏠 *XlideLand Real Estate*

Hello {contact_instance.name}! 👋

✅ Your consultation request has been confirmed!

📝 *Reference ID:* #{contact_instance.id}
⏰ *Submitted:* {contact_instance.contact_date.strftime('%B %d, %Y at %I:%M %p')}

🚀 *What's Next?*
• Our expert will review your requirements
• We'll contact you within 24 hours
• Get personalized property recommendations

📞 Need immediate help? Call: +234 907 661 4145
📧 Email: Opeyemib117@gmail.com

Thank you for choosing XlideLand! 🎉"""
        
        elif contact_instance.contact_type == 'newsletter':
            return f"""🏠 *XlideLand Real Estate*

Welcome {contact_instance.name}! 🎉

📧 You've successfully subscribed to our newsletter!

You'll now receive:
🏠 Exclusive property listings
📊 Market insights & trends
💡 Expert real estate tips
🎯 Personalized recommendations

📞 Questions? Call: +234 907 661 4145

Welcome to the XlideLand family! 👨‍👩‍👧‍👦"""
        
        else:
            return f"""🏠 *XlideLand Real Estate*

Hello {contact_instance.name}! 👋

✅ We've received your inquiry and will get back to you within 24 hours.

📝 *Reference ID:* #{contact_instance.id}

📞 Need immediate help?
Call: +234 907 661 4145
Email: Opeyemib117@gmail.com

Thank you for contacting XlideLand! 🙏"""


class NotificationManager:
    """Centralized notification manager"""
    
    @staticmethod
    def send_all_notifications(contact_instance) -> Dict[str, bool]:
        """
        Send all configured notifications for a contact
        
        Args:
            contact_instance: Contact model instance
            
        Returns:
            dict: Results of each notification type
        """
        results = {
            'admin_email': False,
            'user_email': False,
            'admin_whatsapp': False,
            'user_whatsapp': False,
        }
        
        try:
            # Send admin email notification
            if settings.SEND_EMAIL_NOTIFICATIONS:
                results['admin_email'] = EmailNotificationService.send_admin_notification(contact_instance)
            
            # Send user email confirmation
            if settings.SEND_USER_CONFIRMATIONS:
                results['user_email'] = EmailNotificationService.send_user_confirmation(contact_instance)
            
            # Send admin WhatsApp notification
            if settings.SEND_WHATSAPP_NOTIFICATIONS:
                results['admin_whatsapp'] = WhatsAppNotificationService.send_admin_notification(contact_instance)
            
            # Send user WhatsApp confirmation (only if phone provided)
            if settings.SEND_WHATSAPP_NOTIFICATIONS and contact_instance.phone:
                results['user_whatsapp'] = WhatsAppNotificationService.send_user_confirmation(contact_instance)
            
            logger.info(f"Notification results for contact #{contact_instance.id}: {results}")
            
        except Exception as e:
            logger.error(f"Error in notification manager for contact #{contact_instance.id}: {str(e)}")
        
        return results
