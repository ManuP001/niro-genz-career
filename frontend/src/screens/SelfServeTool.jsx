import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { callMira } from '../api/mira';

const TOOLS = {
  energy_audit: {
    name: 'Energy audit',
    description: "What energised you vs. drained you in the last 2 weeks.",
    steps: [
      { type: 'multi_input', prompt: 'Think of 3 moments when you felt most like yourself at work. What were you doing?', count: 3, placeholder: 'Moment' },
      { type: 'multi_input', prompt: 'Now think of 3 moments when you felt most drained. What was happening?', count: 3, placeholder: 'Moment' },
    ],
  },
  fear_audit: {
    name: 'Fear audit',
    description: "Name what's actually stopping you.",
    fears: ['Fear of failure', 'Fear of judgement', 'Fear of losing identity', 'Fear of losing security'],
  },
  anti_goals: {
    name: 'Anti-goals',
    description: "Start with what you definitely don't want.",
    prompts: [
      "Name one work environment you would never thrive in.",
      "Name one type of task that drains you every time.",
      "Name one thing you would regret spending 5 years doing.",
      "Name one kind of manager or culture that makes you shut down.",
      "Name one version of your career at 30 that would feel like failure.",
    ],
  },
};

export default function SelfServeTool() {
  const { navigate, state } = useApp();
  const [toolKey, setToolKey] = useState(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedFear, setSelectedFear] = useState(null);
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(false);

  const tool = toolKey ? TOOLS[toolKey] : null;

  const generateInsight = async (allAnswers) => {
    setLoading(true);
    try {
      let prompt;
      if (toolKey === 'energy_audit') {
        const energising = Object.keys(allAnswers).filter(k => k.startsWith('e')).map(k => allAnswers[k]).filter(Boolean).join('; ');
        const draining = Object.keys(allAnswers).filter(k => k.startsWith('d')).map(k => allAnswers[k]).filter(Boolean).join('; ');
        prompt = 'Energy audit. Energising moments: ' + energising + '. Draining moments: ' + draining + '. Give a 2-sentence observation about their energy pattern.';
      } else if (toolKey === 'fear_audit') {
        prompt = 'The user biggest fear is "' + selectedFear + '". They said what would happen: "' + (allAnswers.follow_up || '') + '". Respond: "Here is what I notice about that fear: [specific observation]". 2 sentences max.';
      } else {
        const antiGoals = Object.values(allAnswers).filter(Boolean).join(' | ');
        prompt = 'Anti-goals: ' + antiGoals + '. Based on these, what is this person actually optimising for? Start with "Based on your anti-goals, here is what you are actually optimising for:". 2 sentences.';
      }
      const response = await callMira([{ role: 'user', content: prompt }], 'reflection', state.user.name);
      setInsight(response);
    } catch {
      setInsight('I can see clear patterns in what you shared. Add your API key to unlock full insights from Mira.');
    } finally {
      setLoading(false);
    }
  };

  const resetTool = () => { setToolKey(null); setStepIdx(0); setAnswers({}); setInsight(null); setSelectedFear(null); };

  if (!toolKey) {
    return (
      <div style={{ paddingBottom: 120 }}>
        <div style={{ padding: '48px 16px 20px', background: 'var(--niro-white)', borderBottom: '1px solid var(--niro-border)' }}>
          <h2 style={{ fontSize: 22, fontFamily: 'Instrument Serif, serif', color: 'var(--niro-ink)' }}>Self-serve tools</h2>
          <p style={{ fontSize: 14, color: 'var(--niro-muted)', marginTop: 6 }}>Short exercises to get clearer, on your own time.</p>
        </div>
        <div style={{ padding: 16 }}>
          {Object.entries(TOOLS).map(([key, t]) => (
            <button key={key} onClick={() => { setToolKey(key); setStepIdx(0); setAnswers({}); setInsight(null); setSelectedFear(null); }}
              style={{ width: '100%', background: 'var(--niro-white)', border: '1px solid var(--niro-border)', borderRadius: 14, padding: 16, marginBottom: 10, textAlign: 'left', cursor: 'pointer' }}>
              <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--niro-ink)', marginBottom: 4 }}>{t.name}</div>
              <div style={{ fontSize: 13, color: 'var(--niro-muted)' }}>{t.description}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const isAntiGoals = toolKey === 'anti_goals';
  const isFearAudit = toolKey === 'fear_audit';
  const isEnergyAudit = toolKey === 'energy_audit';
  const totalSteps = isAntiGoals ? tool.prompts.length : (isFearAudit ? 2 : tool.steps.length);

  return (
    <div style={{ paddingBottom: 120 }}>
      <div style={{ padding: '48px 16px 16px', background: 'var(--niro-white)', borderBottom: '1px solid var(--niro-border)' }}>
        <button onClick={resetTool} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--niro-muted)', marginBottom: 12, fontSize: 14 }}>
          <ArrowLeft size={16} /> Tools
        </button>
        <h2 style={{ fontSize: 20, fontFamily: 'Instrument Serif, serif', color: 'var(--niro-ink)' }}>{tool.name}</h2>
        {!insight && !loading && (
          <div style={{ display: 'flex', gap: 4, marginTop: 12 }}>
            {Array(totalSteps).fill(0).map((_, i) => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= stepIdx ? 'var(--niro-green)' : 'var(--niro-border)' }} />)}
          </div>
        )}
      </div>

      <div style={{ padding: 16 }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div className="mira-dot" style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--niro-gold)', margin: '0 auto 12px' }} />
            <p style={{ fontSize: 14, color: 'var(--niro-muted)' }}>Mira is thinking&hellip;</p>
          </div>
        )}

        {insight && !loading && (
          <div>
            <div style={{ background: 'var(--niro-white)', border: '1px solid var(--niro-border)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--niro-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>What Mira noticed</div>
              <p style={{ fontSize: 15, color: 'var(--niro-ink)', lineHeight: 1.7, fontStyle: 'italic' }}>{insight}</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={{ flex: 1, padding: 13, borderRadius: 10, border: '1px solid var(--niro-border)', background: 'none', color: 'var(--niro-ink)', fontSize: 14, cursor: 'pointer' }}>Save this insight</button>
              <button onClick={() => navigate('practitioners')} style={{ flex: 1, padding: 13, borderRadius: 10, border: 'none', background: 'var(--niro-green)', color: 'white', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Book a session</button>
            </div>
          </div>
        )}

        {!insight && !loading && isAntiGoals && (
          <div>
            <p style={{ fontSize: 16, color: 'var(--niro-ink)', lineHeight: 1.6, marginBottom: 20 }}>{tool.prompts[stepIdx]}</p>
            <textarea
              value={answers['anti_' + stepIdx] || ''}
              onChange={e => setAnswers(a => ({ ...a, ['anti_' + stepIdx]: e.target.value }))}
              rows={3}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--niro-border)', fontSize: 14, resize: 'none', outline: 'none', color: 'var(--niro-ink)', marginBottom: 16, background: 'var(--niro-white)' }}
            />
            <button
              onClick={() => {
                if (stepIdx < tool.prompts.length - 1) {
                  setStepIdx(s => s + 1);
                } else {
                  const a = {};
                  for (let i = 0; i < tool.prompts.length; i++) a['p' + i] = answers['anti_' + i] || '';
                  generateInsight(a);
                }
              }}
              style={{ width: '100%', padding: 14, borderRadius: 12, border: 'none', background: 'var(--niro-green)', color: 'white', fontSize: 15, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              {stepIdx === tool.prompts.length - 1 ? 'See insight' : 'Next'} <ArrowRight size={16} />
            </button>
          </div>
        )}

        {!insight && !loading && isFearAudit && stepIdx === 0 && (
          <div>
            <p style={{ fontSize: 15, color: 'var(--niro-ink)', marginBottom: 16 }}>Which of these is loudest right now?</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {tool.fears.map(f => (
                <button key={f} onClick={() => setSelectedFear(f)} style={{
                  padding: '14px 10px', borderRadius: 12,
                  border: '2px solid ' + (selectedFear === f ? 'var(--niro-green)' : 'var(--niro-border)'),
                  background: selectedFear === f ? 'rgba(28,58,42,0.05)' : 'var(--niro-white)',
                  fontSize: 13, color: 'var(--niro-ink)', cursor: 'pointer',
                  fontWeight: selectedFear === f ? 500 : 400, textAlign: 'center',
                }}>{f}</button>
              ))}
            </div>
            <button onClick={() => selectedFear && setStepIdx(1)} style={{ width: '100%', padding: 14, borderRadius: 12, border: 'none', background: selectedFear ? 'var(--niro-green)' : 'var(--niro-border)', color: 'white', fontSize: 15, fontWeight: 500, cursor: selectedFear ? 'pointer' : 'default' }}>
              Next
            </button>
          </div>
        )}

        {!insight && !loading && isFearAudit && stepIdx === 1 && (
          <div>
            <p style={{ fontSize: 15, color: 'var(--niro-ink)', marginBottom: 16 }}>What specifically would happen if "{selectedFear}" came true?</p>
            <textarea
              value={answers.follow_up || ''}
              onChange={e => setAnswers(a => ({ ...a, follow_up: e.target.value }))}
              rows={4}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--niro-border)', fontSize: 14, resize: 'none', outline: 'none', color: 'var(--niro-ink)', marginBottom: 16, background: 'var(--niro-white)' }}
            />
            <button onClick={() => generateInsight(answers)} style={{ width: '100%', padding: 14, borderRadius: 12, border: 'none', background: 'var(--niro-green)', color: 'white', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>
              See insight
            </button>
          </div>
        )}

        {!insight && !loading && isEnergyAudit && (
          <div>
            <p style={{ fontSize: 15, color: 'var(--niro-ink)', marginBottom: 16 }}>{tool.steps[stepIdx].prompt}</p>
            {Array(tool.steps[stepIdx].count).fill(0).map((_, i) => (
              <input key={i} type="text"
                value={(answers['step_' + stepIdx] || [])[i] || ''}
                onChange={e => {
                  const arr = [...(answers['step_' + stepIdx] || [])];
                  arr[i] = e.target.value;
                  setAnswers(a => ({ ...a, ['step_' + stepIdx]: arr }));
                }}
                placeholder={tool.steps[stepIdx].placeholder + ' ' + (i + 1)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--niro-border)', fontSize: 14, color: 'var(--niro-ink)', marginBottom: 10, outline: 'none', background: 'var(--niro-white)' }}
              />
            ))}
            <button
              onClick={() => {
                if (stepIdx < tool.steps.length - 1) {
                  setStepIdx(s => s + 1);
                } else {
                  const a = {};
                  for (let i = 0; i < 3; i++) a['e' + i] = (answers['step_0'] || [])[i] || '';
                  for (let i = 0; i < 3; i++) a['d' + i] = (answers['step_1'] || [])[i] || '';
                  generateInsight(a);
                }
              }}
              style={{ width: '100%', padding: 14, borderRadius: 12, border: 'none', background: 'var(--niro-green)', color: 'white', fontSize: 15, fontWeight: 500, cursor: 'pointer', marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              {stepIdx === tool.steps.length - 1 ? 'See insight' : 'Next'} <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
