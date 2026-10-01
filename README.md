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

| Concern        | Choice |
|----------------|--------|
| UI library     | React 19 (JavaScript, function components + hooks) |
| Build tool     | Vite 8 |
| Routing        | React Router 7 |
| HTTP           | Axios, with JWT interceptors |
| Styling        | Tailwind CSS 4, with a pink/white theme in `src/index.css` |
| State          | Context API: `AuthContext` and `CartContext` |
| Icons          | lucide-react (no emoji anywhere in the UI) |
| Fonts          | Poppins (headings) and Inter (body), bundled with Fontsource, so there are no external font requests |
| Notifications  | react-hot-toast |

---

## Folder structure

```
foodpanda_frontend/
├── .env                  # your local config (git-ignored)
├── .env.example          # template for .env
├── index.html
├── vite.config.js        # React + Tailwind plugins, /api proxy to Django
├── package.json
├── public/
│   ├── favicon.svg
│   └── images/hero.jpg   # home/login background photo (a free Pexels photo from the backend's seed data)
└── src/
    ├── main.jsx          # mounts <App/> inside Router + Auth + Cart providers
    ├── App.jsx           # layout + all routes (public / customer / owner / rider)
    ├── index.css         # Tailwind import, brand colours, fonts, .btn/.card/.input/.skeleton utilities
    ├── api/              # everything that talks to the backend
    │   ├── client.js     # axios instance, Bearer-token + auto-refresh interceptors, multipart helper
    │   ├── tokens.js     # localStorage helpers for access/refresh tokens
    │   ├── auth.js       # register, login, me, change password
    │   ├── restaurants.js# restaurants, categories, menu items
    │   ├── orders.js     # place, list, status, cancel, pay, available, accept
    │   ├── reviews.js
    │   └── addresses.js
    ├── context/
    │   ├── AuthContext.jsx  # current user, login/register/logout, session restore
    │   └── CartContext.jsx  # one-restaurant cart, persisted in localStorage
    ├── hooks/
    │   ├── useAsync.js      # loading / error / data state for API calls
    │   └── usePolling.js    # auto-refresh for live order boards
    ├── components/
    │   ├── Navbar.jsx, Footer.jsx
    │   ├── ProtectedRoute.jsx   # login + role guard
    │   ├── RestaurantCard.jsx, MenuItemCard.jsx, OrderCard.jsx
    │   ├── SmartImage.jsx       # API image: skeleton -> fade-in -> neutral placeholder
    │   ├── ImageUpload.jsx      # pick + preview + replace/remove an image (owner forms)
    │   ├── Skeletons.jsx        # skeleton loaders shaped like each page
    │   ├── StatusBadge.jsx, StarRating.jsx, QuantityStepper.jsx
    │   ├── Loader.jsx (button spinner), StateMessages.jsx (empty/error), Pagination.jsx
    │   ├── Modal.jsx (+ ConfirmDialog)
    │   └── AddressForm.jsx, RestaurantForm.jsx, ReviewForm.jsx
    ├── pages/
    │   ├── Home.jsx, RestaurantDetail.jsx, Login.jsx, Register.jsx, NotFound.jsx
    │   ├── OrderDetail.jsx      # shared by all roles, actions depend on role
    │   ├── Profile.jsx          # profile, password, addresses
    │   ├── customer/  Cart.jsx, Checkout.jsx, MyOrders.jsx
    │   ├── owner/     OwnerDashboard.jsx, OwnerMenu.jsx, OwnerOrders.jsx
    │   └── rider/     RiderDashboard.jsx
    └── utils/
        ├── format.js       # formatPrice, formatDate, formatAddress, ...
        ├── errors.js       # turns DRF error responses into friendly messages
        ├── orderStatus.js  # status labels + allowed transitions per role
        └── restaurant.js   # delivery-time estimate, initials
```

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

| Command | What it does |
|---------|--------------|
| `npm run dev` | Development server with hot reload, on port 5173 |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serves the built `dist/` on port 4173. It proxies `/api` too. |

---

## `.env` explained

| Variable | Example | Purpose |
|----------|---------|---------|
| `VITE_API_URL` | `http://127.0.0.1:8000/api` | Where the Django API lives. It must end with `/api` and have no trailing slash. |
| `VITE_API_DIRECT` | `false` (default) | Optional. Set it to `true` to call `VITE_API_URL` straight from the browser. This only works if the backend sends CORS headers. |

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

Then open <http://localhost:5173>. If you see *"Cannot reach the server"*, the backend isn't running on port 8000.

To reset the demo data, run `python manage.py seed_demo` in the backend folder.

---

## Demo logins

These come from the backend's `seed_demo` command. Every password is **`Demo@12345`**.

| Username | Role | Try this |
|----------|------|----------|
| `demo_customer` | customer | Order food, view past orders, edit a review, manage addresses |
| `demo_customer2` | customer | Has on-the-way, preparing and cancelled orders |
| `demo_owner` | owner | Owns Karachi Biryani House and Lahore Tikka Corner |
| `demo_owner2` | owner | Owns Islamabad Pizza Hub |
| `demo_rider` | rider | Has a delivery on the way |
| `demo_rider2` | rider | Can accept the order that's being prepared |

The login page has quick-fill buttons for these usernames.

---

## Pages by role

| Route | Who | What |
|-------|-----|------|
| `/` | everyone | Photo hero with search, popular cuisines (real dish photos), restaurant cards with cover, logo, rating, delivery-time estimate and city; filter by city and open now, sorting, pagination |
| `/restaurants/:id` | everyone | Large cover banner and logo, rating, sticky category tabs with scroll-spy, dish cards with photos, sticky cart sidebar (floating cart bar on mobile), reviews |
| `/login`, `/register` | guests | Login with demo quick-fill; register with a role picker (customer, owner or rider) |
| `/cart` | guests, customers | Change quantities, remove items, see the total. The cart holds one restaurant only. |
| `/checkout` | customer | Pick or add an address, choose cash or card, place the order |
| `/orders` | customer | Order history with status filter tabs and badges |
| `/orders/:id` | any logged-in user | Items, total, payment and status timeline. The actions depend on the role: a customer can cancel or pay and review; an owner or rider can move the status forward. |
| `/profile` | any logged-in user | Edit your details and bio, change your password, and (for customers) manage addresses |
| `/owner` | owner | Stats; create, edit, open, close or delete restaurants; upload, preview, replace or remove the **cover photo and logo** |
| `/owner/restaurants/:id` | owner | Categories (add, rename, delete) and dishes (add, edit, delete, availability toggle), with **dish photo** upload and preview |
| `/owner/orders` | owner | Incoming orders by status. Only valid next-status buttons appear. Refreshes every 20 s. |
| `/rider` | rider | Available orders to accept, active deliveries (on the way, delivered) and history. Refreshes every 20 s. |

The order status buttons follow the backend's workflow exactly (`src/utils/orderStatus.js` mirrors `TRANSITIONS` in `orders/views.py`):

```
pending ──owner──▶ confirmed ──owner──▶ preparing ──rider accepts, then──▶ on_the_way ──rider──▶ delivered
   │                  │
   └─customer/owner─▶ cancelled ◀─owner─┘
```

---

## How data flows

Here is what happens when a customer opens **My Orders**:

```
 React page            api file              axios (client.js)                Django REST API            PostgreSQL
┌──────────────┐    ┌────────────────┐    ┌──────────────────────────┐    ┌─────────────────────────┐   ┌─────────────┐
│ MyOrders.jsx │───▶│ ordersApi.list │───▶│ request interceptor adds │───▶│ GET /api/orders/        │──▶│ SELECT ...  │
│ useAsync()   │    │ ({status,page})│    │ Authorization: Bearer .. │    │ JWT auth → OrderViewSet │   │ orders_order│
└──────▲───────┘    └────────────────┘    └──────────────────────────┘    │ filters by role, paginates  │ + items ... │
       │                                     (Vite proxies /api →          └────────────┬────────────┘   └──────┬──────┘
       │                                      127.0.0.1:8000 in dev)                    │                       │
       │            JSON {count, results:[...]} ◀── response interceptor ◀── serializer ◀┴──── rows ◀────────────┘
       └── setData → re-render with OrderCard list        (on 401: refresh token, retry once)
```

1. **Page.** `MyOrders.jsx` calls `useAsync(() => ordersApi.list({ status, page }))`. The hook tracks the `loading`, `error` and `data` state.
2. **API file.** `src/api/orders.js` knows the endpoint (`/orders/`) and the parameters. It returns `response.data`.
3. **Axios.** In `src/api/client.js`, the request interceptor attaches `Authorization: Bearer <access>` from localStorage. In development, Vite forwards `/api/...` to Django.
4. **Django.** SimpleJWT authenticates the token, and `OrderViewSet.get_queryset()` limits the results by role: a customer's own orders, an owner's restaurants, or a rider's deliveries. django-filter applies `?status=`, and DRF paginates 10 per page.
5. **PostgreSQL.** The ORM runs the SQL query. The rows are serialized to JSON.
6. **Back up the chain.** The response interceptor passes success straight through. If the response is **401**, it calls `/auth/token/refresh/` once (concurrent 401s share the same refresh), stores the new access token and replays the request. If the refresh fails, it logs the user out.
7. **Render.** The page receives `{ count, next, previous, results }`, and React re-renders the order cards and pagination. On an error, `utils/errors.js` turns the DRF error body into a friendly message for an error state or a toast.

Writes work the same way. **Checkout**, for example:

- `POST /orders/` with `{ restaurant, address, payment_method, items:[{menu_item, quantity}] }`. The server validates the order and computes the total from current prices.
- For card payments, the page then calls `POST /orders/{id}/pay/`, which is simulated.
- The cart is cleared, and the page redirects to `/orders/{id}`.

**Image uploads** (owner forms) go through `saveWithFiles()` in `src/api/client.js`:

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
- **Delivery time.** The API has no delivery-time field, so the "25-40 min" shown on cards is an *estimate* derived from the restaurant id. It stays the same for a given restaurant.
- **Popular cuisines.** Each tile is a dish-name search (biryani, pizza, tikka...). A tile only appears when a dish matches, and it uses that dish's real photo.
- **Loading states.** Pages show skeleton loaders shaped like their content. Spinners only appear inside busy buttons.
- **Tokens** are kept in localStorage, as the brief requires. The session is restored on reload through `GET /auth/me/`.
