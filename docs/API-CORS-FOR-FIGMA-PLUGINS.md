# API CORS configuration for Figma plugins

Use this when updating CORS on **api.recursica.com** so that Figma plugins (especially Recursica Publisher) can call the API from the plugin iframe.

## Problem

- **Recursica Publisher** (Figma plugin) gets a CORS error when calling `https://api.recursica.com/api/plugin/keys` (and other plugin API endpoints).
- **Recursica** (main Figma plugin) does not, because in production its UI loads from your hosted app (`VITE_RECURSICA_UI_URL`), so requests come from your domain, which is already allowed.
- Recursica Publisher’s UI is bundled with the plugin (`ui: "./dist/index.html"`), so requests come from the **Figma plugin iframe origin**, which must be explicitly allowed.

## What to allow

**Important:** In Figma’s plugin iframe, the browser often **does not send an `Origin` header** (or sends `Origin: null`) because the plugin runs in an opaque/sandboxed context. So you cannot rely on seeing a normal origin like `https://www.figma.com` in the request.

The backend must allow these requests anyway. Options:

1. **If the request has no `Origin` or `Origin: null`**  
   Respond with `Access-Control-Allow-Origin: null` for the plugin routes. Per the CORS spec, the only valid response when the origin is null is to reflect it: `Access-Control-Allow-Origin: null`.

2. **If dev-api.recursica.com already works**  
   Inspect what that server returns for the same plugin request (e.g. from a log or proxy). Mirror that CORS behavior on api.recursica.com (including handling missing or `null` origin).

3. **Optional: allow common Figma origins as well**  
   In case some Figma contexts do send an origin, you can also allow:
   - `https://www.figma.com`
   - `https://figma.com`

## Affected endpoints

All plugin auth endpoints used from the plugin iframe:

- `POST /api/plugin/keys`
- `POST /api/plugin/authorize`
- `POST /api/plugin/token`

Ensure both the actual request and the `OPTIONS` preflight (if the browser sends it) return:

- `Access-Control-Allow-Origin`: the plugin origin (e.g. `https://www.figma.com`) or a list that includes it.
- For preflight: `Access-Control-Allow-Methods` and `Access-Control-Allow-Headers` as needed (e.g. `Content-Type`, and any custom headers you use).

## Reference: dev vs prod

- **dev-api.recursica.com** — already allows the plugin origin (no CORS error in dev).
- **api.recursica.com** — should mirror that CORS configuration for the same plugin origins so Recursica Publisher works in production.

## Summary

For **api.recursica.com**, CORS for the plugin routes must allow requests that have **no `Origin` header or `Origin: null`** (Figma’s plugin iframe often sends neither a normal origin nor a figma.com origin). Respond with `Access-Control-Allow-Origin: null` when the request origin is null/missing so the browser allows the response. Mirror whatever dev-api.recursica.com does for the same requests.
