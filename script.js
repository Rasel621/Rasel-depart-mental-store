// Initialize cash values
let mainCash = parseFloat(localStorage.getItem('mainCash')) || 0;
let middleCash = parseFloat(localStorage.getItem('middleCash')) || 0;
let boxCash = parseFloat(localStorage.getItem('boxCash')) || 0;

// Track products and their stock
const products = JSON.parse(localStorage.getItem('products')) || {}; // No default products

// Function to update cash values in the DOM
function updateCashDisplay() {
    document.getElementById('mainCash').textContent = `Main Cash: $${mainCash.toFixed(2)}`;
    document.getElementById('middleCash').textContent = `Middle Cash: $${middleCash.toFixed(2)}`;
    document.getElementById('boxCash').textContent = `Box Cash: $${boxCash.toFixed(2)}`;
}

// Function to render products to the DOM
function renderProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; // Clear existing products

    for (const [name, stock] of Object.entries(products)) {
        // Create product item
        const productItem = document.createElement('div');
        productItem.className = 'product-item';

        // Add product name and stock
        const productName = document.createElement('p');
        productName.textContent = `${name} (Stock: ${stock})`;
        productItem.appendChild(productName);

        // Create sell button
        const sellButton = document.createElement('button');
        sellButton.className = 'sell-button';
        sellButton.textContent = 'Sell';
        sellButton.onclick = () => {
            const quantity = prompt(`Enter quantity to sell for ${name}:`);
            if (quantity && !isNaN(quantity) && parseInt(quantity) > 0) {
                // Deduct stock
                const soldQuantity = parseInt(quantity);
                products[name] = Math.max(0, products[name] - soldQuantity);
                productName.textContent = `${name} (Stock: ${products[name]})`;
                localStorage.setItem('products', JSON.stringify(products)); // Save to localStorage
                
                // Prompt for cash box selection
                const cashBoxOption = prompt('Select cash box: 1 for Main, 2 for Middle, 3 for Box:');
                const saleAmount = parseFloat(prompt('Enter the sale amount:'));
                if (!isNaN(saleAmount) && saleAmount > 0) {
                    switch (cashBoxOption) {
                        case '1':
                            mainCash += saleAmount;
                            localStorage.setItem('mainCash', mainCash);
                            break;
                        case '2':
                            middleCash += saleAmount;
                            localStorage.setItem('middleCash', middleCash);
                            break;
                        case '3':
                            boxCash += saleAmount;
                            localStorage.setItem('boxCash', boxCash);
                            break;
                        default:
                            alert('Invalid cash box selected.');
                            return;
                    }
                    updateCashDisplay();
                } else {
                    alert('Invalid sale amount.');
                }
            } else {
                alert('Invalid quantity.');
            }
        };
        productItem.appendChild(sellButton);

        // Create restock button
        const restockButton = document.createElement('button');
        restockButton.className = 'restocks-button';
        restockButton.textContent = 'Restock';
        restockButton.onclick = () => {
            const quantity = prompt(`Enter quantity to restock for ${name}:`);
            if (quantity && !isNaN(quantity) && parseInt(quantity) > 0) {
                // Update stock
                products[name] = (products[name] || 0) + parseInt(quantity);
                productName.textContent = `${name} (Stock: ${products[name]})`;
                localStorage.setItem('products', JSON.stringify(products)); // Save to localStorage
            } else {
                alert('Invalid quantity.');
            }
        };
        productItem.appendChild(restockButton);

        // Add product item to list
        productList.appendChild(productItem);
    }
}

// Function to add a product to the list
function addProduct(name, stock) {
    products[name] = stock;
    renderProducts();
    localStorage.setItem('products', JSON.stringify(products)); // Save to localStorage
}

// Menu button functionality
document.getElementById('menuButton').onclick = () => {
    const menuOptions = document.getElementById('menuOptions');
    menuOptions.style.display = menuOptions.style.display === 'none' ? 'block' : 'none';
};

// Add Product button functionality
document.getElementById('addProductButton').onclick = () => {
    const productName = prompt('Enter the product name:');
    const productStock = prompt('Enter the product stock:');
    if (productName && !isNaN(productStock) && parseInt(productStock) > 0) {
        addProduct(productName, parseInt(productStock));
    } else {
        alert('Invalid input. Please enter a valid product name and stock.');
    }
};

// Refresh button functionality
document.getElementById('refreshButton').onclick = () => {
    window.location.reload(); // Refreshes the page
};

// Total Stock button functionality
document.getElementById('totalStockButton').onclick = () => {
    let totalStock = 0;
    for (const stock of Object.values(products)) {
        totalStock += stock;
    }
    alert(`Total stock: ${totalStock}`);
};

// History button functionality
document.getElementById('historyButton').onclick = () => {
    // Example logic for history (This should be replaced with actual implementation)
    alert('History feature not implemented.');
};

// Track Expense button functionality
document.getElementById('expenseButton').onclick = () => {
    const expense = prompt('Enter the expense amount:');
    if (expense && !isNaN(expense) && parseFloat(expense) > 0) {
        const cashBox = prompt('Select cash box (main, middle, box):').toLowerCase();
        switch (cashBox) {
            case 'main':
                mainCash -= parseFloat(expense);
                localStorage.setItem('mainCash', mainCash);
                break;
            case 'middle':
                middleCash -= parseFloat(expense);
                localStorage.setItem('middleCash', middleCash);
                break;
            case 'box':
                boxCash -= parseFloat(expense);
                localStorage.setItem('boxCash', boxCash);
                break;
            default:
                alert('Invalid cash box selected.');
                return;
        }
        updateCashDisplay();
    } else {
        alert('Invalid expense amount.');
    }
};

// Initialize app
updateCashDisplay();
renderProducts();
