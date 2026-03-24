import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowUp, Share2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { callMira } from '../api/mira';
import { PRACTITIONERS } from '../data/practitioners';
import PhoneGate from './PhoneGate';

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '4px 16px' }}>
      <div style={{ display: 'flex', gap: 4, background: 'var(--niro-white)', padding: '10px 14px', borderRadius: 16, borderBottomLeftRadius: 4 }}>
        {[0, 1, 2].map(i => (
          <div key={i} className="typing-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--niro-muted)' }} />
        ))}
      </div>
    </div>
  );
}

function RecommendationCard({ recommendation, onBook, onProfile, onSelfServe }) {
  const practitioner = recommendation.practitionerId
    ? PRACTITIONERS.find(p => p.id === recommendation.practitionerId)
    : null;

  return (
    <div style={{ margin: '8px 16px', background: 'var(--niro-white)', border: '1px solid var(--niro-border)', borderRadius: 16, padding: 16 }}>
      {practitioner ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--niro-green)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 500, flexShrink: 0 }}>
              {practitioner.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--niro-ink)' }}>{practitioner.name}</div>
              <div style={{ fontSize: 13, color: 'var(--niro-muted)' }}>{practitioner.modality}</div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--niro-muted)', marginBottom: 14, lineHeight: 1.5, fontStyle: 'italic' }}>
            "{recommendation.whyThisTool}"
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onBook} style={{ flex: 1, padding: 10, borderRadius: 10, border: 'none', background: 'var(--niro-green)', color: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
              Book a session
            </button>
            <button onClick={onProfile} style={{ flex: 1, padding: 10, borderRadius: 10, border: '1px solid var(--niro-border)', background: 'none', color: 'var(--niro-ink)', fontSize: 13, cursor: 'pointer' }}>
              See profile
            </button>
          </div>
        </>
      ) : (
        <>
          <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--niro-ink)', marginBottom: 4 }}>{recommendation.toolName}</div>
          <div style={{ fontSize: 12, color: 'var(--niro-muted)', marginBottom: 8 }}>10 minutes · Self-guided</div>
          <p style={{ fontSize: 13, color: 'var(--niro-muted)', marginBottom: 14, lineHeight: 1.5, fontStyle: 'italic' }}>
            "{recommendation.whyThisTool}"
          </p>
          <button onClick={onSelfServe} style={{ width: '100%', padding: 10, borderRadius: 10, border: 'none', background: 'var(--niro-green)', color: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            Start now
          </button>
        </>
      )}
    </div>
  );
}

function ArtefactCard({ artefact }) {
  const handleShare = async () => {
    const text = '"' + artefact + '" \u2014 Niro';
    if (navigator.share) {
      await navigator.share({ text }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(text).catch(() => {});
      alert('Copied to clipboard!');
    }
  };

  return (
    <div style={{ margin: '8px 16px' }}>
      <div style={{ background: 'var(--niro-white)', borderRadius: 16, padding: '24px 20px', boxShadow: '0 2px 16px rgba(28,58,42,0.08)' }}>
        <p style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontSize: 17, color: 'var(--niro-gold)', lineHeight: 1.6, marginBottom: 16 }}>
          "{artefact}"
        </p>
        <div style={{ fontSize: 11, color: 'var(--niro-muted)', letterSpacing: '0.08em' }}>&middot; Niro</div>
      </div>
      <button onClick={handleShare} style={{ marginTop: 10, width: '100%', padding: 10, borderRadius: 10, border: '1px solid var(--niro-border)', background: 'none', color: 'var(--niro-ink)', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <Share2 size={14} /> Share this
      </button>
    </div>
  );
}

export default function MiraScreen() {
  const { state, updateMira, closeMira, viewPractitioner, startBooking, navigate } = useApp();
  const { mira, user } = state;
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const [pendingMessage, setPendingMessage] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mira.messages, isTyping]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const isFirst = mira.messages.filter(m => m.role === 'user').length === 0;
    if (isFirst && !user.hasCompletedGate) {
      setPendingMessage(text);
      setShowGate(true);
      return;
    }

    const userMsg = { role: 'user', content: text };
    const newMessages = [...mira.messages, userMsg];
    const newCount = mira.userMessageCount + 1;

    let newPhase = mira.phase;
    if (mira.phase === 'reflection' && newCount >= 3) newPhase = 'qualification';
    else if (mira.phase === 'qualification' && newCount >= 5) newPhase = 'recommendation';

    updateMira({ messages: newMessages, userMessageCount: newCount, phase: newPhase });
    setInput('');
    setIsTyping(true);

    try {
      const response = await callMira(newMessages, newPhase, user.name);

      if (newPhase === 'recommendation') {
        try {
          const jsonMatch = response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const rec = JSON.parse(jsonMatch[0]);
            updateMira({
              messages: [...newMessages, { role: 'assistant', content: rec.summary }],
              recommendation: rec,
              artefact: rec.artefact,
            });
          } else {
            updateMira({ messages: [...newMessages, { role: 'assistant', content: response }] });
          }
        } catch {
          updateMira({ messages: [...newMessages, { role: 'assistant', content: response }] });
        }
      } else {
        updateMira({ messages: [...newMessages, { role: 'assistant', content: response }] });
      }
    } catch (err) {
      const msg = err.message.includes('VITE_ANTHROPIC_API_KEY')
        ? 'To chat with Mira, add VITE_ANTHROPIC_API_KEY to your .env file.'
        : 'Something went wrong. Please try again.';
      updateMira({ messages: [...newMessages, { role: 'assistant', content: msg }] });
    } finally {
      setIsTyping(false);
    }
  };

  const handleGateComplete = () => {
    setShowGate(false);
    if (pendingMessage) {
      const msg = pendingMessage;
      setPendingMessage(null);
      setTimeout(() => sendMessage(msg), 100);
    }
  };

  const getPhaseLabel = (idx) => {
    const count = mira.messages.slice(0, idx).filter(m => m.role === 'user').length;
    if (count === 3) return 'Getting clearer\u2026';
    if (count === 5) return 'Almost there\u2026';
    return null;
  };

  if (showGate) return <PhoneGate onComplete={handleGateComplete} />;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--niro-cream)', zIndex: 60, display: 'flex', flexDirection: 'column', maxWidth: 430, margin: '0 auto' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--niro-border)', background: 'var(--niro-white)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={closeMira} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <ArrowLeft size={20} color="var(--niro-ink)" />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--niro-ink)' }}>Mira</span>
            <div className="mira-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--niro-gold)' }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--niro-muted)' }}>Career clarity AI</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
        {mira.messages.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>&#10022;</div>
            <p style={{ fontSize: 15, color: 'var(--niro-muted)', lineHeight: 1.6 }}>Tell me what's going on. I'm here.</p>
          </div>
        )}

        {mira.messages.map((msg, idx) => {
          const phaseLabel = getPhaseLabel(idx);
          return (
            <div key={idx}>
              {phaseLabel && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px' }}>
                  <div style={{ flex: 1, height: 1, background: 'var(--niro-border)' }} />
                  <span style={{ fontSize: 11, color: 'var(--niro-muted)', letterSpacing: '0.06em' }}>{phaseLabel}</span>
                  <div style={{ flex: 1, height: 1, background: 'var(--niro-border)' }} />
                </div>
              )}
              <div className="message-in" style={{ padding: '4px 16px', display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', borderRadius: 16,
                  borderBottomLeftRadius: msg.role === 'assistant' ? 4 : 16,
                  borderBottomRightRadius: msg.role === 'user' ? 4 : 16,
                  background: msg.role === 'user' ? 'var(--niro-green)' : 'var(--niro-white)',
                  color: msg.role === 'user' ? 'white' : 'var(--niro-ink)',
                  fontSize: 14, lineHeight: 1.6,
                  boxShadow: msg.role === 'assistant' ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                }}>
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && <TypingIndicator />}

        {mira.recommendation && (
          <RecommendationCard
            recommendation={mira.recommendation}
            onBook={() => {
              const p = PRACTITIONERS.find(pr => pr.id === mira.recommendation.practitionerId);
              if (p) { closeMira(); startBooking(p); }
            }}
            onProfile={() => {
              const p = PRACTITIONERS.find(pr => pr.id === mira.recommendation.practitionerId);
              if (p) { closeMira(); viewPractitioner(p); }
            }}
            onSelfServe={() => { navigate('self_serve'); closeMira(); }}
          />
        )}

        {mira.artefact && <ArtefactCard artefact={mira.artefact} />}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '10px 14px 20px', background: 'var(--niro-white)', borderTop: '1px solid var(--niro-border)', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
          placeholder="Tell Mira what's going on\u2026"
          rows={1}
          style={{ flex: 1, padding: '10px 14px', borderRadius: 12, border: '1px solid var(--niro-border)', fontSize: 14, resize: 'none', outline: 'none', lineHeight: 1.5, color: 'var(--niro-ink)', background: 'var(--niro-cream)', maxHeight: 100, overflowY: 'auto' }}
        />
        <button onClick={() => sendMessage(input)} style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: input.trim() ? 'var(--niro-green)' : 'var(--niro-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <ArrowUp size={16} color="white" />
        </button>
      </div>
    </div>
  );
}
