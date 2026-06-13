import { useEffect } from 'react';

const WIDGET_ID = 'search-widget_IO312PWQ';
const CSS_URL = 'https://s3.amazonaws.com/guesty-frontend-production/search-bar-production.css';
const JS_URL = 'https://s3.amazonaws.com/guesty-frontend-production/search-bar-production.js';
const WIDGET_CONFIG = {
  siteUrl: 'agathalivingltd.guestybookings.com',
  color: '#c9a96e',
};

function createWidget() {
  if (!window.GuestySearchBarWidget) return;

  const container = document.getElementById(WIDGET_ID);
  if (container) container.innerHTML = '';

  window.GuestySearchBarWidget.create(WIDGET_CONFIG).catch((error) => {
    console.log('[Guesty Embedded Widget]:', error.message);
  });
}

export default function GuestyBookingWidget() {
  useEffect(() => {
    if (!document.querySelector(`link[href="${CSS_URL}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = CSS_URL;
      link.media = 'all';
      document.head.appendChild(link);
    }

    if (window.GuestySearchBarWidget) {
      createWidget();
      return undefined;
    }

    const existingScript = document.querySelector(`script[src="${JS_URL}"]`);
    if (existingScript) {
      existingScript.addEventListener('load', createWidget);
      return () => existingScript.removeEventListener('load', createWidget);
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = JS_URL;
    script.async = true;
    script.addEventListener('load', createWidget);
    document.head.appendChild(script);

    return () => script.removeEventListener('load', createWidget);
  }, []);

  return <div id={WIDGET_ID} />;
}
