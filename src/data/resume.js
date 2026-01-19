export const profile = {
    name: "Red Li",
    title: "創造數位體驗 連結未來科技",
    role: "前端工程師 & UI 設計師",
    description: "一名熱愛技術的前端工程師與 UI 設計師。專注於打造直觀、美觀且高效的網頁應用程式。",
    avatar: "/src/pic/IMG_8883.JPG", // 注意：Vite 開發環境下可直接引用，生產環境可能需調整
    about: {
        title: "關於我",
        description: [
            "我擁有資訊工程碩士學位，並具備 5 年的前端開發經驗。我熱衷於將複雜的問題轉化為簡單、優雅的解決方案。",
            "除了寫程式，我平時也喜歡攝影和研究新的 UI/UX 趨勢，這讓我在開發時能同時兼顧技術實現與美感。"
        ],
        stats: [
            { value: "50+", label: "完成專案", color: "text-primary" },
            { value: "100%", label: "客戶滿意度", color: "text-secondary" }
        ]
    }
};

export const skills = [
    { name: '前端開發 (React, Vue)', level: 95 },
    { name: 'UI/UX 設計 (Figma)', level: 85 },
    { name: '後端整合 (Node.js, Firebase)', level: 70 },
];

export const skillTags = [
    'HTML5/CSS3',
    'Tailwind CSS',
    'JavaScript (ES6+)',
    'Git/GitHub',
    'RWD',
];

export const education = [
    {
        year: '2018 - 2020',
        degree: '資訊工程研究所 碩士',
        school: '國立嘉義大學',
        desc: '主修人工智慧與人機互動，論文研究主題為《基於深度學習的網頁佈局生成系統》。',
        current: true,
    },
    {
        year: '2014 - 2018',
        degree: '資訊管理學系 學士',
        school: '輔仁大學',
        desc: '擔任系學會資訊長，負責架設與維護系所網站，並多次參與黑客松競賽獲獎。',
        current: false,
    },
];

export const experience = [
    {
        year: '2022 - 至今',
        title: '資深前端工程師',
        company: '旺宏電子股份有限公司',
        tasks: [
            '負責公司核心 SaaS 產品的前端架構重構，提升載入速度 40%。',
            '帶領 3 人前端團隊，建立 Code Review 機制與 UI Component Library。',
            '與設計師緊密合作，實現高品質的互動特效。',
        ],
        current: true,
    },
    {
        year: '2020 - 2022',
        title: '網頁設計師',
        company: '華邦電子股份有限公司',
        tasks: [
            '負責多個電商網站的切版與活動頁面設計，熟悉 RWD 與 SEO 優化技巧。',
        ],
        current: false,
    },
];

export const portfolio = [
    {
        title: '企業數據管理後台',
        desc: '為金融客戶打造的數據視覺化儀表板，支援即時數據串接與圖表匯出功能。',
        image:
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        tags: [
            { text: 'Dashboard', class: 'text-primary bg-blue-50' },
            { text: 'React', class: 'text-secondary bg-indigo-50' },
        ],
    },
    {
        title: '時尚服飾電商平台',
        desc: '整合金流與物流系統的 RWD 電商網站，著重於行動裝置的購物體驗優化。',
        image:
            'https://images.unsplash.com/photo-1555421689-491a97ff2040?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        tags: [
            { text: 'E-commerce', class: 'text-orange-500 bg-orange-50' },
            { text: 'Next.js', class: 'text-slate-600 bg-slate-100' },
        ],
    },
    {
        title: '健康管理 App',
        desc: '跨平台行動應用程式，結合手機感測器記錄步數與飲食追蹤功能。',
        image:
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        tags: [
            { text: 'App', class: 'text-green-600 bg-green-50' },
            { text: 'React Native', class: 'text-secondary bg-indigo-50' },
        ],
    },
];
