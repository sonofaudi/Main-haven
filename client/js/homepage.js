import { getToken } from './api.js';

document.addEventListener("DOMContentLoaded", () => {
  const token = getToken();
  const name = localStorage.getItem("name");

  // ---------- WELCOME MESSAGE ----------
  const welcomeEl = document.getElementById("welcome-msg");
  if (token && name && welcomeEl) {
    welcomeEl.textContent = `Welcome, ${name}!`;
  }

  // ---------- REDIRECT IF NOT LOGGED IN ----------
  if (!token) {
    window.location.href = 'sign-in.html';
    return;
  }

  // ---------- GET STARTED BUTTON ----------
  const btn = document.getElementById("getStartedBtn");
  if (btn) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = 'meet.html';
    });
  }
});
