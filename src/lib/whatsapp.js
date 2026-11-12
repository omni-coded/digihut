import { config, hasWhatsApp } from '../config';

/** Returns a wa.me link for the configured number, or null when no number is set. */
export function whatsappUrl(message = '') {
  if (!hasWhatsApp) return null;
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${config.whatsappNumber}${text}`;
}

/** Builds a readable WhatsApp message from labelled lines, skipping empty values. */
export function composeMessage(intro, lines = []) {
  const body = lines
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '')
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n');
  return body ? `${intro}\n\n${body}` : intro;
}
