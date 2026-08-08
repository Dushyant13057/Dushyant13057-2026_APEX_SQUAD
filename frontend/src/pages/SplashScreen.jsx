import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashScreen.css';

function SplashScreen() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setFadeOut(true), 2500);
    const timer2 = setTimeout(() => navigate('/login'), 3300);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [navigate]);

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      {/* Animated floating threads */}
      <div className="splash-threads">
        <div className="thread"></div>
        <div className="thread"></div>
        <div className="thread"></div>
        <div className="thread"></div>
        <div className="thread"></div>
        <div className="thread"></div>
      </div>

      {/* Animated particles */}
      <div className="splash-particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }}></div>
        ))}
      </div>

      <div className="splash-content">
        {/* Animated Needle */}
        <div className="splash-needle">
          <svg viewBox="0 0 24 80" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="needleGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#e0d0c0" />
                <stop offset="70%" stopColor="#c0b0a0" />
                <stop offset="100%" stopColor="#807060" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {/* Needle eye */}
            <ellipse cx="12" cy="8" rx="2.5" ry="5" fill="none" stroke="#e0d0c0" strokeWidth="1.5" />
            {/* Needle body */}
            <path d="M10.5 14L12 75L13.5 14" fill="url(#needleGrad)" />
            {/* Needle tip */}
            <path d="M11.8 73L12 79L12.2 73" fill="#ffffff" filter="url(#glow)" />
          </svg>
          {/* Thread coming from needle */}
          <svg className="splash-thread-svg" viewBox="0 0 150 60" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: '10px', left: '12px', overflow: 'visible' }}>
            <path d="M0 0 Q 30 -20, 50 10 T 100 20 T 150 0" fill="none" stroke="var(--accent-gold)" strokeWidth="2.5" strokeDasharray="8 6" filter="url(#glow)" />
          </svg>
        </div>

        {/* Logo */}
        <div className="splash-logo">
          <span className="splash-logo-design">Design</span>
          <span className="splash-logo-x">X</span>
        </div>

        {/* Stitch line */}
        <div className="splash-stitch-line"></div>

        {/* Tagline */}
        <p className="splash-tagline">Design Your Own Identity</p>
      </div>

      {/* Loading dots */}
      <div className="splash-loading">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}

export default SplashScreen;
