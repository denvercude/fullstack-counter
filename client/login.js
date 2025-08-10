document.addEventListener('DOMContentLoaded', function() {
    const signinForm = document.getElementById('signinForm');
    
    signinForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                window.location.href = 'counter.html';
            } else {
                const errorData = await response.json();
                console.log('Sign in failed:', errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
            console.log('An error occurred during sign in');
        }
    });
});