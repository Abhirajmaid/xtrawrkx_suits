export const COMMUNITIES = {
    XEN: {
        key: 'XEN',
        name: 'XEN',
        description: 'For early-stage entrepreneurs building the next big thing',
        freeTier: true,
        icon: '🚀',
        color: 'bg-blue-500',
    },
    XEVFIN: {
        key: 'XEVFIN',
        name: 'XEV.FiN',
        description: 'Connect with investors and raise capital for your startup',
        freeTier: false,
        icon: '💰',
        color: 'bg-green-500',
    },
    XEVTG: {
        key: 'XEVTG',
        name: 'XEVTG',
        description: 'Tech talent marketplace for professionals and companies',
        freeTier: true,
        icon: '💼',
        color: 'bg-purple-500',
    },
    XDD: {
        key: 'XDD',
        name: 'xD&D',
        description: 'Design & development community for creators',
        freeTier: true,
        icon: '🎨',
        color: 'bg-pink-500',
    },
};

// Options for form fields
export const ROLE_OPTIONS = [
    { value: 'Founder', label: 'Founder' },
    { value: 'Student', label: 'Student' },
    { value: 'Professional', label: 'Professional' },
    { value: 'Investor', label: 'Investor' },
];

export const INTEREST_OPTIONS = [
    'Technology',
    'Artificial Intelligence',
    'Blockchain',
    'FinTech',
    'HealthTech',
    'EdTech',
    'Climate Tech',
    'E-commerce',
    'SaaS',
    'Mobile Apps',
    'Web Development',
    'Data Science',
    'Cybersecurity',
    'IoT',
    'Gaming',
    'Design',
    'Marketing',
    'Sales',
];

export const XEN_STAGE_OPTIONS = [
    { value: 'Idea', label: 'Idea Stage', description: 'Early concept development' },
    { value: 'MVP', label: 'MVP Stage', description: 'Building minimum viable product' },
    { value: 'Revenue', label: 'Revenue Stage', description: 'Generating revenue' },
];

export const XEN_DOMAIN_OPTIONS = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'E-commerce',
    'Entertainment',
    'Real Estate',
    'Transportation',
    'Energy',
    'Agriculture',
    'Food & Beverage',
    'Fashion',
    'Sports',
    'Travel',
    'Other',
];

export const XEN_NEEDS_OPTIONS = [
    'Funding',
    'Mentorship',
    'Technical Co-founder',
    'Business Co-founder',
    'Marketing Support',
    'Legal Advice',
    'Product Development',
    'Business Development',
    'Networking',
    'Hiring',
];

export const XEVTG_FUNCTION_OPTIONS = [
    'Software Engineering',
    'Product Management',
    'Data Science',
    'DevOps',
    'QA Testing',
    'UI/UX Design',
    'Frontend Development',
    'Backend Development',
    'Full Stack Development',
    'Mobile Development',
    'Machine Learning',
    'Cybersecurity',
    'Technical Writing',
    'Project Management',
];

export const XDD_TOOL_OPTIONS = [
    'Figma',
    'Adobe Creative Suite',
    'Sketch',
    'InVision',
    'Principle',
    'Framer',
    'Webflow',
    'React',
    'Vue.js',
    'Angular',
    'Node.js',
    'Python',
    'JavaScript',
    'TypeScript',
    'Three.js',
    'Blender',
    'After Effects',
    'Cinema 4D',
];

// Step configuration
export const ONBOARDING_STEPS = [
    { id: 'basics', title: 'Company Information', description: 'Tell us about your company' },
    { id: 'communities', title: 'Choose Communities', description: 'Select communities to join' },
    { id: 'submissions', title: 'Community Applications', description: 'Complete community-specific forms' },
    { id: 'done', title: 'Welcome!', description: 'You\'re all set' },
];

// Environment configuration
export const isOnboardingEnabled = () => {
    return true;
};

// API endpoints
export const ONBOARDING_API_ENDPOINTS = {
    account: '/api/onboarding/account',
    basics: '/api/onboarding/basics',
    communities: '/api/onboarding/communities',
    submission: '/api/onboarding/submission',
    complete: '/api/onboarding/complete',
};
