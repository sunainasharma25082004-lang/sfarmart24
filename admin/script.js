/**
 * SFARMART24 - ADMIN DASHBOARD JAVASCRIPT
 * Manages live data fetching, KPIs, search/filters, CSV exports, WhatsApp links,
 * customer detail modal, and persistent record deletion.
 */

const API_BASE_URL = 'http://localhost:5000/api';
let allSubmissions = [];
let autoRefreshTimer = null;

// ==========================================================================
// DOM ELEMENTS
// ==========================================================================
const serverStatusBadge = document.getElementById('serverStatusBadge');
const serverStatusText = document.getElementById('serverStatusText');
const liveClock = document.getElementById('liveClock');
const btnRefreshData = document.getElementById('btnRefreshData');

const kpiTotalCount = document.getElementById('kpiTotalCount');
const kpiTotalRevenue = document.getElementById('kpiTotalRevenue');
const kpiTodayCount = document.getElementById('kpiTodayCount');

const searchInput = document.getElementById('searchInput');
const btnClearSearch = document.getElementById('btnClearSearch');
const filterMethod = document.getElementById('filterMethod');
const sortOrder = document.getElementById('sortOrder');
const resultsCountText = document.getElementById('resultsCountText');
const chkAutoRefresh = document.getElementById('chkAutoRefresh');

const tableBody = document.getElementById('tableBody');
const emptyState = document.getElementById('emptyState');
const btnExportCsv = document.getElementById('btnExportCsv');

// Detail Modal Elements
const detailModal = document.getElementById('detailModal');
const btnCloseDetailModal = document.getElementById('btnCloseDetailModal');
const modalCustomerName = document.getElementById('modalCustomerName');
const mRegId = document.getElementById('mRegId');
const mDateTime = document.getElementById('mDateTime');
const mFullName = document.getElementById('mFullName');
const mMobile = document.getElementById('mMobile');
const mEmail = document.getElementById('mEmail');
const mAddress = document.getElementById('mAddress');
const mPaymentMethod = document.getElementById('mPaymentMethod');
const mPaymentRef = document.getElementById('mPaymentRef');
const mAmount = document.getElementById('mAmount');
const modalWhatsAppBtn = document.getElementById('modalWhatsAppBtn');
const btnPrintModal = document.getElementById('btnPrintModal');

// Manual Entry Modal Elements
const addEntryModal = document.getElementById('addEntryModal');
const btnOpenAddModal = document.getElementById('btnOpenAddModal');
const btnCloseAddModal = document.getElementById('btnCloseAddModal');
const btnCancelAdd = document.getElementById('btnCancelAdd');
const manualEntryForm = document.getElementById('manualEntryForm');

// Toast
const adminToast = document.getElementById('adminToast');
const adminToastMsg = document.getElementById('adminToastMsg');

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  startLiveClock();
  fetchSubmissions();

  // Search & Filter Listeners
  searchInput.addEventListener('input', handleSearchInput);
  btnClearSearch.addEventListener('click', handleClearSearch);
  filterMethod.addEventListener('change', renderFilteredTable);
  sortOrder.addEventListener('change', renderFilteredTable);

  // Buttons
  btnRefreshData.addEventListener('click', () => {
    fetchSubmissions(true);
    showToast('Data refreshed successfully!');
  });
  btnExportCsv.addEventListener('click', exportToCsv);

  // Auto Refresh
  chkAutoRefresh.addEventListener('change', (e) => {
    if (e.target.checked) {
      startAutoRefresh();
      showToast('Auto-refresh (10s) activated');
    } else {
      stopAutoRefresh();
      showToast('Auto-refresh paused');
    }
  });
  startAutoRefresh();

  // Detail Modal
  btnCloseDetailModal.addEventListener('click', () => detailModal.style.display = 'none');
  btnPrintModal.addEventListener('click', () => window.print());

  // Manual Add Modal
  btnOpenAddModal.addEventListener('click', () => addEntryModal.style.display = 'flex');
  btnCloseAddModal.addEventListener('click', () => addEntryModal.style.display = 'none');
  btnCancelAdd.addEventListener('click', () => addEntryModal.style.display = 'none');
  manualEntryForm.addEventListener('submit', handleManualEntrySubmit);

  // Screenshot preview in manual entry modal
  const addScreenshotInput   = document.getElementById('addScreenshot');
  const addScreenshotPreview = document.getElementById('addScreenshotPreview');
  const addScreenshotImg     = document.getElementById('addScreenshotImg');
  if (addScreenshotInput) {
    addScreenshotInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) { addScreenshotPreview.style.display = 'none'; return; }
      const reader = new FileReader();
      reader.onload = (ev) => {
        addScreenshotImg.src = ev.target.result;
        addScreenshotPreview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    });
  }
});

// ==========================================================================
// DATA FETCHING & LOCAL FALLBACK
// ==========================================================================
async function fetchSubmissions(isManualRefresh = false) {
  let fetchedData = [];
  let isApiOnline = false;

  try {
    const res = await fetch(`${API_BASE_URL}/submissions`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        fetchedData = json.data;
        isApiOnline = true;
      }
    }
  } catch (err) {
    // API might be offline, fallback to local storage
    isApiOnline = false;
  }

  // Also read from localStorage (in case user submitted directly on browser)
  let localData = [];
  try {
    localData = JSON.parse(localStorage.getItem('sfarm_form_submissions') || '[]');
  } catch (e) {
    localData = [];
  }

  // Combine & Deduplicate by ID
  const map = new Map();
  fetchedData.forEach(item => {
    const key = item.id || item.registrationId;
    if (key) map.set(key, normalizeItem(item));
  });

  localData.forEach(item => {
    const key = item.id || item.registrationId;
    if (key && !map.has(key)) {
      map.set(key, normalizeItem(item));
    }
  });

  allSubmissions = Array.from(map.values());

  // Update Status Badge
  if (isApiOnline) {
    serverStatusBadge.classList.remove('offline');
    serverStatusText.textContent = 'Backend API Connected (Port 5000)';
  } else {
    serverStatusBadge.classList.add('offline');
    serverStatusText.textContent = 'Local Mode (Port 5000 Offline)';
  }

  updateKpis();
  renderFilteredTable();
}

function normalizeItem(raw) {
  return {
    id:            raw.id || raw.registrationId || `SFM-2026-${Math.floor(100000 + Math.random() * 900000)}`,
    fullName:      raw.fullName || 'Unnamed Customer',
    mobileNumber:  (raw.mobileNumber || '').replace(/\D/g, '').slice(-10),
    email:         raw.email || 'N/A',
    address:       raw.address || 'N/A',
    paymentRef:    raw.paymentRef || raw.utrNumber || 'N/A',
    paymentMethod: raw.paymentMethod || 'Razorpay Online',
    amount:        Number(raw.amount) || 199,
    status:        raw.status || 'PAID',
    createdAt:     raw.createdAt || raw.timestamp || new Date().toISOString(),
    screenshot:    raw.screenshot || null
  };
}

// ==========================================================================
// KPIS & STATISTICS
// ==========================================================================
function updateKpis() {
  const totalCount = allSubmissions.length;
  const totalRev = allSubmissions.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayCount = allSubmissions.filter(item => (item.createdAt || '').slice(0, 10) === todayStr).length;

  kpiTotalCount.textContent = totalCount.toLocaleString('en-IN');
  kpiTotalRevenue.textContent = `₹${totalRev.toLocaleString('en-IN')}`;
  kpiTodayCount.textContent = todayCount.toLocaleString('en-IN');
}

// ==========================================================================
// SEARCH & TABLE RENDERING
// ==========================================================================
function handleSearchInput() {
  const query = searchInput.value.trim();
  btnClearSearch.style.display = query ? 'block' : 'none';
  renderFilteredTable();
}

function handleClearSearch() {
  searchInput.value = '';
  btnClearSearch.style.display = 'none';
  renderFilteredTable();
}

function renderFilteredTable() {
  const query = searchInput.value.trim().toLowerCase();
  const methodFilter = filterMethod.value;
  const sort = sortOrder.value;

  let filtered = allSubmissions.filter(item => {
    // Search query matches Name, Phone, Email, Address, or Payment Ref
    const matchesQuery = !query || 
      item.fullName.toLowerCase().includes(query) ||
      item.mobileNumber.includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.address.toLowerCase().includes(query) ||
      item.paymentRef.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query);

    // Filter method
    let matchesMethod = true;
    if (methodFilter === 'Razorpay') {
      matchesMethod = item.paymentMethod.toLowerCase().includes('razorpay');
    } else if (methodFilter === 'UPI') {
      matchesMethod = item.paymentMethod.toLowerCase().includes('upi') || item.paymentMethod.toLowerCase().includes('qr');
    }

    return matchesQuery && matchesMethod;
  });

  // Sorting
  if (sort === 'NEWEST') {
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sort === 'OLDEST') {
    filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (sort === 'NAME') {
    filtered.sort((a, b) => a.fullName.localeCompare(b.fullName));
  }

  resultsCountText.textContent = `Showing ${filtered.length} of ${allSubmissions.length} submissions`;

  if (filtered.length === 0) {
    tableBody.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';
  
  tableBody.innerHTML = filtered.map(item => {
    const formattedDate = formatTableDate(item.createdAt);
    const cleanMobile = item.mobileNumber.slice(-10);
    const waText = encodeURIComponent(
      `नमस्ते ${item.fullName},\n\nSfarmart24 में आपका स्वागत है! आपका पार्टनर रजिस्ट्रेशन फॉर्म और ₹${item.amount} का भुगतान सफलतापूर्वक प्राप्त हो गया है।\n\nRegistration ID: ${item.id}\nPayment Ref: ${item.paymentRef}`
    );
    const waLink = `https://wa.me/91${cleanMobile}?text=${waText}`;
    const isRzp = item.paymentMethod.toLowerCase().includes('razorpay');

    return `
      <tr data-id="${item.id}">
        <!-- ID & Date -->
        <td>
          <div class="id-cell">
            <span class="reg-id-badge">${escapeHtml(item.id)}</span>
            <span class="reg-time-sub">${formattedDate}</span>
          </div>
        </td>

        <!-- Full Name -->
        <td>
          <span class="name-cell">${escapeHtml(item.fullName)}</span>
        </td>

        <!-- Contact Info (Phone + WA) -->
        <td>
          <div class="contact-cell">
            <div class="contact-row-phone">
              <span class="font-mono"><strong>+91 ${escapeHtml(cleanMobile)}</strong></span>
              <a href="${waLink}" target="_blank" class="btn-whatsapp-sm" title="Chat on WhatsApp">
                💬 WA
              </a>
              <a href="tel:+91${cleanMobile}" class="btn-call-sm" title="Call Customer">
                📞
              </a>
            </div>
          </div>
        </td>

        <!-- Email -->
        <td>
          <a href="mailto:${escapeHtml(item.email)}" class="contact-email-link" title="Send Email">
            ${escapeHtml(item.email)}
          </a>
        </td>

        <!-- Address -->
        <td>
          <div class="address-cell" title="${escapeHtml(item.address)}">
            ${escapeHtml(truncate(item.address, 55))}
          </div>
        </td>

        <!-- Payment Ref / Mode -->
        <td>
          <div class="payment-cell">
            <span class="payment-method-pill ${isRzp ? 'pill-razorpay' : 'pill-upi'}">
              ${isRzp ? 'Razorpay' : 'UPI QR'}
            </span>
            <span class="payment-ref-code" title="Payment Reference / UTR">
              ${escapeHtml(item.paymentRef)}
            </span>
          </div>
        </td>

        <!-- Amount -->
        <td>
          <span class="amount-cell">₹${item.amount}</span>
        </td>

        <!-- Status -->
        <td>
          <span class="${item.status === 'PAID' ? 'badge-status-paid' : 'badge-status-pending'}">
            ${item.status === 'PAID' ? '✓ PAID' : '⏳ PENDING'}
          </span>
        </td>

        <!-- Actions -->
        <td>
          <div class="actions-cell">
            <button type="button" class="btn-action-icon" title="View Full Details / Receipt" onclick="viewDetails('${item.id}')">
              👁️
            </button>
            <button type="button" class="btn-action-icon btn-delete" title="Delete Submission" onclick="deleteSubmission('${item.id}')">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// ==========================================================================
// DETAILS MODAL & WHATSAPP LINK
// ==========================================================================
window.viewDetails = function(id) {
  const item = allSubmissions.find(s => s.id === id);
  if (!item) return;

  modalCustomerName.textContent = item.fullName;
  mRegId.textContent = item.id;
  mDateTime.textContent = formatTableDate(item.createdAt);
  mFullName.textContent = item.fullName;
  mMobile.textContent = '+91 ' + item.mobileNumber;
  mEmail.textContent = item.email;
  mAddress.textContent = item.address;
  mPaymentMethod.textContent = item.paymentMethod;
  mPaymentRef.textContent = item.paymentRef;
  mAmount.textContent = `₹${item.amount}.00`;

  // Screenshot display
  const ssRow = document.getElementById('mScreenshotRow');
  const ssImg = document.getElementById('mScreenshotImg');
  if (item.screenshot && ssRow && ssImg) {
    ssImg.src = `http://localhost:5000${item.screenshot}`;
    ssRow.style.display = 'block';
  } else if (ssRow) {
    ssRow.style.display = 'none';
  }

  const cleanMobile = item.mobileNumber.slice(-10);
  const waText = encodeURIComponent(
    `नमस्ते ${item.fullName},\nSfarmart24 ऑनबोर्डिंग पोर्टल पर आपका स्वागत है!\n\nReg ID: ${item.id}\nPayment Ref: ${item.paymentRef}\nAmount: ₹${item.amount}`
  );
  modalWhatsAppBtn.href = `https://wa.me/91${cleanMobile}?text=${waText}`;

  detailModal.style.display = 'flex';
};

// ==========================================================================
// DELETE SUBMISSION
// ==========================================================================
window.deleteSubmission = async function(id) {
  if (!confirm(`Kya aap submission record (${id}) ko delete karna chahte hain?`)) {
    return;
  }

  // 1. Delete on Backend Server API
  try {
    await fetch(`${API_BASE_URL}/submissions/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.warn('API delete failed:', err);
  }

  // 2. Delete in localStorage
  try {
    let localData = JSON.parse(localStorage.getItem('sfarm_form_submissions') || '[]');
    localData = localData.filter(item => (item.id || item.registrationId) !== id);
    localStorage.setItem('sfarm_form_submissions', JSON.stringify(localData));
  } catch (e) {
    console.warn(e);
  }

  // 3. Update local array
  allSubmissions = allSubmissions.filter(item => item.id !== id);
  updateKpis();
  renderFilteredTable();
  showToast(`Record ${id} deleted successfully.`);
};

// ==========================================================================
// MANUAL ENTRY SUBMISSION
// ==========================================================================
async function handleManualEntrySubmit(e) {
  e.preventDefault();

  const newEntry = {
    id:            `SFM-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
    fullName:      document.getElementById('addName').value.trim(),
    mobileNumber:  document.getElementById('addMobile').value.trim(),
    email:         document.getElementById('addEmail').value.trim(),
    address:       document.getElementById('addAddress').value.trim(),
    paymentRef:    document.getElementById('addPaymentRef').value.trim(),
    paymentMethod: document.getElementById('addMethod').value,
    amount:        Number(document.getElementById('addAmount').value) || 199,
    status:        'PAID',
    createdAt:     new Date().toISOString()
  };

  // Read screenshot as base64 if provided
  const screenshotInput = document.getElementById('addScreenshot');
  const screenshotFile  = screenshotInput && screenshotInput.files[0];
  if (screenshotFile) {
    try {
      const b64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = ev => resolve(ev.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(screenshotFile);
      });
      newEntry.screenshotBase64    = b64;
      newEntry.screenshotFilename  = screenshotFile.name;
    } catch (err) {
      console.warn('Screenshot read error:', err);
    }
  }

  // POST to MongoDB API
  let savedEntry = newEntry;
  try {
    const res = await fetch(`${API_BASE_URL}/submissions`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(newEntry)
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) savedEntry = json.data;
    }
  } catch (err) {
    console.warn('API offline, saving to localStorage only');
  }

  // Also save to localStorage as fallback
  try {
    const existing = JSON.parse(localStorage.getItem('sfarm_form_submissions') || '[]');
    existing.unshift(savedEntry);
    localStorage.setItem('sfarm_form_submissions', JSON.stringify(existing));
  } catch (e) { console.warn(e); }

  allSubmissions.unshift(normalizeItem(savedEntry));
  updateKpis();
  renderFilteredTable();

  manualEntryForm.reset();
  const previewDiv = document.getElementById('addScreenshotPreview');
  if (previewDiv) previewDiv.style.display = 'none';
  addEntryModal.style.display = 'none';
  showToast('नया Partner Submission MongoDB में save ho gaya!');
}

// ==========================================================================
// EXPORT TO CSV / EXCEL
// ==========================================================================
function exportToCsv() {
  if (allSubmissions.length === 0) {
    alert('Export karne ke liye koi submission record nahi mila.');
    return;
  }

  const headers = [
    'Registration ID',
    'Submission Date & Time',
    'Full Name',
    'Mobile Number',
    'Email Address',
    'Address',
    'Payment Method',
    'Payment Ref / UTR',
    'Amount (INR)',
    'Status'
  ];

  const rows = allSubmissions.map(item => [
    `"${item.id}"`,
    `"${formatTableDate(item.createdAt)}"`,
    `"${(item.fullName || '').replace(/"/g, '""')}"`,
    `"+91 ${item.mobileNumber}"`,
    `"${item.email}"`,
    `"${(item.address || '').replace(/"/g, '""')}"`,
    `"${item.paymentMethod}"`,
    `"${item.paymentRef}"`,
    `"${item.amount}"`,
    `"${item.status}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' 
    + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  const nowStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('download', `Sfarmart24_Submissions_${nowStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('Excel/CSV Spreadsheet downloaded!');
}

// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================
function formatTableDate(isoStr) {
  if (!isoStr) return '-';
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) + ' ' + d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    return isoStr;
  }
}

function truncate(str, max) {
  if (!str) return '';
  return str.length > max ? str.substring(0, max) + '...' : str;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function startLiveClock() {
  function update() {
    const now = new Date();
    liveClock.textContent = now.toLocaleTimeString('en-IN', { hour12: false });
  }
  update();
  setInterval(update, 1000);
}

function startAutoRefresh() {
  stopAutoRefresh();
  autoRefreshTimer = setInterval(() => {
    fetchSubmissions(false);
  }, 10000);
}

function stopAutoRefresh() {
  if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer);
    autoRefreshTimer = null;
  }
}

let toastTimeout = null;
function showToast(msg) {
  if (toastTimeout) clearTimeout(toastTimeout);
  adminToastMsg.textContent = msg;
  adminToast.style.display = 'flex';
  toastTimeout = setTimeout(() => {
    adminToast.style.display = 'none';
  }, 3000);
}
