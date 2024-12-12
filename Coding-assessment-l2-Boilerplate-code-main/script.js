document.addEventListener('DOMContentLoaded', function () {
    console.log('====================================');
    console.log("Connected");
    console.log('====================================');

    const cartItemsContainer = document.getElementById('cart-items-body');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const loader = document.getElementById('loader');

    // Show loader while fetching data
    loader.style.display = 'block';

    // Fetch the cart data
    fetch('https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched data:', data);  // Debugging line

            loader.style.display = 'none';

            // Check if the fetched data is an array
            if (Array.isArray(data)) {
                updateCart(data);
            } else {
                console.error('Fetched data is not an array:', data);
            }
        })
        .catch(error => {
            console.error('Error fetching cart data:', error);
            loader.style.display = 'none';
        });

    // Function to update the cart
    function updateCart(data) {
        cartItemsContainer.innerHTML = '';
        let subtotal = 0;

        data.forEach(item => {
            const row = document.createElement('tr');
                
            row.innerHTML = `
                <td><img src="${item.image}" alt="${item.name}" style="height:50px;"></td>
                <td>${item.name}</td>
                <td>₹${item.price.toFixed(2)}</td>
                <td>
                    <input type="number" value="${item.quantity}" min="1" class="quantity" data-id="${item.id}">
                </td>
                <td>₹<span class="subtotal" data-id="${item.id}">${(item.price * item.quantity).toFixed(2)}</span></td>
                <td><button class="remove-item" data-id="${item.id}">🗑</button></td>
            `;

            cartItemsContainer.appendChild(row);
            subtotal += item.price * item.quantity;
        });

        subtotalElement.innerText = subtotal.toFixed(2);
        totalElement.innerText = subtotal.toFixed(2);

        // Save to local storage
        localStorage.setItem('cartData', JSON.stringify(data));

        // Update subtotal and total when quantity changes
        const quantityInputs = document.querySelectorAll('.quantity');
        quantityInputs.forEach(input => {
            input.addEventListener('change', (event) => {
                const id = event.target.getAttribute('data-id');
                const newQuantity = parseInt(event.target.value);
                const price = data.find(item => item.id == id).price;
                const newSubtotal = newQuantity * price;

                document.querySelector(`.subtotal[data-id="${id}"]`).innerText = newSubtotal.toFixed(2);

                data = data.map(item => {
                    if (item.id == id) {
                        item.quantity = newQuantity;
                    }
                    return item;
                });

                updateSubtotalAndTotal();
            });
        });

        // Remove item from cart with confirmation modal
        const removeButtons = document.querySelectorAll('.remove-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const id = event.target.getAttribute('data-id');
                showModal(id, data);
            });
        });

        // Function to update subtotal and total
        function updateSubtotalAndTotal() {
            let newSubtotal = 0;

            data.forEach(item => {
                newSubtotal += item.price * item.quantity;
            });

            subtotalElement.innerText = newSubtotal.toFixed(2);
            totalElement.innerText = newSubtotal.toFixed(2);

            // Save to local storage
            localStorage.setItem('cartData', JSON.stringify(data));
        }
    }

    // Show modal for item removal confirmation
    function showModal(itemId, data) {
        const modal = document.getElementById('confirmation-modal');
        const confirmBtn = modal.querySelector('.confirm-remove');
        const cancelBtn = modal.querySelector('.cancel-remove');

        modal.style.display = 'block';

        confirmBtn.onclick = () => {
            data = data.filter(cartItem => cartItem.id !== itemId);
            document.querySelector(`.remove-item[data-id="${itemId}"]`).closest('tr').remove();
            updateSubtotalAndTotal();
            modal.style.display = 'none';
        };

        cancelBtn.onclick = () => {
            modal.style.display = 'none';
        };

        // Function to update subtotal and total
        function updateSubtotalAndTotal() {
            let newSubtotal = 0;

            data.forEach(item => {
                newSubtotal += item.price * item.quantity;
            });

            subtotalElement.innerText = newSubtotal.toFixed(2);
            totalElement.innerText = newSubtotal.toFixed(2);

            // Save to local storage
            localStorage.setItem('cartData', JSON.stringify(data));
        }
    }

    // Handle checkout button
    document.getElementById('checkout-btn').addEventListener('click', () => {
        alert('Proceeding to checkout!');
        // Add actual checkout functionality here
    });
});
