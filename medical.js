class MedicalEmergencySystem {
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
        // Language selector
        document.getElementById('languageSelect')?.addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });
        
        // Map filter controls
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
        const mapContainer = document.getElementById('medicalMap');
        if (mapContainer && typeof L !== 'undefined') {
            this.map = L.map('medicalMap').setView([30.3753, 69.3451], 6);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(this.map);
            
            this.renderMedicalMarkers();
        }
    }
    
    renderMedicalMarkers() {
        if (!this.map) return;
        
        const locations = [
            { type: 'ambulance', lat: 33.6844, lng: 73.0479, name: 'اسلام آباد ایمبولینس' },
            { type: 'hospital', lat: 31.5204, lng: 74.3587, name: 'لاہور جنرل ہسپتال' },
            { type: 'clinic', lat: 24.8607, lng: 67.0011, name: 'کراچی کلینک' },
            { type: 'hospital', lat: 34.0151, lng: 71.5249, name: 'پشاور ہسپتال' },
            { type: 'ambulance', lat: 30.1575, lng: 71.5249, name: 'ملتان ایمبولینس' }
        ];
        
        const icons = {
            ambulance: L.divIcon({
                html: '<div style="background: #dc2626; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px;">🚑</div>',
                iconSize: [24, 24]
            }),
            hospital: L.divIcon({
                html: '<div style="background: #1e40af; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px;">🏥</div>',
                iconSize: [24, 24]
            }),
            clinic: L.divIcon({
                html: '<div style="background: #6b7280; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px;">🏨</div>',
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
                // Simple filter logic based on icon type
                const icon = marker.getIcon();
                const shouldShow = (filter === 'ambulance' && icon.options.html.includes('🚑')) ||
                                  (filter === 'hospital' && icon.options.html.includes('🏥')) ||
                                  (filter === 'clinic' && icon.options.html.includes('🏨'));
                
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

// Global functions for onclick handlers
function requestAmbulance() {
    alert('ایمبولینس کی درخواست بھیج دی گئی ہے!\n\nآپ کو جلد ہی کال آئے گی۔');
}

function findHospital() {
    alert('نزدیکی ہسپتال تلاش کیا جا رہا ہے...\n\nاسلام آباد جنرل ہسپتال - 2.3km\nپیمز ہسپتال - 4.1km');
}

function medicalAdvice() {
    alert('طبی مشورہ:\n\n1. پہلے 1122 پر کال کریں\n2. مریض کو آرام دیں\n3. سانس روکنے والی چیزیں دور رکھیں');
}

function bloodBank() {
    alert('بلڈ بینک:\n\nA+ دستیاب: 12 یونٹ\nB+ دستیاب: 8 یونٹ\nO+ دستیاب: 15 یونٹ\nAB+ دستیاب: 5 یونٹ');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new MedicalEmergencySystem();
});
