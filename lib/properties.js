import { AIRBNB_FOREST_HILL_URL, BOOKING_FOREST_HILL_URL } from './config';

export const PROPERTIES = [
  {
    slug: 'greystead-road',
    name: 'Greystead Road',
    address: 'Greystead Road, Forest Hill, London SE23',
    type: 'Serviced stay',
    zone: 'Zone 3',
    area: 'Forest Hill, SE23',
    price: 'From £150 per night',
    nightlyRate: 150,
    maxGuests: 8,
    available: true,
    image: '/foresthill.jpg',
    images: ['/foresthill.jpg', '/foresthill.jpg', '/foresthill.jpg'],
    summary: 'A polished two-bedroom serviced apartment in Forest Hill, designed for relaxed short stays and flexible direct bookings with a shared balcony and free parking.',
    description:
      'Greystead Road is a calm, stylish serviced apartment in South East London. It combines a well-equipped living space, fast Wi-Fi, and hotel-style guest welcome details for a comfortable short stay.',
    features: ['Fully Serviced', 'Professionally Cleaned', 'Flexible Bookings', 'All Bills Included', 'Fast Wi-Fi', 'Shared Balcony', 'Free Parking'],
    highlights: [
      'Two bedrooms with premium linens',
      'Shared balcony seating for morning coffee',
      'Free parking included with your stay',
      'Fully equipped kitchen and coffee station',
    ],
    details: [
      {
        title: 'Bedrooms',
        text: 'Two bright bedrooms styled for comfort, with premium linens and calm, neutral touches.',
      },
      {
        title: 'Bathrooms',
        text: 'A modern shower room with soft towels, toiletries and daily cleaning available on request.',
      },
      {
        title: 'Living space',
        text: 'Open-plan living and dining area with comfortable seating, natural light and a dedicated workspace.',
      },
      {
        title: 'Kitchen',
        text: 'Fully equipped kitchen with coffee essentials, fridge, oven and washer/dryer for convenience.',
      },
    ],
    externalLinks: [
      { label: 'Airbnb', href: AIRBNB_FOREST_HILL_URL },
      { label: 'Booking.com', href: BOOKING_FOREST_HILL_URL },
    ],
  },
];

export const PROPERTIES_BY_SLUG = PROPERTIES.reduce((map, property) => {
  map[property.slug] = property;
  return map;
}, {});

export function getPropertyBySlug(slug) {
  return PROPERTIES_BY_SLUG[slug] || null;
}
