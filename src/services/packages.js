import { collection, doc, setDoc, addDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from './firebase'
import { getAllPackages } from '../utils/premiumPackages'

const PACKAGES_COLLECTION = 'packages'
const PLAN_PURCHASES_COLLECTION = 'planPurchases'

/**
 * Seed packages collection from premiumPackages definitions.
 * Call once (e.g. from admin) to populate Firestore.
 */
export const seedPackages = async () => {
  try {
    const packages = getAllPackages()
    for (const pkg of packages) {
      await setDoc(doc(db, PACKAGES_COLLECTION, pkg.id), {
        ...pkg,
        updatedAt: new Date(),
      })
    }
    return { success: true, count: packages.length }
  } catch (err) {
    console.error('[packages] seedPackages error:', err)
    return { success: false, error: err?.message }
  }
}

/**
 * Get all packages from Firestore (or fallback to static definitions)
 */
export const getPackagesFromFirestore = async () => {
  try {
    const snapshot = await getDocs(collection(db, PACKAGES_COLLECTION))
    if (snapshot.empty) {
      return { success: true, data: getAllPackages() }
    }
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    return { success: true, data }
  } catch (err) {
    console.error('[packages] getPackagesFromFirestore error:', err)
    return { success: true, data: getAllPackages() }
  }
}

/**
 * Record a plan purchase (when admin activates or payment completes)
 */
export const recordPlanPurchase = async ({
  userId,
  packageId,
  startDate,
  expiryDate,
  price,
  paymentId = null,
  activatedBy = null,
}) => {
  if (!userId || !packageId) {
    return { success: false, error: 'Missing userId or packageId' }
  }

  try {
    await addDoc(collection(db, PLAN_PURCHASES_COLLECTION), {
      userId,
      packageId,
      startDate: startDate || new Date(),
      expiryDate: expiryDate || new Date(),
      price: price ?? 0,
      paymentId,
      activatedBy,
      createdAt: new Date(),
    })
    return { success: true }
  } catch (err) {
    console.error('[packages] recordPlanPurchase error:', err)
    return { success: false, error: err?.message }
  }
}

/**
 * Get plan purchases for a user
 */
export const getPlanPurchasesByUser = async (userId) => {
  if (!userId) return { success: false, data: [] }

  try {
    const q = query(
      collection(db, PLAN_PURCHASES_COLLECTION),
      where('userId', '==', userId)
    )
    const snapshot = await getDocs(q)
    const data = snapshot.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (b.createdAt?.toDate?.() || 0) - (a.createdAt?.toDate?.() || 0))
    return { success: true, data }
  } catch (err) {
    console.error('[packages] getPlanPurchasesByUser error:', err)
    return { success: false, data: [], error: err?.message }
  }
}
