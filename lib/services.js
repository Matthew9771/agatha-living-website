export const SERVICES = [
  {
    slug: 'short-term-stays',
    num: '01',
    icon: '🏠',
    title: 'Short-Term Stays',
    desc: 'Fully furnished, hotel-quality apartments available on Airbnb and direct booking. Each property is professionally styled, spotlessly clean, and stocked with everything guests need for a comfortable stay.',
    features: ['Professionally cleaned & prepared', 'Fresh linen & towels', 'Fully furnished', 'Flexible stays'],
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
    subtitle: 'Your property. Our operation.',
    cta: 'Request a Management Assessment',
    desc: 'Agatha Living provides hands-on serviced accommodation management for property owners who want professional support without managing the day-to-day operation themselves.',
    features: ['Listing & channel management', 'Dynamic pricing', 'Guest communication', 'Cleaning & linen coordination', 'Maintenance coordination', 'Performance monitoring', 'Owner reporting'],
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
    slug: 'start-grow-sa-business',
    num: '03',
    icon: '📊',
    title: 'Start & Grow Your SA Business',
    comingSoon: true,
    cta: 'Register Your Interest',
    desc: 'Looking to start or grow a serviced accommodation business? Agatha Living is developing a range of services to help you assess opportunities, source suitable properties and build the systems needed to launch.',
    features: ['Property feasibility & market analysis', 'Property sourcing', 'Business setup support', 'SA setup & launch planning'],
  },
];

export function getServiceBySlug(slug) {
  return SERVICES.find(service => service.slug === slug);
}
