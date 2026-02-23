class PukaarEmergencySystem {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.recordedAudio = null;
        this.currentLanguage = 'ur';
        this.recordingStartTime = null;
        this.recordingTimer = null;
        this.currentSection = 'dashboard';
        
        // Response essays based on emergency types
        this.emergencyResponses = {
            medical: {
                ur: "میڈیکل ایمرجنسی کے لیے فوری مدد کی جا رہی ہے۔ براہ کرم آرام کریں اور اپنی جگہ سے نہ ہٹیں۔ ایمبولینس کے آنے تک انتظار کریں۔ اگر آپ کو سانس لینے میں تکلیف ہو رہی ہے تو فوراً 1122 پر کال کریں۔",
                ps: "طبي امراضات لپاره ژر مرستې رارسېږي. مهرباني وکړئ آرام وکړئ او خپل ځای نه پرېږئ. د طبي امداد تر رسېدو پورې انتظار وکړئ. که تاسو ته د سانس اخیستلو ستونزه لري، نو ژر 1122 ته زنګ ووهئ.",
                sd: "طبي امراض لاءِ فوري مدد ڪئي پئي وڃي. مهرباني ڪري آرام ڪريو ۽ پنهنجي جاءِ تان کان نڪريو. طبي امداد اچڻ تائين انتظار ڪريو. جيڪنهن توهان کي سانس ۾ تڪليف ٿي رهي آهي، ته فوري 1122 تي فون ڪريو.",
                sk: "طبی امراضہ کیتے فوری مدد کیتی ویندی پی۔ مہربانی کر کے آرام کرو تے آپڑی جاہ توں نہ ہٹو۔ ایمبولینس دے آؤݨ تائین انتظار کرو۔ جے تسیں کوں سانس گھنݨ وچ تکلیف ہوندی پی تاں فوراً 1122 تے کال کرو۔"
            },
            fire: {
                ur: "آگ بجھانے کی ٹیم فوری طور پر بھیجی جا رہی ہے۔ براہ کرم فوری طور پر عمارت خالی کریں اور محفوظ جگہ پر جائیں۔ اگر آگ بڑھ رہی ہے تو فائر بریگیڈ کو کال کریں۔",
                ps: "د اور اړولو ډله استول کېږي. مهرباني وکړئ ژر په ژر کور خالي کړئ او خونده ځای ته ولاړئ که اور لوړېږي نو د اور اړولو ډلې ته زنګ ووهئ.",
                sd: "اگ بجھائڻ لاءِ ٽيم موڪلي پئي وڃي. مهرباني ڪري فوري طور تي گھر خالي ڪريو ۽ محفوظ جاءِ تي وڃو. جيڪهن اگ وڌي رهي آهي ته فائر بريگيڊ کي فون ڪريو.",
                sk: "اگ بجھاؤڑ کیتے ٹیم فوری طور تے بھیجی ویندی پی۔ مہربانی کر کے فوری طور تے گھر خالی کرو تے محفوظ جاہ تے جاؤ۔ جے اگ وڈھدی ہوئی پی تاں فائر بریگیڈ کوں کال کرو۔"
            },
            accident: {
                ur: "حادثے کی جگہ مدد بھیجی جا رہی ہے۔ براہ کرم حفاظت کریں اور زخمیوں کو مدد فراہم کریں۔ اگر سنجیدہ چوٹیں ہیں تو ایمبولینس کا انتظار کریں۔",
                ps: "د پېښې ځاي ته مرستې لېږل کېږي. مهرباني وکړئ خپله ساتنه وکړئ او ژخمیو ته مرستې وکړئ که جدې زخمونه دي نو د ايمبولانس انتظار وکړئ.",
                sd: "حادثي جي جاءِ تي مدد موڪلي پئي وڃي. مهرباني ڪري پنهنجي حفاظت ڪريو ۽ زخمين کي مدد ڏيو. جيڪنهن وڏا زخم آهن ته ايمبولينس جو انتظار ڪريو.",
                sk: "حادثے دی جاہ تے مدد بھیجی ویندی پی۔ مہربانی کر کے حفاظت کرو تے زخمیاں کوں مدد فراہم کرو۔ جے سنجیدے چوٹ ہاں تاں ایمبولینس دا انتظار کرو۔"
            },
            theft: {
                ur: "پولیس کو فوری طور پر بلایا جا رہا ہے۔ براہ کرم محفوظ جگہ پر رہیں اور اردگرد کی صورت حال دیکھیں۔ اگر خطرہ محسوس ہو تو فوری طور پر مدد طلب کریں۔",
                ps: "پوليس ته ژر اړول کېږي. مهرباني وکړئ خونده ځاي پاتې شئ او شاوخوا کې حالات ولولئ که خطره وموندئ نو ژر مرستې غوښته.",
                sd: "پوليس کي فوري طور تي سڏيو پئي وڃي. مهرباني ڪري محفوظ جاءِ تي رهو ۽ آسپاس جو حالت ڏسو. جيڪهن خطرو محسوس ڪريو ته فوري مدد گهرجو.",
                sk: "پولیس کوں فوری طور تے بلایا ویندا پی۔ مہربانی کر کے محفوظ جاہ تے رہو تے اردگرد دی حالت دیکھو۔ جے خطرہ محسوس ہووے تاں فوری طور تے مدد طلب کرو۔"
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateDateTime();
        this.setupNavigation();
        this.detectUserLanguage();
        this.updateDashboardStats();
        this.initializeLiveMap();
        setInterval(() => this.updateDateTime(), 1000);
        setInterval(() => this.updateDashboardStats(), 30000); // Update every 30 seconds
        setInterval(() => this.updateLiveMap(), 5000); // Update map every 5 seconds
    }
    
    initializeLiveMap() {
        const mapContainer = document.getElementById('liveMap');
        if (mapContainer && typeof L !== 'undefined') {
            // Initialize real map centered on Pakistan
            this.map = L.map('liveMap').setView([30.3753, 69.3451], 6);
            
            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(this.map);
            
            // Initialize emergency markers
            this.emergencyMarkers = [];
            this.renderEmergencyMarkers();
            this.updateMapStats();
            
            console.log('Real map initialized successfully');
        } else {
            console.error('Leaflet library not loaded');
        }
    }
    
    renderEmergencyMarkers() {
        if (!this.map) return;
        
        // Clear existing markers
        this.emergencyMarkers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.emergencyMarkers = [];
        
        // Simulated emergency locations in Pakistan
        const emergencies = [
            { type: 'medical', lat: 33.6844, lng: 73.0479, city: 'اسلام آباد' },
            { type: 'fire', lat: 31.5204, lng: 74.3587, city: 'لاہور' },
            { type: 'accident', lat: 24.8607, lng: 67.0011, city: 'کراچی' },
            { type: 'police', lat: 36.8619, lng: 74.4233, city: 'گلگت' },
            { type: 'medical', lat: 34.0151, lng: 71.5249, city: 'پشاور' },
            { type: 'fire', lat: 30.1575, lng: 71.5249, city: 'ملتان' },
            { type: 'accident', lat: 26.8535, lng: 68.3679, city: 'سکھر' },
            { type: 'police', lat: 25.3960, lng: 68.3578, city: 'حیدرآباد' }
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
            
            // Add popup with city name
            marker.bindPopup(`
                <div style="text-align: center; padding: 8px;">
                    <strong>${this.getEmergencyTypeName(emergency.type)}</strong><br>
                    ${emergency.city}<br>
                    <small>ایکٹو #${index + 1}</small>
                </div>
            `);
            
            this.emergencyMarkers.push(marker);
        });
        
        // Fit map to show all markers
        const group = new L.featureGroup(this.emergencyMarkers);
        this.map.fitBounds(group.getBounds().pad(0.1));
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
    
    updateLiveMap() {
        if (!this.map) return;
        
        // Randomly update some marker positions slightly to simulate real-time updates
        this.emergencyMarkers.forEach((marker, index) => {
            if (Math.random() > 0.7) { // 30% chance to update
                const currentLatLng = marker.getLatLng();
                const newLat = currentLatLng.lat + (Math.random() - 0.5) * 0.01;
                const newLng = currentLatLng.lng + (Math.random() - 0.5) * 0.01;
                marker.setLatLng([newLat, newLng]);
            }
        });
        
        this.updateMapStats();
    }
    
    updateMapStats() {
        const activeEmergencies = document.getElementById('activeEmergencies');
        const responseTeams = document.getElementById('responseTeams');
        const avgResponse = document.getElementById('avgResponse');
        
        if (activeEmergencies) {
            const count = 12 + Math.floor(Math.random() * 8);
            activeEmergencies.textContent = count;
        }
        
        if (responseTeams) {
            const teams = 6 + Math.floor(Math.random() * 6);
            responseTeams.textContent = teams;
        }
        
        if (avgResponse) {
            const time = (2.0 + Math.random() * 1.5).toFixed(1);
            avgResponse.textContent = time;
        }
    }
    
    filterMapMarkers(filter) {
        if (!this.map) return;
        
        const mapButtons = document.querySelectorAll('.map-btn');
        
        // Update button states
        mapButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent.toLowerCase() === filter) {
                btn.classList.add('active');
            }
        });
        
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
    
    detectUserLanguage() {
        // Detect browser language or use system default
        const browserLang = navigator.language || navigator.userLanguage;
        const langMap = {
            'ur': 'ur',
            'ps': 'ps', 
            'sd': 'sd',
            'sk': 'sk',
            'en': 'ur', // Default to Urdu for English
            'hi': 'ur'  // Default to Urdu for Hindi
        };
        
        // Extract first two letters
        const shortLang = browserLang ? browserLang.substring(0, 2).toLowerCase() : 'ur';
        this.currentLanguage = langMap[shortLang] || 'ur';
        
        // Update language selector
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = this.currentLanguage;
        }
        
        console.log('Detected language:', this.currentLanguage);
        
        // Update UI language immediately
        setTimeout(() => {
            this.updateUILanguage();
        }, 100);
    }
    
    updateDashboardStats() {
        // Simulate real-time stats updates
        const stats = {
            medical: { current: 24, change: 12, total: 156 },
            fire: { current: 8, change: -5, active: 12 },
            accident: { current: 15, change: 8, interstate: 8 },
            theft: { current: 32, change: 18, patrol: 4 }
        };
        
        // Update stat values with random variations
        Object.keys(stats).forEach(type => {
            const stat = stats[type];
            const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
            
            if (type === 'medical') {
                const medicalValue = document.querySelector('.stat-card.urgent .stat-value');
                const medicalChange = document.querySelector('.stat-card.urgent .stat-change');
                const medicalDetail = document.querySelector('.stat-card.urgent .stat-detail');
                
                if (medicalValue) medicalValue.textContent = stat.current + variation;
                if (medicalChange) medicalChange.textContent = `${stat.change + variation > 0 ? '+' : ''}${stat.change + variation}% آج`;
                if (medicalDetail) medicalDetail.textContent = `آج کی کل رپورٹس: ${stat.total + Math.floor(Math.random() * 10)}`;
            }
        });
    }
    
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                console.log('Nav clicked:', e.target.dataset.section);
                this.switchSection(e.target.dataset.section);
            });
        });
        
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                console.log('Tab clicked:', e.target.dataset.tab);
                this.switchTab(e.target.dataset.tab);
            });
        });
        
        // Quick action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                console.log('Quick action clicked:', e.currentTarget.dataset.emergency);
                this.handleQuickEmergency(e.currentTarget.dataset.emergency);
            });
        });
        
        // Map controls
        document.querySelectorAll('.map-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                console.log('Map filter clicked:', e.target.textContent);
                this.filterMapMarkers(e.target.textContent.toLowerCase());
            });
        });
        
        // Recording controls
        const recordBtn = document.getElementById('recordBtn');
        if (recordBtn) {
            recordBtn.addEventListener('click', () => {
                console.log('Record button clicked');
                this.toggleRecording();
            });
        }
        
        // File upload
        const audioFile = document.getElementById('audioFile');
        const uploadArea = document.getElementById('uploadArea');
        const uploadBtn = document.querySelector('.upload-btn');
        
        if (audioFile) {
            audioFile.addEventListener('change', (e) => {
                console.log('File selected:', e.target.files);
                this.handleFileUpload(e);
            });
        }
        
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                console.log('Upload button clicked');
                if (audioFile) audioFile.click();
            });
        }
        
        if (uploadArea) {
            uploadArea.addEventListener('click', () => {
                console.log('Upload area clicked');
                if (audioFile) audioFile.click();
            });
            
            // Drag and drop
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = 'var(--primary-blue)';
                uploadArea.style.background = 'rgba(30, 64, 175, 0.05)';
            });
            
            uploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = 'var(--border-gray)';
                uploadArea.style.background = 'var(--light-gray)';
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = 'var(--border-gray)';
                uploadArea.style.background = 'var(--light-gray)';
                
                const files = e.dataTransfer.files;
                console.log('Files dropped:', files);
                if (files.length > 0 && files[0].type.startsWith('audio/')) {
                    this.handleFile(files[0]);
                }
            });
        }
        
        // Processing
        const processBtn = document.getElementById('processBtn');
        if (processBtn) {
            processBtn.addEventListener('click', () => {
                console.log('Process button clicked');
                this.processAudio();
            });
        }
        
        // Response actions
        const playResponseBtn = document.getElementById('playResponseBtn');
        const copyBtn = document.querySelector('.copy-btn');
        const newReportBtn = document.querySelector('.new-report-btn');
        
        if (playResponseBtn) {
            playResponseBtn.addEventListener('click', () => {
                console.log('Play response clicked');
                this.playResponse();
            });
        }
        
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                console.log('Copy button clicked');
                this.copyResponse();
            });
        }
        
        if (newReportBtn) {
            newReportBtn.addEventListener('click', () => {
                console.log('New report clicked');
                this.newReport();
            });
        }
        
        // Language selector
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                console.log('Language changed:', e.target.value);
                this.changeLanguage(e.target.value);
            });
        }
        
        // Remove file button
        const removeFileBtn = document.querySelector('.remove-file');
        if (removeFileBtn) {
            removeFileBtn.addEventListener('click', () => {
                console.log('Remove file clicked');
                this.removeFile();
            });
        }
        
        console.log('All event listeners setup complete');
    }
    
    setupNavigation() {
        // Show dashboard by default
        this.showSection('dashboard');
    }
    
    switchSection(section) {
        console.log('Switching to section:', section);
        
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeNavBtn = document.querySelector(`[data-section="${section}"]`);
        if (activeNavBtn) {
            activeNavBtn.classList.add('active');
        }
        
        // Show corresponding section
        this.showSection(section);
        this.currentSection = section;
    }
    
    showSection(section) {
        console.log('Showing section:', section);
        
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });
        
        const targetSection = document.getElementById(`${section}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            console.log('Section found and activated:', section);
        } else {
            console.error('Section not found:', section);
        }
    }
    
    switchTab(tab) {
        console.log('Switching to tab:', tab);
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeTabBtn = document.querySelector(`[data-tab="${tab}"]`);
        if (activeTabBtn) {
            activeTabBtn.classList.add('active');
        }
        
        // Show corresponding tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const targetTab = document.getElementById(`${tab}-tab`);
        if (targetTab) {
            targetTab.classList.add('active');
            console.log('Tab found and activated:', tab);
        } else {
            console.error('Tab not found:', tab);
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
    
    async toggleRecording() {
        console.log('Toggle recording called');
        
        const recordBtn = document.getElementById('recordBtn');
        const recordingStatus = document.getElementById('recording-status');
        const recordingTime = document.getElementById('recording-time');
        const waveform = document.querySelector('.audio-waveform');
        
        if (!recordBtn || !recordingStatus || !recordingTime || !waveform) {
            console.error('Recording elements not found');
            return;
        }
        
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            console.log('Stopping recording');
            this.stopRecording();
            recordBtn.classList.remove('recording');
            recordingStatus.textContent = 'تیار ہے';
            waveform.classList.remove('recording');
            clearInterval(this.recordingTimer);
        } else {
            console.log('Starting recording');
            await this.startRecording();
            recordBtn.classList.add('recording');
            recordingStatus.textContent = 'ریکارڈنگ ہو رہی ہے';
            waveform.classList.add('recording');
            this.startRecordingTimer();
        }
    }
    
    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];
            
            this.mediaRecorder.ondataavailable = (event) => {
                this.audioChunks.push(event.data);
            };
            
            this.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                this.recordedAudio = audioBlob;
                this.enableProcessButton();
                this.updateRecordingDisplay(audioBlob);
            };
            
            this.mediaRecorder.start();
            this.recordingStartTime = Date.now();
            
        } catch (error) {
            console.error('Error accessing microphone:', error);
            this.showError('مائیکروفون تک رسائی حاصل کرنے میں مسئلہ۔ براہ کرم اجازت دیں۔');
        }
    }
    
    stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.stop();
            this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
    }
    
    startRecordingTimer() {
        this.recordingStartTime = Date.now();
        this.recordingTimer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            document.getElementById('recording-time').textContent = `${minutes}:${seconds}`;
        }, 1000);
    }
    
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('audio/')) {
            this.handleFile(file);
        } else {
            this.showError('براہ کرم درست آڈیو فائل منتخب کریں۔');
        }
    }
    
    handleFile(file) {
        this.recordedAudio = file;
        this.updateFileDisplay(file);
        this.enableProcessButton();
    }
    
    updateFileDisplay(file) {
        const fileInfo = document.getElementById('fileInfo');
        const fileName = fileInfo.querySelector('.file-name');
        const fileSize = fileInfo.querySelector('.file-size');
        const uploadArea = document.getElementById('uploadArea');
        
        fileName.textContent = file.name;
        fileSize.textContent = this.formatFileSize(file.size);
        
        uploadArea.classList.add('hidden');
        fileInfo.classList.remove('hidden');
    }
    
    updateRecordingDisplay(audioBlob) {
        const fileName = `Recording_${Date.now()}.wav`;
        this.updateFileDisplay(new File([audioBlob], fileName, { type: 'audio/wav' }));
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    removeFile() {
        this.recordedAudio = null;
        document.getElementById('fileInfo').classList.add('hidden');
        document.getElementById('uploadArea').classList.remove('hidden');
        document.getElementById('audioFile').value = '';
        this.disableProcessButton();
    }
    
    enableProcessButton() {
        const processBtn = document.getElementById('processBtn');
        processBtn.disabled = false;
        processBtn.style.opacity = '1';
    }
    
    disableProcessButton() {
        const processBtn = document.getElementById('processBtn');
        processBtn.disabled = true;
        processBtn.style.opacity = '0.6';
    }
    
    async processAudio() {
        const processingLoader = document.getElementById('processingLoader');
        const processBtn = document.getElementById('processBtn');
        
        // Show processing
        processingLoader.classList.remove('hidden');
        processBtn.disabled = true;
        
        // Animate progress
        const progressFill = document.querySelector('.progress-fill');
        progressFill.style.width = '0%';
        
        try {
            // Simulate processing steps
            await this.simulateProgress(progressFill);
            
            // Process the audio
            const detectedLang = this.detectLanguage();
            const transcribedText = this.simulateTranscription(detectedLang);
            const emergencyType = this.detectEmergencyType(transcribedText, detectedLang);
            const response = this.emergencyResponses[emergencyType][detectedLang];
            
            // Show results
            this.displayResults(detectedLang, transcribedText, emergencyType, response);
            
            // Switch to results section
            setTimeout(() => {
                this.switchSection('results');
            }, 500);
            
        } catch (error) {
            console.error('Processing error:', error);
            this.showError('آڈیو پروسیسنگ میں مسئلہ ہوا۔ دوبارہ کوشش کریں۔');
        } finally {
            processingLoader.classList.add('hidden');
            processBtn.disabled = false;
        }
    }
    
    async simulateProgress(progressFill) {
        return new Promise(resolve => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 30;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    resolve();
                }
                progressFill.style.width = `${progress}%`;
            }, 300);
        });
    }
    
    detectLanguage() {
        // For demo, use current language or random
        const languages = ['ur', 'ps', 'sd', 'sk'];
        return languages[Math.floor(Math.random() * languages.length)];
    }
    
    simulateTranscription(language) {
        const transcriptions = {
            ur: [
                "میڈیکل ایمرجنسی ہے، مجھے فوری طبی مدد چاہیے",
                "آگ لگ گئی ہے، فوری مدد کریں",
                "کار حادثہ ہو گیا ہے، زخمی ہیں",
                "چوری ہو گئی ہے، پولیس کو بلائیں"
            ],
            ps: [
                "طبي امراض دي، ما ته ژره مرستې ته اړتیا لرم",
                "اور لگې ده، ژر مرستې وکړئ",
                "موټر پېښه شوې، ژخميان شته",
                "دزدۍ وشوه، پوليس اړوه"
            ],
            sd: [
                "طبي امراض آهي، مون کي فوري مدد گهرجي",
                "اگ لڳي آهي، فوري مدد ڪريو",
                "ڪار حادثو ٿيو آهي، زخمي آهن",
                "چوري ٿي آهي، پوليس کي سڏيو"
            ],
            sk: [
                "طبی امراضہ ہے، میں کوں فوری مدد چاہیدی ہے",
                "اگ لگ گئی ہے، فوری مدد کرو",
                "کار حادثہ تھ گیا ہے، زخمی ہاں",
                "چوری ہو گئی ہے، پولیس کوں بلاؤ"
            ]
        };
        
        const texts = transcriptions[language];
        return texts[Math.floor(Math.random() * texts.length)];
    }
    
    detectEmergencyType(text, language) {
        const keywords = {
            medical: ['میڈیکل', 'ڈاکٹر', 'بیمار', 'درد', 'hospital', 'medical', 'طبي', 'ډاکتر', 'ناروغ'],
            fire: ['آگ', 'اگ', 'بجھانا', 'fire', 'اور', 'اړول', 'بجھائڻ'],
            accident: ['حادثہ', 'ڈھانا', 'کار', 'accident', 'پېښه', 'غورځول', 'حادثو'],
            theft: ['چوری', 'چور', 'ڈاکو', 'police', 'دزدۍ', 'چوري', 'چور']
        };
        
        for (const [type, words] of Object.entries(keywords)) {
            for (const keyword of words) {
                if (text.toLowerCase().includes(keyword.toLowerCase())) {
                    return type;
                }
            }
        }
        
        return 'medical'; // Default
    }
    
    displayResults(language, text, emergencyType, response) {
        const languageNames = {
            ur: 'اردو',
            ps: 'پشتو',
            sd: 'سندھی',
            sk: 'سرائیکی'
        };
        
        const emergencyNames = {
            medical: 'میڈیکل ایمرجنسی',
            fire: 'اگ بجھاؤ',
            accident: 'حادثہ',
            theft: 'چوری/پولیس'
        };
        
        document.getElementById('detectedLanguage').textContent = languageNames[language];
        document.getElementById('transcribedText').textContent = text;
        document.getElementById('emergencyType').textContent = emergencyNames[emergencyType];
        document.getElementById('responseText').textContent = response;
        
        // Store for playback
        this.currentResponse = response;
        this.currentResponseLanguage = language;
        this.currentEmergencyType = emergencyType;
    }
    
    async playResponse() {
        try {
            // Try to play pre-recorded audio first
            const audioPath = this.getResponseAudioPath();
            if (audioPath) {
                await this.playAudioFile(audioPath);
            } else {
                // Fallback to text-to-speech
                await this.playTextToSpeech();
            }
        } catch (error) {
            console.error('Audio playback error:', error);
            this.showError('آڈیو پلے بیک میں مسئلہ۔');
        }
    }
    
    getResponseAudioPath() {
        const audioMap = {
            medical: 'response_01.wav.wav',
            fire: 'response_02.wav.wav',
            accident: 'response_03.wav.wav',
            theft: 'response_04.wav.wav'
        };
        
        const fileName = audioMap[this.currentEmergencyType];
        return fileName ? `response_audio-/${fileName}` : null;
    }
    
    async playAudioFile(path) {
        const audio = new Audio(path);
        await audio.play();
    }
    
    async playTextToSpeech() {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(this.currentResponse);
            
            const langMap = {
                ur: 'ur-IN',
                ps: 'ps-AF',
                sd: 'sd-IN',
                sk: 'ur-IN'
            };
            
            utterance.lang = langMap[this.currentResponseLanguage] || 'ur-IN';
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            
            speechSynthesis.cancel();
            speechSynthesis.speak(utterance);
        } else {
            this.showError('آواز پلے بیک کی سہولت دستیاب نہیں ہے۔');
        }
    }
    
    copyResponse() {
        const responseText = document.getElementById('responseText').textContent;
        navigator.clipboard.writeText(responseText).then(() => {
            this.showSuccess('جواب کاپی ہو گیا!');
        }).catch(() => {
            this.showError('کاپی کرنے میں مسئلہ ہوا۔');
        });
    }
    
    newReport() {
        // Reset form and go back to dashboard
        this.removeFile();
        this.switchSection('dashboard');
        
        // Reset results
        document.getElementById('detectedLanguage').textContent = '-';
        document.getElementById('transcribedText').textContent = '-';
        document.getElementById('emergencyType').textContent = '-';
        document.getElementById('responseText').textContent = '-';
    }
    
    handleQuickEmergency(emergencyType) {
        console.log('Handling quick emergency:', emergencyType);
        
        const response = this.emergencyResponses[emergencyType][this.currentLanguage];
        const emergencyNames = {
            medical: 'میڈیکل ایمرجنسی',
            fire: 'اگ بجھاؤ',
            accident: 'حادثہ',
            theft: 'چوری/پولیس'
        };
        
        console.log('Displaying emergency results');
        this.displayResults(this.currentLanguage, 'فوری ایمرجنسی', emergencyType, response);
        this.switchSection('results');
    }
    
    changeLanguage(language) {
        this.currentLanguage = language;
        console.log('Language changed to:', language);
        
        // Update all UI text based on new language
        this.updateUILanguage();
        
        // Show notification
        this.showSuccess(`زبان تبدیل ہو گئی: ${this.getLanguageName(language)}`);
    }
    
    getLanguageName(code) {
        const names = {
            ur: 'اردو',
            ps: 'پشتو',
            sd: 'سندھی',
            sk: 'سرائیکی'
        };
        return names[code] || code;
    }
    
    updateUILanguage() {
        const translations = {
            ur: {
                // Navigation
                dashboard: 'ڈیش بورڈ',
                emergency: 'ایمرجنسی',
                history: 'ہسٹری',
                settings: 'سیٹنگز',
                // Dashboard
                urgentDiseases: 'فوری امراض',
                putOutFire: 'اگ بجھاؤ',
                accidents: 'حادثات',
                security: 'سیکیورٹی',
                today: 'آج',
                activeTeams: 'فعال ٹیمیں',
                interstateHospital: 'اینٹر سٹیٹ ہسپٹل',
                patrol: 'پٹرولنگ',
                quickActions: 'فوری ایکشنز',
                medicalDiseases: 'میڈیکل امراض',
                urgentMedicalHelp: 'فوری طبی مدد',
                fireBrigade: 'فائر بریگیڈ',
                roadAccidents: 'روڈ حادثات',
                securityAssistance: 'سیکیورٹی امداد',
                liveEmergencyMap: 'لائیو ایمرجنسی مپ',
                audioReport: 'آڈیو رپورٹ',
                record: 'ریکارڈ',
                upload: 'اپ لوڈ',
                processAudio: 'آڈیو پروسیس کریں',
                results: 'تجزیہ نتائج',
                newReport: 'نیا رپورٹ',
                // Footer
                systemInfo: 'پُکار ایمرجنسی سسٹم',
                systemDesc: 'پاکستان میں زبان کی رکاوٹیں توڑنے کے لیے',
                contacts: 'اہم رابطے',
                emergency: 'ایمرجنسی',
                medicalHelp: 'میڈیکل ہیلپ',
                policeHelp: 'پولیس ہیلپ لائن',
                version: 'ورژن',
                lastUpdate: 'لاسٹ اپڈیٹ',
                server: 'سرور',
                online: 'آن لائن',
                users: 'یوزرز',
                active: 'فعال',
                todayReports: 'آج کی رپورٹس',
                avgResponseTime: 'اوسط رسپانز ٹائم',
                allRights: 'آل رائٹس ریزرو',
                govtCertified: 'پاکستان حکومت سرٹیفائیڈ ایمرجنسی سسٹم'
            },
            ps: {
                // Navigation
                dashboard: 'ډیشبورډ',
                emergency: 'ایمرجنسي',
                history: 'هسټري',
                settings: 'سيټنګز',
                // Dashboard
                urgentDiseases: 'فوري امراض',
                putOutFire: 'د اور اړول',
                accidents: 'پېښې',
                security: 'سيکورټي',
                today: 'نن',
                activeTeams: 'فعال ډلې',
                interstateHospital: 'د ولایتونو تر منځنۍ روغتون',
                patrol: 'ګشت',
                quickActions: 'ژر چکاډ',
                medicalDiseases: 'طبي امراض',
                urgentMedicalHelp: 'ژر طبي مرستې',
                fireBrigade: 'د اور اړولو ډله',
                roadAccidents: 'لارو پېښې',
                securityAssistance: 'سيکورټي مرستې',
                liveEmergencyMap: 'ژر ايمرجنسي نقشه',
                audioReport: 'آډيو راپورټ',
                record: 'ريکارډ',
                upload: 'اپلوډ',
                processAudio: 'آډيو پروسس کړئ',
                results: 'تحليل نتايج',
                newReport: 'نوی راپورټ',
                // Footer
                systemInfo: 'پُکار ايمرجنسي سيستم',
                systemDesc: 'پاکستان کې د ژبونو د خنډولو لپاره',
                contacts: 'اړوند اړيکې',
                emergency: 'ايمرجنسي',
                medicalHelp: 'طبي مرسته',
                policeHelp: 'پوليس مرسته',
                version: 'ورژن',
                lastUpdate: 'آخري اپډيټ',
                server: 'سرور',
                online: 'آنلاين',
                users: 'کارنان',
                active: 'فعال',
                todayReports: 'نن راپورټې',
                avgResponseTime: 'منځنۍ رسپانز وخت',
                allRights: 'ټول حقونه ساتل شوي',
                govtCertified: 'د پاکستان حکومت تصديب شوی ايمرجنسي سيستم'
            },
            sd: {
                // Navigation
                dashboard: 'ڊيشبورڊ',
                emergency: 'ايمرجنسي',
                history: 'هسٽري',
                settings: 'سيٽنگس',
                // Dashboard
                urgentDiseases: 'فوري امراض',
                putOutFire: 'اگ بجھائڻ',
                accidents: 'حادثا',
                security: 'سيڪورٽي',
                today: 'اڄ',
                activeTeams: 'فعال ٽيمون',
                interstateHospital: 'صوبن وچون جو اسپتال',
                patrol: 'پيٽرولنگ',
                quickActions: 'فوري اَڪشن',
                medicalDiseases: 'طبي امراض',
                urgentMedicalHelp: 'فوري طبي مدد',
                fireBrigade: 'اگ بجھائڻ جو دستو',
                roadAccidents: 'سڪر حادثا',
                securityAssistance: 'سيڪورٽي مدد',
                liveEmergencyMap: 'لائيو ايمرجنسي نقشو',
                audioReport: 'آڊيو رپورٽ',
                record: 'ريڪارڊ',
                upload: 'اپلوڊ',
                processAudio: 'آڊيو پروسيس ڪريو',
                results: 'تجزيو نتائجا',
                newReport: 'نئون رپورٽ',
                // Footer
                systemInfo: 'پُکار ايمرجنسي سسٽم',
                systemDesc: 'پاڪستان ۾ زبان جون رڪاوٽون کولي لاءِ',
                contacts: 'اهم رابطا',
                emergency: 'ايمرجنسي',
                medicalHelp: 'طبي مدد',
                policeHelp: 'پوليس مدد',
                version: 'ورژن',
                lastUpdate: 'آخري اپڊيٽ',
                server: 'سرور',
                online: 'آنلائين',
                users: 'يوزرس',
                active: 'فعال',
                todayReports: 'اڄ جا رپورٽون',
                avgResponseTime: 'اوسط رسپانز وقت',
                allRights: 'سڀ حق محفوظ آهن',
                govtCertified: 'پاڪستان حڪومت سرٽيفائيڊ ايمرجنسي سسٽم'
            },
            sk: {
                // Navigation
                dashboard: 'ڈیش بورڈ',
                emergency: 'ایمرجنسی',
                history: 'ہسٹری',
                settings: 'سیٹنگز',
                // Dashboard
                urgentDiseases: 'فوری امراض',
                putOutFire: 'اگ بجھاؤڑ',
                accidents: 'حادثے',
                security: 'سیکیورٹی',
                today: 'آج',
                activeTeams: 'فعال ٹیم',
                interstateHospital: 'بین ریاستی ہسپتال',
                patrol: 'پیٹرولنگ',
                quickActions: 'فوری ایکشنز',
                medicalDiseases: 'طبی امراض',
                urgentMedicalHelp: 'فوری طبی مدد',
                fireBrigade: 'فائر بریگیڈ',
                roadAccidents: 'سڑک حادثے',
                securityAssistance: 'سیکیورٹی امداد',
                liveEmergencyMap: 'لائیو ایمرجنسی مپ',
                audioReport: 'آڈیو رپورٹ',
                record: 'ریکارڈ',
                upload: 'اپ لوڈ',
                processAudio: 'آڈیو پروسیس کرو',
                results: 'تجزیہ نتائج',
                newReport: 'نیا رپورٹ',
                // Footer
                systemInfo: 'پُکار ایمرجنسی سسٹم',
                systemDesc: 'پاکستان وچ زبان دیاں رکاوٹاں توڑن واسطے',
                contacts: 'اہم رابطے',
                emergency: 'ایمرجنسی',
                medicalHelp: 'طبی مدد',
                policeHelp: 'پولیس مدد',
                version: 'ورژن',
                lastUpdate: 'لاسٹ اپڈیٹ',
                server: 'سرور',
                online: 'آن لائن',
                users: 'یوزر',
                active: 'فعال',
                todayReports: 'آج دیاں رپورٹاں',
                avgResponseTime: 'اوسط رسپانز ٹائم',
                allRights: 'سارے حق محفوظ',
                govtCertified: 'پاکستان حکومت سرٹیفائیڈ ایمرجنسی سسٹم'
            }
        };
        
        const t = translations[this.currentLanguage] || translations.ur;
        
        // Update Navigation
        this.updateElement('[data-section="dashboard"]', t.dashboard);
        this.updateElement('[data-section="emergency"]', t.emergency);
        this.updateElement('[data-section="history"]', t.history);
        this.updateElement('[data-section="settings"]', t.settings);
        
        // Update Dashboard Stats
        this.updateElement('.stat-card.urgent h3', t.urgentDiseases);
        this.updateElement('.stat-card.warning h3', t.putOutFire);
        this.updateElement('.stat-card.info h3', t.accidents);
        this.updateElement('.stat-card.security h3', t.security);
        
        // Update Quick Actions
        this.updateElement('.quick-actions-panel h2', t.quickActions);
        this.updateElement('.action-btn.medical h3', t.medicalDiseases);
        this.updateElement('.action-btn.medical p', t.urgentMedicalHelp);
        this.updateElement('.action-btn.fire h3', t.putOutFire);
        this.updateElement('.action-btn.fire p', t.fireBrigade);
        this.updateElement('.action-btn.accident h3', t.accidents);
        this.updateElement('.action-btn.accident p', t.roadAccidents);
        this.updateElement('.action-btn.police h3', t.security);
        this.updateElement('.action-btn.police p', t.securityAssistance);
        
        // Update Audio Panel
        this.updateElement('.audio-input-panel .panel-header h2', t.audioReport);
        this.updateElement('[data-tab="record"]', t.record);
        this.updateElement('[data-tab="upload"]', t.upload);
        this.updateElement('#processBtn span:last-child', t.processAudio);
        
        // Update Map Panel
        this.updateElement('.map-panel .panel-header h2', t.liveEmergencyMap);
        
        // Update Results
        this.updateElement('.result-header h2', t.results);
        this.updateElement('.new-report-btn', t.newReport);
        
        // Update Footer
        this.updateElement('.footer-section:first-child h4', t.systemInfo);
        this.updateElement('.footer-section:first-child p', t.systemDesc);
        this.updateElement('.footer-section:nth-child(2) h4', t.contacts);
        this.updateElement('.contact-item:first-child strong', t.emergency);
        this.updateElement('.contact-item:nth-child(2) strong', t.medicalHelp);
        this.updateElement('.contact-item:nth-child(3) strong', t.policeHelp);
        this.updateElement('.footer-section:last-child h4', t.systemInfo);
        this.updateElement('.system-info span:first-child', `${t.version}: v2.1.0`);
        this.updateElement('.system-info span:nth-child(2)', `${t.lastUpdate}: 2025-02-20`);
        this.updateElement('.system-info span:nth-child(3)', `${t.server}: 🟢 ${t.online}`);
        this.updateElement('.system-info span:nth-child(4)', `${t.users}: 1,247 ${t.active}`);
        this.updateElement('.copyright p:first-child', `© 2025 پُکار - ${t.allRights}`);
        this.updateElement('.copyright p:last-child', t.govtCertified);
        
        // Update status text
        this.updateElement('.stat-change', t.today);
        this.updateElement('.footer-stats span:first-child', `${t.todayReports}: 79`);
        this.updateElement('.footer-stats span:last-child', `⚡ ${t.avgResponseTime}: 2.3 منٹ`);
    }
    
    updateElement(selector, text) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = text;
        }
    }
    
    showError(message) {
        this.showNotification(message, 'error');
    }
    
    showSuccess(message) {
        this.showNotification(message, 'success');
    }
    
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span class="notification-icon">${type === 'error' ? '⚠️' : '✅'}</span>
            <span class="notification-text">${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? 'var(--primary-red)' : 'var(--success-green)'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 500;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize the system
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 پُکار Emergency System Initializing...');
    
    // Check if all required elements exist
    const requiredElements = [
        'dashboard-section',
        'emergency-section', 
        'history-section',
        'settings-section',
        'recordBtn',
        'processBtn',
        'playResponseBtn'
    ];
    
    let missingElements = [];
    requiredElements.forEach(id => {
        if (!document.getElementById(id)) {
            missingElements.push(id);
        }
    });
    
    if (missingElements.length > 0) {
        console.error('❌ Missing elements:', missingElements);
    } else {
        console.log('✅ All required elements found');
    }
    
    // Initialize the system
    const system = new PukaarEmergencySystem();
    console.log('✅ پُکار Emergency System Ready!');
    
    // Show welcome message
    setTimeout(() => {
        system.showSuccess('پُکار ایمرجنسی سسٹم تیار ہے!');
    }, 1000);
});
