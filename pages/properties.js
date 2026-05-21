import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AIRBNB_FOREST_HILL_URL, BOOKING_FOREST_HILL_URL, FORMSPREE_URL } from '../lib/config';
import {
  DAY_MS,
  parseDateKey,
  toDateKey,
  addDays,
  getNightsBetween,
  formatLongDate,
  formatMonthLabel,
  formatCurrency,
} from '../lib/utils';
import { useFadeUp } from '../hooks/useFadeUp';
import styles from '../styles/Properties.module.css';

const MIN_STAY_NIGHTS = 2;
const DEFAULT_CALENDAR_DATA = { connected: false, bookedDates: [], bookedRanges: [], lastSyncedAt: null };

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
  while (cursor < end) { dates.push(toDateKey(cursor)); cursor = addDays(cursor, 1); }
  return dates;
}

export default function Properties() {
  const router = useRouter();
  const addRef = useFadeUp();

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
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [enquiryStatus, setEnquiryStatus] = useState('idle');
  const enquiryRef = useRef(null);

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
      .catch(() => { if (isMounted) { setCalendarData(DEFAULT_CALENDAR_DATA); setCalendarError('Live availability could not be loaded right now.'); } })
      .finally(() => { if (isMounted) setCalendarLoading(false); });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isCalendarOpen) {
      document.body.classList.add('calendar-open');
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
    return () => {
      document.body.classList.remove('calendar-open');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isCalendarOpen]);

  useEffect(() => {
    if (!showEnquiryForm || typeof window === 'undefined') return;
    const node = enquiryRef.current;
    if (!node) return;
    const top = node.getBoundingClientRect().top + window.pageYOffset - 24;
    window.scrollTo(0, Math.max(top, 0));
  }, [showEnquiryForm]);

  const isDateBooked = key => bookedDates.has(key);
  const isInSelectedStay = key => checkIn && checkOut && key >= checkIn && key < checkOut;

  const clearSelection = () => {
    setCheckIn(''); setCheckOut('');
    setAvailabilityMessage(''); setAvailabilityTone('default');
    setShowEnquiryForm(false);
  };

  const selectedStaySummary = checkIn && checkOut
    ? `${formatLongDate(checkIn)} - ${formatLongDate(checkOut)}`
    : checkIn ? `${formatLongDate(checkIn)} - Add checkout` : 'Select your stay dates';
  const nightsSummary = nights > 0 ? `${nights} night${nights === 1 ? '' : 's'}` : 'Pick your dates';

  const handleDateFieldClick = () => {
    if (checkIn && checkOut) clearSelection();
    setActiveMonthIndex(0);
    setIsCalendarOpen(true);
  };

  const handleDaySelect = (dateKey) => {
    if (dateKey < todayKey || isDateBooked(dateKey)) return;
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(dateKey); setCheckOut('');
      setAvailabilityMessage(''); setAvailabilityTone('default');
      return;
    }
    if (dateKey <= checkIn) {
      setCheckIn(dateKey); setCheckOut('');
      setAvailabilityMessage(''); setAvailabilityTone('default');
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

    setTimeout(() => {
      setIsCalendarOpen(false);
      setShowEnquiryForm(true);
      setAvailabilityTone('available');
      setAvailabilityMessage(
        `${property.name} is ready to book from ${formatLongDate(checkIn)} to ${formatLongDate(dateKey)} for ${guests} guest${guests === 1 ? '' : 's'}.`
      );
    }, 500);
  };

  const handleSaveDates = () => {
    if (!checkIn || !checkOut) { setAvailabilityTone('warning'); setAvailabilityMessage('Please select both a check-in and check-out date.'); return; }
    if (nights < MIN_STAY_NIGHTS) { setAvailabilityTone('warning'); setAvailabilityMessage(`A minimum stay of ${MIN_STAY_NIGHTS} nights is required.`); return; }
    setIsCalendarOpen(false);
  };

  const handleBookingSearch = (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) { setAvailabilityTone('warning'); setAvailabilityMessage('Please select both a check-in and check-out date on the calendar.'); return; }
    if (nights < MIN_STAY_NIGHTS) { setAvailabilityTone('warning'); setAvailabilityMessage(`A minimum stay of ${MIN_STAY_NIGHTS} nights is required.`); return; }
    if (!calendarData.connected) { setAvailabilityTone('warning'); setAvailabilityMessage('Live availability is not connected yet.'); return; }
    const conflict = getStayDates(checkIn, checkOut).find(d => d !== checkIn && bookedDates.has(d));
    if (conflict) { setAvailabilityTone('unavailable'); setAvailabilityMessage(`${formatLongDate(conflict)} is already booked.`); return; }
    setAvailabilityTone('available');
    setAvailabilityMessage(`${property.name} is available from ${formatLongDate(checkIn)} to ${formatLongDate(checkOut)} for ${guests} guest${guests === 1 ? '' : 's'}.`);
    setIsCalendarOpen(true);
  };

  const openEnquiryForm = () => {
    setIsCalendarOpen(false);
    setShowEnquiryForm(true);
    setAvailabilityTone('available');
    setAvailabilityMessage(`${property.name} is ready for enquiry from ${formatLongDate(checkIn)} to ${formatLongDate(checkOut)} for ${guests} guest${guests === 1 ? '' : 's'}.`);
  };

  const goToCheckout = () => {
    setIsCalendarOpen(false);
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

  const handleEnquirySubmit = async (event) => {
    event.preventDefault();
    setEnquiryStatus('sending');
    const formData = new FormData(event.target);
    try {
      const response = await fetch(FORMSPREE_URL, { method: 'POST', body: formData, headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Unable to send enquiry');
      setEnquiryStatus('success');
      event.target.reset();
    } catch {
      setEnquiryStatus('error');
    }
  };

  const activeMonth = calendarMonths[activeMonthIndex];

  const calendarPicker = (
    <>
      <div className={styles.calendarTopbar}>
        <div className={styles.calendarActionsTop}>
          <button type="button" className={styles.closeCalendar} onClick={() => setIsCalendarOpen(false)} aria-label="Close calendar">×</button>
          <button type="button" className={styles.clearDatesButton} onClick={clearSelection}>Clear dates</button>
        </div>
      </div>

      <div className={styles.calendarSummary}>
        <p className={styles.calendarLabel}>{property.name}</p>
        <h3 className={styles.inlineCalendarTitle}>{nightsSummary}</h3>
        <p className={styles.calendarSelection}>{selectedStaySummary}</p>
      </div>

      <div className={styles.legend}>
        <span><i className={styles.legendAvailable} /> Available</span>
        <span><i className={styles.legendSelected} /> Selected</span>
        <span><i className={styles.legendBooked} /> Booked</span>
      </div>

      <div className={styles.mobileMonthNav}>
        <button type="button" className={styles.monthNavButton} onClick={() => setActiveMonthIndex(i => Math.max(i - 1, 0))} disabled={activeMonthIndex === 0}>Prev</button>
        <strong>{activeMonth?.label}</strong>
        <button type="button" className={styles.monthNavButton} onClick={() => setActiveMonthIndex(i => Math.min(i + 1, calendarMonths.length - 1))} disabled={activeMonthIndex === calendarMonths.length - 1}>Next</button>
      </div>

      {calendarLoading ? (
        <div className={styles.inlinePlaceholder}><h3>Loading calendar</h3><p>Checking the latest availability…</p></div>
      ) : calendarError ? (
        <div className={styles.inlinePlaceholder}><h3>Calendar temporarily unavailable</h3><p>{calendarError}</p></div>
      ) : (
        <div className={styles.inlineCalendarPanel}>
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
        {isReadyToBook ? (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button type="button" className={styles.calendarSaveButton} onClick={goToCheckout}>Pay deposit / Book now</button>
            <button type="button" className={`${styles.calendarSaveButton} ${styles.calendarSaveButtonOutline}`} onClick={openEnquiryForm}>Send enquiry</button>
          </div>
        ) : (
          <button type="button" className={styles.calendarSaveButton} onClick={handleSaveDates}>Save dates</button>
        )}
      </div>
    </>
  );

  return (
    <>
      <Head>
        <title>Properties | Agatha Living</title>
        <meta name="description" content="Browse serviced accommodation in Forest Hill, London. Book direct with Agatha Living for flexible short stays." />
      </Head>

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
              Select your stay dates, see your total, and book directly or send an enquiry. A minimum stay of {MIN_STAY_NIGHTS} nights applies.
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
                <button type="button" onClick={() => setGuests(g => Math.max(g - 1, 1))} aria-label="Decrease guests">-</button>
                <strong>{guests}</strong>
                <button type="button" onClick={() => setGuests(g => Math.min(g + 1, 8))} aria-label="Increase guests">+</button>
              </div>
            </div>
            {isReadyToBook ? (
              <button type="button" className={`btn-gold ${styles.bookingButton} ${styles.bookingActionLink}`} onClick={goToCheckout}>
                Book now
              </button>
            ) : (
              <button type="submit" className={`btn-gold ${styles.bookingButton}`}>Check Availability</button>
            )}
          </form>

          <div className={styles.minimumStayNote}>Minimum stay: {MIN_STAY_NIGHTS} nights</div>

          <div className={styles.bookingSummary}>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Nightly rate</span>
              <strong>{formatCurrency(property.nightlyRate)}</strong>
              <p>Pricing is shown clearly before payment.</p>
            </div>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Stay total</span>
              <strong>{estimatedTotal ? formatCurrency(estimatedTotal) : 'Select dates'}</strong>
              <p>{nights >= MIN_STAY_NIGHTS ? `${nights} night${nights === 1 ? '' : 's'} selected` : `Pick at least ${MIN_STAY_NIGHTS} nights`}</p>
            </div>
          </div>

          <div className={styles.externalBookingRow}>
            <a href={AIRBNB_FOREST_HILL_URL} target="_blank" rel="noopener noreferrer" className="btn-outline-dark">Book on Airbnb</a>
            <a href={BOOKING_FOREST_HILL_URL} target="_blank" rel="noopener noreferrer" className="btn-outline-dark">Book on Booking.com</a>
          </div>

          {availabilityMessage ? (
            <div className={`${styles.availabilityResult} ${availabilityTone === 'available' ? styles.resultAvailable : availabilityTone === 'unavailable' ? styles.resultUnavailable : styles.resultWarning}`}>
              {availabilityMessage}
            </div>
          ) : null}
        </div>

        <div className={styles.grid}>
          {properties.map(p => (
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
                  {p.features.map(f => <span key={f} className={styles.cardFeature}>{f}</span>)}
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.cardPrice}>{p.price}</span>
                  <div className={styles.cardActions}>
                    <a href={AIRBNB_FOREST_HILL_URL} target="_blank" rel="noopener noreferrer" className="btn-outline-dark">Airbnb</a>
                    <a href={BOOKING_FOREST_HILL_URL} target="_blank" rel="noopener noreferrer" className="btn-outline-dark">Booking.com</a>
                    <Link href="/contact" className="btn-gold">Enquire</Link>
                  </div>
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

        {showEnquiryForm ? (
          <div ref={enquiryRef} className={styles.enquiryPanel}>
            <span className="section-tag">Booking Enquiry</span>
            <h3 className={styles.enquiryTitle}>Complete your stay enquiry</h3>
            <p className={styles.enquiryCopy}>The selected dates and stay details are included below. Add your details and send the enquiry directly — or <button type="button" onClick={goToCheckout} style={{background:'none',border:'none',color:'var(--gold)',cursor:'pointer',fontWeight:600,font:'inherit'}}>pay a deposit to secure your booking</button>.</p>

            <div className={styles.enquirySummary}>
              <div><strong>Property</strong><p>{property.name}</p></div>
              <div><strong>Check-in</strong><p>{formatLongDate(checkIn)}</p></div>
              <div><strong>Check-out</strong><p>{formatLongDate(checkOut)}</p></div>
              <div><strong>Guests</strong><p>{guests}</p></div>
              <div><strong>Nights</strong><p>{nights}</p></div>
              <div><strong>Total</strong><p>{formatCurrency(estimatedTotal)}</p></div>
            </div>

            {enquiryStatus === 'success' ? (
              <div className={styles.enquirySuccess}>
                <h4>Enquiry received</h4>
                <p>Thank you. A confirmation with the next steps will be sent shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className={styles.enquiryForm}>
                <input type="hidden" name="_subject" value={`Booking enquiry — ${property.name}`} />
                <input type="hidden" name="property" value={property.name} />
                <input type="hidden" name="check_in" value={formatLongDate(checkIn)} />
                <input type="hidden" name="check_out" value={formatLongDate(checkOut)} />
                <input type="hidden" name="guests" value={String(guests)} />
                <input type="hidden" name="nights" value={String(nights)} />
                <input type="hidden" name="total" value={formatCurrency(estimatedTotal)} />

                <div className={styles.enquiryFormRow}>
                  <div className={styles.enquiryField}>
                    <label htmlFor="booking_first_name">First name</label>
                    <input id="booking_first_name" type="text" name="first_name" placeholder="Jane" required />
                  </div>
                  <div className={styles.enquiryField}>
                    <label htmlFor="booking_last_name">Last name</label>
                    <input id="booking_last_name" type="text" name="last_name" placeholder="Smith" required />
                  </div>
                </div>
                <div className={styles.enquiryFormRow}>
                  <div className={styles.enquiryField}>
                    <label htmlFor="booking_email">Email address</label>
                    <input id="booking_email" type="email" name="email" placeholder="jane@example.com" required />
                  </div>
                  <div className={styles.enquiryField}>
                    <label htmlFor="booking_phone">Phone number</label>
                    <input id="booking_phone" type="tel" name="phone" placeholder="07700 000000" />
                  </div>
                </div>
                <div className={styles.enquiryField}>
                  <label htmlFor="booking_message">Message</label>
                  <textarea id="booking_message" name="message" rows={5}
                    placeholder="Add any arrival notes or questions here…"
                    defaultValue={`Stay requested: ${property.name}\nCheck-in: ${formatLongDate(checkIn)}\nCheck-out: ${formatLongDate(checkOut)}\nGuests: ${guests}\nNights: ${nights}\nTotal: ${formatCurrency(estimatedTotal)}`}
                  />
                </div>
                {enquiryStatus === 'error' ? <p className={styles.enquiryError}>Something went wrong. Please try again.</p> : null}
                <div className={styles.enquiryActions}>
                  <button type="submit" className="btn-gold" disabled={enquiryStatus === 'sending'}>
                    {enquiryStatus === 'sending' ? 'Sending…' : 'Send booking enquiry'}
                  </button>
                  <button type="button" onClick={goToCheckout} className="btn-outline-dark">Pay deposit to confirm</button>
                </div>
              </form>
            )}
          </div>
        ) : null}
      </section>

      {isCalendarOpen ? (
        <div className={styles.calendarOverlay} role="dialog" aria-modal="true" aria-label="Choose your stay dates">
          <button type="button" className={styles.calendarScrim} onClick={() => setIsCalendarOpen(false)} aria-label="Close calendar" />
          <div id="availability-calendar" className={styles.calendarModal}>{calendarPicker}</div>
        </div>
      ) : null}
    </>
  );
}
