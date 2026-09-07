import { AIRBNB_FOREST_HILL_URL, BOOKING_FOREST_HILL_URL } from './config';

export const PROPERTIES = [
  {
    slug: 'greystead-road',
    name: 'Greystead Road',
    bookingIframe: 'https://login.smoobu.com/en/booking-tool/iframe/1873721/3491976',
    bookingTarget: 'apartmentIframe3491976',
    bookingUrl: 'https://booking.smoobu.com/9A1873721?apartmentId=3491976',
    address: 'Greystead Road, Forest Hill, London SE23',
    type: 'Serviced stay',
    zone: 'Zone 3',
    area: 'Forest Hill, SE23',
    price: 'From £150 per night',
    nightlyRate: 150,
    maxGuests: 8,
    checkInFrom: '15:00',
    available: true,
    image: '/greystead-road-1.jpg',
    images: Array.from({ length: 8 }, (_, index) => `/greystead-road-${index + 1}.jpg`),
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
  {
    slug: '70-thornbury-road',
    name: '70 Thornbury Road',
    bookingIframe: 'https://login.smoobu.com/en/booking-tool/iframe/1873721/3493341',
    bookingTarget: 'apartmentIframe3493341',
    bookingUrl: 'https://booking.smoobu.com/9A1873721?apartmentId=3493341',
    address: '70 Thornbury Road, London SW2 4DA',
    type: 'Entire home',
    area: 'South London, SW2',
    price: 'Check dates for pricing',
    maxGuests: 4,
    checkInFrom: '15:00',
    available: true,
    image: '/thornbury-road-1.jpg',
    images: Array.from({ length: 8 }, (_, index) => `/thornbury-road-${index + 1}.jpg`),
    summary: 'A two-bedroom South London home with a dedicated cinema room, full kitchen and space for up to four guests.',
    description: 'Settle into a spacious two-bedroom home at 70 Thornbury Road. A bright ground-floor living space and fully equipped kitchen make everyday stays easy, while the lower-ground-floor cinema room and dining area offer somewhere to unwind. With Wi-Fi, a workspace and self check-in, the home suits family visits, business trips and longer stays.',
    features: ['Cinema Room', 'Wi-Fi', 'Dedicated Workspace', 'Full Kitchen', 'Washing Machine', 'Smart TVs', 'Self Check-in'],
    highlights: ['Two bedrooms with two beds, sleeping up to four guests', 'Dedicated lower-ground-floor cinema room and dining area', 'Fully equipped kitchen for meals at home', 'Short and extended stays in South London'],
    details: [
      { title: 'Bedrooms', text: 'Two comfortable bedrooms with two beds in total, accommodating up to four guests.' },
      { title: 'Bathroom', text: 'One bathroom.' },
      { title: 'Living space', text: 'Bright ground-floor living space, plus a separate lower-ground-floor cinema room with a dining area.' },
      { title: 'Kitchen and laundry', text: 'Fully equipped kitchen and a washing machine for convenient longer stays.' },
    ],
    externalLinks: [{ label: 'Airbnb', href: 'https://www.airbnb.co.uk/rooms/1680711386739587198' }],
  },
  {
    slug: 'the-coach-house',
    name: 'The Coach House',
    bookingIframe: 'https://login.smoobu.com/en/booking-tool/iframe/1873721/3493346',
    bookingTarget: 'apartmentIframe3493346',
    bookingUrl: 'https://booking.smoobu.com/9A1873721?apartmentId=3493346',
    address: 'The Coach House, 70 Thornbury Road, London SW2 4DA',
    type: 'Entire guest house',
    area: 'South London, SW2',
    price: 'Check dates for pricing',
    maxGuests: 2,
    checkInFrom: '15:00',
    available: true,
    image: '/coach-house-1.jpg',
    images: Array.from({ length: 8 }, (_, index) => `/coach-house-${index + 1}.jpg`),
    summary: 'A private one-bedroom coach house for two, with its own entrance, kitchenette and outdoor space.',
    description: 'Enjoy your own private retreat at The Coach House, 70 Thornbury Road. This one-bedroom guest house has a separate entrance, comfortable lounge, Smart TV and dedicated workspace. A kitchenette and private outdoor space make it easy to settle in, with self check-in for a flexible arrival. A welcoming base for couples, contractors and business travellers visiting South London.',
    features: ['Private Entrance', 'Wi-Fi', 'Dedicated Workspace', 'Kitchenette', 'Private Patio or Balcony', 'Smart TV', 'Self Check-in', 'Pets Allowed'],
    highlights: ['One bedroom with one bed, sleeping up to two guests', 'Private entrance and self check-in', 'Kitchenette with microwave, fridge and Nespresso coffee maker', 'Private outdoor space with outdoor furniture'],
    details: [
      { title: 'Bedroom', text: 'One bedroom with one bed, accommodating up to two guests.' },
      { title: 'Bathroom', text: 'One bathroom.' },
      { title: 'Living space', text: 'A comfortable lounge with a Smart TV and a dedicated workspace.' },
      { title: 'Kitchenette', text: 'A kitchenette with a fridge, microwave, kettle, toaster and Nespresso coffee maker; not a full kitchen.' },
    ],
    externalLinks: [{ label: 'Airbnb', href: 'https://www.airbnb.co.uk/rooms/1680734593946484199' }],
  },
];

export const PROPERTIES_BY_SLUG = PROPERTIES.reduce((map, property) => {
  map[property.slug] = property;
  return map;
}, {});

export function getPropertyBySlug(slug) {
  return PROPERTIES_BY_SLUG[slug] || null;
}
