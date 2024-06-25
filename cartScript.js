document.addEventListener('DOMContentLoaded', () => {

    const renderCartItems = () => {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        let cartItemsContainer = document.getElementById('cart-items');
        cartItemsContainer.innerHTML = '';

        cartItems.forEach(item => {

            let itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');


            let imageElement = document.createElement('img');
            imageElement.src = item.image;
            imageElement.alt = item.title;
            imageElement.classList.add('cart-item-image');
            itemElement.appendChild(imageElement);


            let detailsElement = document.createElement('div');
            detailsElement.classList.add('cart-item-details');
            detailsElement.innerHTML = `
                <h5 class="item-title">${item.title}</h5>
                <p class="item-price">${item.price}</p>
                <p class="item-quantity">Quantity: ${item.quantity}</p>
            `;
            itemElement.appendChild(detailsElement);


            let buttonsElement = document.createElement('div');
            buttonsElement.classList.add('cart-item-buttons');


            let removeButton = document.createElement('button');
            removeButton.classList.add('btn', 'btn-danger');
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', () => removeItemFromCart(item.id));
            buttonsElement.appendChild(removeButton);


            let saveButton = document.createElement('button');
            saveButton.classList.add('btn', 'btn-secondary');
            saveButton.textContent = 'Save for Later';
            saveButton.addEventListener('click', () => saveItemForLater(item.id));
            buttonsElement.appendChild(saveButton);

            itemElement.appendChild(buttonsElement);


            cartItemsContainer.appendChild(itemElement);
        });
    };

    const removeItemFromCart = (itemId) => {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartItems = cartItems.filter(item => item.id !== itemId);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        renderCartItems();
        updateCartCount();
    };

    const saveItemForLater = (itemId) => {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        let savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];

        const itemToSave = cartItems.find(item => item.id === itemId);
        savedItems.push(itemToSave);
        localStorage.setItem('savedItems', JSON.stringify(savedItems));

        removeItemFromCart(itemId);
    };

    const addItemToCart = (newItem) => {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];


        const existingItemIndex = cartItems.findIndex(item => item.id === newItem.id);
        if (existingItemIndex > -1) {

            cartItems[existingItemIndex].quantity += newItem.quantity;
        } else {

            cartItems.push(newItem);
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        renderCartItems();
        updateCartCount();
    };


    if (window.location.pathname.includes('cart.html')) {
        renderCartItems();
    }

    const updateCartCount = () => {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        document.getElementById('cart-count').innerText = cartItems.length;
    };

    updateCartCount();
});
