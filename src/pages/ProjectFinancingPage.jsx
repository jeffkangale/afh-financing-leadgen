import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const projectUses = [
  'Renovation',
  'Accessibility improvements',
  'Safety upgrades',
  'Equipment',
  'Furnishing',
  'Expansion',
  'Licensing preparation',
]

export default function ProjectFinancingPage() {
  return (
    <section className="financing-detail financing-detail--accent section" id="project-financing">
      <div className="section-heading">
        <p className="eyebrow">PATH 02 · PROJECT FINANCING</p>
        <h2>Financing for construction, renovation & upgrades.</h2>
        <p>If you already control the property, project financing covers the work needed to build, modernise, and stay compliant—so your home is ready for licensing and residents.</p>
      </div>
      <ul className="checklist">
        {projectUses.map((use) => (
          <li key={use}><CheckCircle2 size={18} aria-hidden="true" /><span>{use}</span></li>
        ))}
      </ul>
      <p className="fine-note">Financing is subject to the applicable provider’s application, eligibility, underwriting, approval, and final terms. We do not guarantee approval, rates, credit limits, or funding timelines.</p>
      <Link className="button button--primary" to="/get-started" state={{ preset: 'construction_renovation' }}>
        Discuss project financing <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </section>
  )
}
