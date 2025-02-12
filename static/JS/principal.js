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





const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let currentIndex = 0;
const totalSlides = slides.length;
let interval;


function showSlide(index) {
    slider.style.transition = 'transform 0.5s ease';
    slider.style.transform = `translateX(-${index * 100}%)`;
}


function checkInfiniteLoop() {
    if (currentIndex === totalSlides - 1) {
 
        setTimeout(() => {
            slider.style.transition = 'none';
            slider.style.transform = 'translateX(0)';
            currentIndex = 0;
        }, 500); 
    }
}


function startAutoSlide() {
    interval = setInterval(() => {
        currentIndex++;
        showSlide(currentIndex);
        checkInfiniteLoop();
    }, 4000);
}


function stopAutoSlide() {
    clearInterval(interval);
}


prevBtn.addEventListener('click', () => {
    stopAutoSlide();
    if (currentIndex === 0) {
        slider.style.transition = 'none';
        currentIndex = totalSlides - 2; 
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        setTimeout(() => {
            slider.style.transition = 'transform 0.5s ease';
            currentIndex--;
            showSlide(currentIndex);
        }, 50);
    } else {
        currentIndex--;
        showSlide(currentIndex);
    }
    startAutoSlide();
});


nextBtn.addEventListener('click', () => {
    stopAutoSlide();
    currentIndex++;
    showSlide(currentIndex);
    checkInfiniteLoop();
    startAutoSlide();
});


startAutoSlide();

let lastScrollTop = 0;
const videoSection = document.querySelector('.image-section');  
const introSection = document.querySelector('.intro');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;


    if (scrollTop > lastScrollTop) {

        videoSection.style.opacity = 1;
        videoSection.style.transform = 'translateX(0)';
        introSection.style.opacity = 1;
        introSection.style.transform = 'translateX(0)';
    } else {

        videoSection.style.opacity = 0;
        videoSection.style.transform = 'translateX(100%)';
        introSection.style.opacity = 0;
        introSection.style.transform = 'translateX(-100%)';
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});




document.addEventListener('DOMContentLoaded', function () {
    const footer = document.querySelector('footer'); 
    let lastScrollTop = 0; 

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            footer.classList.remove('hide');
            footer.classList.add('show');
        } else {
            footer.classList.remove('show');
            footer.classList.add('hide');
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
});



const dropDate = new Date("December 31, 2024 23:59:59").getTime();


function updateTimer() {
    const now = new Date().getTime(); 
    const distance = dropDate - now; 


    const months = Math.floor(distance / (1000 * 60 * 60 * 24 * 30)); 
    const days = Math.floor((distance % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);


    document.getElementById("months").innerText = months + "M";
    document.getElementById("days").innerText = days + "D";
    document.getElementById("hours").innerText = hours + "H";
    document.getElementById("minutes").innerText = minutes + "M";
    document.getElementById("seconds").innerText = seconds + "S";


    if (distance < 0) {
        clearInterval(timerInterval);
        document.querySelector('.drop-timer').innerHTML = "<p>¡Es hora del DROP!</p>";
    }
}


const timerInterval = setInterval(updateTimer, 1000);


updateTimer();

let lastScrollTopTimer = 0;

const dropTimer = document.querySelector('.drop-timer'); 

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;


    if (scrollTop > lastScrollTopTimer) {

        dropTimer.classList.remove('hide');
        dropTimer.classList.add('show');
    } else {

        dropTimer.classList.remove('show');
        dropTimer.classList.add('hide');
    }


    lastScrollTopTimer = scrollTop <= 0 ? 0 : scrollTop; 
});

