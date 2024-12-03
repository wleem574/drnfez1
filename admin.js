import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

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
const storage = getStorage(app);

// Add specialist form
const specialistForm = document.getElementById('specialistForm');
specialistForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const fullName = document.getElementById('fullName').value;
  const specialization = document.getElementById('specialization').value;
  const center = document.getElementById('center').value;
  const profileImage = document.getElementById('profileImage').files[0];

  if (!profileImage) {
    alert("يرجى تحميل صورة!");
    return;
  }

  // Upload profile image
  const imageRef = storageRef(storage, `specialists/${profileImage.name}`);
  const snapshot = await uploadBytes(imageRef, profileImage);
  const imageUrl = await getDownloadURL(snapshot.ref);

  // Save specialist data
  const specialistsRef = ref(database, 'specialists');
  push(specialistsRef, {
    fullName,
    specialization,
    center,
    imageUrl
  })
    .then(() => {
      alert("تم إضافة المختص بنجاح!");
      specialistForm.reset();
    })
    .catch((error) => {
      alert("حدث خطأ أثناء إضافة المختص.");
      console.error(error);
    });
});

// Fetch specialists
const specialistsRef = ref(database, 'specialists');
onChildAdded(specialistsRef, (snapshot) => {
  const specialistData = snapshot.val();
  displaySpecialist(specialistData);
});

function displaySpecialist(specialistData) {
  const specialistsList = document.getElementById('specialists');
  const listItem = document.createElement('li');

  listItem.innerHTML = `
    <div>
      <img src="${specialistData.imageUrl}" alt="${specialistData.fullName}">
      <p><strong>${specialistData.fullName}</strong></p>
      <p>${specialistData.specialization}</p>
      <p>${specialistData.center}</p>
    </div>
  `;

  specialistsList.appendChild(listItem);
}
