import { decodeData, initTheme, esc } from './utils.js';
import { VIEW_LABELS, CATEGORY_ICONS } from './fields.js';

// ===== SMART SOCIAL URL BUILDERS =====
const SOCIAL_BUILDERS = {
  ig: (v) => buildSocial(v, 'https://instagram.com/'),
  fb: (v) => buildSocial(v, 'https://facebook.com/'),
  li: (v) => buildSocial(v, 'https://linkedin.com/in/'),
  tw: (v) => buildSocial(v, 'https://twitter.com/'),
  yt: (v) => buildYouTube(v),
  web: (v) => buildWebsite(v),
};

function buildSocial(value, base) {
  if (!value) return null;
  const v = value.trim();
  if (/^https?:\/\//i.test(v)) return v;
  if (/^www\./i.test(v)) return 'https://' + v;
  const clean = v.replace(/^@+/, '').replace(/^\/+/, '');
  return base + clean;
}

function buildYouTube(value) {
  if (!value) return null;
  const v = value.trim();
  if (/^https?:\/\//i.test(v)) return v;
  if (/^www\./i.test(v)) return 'https://' + v;
  const clean = v.replace(/^@+/, '').replace(/^\/+/, '');
  return `https://youtube.com/@${clean}`;
}

function buildWebsite(value) {
  if (!value) return null;
  const v = value.trim();
  if (/^https?:\/\//i.test(v)) return v;
  return 'https://' + v.replace(/^\/+/, '');
}

// ===== HELPERS =====
function showError(msg) {
  const card = document.getElementById('profileCard');
  card.innerHTML = `
    <div class="error-state">
      <div class="emoji">😕</div>
      <h2>Oops!</h2>
      <p class="muted">${esc(msg)}</p>
    </div>`;
}

function block(title, rows) {
  return `<div class="contact-block">
    <h3>${title}</h3>
    ${rows.map(([k,v]) => row(k,v)).join('')}
  </div>`;
}

function row(k, v) {
  return `<div class="preview-row"><div class="key">${esc(k)}</div><div class="val">${esc(v)}</div></div>`;
}

function actionBtn(ico, label, href, sub) {
  return `<a class="action-btn" href="${esc(href)}">
    <span class="ico">${ico}</span>
    <span><div><strong>${esc(label)}</strong></div><small class="muted">${esc(sub)}</small></span>
  </a>`;
}

function cleanPhone(p) {
  return (p || '').replace(/[^\d+]/g, '');
}

function displayHandle(v) {
  if (!v) return '';
  const s = v.trim();
  if (/^https?:\/\//i.test(s)) {
    try {
      const u = new URL(s);
      return u.hostname.replace(/^www\./, '') + u.pathname;
    } catch { return s; }
  }
  return s.startsWith('@') ? s : '@' + s.replace(/^\/+/, '');
}

// ===== RENDER PROFILE =====
function renderProfile(d) {
  const card = document.getElementById('profileCard');
  const catIcon = d.cat ? (CATEGORY_ICONS[d.cat] || '📦') : '🪪';
  const photoHTML = d.photo
    ? `<img class="profile-photo" src="${esc(d.photo)}" alt="Photo" />`
    : `<div class="profile-icon-big">${catIcon}</div>`;

  const contactRows = [];
  contactRows.push(actionBtn('📞', d.ec1.name || 'Emergency Contact', `tel:${cleanPhone(d.ec1.phone)}`, d.ec1.phone));
  if (d.ec2) contactRows.push(actionBtn('📞', d.ec2.name || 'Secondary Contact', `tel:${cleanPhone(d.ec2.phone)}`, d.ec2.phone));
  if (d.wa) contactRows.push(actionBtn('💬', 'WhatsApp Chat', `https://wa.me/${cleanPhone(d.wa).replace(/^\+/, '')}`, d.wa));
  if (d.email) contactRows.push(actionBtn('📧', 'Send Email', `mailto:${d.email}`, d.email));
  if (d.land) contactRows.push(actionBtn('☎️', 'Landline', `tel:${cleanPhone(d.land)}`, d.land));
  if (d.doc) contactRows.push(actionBtn('👨‍⚕️', "Doctor's Contact", `tel:${cleanPhone(d.doc)}`, d.doc));

  const socials = [
    ['ig', '📷', 'Instagram', SOCIAL_BUILDERS.ig(d.ig), displayHandle(d.ig)],
    ['fb', '👥', 'Facebook',  SOCIAL_BUILDERS.fb(d.fb), displayHandle(d.fb)],
    ['li', '💼', 'LinkedIn',  SOCIAL_BUILDERS.li(d.li), displayHandle(d.li)],
    ['tw', '🐦', 'Twitter/X', SOCIAL_BUILDERS.tw(d.tw), displayHandle(d.tw)],
    ['yt', '📺', 'YouTube',   SOCIAL_BUILDERS.yt(d.yt), displayHandle(d.yt)],
    ['web','🌐', 'Website',   SOCIAL_BUILDERS.web(d.web), displayHandle(d.web)],
  ].filter(s => s[3]);

  const itemRows = [];
  if (d.cat)   itemRows.push(['Category', d.cat]);
  if (d.desc)  itemRows.push(['Description', d.desc]);
  if (d.color) itemRows.push(['Color', d.color]);
  if (d.marks) itemRows.push(['Notes', d.marks]);

  const ownerRows = [];
  if (d.oType)  ownerRows.push(['Type', d.oType]);
  if (d.school) ownerRows.push(['School', d.school]);
  if (d.class)  ownerRows.push(['Class', d.class]);

  const medRows = [];
  if (d.blood)   medRows.push(['Blood Group', d.blood]);
  if (d.allergy) medRows.push(['Allergies', d.allergy]);
  if (d.cond)    medRows.push(['Conditions', d.cond]);
  if (d.meds)    medRows.push(['Medications', d.meds]);

  card.innerHTML = `
    <div class="profile-hero">
      ${photoHTML}
      <div class="profile-name">${esc(d.n)}</div>
      ${d.cat ? `<div class="profile-category">${catIcon} ${esc(d.cat)}</div>` : ''}
    </div>

    ${d.reward ? `<div class="reward-banner">🎁 ${esc(d.reward)}</div>` : ''}

    <div class="contact-block">
      <h3>📍 If found, please contact</h3>
      ${contactRows.join('')}
    </div>

    ${itemRows.length ? block('📦 Item Details', itemRows) : ''}
    ${ownerRows.length ? block('👤 Owner Info', ownerRows) : ''}

    ${socials.length ? `
      <div class="contact-block">
        <h3>🌐 Social Media</h3>
        <div class="social-grid">
          ${socials.map(([_, ico, name, url, handle]) => `
            <a class="social-card" href="${esc(url)}" target="_blank" rel="noopener">
              <span class="social-ico">${ico}</span>
              <span class="social-info">
                <strong>${esc(name)}</strong>
                <small class="muted">${esc(handle)}</small>
              </span>
            </a>
          `).join('')}
        </div>
      </div>` : ''}

    ${medRows.length ? `
      <div class="contact-block medical-block">
        <details>
          <summary>🩺 Medical Info (tap to view)</summary>
          ${medRows.map(([k,v]) => row(k,v)).join('')}
        </details>
      </div>` : ''}

    ${d.return ? `<div class="contact-block"><h3>📍 Return Hint</h3><p>${esc(d.return)}</p></div>` : ''}
    ${d.msg ? `<div class="contact-block"><h3>💌 Message</h3><p>${esc(d.msg)}</p></div>` : ''}
  `;
}

// ===== INIT (runs at the BOTTOM — after all definitions) =====
initTheme();

const params = new URLSearchParams(window.location.search);
const dataStr = params.get('d');

if (!dataStr) {
  showError('No data found in this link.');
} else {
  const data = decodeData(dataStr);
  if (!data || !data.n) showError('Invalid or corrupted QR data.');
  else renderProfile(data);
}
//document.querySelector('.app-header').addEventListener('click', () => {
//  window.location.href = '/';
//});
