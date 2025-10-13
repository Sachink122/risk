// Translations for Hindi
export default {
  common: {
    appTitle: 'रिस्कगार्ड एआई',
    ministry: 'पूर्वोत्तर क्षेत्र विकास मंत्रालय',
    loading: 'लोड हो रहा है...',
    error: 'एक त्रुटि हुई',
    success: 'सफलता',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    view: 'देखें',
    download: 'डाउनलोड करें',
    upload: 'अपलोड करें',
    submit: 'जमा करें',
    search: 'खोजें',
    filter: 'फिल्टर करें',
    sort: 'क्रमबद्ध करें',
    actions: 'कार्रवाई',
    yes: 'हां',
    no: 'नहीं',
    print: 'प्रिंट करें',
    back: 'वापस',
    next: 'अगला',
    retry: 'पुन: प्रयास करें',
    confirm: 'पुष्टि करें',
  },
  
  // Risk prediction translations
  risk: {
    advanced: {
      title: 'उन्नत जोखिम भविष्यवाणी',
      description: 'व्यापक जोखिम मूल्यांकन उत्पन्न करने के लिए विस्तृत परियोजना पैरामीटर का विश्लेषण करें।',
      projectInfo: 'परियोजना जानकारी',
      riskFactors: 'जोखिम कारक',
      riskAnalysis: 'जोखिम विश्लेषण',
      submit: 'जोखिम मूल्यांकन उत्पन्न करें',
      reset: 'फॉर्म रीसेट करें',
      detailedAnalysis: 'विस्तृत विश्लेषण',
      
      tabs: {
        factors: 'जोखिम कारक',
        mitigation: 'शमन रणनीति',
        comparison: 'तुलनात्मक विश्लेषण'
      },
      
      fields: {
        name: 'परियोजना का नाम',
        description: 'परियोजना का विवरण',
        cost: 'अनुमानित लागत (लाख में)',
        duration: 'परियोजना अवधि (महीनों में)',
        location: 'परियोजना स्थान',
        type: 'परियोजना प्रकार',
        terrain: 'भूभाग जटिलता',
        weather: 'मौसम की स्थिति',
        laborAvailability: 'श्रमिक उपलब्धता',
        materialAccess: 'सामग्री पहुंच',
        infrastructureStatus: 'बुनियादी ढांचे की स्थिति',
      },
      
      options: {
        projectType: {
          road: 'सड़क निर्माण',
          bridge: 'पुल',
          building: 'भवन',
          water: 'जल प्रबंधन',
          other: 'अन्य',
        },
        terrain: {
          flat: 'समतल/आसान',
          moderate: 'मध्यम',
          difficult: 'कठिन',
          extreme: 'अत्यधिक/पहाड़ी',
        },
        weather: {
          mild: 'हल्का',
          moderate: 'मध्यम',
          harsh: 'कठोर',
          extreme: 'अत्यधिक',
        },
        availability: {
          abundant: 'प्रचुर',
          adequate: 'पर्याप्त',
          limited: 'सीमित',
          scarce: 'दुर्लभ',
        },
        infrastructure: {
          excellent: 'उत्कृष्ट',
          good: 'अच्छा',
          fair: 'उचित',
          poor: 'कमजोर',
        },
      },
      
      validation: {
        nameRequired: 'परियोजना नाम आवश्यक है',
        descriptionRequired: 'कृपया अधिक विस्तृत विवरण प्रदान करें',
        costRequired: 'परियोजना लागत आवश्यक है',
        durationRequired: 'परियोजना अवधि आवश्यक है',
        locationRequired: 'परियोजना स्थान आवश्यक है',
        typeRequired: 'परियोजना प्रकार आवश्यक है',
        terrainRequired: 'भूभाग जटिलता आवश्यक है',
        weatherRequired: 'मौसम की स्थिति आवश्यक हैं',
        laborRequired: 'श्रमिक उपलब्धता आवश्यक है',
        materialRequired: 'सामग्री पहुंच आवश्यक है',
        infrastructureRequired: 'बुनियादी ढांचे की स्थिति आवश्यक है',
      },
      
      mitigation: {
        title: 'जोखिम शमन रणनीतियां',
        description: 'परियोजना जोखिमों को कम करने के लिए अनुशंसित कार्रवाई'
      },
      
      comparison: {
        title: 'तुलनात्मक जोखिम विश्लेषण',
        description: 'यह परियोजना समान परियोजनाओं से कैसे तुलना करती है',
        similar: 'क्षेत्र में समान परियोजनाएं'
      },
      
      results: {
        title: 'जोखिम मूल्यांकन परिणाम',
        overallRisk: 'समग्र जोखिम स्तर',
        breakdown: 'जोखिम विश्लेषण',
        mitigations: 'अनुशंसित शमन उपाय',
        comparison: 'तुलनात्मक विश्लेषण',
        exportReport: 'रिपोर्ट निर्यात करें',
        factors: {
          time: 'समय जोखिम',
          cost: 'लागत जोखिम',
          quality: 'गुणवत्ता जोखिम',
          environmental: 'पर्यावरणीय जोखिम',
          social: 'सामाजिक जोखिम',
        },
        levels: {
          low: 'कम',
          medium: 'मध्यम',
          high: 'उच्च',
          critical: 'गंभीर',
        }
      }
    }
  },
  // Add page-specific translations
  'Ministry of Development of North Eastern Region': 'पूर्वोत्तर क्षेत्र विकास मंत्रालय',
  'Government of India': 'भारत सरकार',
  'Login': 'लॉगिन',
  'DPR-AI': 'डीपीआर-एआई',
  'AI-powered system for automated evaluation and risk assessment of Detailed Project Reports': 'विस्तृत परियोजना रिपोर्ट के स्वचालित मूल्यांकन और जोखिम आकलन के लिए एआई-संचालित प्रणाली',
  'Get Started': 'शुरू करें',
  'Key Features': 'मुख्य विशेषताएं',
  'Intelligent Document Processing': 'इंटेलिजेंट दस्तावेज़ प्रसंस्करण',
  'Advanced OCR technology to extract and analyze text from uploaded DPR documents in multiple languages.': 'कई भाषाओं में अपलोड किए गए डीपीआर दस्तावेज़ों से टेक्स्ट निकालने और विश्लेषण करने के लिए उन्नत ओसीआर तकनीक।',
  'Compliance Verification': 'अनुपालन सत्यापन',
  'Automatic verification of DPR compliance with government guidelines and standards.': 'सरकारी दिशानिर्देशों और मानकों के साथ डीपीआर अनुपालन का स्वचालित सत्यापन।',
  'Multi-lingual Support': 'बहुभाषा समर्थन',
  'Access the platform in English, Hindi, and Assamese.': 'प्लेटफॉर्म को अंग्रेजी, हिंदी और असमिया में देखें।',
  'About Us': 'हमारे बारे में',
  'DPR-AI is an initiative by the Ministry of Development of North Eastern Region to bring cutting-edge technology to the infrastructure development process.': 'डीपीआर-एआई पूर्वोत्तर क्षेत्र विकास मंत्रालय की एक पहल है जिसका उद्देश्य बुनियादी ढांचे के विकास प्रक्रिया में अत्याधुनिक तकनीक लाना है।',
  'Our mission is to improve efficiency and success rates of infrastructure projects through intelligent risk assessment and compliance verification.': 'हमारा उद्देश्य बुद्धिमान जोखिम मूल्यांकन और अनुपालन सत्यापन के माध्यम से बुनियादी ढांचा परियोजनाओं की दक्षता और सफलता दर में सुधार करना है।',
  'User Guide': 'उपयोगकर्ता गाइड',
  
  // Dashboard translations
  dashboard: {
    title: 'डैशबोर्ड',
    welcome: 'स्वागत है, {name}',
    summary: 'परियोजना सारांश',
    recentProjects: 'हाल की परियोजनाएं',
    quickActions: 'त्वरित क्रियाएं',
    analytics: 'विश्लेषिकी',
    notifications: 'सूचनाएं',
    tasks: 'कार्य',
    viewAll: 'सभी देखें',
    status: {
      pending: 'लंबित',
      inProgress: 'प्रगति में',
      completed: 'पूर्ण',
      delayed: 'विलंबित',
    },
  },
  
  riskManagement: {
    title: 'जोखिम विश्लेषण',
    overview: 'जोखिम अवलोकन',
    detailed: 'विस्तृत जोखिम विश्लेषण',
    summary: 'जोखिम सारांश',
    recommendations: 'प्रमुख सिफारिशें',
    score: 'जोखिम स्कोर',
    level: 'जोखिम स्तर',
    factors: 'जोखिम कारक',
    category: 'श्रेणी',
    description: 'विवरण',
    impact: 'प्रभाव',
    probability: 'संभावना',
    mitigation: 'शमन रणनीति',
    owner: 'जोखिम स्वामी',
    status: 'स्थिति',
    monitor: 'निगरानी',
    update: 'अद्यतन',
    assessment: {
      title: 'जोखिम मूल्यांकन',
      instructions: 'निम्नलिखित आकलन को पूरा करके परियोजना जोखिमों का मूल्यांकन करें।',
      submit: 'मूल्यांकन जमा करें',
      results: 'मूल्यांकन परिणाम',
      highRisk: 'उच्च जोखिम वाले क्षेत्र',
      mediumRisk: 'मध्यम जोखिम वाले क्षेत्र',
      lowRisk: 'निम्न जोखिम वाले क्षेत्र',
    },
  },
};