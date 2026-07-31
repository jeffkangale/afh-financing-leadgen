import { useState } from 'react'
import emailjs from '@emailjs/browser'
import {
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
} from 'lucide-react'
import {
  isSupabaseConfigured,
  supabase,
} from '../lib'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  business_status: '',
  city: '',
  state: '',
  message: '',
}

const businessStatusOptions = [
  ['existing', 'Existing AFH'],
  ['buying', 'Buying an AFH'],
  ['starting', 'Starting a new AFH'],
  ['expanding', 'Expanding an existing AFH'],
]

const stateOptions = [
  ['AL', 'Alabama'],
  ['AK', 'Alaska'],
  ['AZ', 'Arizona'],
  ['AR', 'Arkansas'],
  ['CA', 'California'],
  ['CO', 'Colorado'],
  ['CT', 'Connecticut'],
  ['DE', 'Delaware'],
  ['FL', 'Florida'],
  ['GA', 'Georgia'],
  ['HI', 'Hawaii'],
  ['ID', 'Idaho'],
  ['IL', 'Illinois'],
  ['IN', 'Indiana'],
  ['IA', 'Iowa'],
  ['KS', 'Kansas'],
  ['KY', 'Kentucky'],
  ['LA', 'Louisiana'],
  ['ME', 'Maine'],
  ['MD', 'Maryland'],
  ['MA', 'Massachusetts'],
  ['MI', 'Michigan'],
  ['MN', 'Minnesota'],
  ['MS', 'Mississippi'],
  ['MO', 'Missouri'],
  ['MT', 'Montana'],
  ['NE', 'Nebraska'],
  ['NV', 'Nevada'],
  ['NH', 'New Hampshire'],
  ['NJ', 'New Jersey'],
  ['NM', 'New Mexico'],
  ['NY', 'New York'],
  ['NC', 'North Carolina'],
  ['ND', 'North Dakota'],
  ['OH', 'Ohio'],
  ['OK', 'Oklahoma'],
  ['OR', 'Oregon'],
  ['PA', 'Pennsylvania'],
  ['RI', 'Rhode Island'],
  ['SC', 'South Carolina'],
  ['SD', 'South Dakota'],
  ['TN', 'Tennessee'],
  ['TX', 'Texas'],
  ['UT', 'Utah'],
  ['VT', 'Vermont'],
  ['VA', 'Virginia'],
  ['WA', 'Washington'],
  ['WV', 'West Virginia'],
  ['WI', 'Wisconsin'],
  ['WY', 'Wyoming'],
]

function getOptionLabel(options, selectedValue) {
  return (
    options.find(([value]) => value === selectedValue)?.[1] ||
    selectedValue ||
    'Not provided'
  )
}

export default function LeadForm() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState({
    type: 'idle',
    message: '',
  })

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

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    const emailJsConfigured = Boolean(
      serviceId && templateId && publicKey
    )

    if (!isSupabaseConfigured && !emailJsConfigured) {
      setStatus({
        type: 'error',
        message:
          'The form is not configured yet. Please contact the site administrator.',
      })
      return
    }

    const businessStatusTitle = getOptionLabel(
      businessStatusOptions,
      form.business_status
    )

    const stateTitle = form.state
      ? getOptionLabel(stateOptions, form.state)
      : 'Not provided'

    const templateParams = {
      full_name: form.name.trim(),
      email: form.email.trim(),
      phone_number: form.phone.trim(),
      business_status: businessStatusTitle,
      city: form.city.trim() || 'Not provided',
      state: stateTitle,
      message: form.message.trim(),
    }

    try {
      let leadStored = false

      if (isSupabaseConfigured) {
        const contact = [
          form.email.trim(),
          form.phone.trim(),
        ]
          .filter(Boolean)
          .join(' / ')

        const { error } = await supabase
          .from('leads')
          .insert({
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            contact,
            business_status: form.business_status,
            city: form.city.trim() || null,
            state: form.state || null,
            notes: form.message.trim() || null,
          })

        if (error) {
          throw new Error(`Supabase error: ${error.message}`)
        }

        leadStored = true
      }

      if (emailJsConfigured) {
        try {
          await emailjs.send(
            serviceId,
            templateId,
            templateParams,
            { publicKey }
          )
        } catch (emailError) {
          console.error('EmailJS notification failed:', {
            status: emailError?.status,
            text: emailError?.text,
            message: emailError?.message,
            error: emailError,
          })

          if (!leadStored) {
            throw emailError
          }
        }
      }

      setForm(initialForm)

      setStatus({
        type: 'success',
        message:
          'Thank you. Your financing request has been received.',
      })
    } catch (error) {
      console.error('Submission failed:', {
        status: error?.status,
        text: error?.text,
        message: error?.message,
        error,
      })

      setStatus({
        type: 'error',
        message:
          error?.text ||
          error?.message ||
          'We could not submit your request. Please try again.',
      })
    }
  }

  if (status.type === 'success') {
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={42} aria-hidden="true" />

        <p className="eyebrow">REQUEST RECEIVED</p>

        <h3>We’ll review your financing request.</h3>

        <p>
          {status.message} A member of our team will use the
          contact information you provided to follow up.
        </p>

        <div className="form-success__actions">
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
    <form className="lead-form" onSubmit={submit}>
      <div className="lead-form__group">
        <p className="eyebrow">
          <span className="lead-form__group-num">1</span>
          CONTACT INFORMATION
        </p>

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
        </div>

        <label>
          Phone number
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={update}
            autoComplete="tel"
            required
            placeholder="Your phone number"
          />
        </label>
      </div>

      <div className="lead-form__group">
        <p className="eyebrow">
          <span className="lead-form__group-num">2</span>
          BUSINESS INFORMATION
        </p>

        <label>
          Business status
          <select
            name="business_status"
            value={form.business_status}
            onChange={update}
            required
          >
            <option value="">Select your business status</option>

            {businessStatusOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <div className="field-grid">
          <label>
            City <span className="optional">Optional</span>
            <input
              name="city"
              value={form.city}
              onChange={update}
              autoComplete="address-level2"
              placeholder="City"
            />
          </label>

          <label>
            State <span className="optional">Optional</span>
            <select
              name="state"
              value={form.state}
              onChange={update}
              autoComplete="address-level1"
            >
              <option value="">Select state</option>

              {stateOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="lead-form__group">
        <p className="eyebrow">
          <span className="lead-form__group-num">3</span>
          HOW THE FUNDS WILL BE USED
        </p>

        <label>
          Tell us how you plan to use the funds
          <textarea
            name="message"
            value={form.message}
            onChange={update}
            required
            rows={6}
            placeholder="Describe how the financing will be used."
          />
        </label>
      </div>

      {status.type === 'error' && (
        <div className="form-error" role="alert">
          {status.message}
        </div>
      )}

      <div className="lead-form__footer">
        <p>
          Your information is kept confidential by CareBearBooks
          Accounting and used only to discuss available financing
          options.
        </p>

        <button
          className="button button--primary"
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
              Continue
              <ArrowRight size={18} aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </form>
  )
}