/**
 * Premium package definitions (Remarriage, Platinum, Gold, NRI)
 * Matches design from package cards: validity, contacts/week, total contacts, price
 */
export const PREMIUM_PACKAGES = {
  remarriage: {
    id: 'remarriage',
    name: 'Remarriage Package',
    validityMonths: 12,
    contactsPerWeek: 12,
    totalContacts: 24,
    price: 2100,
    headerColor: '#800020',
  },
  platinum: {
    id: 'platinum',
    name: 'Platinum Package',
    validityMonths: 6,
    contactsPerWeek: 12,
    totalContacts: 180,
    price: 2500,
    headerColor: '#D4AF37',
  },
  gold: {
    id: 'gold',
    name: 'Gold Package',
    validityMonths: 12,
    contactsPerWeek: 12,
    totalContacts: 320,
    price: 3600,
    headerColor: '#800020',
  },
  nri: {
    id: 'nri',
    name: 'NRI Package',
    validityMonths: 12,
    contactsPerWeek: 12,
    totalContacts: 130,
    price: 4100,
    headerColor: '#D4AF37',
  },
}

export const getPackageById = (id) => {
  if (!id) return null
  return PREMIUM_PACKAGES[id] || null
}

export const getPackageLimits = (packageId) => {
  const pkg = getPackageById(packageId)
  if (!pkg) return null
  return {
    contactsPerWeek: pkg.contactsPerWeek,
    totalContacts: pkg.totalContacts,
  }
}

export const getAllPackages = () => Object.values(PREMIUM_PACKAGES)
