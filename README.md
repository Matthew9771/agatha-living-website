# agatha-living-website

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Set your Supabase project values:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run locally:
   ```bash
   npm run dev
   ```

## Supabase lead capture

This project stores form submissions in a Supabase table named `leads` through `/api/leads`.
Property profiles link to their individual Airbnb listings (and Booking.com for Forest Hill). Smoobu integration is deferred; the Guesty widget is not used on property profiles.

## Property listings

Edit `lib/properties.js` to maintain property details, gallery images and booking links. Profiles, the listings page, Airbnb quick links and the sitemap use this shared data. New Thornbury Road properties show “Check dates for pricing” until starting rates are confirmed. Gallery photos are stored in `public/thornbury-road-*.jpg` and `public/coach-house-*.jpg`.

See `SUPABASE_SETUP.md` for the exact table schema and setup instructions.
