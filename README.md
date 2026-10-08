# FoodPanda Frontend

> This is an educational project for learning purposes and is not affiliated with Foodpanda.

A React single-page app for the FoodPanda-style food delivery platform. It uses the Django REST API in `../foodpanda_backend`.

It has one UI for three roles:

- **Customers** browse restaurants, fill a cart, check out with cash or card, track orders and write reviews.
- **Restaurant owners** manage restaurants, categories and dishes, and move incoming orders through preparation.
- **Riders** accept orders that are ready for pickup and deliver them.

Guests can browse restaurants, menus and reviews without logging in.

The UI uses the real restaurant cover photos, logos and dish photos from the API. Owners can upload them, and images fall back to a neutral placeholder when one is missing.

---

## Tech stack

| Concern       | Choice                                                                                               |
| ------------- | ---------------------------------------------------------------------------------------------------- |
| UI library    | React 19 (JavaScript, function components + hooks)                                                   |
| Build tool    | Vite 8                                                                                               |
| Routing       | React Router 7                                                                                       |
| HTTP          | Axios, with JWT interceptors                                                                         |
| Styling       | Tailwind CSS 4, with a pink/white theme in `src/app/styles/index.css`                                |
| State         | Context API: `AuthContext` and `CartContext`                                                         |
| Icons         | lucide-react (no emoji anywhere in the UI)                                                           |
| Fonts         | Poppins (headings) and Inter (body), bundled with Fontsource, so there are no external font requests |
| Notifications | react-hot-toast                                                                                      |

---

## Folder structure

The code is organised by **feature** (what the app does), not by file type.

```
foodpanda_frontend/
├── .env / .env.example     # API URL (see ".env explained")
├── eslint.config.js        # lint rules, including the architecture import rules
├── .prettierrc.json        # formatting rules
├── jsconfig.json           # path aliases for editors (@app, @features, @shared)
├── vite.config.js          # plugins, path aliases, /api proxy to Django
├── public/                 # favicon, hero photo
└── src/
    ├── main.jsx            # entry point: fonts, global CSS, <App />
    │
    ├── app/                # the application shell
    │   ├── App.jsx                   # providers + routes + toast container
    │   ├── routes.jsx                # EVERY route, grouped by who may open it
    │   ├── providers/AppProviders.jsx# Router → AuthProvider → CartProvider
    │   ├── layouts/MainLayout.jsx    # navbar + page + footer
    │   ├── NotFoundPage.jsx
    │   └── styles/index.css          # Tailwind, brand colours, .btn/.card/.input utilities
    │
    ├── features/           # one folder per business area
    │   ├── auth/           # login, register, profile, session
    │   │   ├── api/          authApi.js
    │   │   ├── context/      AuthContext.js, AuthProvider.jsx
    │   │   ├── hooks/        useAuth, useLoginForm, useRegisterForm, useProfileForm, usePasswordForm
    │   │   ├── components/   ProtectedRoute, AuthLayout, PasswordInput, RolePicker, DemoAccounts, ProfileForm, PasswordForm
    │   │   ├── pages/        LoginPage, RegisterPage, ProfilePage
    │   │   ├── constants.js, utils.js
    │   │   └── index.js      # the feature's public API
    │   ├── restaurants/    # browsing: home page and restaurant page
    │   │   ├── api/          restaurantsApi.js, categoriesApi.js, menuItemsApi.js
    │   │   ├── hooks/        useRestaurants, useCities, useCuisines, useRestaurantMenu, useRestaurantPage, useCategoryScrollSpy
    │   │   ├── components/   Hero, CuisineRow, RestaurantFilters, RestaurantGrid, RestaurantCard,
    │   │   │                 RestaurantHeader, CategoryTabs, MenuSections, MenuItemCard
    │   │   ├── pages/        HomePage, RestaurantPage
    │   │   ├── utils/        deliveryEstimate.js
    │   │   └── constants.js, index.js
    │   ├── cart/           # the one-restaurant shopping cart
    │   │   ├── context/      CartContext.js, CartProvider.jsx
    │   │   ├── hooks/        useCart, useAddToCart, useCartPage
    │   │   ├── components/   CartSidebar, MobileCartBar, ReplaceCartDialog, CartItemRow, CartSummary
    │   │   ├── pages/        CartPage
    │   │   └── constants.js, index.js
    │   ├── orders/         # checkout, my orders, order detail
    │   │   ├── api/          ordersApi.js
    │   │   ├── hooks/        useCheckout, useMyOrders, useOrderDetail
    │   │   ├── components/   OrderCard, StatusFilterTabs, StatusTimeline, OrderActions, OrderItemsCard, OrderInfoCards,
    │   │   │                 OptionTile, CheckoutAddressSection, CheckoutPaymentSection, CheckoutSummary
    │   │   ├── pages/        CheckoutPage, MyOrdersPage, OrderDetailPage
    │   │   └── constants.js  # status workflow (mirrors the backend), index.js
    │   ├── reviews/
    │   │   ├── api/          reviewsApi.js
    │   │   ├── hooks/        useRestaurantReviews, useMyReview, useReviewForm
    │   │   └── components/   RestaurantReviews, OrderReviewSection, ReviewForm
    │   ├── addresses/
    │   │   ├── api/          addressesApi.js
    │   │   ├── hooks/        useAddresses, useAddressManager, useAddressForm
    │   │   └── components/   AddressManager, AddressForm
    │   ├── owner/          # restaurant owner dashboard
    │   │   ├── hooks/        useOwnerDashboard, useOwnerMenu, useOwnerOrders, useRestaurantForm, useMenuItemForm, useCategoryForm
    │   │   ├── components/   StatCard, OwnerRestaurantCard, RestaurantForm, MenuCategorySection, MenuItemForm,
    │   │   │                 CategoryForm, OwnerOrderActions
    │   │   └── pages/        OwnerDashboardPage, OwnerMenuPage, OwnerOrdersPage
    │   └── rider/          # delivery dashboard
    │       ├── hooks/        useRiderDashboard
    │       ├── components/   RiderTabs, AvailableOrders, ActiveDeliveries, DeliveryHistory
    │       └── pages/        RiderDashboardPage
    │
    └── shared/             # generic building blocks, used by any feature
        ├── components/ui/      Modal, ConfirmDialog, SmartImage, ImageUpload, Skeletons, Spinner, StatusBadge,
        │                       StarRating, QuantityStepper, Pagination, StateMessages (empty/error), Avatar
        ├── components/layout/  Navbar, Footer, Logo, navLinks.js
        ├── lib/                apiClient.js (axios + token refresh + uploads), tokenStorage.js
        ├── hooks/              useAsync.js, usePolling.js
        └── utils/              format.js, errors.js, constants.js
```

---

## Architecture

**Three layers, and imports only point one way:**

```
app  ──▶  features  ──▶  shared
```

- **`shared/`** knows nothing about the business. It holds UI pieces, the axios client and helpers. It never imports from a feature. For example, the `Navbar` receives the user, the cart count and the logout handler as props from `MainLayout`.
- **`features/`** each own one business area. A feature may use `shared/` and other features.
- **`app/`** wires everything together: providers, layout and the route table.

**Inside a feature, each kind of code has one home:**

| Folder                      | Contains                                                        | Example                            |
| --------------------------- | --------------------------------------------------------------- | ---------------------------------- |
| `api/` (`.js`)              | Every HTTP call for that resource. Nothing else calls axios.    | `ordersApi.list({ status, page })` |
| `hooks/` (`.js`)            | Data fetching, state and business logic.                        | `useCheckout()`, `useMyOrders()`   |
| `components/` (`.jsx`)      | Presentational pieces that receive props.                       | `<OrderCard order={o} />`          |
| `pages/` (`.jsx`)           | One file per route. A page calls hooks and arranges components. | `CheckoutPage.jsx`                 |
| `constants.js` / `utils.js` | Fixed values (`UPPER_CASE`) and small pure helpers.             | `PROGRESS_STEPS`, `homeForRole()`  |
| `index.js`                  | The feature's **public API**.                                   | `export { useCart } from ...`      |

**Rules, enforced by ESLint (`no-restricted-imports`):**

1. A feature imports another feature only through its `index.js`: `import { useCart } from '@features/cart'`, never `'@features/cart/hooks/useCart'`. Files inside the same feature use relative imports.
2. `shared/` may not import from `features/` or `app/`.
3. `features/` may not import from `app/`.

**Path aliases** replace long relative paths: `@app`, `@features` and `@shared` point to the folders under `src/`. They are defined in `vite.config.js` (for the build) and `jsconfig.json` (for editors).

**Naming:** components are `PascalCase.jsx`, hooks start with `use`, constants are `UPPER_CASE`.

**Where do I put new code?**

- A new page for customers to see their favourite restaurants: a `features/favourites/` folder with `api/`, `hooks/`, `components/`, `pages/` and `index.js`, plus one line in `app/routes.jsx`.
- A new button style or dialog used in several places: `shared/components/ui/`.
- A new endpoint on an existing resource: one function in that feature's `api/` file, then a hook that calls it.

---

## Code quality

| Command                | What it does                                    |
| ---------------------- | ----------------------------------------------- |
| `npm run lint`         | ESLint: React, hooks and the architecture rules |
| `npm run lint:fix`     | Same, and fixes what it can                     |
| `npm run format`       | Formats every file with Prettier                |
| `npm run format:check` | Checks formatting without changing files        |

Three `react-hooks` rules that prepare code for the React Compiler (`refs`, `set-state-in-effect`, `use-memo`) are turned off in `eslint.config.js`, because this project does not use the compiler.

---

## Setup on Windows

Prerequisites:

- **Node.js 18 or newer.** Check with `node -v`.
- **The backend set up** as described in `../foodpanda_backend/README.md`: PostgreSQL, a virtual environment, `migrate` and `seed_demo`.

In PowerShell or cmd:

```bash
cd C:\Users\<you>\Downloads\foodpanda_frontend
npm install
copy .env.example .env
npm run dev
```

Open <http://localhost:5173>.

Other scripts:

| Command           | What it does                                                  |
| ----------------- | ------------------------------------------------------------- |
| `npm run dev`     | Development server with hot reload, on port 5173              |
| `npm run build`   | Production build into `dist/`                                 |
| `npm run preview` | Serves the built `dist/` on port 4173. It proxies `/api` too. |

---

## `.env` explained

| Variable          | Example                     | Purpose                                                                                                                         |
| ----------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_API_URL`    | `http://127.0.0.1:8000/api` | Where the Django API lives. It must end with `/api` and have no trailing slash.                                                 |
| `VITE_API_DIRECT` | `false` (default)           | Optional. Set it to `true` to call `VITE_API_URL` straight from the browser. This only works if the backend sends CORS headers. |

Only variables that start with `VITE_` are visible to the browser code. Restart `npm run dev` after you change `.env`.

**Why a proxy?** By default the app calls `/api/...` on its own origin, and Vite forwards those requests to the origin in `VITE_API_URL`. The `server.proxy` and `preview.proxy` settings in `vite.config.js` do this. It works whatever the backend's CORS settings are. The backend now allows `http://localhost:5173` through `CORS_ALLOWED_ORIGINS`, so `VITE_API_DIRECT=true` also works for that origin.

**Images** are absolute URLs returned by the API (`http://127.0.0.1:8000/media/...`), and the browser loads them straight from Django. They're served only while the backend runs with `DEBUG=True`.

---

## Running backend and frontend together

Use two terminals.

**Terminal 1: the backend**

```bash
cd C:\Users\<you>\Downloads\foodpanda_backend
venv\Scripts\activate
python manage.py runserver
```

**Terminal 2: the frontend**

```bash
cd C:\Users\<you>\Downloads\foodpanda_frontend
npm run dev
```

Then open <http://localhost:5173>. If you see _"Cannot reach the server"_, the backend isn't running on port 8000.

To reset the demo data, run `python manage.py seed_demo` in the backend folder.

---

## Demo logins

These come from the backend's `seed_demo` command. Every password is **`Demo@12345`**.

| Username       | Role     | Try this                                                      |
| -------------- | -------- | ------------------------------------------------------------- |
| `ali_khan`     | customer | Order food, view past orders, edit a review, manage addresses |
| `sara_ahmed`   | customer | Has on-the-way, preparing and cancelled orders                |
| `usman_tariq`  | owner    | Owns Karachi Biryani House and Lahore Tikka Corner            |
| `hina_malik`   | owner    | Owns Islamabad Pizza Hub                                      |
| `bilal_rider`  | rider    | Has a delivery on the way                                     |
| `kamran_rider` | rider    | Can accept the order that's being prepared                    |

The backend renamed its demo accounts (they used to be `demo_customer`, `demo_owner` and so on). The quick-fill buttons on the login page still show the old names, so type the usernames above instead.

---

## Pages by role

| Route                    | Who                | What                                                                                                                                                                                      |
| ------------------------ | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                      | everyone           | Photo hero with search, popular cuisines (real dish photos), restaurant cards with cover, logo, rating, delivery-time estimate and city; filter by city and open now, sorting, pagination |
| `/restaurants/:id`       | everyone           | Large cover banner and logo, rating, sticky category tabs with scroll-spy, dish cards with photos, sticky cart sidebar (floating cart bar on mobile), reviews                             |
| `/login`, `/register`    | guests             | Login with demo quick-fill; register with a role picker (customer, owner or rider)                                                                                                        |
| `/cart`                  | guests, customers  | Change quantities, remove items, see the total. The cart holds one restaurant only.                                                                                                       |
| `/checkout`              | customer           | Pick or add an address, choose cash or card, place the order                                                                                                                              |
| `/orders`                | customer           | Order history with status filter tabs and badges                                                                                                                                          |
| `/orders/:id`            | any logged-in user | Items, total, payment and status timeline. The actions depend on the role: a customer can cancel or pay and review; an owner or rider can move the status forward.                        |
| `/profile`               | any logged-in user | Edit your details and bio, change your password, and (for customers) manage addresses                                                                                                     |
| `/owner`                 | owner              | Stats; create, edit, open, close or delete restaurants; upload, preview, replace or remove the **cover photo and logo**                                                                   |
| `/owner/restaurants/:id` | owner              | Categories (add, rename, delete) and dishes (add, edit, delete, availability toggle), with **dish photo** upload and preview                                                              |
| `/owner/orders`          | owner              | Incoming orders by status. Only valid next-status buttons appear. Refreshes every 20 s.                                                                                                   |
| `/rider`                 | rider              | Available orders to accept, active deliveries (on the way, delivered) and history. Refreshes every 20 s.                                                                                  |

The order status buttons follow the backend's workflow exactly (`src/features/orders/constants.js` mirrors `TRANSITIONS` in `orders/views.py`):

```
pending ──owner──▶ confirmed ──owner──▶ preparing ──rider accepts, then──▶ on_the_way ──rider──▶ delivered
   │                  │
   └─customer/owner─▶ cancelled ◀─owner─┘
```

---

## How data flows

Here is what happens when a customer opens **My Orders**:

```
 Page + hook           api file              axios (apiClient)               Django REST API            PostgreSQL
┌──────────────┐    ┌────────────────┐    ┌──────────────────────────┐    ┌─────────────────────────┐   ┌─────────────┐
│ MyOrdersPage │───▶│ ordersApi.list │───▶│ request interceptor adds │───▶│ GET /api/orders/        │──▶│ SELECT ...  │
│ useMyOrders()│    │ ({status,page})│    │ Authorization: Bearer .. │    │ JWT auth → OrderViewSet │   │ orders_order│
└──────▲───────┘    └────────────────┘    └──────────────────────────┘    │ filters by role, paginates  │ + items ... │
       │                                     (Vite proxies /api →          └────────────┬────────────┘   └──────┬──────┘
       │                                      127.0.0.1:8000 in dev)                    │                       │
       │            JSON {count, results:[...]} ◀── response interceptor ◀── serializer ◀┴──── rows ◀────────────┘
       └── setData → re-render with OrderCard list        (on 401: refresh token, retry once)
```

1. **Page and hook.** `MyOrdersPage.jsx` only renders. It calls the `useMyOrders()` hook, which holds the status filter and page number and runs `useAsync(() => ordersApi.list({ status, page }))`. `useAsync` tracks the `loading`, `error` and `data` state.
2. **API file.** `src/features/orders/api/ordersApi.js` knows the endpoint (`/orders/`) and the parameters. It returns `response.data`.
3. **Axios.** In `src/shared/lib/apiClient.js`, the request interceptor attaches `Authorization: Bearer <access>` from localStorage. In development, Vite forwards `/api/...` to Django.
4. **Django.** SimpleJWT authenticates the token, and `OrderViewSet.get_queryset()` limits the results by role: a customer's own orders, an owner's restaurants, or a rider's deliveries. django-filter applies `?status=`, and DRF paginates 10 per page.
5. **PostgreSQL.** The ORM runs the SQL query. The rows are serialized to JSON.
6. **Back up the chain.** The response interceptor passes success straight through. If the response is **401**, it calls `/auth/token/refresh/` once (concurrent 401s share the same refresh), stores the new access token and replays the request. If the refresh fails, it logs the user out.
7. **Render.** The page receives `{ count, next, previous, results }`, and React re-renders the order cards and pagination. On an error, `shared/utils/errors.js` turns the DRF error body into a friendly message for an error state or a toast.

Writes work the same way. **Checkout** (`useCheckout()` in `features/orders/hooks/`), for example:

- `POST /orders/` with `{ restaurant, address, payment_method, items:[{menu_item, quantity}] }`. The server validates the order and computes the total from current prices.
- For card payments, the page then calls `POST /orders/{id}/pay/`, which is simulated.
- The cart is cleared, and the page redirects to `/orders/{id}`.

**Image uploads** (owner forms) go through `saveWithFiles()` in `src/shared/lib/apiClient.js`:

- A picked `File` makes the request `multipart/form-data`: a `FormData` with the text fields and the file. Axios sets the multipart header and boundary itself, which is why the axios instance has no fixed `Content-Type`.
- Removing an image sends JSON `{ "image": null }` (or `"logo"`), because multipart can't express null.
- Leaving an image untouched sends nothing for that field.

---

## Notes and design decisions

- **One-restaurant cart.** The backend rejects orders that mix restaurants. If you add a dish from a different restaurant, the app asks whether to clear the cart and start a new one.
- **Totals.** The cart total is for display only. The server always recalculates the order total from current menu prices.
- **Deleting.** A restaurant, category or dish that orders still reference can't be deleted, and neither can an address used by an order. The API answers `409` with an explanation, which the UI shows as a toast. For dishes, the UI suggests switching to unavailable instead.
- **Payments.** Payment badges cover `pending`, `paid`, `failed` and **`refunded`** (teal). When a customer cancels a pending order they already paid for by card, the backend refunds it. The cancel dialog warns about this first, and the order page then explains the refund.
- **Images.** Covers, logos and dish photos come from the API. While an image loads it shows a shimmering skeleton, then fades in. If it is missing or broken, a neutral grey placeholder with an icon is shown, never an emoji.
- **Delivery time.** The API has no delivery-time field, so the "25-40 min" shown on cards is an _estimate_ derived from the restaurant id. It stays the same for a given restaurant.
- **Popular cuisines.** Each tile is a dish-name search (biryani, pizza, tikka...). A tile only appears when a dish matches, and it uses that dish's real photo.
- **Loading states.** Pages show skeleton loaders shaped like their content. Spinners only appear inside busy buttons.
- **Responsive layout.** Checked at 360, 375, 414 and 768px. Below 1024px the navbar collapses into a hamburger menu, and buttons, chips, selects and quantity steppers grow to a 40px touch target. Desktop sizes are untouched because every mobile rule uses a `max-lg:` or `max-sm:` Tailwind variant. Where a row has to be rearranged on phones (cart items, owner menu rows), a wrapper with `sm:contents` disappears on wider screens so the desktop layout stays the same. Image action buttons show permanently on touch screens (`hover: none`), since there is no hover.
- **Tokens** are kept in localStorage, as the brief requires. The session is restored on reload through `GET /auth/me/`.
