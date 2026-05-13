import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from '../styles/Properties.module.css';

const DAY_MS = 24 * 60 * 60 * 1000;
const MIN_STAY_NIGHTS = 2;
const DEFAULT_CALENDAR_DATA = {
  connected: false,
  bookedDates: [],
  bookedRanges: [],
  lastSyncedAt: null,
};

const properties = [
  {
    id: 1,
    name: 'Greystead Road',
    address: '62 Greystead Road, Forest Hill, London SE23 3SD',
    type: 'Short Stay',
    zone: 'Zone 3',
    area: 'Forest Hill, SE23',
    price: 'From £150 per night',
    nightlyRate: 150,
    available: true,
    image: '/foresthill.jpg',
    features: ['Fully Serviced', 'Professionally Cleaned', 'Flexible Bookings', 'All Bills Included'],
  },
];

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function parseDateKey(value) {
  if (!value || typeof value !== 'string') return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function getNightsBetween(startKey, endKey) {
  const start = parseDateKey(startKey);
  const end = parseDateKey(endKey);
  if (!start || !end) return 0;
  return Math.round((end.getTime() - start.getTime()) / DAY_MS);
}

function formatLongDate(value) {
  const parsed = parseDateKey(value);
  if (!parsed) return value || 'Selected dates';

  try {
    return parsed.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch (error) {
    return value;
  }
}

function formatMonthLabel(date) {
  try {
    return date.toLocaleDateString('en-GB', {
      month: 'long',
      year: 'numeric',
    });
  } catch (error) {
    return `${date.getMonth() + 1}/${date.getFullYear()}`;
  }
}

function formatCurrency(value) {
  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(value);
  } catch (error) {
    return `£${value}`;
  }
}

function buildCalendarMonth(monthDate) {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1, 12, 0, 0, 0);
  const startWeekday = (firstDay.getDay() + 6) % 7;
  const gridStart = addDays(firstDay, -startWeekday);
  const days = [];

  for (let index = 0; index < 42; index += 1) {
    const day = addDays(gridStart, index);
    days.push({
      key: toDateKey(day),
      label: day.getDate(),
      inMonth: day.getMonth() === monthDate.getMonth(),
    });
  }

  return {
    key: `${monthDate.getFullYear()}-${monthDate.getMonth()}`,
    label: formatMonthLabel(monthDate),
    days,
  };
}

function getStayDates(startKey, endKey) {
  const start = parseDateKey(startKey);
  const end = parseDateKey(endKey);
  if (!start || !end || end <= start) return [];

  const dates = [];
  let cursor = new Date(start);

  while (cursor < end) {
    dates.push(toDateKey(cursor));
    cursor = addDays(cursor, 1);
  }

  return dates;
}

export default function Properties() {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [activeMonthIndex, setActiveMonthIndex] = useState(0);
  const [calendarData, setCalendarData] = useState(DEFAULT_CALENDAR_DATA);
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [calendarError, setCalendarError] = useState('');
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [availabilityTone, setAvailabilityTone] = useState('default');
  const fadeRefs = useRef([]);

  const property = properties[0];
  const todayKey = useMemo(() => toDateKey(new Date()), []);
  const bookedDates = useMemo(() => new Set(calendarData.bookedDates), [calendarData.bookedDates]);
  const nights = useMemo(() => getNightsBetween(checkIn, checkOut), [checkIn, checkOut]);
  const estimatedTotal = nights >= MIN_STAY_NIGHTS ? property.nightlyRate * nights : 0;
  const isReadyToBook = Boolean(checkIn && checkOut && nights >= MIN_STAY_NIGHTS);

  const calendarMonths = useMemo(() => {
    const now = new Date();
    const firstMonth = new Date(now.getFullYear(), now.getMonth(), 1, 12, 0, 0, 0);
    const latestBookedDate = calendarData.bookedDates.length
      ? parseDateKey(calendarData.bookedDates[calendarData.bookedDates.length - 1])
      : null;
    const fallbackMonthCount = 12;
    const monthsNeededFromFeed = latestBookedDate
      ? Math.max(
          0,
          (latestBookedDate.getFullYear() - firstMonth.getFullYear()) * 12 +
            (latestBookedDate.getMonth() - firstMonth.getMonth()) +
            2
        )
      : fallbackMonthCount;
    const totalMonths = Math.max(fallbackMonthCount, monthsNeededFromFeed);

    return Array.from({ length: totalMonths }, (_, index) =>
      buildCalendarMonth(new Date(firstMonth.getFullYear(), firstMonth.getMonth() + index, 1, 12, 0, 0, 0))
    );
  }, [calendarData.bookedDates]);

  useEffect(() => {
    const revealAll = () => {
      fadeRefs.current.forEach((el) => el && el.classList.add('visible'));
    };

    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      revealAll();
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), index * 120);
        }
      }),
      { threshold: 0.1 }
    );

    fadeRefs.current.forEach((el) => el && observer.observe(el));
    const fallbackTimer = window.setTimeout(revealAll, 900);

    return () => {
      window.clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, []);

  const addRef = (el) => {
    if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchAvailability = async () => {
      try {
        const response = await fetch('/api/guesty-availability');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Unable to sync calendar.');
        }

        if (isMounted) {
          setCalendarData({
            connected: Boolean(data && data.connected),
            bookedDates: Array.isArray(data && data.bookedDates) ? data.bookedDates : [],
            bookedRanges: Array.isArray(data && data.bookedRanges) ? data.bookedRanges : [],
            lastSyncedAt: data && data.lastSyncedAt ? data.lastSyncedAt : null,
          });
          setCalendarError('');
        }
      } catch (error) {
        if (isMounted) {
          setCalendarData(DEFAULT_CALENDAR_DATA);
          setCalendarError('Live availability could not be loaded right now.');
        }
      } finally {
        if (isMounted) {
          setCalendarLoading(false);
        }
      }
    };

    fetchAvailability();

    return () => {
      isMounted = false;
    };
  }, []);

  const isDateBooked = (dateKey) => bookedDates.has(dateKey);

  const isInSelectedStay = (dateKey) => {
    if (!checkIn || !checkOut) return false;
    return dateKey >= checkIn && dateKey < checkOut;
  };

  const clearSelection = () => {
    setCheckIn('');
    setCheckOut('');
    setAvailabilityMessage('');
    setAvailabilityTone('default');
  };

  const selectedStaySummary = checkIn && checkOut
    ? `${formatLongDate(checkIn)} - ${formatLongDate(checkOut)}`
    : checkIn
      ? `${formatLongDate(checkIn)} - Add checkout`
      : 'Select your stay dates';
  const nightsSummary = nights > 0 ? `${nights} night${nights === 1 ? '' : 's'}` : 'Pick your dates';

  const handleDateFieldClick = () => {
    if (checkIn && checkOut) {
      clearSelection();
    }
    setActiveMonthIndex(0);
    setIsCalendarOpen(true);
  };

  const handleDaySelect = (dateKey) => {
    if (dateKey < todayKey || isDateBooked(dateKey)) return;

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(dateKey);
      setCheckOut('');
      setAvailabilityMessage('');
      setAvailabilityTone('default');
      return;
    }

    if (dateKey <= checkIn) {
      setCheckIn(dateKey);
      setCheckOut('');
      setAvailabilityMessage('');
      setAvailabilityTone('default');
      return;
    }

    const proposedNights = getNightsBetween(checkIn, dateKey);
    if (proposedNights < MIN_STAY_NIGHTS) {
      setAvailabilityTone('warning');
      setAvailabilityMessage(`A minimum stay of ${MIN_STAY_NIGHTS} nights is required.`);
      return;
    }

    const proposedStay = getStayDates(checkIn, dateKey);
    const conflictingDate = proposedStay.find((stayDate) => stayDate !== checkIn && isDateBooked(stayDate));

    if (conflictingDate) {
      setAvailabilityTone('unavailable');
      setAvailabilityMessage(`${formatLongDate(conflictingDate)} is already booked, so those dates are unavailable.`);
      return;
    }

    setCheckOut(dateKey);
    setAvailabilityTone('available');
    setAvailabilityMessage(
      `${nights === proposedNights ? 'Selected' : 'Stay selected'} from ${formatLongDate(checkIn)} to ${formatLongDate(dateKey)}.`
    );
    setIsCalendarOpen(false);
  };

  const handleSaveDates = () => {
    if (!checkIn || !checkOut) {
      setAvailabilityTone('warning');
      setAvailabilityMessage('Please select both a check-in and check-out date.');
      return;
    }

    if (nights < MIN_STAY_NIGHTS) {
      setAvailabilityTone('warning');
      setAvailabilityMessage(`A minimum stay of ${MIN_STAY_NIGHTS} nights is required.`);
      return;
    }

    setIsCalendarOpen(false);
  };

  const handleBookingSearch = (e) => {
    e.preventDefault();

    if (!checkIn || !checkOut) {
      setAvailabilityTone('warning');
      setAvailabilityMessage('Please select both a check-in and check-out date on the calendar.');
      return;
    }

    if (nights < MIN_STAY_NIGHTS) {
      setAvailabilityTone('warning');
      setAvailabilityMessage(`A minimum stay of ${MIN_STAY_NIGHTS} nights is required.`);
      return;
    }

    if (!calendarData.connected) {
      setAvailabilityTone('warning');
      setAvailabilityMessage('Live availability is not connected yet.');
      return;
    }

    const stayDates = getStayDates(checkIn, checkOut);
    const conflictingDate = stayDates.find((date) => date !== checkIn && bookedDates.has(date));

    if (conflictingDate) {
      setAvailabilityTone('unavailable');
      setAvailabilityMessage(`${formatLongDate(conflictingDate)} is already booked.`);
      return;
    }

    setAvailabilityTone('available');
    setAvailabilityMessage(
      `${property.name} is available from ${formatLongDate(checkIn)} to ${formatLongDate(checkOut)} for ${guests} guest${guests === 1 ? '' : 's'}.`
    );

    setIsCalendarOpen(true);
  };

  const incrementGuests = () => setGuests((current) => Math.min(current + 1, 8));
  const decrementGuests = () => setGuests((current) => Math.max(current - 1, 1));

  const calendarPicker = (
    <>
      <div className={styles.calendarTopbar}>
        <div className={styles.calendarActionsTop}>
          <button
            type="button"
            className={styles.closeCalendar}
            onClick={() => setIsCalendarOpen(false)}
            aria-label="Close calendar"
          >
            ×
          </button>
          <button
            type="button"
            className={styles.clearDatesButton}
            onClick={clearSelection}
          >
            Clear dates
          </button>
        </div>
      </div>

      <div className={styles.calendarSummary}>
        <p className={styles.calendarLabel}>Greystead Road</p>
        <h3 className={styles.inlineCalendarTitle}>{nightsSummary}</h3>
        <p className={styles.calendarSelection}>{selectedStaySummary}</p>
      </div>

      <div className={styles.legend}>
        <span><i className={styles.legendAvailable} /> Available</span>
        <span><i className={styles.legendSelected} /> Selected</span>
        <span><i className={styles.legendBooked} /> Booked</span>
      </div>

      <div className={styles.mobileMonthNav}>
        <button
          type="button"
          className={styles.monthNavButton}
          onClick={() => setActiveMonthIndex((current) => Math.max(current - 1, 0))}
          disabled={activeMonthIndex === 0}
        >
          Prev
        </button>
        <strong>{calendarMonths[activeMonthIndex]?.label}</strong>
        <button
          type="button"
          className={styles.monthNavButton}
          onClick={() => setActiveMonthIndex((current) => Math.min(current + 1, calendarMonths.length - 1))}
          disabled={activeMonthIndex === calendarMonths.length - 1}
        >
          Next
        </button>
      </div>

      {calendarLoading ? (
        <div className={styles.inlinePlaceholder}>
          <h3>Loading calendar</h3>
          <p>The latest booked dates for this stay are being checked.</p>
        </div>
      ) : calendarError ? (
        <div className={styles.inlinePlaceholder}>
          <h3>Calendar temporarily unavailable</h3>
          <p>{calendarError}</p>
        </div>
      ) : (
        <div className={styles.inlineCalendarPanel}>
          <div className={styles.calendarMonths}>
            {calendarMonths.map((month, index) => (
              <div
                key={month.key}
                className={`${styles.calendarMonth} ${index === activeMonthIndex ? styles.calendarMonthActive : ''}`}
              >
                <div className={styles.monthHeader}>{month.label}</div>
                <div className={styles.weekdays}>
                  {WEEKDAY_LABELS.map((day) => <span key={day}>{day}</span>)}
                </div>
                <div className={styles.daysGrid}>
                  {month.days.map((day) => {
                    const isBooked = isDateBooked(day.key);
                    const isPast = day.key < todayKey;
                    const isCheckIn = checkIn === day.key;
                    const isCheckOut = checkOut === day.key;
                    const isSelected = isCheckIn || isCheckOut || isInSelectedStay(day.key);

                    return (
                      <button
                        key={day.key}
                        type="button"
                        className={`${styles.dayButton} ${!day.inMonth ? styles.dayMuted : ''} ${isBooked || isPast ? styles.dayBooked : ''} ${isSelected ? styles.daySelected : ''} ${isCheckIn ? styles.dayCheckIn : ''} ${isCheckOut ? styles.dayCheckOut : ''}`}
                        onClick={() => handleDaySelect(day.key)}
                        disabled={isBooked || isPast || !day.inMonth}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.calendarFooter}>
        <div className={styles.calendarAmount}>
          <span>Total</span>
          <strong>{estimatedTotal ? formatCurrency(estimatedTotal) : formatCurrency(property.nightlyRate)}</strong>
        </div>
        <button
          type="button"
          className={styles.calendarSaveButton}
          onClick={handleSaveDates}
        >
          Save
        </button>
      </div>
    </>
  );

  return (
    <>
      <Head><title>Properties | Agatha Living</title></Head>

      <div className="page-hero page-hero-properties">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <span className="section-tag">Available Now</span>
          <h1>Our <em>properties</em></h1>
        </div>
      </div>

      <section className={styles.section}>
        <div ref={addRef} className="fade-up">
          <span className="section-tag">Listings</span>
          <h2 className="section-title">Find your<br /><em>perfect stay</em></h2>
          <p className="section-sub">Each stay is professionally prepared, carefully maintained, and available for flexible short-term bookings.</p>
        </div>

        <div ref={addRef} className={`${styles.bookingShell} fade-up`}>
          <div className={styles.bookingIntro}>
            <span className={styles.bookingEyebrow}>Direct Booking</span>
            <h3 className={styles.bookingTitle}>Choose your dates and see availability instantly.</h3>
            <p className={styles.bookingText}>
              Select your stay dates, see your total, and continue with your booking enquiry. A minimum stay of {MIN_STAY_NIGHTS} nights applies.
            </p>
          </div>

          <form className={styles.bookingBar} onSubmit={handleBookingSearch}>
            <button type="button" className={styles.bookingDisplay} onClick={handleDateFieldClick}>
              <span>Check-in</span>
              <strong>{checkIn ? formatLongDate(checkIn) : 'Add date'}</strong>
            </button>

            <button type="button" className={styles.bookingDisplay} onClick={handleDateFieldClick}>
              <span>Check-out</span>
              <strong>{checkOut ? formatLongDate(checkOut) : 'Add date'}</strong>
            </button>

            <div className={styles.guestPicker}>
              <span>Guests</span>
              <div className={styles.guestControls}>
                <button type="button" onClick={decrementGuests} aria-label="Decrease guests">-</button>
                <strong>{guests}</strong>
                <button type="button" onClick={incrementGuests} aria-label="Increase guests">+</button>
              </div>
            </div>

            {isReadyToBook ? (
              <Link
                href={{
                  pathname: '/reservation',
                  query: {
                    property: property.name,
                    checkIn,
                    checkOut,
                    guests,
                    nights,
                    total: estimatedTotal,
                  },
                }}
                className={`btn-gold ${styles.bookingButton} ${styles.bookingActionLink}`}
              >
                Continue to enquiry
              </Link>
            ) : (
              <button type="submit" className={`btn-gold ${styles.bookingButton}`}>
                Check Availability
              </button>
            )}
          </form>

          <div className={styles.minimumStayNote}>Minimum stay: {MIN_STAY_NIGHTS} nights</div>

          <div className={styles.bookingSummary}>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Nightly rate</span>
              <strong>{formatCurrency(property.nightlyRate)}</strong>
              <p>Pricing is shown clearly before the enquiry is sent.</p>
            </div>

            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Stay total</span>
              <strong>{estimatedTotal ? formatCurrency(estimatedTotal) : 'Select dates'}</strong>
              <p>
                {nights >= MIN_STAY_NIGHTS
                  ? `${nights} night${nights === 1 ? '' : 's'} selected`
                  : `Pick at least ${MIN_STAY_NIGHTS} nights`}
              </p>
            </div>
          </div>

          {availabilityMessage ? (
            <div
              className={`${styles.availabilityResult} ${
                availabilityTone === 'available'
                  ? styles.resultAvailable
                  : availabilityTone === 'unavailable'
                    ? styles.resultUnavailable
                    : styles.resultWarning
              }`}
            >
              {availabilityMessage}
            </div>
          ) : null}

          {isCalendarOpen ? (
            <div id="availability-calendar" className={styles.inlineCalendar}>
              {calendarPicker}
            </div>
          ) : null}

        </div>

        <div className={styles.grid}>
          {properties.map((p) => (
            <div key={p.id} ref={addRef} className={`${styles.card} fade-up`}>
              <div className={styles.cardImg} style={{ backgroundImage: `url('${p.image}')` }}>
                <span className={`${styles.cardTag} ${p.available ? styles.available : styles.unavailable}`}>
                  {p.available ? `${p.type} — Available` : 'Currently Unavailable'}
                </span>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardName}>{p.name}</h3>
                <p className={styles.cardAddress}>📍 {p.address}</p>
                <div className={styles.cardFeatures}>
                  {p.features.map((feature) => <span key={feature} className={styles.cardFeature}>{feature}</span>)}
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.cardPrice}>{p.price}</span>
                  <Link href="/contact" className="btn-gold">Enquire</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div ref={addRef} className={`${styles.comingSoon} fade-up`}>
          <span className="section-tag">More Stays</span>
          <h3 className={styles.comingSoonTitle}>More London stays coming soon</h3>
          <p className={styles.comingSoonSub}>New stays will appear here as soon as dates open up. Get in touch to receive availability updates.</p>
          <Link href="/contact" className="btn-outline-dark" style={{ marginTop: '28px' }}>Get availability updates</Link>
        </div>
      </section>

    </>
  );
}
