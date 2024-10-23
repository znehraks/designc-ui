import * as esbuild from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';
import { glob } from 'glob';

// CSS 빌드
async function buildCSS() {
  const result = await esbuild.build({
    entryPoints: ['src/styles/index.css'],
    outfile: 'dist/style.css',
    bundle: true,
    minify: true,
    loader: {
      '.css': 'css',
    },
  });
  return result;
}

// TypeScript 타입 생성
async function generateTypes() {
  const { exec } = await import('child_process');
  return new Promise((resolve, reject) => {
    exec(
      'tsc --emitDeclarationOnly --outDir dist ' +
        '--module ESNext ' +
        '--moduleResolution node ' +
        '--jsx react-jsx ' +
        '--esModuleInterop ' +
        '--skipLibCheck ' +
        '--declaration ' +
        '--declarationDir dist',
      (error, stdout, stderr) => {
        if (error) {
          console.error('TypeScript compilation failed:', stderr);
          reject(error);
        } else {
          console.log('TypeScript compilation succeeded:', stdout);
          resolve(stdout);
        }
      },
    );
  });
}

// 공통 esbuild 설정
const commonConfig = {
  bundle: true,
  target: 'es2019',
  sourcemap: true,
  plugins: [nodeExternalsPlugin()],
  loader: {
    '.tsx': 'tsx',
    '.ts': 'ts',
    '.svg': 'dataurl', // SVG를 dataurl로 처리
    '.css': 'css',
  },
  assetNames: 'assets/[name]-[hash]', // 에셋 출력 경로 설정
  publicPath: '/assets/', // 공개 에셋 경로 설정
};

// 메인 빌드
async function build() {
  const entryPoints = await glob('src/**/*.{ts,tsx}', {
    ignore: [
      'src/**/*.stories.{ts,tsx}', // stories 파일 제외
      'src/**/*.story.{ts,tsx}', // story 파일 제외
      'src/**/*.stories.mdx', // MDX stories 제외
      'src/stories/**/*', // stories 폴더 전체 제외
      'src/**/__stories__/**/*', // __stories__ 폴더 제외
    ],
  });

  // ESM 빌드
  console.log('Building ESM...');
  await esbuild.build({
    ...commonConfig,
    entryPoints,
    outdir: 'dist',
    format: 'esm',
  });

  // CJS 빌드
  console.log('Building CJS...');
  await esbuild.build({
    ...commonConfig,
    entryPoints: ['src/index.ts'],
    outfile: 'dist/index.cjs',
    format: 'cjs',
  });

  // CSS 빌드
  console.log('Building CSS...');
  await buildCSS();

  // 타입 생성
  console.log('Generating types...');
  await generateTypes();

  console.log('Build completed successfully!');
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
