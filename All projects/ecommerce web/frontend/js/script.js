document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search');
    const productsContainer = document.getElementById('products');
    const categoriesContainer = document.getElementById('categories');
    const loginBtn = document.getElementById('login-btn');
    const addProductBtn = document.getElementById('add-product-btn');

    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('login-form');
    const addProductModal = document.getElementById('add-product-modal');
    const addProductForm = document.getElementById('add-product-form');

    let currentUser = null;

    async function fetchProducts() {
        const response = await fetch('http://localhost:5000/api/products');
        const products = await response.json();
        displayProducts(products);
    }

    function displayProducts(products) {
        productsContainer.innerHTML = '';
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            productElement.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="category">${product.category}</p>
                <p class="price">$${product.price.toFixed(2)}</p>
                <div class="description">
                    <p>${product.description}</p>
                </div>
                <div class="admin-actions">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                    <button class="duplicate-btn">Duplicate</button>
                </div>
            `;
            productElement.querySelector('.edit-btn').addEventListener('click', () => openEditProductModal(product));
            productElement.querySelector('.delete-btn').addEventListener('click', () => deleteProduct(product._id));
            productElement.querySelector('.duplicate-btn').addEventListener('click', () => duplicateProduct(product));
            productsContainer.appendChild(productElement);
        });
    }

    async function fetchCategories() {
        const response = await fetch('http://localhost:5000/api/products');
        const products = await response.json();
        const categories = [...new Set(products.map(product => product.category))];
        displayCategories(categories);
    }

    function displayCategories(categories) {
        categoriesContainer.innerHTML = '';
        categories.forEach(category => {
            const categoryElement = document.createElement('li');
            categoryElement.textContent = category;
            categoryElement.addEventListener('click', () => filterByCategory(category));
            categoriesContainer.appendChild(categoryElement);
        });
    }

    function filterByCategory(category) {
        const products = document.querySelectorAll('.product');
        products.forEach(product => {
            if (product.querySelector('.category').textContent === category) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }

    async function deleteProduct(productId) {
        try {
            await fetch(`http://localhost:5000/api/products/${productId}`, {
                method: 'DELETE',
            });
            fetchProducts();
        } catch (err) {
            console.error('Failed to delete product', err);
        }
    }

    async function duplicateProduct(product) {
        try {
            const { name, description, price, category, imageUrl } = product;
            const newProduct = { name, description, price, category, imageUrl };
            await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProduct),
            });
            fetchProducts();
        } catch (err) {
            console.error('Failed to duplicate product', err);
        }
    }

    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.toLowerCase();
        const products = document.querySelectorAll('.product');
        products.forEach(product => {
            const productName = product.querySelector('h3').textContent.toLowerCase();
            if (productName.includes(query)) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    });

    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });

    addProductBtn.addEventListener('click', () => {
        if (currentUser && currentUser.isAdmin) {
            addProductModal.style.display = 'block';
        } else {
            alert('Only admin can add products');
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                currentUser = parseJwt(data.token);
                loginModal.style.display = 'none';
            } else {
                alert('Invalid username or password');
            }
        } catch (err) {
            console.error('Login failed', err);
        }
    });

    addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const price = document.getElementById('price').value;
        const category = document.getElementById('category').value;
        const imageUrl = document.getElementById('imageUrl').value;

        try {
            await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, description, price, category, imageUrl }),
            });

            addProductModal.style.display = 'none';
            fetchProducts();
        } catch (err) {
            console.error('Failed to add product', err);
        }
    });

    function parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    fetchProducts();
    fetchCategories();

    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.parentElement.parentElement.style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (event.target === addProductModal) {
            addProductModal.style.display = 'none';
        }
    });

    function openEditProductModal(product) {
        // Implementation for opening the edit product modal
        // Populate the form with the product data and handle form submission for updating the product
    }
});
