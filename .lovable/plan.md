
**Complete Google OAuth Setup Plan**

1. **Create Google Cloud Project & OAuth Credentials**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing one
   - Enable Google+ API 
   - Create OAuth 2.0 Client ID with these exact settings:
     - Application type: Web application
     - Authorized JavaScript origins: 
       - `https://4793b004-df39-4961-9420-637a768fb842.lovableproject.com`
       - `http://localhost:5173`
     - Authorized redirect URIs:
       - `https://hbglijscxqefdwpxodbh.supabase.co/auth/v1/callback`

2. **Configure Supabase Google Provider**:
   - Go to Supabase Dashboard → Authentication → Providers → Google
   - Enable the Google provider
   - Add your Client ID and Client Secret from step 1
   - Save configuration

3. **Set Supabase URLs**:
   - Go to Authentication → URL Configuration
   - Set Site URL: `https://4793b004-df39-4961-9420-637a768fb842.lovableproject.com`
   - Add Redirect URLs:
     - `https://4793b004-df39-4961-9420-637a768fb842.lovableproject.com/**`
     - `http://localhost:5173/**`

4. **Test Google Sign-In**: The button should work without errors

The code implementation is already perfect - you just need the Google OAuth configuration!
