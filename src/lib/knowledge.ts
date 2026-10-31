/**
 * Structured knowledge base for the website and the chatbot.
 * Source: Wicliff's profile & client-service guidelines (Oct 2026).
 *
 * RULE: only facts Wicliff supplied live here. No invented prices,
 * testimonials, client names, accuracy scores or outcomes.
 */

export type Service = {
  slug: string;
  name: string;
  category: "Data & Statistics" | "Research" | "AI & Machine Learning" | "Quantitative Finance" | "Business Intelligence";
  summary: string;
  involves: string[];
  whoBenefits: string[];
  clientProvides: string[];
  tools: string[];
  /** Indicative turnaround from the FAQ; never a guarantee. */
  timeline: string;
  /** Lower-case words/phrases the demo assistant matches on. */
  keywords: string[];
  /** A natural follow-up question the assistant asks. */
  followUp: string;
};

export const BIO = {
  short:
    "Wicliff Chomba Nyaga is a multidisciplinary Data Science, Artificial Intelligence, Research Analytics and Financial Engineering professional with experience in quantitative research, statistical computing, machine learning and analytical problem-solving.",
  paragraphs: [
    "Wicliff Chomba Nyaga is a multidisciplinary Data Science, Artificial Intelligence, Research Analytics and Financial Engineering professional with experience in quantitative research, statistical computing, machine learning and analytical problem-solving.",
    "He specialises in transforming complex datasets into meaningful insights, developing data-driven solutions, supporting rigorous academic research and building intelligent analytical applications.",
    "He works with researchers, postgraduate students, businesses, entrepreneurs, startups and institutions across different industries and geographical locations. His technical expertise spans Python, R, SQL, SPSS, Stata, Tableau, machine learning frameworks and quantitative financial research.",
    "Wicliff is currently pursuing a Master of Science in Financial Engineering at WorldQuant University while working as a Senior Analyst at WorldQuant Brain, where his work involves quantitative research and Alpha development.",
    "Through Wickie Stat Consultancy, he aims to make advanced analytical, programming and research consultancy services accessible to individuals and organisations locally and internationally.",
  ],
};

export const QUALIFICATIONS = [
  {
    title: "Master of Science in Financial Engineering (in progress)",
    institution: "WorldQuant University, Washington, United States",
    dates: "Started 2025 · expected completion 2027",
    detail: "Financial markets, quantitative finance, mathematical modelling, financial engineering and computational methods.",
  },
  {
    title: "Certificate in Foundations of Financial Engineering",
    institution: "WorldQuant University",
    dates: "Awarded 19 February 2026",
    detail: "",
  },
];

export const EXPERIENCE = [
  {
    role: "Senior Analyst",
    org: "WorldQuant Brain",
    points: [
      "Quantitative research and Alpha development.",
      "Applies computational and statistical approaches to financial market data.",
      "Works with quantitative research methodologies and analytical techniques.",
    ],
  },
  {
    role: "Freelance Data Science & Research Analytics Consultant",
    org: "Independent",
    points: [
      "Data analysis and programming consultancy.",
      "Research datasets in Python, R, SPSS, Stata and Excel.",
      "Statistical analysis, data visualisation and interpretation.",
      "Analytical solutions for academic, research and business applications.",
    ],
  },
  {
    role: "Independent Programming & AI Projects",
    org: "Self-directed",
    points: [
      "Python and R programming; statistical computing.",
      "Machine learning applications; data processing and automation.",
      "Research-oriented analytical tools.",
    ],
  },
];

export const PLATFORMS_NOTE =
  "Additional freelance and AI-related work has included projects through platforms such as Upwork, Fiverr, Outlier AI and other online professional networks.";

export const COMPETENCIES: { area: string; items: string[] }[] = [
  { area: "Programming & data science", items: ["Python", "R", "SQL", "Pandas", "NumPy", "Scikit-learn"] },
  { area: "Statistical software", items: ["SPSS", "Stata", "R", "Excel"] },
  { area: "Machine learning & AI", items: ["Machine Learning", "Deep Learning", "Generative AI", "Large Language Models", "Predictive analytics"] },
  { area: "Visualisation & BI", items: ["Tableau", "Matplotlib", "Interactive dashboards", "Streamlit"] },
  { area: "Quantitative finance", items: ["Financial modelling", "Time-series analysis", "Quantitative research", "Financial derivatives", "Algorithmic trading research"] },
];

const RESEARCH_TIMELINE = "Basic statistical analysis: 2–5 working days · research data analysis: 3–10 working days (indicative).";
const ASSESSED = "Determined after a technical assessment of your project.";

export const SERVICES: Service[] = [
  {
    slug: "data-science-analytics",
    name: "Data Science & Data Analytics",
    category: "Data & Statistics",
    summary: "Turning raw datasets into clear, defensible insight — from cleaning and exploration to modelling and reporting.",
    involves: ["Data cleaning and preparation", "Exploratory data analysis", "Statistical and predictive modelling", "Interpretation and reporting of findings"],
    whoBenefits: ["Businesses and startups", "NGOs and development organisations", "Researchers", "Professionals needing data-driven decisions"],
    clientProvides: ["Your dataset (anonymised where possible)", "The questions you want answered", "Any required output format or deadline"],
    tools: ["Python", "R", "SQL", "Pandas", "NumPy", "Excel"],
    timeline: "Research data analysis: 3–10 working days (indicative); larger data science work is scoped after assessment.",
    keywords: ["data science", "data analytics", "data analysis", "analyse", "analyze", "analysis", "dataset", "insight", "eda", "clean my data", "data cleaning"],
    followUp: "What kind of data do you have, and what decision or question should the analysis inform?",
  },
  {
    slug: "python-r-programming",
    name: "Python & R Programming",
    category: "Data & Statistics",
    summary: "Clean, reproducible code for analysis, automation, statistical computing and research tools.",
    involves: ["Writing and debugging analysis scripts", "Data processing and automation", "Statistical computing", "Reproducible research workflows"],
    whoBenefits: ["Students and researchers learning or using code", "Analysts automating repetitive work", "Teams needing a working analytical tool"],
    clientProvides: ["What the code should do", "Sample data or existing scripts", "Your environment (Python/R version, packages)"],
    tools: ["Python", "R", "Pandas", "NumPy", "Scikit-learn", "Matplotlib"],
    timeline: "Python and R programming projects: 3–14 working days (indicative).",
    keywords: ["python", "r programming", "in r", "rstudio", "script", "code", "coding", "programming", "automation", "automate", "pandas", "debug"],
    followUp: "Is this new code, or help with an existing Python/R script? A sentence on what it should do is perfect.",
  },
  {
    slug: "spss-stata",
    name: "SPSS & Stata Statistical Analysis",
    category: "Data & Statistics",
    summary: "Rigorous statistical analysis in the software your institution expects, with plain-language interpretation.",
    involves: ["Descriptive statistics", "Hypothesis testing (t-tests, ANOVA, chi-square, etc.)", "Regression and statistical modelling", "Output tables and interpretation"],
    whoBenefits: ["Undergraduate, Master's and PhD researchers", "Universities and research institutions", "NGO monitoring & evaluation teams"],
    clientProvides: ["Your data file (.sav, .dta, .xlsx or .csv)", "Research objectives or hypotheses", "Any required tests or reporting style"],
    tools: ["SPSS", "Stata", "R", "Excel"],
    timeline: RESEARCH_TIMELINE,
    keywords: ["spss", "stata", "regression", "anova", "t-test", "t test", "chi-square", "chi square", "hypothesis", "statistical analysis", "statistics", "stats", "correlation", "questionnaire data"],
    followUp: "Which software do you need the analysis in — SPSS, Stata, R or Python?",
  },
  {
    slug: "research-consultancy",
    name: "Research & Academic Consultancy",
    category: "Research",
    summary: "Methodology guidance, questionnaire design advice and analytical support that strengthens your own research.",
    involves: ["Research methodology consultations", "Questionnaire design guidance", "Data analysis plans", "Feedback on analytical methods and outputs"],
    whoBenefits: ["Undergraduate and postgraduate researchers", "Academic staff", "Research institutions"],
    clientProvides: ["Your research topic and objectives", "Draft methodology or questionnaire if available", "Institutional guidelines"],
    tools: ["SPSS", "Stata", "R", "Python", "Excel"],
    timeline: RESEARCH_TIMELINE,
    keywords: ["research", "methodology", "questionnaire", "survey design", "academic", "proposal", "research design", "sampling"],
    followUp: "What stage is your research at — design, data collection, or analysis and interpretation?",
  },
  {
    slug: "masters-phd-support",
    name: "Master's & PhD Research Support",
    category: "Research",
    summary: "Statistical guidance, data analysis and interpretation support for postgraduate research — done ethically.",
    involves: ["Statistical analysis and data cleaning", "Hypothesis testing and modelling", "Interpretation of results", "Professional data visualisation", "Guidance on presenting findings"],
    whoBenefits: ["Master's students", "PhD candidates", "Supervisors seeking analytical support for their students"],
    clientProvides: ["Your dataset and research objectives/hypotheses", "Your chapter 3 (methodology) if written", "University formatting requirements"],
    tools: ["SPSS", "Stata", "R", "Python"],
    timeline: RESEARCH_TIMELINE,
    keywords: ["master", "masters", "master's", "msc", "phd", "doctoral", "thesis", "dissertation", "postgraduate", "supervisor", "chapter 4"],
    followUp: "Are you currently using SPSS, Stata, R or Python for your analysis?",
  },
  {
    slug: "artificial-intelligence",
    name: "Artificial Intelligence",
    category: "AI & Machine Learning",
    summary: "Practical AI applications for analytical problem-solving and intelligent information processing.",
    involves: ["Scoping where AI genuinely helps", "Intelligent information processing", "Prototype AI applications", "Evaluation and responsible-use review"],
    whoBenefits: ["Startups and businesses", "Researchers exploring AI methods", "Organisations with large text or data volumes"],
    clientProvides: ["The problem you want to solve", "Available data and its format", "Constraints (budget, privacy, deployment)"],
    tools: ["Python", "PyTorch", "Scikit-learn", "Relevant AI frameworks"],
    timeline: ASSESSED,
    keywords: ["artificial intelligence", " ai ", "ai solution", "ai model", "intelligent", "deep learning", "neural network", "pytorch"],
    followUp: "What problem are you hoping AI will solve for you?",
  },
  {
    slug: "machine-learning",
    name: "Machine Learning",
    category: "AI & Machine Learning",
    summary: "Predictive models built properly: data preparation, feature engineering, training, validation and evaluation.",
    involves: ["Predictive modelling", "Classification and regression", "Feature engineering", "Model evaluation and validation", "Deployment support"],
    whoBenefits: ["Businesses forecasting demand, churn or risk", "Researchers using ML methods", "Startups building data products"],
    clientProvides: ["A description of what you want to predict", "Historical data with the outcome you care about", "How the model will be used"],
    tools: ["Python", "Scikit-learn", "Pandas", "NumPy", "Matplotlib", "PyTorch"],
    timeline: "Machine learning projects: 1–4 weeks (indicative).",
    keywords: ["machine learning", "ml", "predictive", "prediction", "predict", "classification", "classifier", "forecast", "model", "scikit", "random forest", "xgboost", "clustering"],
    followUp: "Could you briefly describe the problem you want to solve and the data you have?",
  },
  {
    slug: "generative-ai",
    name: "Generative AI",
    category: "AI & Machine Learning",
    summary: "Applications built on large language models — assistants, document processing and research tools.",
    involves: ["LLM-powered assistants and chatbots", "Document summarisation and extraction", "Prompt and workflow design", "Evaluation of output quality"],
    whoBenefits: ["Businesses automating text-heavy work", "Researchers processing documents", "Startups building AI features"],
    clientProvides: ["The task you want automated", "Example inputs and ideal outputs", "Data-privacy requirements"],
    tools: ["Python", "Large Language Models", "Generative AI frameworks"],
    timeline: ASSESSED,
    keywords: ["generative ai", "genai", "gen ai", "llm", "large language model", "chatgpt", "gpt", "chatbot", "rag", "prompt"],
    followUp: "What would you like a generative AI tool to do — and what kind of documents or data would it work with?",
  },
  {
    slug: "financial-engineering",
    name: "Financial Engineering",
    category: "Quantitative Finance",
    summary: "Mathematical and computational modelling of financial instruments, risk and markets.",
    involves: ["Financial modelling", "Derivatives and option pricing models", "Volatility analysis", "Time-series analysis"],
    whoBenefits: ["Finance students and researchers", "Fintech startups", "Analysts needing quantitative models"],
    clientProvides: ["The model or question", "Market data or data sources", "Required methodology or reporting"],
    tools: ["Python", "NumPy", "SciPy", "Financial mathematics"],
    timeline: ASSESSED,
    keywords: ["financial engineering", "derivative", "derivatives", "option pricing", "black-scholes", "black scholes", "volatility", "risk model", "financial model", "monte carlo", "quant finance"],
    followUp: "Which instruments or financial question are you working on?",
  },
  {
    slug: "forex-quant-research",
    name: "Forex & Quantitative Research",
    category: "Quantitative Finance",
    summary: "Structured, data-driven research on currency and commodity markets — analysis, not promises.",
    involves: ["Market data analysis", "Technical market-structure research", "Strategy research and backtesting frameworks", "Research dashboards"],
    whoBenefits: ["Traders wanting systematic research", "Quant-curious analysts", "Fintech teams"],
    clientProvides: ["Instruments and timeframes of interest", "Your research hypothesis", "Data sources you use"],
    tools: ["Python", "Streamlit", "Pandas", "NumPy"],
    timeline: ASSESSED,
    keywords: ["forex", "fx", "currency", "trading", "trade", "xau", "gold", "eurusd", "backtest", "backtesting", "algorithmic", "algo", "quant", "quantitative", "alpha", "strategy"],
    followUp: "Which markets or timeframes are you researching? (Note: we provide research and analysis — never guaranteed trading returns.)",
  },
  {
    slug: "business-intelligence",
    name: "Business Intelligence",
    category: "Business Intelligence",
    summary: "Reporting workflows that turn raw business data into structured insight for decisions.",
    involves: ["KPI definition and reporting", "Data pipelines from Excel/SQL", "Automated reports", "Decision-support analysis"],
    whoBenefits: ["SMEs and startups", "NGOs reporting to donors", "Managers needing regular reporting"],
    clientProvides: ["Your data sources", "The metrics you track", "Who reads the reports and how often"],
    tools: ["Tableau", "Excel", "SQL", "Python"],
    timeline: "Interactive dashboards: 3–14 working days (indicative).",
    keywords: ["business intelligence", "bi", "kpi", "reporting", "report", "sales data", "power bi", "sql"],
    followUp: "What business data do you have, and which metrics matter most to you?",
  },
  {
    slug: "data-visualisation",
    name: "Data Visualisation",
    category: "Business Intelligence",
    summary: "Charts and visual summaries that communicate findings clearly — for theses, reports and boards.",
    involves: ["Publication-quality charts", "Visual summaries of research findings", "Infographic-style reporting", "Chart design review"],
    whoBenefits: ["Researchers presenting findings", "Organisations reporting results", "Anyone preparing a presentation"],
    clientProvides: ["Data or results to visualise", "Audience and format (report, slides, web)", "Style guidelines if any"],
    tools: ["Matplotlib", "Plotly", "Tableau", "Excel"],
    timeline: "Typically scoped with the related analysis; dashboards 3–14 working days (indicative).",
    keywords: ["visualisation", "visualization", "visualise", "visualize", "chart", "charts", "graph", "graphs", "plot", "infographic"],
    followUp: "What would you like to visualise, and where will it be presented?",
  },
  {
    slug: "dashboard-development",
    name: "Dashboard Development",
    category: "Business Intelligence",
    summary: "Interactive dashboards to explore variables, monitor KPIs and share insight.",
    involves: ["Interactive dashboard design and build", "Filters, drill-downs and KPIs", "Data refresh workflows", "Handover and guidance"],
    whoBenefits: ["Businesses monitoring performance", "Researchers sharing results", "NGOs tracking programmes"],
    clientProvides: ["Your data source", "The questions the dashboard should answer", "Preferred platform (Tableau, Streamlit, etc.)"],
    tools: ["Streamlit", "Plotly", "Tableau", "Python", "Pandas"],
    timeline: "Interactive dashboards: 3–14 working days (indicative).",
    keywords: ["dashboard", "dashboards", "streamlit", "tableau", "interactive", "monitoring"],
    followUp: "Which platform would you prefer — Tableau, Streamlit or something else — and who will use the dashboard?",
  },
];

export type PortfolioProject = {
  title: string;
  label: "Demonstration project" | "Independent research project" | "Client project";
  description: string;
  tools: string[];
  area: string;
};

export const PORTFOLIO: PortfolioProject[] = [
  { title: "Forex Market Analytics Dashboard", label: "Independent research project", area: "Quantitative Finance", description: "An analytical application designed to examine financial market data, identify technical market structures and organise quantitative trading research across selected currency pairs and commodities.", tools: ["Python", "Streamlit", "Pandas", "NumPy", "Financial market data"] },
  { title: "Machine Learning Predictive Analytics", label: "Demonstration project", area: "Machine Learning", description: "Predictive modelling workflows involving data preparation, feature engineering, model training, validation and performance evaluation.", tools: ["Python", "Scikit-learn", "Pandas", "NumPy", "Matplotlib"] },
  { title: "Financial Engineering & Derivatives Modelling", label: "Independent research project", area: "Quantitative Finance", description: "Quantitative exploration of financial derivatives, option pricing models, volatility and mathematical approaches to financial market analysis.", tools: ["Python", "NumPy", "SciPy", "Financial mathematics"] },
  { title: "Research Data Analysis & Statistical Reporting", label: "Demonstration project", area: "Research Analytics", description: "A research analytics workflow covering data cleaning, descriptive statistics, hypothesis testing, statistical modelling, interpretation and reporting of research findings.", tools: ["SPSS", "R", "Python", "Excel", "Stata"] },
  { title: "Interactive Research Data Visualisation", label: "Demonstration project", area: "Visualisation", description: "Interactive dashboards for presenting research findings, exploring variables and communicating analytical insights.", tools: ["Python", "Streamlit", "Plotly", "Pandas", "Tableau"] },
  { title: "Machine Learning & AI Research Applications", label: "Independent research project", area: "AI & ML", description: "Exploration of machine learning and AI approaches for analytical problem-solving, intelligent information processing and predictive applications.", tools: ["Python", "Scikit-learn", "PyTorch", "AI frameworks"] },
  { title: "Social Network Data Analytics", label: "Independent research project", area: "Data Science", description: "Exploratory analysis of social network datasets to investigate relationships, patterns, network structures and statistical characteristics.", tools: ["Python", "PySpark", "Pandas", "Matplotlib"] },
  { title: "Business Intelligence & Data Visualisation", label: "Demonstration project", area: "Business Intelligence", description: "Analytical reporting workflows that transform raw datasets into structured insights and visual summaries for decision-making.", tools: ["Tableau", "Excel", "SQL", "Python"] },
];

export const AUDIENCES = [
  "Undergraduate and postgraduate researchers",
  "Master's and PhD researchers",
  "Universities and research institutions",
  "Businesses and startups",
  "NGOs and development organisations",
  "Entrepreneurs",
  "Professionals requiring data-driven solutions",
  "International clients requiring remote consultancy",
];

export const PROCESS = [
  { stage: "Initial enquiry", text: "Contact us through the website chatbot, contact form, email or WhatsApp, and briefly explain the service you need and the problem you want to solve." },
  { stage: "Assessment & consultation", text: "We review your requirements, datasets, expected deliverables and complexity — and arrange a consultation where needed." },
  { stage: "Quotation & agreement", text: "You receive a quotation covering scope, deliverables, estimated turnaround, pricing, payment terms and revisions. Work starts once you approve." },
  { stage: "Project execution", text: "The work follows the agreed methodology and deliverables, with progress updates where appropriate." },
  { stage: "Delivery & support", text: "Deliverables arrive in the agreed format. You review them and can request eligible revisions within the agreed period." },
];

export const TIMELINES = [
  { item: "Basic statistical analysis", time: "2–5 working days" },
  { item: "Research data analysis", time: "3–10 working days" },
  { item: "Python and R programming projects", time: "3–14 working days" },
  { item: "Machine learning projects", time: "1–4 weeks" },
  { item: "Interactive dashboards", time: "3–14 working days" },
  { item: "Complex AI and data science applications", time: "After technical assessment" },
];

export type FAQ = { id: string; q: string; a: string; keywords: string[] };

export const FAQS: FAQ[] = [
  { id: "what", q: "What is Wickie Stat Consultancy?", a: "A professional consultancy providing data science, research analytics, statistical analysis, programming, artificial intelligence, machine learning and financial engineering services to individuals, researchers, businesses, startups and organisations.", keywords: ["what is wickie", "who are you", "what do you do", "about the company", "what is this"] },
  { id: "who", q: "Who can use your services?", a: "Undergraduate and postgraduate researchers, Master's and PhD researchers, universities and research institutions, businesses and startups, NGOs and development organisations, entrepreneurs, professionals needing data-driven solutions, and international clients who need remote consultancy.", keywords: ["who can use", "who do you work with", "who is it for", "suitable for"] },
  { id: "international", q: "Do you work with international clients?", a: "Yes. We offer remote consultancy to clients in Kenya, the United Kingdom, the United States, Sweden and other international markets.", keywords: ["international", "abroad", "outside kenya", "uk", "united kingdom", "usa", "united states", "sweden", "remote", "country"] },
  { id: "online", q: "Do you provide online consultations?", a: "Yes. Consultations can be arranged through WhatsApp, email or online meetings, depending on your preference and the project's requirements.", keywords: ["online consultation", "meeting", "zoom", "google meet", "call", "consultation", "meet"] },
  { id: "timeline", q: "How long does a project take?", a: "It depends on complexity, scope and data availability. Indicative timelines: basic statistical analysis 2–5 working days; research data analysis 3–10 working days; Python/R programming 3–14 working days; machine learning 1–4 weeks; interactive dashboards 3–14 working days; complex AI applications after a technical assessment. These are estimates, not guaranteed deadlines — a confirmed timeline follows a review of your project.", keywords: ["how long", "turnaround", "timeline", "time frame", "timeframe", "duration", "days", "weeks", "deadline", "when can"] },
  { id: "urgent", q: "Can you handle urgent projects?", a: "Yes, subject to availability and complexity. Urgent requests are assessed individually and may attract additional charges.", keywords: ["urgent", "asap", "rush", "tomorrow", "quickly", "fast", "emergency", "tonight"] },
  { id: "price", q: "How much do your services cost?", a: "There's no single fixed price. Pricing depends on project complexity, the amount of data, technical requirements, deliverables, timeline and the level of consultancy needed. You always receive a quotation before any work begins.", keywords: ["how much", "price", "pricing", "cost", "charge", "rate", "rates", "fee", "fees", "quote", "quotation", "budget", "cheap", "expensive", "afford"] },
  { id: "deposit", q: "Do you require a deposit?", a: "For larger projects, an agreed initial deposit may be required before work starts. Payment milestones are set according to the project scope.", keywords: ["deposit", "upfront", "up front", "advance payment", "milestone"] },
  { id: "payment", q: "Which payment methods do you accept?", a: "M-Pesa for eligible Kenyan clients, bank transfers, international bank transfers, and other mutually agreed electronic payment methods. Exact payment instructions are shared directly when the project is confirmed.", keywords: ["payment", "pay", "m-pesa", "mpesa", "bank", "transfer", "paypal", "card", "method"] },
  { id: "revisions", q: "Do you offer revisions?", a: "Yes. Reasonable revisions are available where deliverables don't meet the originally agreed specifications — typically up to two revision rounds for eligible projects. Requests that substantially change the original scope may need a separate quotation.", keywords: ["revision", "revisions", "changes", "amend", "redo", "not satisfied", "correction"] },
  { id: "quality", q: "How do you ensure quality?", a: "Projects follow an agreed workflow: requirements assessment, data validation, appropriate analytical methods, quality checks and review of final deliverables. Where applicable, you also receive explanations of the methodology, procedures and interpretation of findings.", keywords: ["quality", "accurate", "accuracy", "reliable", "trust", "check"] },
  { id: "confidential", q: "Is my research data confidential?", a: "Yes. Client information, datasets, research materials and project discussions are treated as confidential and are never publicly disclosed without permission.", keywords: ["confidential", "confidentiality", "private", "privacy", "secure", "security", "safe", "nda", "data protection"] },
  { id: "sensitive", q: "Can I share sensitive research datasets?", a: "Please only share information you're authorised to disclose, and remove or anonymise personal identifiers wherever possible. Project files are handled with care and not used for unrelated purposes.", keywords: ["sensitive", "personal data", "anonymise", "anonymize", "identifiers", "patient", "share my data"] },
  { id: "portfolio-permission", q: "Do you publish client projects in your portfolio?", a: "Only with the client's explicit permission. Client confidentiality takes priority over portfolio promotion.", keywords: ["publish client", "showcase my", "portfolio permission"] },
];

export const INTEGRITY = {
  doNot: [
    "Ghost-write entire Master's or PhD theses for students to submit as their own work.",
    "Write academic assignments or examinations for submission under another person's name.",
    "Fabricate research findings, datasets or statistical results.",
    "Manipulate statistical outputs to produce predetermined conclusions.",
    "Invent references, citations or research sources.",
    "Guarantee academic grades, research approval or publication acceptance.",
    "Participate in academic examination cheating.",
  ],
  doProvide: [
    "Research methodology consultations",
    "Statistical analysis guidance",
    "Data cleaning and preparation",
    "Questionnaire design guidance",
    "Statistical interpretation",
    "Python, R, SPSS and Stata programming support",
    "Guidance on research findings and presentation",
    "Technical support for reproducible research",
    "Feedback on analytical methods and research outputs",
  ],
  aim: "The objective is to help researchers understand their data, improve their analytical methods and develop independent research capabilities.",
  other: [
    "Guarantee financial returns from Forex trading or investments.",
    "Promise that any trading strategy will always be profitable.",
    "Fabricate business performance statistics.",
    "Misrepresent qualifications or professional experience.",
    "Undertake projects involving illegal access to computer systems or unauthorised data.",
    "Share confidential client information without permission.",
  ],
};

export const SERVICE_NAMES = SERVICES.map((s) => s.name);
