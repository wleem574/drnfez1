import L from "https://unpkg.com/leaflet@1.9.3/dist/leaflet.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, set, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// إعدادات Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBMa1ZBBH6Xdi-MqqG4-B8z2oBtOzb3MfA",
  authDomain: "drnfeez-c4037.firebaseapp.com",
  databaseURL: "https://drnfeez-c4037-default-rtdb.firebaseio.com",
  projectId: "drnfeez-c4037",
  storageBucket: "drnfeez-c4037.appspot.com",
  messagingSenderId: "912450814298",
  appId: "1:912450814298:web:2c1cd95abbda31e3a4b363",
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let map, marker, userLocation, currentRequestRef;

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
      () => alert("تعذر تحديد الموقع. يرجى السماح بخدمة الموقع.")
    );
  } else {
    alert("المتصفح لا يدعم خاصية الموقع الجغرافي.");
  }
}

// إرسال طلب الصيانة
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
  currentRequestRef = ref(database, `requests/${requestId}`);
  set(currentRequestRef, {
    description,
    phone,
    location: { lat: userLocation[0], lng: userLocation[1] },
    status: "pending",
    timestamp: new Date().toISOString(),
  });

  document.getElementById("mainContent").style.display = "none";
  document.getElementById("waitingScreen").style.display = "block";

  onValue(currentRequestRef, (snapshot) => {
    const data = snapshot.val();
    if (data.status === "approved") {
      alert("تم قبول طلبك!");
      resetApp();
    } else if (data.status === "rejected") {
      alert("تم رفض طلبك. يرجى المحاولة لاحقاً.");
      resetApp();
    }
  });
}

// إعادة تعيين التطبيق
function resetApp() {
  document.getElementById("mainContent").style.display = "block";
  document.getElementById("waitingScreen").style.display = "none";
  if (currentRequestRef) remove(currentRequestRef);
}

// إعادة ضبط الخريطة إلى موقع المستخدم
function centerMapOnUser() {
  if (userLocation) {
    map.setView(userLocation, 15);
  } else {
    alert("لم يتم تحديد موقعك بعد. يرجى النقر على 'تحديد موقعي'.");
  }
}

// إلغاء الطلب
document.getElementById("cancelRequestButton").addEventListener("click", resetApp);

// استدعاء الوظائف عند التحميل
initMap();

// ربط الأحداث بالأزرار
document.getElementById("currentLocationButton").addEventListener("click", getUserLocation);
document.getElementById("centerMapButton").addEventListener("click", centerMapOnUser);
document.getElementById("requestButton").addEventListener("click", sendRequest);
