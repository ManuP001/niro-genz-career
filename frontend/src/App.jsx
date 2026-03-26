import { AppProvider, useApp } from './context/AppContext';
import BottomNav from './components/BottomNav';
import MiraBar from './components/MiraBar';
import MiraScreen from './screens/MiraScreen';
import HomeScreen from './screens/HomeScreen';
import PractitionerListing from './screens/PractitionerListing';
import PractitionerProfile from './screens/PractitionerProfile';
import BookingFlow from './screens/BookingFlow';
import SelfServeTool from './screens/SelfServeTool';
import SessionsDashboard from './screens/SessionsDashboard';
import ProfileScreen from './screens/ProfileScreen';

// Desktop right-panel idle state shown when no conversation is active
function MiraPanelWelcome() {
  const { openMira } = useApp();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px 32px', gap: 24 }}>
      <div style={{ textAlign: 'center' }}>
        <div className="mira-dot" style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--niro-gold)', margin: '0 auto 16px' }} />
        <div style={{ fontSize: 20, fontWeight: 500, color: 'var(--niro-ink)', marginBottom: 8 }}>Mira</div>
        <p style={{ fontSize: 15, color: 'var(--niro-muted)', lineHeight: 1.6, maxWidth: 260 }}>
          What's going on at work right now?
        </p>
      </div>
      <div
        onClick={() => openMira()}
        style={{ width: '100%', maxWidth: 320, padding: '12px 16px', borderRadius: 12, border: '1px solid var(--niro-border)', background: 'var(--niro-white)', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
      >
        <span style={{ flex: 1, fontSize: 14, color: 'var(--niro-muted)', fontWeight: 300 }}>Tell Mira what's going on…</span>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--niro-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const { state } = useApp();
  const { currentScreen, mira } = state;

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home': return <HomeScreen />;
      case 'practitioners': return <PractitionerListing />;
      case 'practitioner_profile': return <PractitionerProfile />;
      case 'booking': return <BookingFlow />;
      case 'sessions': return <SessionsDashboard />;
      case 'self_serve': return <SelfServeTool />;
      case 'profile': return <ProfileScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <div className="app-root">
      {/* Left column — main content, always visible */}
      <div className="content-column" style={{ paddingBottom: 108 }}>
        {renderScreen()}
        {!mira.isOpen && <MiraBar className="mira-bar-mobile" />}
        <BottomNav className="bottom-nav-mobile" />
      </div>

      {/* Right column — desktop Mira panel (shown via CSS at ≥1024px) */}
      <div className="mira-panel">
        {mira.isOpen ? <MiraScreen isPanel /> : <MiraPanelWelcome />}
      </div>

      {/* Mobile full-screen Mira overlay (hidden on desktop via CSS) */}
      {mira.isOpen && (
        <div className="mira-mobile-fullscreen">
          <MiraScreen />
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
