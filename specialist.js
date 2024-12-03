import L from "https://unpkg.com/leaflet@1.9.3/dist/leaflet.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

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

function initMap(lat, lng) {
  const map = L.map("map").setView([lat, lng], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors',
  }).addTo(map);

  L.marker([lat, lng]).addTo(map).bindPopup("موقع الزبون").openPopup();
}

function listenToRequests() {
  const requestsRef = ref(database, "requests");
  onValue(requestsRef, (snapshot) => {
    const data = snapshot.val();
    const requestList = document.getElementById("requests");
    requestList.innerHTML = "";
    for (const id in data) {
      const request = data[id];
      if (request.status === "pending") {
        const listItem = document.createElement("li");
        listItem.textContent = `طلب: ${request.description}, هاتف: ${request.phone}`;
        const acceptButton = document.createElement("button");
        acceptButton.textContent = "قبول";
        acceptButton.onclick = () => {
          update(ref(database, `requests/${id}`), { status: "approved" });
          initMap(request.location.lat, request.location.lng);
        };
        listItem.appendChild(acceptButton);
        requestList.appendChild(listItem);
      }
    }
  });
}

listenToRequests();
