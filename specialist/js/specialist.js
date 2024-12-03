import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, onChildAdded, update } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMa1Z...",
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
  container: 'map',
  style: 'mapbox://styles/wleem574/cm47r6kwa00dt01r1bedmc99r',
  center: [44.3661, 33.3152],
  zoom: 13
});

// Listen for new requests
const requestsRef = ref(database, 'requests');
onChildAdded(requestsRef, (snapshot) => {
  const requestId = snapshot.key;
  const requestData = snapshot.val();
  displayRequest(requestId, requestData);
});

// Display request in the list
function displayRequest(requestId, requestData) {
  const requestsList = document.getElementById('requestsList');
  const listItem = document.createElement('li');
  
  listItem.innerHTML = `
    <div>
      <p><strong>الاسم:</strong> ${requestData.description}</p>
      <p><strong>الهاتف:</strong> ${requestData.phone}</p>
    </div>
    <button class="accept" data-id="${requestId}">قبول</button>
    <button class="reject" data-id="${requestId}">رفض</button>
  `;

  requestsList.appendChild(listItem);

  // Add event listeners
  listItem.querySelector('.accept').addEventListener('click', () => handleAccept(requestId, requestData));
  listItem.querySelector('.reject').addEventListener('click', () => handleReject(requestId));
}

// Handle accept
function handleAccept(requestId, requestData) {
  update(ref(database, `requests/${requestId}`), { status: 'accepted' })
    .then(() => {
      alert("تم قبول الطلب!");
      const center = [requestData.location.lng, requestData.location.lat];
      map.flyTo({ center, zoom: 15 });

      new mapboxgl.Marker()
        .setLngLat(center)
        .setPopup(new mapboxgl.Popup().setText("موقع الزبون"))
        .addTo(map);
    })
    .catch((error) => console.error("Error accepting request:", error));
}

// Handle reject
function handleReject(requestId) {
  update(ref(database, `requests/${requestId}`), { status: 'rejected' })
    .then(() => {
      alert("تم رفض الطلب!");
      document.querySelector(`[data-id="${requestId}"]`).parentElement.remove();
    })
    .catch((error) => console.error("Error rejecting request:", error));
}
