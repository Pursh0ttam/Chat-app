const os = require('os');

const platform = os.platform();
const release = os.release();

if (platform === 'win32') {
    console.log(`Windows Version: ${release}`);
} else {
    console.log(`Platform: ${platform}`);
    console.log(`OS Release: ${release}`);
}
