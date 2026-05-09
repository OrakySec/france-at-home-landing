const names = [
    "Michael", "Christopher", "Matthew", "Joshua", "Nicholas", "Andrew", "Tyler", "Brandon", "Ryan", "Eric",
    "Emily", "Madison", "Hannah", "Ashley", "Samantha", "Elizabeth", "Taylor", "Kayla", "Alexis", "Jessica"
];

const cities = [
    "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ", 
    "Philadelphia, PA", "San Antonio, TX", "San Diego, CA", "Dallas, TX", "San Jose, CA",
    "Austin, TX", "Jacksonville, FL", "Fort Worth, TX", "Columbus, OH", "Charlotte, NC"
];

function showNotification() {
    const notificationContainer = document.getElementById('notification-container');
    const name = names[Math.floor(Math.random() * names.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const time = Math.floor(Math.random() * 10) + 1;

    const notification = document.createElement('div');
    notification.className = 'notification';
    
    notification.innerHTML = `
        <div class="notification-img">
            <img src="assets/img/mockup.webp" alt="Ebook">
        </div>
        <div class="notification-content">
            <p class="notification-text"><strong>${name}</strong> from ${city}</p>
            <p class="notification-subtext">just purchased the eBook ${time}m ago</p>
        </div>
        <div class="notification-badge">
            <i class="fas fa-check-circle"></i>
        </div>
    `;

    notificationContainer.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 5000);
}

function activateNotifications() {
    // Show first notification after 3 seconds
    setTimeout(showNotification, 3000);
    
    // Then every 8-12 seconds
    setInterval(() => {
        showNotification();
    }, Math.random() * (12000 - 8000) + 8000);
}

window.addEventListener('load', activateNotifications);
