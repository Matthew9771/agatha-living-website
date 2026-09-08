# agatha-living-website

## Services and enquiries

`/services/start-grow-sa-business` describes planned services only, with Coming Soon badges and no package pricing. `/services/investor-support` redirects there. The existing Services navigation and footer link to it, and the sitemap follows the shared services data.

`ServiceEnquiryForm` supports launch interest, introductory call requests and active property-management assessments. Field definitions and client/server validation are shared in `lib/service-enquiries.js`. All three POST to the existing `/api/leads` handler and use the existing Supabase `leads` table. Additional answers and enquiry-contact consent are stored in `message`; no schema migration is needed. Contact consent does not set general `marketing_consent` to true.

Successful submissions are saved requests, not calendar bookings. There is no new scheduling or email-notification integration. The team must monitor Supabase leads and arrange calls/follow up manually. Existing Supabase server credentials are still required in the deployment environment. A successful UI state appears only after the API confirms the save.

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

Edit `lib/properties.js` to maintain public property details, gallery images and booking links. Keep this data free of exact addresses. Profiles, the listings page, Airbnb quick links and the sitemap use this shared data. Gallery photos are stored in `public/forest-hill-*.jpg`, `public/cinema-home-*.jpg` and `public/coach-house-*.jpg`.

Smoobu configuration uses `bookingIframe` for the official embed endpoint, `bookingTarget` for its container ID, and `bookingUrl` for the direct booking fallback. Keep all three matched to the same apartment: Forest Hill `3491976`, 70 Thornbury Road `3493341`, Coach House `3493346`. Do not paste executable HTML into property data.

See `SUPABASE_SETUP.md` for the exact table schema and setup instructions.

See `GUEST_ACCESS_SETUP.md` for the protected address page, required payment mapping, link delivery, privacy limitations and pending reviews integration. Guest address access must not be enabled until this setup is complete.
