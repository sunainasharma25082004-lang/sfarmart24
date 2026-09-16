import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  UserCheck,
  Server,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Printer,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Search,
  Scale,
  Smartphone,
  CreditCard,
  Building2,
  ChevronRight,
  Copy,
  Check,
  Link2
} from 'lucide-react';
import './PrivacyPolicyPage.css';

export default function PrivacyPolicyPage({ onNavigateToHome, onOpenContact }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('all');
  const [copied, setCopied] = useState(false);

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://sfarmart.co.in';
  const campaignUrl = `${currentOrigin}/privacy`;

  const handleCopyLink = (urlToCopy = campaignUrl) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(urlToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sections = [
    { id: 'sec-overview', label: '1. Overview & Scope' },
    { id: 'sec-collection', label: '2. Information We Collect' },
    { id: 'sec-usage', label: '3. How We Use Data' },
    { id: 'sec-sharing', label: '4. Data Sharing & Third Parties' },
    { id: 'sec-financial', label: '5. KYC, Banking & UPI Security' },
    { id: 'sec-location', label: '6. Location & Permissions' },
    { id: 'sec-cookies', label: '7. Cookies & Tracking Tech' },
    { id: 'sec-security', label: '8. Data Security & Storage' },
    { id: 'sec-retention', label: '9. Data Retention Policy' },
    { id: 'sec-rights', label: '10. Your Rights (DPDP Act)' },
    { id: 'sec-grievance', label: '11. Grievance Officer' },
  ];

  return (
    <div className="privacy-page-wrapper">
      {/* 1. Hero Header */}
      <section className="privacy-hero-section">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="privacy-breadcrumb">
            <button className="breadcrumb-link" onClick={onNavigateToHome}>
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </button>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Legal & Privacy Policy</span>
          </nav>

          <div className="privacy-hero-card">
            <div className="privacy-badge">
              <ShieldCheck size={18} />
              <span>Official Policy & Data Governance</span>
            </div>

            <h1 className="privacy-title">SFARMART24 Privacy Policy</h1>
            <p className="privacy-sub">
              Your trust is our cornerstone. Learn how Farmart Agri Tech Pvt Ltd collects, uses, protects, and governs your personal and commercial data across our agri-tech platforms, mobile applications, and community networks.
            </p>

            <div className="privacy-meta-pills">
              <div className="meta-pill">
                <Clock size={15} />
                <span>Effective Date: <strong>January 1, 2025</strong></span>
              </div>
              <div className="meta-pill">
                <Scale size={15} />
                <span>Compliance: <strong>DPDP Act 2023 & IT Act 2000</strong></span>
              </div>
              <div className="meta-pill">
                <Building2 size={15} />
                <span>Entity: <strong>Farmart Agri Tech Pvt Ltd</strong></span>
              </div>
            </div>

            {/* Campaign Direct Link Box */}
            <div className="campaign-link-box">
              <div className="campaign-link-header">
                <span className="campaign-live-indicator"></span>
                <strong>Official Direct Link for Ad Campaigns (Meta Ads / Google Ads):</strong>
              </div>
              <div className="campaign-link-input-row">
                <div className="campaign-url-display">
                  <Link2 size={16} className="campaign-link-icon" />
                  <code>{campaignUrl}</code>
                </div>
                <button
                  type="button"
                  className={`btn copy-campaign-btn ${copied ? 'copied-btn' : ''}`}
                  onClick={() => handleCopyLink(campaignUrl)}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'Copied Link!' : 'Copy Campaign URL'}</span>
                </button>
              </div>
              <div className="campaign-alt-links">
                <span className="alt-label">Direct Supported URLs:</span>
                <button type="button" className="alt-link-pill" title="Click to copy" onClick={() => handleCopyLink(`${currentOrigin}/privacy`)}>
                  /privacy
                </button>
                <button type="button" className="alt-link-pill" title="Click to copy" onClick={() => handleCopyLink(`${currentOrigin}/?view=privacy`)}>
                  /?view=privacy
                </button>
                <button type="button" className="alt-link-pill" title="Click to copy" onClick={() => handleCopyLink(`${currentOrigin}/#privacy`)}>
                  /#privacy
                </button>
                <button type="button" className="alt-link-pill" title="Click to copy" onClick={() => handleCopyLink(`${currentOrigin}/privacy.html`)}>
                  /privacy.html
                </button>
              </div>
            </div>

            <div className="privacy-hero-actions">
              <button className="btn btn-secondary print-btn" onClick={handlePrint} title="Print or save as PDF">
                <Printer size={16} />
                <span>Print Policy</span>
              </button>
              <button className="btn btn-primary" onClick={() => scrollToSection('sec-grievance')}>
                <UserCheck size={16} />
                <span>Grievance Officer</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Privacy Guarantees */}
      <section className="privacy-guarantees-section">
        <div className="container">
          <div className="guarantees-grid">
            <div className="guarantee-card">
              <div className="guarantee-icon-box icon-emerald">
                <ShieldCheck size={24} />
              </div>
              <h3>Zero Data Brokering</h3>
              <p>We never sell or rent your personal, harvest, or commercial data to unauthorized third-party advertisers or data brokers.</p>
            </div>

            <div className="guarantee-card">
              <div className="guarantee-icon-box icon-blue">
                <Lock size={24} />
              </div>
              <h3>Bank-Grade Encryption</h3>
              <p>All sensitive bank account details, UPI authorizations, and KYC documents are protected with 256-bit AES encryption.</p>
            </div>

            <div className="guarantee-card">
              <div className="guarantee-icon-box icon-amber">
                <Smartphone size={24} />
              </div>
              <h3>Hyperlocal Transparency</h3>
              <p>GPS and device location data are requested solely for real-time delivery tracking, farm gate pickups, and hub logistics.</p>
            </div>

            <div className="guarantee-card">
              <div className="guarantee-icon-box icon-purple">
                <Scale size={24} />
              </div>
              <h3>DPDP Act 2023 Compliant</h3>
              <p>You maintain full control over your personal data with rights to access, rectify, or request permanent erasure anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Policy Layout (Sidebar Nav + Content Body) */}
      <section className="privacy-body-section section-padding">
        <div className="container">
          <div className="privacy-layout-grid">
            {/* Table of Contents Sticky Sidebar */}
            <aside className="privacy-sidebar">
              <div className="sidebar-sticky-card">
                <div className="sidebar-header">
                  <FileText size={18} />
                  <h3>Table of Contents</h3>
                </div>

                <div className="toc-search-box">
                  <Search size={15} />
                  <input
                    type="text"
                    placeholder="Search policy..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <nav className="sidebar-nav">
                  {sections.map((item) => (
                    <button
                      key={item.id}
                      className={`sidebar-nav-btn ${activeSection === item.id ? 'active-toc-item' : ''}`}
                      onClick={() => scrollToSection(item.id)}
                    >
                      <span>{item.label}</span>
                      <ChevronRight size={14} className="toc-arrow" />
                    </button>
                  ))}
                </nav>

                <div className="sidebar-help-box">
                  <h4>Have a question?</h4>
                  <p>Our Data Protection team is here to assist with any privacy queries.</p>
                  <button className="sidebar-contact-btn" onClick={onOpenContact}>
                    <Mail size={14} />
                    <span>Contact Privacy Team</span>
                  </button>
                </div>
              </div>
            </aside>

            {/* Comprehensive Document Content */}
            <article className="privacy-content-article">
              {/* Section 1 */}
              <div id="sec-overview" className="policy-block">
                <div className="policy-block-badge">Section 1</div>
                <h2>1. Overview & Scope</h2>
                <p>
                  Welcome to <strong>SFARMART24</strong>, operated by <strong>Farmart Agri Tech Pvt Ltd</strong> (“Farmart”, “Company”, “we”, “our”, or “us”). This Privacy Policy describes how we collect, handle, store, and safeguard your personal information when you access or use:
                </p>
                <ul className="styled-list">
                  <li>Our consumer web portal (<strong>sfarmart.co.in</strong>) and customer mobile applications.</li>
                  <li>The <strong>Farmart Kisan App</strong> and Farmer Procurement Network.</li>
                  <li>The <strong>Village Hub POS & Management System</strong> operated at Gram Panchayat levels.</li>
                  <li>The <strong>Home Restro</strong> kitchen management application and local food creator tools.</li>
                  <li>The <strong>FOCO Supermart Franchise</strong> retail systems and Digital Partner portals.</li>
                  <li>Any customer service, digital payments, logistics tracking, and advisory interactions associated with our ecosystem.</li>
                </ul>
                <p>
                  By visiting our website, downloading our applications, or enrolling in any vertical of our ecosystem, you agree to the collection and use of information in accordance with this Privacy Policy and applicable laws of India.
                </p>
                <div className="notice-box info-notice">
                  <AlertCircle size={20} />
                  <div>
                    <strong>Jurisdictional Framework:</strong> This policy strictly complies with the <em>Digital Personal Data Protection Act (DPDP Act) 2023</em>, the <em>Information Technology Act, 2000</em>, and the <em>IT (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</em>.
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div id="sec-collection" className="policy-block">
                <div className="policy-block-badge">Section 2</div>
                <h2>2. Categories of Information We Collect</h2>
                <p>
                  Depending on whether you participate as a Consumer, Farmer, Village Hub Operator, Home Chef, Franchisee, or Digital Partner, we collect the following categories of information:
                </p>

                <div className="data-table-container">
                  <table className="policy-table">
                    <thead>
                      <tr>
                        <th>Participant Role</th>
                        <th>Types of Information Collected</th>
                        <th>Purpose of Collection</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Consumers & Shoppers</strong></td>
                        <td>Name, delivery address, phone number, email address, order history, GPS delivery location, device identifiers.</td>
                        <td>Order dispatch, doorstep delivery, customer notifications, and invoicing.</td>
                      </tr>
                      <tr>
                        <td><strong>Farmers & FPOs</strong></td>
                        <td>Aadhaar/Voter ID (KYC), landholding area, crop varieties, harvest schedule, soil health card details, bank account & IFSC for DBT.</td>
                        <td>Direct crop procurement, harvest scheduling, soil advisories, and 24-hour farm-gate payouts.</td>
                      </tr>
                      <tr>
                        <td><strong>Village Hub Operators</strong></td>
                        <td>Business registration, Aadhaar, PAN card, physical shop address, inventory intake records, billing terminal metrics.</td>
                        <td>Hub franchise agreement, local produce grading, order consolidation, and commission settlements.</td>
                      </tr>
                      <tr>
                        <td><strong>Home Restro Chefs</strong></td>
                        <td>FSSAI registration number, commercial kitchen hygiene photos, menu listings, bank account details, cooking timestamps.</td>
                        <td>FSSAI food regulatory compliance, hygienic home-cooked meal delivery, and partner earnings.</td>
                      </tr>
                      <tr>
                        <td><strong>Digital Partners & Franchisees</strong></td>
                        <td>KYC identity documents, payment transaction IDs (e.g. ₹199 onboarding pass), territory coordinates, bank account details.</td>
                        <td>Account verification, territorial growth allocation, and referral incentive disbursements.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="subsection">
                  <h3>2.1 Automated Technical Information</h3>
                  <p>
                    When you access our online systems, our servers automatically collect non-personally identifiable diagnostic data including your IP address, browser type, operating system version, referring URLs, screen resolution, and session logs to maintain system stability and prevent fraudulent activity.
                  </p>
                </div>
              </div>

              {/* Section 3 */}
              <div id="sec-usage" className="policy-block">
                <div className="policy-block-badge">Section 3</div>
                <h2>3. How We Use Collected Data</h2>
                <p>We process your information strictly for legitimate commercial and operational purposes, including:</p>

                <div className="feature-checklist-grid">
                  <div className="checklist-item">
                    <CheckCircle2 size={18} className="check-icon" />
                    <div>
                      <strong>Order Processing & Hyperlocal Fulfillment:</strong> Ensuring fresh organic produce is harvested, graded at Village Hubs, and delivered to consumer kitchens within 12 hours.
                    </div>
                  </div>
                  <div className="checklist-item">
                    <CheckCircle2 size={18} className="check-icon" />
                    <div>
                      <strong>Direct Farm-Gate Payouts:</strong> Executing immediate bank or UPI credits to our network of 50,000+ farmers upon harvest collection without mandi middleman deductions.
                    </div>
                  </div>
                  <div className="checklist-item">
                    <CheckCircle2 size={18} className="check-icon" />
                    <div>
                      <strong>Agronomic & Soil Advisory:</strong> Providing personalized weather alerts, organic fertilizer recommendations, and seasonal market price forecasts to verified farmers.
                    </div>
                  </div>
                  <div className="checklist-item">
                    <CheckCircle2 size={18} className="check-icon" />
                    <div>
                      <strong>Food Safety & Quality Compliance:</strong> Maintaining audit records of FSSAI registrations and batch inspection logs for Home Restro partners and packaged goods.
                    </div>
                  </div>
                  <div className="checklist-item">
                    <CheckCircle2 size={18} className="check-icon" />
                    <div>
                      <strong>Account Security & Fraud Prevention:</strong> Validating one-time passwords (OTP), detecting suspicious login activities, and verifying digital partnership transactions.
                    </div>
                  </div>
                  <div className="checklist-item">
                    <CheckCircle2 size={18} className="check-icon" />
                    <div>
                      <strong>Customer & Partner Support:</strong> Resolving service tickets, addressing delivery inquiries, and providing bilingual assistance via our 1800 Kisan helpline.
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div id="sec-sharing" className="policy-block">
                <div className="policy-block-badge">Section 4</div>
                <h2>4. Data Sharing & Third-Party Processors</h2>
                <p>
                  <strong>We do not sell, trade, or monetize your personal information.</strong> We only share minimal necessary information with vetted third-party service providers bound by strict non-disclosure and data protection contracts:
                </p>

                <div className="bullet-cards-stack">
                  <div className="bullet-card">
                    <div className="bullet-num">A</div>
                    <div>
                      <h4>Logistics & Last-Mile Fleet Partners</h4>
                      <p>We share customer delivery address, contact name, and phone number with our delivery fleet partners solely to complete active orders. Fleet partners are forbidden from retaining customer data post-delivery.</p>
                    </div>
                  </div>

                  <div className="bullet-card">
                    <div className="bullet-num">B</div>
                    <div>
                      <h4>Payment Gateways & NPCI / RBI-Regulated Banks</h4>
                      <p>All online payments (UPI, Cards, Net Banking) are securely routed through PCI-DSS Level 1 certified payment gateways. SFARMART24 never stores your CVV, full card numbers, or UPI MPINs.</p>
                    </div>
                  </div>

                  <div className="bullet-card">
                    <div className="bullet-num">C</div>
                    <div>
                      <h4>Statutory & Government Compliance</h4>
                      <p>We may disclose necessary records if required by Indian judicial orders, law enforcement authorities, or tax regulators in compliance with the Code of Criminal Procedure and Indian evidence statutes.</p>
                    </div>
                  </div>

                  <div className="bullet-card">
                    <div className="bullet-num">D</div>
                    <div>
                      <h4>Cloud & Technical Infrastructure</h4>
                      <p>Our server infrastructure is hosted within secure, ISO 27001-certified data centers located physically within the territory of India (MeitY empaneled cloud providers).</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 5 */}
              <div id="sec-financial" className="policy-block">
                <div className="policy-block-badge">Section 5</div>
                <h2>5. KYC, Banking & UPI Security</h2>
                <p>
                  As an ecosystem facilitating community commerce, micro-franchises, and agricultural procurement, we handle sensitive financial data with the utmost technical rigor:
                </p>
                <div className="financial-specs-grid">
                  <div className="spec-card">
                    <CreditCard size={24} className="spec-icon" />
                    <h4>Zero Card Data Storage</h4>
                    <p>We do not store credit or debit card PAN numbers or CVV codes. All payments are processed through tokenized RBI-compliant payment aggregator flows.</p>
                  </div>
                  <div className="spec-card">
                    <Lock size={24} className="spec-icon" />
                    <h4>KYC Redaction & Masking</h4>
                    <p>Farmer and partner Aadhaar documents collected for government compliance are masked in accordance with UIDAI regulations so only the last 4 digits remain visible.</p>
                  </div>
                  <div className="spec-card">
                    <Server size={24} className="spec-icon" />
                    <h4>Direct Bank Account Verification</h4>
                    <p>Farmer bank details are verified using automated penny-drop penny-validation APIs to prevent misdirected DBT transfers and ensure fair compensation.</p>
                  </div>
                </div>
              </div>

              {/* Section 6 */}
              <div id="sec-location" className="policy-block">
                <div className="policy-block-badge">Section 6</div>
                <h2>6. Location Data & Mobile App Permissions</h2>
                <p>
                  Our mobile apps request specific device permissions strictly required to execute core platform functions:
                </p>
                <ul className="styled-list">
                  <li><strong>Precise Location (GPS):</strong> Used to calculate accurate delivery ETA, determine nearest Village Hub inventory, and verify farm-gate harvest coordinates. Users can set manual addresses at any time.</li>
                  <li><strong>Camera & Media Storage:</strong> Used by Home Chefs and Hub managers to upload fresh crop batch images, quality test results, and FSSAI hygiene audit certificates.</li>
                  <li><strong>Notifications (Push & SMS):</strong> Used to send OTP authentications, order status alerts, harvest collection notifications, and weather advisories.</li>
                </ul>
                <div className="notice-box warning-notice">
                  <AlertCircle size={20} />
                  <div>
                    <strong>Background Location Policy:</strong> We never track background location unless a field delivery partner is actively performing an ongoing delivery route. Consumer apps never track location when closed.
                  </div>
                </div>
              </div>

              {/* Section 7 */}
              <div id="sec-cookies" className="policy-block">
                <div className="policy-block-badge">Section 7</div>
                <h2>7. Cookies & Tracking Technologies</h2>
                <p>
                  SFARMART24 uses cookies and browser local storage to ensure smooth navigation, remember your cart items, and personalize your experience:
                </p>
                <div className="cookies-list">
                  <div className="cookie-item">
                    <span className="cookie-badge essential">Essential Cookies</span>
                    <p>Mandatory for site security, user session authentication, and shopping cart persistence. These cannot be disabled.</p>
                  </div>
                  <div className="cookie-item">
                    <span className="cookie-badge performance">Performance & Analytics</span>
                    <p>Anonymized statistical cookies that help us understand page load speeds and optimize user navigation.</p>
                  </div>
                  <div className="cookie-item">
                    <span className="cookie-badge preference">Preference Cookies</span>
                    <p>Remembers your selected language (Hindi, English, regional dialects) and nearest delivery PIN code.</p>
                  </div>
                </div>
                <p className="cookie-footer-text">
                  You can manage your cookie preferences through your web browser settings at any time. Please note that disabling essential cookies may impact certain platform features.
                </p>
              </div>

              {/* Section 8 & 9 */}
              <div id="sec-security" className="policy-block">
                <div className="policy-block-badge">Section 8 & 9</div>
                <h2>8. Data Security, Storage & Retention</h2>
                <p>
                  We implement robust technological and managerial security measures in adherence to ISO/IEC 27001 standards:
                </p>
                <ul className="styled-list">
                  <li><strong>Data Localization:</strong> All user data, transactional ledgers, and KYC files are stored exclusively on secure cloud servers situated physically within India.</li>
                  <li><strong>Encryption Protocols:</strong> All data in transit is protected using TLS 1.3 cryptographic protocols. Data at rest is encrypted with AES-256 standards.</li>
                  <li><strong>Role-Based Access Control (RBAC):</strong> Employee access to customer or farmer information is strictly on a need-to-know basis and audited with biometric/MFA logging.</li>
                  <li><strong>Retention Guidelines:</strong> Personal data is retained only as long as necessary to fulfill the operational purposes described herein, or to satisfy legal, accounting, or tax requirements (generally 7 years for financial records under Indian tax laws).</li>
                </ul>
              </div>

              {/* Section 10 */}
              <div id="sec-rights" className="policy-block">
                <div className="policy-block-badge">Section 10</div>
                <h2>10. Your Rights Under the DPDP Act 2023</h2>
                <p>
                  As a citizen and data principal under Indian law, you are entitled to exercise comprehensive statutory rights:
                </p>
                <div className="rights-grid">
                  <div className="right-card">
                    <Eye size={20} className="right-icon" />
                    <h4>Right to Access & Summary</h4>
                    <p>You can request a complete digital summary of all personal data held by Farmart regarding your account.</p>
                  </div>
                  <div className="right-card">
                    <CheckCircle2 size={20} className="right-icon" />
                    <h4>Right to Correction & Updating</h4>
                    <p>You may rectify any outdated, inaccurate, or incomplete personal or banking details instantly.</p>
                  </div>
                  <div className="right-card">
                    <Lock size={20} className="right-icon" />
                    <h4>Right to Erasure / Deletion</h4>
                    <p>You may request the permanent deletion of your profile and data, subject to statutory tax record retention requirements.</p>
                  </div>
                  <div className="right-card">
                    <Scale size={20} className="right-icon" />
                    <h4>Right to Grievance Redressal</h4>
                    <p>You have the absolute right to have any data concerns addressed by our designated Grievance Officer within 48 hours.</p>
                  </div>
                </div>
              </div>

              {/* Section 11 */}
              <div id="sec-grievance" className="policy-block grievance-block">
                <div className="policy-block-badge">Section 11</div>
                <h2>11. Grievance Redressal & Data Protection Officer</h2>
                <p>
                  In accordance with the <em>Information Technology Act 2000</em> and the <em>Digital Personal Data Protection Act 2023</em>, the contact information of our designated Grievance Officer is published below:
                </p>

                <div className="officer-card">
                  <div className="officer-header">
                    <div className="officer-avatar">
                      <UserCheck size={28} />
                    </div>
                    <div>
                      <h3 className="officer-name">Mr. Rajeshwar Sharma</h3>
                      <p className="officer-role">Chief Data Protection & Grievance Officer</p>
                      <span className="officer-corp">Farmart Agri Tech Pvt Ltd (SFARMART24)</span>
                    </div>
                  </div>

                  <div className="officer-details-grid">
                    <div className="officer-detail-item">
                      <MapPin size={18} className="detail-icon" />
                      <div>
                        <strong>Corporate Headquarters:</strong>
                        <p>Farmart Tower, Sector 4, Outer Ring Road, Bengaluru, Karnataka - 560103, India</p>
                      </div>
                    </div>

                    <div className="officer-detail-item">
                      <Mail size={18} className="detail-icon" />
                      <div>
                        <strong>Email Address:</strong>
                        <p><a href="mailto:privacy@sfarmart.co.in">privacy@sfarmart.co.in</a> / <a href="mailto:grievance@sfarmart.co.in">grievance@sfarmart.co.in</a></p>
                      </div>
                    </div>

                    <div className="officer-detail-item">
                      <Phone size={18} className="detail-icon" />
                      <div>
                        <strong>Toll-Free Helpline:</strong>
                        <p>1800-123-FARMART (1800-123-3276) [Ext. 4 - Privacy Desk]</p>
                      </div>
                    </div>

                    <div className="officer-detail-item">
                      <Clock size={18} className="detail-icon" />
                      <div>
                        <strong>Working Hours & SLA:</strong>
                        <p>Monday - Friday: 10:00 AM - 6:00 PM IST<br />Acknowledgment within 48 hours; Resolution within 15 business days.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 12 */}
              <div className="policy-block">
                <div className="policy-block-badge">Section 12</div>
                <h2>12. Policy Revisions & Updates</h2>
                <p>
                  We may periodically update this Privacy Policy to reflect technological developments, platform feature expansions, or amendments to Indian agricultural and privacy laws. When significant changes occur, we will notify you through prominent in-app banners, SMS advisories to registered farmers, and updated timestamps at the top of this page.
                </p>
              </div>

              {/* Bottom CTA Card */}
              <div className="privacy-cta-banner">
                <div className="cta-banner-content">
                  <Sparkles size={32} className="cta-icon-sparkle" />
                  <div>
                    <h3>Need assistance or want to request data deletion?</h3>
                    <p>Our dedicated compliance team is ready to address your privacy questions or process your DPDP data request.</p>
                  </div>
                </div>
                <div className="cta-banner-buttons">
                  <button className="btn btn-primary" onClick={onOpenContact}>
                    <span>Submit Privacy Query</span>
                  </button>
                  <button className="btn btn-secondary" onClick={onNavigateToHome}>
                    <span>Back to Farmart Home</span>
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
