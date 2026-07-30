import { useEffect, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import { ArrowRight, CheckCircle2, LoaderCircle } from 'lucide-react'
import PayroButton from './PayroButton'
import { isSupabaseConfigured, supabase } from '../lib'

const initialForm = {
  name: '',
  business_name: '',
  email: '',
  phone: '',
  financing_need: '',
  estimated_amount: '',
  timeline: '',
  notes: '',
}

const financingOptions = [
  [
    'purchase',
    'Purchase or acquisition financing',
    'I need financing to buy or acquire an AFH property or business.',
  ],
  [
    'construction_renovation',
    'Project, renovation, or expansion financing',
    'I already have a property and need capital for improvements.',
  ],
  [
    'payroll',
    'Payroll funding',
    'I want to cover a temporary payroll cash-flow gap.',
  ],
  [
    'not_sure',
    'Not sure yet',
    'I would like help identifying the right path.',
  ],
  [
    'other',
    'Other',
    'My need does not fit the options above.',
  ],
]

export default function LeadForm({ preset }) {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState({
    type: 'idle',
    message: '',
  })

  const radioRefs = useRef({})

  useEffect(() => {
    if (!preset?.value) return

    setForm((current) => ({
      ...current,
      financing_need: preset.value,
    }))

    const timer = setTimeout(() => {
      radioRefs.current[preset.value]?.focus()
    }, 500)

    return () => clearTimeout(timer)
  }, [preset?.token, preset?.value])

  const update = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const submit = async (event) => {
    event.preventDefault()

    setStatus({
      type: 'loading',
      message: '',
    })

    try {
      const serviceId =
        import.meta.env.VITE_EMAILJS_SERVICE_ID ||
        'service_bsw634e'

      const templateId =
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID ||
        'template_8bstl3n'

      const publicKey =
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY ||
        'MtR7BYp2uUtfnH1hc'

      const financingTitle =
        financingOptions.find(
          ([value]) => value === form.financing_need
        )?.[1] || form.financing_need

      const templateParams = {
        full_name: form.name.trim(),
        business_name:
          form.business_name.trim() || 'Not provided',
        email: form.email.trim(),
        phone_number:
          form.phone.trim() || 'Not provided',
        financing_type: financingTitle,
        estimated_amount:
          form.estimated_amount.trim() || 'Not provided',
        timeline:
          form.timeline.trim() || 'Not provided',
        message:
          form.notes.trim() || 'No message provided',
      }

      if (isSupabaseConfigured) {
        const contact = [
          form.email.trim(),
          form.phone.trim(),
        ]
          .filter(Boolean)
          .join(' / ')

        const { error: supabaseError } = await supabase
          .from('leads')
          .insert({
            name: form.name.trim(),
            business_name:
              form.business_name.trim() || null,
            email: form.email.trim(),
            phone: form.phone.trim() || null,
            contact,
            financing_need: form.financing_need,
            estimated_amount:
              form.estimated_amount.trim() || null,
            timeline:
              form.timeline.trim() || null,
            notes:
              form.notes.trim() || null,
          })

        if (supabaseError) {
          console.error(
            'Supabase submission error:',
            supabaseError
          )
        }
      }

      await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        {
          publicKey,
        }
      )

      const submittedFinancingNeed =
        form.financing_need

      setForm(initialForm)

      setStatus({
        type: 'success',
        message:
          'Thank you. Your financing request has been received.',
        financingNeed: submittedFinancingNeed,
      })
    } catch (error) {
      console.error('Lead submission error:', error)

      setStatus({
        type: 'error',
        message:
          'We could not submit your request. Please try again or contact us directly.',
      })
    }
  }

  if (status.type === 'success') {
    return (
      <div className="form-success" role="status">
        <CheckCircle2
          size={42}
          aria-hidden="true"
        />

        <p className="eyebrow">
          REQUEST RECEIVED
        </p>

        <h3>
          We’ll review your financing need.
        </h3>

        <p>
          {status.message} A member of our team
          will use the contact information you
          provided to follow up.
        </p>

        {status.financingNeed === 'payroll' && (
          <p>
            Prefer not to wait? You can also apply
            directly through the Payro Finance
            payroll-funding portal.
          </p>
        )}

        <div className="form-success__actions">
          {status.financingNeed === 'payroll' && (
            <PayroButton className="button--primary">
              Apply directly with Payro Finance
            </PayroButton>
          )}

          <button
            className="button button--secondary"
            type="button"
            onClick={() =>
              setStatus({
                type: 'idle',
                message: '',
              })
            }
          >
            Submit another request
          </button>
        </div>
      </div>
    )
  }

  return (
    <form
      className="lead-form"
      onSubmit={submit}
    >
      <div className="field-grid">
        <label>
          Full name
          <input
            name="name"
            value={form.name}
            onChange={update}
            autoComplete="name"
            required
            placeholder="Your full name"
          />
        </label>

        <label>
          Business name{' '}
          <span className="optional">
            Optional
          </span>

          <input
            name="business_name"
            value={form.business_name}
            onChange={update}
            autoComplete="organization"
            placeholder="Your AFH business name"
          />
        </label>
      </div>

      <div className="field-grid">
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={update}
            autoComplete="email"
            required
            placeholder="you@example.com"
          />
        </label>

        <label>
          Phone number{' '}
          <span className="optional">
            Optional
          </span>

          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={update}
            autoComplete="tel"
            placeholder="How can we reach you by phone?"
          />
        </label>
      </div>

      <fieldset>
        <legend>
          What are you financing?
        </legend>

        <div className="radio-grid">
          {financingOptions.map(
            ([value, title, description]) => (
              <label
                className={`radio-card ${
                  form.financing_need === value
                    ? 'radio-card--selected'
                    : ''
                }`}
                key={value}
              >
                <input
                  type="radio"
                  name="financing_need"
                  value={value}
                  checked={
                    form.financing_need === value
                  }
                  onChange={update}
                  required
                  ref={(element) => {
                    radioRefs.current[value] =
                      element
                  }}
                />

                <span>
                  <strong>{title}</strong>
                  <small>{description}</small>
                </span>
              </label>
            )
          )}
        </div>
      </fieldset>

      <div className="field-grid">
        <label>
          Estimated amount{' '}
          <span className="optional">
            Optional
          </span>

          <input
            name="estimated_amount"
            value={form.estimated_amount}
            onChange={update}
            placeholder="e.g. $50,000"
          />
        </label>

        <label>
          Timeline{' '}
          <span className="optional">
            Optional
          </span>

          <input
            name="timeline"
            value={form.timeline}
            onChange={update}
            placeholder="e.g. Within 30-60 days"
          />
        </label>
      </div>

      <label>
        Message{' '}
        <span className="optional">
          Optional
        </span>

        <textarea
          name="notes"
          value={form.notes}
          onChange={update}
          rows="4"
          placeholder="Property status, project scope, approximate timing, or questions..."
        />
      </label>

      {status.type === 'error' && (
        <div
          className="form-error"
          role="alert"
        >
          {status.message}
        </div>
      )}

      <button
        className="button button--primary button--wide"
        type="submit"
        disabled={status.type === 'loading'}
      >
        {status.type === 'loading' ? (
          <>
            <LoaderCircle
              className="spin"
              size={18}
              aria-hidden="true"
            />
            Submitting...
          </>
        ) : (
          <>
            Check my financing options
            <ArrowRight
              size={18}
              aria-hidden="true"
            />
          </>
        )}
      </button>

      <p className="form-fineprint">
        No obligation. Your information is used
        only to review and respond to your financing
        enquiry.
      </p>
    </form>
  )
}