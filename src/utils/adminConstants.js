// Admin-specific constants

export const ADMIN_ROLE = 'admin'

export const PROFILE_STATUS_ADMIN = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  HIDDEN: 'hidden',
}

export const REPORT_STATUS = {
  OPEN: 'open',
  RESOLVED: 'resolved',
}

export const ADMIN_ACTIONS = {
  SUSPEND_USER: 'suspend_user',
  ACTIVATE_USER: 'activate_user',
  DELETE_USER: 'delete_user',
  VERIFY_USER: 'verify_user',
  APPROVE_PROFILE: 'approve_profile',
  REJECT_PROFILE: 'reject_profile',
  HIDE_PROFILE: 'hide_profile',
  DELETE_INTEREST: 'delete_interest',
  SUSPEND_FROM_REPORT: 'suspend_from_report',
  RESOLVE_REPORT: 'resolve_report',
  ACTIVATE_PREMIUM: 'activate_premium',
  EXTEND_PREMIUM: 'extend_premium',
  CANCEL_PREMIUM: 'cancel_premium',
  WARN_USER: 'warn_user',
}

export const SPAM_THRESHOLD = { count: 20, windowHours: 1 }
export const REPORT_SEVERITY = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' }
export const HIGH_SEVERITY_REVIEW_THRESHOLD = 3
