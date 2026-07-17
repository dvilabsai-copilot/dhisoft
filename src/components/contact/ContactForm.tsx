'use client';

import { FormEvent, useState } from 'react';

type FormState = 'idle' | 'pending' | 'success' | 'error';
const initialValues = { name: '', email: '', phone: '', company: '', message: '', website: '' };

export default function ContactForm({ endpoint }: { endpoint: string }) {
  const [values, setValues] = useState(initialValues);
  const [state, setState] = useState<FormState>('idle');
  const [error, setError] = useState('');
  function update(field: keyof typeof initialValues, value: string) { setValues((current) => ({ ...current, [field]: value })); if (state !== 'idle') setState('idle'); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!values.name.trim() || !/^\S+@\S+\.\S+$/.test(values.email) || values.message.trim().length < 10) { setError('Please provide your name, a valid email, and a message of at least 10 characters.'); setState('error'); return; }
    setState('pending'); setError(''); const controller = new AbortController(); const timeout = window.setTimeout(() => controller.abort(), 7000);
    try { const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values), signal: controller.signal }); if (!response.ok) throw new Error('The enquiry could not be saved. Please try again.'); setValues(initialValues); setState('success'); }
    catch (cause) { setError(cause instanceof Error && cause.name === 'AbortError' ? 'The request timed out. Please try again.' : cause instanceof Error ? cause.message : 'The enquiry could not be saved. Please try again.'); setState('error'); }
    finally { window.clearTimeout(timeout); }
  }
  const disabled = state === 'pending';
  return <form onSubmit={submit} className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm" aria-describedby="contact-form-status">
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-medium text-slate-700">Name<input required value={values.name} onChange={(event) => update('name', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5" /></label>
      <label className="text-sm font-medium text-slate-700">Email<input required type="email" value={values.email} onChange={(event) => update('email', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5" /></label>
      <label className="text-sm font-medium text-slate-700">Phone (optional)<input value={values.phone} onChange={(event) => update('phone', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5" /></label>
      <label className="text-sm font-medium text-slate-700">Company (optional)<input value={values.company} onChange={(event) => update('company', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5" /></label>
    </div>
    <label className="mt-4 block text-sm font-medium text-slate-700">Project enquiry<textarea required minLength={10} rows={4} value={values.message} onChange={(event) => update('message', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5" /></label>
    <label className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => update('website', event.target.value)} /></label>
    <div className="mt-4 flex flex-wrap items-center gap-4"><button type="submit" disabled={disabled} className="rounded-full bg-slate-950 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">{disabled ? 'Saving…' : 'Send enquiry'}</button><p id="contact-form-status" role="status" aria-live="polite" className="text-sm text-slate-600">{state === 'success' ? 'Thanks — your enquiry was saved. We will be in touch.' : state === 'error' ? error : 'We store your enquiry so our team can follow up.'}</p></div>
  </form>;
}
