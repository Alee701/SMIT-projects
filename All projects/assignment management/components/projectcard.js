// components/projectCard.js
export function createProjectCard(project) {
    const card = document.createElement('div');
    card.classList.add('project-card');
    card.innerHTML = `
        <h3>${project.title}</h3>
        <img src="${project.thumbnail}" alt="${project.title}" />
        <p>${project.description}</p>
        <div class="card-buttons">
            <button class="edit-btn" data-id="${project.id}">Edit</button>
            <button class="delete-btn" data-id="${project.id}">Delete</button>
        </div>
    `;
    return card;
}
