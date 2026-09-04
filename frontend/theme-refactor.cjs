const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(srcDir, function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.css')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Borders
    content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.1\)/g, 'var(--glass-border)');
    content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.05\)/g, 'var(--glass-border)');
    content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.2\)/g, 'var(--glass-border)');
    content = content.replace(/rgba\(0,\s*0,\s*0,\s*0\.2\)/g, 'var(--bg-secondary)');
    content = content.replace(/rgba\(0,\s*0,\s*0,\s*0\.75\)/g, 'var(--bg-overlay)');
    
    // Backgrounds
    content = content.replace(/rgba\(15,\s*23,\s*42,\s*0\.5\)/g, 'var(--bg-surface)');
    content = content.replace(/rgba\(15,\s*23,\s*42,\s*0\.6\)/g, 'var(--bg-surface)');
    content = content.replace(/rgba\(15,\s*23,\s*42,\s*0\.8\)/g, 'var(--bg-header)');
    content = content.replace(/rgba\(15,\s*23,\s*42,\s*0\.9\)/g, 'var(--bg-card)');

    // Recharts Tooltip
    content = content.replace(/#1e293b/g, 'var(--bg-card)');
    content = content.replace(/#94a3b8/g, 'var(--text-secondary)');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
