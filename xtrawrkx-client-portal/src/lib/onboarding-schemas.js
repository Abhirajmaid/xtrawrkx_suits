import { z } from 'zod';

// Zod schemas for validation
export const userBasicsSchema = z.object({
    // Company information
    companyName: z.string()
        .trim()
        .min(1, 'Company name is required')
        .max(100, 'Company name too long'),
    industry: z.string()
        .trim()
        .min(1, 'Industry is required')
        .max(50, 'Industry too long'),

    // Personal information
    name: z.string()
        .trim()
        .min(1, 'Name is required')
        .max(100, 'Name too long'),
    role: z.string()
        .trim()
        .min(1, 'Role is required'),
    location: z.string().max(100, 'Location too long').optional().or(z.literal('')),
    interests: z.array(z.string()).max(6, 'Maximum 6 interests allowed').optional(),

    // Optional company fields
    companyEmail: z.string().email('Please enter a valid email address').max(100, 'Email too long').optional().or(z.literal('')),
    companyPhone: z.string().max(20, 'Phone number too long').optional().or(z.literal('')),
    companyAddress: z.string().max(200, 'Address too long').optional().or(z.literal('')),
    companyWebsite: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    companySize: z.string().max(50, 'Company size too long').optional().or(z.literal('')),
    website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    phone: z.string().max(20, 'Phone number too long').optional().or(z.literal('')),
    address: z.string().max(200, 'Address too long').optional().or(z.literal('')),
    city: z.string().max(100, 'City too long').optional().or(z.literal('')),
    state: z.string().max(100, 'State too long').optional().or(z.literal('')),
    zipCode: z.string().max(20, 'Zip code too long').optional().or(z.literal('')),
    country: z.string().max(100, 'Country too long').optional().or(z.literal('')),
    employees: z.string().max(50, 'Employees too long').optional().or(z.literal('')),
    description: z.string().max(1000, 'Description too long').optional().or(z.literal('')),
    founded: z.string().max(20, 'Founded year too long').optional().or(z.literal('')),
    title: z.string().max(100, 'Title too long').optional().or(z.literal('')),
    department: z.string().max(100, 'Department too long').optional().or(z.literal('')),
});

export const communitySelectionSchema = z.object({
    selectedCommunities: z.array(z.enum(['XEN', 'XEVFIN', 'XEVTG', 'XDD'])).min(1, 'Please select at least one community'),
});

// URL validation helper
const urlSchema = z.string().url('Please enter a valid URL');

// Community-specific schemas
export const xenSubmissionSchema = z.object({
    stage: z.enum(['Idea', 'MVP', 'Revenue'], { required_error: 'Please select a stage' }),
    domain: z.array(z.string()).min(1, 'Please select at least one domain'),
    oneLiner: z.string().min(1, 'One-liner is required').max(140, 'One-liner must be 140 characters or less'),
    needs: z.array(z.string()).min(1, 'Please select at least one need'),
});

export const xevfinSubmissionSchema = z.object({
    raiseAmount: z.number().positive('Raise amount must be positive'),
    deckUrl: urlSchema,
    consent: z.boolean().refine((val) => val === true, 'Consent is required'),
});

export const xevtgSubmissionSchema = z.object({
    experienceYears: z.number().min(0, 'Experience years must be non-negative'),
    functions: z.array(z.string()).min(1, 'Please select at least one function'),
    linkedin: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
    resumeUrl: urlSchema.optional().or(z.literal('')),
});

export const xddSubmissionSchema = z.object({
    portfolioUrl: urlSchema,
    tools: z.array(z.string()).min(1, 'Please select at least one tool'),
    challengeOptIn: z.boolean(),
});

// Combined submission schema
export const submissionSchemas = {
    XEN: xenSubmissionSchema,
    XEVFIN: xevfinSubmissionSchema,
    XEVTG: xevtgSubmissionSchema,
    XDD: xddSubmissionSchema,
};
