# Fix: Firebase 400 Bad Request on sendOobCode (Email Verification / Password Reset)

If you see `POST .../sendOobCode 400 (Bad Request)`, follow these steps:

## 1. Add Authorized Domains

1. Go to [Firebase Console](https://console.firebase.google.com) → your project
2. **Authentication** → **Settings** (gear icon) → **Authorized domains**
3. Add:
   - `localhost` — for local development
   - Your production domain (e.g. `yourapp.com`) — for deployment

## 2. Enable Email/Password Sign-In

1. **Authentication** → **Sign-in method**
2. Enable **Email/Password** (and **Email link** if needed)

## 3. Configure Email Templates (Optional)

1. **Authentication** → **Templates**
2. Open **Email address verification** and **Password reset**
3. Ensure a sender name is set and templates are valid

## 4. Check Rate Limits

Firebase limits how often verification emails can be sent. If you see "too many requests", wait a few minutes before trying again.
