import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, type ResponseRow } from '../lib/supabase';
import { exportResponsesToExcel } from '../lib/exportExcel';

export function AdminPage() {
  const [session, setSession] = useState<Session | null | 'loading'>('loading');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (session === 'loading') {
    return (
      <div className="centered-screen">
        <p className="muted">Loading...</p>
      </div>
    );
  }

  return session ? <AdminDashboard /> : <AdminLogin />;
}

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setError(error.message);
  }

  return (
    <div className="centered-screen">
      <div className="card">
        <h1 style={{ marginTop: 0 }}>Admin Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="text-input"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="text-input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
            {busy ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [responses, setResponses] = useState<ResponseRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  async function loadResponses() {
    setError(null);
    const { data, error } = await supabase
      .from('responses')
      .select('id, respondent_number, submitted_at, answers')
      .order('respondent_number', { ascending: true });
    if (error) {
      setError(error.message);
      return;
    }
    setResponses(data as ResponseRow[]);
  }

  useEffect(() => {
    loadResponses();
  }, []);

  async function handleExport() {
    if (!responses) return;
    setExporting(true);
    try {
      await exportResponsesToExcel(responses);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="page-container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0 }}>Survey Responses</h1>
          <button className="btn" style={{ background: 'transparent' }} onClick={() => supabase.auth.signOut()}>
            Sign out
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}

        {responses === null ? (
          <p className="muted">Loading responses...</p>
        ) : (
          <>
            <p>
              <span className="admin-stat">{responses.length}</span>
              <br />
              <span className="muted">response{responses.length === 1 ? '' : 's'} submitted</span>
            </p>
            <button
              className="btn btn-primary btn-block"
              onClick={handleExport}
              disabled={exporting || responses.length === 0}
            >
              {exporting ? 'Preparing file...' : 'Download Excel'}
            </button>
            <button
              className="btn btn-block"
              style={{ marginTop: 10, background: 'transparent', border: '1px solid var(--border)' }}
              onClick={loadResponses}
            >
              Refresh
            </button>
          </>
        )}
      </div>
    </div>
  );
}
