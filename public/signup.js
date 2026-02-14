 document.getElementById('signup-form').addEventListener('submit', async function(e) {
        e.preventDefault();

        const fullname = document.getElementById('fullname').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullname, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Success: Save name locally for the dashboard greeting
                localStorage.setItem('hubUser', fullname);
                window.location.href = "dashboard.html";
            } else {
                alert(data.message); // Show error (e.g., "Email exists")
            }
        } catch (error) {
            console.error('Error:', error);
            alert("Something went wrong connecting to the server.");
        }
    });