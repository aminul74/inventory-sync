<!DOCTYPE html>
<html>
<head>
  <title>Stocky: Shopify App</title>
  <meta name="shopify-api-key" content="{{ env('SHOPIFY_API_KEY') }}">
  <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
  
  @viteReactRefresh
  @vite('resources/js/index.tsx')
</head>
<body>
  <div id="app"></div>
</body>
</html>
