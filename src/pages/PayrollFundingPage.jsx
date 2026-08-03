import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import PayroButton from '../components/PayroButton'

const payrollBenefits = [
  'No cost to apply',
  'No cost to keep an approved line available',
  'No hard credit pull during the initial application process',
  'Unsecured funding',
  'No collateral',
  'No personal guarantee',
  'No UCC filing',
  'Use the credit line only when needed',
  'Application typically takes approximately 5–7 minutes',
]

export default function PayrollFundingPage() {
  return (
    <section className="financing-detail section" id="payroll-funding">
      <div className="section-heading">
        <p className="eyebrow">PAYROLL FUNDING</p>
        <h2>A backup funding option for payroll.</h2>
        <p>Even healthy businesses can experience temporary cash-flow gaps caused by delayed payments, seasonal fluctuations, unexpected expenses, or timing differences between receivables and payroll.</p>
        <p>CareBearBooks has partnered with Payro Finance to give eligible payroll clients access to a payroll-focused financing application. Think of it as a backup plan for payroll—Payro Finance provides a financing product, not an insurance policy.</p>
      </div>
      <ul className="checklist">
        {payrollBenefits.map((benefit) => (
          <li key={benefit}><CheckCircle2 size={18} aria-hidden="true" /><span>{benefit}</span></li>
        ))}
      </ul>
      <div className="callout">
        <strong>Eligible CareBearBooks payroll clients may be pre-qualified for a payroll line of credit of up to $25,000.</strong>
        <p>Pre-qualification is not final approval. Eligibility, approval, credit limits, pricing, and final terms are determined by Payro Finance.</p>
      </div>
      <div className="hero__actions">
        <PayroButton className="button--primary">Activate your payroll credit line</PayroButton>
        <Link className="text-button" to="/get-started" state={{ preset: 'payroll' }}>
          Ask us about payroll funding <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
