import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  Download,
  ExternalLink,
  QrCode,
  CreditCard,
  Send,
  Upload,
  ShieldCheck,
  Smartphone,
  Sparkles,
  RefreshCw,
  FileText,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  ArrowDown,
  X,
  Info
} from 'lucide-react';
import './DigitalPartnerApplyForm.css';

export default function DigitalPartnerApplyForm({ onOpenContact }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    cityState: '',
    profession: 'Student / College Youth',
    utrNumber: '',
    whyJoin: '',
    agreed: true
  });

  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState(null);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [simulatedPaying, setSimulatedPaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const upiId = 'SFARMART24';
  const registrationFee = 199;
  const upiPaymentLink = `upi://pay?pa=SFARMART24@razorpay&pn=Sfarmart24&am=199&cu=INR&tn=Digital+Partner+Application`;
  const googleFormLink = 'https://docs.google.com/forms/d/e/1FAIpQLSc_ExampleSfarmart24DigitalPartnerForm/viewform';

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLiveRazorpayPayment = () => {
    if (typeof window.Razorpay === 'undefined') {
      alert('Razorpay Checkout SDK लोड नहीं हो पाया। कृपया पेज रिफ्रेश करें।');
      return;
    }

    const options = {
      key: 'rzp_live_Td3vCBrNQSYyl8',
      amount: 19900, // ₹199 in paise
      currency: 'INR',
      name: 'Sfarmart24',
      description: 'Digital Business Partner Onboarding Fee',
      image: '/updated-logo.jpeg',
      prefill: {
        name: formData.fullName || '',
        email: formData.email || '',
        contact: formData.phone || ''
      },
      notes: {
        city: formData.cityState || '',
        purpose: 'Digital Partner Onboarding'
      },
      theme: {
        color: '#15803d'
      },
      handler: function (response) {
        if (response && response.razorpay_payment_id) {
          const payId = response.razorpay_payment_id;
          setFormData((prev) => ({
            ...prev,
            utrNumber: payId
          }));
          setShowRazorpayModal(false);
          alert(`₹199 का पेमेंट सफलतापूर्वक पूरा हुआ!\n\nपेमेंट ID (${payId}) फॉर्म में भर दी गई है। कृपया फॉर्म सबमिट करें।`);
          const utrInput = document.getElementById('utr-input-field');
          if (utrInput) utrInput.focus();
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullName.trim()) {
      setErrorMessage('कृपया अपना पूरा नाम लिखें (Please enter your full name).');
      return;
    }

    if (!formData.phone || formData.phone.length < 10) {
      setErrorMessage('कृपया सही 10 अंकों का व्हाट्सएप मोबाइल नंबर लिखें (Enter valid 10-digit mobile number).');
      return;
    }

    if (!formData.email.trim()) {
      setErrorMessage('कृपया अपनी ईमेल आईडी लिखें (Please enter your email address).');
      return;
    }

    if (!formData.cityState.trim()) {
      setErrorMessage('कृपया अपना शहर और राज्य लिखें (Please enter your city and state).');
      return;
    }

    const hasUtr = Boolean(formData.utrNumber && formData.utrNumber.trim().length >= 6);
    if (!hasUtr && !screenshotPreview) {
      setErrorMessage('कृपया Razorpay / UPI पेमेंट का 12 अंकों का UTR नंबर लिखें अथवा पेमेंट का स्क्रीनशॉट अपलोड करें।');
      const utrEl = document.getElementById('utr-input-field');
      if (utrEl) utrEl.focus();
      return;
    }

    setSubmitting(true);

    const generatedId = `SFM-DP-${Math.floor(100000 + Math.random() * 900000)}`;
    const targetWhatsAppNumber = '918146207005';
    const effectiveUtr = hasUtr ? formData.utrNumber.trim() : 'SCREENSHOT_ATTACHED';

    const whatsappMsg = `🌾 *SFARMART24 - Digital Partner Application* 🌾
━━━━━━━━━━━━━━━━━━━━━━
📋 *Application ID:* ${generatedId}
👤 *Full Name (पूरा नाम):* ${formData.fullName.trim()}
📱 *WhatsApp No (मोबाइल):* ${formData.phone.trim()}
📧 *Email (ईमेल):* ${formData.email.trim()}
📍 *City & State (शहर/राज्य):* ${formData.cityState.trim()}
💼 *Profession (पेशा):* ${formData.profession}
💰 *Registration Fee (फीस):* ₹199 (Paid via Razorpay/UPI)
🔢 *12-Digit UTR / Ref No:* ${effectiveUtr}
━━━━━━━━━━━━━━━━━━━━━━
✅ *नमस्ते! मैंने ₹199 का भुगतान कर दिया है और पार्टनर आवेदन सबमिट किया है। कृपया मेरा डिजिटल पार्टनर QR कोड और लॉगिन एक्टिवेट करें।*`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${targetWhatsAppNumber}&text=${encodeURIComponent(whatsappMsg)}`;

    const newRecord = {
      id: generatedId,
      name: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      category: 'Digital Partner',
      location: formData.cityState.trim(),
      profession: formData.profession,
      whyJoin: formData.whyJoin,
      feePaid: '₹199',
      utrNumber: effectiveUtr,
      hasScreenshot: !!screenshotPreview,
      date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      status: 'Verified - In Activation',
      refCode: generatedId,
      whatsappUrl
    };

    try {
      const existing = JSON.parse(localStorage.getItem('sfarmart_digital_partner_applications') || '[]');
      existing.unshift(newRecord);
      localStorage.setItem('sfarmart_digital_partner_applications', JSON.stringify(existing));

      // 1. Sync to main backend /api/submissions (MongoDB + Screenshot save)
      fetch('https://sfarmart24-web-api.onrender.com/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId: generatedId,
          fullName: formData.fullName.trim(),
          mobileNumber: formData.phone.trim(),
          email: formData.email.trim(),
          address: formData.cityState.trim(),
          paymentRef: effectiveUtr,
          paymentMethod: hasUtr ? 'UPI QR Scan (UTR)' : 'UPI QR Scan (Screenshot Attached)',
          amount: 199,
          status: 'PAID',
          screenshotBase64: screenshotPreview || undefined,
          screenshotFilename: screenshotPreview ? `dp_${generatedId}.jpg` : undefined
        })
      }).catch(() => {});

      // 2. Legacy /api/apply
      fetch('https://sfarmart24-web-api.onrender.com/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: 'digital-business-partner',
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          district: formData.cityState,
          state: formData.cityState,
          experience: formData.profession,
          notes: `₹199 Paid. UTR: ${effectiveUtr}. WhatsApp: +91 81462 07005`
        })
      }).catch(() => {});
    } catch (err) {
      console.error(err);
    }

    setTimeout(() => {
      setSubmitting(false);
      setSubmittedApp(newRecord);
      window.scrollTo({ top: document.getElementById('digital-partner-apply')?.offsetTop - 50 || 100, behavior: 'smooth' });
      // Direct redirect to WhatsApp with application data for number +91 81462 07005
      try {
        window.open(whatsappUrl, '_blank');
      } catch (e) {
        console.error('Popup blocked:', e);
      }
    }, 600);
  };

  return (
    <div id="digital-partner-apply" className="dp-apply-root">
      {/* Visual Step-by-Step Top Instruction Bar */}
      <div className="dp-flow-guide-bar">
        <div className="container">
          <div className="flow-steps-grid">
            <div className="flow-step-box active-step-box">
              <div className="step-badge">STEP 1</div>
              <div className="step-info">
                <strong>QR स्कैन करके ₹199 पे करें</strong>
                <p>Google Pay, PhonePe, Paytm या BHIM से ₹199 भेजें</p>
              </div>
            </div>

            <div className="flow-connector">&rarr;</div>

            <div className="flow-step-box active-step-box">
              <div className="step-badge">STEP 2</div>
              <div className="step-info">
                <strong>12-अंकों का UTR नंबर नोट करें</strong>
                <p>पेमेंट रसीद में मिला 12-digit UTR / UPI Ref ID कॉपी करें</p>
              </div>
            </div>

            <div className="flow-connector">&rarr;</div>

            <div className="flow-step-box active-step-box">
              <div className="step-badge">STEP 3</div>
              <div className="step-info">
                <strong>यह फॉर्म भरकर सबमिट करें</strong>
                <p>2 घंटे में आपका डिजिटल पार्टनर QR व लॉगिन चालू होगा</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container dp-main-container">
        {/* If Application is Submitted - Show Receipt */}
        {submittedApp ? (
          <div className="dp-success-receipt-card fade-in">
            <div className="success-header-strip">
              <CheckCircle2 size={36} />
              <div>
                <h2>आवेदन सफलतापूर्वक दर्ज हो गया! (Application Submitted)</h2>
                <p>आपका ₹199 पेमेंट और विवरण सुरक्षित रूप से रिकॉर्ड कर लिया गया है।</p>
              </div>
            </div>

            <div className="receipt-body">
              <div className="receipt-grid">
                <div className="receipt-item">
                  <span className="receipt-k">एप्लीकेशन आईडी (Application ID)</span>
                  <span className="receipt-v ref-tag">{submittedApp.id}</span>
                </div>
                <div className="receipt-item">
                  <span className="receipt-k">आवेदक का नाम (Name)</span>
                  <span className="receipt-v">{submittedApp.name}</span>
                </div>
                <div className="receipt-item">
                  <span className="receipt-k">व्हाट्सएप मोबाइल नंबर (WhatsApp)</span>
                  <span className="receipt-v">{submittedApp.phone}</span>
                </div>
                <div className="receipt-item">
                  <span className="receipt-k">ईमेल आईडी (Email)</span>
                  <span className="receipt-v">{submittedApp.email}</span>
                </div>
                <div className="receipt-item">
                  <span className="receipt-k">रजिस्ट्रेशन फीस (Fee Paid)</span>
                  <span className="receipt-v green-val">₹199 (One-Time Verified)</span>
                </div>
                <div className="receipt-item">
                  <span className="receipt-k">पेमेंट UTR / Transaction No.</span>
                  <span className="receipt-v mono-val">{submittedApp.utrNumber}</span>
                </div>
              </div>

              <div className="receipt-notice-box">
                <Clock size={20} className="notice-icon" />
                <div>
                  <strong>अगला कदम क्या होगा? (What Happens Next?)</strong>
                  <p>
                    हमारी टीम आपके पेमेंट UTR <strong>({submittedApp.utrNumber})</strong> का मिलान करके अगले <strong>2 घंटे के भीतर</strong> आपके व्हाट्सएप नंबर <strong>({submittedApp.phone})</strong> पर आपका ऑफिशियल पार्टनर QR कोड, रेफरल लिंक और पार्टनर ऐप लॉगिन भेज देगी।
                  </p>
                </div>
              </div>

              <div className="receipt-btn-group">
                <button className="btn btn-primary" onClick={() => window.print()}>
                  <Download size={18} />
                  <span>रसीद प्रिंट / डाउनलोड करें (Print Receipt)</span>
                </button>
                <a
                  href={submittedApp.whatsappUrl || `https://api.whatsapp.com/send?phone=918146207005&text=Hello`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp-confirm"
                >
                  <Smartphone size={18} />
                  <span>WhatsApp पर डेटा भेजें (Send to +91 81462 07005)</span>
                </a>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setSubmittedApp(null);
                    setFormData({
                      fullName: '',
                      phone: '',
                      email: '',
                      cityState: '',
                      profession: 'Student / College Youth',
                      utrNumber: '',
                      whyJoin: '',
                      agreed: true
                    });
                    setScreenshotPreview(null);
                  }}
                >
                  <RefreshCw size={16} />
                  <span>नया आवेदन भरें (New Application)</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Two-Column Side-by-Side Application Layout */
          <div className="dp-two-column-layout">
            {/* -------------------------------------------------------- */}
            {/* LEFT COLUMN: THE OFFICIAL RAZORPAY STANDEE SCREENSHOT   */}
            {/* -------------------------------------------------------- */}
            <div className="dp-left-col">
              <div className="rp-standee-card">
                <div className="rp-standee-header">
                  <div className="step-tag-pill">STEP 1: SCAN &amp; PAY ₹199</div>
                  <h3 className="rp-card-title">Razorpay Official UPI QR</h3>
                  <p className="rp-card-sub">नीचे दिए गए Sfarmart24 QR कोड को स्कैन करके ₹199 पे करें</p>
                </div>

                {/* The Exact User-Uploaded Standee Image with Smartphone/Standee Frame */}
                <div className="standee-frame-wrapper">
                  <div className="standee-badge-top">
                    <span>Powered by Razorpay</span>
                  </div>
                  <img
                    src="/razorpay_qr.png"
                    alt="Sfarmart24 Razorpay UPI QR Code"
                    className="standee-exact-img"
                  />
                  <div className="standee-badge-bottom">
                    <span>Scan &amp; Pay ₹199 With Any UPI App</span>
                  </div>
                </div>

                {/* Instant Actions for the QR Card */}
                <div className="standee-card-actions">
                  <div className="fee-amount-bar">
                    <span className="fee-txt">रजिस्ट्रेशन फीस:</span>
                    <span className="fee-num">₹199</span>
                    <span className="fee-badge">One-Time Starter Kit</span>
                  </div>

                  {/* 1-Click Copy UPI ID */}
                  <div className="upi-copy-strip">
                    <div className="upi-txt-box">
                      <span className="upi-dim-label">UPI ID:</span>
                      <strong className="upi-val font-mono">{upiId}</strong>
                    </div>
                    <button
                      type="button"
                      className={`btn-upi-copy ${copiedUpi ? 'copied' : ''}`}
                      onClick={handleCopyUpi}
                    >
                      {copiedUpi ? (
                        <>
                          <Check size={16} />
                          <span>कॉपी हो गया!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          <span>Copy UPI ID</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Mobile Direct UPI App Pay Button */}
                  <a
                    href={upiPaymentLink}
                    className="btn btn-primary btn-pay-upi-direct"
                    title="Click to pay ₹199 via GPay, PhonePe, Paytm"
                  >
                    <Smartphone size={20} />
                    <span>Pay ₹199 via UPI (GPay / PhonePe / Paytm)</span>
                  </a>

                  {/* Razorpay Gateway Modal Checkout Button */}
                  <button
                    type="button"
                    className="btn btn-razorpay-online"
                    onClick={handleLiveRazorpayPayment}
                  >
                    <CreditCard size={18} />
                    <span>Pay ₹199 Online via Razorpay</span>
                  </button>

                  {/* Download Standee QR Button */}
                  <a
                    href="/razorpay_qr.png"
                    download="Sfarmart24_Razorpay_QR.png"
                    className="btn-download-qr-link"
                  >
                    <Download size={15} />
                    <span>QR कोड इमेज डाउनलोड करें (Download QR)</span>
                  </a>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------- */}
            {/* RIGHT COLUMN: THE CLEAN, INTUITIVE GOOGLE-FORM STYLE    */}
            {/* -------------------------------------------------------- */}
            <div className="dp-right-col">
              <div className="gform-box">
                {/* Google Form Accent Top Line */}
                <div className="gform-top-accent"></div>

                <div className="gform-box-head">
                  <div className="step-tag-pill green-pill">STEP 2: FILL APPLICATION FORM</div>
                  <h2 className="gform-heading">डिजिटल पार्टनर आवेदन पत्र</h2>
                  <p className="gform-subheading">
                    Sfarmart24 Digital Business Partner Registration (₹199 Starter Pack)
                  </p>
                  <p className="gform-guide-text">
                    कृपया अपना विवरण और ऊपर दिए गए Razorpay QR से किए गए भुगतान का <strong>12-अंकों का UTR नंबर</strong> यहाँ भरें।
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="gform-fields-stack">
                  {errorMessage && (
                    <div className="gform-alert-error">
                      <AlertCircle size={20} />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* 1. Full Name */}
                  <div className="field-block">
                    <label className="field-label">
                      1. Full Name / पूरा नाम <span className="red-star">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      className="field-input"
                      placeholder="Enter Full Name / पूरा नाम लिखें (उदा. रमेश कुमार)"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                    <span className="field-help">As per Bank account or Aadhaar / आधार कार्ड या बैंक खाते के अनुसार नाम लिखें</span>
                  </div>

                  {/* 2. WhatsApp Mobile Number */}
                  <div className="field-block">
                    <label className="field-label">
                      2. WhatsApp Mobile Number / व्हाट्सएप मोबाइल नंबर <span className="red-star">*</span>
                    </label>
                    <div className="phone-row">
                      <span className="prefix">+91</span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        className="field-input phone-in"
                        placeholder="10-digit WhatsApp number / 10 अंकों का व्हाट्सएप नंबर"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                      />
                    </div>
                    <span className="field-help">📌 Partner QR code &amp; login will be sent on this number / इसी नंबर पर पार्टनर QR और लॉगिन मिलेगा</span>
                  </div>

                  {/* 3. Email ID */}
                  <div className="field-block">
                    <label className="field-label">
                      3. Email Address / ईमेल आईडी <span className="red-star">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      className="field-input"
                      placeholder="yourname@gmail.com / अपनी ईमेल आईडी लिखें"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <span className="field-help">For monthly commission statements &amp; updates / मासिक कमीशन रिपोर्ट व अपडेट्स के लिए</span>
                  </div>

                  {/* 4. City & State */}
                  <div className="field-block">
                    <label className="field-label">
                      4. City &amp; State / शहर, जिला और राज्य <span className="red-star">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      className="field-input"
                      placeholder="e.g. Varanasi, Uttar Pradesh / उदा. वाराणसी, उत्तर प्रदेश"
                      value={formData.cityState}
                      onChange={(e) => setFormData({ ...formData, cityState: e.target.value })}
                    />
                  </div>

                  {/* 5. Profession / Role */}
                  <div className="field-block">
                    <label className="field-label">
                      5. Current Profession / वर्तमान कार्य या पेशा
                    </label>
                    <select
                      className="field-select"
                      value={formData.profession}
                      onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    >
                      <option value="Student / College Youth">Student / छात्र (कॉलेज युवा)</option>
                      <option value="Kirana / Retail Shop / CSC Operator">Kirana / Retail Shop / CSC Operator / दुकानदार</option>
                      <option value="Homemaker / Self-employed">Homemaker / महिला उद्यमी (गृहणी - घर से काम)</option>
                      <option value="Working Professional / Employee">Working Professional / नौकरीपेशा (साइड बिजनेस हेतु)</option>
                      <option value="Farmer / Agriculture Worker">Farmer / किसान भाई (कृषि कार्य)</option>
                      <option value="Freelancer / Digital Marketer">Freelancer / डिजिटल मार्केटर</option>
                      <option value="Other">Other / अन्य</option>
                    </select>
                  </div>

                  {/* 6. Razorpay / UPI 12-Digit UTR Number - HIGHLIGHTED */}
                  <div className="field-block utr-highlight-block">
                    <div className="utr-badge-row">
                      <CreditCard size={18} />
                      <span>₹199 Payment Verification / पेमेंट वेरिफिकेशन (Mandatory / अनिवार्य)</span>
                    </div>
                    <label className="field-label">
                      6. Razorpay / UPI 12-Digit UTR Number / 12-अंकों का UTR नंबर <span className="red-star">*</span>
                    </label>
                    <input
                      type="text"
                      id="utr-input-field"
                      required
                      className="field-input utr-input font-mono"
                      placeholder="e.g. 425619842103 or RZP1234567890"
                      value={formData.utrNumber}
                      onChange={(e) => setFormData({ ...formData, utrNumber: e.target.value })}
                    />

                    {/* Direct Live Razorpay Checkout Option */}
                    <div style={{ marginTop: '8px', marginBottom: '8px' }}>
                      <button
                        type="button"
                        onClick={handleLiveRazorpayPayment}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: 'linear-gradient(135deg, #0284c7, #0f766e)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '10px 16px',
                          borderRadius: '8px',
                          fontWeight: 600,
                          fontSize: '13.5px',
                          cursor: 'pointer',
                          width: '100%',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)',
                          transition: 'transform 0.15s, opacity 0.15s'
                        }}
                      >
                        <CreditCard size={17} />
                        <span>⚡ Pay ₹199 via Razorpay (UPI / Cards) — ऑटोमैटिक ID भरेगी</span>
                      </button>
                    </div>

                    {/* Visual Helpful Guide on how to find UTR */}
                    <div className="utr-guide-card">
                      <div className="guide-title">
                        <HelpCircle size={15} />
                        <strong>Where to find UTR? / UTR नंबर कहाँ मिलेगा?</strong>
                      </div>
                      <p>
                        1. In Google Pay / PhonePe / Paytm / BHIM, open <strong>"Transaction Details"</strong> or <strong>"History"</strong>.
                        <br />
                        2. Copy the 12-digit <strong>"UPI Ref No."</strong> or <strong>"UTR No."</strong> (उदा. 425619842103) and enter it above.
                      </p>
                    </div>
                  </div>

                  {/* 7. Optional Payment Screenshot */}
                  <div className="field-block">
                    <label className="field-label">
                      7. Payment Screenshot / पेमेंट रसीद का स्क्रीनशॉट (Optional / वैकल्पिक)
                    </label>
                    <div className="receipt-upload-wrap">
                      <input
                        type="file"
                        id="receipt-file-input"
                        accept="image/*"
                        className="file-input-hidden"
                        onChange={handleScreenshotChange}
                      />
                      {screenshotPreview ? (
                        <div className="uploaded-preview-row">
                          <img src={screenshotPreview} alt="Receipt Screenshot" className="preview-thumb" />
                          <button
                            type="button"
                            className="btn-clear-thumb"
                            onClick={() => setScreenshotPreview(null)}
                          >
                            <X size={14} />
                            <span>Remove / हटाएं</span>
                          </button>
                        </div>
                      ) : (
                        <label htmlFor="receipt-file-input" className="btn-browse-file">
                          <Upload size={18} />
                          <span>Upload Screenshot / स्क्रीनशॉट अपलोड करें</span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Agreement Checkbox */}
                  <div className="agreement-row">
                    <label className="agree-label">
                      <input
                        type="checkbox"
                        checked={formData.agreed}
                        onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                        required
                      />
                      <span>
                        I confirm that I have paid ₹199 and the information provided is accurate / मैं प्रमाणित करता/करती हूँ कि मैंने ₹199 का भुगतान कर दिया है और जानकारी सही है।
                      </span>
                    </label>
                  </div>

                  {/* Clean Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary btn-submit-gform"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw size={20} className="spin-icon" />
                        <span>Submitting... / सबमिट हो रहा है...</span>
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        <span>Submit (सबमिट करें)</span>
                      </>
                    )}
                  </button>

                  <div className="whatsapp-submit-hint">
                    <Smartphone size={16} />
                    <span>
                      सबमिट करने पर यह आवेदन सीधे <strong>WhatsApp (+91 81462 07005)</strong> पर भेजा जाएगा।
                    </span>
                  </div>

                  <div className="security-foot-bar">
                    <ShieldCheck size={16} />
                    <span>256-Bit SSL Secure &bull; Razorpay Verified Partner &bull; 2-Hour Activation</span>
                  </div>

                  {/* External Google Form fallback button */}
                  <div className="external-gform-strip">
                    <FileText size={15} />
                    <span>गूगल फॉर्म में भरना चाहते हैं?</span>
                    <a
                      href={googleFormLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-ext"
                    >
                      <span>गूगल फॉर्म लिंक खोलें</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Razorpay Online Payment Checkout Modal */}
      {showRazorpayModal && (
        <div className="rp-modal-backdrop">
          <div className="rp-modal-box fade-in">
            <div className="rp-modal-header">
              <div className="rp-modal-brand">
                <div className="rp-mini-logo">R</div>
                <div>
                  <h4 className="rp-merchant-name">SFARMART24</h4>
                  <span className="rp-pay-for">Digital Business Partner Kit</span>
                </div>
              </div>
              <button
                className="rp-modal-close"
                onClick={() => setShowRazorpayModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="rp-modal-body">
              <div className="rp-amount-display">
                <span className="amount-label">Payable Amount:</span>
                <span className="amount-digit">₹199.00</span>
              </div>

              <div className="rp-payment-options">
                <div className="rp-opt-card active-opt">
                  <Smartphone size={20} />
                  <div>
                    <strong>UPI (Google Pay, PhonePe, Paytm)</strong>
                    <p>Instant UPI Approval</p>
                  </div>
                </div>
                <div className="rp-opt-card">
                  <CreditCard size={20} />
                  <div>
                    <strong>Debit / Credit Card &amp; NetBanking</strong>
                    <p>All Indian Banks Supported</p>
                  </div>
                </div>
              </div>

              <div className="rp-sim-note">
                <Info size={16} />
                <span>
                  Razorpay Demo Payment: "Complete ₹199 Payment" पर क्लिक करते ही ₹199 का पेमेंट पूरा हो जाएगा और आपका UTR नंबर स्वतः फॉर्म में भर जाएगा!
                </span>
              </div>
            </div>

            <div className="rp-modal-footer">
              <button
                className="btn btn-primary rp-pay-now-btn"
                onClick={handleLiveRazorpayPayment}
              >
                <ShieldCheck size={18} />
                <span>Pay ₹199 via Razorpay Live</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
