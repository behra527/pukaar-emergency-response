/**
 * Pukaar Translation System - Free Translation API
 * Uses MyMemory API for reliable language switching
 */

class PukaarTranslator {
    constructor() {
        this.currentLanguage = localStorage.getItem('pukaarLanguage') || 'ur';
        this.translationCache = JSON.parse(localStorage.getItem('translationCache') || '{}');
        this.isTranslating = false;
        this.init();
    }

    init() {
        this.setupLanguageSelector();
        this.applyStoredLanguage();
        console.log('Pukaar Translator initialized');
    }

    setupLanguageSelector() {
        const languageSelect = document.getElementById('languageSelect');
        if (!languageSelect) {
            console.error('Language selector not found');
            return;
        }

        languageSelect.value = this.currentLanguage;
        
        languageSelect.addEventListener('change', (e) => {
            const selectedLang = e.target.value;
            console.log('Language selected:', selectedLang);
            this.changeLanguage(selectedLang);
        });

        console.log('Language selector setup complete');
    }

    async changeLanguage(targetLang) {
        if (!targetLang || targetLang === this.currentLanguage) return;
        
        if (this.isTranslating) {
            console.log('Translation already in progress');
            return;
        }

        this.isTranslating = true;
        this.showNotification(`🔄 Translating to ${this.getLanguageName(targetLang)}...`, 'info');
        
        try {
            this.currentLanguage = targetLang;
            localStorage.setItem('pukaarLanguage', targetLang);
            
            await this.translatePage(targetLang);
            
            document.documentElement.lang = targetLang;
            
            this.showNotification(`✅ Language changed to ${this.getLanguageName(targetLang)}`, 'success');
            
        } catch (error) {
            console.error('Translation error:', error);
            this.showNotification('❌ Translation failed. Please try again.', 'error');
        } finally {
            this.isTranslating = false;
        }
    }

    async translatePage(targetLang) {
        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, label, .nav-btn, .stat-value, .stat-header h3');
        
        const textElements = Array.from(elements).filter(el => {
            const text = el.textContent.trim();
            return text.length > 0 && 
                   text.length < 200 &&
                   !el.hasAttribute('data-no-translate');
        });

        console.log(`Found ${textElements.length} elements to translate`);

        const batchSize = 5;
        for (let i = 0; i < textElements.length; i += batchSize) {
            const batch = textElements.slice(i, i + batchSize);
            await this.translateBatch(batch, targetLang);
            
            if (i + batchSize < textElements.length) {
                await this.delay(300);
            }
        }
    }

    async translateBatch(elements, targetLang) {
        const promises = elements.map(async (element) => {
            const originalText = element.textContent.trim();
            if (!originalText) return;

            const cacheKey = `${originalText}_${targetLang}`;
            if (this.translationCache[cacheKey]) {
                element.textContent = this.translationCache[cacheKey];
                element.setAttribute('data-original', originalText);
                element.setAttribute('data-translated', 'true');
                return;
            }

            if (element.getAttribute('data-translated') === 'true') {
                return;
            }

            try {
                const translatedText = await this.callTranslateAPI(originalText, targetLang);
                if (translatedText && translatedText !== originalText) {
                    this.translationCache[cacheKey] = translatedText;
                    localStorage.setItem('translationCache', JSON.stringify(this.translationCache));
                    
                    element.textContent = translatedText;
                    element.setAttribute('data-original', originalText);
                    element.setAttribute('data-translated', 'true');
                }
            } catch (error) {
                console.error('Failed to translate:', originalText, error);
            }
        });

        await Promise.all(promises);
    }

    async callTranslateAPI(text, targetLang) {
        const sourceLang = 'ur';
        const targetLangCode = this.getTargetLangCode(targetLang);
        
        const langPair = `${sourceLang}|${targetLangCode}`;
        const encodedText = encodeURIComponent(text);
        const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${langPair}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.responseStatus === 200) {
                return data.responseData.translatedText;
            } else {
                throw new Error(data.responseDetails || 'Translation failed');
            }
        } catch (error) {
            console.error('API call failed:', error);
            return text;
        }
    }

    getTargetLangCode(lang) {
        const mapping = {
            'ur': 'ur',
            'ps': 'ps',
            'sd': 'sd',
            'sk': 'pa'
        };
        return mapping[lang] || lang;
    }

    async applyStoredLanguage() {
        if (this.currentLanguage && this.currentLanguage !== 'ur') {
            console.log('Applying stored language:', this.currentLanguage);
            await this.changeLanguage(this.currentLanguage);
        }
    }

    getLanguageName(code) {
        const names = {
            'ur': 'اردو',
            'ps': 'پشتو',
            'sd': 'سندھی',
            'sk': 'سرائیکی'
        };
        return names[code] || code;
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            background: ${type === 'success' ? '#16a34a' : type === 'error' ? '#dc2626' : '#1e40af'};
            font-family: system-ui, -apple-system, sans-serif;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            notification.style.transition = 'all 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.pukaarTranslator = new PukaarTranslator();
    
    window.testTranslate = (lang) => {
        if (window.pukaarTranslator) {
            window.pukaarTranslator.changeLanguage(lang);
        }
    };
    
    console.log('Translator ready. Test: testTranslate("ps")');
});
