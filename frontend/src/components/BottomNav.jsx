import { Home, Search, Calendar, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'practitioners', label: 'Find help', Icon: Search },
  { id: 'sessions', label: 'Sessions', Icon: Calendar },
  { id: 'profile', label: 'Profile', Icon: User },
];

export default function BottomNav() {
  const { state, navigate } = useApp();
  const current = state.currentScreen;

  return (
    <nav className="bottom-nav-mobile" style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 560, height: 56,
      background: 'var(--niro-white)', borderTop: '1px solid var(--niro-border)',
      display: 'flex', alignItems: 'center', zIndex: 50,
    }}>
      {NAV_ITEMS.map(({ id, label, Icon }) => {
        const active = current === id;
        return (
          <button
            key={id}
            onClick={() => navigate(id)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 2, padding: '6px 0', background: 'none', border: 'none', cursor: 'pointer',
              color: active ? 'var(--niro-green)' : 'var(--niro-muted)',
            }}
          >
            <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
            <span style={{ fontSize: 10, fontWeight: active ? 500 : 400 }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
