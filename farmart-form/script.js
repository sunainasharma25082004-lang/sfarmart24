/**
 * SFARMART24 - GOOGLE FORMS STYLE APPLICATION SCRIPT
 * Simple, Sober, Clean, Highly User-Friendly Flow
 */

// ==========================================================================
// 1. CONFIGURATION
// ==========================================================================
const RAZORPAY_KEY_ID = "rzp_live_Td3vCBrNQSYyl8"; // Official Razorpay Live API Key
const REGISTRATION_AMOUNT = 199;
const MERCHANT_NAME = "Sfarmart24";
const MERCHANT_UPI = "SFARMART24@razorpay";
const BACKEND_API_URL = "https://sfarmart24-web-api.onrender.com/api/submissions";

// ==========================================================================
// 2. DOM ELEMENTS
// ==========================================================================
const formSectionView = document.getElementById('formSectionView');
const successSectionView = document.getElementById('successSectionView');
const form = document.getElementById('googleStyleForm');

// Inputs & Cards
const fullNameInput = document.getElementById('fullName');
const mobileNumberInput = document.getElementById('mobileNumber');
const emailInput = document.getElementById('email');
const addressInput = document.getElementById('address');
const utrInput = document.getElementById('utrInput');

const cardName = document.getElementById('cardName');
const cardMobile = document.getElementById('cardMobile');
const cardEmail = document.getElementById('cardEmail');
const cardAddress = document.getElementById('cardAddress');
const cardPayment = document.getElementById('cardPayment');

const nameError = document.getElementById('nameError');
const mobileError = document.getElementById('mobileError');
const emailError = document.getElementById('emailError');
const addressError = document.getElementById('addressError');

// Buttons
const btnRazorpayCheckout = document.getElementById('btnRazorpayCheckout');
const btnClearForm = document.getElementById('btnClearForm');
const btnSubmitAnother = document.getElementById('btnSubmitAnother');
const btnCopyUpi = document.getElementById('btnCopyUpi');

// Success Receipt Elements
const resRegId = document.getElementById('resRegId');
const resPaymentRef = document.getElementById('resPaymentRef');
const resDateTime = document.getElementById('resDateTime');
const resName = document.getElementById('resName');
const resMobile = document.getElementById('resMobile');
const resEmail = document.getElementById('resEmail');
const resAddress = document.getElementById('resAddress');
const resAmount = document.getElementById('resAmount');

// Toast
const gformToast = document.getElementById('gformToast');
const toastText = document.getElementById('toastText');

// ==========================================================================
// 3. INITIALIZATION & FOCUS TRACKING
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Google Forms active card focus highlight
  setupActiveCardHighlight();

  // Input sanitation
  mobileNumberInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    clearCardError(cardMobile, mobileError);
  });

  fullNameInput.addEventListener('input', () => clearCardError(cardName, nameError));
  emailInput.addEventListener('input', () => clearCardError(cardEmail, emailError));
  addressInput.addEventListener('input', () => clearCardError(cardAddress, addressError));

  // Copy UPI
  btnCopyUpi.addEventListener('click', handleCopyUpi);

  // Clear Form
  btnClearForm.addEventListener('click', handleClearForm);

  // Submit another response
  btnSubmitAnother.addEventListener('click', handleResetToForm);

  // Actions
  if (btnRazorpayCheckout) btnRazorpayCheckout.addEventListener('click', handleRazorpayPayment);
  const btnBottomRazorpay = document.getElementById('btnBottomRazorpay');
  if (btnBottomRazorpay) btnBottomRazorpay.addEventListener('click', handleRazorpayPayment);
  form.addEventListener('submit', handleFormSubmitWithUtr);

  // ── Screenshot preview & remove ───────────────────────────────────────
  const screenshotInput   = document.getElementById('paymentScreenshot');
  const previewWrap       = document.getElementById('screenshotPreviewWrap');
  const previewImg        = document.getElementById('screenshotPreviewImg');
  const btnRemove         = document.getElementById('btnRemoveScreenshot');
  const uploadBox         = document.getElementById('screenshotUploadBox');

  if (screenshotInput) {
    screenshotInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) { previewWrap.style.display = 'none'; return; }
      const reader = new FileReader();
      reader.onload = (ev) => {
        previewImg.src = ev.target.result;
        previewWrap.style.display = 'flex';
        // Mark upload box as done
        if (uploadBox) uploadBox.style.borderColor = '#15803d';
      };
      reader.readAsDataURL(file);
    });
  }

  if (btnRemove) {
    btnRemove.addEventListener('click', () => {
      if (screenshotInput) screenshotInput.value = '';
      if (previewImg)      previewImg.src = '';
      if (previewWrap)     previewWrap.style.display = 'none';
      if (uploadBox)       uploadBox.style.borderColor = '';
    });
  }
});

// Highlight active card on focus (Classic Google Forms style)
function setupActiveCardHighlight() {
  const cards = document.querySelectorAll('.question-card');
  const allInputs = document.querySelectorAll('.gform-input, .gform-textarea');

  allInputs.forEach(input => {
    input.addEventListener('focus', () => {
      cards.forEach(c => c.classList.remove('is-active'));
      const parentCard = input.closest('.question-card');
      if (parentCard) parentCard.classList.add('is-active');
    });
  });

  // Clicking anywhere in a card activates it
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('is-active'));
      card.classList.add('is-active');
    });
  });
}

// ==========================================================================
// 4. FORM VALIDATION
// ==========================================================================
function validateFormFields() {
  let isValid = true;
  let firstInvalidEl = null;

  // 1. Name
  const nameVal = fullNameInput.value.trim();
  if (!nameVal) {
    setCardError(cardName, nameError, 'This is a required question (कृपया अपना नाम लिखें)');
    if (!firstInvalidEl) firstInvalidEl = fullNameInput;
    isValid = false;
  } else if (nameVal.length < 2) {
    setCardError(cardName, nameError, 'नाम कम से कम 2 अक्षरों का होना चाहिए');
    if (!firstInvalidEl) firstInvalidEl = fullNameInput;
    isValid = false;
  } else {
    clearCardError(cardName, nameError);
  }

  // 2. Mobile
  const mobileVal = mobileNumberInput.value.trim();
  const mobileRegex = /^[6-9]\d{9}$/;
  if (!mobileVal) {
    setCardError(cardMobile, mobileError, 'This is a required question (कृपया 10-अंकों का मोबाइल नंबर लिखें)');
    if (!firstInvalidEl) firstInvalidEl = mobileNumberInput;
    isValid = false;
  } else if (!mobileRegex.test(mobileVal)) {
    setCardError(cardMobile, mobileError, 'कृपया सही 10-अंकों का भारतीय मोबाइल नंबर लिखें (6, 7, 8 या 9 से शुरू)');
    if (!firstInvalidEl) firstInvalidEl = mobileNumberInput;
    isValid = false;
  } else {
    clearCardError(cardMobile, mobileError);
  }

  // 3. Email
  const emailVal = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailVal) {
    setCardError(cardEmail, emailError, 'This is a required question (कृपया अपनी ईमेल आईडी लिखें)');
    if (!firstInvalidEl) firstInvalidEl = emailInput;
    isValid = false;
  } else if (!emailRegex.test(emailVal)) {
    setCardError(cardEmail, emailError, 'कृपया सही ईमेल फॉर्मेट लिखें (उदा. name@domain.com)');
    if (!firstInvalidEl) firstInvalidEl = emailInput;
    isValid = false;
  } else {
    clearCardError(cardEmail, emailError);
  }

  // 4. Address
  const addressVal = addressInput.value.trim();
  if (!addressVal) {
    setCardError(cardAddress, addressError, 'This is a required question (कृपया अपना पूरा पता लिखें)');
    if (!firstInvalidEl) firstInvalidEl = addressInput;
    isValid = false;
  } else if (addressVal.length < 5) {
    setCardError(cardAddress, addressError, 'कृपया पूरा पता विस्तार से लिखें');
    if (!firstInvalidEl) firstInvalidEl = addressInput;
    isValid = false;
  } else {
    clearCardError(cardAddress, addressError);
  }

  if (firstInvalidEl) {
    firstInvalidEl.focus();
    firstInvalidEl.closest('.question-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return isValid;
}

function setCardError(cardEl, errorEl, message) {
  cardEl.classList.add('has-error');
  errorEl.textContent = message;
}

function clearCardError(cardEl, errorEl) {
  cardEl.classList.remove('has-error');
  errorEl.textContent = '';
}

// ==========================================================================
// 5. PAYMENT HANDLERS
// ==========================================================================

// Method A: Click "Pay via Razorpay Online"
async function handleRazorpayPayment() {
  if (!validateFormFields()) {
    showToast('कृपया पहले पूछे गए विवरण सही से भरें');
    return;
  }

  const nameVal = fullNameInput.value.trim();
  const mobileVal = mobileNumberInput.value.trim();
  const emailVal = emailInput.value.trim();
  const addressVal = addressInput.value.trim();

  // If dummy key is active
  if (RAZORPAY_KEY_ID === "rzp_test_placeholder_key" || RAZORPAY_KEY_ID.includes("placeholder")) {
    const isConfirm = confirm(
      `[DEMO MODE]\n\nRazorpay Dummy Key ID सेट है।\n\nक्या आप ₹${REGISTRATION_AMOUNT} का टेस्ट पेमेंट पूरा करके रसीद देखना चाहते हैं?`
    );

    if (isConfirm) {
      const demoPayId = 'pay_demo_' + Math.random().toString(36).substring(2, 11).toUpperCase();
      await completeSubmission(demoPayId, 'Razorpay Online (Demo)');
    }
    return;
  }

  // Live/Test Real Key Execution
  if (typeof window.Razorpay === 'undefined') {
    alert('Razorpay Checkout SDK लोड नहीं हो पाया। कृपया पेज रीफ्रेश करें।');
    return;
  }

  const options = {
    key: RAZORPAY_KEY_ID,
    amount: REGISTRATION_AMOUNT * 100, // paise
    currency: "INR",
    name: MERCHANT_NAME,
    description: "Partner Registration Onboarding Fee",
    image: "assets/logo.png",
    prefill: {
      name: nameVal,
      email: emailVal,
      contact: mobileVal
    },
    notes: {
      address: addressVal,
      purpose: "Partner Registration"
    },
    theme: {
      color: "#15803d"
    },
    handler: async function(response) {
      if (response && response.razorpay_payment_id) {
        await completeSubmission(response.razorpay_payment_id, 'Razorpay Online');
      }
    }
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}

// Helper: Compress screenshot image before sending to prevent huge payloads and lag
function compressImageFile(file, maxWidth = 1200, maxHeight = 1200, quality = 0.82) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onerror = () => resolve(null);
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => resolve(e.target.result); // fallback to raw data
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// Method B: Click Submit button at bottom
async function handleFormSubmitWithUtr(e) {
  e.preventDefault();

  // Validate only the 4 mandatory fields (Name, Mobile, Email, Address)
  if (!validateFormFields()) {
    showToast('कृपया पहले पूछे गए 4 विवरण सही से भरें');
    return;
  }

  const utrEl = document.getElementById('utrInput');
  const utrVal = utrEl ? utrEl.value.trim() : '';

  const screenshotEl = document.getElementById('paymentScreenshot');
  const hasScreenshot = Boolean(screenshotEl && screenshotEl.files && screenshotEl.files[0]);

  // Visual feedback on submit button
  const submitBtn = document.getElementById('btnSubmitForm');
  const originalBtnText = submitBtn ? submitBtn.textContent : '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'सबमिट हो रहा है... / Submitting...';
  }

  try {
    // If user entered UTR, record as PAID
    if (utrVal && utrVal.length >= 6) {
      await completeSubmission(utrVal, 'UPI QR Scan (UTR Verified)', 'PAID');
      return;
    }

    // If user uploaded screenshot (even without UTR)
    if (hasScreenshot) {
      await completeSubmission(utrVal || 'SCREENSHOT_UPLOADED', 'UPI QR Scan (Screenshot Attached)', 'PAID');
      return;
    }

    // If UTR is blank and no screenshot, allow submission as PENDING (payment not mandatory)
    await completeSubmission('PENDING', 'Pending (To be paid)', 'PENDING');
  } catch (err) {
    console.error('Submission error:', err);
    showToast('सबमिशन में त्रुटि आई। कृपया पुनः प्रयास करें।');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  }
}

// ==========================================================================
// 6. COMPLETE SUBMISSION & SEND TO BACKEND
// ==========================================================================
async function completeSubmission(paymentReference, method, status = 'PAID') {
  const regId = 'SFM-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) + ', ' + now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const isPaid = status === 'PAID';

  const record = {
    id: regId,
    registrationId: regId,
    fullName: fullNameInput.value.trim(),
    mobileNumber: mobileNumberInput.value.trim(),
    email: emailInput.value.trim(),
    address: addressInput.value.trim(),
    paymentRef: paymentReference,
    paymentMethod: method,
    amount: isPaid ? REGISTRATION_AMOUNT : 199,
    status: isPaid ? 'PAID' : 'PENDING',
    createdAt: now.toISOString()
  };

  // ── Read screenshot as compressed base64 if selected ───────────────────
  const screenshotInput = document.getElementById('paymentScreenshot');
  const screenshotFile  = screenshotInput && screenshotInput.files && screenshotInput.files[0];
  if (screenshotFile) {
    try {
      const b64 = await compressImageFile(screenshotFile);
      if (b64) {
        record.screenshotBase64   = b64;
        record.screenshotFilename = screenshotFile.name;
      }
    } catch (err) {
      console.warn('Screenshot read error:', err);
    }
  }

  // 1. LocalStorage backup (without large base64 to save space)
  try {
    const localRecord = { ...record };
    delete localRecord.screenshotBase64; // don't bloat localStorage
    const existing = JSON.parse(localStorage.getItem('sfarm_form_submissions') || '[]');
    existing.unshift(localRecord);
    localStorage.setItem('sfarm_form_submissions', JSON.stringify(existing));
  } catch (e) {
    console.warn(e);
  }

  // 2. Dispatch to Backend API Server (Port 5000)
  try {
    const res = await fetch(BACKEND_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    const data = await res.json();
    console.log('✅ Form submission synced with server:', data);
  } catch (err) {
    console.warn('Backend API server offline, saved locally:', err.message);
  }

  // 3. Render Success View
  resRegId.textContent = regId;
  if (isPaid) {
    resPaymentRef.textContent = (paymentReference === 'SCREENSHOT_UPLOADED')
      ? 'Payment Screenshot Attached (Paid ✓)'
      : paymentReference;
    resPaymentRef.style.color = '#15803d';
    resAmount.textContent = `₹${REGISTRATION_AMOUNT}.00 (PAID ✓)`;
  } else {
    resPaymentRef.textContent = 'PENDING (बाद में भुगतान करें)';
    resPaymentRef.style.color = '#d97706';
    resAmount.textContent = `₹${REGISTRATION_AMOUNT}.00 (देय / Pending)`;
  }
  resDateTime.textContent = dateFormatted;
  resName.textContent = record.fullName;
  resMobile.textContent = '+91 ' + record.mobileNumber;
  resEmail.textContent = record.email;
  resAddress.textContent = record.address;

  // Toggle view (Google Forms style)
  formSectionView.style.display = 'none';
  successSectionView.style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });

  showToast('Response recorded successfully!');
}

function handleResetToForm() {
  handleClearForm();
  successSectionView.style.display = 'none';
  formSectionView.style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleClearForm() {
  form.reset();
  const previewImg  = document.getElementById('screenshotPreviewImg');
  const previewWrap = document.getElementById('screenshotPreviewWrap');
  const uploadBox   = document.getElementById('screenshotUploadBox');
  const screenshotInput = document.getElementById('paymentScreenshot');
  if (screenshotInput) screenshotInput.value = '';
  if (previewImg)  previewImg.src = '';
  if (previewWrap) previewWrap.style.display = 'none';
  if (uploadBox)   uploadBox.style.borderColor = '';

  document.querySelectorAll('.question-card').forEach(c => {
    c.classList.remove('has-error');
    c.classList.remove('is-active');
  });
  document.querySelectorAll('.gform-error').forEach(e => e.textContent = '');
  showToast('Form cleared');
}

function handleCopyUpi() {
  navigator.clipboard.writeText(MERCHANT_UPI).then(() => {
    btnCopyUpi.textContent = 'Copied!';
    showToast(`UPI ID (${MERCHANT_UPI}) copied!`);
    setTimeout(() => {
      btnCopyUpi.textContent = 'Copy';
    }, 2000);
  }).catch(() => {
    showToast(`UPI ID: ${MERCHANT_UPI}`);
  });
}

// ==========================================================================
// TOAST
// ==========================================================================
let toastTimer = null;
function showToast(msg) {
  if (toastTimer) clearTimeout(toastTimer);
  toastText.textContent = msg;
  gformToast.style.display = 'block';
  toastTimer = setTimeout(() => {
    gformToast.style.display = 'none';
  }, 2800);
}
