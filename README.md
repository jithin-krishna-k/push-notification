# Push Notification Demo

This is a complete working example of a web application that implements push notifications using the Push API and Service Workers.

## Prerequisites

- Node.js (v14 or higher)
- A modern web browser that supports Service Workers and Push API (Chrome, Firefox, Edge)

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Generate VAPID keys:
   ```bash
   npx web-push generate-vapid-keys
   ```

4. Create a `.env` file in the root directory with the following content:
   ```
   VAPID_PUBLIC_KEY=your_public_key
   VAPID_PRIVATE_KEY=your_private_key
   ```

5. Update the `mailto` address in `server.js` with your email address

6. Start the server:
   ```bash
   npm start
   ```

7. Open `http://localhost:3000` in your browser

## Testing

1. Click the "Subscribe to Push Notifications" button
2. Allow notifications when prompted by your browser
3. To test sending a notification, use curl or Postman to send a POST request to `http://localhost:3000/api/send-notification` with the following body:
   ```json
   {
     "title": "Test Notification",
     "body": "This is a test notification",
     "url": "http://localhost:3000"
   }
   ```

## Features

- Service Worker registration
- Push subscription management
- Background notification delivery
- Click handling for notifications
- Server-side notification sending
- Subscription management API

## Notes

- This is a development setup. For production, you should:
  - Use a proper database to store subscriptions
  - Implement proper security measures
  - Use HTTPS (required for push notifications in production)
  - Add error handling and logging
  - Implement proper subscription cleanup

## Troubleshooting

1. If notifications don't work:
   - Check browser console for errors
   - Verify VAPID keys are correctly set
   - Ensure the service worker is registered
   - Check if notifications are allowed in browser settings

2. If subscription fails:
   - Verify the server is running
   - Check if the browser supports push notifications
   - Ensure you're using HTTPS or localhost 