document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch("http://localhost:3000/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username, password })
                });
                const result = await response.json();
                if (result.success) {
                    chrome.storage.local.set({ token: result.token }, () => {
                        window.location.href = "index.html";
                    });
                } else {
                    document.getElementById("message").innerText = result.message;
                }
            } catch (error) {
                document.getElementById("message").innerText = "Error logging in. Please try again.";
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch("http://localhost:3000/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username, password })
                });
                const result = await response.json();
                if (result.success) {
                    window.location.href = "login.html";
                } else {
                    document.getElementById("message").innerText = result.message;
                }
            } catch (error) {
                document.getElementById("message").innerText = "Error signing up. Please try again.";
            }
        });
    }
});
