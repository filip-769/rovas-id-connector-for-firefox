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

    // Helper to get translation object synchronously (from last loaded)
    let lastTranslations = {};
    function getT() { return lastTranslations; }

    // Event listener for the "Open Rovas" button
    rovasPageBtn.addEventListener('click', () => {
        chrome.tabs.create({ url: 'https://rovas.app/openstreetmap' });
    });

    // Event listener for the "Save Credentials" button
    saveBtn.addEventListener('click', () => {
        const apiKey = apiKeyInput.value.trim();
        const token = tokenInput.value.trim();
        const t = getT();
        if (apiKey && token) {
            chrome.storage.sync.set({ rovasApiKey: apiKey, rovasToken: token }, () => {
                configStatus.textContent = t.status_credentials_saved || 'Credentials saved successfully!';
                configStatus.style.color = 'green';
                setTimeout(() => { configStatus.textContent = ''; }, 3000); // Clear message after 3 seconds
            });
        } else {
            configStatus.textContent = t.status_credentials_error || 'Please enter both API Key and Token.';
            configStatus.style.color = 'red';
        }
    });

    // Helper to get available locales from manifest
    async function getAvailableLocales() {
        try {
            const res = await fetch(chrome.runtime.getURL('locales/manifest.json'));
            const manifest = await res.json();
            if (manifest && Array.isArray(manifest.locales)) {
                return manifest.locales;
            }
        } catch (e) {}
        return ['en']; // fallback
    }

    // Get preferred language based on user setting or browser, using manifest
    async function getPreferredLanguage(callback) {
        const locales = await getAvailableLocales();
        chrome.storage.sync.get(['userLang'], (result) => {
            if (result.userLang && locales.includes(result.userLang)) {
                callback(result.userLang, locales);
            } else {
                const browserLang = navigator.language.split('-')[0];
                callback(locales.includes(browserLang) ? browserLang : locales[0], locales);
            }
        });
    }

    // Dynamically populate language selector
    function populateLanguageSelector(currentLang, translations, locales) {
        const langSelect = document.getElementById('langSelect');
        langSelect.innerHTML = '';
        locales.forEach(code => {
            const opt = document.createElement('option');
            opt.value = code;
            opt.id = 'langOpt_' + code;
            opt.textContent = translations['lang_' + code] || code;
            if (code === currentLang) opt.selected = true;
            langSelect.appendChild(opt);
        });
    }

    function updateUIText(t, locales) {
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
        document.getElementById('langLabel').textContent = t.language_label;
        populateLanguageSelector(langSelect.value, t, locales);
        lastTranslations = t;
    }

    langSelect.addEventListener('change', () => {
        const selectedLang = langSelect.value;
        chrome.storage.sync.set({ userLang: selectedLang }, () => {
            fetch(`locales/${selectedLang}.json`)
                .then(res => res.json())
                .then(t => getAvailableLocales().then(locales => updateUIText(t, locales)));
        });
    });

    getPreferredLanguage((lang, locales) => {
        langSelect.value = lang;
        fetch(`locales/${lang}.json`)
            .then(res => res.json())
            .then(t => updateUIText(t, locales));
    });
});