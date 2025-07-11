// popup.js

document.addEventListener('DOMContentLoaded', () => {
    const rovasPageBtn = document.getElementById('rovasPageBtn');
    const apiKeyInput = document.getElementById('apiKey');
    const tokenInput = document.getElementById('token');
    const saveBtn = document.getElementById('saveBtn');
    const configStatus = document.getElementById('configStatus');
    const langSelect = document.getElementById('langSelect');

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
        chrome.tabs.create({ url: 'https://rovas.app/openstreetmap' });
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

    function getPreferredLanguage(callback) {
        chrome.storage.sync.get(['userLang'], (result) => {
            if (result.userLang) {
                callback(result.userLang);
            } else {
                const browserLang = navigator.language.split('-')[0];
                const supported = ['en', 'hu'];
                callback(supported.includes(browserLang) ? browserLang : 'en');
            }
        });
    }

    function loadTranslations(lang, callback) {
        fetch(`locales/${lang}.json`)
            .then(res => res.json())
            .then(callback);
    }

    function updateUIText(t) {
        document.getElementById('titleText').textContent = t.title;
        document.getElementById('noteText').textContent = t.note;
        document.getElementById('infoText').textContent = t.info;
        document.getElementById('rovasPageBtn').textContent = t.open_rovas;
        document.getElementById('apiCredsTitle').textContent = t.api_creds_title;
        document.getElementById('apiKeyLabel').textContent = t.api_key_label;
        document.getElementById('tokenLabel').textContent = t.token_label;
        document.getElementById('saveBtn').textContent = t.save;
        document.getElementById('apiKey').placeholder = t.api_key_placeholder;
        document.getElementById('token').placeholder = t.token_placeholder;
    }

    langSelect.addEventListener('change', () => {
        const selectedLang = langSelect.value;
        chrome.storage.sync.set({ userLang: selectedLang }, () => {
            loadTranslations(selectedLang, updateUIText);
        });
    });

    getPreferredLanguage((lang) => {
        langSelect.value = lang;
        loadTranslations(lang, updateUIText);
    });
});