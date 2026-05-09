document.addEventListener("DOMContentLoaded", function() {
    // Check if consent was already given
    if (!localStorage.getItem('cookieConsent')) {
        // Create the banner
        var banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.innerHTML = `
            <div class="cookie-content">
                <p>We use cookies to improve your experience and deliver personalized advertising. By clicking "Accept All", you agree to our use of cookies and to the sharing of data with our advertising partners in compliance with EEA regulations.</p>
                <div class="cookie-buttons">
                    <button id="cookie-accept" class="cookie-btn cookie-accept">Accept All</button>
                    <button id="cookie-reject" class="cookie-btn cookie-reject">Reject Non-Essential</button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);

        // Accept Cookies
        document.getElementById('cookie-accept').addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'granted');
            banner.style.display = 'none';
            
            // Update Google Consent Mode v2
            if(typeof gtag === 'function') {
                gtag('consent', 'update', {
                    'ad_storage': 'granted',
                    'ad_user_data': 'granted',
                    'ad_personalization': 'granted',
                    'analytics_storage': 'granted'
                });
            }
        });

        // Reject Cookies
        document.getElementById('cookie-reject').addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'denied');
            banner.style.display = 'none';
        });
    } else if (localStorage.getItem('cookieConsent') === 'granted') {
        // If already granted, update consent on page load
        if(typeof gtag === 'function') {
            gtag('consent', 'update', {
                'ad_storage': 'granted',
                'ad_user_data': 'granted',
                'ad_personalization': 'granted',
                'analytics_storage': 'granted'
            });
        }
    }
});
