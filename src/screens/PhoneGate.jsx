import { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

function InputField({ label, value, onChange, placeholder, type = 'text', prefix }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ fontSize: 12, color: 'var(--niro-muted)', marginBottom: 6 }}>{label}</div>}
      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--niro-border)', borderRadius: 10, overflow: 'hidden', background: 'var(--niro-white)' }}>
        {prefix && <span style={{ padding: '12px 10px', fontSize: 14, color: 'var(--niro-muted)', borderRight: '1px solid var(--niro-border)' }}>{prefix}</span>}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ flex: 1, padding: '12px 14px', fontSize: 14, border: 'none', outline: 'none', color: 'var(--niro-ink)', background: 'transparent' }}
        />
      </div>
    </div>
  );
}

export default function PhoneGate({ onComplete }) {
  const { updateUser } = useApp();
  const [step, setStep] = useState('name_phone');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');

  const handleOtpChange = (i, val) => {
    const newOtp = [...otp];
    newOtp[i] = val;
    setOtp(newOtp);
    if (val && i < 3) {
      document.getElementById(`otp-${i + 1}`)?.focus();
    }
  };

  const completeGate = (includeBirth) => {
    updateUser({
      name, phone,
      birthDate: includeBirth ? birthDate : null,
      birthTime: includeBirth ? birthTime : null,
      birthPlace: includeBirth ? birthPlace : null,
      hasCompletedGate: true,
    });
    onComplete(name);
  };

  const baseStyle = {
    position: 'fixed', inset: 0, background: 'var(--niro-cream)', zIndex: 100,
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: 24, maxWidth: 430, margin: '0 auto',
  };

  const ctaBtn = (disabled) => ({
    width: '100%', padding: 14, borderRadius: 12, border: 'none',
    background: disabled ? 'var(--niro-border)' : 'var(--niro-green)',
    color: 'white', fontSize: 15, fontWeight: 500,
    cursor: disabled ? 'default' : 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  });

  return (
    <div style={baseStyle}>
      <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 28, color: 'var(--niro-gold)', marginBottom: 32 }}>
        Niro
      </div>

      {step === 'name_phone' && (
        <div style={{ width: '100%' }}>
          <p style={{ fontSize: 16, color: 'var(--niro-ink)', marginBottom: 24, lineHeight: 1.6, textAlign: 'center' }}>
            Before I share what I'm seeing —<br />
            what should I call you, and what's<br />
            your number?
          </p>
          <InputField placeholder="Your name" value={name} onChange={setName} />
          <InputField placeholder="Phone number" value={phone} onChange={setPhone} type="tel" prefix="+91" />
          <button onClick={() => name && phone && setStep('otp')} style={ctaBtn(!(name && phone))}>
            Continue <ArrowRight size={16} />
          </button>
        </div>
      )}

      {step === 'otp' && (
        <div style={{ width: '100%', textAlign: 'center' }}>
          <button onClick={() => setStep('name_phone')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--niro-muted)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 24, fontSize: 14 }}>
            <ArrowLeft size={16} /> Back
          </button>
          <p style={{ fontSize: 16, color: 'var(--niro-ink)', marginBottom: 8 }}>Enter the 4-digit code</p>
          <p style={{ fontSize: 13, color: 'var(--niro-muted)', marginBottom: 28 }}>sent to +91 {phone}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 28 }}>
            {otp.map((digit, i) => (
              <input key={i} id={`otp-${i}`} type="tel" maxLength={1} value={digit}
                onChange={e => handleOtpChange(i, e.target.value)}
                style={{ width: 52, height: 56, textAlign: 'center', fontSize: 22, fontWeight: 500, border: `2px solid ${digit ? 'var(--niro-green)' : 'var(--niro-border)'}`, borderRadius: 10, color: 'var(--niro-ink)', outline: 'none', background: 'var(--niro-white)' }}
              />
            ))}
          </div>
          <button onClick={() => setStep('birth')} style={ctaBtn(false)}>Verify</button>
          <button style={{ marginTop: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--niro-green-mid)', fontSize: 13 }}>Resend code</button>
        </div>
      )}

      {step === 'birth' && (
        <div style={{ width: '100%' }}>
          <p style={{ fontSize: 16, color: 'var(--niro-ink)', marginBottom: 8, textAlign: 'center' }}>To go deeper, add your birth details</p>
          <p style={{ fontSize: 13, color: 'var(--niro-muted)', marginBottom: 24, textAlign: 'center' }}>I can use your chart to personalise what I share.</p>
          <InputField label="Birth date" placeholder="DD / MM / YYYY" value={birthDate} onChange={setBirthDate} />
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <InputField label="Birth time" placeholder="HH:MM" value={birthTime} onChange={setBirthTime} />
            </div>
            <button onClick={() => setBirthTime("don't know")} style={{ marginTop: 18, padding: '12px 10px', background: 'var(--niro-cream-dark)', border: '1px solid var(--niro-border)', borderRadius: 10, fontSize: 12, color: 'var(--niro-muted)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              I don't know
            </button>
          </div>
          <InputField label="Birth place" placeholder="City" value={birthPlace} onChange={setBirthPlace} />
          <button onClick={() => completeGate(true)} style={{ ...ctaBtn(false), marginBottom: 10 }}>Add details</button>
          <button onClick={() => completeGate(false)} style={{ width: '100%', padding: 14, borderRadius: 12, border: 'none', background: 'none', color: 'var(--niro-green-mid)', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            Skip for now <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
