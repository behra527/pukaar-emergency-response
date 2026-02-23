class SettingsSystem {
    constructor() {
        this.currentLanguage = 'ur';
        this.settings = {
            defaultLanguage: 'ur',
            timezone: 'PKT',
            dateFormat: 'DD/MM/YYYY',
            autoLanguage: true,
            defaultEmergencyType: 'medical',
            responseTimeout: 30,
            autoAssign: true,
            emergencyAlerts: true,
            audioQuality: 'high',
            audioFormat: 'wav',
            autoPlay: true,
            audioVolume: 80,
            desktopNotifications: true,
            soundNotifications: true,
            emailNotifications: '',
            notificationFrequency: 'realtime',
            autoLogout: 'never',
            sessionTimeout: 60,
            twoFactorAuth: false,
            ipRestriction: false,
            backupFrequency: 'daily',
            logLevel: 'error'
        };
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.updateDateTime();
        this.updateUILanguage();
        setInterval(() => this.updateDateTime(), 1000);
    }
    
    loadSettings() {
        // Load settings from localStorage
        const savedSettings = localStorage.getItem('pukaarSettings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }
        this.populateSettingsForm();
    }
    
    saveSettings() {
        localStorage.setItem('pukaarSettings', JSON.stringify(this.settings));
        this.showNotification('سیٹنگز محفوظ ہو گئیں!', 'success');
    }
    
    resetSettings() {
        if (confirm('کیا آپ واقعی میں تمام سیٹنگز کو ڈیفالٹس پر واپس لانا چاہتے ہیں؟')) {
            this.settings = {
                defaultLanguage: 'ur',
                timezone: 'PKT',
                dateFormat: 'DD/MM/YYYY',
                autoLanguage: true,
                defaultEmergencyType: 'medical',
                responseTimeout: 30,
                autoAssign: true,
                emergencyAlerts: true,
                audioQuality: 'high',
                audioFormat: 'wav',
                autoPlay: true,
                audioVolume: 80,
                desktopNotifications: true,
                soundNotifications: true,
                emailNotifications: '',
                notificationFrequency: 'realtime',
                autoLogout: 'never',
                sessionTimeout: 60,
                twoFactorAuth: false,
                ipRestriction: false,
                backupFrequency: 'daily',
                logLevel: 'error'
            };
            this.populateSettingsForm();
            this.saveSettings();
        }
    }
    
    exportSettings() {
        const dataStr = JSON.stringify(this.settings, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pukaar_settings.json';
        a.click();
        window.URL.revokeObjectURL(url);
    }
    
    setupEventListeners() {
        // Save, Reset, Export buttons
        document.querySelector('.save-btn')?.addEventListener('click', () => this.saveSettings());
        document.querySelector('.reset-btn')?.addEventListener('click', () => this.resetSettings());
        document.querySelector('.export-btn')?.addEventListener('click', () => this.exportSettings());
        
        // Settings inputs
        document.getElementById('defaultLanguage')?.addEventListener('change', (e) => {
            this.settings.defaultLanguage = e.target.value;
        });
        
        document.getElementById('timezone')?.addEventListener('change', (e) => {
            this.settings.timezone = e.target.value;
        });
        
        document.getElementById('dateFormat')?.addEventListener('change', (e) => {
            this.settings.dateFormat = e.target.value;
        });
        
        document.getElementById('autoLanguage')?.addEventListener('change', (e) => {
            this.settings.autoLanguage = e.target.value === 'true';
        });
        
        document.getElementById('defaultEmergencyType')?.addEventListener('change', (e) => {
            this.settings.defaultEmergencyType = e.target.value;
        });
        
        document.getElementById('responseTimeout')?.addEventListener('input', (e) => {
            this.settings.responseTimeout = parseInt(e.target.value);
        });
        
        document.getElementById('autoAssign')?.addEventListener('change', (e) => {
            this.settings.autoAssign = e.target.checked;
            this.showNotification(`ایمرجنسی آٹو اسائن ${e.target.checked ? 'چالو' : 'بند'} ہو گیا`, 'success');
        });
        
        document.getElementById('emergencyAlerts')?.addEventListener('change', (e) => {
            this.settings.emergencyAlerts = e.target.checked;
            this.showNotification(`ایمرجنسی الرٹ ${e.target.checked ? 'چالو' : 'بند'} ہو گیا`, 'success');
        });
        
        document.getElementById('audioQuality')?.addEventListener('change', (e) => {
            this.settings.audioQuality = e.target.value;
        });
        
        document.getElementById('audioFormat')?.addEventListener('change', (e) => {
            this.settings.audioFormat = e.target.value;
        });
        
        document.getElementById('autoPlay')?.addEventListener('change', (e) => {
            this.settings.autoPlay = e.target.checked;
            this.showNotification(`آڈیو آٹو پلے ${e.target.checked ? 'چالو' : 'بند'} ہو گیا`, 'success');
        });
        
        document.getElementById('audioVolume')?.addEventListener('input', (e) => {
            this.settings.audioVolume = parseInt(e.target.value);
            document.querySelector('.volume-value').textContent = e.target.value + '%';
        });
        
        document.getElementById('desktopNotifications')?.addEventListener('change', (e) => {
            this.settings.desktopNotifications = e.target.checked;
            this.showNotification(`ڈیسک ٹاپ نوٹیفیکیشنز ${e.target.checked ? 'چالو' : 'بند'} ہو گئیں`, 'success');
        });
        
        document.getElementById('soundNotifications')?.addEventListener('change', (e) => {
            this.settings.soundNotifications = e.target.checked;
            this.showNotification(`ساؤنڈ نوٹیفیکیشنز ${e.target.checked ? 'چالو' : 'بند'} ہو گئیں`, 'success');
        });
        
        document.getElementById('emailNotifications')?.addEventListener('input', (e) => {
            this.settings.emailNotifications = e.target.value;
        });
        
        document.getElementById('notificationFrequency')?.addEventListener('change', (e) => {
            this.settings.notificationFrequency = e.target.value;
        });
        
        document.getElementById('autoLogout')?.addEventListener('change', (e) => {
            this.settings.autoLogout = e.target.value;
        });
        
        document.getElementById('sessionTimeout')?.addEventListener('input', (e) => {
            this.settings.sessionTimeout = parseInt(e.target.value);
        });
        
        document.getElementById('twoFactorAuth')?.addEventListener('change', (e) => {
            this.settings.twoFactorAuth = e.target.checked;
            this.showNotification(`ٹو فیکٹر آٹھینٹیکیشن ${e.target.checked ? 'چالو' : 'بند'} ہو گیا`, 'success');
        });
        
        document.getElementById('ipRestriction')?.addEventListener('change', (e) => {
            this.settings.ipRestriction = e.target.checked;
            this.showNotification(`IP ریسٹرکشن ${e.target.checked ? 'چالو' : 'بند'} ہو گئی`, 'success');
        });
        
        document.getElementById('backupFrequency')?.addEventListener('change', (e) => {
            this.settings.backupFrequency = e.target.value;
        });
        
        document.getElementById('logLevel')?.addEventListener('change', (e) => {
            this.settings.logLevel = e.target.value;
        });
        
        // Action buttons
        document.querySelector('.clear-cache-btn')?.addEventListener('click', () => this.clearCache());
        document.querySelector('.reset-system-btn')?.addEventListener('click', () => this.resetSystem());
        
        // Language selector
        document.getElementById('languageSelect')?.addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });
    }
    
    populateSettingsForm() {
        // Populate all form fields with current settings
        const elements = {
            defaultLanguage: document.getElementById('defaultLanguage'),
            timezone: document.getElementById('timezone'),
            dateFormat: document.getElementById('dateFormat'),
            autoLanguage: document.getElementById('autoLanguage'),
            defaultEmergencyType: document.getElementById('defaultEmergencyType'),
            responseTimeout: document.getElementById('responseTimeout'),
            autoAssign: document.getElementById('autoAssign'),
            emergencyAlerts: document.getElementById('emergencyAlerts'),
            audioQuality: document.getElementById('audioQuality'),
            audioFormat: document.getElementById('audioFormat'),
            autoPlay: document.getElementById('autoPlay'),
            audioVolume: document.getElementById('audioVolume'),
            desktopNotifications: document.getElementById('desktopNotifications'),
            soundNotifications: document.getElementById('soundNotifications'),
            emailNotifications: document.getElementById('emailNotifications'),
            notificationFrequency: document.getElementById('notificationFrequency'),
            autoLogout: document.getElementById('autoLogout'),
            sessionTimeout: document.getElementById('sessionTimeout'),
            twoFactorAuth: document.getElementById('twoFactorAuth'),
            ipRestriction: document.getElementById('ipRestriction'),
            backupFrequency: document.getElementById('backupFrequency'),
            logLevel: document.getElementById('logLevel')
        };
        
        // Set values
        if (elements.defaultLanguage) elements.defaultLanguage.value = this.settings.defaultLanguage;
        if (elements.timezone) elements.timezone.value = this.settings.timezone;
        if (elements.dateFormat) elements.dateFormat.value = this.settings.dateFormat;
        if (elements.autoLanguage) elements.autoLanguage.value = this.settings.autoLanguage.toString();
        if (elements.defaultEmergencyType) elements.defaultEmergencyType.value = this.settings.defaultEmergencyType;
        if (elements.responseTimeout) elements.responseTimeout.value = this.settings.responseTimeout;
        if (elements.autoAssign) elements.autoAssign.checked = this.settings.autoAssign;
        if (elements.emergencyAlerts) elements.emergencyAlerts.checked = this.settings.emergencyAlerts;
        if (elements.audioQuality) elements.audioQuality.value = this.settings.audioQuality;
        if (elements.audioFormat) elements.audioFormat.value = this.settings.audioFormat;
        if (elements.autoPlay) elements.autoPlay.checked = this.settings.autoPlay;
        if (elements.audioVolume) {
            elements.audioVolume.value = this.settings.audioVolume;
            document.querySelector('.volume-value').textContent = this.settings.audioVolume + '%';
        }
        if (elements.desktopNotifications) elements.desktopNotifications.checked = this.settings.desktopNotifications;
        if (elements.soundNotifications) elements.soundNotifications.checked = this.settings.soundNotifications;
        if (elements.emailNotifications) elements.emailNotifications.value = this.settings.emailNotifications;
        if (elements.notificationFrequency) elements.notificationFrequency.value = this.settings.notificationFrequency;
        if (elements.autoLogout) elements.autoLogout.value = this.settings.autoLogout;
        if (elements.sessionTimeout) elements.sessionTimeout.value = this.settings.sessionTimeout;
        if (elements.twoFactorAuth) elements.twoFactorAuth.checked = this.settings.twoFactorAuth;
        if (elements.ipRestriction) elements.ipRestriction.checked = this.settings.ipRestriction;
        if (elements.backupFrequency) elements.backupFrequency.value = this.settings.backupFrequency;
        if (elements.logLevel) elements.logLevel.value = this.settings.logLevel;
    }
    
    updateDateTime() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('ur-PK', { hour12: false });
        const dateStr = now.toLocaleDateString('ur-PK');
        
        const timeElement = document.getElementById('current-time');
        const dateElement = document.getElementById('current-date');
        
        if (timeElement) timeElement.textContent = timeStr;
        if (dateElement) dateElement.textContent = dateStr;
    }
    
    clearCache() {
        if (confirm('کیا آپ براؤزر کیش کو صاف کرنا چاہتے ہیں؟')) {
            localStorage.clear();
            sessionStorage.clear();
            this.showNotification('کیش صاف ہو گئی!', 'success');
        }
    }
    
    resetSystem() {
        if (confirm('کیا آپ سسٹم کو ڈیفالٹ سیٹنگز پر ری سیٹ کرنا چاہتے ہیں؟\n\nیہ تمام آپ کی ذاتی ترجیحات کو حذف کر دے گا۔')) {
            localStorage.removeItem('pukaarSettings');
            this.resetSettings();
            this.showNotification('سسٹم ری سیٹ ہو گیا!', 'success');
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `settings-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
                <span class="notification-text">${message}</span>
                <button class="notification-close" onclick="this.parentElement.remove()">×</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#16a34a' : type === 'error' ? '#dc2626' : '#1e40af'};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 300px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    changeLanguage(language) {
        this.currentLanguage = language;
        console.log('Language changed to:', language);
        this.updateUILanguage();
    }
    
    updateUILanguage() {
        const translations = {
            ur: {
                pageTitle: 'سیٹنگز - پُکار',
                systemStatus: 'سیٹنگز',
                settingsHeader: 'سسٹم سیٹنگز',
                saveSettings: 'تمام سیٹنگز محفوظ کریں',
                resetDefaults: 'ڈیفالٹس پر واپس جائیں',
                exportSettings: 'سیٹنگز ایکسپورٹ کریں',
                general: 'عام سیٹنگز',
                defaultLanguage: 'ڈیفالٹ زبان',
                timezone: 'ٹائم زون',
                dateFormat: 'ڈیٹ فارمیٹ',
                autoLanguage: 'آٹو لینگویج',
                emergency: 'ایمرجنسی سیٹنگز',
                audio: 'آڈیو سیٹنگز',
                notifications: 'نوٹیفیکیشن سیٹنگز',
                security: 'سیکیورٹی سیٹنگز',
                system: 'سسٹم سیٹنگز',
                yes: 'آٹو',
                no: 'دستی',
                high: 'ہائی',
                medium: 'میڈیم',
                low: 'لو',
                never: 'کبھی نہیں',
                realtime: 'ریل ٹائم',
                hourly: 'ہر گھنٹہ',
                daily: 'ہر روز',
                weekly: 'ہر ہفتہ',
                monthly: 'ہر مہینہ',
                minutes: 'منٹوں',
                clearCache: 'کیش کلئیر کریں',
                resetSystem: 'سسٹم ری سیٹ کریں'
            },
            ps: {
                pageTitle: 'سيټنګز - پُکار',
                systemStatus: 'سيټنګز',
                settingsHeader: 'د سيستم سيټنګز',
                saveSettings: 'ټول سيټنګز خونښ کړئ',
                resetDefaults: 'په ډيفالټ سيټنګو ته بيرته',
                exportSettings: 'سيټنګز اکسرپورټ کړئ',
                general: 'عام سيټنګز',
                defaultLanguage: 'په ډيفالټ ژبه',
                timezone: 'د وخت سيم',
                dateFormat: 'د نېڍ فارمیټ',
                autoLanguage: 'خپ کارول',
                emergency: 'د امرجنسي سيټنګز',
                audio: 'آډيو سيټنګز',
                notifications: 'د خبرتياو سيټنګز',
                security: 'د امنيت سيټنګز',
                system: 'د سيستم سيټنګز',
                yes: 'آټو',
                no: 'لاسي',
                high: 'لوړ',
                medium: 'منځ',
                low: 'کم',
                never: 'هېڅکو',
                realtime: 'ريل وخت',
                hourly: 'هره',
                daily: 'هرور',
                weekly: 'هرهفتہ',
                monthly: 'هر مياشت',
                minutes: 'مينټ',
                clearCache: 'کیش پاک کړئ',
                resetSystem: 'د سيستم بيرته تنظيم کړئ'
            },
            sd: {
                pageTitle: 'سيٽنگس - پُکار',
                systemStatus: 'سيٽنگس',
                settingsHeader: 'سسٽم سيٽنگس',
                saveSettings: 'سڀ سيٽنگس محفوظ ڪريو',
                resetDefaults: 'ڊيفالٽ سيٽنگز تي واپس وڃو',
                exportSettings: 'سيٽنگس ايڪسپورٽ ڪريو',
                general: 'عام سيٽنگس',
                defaultLanguage: 'ڊيفالٽ زبان',
                timezone: 'وقت زون',
                dateFormat: 'تاريخ فارميٽ',
                autoLanguage: 'آٽو لنگوئج',
                emergency: 'ايمرجنسي سيٽنگس',
                audio: 'آڊيو سيٽنگس',
                notifications: 'نوٽيفيڪشن سيٽنگس',
                security: 'سيڪورٽي سيٽنگس',
                system: 'سسٽم سيٽنگس',
                yes: 'آھو',
                no: 'دستي',
                high: 'وڌيڪو',
                medium: 'وچ',
                low: 'گھٽ',
                never: 'ڪڏي ناهي',
                realtime: 'ريل ٽائم',
                hourly: 'هر گھنٽو',
                daily: 'هر ڏين',
                weekly: 'هر هفتو',
                monthly: 'هر مهينو',
                minutes: 'منٽ',
                clearCache: 'ڪيش صاف ڪريو',
                resetSystem: 'سسٽم ري سيٽ ڪريو'
            },
            sk: {
                pageTitle: 'سیٹنگز - پُکار',
                systemStatus: 'سیٹنگز',
                settingsHeader: 'سسٹم سیٹنگز',
                saveSettings: 'تمام سیٹنگز محفوظ کرو',
                resetDefaults: 'ڈیفالٹس پر واپس جاؤ',
                exportSettings: 'سیٹنگز ایکسپورٹ کرو',
                general: 'عام سیٹنگز',
                defaultLanguage: 'ڈیفالٹ زبان',
                timezone: 'ٹائم زون',
                dateFormat: 'ڈیٹ فارمیٹ',
                autoLanguage: 'آٹو لینگویج',
                emergency: 'ایمرجنسی سیٹنگز',
                audio: 'آڈیو سیٹنگز',
                notifications: 'نوٹیفیکیشن سیٹنگز',
                security: 'سیکیورٹی سیٹنگز',
                system: 'سسٹم سیٹنگز',
                yes: 'آٹو',
                no: 'دستی',
                high: 'ہائی',
                medium: 'میڈیم',
                low: 'لو',
                never: 'کبھی نہیں',
                realtime: 'ریل ٹائم',
                hourly: 'ہر گھنٹہ',
                daily: 'ہر روز',
                weekly: 'ہر ہفتہ',
                monthly: 'ہر مہینہ',
                minutes: 'منٹ',
                clearCache: 'کیش کلئیر کرو',
                resetSystem: 'سسٹم ری سیٹ کرو'
            }
        };
        
        const t = translations[this.currentLanguage] || translations.ur;
        
        // Update page title
        document.title = t.pageTitle;
        
        // Update status bar
        const statusText = document.querySelector('.status-left span:nth-child(2)');
        if (statusText) statusText.textContent = t.systemStatus;
        
        // Update main content
        const settingsHeader = document.querySelector('.settings-header h2');
        if (settingsHeader) settingsHeader.textContent = t.settingsHeader;
        
        const saveBtn = document.querySelector('.save-btn');
        if (saveBtn) saveBtn.textContent = t.saveSettings;
        
        const resetBtn = document.querySelector('.reset-btn');
        if (resetBtn) resetBtn.textContent = t.resetDefaults;
        
        const exportBtn = document.querySelector('.export-btn');
        if (exportBtn) exportBtn.textContent = t.exportSettings;
        
        // Update section headers
        const sectionHeaders = document.querySelectorAll('.section-header h3');
        if (sectionHeaders[0]) sectionHeaders[0].textContent = t.general;
        if (sectionHeaders[1]) sectionHeaders[1].textContent = t.emergency;
        if (sectionHeaders[2]) sectionHeaders[2].textContent = t.audio;
        if (sectionHeaders[3]) sectionHeaders[3].textContent = t.notifications;
        if (sectionHeaders[4]) sectionHeaders[4].textContent = t.security;
        if (sectionHeaders[5]) sectionHeaders[5].textContent = t.system;
        
        // Update setting labels
        const labels = {
            defaultLanguage: document.querySelector('label[for="defaultLanguage"]'),
            timezone: document.querySelector('label[for="timezone"]'),
            dateFormat: document.querySelector('label[for="dateFormat"]'),
            autoLanguage: document.querySelector('label[for="autoLanguage"]'),
            defaultEmergencyType: document.querySelector('label[for="defaultEmergencyType"]'),
            responseTimeout: document.querySelector('label[for="responseTimeout"]'),
            autoAssign: document.querySelector('label[for="autoAssign"]'),
            emergencyAlerts: document.querySelector('label[for="emergencyAlerts"]'),
            audioQuality: document.querySelector('label[for="audioQuality"]'),
            audioFormat: document.querySelector('label[for="audioFormat"]'),
            autoPlay: document.querySelector('label[for="autoPlay"]'),
            audioVolume: document.querySelector('label[for="audioVolume"]'),
            desktopNotifications: document.querySelector('label[for="desktopNotifications"]'),
            soundNotifications: document.querySelector('label[for="soundNotifications"]'),
            emailNotifications: document.querySelector('label[for="emailNotifications"]'),
            notificationFrequency: document.querySelector('label[for="notificationFrequency"]'),
            autoLogout: document.querySelector('label[for="autoLogout"]'),
            sessionTimeout: document.querySelector('label[for="sessionTimeout"]'),
            twoFactorAuth: document.querySelector('label[for="twoFactorAuth"]'),
            ipRestriction: document.querySelector('label[for="ipRestriction"]'),
            backupFrequency: document.querySelector('label[for="backupFrequency"]'),
            logLevel: document.querySelector('label[for="logLevel"]')
        };
        
        if (labels.defaultLanguage) labels.defaultLanguage.textContent = t.defaultLanguage;
        if (labels.timezone) labels.timezone.textContent = t.timezone;
        if (labels.dateFormat) labels.dateFormat.textContent = t.dateFormat;
        if (labels.autoLanguage) labels.autoLanguage.textContent = t.autoLanguage;
        if (labels.defaultEmergencyType) labels.defaultEmergencyType.textContent = t.defaultEmergencyType;
        if (labels.responseTimeout) labels.responseTimeout.textContent = t.responseTimeout;
        if (labels.autoAssign) labels.autoAssign.textContent = t.autoAssign;
        if (labels.emergencyAlerts) labels.emergencyAlerts.textContent = t.emergencyAlerts;
        if (labels.audioQuality) labels.audioQuality.textContent = t.audioQuality;
        if (labels.audioFormat) labels.audioFormat.textContent = t.audioFormat;
        if (labels.autoPlay) labels.autoPlay.textContent = t.autoPlay;
        if (labels.audioVolume) labels.audioVolume.textContent = t.audioVolume;
        if (labels.desktopNotifications) labels.desktopNotifications.textContent = t.desktopNotifications;
        if (labels.soundNotifications) labels.soundNotifications.textContent = t.soundNotifications;
        if (labels.emailNotifications) labels.emailNotifications.textContent = t.emailNotifications;
        if (labels.notificationFrequency) labels.notificationFrequency.textContent = t.notificationFrequency;
        if (labels.autoLogout) labels.autoLogout.textContent = t.autoLogout;
        if (labels.sessionTimeout) labels.sessionTimeout.textContent = t.sessionTimeout;
        if (labels.twoFactorAuth) labels.twoFactorAuth.textContent = t.twoFactorAuth;
        if (labels.ipRestriction) labels.ipRestriction.textContent = t.ipRestriction;
        if (labels.backupFrequency) labels.backupFrequency.textContent = t.backupFrequency;
        if (labels.logLevel) labels.logLevel.textContent = t.logLevel;
        
        // Update option values
        const options = {
            yes: document.querySelector('option[value="true"]'),
            no: document.querySelector('option[value="false"]'),
            never: document.querySelector('option[value="never"]'),
            realtime: document.querySelector('option[value="realtime"]'),
            hourly: document.querySelector('option[value="hourly"]'),
            daily: document.querySelector('option[value="daily"]'),
            weekly: document.querySelector('option[value="weekly"]'),
            monthly: document.querySelector('option[value="monthly"]'),
            high: document.querySelector('option[value="high"]'),
            medium: document.querySelector('option[value="medium"]'),
            low: document.querySelector('option[value="low"]'),
            error: document.querySelector('option[value="error"]'),
            warning: document.querySelector('option[value="warning"]'),
            info: document.querySelector('option[value="info"]')
        };
        
        if (options.yes) options.yes.textContent = t.yes;
        if (options.no) options.no.textContent = t.no;
        if (options.never) options.never.textContent = t.never;
        if (options.realtime) options.realtime.textContent = t.realtime;
        if (options.hourly) options.hourly.textContent = t.hourly;
        if (options.daily) options.daily.textContent = t.daily;
        if (options.weekly) options.weekly.textContent = t.weekly;
        if (options.monthly) options.monthly.textContent = t.monthly;
        if (options.high) options.high.textContent = t.high;
        if (options.medium) options.medium.textContent = t.medium;
        if (options.low) options.low.textContent = t.low;
        if (options.error) options.error.textContent = t.error;
        if (options.warning) options.warning.textContent = t.warning;
        if (options.info) options.info.textContent = t.info;
        
        // Update action buttons
        const clearCacheBtn = document.querySelector('.clear-cache-btn');
        if (clearCacheBtn) clearCacheBtn.textContent = t.clearCache;
        
        const resetSystemBtn = document.querySelector('.reset-system-btn');
        if (resetSystemBtn) resetSystemBtn.textContent = t.resetSystem;
    }
}

// Initialize the system
let settingsSystem;

document.addEventListener('DOMContentLoaded', () => {
    settingsSystem = new SettingsSystem();
});

// Global functions for HTML onclick handlers
function saveSettings() {
    if (settingsSystem) {
        settingsSystem.saveSettings();
    }
}

function resetSettings() {
    if (settingsSystem) {
        settingsSystem.resetSettings();
    }
}
