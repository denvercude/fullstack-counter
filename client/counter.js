async function loadUserCount() {
    try {
        console.log('Attempting to load user count...');
        const response = await fetch('http://localhost:5000/count', {
            method: 'GET',
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            currentCount = data.count;
            countDisplay.textContent = currentCount;
            console.log('Successfully loaded count:', data);
        } else {
            console.error('Failed to load count');
            if (response.status === 401) {
                console.log('Unauthorized - redirecting to login');
                window.location.href = 'login.html';
            }
        }
    } catch (error) {
        console.error('Error loading count:', error);
        window.location.href = 'login.html';
    }
}

function setupAiAssistance() {
    const aiAssistBtn = document.getElementById('aiAssistBtn');
    const aiResponseEl = document.getElementById('aiResponse');

    aiAssistBtn.addEventListener('click', async () => {
        try {
            aiResponseEl.textContent = "Thinking...";
            aiResponseEl.classList.add('loading');

            const currentNumber = parseInt(document.getElementById('countDisplay').textContent, 10);

            const response = await fetch('http://localhost:5000/ai-assistance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ currentNumber })
            });

            if (response.ok) {
                const data = await response.json();
                aiResponseEl.textContent = data.aiResponse || "No AI response received.";
            } else {
                aiResponseEl.textContent = "Error: Failed to get AI assistance.";
            }
        } catch (error) {
            aiResponseEl.textContent = "Error contacting AI service.";
            console.error(error);
        } finally {
            aiResponseEl.classList.remove('loading');
        }
    });
}


function start() {
    loadUserCount();
    
    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById('usernameDisplay').textContent = username;
    }

    setupAiAssistance();
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
        window.location.href = 'login.html';
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
            window.location.href = 'index.html';
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