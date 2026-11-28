// Run under the web service account. Only the serialized portfolio leaves it.
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { createRequire } = require('node:module');

const release = process.cwd();
const releaseRequire = createRequire(join(release, 'package.json'));
const ts = releaseRequire('typescript');

function readModule(path, imports = {}) {
  const source = readFileSync(join(release, 'src', path), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const exports = {};
  const localRequire = (name) => {
    if (!Object.hasOwn(imports, name)) throw new Error('Unsupported import in portfolio source: ' + name);
    return imports[name];
  };
  new Function('exports', 'require', outputText)(exports, localRequire);
  return exports;
}

const seo = readModule('content/home-seo.ts');
const { isHomeContent } = readModule('types/cms.ts');
const { defaultHomeContent } = readModule('content/default-home-content.ts', { './home-seo': seo });
if (!isHomeContent(defaultHomeContent) || !defaultHomeContent.portfolio) {
  throw new Error('The release does not contain a valid default portfolio.');
}
process.stdout.write(JSON.stringify(defaultHomeContent.portfolio));
