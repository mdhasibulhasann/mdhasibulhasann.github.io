(() => {
  'use strict';
  // Read the existing cards, retaining their current image paths and copy.
  const section = document.querySelector('#travel');
  const source = section?.querySelector('.travel');
  if (!source || document.body.classList.contains('travel-gallery-page')) return;
  const slides = [...source.querySelectorAll('.travel-card')].flatMap(card =>
    [...card.querySelectorAll('img')].map(img => ({
      src: img.getAttribute('src'), alt: img.alt,
      name: card.querySelector('h3')?.textContent || '',
      description: card.querySelector('p')?.textContent || ''
    }))
  ).filter(item => item.src);
  if (!slides.length) return;

  const shell = document.createElement('div');
  shell.className = 'journey-shell';
  shell.setAttribute('role', 'region');
  shell.setAttribute('aria-label', 'Travel photographs');
  shell.setAttribute('aria-roledescription', 'carousel');
  shell.innerHTML = `<div class="journey-copy"><div class="journey-caption"><h3></h3><p></p></div><a class="journey-all" href="travel.html">View all</a></div><div class="journey-media"><div class="journey-viewport" tabindex="0" aria-label="Travel photos. Use left and right arrow keys to change photo."><div class="journey-track"></div></div><div class="journey-controls"><span class="journey-count"></span><button class="journey-play" type="button">Pause</button></div></div>`;
  const track = shell.querySelector('.journey-track');
  const viewport = shell.querySelector('.journey-viewport');
  const title = shell.querySelector('h3');
  const description = shell.querySelector('.journey-caption p');
  const count = shell.querySelector('.journey-count');
  const play = shell.querySelector('.journey-play');
  slides.forEach((item, i) => {
    const frame = document.createElement('figure');
    frame.className = 'journey-slide';
    frame.setAttribute('role', 'group');
    frame.setAttribute('aria-label', `${i + 1} of ${slides.length}: ${item.name}`);
    const image = document.createElement('img');
    image.src = item.src;
    image.alt = item.alt || item.name;
    image.loading = i < 2 ? 'eager' : 'lazy';
    image.draggable = false;
    const fallback = document.createElement('span');
    fallback.textContent = 'Photo coming soon';
    fallback.hidden = true;
    image.addEventListener('error', () => { image.hidden = true; fallback.hidden = false; });
    frame.append(image, fallback);
    track.append(frame);
  });
  source.before(shell);
  source.hidden = true;
  source.classList.add('journey-source');

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0, timer, paused = reduced.matches, hovered = false;
  let focused = false, visible = false, gesture = null;
  function schedule() {
    clearTimeout(timer);
    play.textContent = paused ? 'Play' : 'Pause';
    play.setAttribute('aria-label', paused ? 'Start slideshow' : 'Pause slideshow');
    if (!paused && !hovered && !focused && !gesture && visible && !document.hidden) {
      timer = setTimeout(() => show(index + 1), 5000);
    }
  }
  function show(next, manual = false) {
    index = (next + slides.length) % slides.length;
    const frames = [...track.children];
    const distance = frames[index].offsetLeft - frames[0].offsetLeft;
    track.style.transform = `translateX(${-distance}px)`;
    frames.forEach((frame, i) => frame.setAttribute('aria-hidden', String(i !== index)));
    title.textContent = slides[index].name;
    description.textContent = slides[index].description;
    count.setAttribute('aria-live', manual ? 'polite' : 'off');
    count.textContent = `${index + 1} / ${slides.length}`;
    schedule();
  }
  play.addEventListener('click', () => { paused = !paused; schedule(); });
  shell.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { hovered = true; schedule(); } });
  shell.addEventListener('pointerleave', () => { hovered = false; schedule(); });
  shell.addEventListener('focusin', () => { focused = true; schedule(); });
  shell.addEventListener('focusout', () => setTimeout(() => { focused = shell.contains(document.activeElement); schedule(); }, 0));
  viewport.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault(); show(index + (e.key === 'ArrowRight' ? 1 : -1), true);
    }
  });
  viewport.addEventListener('pointerdown', e => {
    if (!e.isPrimary || e.button !== 0) return;
    gesture = { id: e.pointerId, x: e.clientX, y: e.clientY };
    viewport.setPointerCapture(e.pointerId); schedule();
  });
  viewport.addEventListener('pointerup', e => {
    if (!gesture || gesture.id !== e.pointerId) return;
    const dx = e.clientX - gesture.x, dy = e.clientY - gesture.y;
    gesture = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) show(index + (dx < 0 ? 1 : -1), true);
    else schedule();
  });
  viewport.addEventListener('pointercancel', () => { gesture = null; schedule(); });
  viewport.addEventListener('lostpointercapture', () => { gesture = null; schedule(); });
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', () => { if (reduced.matches) paused = true; schedule(); });
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; schedule(); }, { threshold: 0.25 }).observe(shell);
  new ResizeObserver(() => show(index)).observe(viewport);
  // Carry the selected theme to the gallery without changing homepage defaults.
  shell.querySelector('.journey-all').addEventListener('click', () => {
    try { sessionStorage.setItem('travel-theme', document.documentElement.dataset.theme || 'light'); } catch (_) {}
  });
  show(0);
})();
