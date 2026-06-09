import { DEPOSIT_PERCENT } from './config';
import { getNightsBetween, toDateKey } from './utils';

export const MIN_STAY_NIGHTS = 2;

export const BOOKABLE_PROPERTIES = {
  'Greystead Road': {
    name: 'Greystead Road',
    nightlyRate: 150,
    maxGuests: 8,
  },
};

export function calculateBookingCharge({ property, checkIn, checkOut, guests, paymentMode = 'deposit' }) {
  const bookableProperty = BOOKABLE_PROPERTIES[property];
  if (!bookableProperty) {
    return { error: 'Invalid property.' };
  }

  const guestCount = Number(guests);
  if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > bookableProperty.maxGuests) {
    return { error: 'Invalid guest count.' };
  }

  if (!checkIn || !checkOut || checkIn < toDateKey(new Date())) {
    return { error: 'Invalid stay dates.' };
  }

  const nights = getNightsBetween(checkIn, checkOut);
  if (nights < MIN_STAY_NIGHTS) {
    return { error: `A minimum stay of ${MIN_STAY_NIGHTS} nights is required.` };
  }

  const total = bookableProperty.nightlyRate * nights;
  const depositAmount = Math.round(total * DEPOSIT_PERCENT / 100);
  const mode = paymentMode === 'full' ? 'full' : 'deposit';
  const chargeAmount = mode === 'full' ? total : depositAmount;

  return {
    property: bookableProperty.name,
    checkIn,
    checkOut,
    guests: guestCount,
    nights,
    total,
    paymentMode: mode,
    chargeAmount,
  };
}
