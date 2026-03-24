import { useApp } from '../context/AppContext';

export default function ProfileScreen() {
  const { state, updateUser } = useApp();
  const { user } = state;

  return (
    <div style={{ paddingBottom: 120 }}>
      <div style={{ padding: '48px 16px 24px', background: 'var(--niro-green)' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--niro-gold)', color: 'var(--niro-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 600, marginBottom: 12 }}>
          {user.name ? user.name[0].toUpperCase() : '?'}
        </div>
        <div style={{ fontSize: 20, fontFamily: 'Instrument Serif, serif', color: 'white' }}>{user.name || 'Your profile'}</div>
        {user.phone && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>+91 {user.phone}</div>}
      </div>
      <div style={{ padding: 16 }}>
        {!user.hasCompletedGate && (
          <div style={{ background: 'rgba(196,151,58,0.1)', border: '1px solid rgba(196,151,58,0.3)', borderRadius: 12, padding: 14, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--niro-gold)', marginBottom: 4 }}>Complete your profile</div>
            <div style={{ fontSize: 13, color: 'var(--niro-muted)' }}>Chat with Mira to get personalised insights.</div>
          </div>
        )}
        <div style={{ background: 'var(--niro-white)', border: '1px solid var(--niro-border)', borderRadius: 12, overflow: 'hidden' }}>
          {[
            { label: 'Name', value: user.name || '\u2014' },
            { label: 'Phone', value: user.phone ? '+91 ' + user.phone : '\u2014' },
            { label: 'Birth date', value: user.birthDate || '\u2014' },
            { label: 'Birth place', value: user.birthPlace || '\u2014' },
          ].map(({ label, value }, i, arr) => (
            <div key={label} style={{ padding: '14px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--niro-border)' : 'none', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, color: 'var(--niro-muted)' }}>{label}</span>
              <span style={{ fontSize: 14, color: 'var(--niro-ink)' }}>{value}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => { updateUser({ name: null, phone: null, hasCompletedGate: false }); localStorage.clear(); window.location.reload(); }}
          style={{ marginTop: 24, width: '100%', padding: 13, borderRadius: 10, border: '1px solid var(--niro-border)', background: 'none', color: 'var(--niro-muted)', fontSize: 14, cursor: 'pointer' }}
        >
          Reset demo
        </button>
      </div>
    </div>
  );
}
