// app.js
import { db, auth } from './firebase-config.js';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-firestore.js";
import { createProjectCard } from './components/projectcard.js';
import { showLoginPopup } from './components/login.js';

const projectsCollection = collection(db, 'projects');
let currentUser = null;

const initialProject = {
    title: 'JavaScript Project',
    thumbnail: 'https://via.placeholder.com/150',
    description: 'A basic JavaScript project',
    category: 'javascript'
};

async function initializeProjects() {
    const snapshot = await getDocs(projectsCollection);
    if (snapshot.empty) {
        await addDoc(projectsCollection, initialProject);
        getProjects();
    } else {
        getProjects();
    }
}

async function getProjects() {
    const snapshot = await getDocs(projectsCollection);
    const projectList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    displayProjects(projectList);
}

async function addProject(project) {
    await addDoc(projectsCollection, project);
    getProjects();
}

async function updateProject(id, updatedProject) {
    const projectDoc = doc(db, 'projects', id);
    await updateDoc(projectDoc, updatedProject);
    getProjects();
}

async function deleteProject(id) {
    const projectDoc = doc(db, 'projects', id);
    await deleteDoc(projectDoc);
    getProjects();
}

function displayProjects(projects) {
    const projectsSection = document.getElementById('projects-section');
    projectsSection.innerHTML = '';
    projects.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsSection.appendChild(projectCard);
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const projectId = e.target.getAttribute('data-id');
            const project = projects.find(p => p.id === projectId);
            showProjectPopup('Edit Project', project);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const projectId = e.target.getAttribute('data-id');
            deleteProject(projectId);
        });
    });
}

function showProjectPopup(title, project = null) {
    const projectPopup = document.createElement('div');
    projectPopup.classList.add('project-popup');
    projectPopup.innerHTML = `
        <div class="project-popup-content">
            <h2>${title}</h2>
            <form id="project-form">
                <input type="text" id="project-title" placeholder="Title" value="${project ? project.title : ''}" required>
                <input type="text" id="project-thumbnail" placeholder="Thumbnail URL" value="${project ? project.thumbnail : ''}" required>
                <textarea id="project-description" placeholder="Description" required>${project ? project.description : ''}</textarea>
                <select id="project-category" required>
                    <option value="" disabled ${!project ? 'selected' : ''}>Select category</option>
                    <option value="html" ${project && project.category === 'html' ? 'selected' : ''}>HTML</option>
                    <option value="css" ${project && project.category === 'css' ? 'selected' : ''}>CSS</option>
                    <option value="javascript" ${project && project.category === 'javascript' ? 'selected' : ''}>JavaScript</option>
                </select>
                <button type="submit">${project ? 'Update' : 'Add'}</button>
                <button type="button" class="close-popup">Cancel</button>
            </form>
        </div>
    `;
    document.body.appendChild(projectPopup);

    document.getElementById('project-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const newProject = {
            title: document.getElementById('project-title').value,
            thumbnail: document.getElementById('project-thumbnail').value,
            description: document.getElementById('project-description').value,
            category: document.getElementById('project-category').value
        };

        if (project) {
            updateProject(project.id, newProject);
        } else {
            addProject(newProject);
        }
        projectPopup.remove();
    });

    document.querySelector('.close-popup').addEventListener('click', () => {
        projectPopup.remove();
    });
}

document.getElementById('add-project-btn').addEventListener('click', () => {
    if (currentUser) {
        showProjectPopup('Add Project');
    } else {
        alert('Please log in to add a project.');
    }
});

document.getElementById('login-btn').addEventListener('click', () => {
    showLoginPopup();
});

document.getElementById('search-bar').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProjects = projects.filter(project => project.title.toLowerCase().includes(searchTerm));
    displayProjects(filteredProjects);
});

document.getElementById('category-filter').addEventListener('change', (e) => {
    const selectedCategory = e.target.value;
    const filteredProjects = selectedCategory ? projects.filter(project => project.category === selectedCategory) : projects;
    displayProjects(filteredProjects);
});

// Monitor auth state
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        document.getElementById('add-project-btn').style.display = 'block';
    } else {
        currentUser = null;
        document.getElementById('add-project-btn').style.display = 'none';
    }
});

// Initial load
document.addEventListener('DOMContentLoaded', initializeProjects);
