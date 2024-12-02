import L from "https://unpkg.com/leaflet@1.9.3/dist/leaflet.js";

// إعداد الخريطة
const map = L.map("map").setView([33.3152, 44.3661], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors',
}).addTo(map);

let marker;

// تحديد الموقع الجغرافي
function getUserLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 15);
        if (!marker) {
          marker = L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup("موقعك الحالي")
            .openPopup();
        } else {
          marker.setLatLng([latitude, longitude]).openPopup();
        }
      },
      () => alert("تعذر تحديد الموقع.")
    );
  } else {
    alert("جهازك لا يدعم تحديد الموقع.");
  }
}

// ربط الوظيفة بالزر
document.getElementById("currentLocationButton").addEventListener("click", getUserLocation);
