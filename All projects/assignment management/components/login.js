// components/login.js
import { auth } from '../firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-auth.js";

export function showLoginPopup() {
    const loginPopup = document.createElement('div');
    loginPopup.classList.add('login-popup');
    loginPopup.innerHTML = `
        <form id="login-form">
            <input type="email" id="email" placeholder="Email" required>
            <input type="password" id="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
    `;
    document.body.appendChild(loginPopup);

    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                alert("Logged in as " + user.email);
                loginPopup.remove();
            })
            .catch((error) => {
                alert("Error: " + error.message);
            });
    });
}
