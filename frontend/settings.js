(function() {
    const isLocal = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' ||
                   window.location.port === '1234'; // Common dev server ports

    window.APP_CONFIG = {
        API_URL: isLocal 
            ? "http://localhost:7071/api"  // Local development
            : "https://equipmentmoveform-apeaatcga6b4akab.eastus2-01.azurewebsites.net/api" // Production
    };
})();
