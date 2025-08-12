const signupForm = document.getElementById('signupForm');

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('http://localhost:5000/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });

    let data = null;
    try { data = await res.json(); } catch (_) {}

    if (res.ok) {
      window.location.href = 'index.html';
      return;
    }

    const msg =
      (data && (data.error || data.message)) ||
      `Signup failed (${res.status})`;
    alert(msg);
    console.error('Signup error:', msg, data);

  } catch (err) {
    alert(`Network error: ${err?.message || err}`);
    console.error('Signup error:', err);
  }
});
