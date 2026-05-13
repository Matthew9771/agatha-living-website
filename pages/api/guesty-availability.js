const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_GUESTY_ICAL_URL = 'https://app.guesty.com/api/public/icalendar-dashboard-api/export/e68f4444-d5e2-4b22-ba51-883cd80cac30';

function parseIcalDate(value) {
  if (!value) return null;

  const clean = value.trim();

  if (/^\d{8}$/.test(clean)) {
    const year = Number(clean.slice(0, 4));
    const month = Number(clean.slice(4, 6)) - 1;
    const day = Number(clean.slice(6, 8));
    return new Date(Date.UTC(year, month, day));
  }

  if (/^\d{8}T\d{6}Z$/.test(clean)) {
    const year = Number(clean.slice(0, 4));
    const month = Number(clean.slice(4, 6)) - 1;
    const day = Number(clean.slice(6, 8));
    const hour = Number(clean.slice(9, 11));
    const minute = Number(clean.slice(11, 13));
    const second = Number(clean.slice(13, 15));
    return new Date(Date.UTC(year, month, day, hour, minute, second));
  }

  const parsed = new Date(clean);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function getFieldValue(eventBlock, fieldName) {
  const line = eventBlock
    .split('\n')
    .find((entry) => entry.startsWith(`${fieldName}:`) || entry.startsWith(`${fieldName};`));

  if (!line) return '';

  const separatorIndex = line.indexOf(':');
  return separatorIndex >= 0 ? line.slice(separatorIndex + 1).trim() : '';
}

function buildBookedDates(events) {
  const bookedDates = new Set();

  events.forEach((event) => {
    if (!event.start || !event.end) return;

    for (
      let cursor = new Date(event.start.getTime());
      cursor < event.end;
      cursor = new Date(cursor.getTime() + DAY_MS)
    ) {
      bookedDates.add(formatDateKey(cursor));
    }
  });

  return bookedDates;
}

export default async function handler(req, res) {
  const icalUrl =
    process.env.GUESTY_ICAL_URL ||
    process.env.NEXT_PUBLIC_GUESTY_ICAL_URL ||
    DEFAULT_GUESTY_ICAL_URL;

  if (!icalUrl) {
    return res.status(200).json({
      connected: false,
      bookedDates: [],
      bookedRanges: [],
      lastSyncedAt: null,
    });
  }

  try {
    const response = await fetch(icalUrl);

    if (!response.ok) {
      throw new Error(`Guesty returned ${response.status}`);
    }

    const ical = await response.text();
    const eventBlocks = ical.split('BEGIN:VEVENT').slice(1);
    const events = eventBlocks
      .map((block) => {
        const content = block.split('END:VEVENT')[0] || '';
        const start = parseIcalDate(getFieldValue(content, 'DTSTART'));
        const end = parseIcalDate(getFieldValue(content, 'DTEND'));
        const summary = getFieldValue(content, 'SUMMARY');

        return { start, end, summary };
      })
      .filter((event) => event.start && event.end && event.end > event.start)
      .sort((a, b) => a.start - b.start);

    const bookedDates = Array.from(buildBookedDates(events)).sort();
    const bookedRanges = events.map((event) => ({
      start: formatDateKey(event.start),
      end: formatDateKey(new Date(event.end.getTime() - DAY_MS)),
      summary: event.summary || 'Booked',
    }));

    return res.status(200).json({
      connected: true,
      bookedDates,
      bookedRanges,
      lastSyncedAt: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      connected: false,
      bookedDates: [],
      bookedRanges: [],
      lastSyncedAt: null,
      error: 'Unable to sync Guesty calendar.',
    });
  }
}
