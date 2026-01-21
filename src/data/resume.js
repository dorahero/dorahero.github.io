import avatarImage from '../pic/me.png';

export const profile = {
    name: "Red Li",
    title: "創造數位體驗 連結未來科技",
    role: "全端工程師",
    description: "從具備數學邏輯基礎的熱忱開發者，熱愛挑戰與學習新技術。",
    avatar: avatarImage,
    about: {
        title: "關於我",
        description: [
            "邏輯擔當： 從小熱愛數學，擅長將複雜問題拆解分析，現在將這份邏輯力運用在程式開發上。",
            "效率追求者： 喜歡尋找更高效的解決方案（也可以說是為了『偷懶』而努力自動化！），致力於提升團隊產出品質。",
            "學習與挑戰： 從資策會結訓到投入實戰，始終保持海綿般的吸收力與抗壓性。",
            "離線狀態： 🏸 羽球場上的殺球手 / 🎧 獨立音樂成癮者。"
        ],
        stats: [
            { value: "10+", label: "完成專案", color: "text-primary" },
            { value: "99%", label: "客戶滿意度", color: "text-secondary" }
        ]
    }
};

export const skills = [
    { name: '資料庫開發 (Oracle, PL/SQL)', level: 90 },
    { name: '後端整合 (Java, Spring Boot, Python)', level: 85 },
    { name: '前端開發 (Vue.js)', level: 75 },
];

export const skillTags = [
    'Python',
    'Java',
    'HTML/CSS',
    'Vue.js',
    'Oracle',
    'SQL',
    'Shell',
    'Git',
    'Docker',
    'Jenkins',
];

export const education = [
    {
        year: '2020 - 2020',
        degree: 'AI/Big Data 資料分析師養成班',
        school: '緯育Tibame',
        desc: ['密集技術培訓（600 小時）： 接受紮實的軟體工程訓練，熟練掌握 Python、SQL、Linux、MongoDB 與 Docker 等核心技術。'],
        current: false,
    },
    {
        year: '2017 - 2019',
        degree: '應用數學所 碩士',
        school: '國立中興大學',
        desc: [],
        current: false,
    },
    {
        year: '2013 - 2017',
        degree: '應用數學系 學士',
        school: '國立嘉義大學',
        desc: [],
        current: false,
    },
];

export const experience = [
    {
        year: '2022 - 至今',
        title: '全端工程師',
        company: '旺宏電子股份有限公司',
        tasks: [
            '利用 PL/SQL 結合 Java 實作複雜的數據清理自動化，確保下游分析數據的可靠性。',
            '負責旺宏分析系統 sNOVA 的功能擴充，將產銷與系統邏輯深度結合，提升投料與出貨效率。',
            '採用 Vue.js 框架開發輕量化前端架構，實現產線資訊的即時監控與互動。',
        ],
        current: true,
    },
    {
        year: '2021 - 2022',
        title: 'AI 工程師',
        company: '華邦電子股份有限公司',
        tasks: [
            '改良測試演算法，縮短單片晶圓測試時間，提升整體測試產能。',
            '開發自動化測試腳本，減少人工介入，降低測試成本。',
            '應用非監督式學習模型 De-noising Auto-Encoder 進行晶圓圖特徵擷取與降噪，強化異常圖譜識別能力。',
            '實現測試數據的自動彙整與報告產出，確保資訊即時性並減少人為錯誤。'
        ],
        current: false,
    },
    {
        year: '2020 - 2021',
        title: 'AI 工程師',
        company: '模多眼力股份有限公司',
        tasks: [
            '使用 Docker 部署 Scrapy 爬蟲，實現在樹莓派上自動抓取數據。',
            '利用 Tableau 呈現分析結果，提高數據解讀效率。',
            '使用 OpenCV 進行亮度調整、文字轉正、去雜點、拉開文字間距等處理。',
            '實使用自訓練模型自動貼標，提升數據標註效率。'
        ],
        current: false,
    },
];

export const portfolio = [
    {
        id: 'enterprise-dashboard',
        title: '旺宏分析系統 sNOVA',
        desc: '為金融客戶打造的數據視覺化儀表板，支援即時數據串接與圖表匯出功能。',
        image:
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        url: '',
    },
];

export const socialLinks = {
    email: 'dorahero2727@gmail.com',
    linkedin: 'https://www.linkedin.com/in/ben-lee-7044a51b3/',
    github: 'https://github.com/dorahero',
};

