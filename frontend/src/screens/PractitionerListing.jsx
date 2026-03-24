import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { PRACTITIONERS } from '../data/practitioners';
import { useApp } from '../context/AppContext';

const FILTER_TYPES = ['All', '1:1', 'Workshops', 'Circles'];

function InitialsAvatar({ name, size = 48 }) {
  const initials = name.split(' ').map(n => n[0]).join('');
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: 'var(--niro-green)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.32, fontWeight: 500, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function PractitionerCard({ practitioner, onView }) {
  return (
    <div style={{ background: 'var(--niro-white)', border: '1px solid var(--niro-border)', borderRadius: 14, padding: 16, marginBottom: 10 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
        <InitialsAvatar name={practitioner.name} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--niro-ink)' }}>{practitioner.name}</div>
              <div style={{ fontSize: 12, color: 'var(--niro-gold)', marginTop: 2 }}>{practitioner.modality}</div>
            </div>
            {practitioner.freeIntro && (
              <span style={{ fontSize: 10, background: 'rgba(196,151,58,0.12)', color: 'var(--niro-gold)', padding: '3px 8px', borderRadius: 20, fontWeight: 500 }}>Free intro</span>
            )}
          </div>
          <p style={{ fontSize: 13, color: 'var(--niro-muted)', marginTop: 4, lineHeight: 1.4 }}>{practitioner.tagline}</p>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
        {practitioner.topics.map(t => (
          <span key={t} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, border: '1px solid var(--niro-green-light)', color: 'var(--niro-green-mid)' }}>{t}</span>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 12, color: 'var(--niro-muted)' }}>
          {practitioner.isPeerMentor ? 'Peer mentor' : practitioner.experience + ' yrs'} &middot; {practitioner.languages.join(', ')}
        </div>
        <button onClick={onView} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: 'var(--niro-green)', color: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
          View profile
        </button>
      </div>
    </div>
  );
}

export default function PractitionerListing() {
  const { viewPractitioner } = useApp();
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <div style={{ paddingBottom: 120 }}>
      <div style={{ padding: '48px 16px 16px', background: 'var(--niro-white)', borderBottom: '1px solid var(--niro-border)' }}>
        <h2 style={{ fontSize: 22, fontFamily: 'Instrument Serif, serif', color: 'var(--niro-ink)', marginBottom: 16 }}>Find someone to help</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 8, flex: 1, overflowX: 'auto' }}>
            {FILTER_TYPES.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)} style={{
                padding: '7px 14px', borderRadius: 20,
                border: '1px solid ' + (activeFilter === f ? 'var(--niro-green)' : 'var(--niro-border)'),
                background: activeFilter === f ? 'var(--niro-green)' : 'none',
                color: activeFilter === f ? 'white' : 'var(--niro-muted)',
                fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap',
              }}>{f}</button>
            ))}
          </div>
          <button style={{ padding: '7px 10px', borderRadius: 20, border: '1px solid var(--niro-border)', background: 'none', cursor: 'pointer', flexShrink: 0 }}>
            <SlidersHorizontal size={15} color="var(--niro-muted)" />
          </button>
        </div>
      </div>
      <div style={{ padding: 16 }}>
        {PRACTITIONERS.map(p => (
          <PractitionerCard key={p.id} practitioner={p} onView={() => viewPractitioner(p)} />
        ))}
      </div>
    </div>
  );
}
