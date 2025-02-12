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




const tShirts = [
 {
        id: 1, 
        type: 'Camiseta blanca', 
        image: [
            '/static/Img/camisetas/1.jpg',
            '/static/Img/camisetas/111.jpg',
            '/static/Img/camisetas/1111.jpg'
        ], 
        description: 'Camiseta básica de color sólido', 
        price: '$100.000' 
    },

    { id: 2, type: 'Estampada', 
        image: ['/static/Img/camisetas/2.jpg',
            '/static/Img/camisetas/21.jpg',
            '/static/Img/camisetas/22.jpg',

        ], 
        description: 'Camiseta con estampado gráfico', 
        price: '$150.000' },

    { id: 3, type: 'Oversize', 
        image: ['/static/Img/camisetas/3.jpg', 
            '/static/Img/camisetas/12.jpg',
            '/static/Img/camisetas/11.jpg',
        ], 
        description: 'Camiseta de corte amplio', 
        price: '$200.000' },

    { id: 4, type: 'Oversize', 
        image: ['/static/Img/camisetas/4.jpg',
                '/static/Img/camisetas/41.jpg',
                '/static/Img/camisetas/42.jpg',
                '/static/Img/camisetas/43.jpg',


        ], 
        description: 'Camiseta de corte amplio', 
        price: '$150.000' },
    { id: 5, type: 'Oversize', 
        image: ['/static/Img/camisetas/5.jpg',
            '/static/Img/camisetas/51.jpg',
            '/static/Img/camisetas/52.jpg',



        ], 
        description: 'Camiseta de corte amplio', 
        price: '180.000' },
];


function renderShirts(shirts) {
    const container = document.getElementById('shirt-container');
    container.innerHTML = ''; 

    shirts.forEach(shirt => {
        const shirtDiv = document.createElement('div');
        shirtDiv.classList.add('shirt');
        shirtDiv.innerHTML = `
            <img src="${shirt.image[0]}" alt="${shirt.type}">
            <h3>${shirt.type}</h3>
            <p>${shirt.description}</p>
            <p>${shirt.price}</p>
        `;
        shirtDiv.onclick = function() {
            showPopup(shirt);
        };
        container.appendChild(shirtDiv);
    });
}


function showPopup(shirt) {
    const popup = document.getElementById('shirt-popup');
    const popupImageContainer = document.getElementById('popup-image-container');
    popupImageContainer.innerHTML = ''; 


    shirt.image.forEach(image => {
        const img = document.createElement('img');
        img.src = image;
        img.alt = shirt.type;
        popupImageContainer.appendChild(img);
    });


    document.getElementById('popup-title').innerText = shirt.type;
    document.getElementById('popup-description').innerText = shirt.description;
    document.getElementById('popup-price').innerText = shirt.price;


    popup.style.display = 'flex';
}


function closePopup(event) {

    if (event.target === document.getElementById('shirt-popup')) {
        document.getElementById('shirt-popup').style.display = 'none';
    }
}






function addToCart() {
    const size = document.getElementById('size').value; 
    const title = document.getElementById('popup-title').innerText; 
    const price = document.getElementById('popup-price').innerText; 
    const image = document.querySelector('#popup-image-container img').src;
    const id = title; 

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(product => product.id === id && product.size === size);

    if (existingProduct) {
        existingProduct.quantity += 1; 
    } else {
        cart.push({ id, title, size, price, image, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI(); 
    document.getElementById('shirt-popup').style.display = 'none'; 
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

}
function clearCart() {
    localStorage.removeItem('cart'); 
    updateCartUI(); 

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



renderShirts(tShirts);



function filterTShirts(type) {
    let filteredShirts;
    if (type) {
        filteredShirts = tShirts.filter(shirt => shirt.type.toLowerCase() === type.toLowerCase());
    } else {
        filteredShirts = tShirts;
    }
    renderShirts(filteredShirts); 
}
