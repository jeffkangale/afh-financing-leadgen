import { ArrowDown, ArrowRight, Building2, CheckCircle2, Hammer, Home, Ruler, ShieldCheck } from 'lucide-react'
import ApplyButton from '../components/ApplyButton'
import LeadForm from '../components/LeadForm'
import Logo from '../components/Logo'

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

const purchaseUses = [
  'Buying an existing Adult Family Home',
  'Purchasing a property for conversion',
  'Business acquisition',
  'Working capital',
  'Property purchase',
  'Expansion',
]

const projectUses = [
  'Renovations',
  'Accessibility improvements',
  'Safety upgrades',
  'Equipment',
  'Furniture',
  'Licensing preparation',
  'Expansion',
]

const timelineSteps = [
  ['01', 'Choose the financing solution', 'Tell us whether you are purchasing a property or financing a construction, renovation, or improvement project.'],
  ['02', 'Complete the secure application', 'Apply directly with Payro Finance through a secure, guided application built for AFH financing.'],
  ['03', 'Application review by Payro Finance', 'Payro Finance reviews your application and qualifications against its lender requirements.'],
  ['04', 'Receive funding if approved', 'Once approved, funds are released so you can move forward with your property or project.'],
]

export default function LandingPage() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <Logo />
        <nav aria-label="Main navigation">
          <button className="nav-link" onClick={() => scrollTo('financing-paths')}>Financing paths</button>
          <button className="nav-link" onClick={() => scrollTo('how-it-works')}>How it works</button>
          <a href="https://portal.payrofinance.com/sign-up?partner=carebear" target="_blank" rel="noopener noreferrer" className="nav-link">
            Get started<span className="visually-hidden"> (opens the Payro Finance application in a new tab)</span>
          </a>
        </nav>
        <ApplyButton className="button--header">Check my options</ApplyButton>
      </header>

      <main>
        <section className="hero">
          <div className="blueprint blueprint--one" aria-hidden="true"><span>24′–0″</span></div>
          <div className="hero__content">
            <p className="eyebrow">FINANCING BUILT FOR ADULT FAMILY HOMES</p>
            <h1>The right capital for the home—and care business—you’re building.</h1>
            <p className="hero__lead">We connect adult family home owners and operators with lenders who understand AFH property purchases, construction, expansion, and renovation.</p>
            <div className="hero__actions">
              <button className="button button--primary" onClick={() => scrollTo('contact')}>Tell us what you’re financing <ArrowRight size={18} aria-hidden="true" /></button>
              <button className="text-button" onClick={() => scrollTo('financing-paths')}>See financing paths <ArrowDown size={17} aria-hidden="true" /></button>
            </div>
            <div className="hero__trust"><ShieldCheck size={18} aria-hidden="true" /><span>Specialised lender matching. Direct introductions. No obligation.</span></div>
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
            <p className="eyebrow">TWO DIFFERENT NEEDS. TWO LENDER POOLS.</p>
            <h2>Start with the financing path that fits your property.</h2>
            <p>Purchase loans and construction or renovation loans are evaluated differently. We help route your enquiry to lenders that specialise in the right type of project.</p>
          </div>
          <div className="path-grid">
            <article className="path-card">
              <div className="path-card__number">PATH 01</div>
              <Home size={34} strokeWidth={1.45} aria-hidden="true" />
              <h3>Purchase financing</h3>
              <p>For buying a property that will open as a new adult family home or expand an existing AFH operation.</p>
              <ul><li>Property acquisition</li><li>New AFH location</li><li>Portfolio expansion</li></ul>
              <button className="card-link" onClick={() => scrollTo('purchase-financing')}>
                Explore purchase options <ArrowRight size={17} aria-hidden="true" />
              </button>
            </article>
            <article className="path-card path-card--accent">
              <div className="path-card__number">PATH 02</div>
              <Hammer size={34} strokeWidth={1.45} aria-hidden="true" />
              <h3>Construction & renovation</h3>
              <p>For owners who already control the property and need capital to build, expand, modernise, or meet licensing requirements.</p>
              <ul><li>Additions and room expansion</li><li>ADA and accessibility upgrades</li><li>Licensing-related improvements</li></ul>
              <button className="card-link" onClick={() => scrollTo('project-financing')}>
                Explore project financing <ArrowRight size={17} aria-hidden="true" />
              </button>
            </article>
          </div>
        </section>

        <section className="financing-detail section" id="purchase-financing">
          <div className="section-heading">
            <p className="eyebrow">PATH 01 · PURCHASE FINANCING</p>
            <h2>Financing to acquire the right property.</h2>
            <p>Whether you are buying your first Adult Family Home or growing a portfolio, purchase financing is matched to lenders who understand AFH real estate and care-business acquisitions.</p>
          </div>
          <ul className="financing-detail__list">
            {purchaseUses.map((use) => (
              <li key={use}><CheckCircle2 size={18} aria-hidden="true" /><span>{use}</span></li>
            ))}
          </ul>
          <ApplyButton className="button--primary">Apply for Purchase Financing</ApplyButton>
        </section>

        <section className="financing-detail financing-detail--accent section" id="project-financing">
          <div className="section-heading">
            <p className="eyebrow">PATH 02 · PROJECT FINANCING</p>
            <h2>Financing for construction, renovation & upgrades.</h2>
            <p>If you already control the property, project financing covers the work needed to build, modernise, and stay compliant—so your home is ready for licensing and residents.</p>
          </div>
          <ul className="financing-detail__list">
            {projectUses.map((use) => (
              <li key={use}><CheckCircle2 size={18} aria-hidden="true" /><span>{use}</span></li>
            ))}
          </ul>
          <ApplyButton className="button--primary">Apply for Project Financing</ApplyButton>
        </section>

        <section className="process section" id="how-it-works">
          <div className="section-heading section-heading--light">
            <p className="eyebrow">HOW IT WORKS</p>
            <h2>A clear path from enquiry to funding.</h2>
          </div>
          <ol className="steps">
            {timelineSteps.map(([number, title, text], index) => (
              <li className="step" key={number} style={{ animationDelay: `${index * 0.12}s` }}>
                <span>{number}</span><h3>{title}.</h3><p>{text}</p>
              </li>
            ))}
          </ol>
          <div className="process-line" aria-hidden="true"><Ruler size={18} /><span>CHOOSE</span><i /><span>APPLY</span><i /><span>REVIEW</span><i /><span>FUND</span></div>
        </section>

        <section className="form-section section" id="contact">
          <div className="form-section__intro">
            <p className="eyebrow">GET STARTED</p>
            <h2>Tell us what you’re financing.</h2>
            <p>Provide a few details so we can understand your need and determine which specialised financing path may fit.</p>
            <div className="form-note"><Building2 size={22} aria-hidden="true" /><span><strong>Already own the property?</strong> Select construction or renovation—even if your project includes a major expansion.</span></div>
          </div>
          <LeadForm />
        </section>
      </main>

      <footer>
        <Logo light />
        <nav aria-label="Footer navigation">
          <button className="nav-link nav-link--light" onClick={() => scrollTo('financing-paths')}>Financing paths</button>
          <button className="nav-link nav-link--light" onClick={() => scrollTo('how-it-works')}>How it works</button>
          <a href="https://portal.payrofinance.com/sign-up?partner=carebear" target="_blank" rel="noopener noreferrer" className="nav-link nav-link--light">
            Get started<span className="visually-hidden"> (opens the Payro Finance application in a new tab)</span>
          </a>
        </nav>
        <p>© {new Date().getFullYear()} AFH Financing Partners. Financing is subject to lender review and approval.</p>
      </footer>
    </div>
  )
}
