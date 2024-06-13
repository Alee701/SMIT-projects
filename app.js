document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const sliderNav = document.querySelector('.slider-nav');
    const closePopup = document.querySelector('#close-popup');
    const closeEditPopup = document.querySelector('#close-edit-popup');
    const closeLoginPopup = document.querySelector('#close-login-popup');
    const closeLoginSuccessPopup = document.querySelector('#close-login-success-popup');
    const addProjectPopup = document.querySelector('#add-project-popup');
    const editProjectPopup = document.querySelector('#edit-project-popup');
    const loginPopup = document.querySelector('#login-popup');
    const loginSuccessPopup = document.querySelector('#login-success-popup');
    const addProjectForm = document.querySelector('#add-project-form');
    const editProjectForm = document.querySelector('#edit-project-form');
    const loginForm = document.querySelector('#login-form');
    const projectsContainer = document.querySelector('#projects');
    const searchBar = document.querySelector('#search-bar');
    const categoryButtons = document.querySelectorAll('.category');
    const backToTopButton = document.querySelector('#back-to-top');
    const addProjectButton = document.querySelector('#add-project-button');
    const loginButton = document.querySelector('#login-button');

    let isAdmin = false;
    let projects = [];

    // Load projects from local storage
    if (localStorage.getItem('projects')) {
        projects = JSON.parse(localStorage.getItem('projects'));
        renderProjects();
    }

    // Initialize sortable
    new Sortable(projectsContainer, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        onEnd: (event) => {
            // Update projects array based on new order
            const movedProject = projects.splice(event.oldIndex, 1)[0];
            projects.splice(event.newIndex, 0, movedProject);
            localStorage.setItem('projects', JSON.stringify(projects));
            renderProjects();
        }
    });

    // Toggle mobile navigation
    hamburgerMenu.addEventListener('click', () => {
        sliderNav.classList.toggle('open');
    });

    // Open and close add project popup
    addProjectButton.addEventListener('click', () => {
        if (isAdmin) {
            addProjectPopup.style.display = 'block';
        } else {
            alert('Please log in to add a project.');
        }
    });

    closePopup.addEventListener('click', () => {
        addProjectPopup.style.display = 'none';
    });

    // Open and close edit project popup
    projectsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-button')) {
            if (isAdmin) {
                const projectBox = e.target.closest('.project-box');
                const title = projectBox.querySelector('h3').innerText;
                const description = projectBox.querySelector('p').innerText;
                const projectUrl = projectBox.querySelector('a').href;
                const githubUrl = projectBox.querySelector('.github').href;
                const category = projectBox.getAttribute('data-category');

                document.querySelector('#edit-project-title').value = title;
                document.querySelector('#edit-project-description').value = description;
                document.querySelector('#edit-project-url').value = projectUrl;
                document.querySelector('#edit-github-url').value = githubUrl;
                document.querySelector('#edit-project-category').value = category;

                editProjectPopup.style.display = 'block';

                editProjectForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const editedProject = {
                        title: document.querySelector('#edit-project-title').value,
                        description: document.querySelector('#edit-project-description').value,
                        projectUrl: document.querySelector('#edit-project-url').value,
                        githubUrl: document.querySelector('#edit-github-url').value,
                        category: document.querySelector('#edit-project-category').value
                    };

                    const index = projects.findIndex(project => project.title === title);
                    projects[index] = editedProject;
                    localStorage.setItem('projects', JSON.stringify(projects));
                    renderProjects();
                    editProjectPopup.style.display = 'none';
                }, { once: true });
            } else {
                alert('You are not authorized to edit this project.');
            }
        } else if (e.target.classList.contains('delete-button')) {
            if (isAdmin) {
                const projectBox = e.target.closest('.project-box');
                const title = projectBox.querySelector('h3').innerText;
                projects = projects.filter(project => project.title !== title);
                localStorage.setItem('projects', JSON.stringify(projects));
                renderProjects();
            } else {
                alert('You are not authorized to delete this project.');
            }
        }
    });

    closeEditPopup.addEventListener('click', () => {
        editProjectPopup.style.display = 'none';
    });

    // Open and close login popup
    loginButton.addEventListener('click', () => {
        if (isAdmin) {
            isAdmin = false;
            loginButton.textContent = 'Login';
            alert('Logged out successfully.');
        } else {
            loginPopup.style.display = 'block';
        }
    });

    closeLoginPopup.addEventListener('click', () => {
        loginPopup.style.display = 'none';
    });

    closeLoginSuccessPopup.addEventListener('click', () => {
        loginSuccessPopup.style.display = 'none';
    });

    // Add project functionality
    addProjectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.querySelector('#project-title').value;
        const description = document.querySelector('#project-description').value;
        const projectUrl = document.querySelector('#project-url').value;
        const githubUrl = document.querySelector('#github-url').value;
        const category = document.querySelector('#project-category').value;

        // Check if project with same title already exists
        if (!isProjectExist(title)) {
            const project = {
                title,
                description,
                projectUrl,
                githubUrl,
                category
            };
            projects.push(project);
            localStorage.setItem('projects', JSON.stringify(projects));
            renderProjects();
            addProjectPopup.style.display = 'none';
        } else {
            alert('Project with the same title already exists. Please choose a different title.');
        }
    });

    // Login functionality
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.querySelector('#username').value;
        const password = document.querySelector('#password').value;

        if (username === 'Admin' && password === 'Ali786786') {
            isAdmin = true;
            alert('Login successful.');
            loginButton.textContent = 'Logout';
            loginPopup.style.display = 'none';
            loginSuccessPopup.style.display = 'block';

            // Show edit and delete buttons for existing projects
            renderProjects();
        } else {
            alert('Incorrect username or password.');
        }
    });

    // Filter projects by category
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            document.querySelectorAll('.project-box').forEach(box => {
                if (category === 'all' || box.getAttribute('data-category') === category) {
                    box.style.display = 'block';
                } else {
                    box.style.display = 'none';
                }
            });
        });
    });

    // Search functionality
    searchBar.addEventListener('input', () => {
        const query = searchBar.value.toLowerCase();
        document.querySelectorAll('.project-box').forEach(box => {
            const title = box.querySelector('h3').innerText.toLowerCase();
            const description = box.querySelector('p').innerText.toLowerCase();
            if (title.includes(query) || description.includes(query)) {
                box.style.display = 'block';
            } else {
                box.style.display = 'none';
            }
        });
    });

    // Show back to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Function to render projects
    function renderProjects() {
        projectsContainer.innerHTML = '';
        projects.forEach(project => {
            const projectBox = document.createElement('div');
            projectBox.className = 'project-box';
            projectBox.setAttribute('data-category', project.category);
            projectBox.innerHTML = `
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-buttons">
                    <a href="${project.projectUrl}" target="_blank">View Project <i class="fas fa-external-link-alt"></i></a>
                    <a href="${project.githubUrl}" target="_blank" class="github">GitHub <i class="fab fa-github"></i></a>
                    ${isAdmin ? '<button class="edit-button">Edit <i class="fas fa-edit"></i></button><button class="delete-button">Delete <i class="fas fa-trash-alt"></i></button>' : ''}
                </div>
            `;
            projectsContainer.appendChild(projectBox);
        });
    }

    // Function to check if project with same title exists
    function isProjectExist(title) {
        return projects.some(project => project.title.toLowerCase() === title.toLowerCase());
    }
});
