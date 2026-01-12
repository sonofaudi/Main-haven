   document.getElementById('signUpForm').addEventListener('submit', async e => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const tag = document.getElementById('tag').value;

  if (!name || !email || !password || !tag) return alert('Please fill all fields');

  try {
    const res = await fetch('http://localhost:5000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, tag})
    });

    const data = await res.json();

    if (res.ok) {
      // Save token + name
      localStorage.setItem('token', data.tk);
      localStorage.setItem('name', data.name);

      alert('Account created!');
      setTimeout(() => window.location.href = 'homepage.html', 1200);
    } else {
      alert(data.error || data.message || `Sign-up failed`);
    }
  } catch (err) {
    console.error('❌ Sign-up Error:', err);
    alert('Network error – check your connection or server.');
  }
});
