/**
 * Package script for Chrome Web Store
 * Creates a zip file ready for submission
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const distDir = path.join(__dirname, '..', 'dist');
const packagePath = path.join(__dirname, '..', 'xtrawrkx-linkedin-extension.zip');

// Files to exclude from package
const excludePatterns = [
    /\.git/,
    /node_modules/,
    /\.DS_Store/,
    /\.md$/,
    /\.txt$/,
    /package\.json/,
    /package-lock\.json/,
    /\.eslintrc/,
    /scripts\//,
    /\.test\./,
    /\.spec\./
];

function shouldExclude(filePath) {
    return excludePatterns.some(pattern => pattern.test(filePath));
}

function createPackage() {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(packagePath);
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        output.on('close', () => {
            console.log(`Package created: ${packagePath}`);
            console.log(`Total size: ${archive.pointer()} bytes`);
            resolve();
        });

        archive.on('error', (err) => {
            reject(err);
        });

        archive.pipe(output);

        // Add files from dist directory
        function addDirectory(dir, basePath = '') {
            const files = fs.readdirSync(dir);

            for (const file of files) {
                const filePath = path.join(dir, file);
                const relativePath = path.join(basePath, file);
                const stat = fs.statSync(filePath);

                if (shouldExclude(relativePath)) {
                    continue;
                }

                if (stat.isDirectory()) {
                    addDirectory(filePath, relativePath);
                } else {
                    archive.file(filePath, { name: relativePath });
                }
            }
        }

        // Add manifest and icons from root
        const rootFiles = ['manifest.json'];
        for (const file of rootFiles) {
            const filePath = path.join(__dirname, '..', file);
            if (fs.existsSync(filePath)) {
                archive.file(filePath, { name: file });
            }
        }

        // Add icons directory if it exists
        const iconsDir = path.join(__dirname, '..', 'icons');
        if (fs.existsSync(iconsDir)) {
            addDirectory(iconsDir, 'icons');
        }

        // Add dist directory
        if (fs.existsSync(distDir)) {
            addDirectory(distDir);
        }

        archive.finalize();
    });
}

createPackage()
    .then(() => {
        console.log('✅ Package created successfully!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ Error creating package:', err);
        process.exit(1);
    });

