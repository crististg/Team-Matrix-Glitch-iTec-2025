document.addEventListener('DOMContentLoaded', () => {
    const productDetailsContainer = document.getElementById('product-details-container');
    const addToCartButton = document.getElementById('add-to-cart');

    // Preia ID-ul produsului din URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Funcție pentru afișarea detaliilor produsului
    function displayProductDetails(product) {
        productDetailsContainer.innerHTML = `
            <img src="${product.image}" alt="${product.name}" style="width: 300px; height: auto;" />
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p>Price: $${product.price.toFixed(2)}</p>
        `;
    }

    // Fetch pentru detaliile produsului
    fetch(`http://localhost:3000/products/${productId}`)
    .then((response) => {
        console.log('Response:', response); // Debugging
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then((product) => {
        console.log('Product details:', product); // Debugging
        displayProductDetails(product);
    })
    .catch((error) => {
        console.error('Error fetching product details:', error);
    });

    // Eveniment pentru adăugarea în coș
    addToCartButton.addEventListener('click', () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Product added to cart!');
    });
});