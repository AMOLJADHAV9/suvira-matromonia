import { getFunctions, httpsCallable } from 'firebase/functions'
import { app } from './firebase'

/**
 * Call the `deleteUserAccount` Cloud Function.
 * The function deletes: Firestore user doc, interests (sent + received),
 * chats, planPurchases, and the Firebase Auth account.
 * Returns { data: { success: true } } on success.
 */
export const deleteUserAccount = async () => {
    const functions = getFunctions(app)
    const fn = httpsCallable(functions, 'deleteUserAccount')
    return fn()
}
