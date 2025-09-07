// Updated types for the new XlideLand frontend

// Pagination interfaces
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
  has_next: boolean;
  has_previous: boolean;
  next_page: number | null;
  previous_page: number | null;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  pagination?: PaginationInfo;
}

export interface PropertyCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface PropertyFeature {
  id: number;
  name: string;
  category: string;
  icon?: string;
}

export interface PropertyDetails {
  propertyType: string;
  style?: string;
  floors: number;
  parking: number;
  hoa: number;
  taxes: number;
  heating: string;
  cooling: string;
  laundry?: string;
  fireplaces: number;
}

export interface PropertyAnalytics {
  views: number;
  saves: number;
  inquiries: number;
  tours_scheduled: number;
  last_viewed?: string;
}

export interface PriceHistory {
  price: number;
  event_type: string;
  notes?: string;
  created_at: string;
}

export interface Property {
  id: number
  title: string
  description: string
  price: number
  listing_type: 'sale' | 'rent'
  property_type: string
  category?: PropertyCategory
  bedrooms: number
  bathrooms: number
  area: number // square feet (mapped from sqft)
  sqft: number
  lot_size?: number
  year_built?: number
  floors: number
  fireplaces: number
  parking_spaces: number
  garage: number
  heating: string
  cooling: string
  hoa_fee?: number
  property_taxes?: number
  location: {
    address: string
    city: string
    state: string
    zipCode: string // mapped from zipcode
    neighborhood?: string
  }
  images: string[]
  features: PropertyFeature[]
  realtor: Realtor
  createdAt: string // mapped from list_date
  updatedAt: string
  isActive: boolean // mapped from is_published
  isFeatured: boolean // mapped from is_featured
  
  // Analytics and computed fields
  analytics?: PropertyAnalytics
  price_history?: PriceHistory[]
  days_on_market?: number
  price_per_sqft?: number
  views?: number
  saves?: number
}

// Legacy Listing interface for backward compatibility
export interface Listing {
  id: string
  title: string
  address: string
  city: string
  state: string
  zipcode: string
  description: string
  price: number
  bedrooms: number
  bathrooms: number
  garage: number
  sqft: number
  lot_size: number
  photo_main: string
  photo_1?: string
  photo_2?: string
  photo_3?: string
  photo_4?: string
  photo_5?: string
  photo_6?: string
  is_published: boolean
  list_date: string
  realtor: Realtor
}

export interface Realtor {
  id: number
  name: string
  title: string
  email: string
  phone: string
  photo: string
  description?: string
  bio?: string
  license_number?: string
  years_experience: number
  total_sales_count: number
  total_sales_volume: number
  website?: string
  linkedin_url?: string
  facebook_url?: string
  instagram_url?: string
  average_rating: number
  total_reviews: number
  languages: string
  specializations?: string
  is_mvp?: boolean
  is_active: boolean
  hire_date?: string
  experience_display?: string
  total_sales_display?: string
  
  // Legacy fields for backward compatibility
  rating?: number
  reviews?: number
  experience?: string
  totalSales?: string
}

export interface Contact {
  id?: string | number
  listing?: string
  listing_id?: number
  name: string
  email: string
  phone: string
  message?: string
  user_id?: number
  contact_date?: string
  
  // Enhanced fields
  property_type?: string
  budget_range?: string
  timeline?: string
  contact_type?: string
  status?: string
  subject?: string
  responded_at?: string
  resolved_at?: string
  notes?: string
  
  // Display fields (from serializer)
  contact_type_display?: string
  status_display?: string
  property_type_display?: string
  budget_range_display?: string
  timeline_display?: string
}

export interface ContactFormData {
  name: string
  email: string
  phone: string
  subject?: string
  message?: string
  property_type?: string
  budget_range?: string
  timeline?: string
  contact_type?: string
  listing?: string
  listing_id?: number
}

export interface ContactStats {
  total_contacts: number
  new_contacts: number
  recent_contacts: number
  status_breakdown: Array<{
    status: string
    count: number
  }>
}

export interface ListingFilters {
  city?: string
  state?: string
  bedrooms?: number
  bathrooms?: number
  min_price?: number
  max_price?: number
  min_sqft?: number
  max_sqft?: number
  search?: string
}

export interface SearchFilters {
  query?: string
  location?: string
  propertyType?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  minArea?: number
  maxArea?: number
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  password_confirm: string
  first_name: string
  last_name: string
  role: 'buyer' | 'seller'
}

// Additional types for API integration
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
  last_login?: string;
  is_active: boolean;
  is_staff: boolean;
  // Profile-related fields (from AdminUserManagementSerializer)
  role?: 'buyer' | 'seller' | 'admin';
  phone?: string;
  is_verified?: boolean;
  joined_date?: string;
  last_login_date?: string;
  properties_count?: number;
  inquiries_count?: number;
  profile?: UserProfile;
}

export interface UserProfile {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  role: 'buyer' | 'seller' | 'admin';
  avatar?: string;
  phone?: string;
  bio?: string;
  is_verified: boolean;
  joined_date: string;
  last_login_date?: string;
  // Google OAuth2 fields
  google_id?: string;
  google_email?: string;
  google_picture?: string;
  is_google_user: boolean;
  google_verified: boolean;
}

export interface UserFavorite {
  id: number;
  user: User;
  property: Property;
  created_at: string;
}

export interface Tour {
  id: number;
  user: User;
  property: Property;
  scheduled_date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: number;
  participants: User[];
  property?: Property;
  subject: string;
  created_at: string;
  updated_at: string;
  last_message?: Message;
}

export interface Message {
  id: number;
  conversation: number;
  sender: User;
  content: string;
  is_read: boolean;
  timestamp: string;
}

export interface Notification {
  id: number;
  user: User;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  related_object_id?: number;
}

export interface PropertyAlert {
  id: number;
  user: User;
  name: string;
  alert_type: string; 
  criteria: object; 
  location: string;
  min_price?: number;
  max_price?: number;
  min_bedrooms?: number;
  max_bedrooms?: number;
  min_bathrooms?: number;
  max_bathrooms?: number;
  property_type: string;
  frequency?: string;
  is_active: boolean;
  last_triggered?: string;
  match_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: number;
  user: User;
  name: string;
  title: string; 
  file: string; 
  file_url?: string; 
  document_type: string;
  status: string; 
  listing?: number; 
  uploaded_at: string;
  created_at: string;
  updated_at: string;
  file_size?: number;
  is_private: boolean;
}

export interface UserActivity {
  id: number;
  user: User;
  activity_type: string;
  description: string;
  listing?: Property;
  metadata?: object;
  created_at: string; 
}

export interface DashboardStats {
  user_info: User;
  properties: {
    total_listings: number;
    active_listings: number;
    favorites_count: number;
  };
  tours: {
    total_tours: number;
    pending_tours: number;
    confirmed_tours: number;
    completed_tours: number;
  };
  communications: {
    unread_messages: number;
    unread_notifications: number;
    active_conversations: number;
  };
  alerts: {
    active_alerts: number;
  };
  recent_activities: UserActivity[];
}

export interface UserAnalytics {
  period_days: number;
  activity_summary: { activity_type: string; count: number }[];
  tour_statistics: { status: string; count: number }[];
  property_interactions: {
    views: number;
    favorites_added: number;
  };
  engagement_score: number;
}

// Request/Response interfaces
export interface TokenResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface PasswordChangeData {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

export interface TourCreateData {
  property: number;
  scheduled_date: string;
  notes?: string;
}

export interface ConversationCreateData {
  other_user_id: number;
  property_id?: number;
  message?: string;
}

export interface MessageSendData {
  content: string;
}

export interface PropertyAlertCreateData {
  name: string;
  location: string;
  min_price?: number;
  max_price?: number;
  min_bedrooms?: number;
  max_bedrooms?: number;
  min_bathrooms?: number;
  max_bathrooms?: number;
  property_type: string;
}
