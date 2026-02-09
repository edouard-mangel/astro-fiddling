import sharp from 'sharp';
import { optimize } from 'svgo';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const publicDir = './public';

console.log('🖼️  Optimizing images...\n');

// 1. Generate favicon sizes from square logo
console.log('📦 Generating favicon sizes...');
const squareLogo = join(publicDir, 'LaCrafterieTech_Logo_IconSquare.jpg');

await sharp(squareLogo)
  .resize(16, 16)
  .png()
  .toFile(join(publicDir, 'favicon-16x16.png'));
console.log('  ✓ favicon-16x16.png');

await sharp(squareLogo)
  .resize(32, 32)
  .png()
  .toFile(join(publicDir, 'favicon-32x32.png'));
console.log('  ✓ favicon-32x32.png');

await sharp(squareLogo)
  .resize(48, 48)
  .png()
  .toFile(join(publicDir, 'favicon-48x48.png'));
console.log('  ✓ favicon-48x48.png');

// Generate ICO from 48x48 (best we can do without ico library)
await sharp(squareLogo)
  .resize(48, 48)
  .png()
  .toFile(join(publicDir, 'favicon.ico'));
console.log('  ✓ favicon.ico');

// Apple touch icon
await sharp(squareLogo)
  .resize(180, 180)
  .png()
  .toFile(join(publicDir, 'apple-touch-icon.png'));
console.log('  ✓ apple-touch-icon.png');

// 2. Optimize the large logo JPG
console.log('\n📸 Optimizing JPG images...');
const largeLogo = join(publicDir, 'LaCrafterieTech_Logo_Grand.jpg');
await sharp(largeLogo)
  .jpeg({ quality: 85, progressive: true })
  .toFile(join(publicDir, 'LaCrafterieTech_Logo_Grand.optimized.jpg'));
console.log('  ✓ LaCrafterieTech_Logo_Grand.jpg');

// Optimize square logo too
await sharp(squareLogo)
  .jpeg({ quality: 90, progressive: true })
  .toFile(join(publicDir, 'LaCrafterieTech_Logo_IconSquare.optimized.jpg'));
console.log('  ✓ LaCrafterieTech_Logo_IconSquare.jpg');

// 3. Optimize SVG
console.log('\n🎨 Optimizing SVG...');
const svgPath = join(publicDir, 'logo_event_grand.svg');
const svgContent = readFileSync(svgPath, 'utf8');
const result = optimize(svgContent, {
  path: svgPath,
  multipass: true,
  plugins: [
    'preset-default',
    'removeDoctype',
    'removeComments',
    'removeMetadata',
    'removeTitle',
    'removeDesc',
    'removeEmptyAttrs',
    'removeEmptyContainers',
    'cleanupIds',
    'minifyStyles',
    'convertStyleToAttrs',
  ],
});
writeFileSync(join(publicDir, 'logo_event_grand.optimized.svg'), result.data);
console.log('  ✓ logo_event_grand.svg');

console.log('\n✨ Image optimization complete!');
console.log('\nNext steps:');
console.log('  1. Review the optimized files');
console.log('  2. Replace originals with optimized versions');
console.log('  3. Update BaseHead.astro to use proper favicon files');
