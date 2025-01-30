// Global state
let menuData = null;
let orderQuantities = {};  // Single order quantities object

// Fetch and initialize menu data
async function initializeApp() {
    try {
        const response = await fetch('data/menu.json');
        menuData = await response.json();
        renderMenu();
        attachEventListeners();
    } catch (error) {
        console.error('Failed to initialize app:', error);
        document.body.innerHTML = '<div class="error">Failed to load menu data. Please refresh the page.</div>';
    }
}

// Calculate category total
function calculateCategoryTotal(categoryItems) {
    return Object.entries(orderQuantities)
        .reduce((total, [itemId, qty]) => {
            const item = categoryItems.find(item => item.id === itemId);
            return total + (item ? item.scrip * qty : 0);
        }, 0);
}

// Render the menu structure
function renderMenu() {
    const container = document.getElementById('categories');
    container.innerHTML = menuData.categories.map(category => `
        <div class="category">
            <div class="category-header" data-category="${category.name}">
                <div class="left">
                    <span class="icon">${category.icon}</span>
                    ${category.name}
                </div>
                <div class="total" id="total-${category.name}">0 scrip</div>
            </div>
            <div id="${category.name}" class="items">
                ${category.items.map(item => `
                    <div class="item-row">
                        <div class="item-info">
                            <span class="item-name">${item.name}</span>
                            <span class="scrip-amount">${item.scrip} scrip</span>
                        </div>
                        <div class="quantity-control">
                            <button class="quantity-btn minus" onclick="adjustQuantity('${item.id}', -1)">−</button>
                            <input type="number" 
                                class="quantity-input" 
                                data-item-id="${item.id}"
                                data-category="${category.name}"
                                min="0" 
                                value="0" 
                                onchange="updateQuantity('${item.id}', this.value)"
                                inputmode="numeric"
                                pattern="[0-9]*">
                            <button class="quantity-btn plus" onclick="adjustQuantity('${item.id}', 1)">+</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    // Add click handlers for category headers
    document.querySelectorAll('.category-header').forEach(header => {
        header.addEventListener('click', () => {
            const categoryId = header.dataset.category;
            toggleCategory(categoryId, header);
        });
    });
}

// Toggle category visibility
function toggleCategory(categoryId, header) {
    const element = document.getElementById(categoryId);
    
    // Toggle the collapsed state
    element.classList.toggle('hidden');
    header.classList.toggle('collapsed');
    
    // Always show the current total, regardless of collapsed state
    const categoryItems = menuData.categories.find(cat => cat.name === categoryId).items;
    const categoryTotal = calculateCategoryTotal(categoryItems);
    const total = document.getElementById(`total-${categoryId}`);
    total.textContent = `${categoryTotal} scrip`;
}

// Adjust quantity with buttons
function adjustQuantity(itemId, delta) {
    const input = document.querySelector(`input[data-item-id="${itemId}"]`);
    const newValue = Math.max(0, parseInt(input.value || 0) + delta);
    input.value = newValue;
    updateQuantity(itemId, newValue);
}

// Toggle summary visibility
function toggleSummary() {
    const content = document.getElementById('summary-content');
    const icon = document.querySelector('.toggle-icon');
    content.classList.toggle('hidden');
    icon.classList.toggle('collapsed');
}

// Update summary content
function updateSummary() {
    const summaryContent = document.getElementById('summary-content');
    const items = Object.entries(orderQuantities)
        .filter(([_, qty]) => qty > 0)
        .map(([itemId, qty]) => {
            const item = findItem(itemId);
            return { name: item.name, quantity: qty, scrip: item.scrip };
        });

    if (items.length === 0) {
        summaryContent.innerHTML = '<div class="empty-message">No items added yet</div>';
        return;
    }

    summaryContent.innerHTML = items
        .map(item => `
            <div class="summary-item">
                <span class="summary-item-name">${item.name}</span>
                <span class="summary-item-quantity">${item.quantity}× (${item.quantity * item.scrip} scrip)</span>
            </div>
        `)
        .join('');
}

// Update quantity and recalculate totals
function updateQuantity(itemId, quantity) {
    const numQuantity = parseInt(quantity) || 0;
    orderQuantities[itemId] = Math.max(0, numQuantity); // Ensure non-negative
    
    // Update input value to ensure valid number
    const input = document.querySelector(`input[data-item-id="${itemId}"]`);
    input.value = orderQuantities[itemId];
    
    // Get category for this item
    const categoryName = input.dataset.category;
    const category = menuData.categories.find(cat => cat.name === categoryName);
    
    // Update category total
    if (category) {
        const categoryTotal = calculateCategoryTotal(category.items);
        const totalElement = document.getElementById(`total-${categoryName}`);
        if (totalElement) {
            totalElement.textContent = `${categoryTotal} scrip`;
        }
    }
    
    // Calculate grand total
    let totalScrip = 0;
    Object.entries(orderQuantities).forEach(([itemId, qty]) => {
        const item = findItem(itemId);
        if (item) {
            totalScrip += item.scrip * qty;
        }
    });
    
    // Round up to nearest sheet
    const sheetsNeeded = Math.ceil(totalScrip / menuData.scripInfo.scripPerSheet);
    const totalCost = (sheetsNeeded * menuData.scripInfo.scripSheetCost).toFixed(2);
    
    // Update displays
    document.getElementById('total-scrip').textContent = totalScrip;
    document.getElementById('total-cost').textContent = totalCost;
    
    updateSummary();
}

// Helper function to find item by ID
function findItem(itemId) {
    for (const category of menuData.categories) {
        const item = category.items.find(item => item.id === itemId);
        if (item) return item;
    }
    return null;
}

// Attach event listeners
function attachEventListeners() {
    // Add any additional event listeners here
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
}); 