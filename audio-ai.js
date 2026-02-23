/**
 * Pukaar AI Audio System - Real-world Audio Processing Application
 * Simulates AI/ML audio analysis with professional response generation
 */

class PukaarAudioAI {
    constructor() {
        this.mediaRecorder = null;
        this.audioStream = null;
        this.recordedChunks = [];
        this.isRecording = false;
        this.recordingTime = 0;
        this.recordingInterval = null;
        this.uploadedFile = null;
        this.currentAudio = null;
        this.recordedAudioBlob = null;
        
        // Audio folders configuration
        this.audioFolders = {
            caller_audio: 'caller_audio/',
            response_audio: {
                urdu: 'response_audio/urdu/',
                pashto: 'response_audio/pashto/',
                sindhi: 'response_audio/sindhi/',
                saraiki: 'response_audio/saraiki/',
                english: 'response_audio/english/'
            }
        };

        // Language-specific response audio files
        this.responseAudioFiles = {
            medical: {
                urdu: 'medical_response_urdu.mp3',
                pashto: 'medical_response_pashto.mp3',
                sindhi: 'medical_response_sindhi.mp3',
                saraiki: 'medical_response_saraiki.mp3',
                english: 'medical_response_english.mp3'
            },
            fire: {
                urdu: 'fire_response_urdu.mp3',
                pashto: 'fire_response_pashto.mp3',
                sindhi: 'fire_response_sindhi.mp3',
                saraiki: 'fire_response_saraiki.mp3',
                english: 'fire_response_english.mp3'
            },
            accident: {
                urdu: 'accident_response_urdu.mp3',
                pashto: 'accident_response_pashto.mp3',
                sindhi: 'accident_response_sindhi.mp3',
                saraiki: 'accident_response_saraiki.mp3',
                english: 'accident_response_english.mp3'
            },
            police: {
                urdu: 'police_response_urdu.mp3',
                pashto: 'police_response_pashto.mp3',
                sindhi: 'police_response_sindhi.mp3',
                saraiki: 'police_response_saraiki.mp3',
                english: 'police_response_english.mp3'
            }
        };

        // AI Response Database - Simulated intelligent responses
        this.aiResponses = {
            medical: {
                emergencies: [
                    {
                        type: 'heart_attack',
                        keywords: ['دل', 'درد', 'سانس', 'تکلیف', 'چسٹ'],
                        response: '❤️ **دل کے دورے کا شبہ**\n\n**فوری اقدامات:**\n• مریض کو آرام دیں\n• لوز کپڑے اتاریں\n• ایسپرین 325mg دیں (اگر موجود ہو)\n• 1122 پر کال کریں\n\n**ایمبولینس 5 منٹ میں پہنچے گی**',
                        priority: 'high',
                        emoji: '🚑'
                    },
                    {
                        type: 'bleeding',
                        keywords: ['خون', 'زخم', 'کٹ', 'پھٹ', 'بہہ'],
                        response: '🩸 **شدید خون بہاؤ**\n\n**فوری اقدامات:**\n• زخم پر براہ راست دباؤ\n• صاف کپڑا استعمال کریں\n• زخم کو اونچا رکھیں\n• ہیلپ لائن 1122 پر کال کریں\n\n**ریسکیو ٹیم روانہ**',
                        priority: 'high',
                        emoji: '🩸'
                    }
                ]
            },
            fire: {
                emergencies: [
                    {
                        type: 'building_fire',
                        keywords: ['آگ', 'دھواں', 'جل', 'عمارت', 'گھر'],
                        response: '🔥 **عمارت میں آگ**\n\n**فوری اقدامات:**\n• عمورت فوری خالی کریں\n• لفٹ استعمال نہ کریں\n• بجلی کا مین سوئچ بند کریں\n• فائر بریگیڈ 16 کو کال کریں\n\n**3 فائر ٹینکرز روانہ**',
                        priority: 'high',
                        emoji: '🚒'
                    }
                ]
            },
            accident: {
                emergencies: [
                    {
                        type: 'road_accident',
                        keywords: ['حادثہ', 'ٹکر', 'کار', 'موٹر', 'زخمی'],
                        response: '🚗 **سڑک حادثہ**\n\n**فوری اقدامات:**\n• جائے حادثہ کو محفوظ بنائیں\n• زخمیوں کو چھوئیں نہ\n• ٹریفک کو روکیں\n• ہیلپ لائن 1122 پر کال کریں\n\n**ایمبولینس اور پولیس روانہ**',
                        priority: 'high',
                        emoji: '🚑'
                    }
                ]
            },
            police: {
                emergencies: [
                    {
                        type: 'theft',
                        keywords: ['چوری', 'ڈکیت', 'چور', 'لوٹ', 'موبائل'],
                        response: '👮 **چوری/ڈکیت کی اطلاع**\n\n**فوری اقدامات:**\n• 15 پر کال کریں\n• اپنا محفوظ مقام بنائیں\n• چوروں کی سمت یاد رکھیں\n• شناخت کے ثبوتات محفوظ رکھیں\n\n**پولیس موبائل روانہ**',
                        priority: 'high',
                        emoji: '👮'
                    }
                ]
            }
        };

        this.init();
    }

    init() {
        this.setupRecording();
        this.setupUpload();
        this.setupProcessing();
        this.setupTabs();
    }

    // ==================== AUDIO RECORDING ====================
    
    setupRecording() {
        const recordBtn = document.getElementById('recordBtn');
        const waveform = document.getElementById('waveform');
        
        if (recordBtn) {
            recordBtn.addEventListener('click', () => {
                if (this.isRecording) {
                    this.stopRecording();
                } else {
                    this.startRecording();
                }
            });
        }

        if (waveform) {
            this.animateWaveform(waveform);
        }
    }

    async startRecording() {
        try {
            this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(this.audioStream);
            this.recordedChunks = [];
            this.isRecording = true;
            
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                this.recordedAudioBlob = new Blob(this.recordedChunks, { type: 'audio/wav' });
                this.showRecordingControls();
                this.enableProcessButton();
            };

            this.mediaRecorder.start();
            this.startRecordingTimer();
            this.updateRecordingUI(true);
            
        } catch (error) {
            this.showNotification('مائیکروفون تک رسائی نہیں مل سکی', 'error');
            console.error('Recording error:', error);
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.audioStream.getTracks().forEach(track => track.stop());
            this.isRecording = false;
            this.stopRecordingTimer();
            this.updateRecordingUI(false);
        }
    }

    startRecordingTimer() {
        this.recordingTime = 0;
        const recordingInfo = document.getElementById('recordingInfo');
        
        this.recordingInterval = setInterval(() => {
            this.recordingTime++;
            const minutes = Math.floor(this.recordingTime / 60).toString().padStart(2, '0');
            const seconds = (this.recordingTime % 60).toString().padStart(2, '0');
            if (recordingInfo) {
                recordingInfo.textContent = `ریکارڈنگ: ${minutes}:${seconds}`;
            }
        }, 1000);
    }

    stopRecordingTimer() {
        if (this.recordingInterval) {
            clearInterval(this.recordingInterval);
            this.recordingInterval = null;
        }
    }

    updateRecordingUI(isRecording) {
        const recordBtn = document.getElementById('recordBtn');
        const waveform = document.getElementById('waveform');
        
        if (recordBtn) {
            if (isRecording) {
                recordBtn.innerHTML = '<span class="record-icon">⏹️</span><span class="record-text">روکیں</span>';
                recordBtn.classList.add('recording');
                if (waveform) waveform.classList.add('recording');
            } else {
                recordBtn.innerHTML = '<span class="record-icon">🎙️</span><span class="record-text">ریکارڈ شروع کریں</span>';
                recordBtn.classList.remove('recording');
                if (waveform) waveform.classList.remove('recording');
            }
        }
    }

    showRecordingControls() {
        // Remove existing controls if any
        const existingControls = document.querySelector('.recording-controls-panel');
        if (existingControls) existingControls.remove();

        const recordingInterface = document.querySelector('.recording-interface');
        if (!recordingInterface || !this.recordedAudioBlob) return;

        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'recording-controls-panel audio-controls';
        controlsDiv.innerHTML = `
            <div class="audio-info">
                <span class="audio-label">🎙️ ریکارڈ شدہ آڈیو</span>
                <span class="audio-time">${this.formatTime(this.recordingTime)}</span>
            </div>
            <div class="audio-buttons">
                <button class="btn-play" onclick="pukaarAudioAI.playRecordedAudio()">
                    <span>▶️</span> چلائیں
                </button>
                <button class="btn-delete" onclick="pukaarAudioAI.deleteRecording()">
                    <span>🗑️</span> حذف کریں
                </button>
            </div>
        `;

        recordingInterface.appendChild(controlsDiv);
        this.showNotification('آڈیو ریکارڈ ہو گئی', 'success');
    }

    playRecordedAudio() {
        if (!this.recordedAudioBlob) return;

        const audioUrl = URL.createObjectURL(this.recordedAudioBlob);
        this.currentAudio = new Audio(audioUrl);
        this.currentAudio.play();
        
        this.currentAudio.onended = () => {
            URL.revokeObjectURL(audioUrl);
        };

        this.showNotification('آڈیو چل رہی ہے...', 'info');
    }

    deleteRecording() {
        this.recordedAudioBlob = null;
        this.recordedChunks = [];
        this.recordingTime = 0;
        
        const controls = document.querySelector('.recording-controls-panel');
        if (controls) controls.remove();
        
        const recordingInfo = document.getElementById('recording-status');
        if (recordingInfo) recordingInfo.textContent = 'آڈیو حذف کر دیا گیا';
        
        this.showNotification('آڈیو حذف کر دی گئی', 'success');
    }

    // ==================== AUDIO UPLOAD ====================
    
    setupUpload() {
        const uploadInput = document.getElementById('audioFile');
        const uploadArea = document.getElementById('uploadArea');
        const uploadBtn = document.querySelector('.upload-btn');

        console.log('Upload setup - input:', uploadInput, 'area:', uploadArea, 'btn:', uploadBtn);

        // Click on upload button triggers file input
        if (uploadBtn && uploadInput) {
            uploadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Upload button clicked');
                uploadInput.click();
            });
        }

        // Click on upload area also triggers file input
        if (uploadArea && uploadInput) {
            uploadArea.addEventListener('click', (e) => {
                // Only trigger if clicking on the area itself, not the button
                if (e.target === uploadArea || e.target.closest('.upload-icon') || e.target.tagName === 'H3' || e.target.tagName === 'P') {
                    console.log('Upload area clicked');
                    uploadInput.click();
                }
            });
        }

        if (uploadInput) {
            uploadInput.addEventListener('change', (e) => {
                console.log('File selected:', e.target.files);
                this.handleFileUpload(e.target.files[0]);
            });
        }

        if (uploadArea) {
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.stopPropagation();
                uploadArea.classList.add('dragover');
            });

            uploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                uploadArea.classList.remove('dragover');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.handleFileUpload(files[0]);
                }
            });
        }
    }

    handleFileUpload(file) {
        if (!file) {
            console.log('No file selected');
            return;
        }

        console.log('File upload started:', file.name, 'Type:', file.type, 'Size:', file.size);

        // Validate file type - more flexible validation
        const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/x-m4a', 'audio/ogg', 'audio/webm', 'audio/mp3', 'audio/aac', 'audio/mp4'];
        const allowedExtensions = ['.mp3', '.wav', '.m4a', '.ogg', '.webm', '.aac', '.mp4'];
        
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        const isValidType = allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension);
        
        console.log('File validation - extension:', fileExtension, 'type:', file.type, 'valid:', isValidType);
        
        if (!isValidType) {
            this.showNotification('صرف MP3, WAV, M4A, OGG, AAC فائلیں اپلوڈ کریں', 'error');
            return;
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            this.showNotification('فائل کا سائز 10MB سے کم ہونا چاہیے', 'error');
            return;
        }

        this.uploadedFile = file;
        this.showUploadFileInfo(file);
        this.enableProcessButton();
        this.showNotification('✅ آڈیو فائل اپلوڈ ہو گئی: ' + file.name, 'success');
    }

    showUploadFileInfo(file) {
        // Remove existing file info if any
        const existingInfo = document.querySelector('.uploaded-file-panel');
        if (existingInfo) existingInfo.remove();

        const uploadInterface = document.querySelector('.upload-interface');
        if (!uploadInterface) return;

        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        const fileInfoDiv = document.createElement('div');
        fileInfoDiv.className = 'uploaded-file-panel upload-file-info';
        fileInfoDiv.innerHTML = `
            <div class="file-details">
                <span class="file-icon">🎵</span>
                <div class="file-meta">
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">${fileSize} MB</span>
                </div>
            </div>
            <div class="file-actions">
                <button class="btn-play" onclick="pukaarAudioAI.playUploadedAudio()">
                    <span>▶️</span> چلائیں
                </button>
                <button class="btn-delete" onclick="pukaarAudioAI.deleteUpload()">
                    <span>🗑️</span> حذف کریں
                </button>
            </div>
        `;

        uploadInterface.appendChild(fileInfoDiv);
    }

    playUploadedAudio() {
        if (!this.uploadedFile) return;

        const audioUrl = URL.createObjectURL(this.uploadedFile);
        this.currentAudio = new Audio(audioUrl);
        this.currentAudio.play();
        
        this.currentAudio.onended = () => {
            URL.revokeObjectURL(audioUrl);
        };

        this.showNotification('اپلوڈ شدہ آڈیو چل رہی ہے...', 'info');
    }

    deleteUpload() {
        this.uploadedFile = null;
        
        const fileInfo = document.querySelector('.uploaded-file-panel');
        if (fileInfo) fileInfo.remove();
        
        const uploadInput = document.getElementById('audioFile');
        if (uploadInput) uploadInput.value = '';
        
        this.showNotification('اپلوڈ شدہ فائل حذف کر دی گئی', 'success');
    }

    enableProcessButton() {
        const processBtn = document.getElementById('processBtn');
        if (processBtn) {
            processBtn.disabled = false;
        }
    }

    // ==================== AI PROCESSING WITH GEMINI ====================
    
    setupProcessing() {
        const processBtn = document.getElementById('processBtn');
        if (processBtn) {
            processBtn.addEventListener('click', () => this.processWithGeminiAI());
        }
        
        // Setup play button
        const playBtn = document.getElementById('playResponseBtn');
        if (playBtn) {
            playBtn.addEventListener('click', () => this.playCurrentResponse());
        }
    }

    async processWithGeminiAI() {
        if (!this.recordedAudioBlob && !this.uploadedFile) {
            this.showNotification('پہلے آڈیو ریکارڈ یا اپلوڈ کریں', 'warning');
            return;
        }

        const languageSelect = document.getElementById('aiLanguageSelect');
        const selectedLanguage = languageSelect ? languageSelect.value : 'urdu';

        this.showProcessingAnimation();
        this.updateProcessingStatus('🎙️ آڈیو transcribe ہو رہا ہے...', 20);

        try {
            const audioBlob = this.recordedAudioBlob || this.uploadedFile;
            
            this.updateProcessingStatus('🤖 Gemini AI تجزیہ کر رہا ہے...', 50);
            
            const result = await pukaarGeminiAI.processAudio(audioBlob, selectedLanguage);
            
            if (result.success) {
                this.updateProcessingStatus('✅ ریسپانس تیار ہو گیا...', 90);
                
                // Display result
                this.displayResult(result);
                
                // Auto-play
                setTimeout(async () => {
                    this.updateProcessingStatus('🔊 آڈیو پلے ہو رہا ہے...', 100);
                    try {
                        await pukaarGeminiAI.playResponse(result);
                        this.showNotification('🎵 AI ریسپانس چل رہا ہے...', 'info');
                    } catch (audioError) {
                        console.error('Auto-play failed:', audioError);
                    }
                    this.hideProcessingAnimation();
                }, 500);
                
            } else {
                throw new Error(result.error || 'Processing failed');
            }

        } catch (error) {
            console.error('Gemini AI processing error:', error);
            this.hideProcessingAnimation();
            this.showNotification('AI پروسیسنگ میں مسئلہ: ' + error.message, 'error');
            
            // Fallback
            const fallbackCategory = pukaarGeminiAI.detectEmergencyCategory('emergency help needed');
            const fallbackResponse = pukaarGeminiAI.getFallbackResponse(fallbackCategory, selectedLanguage);
            
            this.displayResult({
                success: true,
                transcription: 'آڈیو transcribe نہیں ہو سکی',
                response: fallbackResponse,
                timestamp: new Date().toLocaleString('ur-PK')
            });
        }
    }

    displayResult(result) {
        const resultsSection = document.getElementById('results-section');
        const detectedLanguageEl = document.getElementById('detectedLanguage');
        const transcribedTextEl = document.getElementById('transcribedText');
        const emergencyTypeEl = document.getElementById('emergencyType');
        const responseTextEl = document.getElementById('responseText');

        if (resultsSection) {
            resultsSection.classList.remove('hidden');
            resultsSection.style.display = 'block';
        }

        const languageNames = {
            urdu: 'اردو',
            pashto: 'پشتو',
            sindhi: 'سندھی',
            saraiki: 'سرائیکی',
            english: 'English'
        };

        if (detectedLanguageEl) {
            detectedLanguageEl.textContent = languageNames[result.response.language] || result.response.language;
        }

        if (transcribedTextEl) {
            transcribedTextEl.textContent = result.transcription || 'آڈیو transcribe نہیں ہو سکی';
        }

        if (emergencyTypeEl) {
            emergencyTypeEl.innerHTML = `${result.response.icon} ${result.response.categoryName}`;
        }

        if (responseTextEl) {
            let formattedText = result.response.text
                .replace(/\*\*/g, '')
                .replace(/\n/g, '<br>')
                .replace(/•/g, '<span style="color: #dc2626; font-weight: bold;">•</span>');
            
            responseTextEl.innerHTML = formattedText;
            responseTextEl.style.direction = result.response.language === 'english' ? 'ltr' : 'rtl';
        }

        this.currentGeminiResult = result;

        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }

        this.showNotification('✅ Gemini AI ریسپانس تیار ہے!', 'success');
    }

    async playCurrentResponse() {
        if (!this.currentGeminiResult) {
            this.showNotification('کوئی ریسپانس دستیاب نہیں', 'warning');
            return;
        }
        
        try {
            await pukaarGeminiAI.playResponse(this.currentGeminiResult);
            this.showNotification('🔊 ریسپانس چل رہا ہے...', 'info');
        } catch (error) {
            console.error('Play error:', error);
            this.showNotification('آڈیو پلے بیک میں مسئلہ', 'error');
        }
    }

    detectLanguage() {
        // Simulated language detection - in real implementation, this would use ML
        const languages = ['urdu', 'pashto', 'sindhi', 'saraiki', 'english'];
        const weights = [0.5, 0.2, 0.15, 0.1, 0.05]; // Urdu most common in Pakistan
        
        const random = Math.random();
        let cumulative = 0;
        
        for (let i = 0; i < languages.length; i++) {
            cumulative += weights[i];
            if (random <= cumulative) {
                return languages[i];
            }
        }
        
        return 'urdu';
    }

    detectEmergencyCategory() {
        // Simulated emergency detection
        const categories = ['medical', 'fire', 'accident', 'police'];
        return categories[Math.floor(Math.random() * categories.length)];
    }

    generateLanguageSpecificResponse(language, category) {
        const languageNames = {
            urdu: 'اردو',
            pashto: 'پشتو',
            sindhi: 'سندھی',
            saraiki: 'سرائیکی',
            english: 'English'
        };

        const categoryNames = {
            medical: { urdu: 'میڈیکل', icon: '🚑' },
            fire: { urdu: 'آگ', icon: '🚒' },
            accident: { urdu: 'حادثہ', icon: '🚗' },
            police: { urdu: 'پولیس', icon: '👮' }
        };

        const responseText = this.getResponseText(category, language);
        const audioFile = this.responseAudioFiles[category]?.[language];
        const audioPath = audioFile ? this.audioFolders.response_audio[language] + audioFile : null;

        const result = {
            language: languageNames[language],
            languageCode: language,
            category: categoryNames[category]?.urdu || category,
            categoryIcon: categoryNames[category]?.icon || '🚨',
            confidence: (85 + Math.random() * 14).toFixed(1),
            location: this.generateRandomLocation(),
            eta: Math.floor(3 + Math.random() * 12),
            responseText: responseText,
            audioPath: audioPath,
            timestamp: new Date().toLocaleString('ur-PK')
        };

        this.displayResultsWithAudio(result);
    }

    getResponseText(category, language) {
        // Return language-specific responses that sound natural
        const responses = {
            medical: {
                urdu: `**🚨 میڈیکل ایمرجنسی**

آپ کی آواز سن کر لگتا ہے کہ کوئی طبی ایمرجنسی ہے۔ فوری طور پر یہ اقدامات کریں:

• مریض کو آرام دہ جگہ پر لٹائیں
• اگر زخم ہے تو صاف کپڑے سے دباؤ
• 1122 پر فوری کال کریں
• CPR دینے آتے ہوں تو شروع کر دیں

**مدد روانہ - ایمبولینس 5 منٹ میں پہنچے گی**`,
                pashto: `**🚨 طبي پېښه**

ستاسو غږ واوریدم - دا یوه طبي پېښه ده. مهرباني وکړئ فوري اقدامات وکړئ:`,
                sindhi: `**🚨 طبي امرجنسي**

توهان جي آواز ٻڌي - ڪا طبي امرجنسي آهي. فوري اقدام ڪريو:`,
                saraiki: `**🚨 طبی ایمرجنسی**

تھاڈی آواز سنی - کوئی طبی ایمرجنسی ہے۔ فوری اقدامات کرو:`,
                english: `� **Medical Emergency**

From your audio, it sounds like a medical emergency. Please take these immediate steps:

• Lay the patient in a comfortable position
• Apply pressure with clean cloth if bleeding
• Call 1122 immediately
• Start CPR if you know how

**Help dispatched - Ambulance arriving in 5 minutes**`
            },
            fire: {
                urdu: `**🔥 آگ کی ایمرجنسی**

آپ کی آواز سے پتہ چلا کہ آگ لگی ہوئی ہے۔ فوری طور پر یہ کام کریں:

• فوری طور پر عمارت خالی کریں
• لفٹ بالکل استعمال نہ کریں
• سیڑھیوں کا استعمال کریں
• بجلی کا مین سوئچ بند کریں
• فائر بریگیڈ 16 پر کال کریں

**3 فائر ٹینکرز روانہ - 7 منٹ میں پہنچیں گے**`,
                pashto: `**🔥 د اور پیښه**

ستاسو غږ نه پوهیدل شوم چې اور دی. فوري اقدامات وکړئ:`,
                sindhi: `**🔥 باڊي ٻڏڻ**

توهان جي آواز مان پتو پيو ته باڊي ٻڏي پئي آهي. فوري ڪريو:`,
                saraiki: `**🔥 آگ**

تھاڈی آواز توں پتہ لگا کے آگ لگی ہے۔ فوری اقدامات کرو:`,
                english: `🔥 **Fire Emergency**

From your audio, we detected a fire. Take these immediate actions:

• Evacuate the building immediately
• Do NOT use elevators
• Use stairs only
• Turn off main electricity switch
• Call Fire Brigade at 16

**3 Fire trucks dispatched - arriving in 7 minutes**`
            },
            accident: {
                urdu: `**🚗 سڑک حادثہ**

آواز سن کر اندازہ ہوا کہ سڑک حادثہ ہوا ہے۔ فوری اقدامات:

• جائے حادثہ کو محفوظ بنائیں - وارننگ ٹرائنگل لگائیں
• گاڑیوں کی آمد و رفت کو روکیں
• 15 یا 1122 پر کال کریں
• زخمیوں کو ہلائیں نہ، جوں کے توں چھوڑ دیں

**ایمبولینس اور پولیس دونوں روانہ**`,
                pashto: `**🚗 د ترافیکو پیښه**

ستاسو غږ واوریدم چې د ترافیکو پیښه ده. فوري مرسته:`,
                sindhi: `**🚗 روڊ حادثو**

توهان جي آواز مان پتو پيو ته روڊ حادثو ٿيو آهي. فوري امداد:`,
                saraiki: `**🚗 سڑک حادثہ**

تھاڈی آواز سنی - سڑک تے حادثہ تھی گیا ہے۔ فوری امداد:`,
                english: `🚗 **Road Accident**

From your audio, a road accident was detected. Immediate steps:

• Secure the accident scene - place warning triangles
• Stop traffic flow
• Call 15 or 1122
• Don't move injured persons, leave them as is

**Ambulance and Police both dispatched**`
            },
            police: {
                urdu: `**👮 سیکیورٹی ایمرجنسی**

آپ کی آواز سے خطرے کی نشاندہی ہوئی ہے۔ فوری اقدامات:

• فوری طور پر محفوظ جگہ پر جائیں
• 15 پر کال کریں - پولیس ہیلپ لائن
• اگر چوری ہے تو اپنا فون محفوظ رکھیں
• مشتبہ افراد کی تفصیلات یاد رکھیں

**پولیس موبائل فوری روانہ - 3 منٹ میں پہنچے گی**`,
                pashto: `**👮 امنیتي ستونزه**

ستاسو غږ نه اندېښمنې شوم. فوري خونديتوب:`,
                sindhi: `**👮 سيڪيورٽي اميجنسي**

توهان جي آواز مان خطرو محسوس ٿيو. فوري حفاظت:`,
                saraiki: `**👮 سیکیورٹی ایمرجنسی**

تھاڈی آواز توں خطرہ لگا۔ فوری حفاظت:`,
                english: `👮 **Security Emergency**

From your audio, a security threat was detected. Immediate steps:

• Move to a safe location immediately
• Call 15 - Police Helpline
• Keep your phone safe if it's a theft
• Remember suspect details

**Police mobile dispatched immediately - arriving in 3 minutes**`
            }
        };

        return responses[category]?.[language] || responses[category]?.urdu || responses.medical.urdu;
    }

    displayResultsWithAudio(result) {
        const resultsSection = document.getElementById('results-section');
        if (!resultsSection) return;

        resultsSection.classList.remove('hidden');
        resultsSection.innerHTML = `
            <div class="ai-response-card">
                <div class="response-header">
                    <div class="response-icon">${result.categoryIcon}</div>
                    <div class="response-title">
                        <h3>${result.category} ایمرجنسی</h3>
                        <span class="confidence-badge">${result.confidence}% درستگی</span>
                    </div>
                </div>
                
                <div class="response-meta">
                    <div class="meta-item">
                        <span class="meta-label">🌐 زبان:</span>
                        <span class="meta-value">${result.language}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">📍 مقام:</span>
                        <span class="meta-value">${result.location}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">⏰ ETA:</span>
                        <span class="meta-value">${result.eta} منٹ</span>
                    </div>
                </div>
                
                <div class="response-content">
                    <pre>${result.responseText}</pre>
                </div>
                
                <div class="response-audio-section">
                    <h4>🔊 AI آڈیو ریسپانس</h4>
                    <div class="audio-player-container">
                        <audio id="responseAudioPlayer" controls class="response-audio-player">
                            <source src="${result.audioPath}" type="audio/mpeg">
                            آپ کا براؤزر آڈیو پلیئر سپورٹ نہیں کرتا
                        </audio>
                        <button class="btn-play-response" onclick="pukaarAudioAI.playResponseAudio('${result.audioPath}')">
                            <span>🔊</span> ریسپانس سنیں
                        </button>
                    </div>
                    <p class="audio-path">📁 ${result.audioPath}</p>
                </div>
                
                <div class="response-timestamp">
                    🕐 ${result.timestamp}
                </div>
                
                <div class="response-actions">
                    <button class="btn-confirm" onclick="pukaarAudioAI.confirmEmergency()">
                        <span>✅</span> تصدیق کریں اور بھیجیں
                    </button>
                    <button class="btn-new-report" onclick="pukaarAudioAI.resetAudioSystem()">
                        <span>🔄</span> نئی رپورٹ
                    </button>
                </div>
            </div>
        `;

        // Auto-play response audio if available
        if (result.audioPath) {
            setTimeout(() => {
                this.playResponseAudio(result.audioPath);
            }, 1000);
        }

        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    playResponseAudio(audioPath) {
        if (!audioPath) {
            this.showNotification('آڈیو فائل دستیاب نہیں', 'error');
            return;
        }

        const audio = new Audio(audioPath);
        audio.play().catch(error => {
            console.error('Audio playback error:', error);
            this.showNotification('آڈیو پلے بیک میں مسئلہ', 'error');
        });
        
        this.showNotification('ریسپانس آڈیو چل رہی ہے...', 'info');
    }

    confirmEmergency() {
        this.showNotification('ایمرجنسی بھیج دی گئی! مدد روانہ', 'success');
        setTimeout(() => {
            window.location.href = 'emergency.html';
        }, 2000);
    }

    resetAudioSystem() {
        this.deleteRecording();
        this.deleteUpload();
        
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
            resultsSection.classList.add('hidden');
            resultsSection.innerHTML = '';
        }
        
        this.showNotification('نئی رپورٹ شروع کریں', 'info');
    }

    showProcessingAnimation() {
        const processingPanel = document.getElementById('processingLoader');
        if (processingPanel) {
            processingPanel.classList.remove('hidden');
        }
    }

    hideProcessingAnimation() {
        const processingPanel = document.getElementById('processingLoader');
        if (processingPanel) {
            processingPanel.classList.add('hidden');
        }
    }

    updateProcessingStatus(status, progress) {
        const processingText = document.getElementById('processingStatus') || document.querySelector('.processing-loader p');
        const progressBar = document.querySelector('.progress-fill');
        
        if (processingText) processingText.textContent = status;
        if (progressBar) progressBar.style.width = progress + '%';
    }

    setupTabs() {
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const tabName = tab.dataset.tab;
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(tabName + '-tab')?.classList.add('active');
            });
        });
    }

    animateWaveform(waveform) {
        const bars = waveform?.querySelectorAll('.waveform-bar');
        if (!bars) return;

        bars.forEach((bar, index) => {
            setInterval(() => {
                if (this.isRecording) {
                    const height = Math.random() * 100;
                    bar.style.height = height + '%';
                }
            }, 100 + index * 20);
        });
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }

    generateRandomLocation() {
        const locations = [
            'گلشن اقبال، کراچی',
            'ماڈل ٹاؤن، لاہور',
            'جی ٹی روڈ، راولپنڈی',
            '_university ٹاؤن، پشاور',
            'ساد بازار، کوئٹہ'
        ];
        return locations[Math.floor(Math.random() * locations.length)];
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
            <span class="notification-text">${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize the Pukaar Audio AI System
const pukaarAudioAI = new PukaarAudioAI();
