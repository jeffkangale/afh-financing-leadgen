import { ArrowDown, ArrowRight, Banknote, Hammer, Home, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="blueprint blueprint--one" aria-hidden="true"><span>24′–0″</span></div>
        <div className="hero__content">
          <p className="eyebrow">FINANCING BUILT FOR ADULT FAMILY HOMES</p>
          <h1>The right capital for the home—and care business—you’re building.</h1>
          <p className="hero__lead">We connect adult family home owners and operators with financing options for property purchases, construction, expansion, renovation, and payroll cash-flow needs.</p>
          <div className="hero__actions">
            <Link className="button button--primary" to="/get-started">Tell us what you’re financing <ArrowRight size={18} aria-hidden="true" /></Link>
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
            <Link className="card-link" to="/purchase-financing">
              Explore purchase financing <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </article>
          <article className="path-card path-card--accent">
            <div className="path-card__number">PATH 02</div>
            <Hammer size={34} strokeWidth={1.45} aria-hidden="true" />
            <h3>Project financing</h3>
            <p>For owners who already control the property and need capital to renovate, expand, modernise, or meet licensing requirements.</p>
            <ul><li>Renovations and accessibility upgrades</li><li>Safety upgrades and equipment</li><li>Licensing preparation</li></ul>
            <Link className="card-link" to="/project-financing">
              Explore project financing <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </article>
          <article className="path-card">
            <div className="path-card__number">PATH 03</div>
            <Banknote size={34} strokeWidth={1.45} aria-hidden="true" />
            <h3>Payroll funding</h3>
            <p>A backup option for temporary payroll cash-flow gaps, through our partner Payro Finance.</p>
            <ul><li>Delayed payer receipts</li><li>Seasonal cash-flow gaps</li><li>Unexpected payroll expenses</li></ul>
            <Link className="card-link" to="/payroll-funding">
              Explore payroll funding <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </article>
        </div>
      </section>
    </>
  )
}
