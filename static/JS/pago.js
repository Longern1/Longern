       
       function toggleMenu() {
        const menuButton = document.querySelector('.menu-button');
        const menu = document.querySelector('.menu');
    
        menuButton.classList.toggle('active');
        menu.classList.toggle('show');
    }



    document.getElementById('cart-icon').addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
    
        const cartDropdown = document.getElementById('cart-dropdown');
        cartDropdown.style.display = cartDropdown.style.display === 'block' ? 'none' : 'block';
    
        this.classList.toggle('active');
    });
    
    
    document.getElementById('cart-dropdown').addEventListener('click', function(event) {
        event.stopPropagation(); 
    });
    
    
    document.addEventListener('click', function(event) {
        const cartDropdown = document.getElementById('cart-dropdown');
        const cartIcon = document.getElementById('cart-icon');
    
    
        if (!cartDropdown.contains(event.target) && !cartIcon.contains(event.target)) {
            cartDropdown.style.display = 'none';
            cartIcon.classList.remove('active');
        }
    });
    

function addToCart() {
    const size = document.getElementById('size').value; 
    const title = document.getElementById('popup-title').innerText; 
    const price = document.getElementById('popup-price').innerText; 
    const image = document.querySelector('#popup-image-container img').src; 


    const product = { title, size, price, image };

  
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);

 
    localStorage.setItem('cart', JSON.stringify(cart));


    updateCartUI();


    alert(`¡Camiseta añadida al carrito en talla ${size}!`);
}
function updateCartUI() {
    const cart = JSON.parse(localStorage.getItem('cart')) || []; 
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = ''; 

    cart.forEach((product, index) => {
        const newItem = document.createElement('li');
        newItem.classList.add('cart-item');
        newItem.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="cart-item-image">
            <div class="cart-item-details">
                <p class="cart-item-title">${product.title}</p>
                <p class="cart-item-size">Talla: ${product.size}</p>
                <p class="cart-item-price">${product.price}</p>
                <p class="cart-item-quantity">Cantidad: ${product.quantity}</p>
                <div class="quantity-buttons">
                    <button class="decrease-quantity" onclick="adjustQuantity(${index}, -1)">-</button>
                    <button class="increase-quantity" onclick="adjustQuantity(${index}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeItem(${index})">✖</button>
        `;
        cartItems.appendChild(newItem);
    });
}


function adjustQuantity(index, change, event) {
    if (event) {
        event.stopPropagation(); 
        event.preventDefault(); 
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = cart[index];

    if (product) {
        product.quantity += change;
        if (product.quantity <= 0) {
            cart.splice(index, 1); 
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI(); 
    }
}
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1); 
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI(); 
    alert('Producto eliminado del carrito.');
}
function clearCart() {
    localStorage.removeItem('cart'); 
    updateCartUI(); 
    alert('El carrito ha sido vaciado.');
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartUI(); 
});
function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        alert('El carrito está vacío. Agrega productos antes de finalizar la compra.');
        return;
    }


    localStorage.setItem('cart', JSON.stringify(cart));


    window.location.href = '/pago';  
}

       
       
       
       
       
       
       
       
       
 
document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartSummary = document.getElementById('cart-summary');

    if (cart.length === 0) {
        cartSummary.innerHTML = '<p>No hay productos en el carrito.</p>';
        return;
    }

    cart.forEach((product, index) => {
        const item = document.createElement('li');
        item.classList.add('cart-summary-item');
        item.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="summary-item-image">
            <div class="summary-item-details">
                <p class="summary-item-title">${product.title}</p>
                <p class="summary-item-size">Talla: ${product.size}</p>
                <p class="summary-item-price">${product.price}</p>
                 <p class="cart-item-quantity">Cantidad: ${product.quantity}</p>
            </div>
            <button class="remove-item" data-index="${index}">Eliminar</button>
        `;
        cartSummary.appendChild(item);
    });


    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', removeItem);
    });
});


function removeItem(event) {
    const index = event.target.getAttribute('data-index');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];


    cart.splice(index, 1);


    localStorage.setItem('cart', JSON.stringify(cart));


    location.reload();
}
document.getElementById('payment-form').addEventListener('submit', async (event) => {
    event.preventDefault(); 


    const formData = {
        fullName: document.getElementById('full-name').value,
        cedula: document.getElementById('cedula').value,
        city: document.getElementById('city').value,
        address: document.getElementById('address').value,
        paymentMethod: document.getElementById('payment-method').value,
        cart: JSON.parse(localStorage.getItem('cart')) || [],  
    };

    try {
 
        const response = await fetch('/process-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData), 
        });

        if (response.ok) {
            const data = await response.json(); 
            console.log('Respuesta del servidor:', data); 
            
            alert('Pago procesado exitosamente. ¡Gracias por tu compra!');
            localStorage.removeItem('cart'); 
            

            window.location.href = `/order-details/${data.order_code}`;
        } else {
            const responseData = await response.json();
            console.error('Error del servidor:', responseData); 
            alert(`Hubo un error: ${responseData.message}`);
        }
    } catch (error) {
        console.error('Error en el envío:', error); 
        alert('No se pudo procesar el pago. Verifica tu conexión e intenta nuevamente.');
    }
});


    async function processPayment() {
  
        const form = document.getElementById('paymentForm');
        const formData = new FormData(form);
        const cart = JSON.parse(localStorage.getItem('cart')) || [];


        const data = {
            fullName: formData.get('fullName'),
            cedula: formData.get('cedula'),
            city: formData.get('city'),
            address: formData.get('address'),
            paymentMethod: formData.get('paymentMethod'),
            cart: cart
        };

        try {

            const response = await fetch('/process-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Pago procesado exitosamente. ¡Gracias por tu compra!');
                localStorage.removeItem('cart'); 
                window.location.href = `/order-details/${data.order_code}`;
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error al procesar el pago:', error);
            alert('Ocurrió un error al procesar el pago.');
        }
    }
