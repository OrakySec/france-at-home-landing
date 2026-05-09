let satisfactionNumber = 2547; // Valor inicial
const targetElement = document.querySelector('.satisfaction-number');

function increaseNumber() {
    const randomIncrement = Math.floor(Math.random() * 6) + 1; // Gera um número aleatório entre 1 e 5
    satisfactionNumber += randomIncrement; // Aumenta o número pelo valor aleatório
    targetElement.textContent = satisfactionNumber.toLocaleString(); // Atualiza o texto
}

// Aumenta o número a cada 100 milissegundos
setInterval(increaseNumber, 6000);

// Inicia a animação
increaseNumber();
