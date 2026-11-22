# CreativeKit 3A — Comprehensive Database Design & Architecture Specification

> **Database System:** MySQL 8.0+ / MariaDB 10.5+  
> **Storage Engine:** `InnoDB` (ACID Compliant)  
> **Character Set / Collation:** `utf8mb4` / `utf8mb4_unicode_ci`  
> **Active Implementation Script:** [`database/creativekit3a.sql`](../database/creativekit3a.sql)  
> **Database Name:** `creativekit3a_db`

---

## Table of Contents
1. [Active Production Database ERD (Live System)](#1-active-production-database-erd-live-system)
2. [Relationship & Cardinality Matrix](#2-relationship--cardinality-matrix)
3. [Active System DDL Queries (CREATE TABLE)](#3-active-system-ddl-queries-create-table)
4. [Data Dictionary & Table Specifications](#4-data-dictionary--table-specifications)
5. [Production SQL Query Patterns (JOINs, Aggregates, CRUD)](#5-production-sql-query-patterns-joins-aggregates-crud)
6. [Enterprise Extended Architecture (Purchasing, Inventory, MIS)](#6-enterprise-extended-architecture-purchasing-inventory-mis)
7. [Enterprise Stored Procedures & Analytic Views](#7-enterprise-stored-procedures--analytic-views)

---

## 1. Active Production Database ERD (Live System)

This diagram represents the **7 interrelated production tables** actively queried and updated by the PHP backend (`config/db.php`, `category-page.php`, `product/car-charger-adapters.php`, `admin/`, etc.).

```mermaid
erDiagram
    USERS ||--o{ PRODUCTS : "creates (created_by)"
    USERS ||--o{ QUOTE_REQUESTS : "assigned_to"
    USERS ||--o{ ACTIVITY_LOG : "performed_by (user_id)"

    CATEGORIES ||--o{ CATEGORIES : "parent_of (parent_id self-ref)"
    CATEGORIES ||--o{ PRODUCTS : "categorizes (category_id)"

    PRODUCTS ||--|{ PRODUCT_VARIANTS : "defines (product_id)"
    PRODUCTS ||--o{ QUOTE_REQUESTS : "target_product (product_id)"
    PRODUCTS ||--o{ HERO_BANNERS : "features (product_id)"

    USERS {
        int id PK "UNSIGNED AUTO_INCREMENT"
        string first_name "VARCHAR(100)"
        string last_name "VARCHAR(100)"
        string email UK "VARCHAR(255) UNIQUE"
        string phone "VARCHAR(30) NULL"
        string password_hash "VARCHAR(255) Bcrypt"
        enum role "admin, staff, customer"
        boolean is_active "TINYINT(1) DEFAULT 1"
        datetime last_login_at "DATETIME NULL"
        datetime created_at "DATETIME"
        datetime updated_at "DATETIME"
    }

    CATEGORIES {
        int id PK "UNSIGNED AUTO_INCREMENT"
        int parent_id FK "categories.id (self-ref, NULL for top-level)"
        string name "VARCHAR(150)"
        string slug UK "VARCHAR(160) UNIQUE"
        text description "TEXT NULL"
        string icon "VARCHAR(50) FontAwesome"
        string sku_prefix "VARCHAR(20) NULL"
        string default_specs "VARCHAR(255) NULL"
        string image "VARCHAR(255) banner asset"
        smallint sort_order "SMALLINT DEFAULT 0"
        boolean is_active "TINYINT(1) DEFAULT 1"
        datetime created_at "DATETIME"
    }

    PRODUCTS {
        int id PK "UNSIGNED AUTO_INCREMENT"
        int category_id FK "categories.id"
        string name "VARCHAR(200)"
        string slug UK "VARCHAR(220)"
        string sku UK "VARCHAR(50) UNIQUE"
        text description "TEXT NULL"
        string specs "VARCHAR(255) NULL"
        decimal price_min "DECIMAL(10,2) starting price"
        string image "VARCHAR(255) asset path"
        string badge "VARCHAR(50) 'Best Seller', 'New'"
        enum status "active, draft, archived"
        boolean is_featured "TINYINT(1) DEFAULT 0"
        int created_by FK "users.id (NULL on delete)"
        datetime created_at "DATETIME"
        datetime updated_at "DATETIME"
    }

    PRODUCT_VARIANTS {
        int id PK "UNSIGNED AUTO_INCREMENT"
        int product_id FK "products.id"
        string variant_type "VARCHAR(50) filter key (e.g. single, dual)"
        string variant_label "VARCHAR(100) tab label (e.g. Single Port)"
        smallint type_order "SMALLINT DEFAULT 0"
        string name "VARCHAR(200)"
        string specs "VARCHAR(255) NULL"
        decimal price "DECIMAL(10,2)"
        string image "VARCHAR(512) NULL"
        string badge "VARCHAR(50) NULL"
        smallint sort_order "SMALLINT DEFAULT 0"
        datetime created_at "DATETIME"
    }

    QUOTE_REQUESTS {
        int id PK "UNSIGNED AUTO_INCREMENT"
        int product_id FK "products.id (NULL on delete)"
        string customer_name "VARCHAR(100)"
        string company "VARCHAR(100) NULL"
        string email "VARCHAR(100)"
        string phone "VARCHAR(30) NULL"
        string product_type "VARCHAR(100) NULL"
        int quantity "INT DEFAULT 100"
        string budget "VARCHAR(50) NULL"
        date deadline "DATE NULL"
        text details "TEXT NULL"
        enum status "new, reviewing, quoted, accepted, declined"
        int assigned_to FK "users.id (NULL on delete)"
        datetime created_at "DATETIME"
        datetime updated_at "DATETIME"
    }

    HERO_BANNERS {
        int id PK "UNSIGNED AUTO_INCREMENT"
        int product_id FK "products.id (NULL on delete)"
        string eyebrow "VARCHAR(100) NULL"
        string title "VARCHAR(150)"
        string subtitle "VARCHAR(150) NULL"
        text body "TEXT NULL"
        string image "VARCHAR(255)"
        smallint sort_order "SMALLINT DEFAULT 0"
        boolean is_active "TINYINT(1) DEFAULT 1"
        datetime created_at "DATETIME"
    }

    ACTIVITY_LOG {
        int id PK "UNSIGNED AUTO_INCREMENT"
        int user_id FK "users.id (NULL on delete)"
        string action "VARCHAR(50)"
        string entity_type "VARCHAR(50) NULL"
        int entity_id "INT UNSIGNED NULL"
        text details "TEXT NULL"
        string ip_address "VARCHAR(45) NULL"
        datetime created_at "DATETIME"
    }
```

---

## 2. Relationship & Cardinality Matrix

| Parent Table | Child Table | Foreign Key Column | Cardinality | Referential Action (ON DELETE / ON UPDATE) | Business Rule Description |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `categories` | `categories` | `parent_id` | **1 : N** | `SET NULL` / `CASCADE` | **Self-referencing hierarchy.** Top categories have `parent_id = NULL` (e.g. *Drinkware*). Subcategories store their parent category ID (e.g. *Tumblers & Flasks*). |
| `categories` | `products` | `category_id` | **1 : N** | `CASCADE` / `CASCADE` | A product must belong to a subcategory. Removing a category removes its associated products. |
| `products` | `product_variants`| `product_id` | **1 : N** | `CASCADE` / `CASCADE` | One catalog product encompasses multiple variant options (color, port type, capacity). |
| `products` | `quote_requests` | `product_id` | **1 : N** | `SET NULL` / `CASCADE` | B2B clients request quotations for a specific catalog item. If product is deleted, quote request is preserved. |
| `products` | `hero_banners` | `product_id` | **1 : N** | `SET NULL` / `CASCADE` | Carousel banner slides link to promoted catalog products. |
| `users` | `products` | `created_by` | **1 : N** | `SET NULL` / `CASCADE` | Tracks the administrator or procurement officer who created the product record. |
| `users` | `quote_requests` | `assigned_to` | **1 : N** | `SET NULL` / `CASCADE` | Leads and corporate quotes are assigned to specific staff members for follow-up. |
| `users` | `activity_log` | `user_id` | **1 : N** | `SET NULL` / `CASCADE` | Audit trail recording all admin logins, product creations, and status modifications. |

---

## 3. Active System DDL Queries (CREATE TABLE)

These SQL statements can be copied and pasted directly into **MySQL Workbench**, **phpMyAdmin**, or diagramming tools like **[dbdiagram.io](https://dbdiagram.io/)** or **draw.io** (*Arrange → Insert → Advanced → SQL*).

```sql
-- ============================================================
-- DATABASE INITIALIZATION
-- ============================================================
CREATE DATABASE IF NOT EXISTS creativekit3a_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE creativekit3a_db;

-- ============================================================
-- TABLE 1: users (Role-Based Access Control)
-- ============================================================
CREATE TABLE users (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  first_name    VARCHAR(100)    NOT NULL,
  last_name     VARCHAR(100)    NOT NULL,
  email         VARCHAR(255)    NOT NULL,
  phone         VARCHAR(30)     DEFAULT NULL,
  password_hash VARCHAR(255)    NOT NULL COMMENT 'Bcrypt hash',
  role          ENUM('admin','staff','customer') NOT NULL DEFAULT 'customer',
  is_active     TINYINT(1)      NOT NULL DEFAULT 1,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login_at DATETIME        DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE 2: categories (Hierarchical Main + Subcategories)
-- ============================================================
CREATE TABLE categories (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  parent_id     INT UNSIGNED    DEFAULT NULL,
  name          VARCHAR(150)    NOT NULL,
  slug          VARCHAR(160)    NOT NULL,
  description   TEXT            DEFAULT NULL,
  icon          VARCHAR(50)     DEFAULT 'fa-box',
  sku_prefix    VARCHAR(20)     DEFAULT NULL,
  default_specs VARCHAR(255)    DEFAULT NULL,
  image         VARCHAR(255)    DEFAULT NULL,
  sort_order    SMALLINT        NOT NULL DEFAULT 0,
  is_active     TINYINT(1)      NOT NULL DEFAULT 1,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE INDEX idx_cat_slug (slug),
  INDEX idx_parent (parent_id),
  CONSTRAINT fk_cat_parent
    FOREIGN KEY (parent_id) REFERENCES categories(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- TABLE 3: products (Catalog Products)
-- ============================================================
CREATE TABLE products (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  category_id   INT UNSIGNED    NOT NULL,
  name          VARCHAR(200)    NOT NULL,
  slug          VARCHAR(220)    NOT NULL,
  sku           VARCHAR(50)     DEFAULT NULL,
  description   TEXT            DEFAULT NULL,
  specs         VARCHAR(255)    DEFAULT NULL,
  price_min     DECIMAL(10,2)   NOT NULL DEFAULT 0.00 COMMENT '0.00 = Ask for Quote',
  image         VARCHAR(255)    DEFAULT '/assets/images/placeholder.png',
  badge         VARCHAR(50)     DEFAULT NULL,
  status        ENUM('active','draft','archived') NOT NULL DEFAULT 'active',
  is_featured   TINYINT(1)      NOT NULL DEFAULT 0,
  created_by    INT UNSIGNED    DEFAULT NULL,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE INDEX idx_sku (sku),
  INDEX idx_slug     (slug),
  INDEX idx_category (category_id),
  INDEX idx_status   (status),
  INDEX idx_featured (is_featured),
  CONSTRAINT fk_prod_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_prod_creator
    FOREIGN KEY (created_by) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- TABLE 4: product_variants (Item Specifications & Variants)
-- ============================================================
CREATE TABLE product_variants (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  product_id    INT UNSIGNED    NOT NULL,
  variant_type  VARCHAR(50)     DEFAULT NULL COMMENT 'Tab key: single | dual',
  variant_label VARCHAR(100)    DEFAULT NULL COMMENT 'Tab label: Single Port',
  type_order    SMALLINT        NOT NULL DEFAULT 0,
  name          VARCHAR(200)    NOT NULL,
  specs         VARCHAR(255)    DEFAULT NULL,
  price         DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
  image         VARCHAR(512)    DEFAULT NULL,
  badge         VARCHAR(50)     DEFAULT NULL,
  sort_order    SMALLINT        NOT NULL DEFAULT 0,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_variant_product (product_id),
  CONSTRAINT fk_variant_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- TABLE 5: quote_requests (Quotation Inquiries & Leads)
-- ============================================================
CREATE TABLE quote_requests (
  id             INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  product_id     INT UNSIGNED    DEFAULT NULL,
  customer_name  VARCHAR(100)    NOT NULL,
  company        VARCHAR(100)    DEFAULT NULL,
  email          VARCHAR(100)    NOT NULL,
  phone          VARCHAR(30)     DEFAULT NULL,
  product_type   VARCHAR(100)    DEFAULT NULL,
  quantity       INT             DEFAULT 100,
  budget         VARCHAR(50)     DEFAULT NULL,
  deadline       DATE            DEFAULT NULL,
  details        TEXT            DEFAULT NULL,
  status         ENUM('new','reviewing','quoted','accepted','declined') NOT NULL DEFAULT 'new',
  assigned_to    INT UNSIGNED    DEFAULT NULL,
  created_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_status (status),
  INDEX idx_quote_product (product_id),
  INDEX idx_quote_assigned (assigned_to),
  CONSTRAINT fk_quote_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_quote_assigned
    FOREIGN KEY (assigned_to) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- TABLE 6: activity_log (Audit Trail)
-- ============================================================
CREATE TABLE activity_log (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  user_id     INT UNSIGNED    DEFAULT NULL,
  action      VARCHAR(50)     NOT NULL,
  entity_type VARCHAR(50)     DEFAULT NULL,
  entity_id   INT UNSIGNED    DEFAULT NULL,
  details     TEXT            DEFAULT NULL,
  ip_address  VARCHAR(45)     DEFAULT NULL,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_user    (user_id),
  INDEX idx_action  (action),
  INDEX idx_created (created_at),
  CONSTRAINT fk_log_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- TABLE 7: hero_banners (Homepage Carousel Engine)
-- ============================================================
CREATE TABLE hero_banners (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  product_id  INT UNSIGNED    DEFAULT NULL,
  eyebrow     VARCHAR(100)    DEFAULT NULL,
  title       VARCHAR(150)    NOT NULL,
  subtitle    VARCHAR(150)    DEFAULT NULL,
  body        TEXT            DEFAULT NULL,
  image       VARCHAR(255)    NOT NULL,
  sort_order  SMALLINT        NOT NULL DEFAULT 0,
  is_active   TINYINT(1)      NOT NULL DEFAULT 1,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_banner_product (product_id),
  CONSTRAINT fk_banner_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;
```

---

## 4. Data Dictionary & Table Specifications

### 4.1 `users`
| Column | Type | Nullable | Key | Default | Description |
|---|---|---|---|---|---|
| `id` | INT UNSIGNED | No | PK | Auto | Unique user identifier |
| `first_name` | VARCHAR(100) | No | | | User's given name |
| `last_name` | VARCHAR(100) | No | | | User's surname |
| `email` | VARCHAR(255) | No | UK | | Account login email |
| `phone` | VARCHAR(30) | Yes | | NULL | Contact mobile number |
| `password_hash`| VARCHAR(255) | No | | | Bcrypt hashed credential |
| `role` | ENUM | No | IDX | `'customer'` | `'admin'`, `'staff'`, `'customer'` |
| `is_active` | TINYINT(1) | No | | 1 | Account status flag (1=active, 0=disabled) |
| `last_login_at`| DATETIME | Yes | | NULL | Timestamp of last authenticated session |

### 4.2 `categories`
| Column | Type | Nullable | Key | Default | Description |
|---|---|---|---|---|---|
| `id` | INT UNSIGNED | No | PK | Auto | Category identifier |
| `parent_id` | INT UNSIGNED | Yes | FK | NULL | `NULL` = Top-level category; Parent ID = Subcategory |
| `name` | VARCHAR(150) | No | | | Display name (e.g. *Drinkware*, *Bags*) |
| `slug` | VARCHAR(160) | No | UK | | URL-safe slug (`drinkware`, `apparel`) |
| `description` | TEXT | Yes | | NULL | SEO catalog overview copy |
| `icon` | VARCHAR(50) | Yes | | `'fa-box'` | FontAwesome icon class |
| `sku_prefix` | VARCHAR(20) | Yes | | NULL | SKU generation mask (e.g. `DRK-`) |
| `sort_order` | SMALLINT | No | | 0 | Display priority sequence |

### 4.3 `products`
| Column | Type | Nullable | Key | Default | Description |
|---|---|---|---|---|---|
| `id` | INT UNSIGNED | No | PK | Auto | Product identifier |
| `category_id` | INT UNSIGNED | No | FK | | Foreign key referencing `categories.id` |
| `name` | VARCHAR(200) | No | | | Product title |
| `slug` | VARCHAR(220) | No | IDX | | URL identifier (`car-charger-adapter`) |
| `sku` | VARCHAR(50) | Yes | UK | NULL | Unique stock keeping unit (`GAD-CHG-001`) |
| `price_min` | DECIMAL(10,2)| No | | 0.00 | Minimum unit starting price (₱) |
| `image` | VARCHAR(255) | Yes | | placeholder| Product image path |
| `badge` | VARCHAR(50) | Yes | | NULL | Card tag (`Best Seller`, `Popular`) |
| `status` | ENUM | No | IDX | `'active'` | `'active'`, `'draft'`, `'archived'` |
| `created_by` | INT UNSIGNED | Yes | FK | NULL | Admin/Staff user who registered product |

### 4.4 `product_variants`
| Column | Type | Nullable | Key | Default | Description |
|---|---|---|---|---|---|
| `id` | INT UNSIGNED | No | PK | Auto | Variant identifier |
| `product_id` | INT UNSIGNED | No | FK | | Foreign key referencing `products.id` |
| `variant_type` | VARCHAR(50) | Yes | | NULL | Filter grouping key (e.g. `single`, `dual`) |
| `variant_label`| VARCHAR(100) | Yes | | NULL | Visual tab label (e.g. `Single Port`) |
| `name` | VARCHAR(200) | No | | | Variant item name |
| `specs` | VARCHAR(255) | Yes | | NULL | Technical specs (voltage, capacity, material) |
| `price` | DECIMAL(10,2)| No | | 0.00 | Specific price per item (₱) |
| `image` | VARCHAR(512) | Yes | | NULL | Variant image asset |

### 4.5 `quote_requests`
| Column | Type | Nullable | Key | Default | Description |
|---|---|---|---|---|---|
| `id` | INT UNSIGNED | No | PK | Auto | Lead quotation number |
| `product_id` | INT UNSIGNED | Yes | FK | NULL | Catalog product referenced |
| `customer_name`| VARCHAR(100) | No | | | Contact person full name |
| `company` | VARCHAR(100) | Yes | | NULL | Corporate entity name |
| `email` | VARCHAR(100) | No | | | Customer communication email |
| `phone` | VARCHAR(30) | Yes | | NULL | Phone or mobile number |
| `quantity` | INT | Yes | | 100 | Order volume inquired |
| `status` | ENUM | No | IDX | `'new'` | `'new'`, `'reviewing'`, `'quoted'`, `'accepted'`, `'declined'` |
| `assigned_to` | INT UNSIGNED | Yes | FK | NULL | Staff member assigned to follow up |

---

## 5. Production SQL Query Patterns (JOINs, Aggregates, CRUD)

These queries demonstrate the core relational operations implemented in CreativeKit 3A:

### 5.1 Hierarchical 4-Table JOIN (Product Variants & Category Navigation)
```sql
SELECT 
    mc.name AS main_category,
    sc.name AS subcategory,
    p.name  AS product_name,
    p.sku   AS base_sku,
    v.name  AS variant_name,
    v.price AS variant_price
FROM product_variants AS v
INNER JOIN products   AS p  ON v.product_id  = p.id
INNER JOIN categories AS sc ON p.category_id = sc.id
LEFT  JOIN categories AS mc ON sc.parent_id  = mc.id
WHERE p.status = 'active'
ORDER BY mc.sort_order ASC, sc.sort_order ASC, v.sort_order ASC;
```

### 5.2 Header Search Engine (SQL Prepared `LIKE` Pattern)
```sql
SELECT 
    p.id, 
    p.name, 
    p.slug, 
    p.price_min, 
    p.image,
    sc.slug AS sub_slug, 
    mc.slug AS parent_slug, 
    mc.name AS parent_name,
    COUNT(v.id) AS variant_count
FROM products AS p
INNER JOIN categories AS sc ON p.category_id = sc.id
INNER JOIN categories AS mc ON sc.parent_id = mc.id
LEFT  JOIN product_variants AS v ON v.product_id = p.id
WHERE p.status = 'active'
  AND (p.name LIKE '%Charger%' 
   OR p.description LIKE '%Charger%' 
   OR sc.name LIKE '%Charger%' 
   OR mc.name LIKE '%Charger%')
GROUP BY p.id, p.name, p.slug, p.price_min, p.image, sc.slug, mc.slug, mc.name, mc.sort_order
ORDER BY mc.sort_order ASC, p.name ASC;
```

### 5.3 Quote Inquiries with Staff Assignment (LEFT JOIN)
```sql
SELECT 
    q.id AS quote_id,
    q.customer_name,
    q.company,
    q.quantity,
    q.status,
    p.name AS target_product,
    CONCAT(u.first_name, ' ', u.last_name) AS assigned_officer
FROM quote_requests AS q
LEFT JOIN products AS p ON q.product_id  = p.id
LEFT JOIN users    AS u ON q.assigned_to = u.id
ORDER BY q.created_at DESC;
```

### 5.4 Staff Workload & Performance Reporting (RIGHT JOIN)
```sql
SELECT 
    CONCAT(u.first_name, ' ', u.last_name) AS staff_name,
    u.role,
    COUNT(q.id) AS assigned_quotes,
    SUM(CASE WHEN q.status = 'quoted' THEN 1 ELSE 0 END) AS completed_quotes
FROM quote_requests AS q
RIGHT JOIN users AS u ON q.assigned_to = u.id
WHERE u.role IN ('admin', 'staff')
GROUP BY u.id, staff_name, u.role
ORDER BY assigned_quotes DESC;
```

---

## 6. Enterprise Extended Architecture (Purchasing, Inventory, MIS)

For enterprise-scale management, CreativeKit 3A includes architectural extensions for **Purchasing & Procurement**, **Multi-Warehouse Inventory**, and **Management Information Systems (MIS)**.

```mermaid
erDiagram
    %% Core Catalog
    CATEGORIES ||--o{ PRODUCTS : "contains"
    PRODUCTS ||--o{ PRODUCT_VARIANTS : "defines_variants"

    %% Purchasing System
    SUPPLIERS ||--o{ PURCHASE_ORDERS : "supplies"
    PURCHASE_ORDERS ||--|{ PURCHASE_ORDER_ITEMS : "contains"
    WAREHOUSES ||--o{ PURCHASE_ORDERS : "destination_hub"
    PURCHASE_ORDERS ||--o{ INVENTORY_MOVEMENTS : "generates_stock_in"

    %% Inventory Management
    WAREHOUSES ||--|{ INVENTORY_ITEMS : "stores"
    PRODUCTS ||--o{ INVENTORY_ITEMS : "stock_levels"
    INVENTORY_ITEMS ||--o{ INVENTORY_MOVEMENTS : "ledger_entries"

    %% MIS Subsystem
    USERS ||--o{ AUDIT_LOGS : "performed_actions"
    SYSTEM_METRICS_DAILY {
        date metric_date PK
        int total_orders
        decimal gross_merchandise_value
        decimal total_procurement_spend
        decimal inventory_asset_value
    }
```

### 6.1 Purchasing System (Procurement & Vendor Management)
* **`suppliers`**: Approved manufacturing partners, corporate vendor profiles, credit terms, and quality ratings.
* **`purchase_orders`**: Formal procurement orders issued to suppliers (`PO-2026-XXXX`). Tracks status (`draft`, `sent`, `partial`, `received`, `cancelled`).
* **`purchase_order_items`**: Line items per PO detailing ordered SKU, cost per unit, and quantities received.

### 6.2 Inventory Management System (Warehouse & Stock Tracking)
* **`warehouses`**: Storage facilities (e.g. *Main Fulfillment Hub - Taguig*, *Cebu Regional Hub*).
* **`inventory_items`**: Stock tracking per SKU per warehouse with reorder thresholds:
  $$\text{Quantity Available} = \text{Quantity On Hand} - \text{Quantity Reserved}$$
* **`inventory_movements`**: Immutable double-entry stock ledger recording every `stock_in`, `stock_out`, `transfer`, and `damaged` event.

### 6.3 Management Information System (MIS) & Governance
* **`system_metrics_daily`**: Aggregated rollups computed daily tracking Gross Merchandise Value (GMV), stock asset valuation, procurement outflows, and low-stock SKU alerts.
* **`audit_logs`**: System security trail capturing client IP address, JSON diffs of modifications, and responsible operator.

---

## 7. Enterprise Stored Procedures & Analytic Views

### 7.1 Stored Procedure: Atomic Stock Movement Ledger
```sql
DELIMITER $$
CREATE PROCEDURE record_stock_movement (
  IN p_ref_type           VARCHAR(40),
  IN p_ref_id             INT UNSIGNED,
  IN p_inventory_item_id  INT UNSIGNED,
  IN p_movement_type      ENUM('stock_in','stock_out','transfer','adjustment','damaged','returned'),
  IN p_qty_change         INT,
  IN p_notes              VARCHAR(500),
  IN p_operator           VARCHAR(100)
)
BEGIN
  DECLARE v_new_on_hand INT;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;

  START TRANSACTION;
    -- 1. Insert immutable ledger entry
    INSERT INTO inventory_movements (
      inventory_item_id, movement_type, quantity_change,
      reference_type, reference_id, notes, performed_by
    ) VALUES (
      p_inventory_item_id, p_movement_type, p_qty_change,
      p_ref_type, p_ref_id, p_notes, p_operator
    );

    -- 2. Adjust physical quantity on hand
    UPDATE inventory_items
    SET quantity_on_hand = quantity_on_hand + p_qty_change
    WHERE id = p_inventory_item_id;

    -- 3. Assert non-negative physical balance
    SELECT quantity_on_hand INTO v_new_on_hand
    FROM inventory_items WHERE id = p_inventory_item_id;

    IF v_new_on_hand < 0 THEN
      SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Constraint Violation: Inventory on hand cannot be negative';
    END IF;
  COMMIT;
END$$
DELIMITER ;
```

### 7.2 Stored Procedure: Automated Goods Receipt (`receive_purchase_order`)
```sql
DELIMITER $$
CREATE PROCEDURE receive_purchase_order (
  IN p_po_number VARCHAR(60)
)
BEGIN
  DECLARE v_po_id INT UNSIGNED;
  DECLARE v_warehouse_id INT UNSIGNED;
  DECLARE v_po_status VARCHAR(40);

  SELECT id, warehouse_id, status 
  INTO v_po_id, v_warehouse_id, v_po_status
  FROM purchase_orders 
  WHERE po_number = p_po_number;

  IF v_po_id IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Purchase order not found';
  END IF;

  START TRANSACTION;
    -- Mark Purchase Order as received
    UPDATE purchase_orders
    SET status = 'received', received_date = CURRENT_DATE()
    WHERE id = v_po_id;

    -- Automatically restock inventory items associated with this PO
    UPDATE inventory_items AS ii
    INNER JOIN purchase_order_items AS poi 
      ON ii.product_id = poi.product_id AND ii.warehouse_id = v_warehouse_id
    SET ii.quantity_on_hand = ii.quantity_on_hand + poi.quantity_ordered
    WHERE poi.purchase_order_id = v_po_id;
  COMMIT;
END$$
DELIMITER ;
```

---
*Document approved for CreativeKit 3A production deployment and academic project submission.*
