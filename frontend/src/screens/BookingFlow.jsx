import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PACKAGES } from '../data/practitioners';

const MOCK_SLOTS = [
  { date: 'Today', time: '6:00 PM', full: 'Today at 6:00 PM' },
  { date: 'Tomorrow', time: '10:00 AM', full: 'Tomorrow at 10:00 AM' },
  { date: 'Tomorrow', time: '4:00 PM', full: 'Tomorrow at 4:00 PM' },
  { date: 'Thu', time: '11:00 AM', full: 'Thursday at 11:00 AM' },
  { date: 'Thu', time: '5:00 PM', full: 'Thursday at 5:00 PM' },
];

export default function BookingFlow() {
  const { state, navigate, addSession } = useApp();
  const p = state.bookingPractitioner;
  const [step, setStep] = useState(1);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [form, setForm] = useState({ q1: '', q2: '', q3: '' });
  const [selectedSlot, setSelectedSlot] = useState(null);

  if (!p) return null;
  const packages = PACKAGES[p.id] || [];
  const firstName = p.name.split(' ')[0];

  const handleConfirm = () => {
    addSession({
      id: Date.now().toString(),
      practitionerId: p.id,
      practitionerName: p.name,
      modality: p.modality,
      packageName: selectedPkg?.name || 'Session',
      date: selectedSlot?.date || 'Upcoming',
      time: selectedSlot?.time || 'TBD',
      duration: selectedPkg?.duration || 60,
      price: selectedPkg?.price || 0,
      status: 'upcoming',
    });
    setStep(4);
  };

  const STEP_TITLES = ['', 'Choose a session', 'Help ' + firstName + ' prepare', 'Pick a time', "You're booked"];

  return (
    <div style={{ paddingBottom: 120 }}>
      <div style={{ padding: '48px 16px 16px', background: 'var(--niro-white)', borderBottom: '1px solid var(--niro-border)' }}>
        <button onClick={() => step > 1 ? setStep(s => s - 1) : navigate('practitioner_profile')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--niro-muted)', marginBottom: 12 }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ fontSize: 12, color: 'var(--niro-muted)', marginBottom: 4 }}>Step {step} of 4</div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
          {[1,2,3,4].map(i => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? 'var(--niro-green)' : 'var(--niro-border)' }} />)}
        </div>
        <h2 style={{ fontSize: 18, fontFamily: 'Instrument Serif, serif', color: 'var(--niro-ink)' }}>{STEP_TITLES[step]}</h2>
      </div>

      <div style={{ padding: 16 }}>
        {step === 1 && (
          <div>
            {packages.map(pkg => (
              <button key={pkg.id} onClick={() => setSelectedPkg(pkg)} style={{
                width: '100%', background: 'var(--niro-white)', textAlign: 'left',
                border: '2px solid ' + (selectedPkg?.id === pkg.id ? 'var(--niro-green)' : 'var(--niro-border)'),
                borderRadius: 12, padding: 14, marginBottom: 10, cursor: 'pointer',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--niro-ink)' }}>{pkg.name}</div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--niro-green)' }}>&#x20B9;{pkg.price}</div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--niro-muted)', marginBottom: 4 }}>{pkg.sessions} session{pkg.sessions > 1 ? 's' : ''} &middot; {pkg.duration} min</div>
                <p style={{ fontSize: 13, color: 'var(--niro-muted)', lineHeight: 1.4 }}>{pkg.description}</p>
              </button>
            ))}
            <button onClick={() => selectedPkg && setStep(2)} style={{ width: '100%', padding: 14, borderRadius: 12, border: 'none', background: selectedPkg ? 'var(--niro-green)' : 'var(--niro-border)', color: 'white', fontSize: 15, fontWeight: 500, cursor: selectedPkg ? 'pointer' : 'default', marginTop: 8 }}>
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            {[
              { key: 'q1', label: "What's the main career situation you want to address?", rows: 3 },
              { key: 'q2', label: "Have you worked with an astrologer or coach before? What was helpful?", rows: 2 },
              { key: 'q3', label: 'Is there a decision or deadline making this urgent?', rows: 2 },
            ].map(({ key, label, rows }) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, color: 'var(--niro-ink)', marginBottom: 8, lineHeight: 1.5 }}>{label}</div>
                <textarea value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} rows={rows}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--niro-border)', fontSize: 14, color: 'var(--niro-ink)', resize: 'none', outline: 'none', background: 'var(--niro-white)' }} />
              </div>
            ))}
            <button onClick={() => setStep(3)} style={{ width: '100%', padding: 14, borderRadius: 12, border: 'none', background: 'var(--niro-green)', color: 'white', fontSize: 15, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <div style={{ marginBottom: 16, fontSize: 13, color: 'var(--niro-muted)' }}>Available slots</div>
            {MOCK_SLOTS.map((slot, i) => (
              <button key={i} onClick={() => setSelectedSlot(slot)} style={{
                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: 14, borderRadius: 10, marginBottom: 8,
                border: '1.5px solid ' + (selectedSlot?.full === slot.full ? 'var(--niro-green)' : 'var(--niro-border)'),
                background: selectedSlot?.full === slot.full ? 'rgba(28,58,42,0.04)' : 'var(--niro-white)',
                cursor: 'pointer',
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--niro-ink)' }}>{slot.date}</div>
                  <div style={{ fontSize: 13, color: 'var(--niro-muted)' }}>{slot.time}</div>
                </div>
                {selectedSlot?.full === slot.full && <Check size={16} color="var(--niro-green)" />}
              </button>
            ))}
            <button onClick={() => selectedSlot && handleConfirm()} style={{ width: '100%', padding: 14, borderRadius: 12, border: 'none', marginTop: 8, background: selectedSlot ? 'var(--niro-green)' : 'var(--niro-border)', color: 'white', fontSize: 15, fontWeight: 500, cursor: selectedSlot ? 'pointer' : 'default' }}>
              Confirm booking
            </button>
          </div>
        )}

        {step === 4 && (
          <div style={{ textAlign: 'center', paddingTop: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(28,58,42,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Check size={28} color="var(--niro-green)" />
            </div>
            <h2 style={{ fontSize: 22, fontFamily: 'Instrument Serif, serif', color: 'var(--niro-ink)', marginBottom: 8 }}>Booked</h2>
            <div style={{ background: 'var(--niro-white)', border: '1px solid var(--niro-border)', borderRadius: 14, padding: 16, marginTop: 20, marginBottom: 24, textAlign: 'left' }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--niro-ink)', marginBottom: 4 }}>Session with {p.name}</div>
              <div style={{ fontSize: 13, color: 'var(--niro-muted)' }}>{selectedSlot?.full} &middot; {selectedPkg?.duration} min &middot; &#x20B9;{selectedPkg?.price}</div>
              <p style={{ fontSize: 13, color: 'var(--niro-muted)', marginTop: 10, lineHeight: 1.5 }}>{firstName} will receive a brief about your situation before the session.</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={{ flex: 1, padding: 13, borderRadius: 10, border: '1px solid var(--niro-border)', background: 'none', color: 'var(--niro-ink)', fontSize: 14, cursor: 'pointer' }}>Add to calendar</button>
              <button onClick={() => navigate('home')} style={{ flex: 1, padding: 13, borderRadius: 10, border: 'none', background: 'var(--niro-green)', color: 'white', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Back to home</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
