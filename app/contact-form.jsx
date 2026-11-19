'use client';

import { useState } from 'react';

// No route handler, server action or API key: the form posts straight to FormTango.
// Replace YOUR_FORM_ID with your form's id from https://formtango.com
const ENDPOINT = 'https://formtango.com/f/YOUR_FORM_ID';

export function ContactForm() {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  async function send(event) {
    event.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const response = await fetch(ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(event.currentTarget) });
      const result = await response.json();
      if (!result.ok) throw new Error(result.error || 'Something went wrong.');
      setStatus('sent');
    } catch (e) {
      setError(e.message);
      setStatus('idle');
    }
  }

  if (status === 'sent') return <p>Thanks! We got your message.</p>;

  return (
    <form onSubmit={send}>
      <label>
        Email <input type="email" name="email" required />
      </label>
      <label>
        Message <textarea name="message" required />
      </label>
      {/* Spam trap: leave this hidden and empty */}
      <input type="text" name="_gotcha" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
      <button disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send'}</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
