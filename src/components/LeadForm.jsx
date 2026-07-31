import { useEffect, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import {
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
} from 'lucide-react'
import PayroButton from './PayroButton'
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
  financing_need: '',
  property_under_contract: '',
  next_payroll_date: '',
  payroll_amount_needed: '',
}

const businessStatusOptions = [
  ['existing', 'Existing AFH'],
  ['buying', 'Buying an AFH'],
  ['starting', 'Starting a new AFH'],
  ['expanding', 'Expanding an existing AFH'],
]

const financingOptions = [
  [
    'purchase',
    'Purchase or acquisition financing',
    'I need financing to buy or acquire an AFH property or business.',
  ],
  [
    'construction_renovation',
    'Renovation or expansion financing',
    'I need capital for improvements, renovations, or expansion.',
  ],
  [
    'payroll',
    'Payroll funding',
    'I need help covering a temporary payroll cash-flow gap.',
  ],
  [
    'working_capital',
    'Working capital',
    'I need funds for day-to-day business operations.',
  ],
  [
    'equipment',
    'Equipment financing',
    'I need financing for business equipment or furnishings.',
  ],
  [
    'not_sure',
    'Not sure yet',
    'I would like help identifying the right financing option.',
  ],
  [
    'other',
    'Other',
    'My financing need does not fit the options above.',
  ],
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
    options.find(
      ([value]) => value === selectedValue
    )?.[1] ||
    selectedValue ||
    'Not provided'
  )
}

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

  const isPropertyFinancing =
    form.financing_need === 'purchase' ||
    form.financing_need ===
      'construction_renovation'

  const isPayrollFinancing =
    form.financing_need === 'payroll'

  const submit = async (event) => {
    event.preventDefault()

    setStatus({
      type: 'loading',
      message: '',
    })

    const serviceId =
      import.meta.env.VITE_EMAILJS_SERVICE_ID

    const templateId =
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID

    const publicKey =
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey) {
      setStatus({
        type: 'error',
        message:
          'Email notifications are not configured. Please contact the site administrator.',
      })

      return
    }

    try {
      const financingTitle = getOptionLabel(
        financingOptions,
        form.financing_need
      )

      const businessStatusTitle = getOptionLabel(
        businessStatusOptions,
        form.business_status
      )

      const templateParams = {
        full_name: form.name.trim(),
        email: form.email.trim(),
        phone_number: form.phone.trim(),

        business_status: businessStatusTitle,
        city: form.city.trim() || 'Not provided',
        state: form.state || 'Not provided',

        financing_type: financingTitle,

        property_under_contract:
          isPropertyFinancing
            ? form.property_under_contract ||
              'Not provided'
            : 'Not applicable',

        next_payroll_date:
          isPayrollFinancing
            ? form.next_payroll_date ||
              'Not provided'
            : 'Not applicable',

        payroll_amount_needed:
          isPayrollFinancing
            ? form.payroll_amount_needed.trim() ||
              'Not provided'
            : 'Not applicable',
      }

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

            business_status:
              form.business_status,
            city: form.city.trim() || null,
            state: form.state || null,

            financing_need:
              form.financing_need,

            property_under_contract:
              isPropertyFinancing
                ? form.property_under_contract ||
                  null
                : null,

            next_payroll_date:
              isPayrollFinancing
                ? form.next_payroll_date || null
                : null,

            payroll_amount_needed:
              isPayrollFinancing
                ? form.payroll_amount_needed.trim() ||
                  null
                : null,
          })

        if (error) {
          throw new Error(
            `Supabase error: ${error.message}`
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
        financingNeed:
          submittedFinancingNeed,
      })
    } catch (error) {
      console.error('Submission error:', error)

      setStatus({
        type: 'error',
        message:
          'We could not submit your request. Please check your information and try again.',
      })
    }
  }

  if (status.type === 'success') {
    return (
      <div
        className="form-success"
        role="status"
      >
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
            You can also apply directly through
            the Payro Finance payroll-funding
            portal.
          </p>
        )}

        <div className="form-success__actions">
          {status.financingNeed ===
            'payroll' && (
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
      <div className="lead-form__group">
        <p className="eyebrow">
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
            <option value="">
              Select your business status
            </option>

            {businessStatusOptions.map(
              ([value, label]) => (
                <option
                  key={value}
                  value={value}
                >
                  {label}
                </option>
              )
            )}
          </select>
        </label>

        <div className="field-grid">
          <label>
            City{' '}
            <span className="optional">
              Optional
            </span>

            <input
              name="city"
              value={form.city}
              onChange={update}
              autoComplete="address-level2"
              placeholder="City"
            />
          </label>

          <label>
            State{' '}
            <span className="optional">
              Optional
            </span>

            <select
              name="state"
              value={form.state}
              onChange={update}
              autoComplete="address-level1"
            >
              <option value="">
                Select state
              </option>

              {stateOptions.map(
                ([value, label]) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {label}
                  </option>
                )
              )}
            </select>
          </label>
        </div>
      </div>

      <div className="lead-form__group">
        <p className="eyebrow">
          FINANCING REQUEST
        </p>

        <fieldset>
          <legend>
            What are you financing?
          </legend>

          <div className="radio-grid">
            {financingOptions.map(
              ([
                value,
                title,
                description,
              ]) => (
                <label
                  className={`radio-card ${
                    form.financing_need ===
                    value
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
                      form.financing_need ===
                      value
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
      </div>

      {isPropertyFinancing && (
        <div className="lead-form__group">
          <p className="eyebrow">
            PROPERTY INFORMATION
          </p>

          <fieldset>
            <legend>
              Is the property under contract?
            </legend>

            <div className="radio-grid">
              {['Yes', 'No'].map(
                (value) => (
                  <label
                    className={`radio-card ${
                      form.property_under_contract ===
                      value
                        ? 'radio-card--selected'
                        : ''
                    }`}
                    key={value}
                  >
                    <input
                      type="radio"
                      name="property_under_contract"
                      value={value}
                      checked={
                        form.property_under_contract ===
                        value
                      }
                      onChange={update}
                      required
                    />

                    <span>
                      <strong>{value}</strong>
                    </span>
                  </label>
                )
              )}
            </div>
          </fieldset>
        </div>
      )}

      {isPayrollFinancing && (
        <div className="lead-form__group">
          <p className="eyebrow">
            PAYROLL INFORMATION
          </p>

          <div className="field-grid">
            <label>
              Next payroll date
              <input
                type="date"
                name="next_payroll_date"
                value={form.next_payroll_date}
                onChange={update}
                required
              />
            </label>

            <label>
              Payroll amount needed
              <input
                name="payroll_amount_needed"
                value={
                  form.payroll_amount_needed
                }
                onChange={update}
                inputMode="decimal"
                required
                placeholder="e.g. $15,000"
              />
            </label>
          </div>
        </div>
      )}

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
        No obligation. We’ll review your
        information and contact you regarding
        available financing options.
      </p>
    </form>
  )
}