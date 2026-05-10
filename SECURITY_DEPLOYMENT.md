# Wedding RSVP Security - Deployment Instructions

## Security Improvements Implemented

### 1. Secret Token Protection
- Added secret token validation in both frontend and Google Apps Script
- Prevents unauthorized access to your Google Sheets
- Token: `wedding_secret_2026` (change to a strong random secret in production)

### 2. Honeypot Spam Protection
- Added hidden `website` field to detect and block bot submissions
- Bots that fill hidden fields are silently rejected
- No user-visible impact

### 3. Submit Cooldown / Rate Limiting
- 10-second cooldown between submissions
- Prevents rapid repeated submissions from the same user
- User-friendly error message

### 4. Strong Input Validation
- **Name**: 2-100 characters, prevents empty/whitespace-only, rejects numbers-only
- **Members**: 1-20, validates integer values
- **Note**: Max 500 characters, prevents huge payloads
- **Events**: At least one event must be selected

### 5. Environment Variable Configuration
- Google Script URL moved to `.env` file
- Secret token moved to `.env` file
- `.env` file excluded from git via `.gitignore`

### 6. Improved Error Handling
- Timeout handling (15-second timeout)
- Network error detection
- User-friendly toast messages
- Retry-safe UX

### 7. Google Apps Script Security
- Secret token validation on server side
- Rejects empty requests
- Validates required fields (name, members)
- Validates member count (1-20)
- Removed production console logs

## Deployment Steps

### Frontend Deployment

1. **Update Environment Variables** (if needed)
   - Edit `.env` file
   - Change `VITE_SECRET_TOKEN` to a strong, random secret
   - Ensure `VITE_GOOGLE_SCRIPT_URL` is correct

2. **Build the Application**
   ```bash
   npm run build
   ```

3. **Deploy to Hosting**
   - Deploy the `dist` folder to your hosting provider (Vercel, Netlify, etc.)
   - Ensure the deployed site can access the Google Apps Script URL

### Google Apps Script Redeployment (CRITICAL)

**You MUST redeploy the Google Apps Script after updating the code.**

1. **Open Google Apps Script Editor**
   - Go to your Google Apps Script project
   - Replace the entire code with the updated `google-apps-script-template.js`

2. **Update Secret Token** (if changed)
   - Change `const SECRET_TOKEN = "wedding_secret_2026";` to match your new secret
   - Must match `VITE_SECRET_TOKEN` in your `.env` file

3. **Redeploy the Web App**
   - Click **Deploy** → **Manage deployments**
   - Click the **pencil icon** (Edit) on your existing deployment
   - Click **Deploy**
   - Use:
     - **Execute as**: Me (your email)
     - **Who has access**: Anyone

4. **Copy the New Web App URL**
   - After deployment, copy the new URL
   - Update `VITE_GOOGLE_SCRIPT_URL` in your `.env` file
   - Rebuild and redeploy your frontend

5. **Test the RSVP Form**
   - Submit a test RSVP
   - Check your Google Sheet to verify it appears
   - Try submitting without the token (should fail)
   - Try submitting with invalid data (should fail)

## Security Best Practices

### Production Recommendations

1. **Change the Secret Token**
   - Replace `wedding_secret_2026` with a strong, random secret
   - Use at least 32 characters with mixed case, numbers, and symbols
   - Example: `W3dd1ng_S3cr3t_2026!@#R4nd0mK3y`

2. **Monitor Your Google Sheet**
   - Regularly check for suspicious submissions
   - Look for patterns (same IP, rapid submissions, invalid names)

3. **Keep the Token Secret**
   - Never commit `.env` to git (already protected by `.gitignore`)
   - Never share the token publicly
   - Rotate the token periodically if needed

4. **Backup Your Google Sheet**
   - Enable version history in Google Sheets
   - Export regularly as CSV/Excel

## File Changes Summary

### Modified Files
- `src/components/RSVP.tsx` - Added security features
- `google-apps-script-template.js` - Added server-side validation
- `.env` - Added secret token

### New Files
- `.gitignore` - Protects environment variables

## Troubleshooting

### RSVP submissions failing
- Check that the secret token matches in both frontend and Apps Script
- Verify the Google Script URL is correct
- Ensure the Apps Script is redeployed with new code
- Check browser console for error messages

### Unauthorized error
- Secret token mismatch between frontend and Apps Script
- Apps Script not redeployed with new code
- Environment variable not loaded correctly

### Timeout errors
- Check internet connection
- Google Apps Script may be slow (try again)
- Consider increasing timeout in `RSVP.tsx` (line 140)

## Contact
If you encounter issues, verify:
1. Secret token matches in both places
2. Apps Script is redeployed
3. Environment variables are set correctly
4. Google Sheet permissions are correct
