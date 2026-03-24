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
    <div style={{
      maxWidth: 430,
      minHeight: '100vh',
      margin: '0 auto',
      background: 'var(--niro-cream)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ minHeight: '100vh', paddingBottom: 108 }}>
        {renderScreen()}
      </div>
      {!mira.isOpen && <MiraBar />}
      <BottomNav />
      {mira.isOpen && <MiraScreen />}
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
