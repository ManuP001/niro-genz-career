import { ArrowUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function MiraBar() {
  const { openMira } = useApp();

  return (
    <div
      onClick={() => openMira()}
      style={{
        position: 'fixed', bottom: 56, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430,
        background: 'var(--niro-white)', borderTop: '1px solid var(--niro-border)',
        padding: '10px 14px 8px', display: 'flex', alignItems: 'center', gap: 10,
        cursor: 'pointer', zIndex: 40,
      }}
    >
      <div className="mira-dot" style={{
        width: 8, height: 8, borderRadius: '50%', background: 'var(--niro-gold)', flexShrink: 0,
      }} />
      <span style={{ flex: 1, fontSize: 14, color: 'var(--niro-muted)', fontWeight: 300 }}>
        Tell Mira what's going on…
      </span>
      <div style={{
        width: 28, height: 28, borderRadius: '50%', background: 'var(--niro-green)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <ArrowUp size={14} color="white" />
      </div>
    </div>
  );
}
