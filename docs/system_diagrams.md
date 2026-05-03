# Suvira Matrimony System Diagrams

The following diagrams illustrate the core architectural and functional workflows of the Suvira Matrimony platform.

---

## 1. High-Level System Architecture

This diagram shows how the React frontend interacts with the Firebase Ecosystem and Razorpay for serverless operations.

```mermaid
graph TD
    Client[("📱 React App\n(Vite + Tailwind)")]
    
    subgraph "Firebase Platform"
        Auth{{"🔒 Firebase Auth"}}
        DB[("🗄️ Cloud Firestore\n(NoSQL)")]
        Storage[["📂 Firebase Storage\n(Images)"]]
        Functions[["⚙️ Cloud Functions\n(Node.js)"]]
        Hosting{{"🌐 Firebase Hosting"}}
    end
    
    Razorpay(("💳 Razorpay API\n(Payment Gateway)"))

    %% Interactions
    Client -->|"Email/Password"| Auth
    Client -->|"Read/Write User Data"| DB
    Client -->|"Profile Pictures"| Storage
    Client <-->|"Deploy & Serve"| Hosting
    
    %% Secure Server Operations
    Client -->|"Call Create Order"| Functions
    Client -->|"Call Verify Payment"| Functions
    Functions -->|"Validate & Update Subscriptions"| DB
    
    %% Third Party
    Functions <-->|"Server-to-Server Verification"| Razorpay
    Client -->|"Client-side Checkout"| Razorpay
```

---

## 2. User Onboarding & Profile Lifecycle

This flowchart describes the journey a user takes from first visiting the site to getting their profile approved by an admin.

```mermaid
sequenceDiagram
    participant User
    participant App as React App
    participant Auth as Firebase Auth
    participant DB as Firestore
    participant Admin

    User->>App: Submits Registration Form
    App->>Auth: createUserWithEmailAndPassword()
    Auth-->>App: Returns Auth Credential
    App->>DB: Create User Document (role: free_user, status: pending)
    
    User->>App: Fills Profile Micro-details (5 Steps)
    App->>DB: Updates User Document
    
    note right of DB: Profile remains in "Pending" state
    
    Admin->>App: Logs into Admin Dashboard
    App->>DB: Fetches Pending Profiles
    Admin->>DB: Clicks "Approve Profile"
    DB-->>App: status updated to "approved"
    
    User->>App: Logs in
    App->>DB: Fetches Profile Status
    DB-->>User: Granted access to Search & Matches
```

---

## 3. Interest & Match Workflow

This diagram outlines what happens when a user attempts to send an interest to a potential match, including validation limits and the acceptance flow.

```mermaid
stateDiagram-v2
    [*] --> InterestInitiated: User A clicks "Send Interest"
    
    state InterestInitiated {
        direction LR
        LimitCheck: Check Contact Limits
        ValidLimit: Limit OK
        LimitExceeded: Limit Exceeded
        
        LimitCheck --> ValidLimit: User is Premium
        LimitCheck --> LimitExceeded: User is Free
    }
    
    InterestInitiated --> Pending: Creates DB Record
    InterestInitiated --> [*]: Blocked (Prompts Upgrade)
    
    state Pending {
        direction LR
        UserBScreen: Shows on User B's "Incoming" Tab
        UserAScreen: Shows on User A's "Sent" Tab
    }
    
    Pending --> Accepted: User B clicks "Accept"
    Pending --> Rejected: User B clicks "Reject"
    
    state Accepted {
        direction LR
        ChatCreated: Chat Room Created
        MessageUnlocked: "Message" Button Unlocked for Both
    }
    
    Rejected --> [*]
    Accepted --> [*]
```

---

## 4. Payment & Subscription Processing

This sequence demonstrates the secure transaction flow preventing spoofing or client-side manipulation of payment success.

```mermaid
sequenceDiagram
    participant Client as User Browser
    participant CloudFn as Firebase Functions
    participant Razorpay API
    participant DB as Firestore

    Client->>CloudFn: 1. Request Order (Package ID)
    CloudFn->>Razorpay API: Generate Order (Amount, Currency)
    Razorpay API-->>CloudFn: order_id
    CloudFn-->>Client: Returns order_id
    
    Client->>Razorpay API: 2. Open Checkout UI
    Razorpay API-->>Client: User Enters Details & Pays
    Razorpay API-->>Client: Returns payment_id & signature
    
    Client->>CloudFn: 3. Verify Payment (payment_id, order_id, signature)
    CloudFn->>CloudFn: Cryptographically verifies SHA256 Signature
    
    alt Signature is Valid
        CloudFn->>DB: Upgrade user to premium_user
        CloudFn->>DB: Set purchaseDate & expiryDate
        CloudFn->>DB: Write to planPurchases collection
        CloudFn-->>Client: Success Response
        Client->>Client: Redirects to Dashboard with Success Banner
    else Signature is Invalid
        CloudFn-->>Client: Error (Transaction Failed/Spoofed)
    end
```
