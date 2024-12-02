// استيراد Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

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

let userLocation = null;

// تهيئة الخريطة
const map = L.map("map").setView([51.505, -0.09], 13);

// إضافة الطبقات باستخدام OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

// تحديد موقع المستخدم
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      userLocation = [position.coords.latitude, position.coords.longitude];
      map.setView(userLocation, 13);

      // وضع علامة على موقع المستخدم
      L.marker(userLocation).addTo(map).bindPopup("موقعك الحالي").openPopup();
    },
    () => {
      alert("تعذر تحديد الموقع. يرجى تفعيل GPS.");
    }
  );
} else {
  alert("المتصفح لا يدعم تحديد الموقع.");
}

// التعامل مع زر طلب الصيانة
document.getElementById("requestButton").addEventListener("click", () => {
  if (userLocation) {
    const requestRef = ref(database, "requests/" + Date.now());
    set(requestRef, {
      location: {
        lat: userLocation[0],
        lng: userLocation[1],
      },
      timestamp: new Date().toISOString(),
    })
      .then(() => {
        alert("تم إرسال طلب الصيانة بنجاح!");
      })
      .catch((error) => {
        console.error("خطأ أثناء إرسال الطلب:", error);
      });
  } else {
    alert("يرجى تفعيل الموقع أولاً.");
  }
});
