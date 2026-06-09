import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { PROPERTIES, getPropertyBySlug } from '../../lib/properties';
import { MIN_STAY_NIGHTS } from '../../lib/booking';
import {
  parseDateKey,
  toDateKey,
  addDays,
  getNightsBetween,
  formatLongDate,
  formatMonthLabel,
  formatCurrency,
} from '../../lib/utils';
import styles from '../../styles/Properties.module.css';

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function buildCalendarMonth(monthDate) {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1, 12, 0, 0, 0);
  const startWeekday = (firstDay.getDay() + 6) % 7;
  const gridStart = addDays(firstDay, -startWeekday);
  const days = [];
  for (let i = 0; i < 42; i++) {
    const day = addDays(gridStart, i);
    days.push({ key: toDateKey(day), label: day.getDate(), inMonth: day.getMonth() === monthDate.getMonth() });
  }
  return { key: `${monthDate.getFullYear()}-${monthDate.getMonth()}`, label: formatMonthLabel(monthDate), days };
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

export default function PropertyProfile({ property }) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [activeMonthIndex, setActiveMonthIndex] = useState(0);
  const [calendarData, setCalendarData] = useState({ connected: false, bookedDates: [], bookedRanges: [], lastSyncedAt: null });
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [calendarError, setCalendarError] = useState('');
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [availabilityTone, setAvailabilityTone] = useState('default');

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
    const monthsNeededFromFeed = latestBookedDate
      ? Math.max(0, (latestBookedDate.getFullYear() - firstMonth.getFullYear()) * 12 + (latestBookedDate.getMonth() - firstMonth.getMonth()) + 2)
      : 12;
    return Array.from({ length: Math.max(12, monthsNeededFromFeed) }, (_, i) =>
      buildCalendarMonth(new Date(firstMonth.getFullYear(), firstMonth.getMonth() + i, 1, 12, 0, 0, 0))
    );
  }, [calendarData.bookedDates]);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/guesty-availability')
      .then(r => r.json().then(data => ({ ok: r.ok, data })))
      .then(({ ok, data }) => {
        if (!isMounted) return;
        if (!ok) throw new Error(data.error || 'Unable to sync calendar.');
        setCalendarData({
          connected: Boolean(data?.connected),
          bookedDates: Array.isArray(data?.bookedDates) ? data.bookedDates : [],
          bookedRanges: Array.isArray(data?.bookedRanges) ? data.bookedRanges : [],
          lastSyncedAt: data?.lastSyncedAt ?? null,
        });
        setCalendarError('');
      })
      .catch(() => {
        if (isMounted) {
          setCalendarData({ connected: false, bookedDates: [], bookedRanges: [], lastSyncedAt: null });
          setCalendarError('Live availability could not be loaded right now.');
        }
      })
      .finally(() => {
        if (isMounted) setCalendarLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (router.asPath.includes('#availability')) {
      handleDateFieldClick();
    }
  }, [router.asPath]);

  const isDateBooked = (key) => bookedDates.has(key);
  const isInSelectedStay = (key) => checkIn && checkOut && key >= checkIn && key < checkOut;

  const clearSelection = () => {
    setCheckIn('');
    setCheckOut('');
    setAvailabilityMessage('');
    setAvailabilityTone('default');
  };

  const selectedStaySummary = checkIn && checkOut
    ? `${formatLongDate(checkIn)} - ${formatLongDate(checkOut)}`
    : checkIn ? `${formatLongDate(checkIn)} - Add checkout` : 'Select your stay dates';

  const bookingButtonLabel = isReadyToBook ? 'Reserve' : 'Check availability';

  const handleDateFieldClick = () => {
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
    const conflict = getStayDates(checkIn, dateKey).find(d => d !== checkIn && isDateBooked(d));
    if (conflict) {
      setAvailabilityTone('unavailable');
      setAvailabilityMessage(`${formatLongDate(conflict)} is already booked, so those dates are unavailable.`);
      return;
    }
    setCheckOut(dateKey);
    setAvailabilityTone('available');
    setAvailabilityMessage(`Stay selected from ${formatLongDate(checkIn)} to ${formatLongDate(dateKey)}.`);
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
    setAvailabilityTone('available');
    setAvailabilityMessage(`Saved ${selectedStaySummary} — reserve your stay when you're ready.`);
    setIsCalendarOpen(false);
  };

  const goToCheckout = () => {
    if (!isReadyToBook) {
      setAvailabilityTone('warning');
      setAvailabilityMessage('Choose your dates before booking.');
      return;
    }
    const params = new URLSearchParams({
      property: property.name,
      checkIn,
      checkOut,
      guests: String(guests),
      nights: String(nights),
      total: String(estimatedTotal),
    });
    router.push(`/checkout?${params.toString()}`);
  };

  const galleryImages = Array.isArray(property.images) && property.images.length ? property.images : [property.image];
  const activeMonth = calendarMonths[activeMonthIndex];
  const hasMultipleImages = galleryImages.length > 1;
  const showPreviousImage = () => setActiveGalleryIndex(i => (i - 1 + galleryImages.length) % galleryImages.length);
  const showNextImage = () => setActiveGalleryIndex(i => (i + 1) % galleryImages.length);

  return (
    <>
      <Head>
        <title>{`${property.name} | Agatha Living`}</title>
        <meta
          name="description"
          content={`Discover ${property.name} in Forest Hill. View the property profile, amenity details, and check availability for direct booking.`}
        />
      </Head>

      <div className={styles.propertyHero}>
        <div className={styles.propertyHeroOverlay} />
        <div className={styles.propertyHeroContent}>
          <Link href="/properties" className={styles.propertyBackLink}>← Back to listings</Link>
          <span className="section-tag">Property profile</span>
          <h1 className={styles.propertyTitle}>{property.name}</h1>
          <p className={styles.propertySubtitle}>{property.address}</p>
          <div className={styles.propertyMeta}>
            <span>{property.type}</span>
            <span>{property.area}</span>
            <span>{property.zone}</span>
          </div>
        </div>
      </div>

      <section className={`${styles.section} ${styles.propertyDetailSection}`}>
        <div className={styles.propertyGallery}>
          <p className="section-tag">Photo tour</p>
          <h2 className="section-title">See the property in detail</h2>
          <div className={styles.gallerySingle}>
            <div className={styles.galleryItemSingle}>
              <button
                type="button"
                className={styles.galleryImageButton}
                onClick={hasMultipleImages ? showNextImage : undefined}
                aria-label={hasMultipleImages ? 'Next photo' : 'Property photo'}
              >
                <img
                  src={galleryImages[activeGalleryIndex]}
                  alt={`${property.name} image ${activeGalleryIndex + 1}`}
                  className={styles.galleryImage}
                />
              </button>

              {hasMultipleImages ? (
                <div className={styles.cardGalleryNav}>
                  <button type="button" className={styles.cardGalleryButton} onClick={showPreviousImage} aria-label="Previous photo">‹</button>
                  <button type="button" className={styles.cardGalleryButton} onClick={showNextImage} aria-label="Next photo">›</button>
                </div>
              ) : null}
            </div>

            {hasMultipleImages ? (
              <div className={styles.galleryPager}>
                {galleryImages.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`${styles.galleryPagerDot} ${index === activeGalleryIndex ? styles.galleryPagerDotActive : ''}`}
                    onClick={() => setActiveGalleryIndex(index)}
                    aria-label={`View photo ${index + 1}`}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <div className={styles.propertySplit}>
          <div className={styles.propertyDetails}>
            <div className={styles.detailSection}>
              <h2>About this stay</h2>
              <p className={styles.propertyDescription}>{property.description}</p>
            </div>

            <div className={styles.detailSection}>
              <h3>Highlights</h3>
              <div className={styles.detailFeatureList}>
                {property.highlights.map(item => (
                  <div key={item} className={styles.detailFeature}>{item}</div>
                ))}
              </div>
            </div>

            <div className={styles.detailSection}>
              <h3>What’s included</h3>
              <ul className={styles.detailList}>
                {property.features.map(feature => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className={styles.detailSection}>
              <h3>Property details</h3>
              <div className={styles.detailInfoGrid}>
                {property.details.map(detail => (
                  <div key={detail.title} className={styles.detailInfoItem}>
                    <strong>{detail.title}</strong>
                    <p>{detail.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </section>

      <div id="availability" className={styles.bottomBookingBar}>
        <div className={styles.bottomBookingDetails}>
          <div>
            <span className={styles.bottomBookingLabel}>Your stay</span>
            <strong>{selectedStaySummary}</strong>
          </div>
          <div className={styles.bottomBookingMeta}>
            <span>{checkIn ? formatLongDate(checkIn) : 'Check-in'}</span>
            <span>{checkOut ? formatLongDate(checkOut) : 'Check-out'}</span>
            <span>{nights ? `${nights} nights` : 'Pick dates'}</span>
          </div>
        </div>

        <div className={styles.bottomBookingActions}>
          <span className={styles.bottomBookingPrice}>
            {estimatedTotal ? formatCurrency(estimatedTotal) : `From ${formatCurrency(property.nightlyRate)}`}
          </span>
          <button type="button" className="btn-gold" onClick={isReadyToBook ? goToCheckout : handleDateFieldClick}>
            {bookingButtonLabel}
          </button>
        </div>
      </div>

      {isCalendarOpen ? (
        <div className={styles.calendarOverlay} role="dialog" aria-modal="true" aria-label="Choose your stay dates">
          <button type="button" className={styles.calendarScrim} onClick={() => setIsCalendarOpen(false)} aria-label="Close calendar" />
          <div id="availability-calendar" className={styles.calendarModal}>
            <div className={styles.calendarTopbar}>
              <div className={styles.calendarActionsTop}>
                <button type="button" className={styles.closeCalendar} onClick={() => setIsCalendarOpen(false)} aria-label="Close calendar">×</button>
                <button type="button" className={styles.clearDatesButton} onClick={clearSelection}>Clear dates</button>
              </div>
            </div>

            <div className={styles.calendarSummary}>
              <p className={styles.calendarLabel}>{property.name}</p>
              <h3 className={styles.inlineCalendarTitle}>{selectedStaySummary}</h3>
              <p className={styles.calendarSelection}>{checkIn || checkOut ? selectedStaySummary : 'Pick your stay dates from the calendar below.'}</p>
            </div>

            <div className={styles.legend}>
              <span><i className={styles.legendAvailable} /> Available</span>
              <span><i className={styles.legendSelected} /> Selected</span>
              <span><i className={styles.legendBooked} /> Booked</span>
            </div>

            {availabilityMessage ? (
              <div className={`${styles.availabilityResult} ${availabilityTone === 'available' ? styles.resultAvailable : availabilityTone === 'unavailable' ? styles.resultUnavailable : styles.resultWarning}`}>
                {availabilityMessage}
              </div>
            ) : null}

            {calendarLoading ? (
              <div className={styles.inlinePlaceholder}><h3>Loading calendar</h3><p>Checking the latest availability…</p></div>
            ) : calendarError ? (
              <div className={styles.inlinePlaceholder}><h3>Calendar temporarily unavailable</h3><p>{calendarError}</p></div>
            ) : (
              <div className={styles.inlineCalendarPanel}>
                <div className={styles.mobileMonthNav}>
                  <button type="button" className={styles.monthNavButton} onClick={() => setActiveMonthIndex(i => Math.max(i - 1, 0))} disabled={activeMonthIndex === 0}>Prev</button>
                  <strong>{activeMonth?.label}</strong>
                  <button type="button" className={styles.monthNavButton} onClick={() => setActiveMonthIndex(i => Math.min(i + 1, calendarMonths.length - 1))} disabled={activeMonthIndex === calendarMonths.length - 1}>Next</button>
                </div>
                <div className={styles.calendarMonths}>
                  <div key={activeMonth.key} className={styles.calendarMonth}>
                    <div className={styles.monthHeader}>{activeMonth.label}</div>
                    <div className={styles.weekdays}>{WEEKDAY_LABELS.map(d => <span key={d}>{d}</span>)}</div>
                    <div className={styles.daysGrid}>
                      {activeMonth.days.map(day => {
                        const isBooked = isDateBooked(day.key);
                        const isPast = day.key < todayKey;
                        const isCheckIn = checkIn === day.key;
                        const isCheckOut = checkOut === day.key;
                        const isSelected = isCheckIn || isCheckOut || isInSelectedStay(day.key);
                        return (
                          <button key={day.key} type="button"
                            className={`${styles.dayButton} ${!day.inMonth ? styles.dayMuted : ''} ${isBooked || isPast ? styles.dayBooked : ''} ${isSelected ? styles.daySelected : ''} ${isCheckIn ? styles.dayCheckIn : ''} ${isCheckOut ? styles.dayCheckOut : ''}`}
                            onClick={() => handleDaySelect(day.key)}
                            disabled={isBooked || isPast || !day.inMonth}
                          >{day.label}</button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className={styles.calendarFooter}>
              <div className={styles.calendarAmount}>
                <span>Total</span>
                <strong>{estimatedTotal ? formatCurrency(estimatedTotal) : formatCurrency(property.nightlyRate)}</strong>
              </div>
              <button type="button" className={styles.calendarSaveButton} onClick={handleSaveDates}>
                {isReadyToBook ? 'Save dates' : 'Confirm selection'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function getStaticPaths() {
  return {
    paths: PROPERTIES.map((property) => ({ params: { slug: property.slug } })),
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  const property = getPropertyBySlug(params.slug);
  if (!property) {
    return { notFound: true };
  }
  return { props: { property } };
}
