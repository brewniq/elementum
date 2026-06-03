import { useState, useEffect, useRef } from "react";

/* ─── STYLES ─────────────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Cabinet+Grotesk:wght@400;500;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black: #0a0a0a;
    --white: #ffffff;
    --purple: #c9b8f0;
    --green-highlight: #c8e6c3;
    --pink-highlight: #f2c2d8;
    --amber: #f5a623;
    --coral: #e8615a;
    --sage-bg: #d8e8d4;
    --off-white: #f8f7f4;
    --border: rgba(0,0,0,0.08);
    --font-display: 'Fraunces', Georgia, serif;
    --font-sans: 'Cabinet Grotesk', sans-serif;
  }

  html { scroll-behavior: smooth; }
  body { font-family: var(--font-sans); color: var(--black); background: var(--white); overflow-x: hidden; }

  /* NAV */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.25rem 3rem;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 0.5px solid var(--border);
  }
  .nav-logo {
    font-family: var(--font-display); font-size: 1.25rem; font-weight: 400;
    letter-spacing: -0.02em; color: var(--black); text-decoration: none;
  }
  .nav-links {
    display: flex; align-items: center; gap: 2.5rem; list-style: none;
  }
  .nav-links a {
    font-size: 0.875rem; font-weight: 500; color: var(--black);
    text-decoration: none; transition: opacity 0.2s;
  }
  .nav-links a:hover { opacity: 0.5; }
  .nav-hamburger {
    display: none; flex-direction: column; gap: 5px;
    cursor: pointer; padding: 4px; background: none; border: none;
  }
  .nav-hamburger span {
    display: block; width: 22px; height: 1.5px;
    background: var(--black); transition: transform 0.25s ease, opacity 0.25s ease;
  }

  /* HERO */
  .hero {
    min-height: 100vh; padding: 8rem 3rem 5rem;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; position: relative; overflow: hidden;
  }
  .hero-headline {
    font-family: var(--font-display); font-size: clamp(3rem, 7vw, 6.5rem);
    font-weight: 300; line-height: 1.05; letter-spacing: -0.03em; max-width: 900px;
  }
  .word-italic { font-style: italic; display: inline-block; position: relative; }
  .word-italic::after {
    content: ''; position: absolute; bottom: -4px; left: 0; right: 0; height: 3px;
    background: var(--amber); transform: rotate(-1deg);
  }
  .word-highlight-pink { display: inline-block; background: var(--pink-highlight); border-radius: 8px; padding: 0 12px 4px; }
  .word-highlight-green { display: inline-block; background: var(--green-highlight); border-radius: 8px; padding: 0 12px 4px; }
  .hero-sub { margin-top: 1.75rem; font-size: 1rem; color: #555; max-width: 500px; font-weight: 400; line-height: 1.7; }
  .hero-gallery { display: flex; align-items: center; justify-content: center; gap: 1.5rem; margin-top: 3.5rem; flex-wrap: wrap; }

  @keyframes floatBlob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
  .blob { border-radius: 50%; background: var(--purple); flex-shrink: 0; animation: floatBlob 6s ease-in-out infinite; }
  .avatar { border-radius: 50%; overflow: hidden; border: 3px solid var(--white); box-shadow: 0 4px 20px rgba(0,0,0,0.1); flex-shrink: 0; }

  section { padding: 7rem 3rem; }

  /* FEATURES */
  .features-row { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; max-width: 1100px; margin: 0 auto 6rem; }
  .features-row.reverse { direction: rtl; }
  .features-row.reverse > * { direction: ltr; }
  .feat-heading { font-family: var(--font-display); font-size: clamp(2rem, 3.5vw, 3rem); font-weight: 300; line-height: 1.15; letter-spacing: -0.025em; margin-bottom: 1.25rem; }
  .feat-underline { display: inline-block; position: relative; font-style: italic; }
  .feat-underline::after { content: ''; position: absolute; bottom: -2px; left: 0; right: 0; height: 2px; background: var(--amber); }
  .feat-p { font-size: 0.95rem; color: #555; line-height: 1.75; margin-bottom: 1.5rem; max-width: 420px; }
  .read-more { display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; font-weight: 500; color: var(--black); text-decoration: none; border-bottom: 1px solid var(--black); padding-bottom: 1px; transition: gap 0.2s; }
  .read-more:hover { gap: 0.85rem; }
  .feat-img-placeholder { width: 100%; aspect-ratio: 1; border-radius: 50%; background: linear-gradient(135deg, #e8e4de, #d4cec8); display: flex; align-items: center; justify-content: center; position: relative; }

  /* SERVICES */
  .services { background: var(--off-white); }
  .services-inner { max-width: 1100px; margin: 0 auto; }
  .services-heading { font-family: var(--font-display); font-size: clamp(2.5rem, 5vw, 4.5rem); font-weight: 300; letter-spacing: -0.03em; margin-bottom: 3.5rem; line-height: 1.1; }
  .services-table { width: 100%; border-collapse: collapse; }
  .services-table tr { border-top: 1px solid rgba(0,0,0,0.1); transition: background 0.2s; }
  .services-table tr:last-child { border-bottom: 1px solid rgba(0,0,0,0.1); }
  .services-table tr:hover { background: rgba(0,0,0,0.025); }
  .services-table td { padding: 1.4rem 0; vertical-align: middle; }
  .service-label { color: #888; font-size: 0.8rem; font-weight: 500; width: 200px; padding-right: 2rem; }
  .service-name { font-family: var(--font-display); font-size: clamp(1.2rem, 2vw, 1.6rem); font-weight: 400; }
  .service-arrow { width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; text-decoration: none; color: var(--black); margin-left: auto; }
  .service-arrow:hover { background: var(--black); color: var(--white); }

  /* TESTIMONIALS */
  .testimonials { background: var(--white); }
  .testimonials-inner { max-width: 1100px; margin: 0 auto; }
  .test-heading { font-family: var(--font-display); font-size: clamp(2rem, 3.5vw, 3rem); font-weight: 300; letter-spacing: -0.025em; text-align: center; margin-bottom: 4rem; }
  .test-layout { display: flex; align-items: center; gap: 3rem; }
  .test-avatars { display: flex; flex-direction: column; gap: 1.5rem; align-items: center; }
  .test-card { flex: 1; background: #f5f3ef; border-radius: 20px; padding: 2.5rem 2.75rem; font-family: var(--font-display); font-size: 1.05rem; line-height: 1.7; text-align: center; color: #333; font-style: italic; position: relative; }
  /* test-card quotes injected separately */

  .test-blob { border-radius: 50%; background: var(--purple); flex-shrink: 0; }
  .test-avatar { border-radius: 50%; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08); }

  /* NEWSLETTER */
  .newsletter { background: var(--sage-bg); padding: 6rem 3rem; text-align: center; position: relative; overflow: hidden; }
  .newsletter h2 { font-family: var(--font-display); font-size: clamp(2.5rem, 5vw, 4.5rem); font-weight: 300; letter-spacing: -0.03em; margin-bottom: 0.75rem; }
  .newsletter p { font-size: 0.95rem; color: #555; margin-bottom: 2rem; }
  .subscribe-btn { display: inline-block; background: var(--black); color: var(--white); font-size: 0.875rem; font-weight: 600; letter-spacing: 0.04em; padding: 0.875rem 2.25rem; border-radius: 50px; border: none; cursor: pointer; text-decoration: none; transition: background 0.2s, transform 0.15s; }
  .subscribe-btn:hover { background: #222; transform: translateY(-2px); }

  /* FOOTER */
  footer { background: #f0ede8; padding: 3.5rem 3rem 2rem; }
  .footer-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 3rem; max-width: 1100px; margin: 0 auto 2.5rem; }
  .footer-col h4 { font-size: 0.8rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #888; margin-bottom: 1rem; }
  .footer-col ul { list-style: none; }
  .footer-col ul li { margin-bottom: 0.5rem; }
  .footer-col a { font-size: 0.875rem; color: #333; text-decoration: none; transition: color 0.2s; }
  .footer-col a:hover { color: var(--black); }
  .footer-address { font-size: 0.875rem; color: #555; line-height: 1.7; }
  .footer-bottom { border-top: 0.5px solid var(--border); padding-top: 1.5rem; text-align: center; font-size: 0.8rem; color: #888; max-width: 1100px; margin: 0 auto; }

  /* REVEAL */
  .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .nav { padding: 1rem 1.5rem; }
    .nav-hamburger { display: flex; }
    .nav-links {
      display: none;
      flex-direction: column;
      position: fixed;
      top: 60px; left: 0; right: 0;
      background: rgba(255,255,255,0.97);
      backdrop-filter: blur(12px);
      padding: 2rem;
      gap: 1.5rem;
      border-bottom: 0.5px solid rgba(0,0,0,0.08);
      z-index: 99;
    }
    .nav-links.open { display: flex; }
    .nav-hamburger.open span:first-child { transform: translateY(6.5px) rotate(45deg); }
    .nav-hamburger.open span:last-child  { transform: translateY(-6.5px) rotate(-45deg); }
    .hero { padding: 7rem 1.5rem 4rem; }
    section { padding: 5rem 1.5rem; }
    .features-row { grid-template-columns: 1fr; gap: 2.5rem; }
    .features-row.reverse { direction: ltr; }
    .footer-grid { grid-template-columns: repeat(2, 1fr); }
    .test-layout { flex-direction: column; }
    .test-avatars { flex-direction: row; }
    .service-label { display: none; }
  }
  @media (max-width: 600px) {
    .hero-headline { font-size: 2.5rem; }
    .footer-grid { grid-template-columns: 1fr; }
  }
`;


const openQ  = String.fromCharCode(0x201C);
const closeQ = String.fromCharCode(0x201D);
const quoteCss = `.test-card::before { content: '${openQ}${openQ}'; position: absolute; top: 1.5rem; left: 2rem; font-size: 2rem; color: #c9b8f0; line-height: 1; font-family: Georgia, serif; }
.test-card::after  { content: '${closeQ}${closeQ}'; position: absolute; bottom: 1.5rem; right: 2rem; font-size: 2rem; color: #c9b8f0; line-height: 1; font-family: Georgia, serif; }`;

/* ─── REVEAL HOOK ──────────────────────────────────────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.12 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

/* ─── NAVBAR ───────────────────────────────────────────────────────────────── */
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="nav">
      <a href="#" className="nav-logo">Elementum</a>
      <ul className={`nav-links${menuOpen ? " open" : ""}`}>
        {["Home","Studio","Services","Contact","FAQ's"].map(l => (
          <li key={l}><a href="#" onClick={() => setMenuOpen(false)}>{l}</a></li>
        ))}
      </ul>
      <button
        className={`nav-hamburger${menuOpen ? " open" : ""}`}
        aria-label="Toggle menu"
        onClick={() => setMenuOpen(o => !o)}
      >
        <span /><span />
      </button>
    </nav>
  );
}

/* ─── HERO ─────────────────────────────────────────────────────────────────── */
function AvatarBlob({ size, gradient }) {
  return (
    <div className="avatar" style={{ width: size, height: size }}>
      <div style={{ width:"100%", height:"100%", background: gradient }} />
    </div>
  );
}

function ColorBlob({ size, delay = 0 }) {
  return <div className="blob" style={{ width: size, height: size, animationDelay:`${delay}s` }} />;
}

function Hero() {
  return (
    <section className="hero">
      <svg style={{ position:"absolute", right:"3%", top:"28%", width:60, opacity:0.8 }} viewBox="0 0 60 90" fill="none">
        <path d="M30 5 C50 5 58 28 45 45 C32 62 50 75 55 85" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round"/>
      </svg>
      <svg style={{ position:"absolute", left:"2%", top:"40%", width:50, opacity:0.7 }} viewBox="0 0 60 80" fill="none">
        <path d="M50 5 C20 10 5 35 20 55 C35 75 10 70 5 75" stroke="#e8615a" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>

      <h1 className="hero-headline">
        The <span className="word-italic">thinkers</span> and<br />
        doers were <span className="word-highlight-pink">changing</span><br />
        the <span className="word-highlight-green">status</span> Quo with
      </h1>
      <p className="hero-sub">
        We are a team of strategists, designers, communicators, researchers.
        Together, we believe that progress only happens when you refuse to play things safe.
      </p>
      <div className="hero-gallery">
        <AvatarBlob size={80} gradient="linear-gradient(135deg,#d4a88a,#c49070)" />
        <ColorBlob size={70} />
        <AvatarBlob size={95} gradient="linear-gradient(135deg,#8fa8c0,#7090b0)" />
        <ColorBlob size={85} delay={-1} />
        <ColorBlob size={55} delay={-3} />
        <AvatarBlob size={90} gradient="linear-gradient(135deg,#b8a898,#a09080)" />
        <ColorBlob size={75} delay={-2} />
        <AvatarBlob size={85} gradient="linear-gradient(135deg,#9ab8a0,#789888)" />
      </div>
    </section>
  );
}

/* ─── FEATURE ROW ──────────────────────────────────────────────────────────── */
function FeatureRow({ heading, text, reversed = false }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={`features-row reveal${visible?" visible":""}${reversed?" reverse":""}`}>
      <div>
        <h2 className="feat-heading" dangerouslySetInnerHTML={{ __html: heading }} />
        <p className="feat-p">{text}</p>
        <a href="#" className="read-more">Read more &nbsp;→</a>
      </div>
      <div className="feat-img-placeholder" style={{ position:"relative" }}>
        {!reversed && (
          <svg style={{ position:"absolute", top:-10, right:-10, width:60 }} viewBox="0 0 60 60" fill="none">
            <polygon points="30,5 55,55 5,55" fill="#e8615a" opacity="0.85"/>
          </svg>
        )}
        {reversed && (<>
          <svg style={{ position:"absolute", bottom:-10, left:-10, width:60 }} viewBox="0 0 60 60" fill="none">
            <polygon points="30,5 55,55 5,55" fill="#e8615a" opacity="0.85"/>
          </svg>
          <svg style={{ position:"absolute", top:-8, right:-8, width:50 }} viewBox="0 0 50 50" fill="none">
            <polygon points="25,3 47,47 3,47" fill="#e8615a" opacity="0.5"/>
          </svg>
        </>)}
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <circle cx="30" cy="22" r="12" fill="#b0a898"/>
          <ellipse cx="30" cy="50" rx="22" ry="13" fill="#b0a898"/>
        </svg>
      </div>
    </div>
  );
}

/* ─── SERVICES ─────────────────────────────────────────────────────────────── */
const SERVICES = [
  { label:"Office of multiple interest content",        name:"Collaborative & partnership" },
  { label:"The hanger US Air force digital experimental", name:"We talk about our weight"    },
  { label:"Delta faucet content, social, digital",      name:"Piloting digital confidence"  },
];

function Services() {
  const { ref, visible } = useReveal();
  return (
    <section className="services">
      <div className="services-inner">
        <h2 className="services-heading">
          What we <span className="word-highlight-green">can</span><br />
          <span className="feat-underline">offer</span> you!
        </h2>
        <table ref={ref} className={`services-table reveal${visible?" visible":""}`}>
          <tbody>
            {SERVICES.map(s => (
              <tr key={s.name}>
                <td className="service-label">{s.label}</td>
                <td><span className="service-name">{s.name}</span></td>
                <td style={{ textAlign:"right" }}>
                  <a href="#" className="service-arrow">→</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ─── TESTIMONIALS ─────────────────────────────────────────────────────────── */
function Testimonials() {
  const { ref, visible } = useReveal();
  return (
    <section className="testimonials">
      <div className="testimonials-inner">
        <h2 className="test-heading">
          <span className="word-highlight-green">What</span> our customer<br />
          says <span className="feat-underline">About Us</span>
        </h2>
        <div ref={ref} className={`test-layout reveal${visible?" visible":""}`}>
          <div className="test-avatars">
            <div className="test-blob" style={{ width:55, height:55, marginTop:"2rem" }} />
            <div className="test-avatar" style={{ width:50, height:50 }}>
              <div style={{ width:"100%", height:"100%", background:"linear-gradient(135deg,#e8a888,#d89070)" }} />
            </div>
            <div className="test-avatar" style={{ width:90, height:90 }}>
              <div style={{ width:"100%", height:"100%", background:"linear-gradient(135deg,#9898b8,#7878a0)" }} />
            </div>
            <div className="test-blob" style={{ width:70, height:70 }} />
          </div>
          <div className="test-card">
            Elementum delivered the site within the timeline as they requested.
            In the end, the client found a 50% increase in traffic within days since its launch.
            They also had an impressive ability to use technologies that the company hasn't used,
            which have also proved to be easy to use and reliable.
          </div>
          <div className="test-avatars">
            <div className="test-avatar" style={{ width:50, height:50 }}>
              <div style={{ width:"100%", height:"100%", background:"linear-gradient(135deg,#a8c8a0,#88b080)" }} />
            </div>
            <div className="test-avatar" style={{ width:65, height:65 }}>
              <div style={{ width:"100%", height:"100%", background:"linear-gradient(135deg,#c8a898,#b08878)" }} />
            </div>
            <div className="test-blob" style={{ width:90, height:90 }} />
            <div className="test-avatar" style={{ width:55, height:55 }}>
              <div style={{ width:"100%", height:"100%", background:"linear-gradient(135deg,#98b8d8,#7898c0)" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── NEWSLETTER ───────────────────────────────────────────────────────────── */
function Newsletter() {
  const { ref, visible } = useReveal();
  return (
    <section className="newsletter">
      <div style={{ position:"absolute", right:"4%", top:"10%", width:90, height:140, background:"#8b5cf6", borderRadius:"0 0 60px 60px", opacity:0.85 }} />
      <div style={{ position:"absolute", left:"3%", bottom:"15%", width:50, height:50, borderRadius:"50%", background:"#8b5cf6", opacity:0.7 }} />
      <div ref={ref} style={{ position:"relative", zIndex:2 }} className={`reveal${visible?" visible":""}`}>
        <h2>Subscribe to<br />our newsletter</h2>
        <p>To make your stay special and even more memorable</p>
        <a href="#" className="subscribe-btn">Subscribe Now</a>
      </div>
    </section>
  );
}

/* ─── FOOTER ───────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-col">
          <h4>Company</h4>
          <ul>{["Home","Studio","Service","Blog"].map(l=><li key={l}><a href="#">{l}</a></li>)}</ul>
        </div>
        <div className="footer-col">
          <h4>Terms &amp; Policies</h4>
          <ul>{["Privacy Policy","Terms & Conditions","Explore","Accessibility"].map(l=><li key={l}><a href="#">{l}</a></li>)}</ul>
        </div>
        <div className="footer-col">
          <h4>Follow Us</h4>
          <ul>{["Instagram","LinkedIn","Youtube","Twitter"].map(l=><li key={l}><a href="#">{l}</a></li>)}</ul>
        </div>
        <div className="footer-col">
          <h4>Terms &amp; Policies</h4>
          <p className="footer-address">
            1498w Fluton ste, STE<br/>2D Chicago, IL 63867.<br/><br/>
            (123) 456789000<br/>info@elementum.com
          </p>
        </div>
      </div>
      <div className="footer-bottom">©2023 Elementum. All rights reserved</div>
    </footer>
  );
}

/* ─── APP ──────────────────────────────────────────────────────────────────── */
export default function App() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = css;
    document.head.appendChild(el);
    const el2 = document.createElement("style");
    el2.textContent = quoteCss;
    document.head.appendChild(el2);
    return () => { document.head.removeChild(el); document.head.removeChild(el2); };
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <section style={{ background:"#fff" }}>
        <FeatureRow
          heading={`<span class="feat-underline">Tomorrow</span> should<br/>be better than <span class="word-highlight-green">today</span>`}
          text="We are a team of strategists, designers communicators, researchers. Together, we believe that progress only happens when you refuse to play things safe."
        />
        <FeatureRow
          heading={`<span class="word-highlight-green">See</span> how we can<br/>help you <span class="feat-underline" style="font-style:italic">progress</span>`}
          text="We add a layer of fearless insights and action that allows change makers to accelerate their progress in areas such as brand, design, digital, comms and social research."
          reversed
        />
      </section>
      <Services />
      <Testimonials />
      <Newsletter />
      <Footer />
    </>
  );
}
