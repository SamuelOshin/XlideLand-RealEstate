export interface WhatsAppMessage {
  phoneNumber: string;
  message: string;
}

export const whatsappUtils = {
  // Redirect to WhatsApp with pre-filled message
  redirectToWhatsApp: (phoneNumber: string, message: string) => {
    const formattedPhone = phoneNumber.replace(/[^\d]/g, ''); // Remove non-digits
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  },

  // Generate contact-specific WhatsApp message
  generateContactMessage: (type: 'property' | 'general', propertyId?: string) => {
    const messages = {
      property: `Hi! I'm interested in property listing ${propertyId} on XlideLand. Could you provide more details?`,
      general: `Hi! I'm interested in your real estate services in Lagos/Abuja. Can we discuss my requirements?`
    };
    return messages[type];
  },

  // Format phone number for WhatsApp (Nigerian format)
  formatPhoneNumber: (phone: string): string => {
    // Remove all non-digits
    let cleaned = phone.replace(/[^\d]/g, '');
    
    // If starts with 0, replace with 234
    if (cleaned.startsWith('0')) {
      cleaned = '234' + cleaned.substring(1);
    }
    
    // If doesn't start with 234, add it
    if (!cleaned.startsWith('234')) {
      cleaned = '234' + cleaned;
    }
    
    return cleaned;
  },

  // Validate phone number format
  isValidPhoneNumber: (phone: string): boolean => {
    const cleaned = phone.replace(/[^\d]/g, '');
    // Nigerian phone numbers should be 11 digits (starting with 0) or 14 digits (starting with 234)
    return cleaned.length === 11 || cleaned.length === 14;
  }
};