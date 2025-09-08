# Equipment Move Form

A web application for collecting equipment move data with Azure Functions backend integration to Power Automate.

## Project Structure

```
equipmentMoveForm/
├── frontend/          # HTML, CSS, and vanilla JavaScript web form
│   ├── index.html     # Main form HTML
│   ├── styles.css     # Styling for the form
│   └── script.js      # Form logic and Azure Function integration
├── backend/           # Azure Functions backend
│   ├── submitEquipmentMove/  # HTTP trigger function
│   │   ├── function.json     # Function configuration
│   │   └── index.js          # Function logic
│   ├── package.json          # Node.js dependencies
│   ├── host.json             # Azure Functions host configuration
│   ├── local.settings.json   # Local development settings
│   └── .gitignore
└── README.md
```

## Features

- **Frontend Form**: Collects user name, equipment unit number, move date, equipment hours, and photos
- **File Upload**: Supports multiple image uploads with validation
- **Azure Functions Backend**: HTTP trigger function that processes form data
- **Power Automate Integration**: Sends structured data to Power Automate for workflow processing
- **Responsive Design**: Works on desktop and mobile devices
- **Form Validation**: Client-side and server-side validation

## Setup Instructions

### Prerequisites

1. [Node.js](https://nodejs.org/) (v18 or v20)
2. [Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local)
3. [Azure Account](https://azure.microsoft.com/free/) (for deployment)

### Local Development

#### Backend Setup

1. Navigate to the backend folder:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Update `local.settings.json`:

   - Replace `POWER_AUTOMATE_WEBHOOK_URL` with your actual Power Automate flow webhook URL
   - Keep other settings as-is for local development

4. Start the Azure Functions runtime:

   ```bash
   npm start
   ```

   The function will be available at: `http://localhost:7071/api/submitEquipmentMove`

#### Frontend Setup

1. Navigate to the frontend folder:

   ```bash
   cd frontend
   ```

2. Update `script.js` configuration:

   - For local development, the `AZURE_FUNCTION_URL` is already set to `http://localhost:7071/api/submitEquipmentMove`
   - For production, update this to your deployed Azure Function URL

3. Serve the frontend files using a local web server:

   ```bash
   # Using Python (if installed)
   python -m http.server 8000

   # Or using Node.js live-server (install with: npm install -g live-server)
   live-server

   # Or using any other static file server
   ```

4. Open your browser to `http://localhost:8000` (or the port your server uses)

### Power Automate Flow Setup

1. Go to [Power Automate](https://flow.microsoft.com/)
2. Create a new flow with an HTTP trigger
3. Copy the webhook URL from the trigger
4. Update the `POWER_AUTOMATE_WEBHOOK_URL` in your Azure Function settings

#### Expected Data Structure

Your Power Automate flow will receive data in this format:

```json
{
  "submissionId": "EM-1640995200000-ABC123",
  "timestamp": "2023-12-31T12:00:00.000Z",
  "userDetails": {
    "name": "John Doe"
  },
  "equipmentDetails": {
    "unitNumber": "EQ-001",
    "moveDate": "2023-12-31",
    "hours": 1250.5,
    "notes": "Additional notes about the move"
  },
  "photos": [
    {
      "name": "equipment-photo.jpg",
      "type": "image/jpeg",
      "size": 1024000,
      "data": "base64EncodedImageData..."
    }
  ],
  "metadata": {
    "submittedAt": "2023-12-31T12:00:00.000Z",
    "source": "Equipment Move Form",
    "version": "1.0"
  }
}
```

## Deployment

### Deploy Azure Function

1. Install Azure Functions Core Tools if not already installed
2. Login to Azure:

   ```bash
   az login
   ```

3. Create a Function App in Azure Portal or using CLI:

   ```bash
   az functionapp create --resource-group myResourceGroup --consumption-plan-location westus --runtime node --runtime-version 18 --functions-version 4 --name myEquipmentMoveFunction --storage-account mystorageaccount
   ```

4. Deploy the function:

   ```bash
   cd backend
   func azure functionapp publish myEquipmentMoveFunction
   ```

5. Configure application settings:
   ```bash
   az functionapp config appsettings set --name myEquipmentMoveFunction --resource-group myResourceGroup --settings "POWER_AUTOMATE_WEBHOOK_URL=https://your-power-automate-webhook-url"
   ```

### Deploy Frontend

You can deploy the frontend to any static hosting service:

- **Azure Static Web Apps**
- **GitHub Pages**
- **Netlify**
- **Vercel**
- **AWS S3 + CloudFront**

Before deploying, update the `AZURE_FUNCTION_URL` in `script.js` to point to your deployed Azure Function.

## Configuration

### Environment Variables (Backend)

- `POWER_AUTOMATE_WEBHOOK_URL`: The webhook URL for your Power Automate flow
- `AzureWebJobsStorage`: Azure storage connection string (set automatically in Azure)
- `FUNCTIONS_WORKER_RUNTIME`: Set to "node"

### Frontend Configuration

Update the `CONFIG` object in `script.js`:

```javascript
const CONFIG = {
  AZURE_FUNCTION_URL:
    "https://your-function-app.azurewebsites.net/api/submitEquipmentMove",
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/gif"],
};
```

## Security Considerations

1. **CORS**: The function is currently configured to allow all origins (`*`). For production, consider restricting this to your specific domain.

2. **Authentication**: The function uses `authLevel: "anonymous"`. For production, consider implementing proper authentication.

3. **File Size Limits**: Currently set to 10MB per file. Adjust based on your needs.

4. **Input Validation**: Both client-side and server-side validation are implemented.

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure CORS is properly configured in the Azure Function
2. **File Upload Failures**: Check file size and type restrictions
3. **Power Automate Not Receiving Data**: Verify the webhook URL is correct and the flow is enabled

### Logs

- Azure Function logs are available in the Azure Portal under your Function App
- Browser console logs show frontend errors
- Use `func start` with verbose logging for local debugging

## License

MIT License - see LICENSE file for details
web app form to gather information for equipment moves
