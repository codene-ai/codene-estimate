import type { Feature, FeatureCategory } from './types';

export const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    id: 'user-management',
    name: 'User Management',
    features: [
      { id: 'user_auth_email', name: 'Email/Password Auth', category: 'user-management', complexity: 'simple', hoursMin: 3, hoursMax: 5 },
      { id: 'user_auth_social', name: 'Social Login (Google, Apple)', category: 'user-management', complexity: 'medium', hoursMin: 6, hoursMax: 9 },
      { id: 'user_auth_mfa', name: 'Multi-Factor Auth', category: 'user-management', complexity: 'complex', hoursMin: 10, hoursMax: 16 },
      { id: 'user_profiles', name: 'User Profiles', category: 'user-management', complexity: 'simple', hoursMin: 4, hoursMax: 6 },
      { id: 'user_roles', name: 'Roles & Permissions', category: 'user-management', complexity: 'medium', hoursMin: 7, hoursMax: 11 },
      { id: 'onboarding_flow', name: 'Onboarding Flow', category: 'user-management', complexity: 'medium', hoursMin: 5, hoursMax: 9 },
      { id: 'biometric_auth', name: 'Biometric Auth', category: 'user-management', complexity: 'medium', hoursMin: 4, hoursMax: 7 },
    ],
  },
  {
    id: 'communication',
    name: 'Communication',
    features: [
      { id: 'push_notifications', name: 'Push Notifications', category: 'communication', complexity: 'medium', hoursMin: 5, hoursMax: 8 },
      { id: 'in_app_messaging', name: 'In-App Alerts', category: 'communication', complexity: 'simple', hoursMin: 3, hoursMax: 5 },
      { id: 'chat_realtime', name: 'Real-Time Chat', category: 'communication', complexity: 'complex', hoursMin: 14, hoursMax: 22 },
      { id: 'chat_group', name: 'Group Chat', category: 'communication', complexity: 'complex', hoursMin: 12, hoursMax: 18 },
      { id: 'video_calling', name: 'Video Calling', category: 'communication', complexity: 'complex', hoursMin: 16, hoursMax: 26 },
      { id: 'voice_calling', name: 'Voice Calling', category: 'communication', complexity: 'complex', hoursMin: 14, hoursMax: 22 },
      { id: 'sms_notifications', name: 'SMS Notifications', category: 'communication', complexity: 'simple', hoursMin: 2, hoursMax: 4 },
      { id: 'notification_center', name: 'Notification Center', category: 'communication', complexity: 'medium', hoursMin: 5, hoursMax: 8 },
      { id: 'email_integration', name: 'Email Integration', category: 'communication', complexity: 'medium', hoursMin: 5, hoursMax: 8 },
      { id: 'contact_form', name: 'Contact / Support', category: 'communication', complexity: 'simple', hoursMin: 3, hoursMax: 5 },
    ],
  },
  {
    id: 'data-content',
    name: 'Data & Content',
    features: [
      { id: 'database_basic', name: 'Database Setup', category: 'data-content', complexity: 'simple', hoursMin: 4, hoursMax: 6 },
      { id: 'database_complex', name: 'Complex Data Models', category: 'data-content', complexity: 'medium', hoursMin: 8, hoursMax: 13 },
      { id: 'cms_integration', name: 'CMS Integration', category: 'data-content', complexity: 'complex', hoursMin: 12, hoursMax: 18 },
      { id: 'offline_mode', name: 'Offline Mode', category: 'data-content', complexity: 'complex', hoursMin: 14, hoursMax: 22 },
      { id: 'file_upload', name: 'File Upload', category: 'data-content', complexity: 'medium', hoursMin: 4, hoursMax: 7 },
      { id: 'data_export', name: 'Data Export', category: 'data-content', complexity: 'medium', hoursMin: 4, hoursMax: 7 },
      { id: 'data_import', name: 'Data Import', category: 'data-content', complexity: 'medium', hoursMin: 5, hoursMax: 8 },
      { id: 'search_basic', name: 'Basic Search', category: 'data-content', complexity: 'simple', hoursMin: 2, hoursMax: 4 },
      { id: 'search_advanced', name: 'Advanced Search', category: 'data-content', complexity: 'medium', hoursMin: 7, hoursMax: 11 },
      { id: 'analytics_dashboard', name: 'Analytics Dashboard', category: 'data-content', complexity: 'complex', hoursMin: 14, hoursMax: 22 },
    ],
  },
  {
    id: 'payments',
    name: 'Payments & Commerce',
    features: [
      { id: 'payment_processing', name: 'Payment Processing', category: 'payments', complexity: 'medium', hoursMin: 7, hoursMax: 11 },
      { id: 'subscription_mgmt', name: 'Subscriptions', category: 'payments', complexity: 'complex', hoursMin: 12, hoursMax: 18 },
      { id: 'in_app_purchases', name: 'In-App Purchases', category: 'payments', complexity: 'complex', hoursMin: 14, hoursMax: 20 },
      { id: 'shopping_cart', name: 'Shopping Cart', category: 'payments', complexity: 'medium', hoursMin: 7, hoursMax: 11 },
      { id: 'product_catalog', name: 'Product Catalog', category: 'payments', complexity: 'medium', hoursMin: 6, hoursMax: 9 },
      { id: 'order_management', name: 'Order Management', category: 'payments', complexity: 'medium', hoursMin: 5, hoursMax: 8 },
      { id: 'coupon_discounts', name: 'Coupons & Discounts', category: 'payments', complexity: 'simple', hoursMin: 3, hoursMax: 5 },
      { id: 'invoice_receipts', name: 'Invoicing', category: 'payments', complexity: 'medium', hoursMin: 4, hoursMax: 7 },
    ],
  },
  {
    id: 'media',
    name: 'Media',
    features: [
      { id: 'camera_integration', name: 'Camera Integration', category: 'media', complexity: 'medium', hoursMin: 4, hoursMax: 7 },
      { id: 'photo_upload', name: 'Photo Upload', category: 'media', complexity: 'medium', hoursMin: 4, hoursMax: 7 },
      { id: 'video_upload', name: 'Video Streaming', category: 'media', complexity: 'complex', hoursMin: 12, hoursMax: 18 },
      { id: 'media_gallery', name: 'Media Gallery', category: 'media', complexity: 'medium', hoursMin: 4, hoursMax: 8 },
      { id: 'audio_playback', name: 'Audio Player', category: 'media', complexity: 'medium', hoursMin: 6, hoursMax: 10 },
      { id: 'audio_recording', name: 'Audio Recording', category: 'media', complexity: 'medium', hoursMin: 4, hoursMax: 7 },
      { id: 'image_editing', name: 'Image Editing', category: 'media', complexity: 'complex', hoursMin: 12, hoursMax: 18 },
      { id: 'document_viewer', name: 'Document Viewer', category: 'media', complexity: 'medium', hoursMin: 4, hoursMax: 7 },
    ],
  },
  {
    id: 'location',
    name: 'Location & Maps',
    features: [
      { id: 'gps_location', name: 'GPS / Location', category: 'location', complexity: 'medium', hoursMin: 4, hoursMax: 7 },
      { id: 'maps_integration', name: 'Maps Integration', category: 'location', complexity: 'medium', hoursMin: 6, hoursMax: 9 },
      { id: 'geofencing', name: 'Geofencing', category: 'location', complexity: 'complex', hoursMin: 10, hoursMax: 14 },
      { id: 'route_navigation', name: 'Route Navigation', category: 'location', complexity: 'complex', hoursMin: 12, hoursMax: 18 },
      { id: 'location_tracking', name: 'Live Tracking', category: 'location', complexity: 'complex', hoursMin: 10, hoursMax: 16 },
      { id: 'store_locator', name: 'Store Locator', category: 'location', complexity: 'medium', hoursMin: 4, hoursMax: 8 },
    ],
  },
  {
    id: 'advanced',
    name: 'Advanced',
    features: [
      { id: 'ai_ml_basic', name: 'AI Chatbot / Recs', category: 'advanced', complexity: 'complex', hoursMin: 14, hoursMax: 24 },
      { id: 'ai_ml_custom', name: 'Custom AI Model', category: 'advanced', complexity: 'complex', hoursMin: 22, hoursMax: 36 },
      { id: 'ar_features', name: 'Augmented Reality', category: 'advanced', complexity: 'complex', hoursMin: 18, hoursMax: 30 },
      { id: 'vr_features', name: 'Virtual Reality', category: 'advanced', complexity: 'complex', hoursMin: 22, hoursMax: 36 },
      { id: 'iot_integration', name: 'IoT Integration', category: 'advanced', complexity: 'complex', hoursMin: 14, hoursMax: 24 },
      { id: 'blockchain_web3', name: 'Blockchain / Web3', category: 'advanced', complexity: 'complex', hoursMin: 18, hoursMax: 30 },
      { id: 'third_party_apis', name: 'API Integrations', category: 'advanced', complexity: 'medium', hoursMin: 4, hoursMax: 7 },
      { id: 'admin_panel', name: 'Admin Dashboard', category: 'advanced', complexity: 'complex', hoursMin: 14, hoursMax: 24 },
      { id: 'reporting_system', name: 'Reporting System', category: 'advanced', complexity: 'complex', hoursMin: 12, hoursMax: 18 },
    ],
  },
  {
    id: 'ui-ux',
    name: 'UI/UX',
    features: [
      { id: 'dark_mode', name: 'Dark Mode', category: 'ui-ux', complexity: 'simple', hoursMin: 2, hoursMax: 4 },
      { id: 'multi_language', name: 'Multi-Language', category: 'ui-ux', complexity: 'complex', hoursMin: 12, hoursMax: 18 },
      { id: 'accessibility', name: 'Accessibility', category: 'ui-ux', complexity: 'medium', hoursMin: 7, hoursMax: 11 },
      { id: 'settings_preferences', name: 'Settings Page', category: 'ui-ux', complexity: 'simple', hoursMin: 3, hoursMax: 5 },
      { id: 'social_sharing', name: 'Social Sharing', category: 'ui-ux', complexity: 'simple', hoursMin: 2, hoursMax: 4 },
      { id: 'caching_optimization', name: 'Performance Opt.', category: 'ui-ux', complexity: 'medium', hoursMin: 5, hoursMax: 9 },
    ],
  },
];

export function getAllFeatures(): Feature[] {
  return FEATURE_CATEGORIES.flatMap((category) => category.features);
}

export function getFeatureById(id: string): Feature | undefined {
  return getAllFeatures().find((feature) => feature.id === id);
}
