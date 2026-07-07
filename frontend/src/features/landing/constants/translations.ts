export interface TranslationSet {
  // Navbar
  brandName: string;
  navHome: string;
  navHowItWorks: string;
  navFeatures: string;
  navDashboard: string;
  navReportIssue: string;

  // Hero
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;

  // How it works
  howTitle: string;
  howSubtitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;

  // Features
  featTitle: string;
  featSubtitle: string;
  featCard1Title: string;
  featCard1Desc: string;
  featCard2Title: string;
  featCard2Desc: string;
  featCard3Title: string;
  featCard3Desc: string;
  featCard4Title: string;
  featCard4Desc: string;

  // Footer
  footerCopyright: string;
  footerDisclaimer: string;

  // Submission Wizard Generic
  wizardTitle: string;
  btnCancel: string;
  btnBack: string;
  btnContinue: string;
  btnSubmit: string;
  stepIndicator: string;

  // Wizard Step 1: Info
  infoSectionTitle: string;
  labelFullName: string;
  placeholderFullName: string;
  labelMobile: string;
  placeholderMobile: string;
  labelIssueTitle: string;
  placeholderIssueTitle: string;
  labelDescription: string;
  placeholderDescription: string;
  labelCategory: string;
  placeholderCategory: string;
  labelPrefLanguage: string;
  placeholderPrefLanguage: string;

  // Categories
  "Roads": string;
  "Water Supply": string;
  "Electricity": string;
  "Education": string;
  "Healthcare": string;
  "Sanitation": string;
  "Public Transport": string;
  "Agriculture": string;
  "Women & Child Welfare": string;
  "Other": string;

  // Languages
  lang_en: string;
  lang_hi: string;
  lang_mr: string;
  lang_gu: string;
  lang_ta: string;
  lang_te: string;
  lang_kn: string;
  lang_bn: string;

  // Wizard Step 2: Voice
  voiceSectionTitle: string;
  voiceSubtitle: string;
  voiceRecordHelp: string;
  voiceStartRecord: string;
  voiceStopRecord: string;
  voiceReRecord: string;
  voiceDurationLimit: string;
  voiceProcessing: string;

  // Wizard Step 3: Images
  imageSectionTitle: string;
  imageSubtitle: string;
  imageDropHelp: string;
  imageBrowse: string;
  imageMaxLimit: string;
  imageSizeLimit: string;

  // Wizard Step 4: Location
  locationSectionTitle: string;
  locationSubtitle: string;
  locationBtnCapture: string;
  locationCapturing: string;
  locationLabelCoordinates: string;
  locationLabelLocality: string;
  locationLabelWard: string;
  locationLabelLandmark: string;
  locationPlaceholderLandmark: string;

  // Wizard Step 5: Review
  reviewSectionTitle: string;
  reviewSubtitle: string;
  reviewTitleLabel: string;
  reviewDescLabel: string;
  reviewCategoryLabel: string;
  reviewLanguageLabel: string;
  reviewLocationLabel: string;
  reviewPhotosLabel: string;
  reviewVoiceLabel: string;
  reviewVoiceDuration: string;

  // Success Page
  successTitle: string;
  successSubtitle: string;
  successCardTitle: string;
  successRefLabel: string;
  successStatusLabel: string;
  successBtnHome: string;
}

export const translations: Record<string, TranslationSet> = {
  en: {
    brandName: "People's Priorities AI",
    navHome: "Home",
    navHowItWorks: "How It Works",
    navFeatures: "Features",
    navDashboard: "MP Dashboard",
    navReportIssue: "Report Issue",
    heroBadge: "Decision Intelligence Portal",
    heroTitle: "Your Voice Shapes Your Community",
    heroSubtitle: "Submit local development issues in your preferred language—via voice, text, or photo. Our AI structures and aggregates community needs directly for your Member of Parliament's review and action.",
    heroCtaPrimary: "Report a Development Issue",
    heroCtaSecondary: "Learn More",
    howTitle: "How It Works",
    howSubtitle: "A direct bridge from citizens to constituency planning decisions in three simple steps.",
    step1Title: "Submit",
    step1Desc: "Report issues via text, upload photos, or record voice in your preferred language.",
    step2Title: "AI Understands",
    step2Desc: "AI automatically translates, categorizes, and groups similar issues to map demand.",
    step3Title: "MP Reviews",
    step3Desc: "Elected representatives review ranked priorities with clear, explainable evidence briefs.",
    featTitle: "Platform Capabilities",
    featSubtitle: "Designed for accessibility, transparency, and objective prioritization.",
    featCard1Title: "Multilingual Support",
    featCard1Desc: "Submit reports in Hindi, English, and regional languages. AI handles translations and understanding automatically.",
    featCard2Title: "Voice-First Input",
    featCard2Desc: "Speak naturally. Integrated voice recording makes reporting accessible to all citizens.",
    featCard3Title: "Visual Evidence",
    featCard3Desc: "Capture and upload photos to help planners and engineers assess the problem visually.",
    featCard4Title: "Location Precision",
    featCard4Desc: "Automatic coordinate tagging maps the exact location of public infrastructure issues.",
    footerCopyright: "© 2026 People's Priorities AI. All rights reserved.",
    footerDisclaimer: "This platform is an AI decision intelligence assistant for constituency planning. Final funding and project decisions remain with elected officials.",
    wizardTitle: "Report Development Issue",
    btnCancel: "Cancel",
    btnBack: "Back",
    btnContinue: "Continue",
    btnSubmit: "Submit Grievance",
    stepIndicator: "Step {current} of {total}",
    infoSectionTitle: "Issue Description",
    labelFullName: "Full Name",
    placeholderFullName: "Enter your name (optional)",
    labelMobile: "Mobile Number",
    placeholderMobile: "Enter 10-digit number (optional)",
    labelIssueTitle: "Issue Title *",
    placeholderIssueTitle: "Brief title of the issue (e.g. Potholes on Main Street)",
    labelDescription: "Detailed Description *",
    placeholderDescription: "Provide a detailed description of the problem. What infrastructure is broken? How is it affecting the community?",
    labelCategory: "Category *",
    placeholderCategory: "Select Category",
    labelPrefLanguage: "Preferred Language *",
    placeholderPrefLanguage: "Select Preferred Language",
    
    // Categories
    "Roads": "Roads & Transportation",
    "Water Supply": "Water Supply & Sewage",
    "Electricity": "Electricity & Power",
    "Education": "Education & Schools",
    "Healthcare": "Healthcare & Clinics",
    "Sanitation": "Waste & Sanitation",
    "Public Transport": "Public Transit & Buses",
    "Agriculture": "Agriculture & Irrigation",
    "Women & Child Welfare": "Women & Child Welfare",
    "Other": "Other Local Issues",

    // Languages
    lang_en: "English",
    lang_hi: "Hindi (हिन्दी)",
    lang_mr: "Marathi (मराठी)",
    lang_gu: "Gujarati (ગુજરાતી)",
    lang_ta: "Tamil (தமிழ்)",
    lang_te: "Telugu (తెలుగు)",
    lang_kn: "Kannada (ಕನ್ನಡ)",
    lang_bn: "Bengali (বাংলা)",

    voiceSectionTitle: "Voice Record Evidence",
    voiceSubtitle: "Speak in your regional language. Describe the issue in detail.",
    voiceRecordHelp: "Tap microphone button to start recording.",
    voiceStartRecord: "Start Recording",
    voiceStopRecord: "Stop Recording",
    voiceReRecord: "Re-record audio",
    voiceDurationLimit: "Max duration: 60 seconds",
    voiceProcessing: "Processing audio...",
    imageSectionTitle: "Upload Photo Evidence",
    imageSubtitle: "Attach images to help departments evaluate the issue size visually.",
    imageDropHelp: "Drag & drop files here, or click to upload",
    imageBrowse: "Browse Files",
    imageMaxLimit: "Maximum 3 images allowed.",
    imageSizeLimit: "Max file size: 5MB per image.",
    locationSectionTitle: "Tag Problem Location",
    locationSubtitle: "Capture geographic details of the infrastructure damage.",
    locationBtnCapture: "Detect My GPS Location",
    locationCapturing: "Verifying satellite links...",
    locationLabelCoordinates: "GPS Coordinates",
    locationLabelLocality: "Locality/Area",
    locationLabelWard: "Ward / Division",
    locationLabelLandmark: "Landmark Details",
    locationPlaceholderLandmark: "e.g. Near Government School",
    reviewSectionTitle: "Confirm Grievance Audit",
    reviewSubtitle: "Verify your entered data details before submitting to the MP decision portal.",
    reviewTitleLabel: "Title",
    reviewDescLabel: "Description",
    reviewCategoryLabel: "Category",
    reviewLanguageLabel: "Language",
    reviewLocationLabel: "Report Location",
    reviewPhotosLabel: "Photo Attachments",
    reviewVoiceLabel: "Audio Evidence",
    reviewVoiceDuration: "{seconds}s duration",
    successTitle: "Grievance Filed Successfully",
    successSubtitle: "Your reporting entry has been cataloged into the AI analytics engine.",
    successCardTitle: "Constituency Reference Docket",
    successRefLabel: "Docket Request ID",
    successStatusLabel: "Intake Status",
    successBtnHome: "Return to Home Page"
  },
  hi: {
    brandName: "पीपल्स प्रायोरिटीज AI",
    navHome: "मुख्य पृष्ठ",
    navHowItWorks: "यह कैसे काम करता है",
    navFeatures: "विशेषताएं",
    navDashboard: "सांसद डैशबोर्ड",
    navReportIssue: "शिकायत दर्ज करें",
    heroBadge: "निर्णय इंटेलिजेंस पोर्टल",
    heroTitle: "आपकी आवाज़ आपके समुदाय को बदल सकती है",
    heroSubtitle: "अपनी पसंदीदा भाषा में स्थानीय विकास के मुद्दों को दर्ज करें—आवाज़, पाठ या फोटो के माध्यम से। हमारी एआई तकनीक इन जरूरतों को व्यवस्थित करके सीधे आपके सांसद के पास समीक्षा के लिए भेजती है।",
    heroCtaPrimary: "समस्या रिपोर्ट करें",
    heroCtaSecondary: "अधिक जानें",
    howTitle: "यह कैसे काम करता है",
    howSubtitle: "तीन आसान चरणों में नागरिकों से लेकर निर्वाचन क्षेत्र योजना निर्णयों तक का एक सीधा पुल।",
    step1Title: "जमा करें",
    step1Desc: "अपनी पसंदीदा भाषा में टेक्स्ट, फोटो या आवाज़ के माध्यम से समस्याओं की रिपोर्ट करें।",
    step2Title: "AI समझता है",
    step2Desc: "एआई स्वचालित रूप से अनुवाद, वर्गीकरण और समान समस्याओं का समूहन करता है।",
    step3Title: "सांसद समीक्षा करते हैं",
    step3Desc: "निर्वाचित प्रतिनिधि स्पष्ट और समझाने योग्य प्रमाणों के साथ प्राथमिकताओं की समीक्षा करते हैं।",
    featTitle: "मंच की क्षमताएं",
    featSubtitle: "पहुंच, पारदर्शिता और निष्पक्ष प्राथमिकताओं के लिए डिज़ाइन किया गया।",
    featCard1Title: "बहुभाषी समर्थन",
    featCard1Desc: "हिंदी, अंग्रेजी और क्षेत्रीय भाषाओं में रिपोर्ट दर्ज करें। एआई स्वचालित रूप से अनुवाद संभालता है।",
    featCard2Title: "आवाज़-प्रथम इनपुट",
    featCard2Desc: "सहजता से बोलें। एकीकृत वॉयस रिकॉर्डिंग सभी नागरिकों के लिए रिपोर्टिंग सुलभ बनाती है।",
    featCard3Title: "दृश्य साक्ष्य",
    featCard3Desc: "विभागों को समस्या का आकलन करने में मदद के लिए तस्वीरें अपलोड करें।",
    featCard4Title: "सटीक स्थान",
    featCard4Desc: "स्वचालित जीपीएस टैगिंग बुनियादी ढांचे की समस्याओं के सटीक स्थान को दर्शाती है।",
    footerCopyright: "© 2026 पीपल्स प्रायोरिटीज AI. सर्वाधिकार सुरक्षित।",
    footerDisclaimer: "यह मंच निर्वाचन क्षेत्र योजना के लिए एक एआई निर्णय खुफिया सहायक है। अंतिम निर्णय निर्वाचित अधिकारियों के पास रहेगा।",
    wizardTitle: "विकास संबंधी मुद्दे की रिपोर्ट करें",
    btnCancel: "रद्द करें",
    btnBack: "पीछे",
    btnContinue: "आगे बढ़ें",
    btnSubmit: "शिकायत दर्ज करें",
    stepIndicator: "चरण {current} का {total}",
    infoSectionTitle: "शिकायत का विवरण",
    labelFullName: "पूरा नाम",
    placeholderFullName: "अपना नाम दर्ज करें (वैकल्पिक)",
    labelMobile: "मोबाइल नंबर",
    placeholderMobile: "10-अंकीय नंबर दर्ज करें (वैकल्पिक)",
    labelIssueTitle: "मुद्दे का शीर्षक *",
    placeholderIssueTitle: "शिकायत का शीर्षक (जैसे: मुख्य सड़क पर गड्ढे)",
    labelDescription: "विस्तृत विवरण *",
    placeholderDescription: "समस्या का विस्तृत विवरण दें। कौन सा बुनियादी ढांचा टूटा हुआ है? यह समुदाय को कैसे प्रभावित कर रहा है?",
    labelCategory: "श्रेणी *",
    placeholderCategory: "श्रेणी चुनें",
    labelPrefLanguage: "पसंदीदा भाषा *",
    placeholderPrefLanguage: "पसंदीदा भाषा चुनें",

    // Categories
    "Roads": "सड़क और परिवहन",
    "Water Supply": "जलापूर्ति और सीवेज",
    "Electricity": "बिजली और बिजली संकट",
    "Education": "शिक्षा और स्कूल",
    "Healthcare": "स्वास्थ्य सेवा और क्लिनिक",
    "Sanitation": "कचरा और स्वच्छता",
    "Public Transport": "सार्वजनिक परिवहन",
    "Agriculture": "कृषि और सिंचाई",
    "Women & Child Welfare": "महिला एवं बाल कल्याण",
    "Other": "अन्य स्थानीय मुद्दे",

    // Languages
    lang_en: "English (अंग्रेजी)",
    lang_hi: "Hindi (हिन्दी)",
    lang_mr: "Marathi (मराठी)",
    lang_gu: "Gujarati (ગુજરાતી)",
    lang_ta: "Tamil (தமிழ்)",
    lang_te: "Telugu (తెలుగు)",
    lang_kn: "Kannada (ಕನ್ನಡ)",
    lang_bn: "Bengali (বাংলা)",

    voiceSectionTitle: "ध्वनि साक्ष्य रिकॉर्ड करें",
    voiceSubtitle: "अपनी भाषा में बोलें और समस्या का विस्तार से वर्णन करें।",
    voiceRecordHelp: "रिकॉर्डिंग शुरू करने के लिए माइक बटन दबाएं।",
    voiceStartRecord: "रिकॉर्डिंग शुरू करें",
    voiceStopRecord: "रिकॉर्डिंग रोकें",
    voiceReRecord: "पुनः रिकॉर्ड करें",
    voiceDurationLimit: "अधिकतम अवधि: 60 सेकंड",
    voiceProcessing: "ऑडियो संसाधित किया जा रहा है...",
    imageSectionTitle: "तस्वीर साक्ष्य अपलोड करें",
    imageSubtitle: "विभागों को समस्या के आकार का आकलन करने में मदद करने के लिए तस्वीरें जोड़ें।",
    imageDropHelp: "फ़ाइलों को यहाँ खींचें और छोड़ें, या अपलोड करने के लिए क्लिक करें",
    imageBrowse: "फ़ाइलें ब्राउज़ करें",
    imageMaxLimit: "अधिकतम 3 तस्वीरें अपलोड की जा सकती हैं।",
    imageSizeLimit: "अधिकतम आकार: प्रति तस्वीर 5MB",
    locationSectionTitle: "समस्या के स्थान को टैग करें",
    locationSubtitle: "क्षति का भौगोलिक विवरण दर्ज करें।",
    locationBtnCapture: "जीपीएस स्थान खोजें",
    locationCapturing: "सैटेलाइट लिंक की पुष्टि हो रही है...",
    locationLabelCoordinates: "जीपीएस निर्देशांक",
    locationLabelLocality: "इलाका / क्षेत्र",
    locationLabelWard: "वार्ड / डिवीजन",
    locationLabelLandmark: "लैंडमार्क विवरण",
    locationPlaceholderLandmark: "जैसे: सरकारी स्कूल के पास",
    reviewSectionTitle: "शिकायत विवरण की पुष्टि करें",
    reviewSubtitle: "सांसद निर्णय पोर्टल पर सबमिट करने से पहले अपने दर्ज विवरण की जांच करें।",
    reviewTitleLabel: "शीर्षक",
    reviewDescLabel: "विवरण",
    reviewCategoryLabel: "श्रेणी",
    reviewLanguageLabel: "भाषा",
    reviewLocationLabel: "रिपोर्ट स्थान",
    reviewPhotosLabel: "संलग्न तस्वीरें",
    reviewVoiceLabel: "ध्वनि साक्ष्य",
    reviewVoiceDuration: "{seconds} सेकंड",
    successTitle: "शिकायत सफलतापूर्वक दर्ज की गई",
    successSubtitle: "आपकी शिकायत एआई विश्लेषण इंजन में दर्ज कर ली गई है।",
    successCardTitle: "निर्वाचन क्षेत्र संदर्भ डॉकेट",
    successRefLabel: "शिकायत संदर्भ संख्या ID",
    successStatusLabel: "स्वीकृति स्थिति",
    successBtnHome: "मुख्य पृष्ठ पर वापस जाएं"
  },
  ta: {
    brandName: "பீப்பிள்ஸ் ப்ரையாரிட்டிஸ் AI",
    navHome: "முகப்பு",
    navHowItWorks: "செயல்முறை",
    navFeatures: "அம்சங்கள்",
    navDashboard: "எம்பி டேஷ்போர்டு",
    navReportIssue: "புகாரளிக்கவும்",
    heroBadge: "முடிவு நுண்ணறிவு போர்டல்",
    heroTitle: "உங்கள் குரல் உங்கள் சமூகத்தை வடிவமைக்கிறது",
    heroSubtitle: "உள்ளூர் வளர்ச்சி சிக்கல்களை விருப்பமான மொழியில் சமர்ப்பிக்கவும்—குரல், உரை அல்லது புகைப்படம் மூலம். எம்பி மதிப்பாய்வுக்காக எங்களது AI உங்களது தேவைகளை நேரடியாக ஒருங்கிணைக்கிறது.",
    heroCtaPrimary: "சிக்கலைப் புகாரளிக்கவும்",
    heroCtaSecondary: "மேலும் அறிய",
    howTitle: "செயல்படும் முறை",
    howSubtitle: "மூன்று எளிய படிகளில் குடிமக்களிடமிருந்து தொகுதி திட்டமிடல் முடிவுகளுக்கான நேரடி பாலம்.",
    step1Title: "சமர்ப்பி",
    step1Desc: "உங்கள் விருப்பமான மொழியில் உரை, புகைப்படங்கள் அல்லது குரல் மூலம் புகாரளிக்கவும்.",
    step2Title: "AI புரிந்துகொள்கிறது",
    step2Desc: "AI தானாகவே மொழிபெயர்த்து, வகைப்படுத்தி, ஒத்த சிக்கல்களை குழுவாக்குகிறது.",
    step3Title: "எம்பி மதிப்பாய்வு",
    step3Desc: "தேர்ந்தெடுக்கப்பட்ட பிரதிநிதிகள் தெளிவான ஆதாரங்களுடன் முன்னுரிமைகளை மதிப்பாய்வு செய்கிறார்கள்.",
    featTitle: "தளத்தின் திறன்கள்",
    featSubtitle: "அணுகல், வெளிப்படைத்தன்மை மற்றும் முன்னுரிமைகளுக்காக வடிவமைக்கப்பட்டுள்ளது.",
    featCard1Title: "பல்மொழி ஆதரவு",
    featCard1Desc: "தமிழ், இந்தி மற்றும் ஆங்கில மொழிகளில் புகார்களை சமர்ப்பிக்கவும். AI மொழிபெயர்ப்புகளை தானாகவே கையாள்கிறது.",
    featCard2Title: "குரல் வழி உள்ளீடு",
    featCard2Desc: "இயல்பாகப் பேசுங்கள். ஒருங்கிணைந்த குரல் பதிவு அனைத்து குடிமக்களுக்கும் எளிதாக்குகிறது.",
    featCard3Title: "காட்சி சான்றுகள்",
    featCard3Desc: "துறைகள் சிக்கலை மதிப்பிடுவதற்கு புகைப்படங்களை பதிவேற்றவும்.",
    featCard4Title: "துல்லியமான இருப்பிடம்",
    featCard4Desc: "தானியங்கி ஜிபிஎஸ் டேக்கிங் பொது உள்கட்டமைப்பு சிக்கல்களின் சரியான இடத்தைக் காட்டுகிறது.",
    footerCopyright: "© 2026 பீப்பிள்ஸ் ப்ரையாரிட்டிஸ் AI. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
    footerDisclaimer: "இந்த தளம் தொகுதி திட்டமிடலுக்கான எம்பி முடிவு நுண்ணறிவு உதவியாளராகும். இறுதி முடிவு தேர்ந்தெடுக்கப்பட்ட அதிகாரிகளிடமே இருக்கும்.",
    wizardTitle: "வளர்ச்சி சிக்கலைப் புகாரளிக்கவும்",
    btnCancel: "ரத்துசெய்",
    btnBack: "பின்னால்",
    btnContinue: "தொடரவும்",
    btnSubmit: "சமர்ப்பிக்கவும்",
    stepIndicator: "படி {current} இன் {total}",
    infoSectionTitle: "சிக்கல் விவரம்",
    labelFullName: "முழு பெயர்",
    placeholderFullName: "பெயரை உள்ளிடவும் (விருப்பத்தேர்வு)",
    labelMobile: "கைபேசி எண்",
    placeholderMobile: "10-இலக்க எண்ணை உள்ளிடவும் (விருப்பத்தேர்வு)",
    labelIssueTitle: "சிக்கல் தலைப்பு *",
    placeholderIssueTitle: "சிக்கலின் சுருக்கமான தலைப்பு (எ.கா. சாலையில் பள்ளங்கள்)",
    labelDescription: "விரிவான விளக்கம் *",
    placeholderDescription: "பிரச்சனையின் விரிவான விளக்கத்தை வழங்கவும். என்ன உள்கட்டமைப்பு உடைந்துள்ளது? அது சமூகத்தை எவ்வாறு பாதிக்கிறது?",
    labelCategory: "வகை *",
    placeholderCategory: "வகையைத் தேர்ந்தெடுக்கவும்",
    labelPrefLanguage: "விருப்பமான மொழி *",
    placeholderPrefLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",

    // Categories
    "Roads": "சாலைகள் & போக்குவரத்து",
    "Water Supply": "நீர் விநியோகம் & கழிவுநீர்",
    "Electricity": "மின்சாரம் & மின்சக்தி",
    "Education": "கல்வி & பள்ளிகள்",
    "Healthcare": "சுகாதாரம் & கிளினிக்குகள்",
    "Sanitation": "கழிவு & சுகாதாரம்",
    "Public Transport": "பொதுப் போக்குவரத்து",
    "Agriculture": "விவசாயம் & பாசனம்",
    "Women & Child Welfare": "பெண்கள் & குழந்தைகள் நலம்",
    "Other": "இதர உள்ளூர் பிரச்சனைகள்",

    // Languages
    lang_en: "English (ஆங்கிலம்)",
    lang_hi: "Hindi (ஹிந்தி)",
    lang_mr: "Marathi (மராத்தி)",
    lang_gu: "Gujarati (குஜராத்தி)",
    lang_ta: "Tamil (தமிழ்)",
    lang_te: "Telugu (தெலுங்கு)",
    lang_kn: "Kannada (கன்னடம்)",
    lang_bn: "Bengali (வங்காளம்)",

    voiceSectionTitle: "குரல் ஆதாரத்தை பதிவு செய்யவும்",
    voiceSubtitle: "உங்கள் மொழியில் பேசுங்கள். சிக்கலை விரிவாக விவரிக்கவும்.",
    voiceRecordHelp: "பதிவு செய்யத் தொடங்க மைக்ரோஃபோன் பொத்தானைத் தட்டவும்.",
    voiceStartRecord: "பதிவைத் தொடங்கு",
    voiceStopRecord: "பதிவை நிறுத்து",
    voiceReRecord: "மீண்டும் பதிவுசெய்",
    voiceDurationLimit: "அதிகபட்ச நேரம்: 60 வினாடிகள்",
    voiceProcessing: "குரல் செயலாக்கப்படுகிறது...",
    imageSectionTitle: "புகைப்பட ஆதாரத்தை பதிவேற்றவும்",
    imageSubtitle: "துறைகள் சிக்கலின் அளவை மதிப்பிட புகைப்படங்களை இணைக்கவும்.",
    imageDropHelp: "கோப்புகளை இங்கே இழுத்து விடுங்கள், அல்லது பதிவேற்ற கிளிக் செய்யவும்",
    imageBrowse: "கோப்புகளைத் தேடு",
    imageMaxLimit: "அதிகபட்சமாக 3 புகைப்படங்கள் மட்டுமே அனுமதிக்கப்படும்.",
    imageSizeLimit: "அதிகபட்ச அளவு: ஒரு புகைப்படத்திற்கு 5MB",
    locationSectionTitle: "இருப்பிடத்தைக் குறிக்கவும்",
    locationSubtitle: "உள்கட்டமைப்பு சேதத்தின் புவியியல் விவரங்களை பதிவு செய்யவும்.",
    locationBtnCapture: "ஜிபிஎஸ் இருப்பிடத்தைக் கண்டறி",
    locationCapturing: "செயற்கைக்கோள் இணைப்புகள் சரிபார்க்கப்படுகின்றன...",
    locationLabelCoordinates: "GPS ஒருங்கிணைப்புகள்",
    locationLabelLocality: "பகுதி / இடம்",
    locationLabelWard: "வார்டு / பிரிவு",
    locationLabelLandmark: "அடையாள விவரங்கள்",
    locationPlaceholderLandmark: "எ.கா. அரசு பள்ளி அருகில்",
    reviewSectionTitle: "புகார் விவரங்களை உறுதிப்படுத்தவும்",
    reviewSubtitle: "சமர்ப்பிக்கும் முன் உள்ளிட்ட விவரங்களை சரிபார்க்கவும்.",
    reviewTitleLabel: "தலைப்பு",
    reviewDescLabel: "விளக்கம்",
    reviewCategoryLabel: "வகை",
    reviewLanguageLabel: "மொழி",
    reviewLocationLabel: "இருப்பிட அறிக்கை",
    reviewPhotosLabel: "இணைக்கப்பட்ட புகைப்படங்கள்",
    reviewVoiceLabel: "குரல் ஆதாரம்",
    reviewVoiceDuration: "{seconds} வினாடிகள்",
    successTitle: "புகார் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது",
    successSubtitle: "உங்களது புகார் போர்ட்டலில் பதிவு செய்யப்பட்டுள்ளது.",
    successCardTitle: "தொகுதி குறிப்பு ஆவணம்",
    successRefLabel: "புகார் குறிப்பு எண் ID",
    successStatusLabel: "நிலை",
    successBtnHome: "முகப்புப் பக்கத்திற்குத் திரும்பு"
  },
  kn: {
    brandName: "ಪೀಪಲ್ಸ್ ಪ್ರಾಯಾರಿಟೀಸ್ AI",
    navHome: "ಮುಖಪುಟ",
    navHowItWorks: "ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
    navFeatures: "ವೈಶಿಷ್ಟ್ಯಗಳು",
    navDashboard: "ಸಂಸದರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    navReportIssue: "ವರದಿ ಮಾಡಿ",
    heroBadge: "ನಿರ್ಧಾರ ಇಂಟೆಲಿಜೆನ್ಸ್ ಪೋರ್ಟಲ್",
    heroTitle: "ನಿಮ್ಮ ಧ್ವನಿ ನಿಮ್ಮ ಸಮುದಾಯವನ್ನು ರೂಪಿಸುತ್ತದೆ",
    heroSubtitle: "ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯಲ್ಲಿ ಸ್ಥಳೀಯ ಅಭಿವೃದ್ಧಿ ಸಮಸ್ಯೆಗಳನ್ನು ಸಲ್ಲಿಸಿ—ಧ್ವನಿ, ಪಠ್ಯ ಅಥವಾ ಫೋಟೋ ಮೂಲಕ. ನಮ್ಮ AI ತಂತ್ರಜ್ಞಾನವು ಇವುಗಳನ್ನು ಸಂಘಟಿಸಿ ನೇರವಾಗಿ ನಿಮ್ಮ ಸಂಸದರ ಪರಿಶೀಲನೆಗೆ ಕಳುಹಿಸುತ್ತದೆ.",
    heroCtaPrimary: "ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿ",
    heroCtaSecondary: "ಹೆಚ್ಚು ತಿಳಿಯಿರಿ",
    howTitle: "ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
    howSubtitle: "ಮೂರು ಸರಳ ಹಂತಗಳಲ್ಲಿ ನಾಗರಿಕರಿಂದ ಕ್ಷೇತ್ರದ ಯೋಜನಾ ನಿರ್ಧಾರಗಳಿಗೆ ನೇರ ಸೇತುವೆ.",
    step1Title: "ಸಲ್ಲಿಸಿ",
    step1Desc: "ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯಲ್ಲಿ ಪಠ್ಯ, ಫೋಟೋ ಅಥವಾ ಧ್ವನಿ ಮೂಲಕ ವರದಿ ಮಾಡಿ.",
    step2Title: "AI ಅರ್ಥಮಾಡಿಕೊಳ್ಳುತ್ತದೆ",
    step2Desc: "AI ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಭಾಷಾಂತರಿಸುತ್ತದೆ, ವರ್ಗೀಕರಿಸುತ್ತದೆ ಮತ್ತು ಒಂದೇ ರೀತಿಯ ಸಮಸ್ಯೆಗಳನ್ನು ಗುಂಪು ಮಾಡುತ್ತದೆ.",
    step3Title: "ಸಂಸದರು ಪರಿಶೀಲಿಸುತ್ತಾರೆ",
    step3Desc: "ಚುನಾಯಿತ ಪ್ರತಿನಿಧಿಗಳು ಆದ್ಯತೆಗಳನ್ನು ಪರಿಶೀಲಿಸುತ್ತಾರೆ.",
    featTitle: "ವೇದಿಕೆಯ ಸಾಮರ್ಥ್ಯಗಳು",
    featSubtitle: "ಪ್ರವೇಶ, ಪಾರದರ್ಶಕತೆ ಮತ್ತು ನಿಷ್ಪಕ್ಷಪಾತ ಆದ್ಯತೆಗಳಿಗಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ.",
    featCard1Title: "ಬಹುಭಾಷಾ ಬೆಂಬಲ",
    featCard1Desc: "ಕನ್ನಡ, ಹಿಂದಿ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ಭಾಷೆಗಳಲ್ಲಿ ವರದಿಗಳನ್ನು ಸಲ್ಲಿಸಿ. AI ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಭಾಷಾಂತರವನ್ನು ನಿರ್ವಹಿಸುತ್ತದೆ.",
    featCard2Title: "ಧ್ವನಿ-ಪ್ರಥಮ ಇನ್‌ಪುಟ್",
    featCard2Desc: "ಸಹಜವಾಗಿ ಮಾತನಾಡಿ. ಸಂಯೋಜಿತ ಧ್ವನಿ ರೆಕಾರ್ಡಿಂಗ್ ಎಲ್ಲಾ ನಾಗರಿಕರಿಗೆ ವರದಿ ಮಾಡುವುದನ್ನು ಸುಲಭಗೊಳಿಸುತ್ತದೆ.",
    featCard3Title: "ದೃಶ್ಯ ಪುರಾವೆಗಳು",
    featCard3Desc: "ಇಲಾಖೆಗಳು ಸಮಸ್ಯೆಯನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಲು ಸಹಾಯ ಮಾಡಲು ಫೋಟೋಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
    featCard4Title: "ನಿಖರವಾದ ಸ್ಥಳ",
    featCard4Desc: "ಸ್ವಯಂಚಾಲಿತ ಜಿಪಿಎಸ್ ಟ್ಯಾಗಿಂಗ್ ಸಾರ್ವಜನಿಕ ಮೂಲಸೌಕರ್ಯ ಸಮಸ್ಯೆಗಳ ನಿಖರ ಸ್ಥಳವನ್ನು ತೋರಿಸುತ್ತದೆ.",
    footerCopyright: "© 2026 ಪೀಪಲ್ಸ್ ಪ್ರಾಯಾರಿಟೀಸ್ AI. ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.",
    footerDisclaimer: "ಈ ವೇದಿಕೆಯು ಕ್ಷೇತ್ರದ ಯೋಜನೆಗಾಗಿ ಸಂಸದರ ನಿರ್ಧಾರ ಇಂಟೆಲಿಜೆನ್ಸ್ ಸಹಾಯಕವಾಗಿದೆ. ಅಂತಿಮ ನಿರ್ಧಾರ ಚುನಾಯಿತ ಪ್ರತಿನಿಧಿಗಳ ಬಳಿ ಇರುತ್ತದೆ.",
    wizardTitle: "ಅಭಿವೃದ್ಧಿ ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿ",
    btnCancel: "ರದ್ದುಮಾಡು",
    btnBack: "ಹಿಂದೆ",
    btnContinue: "ಮುಂದುವರಿಯಿರಿ",
    btnSubmit: "ದೂರನ್ನು ಸಲ್ಲಿಸಿ",
    stepIndicator: "ಹಂತ {current} ರಲ್ಲಿ {total}",
    infoSectionTitle: "ಸಮಸ್ಯೆಯ ವಿವರ",
    labelFullName: "ಪೂರ್ಣ ಹೆಸರು",
    placeholderFullName: "ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ (ಐಚ್ಛಿಕ)",
    labelMobile: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    placeholderMobile: "10-ಅಂಕಿಯ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ (ಐಚ್ಛಿಕ)",
    labelIssueTitle: "ಸಮಸ್ಯೆಯ ಶೀರ್ಷಿಕೆ *",
    placeholderIssueTitle: "ಸಮಸ್ಯೆಯ ಸಂಕ್ಷಿಪ್ತ ಶೀರ್ಷಿಕೆ (ಉದಾ: ಮುಖ್ಯ ರಸ್ತೆಯಲ್ಲಿ ಗುಂಡಿಗಳು)",
    labelDescription: "ವಿವರವಾದ ವಿವರಣೆ *",
    placeholderDescription: "ಸಮಸ್ಯೆಯ ವಿವರವಾದ ವಿವರಣೆಯನ್ನು ನೀಡಿ. ಯಾವ ಮೂಲಸೌಕರ್ಯ ಹಾಳಾಗಿದೆ? ಇದು ಸಮುದಾಯದ ಮೇಲೆ ಹೇಗೆ ಪರಿಣಾಮ ಬೀರುತ್ತಿದೆ?",
    labelCategory: "ವರ್ಗ *",
    placeholderCategory: "ವರ್ಗವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ",
    labelPrefLanguage: "ಆದ್ಯತೆಯ ಭಾಷೆ *",
    placeholderPrefLanguage: "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ",

    // Categories
    "Roads": "ರಸ್ತೆಗಳು ಮತ್ತು ಸಾರಿಗೆ",
    "Water Supply": "ನೀರು ಸರಬರಾಜು ಮತ್ತು ಒಳಚರಂಡಿ",
    "Electricity": "ವಿದ್ಯುತ್ ಮತ್ತು ವಿದ್ಯುತ್ ಶಕ್ತಿ",
    "Education": "ಶಿಕ್ಷಣ ಮತ್ತು ಶಾಲೆಗಳು",
    "Healthcare": "ಆರೋಗ್ಯ ಮತ್ತು ಕ್ಲಿನಿಕ್‌ಗಳು",
    "Sanitation": "ಕಸ ಮತ್ತು ನೈರ್ಮಲ್ಯ",
    "Public Transport": "ಸಾರ್ವಜನಿಕ ಸಾರಿಗೆ",
    "Agriculture": "ಕೃಷಿ ಮತ್ತು ನೀರಾವರಿ",
    "Women & Child Welfare": "ಮಹಿಳಾ ಮತ್ತು ಮಕ್ಕಳ ಕಲ್ಯಾಣ",
    "Other": "ಇತರ ಸ್ಥಳೀಯ ಸಮಸ್ಯೆಗಳು",

    // Languages
    lang_en: "English (ಇಂಗ್ಲಿಷ್)",
    lang_hi: "Hindi (ಹಿಂದಿ)",
    lang_mr: "Marathi (ಮರಾಠಿ)",
    lang_gu: "Gujarati (ಗುಜರಾತಿ)",
    lang_ta: "Tamil (ತಮಿಳು)",
    lang_te: "Telugu (ತೆಲುಗು)",
    lang_kn: "Kannada (ಕನ್ನಡ)",
    lang_bn: "Bengali (ಬಂಗಾಳಿ)",

    voiceSectionTitle: "ಧ್ವನಿ ಪುರಾವೆಯನ್ನು ರೆಕಾರ್ಡ್ ಮಾಡಿ",
    voiceSubtitle: "ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಿ. ಸಮಸ್ಯೆಯನ್ನು ವಿವರವಾಗಿ ವಿವರಿಸಿ.",
    voiceRecordHelp: "ರೆಕಾರ್ಡಿಂಗ್ ಪ್ರಾರಂಭಿಸಲು ಮೈಕ್ರೊಫೋನ್ ಬಟನ್ ಟ್ಯಾಪ್ ಮಾಡಿ.",
    voiceStartRecord: "ರೆಕಾರ್ಡಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ",
    voiceStopRecord: "ರೆಕಾರ್ಡಿಂಗ್ ನಿಲ್ಲಿಸಿ",
    voiceReRecord: "ಮತ್ತೆ ರೆಕಾರ್ಡ್ ಮಾಡಿ",
    voiceDurationLimit: "ಗರಿಷ್ಠ ಅವಧಿ: 60 ಸೆಕೆಂಡುಗಳು",
    voiceProcessing: "ಧ್ವನಿಯನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...",
    imageSectionTitle: "ಫೋಟೋ ಪುರಾವೆಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    imageSubtitle: "ಇಲಾಖೆಗಳು ಸಮಸ್ಯೆಯ ಗಾತ್ರವನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಲು ಫೋಟೋಗಳನ್ನು ಲಗತ್ತಿಸಿ.",
    imageDropHelp: "ಫೈಲ್‌ಗಳನ್ನು ಇಲ್ಲಿಗೆ ಎಳೆಯಿರಿ, ಅಥವಾ ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ",
    imageBrowse: "ಫೈಲ್‌ಗಳನ್ನು ಹುಡುಕಿ",
    imageMaxLimit: "ಗರಿಷ್ಠ 3 ಫೋಟೋಗಳನ್ನು ಮಾತ್ರ ಅನುಮತಿಸಲಾಗಿದೆ.",
    imageSizeLimit: "ಗರಿಷ್ಠ ಗಾತ್ರ: ಪ್ರತಿ ಫೋಟೋಗೆ 5MB",
    locationSectionTitle: "ಸಮಸ್ಯೆಯ ಸ್ಥಳವನ್ನು ಟ್ಯಾಗ್ ಮಾಡಿ",
    locationSubtitle: "ಮೂಲಸೌಕರ್ಯ ಹಾನಿಯ ಭೌಗೋಳಿಕ ವಿವರಗಳನ್ನು ರೆಕಾರ್ಡ್ ಮಾಡಿ.",
    locationBtnCapture: "ನನ್ನ ಜಿಪಿಎಸ್ ಸ್ಥಳ ಪತ್ತೆಮಾಡಿ",
    locationCapturing: "ಉಪಗ್ರಹ ಲಿಂಕ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
    locationLabelCoordinates: "GPS ನಿರ್ದೇಶಾಂಕಗಳು",
    locationLabelLocality: "ಪ್ರದೇಶ / ಸ್ಥಳ",
    locationLabelWard: "ವಾರ್ಡ್ / ವಿಭಾಗ",
    locationLabelLandmark: "ಹೆಗ್ಗುರುತು ವಿವರಗಳು",
    locationPlaceholderLandmark: "ಉದಾ: ಸರ್ಕಾರಿ ಶಾಲೆಯ ಹತ್ತಿರ",
    reviewSectionTitle: "ದೂರಿನ ವಿವರಗಳನ್ನು ಖೌಚಿಪಡಿಸಿ",
    reviewSubtitle: "ಸಲ್ಲಿಸುವ ಮುನ್ನ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",
    reviewTitleLabel: "ಶೀರ್ಷಿಕೆ",
    reviewDescLabel: "ವಿವರಣೆ",
    reviewCategoryLabel: "ವರ್ಗ",
    reviewLanguageLabel: "ಭಾಷೆ",
    reviewLocationLabel: "ವರದಿ ಸ್ಥಳ",
    reviewPhotosLabel: "ಲಗತ್ತಿಸಲಾದ ಫೋಟೋಗಳು",
    reviewVoiceLabel: "ಧ್ವನಿ ಪುರಾವೆ",
    reviewVoiceDuration: "{seconds} ಸೆಕೆಂಡುಗಳು",
    successTitle: "ದೂರನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ",
    successSubtitle: "ನಿಮ್ಮ ದೂರನ್ನು ಎಐ ವಿಶ್ಲೇಷಣೆ ಎಂಜಿನ್‌ನಲ್ಲಿ ದಾಖಲಿಸಲಾಗಿದೆ.",
    successCardTitle: "ಕ್ಷೇತ್ರದ ಉಲ್ಲೇಖದ ದಾಖಲೆ",
    successRefLabel: "ದೂರು ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ ID",
    successStatusLabel: "ಸ್ಥಿತಿ",
    successBtnHome: "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ"
  }
};
