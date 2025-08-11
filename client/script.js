function handleLoginLinkClick(e) {
    e.preventDefault();

    const username = localStorage.getItem('username');
    if (username) {
        fetch('http://localhost:5000/count', { method: 'GET', credentials: 'include' })
            .then(response => {
                if (response.ok) {
                    console.log('User already logged in, redirecting to counter');
                    window.location.href = 'counter.html';
                } else if (response.status === 401) {
                    console.log('Session expired, clearing stored credentials');
                    localStorage.removeItem('username');
                    window.location.href = 'login.html';
                }
            })
            .catch(error => {
                console.error('Error checking authentication:', error);
                localStorage.removeItem('username');
                window.location.href = 'login.html';
            });
    } else {
        window.location.href = 'login.html';
    }
}

function start() {
    const loginLink = document.querySelector('a[href="./login.html"]');
    loginLink.addEventListener('click', handleLoginLinkClick);
}

window.addEventListener('load', start);