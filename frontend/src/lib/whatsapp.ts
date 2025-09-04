/**
 * WhatsApp integration utility for XlideLand
 * Provides functions to create WhatsApp links with pre-filled messages
 */

// XlideLand WhatsApp contact number
export const WHATSAPP_NUMBER = '+2349076614145';

/**
 * Creates a WhatsApp link with a pre-filled message
 * @param message - The message to pre-fill
 * @param phoneNumber - Optional custom phone number (defaults to XlideLand's number)
 * @returns WhatsApp URL
 */
export function createWhatsAppLink(message: string, phoneNumber?: string): string {
  const phone = phoneNumber || WHATSAPP_NUMBER;
  // Remove any non-digit characters and ensure it starts with country code
  const cleanPhone = phone.replace(/[^\d]/g, '');
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Opens WhatsApp with a pre-filled message
 * @param message - The message to pre-fill
 * @param phoneNumber - Optional custom phone number
 */
export function openWhatsApp(message: string, phoneNumber?: string): void {
  const url = createWhatsAppLink(message, phoneNumber);
  window.open(url, '_blank');
}

/**
 * Creates a general inquiry WhatsApp message
 * @param name - Customer's name (optional)
 * @returns Pre-formatted message
 */
export function createGeneralInquiryMessage(name?: string): string {
  const greeting = name ? `Hi, I'm ${name}. ` : 'Hi! ';
  return `${greeting}I'm interested in learning more about XlideLand's real estate services. Could you please provide me with more information?`;
}

/**
 * Creates a property inquiry WhatsApp message
 * @param propertyTitle - Title or description of the property
 * @param propertyId - Optional property ID
 * @param name - Customer's name (optional)
 * @returns Pre-formatted message
 */
export function createPropertyInquiryMessage(
  propertyTitle: string, 
  propertyId?: string | number, 
  name?: string
): string {
  const greeting = name ? `Hi, I'm ${name}. ` : 'Hi! ';
  const propertyRef = propertyId ? ` (Property ID: ${propertyId})` : '';
  
  return `${greeting}I'm interested in the property: "${propertyTitle}"${propertyRef}. Could you please provide more details and schedule a viewing?`;
}

/**
 * Creates a consultation request WhatsApp message
 * @param serviceType - Type of consultation (buying, selling, investment, etc.)
 * @param name - Customer's name (optional)
 * @returns Pre-formatted message
 */
export function createConsultationMessage(
  serviceType: string = 'real estate consultation',
  name?: string
): string {
  const greeting = name ? `Hi, I'm ${name}. ` : 'Hi! ';
  
  return `${greeting}I would like to schedule a ${serviceType} with your team. When would be a convenient time for a consultation?`;
}

/**
 * Creates a viewing request WhatsApp message
 * @param propertyTitle - Property title or address
 * @param preferredTime - Optional preferred viewing time
 * @param name - Customer's name (optional)
 * @returns Pre-formatted message
 */
export function createViewingRequestMessage(
  propertyTitle: string,
  preferredTime?: string,
  name?: string
): string {
  const greeting = name ? `Hi, I'm ${name}. ` : 'Hi! ';
  const timePreference = preferredTime ? ` I would prefer ${preferredTime} if possible.` : '';
  
  return `${greeting}I would like to schedule a viewing for "${propertyTitle}".${timePreference} Could you please let me know available times?`;
}

/**
 * Creates a follow-up message for existing inquiries
 * @param inquiryReference - Reference to previous inquiry
 * @param name - Customer's name (optional)
 * @returns Pre-formatted message
 */
export function createFollowUpMessage(
  inquiryReference: string,
  name?: string
): string {
  const greeting = name ? `Hi, I'm ${name}. ` : 'Hi! ';
  
  return `${greeting}I wanted to follow up on my previous inquiry regarding ${inquiryReference}. Could you please provide an update?`;
}

/**
 * WhatsApp utility object with common use cases
 */
export const whatsApp = {
  // Core functions
  createLink: createWhatsAppLink,
  open: openWhatsApp,
  
  // Message generators
  generalInquiry: createGeneralInquiryMessage,
  propertyInquiry: createPropertyInquiryMessage,
  consultation: createConsultationMessage,
  viewingRequest: createViewingRequestMessage,
  followUp: createFollowUpMessage,
  
  // Quick actions
  contactNow: (name?: string) => {
    openWhatsApp(createGeneralInquiryMessage(name));
  },
  
  inquireAboutProperty: (propertyTitle: string, propertyId?: string | number, name?: string) => {
    openWhatsApp(createPropertyInquiryMessage(propertyTitle, propertyId, name));
  },
  
  requestConsultation: (serviceType?: string, name?: string) => {
    openWhatsApp(createConsultationMessage(serviceType, name));
  },
  
  scheduleViewing: (propertyTitle: string, preferredTime?: string, name?: string) => {
    openWhatsApp(createViewingRequestMessage(propertyTitle, preferredTime, name));
  }
};

export default whatsApp;

