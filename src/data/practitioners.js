export const PRACTITIONERS = [
  {
    id: 'p1',
    name: 'SK Narula',
    modality: 'Vedic Astrology',
    tagline: 'Timing, career transitions, and when to move',
    topics: ['Career timing', 'Job change', 'Business start'],
    languages: ['Hindi', 'English'],
    experience: 18,
    freeIntro: true,
    careerNote: 'I work with people navigating major career transitions — especially when the question is about timing rather than direction.',
    bio: 'SK Narula has practised Vedic Astrology for 18 years, working with professionals across India and the diaspora. He specialises in career transitions and helping people understand their most productive cycles.',
    avatar: null,
  },
  {
    id: 'p2',
    name: 'Jay Pandya',
    modality: 'Vedic Astrology',
    tagline: 'Career crossroads and decision timing',
    topics: ['Career switch', 'Startup timing', 'Field change'],
    languages: ['English', 'Gujarati'],
    experience: 12,
    freeIntro: false,
    careerNote: 'I work with people at career crossroads — especially decisions about timing, switching fields, or starting something new.',
    bio: 'Jay Pandya brings 12 years of Vedic Astrology practice to career decisions. Based in Ahmedabad, he works with entrepreneurs navigating major life changes.',
    avatar: null,
  },
  {
    id: 'p3',
    name: 'Kavita Matani',
    modality: 'Tarot',
    tagline: 'Decision clarity and subconscious blocks',
    topics: ['Quit dilemma', 'Offer decision', 'Direction'],
    languages: ['English', 'Hindi'],
    experience: 8,
    freeIntro: true,
    careerNote: 'I work with people who know what they should do but cannot bring themselves to do it. Tarot surfaces what you already know.',
    bio: 'Kavita Matani has been reading Tarot for 8 years, focusing on career and life decisions. She holds a background in psychology and brings that lens to her practice.',
    avatar: null,
  },
  {
    id: 'p4',
    name: 'Alka Dhawan',
    modality: 'Numerology',
    tagline: 'Identity-career alignment and personal year cycles',
    topics: ['Career fit', 'Business naming', 'Personal year'],
    languages: ['Hindi', 'English'],
    experience: 15,
    freeIntro: false,
    careerNote: 'I work with people whose career confusion is really an identity question — does this feel like me?',
    bio: 'Alka Dhawan has practised Numerology for 15 years and worked with over 2,000 clients, helping them align career choices with their core identity.',
    avatar: null,
  },
  {
    id: 'p5',
    name: 'Priya Sharma',
    modality: 'Career Coach',
    tagline: 'Strategy, narrative, and decision frameworks',
    topics: ['Offer evaluation', 'Salary negotiation', 'Career switch'],
    languages: ['English'],
    experience: 6,
    freeIntro: true,
    careerNote: 'I help people who need a clear plan, not just clarity. We will leave the session knowing your next three moves.',
    bio: 'Priya Sharma is a certified career coach with 6 years of experience working with professionals at all stages of their careers.',
    avatar: null,
  },
  {
    id: 'p6',
    name: 'Arjun Mehta',
    modality: 'Peer Mentor',
    tagline: '3 years out of the same crossroads',
    topics: ['First job confusion', 'Quit dilemma', 'Imposter syndrome'],
    languages: ['English', 'Hindi'],
    experience: 0,
    freeIntro: false,
    careerNote: 'I quit a toxic consulting job at 23 with no plan. Built something, failed, rebuilt. Happy to talk about what I wish I had known.',
    bio: 'Arjun Mehta quit a high-paying consulting role at 23. Now a product manager at a Series B startup, mentoring people at similar crossroads.',
    avatar: null,
    isPeerMentor: true,
  },
];

export const PACKAGES = {
  p1: [
    { id: 'pkg1', name: 'Career timing session', sessions: 1, duration: 60, price: 1500, description: 'A focused session on the timing of your next career move.' },
    { id: 'pkg2', name: 'Deep dive + follow-up', sessions: 2, duration: 90, price: 2500, description: 'Initial session plus a follow-up reading 7 days later.' },
  ],
  p2: [
    { id: 'pkg1', name: 'Career crossroads session', sessions: 1, duration: 60, price: 1200, description: 'One session on your specific career decision.' },
    { id: 'pkg2', name: 'Full chart analysis', sessions: 1, duration: 90, price: 2000, description: 'Comprehensive chart analysis with career focus.' },
  ],
  p3: [
    { id: 'pkg1', name: 'Decision clarity session', sessions: 1, duration: 60, price: 1200, description: 'One focused session on the specific decision you are facing.' },
    { id: 'pkg2', name: 'Clarity + follow-up', sessions: 2, duration: 90, price: 2000, description: 'Initial session plus async follow-up reading 7 days later.' },
  ],
  p4: [
    { id: 'pkg1', name: 'Personal year reading', sessions: 1, duration: 60, price: 1000, description: 'Understand your current personal year cycle and what it means for your career.' },
    { id: 'pkg2', name: 'Identity + career alignment', sessions: 1, duration: 90, price: 1800, description: 'Full numerology analysis focused on career-identity alignment.' },
  ],
  p5: [
    { id: 'pkg1', name: 'Strategy session', sessions: 1, duration: 60, price: 2000, description: 'One session to map your next three career moves.' },
    { id: 'pkg2', name: 'Career sprint', sessions: 3, duration: 60, price: 5000, description: 'Three sessions over 3 weeks to execute your career pivot.' },
  ],
  p6: [
    { id: 'pkg1', name: 'Real talk session', sessions: 1, duration: 45, price: 500, description: 'An honest conversation about where you are and what your options look like.' },
  ],
};

export const MOCK_REVIEWS = {
  p1: [
    { author: 'Rohan M.', text: 'SK timing reading was accurate. Told me to wait 3 months. I did, and a much better offer came.', rating: 5 },
    { author: 'Neha S.', text: 'Very grounded and practical. No vague predictions, just specific guidance.', rating: 5 },
  ],
  p2: [
    { author: 'Dhruv P.', text: 'Jay helped me understand why I kept stalling on my startup. The timing analysis gave me a new framework.', rating: 5 },
    { author: 'Ananya K.', text: 'Clear, direct, and surprisingly useful for someone who was skeptical going in.', rating: 4 },
  ],
  p3: [
    { author: 'Shruti R.', text: 'I knew I wanted to quit but could not commit. One session with Kavita and I handed in my notice the next week.', rating: 5 },
    { author: 'Vikram T.', text: 'Kavita helps you figure out what you actually want. That is more valuable than being told what to do.', rating: 5 },
  ],
  p4: [
    { author: 'Pooja L.', text: 'The personal year concept explained so much about why last year felt so stuck. Really useful framing.', rating: 4 },
    { author: 'Aditya G.', text: 'Confirmed what I suspected. I was in the wrong field, not just the wrong company.', rating: 5 },
  ],
  p5: [
    { author: 'Meera B.', text: 'Priya helped me negotiate a 40% salary increase. Worth every rupee.', rating: 5 },
    { author: 'Karan J.', text: 'A clear framework, not just pep talk. Left with a real plan.', rating: 5 },
  ],
  p6: [
    { author: 'Rahul D.', text: 'Arjun is honest in a way that is rare. He has been through it and does not sugarcoat anything.', rating: 5 },
    { author: 'Simran K.', text: 'Talking to someone who actually quit and built something was exactly what I needed to hear.', rating: 5 },
  ],
};
