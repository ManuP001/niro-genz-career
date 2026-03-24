import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

const DEFAULT_STATE = {
  user: {
    name: null,
    phone: null,
    birthDate: null,
    birthTime: null,
    birthPlace: null,
    hasCompletedGate: false,
  },
  mira: {
    isOpen: false,
    entryTopic: null,
    messages: [],
    phase: 'reflection',
    userMessageCount: 0,
    recommendation: null,
    artefact: null,
  },
  sessions: [
    { id: 's1', practitionerId: 'p3', practitionerName: 'Kavita Matani', modality: 'Tarot', packageName: 'Decision clarity session', date: 'Tomorrow', time: '4:00 PM', duration: 60, price: 1200, status: 'upcoming' },
    { id: 's2', practitionerId: 'p5', practitionerName: 'Priya Sharma', modality: 'Career Coach', packageName: 'Strategy session', date: 'Last Monday', time: '11:00 AM', duration: 60, price: 2000, status: 'past' },
  ],
  currentScreen: 'home',
  selectedPractitioner: null,
  bookingPractitioner: null,
};

function loadState() {
  try {
    const saved = localStorage.getItem('niro_state');
    if (!saved) return DEFAULT_STATE;
    const parsed = JSON.parse(saved);
    return {
      ...DEFAULT_STATE,
      ...parsed,
      mira: { ...DEFAULT_STATE.mira, ...parsed.mira, isOpen: false },
      sessions: DEFAULT_STATE.sessions,
      currentScreen: 'home',
      selectedPractitioner: null,
      bookingPractitioner: null,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function AppProvider({ children }) {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    const { currentScreen, selectedPractitioner, bookingPractitioner, ...toSave } = state;
    localStorage.setItem('niro_state', JSON.stringify(toSave));
  }, [state]);

  const updateUser = (updates) =>
    setState(s => ({ ...s, user: { ...s.user, ...updates } }));

  const updateMira = (updates) =>
    setState(s => ({ ...s, mira: { ...s.mira, ...updates } }));

  const navigate = (screen) =>
    setState(s => ({ ...s, currentScreen: screen }));

  const openMira = (topic = null, opener = null) => {
    setState(s => {
      const newMessages = opener && s.mira.messages.length === 0
        ? [{ role: 'assistant', content: opener }]
        : s.mira.messages;
      return { ...s, mira: { ...s.mira, isOpen: true, entryTopic: topic, messages: newMessages } };
    });
  };

  const closeMira = () =>
    setState(s => ({ ...s, mira: { ...s.mira, isOpen: false } }));

  const addSession = (session) =>
    setState(s => ({ ...s, sessions: [session, ...s.sessions] }));

  const viewPractitioner = (practitioner) =>
    setState(s => ({ ...s, selectedPractitioner: practitioner, currentScreen: 'practitioner_profile' }));

  const startBooking = (practitioner) =>
    setState(s => ({ ...s, bookingPractitioner: practitioner, currentScreen: 'booking' }));

  return (
    <AppContext.Provider value={{ state, updateUser, updateMira, navigate, openMira, closeMira, addSession, viewPractitioner, startBooking }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
