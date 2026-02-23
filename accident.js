class AccidentEmergencySystem {
    constructor() {
        this.currentLanguage = 'ur';
        this.map = null;
        this.markers = [];
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateDateTime();
        this.initializeMap();
        setInterval(() => this.updateDateTime(), 1000);
    }
    
    setupEventListeners() {
        document.getElementById('languageSelect')?.addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });
        
        document.querySelectorAll('.map-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterMapMarkers(e.target.dataset.filter);
                document.querySelectorAll('.map-filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }
    
    updateDateTime() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('ur-PK', { hour12: false });
        const dateStr = now.toLocaleDateString('ur-PK');
        
        document.getElementById('current-time').textContent = timeStr;
        document.getElementById('current-date').textContent = dateStr;
    }
    
    initializeMap() {
        const mapContainer = document.getElementById('accidentMap');
        if (mapContainer && typeof L !== 'undefined') {
            this.map = L.map('accidentMap').setView([30.3753, 69.3451], 6);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(this.map);
            
            this.renderAccidentMarkers();
        }
    }
    
    renderAccidentMarkers() {
        if (!this.map) return;
        
        const locations = [
            { type: 'active', lat: 31.5204, lng: 74.3587, name: 'لاہور موٹر وے حادثہ' },
            { type: 'rescue', lat: 33.6844, lng: 73.0479, name: 'اسلام آباد ریسکیو سینٹر' },
            { type: 'tow', lat: 24.8607, lng: 67.0011, name: 'کراچی ٹو سروس' },
            { type: 'mechanic', lat: 34.0151, lng: 71.5249, name: 'پشاور میکینک' }
        ];
        
        const icons = {
            active: L.divIcon({
                html: '<div style="background: #dc2626; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px;">🚗</div>',
                iconSize: [24, 24]
            }),
            rescue: L.divIcon({
                html: '<div style="background: #f59e0b; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px;">🚑</div>',
                iconSize: [24, 24]
            }),
            tow: L.divIcon({
                html: '<div style="background: #1e40af; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px;">🚛</div>',
                iconSize: [24, 24]
            }),
            mechanic: L.divIcon({
                html: '<div style="background: #6b7280; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px;">🔧</div>',
                iconSize: [24, 24]
            })
        };
        
        locations.forEach(location => {
            const marker = L.marker([location.lat, location.lng], {
                icon: icons[location.type]
            }).addTo(this.map);
            
            marker.bindPopup(`<strong>${location.name}</strong>`);
            this.markers.push(marker);
        });
    }
    
    filterMapMarkers(filter) {
        if (!this.map) return;
        
        this.markers.forEach(marker => {
            if (filter === 'all') {
                marker.addTo(this.map);
            } else {
                const icon = marker.getIcon();
                const shouldShow = (filter === 'active' && icon.options.html.includes('🚗')) ||
                                  (filter === 'rescue' && icon.options.html.includes('🚑')) ||
                                  (filter === 'tow' && icon.options.html.includes('🚛')) ||
                                  (filter === 'mechanic' && icon.options.html.includes('🔧'));
                
                if (shouldShow) {
                    marker.addTo(this.map);
                } else {
                    this.map.removeLayer(marker);
                }
            }
        });
    }
    
    changeLanguage(language) {
        this.currentLanguage = language;
        console.log('Language changed to:', language);
    }
}

// Global functions
function reportAccident() {
    alert('حادثہ کی اطلاع!\n\nریسکیو ٹیم کو مطلع کر دیا گیا ہے۔\nبراہ کرم اپنا مقام شیئر کریں۔');
}

function requestTow() {
    alert('ٹو ٹرک کی درخواست!\n\nٹو ٹرک بھیج دیا گیا ہے۔\nتقریباً 15 منٹ میں پہنچ جائے گا۔');
}

function findMechanic() {
    alert('نزدیکی میکینک:\n\nاحمد میکینک - 1.2km\nرفیع آٹو سروس - 2.5km\nعلی گاڑی ورکشاپ - 3.1km');
}

function insuranceClaim() {
    alert('انشورنس کلیم:\n\n1. حادثے کی تصاویر لیں\n2. پولیس رپورٹ بنوائیں\n3. انشورنس کمپنی کو کال کریں\n4. کلیم نمبر: CLM-2025-00123');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new AccidentEmergencySystem();
});
