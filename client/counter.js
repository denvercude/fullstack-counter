async function loadUserCount() {
    try {
        console.log('Attempting to load user count...');
        const response = await fetch('http://localhost:5000/count', {
            method: 'GET',
            credentials: 'include'
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (response.ok) {
            const data = await response.json();
            currentCount = data.count;
            countDisplay.textContent = currentCount;
            console.log('Successfully loaded count:', data);
        } else {
            console.error('Failed to load count');
            if (response.status === 401) {
                console.log('Unauthorized - redirecting to login');
            }
        }
    } catch (error) {
        console.error('Error loading count:', error);
    }
}

function start() {
    console.log("function started");

    console.log('All cookies:', document.cookie);
    console.log('Session cookie:', document.cookie.includes('connect.sid'));
    
    loadUserCount();
    
    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById('usernameDisplay').textContent = username;
    }
}

incrementBtn.addEventListener('click', async function() {
    try {
        const response = await fetch('http://localhost:5000/increment', {
            method: 'POST',
            credentials: 'include'
        });

        console.log(response);
        
        if (response.ok) {
            const data = await response.json();
            currentCount = data.count;
            countDisplay.textContent = currentCount;
        } else {
            console.error('Failed to increment count');
            if (response.status === 401) {
                window.location.href = 'login.html';
            }
        }
    } catch (error) {
        console.error('Error incrementing count:', error);
    }
});

logoutBtn.addEventListener('click', async function() {
    try {
        const response = await fetch('http://localhost:5000/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
        
        if (response.ok) {
            localStorage.removeItem('username');
            window.location.href = 'login.html';
        } else {
            console.error('Failed to logout');
        }
    } catch (error) {
        console.error('Error during logout:', error);
        localStorage.removeItem('username');
        window.location.href = 'login.html';
    }
});

window.addEventListener('load', start);