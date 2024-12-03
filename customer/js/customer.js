import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMa...",
  authDomain: "drnfeez-c4037.firebaseapp.com",
  databaseURL: "https://drnfeez-c4037-default-rtdb.firebaseio.com",
  projectId: "drnfeez-c4037",
  storageBucket: "drnfeez-c4037.appspot.com",
  messagingSenderId: "912450814298",
  appId: "1:912450814298:web:2c1cd95abbda31e3a4b363"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Mapbox setup
mapboxgl.accessToken = 'pk.eyJ1Ijoid2xlZW01NzQiLCJhIjoiY200N3F1Znh4MDkwZjJrc2Rlamk4MmN2ZSJ9.53hYWnH7FK-7AyorhtRG1g';
const map = new mapboxgl.Map({
    container: 'map', // العنصر الذي سيتم عرض الخريطة فيه
    style: 'mapbox://styles/mapbox/streets-v11', // نمط الخريطة
    center: [44.3661, 33.3152], // إحداثيات الخريطة (longitude, latitude)
    zoom: 13 // مستوى التكبير
});

let customerLocation = null;

// Get current location
document.getElementById('currentLocationButton').addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      customerLocation = { lat: latitude, lng: longitude };

      new mapboxgl.Marker()
        .setLngLat([longitude, latitude])
        .setPopup(new mapboxgl.Popup().setText("موقعك الحالي"))
        .addTo(map);

      map.flyTo({ center: [longitude, latitude], zoom: 15 });
    },
    () => {
      alert("تعذر تحديد الموقع. يرجى تمكين GPS.");
    }
  );
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
    location: customerLocation,
    timestamp: new Date().toISOString()
  };

  const requestsRef = ref(database, 'requests');
  push(requestsRef, requestData)
    .then(() => {
      alert("تم إرسال الطلب بنجاح!");
      document.getElementById('customerForm').reset();
    })
    .catch((error) => {
      alert("حدث خطأ أثناء إرسال الطلب.");
      console.error(error);
    });
});
