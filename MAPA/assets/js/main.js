
/* ===== 1. SHOW PAGE =====
   showPage('about') hides every page and shows only the page with id="page-about".
   The navbar is see-through on the home page and green on the other pages. */
function showPage(name) {
  var pages = document.querySelectorAll('.page');
  for (var i = 0; i < pages.length; i++) {
    pages[i].classList.remove('active');
  }
  document.getElementById('page-' + name).classList.add('active');

  var navbar = document.getElementById('navbar');
  var spacer = document.getElementById('navSpacer');
  if (name === 'home') {
    navbar.classList.remove('solid');
    spacer.style.display = 'none';
  } else {
    navbar.classList.add('solid');
    spacer.style.display = 'block';
  }

  closeMenu();
  window.scrollTo(0, 0);
}

// go to the home page and scroll down to the campuses
function goToCampuses() {
  showPage('home');
  document.getElementById('campuses').scrollIntoView();
}


/* ===== 2. NAVBAR =====
   - after scrolling down the navbar turns green (class "scrolled")
   - the ☰ button opens and closes the menu (class "open") */
var navbar = document.getElementById('navbar');
var navToggle = document.getElementById('navToggle');
var navIcon = navToggle.querySelector('i');

function updateScrolled() {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}
updateScrolled();
window.addEventListener('scroll', updateScrolled);

function closeMenu() {
  navbar.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navIcon.classList.remove('fa-xmark');
  navIcon.classList.add('fa-bars');
}

navToggle.addEventListener('click', function () {
  if (navbar.classList.contains('open')) {
    closeMenu();
  } else {
    navbar.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    navIcon.classList.remove('fa-bars');
    navIcon.classList.add('fa-xmark');
  }
});

// clicking anywhere outside the navbar closes the menu
document.addEventListener('click', function (event) {
  if (!navbar.contains(event.target)) {
    closeMenu();
  }
});


/* ===== 3. COOKIE NOTICE =====
   Hidden for the rest of the browser session once the visitor closes it. */
var cookieBox = document.getElementById('cookie');

function hideCookie() {
  cookieBox.classList.add('hide');
  sessionStorage.setItem('mapa-cookie', '1');
}
if (sessionStorage.getItem('mapa-cookie')) {
  cookieBox.classList.add('hide');
}
document.getElementById('agree').addEventListener('click', hideCookie);
cookieBox.querySelector('.cookie-x').addEventListener('click', hideCookie);


/* ===== 4. SLIDER (home page hero) =====
   All slides sit side by side inside ".track". To show slide number N we move the track
   to the left by N x 100%. A timer moves to the next slide every 6 seconds. */
var carousel = document.getElementById('carousel');
var track = carousel.querySelector('.track');
var slides = carousel.querySelectorAll('.slide');
var dotsBox = document.getElementById('dots');
var SECONDS_PER_SLIDE = 6;

var current = 0;          // number of the slide being shown (0 = first)
var timer = null;         // the auto-play timer
var swipeStartX = null;   // where a mouse/touch swipe started

// make one dot for every slide
function makeDot(slideNumber) {
  var dot = document.createElement('button');
  dot.setAttribute('aria-label', 'Go to slide ' + (slideNumber + 1));
  dot.addEventListener('click', function () {
    goToSlide(slideNumber, true);
  });
  dotsBox.appendChild(dot);
}
for (var n = 0; n < slides.length; n++) {
  makeDot(n);
}
var dots = dotsBox.querySelectorAll('button');

// show slide number n (after the last slide it goes back to the first)
function goToSlide(n, userClicked) {
  current = (n + slides.length) % slides.length;
  track.style.transform = 'translateX(-' + (current * 100) + '%)';
  for (var k = 0; k < dots.length; k++) {
    if (k === current) {
      dots[k].classList.add('active');
    } else {
      dots[k].classList.remove('active');
    }
  }
  if (userClicked) {
    startTimer();
  }
}

function startTimer() {
  clearInterval(timer);
  timer = setInterval(function () {
    goToSlide(current + 1, false);
  }, SECONDS_PER_SLIDE * 1000);
}

// arrows
carousel.querySelector('.prev').addEventListener('click', function () {
  goToSlide(current - 1, true);
});
carousel.querySelector('.next').addEventListener('click', function () {
  goToSlide(current + 1, true);
});

// swipe (touch) and drag (mouse): moving more than 50px changes the slide
function swipeStart(x) {
  swipeStartX = x;
}
function swipeEnd(x) {
  if (swipeStartX === null) {
    return;
  }
  var distance = x - swipeStartX;
  if (Math.abs(distance) > 50) {
    if (distance < 0) {
      goToSlide(current + 1, true);
    } else {
      goToSlide(current - 1, true);
    }
  }
  swipeStartX = null;
}
carousel.addEventListener('touchstart', function (event) { swipeStart(event.touches[0].clientX); }, { passive: true });
carousel.addEventListener('touchend', function (event) { swipeEnd(event.changedTouches[0].clientX); });
carousel.addEventListener('mousedown', function (event) { swipeStart(event.clientX); });
carousel.addEventListener('mouseup', function (event) { swipeEnd(event.clientX); });

// pause the auto-play while the mouse is over the slider
carousel.addEventListener('mouseenter', function () { clearInterval(timer); });
carousel.addEventListener('mouseleave', function () { swipeStartX = null; startTimer(); });
carousel.addEventListener('focusin', function () { clearInterval(timer); });

goToSlide(0, false);
startTimer();


/* ===== 5. SEARCH BAR =====
   The list below is what the search looks through. Add or edit lines to change the search.
   name = text shown · type = Campus / Building / Office · campus = which campus it belongs to
   page = the page that opens when clicked (the id of the page without "page-") */
var searchData = [
  { name: 'Main', type: 'Campus', campus: '', page: 'campus-main' },
  { name: 'Administration Building (sample)', type: 'Building', campus: 'Main', page: 'campus-main' },
  { name: 'Library Building (sample)', type: 'Building', campus: 'Main', page: 'campus-main' },
  { name: "Registrar's Office (sample)", type: 'Office', campus: 'Main', page: 'campus-main' },
  { name: 'Cashier (sample)', type: 'Office', campus: 'Main', page: 'campus-main' },
  { name: 'Admissions Office (sample)', type: 'Office', campus: 'Main', page: 'campus-main' },
  { name: 'Clinic (sample)', type: 'Office', campus: 'Main', page: 'campus-main' },
  { name: 'Campus 2 (Placeholder)', type: 'Campus', campus: '', page: 'campus-2' },
  { name: 'Administration Building (sample)', type: 'Building', campus: 'Campus 2 (Placeholder)', page: 'campus-2' },
  { name: 'Library Building (sample)', type: 'Building', campus: 'Campus 2 (Placeholder)', page: 'campus-2' },
  { name: "Registrar's Office (sample)", type: 'Office', campus: 'Campus 2 (Placeholder)', page: 'campus-2' },
  { name: 'Cashier (sample)', type: 'Office', campus: 'Campus 2 (Placeholder)', page: 'campus-2' },
  { name: 'Admissions Office (sample)', type: 'Office', campus: 'Campus 2 (Placeholder)', page: 'campus-2' },
  { name: 'Clinic (sample)', type: 'Office', campus: 'Campus 2 (Placeholder)', page: 'campus-2' },
  { name: 'Campus 3 (Placeholder)', type: 'Campus', campus: '', page: 'campus-3' },
  { name: 'Administration Building (sample)', type: 'Building', campus: 'Campus 3 (Placeholder)', page: 'campus-3' },
  { name: 'Library Building (sample)', type: 'Building', campus: 'Campus 3 (Placeholder)', page: 'campus-3' },
  { name: "Registrar's Office (sample)", type: 'Office', campus: 'Campus 3 (Placeholder)', page: 'campus-3' },
  { name: 'Cashier (sample)', type: 'Office', campus: 'Campus 3 (Placeholder)', page: 'campus-3' },
  { name: 'Admissions Office (sample)', type: 'Office', campus: 'Campus 3 (Placeholder)', page: 'campus-3' },
  { name: 'Clinic (sample)', type: 'Office', campus: 'Campus 3 (Placeholder)', page: 'campus-3' },
];

var searchForm = document.getElementById('heroSearch');
var searchInput = document.getElementById('searchInput');
var resultsBox = document.getElementById('searchResults');
var resultLinks = [];       // the result links currently shown
var selected = -1;          // which result is highlighted with the arrow keys

// type in the box -> show matching results (maximum 7)
function showResults(text) {
  text = text.trim().toLowerCase();
  selected = -1;
  resultLinks = [];

  if (text === '') {
    resultsBox.hidden = true;
    return;
  }

  var html = '';
  var count = 0;
  for (var i = 0; i < searchData.length; i++) {
    var item = searchData[i];
    var allText = (item.name + ' ' + item.type + ' ' + item.campus).toLowerCase();
    if (allText.indexOf(text) !== -1 && count < 7) {
      var small = item.type;
      if (item.campus !== '') {
        small = small + ' · ' + item.campus;
      }
      html += '<li><a href="#" data-page="' + item.page + '"><span>' + item.name + '</span><small>' + small + '</small></a></li>';
      count++;
    }
  }

  if (count === 0) {
    html = '<li class="none">No results found</li>';
  }
  resultsBox.innerHTML = html;
  resultsBox.hidden = false;
  resultLinks = resultsBox.querySelectorAll('a');
}

// open the page of a result
function openResult(link) {
  showPage(link.getAttribute('data-page'));
  resultsBox.hidden = true;
  searchInput.value = '';
}

// mark one result as active (used by the arrow keys)
function highlightResult(number) {
  for (var k = 0; k < resultLinks.length; k++) {
    if (k === number) {
      resultLinks[k].classList.add('active');
    } else {
      resultLinks[k].classList.remove('active');
    }
  }
}

searchInput.addEventListener('input', function () {
  showResults(searchInput.value);
});

// arrow keys move up/down the results, Escape closes the list
searchInput.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowDown' && resultLinks.length > 0) {
    event.preventDefault();
    selected = (selected + 1) % resultLinks.length;
    highlightResult(selected);
  } else if (event.key === 'ArrowUp' && resultLinks.length > 0) {
    event.preventDefault();
    selected = (selected - 1 + resultLinks.length) % resultLinks.length;
    highlightResult(selected);
  } else if (event.key === 'Escape') {
    resultsBox.hidden = true;
  }
});

// Enter / Search button opens the highlighted result (or the first one)
searchForm.addEventListener('submit', function (event) {
  event.preventDefault();
  var number = selected >= 0 ? selected : 0;
  if (resultLinks[number]) {
    openResult(resultLinks[number]);
  }
});

// clicking a result opens its page
resultsBox.addEventListener('click', function (event) {
  var link = event.target.closest('a');
  if (link) {
    event.preventDefault();
    openResult(link);
  }
});

// clicking outside closes the list
document.addEventListener('click', function (event) {
  if (!searchForm.contains(event.target) && !resultsBox.contains(event.target)) {
    resultsBox.hidden = true;
  }
});

// typing/clicking in the search must not start a slider swipe
var searchBox = searchForm.parentElement;
function stopSwipe(event) {
  event.stopPropagation();
}
searchBox.addEventListener('mousedown', stopSwipe, { passive: true });
searchBox.addEventListener('touchstart', stopSwipe, { passive: true });

