import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { PRIMARY_TILES, CHIPS } from '../data/tiles';
import { useApp } from '../context/AppContext';

const FILTERS = ['Career', 'Money', 'Workplace', 'Growth'];

function TopicTile({ title, subtitle, onTap }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onClick={onTap}
      style={{
        background: 'var(--niro-white)',
        border: `1px solid ${pressed ? 'var(--niro-green-mid)' : 'var(--niro-border)'}`,
        borderRadius: 14, padding: '14px 12px',
        textAlign: 'left', cursor: 'pointer', width: '100%',
        transform: pressed ? 'scale(0.97)' : 'scale(1)',
        transition: 'all 0.1s ease',
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--niro-ink)', marginBottom: 4 }}>
        {title}
      </div>
      <div style={{ fontSize: 13, fontWeight: 300, color: 'var(--niro-muted)' }}>
        {subtitle}
      </div>
    </button>
  );
}

export default function HomeScreen() {
  const { state, openMira } = useApp();
  const [activeFilter, setActiveFilter] = useState('Career');
  const name = state.user.name;

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div style={{ paddingBottom: 120 }}>
      <div style={{ background: 'var(--niro-green)', padding: '48px 20px 28px' }}>
        <div style={{ fontSize: 14, fontWeight: 300, color: 'var(--niro-gold)', marginBottom: 6 }}>
          {getGreeting()}{name ? `, ${name}` : ''}
        </div>
        <h1 style={{ fontSize: 26, fontFamily: 'Instrument Serif, serif', color: 'var(--niro-cream)', lineHeight: 1.3, marginBottom: 20 }}>
          What's going on at<br />work right now?
        </h1>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
              background: activeFilter === f ? 'var(--niro-gold)' : 'rgba(255,255,255,0.12)',
              color: activeFilter === f ? 'var(--niro-green)' : 'rgba(255,255,255,0.8)',
              fontSize: 13, fontWeight: activeFilter === f ? 500 : 400, whiteSpace: 'nowrap',
            }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 16px' }}>
        <div style={{ fontSize: 13, color: 'var(--niro-muted)', fontWeight: 400, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          What's your situation?
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {PRIMARY_TILES.map(tile => (
            <TopicTile key={tile.id} title={tile.title} subtitle={tile.subtitle} onTap={() => openMira(tile.id, tile.miraOpener)} />
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--niro-ink)' }}>More situations</span>
          <button style={{ fontSize: 13, color: 'var(--niro-green-mid)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}>
            See all <ChevronRight size={14} />
          </button>
        </div>

        <div style={{ overflowX: 'auto', marginBottom: 28, paddingBottom: 4 }}>
          <div style={{ display: 'flex', gap: 8, width: 'max-content' }}>
            {CHIPS.map(chip => (
              <button key={chip} onClick={() => openMira(null, `I hear you — "${chip}" is something a lot of people deal with. What's your specific situation?`)}
                style={{ padding: '8px 14px', borderRadius: 20, whiteSpace: 'nowrap', background: 'var(--niro-cream-dark)', border: '1px solid var(--niro-border)', fontSize: 13, color: 'var(--niro-ink)', cursor: 'pointer' }}>
                {chip}
              </button>
            ))}
          </div>
        </div>

        {state.user.hasCompletedGate && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--niro-ink)', marginBottom: 12 }}>Practitioners for you</div>
            <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
              <div style={{ display: 'flex', gap: 10, width: 'max-content' }}>
                {[{ id: 'p3', name: 'Kavita Matani', modality: 'Tarot' }, { id: 'p5', name: 'Priya Sharma', modality: 'Career Coach' }, { id: 'p1', name: 'SK Narula', modality: 'Vedic Astrology' }].map(p => (
                  <div key={p.id} style={{ background: 'var(--niro-white)', border: '1px solid var(--niro-border)', borderRadius: 12, padding: '12px 14px', width: 160, flexShrink: 0 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--niro-green)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
                      {p.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--niro-ink)' }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--niro-muted)', marginTop: 2 }}>{p.modality}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
