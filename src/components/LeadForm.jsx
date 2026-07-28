import { useState } from 'react'
import { ArrowRight, CheckCircle2, LoaderCircle } from 'lucide-react'
import { isSupabaseConfigured, supabase } from '../lib'

const initialForm = { name: '', contact: '', financing_need: '', notes: '' }

export default function LeadForm() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState({ type: 'idle', message: '' })

  const update = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const submit = async (event) => {
    event.preventDefault()
    setStatus({ type: 'loading', message: '' })

    if (!isSupabaseConfigured) {
      setStatus({ type: 'error', message: 'The form is not connected yet. Please contact the site administrator.' })
      return
    }

    try {
      const { error } = await supabase.from('leads').insert({
        name: form.name.trim(),
        contact: form.contact.trim(),
        financing_need: form.financing_need,
        notes: form.notes.trim() || null,
      })

      if (error) throw error
      setForm(initialForm)
      setStatus({ type: 'success', message: 'Thank you. Your financing request has been received.' })
    } catch (error) {
      console.error(error)
      setStatus({
        type: 'error',
        message: 'We could not submit your request. Please check your connection and try again.',
      })
    }
  }

  if (status.type === 'success') {
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={42} />
        <p className="eyebrow">REQUEST RECEIVED</p>
        <h3>We’ll review your financing need.</h3>
        <p>{status.message} A member of our team will use the contact information you provided to follow up.</p>
        <button className="button button--secondary" type="button" onClick={() => setStatus({ type: 'idle', message: '' })}>
          Submit another request
        </button>
      </div>
    )
  }

  return (
    <form className="lead-form" onSubmit={submit}>
      <div className="field-grid">
        <label>
          Full name
          <input name="name" value={form.name} onChange={update} autoComplete="name" required placeholder="Your full name" />
        </label>
        <label>
          Phone or email
          <input name="contact" value={form.contact} onChange={update} required placeholder="How should we reach you?" />
        </label>
      </div>

      <fieldset>
        <legend>What are you financing?</legend>
        <div className="radio-grid">
          {[
            ['purchase', 'Purchasing a home', 'I need financing to acquire an AFH property.'],
            ['construction_renovation', 'Construction or renovation', 'I already have a property and need capital for improvements.'],
            ['not_sure', 'Not sure yet', 'I would like help identifying the right path.'],
          ].map(([value, title, description]) => (
            <label className={`radio-card ${form.financing_need === value ? 'radio-card--selected' : ''}`} key={value}>
              <input type="radio" name="financing_need" value={value} checked={form.financing_need === value} onChange={update} required />
              <span><strong>{title}</strong><small>{description}</small></span>
            </label>
          ))}
        </div>
      </fieldset>

      <label>
        Anything else we should know? <span className="optional">Optional</span>
        <textarea name="notes" value={form.notes} onChange={update} rows="4" placeholder="Property status, project scope, approximate timing, or questions..." />
      </label>

      {status.type === 'error' && <div className="form-error" role="alert">{status.message}</div>}

      <button className="button button--primary button--wide" type="submit" disabled={status.type === 'loading'}>
        {status.type === 'loading' ? <><LoaderCircle className="spin" size={18} /> Submitting...</> : <>Check my financing options <ArrowRight size={18} /></>}
      </button>
      <p className="form-fineprint">No obligation. Your information is used only to review and respond to your financing enquiry.</p>
    </form>
  )
}
