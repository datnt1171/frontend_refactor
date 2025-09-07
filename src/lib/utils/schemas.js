const fs = require('fs');
const path = require('path');

// Update the file path to match your project structure
const filePath = path.join(__dirname, '../../types/openapi.d.ts');

try {
  const content = fs.readFileSync(filePath, 'utf8');

  // Remove ? from next and previous in pagination schemas
  const fixedContent = content.replace(
    /(next|previous)\?\s*:\s*(string \| null;)/g,
    '$1: $2'
  );

  fs.writeFileSync(filePath, fixedContent);
  console.log('✅ Fixed pagination types in openapi.d.ts');
} catch (error) {
  console.error('❌ Error fixing pagination types:', error.message);
  process.exit(1);
}