import Papa from 'papaparse';
import * as XLSX from 'xlsx';

/**
 * Parse CSV file
 * Works in both browser and Node.js environments
 * @param {File|Blob|string} file - CSV file
 * @returns {Promise<Array>} Parsed data as array of objects
 */
export async function parseCSV(file) {
    return new Promise(async (resolve, reject) => {
        try {
            let text;

            // Convert File/Blob to text if needed
            if (file instanceof File || file instanceof Blob) {
                if (typeof FileReader !== 'undefined') {
                    // Browser environment
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        parseText(e.target.result);
                    };
                    reader.onerror = () => reject(new Error('Failed to read CSV file'));
                    reader.readAsText(file);
                    return;
                } else {
                    // Node.js environment - convert Blob to text
                    text = await file.text();
                }
            } else if (typeof file === 'string') {
                text = file;
            } else {
                reject(new Error('Invalid file type for CSV parsing'));
                return;
            }

            function parseText(csvText) {
                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    transformHeader: (header) => {
                        // Normalize header names (trim, lowercase, replace spaces with underscores)
                        return header.trim().toLowerCase().replace(/\s+/g, '_');
                    },
                    complete: (results) => {
                        if (results.errors.length > 0) {
                            console.warn('CSV parsing warnings:', results.errors);
                        }
                        resolve(results.data);
                    },
                    error: (error) => {
                        reject(new Error(`CSV parsing error: ${error.message}`));
                    },
                });
            }

            if (text) {
                parseText(text);
            }
        } catch (error) {
            reject(new Error(`Failed to read CSV file: ${error.message}`));
        }
    });
}

/**
 * Parse Excel file (XLSX, XLS)
 * Works in both browser and Node.js environments
 * @param {File|Blob} file - Excel file
 * @returns {Promise<Array>} Parsed data as array of objects
 */
export async function parseExcel(file) {
    try {
        let arrayBuffer;

        // Handle both browser File/Blob and Node.js environment
        if (file instanceof File || file instanceof Blob) {
            // Browser environment
            if (typeof FileReader !== 'undefined') {
                arrayBuffer = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.onerror = () => reject(new Error('Failed to read Excel file'));
                    reader.readAsArrayBuffer(file);
                });
            } else {
                // Node.js environment - convert Blob to ArrayBuffer
                arrayBuffer = await file.arrayBuffer();
            }
        } else {
            // Already an ArrayBuffer or Buffer
            arrayBuffer = file;
        }

        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // Get the first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert to JSON with header row
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: '',
        });

        if (jsonData.length === 0) {
            throw new Error('Excel file is empty');
        }

        // First row is headers
        const headers = jsonData[0].map((h) =>
            String(h || '').trim().toLowerCase().replace(/\s+/g, '_')
        );

        // Convert to array of objects
        const result = jsonData.slice(1).map((row) => {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index] !== undefined ? String(row[index]).trim() : '';
            });
            return obj;
        });

        return result;
    } catch (error) {
        throw new Error(`Excel parsing error: ${error.message}`);
    }
}

/**
 * Parse file based on its extension
 * @param {File} file - File to parse
 * @returns {Promise<Array>} Parsed data as array of objects
 */
export async function parseFile(file) {
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.csv')) {
        return parseCSV(file);
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        return parseExcel(file);
    } else {
        throw new Error('Unsupported file format. Please use CSV or Excel files.');
    }
}

/**
 * Map CSV/Excel columns to entity fields
 * @param {Object} row - Row data from file
 * @param {Object} fieldMapping - Mapping of file columns to entity fields
 * @returns {Object} Mapped entity data
 */
export function mapRowToEntity(row, fieldMapping) {
    const mapped = {};

    Object.keys(fieldMapping).forEach((entityField) => {
        const fileColumn = fieldMapping[entityField];
        if (fileColumn && row[fileColumn] !== undefined && row[fileColumn] !== '') {
            mapped[entityField] = row[fileColumn];
        }
    });

    return mapped;
}

/**
 * Auto-detect field mapping based on common column names
 * @param {Array} headers - Array of header names from file
 * @param {Object} expectedFields - Object with expected field names as keys
 * @returns {Object} Mapping of entity fields to file columns
 */
export function autoDetectMapping(headers, expectedFields) {
    const mapping = {};
    const headerMap = new Map(headers.map((h) => [h.toLowerCase(), h]));

    Object.keys(expectedFields).forEach((field) => {
        const fieldLower = field.toLowerCase();
        const variations = [
            fieldLower,
            fieldLower.replace(/_/g, ' '),
            fieldLower.replace(/_/g, '-'),
            ...(expectedFields[field].aliases || []),
        ];

        for (const variation of variations) {
            if (headerMap.has(variation)) {
                mapping[field] = headerMap.get(variation);
                break;
            }
        }
    });

    return mapping;
}

