/**
 * SFARMART24 – Backend Server
 * MongoDB Atlas storage + Screenshot (base64) save support
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ─── Config ────────────────────────────────────────────────────────────────
const PORT         = process.env.PORT || 5000;
const MONGODB_URI  = process.env.MONGODB_URI ||
  'mongodb+srv://vizdigitalofficial_db_user:ApJvrAaFReGyhFnO@farmart.5rixopr.mongodb.net/?appName=farmart';
const DB_NAME      = 'sfarmart';
const COL_NAME     = 'submissions';
const UPLOADS_DIR  = path.join(__dirname, 'uploads');

// Razorpay Live Credentials
const RAZORPAY_KEY_ID     = process.env.RAZORPAY_KEY_ID || 'rzp_live_Td3vCBrNQSYyl8';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'qoGBuqiobnZhlCdPEX1cqVjN';

// Ensure uploads folder exists
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// ─── MongoDB ────────────────────────────────────────────────────────────────
const mongoClient = new MongoClient(MONGODB_URI);
let submissionsCol;

async function connectDb() {
  try {
    await mongoClient.connect();
    const db      = mongoClient.db(DB_NAME);
    submissionsCol = db.collection(COL_NAME);
    console.log('✅  MongoDB connected →', DB_NAME + '.' + COL_NAME);

    // Optional one-time migration from local JSON file
    const legacyFile = path.join(__dirname, 'data', 'submissions.json');
    if (fs.existsSync(legacyFile)) {
      const count = await submissionsCol.countDocuments();
      if (count === 0) {
        const legacy = JSON.parse(fs.readFileSync(legacyFile, 'utf8'));
        if (legacy.length) {
          await submissionsCol.insertMany(legacy);
          console.log(`📦  Migrated ${legacy.length} records from submissions.json to MongoDB`);
        }
      }
    }
  } catch (err) {
    console.error('❌  MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function sendJson(res, code, data) {
  setCorsHeaders(res);
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end',  ()    => {
      try { resolve(JSON.parse(body || '{}')); }
      catch (e) { reject(e); }
    });
  });
}

/**
 * Save base64 image to uploads/ folder.
 * @param {string} b64  – full data-URI string  e.g. "data:image/png;base64,ABC..."
 * @param {string} name – original filename hint
 * @returns {string|null} relative URL like "/uploads/1234_screenshot.png"
 */
function saveBase64Image(b64, name) {
  if (!b64 || typeof b64 !== 'string') return null;
  const commaIdx = b64.indexOf(',');
  if (commaIdx === -1) return null;

  const meta = b64.slice(0, commaIdx);
  const data = b64.slice(commaIdx + 1);

  let ext = 'png';
  const mimeMatch = meta.match(/data:image\/([a-zA-Z0-9+]+)/i);
  if (mimeMatch) {
    const rawExt = mimeMatch[1].toLowerCase();
    ext = rawExt === 'jpeg' ? 'jpg' : rawExt;
  }

  const originalBase = path.parse(name || 'screenshot').name;
  const cleanName = (originalBase || 'ss').replace(/[^a-z0-9._-]/gi, '_').slice(0, 40);
  const safe = `${Date.now()}_${cleanName}.${ext}`;

  try {
    const buffer = Buffer.from(data, 'base64');
    fs.writeFileSync(path.join(UPLOADS_DIR, safe), buffer);
    return `/uploads/${safe}`;
  } catch (err) {
    console.error('❌ Failed to save screenshot on disk:', err);
    return null;
  }
}

// ─── Static file server for /uploads/* ──────────────────────────────────────
function serveStaticUpload(req, res, pathname) {
  const filename = pathname.replace('/uploads/', '');
  const filePath = path.join(UPLOADS_DIR, filename);
  if (!fs.existsSync(filePath)) { sendJson(res, 404, { message: 'File not found' }); return; }
  const ext   = path.extname(filename).toLowerCase();
  const mime  = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
                  '.gif': 'image/gif', '.webp': 'image/webp' }[ext] || 'application/octet-stream';
  setCorsHeaders(res);
  res.writeHead(200, { 'Content-Type': mime });
  fs.createReadStream(filePath).pipe(res);
}

// ─── HTTP Server ─────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const url      = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // ── Serve uploaded screenshots ─────────────────────────────────────────
  if (req.method === 'GET' && pathname.startsWith('/uploads/')) {
    serveStaticUpload(req, res, pathname);
    return;
  }

  // ── 0. Root / Welcome Route ───────────────────────────────────────────
  if (req.method === 'GET' && (pathname === '/' || pathname === '/api')) {
    sendJson(res, 200, {
      success: true,
      status: 'online',
      message: 'Sfarmart24 Backend Server is running successfully!',
      endpoints: {
        health: '/api/health',
        submissions: '/api/submissions',
        stats: '/api/stats'
      }
    });
    return;
  }

  // ── 1. Health Check ────────────────────────────────────────────────────
  if (req.method === 'GET' && pathname === '/api/health') {
    sendJson(res, 200, { status: 'OK', message: 'Farmart backend operational', timestamp: new Date() });
    return;
  }

  // ── 2. GET /api/submissions ────────────────────────────────────────────
  if (req.method === 'GET' && pathname === '/api/submissions') {
    try {
      const docs = await submissionsCol.find({}, { projection: { _id: 0 } })
                                       .sort({ createdAt: -1 })
                                       .toArray();
      sendJson(res, 200, { success: true, count: docs.length, data: docs });
    } catch (err) {
      sendJson(res, 500, { success: false, message: 'DB read error', error: err.message });
    }
    return;
  }

  // ── 3. GET /api/stats ──────────────────────────────────────────────────
  if (req.method === 'GET' && pathname === '/api/stats') {
    try {
      const docs       = await submissionsCol.find({}, { projection: { amount: 1, createdAt: 1, _id: 0 } }).toArray();
      const todayStr   = new Date().toISOString().slice(0, 10);
      const totalCount   = docs.length;
      const totalRevenue = docs.reduce((s, d) => s + (Number(d.amount) || 0), 0);
      const todayCount   = docs.filter(d => (d.createdAt || '').slice(0, 10) === todayStr).length;
      sendJson(res, 200, { success: true, stats: { totalCount, totalRevenue, todayCount } });
    } catch (err) {
      sendJson(res, 500, { success: false, message: 'Stats error', error: err.message });
    }
    return;
  }

  // ── 4. POST /api/submissions ───────────────────────────────────────────
  if (req.method === 'POST' && pathname === '/api/submissions') {
    try {
      const payload = await readBody(req);
      const { fullName, mobileNumber, email, address,
              paymentRef, paymentMethod, amount, registrationId,
              screenshotBase64, screenshotFilename } = payload;

      if (!fullName || !mobileNumber || !email || !address) {
        return sendJson(res, 400, { success: false, message: 'fullName, mobileNumber, email, address are required.' });
      }

      const hasScreenshot = Boolean(screenshotBase64 && screenshotFilename);
      const isPaid = payload.status === 'PAID' || hasScreenshot ||
        (paymentRef && !['PENDING', 'PENDING_PAYMENT'].includes(paymentRef));

      const newEntry = {
        id:            registrationId || `SFM-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
        fullName:      fullName.trim(),
        mobileNumber:  String(mobileNumber).trim().replace(/\D/g, '').slice(-10),
        email:         email.trim(),
        address:       address.trim(),
        paymentRef:    paymentRef    || (hasScreenshot ? 'SCREENSHOT_UPLOADED' : 'PENDING'),
        paymentMethod: paymentMethod || (hasScreenshot ? 'UPI QR Scan (Screenshot)' : (isPaid ? 'Razorpay Online' : 'Pay on Onboarding')),
        amount:        Number(amount) || 199,
        status:        isPaid ? 'PAID' : 'PENDING',
        createdAt:     new Date().toISOString(),
      };

      // Handle screenshot upload
      if (screenshotBase64 && screenshotFilename) {
        const imgUrl = saveBase64Image(screenshotBase64, screenshotFilename);
        if (imgUrl) newEntry.screenshot = imgUrl;
      }

      await submissionsCol.insertOne(newEntry);
      console.log('✅  Submission saved:', newEntry.id);
      sendJson(res, 201, { success: true, message: 'Submission saved!', data: newEntry });
    } catch (err) {
      sendJson(res, 400, { success: false, message: 'Invalid request', error: err.message });
    }
    return;
  }

  // ── 5. DELETE /api/submissions/:id ────────────────────────────────────
  if (req.method === 'DELETE' && pathname.startsWith('/api/submissions/')) {
    const id = pathname.replace('/api/submissions/', '');
    try {
      // Find first so we can delete the screenshot file if any
      const doc = await submissionsCol.findOne({ id }, { projection: { screenshot: 1, _id: 0 } });
      const result = await submissionsCol.deleteOne({ id });
      if (result.deletedCount === 0) {
        return sendJson(res, 404, { success: false, message: 'Submission not found' });
      }
      // Delete screenshot file from disk if exists
      if (doc && doc.screenshot) {
        const localPath = path.join(__dirname, doc.screenshot);
        if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
      }
      sendJson(res, 200, { success: true, message: `Submission ${id} deleted.` });
    } catch (err) {
      sendJson(res, 500, { success: false, message: 'Delete error', error: err.message });
    }
    return;
  }

  // ── 6. Legacy POST /api/apply ─────────────────────────────────────────
  if (req.method === 'POST' && pathname === '/api/apply') {
    try {
      const payload = await readBody(req);
      sendJson(res, 201, { success: true, message: 'Application received!', applicationId: `FMT-APP-${Date.now()}` });
    } catch (e) { sendJson(res, 400, { success: false, message: e.message }); }
    return;
  }

  // ── 7. Legacy POST /api/contact ───────────────────────────────────────
  if (req.method === 'POST' && pathname === '/api/contact') {
    try {
      const payload = await readBody(req);
      sendJson(res, 201, { success: true, message: 'Inquiry received!', inquiryId: `FMT-MSG-${Date.now()}` });
    } catch (e) { sendJson(res, 400, { success: false, message: e.message }); }
    return;
  }

  // ── 404 fallback ──────────────────────────────────────────────────────
  sendJson(res, 404, { success: false, message: 'API route not found' });
});

// ─── Start ───────────────────────────────────────────────────────────────────
connectDb().then(() => {
  server.listen(PORT, () => {
    console.log(`🌾  Farmart Backend running → http://localhost:${PORT}`);
  });
});
