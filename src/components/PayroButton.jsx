import { ArrowRight } from 'lucide-react'
import { PAYRO_SIGNUP_URL } from '../lib'

/**
 * External link to the Payro Finance payroll-funding application.
 * Only ever used for payroll-funding CTAs — purchase and project
 * financing enquiries must stay on this site (Payro does not offer them).
 */
export default function PayroButton({ children, className = '', showIcon = true, ...rest }) {
  return (
    <a
      href={PAYRO_SIGNUP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`button ${className}`.trim()}
      {...rest}
    >
      {children}
      {showIcon && <ArrowRight size={18} aria-hidden="true" />}
      <span className="visually-hidden"> (opens the Payro Finance payroll funding application in a new tab)</span>
    </a>
  )
}
