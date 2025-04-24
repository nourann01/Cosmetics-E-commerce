// Initialize cartItems from localStorage or create an empty array
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

// Function to save cartItems to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

// Function to handle adding items to the cart
function handleBuyClick(productName) {
    const selectedProduct = products.find(p => p.title === productName);

    if (!selectedProduct) {
        console.error("Product not found in products array:", productName);
        return;
    }

    const { title, price, image, category } = selectedProduct;

    const existingItem = cartItems.find(item => item.title === title);

    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cartItems.push({ title, price, image, category, quantity: 1 });
    }

    saveCartToLocalStorage();
    renderCart();

}

// Load cart on page load
document.addEventListener("DOMContentLoaded", function () {
    // Handle "Back to shop" button
//     const backToShopBtn = document.getElementById('backToShopBtn');
//     if (backToShopBtn) {
//         backToShopBtn.addEventListener('click', (e) => {
//             e.preventDefault(); // Prevent default anchor behavior
//             window.location.href = "products.html";
// ; // Navigate to the previous page
//         });
//     }

    // Render cart on page load
    renderCart();
});

// Function to render cart items dynamically
function renderCart() {
    const cartItemsContainer = document.getElementById("cartItemsContainer");
    console.log("cartItemsContainer:", cartItemsContainer); // Debug

    if (!cartItemsContainer) {
        console.error("cartItemsContainer is null. Check your HTML.");
        return;
    }

    cartItemsContainer.innerHTML = ""; // Clear only the cart items

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        updateSummary();
        return;
    }

    cartItems.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "row border-top border-bottom";
        row.innerHTML = `
            <div class="row main align-items-center" data-title="${item.title}">
                <div class="col-2">
                    <img class="img-fluid" src="${item.image}" alt="${item.title}">
                </div>
                <div class="col">
                    <div class="row text-muted">${item.category}</div>
                    <div class="row">${item.title}</div>
                </div>
                <div class="col">
                    <div class="quantity">
                        <a href="#" class="minus-btn">-</a>
                        <span class="border quantity-value">${item.quantity || 1}</span>
                        <a href="#" class="plus-btn">+</a>
                    </div>
                </div>
                <div class="col">
                    ${item.price} <span class="close remove-btn" data-index="${index}">&#10005;</span>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(row);
    });

    addCartEventListeners();
    updateSummary(); // Update the summary after rendering
}
// Function to update the summary section
function updateSummary() {
    let itemCount = 0;
    let totalPrice = 0;

    cartItems.forEach(item => {
        const price = parseFloat(item.price.replace("$", ""));
        const quantity = item.quantity || 1;
        itemCount += quantity;
        totalPrice += price * quantity;
    });

    // Update the DOM
    document.getElementById("itemCount").textContent = `ITEMS ${itemCount}`;
    document.getElementById("subtotalPrice").textContent = `€ ${totalPrice.toFixed(2)}`;
    document.getElementById("totalPrice").textContent = `€ ${(totalPrice + 5).toFixed(2)}`; // Adding shipping cost
}

// Add event listeners for quantity and remove buttons
function addCartEventListeners() {
    const minusButtons = document.querySelectorAll('.minus-btn');
    const plusButtons = document.querySelectorAll('.plus-btn');
    const removeButtons = document.querySelectorAll('.remove-btn');

    minusButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const qtySpan = button.parentElement.querySelector('.quantity-value');
            let qty = parseInt(qtySpan.textContent);
            if (qty > 1) {
                qtySpan.textContent = qty - 1;
                updateCartQuantity(button, qty - 1);
                saveCartToLocalStorage();
            }
        });
    });

    plusButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const qtySpan = button.parentElement.querySelector('.quantity-value');
            let qty = parseInt(qtySpan.textContent);
            qtySpan.textContent = qty + 1;
            updateCartQuantity(button, qty + 1);
            saveCartToLocalStorage();
        });
    });

    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.getAttribute('data-index'), 10);
            if (!isNaN(index)) {
                cartItems.splice(index, 1); // Remove the item from the cart
                saveCartToLocalStorage(); // Save updated cart to localStorage
                renderCart(); // Re-render the cart
            } else {
                console.error("Invalid index for removal:", button.getAttribute('data-index'));
            }
        });
    });
}

// Function to update cart quantity in the cartItems array
function updateCartQuantity(button, newQuantity) {
    const parentRow = button.closest('.row.main');
    const title = parentRow.getAttribute('data-title').trim();

    const item = cartItems.find(item => item.title === title);
    if (item) {
        item.quantity = newQuantity;
        saveCartToLocalStorage();
        updateSummary();
        renderCart();
    }
}