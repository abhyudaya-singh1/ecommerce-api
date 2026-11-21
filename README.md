# E-commerce Product API

A Node.js, Express and PostgreSQL API for product CRUD operations.

This public repository contains the product routes, controllers and database connection layer. It is a focused backend project, not a complete storefront or a production-ready commerce service.

## Implemented

- List products with category names and retrieve a product by ID.
- Create, update and delete products.
- Parameterized SQL queries through the `pg` connection pool.
- Required-field checks on creation, missing-product responses and duplicate SKU/slug handling.
- Environment-based database connection settings and a JSON 404 response.

## Structure

```text
src/
  app.js                         # Express setup and route mounting
  config/db.js                   # PostgreSQL pool
  routes/product.routes.js       # Product routes
  controllers/product.controller.js
```

## Local setup

Prerequisites: Node.js/npm and PostgreSQL.

```sh
npm ci
```

Create a local `.env` file in the repository root:

```dotenv
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database
DB_USER=your_database_user
DB_PASSWORD=your_database_password
```

Do not commit real database credentials.

**Database setup is not self-contained yet.** The SQL schema, migrations and seed data are not included. Before running requests, provide a compatible database with `products` and `categories` tables matching the queries in `src/controllers/product.controller.js`. The controller references product/category IDs, product details, prices, stock, status and timestamps. Do not assume `npm ci` creates those tables.

```sh
npm run dev
# or
npm start
```

The default server address is `http://localhost:3000`.

## Routes

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/` | Service message |
| GET | `/api/products` | List products |
| GET | `/api/products/:id` | Retrieve a product |
| POST | `/api/products` | Create a product |
| PUT | `/api/products/:id` | Update supported product fields |
| DELETE | `/api/products/:id` | Delete a product |

Creation requires `name`, `sku`, `category_id` and `price` in the current controller. Additional fields include slug, descriptions, sale price, stock quantity, thumbnail and brand. The database must contain the referenced category.

## Current limits

- No authentication or authorization middleware is implemented in this snapshot.
- Schema/migrations, automated tests and CI are not included.
- Validation, pagination and deployment hardening remain future work.
- This repository should not be described as a complete order, checkout or payment system.

## Author

[Abhyudaya Singh](https://github.com/abhyudaya-singh1)
