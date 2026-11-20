/* =====================================================================
   MAP PAGE – PLACEHOLDER FUNCTIONS (map.html)

   The buttons on the page already call the functions below.
   Every function marked TODO only shows a message for now.
   YOU write the real Google Maps code inside them.

   Where things go:
     - the map box ............ <div id="map">          (map.html)
     - the API key ............ backend/.env            (GOOGLE_MAPS_API_KEY)
     - the key reaches the page through ... GET /api/config   (backend/app.py)
   ===================================================================== */


/* ===== CAMPUS LIST =====
   Replace the numbers with the real latitude/longitude of each campus.
   (Google Maps: right-click the campus > click the numbers to copy.) */
var CAMPUSES = {
  'main':     { name: 'Main',                    lat: 7.3086, lng: 125.6841 },   // PLACEHOLDER location
  'campus-2': { name: 'Campus 2 (Placeholder)',  lat: 7.4478, lng: 125.8078 },   // PLACEHOLDER location
  'campus-3': { name: 'Campus 3 (Placeholder)',  lat: 7.4000, lng: 125.7000 }    // PLACEHOLDER location
};

var map = null;            // the Google Map object (you create it in initMap)
var travelMode = 'WALKING';


/* ===== SMALL HELPERS (already done) ===== */

// shows a small message at the bottom-left of the map
var noteTimer = null;
function showNote(text) {
  var box = document.getElementById('mapNote');
  box.textContent = text;
  box.classList.add('show');
  clearTimeout(noteTimer);
  noteTimer = setTimeout(function () { box.classList.remove('show'); }, 3500);
}

// changes the green/red chip at the top-left of the map
function setApiStatus(connected) {
  var chip = document.getElementById('apiStatus');
  if (connected) {
    chip.classList.add('ready');
    chip.innerHTML = '<i class="fa-solid fa-circle"></i> Google Maps: connected';
  } else {
    chip.classList.remove('ready');
    chip.innerHTML = '<i class="fa-solid fa-circle"></i> Google Maps: not connected';
  }
}

// shows the sample result list (replace with real results)
function showResults(items) {
  var list = document.getElementById('resultList');
  if (!items || items.length === 0) {
    list.innerHTML = '<li class="result-empty">No results.</li>';
    return;
  }
  var html = '';
  for (var i = 0; i < items.length; i++) {
    html += '<li data-index="' + i + '">' + items[i].name + '<small>' + items[i].info + '</small></li>';
  }
  list.innerHTML = html;
}

// fills the distance/time box under the results
function showRouteSummary(distanceText, timeText) {
  document.getElementById('routeDistance').textContent = distanceText;
  document.getElementById('routeTime').textContent = timeText;
}


/* ===== TODO 1. GET THE API KEY FROM PYTHON =====
   Ask backend/app.py for the key (GET /api/config), then return it.
   Hint: fetch('/api/config').then(r => r.json())  ->  { apiKey: '...' } */
function getMapsConfig() {
  // TODO: write this function
  showNote('TODO: getMapsConfig() is not written yet.');
  return null;
}

/* ===== TODO 2. LOAD THE GOOGLE MAPS SCRIPT =====
   Add the <script src="https://maps.googleapis.com/maps/api/js?key=...&callback=initMap"> tag
   to the page using the key from getMapsConfig(). */
function loadGoogleMaps(apiKey) {
  // TODO: write this function
  showNote('TODO: loadGoogleMaps() is not written yet.');
}

/* ===== TODO 3. CREATE THE MAP =====
   Create the Google Map inside <div id="map">, centered on the selected campus.
   When it works: hide the placeholder and call setApiStatus(true). */
function initMap() {
  // TODO: write this function
  showNote('TODO: initMap() is not written yet.');
}

/* ===== TODO 4. MOVE THE MAP TO A CAMPUS =====
   campusId = 'main', 'campus-2' or 'campus-3'  (see CAMPUSES above). */
function selectCampus(campusId) {
  var campus = CAMPUSES[campusId];
  // TODO: move the map to campus.lat / campus.lng and add a marker
  showNote('TODO: selectCampus() is not written yet (' + campus.name + ').');
}

/* ===== TODO 5. SEARCH A BUILDING OR OFFICE =====
   Search text -> markers on the map + showResults([...]).
   You can call GET /api/search?q=... from Python, or use the Places library. */
function searchPlaces(query) {
  // TODO: write this function
  showNote('TODO: searchPlaces() is not written yet ("' + query + '").');
}

/* ===== TODO 6. GET DIRECTIONS =====
   Draw the route on the map, then call showRouteSummary('350 m', '5 min').
   mode = 'WALKING', 'DRIVING' or 'TRANSIT'. */
function getDirections(from, to, mode) {
  // TODO: write this function
  showNote('TODO: getDirections() is not written yet (' + mode + ').');
}

/* ===== TODO 7. USE MY LOCATION =====
   Hint: navigator.geolocation.getCurrentPosition(...) and put the result in the "From" box. */
function useMyLocation() {
  // TODO: write this function
  showNote('TODO: useMyLocation() is not written yet.');
}

/* ===== TODO 8. ZOOM + MAP TYPE ===== */
function zoomMap(change) {
  // TODO: write this function (change is +1 or -1)
  showNote('TODO: zoomMap() is not written yet.');
}
function setMapType(type) {
  // TODO: write this function (type is 'roadmap' or 'satellite')
  showNote('TODO: setMapType() is not written yet.');
}


/* =====================================================================
   BUTTON WIRING (already done – you do not need to change this part)
   ===================================================================== */

// navbar menu button
var navbar = document.getElementById('navbar');
var navToggle = document.getElementById('navToggle');
var navIcon = navToggle.querySelector('i');
navToggle.addEventListener('click', function () {
  var open = navbar.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  navIcon.classList.toggle('fa-bars', !open);
  navIcon.classList.toggle('fa-xmark', open);
});
document.addEventListener('click', function (event) {
  if (!navbar.contains(event.target)) {
    navbar.classList.remove('open');
    navIcon.classList.add('fa-bars');
    navIcon.classList.remove('fa-xmark');
  }
});

// campus dropdown (also reads ?campus=main from the link)
var campusSelect = document.getElementById('campusSelect');
var wanted = new URLSearchParams(window.location.search).get('campus');
if (wanted && CAMPUSES[wanted]) {
  campusSelect.value = wanted;
}
campusSelect.addEventListener('change', function () {
  selectCampus(campusSelect.value);
});

// search box
document.getElementById('placeSearchForm').addEventListener('submit', function (event) {
  event.preventDefault();
  var text = document.getElementById('placeSearch').value.trim();
  if (text !== '') {
    searchPlaces(text);
  }
});

// directions form
document.getElementById('directionsForm').addEventListener('submit', function (event) {
  event.preventDefault();
  getDirections(
    document.getElementById('fromInput').value.trim(),
    document.getElementById('toInput').value.trim(),
    travelMode
  );
});
document.getElementById('myLocationBtn').addEventListener('click', useMyLocation);

// walk / drive / transit buttons
var modeButtons = document.querySelectorAll('.mode');
for (var m = 0; m < modeButtons.length; m++) {
  modeButtons[m].addEventListener('click', function () {
    for (var k = 0; k < modeButtons.length; k++) {
      modeButtons[k].classList.remove('active');
    }
    this.classList.add('active');
    travelMode = this.getAttribute('data-mode');
  });
}

// map / satellite buttons
var typeButtons = document.querySelectorAll('.map-type button');
for (var t = 0; t < typeButtons.length; t++) {
  typeButtons[t].addEventListener('click', function () {
    for (var k = 0; k < typeButtons.length; k++) {
      typeButtons[k].classList.remove('active');
    }
    this.classList.add('active');
    setMapType(this.getAttribute('data-type'));
  });
}

// zoom buttons
document.getElementById('zoomIn').addEventListener('click', function () { zoomMap(1); });
document.getElementById('zoomOut').addEventListener('click', function () { zoomMap(-1); });


/* ===== START =====
   When your functions are ready, this is the order they should run:
   getMapsConfig() -> loadGoogleMaps(key) -> initMap() -> selectCampus(...) */
