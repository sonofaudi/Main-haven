import { authedGet } from './api.js';

async function initLobby() {
  console.log("Lobby JS loaded");

  const code = localStorage.getItem('meetingCode');
  const scene = localStorage.getItem('selectedScene') || 'conference-room';

  if (!code) {
    alert("Meeting code missing");
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('lobbyCode').textContent = code;
  document.getElementById('lobbyScene').textContent = scene.replace('-', ' ');

  const meet = await authedGet(`/meetings/${code}`);

  if (meet.msg) {
    alert(meet.msg);
    return;
  }

  document.getElementById('enterBtn').addEventListener('click', () => {
    document.getElementById('unity-container').classList.remove('hidden');
    startUnity(meet);
  });
}

initLobby();

function startUnity(data) {
  console.log('Unity start with:', data);
}
