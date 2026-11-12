/** Normalises an Indian mobile number to 10 digits, or returns '' if it cannot. */
export function normalisePhone(value) {
  let digits = String(value || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return digits;
}

export function isValidIndianMobile(value) {
  return /^[6-9]\d{9}$/.test(normalisePhone(value));
}

/**
 * Validates the contact form. `mode` is 'enquiry' (full form) or 'callback'
 * (only name and phone are needed). Returns an object of error keys.
 */
export function validateLead(values, mode = 'enquiry') {
  const errors = {};
  const name = (values.name || '').trim();
  if (name.length < 2 || name.length > 120 || /[<>]/.test(name)) errors.name = 'name';
  if (!isValidIndianMobile(values.phone)) errors.phone = 'phone';
  if (mode === 'enquiry') {
    if (!values.category) errors.category = 'category';
    if ((values.message || '').length > 1000) errors.message = 'message';
  }
  return errors;
}
