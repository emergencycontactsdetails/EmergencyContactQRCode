import { FIELD_SECTIONS, VIEW_LABELS, CATEGORY_ICONS } from './fields.js';
import { encodeData, buildShareURL, toast, fileToBase64, esc, initTheme } from './utils.js';

const STORAGE_KEY = 'tagsafe-draft-v1';
let photoBase64 = null;

const SOCIAL_BASE = {
  ig: 'https://instagram.com/',
  fb: 'https://facebook.com/',
  li: 'https://linkedin.com/in/',
  tw: 'https://twitter.com/',
  yt: 'https://youtube.com/@',
  web: ''
};

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderOptionalSections();
  attachListeners();
  loadDraft();
  updateCounter();
  updatePreview();
});

// ===== RENDER OPTIONAL SECTIONS =====
function renderOptionalSections() {
  const root = document.getElementById('optionalSections');
  root.innerHTML = FIELD_SECTIONS.map(sec => `
    <div class="toggle-section" data-section="${sec.id}">
      <label class="toggle-header">
        <span class="toggle-title">
          ${esc(sec.title)}
          ${sec.sensitive ? '<span class="badge">sensitive</span>' : ''}
        </span>
        <span class="switch">
          <input type="checkbox" data-section-toggle="${sec.id}" />
          <span class="slider"></span>
        </span>
      </label>
      <div class="toggle-body">
        ${sec.fields.map(f => renderField(f, sec.sensitive)).join('')}
      </div>
    </div>
  `).join('');
}

function renderField(f, sensitive) {
  const hint = sensitive ? '<div class="info-hint">ⓘ Visible to anyone who scans your QR</div>' : '';
  let input = '';
  if (f.type === 'select') {
    input = `<select id="${f.id}" name="${f.id}">
      <option value="">-- Select --</option>
      ${f.options.map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join('')}
    </select>`;
  } else if (f.type === 'textarea') {
    input = `<textarea id="${f.id}" name="${f.id}" placeholder="${esc(f.placeholder||'')}"></textarea>`;
  } else if (f.type === 'file') {
    input = `<input type="file" id="${f.id}" name="${f.id}" accept="${f.accept||''}" />`;
  } else {
    input = `<input type="${f.type}" id="${f.id}" name="${f.id}" placeholder="${esc(f.placeholder||'')}" />`;
  }
  return `<div class="field">
    <label for="${f.id}">${f.icon ? f.icon + ' ' : ''}${esc(f.label)}</label>
    ${input}${hint}
  </div>`;
}

// ===== LISTENERS =====
function attachListeners() {
  const form = document.getElementById('tagForm');

  form.addEventListener('change', e => {
    if (e.target.dataset.sectionToggle) {
      const sec = e.target.closest('.toggle-section');
      sec.classList.toggle('active', e.target.checked);
      updateCounter();
      updatePreview();
      saveDraft();
    }
    if (e.target.type === 'file' && e.target.id === 'photo') {
      handlePhoto(e.target.files[0]);
    }
  });

  form.addEventListener('input', () => {
    updatePreview();
    saveDraft();
  });

  document.getElementById('generateBtn').addEventListener('click', generateQR);
  document.getElementById('resetBtn').addEventListener('click', resetForm);
  document.getElementById('downloadQrBtn').addEventListener('click', downloadQR);
  document.getElementById('copyLinkBtn').addEventListener('click', copyLink);
  document.getElementById('shareBtn').addEventListener('click', shareLink);
  document.getElementById('printBtn').addEventListener('click', () => window.print());
}

// ===== HANDLE PHOTO =====
async function handlePhoto(file) {
  if (!file) { photoBase64 = null; return; }
  if (file.size > 200 * 1024) {
    toast('Photo too large (max 200KB)', 'error');
    document.getElementById('photo').value = '';
    return;
  }
  photoBase64 = await fileToBase64(file);
  updatePreview();
}

// ===== BUILD DATA =====
function buildData() {
  const data = {
    n: document.getElementById('fullName').value.trim(),
    ec1: {
      name: document.getElementById('ec1Name').value.trim(),
      phone: document.getElementById('ec1Phone').value.trim()
    }
  };

  FIELD_SECTIONS.forEach(sec => {
    const toggle = document.querySelector(`[data-section-toggle="${sec.id}"]`);
    if (!toggle?.checked) return;

    if (sec.id === 'contact') {
      const n = document.getElementById('ec2Name').value.trim();
      const p = document.getElementById('ec2Phone').value.trim();
      if (n || p) data.ec2 = { name: n, phone: p };
    }

    sec.fields.forEach(f => {
      if (f.id === 'ec2Name' || f.id === 'ec2Phone') return;
      if (f.id === 'photo') {
        if (photoBase64) data.photo = photoBase64;
        return;
      }
      const el = document.getElementById(f.id);
      if (el && el.value.trim()) data[f.id] = el.value.trim();
    });
  });

  return data;
}

// ===== UPDATE COUNTER =====
function updateCounter() {
  const total = FIELD_SECTIONS.length;
  const on = document.querySelectorAll('[data-section-toggle]:checked').length;
  document.getElementById('enabledCounter').textContent = `${on} of ${total} sections enabled`;
}

// ===== UPDATE PREVIEW =====
function updatePreview() {
  const data = buildData();
  const card = document.getElementById('previewCard');
  if (!data.n) {
    card.innerHTML = '<p class="muted">Fill the form to see preview…</p>';
    return;
  }

  const buildPreviewUrl = (v, base) => {
    if (!v) return '';
    if (/^https?:\/\//i.test(v)) return v;
    if (base === '') return 'https://' + v.replace(/^\/+/, '');
    return base + v.replace(/^@+/, '').replace(/^\/+/, '');
  };

  const rows = [];
  rows.push(['Name', esc(data.n)]);
  rows.push(['Emergency 1', `${esc(data.ec1.name)} — ${esc(data.ec1.phone)}`]);
  if (data.ec2) rows.push(['Emergency 2', `${esc(data.ec2.name)} — ${esc(data.ec2.phone)}`]);

  Object.keys(data).forEach(k => {
    if (['n','ec1','ec2','photo'].includes(k)) return;
    const meta = VIEW_LABELS[k] || { label: k };
    let val = data[k];
    if (SOCIAL_BASE.hasOwnProperty(k)) {
      val = buildPreviewUrl(val, SOCIAL_BASE[k]);
    }
    rows.push([meta.label, esc(val)]);
  });

  card.innerHTML = rows.map(([k,v]) =>
    `<div class="preview-row"><div class="key">${k}</div><div class="val">${v}</div></div>`
  ).join('');
}

let qrInstance = null;

// ===== GENERATE QR (Beautiful styled QR) =====
function generateQR() {
  const name = document.getElementById('fullName').value.trim();
  const ec1Name = document.getElementById('ec1Name').value.trim();
  const ec1Phone = document.getElementById('ec1Phone').value.trim();
  if (!name || !ec1Name || !ec1Phone) {
    toast('Please fill required fields', 'error');
    return;
  }

  if (typeof QRCodeStyling === 'undefined') {
    toast('QR library failed to load. Check internet connection.', 'error');
    return;
  }

  const data = buildData();
  const url = buildShareURL(data);

  const canvasEl = document.getElementById('qrCanvas');
  canvasEl.innerHTML = '';

  // 🛡️ Vector shield logo (emoji-free, crisp at any size)
  const shieldSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="48" fill="white" stroke="#4f46e5" stroke-width="3"/>
      <path d="M50 22 L72 32 L72 52 C72 65 62 75 50 80 C38 75 28 65 28 52 L28 32 Z" fill="#4f46e5"/>
      <path d="M42 50 L48 56 L60 42" stroke="white" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  const logoDataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(shieldSVG);

  // 🎨 Beautiful styled QR with rounded dots + gradient + custom corners
  qrInstance = new QRCodeStyling({
    width: 320,
    height: 320,
    type: 'canvas',
    data: url,
    margin: 10,
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: 'H'   // High = allows logo + scan reliability
    },
    dotsOptions: {
      type: 'rounded',
      gradient: {
        type: 'linear',
        rotation: Math.PI / 4,
        colorStops: [
          { offset: 0, color: '#4f46e5' },   // indigo
          { offset: 1, color: '#06b6d4' }    // cyan
        ]
      }
    },
    backgroundOptions: {
      color: '#ffffff'
    },
    cornersSquareOptions: {
      type: 'extra-rounded',
      color: '#4338ca'
    },
    cornersDotOptions: {
      type: 'dot',
      color: '#06b6d4'
    },
    image: logoDataUrl,
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: 6,
      imageSize: 0.28,
      hideBackgroundDots: true
    }
  });

  qrInstance.append(canvasEl);

  document.getElementById('qrSection').classList.remove('hidden');
  document.getElementById('generatedLink').textContent = url;
  toast('✨ Beautiful QR generated!', 'success');
  document.getElementById('qrSection').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===== DOWNLOAD QR (Portrait, HD, with Rounded Border) =====
async function downloadQR() {
  if (!qrInstance) return toast('Generate QR first', 'error');

  try {
    const blob = await qrInstance.getRawData('png');
    const imgUrl = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      // 📐 Portrait dimensions
      const WIDTH = 1200;
      const HEIGHT = 1697;

      // 🖼️ Border settings
      const BORDER_PADDING = 60;       // gap from edge of image
      const BORDER_WIDTH = 8;          // border thickness
      const BORDER_RADIUS = 50;        // rounded corners
      const INNER_PADDING = 50;        // gap between border and QR

      const FRAME_X = BORDER_PADDING;
      const FRAME_Y = BORDER_PADDING;
      const FRAME_W = WIDTH - BORDER_PADDING * 2;
      const FRAME_H = HEIGHT - BORDER_PADDING * 2;

      const QR_SIZE = FRAME_W - INNER_PADDING * 2;
      const QR_X = FRAME_X + INNER_PADDING;
      const QR_Y = FRAME_Y + INNER_PADDING;

      const canvas = document.createElement('canvas');
      canvas.width = WIDTH;
      canvas.height = HEIGHT;
      const ctx = canvas.getContext('2d');

      // ⚪ Pure white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // 🎨 Subtle inner background tint (very light indigo)
      drawRoundedRect(ctx, FRAME_X, FRAME_Y, FRAME_W, FRAME_H, BORDER_RADIUS);
      ctx.fillStyle = '#f8fafc';
      ctx.fill();

      // 🖼️ Gradient border
      const gradient = ctx.createLinearGradient(FRAME_X, FRAME_Y, FRAME_X + FRAME_W, FRAME_Y + FRAME_H);
      gradient.addColorStop(0, '#4f46e5');
      gradient.addColorStop(1, '#06b6d4');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = BORDER_WIDTH;
      drawRoundedRect(ctx, FRAME_X, FRAME_Y, FRAME_W, FRAME_H, BORDER_RADIUS);
      ctx.stroke();

      // 🎯 Draw QR centered (high-quality)
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, QR_X, QR_Y, QR_SIZE, QR_SIZE);

      // 🏷️ Name + label at the bottom
      const name = document.getElementById('fullName').value.trim() || 'Emergency Contact QR Code';
      const labelY = QR_Y + QR_SIZE + 110;

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 56px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(name, WIDTH / 2, labelY);

      ctx.fillStyle = '#64748b';
      ctx.font = '34px system-ui, -apple-system, sans-serif';
      ctx.fillText('Scan to view profile', WIDTH / 2, labelY + 55);

      // 🛡️ Brand mark at top of frame
      ctx.fillStyle = '#4f46e5';
      ctx.font = 'bold 32px system-ui, -apple-system, sans-serif';
      ctx.fillText('🛡️ Emergency Contact QR Code', WIDTH / 2, FRAME_Y + 60);

      // 💾 Download
      const safeName = name.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
      const link = document.createElement('a');
      link.download = `qr-${safeName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      URL.revokeObjectURL(imgUrl);
      toast('QR downloaded ✅ (Portrait HD)', 'success');
    };

    img.onerror = () => {
      qrInstance.download({ name: 'qr-code', extension: 'png' });
      toast('QR downloaded', 'success');
    };

    img.src = imgUrl;
  } catch (err) {
    console.error(err);
    qrInstance.download({ name: 'qr-code', extension: 'png' });
    toast('QR downloaded', 'success');
  }
}

// ===== HELPER: Rounded Rectangle Path =====
function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
// ===== COPY LINK =====
async function copyLink() {
  const link = document.getElementById('generatedLink').textContent;
  if (!link) return toast('Generate QR first', 'error');
  await navigator.clipboard.writeText(link);
  toast('Link copied!', 'success');
}

// ===== SHARE =====
async function shareLink() {
  const link = document.getElementById('generatedLink').textContent;
  if (!link) return toast('Generate QR first', 'error');
  if (navigator.share) {
    try { await navigator.share({ title: 'My Emergency Contact QR Code Profile', url: link }); }
    catch {}
  } else {
    copyLink();
  }
}

// ===== DRAFT SAVE/LOAD =====
function saveDraft() {
  const state = { fields: {}, toggles: {}, photo: photoBase64 };
  document.querySelectorAll('#tagForm input, #tagForm select, #tagForm textarea').forEach(el => {
    if (el.dataset.sectionToggle) {
      state.toggles[el.dataset.sectionToggle] = el.checked;
    } else if (el.type !== 'file') {
      state.fields[el.id] = el.value;
    }
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const state = JSON.parse(raw);
    Object.entries(state.fields || {}).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    });
    Object.entries(state.toggles || {}).forEach(([id, checked]) => {
      const el = document.querySelector(`[data-section-toggle="${id}"]`);
      if (el && checked) { el.checked = true; el.closest('.toggle-section').classList.add('active'); }
    });
    if (state.photo) photoBase64 = state.photo;
    updateCounter();
    updatePreview();
  } catch {}
}

function resetForm() {
  if (!confirm('Reset all fields? This cannot be undone.')) return;
  localStorage.removeItem(STORAGE_KEY);
  document.getElementById('tagForm').reset();
  document.querySelectorAll('.toggle-section.active').forEach(s => s.classList.remove('active'));
  photoBase64 = null;
  document.getElementById('qrSection').classList.add('hidden');
  updateCounter();
  updatePreview();
  toast('Form reset', 'success');
}

// ===== Register Service Worker =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch(()=>{});
  });
}
document.querySelector('.app-header').addEventListener('click', () => {
  window.location.href = 'https://emergencycontactsdetails.github.io/EmergencyContactQRCode/';
});
