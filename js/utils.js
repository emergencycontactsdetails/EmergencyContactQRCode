export function encodeData(obj) {
  const json = JSON.stringify(obj);
  return LZString.compressToEncodedURIComponent(json);
}

export function decodeData(str) {
  try {
    const json = LZString.decompressFromEncodedURIComponent(str);
    return JSON.parse(json);
  } catch (e) {
    console.error('Decode failed', e);
    return null;
  }
}

export function buildShareURL(data) {
  const encoded = encodeData(data);
  const base = window.location.origin + window.location.pathname.replace(/index\.html?$/, '');
  return `${base}view.html?d=${encoded}`;
}

export function toast(msg, type = '') {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.className = `toast show ${type}`;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('show'), 2500);
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function esc(s = '') {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
  );
}

export const validators = {
  email: v => /^.+@.+\..+$/.test(v),
  url: v => /^https?:\/\//.test(v),
  tel: v => /^[+\d\s\-()]{6,20}$/.test(v),
};

export function initTheme() {
  const saved = localStorage.getItem('tagsafe-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') ||
                   (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('tagsafe-theme', next);
    btn.textContent = next === 'dark' ? '☀️' : '🌙';
  });
}