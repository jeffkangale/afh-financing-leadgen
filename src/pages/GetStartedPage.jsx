import { Building2 } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import LeadForm from '../components/LeadForm'

export default function GetStartedPage() {
  const location = useLocation()
  const presetValue = location.state?.preset || ''

  return (
    <section className="form-section section" id="get-started">
      <div className="form-section__intro">
        <p className="eyebrow">GET STARTED</p>
        <h2>Tell us what you’re financing.</h2>
        <p>Provide a few details so we can understand your need and direct you to the relevant financing process or partner.</p>
        <div className="form-note"><Building2 size={22} aria-hidden="true" /><span><strong>Already own the property?</strong> Select project, renovation, or expansion financing—even if your project includes a major expansion.</span></div>
      </div>
      <LeadForm preset={{ value: presetValue, token: location.key }} />
    </section>
  )
}
