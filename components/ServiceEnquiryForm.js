import Link from 'next/link';
import { useRef, useState } from 'react';
import { SERVICE_FORMS, validateServiceEnquiry } from '../lib/service-enquiries';
import contact from '../styles/Contact.module.css';
import styles from '../styles/ServiceEnquiry.module.css';

export default function ServiceEnquiryForm({ kind, id }) {
  const config = SERVICE_FORMS[kind];
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const busy = useRef(false);
  const formRef = useRef(null);
  const errorId = `${id}-error`;

  const submit = async (event) => {
    event.preventDefault();
    if (busy.current) return;
    const data = new FormData(event.currentTarget);
    const details = Object.fromEntries(config.fields.map(field => [field.name, field.type === 'checkboxes' ? data.getAll(field.name) : data.get(field.name)]));
    details.contact_consent = data.get('contact_consent') === 'on';
    const validation = validateServiceEnquiry(kind, details);
    if (validation.error) {
      setError(validation);
      const field = formRef.current.elements.namedItem(validation.field);
      (field?.focus ? field : field?.[0])?.focus();
      return;
    }
    busy.current = true;
    setError(null);
    setStatus('sending');
    try {
      const response = await fetch('/api/leads', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form_kind: kind, details }),
        signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) throw new Error('Submission failed');
      setStatus('success');
    } catch {
      setStatus('idle');
      setError({ error: 'We could not confirm your request was received. Please try again or email support@agathaliving.co.uk.' });
    } finally {
      busy.current = false;
    }
  };

  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-heading`}>
      <div className={styles.card}>
        <h2 id={`${id}-heading`} className="section-title">{config.heading}</h2>
        {status === 'success' ? <p role="status" className={styles.success}>{config.success}</p> : (
          <form ref={formRef} onSubmit={submit} className={contact.form} aria-busy={status === 'sending'}>
            <p className={styles.note}>Fields marked * are required.</p>
            <fieldset disabled={status === 'sending'} className={styles.fields}>
              <legend className={styles.srOnly}>{config.heading}</legend>
              {config.fields.map(field => {
                const fieldId = `${id}-${field.name}`;
                const invalid = error?.field === field.name;
                const props = { id: fieldId, name: field.name, required: field.required, 'aria-invalid': invalid || undefined, 'aria-describedby': invalid ? errorId : undefined };
                if (field.type === 'checkboxes') return (
                  <fieldset key={field.name} className={styles.choices} aria-describedby={invalid ? errorId : undefined}>
                    <legend>{field.label} *</legend>
                    {field.options.map((option, index) => (
                      <label key={option} htmlFor={`${fieldId}-${index}`}>
                        <input id={`${fieldId}-${index}`} type="checkbox" name={field.name} value={option} />{option}
                      </label>
                    ))}
                  </fieldset>
                );
                return (
                  <div key={field.name} className={`${contact.formGroup} ${field.type === 'textarea' ? styles.fullWidth : ''}`}>
                    <label htmlFor={fieldId}>{field.label}{field.required ? ' *' : ''}</label>
                    {field.type === 'select' ? <select {...props} defaultValue=""><option value="" disabled>Select an option</option>{field.options.map(option => <option key={option}>{option}</option>)}</select>
                      : field.type === 'textarea' ? <textarea {...props} rows={5} maxLength={field.maxLength} />
                        : <input {...props} type={field.type || 'text'} autoComplete={field.autoComplete} maxLength={254} min={field.min} max={field.max} step={field.type === 'number' ? 1 : undefined} />}
                  </div>
                );
              })}
              <div className={`${contact.formGroupCheckbox} ${styles.fullWidth}`}>
                <input id={`${id}-consent`} name="contact_consent" type="checkbox" required aria-describedby={error?.field === 'contact_consent' ? errorId : undefined} />
                <label htmlFor={`${id}-consent`}>I agree to be contacted by Agatha Living regarding my enquiry.</label>
              </div>
              <p className={`${styles.note} ${styles.fullWidth}`}>See our <Link href="/privacy-policy">privacy policy</Link> for how we handle your information.</p>
              {error && <p id={errorId} role="alert" className={`${contact.errorMsg} ${styles.fullWidth}`}>{error.error}</p>}
              <button type="submit" className={`btn-gold ${styles.fullWidth}`}>{status === 'sending' ? 'Sending…' : config.submit}</button>
            </fieldset>
          </form>
        )}
      </div>
    </section>
  );
}
