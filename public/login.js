 document.getElementById('login-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const errorMsg = document.getElementById('error-msg');
        const loginBtn = document.getElementById('login-btn');

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Show loading design
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
if (response.ok) {
    // SAVE THE USER ID AND NAME
    localStorage.setItem('hubUserId', data.user.id); 
    localStorage.setItem('hubUser', data.user.name);
    window.location.href = "dashboard.html";
}else {
                // Error
                errorMsg.style.display = 'block';
                errorMsg.innerText = data.message;
                loginBtn.innerHTML = 'Sign In';
            }
        } catch (error) {
            console.error('Error:', error);
            alert("Server error.");
            loginBtn.innerHTML = 'Sign In';
        }
    });