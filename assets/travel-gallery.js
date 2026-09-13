(() => {
  const root = document.documentElement;
  const button = document.getElementById('galleryTheme');
  function setTheme(dark) {
    root.dataset.theme = dark ? 'dark' : 'light';
    button.textContent = dark ? 'Light mode' : 'Dark mode';
    button.setAttribute('aria-pressed', String(dark));
    document.querySelector('meta[name="theme-color"]').content = dark ? '#1b1f24' : '#e9edf2';
    try { sessionStorage.setItem('travel-theme', dark ? 'dark' : 'light'); } catch (_) {}
  }
  setTheme(root.dataset.theme === 'dark');
  button.addEventListener('click', () => setTheme(root.dataset.theme !== 'dark'));
  document.querySelectorAll('.photo-slot').forEach(frame => {
    const img = frame.querySelector('img');
    if (!img) return;
    img.removeAttribute('onerror');
    let fallback = frame.querySelector('span');
    if (!fallback) { fallback = document.createElement('span'); fallback.hidden = true; fallback.textContent = 'Photo coming soon'; frame.append(fallback); }
    const fail = () => { img.hidden = true; fallback.hidden = false; };
    img.addEventListener('error', fail);
    if (img.complete && img.naturalWidth === 0) fail();
  });
})();
