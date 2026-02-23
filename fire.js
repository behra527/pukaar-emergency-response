class FireEmergencySystem {
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
        const mapContainer = document.getElementById('fireMap');
        if (mapContainer && typeof L !== 'undefined') {
            this.map = L.map('fireMap').setView([30.3753, 69.3451], 6);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(this.map);
            
            this.renderFireMarkers();
        }
    }
    
    renderFireMarkers() {
        if (!this.map) return;
        
        const locations = [
            { type: 'active', lat: 31.5204, lng: 74.3587, name: 'لاہور فائر' },
            { type: 'station', lat: 33.6844, lng: 73.0479, name: 'اسلام آباد فائر اسٹیشن' },
            { type: 'hydrant', lat: 24.8607, lng: 67.0011, name: 'کراچی ہائیڈریٹ' },
            { type: 'station', lat: 34.0151, lng: 71.5249, name: 'پشاور فائر اسٹیشن' }
        ];
        
        const icons = {
            active: L.divIcon({
                html: '<div style="background: #dc2626; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px;">🔥</div>',
                iconSize: [24, 24]
            }),
            station: L.divIcon({
                html: '<div style="background: #f59e0b; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px;">🚒</div>',
                iconSize: [24, 24]
            }),
            hydrant: L.divIcon({
                html: '<div style="background: #1e40af; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px;">💧</div>',
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
                const shouldShow = (filter === 'active' && icon.options.html.includes('🔥')) ||
                                  (filter === 'station' && icon.options.html.includes('🚒')) ||
                                  (filter === 'hydrant' && icon.options.html.includes('💧'));
                
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
function reportFire() {
    alert('فائر الرٹ!\n\nفائر بریگیڈ کو مطلع کر دیا گیا ہے۔\nبراہ کرم فوری طور پر عمارت خالی کریں۔');
}

function fireSafety() {
    alert('اگ سے بچاؤ:\n\n1. فائر ایکسٹنگیشر استعمال کریں\n2. کپڑے پر پانی لگائیں\n3. سانس لینے کے لیے گیلا کپڑا استعمال کریں\n4. فوری نکلنے کی کوشش کریں');
}

function findHydrant() {
    alert('نزدیکی ہائیڈریٹ:\n\nگلی نمبر 5 - 50 میٹر\nگلی نمبر 7 - 120 میٹر\nگلی نمبر 3 - 200 میٹر');
}

function evacuationPlan() {
    alert('ایواکویشن پلان:\n\n1. پسلی سیڑھیاں استعمال کریں\n2. لفٹ استعمال نہ کریں\n3. اکھاڑے جائیں نہ\n4. جمع ہونے کی جگہ: پارکنگ ایریا');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new FireEmergencySystem();
});
