export const SERVICES = [
  {
    slug: 'short-term-stays',
    num: '01',
    icon: '🏠',
    title: 'Short-Term Stays',
    desc: 'Fully furnished, hotel-quality apartments available on Airbnb and direct booking. Each property is professionally styled, spotlessly clean, and stocked with everything guests need for a comfortable stay.',
    features: ['Professional photography', 'Hotel-grade linen & toiletries', 'Keyless entry & digital guidebook', '24/7 guest support', 'Weekly cleaning included'],
    panels: [
      { key: 'whatsIncluded', title: 'What’s Included', body: 'A complete stay experience with fresh linens, toiletries, a stocked kitchen, fast Wi-Fi, digital entry, and helpful arrival details so guests can settle in immediately.' },
      { key: 'guestExperience', title: 'Guest Experience', body: 'Thoughtful touches and prompt communication ensure each guest feels welcomed, supported, and comfortable throughout their visit.' },
      { key: 'whyBookDirect', title: 'Why Book Direct', body: 'Booking directly with Agatha Living gives guests clear pricing, direct support, and a smoother arrival experience without unnecessary listing fees or uncertainty.' },
    ],
    detailIntro: 'Agatha Living short-term stays are designed for guests who want the comfort of a home with the reliability of a managed hospitality experience.',
    detailSections: [
      {
        title: 'A Ready-To-Stay Home',
        body: 'Each apartment is prepared with practical living essentials, comfortable furnishings, fresh linen, towels, toiletries, kitchen basics, and fast Wi-Fi. The aim is simple: guests should be able to arrive, settle in quickly, and feel looked after without needing to chase basic details.',
      },
      {
        title: 'Clear Guest Support',
        body: 'Guests receive arrival instructions, property guidance, and responsive support throughout the stay. For business travel, relocation, visiting family, or leisure breaks, the experience is built around simple communication and a well-presented home.',
      },
      {
        title: 'Direct Booking Benefits',
        body: 'Direct enquiries allow guests to speak with Agatha Living before booking, confirm requirements, ask about dates, and avoid unnecessary uncertainty. Where direct booking is suitable, pricing and stay details can be agreed clearly before arrival.',
      },
    ],
  },
  {
    slug: 'property-management',
    num: '02',
    icon: '🔑',
    title: 'Property Management',
    desc: 'A fully managed hosting service for owners who want listing optimisation, guest communication, cleaning coordination, and maintenance handled smoothly.',
    features: ['Dynamic pricing strategy', 'Guest screening & communications', 'Professional cleaning between stays', 'Maintenance coordination', 'Monthly performance reports'],
    panels: [
      { key: 'whatWeManage', title: 'What We Manage', body: 'We handle guest messaging, check-in logistics, cleaning, maintenance coordination, and the operational details that keep a property performing smoothly.' },
      { key: 'ownerBenefits', title: 'Owner Benefits', body: 'Owners receive a calmer hosting experience, clearer fee structure, regular updates, and fewer daily tasks while their property remains market ready.' },
      { key: 'reportingPricing', title: 'Reporting & Pricing', body: 'Regular performance summaries and practical pricing guidance help owners understand occupancy, income, and where the property sits in the local market.' },
    ],
    detailIntro: 'Agatha Living property management is for owners who want a professional short-stay operation without handling the daily guest, cleaning, pricing, and maintenance workload themselves.',
    detailSections: [
      {
        title: 'Day-To-Day Hosting Covered',
        body: 'The service can include listing setup, guest communication, check-in coordination, cleaner scheduling, linen handling, issue reporting, and supplier coordination. The goal is to keep the property guest-ready while reducing the daily pressure on the owner.',
      },
      {
        title: 'Presentation And Performance',
        body: 'Strong short-stay performance depends on clear presentation, reliable operations, and responsive communication. Agatha Living supports listing quality, pricing guidance, guest standards, and ongoing improvements based on how the property performs.',
      },
      {
        title: 'Owner Visibility',
        body: 'Owners need to understand how their property is performing. Reporting and regular updates help show occupancy, income, feedback, maintenance notes, and next steps, so decisions are based on the property’s actual results.',
      },
    ],
  },
  {
    slug: 'investor-support',
    num: '03',
    icon: '📊',
    title: 'Investor Support',
    desc: 'Practical support for landlords and investors exploring serviced accommodation, rent-to-rent, and short-term rental opportunities. We help assess potential returns, setup costs, guest demand, and operational requirements before committing to a property strategy.',
    features: ['Serviced accommodation feasibility reviews', 'Rent-to-rent guidance', 'Revenue & cashflow projections', 'Area and guest demand research', 'Setup cost planning', 'Ongoing management options'],
    panels: [
      { key: 'feasibilityReview', title: 'Feasibility Review', body: 'We assess the suitability of a property for serviced accommodation or rent-to-rent, evaluating local demand, layout, and operational feasibility before you proceed.' },
      { key: 'revenueProjections', title: 'Revenue Projections', body: 'Practical revenue and cashflow modelling helps clarify expected income, costs, and where the property sits in the local short-stay market.' },
      { key: 'setupManagement', title: 'Setup & Management Support', body: 'We advise on initial setup costs, property preparation, and ongoing management options so investors can decide with greater confidence.' },
    ],
    detailIntro: 'Investor support helps landlords and property investors understand whether a short-stay, serviced accommodation, or rent-to-rent strategy is practical before committing time and money.',
    detailSections: [
      {
        title: 'Feasibility Before Commitment',
        body: 'Not every property is suited to short-stay use. The review considers location, guest demand, layout, compliance considerations, setup costs, expected nightly rates, and the operational work required to run the property properly.',
      },
      {
        title: 'Revenue And Cost Clarity',
        body: 'A stronger decision starts with realistic numbers. Support can include revenue assumptions, cashflow modelling, furnishing and setup estimates, cleaning and management costs, and a view of the risks that may affect returns.',
      },
      {
        title: 'From Strategy To Operation',
        body: 'Where an opportunity looks suitable, Agatha Living can advise on setup standards, guest positioning, listing preparation, and management options. The focus is practical execution, not abstract property theory.',
      },
    ],
  },
];

export function getServiceBySlug(slug) {
  return SERVICES.find(service => service.slug === slug);
}
