// popup.js

document.addEventListener('DOMContentLoaded', () => {
    const rovasPageBtn = document.getElementById('rovasPageBtn');
    const apiKeyInput = document.getElementById('apiKey');
    const tokenInput = document.getElementById('token');
    const saveBtn = document.getElementById('saveBtn');
    const configStatus = document.getElementById('configStatus');
    const langSelect = document.getElementById('langSelect');
    const tempBanner = document.getElementById('tempBanner');
    const tempBannerText = document.getElementById('tempBannerText');
    const companyWorkCheckbox = document.getElementById('companyWorkCheckbox');
    const companyWorkLabel = document.getElementById('companyWorkLabel');

    // Load credentials when the popup opens
    chrome.storage.sync.get(['rovasApiKey', 'rovasToken', 'isCompanyWork'], (result) => { // added checkbox
        if (result.rovasApiKey) {
            apiKeyInput.value = result.rovasApiKey;
        }
        if (result.rovasToken) {
            tokenInput.value = result.rovasToken;
        }
		companyWorkCheckbox.checked = result.isCompanyWork !== undefined ? result.isCompanyWork : false;
    });

    // Helper to get translation object synchronously (from last loaded)
    let lastTranslations = {};
    function getT() { return lastTranslations; }

    // Load temporary credentials from storage.local
    function loadTempCreds() {
        chrome.storage.local.get(['tempApiKey', 'tempToken'], (result) => {
            if (result.tempApiKey) apiKeyInput.value = result.tempApiKey;
            if (result.tempToken) tokenInput.value = result.tempToken;
            updateTempState();
        });
    }

    // Save temporary credentials to storage.local
    function saveTempCreds() {
        chrome.storage.local.set({ tempApiKey: apiKeyInput.value, tempToken: tokenInput.value });
    }

    // Remove temporary credentials from storage.local
    function clearTempCreds() {
        chrome.storage.local.remove(['tempApiKey', 'tempToken']);
    }

    // Update banner and Save button state
    function updateTempState() {
        const t = getT();
        const apiKey = apiKeyInput.value.trim();
        const token = tokenInput.value.trim();
        const bothFilled = apiKey && token;
                saveBtn.disabled = !(bothFilled && companyWorkCheckbox.checked); // Disabled if "not paid work" is unchecked, otherwise enabled if fields are filled
        if (bothFilled) {
            tempBanner.style.display = 'none';
        } else if (apiKey || token) {
            tempBanner.style.display = 'block';
            tempBannerText.textContent = t.temp_banner || 'Credentials are temporarily saved. Complete both fields and click Save to finish.';
        } else {
            tempBanner.style.display = 'none';
        }
    }

    // Listen for changes in the input fields
    apiKeyInput.addEventListener('input', () => {
        saveTempCreds();
        updateTempState();
    });
    tokenInput.addEventListener('input', () => {
        saveTempCreds();
        updateTempState();
    });

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
                clearTempCreds();
                tempBanner.style.display = 'none';
            });
        } else {
            configStatus.textContent = t.status_credentials_error || 'Please enter both API Key and Token.';
            configStatus.style.color = 'red';
        }
    });

	// event listener for checkbox
    companyWorkCheckbox.addEventListener('change', () => {
        chrome.storage.sync.set({ isCompanyWork: companyWorkCheckbox.checked }, () => {
        });

        const t = getT(); // translations 
        if (!companyWorkCheckbox.checked) {
            // if not checked, it means the user is paid
            configStatus.textContent = t.status_company_work_error || 'This plugin is not allowed for use if you are paid by a company for work performed on iD.';
            configStatus.style.color = 'red';
        } else {
            // If checked, the user is a volunteer
            configStatus.textContent = ''; 
            configStatus.style.color = 'green'; 
        }

        updateTempState(); 
    });

    // Helper to get available locales from languages manifest
    async function getAvailableLocales() {
        try {
            const res = await fetch(chrome.runtime.getURL('locales/languages.json'));
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
		companyWorkLabel.textContent = t.company_work_checkbox; // SET THE CHECKBOX LABEL TEXT
        document.getElementById('langLabel').textContent = t.language_label;
        populateLanguageSelector(langSelect.value, t, locales);
        lastTranslations = t;
        updateTempState();
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

    // On popup open, load temp creds and update state
    loadTempCreds();
});