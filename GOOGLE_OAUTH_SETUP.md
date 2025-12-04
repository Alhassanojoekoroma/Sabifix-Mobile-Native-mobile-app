# Google OAuth Setup Guide for SabiFix

## Step 1: Configure Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select your existing project
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen if prompted:
   - User Type: **External**
   - App name: **SabiFix**
   - User support email: Your email
   - Developer contact: Your email
   - Save and continue through all steps

6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: **SabiFix Web Client**
   - Authorized redirect URIs: 
     - `https://dxzacrijxgykqorqiooe.supabase.co/auth/v1/callback`
     - (Replace `dxzacrijxgykqorqiooe` with your actual Supabase project reference ID)
   
7. Click **Create** and copy:
   - **Client ID** (looks like: `123456789-abc.apps.googleusercontent.com`)
   - **Client Secret** (looks like: `GOCSPX-abc123...`)

## Step 2: Configure Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Find **Google** in the list and click to expand
5. Enable Google provider
6. Paste your **Client ID** and **Client Secret** from Step 1
7. Click **Save**

## Step 3: Test the Integration

After I implement the code changes, you'll be able to:
1. Open the app
2. Tap "Continue with Google"
3. Sign in with your Google account
4. Get redirected back to the app

## Important Notes

- The redirect URI must match exactly what you configured in Google Cloud Console
- For mobile apps, Supabase handles the OAuth flow through a web browser
- Users will be redirected to Google, authenticate, then back to your app
