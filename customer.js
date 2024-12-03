import L from "https://unpkg.com/leaflet@1.9.3/dist/leaflet.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// إعداد Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBMa1ZBBH6Xdi-MqqG4-B8z2oBtOzb3MfA",
  authDomain: "drnfeez-c4037.firebaseapp.com",
  databaseURL: "https://drnfeez-c4037-default-rtdb.firebaseio.com",
  projectId: "drnfeez-c4037",
  storageBucket: "drnfeez-c4037.appspot.com",
  messagingSenderId: "912450814298",
  appId: "1:912450814298:web:2c1cd95abbda31e3a4b363",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let map, marker, userLocation;

// إعداد الخريطة
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
      (error) => {
        alert("تعذر تحديد الموقع. يرجى السماح بخدمة الموقع.");
      }
    );
  } else {
    alert("جهازك لا يدعم خاصية الموقع الجغرافي.");
  }
}

// إرسال الطلب
function sendRequest() {
  const description = document.getElementById("description").value;
  const phone = document.getElementById("phone").value;

  if (!description || !phone.match(/^\d{10}$/)) {
    alert("يرجى إدخال وصف للمشكلة ورقم هاتف صحيح.");
    return;
  }

  if (!userLocation) {
    alert("يرجى تحديد موقعك أولاً.");
    return;
  }

  const requestId = Date.now().toString();
  const requestRef = ref(database, `requests/${requestId}`);

  set(requestRef, {
    description,
    phone,
    location: { lat: userLocation[0], lng: userLocation[1] },
    status: "pending",
  });

  alert("تم إرسال طلبك بنجاح!");
}

document.getElementById("currentLocationButton").addEventListener("click", getUserLocation);
document.getElementById("requestButton").addEventListener("click", sendRequest);

initMap();
