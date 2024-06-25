document.addEventListener('DOMContentLoaded', () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const productId = urlParams.get('id');

    const API_URL = `https://fakestoreapi.com/products/${productId}`;
    const brandElement = document.getElementById('brand');
    const titleElement = document.getElementById('title');
    const priceElement = document.getElementById('price');
    const offersElement = document.getElementById('offers');
    const mainImages = document.getElementById('imgData'); // Updated to match your HTML structure
    const mainImage = document.getElementById('imgs'); // Assuming this is where the main image goes
    const quantityInput = document.getElementById('quantity');
    const increaseBtn = document.getElementById('increase-btn');
    const decreaseBtn = document.getElementById('decrease-btn');

    let currentQuantity = 1;
    let currentProduct = null; // This will hold the product details

    const fetchProductDetails = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const product = await response.json();
            currentProduct = product; // Store the product details
            displayProductDetails(product);
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    };

    const displayProductDetails = (product) => {
        brandElement.textContent = `Brand: ${product.brand}`;
        titleElement.textContent = product.title;
        priceElement.textContent = `₹${product.price}`;

        // Clear previous offers
        offersElement.innerHTML = '';

        // Display offers if available
        if (product.offers && product.offers.length > 0) {
            product.offers.forEach(offer => {
                const li = document.createElement('li');
                li.textContent = offer;
                offersElement.appendChild(li);
            });
        } else {
            offersElement.textContent = 'No offers available';
        }

        // Update main image
        mainImage.src = product.image;
        mainImage.alt = product.title;
        mainImages.src = product.image;
        mainImages.alt = product.title;

        // Update quantity input value
        quantityInput.value = currentQuantity;
    };

    // Event listeners for quantity buttons
    increaseBtn.addEventListener('click', () => {
        currentQuantity++;
        quantityInput.value = currentQuantity;
    });

    decreaseBtn.addEventListener('click', () => {
        if (currentQuantity > 1) {
            currentQuantity--;
            quantityInput.value = currentQuantity;
        }
    });

    // Event listener for Add to Cart button
    document.getElementById('add-cart').addEventListener('click', () => {
        const item = {
            id: productId,
            title: titleElement.textContent,
            price: priceElement.textContent,
            quantity: currentQuantity,
            image: currentProduct.image // Get the image from the current product details
        };
        addToCart(item);
    });

    const addToCart = (item) => {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartItems.push(item);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartCount();
    };

    const updateCartCount = () => {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        document.getElementById('cart-count').innerText = cartItems.length;
    };

    fetchProductDetails();
});
