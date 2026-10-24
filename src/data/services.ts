import type { LocalizedText } from "@/lib/i18n";

export interface ServiceStep {
  title: LocalizedText;
  desc: LocalizedText;
}

export interface ServiceDetailData {
  slug: string;
  n: string;
  image: string;
  /** Cor de acento (hex) — toque distinto por serviço, sem fugir do design. */
  accent: string;
  title: LocalizedText;
  tagline: LocalizedText;
  intro: LocalizedText;
  forWho: LocalizedText;
  process: ServiceStep[];
  includes: LocalizedText[];
  tags: string[];
  metaTitle: LocalizedText;
  metaDescription: LocalizedText;
}

export const services: ServiceDetailData[] = [
  {
    slug: "sites",
    n: "01",
    image: "/services/sites.webp",
    accent: "#5B8DEF",
    title: { pt: "Front-end & Interfaces", en: "Front-end & Interfaces", es: "Sitios Web y Páginas de Destino", fr: "Sites Web et Pages d'Atterrissage", de: "Websites und Landingpages", it: "Siti Web e Pagine di Destinazione", zh: "网站和着陆页", ja: "ウェブサイトとランディングページ", ru: "Веб-сайты и целевые страницы", ar: "المواقع والصفحات المقصودة", hi: "वेबसाइटें और लैंडिंग पेज", ko: "웹사이트 및 랜딩 페이지", id: "Situs Web dan Halaman Tujuan" },
    tagline: {
      pt: "Interfaces rápidas, acessíveis e bem construídas — do componente ao deploy.",
      en: "Fast, accessible, well-built interfaces — from component to deploy.",
      es: "Una presencia digital que convierte visitantes en clientes.",
      fr: "Une présence numérique qui transforme les visiteurs en clients.",
      de: "Eine digitale Präsenz, die Besucher in Kunden verwandelt.",
      it: "Una presenza digitale che trasforma i visitatori in clienti.",
      zh: "将访客转变为客户的数字存在。",
      ja: "訪問者をクライアントに変える デジタルプレゼンス。",
      ru: "Цифровое присутствие, которое превращает посетителей в клиентов.",
      ar: "وجود رقمي يحول الزوار إلى عملاء.",
      hi: "एक डिजिटल उपस्थिति जो दर्शकों को ग्राहकों में परिवर्तित करती है।",
      ko: "방문자를 고객으로 바꾸는 디지털 존재.",
      id: "Kehadiran digital yang mengubah pengunjung menjadi klien.",
    },
    intro: {
      pt: "Transformo design em interface de verdade: componentes reutilizáveis, performance medida (Core Web Vitals), acessibilidade e SEO técnico. Construo com React e Next.js, em TypeScript, com foco em código limpo e fácil de manter.",
      en: "I turn design into real interfaces: reusable components, measured performance (Core Web Vitals), accessibility and technical SEO. Built with React and Next.js in TypeScript, focused on clean, maintainable code.",
      es: "Un sitio web es tu escaparate abierto 24/7. Creo sitios empresariales y páginas de destino personalizadas — con diseño exclusivo, texto que explica tu negocio de forma clara y una estructura diseñada para posicionarse en Google y convertir cada visitante.",
      fr: "Un site Web est votre vitrine ouverte 24h/24, 7j/7. Je crée des sites commerciaux et des pages d'atterrissage personnalisés — avec un design unique, un texte qui explique clairement votre activité et une structure conçue pour vous classer sur Google et convertir chaque visiteur.",
      de: "Eine Website ist Ihr 24/7 geöffnetes Schaufenster. Ich erstelle maßgeschneiderte Unternehmenswebsites und Landingpages — mit exklusivem Design, Text, der Ihr Geschäft klar erklärt, und einer Struktur, die für Google-Rankings und Conversionen optimiert ist.",
      it: "Un sito web è la tua vetrina aperta 24/7. Creo siti aziendali e pagine di destinazione personalizzati — con design esclusivo, testo che spiega chiaramente la tua attività e una struttura costruita per posizionarsi su Google e convertire ogni visitatore.",
      zh: "网站是您24/7开放的展示窗。我创建定制的商业网站和着陆页——具有独特的设计、清晰解释您业务的文案，以及专为Google排名和转换优化的结构。",
      ja: "ウェブサイトは24時間365日営業のあなたのショーウィンドウです。カスタムメイドのビジネスサイトとランディングページを作成します—独自のデザイン、あなたのビジネスを明確に説明するコピー、およびGoogleのランキングと訪問者の転換を目的とした構造。",
      ru: "Веб-сайт — это ваша витрина, открытая 24/7. Я создаю индивидуальные бизнес-сайты и целевые страницы — с уникальным дизайном, текстом, который четко объясняет вашу деятельность, и структурой, предназначенной для ранжирования в Google и преобразования каждого посетителя.",
      ar: "الموقع الإلكتروني هو واجهتك المفتوحة طوال الوقت. أنشئ مواقع تجارية وصفحات هبوط مخصصة — مع تصميم حصري ونص يشرح عملك بوضوح وهيكل مصمم للترتيب على Google وتحويل كل زائر.",
      hi: "एक वेबसाइट आपकी 24/7 खुली दुकान है। मैं कस्टमाइज़्ड बिजनेस साइटें और लैंडिंग पेज बनाता हूँ — अनन्य डिजाइन के साथ, पाठ जो आपके व्यवसाय को स्पष्ट रूप से समझाता है, और एक संरचना जो Google पर रैंकिंग और रूपांतरण के लिए बनाई गई है।",
      ko: "웹사이트는 24/7 열려있는 당신의 쇼윈도우입니다. 맞춤형 비즈니스 사이트와 랜딩 페이지를 만듭니다—독특한 디자인, 비즈니스를 명확하게 설명하는 카피, 그리고 Google 순위와 방문자 전환을 목표로 하는 구조와 함께.",
      id: "Situs web adalah etalase Anda yang buka 24/7. Saya membangun situs bisnis dan halaman landas yang disesuaikan — dengan desain eksklusif, salinan yang menjelaskan bisnis Anda dengan jelas, dan struktur yang dirancang untuk peringkat Google dan konversi setiap pengunjung.",
    },
    forWho: {
      pt: "Onde eu mais agrego: times de produto que precisam de um front-end sólido, rápido e fácil de manter — do MVP ao site em escala.",
      en: "Where I add the most value: product teams that need a solid, fast and maintainable front-end — from MVP to production-scale sites.",
      es: "Ideal para profesionales, pequeñas empresas y lanzamientos que necesitan una presencia en línea profesional, rápida y fácil de encontrar.",
      fr: "Idéal pour les professionnels, les petites entreprises et les lancements qui ont besoin d'une présence en ligne professionnelle, rapide et facile à trouver.",
      de: "Ideal für Fachleute, kleine Unternehmen und Launches, die eine professionelle, schnelle und leicht zu findende Online-Präsenz benötigen.",
      it: "Ideale per professionisti, piccole imprese e lanci che hanno bisogno di una presenza online professionale, veloce e facile da trovare.",
      zh: "非常适合需要专业、快速和易于查找的在线存在的专业人士、小企业和新启动。",
      ja: "プロフェッショナル、中小企業、専門的で迅速で見つけやすいオンラインプレゼンスが必要な立ち上げに最適。",
      ru: "Идеально подходит для профессионалов, малых предприятий и стартапов, которым необходимо профессиональное, быстрое и легко находимое онлайн-присутствие.",
      ar: "مثالي للمحترفين والشركات الصغيرة والعمليات التي تحتاج إلى وجود قوي وسريع وسهل البحث عنه عبر الإنترنت.",
      hi: "पेशेवरों, छोटे व्यवसायों और लॉन्च के लिए आदर्श जिन्हें एक पेशेवर, तेज़ और आसानी से खोजने योग्य ऑनलाइन उपस्थिति की आवश्यकता है।",
      ko: "전문가, 소규모 비즈니스 및 전문적이고 빠르고 찾기 쉬운 온라인 존재가 필요한 시작에 이상적입니다.",
      id: "Ideal untuk profesional, bisnis kecil dan peluncuran yang membutuhkan kehadiran online yang profesional, cepat dan mudah ditemukan.",
    },
    process: [
      {
        title: { pt: "Descoberta", en: "Discovery" },
        desc: {
          pt: "Conversamos sobre o seu negócio, objetivos e público. Eu mapeio o conteúdo e a estrutura ideal antes de desenhar qualquer tela.",
          en: "We talk about your business, goals and audience. I map out the content and the ideal structure before designing a single screen.",
        },
      },
      {
        title: { pt: "Design", en: "Design" },
        desc: {
          pt: "Crio um layout exclusivo no estilo editorial, com identidade própria, tipografia forte e foco total na leitura e na conversão.",
          en: "I craft an exclusive editorial-style layout, with its own identity, strong typography and full focus on readability and conversion.",
        },
      },
      {
        title: { pt: "Desenvolvimento", en: "Development" },
        desc: {
          pt: "Codifico tudo com Next.js e React: rápido, responsivo em qualquer tela e com SEO técnico desde a base.",
          en: "I build everything with Next.js and React: fast, responsive on any screen and with technical SEO from the ground up.",
        },
      },
      {
        title: { pt: "Publicação", en: "Launch" },
        desc: {
          pt: "Coloco no ar, configuro domínio, analytics e deixo tudo pronto pro mundo ver — com acompanhamento após o lançamento.",
          en: "I take it live, set up the domain and analytics, and leave everything ready for the world to see — with post-launch support.",
        },
      },
    ],
    includes: [
      { pt: "Design exclusivo (sem templates prontos)", en: "Exclusive design (no off-the-shelf templates)" },
      { pt: "100% responsivo (celular, tablet e desktop)", en: "Fully responsive (mobile, tablet and desktop)" },
      { pt: "SEO técnico e dados estruturados", en: "Technical SEO and structured data" },
      { pt: "Performance e carregamento rápido", en: "Performance and fast loading" },
      { pt: "Formulário de contato integrado", en: "Integrated contact form" },
      { pt: "Publicação e configuração de domínio", en: "Deployment and domain setup" },
    ],
    tags: ["React", "Next.js", "TypeScript", "Tailwind", "Framer Motion"],
    metaTitle: {
      pt: "Front-end & Interfaces — React e Next.js",
      en: "Front-end & Interfaces — React and Next.js",
    },
    metaDescription: {
      pt: "Desenvolvimento front-end com React, Next.js e TypeScript: componentes reutilizáveis, performance (Core Web Vitals), acessibilidade e SEO técnico.",
      en: "Front-end development with React, Next.js and TypeScript: reusable components, performance (Core Web Vitals), accessibility and technical SEO.",
    },
  },
  {
    slug: "sistemas",
    n: "02",
    image: "/services/sistemas.webp",
    accent: "#34D399",
    title: { pt: "Sistemas & APIs", en: "Systems & APIs", es: "Sistemas y Paneles", fr: "Systèmes et Tableaux de Bord", de: "Systeme und Dashboards", it: "Sistemi e Dashboard", zh: "系统和仪表板", ja: "システムとダッシュボード", ru: "Системы и панели управления", ar: "الأنظمة والمجالس", hi: "सिस्टम और डैशबोर्ड", ko: "시스템 및 대시보드", id: "Sistem dan Dasbor" },
    tagline: {
      pt: "Back-end, painéis e APIs REST — da modelagem do banco ao deploy.",
      en: "Back-end, dashboards and REST APIs — from database modeling to deploy.",
      es: "Automatiza procesos y centraliza la gestión de tu negocio.",
      fr: "Automatisez les processus et centralisez la gestion de votre entreprise.",
      de: "Automatisieren Sie Prozesse und zentralisieren Sie Ihr Geschäftsmanagement.",
      it: "Automatizza i processi e centralizza la gestione della tua attività.",
      zh: "自动化流程并集中管理您的业务。",
      ja: "プロセスを自動化し、ビジネス管理を一元化します。",
      ru: "Автоматизируйте процессы и централизуйте управление своей деятельностью.",
      ar: "أتمتة العمليات وتركيز إدارة عملك.",
      hi: "प्रक्रियाओं को स्वचालित करें और अपने व्यवसाय प्रबंधन को केंद्रीकृत करें।",
      ko: "프로세스를 자동화하고 비즈니스 관리를 중앙화하십시오.",
      id: "Otomatisasi proses dan sentralisasi manajemen bisnis Anda.",
    },
    intro: {
      pt: "Construo aplicações completas: autenticação, CRUD, dashboards, relatórios e APIs REST sobre banco relacional. Modelo os dados, escrevo a lógica de negócio e exponho endpoints seguros e bem documentados.",
      en: "I build complete applications: authentication, CRUD, dashboards, reports and REST APIs over a relational database. I model the data, write the business logic and expose secure, well-documented endpoints.",
      es: "Los sistemas personalizados sacan tu negocio de hojas de cálculo y trabajo manual. Construyo paneles de gestión, registros, informes e integraciones que organizan operaciones y te dan control y una vista clara de tus datos.",
      fr: "Les systèmes sur mesure retirent votre entreprise des feuilles de calcul et du travail manuel. Je crée des tableaux de bord de gestion, des enregistrements, des rapports et des intégrations qui organisent les opérations et vous donnent le contrôle et une vue claire de vos données.",
      de: "Maßgeschneiderte Systeme befreien Ihr Geschäft von Tabellen und manueller Arbeit. Ich erstelle Management-Dashboards, Datensätze, Berichte und Integrationen, die Operationen organisieren und Ihnen Kontrolle und eine klare Sicht auf Ihre Daten geben.",
      it: "I sistemi personalizzati liberano la tua attività da fogli di calcolo e lavoro manuale. Creo dashboard di gestione, record, report e integrazioni che organizzano le operazioni e ti danno il controllo e una visione chiara dei tuoi dati.",
      zh: "定制系统将您的业务从电子表格和手动工作中解放出来。我构建管理仪表板、记录、报告和集成，组织操作并为您提供对数据的控制和清晰的视图。",
      ja: "カスタムメイドシステムはあなたのビジネスをスプレッドシートと手動作業から解放します。管理ダッシュボード、レコード、レポート、統合を作成して、操作を整理し、データの制御と明確なビューを提供します。",
      ru: "Индивидуальные системы освобождают ваш бизнес от таблиц и ручной работы. Я создаю панели управления, записи, отчеты и интеграции, которые организуют операции и дают вам контроль и четкое представление ваших данных.",
      ar: "تخرج الأنظمة المخصصة عملك من جداول البيانات والعمل اليدوي. أنا أقوم بإنشاء لوحات معلومات الإدارة والسجلات والتقارير والتكاملات التي تنظم العمليات وتعطيك التحكم والرؤية الواضحة لبيانات.",
      hi: "कस्टमाइज़्ड सिस्टम आपके व्यवसाय को स्प्रेडशीट और मैनुअल कार्य से मुक्त करते हैं। मैं प्रबंधन डैशबोर्ड, रिकॉर्ड, रिपोर्ट और एकीकरण बनाता हूँ जो संचालन को संगठित करते हैं और आपको आपके डेटा पर नियंत्रण और स्पष्ट दृष्टिकोण देते हैं।",
      ko: "맞춤형 시스템은 비즈니스를 스프레드시트와 수작업에서 해방시킵니다. 작업을 구성하고 데이터를 제어하고 명확한 보기를 제공하는 관리 대시보드, 레코드, 보고서 및 통합을 구축합니다.",
      id: "Sistem yang dirancang khusus mengeluarkan bisnis Anda dari spreadsheet dan pekerjaan manual. Saya membangun dashboard manajemen, catatan, laporan, dan integrasi yang mengorganisir operasi dan memberi Anda kontrol dan tampilan data yang jelas.",
    },
    forWho: {
      pt: "Onde eu mais agrego: produtos que precisam de um back-end confiável e um painel de administração sob medida, integrados ao front-end.",
      en: "Where I add the most value: products that need a reliable back-end and a custom admin panel, integrated with the front-end.",
      es: "Ideal para empresas y equipos que aún dependen de procesos manuales y necesitan una herramienta personalizada para crecer de manera organizada.",
      fr: "Idéal pour les entreprises et les équipes qui dépendent encore de processus manuels et qui ont besoin d'un outil personnalisé pour se développer de manière organisée.",
      de: "Ideal für Unternehmen und Teams, die noch auf manuelle Prozesse angewiesen sind und ein benutzerdefiniertes Tool für ein organisiertes Wachstum benötigen.",
      it: "Ideale per aziende e team ancora dipendenti da processi manuali che hanno bisogno di uno strumento personalizzato per crescere in modo organizzato.",
      zh: "非常适合仍然依赖手动流程并需要自定义工具有序增长的公司和团队。",
      ja: "まだ手動プロセスに依存しており、組織的に成長するためのカスタムツールが必要な企業やチームに最適です。",
      ru: "Идеально подходит для компаний и команд, которые все еще полагаются на ручные процессы и нуждаются в настраиваемом инструменте для организованного роста.",
      ar: "مثالي للشركات والفرق التي لا تزال تعتمد على العمليات اليدوية وتحتاج إلى أداة مخصصة للنمو بطريقة منظمة.",
      hi: "उन कंपनियों और टीमों के लिए आदर्श जो अभी भी मैनुअल प्रक्रियाओं पर निर्भर हैं और संगठित तरीके से बढ़ने के लिए एक कस्टम टूल की आवश्यकता है।",
      ko: "여전히 수동 프로세스에 의존하고 있으며 조직적으로 성장하기 위한 사용자 정의 도구가 필요한 회사 및 팀에 이상적입니다.",
      id: "Ideal untuk perusahaan dan tim yang masih bergantung pada proses manual dan membutuhkan alat khusus untuk tumbuh secara terorganisir.",
    },
    process: [
      {
        title: { pt: "Mapeamento", en: "Mapping" },
        desc: {
          pt: "Entendo o seu fluxo de trabalho atual e identifico o que pode ser automatizado e centralizado.",
          en: "I understand your current workflow and identify what can be automated and centralized.",
        },
      },
      {
        title: { pt: "Arquitetura", en: "Architecture" },
        desc: {
          pt: "Modelo o banco de dados e a estrutura do sistema, definindo telas, permissões e regras de negócio.",
          en: "I model the database and the system structure, defining screens, permissions and business rules.",
        },
      },
      {
        title: { pt: "Desenvolvimento", en: "Development" },
        desc: {
          pt: "Construo o painel com autenticação, CRUD, relatórios e as integrações que a sua operação precisa.",
          en: "I build the dashboard with authentication, CRUD, reports and the integrations your operation needs.",
        },
      },
      {
        title: { pt: "Treinamento & Suporte", en: "Training & Support" },
        desc: {
          pt: "Entrego com treinamento da equipe e acompanhamento para garantir que tudo rode liso no dia a dia.",
          en: "I deliver with team training and follow-up to make sure everything runs smoothly day to day.",
        },
      },
    ],
    includes: [
      { pt: "Painel administrativo personalizado", en: "Custom admin panel" },
      { pt: "Login seguro e níveis de acesso", en: "Secure login and access levels" },
      { pt: "Cadastros e gestão de dados (CRUD)", en: "Records and data management (CRUD)" },
      { pt: "Relatórios e indicadores", en: "Reports and metrics" },
      { pt: "Integrações via API", en: "API integrations" },
      { pt: "Banco de dados estruturado", en: "Structured database" },
    ],
    tags: ["Node.js", "PHP", "MySQL", "REST APIs"],
    metaTitle: {
      pt: "Sistemas & APIs — back-end e painéis",
      en: "Systems & APIs — back-end and dashboards",
    },
    metaDescription: {
      pt: "Desenvolvimento de sistemas, painéis administrativos e APIs REST com autenticação, CRUD e banco de dados relacional.",
      en: "Development of systems, admin dashboards and REST APIs with authentication, CRUD and a relational database.",
    },
  },
  {
    slug: "lojas",
    n: "03",
    image: "/services/lojas.webp",
    accent: "#F59E0B",
    title: { pt: "E-commerce & Integrações", en: "E-commerce & Integrations", es: "Tiendas Virtuales", fr: "Magasins En Ligne", de: "Online-Shops", it: "Negozi Online", zh: "在线商店", ja: "オンラインストア", ru: "Интернет-магазины", ar: "المتاجر الإلكترونية", hi: "ऑनलाइन स्टोर", ko: "온라인 스토어", id: "Toko Online" },
    tagline: {
      pt: "Checkout, pagamentos e integrações — performance e segurança em primeiro lugar.",
      en: "Checkout, payments and integrations — performance and security first.",
      es: "Vende en línea con una tienda rápida, segura y lista para escalar.",
      fr: "Vendez en ligne avec un magasin rapide, sécurisé et prêt à être mis à l'échelle.",
      de: "Verkaufen Sie online mit einem schnellen, sicheren und skalierbaren Shop.",
      it: "Vendi online con un negozio veloce, sicuro e pronto per la scalabilità.",
      zh: "通过快速、安全且可扩展的商店进行在线销售。",
      ja: "高速で安全で拡張性のあるストアでオンライン販売します。",
      ru: "Продавайте онлайн с быстрым, безопасным и масштабируемым магазином.",
      ar: "بيع على الإنترنت بمتجر سريع وآمن وجاهز للتوسع.",
      hi: "एक तेज़, सुरक्षित और स्केलेबल स्टोर के साथ ऑनलाइन बेचें।",
      ko: "빠르고 안전하며 확장 가능한 스토어로 온라인 판매하세요.",
      id: "Jual online dengan toko yang cepat, aman, dan siap untuk diskalakan.",
    },
    intro: {
      pt: "Construo fluxos de e-commerce com catálogo, carrinho, checkout e integração de pagamentos (gateways e webhooks), além de controle de estoque. Foco em performance, segurança e uma experiência de compra que converte.",
      en: "I build e-commerce flows with catalog, cart, checkout and payment integrations (gateways and webhooks), plus stock control. Focused on performance, security and a buying experience that converts.",
      es: "Una tienda virtual bien hecha vende mientras duermes. Desarrollo comercio electrónico con catálogo, carrito, pago seguro y control de inventario — todo enfocado en una experiencia fluida que aumenta la conversión.",
      fr: "Un bien construit magasin en ligne vend pendant que vous dormez. Je développe le commerce électronique avec un catalogue, un panier, un paiement sécurisé et un contrôle des stocks — le tout axé sur une expérience fluide qui augmente la conversion.",
      de: "Ein gut gebauter Online-Shop verkauft, während Sie schlafen. Ich entwickle E-Commerce mit Katalog, Warenkorb, sicherer Zahlung und Bestandskontrolle — alles auf ein nahtloses Erlebnis ausgerichtet, das die Konvertierung erhöht.",
      it: "Un negozio online ben costruito vende mentre dormi. Sviluppo e-commerce con catalogo, carrello, pagamento sicuro e controllo dell'inventario — tutto focalizzato su un'esperienza fluida che aumenta la conversione.",
      zh: "一个精心构建的在线商店在你睡觉时销售。我开发具有目录、购物车、安全支付和库存控制的电子商务——所有这些都专注于提供流畅的体验，提高转换率。",
      ja: "よく構築されたオンラインストアはあなたが寝ている間に販売します。カタログ、カート、安全な支払いと在庫管理を備えたeコマースを開発します——すべてがスムーズな体験に焦点を当て、コンバージョンを高めます。",
      ru: "Хорошо построенный онлайн-магазин продает, пока вы спите. Я разрабатываю электронную коммерцию с каталогом, корзиной, безопасным платежом и контролем запасов — все сосредоточено на бесперебойной работе, которая повышает конверсию.",
      ar: "متجر إلكتروني جيد البناء يبيع بينما تنام. أقوم بتطوير التجارة الإلكترونية مع الفهرس والعربة والدفع الآمن والتحكم في الأسهم — كل هذا يركز على تجربة سلسة تزيد من التحويل.",
      hi: "एक अच्छी तरह से निर्मित ऑनलाइन स्टोर जबकि आप सो रहे हैं बेचता है। मैं कैटलॉग, कार्ट, सुरक्षित भुगतान और स्टॉक नियंत्रण के साथ ई-कॉमर्स विकसित करता हूँ — सब कुछ एक सहज अनुभव पर केंद्रित है जो रूपांतरण को बढ़ाता है।",
      ko: "잘 구축된 온라인 스토어는 당신이 자는 동안 판매합니다. 카탈로그, 카트, 안전한 결제 및 재고 관리를 갖춘 전자 상거래를 개발합니다. 모든 것이 전환을 높이는 원활한 경험에 중점을 둡니다.",
      id: "Toko online yang dibangun dengan baik menjual saat Anda tidur. Saya mengembangkan e-commerce dengan katalog, keranjang, pembayaran aman dan kontrol inventaris — semuanya berfokus pada pengalaman yang lancar yang meningkatkan konversi.",
    },
    forWho: {
      pt: "Onde eu mais agrego: projetos que precisam conectar front-end, pagamentos e serviços externos num fluxo de compra confiável e rápido.",
      en: "Where I add the most value: projects that need to connect front-end, payments and external services into a reliable, fast checkout flow.",
      es: "Ideal para minoristas y marcas que desean vender en línea con su propia tienda profesional y optimizada para conversión.",
      fr: "Idéal pour les détaillants et les marques qui souhaitent vendre en ligne avec leur propre magasin professionnel et optimisé pour la conversion.",
      de: "Ideal für Einzelhändler und Marken, die online mit ihrem eigenen professionellen, konversionsoptimierten Shop verkaufen möchten.",
      it: "Ideale per rivenditori e marchi che desiderano vendere online con il loro negozio professionale e ottimizzato per la conversione.",
      zh: "非常适合零售商和品牌，他们想通过自己专业、转换优化的商店在线销售。",
      ja: "小売業者とブランドが、自分たちの専門的で転換最適化されたストアでオンライン販売したい場合に最適です。",
      ru: "Идеально подходит для розничных торговцев и брендов, которые хотят продавать онлайн с помощью своего профессионального магазина, оптимизированного для конверсии.",
      ar: "مثالي للتجار والعلامات التجارية التي تريد البيع عبر الإنترنت من خلال متجرهم المهني والمحسّن للتحويل.",
      hi: "खुदरा विक्रेताओं और ब्रांडों के लिए आदर्श जो अपने स्वयं के पेशेवर, रूपांतरण-अनुकूलित स्टोर के साथ ऑनलाइन बेचना चाहते हैं।",
      ko: "자신의 전문 및 전환 최적화 된 스토어로 온라인 판매하려는 소매 업체 및 브랜드에 이상적입니다.",
      id: "Ideal untuk pengecer dan merek yang ingin menjual online dengan toko profesional mereka sendiri yang dioptimalkan untuk konversi.",
    },
    process: [
      {
        title: { pt: "Catálogo", en: "Catalog" },
        desc: {
          pt: "Organizamos produtos, categorias, variações e preços de forma clara e fácil de gerenciar.",
          en: "We organize products, categories, variations and prices in a clear, easy-to-manage way.",
        },
      },
      {
        title: { pt: "Design da loja", en: "Store design" },
        desc: {
          pt: "Crio uma vitrine atraente e fácil de navegar, com foco em destacar produtos e guiar até a compra.",
          en: "I create an attractive, easy-to-navigate storefront focused on highlighting products and guiding to checkout.",
        },
      },
      {
        title: { pt: "Pagamento & Estoque", en: "Payment & Stock" },
        desc: {
          pt: "Integro pagamento seguro e controle de estoque, com painel para acompanhar pedidos e vendas.",
          en: "I integrate secure payment and stock control, with a panel to track orders and sales.",
        },
      },
      {
        title: { pt: "Lançamento", en: "Launch" },
        desc: {
          pt: "Publico a loja, testo todo o fluxo de compra e otimizo cada etapa para reduzir abandono de carrinho.",
          en: "I launch the store, test the full purchase flow and optimize every step to reduce cart abandonment.",
        },
      },
    ],
    includes: [
      { pt: "Catálogo de produtos e categorias", en: "Product and category catalog" },
      { pt: "Carrinho e checkout otimizado", en: "Cart and optimized checkout" },
      { pt: "Pagamento online seguro", en: "Secure online payment" },
      { pt: "Controle de estoque", en: "Stock control" },
      { pt: "Painel de pedidos e vendas", en: "Orders and sales dashboard" },
      { pt: "Otimização de conversão", en: "Conversion optimization" },
    ],
    tags: ["E-commerce", "Pagamentos", "Webhooks", "Integrações"],
    metaTitle: {
      pt: "E-commerce & Integrações — checkout e pagamentos",
      en: "E-commerce & Integrations — checkout and payments",
    },
    metaDescription: {
      pt: "Desenvolvimento de e-commerce e integrações: catálogo, checkout, pagamentos (gateways e webhooks) e controle de estoque, com foco em performance e conversão.",
      en: "E-commerce and integrations development: catalog, checkout, payments (gateways and webhooks) and stock control, focused on performance and conversion.",
    },
  },
];

/** Copy da página índice de serviços (/services). Bilíngue pt/en (fallback via pickText). */
export const servicesIndexCopy = {
  eyebrow: { pt: "Serviços", en: "Services" } as LocalizedText,
  heading: {
    pt: "Soluções sob medida para o seu negócio crescer",
    en: "Tailored solutions to grow your business",
  } as LocalizedText,
  text: {
    pt: "Do site que vende à loja que fatura e ao sistema que organiza a operação — cada projeto é construído do zero, com foco em performance, conversão e código que dura.",
    en: "From the site that sells to the store that earns and the system that runs your operation — every project is built from scratch, focused on performance, conversion and code that lasts.",
  } as LocalizedText,
  metaTitle: {
    pt: "Serviços — Sites, Sistemas e E-commerce | Luiz Souza",
    en: "Services — Websites, Systems and E-commerce | Luiz Souza",
  } as LocalizedText,
  metaDescription: {
    pt: "Desenvolvimento de sites, landing pages, sistemas de gestão e lojas virtuais com React, Next.js e PHP. Design exclusivo, performance e foco em conversão.",
    en: "Development of websites, landing pages, management systems and online stores with React, Next.js and PHP. Exclusive design, performance and conversion focus.",
  } as LocalizedText,
  forWhoLabel: { pt: "Ideal para", en: "Ideal for" } as LocalizedText,
  includesLabel: { pt: "O que entrego", en: "What I deliver" } as LocalizedText,
  cta: { pt: "Ver detalhes", en: "See details" } as LocalizedText,
};

export const serviceSlugs = services.map((s) => s.slug);

export function getService(slug: string): ServiceDetailData | undefined {
  return services.find((s) => s.slug === slug);
}
