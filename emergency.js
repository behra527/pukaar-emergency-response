class EmergencySystem {
    constructor() {
        this.currentLanguage = 'ur';
        this.map = null;
        this.emergencyMarkers = [];
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateDateTime();
        this.initializeLiveMap();
        setInterval(() => this.updateDateTime(), 1000);
        setInterval(() => this.updateLiveMap(), 5000);
    }
    
    setupEventListeners() {
        // Map filter controls
        document.querySelectorAll('.map-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterMapMarkers(e.target.dataset.filter);
                
                // Update button states
                document.querySelectorAll('.map-filter-btn').forEach(b => {
                    b.classList.remove('active');
                });
                e.target.classList.add('active');
            });
        });
        
        // Language selector
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }
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
    
    initializeLiveMap() {
        const mapContainer = document.getElementById('emergencyMap');
        if (mapContainer && typeof L !== 'undefined') {
            console.log('Initializing emergency map...');
            
            // Initialize real map centered on Pakistan
            this.map = L.map('emergencyMap').setView([30.3753, 69.3451], 6);
            
            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(this.map);
            
            // Initialize emergency markers
            this.renderEmergencyMarkers();
            
            // Fit map to show all markers
            setTimeout(() => {
                if (this.emergencyMarkers && this.emergencyMarkers.length > 0) {
                    const group = new L.featureGroup(this.emergencyMarkers);
                    this.map.fitBounds(group.getBounds().pad(0.1));
                    console.log('Map fitted to show all markers');
                }
            }, 1000);
        }
    }
    
    renderEmergencyMarkers() {
        if (!this.map) return;
        
        console.log('Rendering emergency markers...');
        
        // Clear existing markers
        this.emergencyMarkers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.emergencyMarkers = [];
        
        // Simulated emergency locations in Pakistan
        const emergencies = [
            { type: 'medical', lat: 33.6844, lng: 73.0479, city: 'اسلام آباد', id: 'EMG-2025-0142', time: '14:32', status: 'active' },
            { type: 'fire', lat: 31.5204, lng: 74.3587, city: 'لاہور', id: 'EMG-2025-0141', time: '13:45', status: 'completed' },
            { type: 'accident', lat: 24.8607, lng: 67.0011, city: 'کراچی', id: 'EMG-2025-0140', time: '12:20', status: 'completed' },
            { type: 'police', lat: 36.8619, lng: 74.4233, city: 'گلگت', id: 'EMG-2025-0139', time: '11:15', status: 'completed' },
            { type: 'medical', lat: 34.0151, lng: 71.5249, city: 'پشاور', id: 'EMG-2025-0138', time: '10:30', status: 'completed' },
            { type: 'fire', lat: 30.1575, lng: 71.5249, city: 'ملتان', id: 'EMG-2025-0137', time: '09:45', status: 'pending' }
        ];
        
        // Create custom icons for different emergency types
        const icons = {
            medical: L.divIcon({
                html: '<div style="background: #dc2626; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">🏥</div>',
                iconSize: [24, 24],
                className: 'medical-marker'
            }),
            fire: L.divIcon({
                html: '<div style="background: #f59e0b; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">🔥</div>',
                iconSize: [24, 24],
                className: 'fire-marker'
            }),
            accident: L.divIcon({
                html: '<div style="background: #1e40af; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">🚗</div>',
                iconSize: [24, 24],
                className: 'accident-marker'
            }),
            police: L.divIcon({
                html: '<div style="background: #6b7280; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">👮</div>',
                iconSize: [24, 24],
                className: 'police-marker'
            })
        };
        
        // Add markers to map
        emergencies.forEach((emergency, index) => {
            const marker = L.marker([emergency.lat, emergency.lng], {
                icon: icons[emergency.type]
            }).addTo(this.map);
            
            // Add popup with detailed information
            const popupContent = `
                <div style="text-align: center; padding: 8px; min-width: 200px;">
                    <strong>${this.getEmergencyTypeName(emergency.type)}</strong><br>
                    <strong>آئی ڈی:</strong> ${emergency.id}<br>
                    <strong>شہر:</strong> ${emergency.city}<br>
                    <strong>وقت:</strong> ${emergency.time}<br>
                    <strong>اسٹیٹس:</strong> <span style="color: ${emergency.status === 'active' ? '#dc2626' : emergency.status === 'completed' ? '#16a34a' : '#f59e0b'}">${this.getStatusText(emergency.status)}</span>
                </div>
            `;
            
            marker.bindPopup(popupContent);
            this.emergencyMarkers.push(marker);
        });
        
        console.log(`Added ${this.emergencyMarkers.length} emergency markers to map`);
        
        // Fit map to show all markers
        setTimeout(() => {
            if (this.emergencyMarkers && this.emergencyMarkers.length > 0) {
                const group = new L.featureGroup(this.emergencyMarkers);
                this.map.fitBounds(group.getBounds().pad(0.1));
                console.log('Map fitted to show all markers');
            }
        }, 1000);
    }
    
    getEmergencyTypeName(type) {
        const names = {
            medical: 'میڈیکل ایمرجنسی',
            fire: 'اگ بجھاؤ',
            accident: 'حادثہ',
            police: 'پولیس ایمرجنسی'
        };
        return names[type] || type;
    }
    
    getStatusText(status) {
        const statusTexts = {
            active: 'فعال',
            completed: 'مکمل',
            pending: 'زیر غور'
        };
        return statusTexts[status] || status;
    }
    
    filterMapMarkers(filter) {
        if (!this.map) return;
        
        // Filter markers
        this.emergencyMarkers.forEach(marker => {
            if (filter === 'all') {
                marker.addTo(this.map); // Show all markers
            } else {
                // Check marker type by checking its icon
                const icon = marker.getIcon();
                const isMedical = icon.options.html.includes('🏥');
                const isFire = icon.options.html.includes('🔥');
                const isAccident = icon.options.html.includes('🚗');
                const isPolice = icon.options.html.includes('👮');
                
                const shouldShow = (filter === 'medical' && isMedical) ||
                                (filter === 'fire' && isFire) ||
                                (filter === 'accident' && isAccident) ||
                                (filter === 'police' && isPolice);
                
                if (shouldShow) {
                    marker.addTo(this.map); // Show marker
                } else {
                    this.map.removeLayer(marker); // Hide marker
                }
            }
        });
    }
    
    changeLanguage(language) {
        this.currentLanguage = language;
        console.log('Language changed to:', language);
        // Update UI text based on new language
        this.updateUILanguage();
    }
    
    updateUILanguage() {
        const translations = {
            ur: {
                pageTitle: 'ایمرجنسی - پُکار',
                systemStatus: 'ایمرجنسی سسٹم',
                controlPanel: 'ایمرجنسی کنٹرول پینل',
                systemActive: 'سسٹم فعال',
                avgResponse: 'اوسط رسپانز: 2.3 منٹ',
                activeEmergencies: 'فعال ایمرجنسیز',
                liveMap: 'لائیو ایمرجنسی مپ',
                all: 'تمام',
                medical: 'میڈیکل',
                fire: 'اگ',
                accident: 'حادثہ',
                police: 'پولیس'
            },
            ps: {
                pageTitle: 'ایمرجنسي - پُکار',
                systemStatus: 'ایمرجنسي سيستم',
                controlPanel: 'د امرجنسي کنټرول پينل',
                systemActive: 'سيستم فعال',
                avgResponse: 'منځنۍ رسپانز: 2.3 منټ',
                activeEmergencies: 'فعال امرجنسيز',
                liveMap: 'ژر ايمرجنسي نقشه',
                all: 'ټول',
                medical: 'طبي',
                fire: 'اور',
                accident: 'پېښه',
                police: 'پوليس'
            },
            sd: {
                pageTitle: 'ايمرجنسي - پُکار',
                systemStatus: 'ايمرجنسي سسٽم',
                controlPanel: 'ايمرجنسي ڪنٽرول پينل',
                systemActive: 'سسٽم فعال',
                avgResponse: 'اوسط رسپانز: 2.3 منٽ',
                activeEmergencies: 'فعال امرجنسيون',
                liveMap: 'لائيو ايمرجنسي نقشو',
                all: 'سڀ',
                medical: 'طبي',
                fire: 'اگ',
                accident: 'حادثو',
                police: 'پوليس'
            },
            sk: {
                pageTitle: 'ایمرجنسی - پُکار',
                systemStatus: 'ایمرجنسی سسٹم',
                controlPanel: 'ایمرجنسی کنٹرول پینل',
                systemActive: 'سسٹم فعال',
                avgResponse: 'اوسط رسپانز: 2.3 منٹ',
                activeEmergencies: 'فعال ایمرجنسیز',
                liveMap: 'لائیو ایمرجنسی مپ',
                all: 'تمام',
                medical: 'طبی',
                fire: 'اگ',
                accident: 'حادثے',
                police: 'پولیس'
            }
        };
        
        const t = translations[this.currentLanguage] || translations.ur;
        
        // Update page title
        document.title = t.pageTitle;
        
        // Update status bar
        const statusText = document.querySelector('.status-left span:nth-child(2)');
        if (statusText) statusText.textContent = t.systemStatus;
        
        // Update main headings
        const controlPanel = document.querySelector('.control-header h2');
        if (controlPanel) controlPanel.textContent = t.controlPanel;
        
        const systemActive = document.querySelector('.status-badge');
        if (systemActive) systemActive.textContent = t.systemActive;
        
        const avgResponse = document.querySelector('.response-time');
        if (avgResponse) avgResponse.textContent = t.avgResponse;
        
        const activeEmergencies = document.querySelector('.active-emergencies h3');
        if (activeEmergencies) activeEmergencies.textContent = t.activeEmergencies;
        
        const liveMap = document.querySelector('.map-controls h3');
        if (liveMap) liveMap.textContent = t.liveMap;
        
        // Update map filter buttons
        const filterButtons = document.querySelectorAll('.map-filter-btn');
        filterButtons.forEach(btn => {
            const filterText = btn.dataset.filter;
            if (filterText === 'all') btn.textContent = t.all;
            else if (filterText === 'medical') btn.textContent = t.medical;
            else if (filterText === 'fire') btn.textContent = t.fire;
            else if (filterText === 'accident') btn.textContent = t.accident;
            else if (filterText === 'police') btn.textContent = t.police;
        });
    }
}

// Initialize the system
document.addEventListener('DOMContentLoaded', () => {
    new EmergencySystem();
});
