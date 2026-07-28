import { House } from 'lucide-react'

export default function Logo({ light = false }) {
  return (
    <a className={`logo ${light ? 'logo--light' : ''}`} href="/" aria-label="AFH Financing Partners home">
      <span className="logo__mark"><House size={21} strokeWidth={1.7} /></span>
      <span><strong>AFH</strong> Financing Partners</span>
    </a>
  )
}
