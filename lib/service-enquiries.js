const interests = ['Property feasibility', 'Property sourcing', 'Business setup', 'Complete SA launch', 'Property management', 'Not sure yet'];
const identity = [
  { name: 'name', label: 'Name', required: true, autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
];
const phone = { name: 'phone', label: 'Phone number', type: 'tel', autoComplete: 'tel' };
const services = { name: 'services', label: 'What are you looking for?', type: 'checkboxes', options: interests, required: true };
const location = { name: 'location', label: 'Preferred location/area', required: true };
const message = { name: 'message', label: 'Message', type: 'textarea', required: true, maxLength: 4000 };

export const SERVICE_FORMS = {
  call: {
    heading: 'Request your free 10-minute introductory call',
    submit: 'Request My Free Call',
    enquiryType: 'SA introductory call request',
    success: "Thank you. We've received your request and will contact you to arrange your free 10-minute introductory call.",
    fields: [...identity, { ...phone, required: true },
      { name: 'situation', label: 'Current situation', type: 'select', required: true, options: ['Just researching', 'Starting my first SA business', 'I need a property', 'I have found a potential property', 'I already own a property', 'I already operate SA properties', 'Other'] },
      services, location, { name: 'budget', label: 'Approximate available setup/investment budget', required: true }, message],
  },
  interest: {
    heading: 'Be the first to know when our new services launch.',
    submit: 'Register My Interest',
    enquiryType: 'SA services launch interest',
    success: "Thanks for registering your interest. We'll be in touch as Agatha Living's new services become available.",
    fields: [...identity, { ...phone, label: 'Phone (optional)' }, { ...services, label: 'Service(s) interested in' }, { ...location, label: 'Location/area of interest' }, { ...message, label: 'Message (optional)', required: false }],
  },
  management: {
    heading: 'Request a Management Assessment',
    submit: 'Request Assessment',
    enquiryType: 'Property management assessment',
    success: "Thank you. We've received your assessment request and will contact you to discuss your property.",
    fields: [...identity, { ...phone, required: true },
      { name: 'property_area', label: 'Property address/area', required: true },
      { name: 'property_type', label: 'Property type', required: true },
      { name: 'bedrooms', label: 'Number of bedrooms', type: 'number', min: 0, max: 50, required: true },
      { name: 'property_status', label: 'Current property status', type: 'select', required: true, options: ['Currently operating as short-term accommodation', 'Long-term rental', 'Vacant', 'Newly purchased', 'Other'] },
      { name: 'furnished', label: 'Is the property furnished?', type: 'select', required: true, options: ['Yes', 'Partly furnished', 'No'] },
      { name: 'revenue', label: 'Current/expected monthly revenue if known (optional)' }, message],
  },
};

export function validateServiceEnquiry(kind, input) {
  if (!Object.hasOwn(SERVICE_FORMS, kind) || !input || typeof input !== 'object' || Array.isArray(input)) return { error: 'Please select a valid enquiry form.' };
  const form = SERVICE_FORMS[kind];
  const values = {};
  for (const field of form.fields) {
    const raw = input[field.name];
    if (field.type === 'checkboxes') {
      if (!Array.isArray(raw) || !raw.length || raw.length > field.options.length || raw.some(value => !field.options.includes(value))) return { error: `Please select ${field.label.toLowerCase()}.`, field: field.name };
      values[field.name] = [...new Set(raw)];
      continue;
    }
    if (raw !== undefined && typeof raw !== 'string') return { error: `Please check ${field.label.toLowerCase()}.`, field: field.name };
    const value = (raw || '').trim();
    if ((field.required && !value) || value.length > (field.maxLength || 254)
      || (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      || (field.type === 'select' && value && !field.options.includes(value))
      || (field.type === 'number' && value && (!/^\d+$/.test(value) || Number(value) < field.min || Number(value) > field.max))) return { error: `Please check ${field.label.toLowerCase()}.`, field: field.name };
    values[field.name] = value;
  }
  if (input.contact_consent !== true) return { error: 'Please agree to be contacted regarding your enquiry.', field: 'contact_consent' };
  const details = form.fields.filter(field => !['name', 'email', 'phone'].includes(field.name)).map(field => `${field.label}: ${Array.isArray(values[field.name]) ? values[field.name].join(', ') : values[field.name] || 'Not supplied'}`).join('\n');
  return { record: {
    first_name: values.name, email: values.email, phone: values.phone || null,
    enquiry_type: form.enquiryType,
    source_page: kind === 'management' ? '/services/property-management' : '/services/start-grow-sa-business',
    property: values.property_area || null,
    message: `${details}\nConsent: agreed to contact regarding this enquiry.`,
    marketing_consent: false,
  } };
}
