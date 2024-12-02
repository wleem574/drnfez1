import L from "https://unpkg.com/leaflet@1.9.3/dist/leaflet.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, set, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

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
const db = getDatabase(app);

let userLocation = null;
let currentRequestRef = null;

// إعداد الخريطة
const map = L.map("map").setView([33.3152, 44.3661], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);
let marker;

// تحديد الموقع
function getUserLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        userLocation = [latitude, longitude];
        map.setView(userLocation, 15);
        if (!marker) {
          marker = L.marker(userLocation, { draggable: true }).addTo(map).bindPopup("موقعك الحالي").openPopup();
        } else {
          marker.setLatLng(userLocation).openPopup();
        }
      },
      () => alert("تعذر الوصول إلى الموقع، يرجى المحاولة مرة أخرى.")
    );
  } else {
    alert("هذا الجهاز لا يدعم خاصية تحديد الموقع.");
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
  currentRequestRef = ref(db, `requests/${requestId}`);
  set(currentRequestRef, {
    description,
    phone,
    location: { lat: userLocation[0], lng: userLocation[1] },
    status: "pending",
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

// إلغاء الطلب
document.getElementById("cancelRequestButton").addEventListener("click", resetApp);

// ربط الوظائف بالأزرار
document.getElementById("currentLocationButton").addEventListener("click", getUserLocation);
document.getElementById("requestButton").addEventListener("click", sendRequest);

// طلب الموقع عند بدء التشغيل
getUserLocation();
