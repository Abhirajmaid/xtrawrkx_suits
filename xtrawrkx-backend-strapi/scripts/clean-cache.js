const fs = require('fs');
const path = require('path');

/**
 * Clean Strapi cache folder
 * This script removes the .cache directory to force Strapi to rebuild schema cache
 */
function cleanCache() {
    const cachePath = path.join(__dirname, '..', '.cache');

    console.log('🧹 Cleaning Strapi cache...');
    console.log(`Cache path: ${cachePath}`);

    try {
        if (fs.existsSync(cachePath)) {
            // Remove cache directory recursively
            fs.rmSync(cachePath, { recursive: true, force: true });
            console.log('✅ Cache folder deleted successfully');
        } else {
            console.log('ℹ️  Cache folder does not exist (this is normal if Strapi hasn\'t run yet)');
        }
    } catch (error) {
        console.error('❌ Error cleaning cache:', error.message);
        // Don't throw - allow Strapi to start even if cache cleanup fails
        console.warn('⚠️  Continuing with Strapi startup...');
    }
}

// Run if called directly
if (require.main === module) {
    cleanCache();
}

module.exports = { cleanCache };

