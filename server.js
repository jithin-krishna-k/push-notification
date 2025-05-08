require('dotenv').config();
const express = require('express');
const webpush = require('web-push');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// VAPID keys should be generated and stored in environment variables
const vapidKeys = {
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY
};

webpush.setVapidDetails(
    'mailto:test@example.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

// Store subscriptions (in a real app, use a database)
let subscriptions = [];

// Routes
app.post('/api/subscribe', (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);
    res.status(201).json({});
});

app.post('/api/unsubscribe', (req, res) => {
    const subscription = req.body;
    subscriptions = subscriptions.filter(sub => 
        sub.endpoint !== subscription.endpoint
    );
    res.status(200).json({});
});

// Send a test notification
app.post('/api/send-notification', async (req, res) => {
    const { title, body, url } = req.body;
    
    const notificationPayload = {
        title,
        body,
        url: url || 'http://localhost:3000'
    };

    const promises = subscriptions.map(subscription =>
        webpush.sendNotification(
            subscription,
            JSON.stringify(notificationPayload)
        ).catch(error => {
            console.error(error);
            if (error.statusCode === 410) {
                // Remove invalid subscription
                subscriptions = subscriptions.filter(sub => 
                    sub.endpoint !== subscription.endpoint
                );
            }
        })
    );

    try {
        await Promise.all(promises);
        res.status(200).json({ message: 'Notifications sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send notifications' });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 