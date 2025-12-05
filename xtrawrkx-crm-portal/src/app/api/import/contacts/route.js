import { NextResponse } from 'next/server';
import { parseFile } from '../../../../lib/utils/fileParser';
import contactService from '../../../../lib/api/contactService';
import strapiClient from '../../../../lib/strapiClient';

/**
 * POST /api/import/contacts
 * Import contacts from CSV/Excel file
 */
export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'No file provided' },
                { status: 400 }
            );
        }

        // Convert File to a format that can be parsed
        // In Next.js server, formData.get('file') returns a File object
        // We need to handle it properly for parsing
        const rows = await parseFile(file);

        if (!rows || rows.length === 0) {
            return NextResponse.json(
                { success: false, error: 'File is empty or could not be parsed' },
                { status: 400 }
            );
        }

        // Field mapping: map common CSV/Excel column names to contact fields
        const fieldMapping = {
            firstName: ['first_name', 'firstname', 'fname', 'given_name'],
            lastName: ['last_name', 'lastname', 'lname', 'surname', 'family_name'],
            email: ['email', 'email_address', 'e_mail'],
            phone: ['phone', 'phone_number', 'mobile', 'telephone', 'tel'],
            title: ['title', 'job_title', 'position', 'role'],
            company: ['company', 'company_name', 'organization', 'org'],
            status: ['status', 'contact_status'],
            leadSource: ['lead_source', 'source', 'lead_source_type'],
            notes: ['notes', 'note', 'comments', 'description'],
            linkedIn: ['linkedin', 'linkedin_url', 'linkedin_profile'],
        };

        // Auto-detect column mapping
        const headers = Object.keys(rows[0] || {});
        const columnMap = {};

        Object.keys(fieldMapping).forEach((field) => {
            const variations = fieldMapping[field];
            for (const header of headers) {
                const headerLower = header.toLowerCase();
                if (variations.some((v) => headerLower === v.toLowerCase())) {
                    columnMap[field] = header;
                    break;
                }
            }
        });

        // Process each row
        const results = {
            total: rows.length,
            successful: 0,
            failed: 0,
            errors: [],
        };

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const rowNumber = i + 2; // +2 because row 1 is header, and arrays are 0-indexed

            try {
                // Map row data to contact format
                const contactData = {};

                // Required fields
                const firstName = row[columnMap.firstName] || row.first_name || row.firstName || '';
                const lastName = row[columnMap.lastName] || row.last_name || row.lastName || '';
                const email = row[columnMap.email] || row.email || '';

                // At least name or email is required
                if (!firstName && !lastName && !email) {
                    results.errors.push(`Row ${rowNumber}: Missing required field (name or email)`);
                    results.failed++;
                    continue;
                }

                // Build name from first/last or use full name
                if (firstName || lastName) {
                    contactData.firstName = firstName;
                    contactData.lastName = lastName;
                    contactData.name = `${firstName} ${lastName}`.trim();
                } else if (row.name || row.full_name) {
                    const fullName = row.name || row.full_name;
                    const nameParts = fullName.split(' ');
                    contactData.firstName = nameParts[0] || '';
                    contactData.lastName = nameParts.slice(1).join(' ') || '';
                    contactData.name = fullName;
                }

                // Optional fields
                if (email) contactData.email = email.trim();
                if (row[columnMap.phone] || row.phone) {
                    contactData.phone = (row[columnMap.phone] || row.phone).trim();
                }
                if (row[columnMap.title] || row.title) {
                    contactData.title = (row[columnMap.title] || row.title).trim();
                }
                if (row[columnMap.company] || row.company) {
                    contactData.company = (row[columnMap.company] || row.company).trim();
                }
                if (row[columnMap.status] || row.status) {
                    contactData.status = (row[columnMap.status] || row.status).trim();
                }
                if (row[columnMap.leadSource] || row.leadSource) {
                    contactData.leadSource = (row[columnMap.leadSource] || row.leadSource).trim();
                }
                if (row[columnMap.notes] || row.notes) {
                    contactData.notes = (row[columnMap.notes] || row.notes).trim();
                }
                if (row[columnMap.linkedIn] || row.linkedIn) {
                    contactData.linkedIn = (row[columnMap.linkedIn] || row.linkedIn).trim();
                }

                // Set defaults
                contactData.status = contactData.status || 'prospect';
                contactData.leadSource = contactData.leadSource || 'import';

                // Create contact via Strapi
                const response = await strapiClient.createContact(contactData);

                if (response && (response.data || response.id)) {
                    results.successful++;
                } else {
                    throw new Error('Failed to create contact');
                }
            } catch (error) {
                console.error(`Error importing row ${rowNumber}:`, error);
                const errorMessage = error.message || 'Unknown error';
                results.errors.push(`Row ${rowNumber}: ${errorMessage}`);
                results.failed++;
            }
        }

        return NextResponse.json({
            success: true,
            ...results,
        });
    } catch (error) {
        console.error('Error importing contacts:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to import contacts',
            },
            { status: 500 }
        );
    }
}

