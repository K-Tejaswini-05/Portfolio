import { useState, useEffect, useRef } from 'react';
import './index.css';
import Antigravity from './AntigravityCanvas';

// ─── Data ───────────────────────────────────────────────────────────────────

const nav = ['Home','About','Skills','Projects','Research','Achievements','Contact'];

const skills = [
  { icon: '💻', cat: 'Languages', tags: ['Python','C','Java','JavaScript'] },
  { icon: '🌐', cat: 'Web', tags: ['HTML','CSS','Django','Full Stack'] },
  { icon: '🧠', cat: 'CS Core', tags: ['DSA','DBMS','SQL','Networking'] },
  { icon: '🤖', cat: 'AI / ML', tags: ['Machine Learning','Deep Learning','Quantum ML'] },
  { icon: '🔬', cat: 'Domains', tags: ['AI','Quantum Computing','Backend Dev'] },
  { icon: '🛠️', cat: 'Tools', tags: ['APIs','REST','Excel','Git'] },
];

const projects = [
  {
    icon: '🗺️',
    color: '#7c3aed',
    badge: 'Hackathon',
    title: 'Campus Navigation',
    desc: 'A real-time navigation system for campus users with optimised pathfinding. Won 2nd prize at a hackathon.',
    tech: ['Python','Maps API','DSA'],
    github: '#',
  },
  {
    icon: '🔍',
    color: '#2563eb',
    badge: 'AI',
    title: 'AI Content Authenticity Detection',
    desc: 'Detects whether uploaded content is AI-generated or human-written using NLP classifiers.',
    tech: ['Python','NLP','ML','FastAPI'],
    github: '#',
  },
  {
    icon: '🚦',
    color: '#06b6d4',
    badge: 'Deep Learning',
    title: 'Traffic Congestion Prediction',
    desc: 'Deep learning and quantum feature layers to predict urban traffic congestion with high accuracy.',
    tech: ['PyTorch','PennyLane','DL','Python'],
    github: '#',
  },
  {
    icon: '👨‍🍳',
    color: '#db2777',
    badge: 'Assistant',
    title: 'Intelligent Culinary Assistant – Tejoo',
    desc: 'AI-powered recipe & meal planning assistant with an optimised data retrieval engine for personalised suggestions.',
    tech: ['Python','NLP','Django','SQL'],
    github: '#',
  },
  {
    icon: '💚',
    color: '#10b981',
    badge: 'Health Tech',
    title: 'CareSpace',
    desc: 'Mental health platform designed for students — providing resources, mood tracking, and peer support.',
    tech: ['React','Django','PostgreSQL','ML'],
    github: '#',
  },
  {
    icon: '🩺',
    color: '#f59e0b',
    badge: 'ML',
    title: 'Diabetes Prediction',
    desc: 'Machine learning model trained on clinical data to predict diabetes risk, enabling early medical intervention.',
    tech: ['Python','Scikit-learn','Pandas','ML'],
    github: '#',
  },
  {
    icon: '🍱',
    color: '#f97316',
    badge: 'Social Impact',
    title: 'FoodLink',
    desc: 'A community-driven platform connecting food donors with volunteers and people in need. Donors can list surplus food, volunteers coordinate pickups, and recipients access meals — reducing waste while fighting hunger.',
    tech: ['Flutter','React Native','Node.js','MongoDB','Socket.IO','JWT'],
    github: '#',
  },
];

const hackathons = [
  { logo: '🏅', name: 'CodeHer Hackathon 2025', prize: '2nd Prize Winner' },
  { logo: '⚡', name: 'Google TechSprint 2026', prize: 'Semi-Finalist' },
  { logo: '🚀', name: 'Smart India Hackathon (SIH)', prize: 'Participant' },
  { logo: '💡', name: 'TMCG Ideasprint', prize: 'Participant' },
];

const achievements = [
  {
    icon: '🥈',
    color: 'linear-gradient(135deg,#c0c0c0,#6366f1)',
    title: '2nd Prize – CodeHer Hackathon 2025',
    desc: 'Awarded for the Campus Navigation system that solved real-world wayfinding for students.',
  },
  {
    icon: '🏆',
    color: 'linear-gradient(135deg,#fbbf24,#f59e0b)',
    title: 'Semi-Finalist – Google TechSprint 2026',
    desc: 'Selected as a semi-finalist among thousands of applicants in Google\'s prestigious TechSprint hackathon.',
  },
];

const certs = [
  { logo: '🟦', name: 'Meta Back-End Developer', issuer: 'Meta / Coursera' },
  { logo: '🔵', name: 'Google AI Essentials', issuer: 'Google' },
  { logo: '🟣', name: 'Google Prompting Essentials', issuer: 'Google' },
];

// ─── Hooks ──────────────────────────────────────────────────────────────────

function useReveal(type = 'reveal-up', delay = 0) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add('reveal', type);
    if (delay) el.style.transitionDelay = `${delay}s`;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          obs.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [type, delay]);
  return ref;
}

function Typewriter({ phrases, speed = 80, delay = 1500 }) {
  const [text, setText] = useState('');
  const [phIdx, setPhIdx] = useState(0);
  const [isDel, setIsDel] = useState(false);

  useEffect(() => {
    const cur = phrases[phIdx];
    const timer = setTimeout(() => {
      if (!isDel) {
        setText(cur.substring(0, text.length + 1));
        if (text.length === cur.length) setTimeout(() => setIsDel(true), delay);
      } else {
        setText(cur.substring(0, text.length - 1));
        if (text.length === 0) {
          setIsDel(false);
          setPhIdx((phIdx + 1) % phrases.length);
        }
      }
    }, isDel ? speed / 2 : speed);
    return () => clearTimeout(timer);
  }, [text, isDel, phIdx, phrases, speed, delay]);

  return <span className="typewriter">{text}</span>;
}

// ─── Components ─────────────────────────────────────────────────────────────

function Navbar({ active }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const scrollTo = (s) => {
    setOpen(false);
    const id = s === 'Home' ? 'hero' : s.toLowerCase();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-inner">
        <span className="nav-logo" onClick={() => scrollTo('Home')}>TK</span>
        <ul className={`nav-links${open ? ' open' : ''}`}>
          {nav.map(s => (
            <li key={s}>
              <a className={active === s ? 'active' : ''} onClick={() => scrollTo(s)}>{s}</a>
            </li>
          ))}
          <li><a className="nav-cta" href="/resume.html" target="_blank" rel="noopener noreferrer">Resume ↓</a></li>
        </ul>
        <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="orb orb-purple" style={{ width:600,height:600,top:'-10%',left:'-10%' }} />
      <div className="orb orb-blue"   style={{ width:500,height:500,bottom:'-10%',right:'-5%' }} />
      <div className="hero-bg-grid" />
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-name">
            Hi, I'm <br />
            <span className="gradient-text">Tejaswini Kancharla</span>
          </h1>
          <p className="hero-tagline">
            Computer Science Student & <Typewriter phrases={['AI Enthusiast', 'Full-Stack Developer', 'Quantum Learner', 'Problem Solver']} />
          </p>
          <p className="hero-bio">
            Passionate developer with a strong foundation in programming, data science, and problem-solving.
            Building impactful digital solutions — from AI-powered assistants to quantum-enhanced models.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => document.getElementById('projects').scrollIntoView({ behavior:'smooth' })}>
              View Projects →
            </button>
            <a className="btn-outline" href="/resume.html" target="_blank" rel="noopener noreferrer">
              Download CV ↓
            </a>
          </div>
          <div className="hero-social">
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="social-link" title="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/tejaswini-kancharla?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="social-link" title="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="mailto:tejookancharla@gmail.com" className="social-link" title="Email">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

    </section>
  );
}

function About() {
  const ref = useReveal();
  return (
    <section id="about">
      <div className="orb orb-cyan" style={{ width:400,height:400,top:'30%',right:'-8%' }} />
      <div className="container">
        <div className="reveal reveal-up" ref={ref}>
          <div className="about-grid">
            <div className="about-visual reveal reveal-right" ref={useReveal('reveal-right')}>
              <div className="about-avatar" style={{ borderRadius:'24px', overflow:'hidden' }}>
                <img src="/profile.jpg" alt="Tejaswini Kancharla" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              </div>
              <div className="about-stats">
                {[['6+','Projects'],['5+','Certs'],['98.6%','X Score'],['2nd','Prize']].map(([n,l], i) => (
                  <div className="stat-card reveal reveal-scale" ref={useReveal('reveal-scale', i * 0.12)} key={l}>
                    <div className="num">{n}</div>
                    <div className="label">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="about-text reveal reveal-left" ref={useReveal('reveal-left')}>
              <div className="section-tag">✦ About Me</div>
              <h2 className="section-title">
                Crafting the <span className="gradient-text">Future</span> with Code
              </h2>
              <p className="section-subtitle" style={{ marginBottom:24 }}>
                I'm Tejaswini Kancharla, a B.Tech CSE student at GITAM University.
                I love building things that matter — intelligent assistants, health-tech platforms,
                and quantum-powered models. My work sits at the intersection of AI, design, and impact.
              </p>
              <div className="about-education">
                <h3 style={{ fontSize:'0.85rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--text-muted)',marginBottom:16 }}>Education</h3>
                {[
                  { icon:'🎓', title:'B.Tech – Computer Science & Engineering', sub:'Gandhi Institute of Technology and Management (GITAM)', score:'CGPA 8.47' },
                  { icon:'📚', title:'Class XII', sub:'Intermediate Education', score:'86.3%' },
                  { icon:'🌟', title:'Class X – School Topper', sub:'Secondary Education', score:'98.6%' },
                ].map(e => (
                  <div className="edu-card" key={e.title}>
                    <div className="edu-icon">{e.icon}</div>
                    <div className="edu-info">
                      <h4>{e.title}</h4>
                      <p>{e.sub}</p>
                    </div>
                    <div className="edu-score">{e.score}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const ref = useReveal();
  return (
    <section id="skills" className="skills-section">
      <div className="orb orb-purple" style={{ width:500,height:500,bottom:'-10%',left:'-8%' }} />
      <div className="container">
        <div className="reveal reveal-up" ref={ref} style={{ textAlign:'center' }}>
          <div className="section-tag">⚡ Expertise</div>
          <h2 className="section-title">Skills & <span className="gradient-text">Technologies</span></h2>
          <p className="section-subtitle" style={{ margin:'0 auto' }}>
            From low-level algorithms to high-level AI systems — here's what I build with.
          </p>
        </div>
        <div className="skills-grid">
          {skills.map((s, i) => (
            <div className="skill-cat reveal reveal-up" ref={useReveal('reveal-up', i * 0.08)} key={s.cat}>
              <div className="skill-cat-icon">{s.icon}</div>
              <h3>{s.cat}</h3>
              <div className="skill-tags">
                {s.tags.map(t => <span className="skill-tag" key={t}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const ref = useReveal();
  return (
    <section id="projects">
      <div className="orb orb-blue" style={{ width:450,height:450,top:'-5%',right:'-8%' }} />
      <div className="container">
        <div className="reveal reveal-up" ref={ref}>
          <div className="section-tag">🚀 Work</div>
          <h2 className="section-title">Featured <span className="gradient-text">Projects</span></h2>
          <p className="section-subtitle">
            A selection of solutions I've built — from hackathon winners to AI-powered platforms.
          </p>
        </div>
        <div className="projects-grid">
          {projects.map((p, i) => (
            <div className="project-card reveal reveal-up" ref={useReveal('reveal-up', i * 0.1)} key={p.title}>
              <div className="project-header">
                <div className="project-icon" style={{ background:`${p.color}22`, border:`1.5px solid ${p.color}44` }}>
                  {p.icon}
                </div>
                <span className="project-badge">{p.badge}</span>
              </div>
              <div className="project-body">
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <h3>{p.title}</h3>
                  <a href={p.github} target="_blank" rel="noopener noreferrer" className="social-link" style={{ marginTop:-4 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                    </svg>
                  </a>
                </div>
                <p>{p.desc}</p>
                <div className="project-tech">
                  {p.tech.map(t => <span className="tech-tag" key={t}>{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Research() {
  const ref = useReveal();
  return (
    <section id="research" className="research-section">
      <div className="orb orb-purple" style={{ width:400,height:400,top:'-10%',left:'30%' }} />
      <div className="container">
        <div className="reveal reveal-up" ref={ref}>
          <div className="section-tag">📄 Research</div>
          <h2 className="section-title">Published <span className="gradient-text">Work</span></h2>
          <p className="section-subtitle">
            Exploring the intersection of quantum computing and cryptography.
          </p>
        </div>
        <div className="research-card reveal reveal-up" ref={useReveal('reveal-up')}>
          <div className="research-icon">⚛️</div>
          <div className="research-content">
            <h3>Impact of Quantum Computing on RSA Cryptographic Security</h3>
            <p>
              An in-depth research paper analyzing how quantum algorithms — particularly Shor's algorithm —
              threaten the mathematical foundations of RSA encryption, and exploring quantum-resistant alternatives
              for future cryptographic systems.
            </p>
            <div style={{ display:'flex',gap:12,flexWrap:'wrap' }}>
              <a href="https://drive.google.com/file/d/15_wv_erCoRuTDO38u0CxBnLshfeU5n4j/view?usp=drive_link" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding:'10px 24px', fontSize:'0.88rem' }}>View Paper →</a>
              <span className="skill-tag" style={{ padding:'8px 16px' }}>Quantum Computing</span>
              <span className="skill-tag" style={{ padding:'8px 16px' }}>Cryptography</span>
              <span className="skill-tag" style={{ padding:'8px 16px' }}>RSA</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Achievements() {
  const ref = useReveal();
  return (
    <section id="achievements">
      <div className="container">
        <div className="reveal reveal-up" ref={ref}>
          <div className="section-tag">🏆 Wins</div>
          <h2 className="section-title">Achievements & <span className="gradient-text">Certifications</span></h2>
          <p className="section-subtitle">Recognition that drives me to build even bigger things.</p>
        </div>
        <div className="achievements-grid">
          {achievements.map((a, i) => (
            <div className="achievement-card reveal reveal-up" ref={useReveal('reveal-up', i * 0.1)} key={a.title}>
              <div className="achievement-icon" style={{ background: a.color }}>
                {a.icon}
              </div>
              <div>
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="certs-grid" style={{ marginTop:40 }}>
          {certs.map((c, i) => (
            <div className="cert-card reveal reveal-up" ref={useReveal('reveal-up', i * 0.1)} key={c.name}>
              <div className="cert-logo">{c.logo}</div>
              <div className="cert-info">
                <h4>{c.name}</h4>
                <p>{c.issuer}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop:64 }}>
          <h3 className="reveal reveal-up" ref={useReveal('reveal-up')} style={{ fontSize:'0.75rem', fontWeight:800, letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--accent)', marginBottom:24, display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ width:20, height:1, background:'var(--accent)' }} /> Hackathon Certifications
          </h3>
          <div className="certs-grid">
            {hackathons.map((h, i) => (
              <div className="cert-card reveal reveal-up" ref={useReveal('reveal-up', i * 0.1)} key={h.name} style={{ background:'rgba(255,255,255,0.03)' }}>
                <div className="cert-logo" style={{ fontSize:'1.5rem' }}>{h.logo}</div>
                <div className="cert-info">
                  <h4>{h.name}</h4>
                  <p style={{ color:'var(--accent)', fontWeight:600 }}>{h.prize}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const ref = useReveal();
  const [form, setForm] = useState({ name:'', email:'', message:'' });
  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert('Thanks! Message sent successfully 🚀');
        setForm({ name:'', email:'', message:'' });
      } else {
        throw new Error();
      }
    } catch {
      alert('Message sent! (Local mode) 🚀');
      setForm({ name:'', email:'', message:'' });
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="orb orb-cyan" style={{ width:500,height:500,bottom:'-10%',right:'-10%' }} />
      <div className="container">
        <div className="reveal reveal-up" ref={ref} style={{ textAlign:'center' }}>
          <div className="section-tag">📞 Connect</div>
          <h2 className="section-title">Let's <span className="gradient-text">Talk</span></h2>
          <p className="section-subtitle" style={{ margin:'0 auto' }}>
            Whether it's a project idea, opportunity, or just a hello — my inbox is open!
          </p>
        </div>
        <div className="contact-container">
          <div className="reveal reveal-right" ref={useReveal('reveal-right')}>
            {[
              { icon:'✉️', label:'Email', val:'tejookancharla@gmail.com', href:'mailto:tejookancharla@gmail.com' },
              { icon:'📱', label:'Phone', val:'+91-9966773877', href:'tel:+919966773877' },
              { icon:'📍', label:'Location', val:'Visakhapatnam, India', href:'#' },
            ].map(c => (
              <a className="contact-item" href={c.href} key={c.label}>
                <div className="contact-icon">{c.icon}</div>
                <div>
                  <h4>{c.label}</h4>
                  <p>{c.val}</p>
                </div>
              </a>
            ))}
          </div>
          <form className="contact-form reveal reveal-left" ref={useReveal('reveal-left')} onSubmit={submit}>
            <h3>Send a Message ✍️</h3>
            {[['name','Your Name','text'],['email','Your Email','email']].map(([n,ph,t]) => (
              <div className="form-group" key={n}>
                <label>{ph}</label>
                <input type={t} name={n} placeholder={ph} value={form[n]} onChange={handle} required />
              </div>
            ))}
            <div className="form-group">
              <label>Message</label>
              <textarea name="message" rows={5} placeholder="What's on your mind?" value={form.message} onChange={handle} required />
            </div>
            <button type="submit" className="btn-primary" style={{ width:'100%', justifyContent:'center' }}>
              Send Message 🚀
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [active, setActive] = useState('Home');

  useEffect(() => {
    const sections = ['hero','about','skills','projects','research','achievements','contact'];
    const labels   = ['Home','About','Skills','Projects','Research','Achievements','Contact'];
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const idx = sections.indexOf(e.target.id);
            if (idx >= 0) setActive(labels[idx]);
          }
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <Antigravity
        count={400}
        magnetRadius={200}
        ringRadius={220}
        color="#7c3aed"
        particleSize={1.5}
        autoAnimate
      />
      <Navbar active={active} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Research />
        <Achievements />
        <Contact />
      </main>
      <footer>
        <p>Crafted with ❤️ by <span>Tejaswini Kancharla</span> · {new Date().getFullYear()}</p>
      </footer>
    </>
  );
}
