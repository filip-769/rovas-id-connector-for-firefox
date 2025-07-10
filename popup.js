// popup.js

document.addEventListener('DOMContentLoaded', () => {
    const rovasPageBtn = document.getElementById('rovasPageBtn');
    const apiKeyInput = document.getElementById('apiKey');
    const tokenInput = document.getElementById('token');
    const saveBtn = document.getElementById('saveBtn');
    const configStatus = document.getElementById('configStatus');

    // Load credentials when the popup opens
    chrome.storage.sync.get(['rovasApiKey', 'rovasToken'], (result) => {
        if (result.rovasApiKey) {
            apiKeyInput.value = result.rovasApiKey;
        }
        if (result.rovasToken) {
            tokenInput.value = result.rovasToken;
        }
    });

    // Event listener for the "Open Rovas" button
    rovasPageBtn.addEventListener('click', () => {
        chrome.tabs.create({ url: 'https://rovas.app/openstreetmap' }); // Or the specific project page
    });

    // Event listener for the "Save Credentials" button
    saveBtn.addEventListener('click', () => {
        const apiKey = apiKeyInput.value.trim();
        const token = tokenInput.value.trim();

        if (apiKey && token) {
            chrome.storage.sync.set({ rovasApiKey: apiKey, rovasToken: token }, () => {
                configStatus.textContent = 'Credentials saved successfully!';
                configStatus.style.color = 'green';
                setTimeout(() => { configStatus.textContent = ''; }, 3000); // Clear message after 3 seconds
            });
        } else {
            configStatus.textContent = 'Please enter both API Key and Token.';
            configStatus.style.color = 'red';
        }
    });
});