# Inventory Sync - Shopify to Google Sheets Integration

Synchronize Shopify product inventory with Google Sheets using this Laravel application.

## Prerequisites

-   PHP 8.1 or higher
-   Composer
-   MySQL 8.0 or higher
-   Node.js 16 or higher
-   npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
composer install
npm install
```

### 2. Environment Configuration

Copy the environment template and update with your settings:

```bash
cp .env.example .env
```

Generate application key:

```bash
php artisan key:generate
```

### 3. Database Setup

Create the database first:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS inventory-sync;"
```

Run migrations to create all tables:

```bash
php artisan migrate
```

#### Database Tables Created

The application uses the following tables:

-   **users** - Application users and authentication
-   **cache** - Cache entries
-   **jobs** - Queue jobs
-   **settings** - Application settings
-   **google_user_info** - Google user profile data
-   **google_sheets** - Google Sheets connections per user
-   **google_sheet_properties** - Sheet metadata and properties

### 4. Google OAuth Configuration

Create Google OAuth credentials:

1. Go to Google Cloud Console (https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google Sheets API and Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URI: `https://<your-ngrok-domain>/auth/google/callback`

Update `.env` with Google credentials:

```env
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
GOOGLE_REDIRECT_URI=https://<your-ngrok-domain>/auth/google/callback
```

### 5. Shopify Configuration

Update `.env` with Shopify settings:

```env
SHOPIFY_API_KEY=<your-api-key>
SHOPIFY_API_SECRET=<your-api-secret>
SHOPIFY_API_VERSION=2025-07
SHOPIFY_STORE_NAME=<your-store>.myshopify.com
```

### 6. Start ngrok Tunnel

Listen on port 3000:

```bash
ngrok http 3000
```

Copy the ngrok domain and update:

-   `.env` GOOGLE_REDIRECT_URI
-   Shopify app configuration with the ngrok domain

### 7. Build Frontend Assets

```bash
npm run build
```

For development with hot reload:

```bash
npm run dev
```

### 8. Start Laravel Development Server

```bash
php artisan serve --port=3000
```

### 9. Start Shopify App Development

```bash
npm run shopify app dev
```

The application will be accessible at `https://<your-ngrok-domain>`

## Features

-   Export Shopify inventory to Google Sheets
-   Import inventory updates from Google Sheets to Shopify
-   Auto-sync inventory changes
-   Automatic token refresh for Google OAuth
-   Product variant management

## API Endpoints

-   `POST /api/create-sheet` - Connect Google Sheet
-   `GET /api/profile` - Get connection profile
-   `POST /api/export-products` - Export inventory to sheet
-   `POST /api/import-products` - Import updates from sheet
-   `POST /api/sync-products` - Sync inventory changes

## Troubleshooting

### Database Issues

**Migration errors**

If migrations fail, ensure:

-   MySQL is running
-   Database `inventory-sync` exists
-   Database user has proper privileges

Reset migrations (development only):

```bash
php artisan migrate:reset
php artisan migrate
```

Fresh migration with seeders:

```bash
php artisan migrate:fresh --seed
```

**Connection refused**

Verify MySQL is running and credentials in `.env` are correct:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=<your-password>
DB_DATABASE=inventory-sync
```

### Google OAuth Issues

If you encounter 401 Unauthorized errors, the access token may have expired. Disconnect and reconnect your Google account to obtain fresh tokens.

### Products Tab Missing

If the Products tab doesn't exist in your Google Sheet, it will be created automatically on first export.

### Inventory Updates Failed

Ensure variant IDs from the sheet match Shopify variant IDs. Use the exported sheet format for imports.
