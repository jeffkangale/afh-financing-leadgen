import { Link } from 'react-router-dom'
import logoMark from '../assets/carebearbooks-logo.png'

export default function Logo({ light = false, tagline }) {
  return (
    <Link className={`logo ${light ? 'logo--light' : ''}`} to="/" aria-label="CareBearBooks home">
      <span className="logo__mark">
        <img src={logoMark} alt="" aria-hidden="true" />
      </span>
      <span>
        <strong>CareBearBooks</strong>
        {tagline && <span className="logo__tagline"> | {tagline}</span>}
      </span>
    </Link>
  )
}
