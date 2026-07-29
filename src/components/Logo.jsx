import { House } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Logo({ light = false }) {
  return (
    <Link className={`logo ${light ? 'logo--light' : ''}`} to="/" aria-label="AFH Financing Partners home">
      <span className="logo__mark"><House size={21} strokeWidth={1.7} /></span>
      <span><strong>AFH</strong> Financing Partners</span>
    </Link>
  )
}
