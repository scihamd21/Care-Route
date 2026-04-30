// ---- بيانات المستشفيات (مصر - القاهرة والمدن الكبرى) ----
const HOSPITALS_DB = [
  {
    id: 1,
    name: "مستشفى النور التخصصي",
    address: "مستشفى 7ذ · شارع الحرية",
    lat: 30.0561,
    lng: 31.2394,
    specialties: [
      { label: "شبكي", color: "blue" },
      { label: "أسنان", color: "green" },
      { label: "قلب", color: "red" }
    ],
    rating: 4.5,
    reviews: 347,
    isOpen: true,
    hours: "24 ساعة",
    phone: "01000000001"
  },
  {
    id: 2,
    name: "مستشفى الشفاء الدولي",
    address: "مستشفى يون · الدقي",
    lat: 30.0444,
    lng: 31.2112,
    specialties: [
      { label: "جراحة", color: "blue" },
      { label: "مخ وأعصاب", color: "purple" },
      { label: "عظام", color: "orange" },
      { label: "معامل", color: "gray" }
    ],
    rating: 4.2,
    reviews: 281,
    isOpen: true,
    hours: "24 ساعة",
    phone: "01000000002"
  },
  {
    id: 3,
    name: "مركز الفرام القومي",
    address: "مستشفى صحي · الظاهرة",
    lat: 30.0330,
    lng: 31.2263,
    specialties: [
      { label: "أطفال", color: "green" },
      { label: "إيلاج", color: "blue" },
      { label: "تأمين", color: "orange" }
    ],
    rating: 3.8,
    reviews: 193,
    isOpen: false,
    hours: "8ص - 10م",
    phone: "01000000003"
  },
  {
    id: 4,
    name: "مستشفى معهد ناجر",
    address: "مستشفى سكني · القاهرة",
    lat: 30.0210,
    lng: 31.2150,
    specialties: [
      { label: "خيارة", color: "blue" },
      { label: "عام", color: "green" },
      { label: "أبو بولة", color: "orange" }
    ],
    rating: 4.0,
    reviews: 152,
    isOpen: true,
    hours: "24 ساعة",
    phone: "01000000004"
  },
  {
    id: 5,
    name: "مستشفى المدرجاي الجامعي",
    address: "مستشفى خاص · المقطم",
    lat: 30.0050,
    lng: 31.2600,
    specialties: [
      { label: "باطنة", color: "blue" },
      { label: "بيئة", color: "green" }
    ],
    rating: 4.7,
    reviews: 412,
    isOpen: false,
    hours: "9ص - 9م",
    phone: "01000000005"
  },
  {
    id: 6,
    name: "مستشفى القصر العيني",
    address: "شارع القصر العيني · وسط القاهرة",
    lat: 30.0300,
    lng: 31.2300,
    specialties: [
      { label: "طوارئ", color: "red" },
      { label: "جراحة", color: "blue" },
      { label: "نساء وولادة", color: "purple" }
    ],
    rating: 4.3,
    reviews: 890,
    isOpen: true,
    hours: "24 ساعة",
    phone: "01000000006"
  },
  {
    id: 7,
    name: "مستشفى مصر الدولي",
    address: "شارع المعادي · القاهرة",
    lat: 29.9630,
    lng: 31.2560,
    specialties: [
      { label: "قلب", color: "red" },
      { label: "أعصاب", color: "purple" },
      { label: "أشعة", color: "gray" }
    ],
    rating: 4.6,
    reviews: 543,
    isOpen: true,
    hours: "24 ساعة",
    phone: "01000000007"
  },
  {
    id: 8,
    name: "مستشفى سان لوك",
    address: "المهندسين · الجيزة",
    lat: 30.0600,
    lng: 31.2000,
    specialties: [
      { label: "باطنة", color: "blue" },
      { label: "جلدية", color: "green" }
    ],
    rating: 3.9,
    reviews: 231,
    isOpen: false,
    hours: "8ص - 8م",
    phone: "01000000008"
  }
];

// ---- الحالة العامة ----
let map = null;
let userMarker = null;
let userLocation = null;
let markers = [];
let activeFilter = 'all';
let searchQuery = '';
let hospitalsWithDistance = [];

// ---- تهيئة الخريطة ----
function initMap(lat, lng) {
  if (map) return;

  map = L.map('map', {
    center: [lat, lng],
    zoom: 13,
    zoomControl: false
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Leaflet | © OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map);

  L.control.zoom({ position: 'topleft' }).addTo(map);
}

// ---- حساب المسافة (Haversine) ----
function calcDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDist(km) {
  return km < 1 ? Math.round(km * 1000) + ' م' : km.toFixed(1) + ' كم';
}

function renderStars(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += `<span class="star ${i <= Math.round(rating) ? '' : 'empty'}">★</span>`;
  }
  return html;
}

function createIcon(type) {
  const colors = {
    open:    '#27ae60',
    closed:  '#e74c3c',
    nearest: '#f39c12'
  };
  const color = colors[type] || colors.open;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
      <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 26 18 26s18-12.5 18-26C36 8.06 27.94 0 18 0z"
        fill="${color}" stroke="white" stroke-width="2"/>
      <path d="M18 11v14M11 18h14" stroke="white" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -44]
  });
}

function createUserIcon() {
  return L.divIcon({
    html: '<div class="user-marker"></div>',
    className: '',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
}

function renderMarkers() {
  markers.forEach(m => m.remove());
  markers = [];

  const filtered = getFiltered();

  filtered.forEach((h, idx) => {
    const type = idx === 0 && activeFilter !== 'closed' ? 'nearest' :
                 (h.isOpen ? 'open' : 'closed');
    const icon = createIcon(type);

    const popup = `
      <div>
        <div class="popup-name">${h.name}</div>
        <div class="popup-address">${h.address}</div>
        <div class="popup-stars">
          ${renderStars(h.rating)}
          <span style="font-size:11px;color:#666;margin-right:4px">${h.rating} (${h.reviews})</span>
        </div>
        <div class="popup-row">
          <span class="popup-status ${h.isOpen ? 'open' : 'closed'}">${h.isOpen ? '● مفتوح' : '● مغلق'}</span>
          <span class="popup-distance">📍 ${formatDist(h.distance)}</span>
        </div>
        <button class="popup-nav-btn" onclick="navigateTo(${h.lat}, ${h.lng}, '${h.name}')">
          🧭 احصل على الاتجاهات
        </button>
      </div>
    `;

    const marker = L.marker([h.lat, h.lng], { icon })
      .addTo(map)
      .bindPopup(popup, { maxWidth: 240 });

    marker.on('click', () => {
      highlightCard(h.id);
    });

    markers.push(marker);
  });
}

function getUserLocation() {
  if (!navigator.geolocation) {
    showError('متصفحك لا يدعم تحديد الموقع.');
    loadFallback();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      onLocationReady();
    },
    (err) => {
      console.warn('Geolocation error:', err.message);
      userLocation = { lat: 30.0444, lng: 31.2357 };
      onLocationReady(true);
    },
    { timeout: 8000, enableHighAccuracy: true }
  );
}

function onLocationReady(isFallback = false) {
  const { lat, lng } = userLocation;

  initMap(lat, lng);

  if (userMarker) userMarker.remove();
  userMarker = L.marker([lat, lng], { icon: createUserIcon() })
    .addTo(map)
    .bindTooltip('موقعك الحالي', { permanent: false, direction: 'top' });

  hospitalsWithDistance = HOSPITALS_DB.map(h => ({
    ...h,
    distance: calcDistance(lat, lng, h.lat, h.lng)
  })).sort((a, b) => a.distance - b.distance);

  renderSidebar();
  renderMarkers();

  if (isFallback) {
    showFallbackNotice();
  }
}

function getFiltered() {
  return hospitalsWithDistance.filter(h => {
    const matchFilter = activeFilter === 'all' ||
      (activeFilter === 'open' && h.isOpen) ||
      (activeFilter === 'closed' && !h.isOpen);
    const matchSearch = h.name.includes(searchQuery) ||
      h.address.includes(searchQuery);
    return matchFilter && matchSearch;
  });
}

function renderSidebar() {
  const list = document.getElementById('hospitalList');
  const filtered = getFiltered();

  if (filtered.length === 0) {
    list.innerHTML = '<div class="no-results">لا توجد نتائج</div>';
    return;
  }

  list.innerHTML = filtered.map((h, idx) => {
    const isNearest = idx === 0 && activeFilter !== 'closed';
    return `
      <div class="hospital-card ${isNearest ? 'nearest' : ''}"
           id="card-${h.id}"
           onclick="focusHospital(${h.id})">
        <div class="card-top">
          <div class="status-dot ${h.isOpen ? 'open' : 'closed'}"></div>
          <div class="card-info">
            <div class="hospital-name">${h.name}</div>
            <div class="hospital-address">${h.address}</div>
            <div class="specialties">
              ${h.specialties.map(s => `<span class="spec-tag ${s.color}">${s.label}</span>`).join('')}
            </div>
          </div>
        </div>
        <div class="card-bottom">
          <div class="card-meta">
            <div class="meta-item">
              <div class="stars">${renderStars(h.rating)}</div>
              <span class="rating-num">${h.rating}</span>
            </div>
            <div class="meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              ${formatDist(h.distance)}
            </div>
          </div>
          <button class="navigate-btn" onclick="event.stopPropagation(); navigateTo(${h.lat}, ${h.lng}, '${h.name}')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polygon points="3 11 22 2 13 21 11 13 3 11"/>
            </svg>
            اتجاه الآن
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function focusHospital(id) {
  const h = hospitalsWithDistance.find(x => x.id === id);
  if (!h || !map) return;

  map.flyTo([h.lat, h.lng], 15, { duration: 1 });

  const idx = getFiltered().findIndex(x => x.id === id);
  const marker = markers[idx];
  if (marker) setTimeout(() => marker.openPopup(), 800);

  highlightCard(id);
}

function highlightCard(id) {
  document.querySelectorAll('.hospital-card').forEach(c => c.style.borderColor = '');
  const card = document.getElementById(`card-${id}`);
  if (card) {
    card.style.borderColor = '#1a5ea8';
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function navigateTo(lat, lng, name) {
  const origin = userLocation
    ? `${userLocation.lat},${userLocation.lng}`
    : '';
  const url = origin
    ? `https://www.google.com/maps/dir/${origin}/${lat},${lng}`
    : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  window.open(url, '_blank');
}

document.getElementById('locateBtn').addEventListener('click', () => {
  if (!userLocation) {
    getUserLocation();
    return;
  }
  map.flyTo([userLocation.lat, userLocation.lng], 14, { duration: 1 });
});

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    renderSidebar();
    renderMarkers();
  });
});

document.getElementById('searchInput').addEventListener('input', (e) => {
  searchQuery = e.target.value.trim();
  renderSidebar();
  renderMarkers();
});

function showFallbackNotice() {
  const notice = document.createElement('div');
  notice.style.cssText = `
    position:fixed; top:60px; left:50%; transform:translateX(-50%);
    background:#f39c12; color:#fff; padding:8px 18px; border-radius:20px;
    font-size:12px; font-family:var(--font); z-index:9999;
    box-shadow:0 4px 16px rgba(0,0,0,0.2);
  `;
  notice.textContent = 'تم استخدام موقع القاهرة الافتراضي — أعط الإذن لتحديد موقعك الدقيق';
  document.body.appendChild(notice);
  setTimeout(() => notice.remove(), 4000);
}

function showError(msg) {
  document.getElementById('hospitalList').innerHTML = `
    <div class="error-state">
      ${msg}
      <br>
      <button class="retry-btn" onclick="getUserLocation()">إعادة المحاولة</button>
    </div>
  `;
}

function loadFallback() {
  userLocation = { lat: 30.0444, lng: 31.2357 };
  onLocationReady(true);
}

getUserLocation();