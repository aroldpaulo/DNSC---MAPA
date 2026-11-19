/* =====================================================================
   script.js  –  ALL THE BEHAVIOR OF THE WEBSITE (one file)
   ---------------------------------------------------------------------
   TABLE OF CONTENTS  (Ctrl+F the title, e.g. "// ===== 7.")
     1. SETTINGS          <- change DEBUG, image folder, hero picture here
     2. DATA              <- the campuses list (names, descriptions, pictures)
     3. HELPERS           <- mapaLog(), bgStyle()
     4. BUILD HOME        <- makes the campus slides + campus cards from DATA
     5. ROUTER            <- switches between pages (#home, #about, #contact, #campus-xxx)
     6. NAVBAR
     7. COOKIE NOTICE
     8. CAROUSEL          <- the hero slider
     9. SEARCH            <- the search box
    10. ADMIN SHORTCUT
    11. START             <- the order everything runs in
   Something not working?  Open the browser console (F12 > Console).
   With DEBUG = true you will see "[MAPA] ..." messages telling you what happened.
   ===================================================================== */


// ===== 1. SETTINGS =====================================================
const DEBUG = true;                          // true = print [MAPA] messages in the console, false = silent
const IMAGE_FOLDER = 'images/homepage/';     // all slider / campus pictures live in this folder
const HERO_IMAGE = 'search-bg.jpg';          // background of the first (search) slide
const ADMIN_URL = '';                        // later: put the admin page here (e.g. 'backend/admin/login.html')


// ===== 2. DATA =========================================================
// To add a campus: copy one line, change slug / name / picture, save. Slides, cards, search and the
// campus page all update by themselves.
//   slug    = the id used in the address (#campus-panabo). Letters, numbers and "-" only.
//   name    = the title shown on the site
//   img     = a FILE NAME inside images/homepage/
//   desc    = the description text
const PLACEHOLDER_DESC = 'Placeholder description. Replace with verified campus information.';

const CAMPUSES = [
  { slug: 'panabo',       name: 'Main Campus (Placeholder)', img: 'campus-1.jpg', desc: PLACEHOLDER_DESC },
  { slug: 'tagum',        name: 'Campus 2 (Placeholder)',    img: 'campus-2.jpg', desc: PLACEHOLDER_DESC },
  { slug: 'other-campus', name: 'Campus 3 (Placeholder)',    img: 'campus-3.jpg', desc: PLACEHOLDER_DESC },
];

// Things the search box can find. Campuses are real; buildings and offices are SAMPLE data
// until the real directory is added.
const SAMPLE_BUILDINGS = ['Administration Building', 'Library Building'];
const SAMPLE_OFFICES = ["Registrar's Office", 'Cashier', 'Admissions Office', 'Clinic'];

function makeSearchData() {
  const list = [];
  CAMPUSES.forEach(c => {
    const url = '#campus-' + c.slug;
    list.push({ t: c.name, type: 'Campus', campus: '', url });
    SAMPLE_BUILDINGS.forEach(b => list.push({ t: b + ' (sample)', type: 'Building', campus: c.name, url }));
    SAMPLE_OFFICES.forEach(o => list.push({ t: o + ' (sample)', type: 'Office', campus: c.name, url }));
  });
  return list;
}


// ===== 3. HELPERS ======================================================
/** mapaLog('something', value) prints in the console, but ONLY when DEBUG is true. */
function mapaLog(...args) {
  if (DEBUG) console.log('[MAPA]', ...args);
}

/** CSS for a picture background (a green gradient shows behind it / when the file is missing). */
function bgStyle(file) {
  const gradient = 'linear-gradient(135deg,#0B5D1E,#29A31E)';
  if (!file) return 'background-image:' + gradient;
  return "background-image:url('" + IMAGE_FOLDER + file + "')," + gradient;
}

/** DEBUG only: warn in the console if a picture file is missing. */
function checkImage(file) {
  if (!DEBUG || !file) return;
  const test = new Image();
  test.onerror = () => console.warn('[MAPA] MISSING PICTURE: ' + IMAGE_FOLDER + file);
  test.src = IMAGE_FOLDER + file;
}

/** Make text safe to put inside HTML. */
function esc(text) {
  return String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}


// ===== 4. BUILD HOME ===================================================
// Fills the parts of the homepage that come from the CAMPUSES list.
function buildHome() {
  // first slide background
  document.getElementById('introSlide').setAttribute('style', bgStyle(HERO_IMAGE));
  checkImage(HERO_IMAGE);

  // slides 2... (one per campus)
  document.getElementById('slideTrack').insertAdjacentHTML('beforeend', CAMPUSES.map(c => `
    <article class="slide" style="${bgStyle(c.img)}">
      <div class="slide-overlay">
        <div class="campus-card">
          <h2>${esc(c.name)}</h2>
          <p>${esc(c.desc)}</p>
          <a class="btn-gold" href="#campus-${esc(c.slug)}">Explore Campus</a>
        </div>
      </div>
    </article>`).join(''));

  // campus cards
  document.getElementById('campusCards').innerHTML = CAMPUSES.map(c => `
    <article class="card">
      <a class="card-photo" href="#campus-${esc(c.slug)}" tabindex="-1" aria-hidden="true">
        <div class="card-img" style="${bgStyle(c.img)}"></div>
      </a>
      <div class="card-body">
        <h3>${esc(c.name)}</h3>
        <p class="card-text">${esc(c.desc)}</p>
        <a class="card-link" href="#campus-${esc(c.slug)}">Explore campus <i class="fa-solid fa-arrow-right"></i></a>
      </div>
    </article>`).join('');

  CAMPUSES.forEach(c => checkImage(c.img));
  document.getElementById('year').textContent = new Date().getFullYear();
  mapaLog('home built,', CAMPUSES.length, 'campuses');
}


// ===== 5. ROUTER =======================================================
// The address after "#" decides which page is visible:
//   #home (or nothing)  #about  #contact  #campus-<slug>  #campuses (home, scrolled to the slider)
function showCampusPage(slug) {
  const campus = CAMPUSES.find(c => c.slug === slug);
  const name  = campus ? campus.name : 'Campus not found';
  const desc  = campus ? campus.desc : 'That campus does not exist.';
  document.getElementById('campusName').textContent = name;
  document.getElementById('campusDesc').textContent = desc;
  const photo = document.getElementById('campusPhoto');
  photo.hidden = !(campus && campus.img);
  if (campus) photo.setAttribute('style', bgStyle(campus.img));
  document.title = name + ' – DNSC';
  if (!campus) console.warn('[MAPA] unknown campus slug:', slug);
}

function route() {
  const hash = location.hash.replace('#', '');
  let page = 'home';
  let scrollToId = null;

  if (hash === 'about' || hash === 'contact') page = hash;
  else if (hash.startsWith('campus-')) page = 'campus';
  else if (hash === 'campuses') scrollToId = 'campuses';
  // anything else (empty, #home, a typo) -> home

  document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === 'page-' + page));

  if (page === 'campus') showCampusPage(hash.slice('campus-'.length));
  else document.title = { home: 'DNSC – MAPA', about: 'About – DNSC', contact: 'Contact – DNSC' }[page];

  document.getElementById('navbar').classList.toggle('solid', page !== 'home');   // green navbar on inner pages
  closeMenu();

  if (scrollToId) document.getElementById(scrollToId).scrollIntoView();
  else window.scrollTo(0, 0);
  mapaLog('page:', page, hash ? '(#' + hash + ')' : '');
}

function startRouter() {
  window.addEventListener('hashchange', route);
  route();
}


// ===== 6. NAVBAR (html: index.html [1], css: style.css "NAVBAR") =======
// - adds class "scrolled" after scrolling down (navbar turns green)
// - the menu button toggles class "open" (shows the menu)
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');

function closeMenu() {
  if (!navbar.classList.contains('open')) return;
  navbar.classList.remove('open');
  navToggle.setAttribute('aria-expanded', false);
  navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
}

function startNavbar() {
  const updateScrolled = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
  updateScrolled();
  window.addEventListener('scroll', updateScrolled, { passive: true });

  navToggle.addEventListener('click', () => {
    const isOpen = navbar.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    navToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });

  // clicking anywhere outside the navbar closes an open menu
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) closeMenu();
  });
  mapaLog('navbar ready');
}


// ===== 7. COOKIE NOTICE (html: index.html [6]) =========================
// Hidden for the rest of the browser session once the visitor closes it.
function startCookie() {
  const box = document.getElementById('cookie');
  const hide = () => { box.classList.add('hide'); sessionStorage.setItem('mapa-cookie', '1'); };
  if (sessionStorage.getItem('mapa-cookie')) box.classList.add('hide');
  document.getElementById('agree').addEventListener('click', hide);
  box.querySelector('.cookie-x').addEventListener('click', hide);
}


// ===== 8. CAROUSEL (html: index.html [2] "2.1 HERO SLIDER") ============
// All slides sit side by side inside #slideTrack. To show slide N we move the track left by N x 100%.
// A timer moves to the next slide every 6 seconds. Must run AFTER buildHome() (that creates the slides).
function startCarousel() {
  const carousel = document.getElementById('carousel');
  const track = document.getElementById('slideTrack');
  const slides = carousel.querySelectorAll('.slide');
  const dotsBox = document.getElementById('dots');
  const SECONDS_PER_SLIDE = 6;

  let current = 0;         // index of the slide being shown
  let timer = null;        // the auto-play timer
  let swipeStartX = null;  // where a mouse/touch swipe started

  // one dot per slide
  slides.forEach((_, n) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', 'Go to slide ' + (n + 1));
    dot.addEventListener('click', () => goTo(n, true));
    dotsBox.appendChild(dot);
  });
  const dots = dotsBox.querySelectorAll('button');

  function goTo(n, userClicked) {
    current = (n + slides.length) % slides.length;          // wraps around at both ends
    track.style.transform = 'translateX(-' + current * 100 + '%)';
    dots.forEach((dot, k) => dot.classList.toggle('active', k === current));
    mapaLog('slide', current + 1, 'of', slides.length);
    if (userClicked) startTimer();
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), SECONDS_PER_SLIDE * 1000);
  }

  // arrows
  carousel.querySelector('.prev').addEventListener('click', () => goTo(current - 1, true));
  carousel.querySelector('.next').addEventListener('click', () => goTo(current + 1, true));

  // swipe (touch) and drag (mouse): moving more than 50px changes slide
  function swipeStart(x) { swipeStartX = x; }
  function swipeEnd(x) {
    if (swipeStartX === null) return;
    const distance = x - swipeStartX;
    if (Math.abs(distance) > 50) goTo(current + (distance < 0 ? 1 : -1), true);
    swipeStartX = null;
  }
  carousel.addEventListener('touchstart', e => swipeStart(e.touches[0].clientX), { passive: true });
  carousel.addEventListener('touchend', e => swipeEnd(e.changedTouches[0].clientX));
  carousel.addEventListener('mousedown', e => swipeStart(e.clientX));
  carousel.addEventListener('mouseup', e => swipeEnd(e.clientX));

  // pause auto-play while the mouse is over the slider or something inside has focus
  carousel.addEventListener('mouseenter', () => clearInterval(timer));
  carousel.addEventListener('mouseleave', () => { swipeStartX = null; startTimer(); });
  carousel.addEventListener('focusin', () => clearInterval(timer));

  mapaLog('carousel ready,', slides.length, 'slides');
  goTo(0);
  startTimer();
}


// ===== 9. SEARCH (html: index.html [2] "2.1 HERO SLIDER", id="heroSearch") =====
// Type in the box -> matching items appear -> click one (or use the arrow keys and Enter) to open it.
function startSearch() {
  const form = document.getElementById('heroSearch');
  const input = document.getElementById('searchInput');
  const resultsBox = document.getElementById('searchResults');

  const data = makeSearchData();
  let links = [];       // the <a> elements currently shown
  let selected = -1;    // which one is highlighted with the arrow keys

  function showResults(text) {
    text = text.trim().toLowerCase();
    selected = -1;
    if (!text) { resultsBox.hidden = true; links = []; return; }

    const hits = data
      .filter(item => (item.t + ' ' + item.type + ' ' + item.campus).toLowerCase().includes(text))
      .slice(0, 7);
    mapaLog('search "' + text + '" ->', hits.length, 'results');

    if (!hits.length) {
      resultsBox.innerHTML = '<li class="none">No results found</li>';
      resultsBox.hidden = false; links = [];
      return;
    }
    const highlight = new RegExp('(' + text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
    resultsBox.innerHTML = hits.map(h =>
      '<li><a href="' + h.url + '"><span>' + esc(h.t).replace(highlight, '<mark>$1</mark>') + '</span>' +
      '<small>' + h.type + (h.campus ? ' · ' + esc(h.campus) : '') + '</small></a></li>'
    ).join('');
    resultsBox.hidden = false;
    links = [...resultsBox.querySelectorAll('a')];
  }

  function highlightLink(n) { links.forEach((a, k) => a.classList.toggle('active', k === n)); }

  input.addEventListener('input', () => showResults(input.value));
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' && links.length) { e.preventDefault(); selected = (selected + 1) % links.length; highlightLink(selected); }
    else if (e.key === 'ArrowUp' && links.length) { e.preventDefault(); selected = (selected - 1 + links.length) % links.length; highlightLink(selected); }
    else if (e.key === 'Escape') { resultsBox.hidden = true; }
  });
  form.addEventListener('submit', e => {          // Enter / Search button opens the highlighted (or first) result
    e.preventDefault();
    const target = links[selected >= 0 ? selected : 0];
    if (target) location.hash = target.getAttribute('href');
  });
  resultsBox.addEventListener('click', () => { resultsBox.hidden = true; input.value = ''; });
  document.addEventListener('click', e => {       // click outside closes the list
    if (!form.contains(e.target) && !resultsBox.contains(e.target)) resultsBox.hidden = true;
  });
  // typing/clicking in the search must not start a slider swipe
  ['mousedown', 'touchstart'].forEach(ev => form.parentElement.addEventListener(ev, e => e.stopPropagation(), { passive: true }));

  mapaLog('search ready,', data.length, 'items');
}


// ===== 10. ADMIN SHORTCUT ==============================================
// Ctrl + Shift + Q opens the admin page (set ADMIN_URL in section 1 when the backend exists).
function startAdminShortcut() {
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.code === 'KeyQ') {
      e.preventDefault();
      if (ADMIN_URL) location.href = ADMIN_URL;
      else mapaLog('Admin shortcut pressed, but ADMIN_URL is empty (no backend yet).');
    }
  });
}


// ===== 11. START =======================================================
// The order matters: build the slides first, THEN start the carousel.
buildHome();
startNavbar();
startCookie();
startCarousel();
startSearch();
startAdminShortcut();
startRouter();
mapaLog('MAPA ready');
