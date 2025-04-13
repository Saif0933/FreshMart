document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const productGrid = document.querySelector('.product-grid');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartCountElement = document.getElementById('cart-count');
    const totalItemsElement = document.getElementById('total-items');
    const totalPriceElement = document.getElementById('total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const emptyCartMessage = document.querySelector('.empty-cart-message');

    // --- Cart State ---
    // Load cart from localStorage or initialize as empty array
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    // --- Functions ---

    // Function to render products (if you were fetching from an API)
    // For now, products are hardcoded in HTML, but this structure is useful
    function renderProducts() {
        // In a real app, you'd fetch product data and generate HTML here
        // Since products are in HTML, we just need to attach listeners
        attachProductListeners();
    }

    // Function to render cart items in the DOM
    function renderCart() {
        // Clear current cart display
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            if (emptyCartMessage) emptyCartMessage.style.display = 'block';
        } else {
            if (emptyCartMessage) emptyCartMessage.style.display = 'none';

            cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item');
                cartItemElement.dataset.id = item.id; // Set data-id for removal

                cartItemElement.innerHTML = `
                    <div class="cart-item-details">
                        <strong>${item.name}</strong> - $${item.price.toFixed(2)}
                    </div>
                    <div class="cart-item-actions">
                        <button class="quantity-decrease" ${item.quantity <= 1 ? 'style="visibility:hidden;"' : ''} >-</button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button class="quantity-increase">+</button>
                        <button class="remove-item-btn"><i class="fas fa-trash-alt"></i></button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemElement);
            });
        }

        updateCartSummary();
        saveCartToLocalStorage(); // Save cart whenever it's rendered
    }

    // Function to update cart summary (count and total price)
    function updateCartSummary() {
        let totalItems = 0;
        let totalPrice = 0;

        cart.forEach(item => {
            totalItems += item.quantity;
            totalPrice += item.price * item.quantity;
        });

        cartCountElement.textContent = totalItems;
        totalItemsElement.textContent = totalItems;
        totalPriceElement.textContent = totalPrice.toFixed(2);

        // Enable/disable checkout and clear buttons based on cart content
        const cartIsEmpty = cart.length === 0;
        checkoutBtn.disabled = cartIsEmpty;
        clearCartBtn.disabled = cartIsEmpty;
    }

    // Function to add an item to the cart
    function addToCart(id, name, price) {
        const existingItemIndex = cart.findIndex(item => item.id === id);

        if (existingItemIndex > -1) {
            // Item exists, increase quantity
            cart[existingItemIndex].quantity += 1;
        } else {
            // Item does not exist, add new item
            cart.push({ id, name, price, quantity: 1 });
        }

        renderCart(); // Re-render the cart display
    }

    // Function to update item quantity
     function updateQuantity(id, change) {
        const itemIndex = cart.findIndex(item => item.id === id);
        if (itemIndex > -1) {
            cart[itemIndex].quantity += change;
            if (cart[itemIndex].quantity <= 0) {
                // Remove item if quantity drops to 0 or less
                removeFromCart(id);
            } else {
                 renderCart();
            }
        }
    }

    // Function to remove an item from the cart
    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        renderCart(); // Re-render the cart display
    }

    // Function to clear the entire cart
    function clearCart() {
        cart = []; // Empty the array
        renderCart(); // Re-render the cart display
    }


    // Function to save cart to localStorage
    function saveCartToLocalStorage() {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }

     // Function to handle simulated checkout
     function handleCheckout() {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        // Simulate checkout process
        console.log("Simulating checkout process...");
        console.log("Cart Items:", cart);
        console.log(`Total Price: $${totalPriceElement.textContent}`);

        // Display a confirmation message (replace with actual payment integration in a real app)
        alert(`Checkout complete (Simulation)! Total: $${totalPriceElement.textContent}. Your cart has been cleared.`);

        // Clear the cart after successful "checkout"
        clearCart();
    }
    // --- Event Listeners ---
    // Attach listeners to "Add to Cart" buttons (using event delegation on product grid)
    function attachProductListeners() {
         if (productGrid) {
             productGrid.addEventListener('click', (e) => {
                if (e.target.classList.contains('add-to-cart-btn')) {
                    const productItem = e.target.closest('.product-item');
                    const id = productItem.dataset.id;
                    const name = productItem.dataset.name;
                    // Ensure price is parsed as a number
                    const price = parseFloat(productItem.dataset.price);

                    if (id && name && !isNaN(price)) {
                        addToCart(id, name, price);
                         // Optional: Give user feedback
                         e.target.textContent = 'Added!';
                         setTimeout(() => {
                            e.target.textContent = 'Add to Cart';
                         }, 1000); // Reset button text after 1 second
                    } else {
                        console.error("Product data missing or invalid:", productItem.dataset);
                    }
                }
            });
         } else {
             console.error("Product grid container not found!");
         }
    }


    // Attach listeners for cart actions (remove, quantity change) using event delegation
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            const target = e.target;
            const cartItem = target.closest('.cart-item');
            if (!cartItem) return; // Exit if click wasn't inside a cart item

            const id = cartItem.dataset.id;

            if (target.classList.contains('remove-item-btn') || target.closest('.remove-item-btn')) {
                removeFromCart(id);
            } else if (target.classList.contains('quantity-increase')) {
                 updateQuantity(id, 1); // Increase by 1
            } else if (target.classList.contains('quantity-decrease')) {
                 updateQuantity(id, -1); // Decrease by 1
            }
        });
    } else {
        console.error("Cart items container not found!");
    }


    // Checkout Button Listener
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    } else {
         console.error("Checkout button not found!");
    }

     // Clear Cart Button Listener
     if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to clear your entire cart?")) {
                 clearCart();
            }
        });
    } else {
         console.error("Clear Cart button not found!");
    }


    // --- Initial Setup ---
    renderProducts(); // Attach listeners to initially loaded products
    renderCart();     // Render cart based on localStorage or initial empty state

}); // End DOMContentLoaded
