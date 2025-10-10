# Xtrawrkx CRM LinkedIn Extractor

A Chrome extension that extracts LinkedIn profile data and integrates with the Xtrawrkx CRM system.

## Features

- **One-Click Extraction**: Extract LinkedIn profile data with a single click
- **Smart Data Parsing**: Automatically extracts name, job title, company, location, experience, education, and skills
- **CRM Integration**: Seamlessly sends extracted data to your Xtrawrkx CRM
- **Data Validation**: Validates and cleans extracted data before sending to CRM
- **Duplicate Detection**: Checks for existing contacts to prevent duplicates
- **Customizable Settings**: Configure CRM endpoint and extraction preferences
- **Auto-Extraction**: Optionally extract data automatically when visiting LinkedIn profiles

## Installation

### Development Installation

1. Clone the repository and navigate to the extension directory:

   ```bash
   cd apps/crm-portal/chrome-extension
   ```

2. Open Chrome and go to `chrome://extensions/`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked" and select the extension directory

5. The extension should now appear in your Chrome toolbar

### Production Installation

1. Download the extension package from the Chrome Web Store (coming soon)
2. Follow the standard Chrome extension installation process

## Setup

1. **Configure CRM Endpoint**:

   - Click the extension icon in your Chrome toolbar
   - Set your CRM endpoint URL (default: `http://localhost:3001`)
   - Ensure your CRM system is running and accessible

2. **Set Preferences**:
   - Enable/disable auto-extraction on LinkedIn profiles
   - Configure default contact owner and tags

## Usage

### Manual Extraction

1. Navigate to any LinkedIn profile page
2. Click the floating "Extract to CRM" button on the page, or click the extension icon
3. Click "Extract Profile Data" in the popup
4. Review the extracted data
5. Configure lead source, owner, and tags
6. Click "Send to CRM" to add the contact

### Auto-Extraction

1. Enable auto-extraction in the extension settings
2. Navigate to any LinkedIn profile page
3. The extension will automatically extract data after the page loads
4. Use the popup to review and send data to CRM

## Extracted Data

The extension extracts the following information from LinkedIn profiles:

### Basic Information

- Full name
- Job title
- Company
- Location
- Profile image
- Profile URL

### Professional Details

- About/summary section
- Work experience (up to 10 positions)
- Education (up to 5 institutions)
- Skills (up to 20 skills)
- Connection count

### Additional Data

- Industry (when available)
- Company information
- Social media links

## CRM Integration

### API Endpoints

The extension integrates with your CRM through REST API endpoints:

- `POST /api/contacts` - Create new contact
- `GET /api/contacts/check-duplicate` - Check for duplicates
- `GET /api/users` - Get contact owners
- `GET /api/health` - Test connection

### Data Format

Contacts are sent to the CRM in the following format:

```json
{
  "name": "John Doe",
  "jobTitle": "Software Engineer",
  "company": "Tech Corp",
  "email": null,
  "phone": null,
  "status": "prospect",
  "owner": "Jane Smith",
  "tags": ["linkedin", "hot-lead"],
  "leadSource": "linkedin",
  "decisionRole": "user",
  "location": "San Francisco, CA",
  "profileUrl": "https://linkedin.com/in/johndoe",
  "socialProfiles": {
    "linkedin": "https://linkedin.com/in/johndoe"
  },
  "experience": [...],
  "education": [...],
  "skills": [...],
  "customFields": {
    "connections": "500+",
    "extractedAt": "2024-01-15T10:30:00Z"
  }
}
```

## Configuration

### Extension Settings

- **CRM Endpoint**: URL of your CRM system
- **Auto-Extract**: Automatically extract data on LinkedIn profiles
- **Default Owner**: Default contact owner for new contacts
- **Default Tags**: Default tags to apply to extracted contacts

### CRM System Requirements

Your CRM system should:

1. **Accept CORS requests** from Chrome extensions
2. **Provide REST API endpoints** for contact management
3. **Handle contact creation** with the expected data format
4. **Support duplicate checking** (optional but recommended)

### Example CRM API Implementation

```javascript
// POST /api/contacts
app.post("/api/contacts", async (req, res) => {
  try {
    const contact = await createContact(req.body);
    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET /api/contacts/check-duplicate
app.get("/api/contacts/check-duplicate", async (req, res) => {
  const { email, linkedin } = req.query;
  const isDuplicate = await checkDuplicate(email, linkedin);
  res.json({ isDuplicate });
});
```

## Troubleshooting

### Common Issues

1. **Extension not working on LinkedIn**:

   - Ensure you're on a LinkedIn profile page (`linkedin.com/in/...`)
   - Refresh the page and try again
   - Check if the extension has necessary permissions

2. **CRM integration failing**:

   - Verify your CRM endpoint URL is correct
   - Ensure your CRM system is running and accessible
   - Check browser console for network errors
   - Verify CORS settings on your CRM system

3. **Data extraction incomplete**:

   - LinkedIn may have changed their page structure
   - Some profile information may be private
   - Try refreshing the page and extracting again

4. **Permission errors**:
   - Ensure the extension has permission to access LinkedIn
   - Check Chrome's extension permissions settings

### Debug Information

The extension logs debug information to:

- Browser console (F12 → Console)
- Chrome storage (viewable in extension popup)
- Background service worker logs

### Error Reporting

Errors are automatically logged and can be viewed in the extension popup. To report issues:

1. Open the extension popup
2. Note any error messages
3. Check the browser console for additional details
4. Contact support with the error information

## Privacy & Security

- **No data storage**: The extension doesn't store personal data permanently
- **Local processing**: All data extraction happens locally in your browser
- **Secure transmission**: Data is sent directly to your CRM system
- **No third-party services**: No data is sent to external services

## Development

### File Structure

```
chrome-extension/
├── manifest.json          # Extension manifest
├── content.js            # LinkedIn page content script
├── content.css           # Content script styles
├── popup.html            # Extension popup UI
├── popup.js              # Popup functionality
├── popup.css             # Popup styles
├── background.js         # Background service worker
├── crm-api.js           # CRM API integration
├── validation.js         # Data validation utilities
└── icons/               # Extension icons
```

### Building

The extension is built with vanilla JavaScript and doesn't require a build process. Simply load the directory in Chrome's developer mode.

### Testing

1. **Manual Testing**:

   - Test on various LinkedIn profiles
   - Verify data extraction accuracy
   - Test CRM integration with your system

2. **API Testing**:
   - Use the browser's network tab to inspect API calls
   - Test with different CRM endpoints
   - Verify error handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This extension is part of the Xtrawrkx CRM system and is subject to the project's license terms.

## Support

For support and questions:

- Check the troubleshooting section above
- Review browser console errors
- Contact the development team with detailed error information


