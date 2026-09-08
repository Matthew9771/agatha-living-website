# Private guest details

## Current state

Public property data uses area-only locations and Airbnb display names. Old profile URLs redirect to non-address slugs. The private address is fetched from Smoobu only on the server after authorisation. No address is embedded in the public guest page or its initial page data.

The guest-access implementation is fail-closed and NOT ready to send to guests until the configuration and a live payment mapping have been verified. No automatic emails, payment creation, metadata changes, or webhook registration are performed.

## Required setup

1. Configure `SMOOBU_API_KEY` and `SMOOBU_API_SECRET` on the server.
2. Configure `STRIPE_SECRET_KEY` for the Stripe account receiving Smoobu payments. Prefer a restricted live key (`rk_live_`) with read access to PaymentIntents and Charges instead of an unrestricted standard secret key. A publishable key or webhook signing secret cannot verify payments.
3. Generate a separate high-entropy `GUEST_ACCESS_SECRET`, for example with `openssl rand -hex 32`, and save it in `.env.local` and the hosting environment. Never use a `NEXT_PUBLIC_` prefix. Rotating this secret revokes all outstanding links.
4. Confirm each Smoobu apartment's private street, city and postal code are complete, including the Coach House designation where required.
5. Establish a trusted booking-to-payment mapping. This implementation requires the successful Stripe PaymentIntent's metadata field `smoobu_reservation_id` to equal the Smoobu reservation ID. This is our integration contract, NOT a claim that Smoobu automatically creates that field. Do not map payments by amount, guest name, or customer email alone. Do not expose an endpoint allowing guests to set this metadata. Verify how the Smoobu integration maps payments before enabling this flow.
6. Test with a known fully paid reservation belonging to this account. Only live GBP payments covering the full reservation in one captured charge are supported in this first version. Split payments, deposits, platform payouts and other currencies are denied rather than treated as fully paid.

## Issuing a link

After the above is configured, an authorised operator can run:

```sh
node scripts/create-guest-link.mjs RESERVATION_ID pi_PAYMENT_INTENT_ID
```

The command performs read-only Smoobu and Stripe verification and outputs a private bearer link only if verification succeeds. Send it only to the verified reservation guest through the existing Smoobu booking conversation. Do not paste links into public channels, analytics, or tickets. Automatic delivery is not implemented.

Links expire after seven days. The token is in the URL fragment, not a server-logged query parameter. The guest page removes it from browser history and sends it in a POST body. Refreshing the page requires reopening the original link. Do not log request bodies on `/api/guest-details`; exclude `/guest-details` from session replay or third-party analytics. Add hosting-level rate limits before public rollout.

Every access rechecks the active reservation, full-paid flag, guest/ dates binding, live successful Stripe payment, matching reservation metadata, and absence of charge refunds or disputes. An upstream failure, missing key or mapping denies access. No address or customer information is returned on failure. Responses are private/no-store and noindex. Previously revealed addresses cannot be retracted, and an old public address may remain in search caches.

## External privacy checks

The website cannot hide content inside Smoobu, Airbnb, or Booking.com. Review public listing names, map precision, images, and Smoobu guest-app/message settings separately. Ensure those services do not reveal street addresses before your required payment stage. Existing Guesty extra-night code is left unchanged; audit its migration separately.

## Reviews

Profiles currently link to available platform reviews. Smoobu's documented API does not expose review records. A complete on-site cross-platform feed is NOT implemented. It requires an authorised review provider or owner-supplied exports and the missing Booking.com listing links for the two newer units. Never fabricate reviews or label a partial feed as complete.

References: https://docs.smoobu.com/ and https://docs.stripe.com/api/payment_intents/retrieve
