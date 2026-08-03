# API Integration Documentation

This document maps every frontend component and server action to its corresponding backend endpoint.

**Base URL:** `https://rent-nest-frontend-phi.vercel.app`  
**Auth:** JWT stored in `httpOnly` cookies (`accessToken`, `refreshToken`). Passed via `Cookie: accessToken=<token>` header in server actions.

---

## Authentication

| Component / Action | Method | Endpoint | Description |
|---|---|---|---|
| `RegisterForm.tsx` → `registerAction` | POST | `/api/auth/register` | Register new user with name, email, password, role (TENANT/LANDLORD), phone, address |
| `LoginForm.tsx` → `loginAction` | POST | `/api/auth/login` | Login and receive accessToken + refreshToken stored as httpOnly cookies |
| `DashboardSidebar.tsx` → `logout` service | POST | `/api/auth/logout` | Clear auth cookies and redirect to login |
| `proxy.ts` → `getNewAccessToken` | POST | `/api/auth/refresh-token` | Silently refresh expired accessToken using refreshToken |
| `getMe` service | GET | `/api/auth/me` | Fetch current user profile — used in Navbar and dashboard layouts |

---

## Public — Properties

| Component / Action | Method | Endpoint | Description |
|---|---|---|---|
| `PropertiesClient.tsx` → `getProperties` | GET | `/api/properties?search=&city=&minPrice=&maxPrice=&page=` | Fetch all properties with search and filter support |
| `FeaturedProperties.tsx` → `getProperties` | GET | `/api/properties?limit=3` | Fetch featured properties for homepage |
| `properties/[id]/page.tsx` → `getPropertyById` | GET | `/api/properties/:id` | Fetch single property with landlord info, category, reviews |

---

## Public — Categories

| Component / Action | Method | Endpoint | Description |
|---|---|---|---|
| `landlord-properties/page.tsx` → `getCategories` | GET | `/api/categories` | Fetch all categories for property create/edit form dropdown |
| `admin-dashboard/categories/page.tsx` → `getCategories` | GET | `/api/categories` | Fetch all categories for admin management |

---

## Tenant

| Component / Action | Method | Endpoint | Description |
|---|---|---|---|
| `RentalRequestForm.tsx` → `createRentalRequest` | POST | `/api/rentals` | Submit a rental request for a property with propertyId, message, moveInDate |
| `dashboard/page.tsx` → `getTenantRentals` | GET | `/api/rentals` | Fetch all rental requests for the logged-in tenant |
| `dashboard/rentals/[id]/page.tsx` → `getRentalRequestById` | GET | `/api/rentals/:id` | Fetch single rental request with property, payment, and review details |
| `dashboard/rentals/[id]/page.tsx` → `createPayment` | POST | `/api/payments/create` | Create Stripe checkout session for an approved rental request — returns `url` for redirect |
| `dashboard/rentals/[id]/page.tsx` → `createReview` | POST | `/api/reviews` | Submit a review with rating and comment for a completed rental |
| `dashboard/payments/page.tsx` → `getTenantPayments` | GET | `/api/payments` | Fetch all payments for the logged-in tenant |
| `dashboard/payments/[id]/page.tsx` → `getPaymentById` | GET | `/api/payments/:id` | Fetch single payment details with transaction ID, session ID, paidAt |

---

## Landlord

| Component / Action | Method | Endpoint | Description |
|---|---|---|---|
| `landlord-dashboard/page.tsx` → `getLandlordRequests` | GET | `/api/landlord/requests` | Fetch all rental requests for the landlord's properties |
| `landlord-dashboard/page.tsx` → `updateRentalRequestStatus` | PATCH | `/api/landlord/requests/:id` | Approve or reject a rental request |
| `landlord-dashboard/properties/page.tsx` → `createProperty` | POST | `/api/landlord/properties` | Create a new property listing with title, description, location, city, price, bedrooms, bathrooms, area, images, categoryId |
| `landlord-dashboard/properties/page.tsx` → `updateProperty` | PUT | `/api/landlord/properties/:id` | Update an existing property listing |
| `landlord-dashboard/properties/page.tsx` → `deleteProperty` | DELETE | `/api/landlord/properties/:id` | Delete a property listing |

> **Note:** There is no dedicated "get landlord properties" endpoint. Properties are fetched from `GET /api/properties` and filtered client-side by `landlordId` matching the logged-in user's ID.

---

## Admin

| Component / Action | Method | Endpoint | Description |
|---|---|---|---|
| `admin-dashboard/page.tsx` → `getAllUsers` | GET | `/api/admin/users` | Fetch all platform users |
| `admin-dashboard/page.tsx` → `updateUserStatus` | PATCH | `/api/admin/users/:id` | Ban or unban a user by updating their status |
| `admin-dashboard/properties/page.tsx` → `getAdminProperties` | GET | `/api/admin/properties` | Fetch all properties on the platform |
| `admin-dashboard/properties/page.tsx` → `deleteProperty` | DELETE | `/api/properties/:id` | Delete a property |
| `admin-dashboard/rentals/page.tsx` → `getAdminRentals` | GET | `/api/admin/rentals` | Fetch all rental requests on the platform |
| `admin-dashboard/payments/page.tsx` → `getAllPayments` | GET | `/api/payments` | Fetch all payments on the platform |
| `admin-dashboard/payments/[id]/page.tsx` → `getPaymentById` | GET | `/api/payments/:id` | Fetch single payment with full tenant and property details |
| `admin-dashboard/categories/page.tsx` → `createCategory` | POST | `/api/categories` | Create a new property category |
| `admin-dashboard/categories/page.tsx` → `deleteCategory` | DELETE | `/api/categories/:id` | Delete a property category |

---

## Payment Flow

```
Tenant clicks "Pay Now"
  → POST /api/payments/create { rentalRequestId }
  → Receives { url: "https://checkout.stripe.com/..." }
  → Redirected to Stripe Checkout
  → On success → /payment/success
  → On cancel  → /payment/cancel
```

---

## Auth & Token Flow

```
Login → POST /api/auth/login
  → accessToken (httpOnly, 24h) + refreshToken (httpOnly, 7d) set in cookies

Every request → proxy.ts checks accessToken validity
  → If expired but refreshToken valid → POST /api/auth/refresh-token → new accessToken set
  → If both invalid → redirect to /login

Role-based redirect on login:
  ADMIN   → /admin-dashboard
  LANDLORD → /landlord-dashboard
  TENANT  → /dashboard
```

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 + shadcn/ui (Base UI) |
| Data Fetching | TanStack Query v5 (useQuery, useMutation) |
| Forms | React Hook Form + Zod validation |
| Auth | JWT (httpOnly cookies) |
| Payments | Stripe Checkout (redirect flow) |
| Deployment | Vercel |