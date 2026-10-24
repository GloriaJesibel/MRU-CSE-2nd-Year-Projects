document.getElementById("loginForm").addEventListener("submit", function (e) {

    e.preventDefault();

    const user = {
        email: document.querySelector('input[type="email"]').value,
        password: document.getElementById("password").value
    };

    fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Invalid email or password");
        }
        return response.json();
    })
    .then(data => {

        // Save logged-in user details
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("userName", data.fullName);

        // Save user ID (if available from backend)
        if (data.id) {
            localStorage.setItem("userId", data.id);
        }

        alert("Login Successful!");

        window.location.href = "dashboard.html";
    })
    .catch(error => {
        alert(error.message);
        console.error("Login Error:", error);
    });

});