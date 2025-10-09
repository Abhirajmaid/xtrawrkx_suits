import { z } from 'zod';

// Zod schemas for validation
export const userBasicsSchema = z.object({
    companyName: z.string().min(1, 'Company name is required').max(100, 'Company name too long'),
    companyEmail: z.string().email('Please enter a valid email address').max(100, 'Email too long'),
    companyPhone: z.string().min(1, 'Company phone is required').max(20, 'Phone number too long'),
    companyAddress: z.string().max(200, 'Address too long').optional(),
    companyWebsite: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    companySize: z.string().max(50, 'Company size too long').optional(),
    industry: z.string().min(1, 'Industry is required').max(50, 'Industry too long'),
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
