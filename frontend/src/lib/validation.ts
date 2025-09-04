/**
 * Form validation utilities for XlideLand contact forms
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validates email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates phone number (supports Nigerian formats)
 */
export const validatePhone = (phone: string): boolean => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check for Nigerian phone number patterns
  // +234XXXXXXXXXX, 234XXXXXXXXXX, 0XXXXXXXXXX, XXXXXXXXXX
  const patterns = [
    /^234[789][01]\d{8}$/, // +234 format
    /^0[789][01]\d{8}$/,   // 0 format
    /^[789][01]\d{8}$/     // Without country code
  ];
  
  return patterns.some(pattern => pattern.test(cleanPhone));
};

/**
 * Validates required field
 */
export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validates minimum length
 */
export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength;
};

/**
 * Validates maximum length
 */
export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.trim().length <= maxLength;
};

/**
 * Validates contact form data
 */
export const validateContactForm = (data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
  property_type?: string;
  budget_range?: string;
  timeline?: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  // Name validation
  if (!validateRequired(data.name)) {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (!validateMinLength(data.name, 2)) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
  } else if (!validateMaxLength(data.name, 100)) {
    errors.push({ field: 'name', message: 'Name must be less than 100 characters' });
  }

  // Email validation
  if (!validateRequired(data.email)) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  // Phone validation (optional but if provided, must be valid)
  if (data.phone && data.phone.trim()) {
    if (!validatePhone(data.phone)) {
      errors.push({ 
        field: 'phone', 
        message: 'Please enter a valid Nigerian phone number (e.g., 0801234567 or +2348012345678)' 
      });
    }
  }

  // Subject validation (optional but if provided, check length)
  if (data.subject && data.subject.trim()) {
    if (!validateMaxLength(data.subject, 255)) {
      errors.push({ field: 'subject', message: 'Subject must be less than 255 characters' });
    }
  }

  // Message validation (optional but if provided, check length)
  if (data.message && data.message.trim()) {
    if (!validateMaxLength(data.message, 2000)) {
      errors.push({ field: 'message', message: 'Message must be less than 2000 characters' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Gets field-specific error message
 */
export const getFieldError = (errors: ValidationError[], fieldName: string): string | null => {
  const error = errors.find(err => err.field === fieldName);
  return error ? error.message : null;
};

/**
 * Formats phone number for display
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.startsWith('234')) {
    // +234 format
    const formatted = cleanPhone.replace(/^234(\d{3})(\d{3})(\d{4})$/, '+234 $1 $2 $3');
    return formatted.includes('+234') ? formatted : phone;
  } else if (cleanPhone.startsWith('0')) {
    // Nigerian local format
    const formatted = cleanPhone.replace(/^0(\d{3})(\d{3})(\d{4})$/, '0$1 $2 $3');
    return formatted.includes(' ') ? formatted : phone;
  }
  
  return phone;
};

/**
 * Real-time validation for form fields
 */
export const createFieldValidator = (fieldName: string) => {
  return (value: string): string | null => {
    switch (fieldName) {
      case 'name':
        if (!validateRequired(value)) return 'Name is required';
        if (!validateMinLength(value, 2)) return 'Name must be at least 2 characters';
        if (!validateMaxLength(value, 100)) return 'Name is too long';
        break;
        
      case 'email':
        if (!validateRequired(value)) return 'Email is required';
        if (!validateEmail(value)) return 'Please enter a valid email address';
        break;
        
      case 'phone':
        if (value.trim() && !validatePhone(value)) {
          return 'Please enter a valid Nigerian phone number';
        }
        break;
        
      case 'subject':
        if (value.trim() && !validateMaxLength(value, 255)) {
          return 'Subject is too long';
        }
        break;
        
      case 'message':
        if (value.trim() && !validateMaxLength(value, 2000)) {
          return 'Message is too long';
        }
        break;
        
      default:
        break;
    }
    
    return null;
  };
};

export default {
  validateEmail,
  validatePhone,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateContactForm,
  getFieldError,
  formatPhoneNumber,
  createFieldValidator
};