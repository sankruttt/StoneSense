# WhatsApp Integration Setup Guide

This guide will help you set up WhatsApp messaging for sending PDF reports using Twilio.

## Prerequisites
- A Twilio account (sign up at https://www.twilio.com)
- A phone number with WhatsApp Business API access

## Setup Steps

### 1. Create a Twilio Account
1. Go to https://www.twilio.com/try-twilio
2. Sign up for a free account
3. Verify your phone number

### 2. Get Your Twilio Credentials
1. From your Twilio Dashboard, copy:
   - Account SID
   - Auth Token
2. Add these to your `.env` file:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid_here
   TWILIO_AUTH_TOKEN=your_auth_token_here
   ```

### 3. Set Up WhatsApp Sandbox (Development)
For testing purposes, Twilio provides a WhatsApp Sandbox:

1. In your Twilio Console, go to **Messaging** > **Try it out** > **Send a WhatsApp message**
2. Follow the instructions to join the sandbox by sending a WhatsApp message to the Twilio number
3. Copy the sandbox number (format: `whatsapp:+14155238886`)
4. Add it to your `.env` file:
   ```
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   ```

### 4. Production Setup (Optional)
For production use:
1. Apply for WhatsApp Business API access through Twilio
2. Get your own WhatsApp Business number
3. Update the `TWILIO_WHATSAPP_NUMBER` in your `.env` file

### 5. Media Attachments (PDF Reports)
Twilio requires media files to be accessible via a public URL. You have two options:

#### Option A: Local Testing with ngrok
1. Install ngrok: `brew install ngrok` (macOS) or download from https://ngrok.com
2. Run ngrok to expose your local server:
   ```bash
   ngrok http 5001
   ```
3. Copy the HTTPS URL provided by ngrok (e.g., `https://abc123.ngrok.io`)
4. Add the ngrok URL to your `.env` file:
   ```
   BASE_URL=https://abc123.ngrok.io
   ```
5. Restart your Flask server
6. PDFs will now be sent as WhatsApp media attachments!

**Note**: The ngrok URL changes each time you restart ngrok (unless you have a paid plan). Update BASE_URL each time you restart ngrok.

#### Option B: Cloud Storage (Recommended for Production)
Upload generated PDFs to cloud storage before sending:
- **AWS S3**: Use boto3 to upload and get public URL
- **Google Cloud Storage**: Use google-cloud-storage library
- **Cloudinary**: Use cloudinary library for media storage

### 6. Update Profile with WhatsApp Number
1. Log in to your account
2. Go to Profile
3. Add your WhatsApp number with country code (e.g., +1234567890)
4. Save your profile

### 7. Send a Report
1. Upload and analyze a kidney stone image
2. Click "Send to WhatsApp" button
3. You'll receive the PDF report on your WhatsApp

## Testing
To test the feature:
1. Make sure you've joined the Twilio Sandbox (Step 3)
2. Add your phone number to your profile (with country code)
3. Upload a test image and get results
4. Click "Send to WhatsApp"
5. Check your WhatsApp for the message

## Troubleshooting

### Error: "Twilio credentials not configured"
- Make sure your `.env` file contains all three Twilio variables
- Restart the Flask server after updating `.env`

### Error: "Failed to send report to WhatsApp"
- Verify you've joined the Twilio Sandbox
- Check that your phone number is in international format (+1234567890)
- Ensure your Twilio account has credits (free trial includes credits)

### Message sent but PDF not attached
- For local testing, you need to use ngrok or host the PDF publicly
- The current implementation sends the message with text only
- To include PDF, implement cloud storage upload first

## Cost
- Twilio Sandbox: Free for testing
- WhatsApp messages: $0.005 - $0.10 per message (varies by country)
- Free trial includes credits for testing

## Security Notes
- Never commit your `.env` file to version control
- Keep your Twilio Auth Token secret
- Use environment variables for all sensitive credentials
- For production, implement rate limiting on the API endpoint

## Additional Resources
- [Twilio WhatsApp Quickstart](https://www.twilio.com/docs/whatsapp/quickstart/python)
- [WhatsApp Business API](https://www.twilio.com/docs/whatsapp/api)
- [Twilio Python Helper Library](https://www.twilio.com/docs/libraries/python)
