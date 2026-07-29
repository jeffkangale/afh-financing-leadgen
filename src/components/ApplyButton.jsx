import { ArrowRight } from 'lucide-react'
import { APPLY_URL } from '../lib'

/**
 * Reusable external CTA. Every instance opens the Payro Finance application
 * in a new tab so visitors always know it's leaving the site.
 */
export default function ApplyButton({ children, className = '', showIcon = true, ...rest }) {
  return (
    <a
      href={APPLY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`button ${className}`.trim()}
      {...rest}
    >
      {children}
      {showIcon && <ArrowRight size={18} aria-hidden="true" />}
      <span className="visually-hidden"> (opens the Payro Finance application in a new tab)</span>
    </a>
  )
}
