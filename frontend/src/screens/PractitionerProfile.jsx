import { ArrowLeft, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PACKAGES, MOCK_REVIEWS } from '../data/practitioners';

export default function PractitionerProfile() {
  const { state, navigate, startBooking, openMira } = useApp();
  const p = state.selectedPractitioner;
  if (!p) return null;

  const packages = PACKAGES[p.id] || [];
  const reviews = MOCK_REVIEWS[p.id] || [];
  const initials = p.name.split(' ').map(n => n[0]).join('');

  return (
    <div style={{ paddingBottom: 120 }}>
      <div style={{ background: 'var(--niro-green)', padding: '48px 20px 28px' }}>
        <button onClick={() => navigate('practitioners')} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--niro-gold)', color: 'var(--niro-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 600 }}>{initials}</div>
          <div>
            <div style={{ fontSize: 20, fontFamily: 'Instrument Serif, serif', color: 'white' }}>{p.name}</div>
            <div style={{ fontSize: 13, color: 'var(--niro-gold)', marginTop: 3 }}>{p.modality}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{p.tagline}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
              {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="var(--niro-gold)" color="var(--niro-gold)" />)}
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginLeft: 4 }}>5.0 &middot; 47 sessions</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 16px' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: 'var(--niro-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>What I can help with</div>
          <p style={{ fontSize: 14, color: 'var(--niro-ink)', lineHeight: 1.7, fontStyle: 'italic' }}>"{p.careerNote}"</p>
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: 'var(--niro-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>About</div>
          <p style={{ fontSize: 14, color: 'var(--niro-ink)', lineHeight: 1.7 }}>{p.bio}</p>
        </div>

        {packages.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: 'var(--niro-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Sessions</div>
            {packages.map(pkg => (
              <div key={pkg.id} style={{ background: 'var(--niro-white)', border: '1px solid var(--niro-border)', borderRadius: 12, padding: 14, marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--niro-ink)' }}>{pkg.name}</div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--niro-green)' }}>&#x20B9;{pkg.price}</div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--niro-muted)', marginBottom: 6 }}>{pkg.sessions} session{pkg.sessions > 1 ? 's' : ''} &middot; {pkg.duration} min</div>
                <p style={{ fontSize: 13, color: 'var(--niro-muted)', lineHeight: 1.5 }}>{pkg.description}</p>
              </div>
            ))}
          </div>
        )}

        {reviews.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: 'var(--niro-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>What people say</div>
            {reviews.map((r, i) => (
              <div key={i} style={{ background: 'var(--niro-white)', border: '1px solid var(--niro-border)', borderRadius: 12, padding: 14, marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--niro-ink)' }}>{r.author}</span>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {Array(r.rating).fill(0).map((_, j) => <Star key={j} size={11} fill="var(--niro-gold)" color="var(--niro-gold)" />)}
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--niro-muted)', lineHeight: 1.5 }}>{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '0 16px 16px', display: 'flex', gap: 10 }}>
        <button onClick={() => openMira()} style={{ flex: 1, padding: 14, borderRadius: 12, border: '1px solid var(--niro-border)', background: 'none', color: 'var(--niro-green)', fontSize: 14, cursor: 'pointer' }}>
          Talk to Mira first
        </button>
        <button onClick={() => startBooking(p)} style={{ flex: 1, padding: 14, borderRadius: 12, border: 'none', background: 'var(--niro-green)', color: 'white', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
          Book a session
        </button>
      </div>
    </div>
  );
}
