# SmartBill User Flow Documentation

## Overview
SmartBill now follows an **authentication-first approach** that provides a cleaner, more intuitive user experience aligned with industry standards.

## Complete User Journey

### 1. Landing Page (`/`)
- **Purpose**: Marketing and initial user acquisition
- **Actions Available**:
  - "Get Started Free" → Redirects to `/register`
  - "Sign In" → Redirects to `/login`
- **Key Change**: No more plan selection on landing page

### 2. Authentication (`/register` or `/login`)
- **Purpose**: User authentication via Google OAuth
- **Process**:
  - User clicks Google authentication
  - OAuth flow completes
  - User data is stored in auth context
- **Key Change**: No plan parameters preserved during OAuth

### 3. Role Selection (Automatic for new users)
- **Purpose**: Determine user's role in their organization
- **Options**:
  - **Employee**: Team member who will use the system
  - **Business Owner**: Company owner who manages subscriptions
- **Backend Integration**: Role is saved via API call

### 4. Flow Split Based on Role

#### **If Employee Selected**:
```
Role Selection → Dashboard (/dashboard)
```
- Employees go directly to the main application
- No subscription management needed
- Can be invited to companies by Business Owners

#### **If Business Owner Selected**:
```
Role Selection → Pricing Selection (/pricing-selection) → Subscription Processing → Company Dashboard
```

### 5. Pricing Selection (`/pricing-selection`) - Business Owners Only
- **Purpose**: Business Owners choose their subscription plan
- **Features**:
  - Currency auto-detection based on timezone
  - Manual currency selection (USD, EUR, SEK, GBP, NOK, DKK)
  - Two plans: Free and Pro
  - Clean, full-page interface (not a modal)
- **Access Control**: Only accessible to authenticated Business Owners

### 6. Subscription Processing (`/subscription/complete`)
- **Purpose**: Handle subscription creation and payment processing
- **Free Plan Flow**:
  - Creates company with free subscription immediately
  - Redirects to company dashboard
- **Pro Plan Flow**:
  - Creates company and initiates Stripe checkout
  - Redirects to Stripe payment page
  - Returns to `/subscription/success` after payment

### 7. Payment Success (`/subscription/success`)
- **Purpose**: Confirm successful payment and activate subscription
- **Process**:
  - Verifies payment with Stripe
  - Activates company subscription
  - Redirects to company dashboard

### 8. Company Dashboard (`/company`)
- **Purpose**: Company setup and management interface
- **Access**: Business Owners who have completed subscription process

## Key Improvements

### ✅ **Authentication-First Approach**
- Industry standard (like Slack, GitHub, Notion)
- Cleaner user experience
- No confusion about plans before knowing user type

### ✅ **Role-Based Access Control**
- Only Business Owners see pricing/subscription flows
- Employees go directly to application features
- Proper separation of concerns

### ✅ **Simplified Parameter Management**
- No complex plan parameter preservation during OAuth
- Clean session storage usage
- Reduced complexity in routing logic

### ✅ **Single Pricing Interface**
- Removed duplicate PricingModal component
- PricingSelection is the single source for plan selection
- Consistent styling and behavior

## Technical Architecture

### **Component Responsibilities**:
- **LandingPage**: Marketing and initial CTA
- **Register/Login**: Authentication only
- **RoleSelection**: Role determination for new users
- **PricingSelection**: Plan selection for Business Owners
- **SubscriptionComplete**: Subscription processing
- **SubscriptionSuccess**: Payment verification
- **Dashboard**: Employee interface
- **CompanyForm**: Business Owner interface

### **Route Protection**:
```javascript
// Public routes
/ (LandingPage)
/login
/register

// Protected routes (requires authentication)
/pricing-selection (Business Owners only)
/subscription/complete
/subscription/success
/dashboard
/company
```

### **State Management**:
- **Auth Context**: User authentication state
- **Session Storage**: Minimal usage for OAuth flow tracking
- **Local Storage**: Token storage only

## Benefits of New Flow

1. **User Clarity**: Users know exactly what they're signing up for
2. **Reduced Friction**: No plan selection confusion before authentication
3. **Better Conversion**: Authentication commitment before plan decision
4. **Scalability**: Easy to add new user types or subscription models
5. **Maintainability**: Cleaner code without complex parameter juggling

## Migration Notes

### **Removed Components**:
- `PricingModal.jsx` and `PricingModal.css` (replaced by PricingSelection)

### **Updated Components**:
- **LandingPage**: Removed pricing modal, added direct auth CTAs
- **Register**: Removed plan parameter handling
- **Login**: Simplified to auth-only functionality
- **SubscriptionComplete**: Enhanced company-based subscription processing

### **New Components**:
- **PricingSelection**: Full-page pricing interface for Business Owners

This new flow provides a much cleaner, more professional user experience that aligns with modern SaaS application standards.
