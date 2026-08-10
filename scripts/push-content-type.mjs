import { execSync } from 'node:child_process';
import { writeFileSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const force = args.includes('--force');
const types = args.filter(a => !a.startsWith('--'));

if (!types.length) {
  console.error('Usage: npm run cms:push:type -- <TypeKey> [TypeKey2 ...] [--force]');
  console.error('Example: npm run cms:push:type -- SFA_HeroBannerBlock');
  console.error('Example: npm run cms:push:type:force -- SFA_HeroBannerBlock');
  process.exit(1);
}

const globs = types.map(t => `./cms/**/*${t}*.tsx`);
console.log(`Pushing types: ${types.join(', ')}${force ? ' (--force)' : ''}`);
console.log(`Using globs: ${globs.join(', ')}`);

const tmpConfig = resolve('optimizely.config.tmp.mjs');
writeFileSync(tmpConfig, `import { buildConfig } from '@optimizely/cms-sdk';
export default buildConfig({
  components: ${JSON.stringify(globs)},
  propertyGroups: [],
});
`);

try {
  execSync(`npx @optimizely/cms-cli config push ${tmpConfig}${force ? ' --force' : ''}`, { stdio: 'inherit' });
} finally {
  unlinkSync(tmpConfig);
}
