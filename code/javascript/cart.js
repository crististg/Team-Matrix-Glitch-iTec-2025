document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart-container');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Fetch pentru produsele din coș
    Promise.all(cart.map((id) =>
        fetch(`http://localhost:3000/products/${id}`).then((response) => response.json())
    ))
        .then((products) => {
            products.forEach((product) => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');
                productDiv.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p>Price: $${product.price.toFixed(2)}</p>
                    <img src="${product.image}" alt="${product.name}" style="width: 100px; height: auto;" />
                `;
                cartContainer.appendChild(productDiv);
            });
        })
        .catch((error) => {
            console.error('Error fetching cart products:', error);
        });
});