import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMa1ZBBH6Xdi-MqqG4-B8z2oBtOzb3MfA",
  authDomain: "drnfeez-c4037.firebaseapp.com",
  databaseURL: "https://drnfeez-c4037-default-rtdb.firebaseio.com",
  projectId: "drnfeez-c4037",
  storageBucket: "drnfeez-c4037.firebasestorage.app",
  messagingSenderId: "912450814298",
  appId: "1:912450814298:web:2c1cd95abbda31e3a4b363"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Initialize map
const map = L.map('map').setView([33.3152, 44.3661], 13); // Baghdad coordinates
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let customerLocation = null;

// Get current location
document.getElementById('currentLocationButton').addEventListener('click', () => {
  map.locate({ setView: true, maxZoom: 16 });

  map.on('locationfound', (e) => {
    customerLocation = e.latlng;
    L.marker(customerLocation).addTo(map)
      .bindPopup("موقعك الحالي").openPopup();
  });

  map.on('locationerror', () => {
    alert("تعذر تحديد الموقع. يرجى تمكين GPS.");
  });
});

// Submit form
document.getElementById('customerForm').addEventListener('submit', (e) => {
  e.preventDefault();

  if (!customerLocation) {
    alert("يرجى تحديد موقعك أولاً.");
    return;
  }

  const description = document.getElementById('description').value;
  const phone = document.getElementById('phone').value;

  const requestData = {
    description,
    phone,
    location: {
      lat: customerLocation.lat,
      lng: customerLocation.lng
    },
    timestamp: new Date().toISOString()
  };

  // Save data to Firebase
  const requestsRef = ref(database, 'requests');
  push(requestsRef, requestData)
    .then(() => {
      alert("تم إرسال الطلب بنجاح!");
      document.getElementById('customerForm').reset();
    })
    .catch((error) => {
      alert("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة لاحقاً.");
      console.error(error);
    });
});
