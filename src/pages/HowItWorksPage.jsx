import { Ruler } from 'lucide-react'

const timelineSteps = [
  ['01', 'Choose a financing path', 'Review purchase, project, or payroll-funding options.'],
  ['02', 'Tell us what you need', 'Complete the short enquiry form so we can understand your financing goal.'],
  ['03', 'Receive the appropriate next step', 'CareBearBooks will direct you to the relevant financing process or partner.'],
  ['04', 'Complete the applicable process', 'Submit the required information to the relevant financing provider for review.'],
]

export default function HowItWorksPage() {
  return (
    <section className="process section" id="how-it-works">
      <div className="section-heading section-heading--light">
        <p className="eyebrow">HOW IT WORKS</p>
        <h2>A clear path from enquiry to next step.</h2>
      </div>
      <ol className="steps">
        {timelineSteps.map(([number, title, text], index) => (
          <li className="step" key={number} style={{ animationDelay: `${index * 0.12}s` }}>
            <h3>{title}.</h3><p>{text}</p>
          </li>
        ))}
      </ol>
      <div className="process-line" aria-hidden="true"><Ruler size={18} /><span>CHOOSE</span><i /><span>TELL US</span><i /><span>DIRECT</span><i /><span>APPLY</span></div>
      <p className="process-note">Visitors seeking payroll funding may apply directly through the Payro Finance portal.</p>
    </section>
  )
}
