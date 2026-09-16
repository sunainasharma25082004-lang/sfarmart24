import React from 'react';
import { Leaf, ArrowUpRight, Heart } from 'lucide-react';
import './Footer.css';

export default function Footer({ onNavClick }) {
  const handleLegalClick = (e, viewName) => {
    e.preventDefault();
    if (onNavClick) {
      onNavClick(viewName);
    }
  };

  return (
    <footer className="footer">
      <div className="container footer-container">
        {/* Top Footer Grid */}
        <div className="footer-top-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <div className="footer-logo">
              <img src="/updated-logo.jpeg" alt="Sfarmart24 Logo" className="footer-logo-img" onError={(e) => { e.target.style.display = 'none'; }} />
              <div className="logo-text">
                <span className="logo-title white-text">SFARMART24</span>
                <span className="logo-subtitle earth-text">AGRI-TECH & COMMUNITY</span>
              </div>
            </div>

            <p className="footer-brand-desc">
              Empowering 50,000+ smallholder farmers and building technology-enabled community commerce networks across India.
            </p>

            <div className="footer-kisan-tag">
              <Leaf size={16} />
              <span>Registered under National Agri Tech Mission</span>
            </div>
          </div>

          {/* Column 2: Ecosystem Verticals */}
          <div className="footer-links-col">
            <h4>Ecosystem Verticals</h4>
            <ul>
              <li><button className="footer-link-btn" onClick={() => onNavClick && onNavClick('growth-partner')}>Growth Partner</button></li>
              <li><button className="footer-link-btn" onClick={() => onNavClick && onNavClick('village-hub')}>Village Hub</button></li>
              <li><button className="footer-link-btn" onClick={() => onNavClick && onNavClick('farmer-network')}>Farmer Network</button></li>
              <li><button className="footer-link-btn" onClick={() => onNavClick && onNavClick('women-entrepreneur')}>Women Entrepreneur</button></li>
              <li><button className="footer-link-btn" onClick={() => onNavClick && onNavClick('foco-franchise')}>FOCO Franchise</button></li>
              <li><button className="footer-link-btn" onClick={() => onNavClick && onNavClick('dream-rewards')}>Dream Rewards</button></li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="footer-links-col">
            <h4>Quick Links</h4>
            <ul>
              <li><button className="footer-link-btn" onClick={() => onNavClick && onNavClick('home', 'hero')}>Home</button></li>
              <li><button className="footer-link-btn" onClick={() => onNavClick && onNavClick('about')}>About Farmart</button></li>
              <li><button className="footer-link-btn" onClick={() => onNavClick && onNavClick('mission')}>Mission & Vision</button></li>
              <li><button className="footer-link-btn" onClick={() => onNavClick && onNavClick('home', 'calculator')}>Impact Calculator</button></li>
              <li><button className="footer-link-btn" onClick={() => onNavClick && onNavClick('careers')}>Careers</button></li>
              <li><button className="footer-link-btn" onClick={() => onNavClick && onNavClick('contact')}>Contact Support</button></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="footer-newsletter-col">
            <h4>Stay Connected</h4>
            <p>Subscribe to our monthly Kisan Impact Bulletin for updates on agri-tech trends and partner stories.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" required />
              <button type="submit" className="newsletter-btn">
                <span>Join</span>
                <ArrowUpRight size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="copyright">
            © {new Date().getFullYear()} Farmart Agri Tech Pvt Ltd. All rights reserved.
          </div>
          <div className="footer-legal-links">
            <button className="footer-legal-btn highlight-legal" onClick={(e) => handleLegalClick(e, 'privacy')}>
              Privacy Policy
            </button>
            <button className="footer-legal-btn" onClick={() => onNavClick && onNavClick('faq')}>
              Terms & FAQs
            </button>
            <button className="footer-legal-btn" onClick={() => onNavClick && onNavClick('about')}>
              Kisan Guidelines
            </button>
          </div>
          <div className="made-with-love">
            Crafted with <Heart size={14} className="heart-icon" /> for Growing Bharat
          </div>
        </div>
      </div>
    </footer>
  );
}
