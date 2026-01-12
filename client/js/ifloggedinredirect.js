import { getToken } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const token = getToken();
  if (token) {
    window.location.href = 'homepage.html'; // redirect automatically
  }
});
