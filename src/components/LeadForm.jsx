import { useEffect, useMemo, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import { ArrowLeft, ArrowRight, CheckCircle2, LoaderCircle } from 'lucide-react'
import PayroButton from './PayroButton'
import { isSupabaseConfigured, supabase } from '../lib'

const initialForm = {
  name: '',
  business_name: '',
  email: '',
  phone: '',
  business_status: '',
  city: '',
  state: '',
  licensed_beds: '',
  financing_need: '',
  estimated_amount: '',
  funding_needed_by: '',
  notes: '',
  property_address: '',
  purchase_price: '',
  down_payment: '',
  property_under_contract: '',
  next_payroll_date: '',
  payroll_amount_needed: '',
  annual_revenue: '',
  credit_score_range: '',
  existing_debt: '',
  documents_on_hand: [],
  referral_source: '',
  additional_info: '',
  consent: false,
}

const businessStatusOptions = [
  ['existing', 'Existing AFH'],
  ['buying', 'Buying an AFH'],
  ['starting', 'Starting a new AFH'],
  ['expanding', 'Expanding an existing AFH'],
]

const financingOptions = [
  ['purchase', 'Purchase or acquisition', 'Buying an AFH property or an existing operation.'],
  ['construction_renovation', 'Renovation or expansion', 'Improvements, additional beds, or a build-out.'],
  ['payroll', 'Payroll funding', 'Covering a short-term payroll cash-flow gap.'],
  ['working_capital', 'Working capital', 'Day-to-day operations, supplies, or reserves.'],
  ['equipment', 'Equipment financing', 'Beds, lifts, medical equipment, furnishings.'],
  ['not_sure', 'Not sure yet', 'Talk to a specialist about the right option.'],
  ['other', 'Other', 'My financing need does not fit the options above.'],
]

const fundingTimelineOptions = [
  ['asap', 'As soon as possible'],
  ['within_30_days', 'Within 30 days'],
  ['within_60_days', 'Within 60 days'],
  ['within_90_days', 'Within 90 days'],
  ['over_90_days', 'More than 90 days'],
]

const propertyContractOptions = [
  ['in_contract', 'Yes, in contract'],
  ['negotiating', 'Actively in negotiation'],
  ['identified', 'Identified, not offered'],
  ['searching', 'Still searching'],
]

const annualRevenueOptions = [
  ['under_250k', 'Under $250K'],
  ['250k_500k', '$250K – $500K'],
  ['500k_1m', '$500K – $1M'],
  ['over_1m', 'Over $1M'],
]

const creditScoreOptions = [
  ['under_600', 'Under 600'],
  ['600_649', '600 – 649'],
  ['650_699', '650 – 699'],
  ['700_749', '700 – 749'],
  ['750_plus', '750+'],
]

const existingDebtOptions = [
  ['yes', 'Yes'],
  ['no', 'No'],
]

const documentOptions = [
  ['bank_statements', 'Bank statements'],
  ['profit_loss', 'Profit & loss'],
  ['tax_returns', 'Tax returns'],
  ['payroll_reports', 'Payroll reports'],
  ['purchase_agreement', 'Purchase agreement'],
  ['property_info', 'Property info'],
  ['none_yet', 'None yet'],
]

const referralOptions = [
  ['google', 'Google Search'],
  ['referral', 'Referral'],
  ['existing_client', 'Existing Client'],
  ['accountant', 'Accountant or Bookkeeper'],
  ['social_media', 'Social Media'],
  ['payro_finance', 'Payro Finance'],
  ['other', 'Other'],
]

const stateOptions = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'], ['CA', 'California'],
  ['CO', 'Colorado'], ['CT', 'Connecticut'], ['DE', 'Delaware'], ['FL', 'Florida'], ['GA', 'Georgia'],
  ['HI', 'Hawaii'], ['ID', 'Idaho'], ['IL', 'Illinois'], ['IN', 'Indiana'], ['IA', 'Iowa'],
  ['KS', 'Kansas'], ['KY', 'Kentucky'], ['LA', 'Louisiana'], ['ME', 'Maine'], ['MD', 'Maryland'],
  ['MA', 'Massachusetts'], ['MI', 'Michigan'], ['MN', 'Minnesota'], ['MS', 'Mississippi'], ['MO', 'Missouri'],
  ['MT', 'Montana'], ['NE', 'Nebraska'], ['NV', 'Nevada'], ['NH', 'New Hampshire'], ['NJ', 'New Jersey'],
  ['NM', 'New Mexico'], ['NY', 'New York'], ['NC', 'North Carolina'], ['ND', 'North Dakota'], ['OH', 'Ohio'],
  ['OK', 'Oklahoma'], ['OR', 'Oregon'], ['PA', 'Pennsylvania'], ['RI', 'Rhode Island'], ['SC', 'South Carolina'],
  ['SD', 'South Dakota'], ['TN', 'Tennessee'], ['TX', 'Texas'], ['UT', 'Utah'], ['VT', 'Vermont'],
  ['VA', 'Virginia'], ['WA', 'Washington'], ['WV', 'West Virginia'], ['WI', 'Wisconsin'], ['WY', 'Wyoming'],
]

function getOptionLabel(options, selectedValue) {
  return options.find(([value]) => value === selectedValue)?.[1] || selectedValue || 'Not provided'
}

const STEP_DEFS = [
  { id: 'need', label: 'What you need financing for' },
  { id: 'about', label: 'About you & your business' },
  {
    id: 'property',
    label: 'The property',
    visible: (form) => form.financing_need === 'purchase' || form.financing_need === 'construction_renovation',
  },
  {
    id: 'payroll',
    label: 'Payroll details',
    visible: (form) => form.financing_need === 'payroll',
  },
  { id: 'financials', label: 'Financial snapshot' },
  { id: 'documents', label: 'Documents & submit' },
]

function stepIsValid(id, form) {
  switch (id) {
    case 'need':
      return Boolean(form.financing_need && form.estimated_amount.trim() && form.funding_needed_by)
    case 'about':
      return Boolean(form.name.trim() && form.email.trim() && form.phone.trim() && form.business_status && form.city.trim() && form.state)
    case 'property':
      return Boolean(form.property_address.trim() && form.purchase_price.trim() && form.down_payment.trim() && form.property_under_contract)
    case 'payroll':
      return Boolean(form.next_payroll_date && form.payroll_amount_needed.trim())
    case 'financials':
      return Boolean(form.annual_revenue && form.credit_score_range && form.existing_debt)
    case 'documents':
      return form.consent === true
    default:
      return true
  }
}

export default function LeadForm({ preset }) {
  const [form, setForm] = useState(initialForm)
  const [step, setStep] = useState(0)
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const [stepError, setStepError] = useState('')
  const nameInputRef = useRef(null)

  const activeSteps = useMemo(() => STEP_DEFS.filter((s) => !s.visible || s.visible(form)), [form])
  const currentIndex = Math.min(step, activeSteps.length - 1)
  const current = activeSteps[currentIndex]

  useEffect(() => {
    if (!preset?.value) return
    setForm((current) => ({ ...current, financing_need: preset.value }))
    setStep(1)
    const timer = setTimeout(() => nameInputRef.current?.focus(), 500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset?.token])

  const update = (event) => {
    const { name, value } = event.target
    setStepError('')
    setForm((current) => ({ ...current, [name]: value }))
  }

  const setField = (name, value) => {
    setStepError('')
    setForm((current) => ({ ...current, [name]: value }))
  }

  const toggleDocument = (value) => {
    setForm((current) => ({
      ...current,
      documents_on_hand: current.documents_on_hand.includes(value)
        ? current.documents_on_hand.filter((v) => v !== value)
        : [...current.documents_on_hand, value],
    }))
  }

  const isPropertyFinancing = form.financing_need === 'purchase' || form.financing_need === 'construction_renovation'
  const isPayrollFinancing = form.financing_need === 'payroll'

  const goNext = () => {
    if (!stepIsValid(current.id, form)) {
      setStepError('Please complete the required fields before continuing.')
      return
    }
    setStepError('')
    setStep((i) => Math.min(i + 1, activeSteps.length - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goBack = () => {
    setStepError('')
    setStep((i) => Math.max(i - 1, 0))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const jumpTo = (index) => {
    if (index < currentIndex) {
      setStepError('')
      setStep(index)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const submit = async (event) => {
    event.preventDefault()
    if (!stepIsValid(current.id, form)) {
      setStepError('Please complete the required fields before submitting.')
      return
    }

    setStatus({ type: 'loading', message: '' })

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey) {
      setStatus({ type: 'error', message: 'Email notifications are not configured. Please contact the site administrator.' })
      return
    }

    try {
      const financingTitle = getOptionLabel(financingOptions, form.financing_need)
      const businessStatusTitle = getOptionLabel(businessStatusOptions, form.business_status)
      const fundingTimelineTitle = getOptionLabel(fundingTimelineOptions, form.funding_needed_by)
      const referralTitle = getOptionLabel(referralOptions, form.referral_source)
      const propertyContractTitle = getOptionLabel(propertyContractOptions, form.property_under_contract)
      const annualRevenueTitle = getOptionLabel(annualRevenueOptions, form.annual_revenue)
      const creditScoreTitle = getOptionLabel(creditScoreOptions, form.credit_score_range)
      const documentsTitle = form.documents_on_hand.length
        ? form.documents_on_hand.map((value) => getOptionLabel(documentOptions, value)).join(', ')
        : 'None provided'

      const templateParams = {
        full_name: form.name.trim(),
        business_name: form.business_name.trim() || 'Not provided',
        email: form.email.trim(),
        phone_number: form.phone.trim(),
        business_status: businessStatusTitle,
        city: form.city.trim() || 'Not provided',
        state: form.state || 'Not provided',
        licensed_beds: form.licensed_beds || 'Not provided',
        financing_type: financingTitle,
        amount_requested: form.estimated_amount.trim(),
        funding_needed_by: fundingTimelineTitle,
        message: form.notes.trim() || 'No description provided',
        property_address: isPropertyFinancing ? form.property_address || 'Not provided' : 'Not applicable',
        purchase_price: isPropertyFinancing ? form.purchase_price || 'Not provided' : 'Not applicable',
        down_payment: isPropertyFinancing ? form.down_payment || 'Not provided' : 'Not applicable',
        property_under_contract: isPropertyFinancing ? propertyContractTitle : 'Not applicable',
        next_payroll_date: isPayrollFinancing ? form.next_payroll_date || 'Not provided' : 'Not applicable',
        payroll_amount_needed: isPayrollFinancing ? form.payroll_amount_needed.trim() || 'Not provided' : 'Not applicable',
        annual_revenue: annualRevenueTitle,
        credit_score_range: creditScoreTitle,
        existing_debt: form.existing_debt === 'yes' ? 'Yes' : form.existing_debt === 'no' ? 'No' : 'Not provided',
        documents_on_hand: documentsTitle,
        referral_source: referralTitle,
        additional_info: form.additional_info.trim() || 'None provided',
      }

      if (isSupabaseConfigured) {
        const contact = [form.email.trim(), form.phone.trim()].filter(Boolean).join(' / ')
        const { error } = await supabase.from('leads').insert({
          name: form.name.trim(),
          business_name: form.business_name.trim() || null,
          email: form.email.trim(),
          phone: form.phone.trim(),
          contact,
          business_status: form.business_status,
          city: form.city.trim() || null,
          state: form.state || null,
          licensed_beds: form.licensed_beds ? Number(form.licensed_beds) : null,
          financing_need: form.financing_need,
          estimated_amount: form.estimated_amount.trim(),
          timeline: form.funding_needed_by,
          notes: form.notes.trim() || null,
          property_address: isPropertyFinancing ? form.property_address.trim() || null : null,
          purchase_price: isPropertyFinancing ? form.purchase_price.trim() || null : null,
          down_payment: isPropertyFinancing ? form.down_payment.trim() || null : null,
          property_under_contract: isPropertyFinancing ? form.property_under_contract || null : null,
          next_payroll_date: isPayrollFinancing ? form.next_payroll_date || null : null,
          payroll_amount_needed: isPayrollFinancing ? form.payroll_amount_needed.trim() || null : null,
          annual_revenue: form.annual_revenue || null,
          credit_score_range: form.credit_score_range || null,
          existing_debt: form.existing_debt || null,
          documents_on_hand: form.documents_on_hand.length ? form.documents_on_hand : null,
          referral_source: form.referral_source || null,
          additional_info: form.additional_info.trim() || null,
          consent: form.consent,
        })

        if (error) throw new Error(`Supabase error: ${error.message}`)
      }

      await emailjs.send(serviceId, templateId, templateParams, { publicKey })

      const submittedFinancingNeed = form.financing_need
      setForm(initialForm)
      setStep(0)
      setStatus({
        type: 'success',
        message: 'Thank you. Your financing request has been received.',
        financingNeed: submittedFinancingNeed,
      })
    } catch (error) {
      console.error('Submission error:', error)
      setStatus({ type: 'error', message: 'We could not submit your request. Please check your information and try again.' })
    }
  }

  if (status.type === 'success') {
    return (
      <div className="wizard">
        <div className="form-success" role="status">
          <CheckCircle2 size={42} aria-hidden="true" />
          <p className="eyebrow">REQUEST RECEIVED</p>
          <h3>We’ll review your financing need.</h3>
          <p>{status.message} A member of our team will use the contact information you provided to follow up.</p>
          {status.financingNeed === 'payroll' && (
            <p>You can also apply directly through the Payro Finance payroll-funding portal.</p>
          )}
          <div className="form-success__actions">
            {status.financingNeed === 'payroll' && (
              <PayroButton className="button--primary">Apply directly with Payro Finance</PayroButton>
            )}
            <button className="button button--secondary" type="button" onClick={() => setStatus({ type: 'idle', message: '' })}>
              Submit another request
            </button>
          </div>
        </div>
      </div>
    )
  }

  const isLastStep = currentIndex === activeSteps.length - 1
  const minutesLeft = Math.max(1, activeSteps.length - currentIndex)

  return (
    <div className="wizard">
      <aside className="wizard__sidebar">
        <p className="eyebrow">FINANCING APPLICATION</p>
        <h2>Capital for the homes that provide care.</h2>
        <p>A short application. A real reviewer looks at every submission — usually within one business day.</p>

        <ol className="stepper">
          {activeSteps.map((s, index) => (
            <li
              key={s.id}
              className={`stepper__item ${index === currentIndex ? 'stepper__item--active' : ''} ${index < currentIndex ? 'stepper__item--done stepper__item--clickable' : ''}`}
              onClick={() => jumpTo(index)}
            >
              <span className="stepper__num">{index + 1}</span>
              <span className="stepper__label">{s.label}</span>
            </li>
          ))}
        </ol>
      </aside>

      <form className="wizard__panel" onSubmit={isLastStep ? submit : (e) => { e.preventDefault(); goNext() }}>
        <div className="wizard__top-meta">
          <span>Step {String(currentIndex + 1).padStart(2, '0')} of {String(activeSteps.length).padStart(2, '0')}</span>
          <strong>{isLastStep ? 'Almost done' : `About ${minutesLeft} min left`}</strong>
        </div>

        {current.id === 'need' && (
          <>
            <h3 className="wizard__step-title">Tell us what you're financing.</h3>
            <p className="wizard__step-desc">Pick the closest match — we'll tailor the rest of the questions to it.</p>

            <div className="option-cards">
              {financingOptions.map(([value, title, description]) => (
                <button
                  type="button"
                  key={value}
                  className={`option-card ${form.financing_need === value ? 'option-card--selected' : ''}`}
                  aria-pressed={form.financing_need === value}
                  onClick={() => setField('financing_need', value)}
                >
                  <span className="option-card__head">
                    <span className="option-card__title">{title}</span>
                    <span className="option-card__mark" />
                  </span>
                  <span className="option-card__desc">{description}</span>
                </button>
              ))}
            </div>

            <div className="field-grid" style={{ marginTop: 26 }}>
              <label>
                Amount requested
                <div className="field-currency">
                  <span className="prefix">$</span>
                  <input name="estimated_amount" value={form.estimated_amount} onChange={update} inputMode="decimal" placeholder="250,000" />
                </div>
              </label>
              <label>
                Funding needed by
                <select name="funding_needed_by" value={form.funding_needed_by} onChange={update}>
                  <option value="">Select a timeline</option>
                  {fundingTimelineOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
            </div>

            <label style={{ marginTop: 20, display: 'block' }}>
              How the funds will be used <span className="optional">Optional</span>
              <textarea name="notes" value={form.notes} onChange={update} rows="3" placeholder="A sentence or two helps us route your request to the right specialist." />
            </label>
          </>
        )}

        {current.id === 'about' && (
          <>
            <h3 className="wizard__step-title">A little about you.</h3>
            <p className="wizard__step-desc">The essentials so we can reach you and understand where your operation stands today.</p>

            <div className="field-grid">
              <label>
                Full name
                <input name="name" value={form.name} onChange={update} autoComplete="name" placeholder="Your full name" ref={nameInputRef} />
              </label>
              <label>
                Business name <span className="optional">Optional</span>
                <input name="business_name" value={form.business_name} onChange={update} autoComplete="organization" placeholder="Your AFH business name" />
              </label>
            </div>

            <div className="field-grid">
              <label>
                Email
                <input type="email" name="email" value={form.email} onChange={update} autoComplete="email" placeholder="you@example.com" />
              </label>
              <label>
                Phone
                <input type="tel" name="phone" value={form.phone} onChange={update} autoComplete="tel" placeholder="(555) 000-0000" />
              </label>
            </div>

            <div className="field-grid">
              <label>
                Business status
                <select name="business_status" value={form.business_status} onChange={update}>
                  <option value="">Select your business status</option>
                  {businessStatusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <label>
                Licensed beds <span className="optional">Optional</span>
                <input type="number" name="licensed_beds" value={form.licensed_beds} onChange={update} placeholder="6" />
              </label>
            </div>

            <div className="field-grid">
              <label>
                City
                <input name="city" value={form.city} onChange={update} autoComplete="address-level2" placeholder="City" />
              </label>
              <label>
                State
                <select name="state" value={form.state} onChange={update} autoComplete="address-level1">
                  <option value="">Select state</option>
                  {stateOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
            </div>
          </>
        )}

        {current.id === 'property' && (
          <>
            <h3 className="wizard__step-title">The property.</h3>
            <p className="wizard__step-desc">Because you selected purchase or renovation financing, we'd like a few property details. Rough answers are fine.</p>

            <label style={{ display: 'block' }}>
              Property address or target city
              <input name="property_address" value={form.property_address} onChange={update} placeholder="1420 Pine St, Tacoma WA — or 'looking in Pierce County'" />
            </label>

            <div className="field-grid" style={{ marginTop: 20 }}>
              <label>
                Purchase price
                <div className="field-currency">
                  <span className="prefix">$</span>
                  <input name="purchase_price" value={form.purchase_price} onChange={update} inputMode="decimal" placeholder="850,000" />
                </div>
              </label>
              <label>
                Down payment available
                <div className="field-currency">
                  <span className="prefix">$</span>
                  <input name="down_payment" value={form.down_payment} onChange={update} inputMode="decimal" placeholder="170,000" />
                </div>
              </label>
            </div>

            <fieldset style={{ marginTop: 20 }}>
              <legend>Is the property under contract?</legend>
              <div className="chip-group">
                {propertyContractOptions.map(([value, label]) => (
                  <button
                    type="button"
                    key={value}
                    className={`chip ${form.property_under_contract === value ? 'chip--on' : ''}`}
                    aria-pressed={form.property_under_contract === value}
                    onClick={() => setField('property_under_contract', value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>
          </>
        )}

        {current.id === 'payroll' && (
          <>
            <h3 className="wizard__step-title">Payroll details.</h3>
            <p className="wizard__step-desc">A couple of specifics so we can match the right payroll-funding option.</p>

            <div className="field-grid">
              <label>
                Next payroll date
                <input type="date" name="next_payroll_date" value={form.next_payroll_date} onChange={update} />
              </label>
              <label>
                Payroll amount needed
                <div className="field-currency">
                  <span className="prefix">$</span>
                  <input name="payroll_amount_needed" value={form.payroll_amount_needed} onChange={update} inputMode="decimal" placeholder="15,000" />
                </div>
              </label>
            </div>
          </>
        )}

        {current.id === 'financials' && (
          <>
            <h3 className="wizard__step-title">A financial snapshot.</h3>
            <p className="wizard__step-desc">Rough ranges only. Precise numbers come later, once we've confirmed you're a fit.</p>

            <fieldset>
              <legend>Annual revenue</legend>
              <div className="chip-group">
                {annualRevenueOptions.map(([value, label]) => (
                  <button type="button" key={value} className={`chip ${form.annual_revenue === value ? 'chip--on' : ''}`} aria-pressed={form.annual_revenue === value} onClick={() => setField('annual_revenue', value)}>
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset style={{ marginTop: 22 }}>
              <legend>Credit score range</legend>
              <div className="chip-group">
                {creditScoreOptions.map(([value, label]) => (
                  <button type="button" key={value} className={`chip ${form.credit_score_range === value ? 'chip--on' : ''}`} aria-pressed={form.credit_score_range === value} onClick={() => setField('credit_score_range', value)}>
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset style={{ marginTop: 22 }}>
              <legend>Any existing business debt?</legend>
              <div className="chip-group">
                {existingDebtOptions.map(([value, label]) => (
                  <button type="button" key={value} className={`chip ${form.existing_debt === value ? 'chip--on' : ''}`} aria-pressed={form.existing_debt === value} onClick={() => setField('existing_debt', value)}>
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>
          </>
        )}

        {current.id === 'documents' && (
          <>
            <h3 className="wizard__step-title">What do you have ready?</h3>
            <p className="wizard__step-desc">Select whatever you can put your hands on. Missing something is fine — we'll help you gather it after review.</p>

            <fieldset>
              <legend>Documents on hand <span className="optional">Optional</span></legend>
              <div className="chip-group">
                {documentOptions.map(([value, label]) => (
                  <button type="button" key={value} className={`chip ${form.documents_on_hand.includes(value) ? 'chip--on' : ''}`} aria-pressed={form.documents_on_hand.includes(value)} onClick={() => toggleDocument(value)}>
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>

            <label style={{ marginTop: 22, display: 'block' }}>
              How did you hear about us? <span className="optional">Optional</span>
              <select name="referral_source" value={form.referral_source} onChange={update}>
                <option value="">Select an option</option>
                {referralOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>

            <label style={{ marginTop: 20, display: 'block' }}>
              Anything else we should know? <span className="optional">Optional</span>
              <textarea name="additional_info" value={form.additional_info} onChange={update} rows="3" placeholder="Context, timing constraints, or questions." />
            </label>

            <div className="consent-box">
              <input type="checkbox" id="consent" checked={form.consent} onChange={(e) => setField('consent', e.target.checked)} />
              <label htmlFor="consent">I agree to be contacted about my financing request and understand that submitting this form does not guarantee financing.</label>
            </div>
          </>
        )}

        {stepError && <div className="form-error" role="alert">{stepError}</div>}
        {status.type === 'error' && <div className="form-error" role="alert">{status.message}</div>}

        <div className="wizard__nav">
          <button type="button" className="button button--ghost" onClick={goBack} disabled={currentIndex === 0}>
            <ArrowLeft size={16} aria-hidden="true" /> Back
          </button>
          <button className="button button--primary" type="submit" disabled={status.type === 'loading'}>
            {status.type === 'loading' ? (
              <><LoaderCircle className="spin" size={18} aria-hidden="true" /> Submitting...</>
            ) : isLastStep ? (
              <>Submit application <ArrowRight size={18} aria-hidden="true" /></>
            ) : (
              <>Continue <ArrowRight size={18} aria-hidden="true" /></>
            )}
          </button>
        </div>

        <p className="form-fineprint">No obligation. We’ll review your information and contact you regarding available financing options.</p>
      </form>
    </div>
  )
}
