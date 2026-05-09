document.addEventListener('DOMContentLoaded', function () {

    document.querySelectorAll('.faq-question').forEach(item => {
        item.addEventListener('click', () => {
            // Verifica se o clique está sendo registrado
            console.log("Pergunta clicada: ", item.textContent);

            // Fecha todas as outras respostas antes de abrir a atual
            const allItems = document.querySelectorAll('.faq-item');
            allItems.forEach(el => {
                if (el !== item.parentNode) {
                    el.classList.remove('active');
                }
            });

            // Alterna a classe 'active' para abrir/fechar a resposta
            item.parentNode.classList.toggle('active');
        });
    });
});
