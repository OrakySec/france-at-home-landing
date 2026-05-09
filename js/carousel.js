// Seleciona os elementos do carrossel
const carousel = document.querySelector('.carousel');
const slides = document.querySelectorAll('.carousel-slide');

let currentIndex = 0; // Índice do slide atual
let startX; // Posição inicial do toque
let currentTranslate = 0; // Posição atual do carrossel
let prevTranslate = 0; // Posição anterior do carrossel
let isDragging = false; // Verifica se o usuário está arrastando

// Função para definir a posição do carrossel
function setCarouselPosition() {
    carousel.style.transform = `translateX(${currentTranslate}px)`;
}

// Função para alterar o slide
function goToSlide(index) {
    currentIndex = index;
    currentTranslate = -currentIndex * window.innerWidth;
    setCarouselPosition();
}

// Função para rolagem automática
function autoSlide() {
    currentIndex = (currentIndex + 1) % slides.length; // Incrementa o índice e reinicia se necessário
    goToSlide(currentIndex);
}

// Inicia o carrossel com rolagem automática
let autoSlideInterval = setInterval(autoSlide, 5000); // Intervalo de 3 segundos

// Adiciona eventos de toque
carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    prevTranslate = currentTranslate;
    clearInterval(autoSlideInterval); // Pausa a rolagem automática ao tocar
    isDragging = true;
});

carousel.addEventListener('touchmove', (e) => {
    if (isDragging) {
        const currentX = e.touches[0].clientX;
        const deltaX = currentX - startX;
        currentTranslate = prevTranslate + deltaX;
        setCarouselPosition();
    }
});

carousel.addEventListener('touchend', () => {
    // Calcula o slide mais próximo com base na posição final do toque
    currentIndex = Math.round(-currentTranslate / window.innerWidth);
    goToSlide(currentIndex);

    // Reinicia o intervalo de rolagem automática
    autoSlideInterval = setInterval(autoSlide, 3000); // Intervalo de 3 segundos
    isDragging = false;
});
