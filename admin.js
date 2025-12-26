/**
 * BSPP Admin Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    // Login Page Logic
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Dashboard Logic
    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
        renderAdminProducts();
        addProductForm.addEventListener('submit', handleAddProduct);
    }
});

function checkAuth() {
    const isDashboard = window.location.pathname.includes('dashboard.html');
    const isLogin = window.location.pathname.includes('login.html');
    const auth = sessionStorage.getItem(STORAGE_KEY_AUTH);

    if (isDashboard && !auth) {
        window.location.href = 'login.html';
    }
    
    if (isLogin && auth) {
        window.location.href = 'dashboard.html';
    }
}

function handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-msg');

    if (user === 'admin' && pass === 'bspp123') {
        sessionStorage.setItem(STORAGE_KEY_AUTH, 'true');
        window.location.href = 'dashboard.html';
    } else {
        errorMsg.classList.remove('hidden');
    }
}

function logout() {
    sessionStorage.removeItem(STORAGE_KEY_AUTH);
    window.location.href = 'login.html';
}

function renderAdminProducts() {
    const list = document.getElementById('admin-products-list');
    if (!list) return;

    const storedData = localStorage.getItem(STORAGE_KEY_DB);
    const products = storedData ? JSON.parse(storedData) : [];

    list.innerHTML = products.map(p => `
        <tr class="hover:bg-white/5 transition border-b border-white/5 last:border-b-0">
            <td class="p-4 flex items-center gap-3">
                <div class="w-10 h-10 bg-bspp-navy rounded-lg flex items-center justify-center text-gray-300 ring-1 ring-white/10">
                    <i data-lucide="${p.icon}" class="w-5 h-5"></i>
                </div>
                <div>
                    <div class="font-bold text-white text-sm">${p.name}</div>
                    ${p.isPopular ? '<span class="text-[10px] uppercase font-bold tracking-wider bg-yellow-900/50 text-yellow-200 border border-yellow-700/50 px-2 py-0.5 rounded-sm">Populaire</span>' : ''}
                </div>
            </td>
            <td class="p-4 text-sm text-gray-400 font-medium">${p.category}</td>
            <td class="p-4 font-bold text-white text-sm">${p.price} €</td>
            <td class="p-4 text-right">
                <button onclick="deleteProduct(${p.id})" class="text-gray-400 hover:text-red-500 p-2 hover:bg-red-900/20 rounded transition" title="Supprimer">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    if (products.length === 0) {
        list.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-slate-400 text-sm italic">Aucun produit dans l\'inventaire.</td></tr>';
    }

    lucide.createIcons();
}

function handleAddProduct(e) {
    e.preventDefault();
    
    const name = document.getElementById('p-name').value;
    const price = parseFloat(document.getElementById('p-price').value);
    const category = document.getElementById('p-category').value;
    const icon = document.getElementById('p-icon').value;
    const desc = document.getElementById('p-desc').value;
    const isPopular = document.getElementById('p-popular').checked;

    const newProduct = {
        id: Date.now(),
        name,
        price,
        category,
        icon,
        description: desc,
        isPopular
    };

    const storedData = localStorage.getItem(STORAGE_KEY_DB);
    const products = storedData ? JSON.parse(storedData) : [];
    
    products.push(newProduct);
    localStorage.setItem(STORAGE_KEY_DB, JSON.stringify(products));
    
    document.getElementById('add-product-form').reset();
    renderAdminProducts();
    alert('Produit ajouté avec succès !');
}

function deleteProduct(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        const storedData = localStorage.getItem(STORAGE_KEY_DB);
        let products = storedData ? JSON.parse(storedData) : [];
        
        products = products.filter(p => p.id !== id);
        localStorage.setItem(STORAGE_KEY_DB, JSON.stringify(products));
        
        renderAdminProducts();
    }
}
