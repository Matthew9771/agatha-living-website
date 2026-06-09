import { supabaseAdmin } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    first_name,
    last_name,
    email,
    phone,
    enquiry_type = 'General enquiry',
    source_page,
    message,
    marketing_consent,
    property,
    check_in,
    check_out,
    guests,
    nights,
    total,
  } = req.body || {};

  if (!first_name || !email) {
    return res.status(400).json({ error: 'first_name and email are required.' });
  }

  const record = {
    first_name,
    last_name: last_name || null,
    email,
    phone: phone || null,
    enquiry_type,
    source_page: source_page || null,
    message: message || null,
    marketing_consent: marketing_consent === true || marketing_consent === 'true' || marketing_consent === 'on',
    property: property || null,
    check_in: check_in || null,
    check_out: check_out || null,
    guests: guests || null,
    nights: nights || null,
    total: total || null,
    status: 'new',
  };

  const { error } = await supabaseAdmin.from('leads').insert([record]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
}
