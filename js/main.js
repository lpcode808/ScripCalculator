// Global state
let menuData = null;
let orderQuantities = {};  // Single order quantities object
let categoryById = {};
let itemById = {};

// ============================================
// THEME MANAGEMENT
// ============================================

/**
 * Initialize theme on page load
 * - Checks localStorage for saved preference
 * - Falls back to system preference
 * - Sets up listener for system preference changes
 */
function initializeTheme() {
    // Check localStorage first (user preference)
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        // Detect system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
    }

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set preference
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
}

/**
 * Set theme and persist to localStorage
 * @param {string} theme - 'light' or 'dark'
 */
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateToggleButton(theme);
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

/**
 * Update toggle button icon and ARIA label
 * @param {string} theme - Current theme
 */
function updateToggleButton(theme) {
    const button = document.getElementById('theme-toggle');
    if (!button) return;

    const icon = theme === 'light' ? '🌙' : '☀️';
    const label = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';

    button.innerHTML = icon;
    button.setAttribute('aria-label', label);
    button.setAttribute('title', label);
}

function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function buildIndexes() {
    categoryById = {};
    itemById = {};
    menuData.categories.forEach(category => {
        const categoryId = slugify(category.name);
        categoryById[categoryId] = category;
        category.items.forEach(item => {
            itemById[item.id] = item;
        });
    });
}

// Fetch and initialize menu data
async function initializeApp() {
    try {
        const response = await fetch('data/menu.json');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        menuData = await response.json();
        buildIndexes();
        renderMenu();
        attachEventListeners();
        updateTotals();
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
    container.innerHTML = menuData.categories.map(category => {
        const categoryId = slugify(category.name);
        return `
        <div class="category">
            <div class="category-header" data-category-id="${categoryId}">
                <div class="left">
                    <span class="icon">${category.icon}</span>
                    ${category.name}
                </div>
                <div class="total" id="total-${categoryId}">0 scrip</div>
            </div>
            <div id="${categoryId}" class="items hidden">
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
                        <div class="quantity-control">
                            <button class="quantity-btn minus" type="button" aria-label="Decrease ${item.name}" onclick="adjustQuantity('${item.id}', -1)">−</button>
                            <input type="number" 
                                class="quantity-input" 
                                data-item-id="${item.id}"
                                data-category-id="${categoryId}"
                                min="0" 
                                value="0" 
                                oninput="updateQuantity('${item.id}', this.value)"
                                inputmode="numeric"
                                pattern="[0-9]*"
                                aria-label="${item.name} quantity">
                            <button class="quantity-btn plus" type="button" aria-label="Increase ${item.name}" onclick="adjustQuantity('${item.id}', 1)">+</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    }).join('');

    // Add click handlers for category headers
    document.querySelectorAll('.category-header').forEach(header => {
        header.addEventListener('click', () => {
            const categoryId = header.dataset.categoryId;
            toggleCategory(categoryId, header);
        });
    });
}

function updateCategoryTotal(categoryId) {
    const category = categoryById[categoryId];
    if (!category) return;

    const categoryTotal = calculateCategoryTotal(category.items);
    const total = document.getElementById(`total-${categoryId}`);
    if (total) {
        total.textContent = `${categoryTotal} scrip`;
    }
}

function updateAllCategoryTotals() {
    Object.keys(categoryById).forEach(categoryId => {
        updateCategoryTotal(categoryId);
    });
}

// Toggle category visibility
function toggleCategory(categoryId, header) {
    const element = document.getElementById(categoryId);
    if (!element) return;

    // Toggle the collapsed state
    element.classList.toggle('hidden');
    header.classList.toggle('collapsed');

    // Always show the current total, regardless of collapsed state
    updateCategoryTotal(categoryId);
}

// Adjust quantity with buttons
function adjustQuantity(itemId, delta) {
    const input = document.querySelector(`input[data-item-id="${itemId}"]`);
    if (!input) return;

    const newValue = Math.max(0, parseInt(input.value || 0, 10) + delta);
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

function clearAll(event) {
    if (event) {
        event.stopPropagation();
    }
    orderQuantities = {};

    document.querySelectorAll('.quantity-input').forEach(input => {
        input.value = 0;
    });

    updateAllCategoryTotals();
    updateTotals();
}

// Copy order summary to clipboard
async function copySummary(event) {
    if (event) {
        event.stopPropagation();
    }

    // Get all items with quantities
    const items = Object.entries(orderQuantities)
        .filter(([_, qty]) => qty > 0)
        .map(([itemId, qty]) => {
            const item = findItem(itemId);
            return item ? { name: item.name, quantity: qty, scrip: item.scrip } : null;
        })
        .filter(Boolean);

    if (items.length === 0) {
        return; // Nothing to copy
    }

    // Get totals
    const totalScrip = parseInt(document.getElementById('total-scrip').textContent, 10);
    const totalCost = document.getElementById('total-cost').textContent;

    // Format summary
    let summary = 'Punahou Carnival 2026 - Order Summary\n\n';
    items.forEach(item => {
        summary += `${item.name}\n`;
        summary += `  ${item.quantity}× @ ${item.scrip} scrip = ${item.quantity * item.scrip} scrip\n\n`;
    });
    summary += `────────────────────\n`;
    summary += `Total: ${totalScrip} scrip ($${totalCost})\n`;
    summary += `(rounds up to nearest $10)\n`;

    // Copy to clipboard
    try {
        await navigator.clipboard.writeText(summary);

        // Visual feedback - change icon briefly
        const button = event.target.closest('.copy-btn');
        if (button) {
            const originalContent = button.innerHTML;
            button.innerHTML = '✅';
            button.setAttribute('title', 'Copied!');

            setTimeout(() => {
                button.innerHTML = originalContent;
                button.setAttribute('title', 'Copy to clipboard');
            }, 2000);
        }
    } catch (err) {
        console.error('Failed to copy:', err);
        // Fallback - could show error message
        const button = event.target.closest('.copy-btn');
        if (button) {
            const originalContent = button.innerHTML;
            button.innerHTML = '❌';
            setTimeout(() => {
                button.innerHTML = originalContent;
            }, 2000);
        }
    }
}

// Update summary content
function updateSummary() {
    const summaryContent = document.getElementById('summary-content');
    const items = Object.entries(orderQuantities)
        .filter(([_, qty]) => qty > 0)
        .map(([itemId, qty]) => {
            const item = findItem(itemId);
            return item ? { name: item.name, quantity: qty, scrip: item.scrip } : null;
        })
        .filter(Boolean);

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

function updateTotals() {
    let totalScrip = 0;
    Object.entries(orderQuantities).forEach(([itemId, qty]) => {
        const item = findItem(itemId);
        if (item) {
            totalScrip += item.scrip * qty;
        }
    });

    const sheetsNeeded = totalScrip === 0
        ? 0
        : Math.ceil(totalScrip / menuData.scripInfo.scripPerSheet);
    const totalCost = (sheetsNeeded * menuData.scripInfo.scripSheetCost).toFixed(2);

    document.getElementById('total-scrip').textContent = totalScrip;
    document.getElementById('total-cost').textContent = totalCost;

    updateSummary();
}

// Update quantity and recalculate totals
function updateQuantity(itemId, quantity) {
    const numQuantity = Math.max(0, parseInt(quantity, 10) || 0);
    if (numQuantity === 0) {
        delete orderQuantities[itemId];
    } else {
        orderQuantities[itemId] = numQuantity;
    }

    // Update input value to ensure valid number
    const input = document.querySelector(`input[data-item-id="${itemId}"]`);
    if (input) {
        input.value = numQuantity;
    }

    // Get category for this item
    const categoryId = input ? input.dataset.categoryId : null;

    // Update category total
    if (categoryId) {
        updateCategoryTotal(categoryId);
    }

    updateTotals();
}

// Helper function to find item by ID
function findItem(itemId) {
    return itemById[itemId] || null;
}

// Attach event listeners
function attachEventListeners() {
    // Add any additional event listeners here
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme before app loads (prevents flash)
    initializeTheme();

    // Initialize main app
    initializeApp();
});
