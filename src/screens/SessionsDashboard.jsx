import { useState } from 'react';
import { useApp } from '../context/AppContext';

function SessionCard({ session }) {
  const initials = session.practitionerName.split(' ').map(n => n[0]).join('');
  const isUpcoming = session.status === 'upcoming';
  return (
    <div style={{ background: 'var(--niro-white)', border: '1px solid var(--niro-border)', borderRadius: 14, padding: 16, marginBottom: 10 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--niro-green)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 500, flexShrink: 0 }}>{initials}</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--niro-ink)' }}>{session.practitionerName}</div>
          <div style={{ fontSize: 12, color: 'var(--niro-gold)', marginTop: 2 }}>{session.modality} &middot; {session.packageName}</div>
          <div style={{ fontSize: 13, color: 'var(--niro-muted)', marginTop: 4 }}>{session.date} &middot; {session.time} &middot; {session.duration} min</div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--niro-border)', paddingTop: 12, display: 'flex', gap: 8 }}>
        {isUpcoming ? (
          <>
            <button style={{ flex: 1, padding: 9, borderRadius: 8, border: 'none', background: 'var(--niro-green)', color: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Join session</button>
            <button style={{ flex: 1, padding: 9, borderRadius: 8, border: '1px solid var(--niro-border)', background: 'none', color: 'var(--niro-muted)', fontSize: 13, cursor: 'pointer' }}>Reschedule</button>
          </>
        ) : (
          <>
            <button style={{ flex: 1, padding: 9, borderRadius: 8, border: '1px solid var(--niro-border)', background: 'none', color: 'var(--niro-ink)', fontSize: 13, cursor: 'pointer' }}>View notes</button>
            <button style={{ flex: 1, padding: 9, borderRadius: 8, border: 'none', background: 'var(--niro-green)', color: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Book again</button>
          </>
        )}
      </div>
    </div>
  );
}

export default function SessionsDashboard() {
  const { state } = useApp();
  const [tab, setTab] = useState('upcoming');
  const filtered = state.sessions.filter(s => s.status === tab);

  return (
    <div style={{ paddingBottom: 120 }}>
      <div style={{ padding: '48px 16px 0', background: 'var(--niro-white)', borderBottom: '1px solid var(--niro-border)' }}>
        <h2 style={{ fontSize: 22, fontFamily: 'Instrument Serif, serif', color: 'var(--niro-ink)', marginBottom: 16 }}>My sessions</h2>
        <div style={{ display: 'flex' }}>
          {['upcoming', 'past'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: 10, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: '2px solid ' + (tab === t ? 'var(--niro-green)' : 'transparent'),
              color: tab === t ? 'var(--niro-green)' : 'var(--niro-muted)',
              fontWeight: tab === t ? 500 : 400, textTransform: 'capitalize',
            }}>{t}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: 16 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontSize: 14, color: 'var(--niro-muted)' }}>No {tab} sessions yet.</p>
          </div>
        ) : filtered.map(s => <SessionCard key={s.id} session={s} />)}
      </div>
    </div>
  );
}
