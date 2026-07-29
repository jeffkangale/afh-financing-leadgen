import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const purchaseUses = [
  'Purchasing an existing Adult Family Home business',
  'Buying a property intended for AFH operations',
  'Business acquisition',
  'Property-related financing enquiries',
  'Initial working-capital needs associated with an acquisition',
]

export default function PurchaseFinancingPage() {
  return (
    <section className="financing-detail section" id="purchase-financing">
      <div className="section-heading">
        <p className="eyebrow">PATH 01 · PURCHASE FINANCING</p>
        <h2>Financing to acquire the right property.</h2>
        <p>This page is for visitors exploring financing related to purchasing or acquiring an Adult Family Home or related property.</p>
      </div>
      <ul className="checklist">
        {purchaseUses.map((use) => (
          <li key={use}><CheckCircle2 size={18} aria-hidden="true" /><span>{use}</span></li>
        ))}
      </ul>
      <p className="fine-note">Financing is subject to the applicable provider’s application, eligibility, underwriting, approval, and final terms. We do not guarantee approval, rates, credit limits, or funding timelines.</p>
      <Link className="button button--primary" to="/get-started" state={{ preset: 'purchase' }}>
        Discuss purchase financing <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </section>
  )
}
