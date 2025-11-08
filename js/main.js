// Global state
let menuData = null;
let orderQuantities = {};  // Single order quantities object

// LocalStorage key
const STORAGE_KEY = 'scripCalculatorOrder';

// Load order from localStorage
function loadOrderFromStorage() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            orderQuantities = JSON.parse(saved);
            console.log('Order restored from localStorage');
        }
    } catch (error) {
        console.error('Failed to load order from storage:', error);
    }
}

// Save order to localStorage
function saveOrderToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orderQuantities));
    } catch (error) {
        console.error('Failed to save order to storage:', error);
    }
}

// Fetch with retry logic
async function fetchWithRetry(url, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response;
        } catch (error) {
            if (i === retries - 1) throw error;
            console.warn(`Fetch attempt ${i + 1} failed, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
        }
    }
}

// Fetch and initialize menu data
async function initializeApp() {
    try {
        // Load saved order first
        loadOrderFromStorage();

        // Fetch menu data with retry
        const response = await fetchWithRetry('data/menu.json');
        menuData = await response.json();
        renderMenu();
        attachEventListeners();

        // Restore quantities to UI
        restoreQuantitiesToUI();
    } catch (error) {
        console.error('Failed to initialize app:', error);
        document.body.innerHTML = '<div class="error" role="alert">Failed to load menu data. Please check your connection and <a href="javascript:location.reload()">refresh the page</a>.</div>';
    }
}

// Restore saved quantities to UI
function restoreQuantitiesToUI() {
    Object.entries(orderQuantities).forEach(([itemId, qty]) => {
        if (qty > 0) {
            const input = document.querySelector(`input[data-item-id="${itemId}"]`);
            if (input) {
                input.value = qty;
            }
        }
    });

    // Recalculate all totals
    menuData.categories.forEach(category => {
        const categoryTotal = calculateCategoryTotal(category.items);
        const totalElement = document.getElementById(`total-${category.name}`);
        if (totalElement) {
            totalElement.textContent = `${categoryTotal} scrip`;
        }
    });

    // Update grand total
    updateGrandTotal();
    updateSummary();
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
            <button class="category-header" data-category="${category.name}" aria-expanded="false" aria-controls="${category.name}">
                <div class="left">
                    <span class="icon" aria-hidden="true">${category.icon}</span>
                    ${category.name}
                </div>
                <div class="total" id="total-${category.name}" aria-live="polite">0 scrip</div>
            </button>
            <div id="${category.name}" class="items hidden" role="region" aria-label="${category.name} items">
                ${category.items.map((item, index) => `
                    <div class="item-row">
                        <div class="item-info">
                            <span class="item-name">
                                ${item.name}
                                ${index === 0 && item.description ? `
                                    <br><span class="item-description">${item.description}</span>
                                ` : ''}
                            </span>
                            <span class="scrip-amount">${item.scrip} scrip</span>
                        </div>
                        <div class="quantity-control" role="group" aria-label="Quantity for ${item.name}">
                            <button class="quantity-btn minus" onclick="adjustQuantity('${item.id}', -1)" aria-label="Decrease quantity">−</button>
                            <input type="number"
                                class="quantity-input"
                                data-item-id="${item.id}"
                                data-category="${category.name}"
                                min="0"
                                value="0"
                                onchange="updateQuantity('${item.id}', this.value)"
                                inputmode="numeric"
                                pattern="[0-9]*"
                                aria-label="Quantity for ${item.name}">
                            <button class="quantity-btn plus" onclick="adjustQuantity('${item.id}', 1)" aria-label="Increase quantity">+</button>
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
    const description = document.getElementById(`desc-${categoryId}`);
    const isHidden = element.classList.contains('hidden');

    // Toggle the collapsed state
    element.classList.toggle('hidden');
    header.classList.toggle('collapsed');

    // Update aria-expanded
    header.setAttribute('aria-expanded', isHidden ? 'true' : 'false');

    // Toggle description if it exists
    if (description) {
        description.style.display = element.classList.contains('hidden') ? 'none' : 'block';
    }

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
    const header = document.querySelector('.summary-header');
    const isHidden = content.classList.contains('hidden');

    content.classList.toggle('hidden');
    icon.classList.toggle('collapsed');

    // Update aria-expanded
    header.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
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

// Calculate and update grand total
function updateGrandTotal() {
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
}

// Update quantity and recalculate totals
function updateQuantity(itemId, quantity) {
    const numQuantity = parseInt(quantity) || 0;
    orderQuantities[itemId] = Math.max(0, numQuantity); // Ensure non-negative

    // Remove from orderQuantities if zero to keep storage clean
    if (orderQuantities[itemId] === 0) {
        delete orderQuantities[itemId];
    }

    // Save to localStorage
    saveOrderToStorage();

    // Update input value to ensure valid number
    const input = document.querySelector(`input[data-item-id="${itemId}"]`);
    input.value = numQuantity;

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

    // Update grand total
    updateGrandTotal();
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