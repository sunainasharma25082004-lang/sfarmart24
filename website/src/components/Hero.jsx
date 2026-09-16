import React from 'react';
import { 
  ArrowDown, 
  Sprout, 
  ShieldCheck, 
  Sparkles, 
  Store, 
  ChevronRight,
  Eye,
  MapPin
} from 'lucide-react';
import './Hero.css';

export default function Hero({ onExploreClick, onOpenShowcase, onOpenDigitalPartner }) {
  return (
    <section id="hero" className="hero-section">
      {/* Dynamic Ambient Background Illumination */}
      <div className="hero-bg-glow hero-bg-glow-1"></div>
      <div className="hero-bg-glow hero-bg-glow-2"></div>
      <div className="hero-bg-glow hero-bg-glow-3"></div>

      <div className="container hero-container">
        {/* Compact, Ultra-Impact Header */}
        <div className="hero-intro">
          <div className="hero-badge-pill">
            <span className="live-pulsing-dot"></span>
            <span className="badge-text">SFARMART24 • INDIA'S 1ST INTEGRATED AGRI-MART & RURAL COMMERCE GRID</span>
          </div>

          {/* Eye-catching Digital Partner Callout Banner */}
          {onOpenDigitalPartner && (
            <button className="hero-dp-hot-pill" onClick={onOpenDigitalPartner}>
              <span className="hot-tag">NEW 🔥</span>
              <span className="hot-text">
                <strong>Digital Partner Openings (₹199):</strong> Scan Razorpay QR &amp; Apply Online
              </span>
              <span className="hot-arrow">&rarr;</span>
            </button>
          )}

          <h1 className="hero-main-title">
            The Grand Agri Revolution.<br />
            <span className="hero-gradient-text">Farm Gate Freshness meets Modern 24/7 Marts.</span>
          </h1>

          <p className="hero-description">
            Empowering <strong>50,000+ farmers</strong> with direct market access, guaranteed fair prices, 
            and 24-hour payouts — seamlessly connected to modern <strong>SFARMART24</strong> retail hubs supplying 
            certified seeds, fertilizers, pesticides, farm tools, and daily essentials.
          </p>

          <div className="hero-cta-group">
            {onOpenDigitalPartner && (
              <button className="btn btn-primary hero-dp-glow-btn" onClick={onOpenDigitalPartner}>
                <span>📲 Apply Digital Partner (₹199)</span>
              </button>
            )}

            <button className="btn btn-earth hero-glow-cta" onClick={onOpenShowcase}>
              <Sparkles size={17} className="sparkle-rotate" />
              <span>✨ Discover All Services</span>
            </button>

            <button className="btn btn-secondary hero-explore-btn" onClick={onExploreClick}>
              <span>Explore 5 Agri Verticals</span>
              <ArrowDown size={16} className="arrow-bounce" />
            </button>
          </div>
        </div>

        {/* The Grand Cinematic Scenic Showcase ("WOW, WHAT A VIEW!") */}
        <div className="scenic-showcase-wrapper">
          <div 
            className="scenic-stage-frame" 
            onClick={onOpenShowcase}
            title="Click to discover full SFARMART24 services & ecosystem"
          >
            <div className="scenic-img-container">
              <img
                src="/sfarmart24_store_hero.png?v=4"
                alt="SFARMART24 - Scenic Farm Gate Landscape to Modern 24/7 Smart Mart"
                className="scenic-panoramic-img"
              />
              
              {/* Natural Lighting & Vignette Depth */}
              <div className="scenic-vignette"></div>
              <div className="scenic-light-sweep"></div>

              {/* Hotspot 1: In the sky above the farmlands (Top Left) */}
              <div className="scenic-hotspot hotspot-sky-farm">
                <div className="hotspot-card">
                  <div className="hotspot-icon-wrap farm-wrap">
                    <Sprout size={16} />
                  </div>
                  <div className="hotspot-info">
                    <div className="hotspot-title">Direct Farm Sourcing</div>
                    <div className="hotspot-desc">100% Traceable • Fair Prices</div>
                  </div>
                </div>
              </div>

              {/* Hotspot 2: In the sky above the Modern Mart (Top Right) */}
              <div className="scenic-hotspot hotspot-sky-store">
                <div className="hotspot-card">
                  <div className="hotspot-icon-wrap store-wrap">
                    <Store size={16} />
                  </div>
                  <div className="hotspot-info">
                    <div className="hotspot-title">Modern 24/7 Smart Mart</div>
                    <div className="hotspot-desc">Quality Seeds • Tools • Feed</div>
                  </div>
                </div>
              </div>

              {/* Elegant Glass Ribbon at the Bottom */}
              <div className="scenic-ribbon">
                <div className="scenic-ribbon-left">
                  <span className="scenic-live-beacon"></span>
                  <span className="ribbon-location">
                    <MapPin size={14} className="inline-icon" />
                    <strong>SFARMART24 Integrated Model:</strong> Direct Farm Gate to Modern Omni-Channel Stores
                  </span>
                </div>
                <div className="scenic-ribbon-badge">
                  <Eye size={13} />
                  <span>Click view to explore interactive showcase</span>
                  <ChevronRight size={13} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* High-Impact Value & Metrics Grid */}
        <div className="scenic-stats-grid">
          <div className="scenic-stat-card">
            <div className="stat-glow-line"></div>
            <div className="stat-icon-row">
              <span className="stat-number">50,000+</span>
              <span className="stat-pill-tag">GROWERS</span>
            </div>
            <div className="stat-title">Empowered Farmers</div>
            <div className="stat-sub">Direct digital weighment, zero middlemen fees & instant 24h bank UPI payouts.</div>
          </div>

          <div className="scenic-stat-card">
            <div className="stat-glow-line"></div>
            <div className="stat-icon-row">
              <span className="stat-number">1,200+</span>
              <span className="stat-pill-tag">VILLAGES</span>
            </div>
            <div className="stat-title">Gram Panchayat Hubs</div>
            <div className="stat-sub">Village coordinators driving rural commerce, cold aggregation & local employment.</div>
          </div>

          <div className="scenic-stat-card">
            <div className="stat-glow-line"></div>
            <div className="stat-icon-row">
              <span className="stat-number">150+</span>
              <span className="stat-pill-tag">SUPERMARTS</span>
            </div>
            <div className="stat-title">Modern SFARMART24 Stores</div>
            <div className="stat-sub">One-stop stores offering certified seeds, soil nutrients, tools & animal nutrition.</div>
          </div>

          <div className="scenic-stat-card">
            <div className="stat-glow-line"></div>
            <div className="stat-icon-row">
              <span className="stat-number">30–45m</span>
              <span className="stat-pill-tag">EXPRESS</span>
            </div>
            <div className="stat-title">Farm-Fresh Delivery</div>
            <div className="stat-sub">Harvest-fresh vegetables, dairy, home meals & bakery delivered to urban doorsteps.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
