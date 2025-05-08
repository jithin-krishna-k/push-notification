// Service Worker Registration
if ('serviceWorker' in navigator && 'PushManager' in window) {
    window.addEventListener('load', async () => {
        try {
            // Use absolute path from root
            const swPath = '/sw.js';
            console.log('Attempting to register service worker at:', swPath);
            
            const registration = await navigator.serviceWorker.register(swPath, {
                scope: '/',
                updateViaCache: 'none'
            });
            
            console.log('Service Worker registered successfully:', registration);
            
            // Check if we have a subscription
            const subscription = await registration.pushManager.getSubscription();
            updateSubscriptionStatus(subscription);
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                path: '/sw.js'
            });
            updateStatus('Service Worker registration failed', false);
        }
    });
}

// Update UI based on subscription status
function updateSubscriptionStatus(subscription) {
    const subscribeButton = document.getElementById('subscribe');
    const unsubscribeButton = document.getElementById('unsubscribe');
    
    if (subscription) {
        subscribeButton.style.display = 'none';
        unsubscribeButton.style.display = 'inline-block';
        updateStatus('Subscribed to push notifications', true);
    } else {
        subscribeButton.style.display = 'inline-block';
        unsubscribeButton.style.display = 'none';
        updateStatus('Not subscribed to push notifications', false);
    }
}

// Update status message
function updateStatus(message, isSuccess) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.className = isSuccess ? 'success' : 'error';
}

// Subscribe to push notifications
document.getElementById('subscribe').addEventListener('click', async () => {
    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: 'BMRsYVHy8tMdSWHTP1dbey9X0RUAOYqd2xMWDkldBDAOCcbxjKikrdD00r8A2al2d9yzPvvp52L2oxfg4s5CbZc'
        });

        // Send subscription to server
        await fetch('/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(subscription)
        });

        updateSubscriptionStatus(subscription);
    } catch (error) {
        console.error('Subscription failed:', error);
        updateStatus('Failed to subscribe to push notifications', false);
    }
});

// Unsubscribe from push notifications
document.getElementById('unsubscribe').addEventListener('click', async () => {
    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        
        if (subscription) {
            await subscription.unsubscribe();
            await fetch('/api/unsubscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(subscription)
            });
        }

        updateSubscriptionStatus(null);
    } catch (error) {
        console.error('Unsubscription failed:', error);
        updateStatus('Failed to unsubscribe from push notifications', false);
    }
}); 