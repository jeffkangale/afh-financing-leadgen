import { Link, Outlet } from 'react-router-dom'
import Logo from './Logo'

export default function Layout() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <Logo />
        <nav aria-label="Main navigation">
          <Link className="nav-link" to="/">Financing paths</Link>
          <Link className="nav-link" to="/how-it-works">How it works</Link>
          <Link className="nav-link" to="/faqs">FAQs</Link>
        </nav>
        <Link className="button button--header" to="/get-started">Get started</Link>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <Logo light />
        <nav aria-label="Footer navigation">
          <Link className="nav-link nav-link--light" to="/">Financing paths</Link>
          <Link className="nav-link nav-link--light" to="/how-it-works">How it works</Link>
          <Link className="nav-link nav-link--light" to="/faqs">FAQs</Link>
        </nav>
        <p>© {new Date().getFullYear()} CareBearBooks. Financing is subject to lender review and approval.</p>
        <p>CareBearBooks is not a lender. Financing availability is subject to the applicable provider’s application, eligibility requirements, underwriting, approval, credit limits, pricing, and final terms. Payro Finance is a financing product and not an insurance policy.</p>
      </footer>
    </div>
  )
}
