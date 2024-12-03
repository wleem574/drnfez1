// إعداد الخريطة باستخدام Leaflet
let map, marker, userLocation;

// تهيئة الخريطة
function initMap() {
  map = L.map("map").setView([33.3152, 44.3661], 13); // بغداد
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors',
  }).addTo(map);
}

// تحديد الموقع الجغرافي
function getUserLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        userLocation = [latitude, longitude];
        map.setView(userLocation, 15);

        if (!marker) {
          marker = L.marker(userLocation, { draggable: true })
            .addTo(map)
            .bindPopup("موقعك الحالي")
            .openPopup();
        } else {
          marker.setLatLng(userLocation).openPopup();
        }
      },
      () => alert("تعذر تحديد الموقع. يرجى السماح بخدمة الموقع.")
    );
  } else {
    alert("جهازك لا يدعم خاصية الموقع الجغرافي.");
  }
}

// استدعاء الوظائف عند التحميل
document.getElementById("currentLocationButton").addEventListener("click", getUserLocation);

// تهيئة الخريطة عند التحميل
initMap();
