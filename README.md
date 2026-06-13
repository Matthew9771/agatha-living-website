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
Bookings are handled by the external Guesty direct booking widget.

See `SUPABASE_SETUP.md` for the exact table schema and setup instructions.
