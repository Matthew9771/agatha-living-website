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
Property cards and profiles link to `/properties/[slug]/availability`, where the property's Smoobu booking tool loads. Airbnb links (and Booking.com for Forest Hill) remain as alternatives. The Guesty widget is not used on property profiles.

## Property listings

Edit `lib/properties.js` to maintain property details, gallery images and booking links. Profiles, the listings page, Airbnb quick links and the sitemap use this shared data. New Thornbury Road properties show “Check dates for pricing” until starting rates are confirmed. Gallery photos are stored in `public/greystead-road-*.jpg`, `public/thornbury-road-*.jpg` and `public/coach-house-*.jpg`.

Smoobu configuration uses `bookingIframe` for the official embed endpoint, `bookingTarget` for its container ID, and `bookingUrl` for the direct booking fallback. Keep all three matched to the same apartment: Forest Hill `3491976`, 70 Thornbury Road `3493341`, Coach House `3493346`. Do not paste executable HTML into property data.

See `SUPABASE_SETUP.md` for the exact table schema and setup instructions.
