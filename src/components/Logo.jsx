import { House } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Logo({ light = false, tagline }) {
  return (
    <Link className={`logo ${light ? 'logo--light' : ''}`} to="/" aria-label="CareBearBooks home">
      <span className="logo__mark"><House size={21} strokeWidth={1.7} /></span>
      <span>
        <strong>CareBearBooks</strong>
        {tagline && <span className="logo__tagline"> | {tagline}</span>}
      </span>
    </Link>
  )
}
