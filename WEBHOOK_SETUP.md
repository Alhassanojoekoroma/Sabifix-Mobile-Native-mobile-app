# Monime Webhook Setup Guide

## Webhook URL

For **production**, your webhook URL will be:
```
https://YOUR_DOMAIN.com/api/webhooks/monime
```

For **local development/testing**, you need to expose your local server:

### Option 1: Using ngrok (Recommended for testing)

1. Install ngrok: https://ngrok.com/download
2. Start your Expo server: `npx expo start`
3. In a new terminal, run:
   ```bash
   ngrok http 8081
   ```
4. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
5. Your webhook URL will be: `https://abc123.ngrok.io/api/webhooks/monime`

### Option 2: Deploy to Vercel/Netlify

1. Deploy your app to a hosting service
2. Use the production URL + `/api/webhooks/monime`

## Setting up in Monime Dashboard

1. Go to https://sabifix.monime.space/developer/webhooks
2. Click "Create Webhook"
3. **Name**: `SabiFix Payment Notifications`
4. **URL**: Enter your webhook URL from above
5. **Verification Method**: Select `HMAC-SHA256`
6. **Events to listen for**:
   - ✅ `checkout_session.completed`
   - ✅ `checkout_session.cancelled`  
   - ✅ `payment.succeeded`
   - ✅ `payment.failed`
   - ✅ `payment.created`
   - ✅ `payment_code.completed`

7. Click "Create"
8. **Save the Secret Key** - you'll need this for verification

## Add Webhook Secret to .env

After creating the webhook, add the secret to your `.env` file:

```bash
MONIME_WEBHOOK_SECRET=your_webhook_secret_here
```

## Testing the Webhook

1. Make a test donation in your app
2. Check the Monime dashboard webhook logs
3. Verify the sponsorship status updates in your Supabase database

## Troubleshooting

- **Webhook not receiving events**: Check that your URL is publicly accessible
- **Signature verification failing**: Ensure the webhook secret matches
- **Events not processing**: Check your server logs for errors

## Current Webhook URL for Screenshot

Based on your screenshot, use this URL in the Monime dashboard:
```
https://YOUR_NGROK_URL/api/webhooks/monime
```

Replace `YOUR_NGROK_URL` with your actual ngrok URL.
