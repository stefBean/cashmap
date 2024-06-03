function login(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert("Username and password cannot be empty.");
        return;
    }

    const loginData = {
        name: username,
        password: password
    };

    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.status == 200 || xhr.status === 204) {
            location.href = 'homepage.html';
        } else {
            alert("Login failed. Status code was " + xhr.status);
        }
    };

    xhr.open("POST", "/users/login");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(loginData));
}

function registerNewUser(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert("Username and password cannot be empty.");
        return;
    }

    const userData = {
        name: username,
        password: password
    };

    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.status == 201) {
            alert("User registered successfully.");
        } else {
            alert("Registration failed. " + xhr.response);
        }
    };

    xhr.open("POST", "/users");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(userData));
}
