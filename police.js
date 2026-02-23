class PoliceEmergencySystem {
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
        const mapContainer = document.getElementById('policeMap');
        if (mapContainer && typeof L !== 'undefined') {
            this.map = L.map('policeMap').setView([30.3753, 69.3451], 6);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(this.map);
            
            this.renderPoliceMarkers();
        }
    }
    
    renderPoliceMarkers() {
        if (!this.map) return;
        
        const locations = [
            { type: 'station', lat: 33.6844, lng: 73.0479, name: 'اسلام آباد پولیس اسٹیشن' },
            { type: 'patrol', lat: 31.5204, lng: 74.3587, name: 'لاہور پیٹرول کار' },
            { type: 'checkpost', lat: 24.8607, lng: 67.0011, name: 'کراچی چیک پوسٹ' },
            { type: 'station', lat: 34.0151, lng: 71.5249, name: 'پشاور پولیس اسٹیشن' }
        ];
        
        const icons = {
            station: L.divIcon({
                html: '<div style="background: #1e40af; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px;">👮</div>',
                iconSize: [24, 24]
            }),
            patrol: L.divIcon({
                html: '<div style="background: #f59e0b; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px;">🚓</div>',
                iconSize: [24, 24]
            }),
            checkpost: L.divIcon({
                html: '<div style="background: #6b7280; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px;">🚧</div>',
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
                const shouldShow = (filter === 'station' && icon.options.html.includes('👮')) ||
                                  (filter === 'patrol' && icon.options.html.includes('🚓')) ||
                                  (filter === 'checkpost' && icon.options.html.includes('🚧'));
                
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
function reportCrime() {
    alert('جرم کی اطلاع!\n\nپولیس کو مطلع کر دیا گیا ہے۔\nکیس نمبر: POL-2025-0099\nبراہ کرم اپنا مقام شیئر کریں۔');
}

function womenSafety() {
    alert('خواتین ہیلپ لائن:\n\nفوری مدد: 0800-78789\nرازداری برقرار رکھی جائے گی\nپولیس ٹیم بھیج دی گئی ہے۔');
}

function trafficComplaint() {
    alert('ٹرافک شکایت:\n\n1. گاڑی کا نمبر نوٹ کریں\n2. مقام بتائیں\n3. واقعے کی تفصیل دیں\n4. شکایت نمبر: TRF-2025-0045');
}

function missingPerson() {
    alert('لاپتہ شخص:\n\n1. تصویر فراہم کریں\n2. آخری مقام بتائیں\n3. رابطہ نمبر دیں\n4. تفصیلات ریکارڈ کر لی گئیں');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new PoliceEmergencySystem();
});
