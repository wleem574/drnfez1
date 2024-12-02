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

// إعداد الخريطة
const map = L.map("map").setView([51.505, -0.09], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

let marker;

navigator.geolocation.getCurrentPosition(
  (position) => {
    userLocation = [position.coords.latitude, position.coords.longitude];
    map.setView(userLocation, 13);

    marker = L.marker(userLocation, { draggable: true })
      .addTo(map)
      .bindPopup("موقعك الحالي")
      .openPopup();

    marker.on("dragend", (e) => {
      userLocation = [e.target.getLatLng().lat, e.target.getLatLng().lng];
    });
  },
  () => {
    alert("تعذر تحديد الموقع. يرجى تفعيل GPS.");
  }
);

// إرسال طلب صيانة
document.getElementById("requestButton").addEventListener("click", () => {
  const description = document.getElementById("description").value;
  const phone = document.getElementById("phone").value;

  if (!description || !phone) {
    alert("يرجى ملء جميع الحقول المطلوبة!");
    return;
  }

  if (userLocation) {
    const requestRef = ref(database, "requests/" + Date.now());
    set(requestRef, {
      location: {
        lat: userLocation[0],
        lng: userLocation[1],
      },
      description,
      phone,
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

// عرض الطلبات السابقة
const requestsRef = ref(database, "requests");
onValue(requestsRef, (snapshot) => {
  const requests = snapshot.val();
  const container = document.getElementById("requestsContainer");
  container.innerHTML = "<h3>الطلبات السابقة</h3>";

  for (const id in requests) {
    const request = requests[id];
    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>الوصف:</strong> ${request.description}</p>
      <p><strong>رقم الهاتف:</strong> ${request.phone}</p>
      <p><strong>الموقع:</strong> ${request.location.lat}, ${request.location.lng}</p>
      <p><strong>التاريخ:</strong> ${new Date(request.timestamp).toLocaleString()}</p>
    `;
    container.appendChild(div);
  }
});
