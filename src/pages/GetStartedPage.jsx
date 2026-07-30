import { useLocation } from 'react-router-dom'
import LeadForm from '../components/LeadForm'

export default function GetStartedPage() {
  const location = useLocation()
  const presetValue = location.state?.preset || ''

  return (
    <section className="section wizard-page" id="get-started">
      <LeadForm preset={{ value: presetValue, token: location.key }} />
    </section>
  )
}
