/**
 * BSPP Shop Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
});

function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    // Get data from LocalStorage
    const storedData = localStorage.getItem(STORAGE_KEY_DB);
    if (!storedData) {
        grid.innerHTML = '<div class="col-span-full text-center text-gray-500">Aucun produit disponible.</div>';
        return;
    }

    let products = [];
    try {
        products = JSON.parse(storedData);
    } catch (e) {
        console.error("Error parsing product data", e);
        grid.innerHTML = '<div class="col-span-full text-center text-red-500">Erreur de chargement des données.</div>';
        return;
    }

    if (products.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center text-gray-500">Aucun produit disponible.</div>';
        return;
    }

    grid.innerHTML = products.map(product => `
        <div class="bg-bspp-blue rounded-xl shadow-lg shadow-black/30 overflow-hidden hover:shadow-xl hover:shadow-black/50 transition duration-300 flex flex-col relative group border border-white/5">
            ${product.isPopular ? `
            <div class="absolute top-4 right-4 bg-yellow-500 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-sm z-10 flex items-center gap-1">
                <i data-lucide="star" class="w-3 h-3 fill-current"></i> Populaire
            </div>` : ''}
            
            <div class="h-48 bg-bspp-navy flex items-center justify-center p-6 relative overflow-hidden">
                <div class="absolute inset-0 bg-bspp-red opacity-0 group-hover:opacity-10 transition duration-500"></div>
                <i data-lucide="${product.icon}" class="w-24 h-24 text-gray-400 stroke-1 group-hover:scale-110 group-hover:text-bspp-red transition duration-500"></i>
            </div>
            
            <div class="p-6 flex-grow flex flex-col">
                <div class="text-xs font-bold text-bspp-red mb-1 uppercase tracking-wide">${product.category}</div>
                <h3 class="font-bold text-xl text-white mb-2">${product.name}</h3>
                <p class="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">${product.description}</p>
                
                <div class="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <span class="text-2xl font-bold text-white">${product.price} €</span>
                    <button onclick="addToCart()" class="bg-bspp-navy hover:bg-bspp-red text-white px-4 py-2 rounded-lg font-medium transition duration-300 flex items-center gap-2 transform active:scale-95 border border-white/10 hover:border-transparent">
                        <i data-lucide="shopping-cart" class="w-4 h-4"></i> Ajouter
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Re-initialize icons for new elements
    lucide.createIcons();
}
