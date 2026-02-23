# پُکار (Pukaar) - Emergency Response System

A web-based emergency response system designed to break language barriers in Pakistan by converting audio to text and providing responses in regional languages (Urdu, Pashto, Sindhi, Saraiki).

## 🚨 Features

### Core Functionality
- **Audio Recording**: Record audio directly through your browser microphone
- **Audio Upload**: Upload pre-recorded audio files
- **Language Detection**: Automatically detects Urdu, Pashto, Sindhi, and Saraiki
- **Audio-to-Text Conversion**: Converts spoken words to written text
- **Emergency Type Detection**: Identifies medical, fire, accident, or theft emergencies
- **Multi-language Responses**: Provides emergency responses in detected language
- **Text-to-Speech**: Plays responses in regional languages

### User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Multi-language Support**: Interface available in Urdu, Pashto, Sindhi, and Saraiki
- **Quick Emergency Buttons**: One-click access to common emergency types
- **Real-time Feedback**: Visual indicators for recording and processing status

## 🌐 Supported Languages

- **اردو (Urdu)** - National language of Pakistan
- **پشتو (Pashto)** - Spoken in Khyber Pakhtunkhwa and Balochistan
- **سندھی (Sindhi)** - Spoken in Sindh province
- **سرائیکی (Saraiki)** - Spoken in southern Punjab

## 🚀 Quick Start

1. **Open the System**
   - Open `index.html` in any modern web browser

2. **Grant Microphone Permissions**
   - Allow the browser to access your microphone when prompted

3. **Record or Upload Audio**
   - Click the microphone button to record
   - OR click "Upload Audio" to select a file

4. **Process Audio**
   - Click "Process Audio" to analyze the recording

5. **Get Response**
   - View transcribed text and emergency type
   - Click "Play Response" to hear the response in your language

## 📁 Project Structure

```
our project/
├── index.html              # Main application interface
├── style.css               # Styling and responsive design
├── script.js               # Core functionality and logic
├── README.md               # This documentation file
├── caller_audio-/          # Sample audio files by language
│   ├── pashto-/
│   ├── sindhi-/
│   ├── saraiki/
│   └── balochi/
├── response_audio-/        # Pre-recorded response audio files
└── response_translations.xlsx  # Translation data (Excel format)
```

## 🛠️ Technical Implementation

### Frontend Technologies
- **HTML5**: Semantic structure and audio recording capabilities
- **CSS3**: Modern styling with gradients and animations
- **JavaScript ES6+**: Core functionality and API integrations

### Key APIs Used
- **MediaRecorder API**: For audio recording from microphone
- **Web Speech API**: For text-to-speech functionality
- **File API**: For audio file uploads

### Emergency Detection Logic
The system uses keyword matching to identify emergency types:
- **Medical**: hospital, doctor, pain, medical (in all languages)
- **Fire**: fire, burning, emergency (in all languages)
- **Accident**: accident, car, crash (in all languages)
- **Theft**: theft, police, robbery (in all languages)

## 📱 Browser Compatibility

### Supported Browsers
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+

### Required Features
- Microphone access
- JavaScript enabled
- Modern HTML5 support

## 🔧 Customization

### Adding New Languages
1. Add language codes to `languageNames` object
2. Add translations to `translations` object
3. Update emergency responses in `emergencyResponses` object
4. Add keywords for emergency detection

### Modifying Emergency Types
1. Update `emergencyResponses` object with new categories
2. Add corresponding keywords in `emergencyKeywords` object
3. Update UI elements in HTML and CSS

## 🚨 Emergency Use Cases

### Medical Emergency
- User speaks: "میڈیکل ایمرجنسی ہے، مجھے فوری مدد چاہیے"
- System detects: Medical emergency in Urdu
- Response: "میڈیکل ایمرجنسی کے لیے فوری مدد کی جا رہی ہے۔ براہ کرم آرام کریں۔"

### Fire Emergency
- User speaks: "آگ لگ گئی ہے، فوری مدد کریں"
- System detects: Fire emergency in Urdu
- Response: "آگ بجھانے کی ٹیم بھیجی جا رہی ہے۔ فوری طور پر مکان خالی کریں۔"

## 🔒 Privacy & Security

- **Local Processing**: All audio processing happens in the browser
- **No Server Storage**: Audio files are not uploaded to external servers
- **Temporary Storage**: Audio data is cleared after processing
- **Permission Control**: Microphone access requires explicit user permission

## 📞 Emergency Contacts Integration

The system includes quick-action buttons for:
- 🏥 Medical Emergencies
- 🔥 Fire Department
- 🚗 Accident Response
- 👮 Police Assistance

## 🌟 Future Enhancements

- **GPS Integration**: Automatic location detection for emergencies
- **Live Translation**: Real-time conversation translation
- **Video Support**: Video recording for visual emergency context
- **Offline Mode**: Functionality without internet connection
- **SMS Integration**: Send emergency alerts via text message

## 🤝 Contributing

This system is designed for emergency use in Pakistan. Contributions welcome for:
- Additional language support
- Improved accuracy in emergency detection
- Better user experience for emergency situations
- Integration with local emergency services

## 📄 License

This project is open-source and available for emergency response purposes in Pakistan.

## 🆘 Important Notice

This system is designed to assist in emergency situations by breaking language barriers. It should be used alongside official emergency services and not as a replacement for professional medical or emergency assistance.

**For real emergencies, always contact local emergency services directly.**

---
*پُکار - Breaking Language Barriers in Emergency Situations*
