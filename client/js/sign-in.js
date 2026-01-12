document.getElementById('signInForm').addEventListener('submit', async e => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) return showRedPopUp('Please fill all fields');

  try {
    const res = await fetch('http://localhost:5000/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      // Save backend token and name using correct keys
      localStorage.setItem('token', data.tk);
      localStorage.setItem('name', data.name);

      showGreenPopUp('Welcome back!');
      setTimeout(() => window.location.href = 'homepage.html', 1200);
    } else {
      showRedPopUp(data.error || data.message || 'Login failed');
    }
  } catch {
    showRedPopUp('Network error – is the server running?');
  }
});

function togglePwd() {
  const p = document.getElementById('password');
  p.type = p.type === 'password' ? 'text' : 'password';
}
window.togglePwd = togglePwd;
