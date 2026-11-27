# CreativeKit 3A — Corporate Giveaways & Custom Merchandising Platform

A comprehensive, modular full-stack PHP, JavaScript, CSS, and MySQL e-commerce and administrative merchandising management platform for **CreativeKit 3A** (Philippines).

---

## 1. Directory Tree & Architecture

The codebase strictly adheres to a **Per-Page CSS and JavaScript architecture**, ensuring each HTML/PHP page is cleanly paired with its own dedicated stylesheet and script for modular debugging, supplemented by minimal global helpers.

```text
creativekit3a/
├── config/
│   ├── db.php                           # THE single PDO connection (creativekit3a_db) & helpers
│   └── app.php                          # BASE_URL detection, url(), asset() cache-busting, product_url()
├── auth/
│   ├── guard.php                        # Route guard & RBAC (staff portal: admin/staff only)
│   ├── login.php                        # POST login handler (page form + top-bar Sign In modal)
│   ├── register.php                     # POST register handler (top-bar Register modal → customer)
│   └── logout.php                       # Session destruction & audit logging
├── actions/
│   ├── product-actions.php              # Product CRUD handler (INSERT / UPDATE / DELETE)
│   └── quote-actions.php                # Quote submission & workflow handler
├── includes/
│   ├── head.php                         # <head>, versioned CSS loader
│   ├── topbar.php                       # Main UI dark top bar (Sign In / Register / account)
│   ├── navbar.php                       # Main UI header + DB-driven 8-category mega menu + sidenav
│   ├── footer.php                       # Main UI footer, auth modals, versioned JS loader
│   ├── quote-modal.php                  # Multi-step Request a Quote modal
│   ├── admin-layout.php                 # Staff portal shell: sidebar + top header
│   └── admin-footer.php                 # Staff portal shell close + scripts
├── pages/                               # Staff portal (sidebar layout)
│   ├── login.php                        # Staff login page
│   ├── dashboard.php                    # KPIs, quote pipeline chart, activity log
│   ├── products.php                     # Product catalog CRUD list (search / filter / sort)
│   ├── product-form.php                 # Add / edit product
│   ├── quotes.php                       # Quote requests & workflow
│   └── reports.php                      # INNER / LEFT / RIGHT JOIN reports
├── index.php                            # Storefront homepage (hero carousel, OUR PRODUCTS)
├── category-page.php                    # Storefront catalog + header search (SQL LIKE)
├── product/
│   └── car-charger-adapters.php         # Storefront product items / variants page
├── assets/
│   ├── css/                             # global.css (admin utilities), style.css (Main UI),
│   │                                    # admin.css (staff portal) + one stylesheet per page
│   ├── js/                              # global.js (shared Main UI), admin.js + one script per page
│   └── images/
│       ├── hero/                        # Carousel slides
│       ├── items/                       # One image per product and per variant
│       ├── categories/                  # One banner per main category
│       ├── payments/                    # Footer payment badges
│       ├── placeholder.png              # Automatic fallback for any missing image
│       └── logo.png
├── database/
│   └── creativekit3a.sql                # THE single database: 9 related tables, seed data & SQL demos
├── _trash/                              # Deprecated / archived files (ignored by Git)
├── .gitignore
└── README.md
```

### Additional files merged from PR #1 (Zekerae:main)

These came in with the pull request and are **not used by the XAMPP/PHP app above** (which runs only on `config/db.php` → `creativekit3a_db`):

| Path | What it is |
| :--- | :--- |
| `index.html`, `category-page.html`, `car-charger-adapters.html`, `product/car-charger-adapters.html` | Static HTML versions of the storefront pages (for static / Vercel hosting) |
| `api/*.js`, `vercel.json`, `.vercelignore` | Vercel serverless API and routing |
| `api-php/`, `admin/`, `includes/db.php`, `assets/css/admin-system.css`, `assets/js/admin-system.js` | Separate PHP API + management portal that connect to a **different database named `creativekit3a`** (its schema file `database/schema.sql` was removed in favour of the single `creativekit3a.sql`, so this portal has no schema to run against) |
| `.htaccess` | Apache rewrite rules (pretty URLs, `/api/*` → `api-php/*`) |
| `docs/DATABASE_DESIGN.md` | Design notes for that separate schema |


---

## 2. Local Setup & Installation (XAMPP)

### Step 1: Place the Project in XAMPP
Ensure the project is located inside your XAMPP web root directory:
- **macOS:** `/Applications/XAMPP/xamppfiles/htdocs/creativekit3a`
- **Windows:** `C:\xampp\htdocs\creativekit3a`

### Step 2: Start Apache & MySQL
Launch the **XAMPP Control Panel** and start both **Apache** and **MySQL**.

### Step 3: Import the Database
1. Open your browser and navigate to **phpMyAdmin**:
   ```text
   http://localhost/phpmyadmin/
   ```
2. Click on the **Import** tab at the top.
3. Choose the SQL file located at:
   ```text
   database/creativekit3a.sql
   ```
4. Click **Go** (or **Import**).
5. The script will automatically create `creativekit3a_db`, establish all 9 related tables with Primary/Foreign Key constraints, insert all sample seed data, and run the SQL demonstration queries.

> **One database only.** `database/creativekit3a.sql` is the only SQL file. Do not create any other database — every page connects through `config/db.php` to `creativekit3a_db`.

### Step 4: Open the Application
Navigate to the storefront in your web browser:
```text
http://localhost/creativekit3a/
```

---

## 3. Database Design (Single MySQL Database: `creativekit3a_db`)

| # | Table | Primary Key | Foreign Keys | Used by |
| :- | :--- | :--- | :--- | :--- |
| 1 | `users` | `id` | — | Login, RBAC, dashboard, reports |
| 2 | `categories` | `id` | `parent_id → categories.id` (subcategories) | Catalog, quote modal, product form (SKU prefix / spec hints), reports |
| 3 | `products` | `id` | `category_id → categories.id`, `created_by → users.id` | Homepage, catalog, quote modal, product CRUD (image & badge pickers), reports |
| 4 | `product_variants` | `id` | `product_id → products.id` | Product items page |
| 5 | `quote_requests` | `id` | `product_id → products.id`, `assigned_to → users.id` | Quote modal, quotes page, dashboard, reports |
| 6 | `activity_log` | `id` | `user_id → users.id` | Audit trail on dashboard |
| 7 | `hero_banners` | `id` | `product_id → products.id` | Homepage carousel |

### SQL requirement coverage

| Requirement | In `creativekit3a.sql` (demo section) | Live in the app |
| :--- | :--- | :--- |
| `INSERT` | Demo 1 | `actions/product-actions.php` (create), `actions/quote-actions.php` (submit), activity logging |
| `SELECT` / `WHERE` | Demo 2 | Every page — e.g. `pages/dashboard.php` KPI cards |
| `UPDATE` | Demo 3 | Product edit, quote status/assignment, `auth/login.php` (last login) |
| `DELETE` | Demo 4 | Product delete, quote delete (admin only) |
| `LIKE` | Demo 5 | Search on `pages/products.php` and `pages/quotes.php` |
| `ORDER BY` | Demos 5–9 | Sorting on products page, catalog, reports |
| `INNER JOIN` | Demo 6 | `index.php`, `category-page.php`, `pages/reports.php` (Active Catalog) |
| `LEFT JOIN` | Demo 7 | `pages/quotes.php`, `pages/dashboard.php`, `pages/reports.php` (Category Breakdown) |
| `RIGHT JOIN` | Demo 8 | `pages/reports.php` (Staff Assignments) |
| `AS` | All demos | Column and table aliases throughout |
| `CONCAT()` | Demos 6–9 | Staff full names, product labels, variant price labels |

**No product data is hardcoded.** Every product, variant, category, carousel slide, price and image — on the homepage, catalog (`category-page.php`), product items page (`product/car-charger-adapters.php`), quote modal and admin product form — is queried from this database. The JavaScript files only render data the PHP page passes in. To add or change items, add/edit rows (e.g. via the admin Products page or phpMyAdmin).

## 4. Main UI & Images

The storefront uses the original **CreativeKit3A Main UI** (`assets/css/style.css`): dark top bar with **Sign In / Register**, white header with search, **Request a Quote** and **Cart**, the 8-category **mega menu** (built from the database), the sliding **hero carousel** (arrows, dots, autoplay), and **OUR PRODUCTS**. Admin pages share the same header, colors and buttons.

| Folder | Contents | Used by |
| :--- | :--- | :--- |
| `assets/images/hero/` | Carousel slides (`slide-1-custom-corporate-jackets.png`, …) | `hero_banners.image` |
| `assets/images/items/` | One file per product and per variant (`<product-slug>.png`, `<product-slug>--<variant>.png`) | `products.image`, `product_variants.image` |
| `assets/images/categories/` | One banner per main category (`<category-slug>.png`) | `categories.image` |
| `assets/images/placeholder.png` | Shown automatically if any image fails to load (`onerror` handler in `assets/js/global.js`) | every page |

**Staff portal (admin UI):** every page in `pages/` (Dashboard, Products, Product form, Quotes, Reports) uses a separate admin layout — a fixed dark sidebar with navigation and a live "new quotes" badge, plus a slim top header with product search and the signed-in user. It is built by `includes/admin-layout.php` / `includes/admin-footer.php` with `assets/css/admin.css` and `assets/js/admin.js`. The Dashboard adds a **Quote Pipeline** chart (requests per status from a `GROUP BY` query).

**To use your real photos:** overwrite a file with your photo using the **same file name** — no code or database change needed.

## 5. Demo Credentials for Defense

The system includes two distinct roles demonstrating **Role-Based Access Control (RBAC)**:

| Role | Email Address | Password | Permissions & Capabilities |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@creativekit3a.com` | `admin123` | Full CRUD, Delete Products (with confirmation modal), Assign Quote Leads, System Audit Trail, Summary Reports |
| **Staff Member** | `maria@creativekit3a.com` | `staff123` | View & Add Products, Edit Products, Update Quote Workflow Statuses (Delete is blocked) |
| **Customer** | *(create one with the top-bar **Register** button)* | — | Browse the catalog and submit quote requests; blocked from the staff portal |

*(Note: The login page at `/pages/login.php` features **1-Click Autofill buttons** for both roles to make testing seamless during defense).*
