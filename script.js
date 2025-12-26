// --- CONFIGURATION ---
const DB_KEY = 'gign_store_db';
const AUTH_KEY = 'gign_store_auth';

// Données par défaut (si la base est vide)
const defaultProducts = [
    {
        id: 1,
        name: 'Écusson PVC GIGN',
        price: 15.00,
        category: 'Écussons',
        imageIcon: 'shield',
        desc: 'Écusson officiel basse visibilité avec velcro.',
        popular: true
    },
    {
        id: 2,
        name: 'T-Shirt "Intervention"',
        price: 29.90,
        category: 'Vêtements',
        imageIcon: 'shirt',
        desc: 'Coton premium, coupe athlétique, logo dos.',
        popular: false
    },
    {
        id: 3,
        name: 'Mug Tactique',
        price: 12.50,
        category: 'Accessoires',
        imageIcon: 'coffee',
        desc: 'Noir mat, logo Gendarmerie gravé.',
        popular: false
    },
    {
        id: 4,
        name: 'Drapeau Français',
        price: 19.90,
        category: 'Accessoires',
        imageIcon: 'flag',
        desc: 'Format 90x150cm, qualité extérieure.',
        popular: false
    }
];

// --- SIMULATION BASE DE DONNÉES (LocalStorage) ---
const db = {
    // Initialiser la base de données
    init: () => {
        if (!localStorage.getItem(DB_KEY)) {
            console.log('Initialisation de la base de données...');
            localStorage.setItem(DB_KEY, JSON.stringify(defaultProducts));
        }
    },

    // Récupérer tous les produits
    getAll: () => {
        const data = localStorage.getItem(DB_KEY);
        return data ? JSON.parse(data) : [];
    },

    // Ajouter un produit
    add: (product) => {
        const products = db.getAll();
        // Générer un ID unique simple
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const newProduct = { ...product, id: newId };
        products.push(newProduct);
        localStorage.setItem(DB_KEY, JSON.stringify(products));
        return newProduct;
    },

    // Supprimer un produit
    delete: (id) => {
        let products = db.getAll();
        products = products.filter(p => p.id !== parseInt(id));
        localStorage.setItem(DB_KEY, JSON.stringify(products));
    },

    // --- AUTHENTIFICATION ---
    login: (username, password) => {
        // Simulation d'un utilisateur admin (A MODIFIER POUR PLUS DE SECURITE DANS UN VRAI PROJET)
        if (username === 'admin' && password === 'gign123') {
            sessionStorage.setItem(AUTH_KEY, 'true');
            return true;
        }
        return false;
    },

    logout: () => {
        sessionStorage.removeItem(AUTH_KEY);
        window.location.href = 'index.html';
    },

    isLogged: () => {
        return sessionStorage.getItem(AUTH_KEY) === 'true';
    }
};

// Initialiser la DB au chargement
db.init();


// --- UI LOGIC (Menu Mobile, etc.) ---
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');

    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }

    // Initialize Lucide icons if not already done by inline script
    if (window.lucide) {
        window.lucide.createIcons();
    }
    
    // Si on est sur la page boutique, charger les produits
    const productGrid = document.getElementById('product-grid');
    if (productGrid) {
        renderShop();
    }
    
    // Mettre à jour le badge du panier au chargement
    updateCartBadge();
});

// --- FONCTION D'AFFICHAGE BOUTIQUE ---
function renderShop() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    const products = db.getAll();
    grid.innerHTML = '';

    products.forEach(product => {
        const productHTML = `
            <div class="bg-gign-light rounded-lg overflow-hidden border border-white/5 group hover:border-military-gold/30 transition-all shadow-lg hover:shadow-military-gold/10 hover:-translate-y-1">
                <div class="h-64 bg-gray-800 flex items-center justify-center relative overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                    <i data-lucide="${product.imageIcon || 'package'}" class="w-24 h-24 text-gray-600 group-hover:scale-110 transition-transform duration-500 relative z-0"></i>
                    ${product.popular ? '<span class="absolute top-4 right-4 bg-military-gold text-gign-blue text-xs font-bold px-2 py-1 rounded shadow-md z-20">POPULAIRE</span>' : ''}
                </div>
                <div class="p-6">
                    <h3 class="text-lg font-bold text-white mb-2 group-hover:text-military-gold transition-colors">${product.name}</h3>
                    <p class="text-gray-400 text-sm mb-4 line-clamp-2">${product.desc}</p>
                    <div class="flex items-center justify-between mt-auto">
                        <span class="text-xl font-bold text-military-gold">${parseFloat(product.price).toFixed(2)} €</span>
                        <button class="p-3 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors text-white shadow-lg hover:shadow-blue-500/25 active:scale-95 transform" 
                                onclick="addToCart(${product.id}, '${product.name.replace(/'/g, "\\'")}')">
                            <i data-lucide="shopping-cart" class="w-5 h-5"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        grid.innerHTML += productHTML;
    });

    // Re-initialiser les icônes pour les nouveaux éléments
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// --- CART & NOTIFICATIONS ---

let cartCount = 0;

function addToCart(productId, productName) {
    // Incrémenter le compteur
    cartCount++;
    updateCartBadge();
    
    // Feedback visuel (Toast)
    showToast(`Produit ajouté : ${productName}`, 'success');
    
    // Feedback haptique (si mobile)
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

function updateCartBadge() {
    const badges = document.querySelectorAll('#cart-badge');
    badges.forEach(badge => {
        badge.innerText = cartCount;
        badge.classList.remove('hidden');
        // Animation "pop"
        badge.classList.remove('animate-bounce-short');
        void badge.offsetWidth; // Trigger reflow
        badge.classList.add('animate-bounce-short');
    });
}

function showToast(message, type = 'success') {
    // Créer le conteneur s'il n'existe pas
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-3 pointer-events-none';
        document.body.appendChild(container);
    }

    // Créer le toast
    const toast = document.createElement('div');
    toast.className = `
        flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl 
        transform transition-all duration-300 ease-out translate-x-full opacity-0
        pointer-events-auto border-l-4 backdrop-blur-md
        ${type === 'success' ? 'bg-gign-light/95 border-green-500 text-white' : 'bg-red-900/90 border-red-500 text-white'}
    `;
    
    const icon = type === 'success' ? 'check-circle' : 'alert-circle';
    
    toast.innerHTML = `
        <i data-lucide="${icon}" class="w-6 h-6 ${type === 'success' ? 'text-green-400' : 'text-red-400'}"></i>
        <div>
            <h4 class="font-bold text-sm">${type === 'success' ? 'Succès' : 'Erreur'}</h4>
            <p class="text-sm text-gray-300">${message}</p>
        </div>
    `;

    container.appendChild(toast);
    
    // Initialiser l'icône
    lucide.createIcons({
        root: toast,
        nameAttr: 'data-lucide',
        attrs: {
            class: `w-6 h-6 ${type === 'success' ? 'text-green-400' : 'text-red-400'}`
        }
    });

    // Animation d'entrée
    requestAnimationFrame(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
    });

    // Suppression automatique
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}
