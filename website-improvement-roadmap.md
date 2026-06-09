WEBSITE IMPROVEMENT ROADMAP – AGATHA LIVING

1. Replace Formspree with Supabase

Migrate all website forms from Formspree to Supabase.

Benefits:

- Store all leads in a central database.
- Track Priority Guest List signups.
- Track contact form enquiries.
- Track Property Management enquiries.
- Track Investor Support enquiries.
- Allow future CRM integration.
- Allow future email marketing integration.
- Create an internal admin dashboard for lead management.

Database Structure:

Leads Table

- id
- created_at
- first_name
- email
- phone (optional)
- enquiry_type
- source_page
- message
- status

Enquiry Types:

- Priority Guest List
- General Contact
- Property Management
- Investor Support
- Property Revenue Estimate

Create Supabase tables and API routes for all forms.

1. Expand Blog Section

Current blog section is too small.

Create placeholder structure for at least 15 blog articles.

Guest Content:

- Best Areas to Stay in South London
- Why Direct Booking Can Save You Money
- Business Travel Accommodation vs Hotels
- Family-Friendly Stays in London
- Long-Term Stays in London

Property Management Content:

- Is Airbnb Still Profitable in London?
- How Professional Property Management Increases Revenue
- Airbnb vs Long-Term Letting
- Common Mistakes Property Owners Make
- How Dynamic Pricing Works

Investor Support Content:

- What Is Serviced Accommodation?
- Rent-to-Rent Explained
- How to Analyse a Short-Term Rental Property
- What Makes a Good Airbnb Location?
- Understanding Occupancy and ADR

Add category filtering:

- Guest Guides
- Property Management
- Investor Support

Add estimated reading time.

Add author section:

Matthew Brown

Founder, Agatha Living

1. Create Lead Magnet Section

Add a new homepage section.

Title:

Curious What Your Property Could Earn?

Subtitle:

Receive a complimentary short-term rental revenue estimate showing potential income, occupancy expectations, and suitability for serviced accommodation.

Form Fields:

- Full Name
- Email Address
- Property Postcode

Button:

Get My Free Estimate

Store submissions in Supabase.

Create enquiry type:

Property Revenue Estimate

After submission:

Show success message and notify Agatha Living.

1. Priority Guest List

Keep the recently added Priority Guest List.

Store all signups in Supabase.

Create table:

priority_guest_list

Fields:

- id
- created_at
- first_name
- email
- marketing_consent

Prepare for future integration with:

- Mailchimp
- ConvertKit
- Klaviyo
- Brevo

1. Future CRM Dashboard

Create database structure now so we can later build:

Lead Dashboard:

- Total Leads
- New Leads
- Contacted Leads
- Converted Leads

Lead Filters:

- Priority Guest List
- Property Management
- Investor Support
- Property Revenue Estimate

Keep the existing Agatha Living design language, colours, typography, animations, spacing, premium appearance and mobile-first responsive design throughout.

One more thing: tell Codex to prioritise **Supabase first**. That’s the foundation. Once every lead is stored properly, adding newsletters, CRM features, email campaigns, and automations becomes much easier.
