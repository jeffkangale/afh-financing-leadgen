import { ArrowDown, ArrowRight, Building2, Hammer, Home, Ruler, ShieldCheck } from 'lucide-react'
import LeadForm from '../components/LeadForm'
import Logo from '../components/Logo'

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

export default function LandingPage() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <Logo />
        <nav aria-label="Main navigation">
          <a href="#paths">Financing paths</a>
          <a href="#process">How it works</a>
          <a href="#get-started">Get started</a>
        </nav>
        <button className="button button--header" onClick={() => scrollTo('get-started')}>Check my options</button>
      </header>

      <main>
        <section className="hero">
          <div className="blueprint blueprint--one" aria-hidden="true"><span>24′–0″</span></div>
          <div className="hero__content">
            <p className="eyebrow">FINANCING BUILT FOR ADULT FAMILY HOMES</p>
            <h1>The right capital for the home—and care business—you’re building.</h1>
            <p className="hero__lead">We connect adult family home owners and operators with lenders who understand AFH property purchases, construction, expansion, and renovation.</p>
            <div className="hero__actions">
              <button className="button button--primary" onClick={() => scrollTo('get-started')}>Tell us what you’re financing <ArrowRight size={18} /></button>
              <button className="text-button" onClick={() => scrollTo('paths')}>See financing paths <ArrowDown size={17} /></button>
            </div>
            <div className="hero__trust"><ShieldCheck size={18} /><span>Specialised lender matching. Direct introductions. No obligation.</span></div>
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

        <section className="paths section" id="paths">
          <div className="section-heading">
            <p className="eyebrow">TWO DIFFERENT NEEDS. TWO LENDER POOLS.</p>
            <h2>Start with the financing path that fits your property.</h2>
            <p>Purchase loans and construction or renovation loans are evaluated differently. We help route your enquiry to lenders that specialise in the right type of project.</p>
          </div>
          <div className="path-grid">
            <article className="path-card">
              <div className="path-card__number">PATH 01</div>
              <Home size={34} strokeWidth={1.45} />
              <h3>Purchase financing</h3>
              <p>For buying a property that will open as a new adult family home or expand an existing AFH operation.</p>
              <ul><li>Property acquisition</li><li>New AFH location</li><li>Portfolio expansion</li></ul>
              <button className="card-link" onClick={() => scrollTo('get-started')}>Explore purchase options <ArrowRight size={17} /></button>
            </article>
            <article className="path-card path-card--accent">
              <div className="path-card__number">PATH 02</div>
              <Hammer size={34} strokeWidth={1.45} />
              <h3>Construction & renovation</h3>
              <p>For owners who already control the property and need capital to build, expand, modernise, or meet licensing requirements.</p>
              <ul><li>Additions and room expansion</li><li>ADA and accessibility upgrades</li><li>Licensing-related improvements</li></ul>
              <button className="card-link" onClick={() => scrollTo('get-started')}>Explore project financing <ArrowRight size={17} /></button>
            </article>
          </div>
        </section>

        <section className="process section" id="process">
          <div className="section-heading section-heading--light">
            <p className="eyebrow">HOW IT WORKS</p>
            <h2>A clear path from enquiry to lender introduction.</h2>
          </div>
          <div className="steps">
            {[
              ['01', 'Tell us what you need', 'Share whether you are purchasing a property, financing construction or renovation, or still working out the right path.'],
              ['02', 'We identify a specialised lender', 'We review the project type and connect it to the appropriate lender pool for the financing need.'],
              ['03', 'Get a direct introduction', 'When there is a potential fit, you receive a direct connection so the lender can discuss qualifications and next steps.'],
            ].map(([number, title, text]) => (
              <article className="step" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>
            ))}
          </div>
          <div className="process-line" aria-hidden="true"><Ruler size={18} /><span>ENQUIRY</span><i /><span>MATCH</span><i /><span>INTRODUCTION</span></div>
        </section>

        <section className="form-section section" id="get-started">
          <div className="form-section__intro">
            <p className="eyebrow">GET STARTED</p>
            <h2>Tell us what you’re financing.</h2>
            <p>Provide a few details so we can understand your need and determine which specialised financing path may fit.</p>
            <div className="form-note"><Building2 size={22} /><span><strong>Already own the property?</strong> Select construction or renovation—even if your project includes a major expansion.</span></div>
          </div>
          <LeadForm />
        </section>
      </main>

      <footer>
        <Logo light />
        <nav><a href="#paths">Financing paths</a><a href="#process">How it works</a><a href="#get-started">Get started</a></nav>
        <p>© {new Date().getFullYear()} AFH Financing Partners. Financing is subject to lender review and approval.</p>
      </footer>
    </div>
  )
}
