document.getElementById("registerForm").addEventListener("submit", function (e) {

    e.preventDefault();

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

   const user = {
    fullName: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: password,
    phone: "",
    role: "USER"
};

    fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(data => {
        alert("Registration Successful!");
        window.location.href = "index.html";
    })
    .catch(error => {
        console.error(error);
        alert("Registration Failed!");
    });

});