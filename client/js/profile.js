let savedAvatarUrl = "";
let savedAvatarId = "";

const token = localStorage.getItem("token");
if (!token) location.href = "sign-in.html";

// DOM Elements
const nameEl = document.getElementById("userName");
const tagEl = document.getElementById("userTag");
const imgEl = document.getElementById("avatarImg");
const fileInp = document.getElementById("fileInput");
const saveBtn = document.getElementById("saveBtn");

// Simple popup notifications
function showGreenPopUp(msg) {
  const popup = document.createElement("div");
  popup.textContent = msg;
  popup.style.cssText = `
    position: fixed; bottom: 20px; right: 20px;
    background: #4caf50; color: white; padding: 10px 20px;
    border-radius: 8px; z-index: 1000; font-weight: bold;
  `;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 3000);
}

function showRedPopUp(msg) {
  const popup = document.createElement("div");
  popup.textContent = msg;
  popup.style.cssText = `
    position: fixed; bottom: 20px; right: 20px;
    background: #f44336; color: white; padding: 10px 20px;
    border-radius: 8px; z-index: 1000; font-weight: bold;
  `;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 3000);
}

/* ---------------- LOAD PROFILE ---------------- */
(async () => {
  try {
    const res = await fetch("http://localhost:5000/api/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to load profile");

    const me = await res.json();
    nameEl.textContent = me.username || "Default User";
    tagEl.textContent = me.tag || "@unknown";
    imgEl.src = me.profilePic || "assets/user.png";

    // Load existing RPM avatar
    if (me.avatarUrl) savedAvatarUrl = me.avatarUrl;
    if (me.character) savedAvatarId = me.character;

  } catch (err) {
    console.error(err);
    showRedPopUp("Could not load profile");
  }
})();

/* ---------------- UPLOAD PROFILE PIC ---------------- */
imgEl.onclick = () => fileInp.click();
fileInp.onchange = e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = ev => (imgEl.src = ev.target.result);
  reader.readAsDataURL(file);
};

/* ---------------- READY PLAYER ME ---------------- */
window.addEventListener("message", (event) => {
  if (
    event.data &&
    event.data.eventName === "v1.avatar.exported"
  ) {
    const glbUrl = event.data.data.url;

    // Extract avatar ID from URL
    const avatarId = glbUrl.split("/").pop().replace(".glb", "");

    savedAvatarUrl = glbUrl;
    savedAvatarId = avatarId;

    showGreenPopUp("Avatar created! Click Save to store it.");
  }
});

/* ---------------- SAVE PROFILE ---------------- */
async function saveProfile() {
  try {
    const body = {
      username: nameEl.textContent.trim(),
      tag: tagEl.textContent.trim(),
      profilePic: imgEl.src,
      avatarUrl: savedAvatarUrl,
      character: savedAvatarId
    };

    const res = await fetch("http://localhost:5000/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      showGreenPopUp("Profile saved successfully!");
    } else {
      const err = await res.json();
      console.error(err);
      showRedPopUp("Save failed. Check console for details.");
    }
  } catch (err) {
    console.error(err);
    showRedPopUp("Save failed due to network error");
  }
}

saveBtn.onclick = saveProfile;

/* ---------------- LOGOUT ---------------- */
document.getElementById("logoutBtn").onclick = () => {
  localStorage.clear();
  location.href = "sign-in.html";
};