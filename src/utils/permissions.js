// Role-Based Access Control
export const PERMISSIONS = {
  // Free User Permissions
  FREE_USER: [
    'view_profile',
    'send_interest',
    'basic_search',
    'view_limited_photos',
    'receive_interests'
  ],
  
  // Premium User Permissions
  PREMIUM_USER: [
    'view_profile',
    'send_interest',
    'basic_search',
    'view_limited_photos',
    'receive_interests',
    'chat',
    'full_photos',
    'contact_details',
    'advanced_search',
    'priority_matching',
    'unlimited_profile_views'
  ],
  
  // Moderator Permissions
  MODERATOR: [
    'moderate_photos',
    'handle_reports',
    'warn_users',
    'view_user_profiles',
    'manage_content'
  ],
  
  // Admin Permissions
  ADMIN: [
    '*'
  ]
}

// Check if user has specific permission
export const hasPermission = (userRole, requiredPermission) => {
  if (!userRole || !requiredPermission) return false
  
  const userPermissions = PERMISSIONS[userRole] || []
  
  // Admin has all permissions
  if (userRole === 'admin') return true
  
  // Check if user has the specific permission
  return userPermissions.includes(requiredPermission)
}

// Check if user has any of the required permissions
export const hasAnyPermission = (userRole, requiredPermissions) => {
  if (!userRole || !requiredPermissions || requiredPermissions.length === 0) return false
  
  return requiredPermissions.some(permission => 
    hasPermission(userRole, permission)
  )
}

// Check if user has all required permissions
export const hasAllPermissions = (userRole, requiredPermissions) => {
  if (!userRole || !requiredPermissions || requiredPermissions.length === 0) return false
  
  return requiredPermissions.every(permission => 
    hasPermission(userRole, permission)
  )
}

// Feature Access Control
export const FEATURE_ACCESS = {
  CHAT: {
    requiredRole: 'premium_user',
    requiredPermission: 'chat'
  },
  FULL_PHOTOS: {
    requiredRole: 'premium_user',
    requiredPermission: 'full_photos'
  },
  CONTACT_DETAILS: {
    requiredRole: 'premium_user',
    requiredPermission: 'contact_details'
  },
  ADVANCED_SEARCH: {
    requiredRole: 'premium_user',
    requiredPermission: 'advanced_search'
  },
  PROFILE_MODERATION: {
    requiredRole: 'moderator',
    requiredPermission: 'moderate_photos'
  },
  USER_MANAGEMENT: {
    requiredRole: 'admin',
    requiredPermission: '*'
  }
}

// Check if user can access a specific feature
export const canAccessFeature = (userRole, feature) => {
  const featureConfig = FEATURE_ACCESS[feature]
  if (!featureConfig) return false
  
  return hasPermission(userRole, featureConfig.requiredPermission)
}

// Route Protection
export const PROTECTED_ROUTES = {
  '/chat': ['premium_user'],
  '/dashboard': ['free_user', 'premium_user'],
  '/profile/edit': ['free_user', 'premium_user'],
  '/search': ['free_user', 'premium_user'],
  '/admin': ['admin'],
  '/moderator': ['admin', 'moderator']
}

// Check if user can access a route
export const canAccessRoute = (userRole, route) => {
  const allowedRoles = PROTECTED_ROUTES[route]
  if (!allowedRoles) return true // Public route
  
  return allowedRoles.includes(userRole)
}

// Content Visibility Rules
export const CONTENT_VISIBILITY = {
  PROFILE_PHOTO: {
    free_user: 'blurred',
    premium_user: 'full',
    admin: 'full'
  },
  CONTACT_INFO: {
    free_user: 'hidden',
    premium_user: 'visible',
    admin: 'visible'
  },
  CHAT_HISTORY: {
    free_user: 'none',
    premium_user: 'own_only',
    admin: 'all'
  }
}

// Get content visibility for user role
export const getContentVisibility = (userRole, contentType) => {
  return CONTENT_VISIBILITY[contentType]?.[userRole] || 'hidden'
}