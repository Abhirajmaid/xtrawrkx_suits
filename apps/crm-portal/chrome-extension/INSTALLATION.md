# Xtrawrkx CRM LinkedIn Extractor - Installation & Usage Guide

## Quick Start

### 1. Install the Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Navigate to and select the `apps/crm-portal/chrome-extension` folder
5. The extension will appear in your Chrome toolbar

### 2. Start Your CRM Portal

```bash
# Navigate to the CRM portal directory
cd apps/crm-portal

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

The CRM portal will be available at `http://localhost:3001`

### 3. Configure the Extension

1. Click the extension icon in your Chrome toolbar
2. Verify the CRM Endpoint is set to `http://localhost:3001`
3. Enable "Auto-extract on page load" if desired
4. Close the popup

### 4. Extract LinkedIn Data

#### Method 1: Automatic Extraction

1. Navigate to any LinkedIn profile (e.g., `https://linkedin.com/in/someone`)
2. The extension will automatically extract data after page load
3. Click the extension icon to review and send data to CRM

#### Method 2: Manual Extraction

1. Navigate to any LinkedIn profile
2. Click the floating "Extract to CRM" button on the page
3. Or click the extension icon and then "Extract Profile Data"
4. Review the extracted data and click "Send to CRM"

## What Data is Extracted

✅ **Successfully Extracted:**

- Full name
- Job title
- Company name
- Location
- Profile image URL
- LinkedIn profile URL
- About/summary section
- Work experience (up to 10 positions)
- Education (up to 5 institutions)
- Skills (up to 20 skills)
- Connection count (if visible)

❌ **Not Available:**

- Email addresses (LinkedIn doesn't expose these publicly)
- Phone numbers (LinkedIn doesn't expose these publicly)
- Private profile information

## Using with the CRM

Once data is sent to the CRM:

1. **View Contacts**: Navigate to `http://localhost:3001/contacts`
2. **Manage Contacts**: Edit, delete, or add notes to extracted contacts
3. **Track Activity**: View contact timeline and interactions
4. **Create Deals**: Convert contacts to deals and opportunities

## Troubleshooting

### Extension Not Working

- Ensure you're on a LinkedIn profile page (`linkedin.com/in/...`)
- Refresh the page and try again
- Check Chrome's extension permissions

### CRM Integration Issues

- Verify CRM portal is running at `http://localhost:3001`
- Check browser console (F12) for error messages
- Ensure no firewall is blocking localhost connections

### Data Not Extracting

- LinkedIn may have changed their page structure
- Some profiles have limited public information
- Try different LinkedIn profiles to test

### Common Error Messages

**"Navigate to a LinkedIn profile to extract data"**

- You're not on a LinkedIn profile page
- Make sure the URL contains `linkedin.com/in/`

**"Network connection error"**

- CRM portal is not running
- Check if `http://localhost:3001` is accessible

**"Contact with this LinkedIn profile already exists"**

- This contact was already imported
- Check your CRM contacts to see the existing entry

## Development Notes

### File Structure

```
chrome-extension/
├── manifest.json     # Extension configuration
├── content.js        # LinkedIn page scraper
├── popup.html        # Extension popup UI
├── popup.js          # Popup functionality
├── background.js     # Background service worker
├── crm-api.js       # CRM integration
├── validation.js     # Data validation
└── icons/           # Extension icons (placeholder)
```

### API Endpoints

The extension uses these CRM API endpoints:

- `POST /api/contacts` - Create new contact
- `GET /api/contacts?linkedin=...` - Check for duplicates
- `GET /api/users` - Get contact owners
- `GET /api/health` - Health check

### Testing Different Profiles

Try the extension on various LinkedIn profiles:

- Public profiles (most data available)
- Private profiles (limited data)
- Company executives (rich experience data)
- Recent graduates (education focus)

## Security & Privacy

- ✅ All data processing happens locally in your browser
- ✅ Data is sent directly to your local CRM (localhost)
- ✅ No data is sent to external services
- ✅ No permanent storage of personal data
- ✅ Respects LinkedIn's public data only

## Next Steps

1. **Customize the CRM**: Modify the CRM portal to match your business needs
2. **Add More Fields**: Extend the extraction to capture additional LinkedIn data
3. **Integrate with Real Database**: Replace mock data with actual database storage
4. **Deploy to Production**: Set up proper hosting for your CRM system
5. **Publish Extension**: Submit to Chrome Web Store for team distribution

## Support

For issues or questions:

1. Check the browser console (F12) for error messages
2. Review the CRM portal logs
3. Test with different LinkedIn profiles
4. Verify all services are running correctly

Happy extracting! 🚀


