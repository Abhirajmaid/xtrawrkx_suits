/**
 * Build script for production
 * Minifies and optimizes extension files
 */

const fs = require('fs');
const path = require('path');

// Simple build process - copy files to dist folder
// For production, you might want to use webpack or rollup for minification

const srcDir = path.join(__dirname, '..', 'src');
const distDir = path.join(__dirname, '..', 'dist');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Copy files recursively
function copyRecursive(src, dest) {
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            if (!fs.existsSync(destPath)) {
                fs.mkdirSync(destPath, { recursive: true });
            }
            copyRecursive(srcPath, destPath);
        } else {
            // Copy file
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Copy source files
console.log('Copying source files...');
copyRecursive(srcDir, path.join(distDir, 'src'));

// Copy manifest
console.log('Copying manifest...');
fs.copyFileSync(
    path.join(__dirname, '..', 'manifest.json'),
    path.join(distDir, 'manifest.json')
);

// Copy icons if they exist
const iconsDir = path.join(__dirname, '..', 'icons');
if (fs.existsSync(iconsDir)) {
    console.log('Copying icons...');
    copyRecursive(iconsDir, path.join(distDir, 'icons'));
}

console.log('Build complete! Extension files are in the dist/ folder.');

