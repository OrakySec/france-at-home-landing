function startCountdown() {
    const timerElement = document.getElementById('countdown-timer');
    const bannerElement = document.getElementById('sticky-timer-banner');
    if (!timerElement) return;

    // Set to 5 minutes (300 seconds)
    const DURATION = 300; 
    let timeLeft;

    // Try to get existing end time from localStorage
    const endTime = localStorage.getItem('french_culinary_end_time');
    
    if (endTime) {
        timeLeft = Math.max(0, Math.floor((parseInt(endTime) - Date.now()) / 1000));
    } else {
        timeLeft = DURATION;
        localStorage.setItem('french_culinary_end_time', Date.now() + (DURATION * 1000));
    }

    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    updateDisplay();

    const interval = setInterval(() => {
        if (timeLeft <= 1) {
            timeLeft = 1; // Freeze at 1 second
            updateDisplay();
            clearInterval(interval);
            return;
        }
        timeLeft--;
        updateDisplay();
    }, 1000);
}

document.addEventListener('DOMContentLoaded', startCountdown);
