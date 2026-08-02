# RentNest Frontend

A modern full - stack rental property management platform built with **Next.js 15** and **TypeScript**. RentNest connects tenants with verified landlords - browse properties, submit rental requests, make payments via Stripe, and leave reviews.

🔗 **Live Demo:** [https://rent-nest-frontend-phi.vercel.app](https://rent-nest-frontend-phi.vercel.app)  
🔗 **Backend API:** [https://rent-nest-lilac.vercel.app](https://rent-nest-lilac.vercel.app)  
🔗 **Backend Repo:** [https://github.com/ibrahim3761/RentNest](https://github.com/ibrahim3761/RentNest)

---

## Features

### Public
- Browse all rental properties with search by title/location and filter by city and price range
- View property detail page with image gallery, landlord info, and reviews
- Paginated property listings

### Tenant
- Register as a tenant and submit rental requests with a message and optional move-in date
- Track rental request status (PENDING → APPROVED → ACTIVE → COMPLETED)
- Pay approved requests via Stripe Checkout to activate rental
- Leave a star rating and review for completed rentals
- View full payment history with transaction details

### Landlord
- Register as a landlord and list properties with images, category, location, and pricing
- Create, edit, and delete property listings
- Approve or reject incoming tenant rental requests

### Admin
- View platform-wide overview: total users, properties, rentals, payments
- Ban and unban users
- View all properties, rental requests, and payments
- Manage property categories (create and delete)
- View detailed payment breakdowns

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (Base UI) |
| Data Fetching | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Auth | JWT (httpOnly cookies) |
| Payments | Stripe Checkout |
| Notifications | Sonner |
| Icons | Lucide React |
| Deployment | Vercel |

---

## Project Structure

```
rent-nest-front-end/
├── app/
│   ├── (authGroup)/          # Login and Register pages
│   ├── (publicGroup)/        # Homepage, Properties, About
│   │   └── properties/
│   │       └── [id]/         # Property detail page
│   ├── (dashboardGroup)/     # All role-based dashboards
│   │   ├── dashboard/        # Tenant dashboard
│   │   │   ├── rentals/      # Rental history + detail
│   │   │   └── payments/     # Payment history + detail
│   │   ├── landlord-dashboard/
│   │   │   └── properties/   # Property CRUD
│   │   └── admin-dashboard/
│   │       ├── properties/
│   │       ├── rentals/
│   │       ├── payments/
│   │       └── categories/
│   └── payment/
│       ├── success/          # Stripe success redirect
│       └── cancel/           # Stripe cancel redirect
├── components/
│   ├── shared/               # Navbar, Footer
│   └── ui/                   # shadcn/ui components
├── lib/
│   └── type.ts               # All TypeScript types
├── service/                  # getMe, logout, refreshToken
├── utils/                    # JWT utilities
├── providers/                # TanStack Query provider
├── proxy.ts                  # Next.js middleware (auth + role routing)
├── API_INTEGRATION.md        # Full API endpoint mapping
└── next.config.ts
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/ibrahim3761/RentNest-Frontend.git
cd RentNest-Frontend

# Install dependencies
pnpm install
```

### Environment Variables

Create a `.env.local` file at the root:

```env
BACKEND_API_URL=https://rent-nest-lilac.vercel.app
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

### Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | ibrahim1admin@gmail.com | 123456 |
| Landlord | ibrahim1@gmail.com | 123456 |
| Tenant | ibrahim2@gmail.com | 123456 |

---

## API Integration

See [API_INTEGRATION.md](./API_INTEGRATION.md) for a full mapping of frontend components to backend endpoints.

---

## Key Implementation Highlights

- **Role-based routing** via `proxy.ts` middleware — TENANT, LANDLORD, and ADMIN each get their own protected dashboard with automatic redirect on login
- **Token refresh** — expired access tokens are silently refreshed using the refresh token without interrupting the user session
- **TanStack Query** — used for all dashboard data fetching with `useQuery` and `useMutation`, with `invalidateQueries` for instant UI updates after mutations
- **Zod + React Hook Form** — all forms are validated client-side with Zod schemas before hitting the API
- **Stripe payment flow** — tenant clicks Pay Now → server creates Stripe session → redirect to Stripe Checkout → success/cancel pages handle the outcome
- **Next.js caching** — `revalidateTag` busts server-side cache immediately after mutations so data is always fresh

---
