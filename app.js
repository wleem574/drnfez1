import L from "https://unpkg.com/leaflet@1.9.3/dist/leaflet.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

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
let marker;

// إعداد الخريطة على بغداد
const map = L.map("map").setView([33.3152, 44.3661], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

function getUserLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation = [position.coords.latitude, position.coords.longitude];
        map.setView(userLocation, 13);

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
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert("يرجى السماح بالوصول إلى الموقع.");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("تعذر تحديد الموقع. تأكد من تشغيل GPS.");
            break;
          case error.TIMEOUT:
            alert("انتهت مهلة تحديد الموقع. حاول مرة أخرى.");
            break;
          default:
            alert("حدث خطأ غير متوقع أثناء تحديد الموقع.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  } else {
    alert("المتصفح لا يدعم تحديد الموقع.");
  }
}

// طلب الموقع عند النقر على زر "موقعي الآن"
document.getElementById("currentLocationButton").addEventListener("click", getUserLocation);

// طلب الموقع عند تحميل الصفحة
getUserLocation();

// إرسال طلب صيانة
document.getElementById("requestButton").addEventListener("click", () => {
  const description = document.getElementById("description").value;
  const phone = document.getElementById("phone").value;

  if (!description || !phone.match(/^[0-9]{10}$/)) {
    alert("يرجى إدخال وصف المشكلة ورقم هاتف صحيح!");
    return;
  }

  if (userLocation) {
    document.getElementById("mainContent").style.display = "none";
    document.getElementById("waitingScreen").style.display = "block";

    const requestRef = ref(database, "requests/" + Date.now());
    set(requestRef, {
      location: {
        lat: userLocation[0],
        lng: userLocation[1],
      },
      description,
      phone,
      status: "pending",
      timestamp: new Date().toISOString(),
    });

    // مراقبة حالة الطلب
    onValue(requestRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.status === "approved") {
        alert("تم قبول طلبك!");
        document.getElementById("mainContent").style.display = "block";
        document.getElementById("waitingScreen").style.display = "none";
      }
    });
  } else {
    alert("يرجى تحديد موقعك أولاً.");
  }
});
