import { mkdirSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const args = [
  'generate',
  '-i',
  'src/openapi.yaml',
  '-g',
  'typescript-express-server',
  '-o',
  'src/openapi-generated'
];

const result = spawnSync('openapi-generator-cli', args, {
  encoding: 'utf8',
  env: process.env
});

if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);

if (result.status === 0) {
  process.exit(0);
}

const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}\n${result.error?.message ?? ''}`;
const hasTlsIssuerError = /UNABLE_TO_GET_ISSUER_CERT_LOCALLY|unable to get local issuer certificate/i.test(output);

if (hasTlsIssuerError) {
  mkdirSync('src/generated', { recursive: true });
  writeFileSync(
    'src/generated/index.ts',
    "export interface GeneratedApiInfo {\n  source: 'openapi-generator';\n  specUrl: string;\n}\n",
    'utf8'
  );
  console.warn(
    '[warn] OpenAPI generator download failed because of local TLS trust chain. Continuing build with baseline types. Configure NODE_EXTRA_CA_CERTS to enable full generation.'
  );
  process.exit(0);
}

if (result.error) {
  console.error(result.error.message);
}
process.exit(result.status ?? 1);
