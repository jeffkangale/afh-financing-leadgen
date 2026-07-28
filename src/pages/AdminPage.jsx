import { useEffect, useState } from 'react'
import { ArrowLeft, LogOut, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import { isSupabaseConfigured, supabase } from '../lib'

const labels = {
  purchase: 'Purchase',
  construction_renovation: 'Construction / renovation',
  not_sure: 'Not sure',
}

export default function AdminPage() {
  const [session, setSession] = useState(null)
  const [loadingSession, setLoadingSession] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [leads, setLeads] = useState([])
  const [loadingLeads, setLoadingLeads] = useState(false)
  const [leadError, setLeadError] = useState('')

  useEffect(() => {
    if (!supabase) { setLoadingSession(false); return }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoadingSession(false) })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => listener.subscription.unsubscribe()
  }, [])

  const loadLeads = async () => {
    setLoadingLeads(true)
    setLeadError('')
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
    if (error) setLeadError(error.message)
    else setLeads(data || [])
    setLoadingLeads(false)
  }

  useEffect(() => { if (session) loadLeads() }, [session])

  const signIn = async (event) => {
    event.preventDefault()
    setAuthError('')
    if (!supabase) { setAuthError('Supabase environment variables are not configured.'); return }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setAuthError(error.message)
  }

  if (loadingSession) return <div className="admin-centre">Loading…</div>

  if (!isSupabaseConfigured) {
    return <div className="admin-centre"><h1>Configuration required</h1><p>Add the Supabase environment variables before using the admin page.</p><Link to="/">Return home</Link></div>
  }

  if (!session) {
    return (
      <main className="admin-login">
        <div className="admin-login__panel">
          <Logo />
          <p className="eyebrow">SECURE ADMIN</p>
          <h1>Lead dashboard</h1>
          <p>Sign in with an authorised Supabase user account.</p>
          <form onSubmit={signIn}>
            <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
            <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
            {authError && <div className="form-error">{authError}</div>}
            <button className="button button--primary button--wide">Sign in</button>
          </form>
          <Link className="back-link" to="/"><ArrowLeft size={16} /> Back to site</Link>
        </div>
      </main>
    )
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <Logo />
        <div><span>{session.user.email}</span><button className="button button--secondary" onClick={() => supabase.auth.signOut()}><LogOut size={16} /> Sign out</button></div>
      </header>
      <main className="admin-main">
        <div className="admin-title"><div><p className="eyebrow">LEAD MANAGEMENT</p><h1>Financing enquiries</h1><p>{leads.length} submitted lead{leads.length === 1 ? '' : 's'}</p></div><button className="button button--secondary" onClick={loadLeads} disabled={loadingLeads}><RefreshCw size={16} className={loadingLeads ? 'spin' : ''} /> Refresh</button></div>
        {leadError && <div className="form-error">Unable to load leads: {leadError}</div>}
        <div className="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Name</th><th>Contact</th><th>Financing need</th><th>Notes</th></tr></thead>
            <tbody>
              {leads.map((lead) => <tr key={lead.id}><td>{new Date(lead.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</td><td><strong>{lead.name}</strong></td><td>{lead.contact}</td><td><span className="status-chip">{labels[lead.financing_need] || lead.financing_need}</span></td><td>{lead.notes || <span className="muted">—</span>}</td></tr>)}
              {!loadingLeads && leads.length === 0 && <tr><td colSpan="5" className="empty-state">No leads have been submitted yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
