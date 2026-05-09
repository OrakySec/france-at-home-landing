document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.querySelector('.testimonial-carousel');
    const slides = document.querySelectorAll('.testimonial-slide');
    const totalSlides = slides.length;
    let index = 0;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let isDragging = false;
    let autoSlide;

    // Inicia a rolagem automática
    startAutoSlide();

    // Funções de movimentação do carrossel
    function moveToNextSlide() {
        index = (index + 1) % totalSlides; // Avança para o próximo slide
        moveToIndex();
    }

    function moveToIndex() {
        const offset = -index * 100; // Calcula o deslocamento
        carousel.style.transition = 'transform 0.5s ease';
        carousel.style.transform = `translateX(${offset}vw)`; // Move o carrossel
    }

    // Inicia a rolagem automática
    function startAutoSlide() {
        autoSlide = setInterval(moveToNextSlide, 8000);
    }

    // Pausa a rolagem automática
    function stopAutoSlide() {
        clearInterval(autoSlide);
    }

    // Eventos de toque
    carousel.addEventListener('touchstart', touchStart);
    carousel.addEventListener('touchmove', touchMove);
    carousel.addEventListener('touchend', touchEnd);

    // Eventos de mouse
    carousel.addEventListener('mousedown', touchStart);
    carousel.addEventListener('mousemove', touchMove);
    carousel.addEventListener('mouseup', touchEnd);
    carousel.addEventListener('mouseleave', touchEnd);

    function touchStart(event) {
        stopAutoSlide(); // Pausa a rolagem automática
        isDragging = true;
        startX = getPositionX(event);
        currentTranslate = prevTranslate;
        carousel.style.transition = 'none'; // Remove a animação durante o arrasto
    }

    function touchMove(event) {
        if (isDragging) {
            const currentPosition = getPositionX(event);
            const moveBy = currentPosition - startX; // Calcula o movimento
            currentTranslate = prevTranslate + moveBy;
            carousel.style.transform = `translateX(${currentTranslate}px)`; // Move o carrossel
        }
    }

    function touchEnd() {
        isDragging = false;
        const movedBy = currentTranslate - prevTranslate;

        // Verifica se foi arrastado mais de 50px para mudar de slide
        if (movedBy < -50 && index < totalSlides - 1) {
            index++;
        }
        if (movedBy > 50 && index > 0) {
            index--;
        }

        moveToIndex(); // Move para o slide calculado
        prevTranslate = -index * carousel.clientWidth;

        // Reativa a rolagem automática após um tempo
        setTimeout(() => {
            startAutoSlide();
        }, 3000); // Retorna a rolagem automática após 3 segundos

        // Para evitar que o carrossel avance rapidamente, reinicie o índice
        clearInterval(autoSlide); // Limpa o intervalo antes de reiniciar
        autoSlide = setInterval(moveToNextSlide, 30000); // Reinicia a rolagem automática
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }
});
