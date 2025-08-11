document.addEventListener('DOMContentLoaded', function () {
    const signinForm = document.getElementById('signinForm');

    signinForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('username', data.username);
                window.location.href = 'counter.html';
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Login failed');
            }
        } catch (err) {
            console.error('Error during login:', err);
            alert('Error connecting to server.');
        }
    });
});
