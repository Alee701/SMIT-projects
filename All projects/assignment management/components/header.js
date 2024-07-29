// components/header.js
const header = document.getElementById('header');

header.innerHTML = `
    <div class="navbar">
        <div class="logo">Your Logo</div>
        <nav>
            <a href="#home">Home</a>
            <a href="#projects">Projects</a>
            <a href="#about">About Me</a>
            <a href="#contact">Contact</a>
        </nav>
        <div class="menu-toggle"><i class="fas fa-bars"></i></div>
        <div class="menu">
            <button id="login-btn">Login</button>
            <div class="social-icons">
                <a href="#"><i class="fab fa-facebook"></i></a>
                <a href="#"><i class="fab fa-twitter"></i></a>
                <a href="#"><i class="fab fa-linkedin"></i></a>
            </div>
        </div>
    </div>
`;

document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.navbar').classList.toggle('active');
});

document.getElementById('login-btn').addEventListener('click', () => {
    import('./login.js').then(module => {
        module.showLoginPopup();
    });
});
