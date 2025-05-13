document.addEventListener('DOMContentLoaded', () => {
    const langButtons = document.querySelectorAll('.lang-switcher button');
    const elementsToTranslate = document.querySelectorAll('[data-lang-key]');
    let currentLanguage = localStorage.getItem('language') || 'tr'; // Default to Turkish or saved lang

    async function loadLanguage(lang) {
        try {
            const response = await fetch(`lang/${lang}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const langData = await response.json();

            // Update text content
            elementsToTranslate.forEach(element => {
                const key = element.dataset.langKey;
                if (langData[key]) {
                    // Handle specific elements like title differently if needed
                    if (element.tagName === 'TITLE') {
                        document.title = langData[key];
                    } else {
                        element.textContent = langData[key];
                    }
                } else {
                    console.warn(`Missing translation key: ${key} for language: ${lang}`);
                }
            });

            // Update HTML lang attribute
            document.documentElement.lang = lang;

            // Update active button style
            langButtons.forEach(btn => {
                btn.classList.toggle('active-lang', btn.dataset.lang === lang);
            });

            // Save preference
            localStorage.setItem('language', lang);
            currentLanguage = lang;

        } catch (error) {
            console.error("Could not load language file:", error);
        }
    }

    // Add event listeners to buttons
    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedLang = button.dataset.lang;
            if (selectedLang !== currentLanguage) {
                loadLanguage(selectedLang);
            }
        });
    });

    // Initial load
    loadLanguage(currentLanguage);
});