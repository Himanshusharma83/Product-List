document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://fakestoreapi.com/products';
    const productContainer = document.getElementById('product-list');
    const loadMoreButton = document.getElementById('load-more');
    const loadingIndicator = document.getElementById('loading');
    const categoryCheckboxes = document.querySelectorAll('.category-checkbox');
    const priceSort = document.getElementById('price-sort');
    const totalItemsElement = document.getElementById('total-items');

    let products = [];
    let displayedProducts = [];
    let currentIndex = 0;
    const ITEMS_PER_LOAD = 10;

    // Fetch products from the API
    const fetchProducts = async () => {
        try {
            loadingIndicator.style.display = 'block';
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Network response was not ok');
            products = await response.json();

            filterAndSortProducts(); // Initial render
            loadMoreButton.style.display = 'block';
            loadingIndicator.style.display = 'none';
        } catch (error) {
            console.error('Error fetching products:', error);
            loadingIndicator.textContent = 'Failed to load products';
        }
    };

    // Render products to the DOM
   const renderProducts = () => {
    const fragment = document.createDocumentFragment();
    const itemsToShow = displayedProducts.slice(currentIndex, currentIndex + ITEMS_PER_LOAD);

    itemsToShow.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'col-md-4 product';

        // Modify title to show only first three words
        const words = product.title.split(' ');
        const truncatedTitle = words.slice(0, 3).join(' ');

        // Create link for details page
        const productLink = document.createElement('a');
        productLink.href = `details.html?id=${product.id}`; // Assuming you have a details.html for product details
        productLink.innerHTML = `
            <div class="image-wrapper">
                <img src="${product.image}" alt="${product.title}" class="img-fluid">
            </div>
            <h2>${truncatedTitle}</h2>
            <p>$${product.price}</p>
            <div class="heart-icon">
                <span class='heart'>&#9825;</span>
            </div>
        `;
        productElement.appendChild(productLink);
        fragment.appendChild(productElement);
    });

    productContainer.appendChild(fragment);
    currentIndex += ITEMS_PER_LOAD;

    // Add event listeners to heart icons
    document.querySelectorAll('.heart-icon .heart').forEach(heart => {
        heart.addEventListener('click', () => {
            heart.classList.toggle('red');
        });
    });
};



    // Filter and sort products
    const filterAndSortProducts = () => {
        let filteredProducts = products;

        const selectedCategories = Array.from(categoryCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        if (selectedCategories.length > 0) {
            filteredProducts = filteredProducts.filter(product =>
                selectedCategories.includes(product.category)
            );
        }

        const sortValue = priceSort.value;
        if (sortValue === 'asc') {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortValue === 'desc') {
            filteredProducts.sort((a, b) => b.price - a.price);
        }

        displayedProducts = filteredProducts;
        currentIndex = 0;
        productContainer.innerHTML = '';
        renderProducts();

        // Update total items count
        totalItemsElement.textContent = displayedProducts.length;
    };

    // Event listeners for checkboxes and price sort dropdown
    categoryCheckboxes.forEach(checkbox => checkbox.addEventListener('change', filterAndSortProducts));
    priceSort.addEventListener('change', filterAndSortProducts);

    loadMoreButton.addEventListener('click', renderProducts);

    fetchProducts();
});
