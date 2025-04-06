document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart-container');
    const totalAmountElement = document.getElementById('total-amount'); // Element pentru suma totală
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Funcție pentru afișarea produselor din coș
    function displayCart() {
        cartContainer.innerHTML = ''; // Golește containerul

        if (cart.length === 0) {
            cartContainer.innerHTML = '<p>Your cart is empty.</p>';
            updateCartTotal(0); // Actualizează suma totală la 0
            return;
        }

        let total = 0; // Variabilă pentru suma totală

        cart.forEach((productId, index) => {
            // Fetch pentru fiecare produs din coș
            fetch(`http://localhost:3000/products/${productId}`)
                .then((response) => response.json())
                .then((product) => {
                    const productDiv = document.createElement('div');
                    productDiv.classList.add('product');
                    productDiv.innerHTML = `
                        <div id="card">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p>Price: $${product.price.toFixed(2)}</p>
                        <img src="${product.image}" alt="${product.name}" style="width: 100px; height: auto;" />
                        <button class="remove-from-cart" data-index="${index}">Remove</button>
                        </div>
                    `;
                    cartContainer.appendChild(productDiv);

                    // Adaugă prețul produsului la total
                    total += product.price;

                    // Actualizează suma totală după ce toate produsele sunt afișate
                    updateCartTotal(total);
                })
                .catch((error) => {
                    console.error('Error fetching product details:', error);
                });
        });
    }

    // Funcție pentru actualizarea sumei totale
    function updateCartTotal(total) {
        totalAmountElement.textContent = total.toFixed(2); // Afișează suma totală cu 2 zecimale
    }

    // Funcție pentru eliminarea unui produs din coș
    function removeFromCart(index) {
        cart.splice(index, 1); // Elimină produsul din array-ul `cart`
        localStorage.setItem('cart', JSON.stringify(cart)); // Actualizează `localStorage`
        displayCart(); // Reafișează produsele din coș
    }

    // Eveniment pentru butoanele "Remove"
    cartContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-from-cart')) {
            const index = event.target.getAttribute('data-index');
            removeFromCart(index);
        }
    });

    // Afișează produsele din coș la încărcarea paginii
    displayCart();
});