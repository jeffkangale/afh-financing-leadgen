import { useState } from 'react'
import { ArrowDown, ArrowRight, Banknote, Building2, CheckCircle2, Hammer, Home, Ruler, ShieldCheck } from 'lucide-react'
import LeadForm from '../components/LeadForm'
import Logo from '../components/Logo'
import PayroButton from '../components/PayroButton'

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

const purchaseUses = [
  'Purchasing an existing Adult Family Home business',
  'Buying a property intended for AFH operations',
  'Business acquisition',
  'Property-related financing enquiries',
  'Initial working-capital needs associated with an acquisition',
]

const projectUses = [
  'Renovation',
  'Accessibility improvements',
  'Safety upgrades',
  'Equipment',
  'Furnishing',
  'Expansion',
  'Licensing preparation',
]

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

const timelineSteps = [
  ['01', 'Choose a financing path', 'Review purchase, project, or payroll-funding options.'],
  ['02', 'Tell us what you need', 'Complete the short enquiry form so we can understand your financing goal.'],
  ['03', 'Receive the appropriate next step', 'CareBearBooks will direct you to the relevant financing process or partner.'],
  ['04', 'Complete the applicable process', 'Submit the required information to the relevant financing provider for review.'],
]

const faqs = [
  ['What types of financing can I enquire about?', 'You can enquire about purchase or acquisition financing, project, renovation, or expansion financing, and payroll funding.'],
  ['Is CareBearBooks the lender?', 'CareBearBooks is not the lender. We help clients understand available options and connect them with applicable financing processes or partners.'],
  ['Is financing guaranteed?', 'No. Financing is subject to the provider’s application, eligibility, underwriting, approval, pricing, and final terms.'],
  ['What is Payro Finance?', 'Payro Finance provides payroll-focused business financing for approved businesses experiencing temporary payroll cash-flow gaps.'],
  ['Can Payro Finance fund an AFH property purchase or renovation?', 'The Payro programme shown on this website is specifically for payroll funding. Purchase, acquisition, renovation, and project-financing enquiries should be submitted through the CareBearBooks enquiry form.'],
  ['How long does the Payro application take?', 'The Payro Finance application typically takes approximately 5–7 minutes.'],
]

export default function LandingPage() {
  const [preset, setPreset] = useState({ value: '', token: 0 })

  const startFinancingEnquiry = (value) => {
    setPreset({ value, token: Date.now() })
    scrollTo('get-started')
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <Logo />
        <nav aria-label="Main navigation">
          <button className="nav-link" onClick={() => scrollTo('financing-paths')}>Financing paths</button>
          <button className="nav-link" onClick={() => scrollTo('how-it-works')}>How it works</button>
          <button className="nav-link" onClick={() => scrollTo('faqs')}>FAQs</button>
        </nav>
        <button className="button button--header" onClick={() => scrollTo('get-started')}>Get started</button>
      </header>

      <main>
        <section className="hero">
          <div className="blueprint blueprint--one" aria-hidden="true"><span>24′–0″</span></div>
          <div className="hero__content">
            <p className="eyebrow">FINANCING BUILT FOR ADULT FAMILY HOMES</p>
            <h1>The right capital for the home—and care business—you’re building.</h1>
            <p className="hero__lead">We connect adult family home owners and operators with financing options for property purchases, construction, expansion, renovation, and payroll cash-flow needs.</p>
            <div className="hero__actions">
              <button className="button button--primary" onClick={() => scrollTo('get-started')}>Tell us what you’re financing <ArrowRight size={18} aria-hidden="true" /></button>
              <button className="text-button" onClick={() => scrollTo('financing-paths')}>See financing paths <ArrowDown size={17} aria-hidden="true" /></button>
            </div>
            <div className="hero__trust"><ShieldCheck size={18} aria-hidden="true" /><span>Specialised financing guidance. Direct next steps. No obligation.</span></div>
          </div>
          <div className="hero__drawing" aria-label="Architectural line drawing of a home">
            <div className="house-drawing">
              <div className="roof-line" />
              <div className="house-body"><span className="window" /><span className="door" /><span className="window window--right" /></div>
              <span className="drawing-label">AFH / CONCEPT 01</span>
              <span className="dimension dimension--width">48′–0″</span>
              <span className="dimension dimension--height">18′–6″</span>
            </div>
          </div>
        </section>

        <section className="paths section" id="financing-paths">
          <div className="section-heading">
            <p className="eyebrow">THREE DIFFERENT NEEDS.</p>
            <h2>Start with the financing path that fits your need.</h2>
            <p>Property purchases, construction or renovation projects, and payroll cash-flow gaps are all evaluated differently. Start with the path that matches what you're facing.</p>
          </div>
          <div className="path-grid">
            <article className="path-card">
              <div className="path-card__number">PATH 01</div>
              <Home size={34} strokeWidth={1.45} aria-hidden="true" />
              <h3>Purchase financing</h3>
              <p>For buying or acquiring an existing adult family home business or a property intended for AFH operations.</p>
              <ul><li>Property acquisition</li><li>Business acquisition</li><li>Initial working capital</li></ul>
              <button className="card-link" onClick={() => scrollTo('purchase-financing')}>
                Explore purchase financing <ArrowRight size={17} aria-hidden="true" />
              </button>
            </article>
            <article className="path-card path-card--accent">
              <div className="path-card__number">PATH 02</div>
              <Hammer size={34} strokeWidth={1.45} aria-hidden="true" />
              <h3>Project financing</h3>
              <p>For owners who already control the property and need capital to renovate, expand, modernise, or meet licensing requirements.</p>
              <ul><li>Renovations and accessibility upgrades</li><li>Safety upgrades and equipment</li><li>Licensing preparation</li></ul>
              <button className="card-link" onClick={() => scrollTo('project-financing')}>
                Explore project financing <ArrowRight size={17} aria-hidden="true" />
              </button>
            </article>
            <article className="path-card">
              <div className="path-card__number">PATH 03</div>
              <Banknote size={34} strokeWidth={1.45} aria-hidden="true" />
              <h3>Payroll funding</h3>
              <p>A backup option for temporary payroll cash-flow gaps, through our partner Payro Finance.</p>
              <ul><li>Delayed payer receipts</li><li>Seasonal cash-flow gaps</li><li>Unexpected payroll expenses</li></ul>
              <button className="card-link" onClick={() => scrollTo('payroll-funding')}>
                Explore payroll funding <ArrowRight size={17} aria-hidden="true" />
              </button>
            </article>
          </div>
        </section>

        <section className="financing-detail section" id="purchase-financing">
          <div className="section-heading">
            <p className="eyebrow">PATH 01 · PURCHASE FINANCING</p>
            <h2>Financing to acquire the right property.</h2>
            <p>This section is for visitors exploring financing related to purchasing or acquiring an Adult Family Home or related property.</p>
          </div>
          <ul className="checklist">
            {purchaseUses.map((use) => (
              <li key={use}><CheckCircle2 size={18} aria-hidden="true" /><span>{use}</span></li>
            ))}
          </ul>
          <p className="fine-note">Financing is subject to the applicable provider’s application, eligibility, underwriting, approval, and final terms. We do not guarantee approval, rates, credit limits, or funding timelines.</p>
          <button className="button button--primary" onClick={() => startFinancingEnquiry('purchase')}>
            Discuss purchase financing <ArrowRight size={18} aria-hidden="true" />
          </button>
        </section>

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
          <button className="button button--primary" onClick={() => startFinancingEnquiry('construction_renovation')}>
            Discuss project financing <ArrowRight size={18} aria-hidden="true" />
          </button>
        </section>

        <section className="financing-detail section" id="payroll-funding">
          <div className="section-heading">
            <p className="eyebrow">PATH 03 · PAYROLL FUNDING</p>
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
            <button className="text-button" onClick={() => startFinancingEnquiry('payroll')}>
              Ask us about payroll funding <ArrowRight size={17} aria-hidden="true" />
            </button>
          </div>
        </section>

        <section className="process section" id="how-it-works">
          <div className="section-heading section-heading--light">
            <p className="eyebrow">HOW IT WORKS</p>
            <h2>A clear path from enquiry to next step.</h2>
          </div>
          <ol className="steps">
            {timelineSteps.map(([number, title, text], index) => (
              <li className="step" key={number} style={{ animationDelay: `${index * 0.12}s` }}>
                <span>{number}</span><h3>{title}.</h3><p>{text}</p>
              </li>
            ))}
          </ol>
          <div className="process-line" aria-hidden="true"><Ruler size={18} /><span>CHOOSE</span><i /><span>TELL US</span><i /><span>DIRECT</span><i /><span>APPLY</span></div>
          <p className="process-note">Visitors seeking payroll funding may apply directly through the Payro Finance portal.</p>
        </section>

        <section className="faqs section" id="faqs">
          <div className="section-heading">
            <p className="eyebrow">FAQS</p>
            <h2>Common questions.</h2>
          </div>
          <div className="faq-list">
            {faqs.map(([question, answer]) => (
              <details className="faq-item" key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="form-section section" id="get-started">
          <div className="form-section__intro">
            <p className="eyebrow">GET STARTED</p>
            <h2>Tell us what you’re financing.</h2>
            <p>Provide a few details so we can understand your need and direct you to the relevant financing process or partner.</p>
            <div className="form-note"><Building2 size={22} aria-hidden="true" /><span><strong>Already own the property?</strong> Select project, renovation, or expansion financing—even if your project includes a major expansion.</span></div>
          </div>
          <LeadForm preset={preset} />
        </section>
      </main>

      <footer>
        <Logo light />
        <nav aria-label="Footer navigation">
          <button className="nav-link nav-link--light" onClick={() => scrollTo('financing-paths')}>Financing paths</button>
          <button className="nav-link nav-link--light" onClick={() => scrollTo('how-it-works')}>How it works</button>
          <button className="nav-link nav-link--light" onClick={() => scrollTo('faqs')}>FAQs</button>
        </nav>
        <p>© {new Date().getFullYear()} AFH Financing Partners. Financing is subject to lender review and approval.</p>
        <p>CareBearBooks is not a lender. Financing availability is subject to the applicable provider’s application, eligibility requirements, underwriting, approval, credit limits, pricing, and final terms. Payro Finance is a financing product and not an insurance policy.</p>
      </footer>
    </div>
  )
}
