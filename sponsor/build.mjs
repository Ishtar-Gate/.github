// 从 sponsor.json（链接、二维码等不随语言变的数据）和 locales/<语言>.json（文字）生成 GitHub 和 npm 上显示用的 Markdown：
// - profile/README.md：组织主页，只放不用翻译的内容（徽章、二维码、语言切换、作者网站）；
// - profile/README.<语言>.md：各语言的完整介绍；
// - sponsor/snippets/readme-section.<语言>.md：给各项目 README 用的「支持作者」「作者」两节。
// 赞助方式都排成表格：第一行是徽章（能在浏览器打开的方式带链接），第二行是二维码，第三行是一句话说明（组织主页没有这一行）。
// 徽章只用在 Markdown 里，所以徽章的颜色和图标写在这个脚本里，不放进 sponsor.json；
// 各项目自己渲染的页面（文档站、桌面应用）读同一份数据，按自己的方式显示。
//
// 用法：改完 sponsor.json 或 locales/ 之后，在仓库根目录运行 node sponsor/build.mjs，再提交生成的文件。
// 生成的文件开头有一行注释提醒不要手改；要改内容就改数据或这个脚本，然后重新生成。
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SPONSOR_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SPONSOR_DIR, '..');

const REPO = 'Ishtar-Gate/.github';
const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/main`;
const BLOB_BASE = `https://github.com/${REPO}/blob/main`;

// 语言切换里显示的名称用各语言自己的写法
const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
];

// 用这种语言的人多半手上有这些付款方式，在该语言的表格里排到前面
const FIRST_FOR = { zh: ['wechat', 'alipay'] };

// 句子之间的连接：英文用空格，中文和日文直接相连
const SENTENCE_JOINER = { en: ' ', zh: '', ja: '' };

// 二维码图片的替代文字（图片加载不出来、或读屏软件朗读时用）
const QR_ALT = {
  en: (name) => `${name} QR code`,
  zh: (name) => `${name}二维码`,
  ja: (name) => `${name} の QR コード`,
};

// 徽章的颜色（各品牌的主色）和图标（shields.io 支持的 Simple Icons 名称）
const BADGE_STYLES = {
  kofi: { color: 'FF5E5B', logo: 'ko-fi' },
  wechat: { color: '07C160', logo: 'wechat' },
  alipay: { color: '1677FF', logo: 'alipay' },
  githubSponsors: { color: 'EA4AAA', logo: 'githubsponsors' },
};

const QR_WIDTH = 140;
const GENERATED_NOTE = '<!-- 由 Ishtar-Gate/.github 的 sponsor/build.mjs 生成，不要直接修改 -->';

const readJson = (path) => JSON.parse(readFileSync(join(SPONSOR_DIR, path), 'utf8'));
const data = readJson('sponsor.json');
const locales = Object.fromEntries(LANGUAGES.map(({ code }) => [code, readJson(`locales/${code}.json`)]));

/** shields.io 静态徽章路径里，- 和 _ 要写两遍，其余字符按网址编码 */
const badgeText = (text) => encodeURIComponent(text.replaceAll('-', '--').replaceAll('_', '__'));

/** 链接最后一段，例如 https://ko-fi.com/ishtar_gate 的 ishtar_gate，作为徽章右半边显示的账号名 */
const accountOf = (url) => new URL(url).pathname.split('/').filter(Boolean).at(-1);

function badge(method, name) {
  const { color, logo } = BADGE_STYLES[method.id];
  const query = `?logo=${logo}&logoColor=white`;
  if (method.url) {
    const image = `https://img.shields.io/badge/${badgeText(name)}-${badgeText(accountOf(method.url))}-${color}${query}`;
    return `[![${name}](${image})](${method.url})`;
  }
  return `![${name}](https://img.shields.io/badge/${badgeText(name)}-${color}${query})`;
}

function orderedMethods(lang) {
  const first = FIRST_FOR[lang] ?? [];
  return [
    ...first.map((id) => data.methods.find((method) => method.id === id)),
    ...data.methods.filter((method) => !first.includes(method.id)),
  ];
}

/** 赞助方式的表格。names 和 hints 是 id 到文字的函数；hints 为空时不要第三行 */
function methodsTable(methods, { name, qrAlt, hint }) {
  const row = (cells) => `| ${cells.join(' | ')} |`;
  const rows = [
    row(methods.map((method) => badge(method, name(method)))),
    row(methods.map(() => ':---:')),
    row(
      methods.map(
        (method) => `<img src="${RAW_BASE}/sponsor/${method.qr}" width="${QR_WIDTH}" alt="${qrAlt(method)}">`
      )
    ),
  ];
  if (hint) {
    rows.push(row(methods.map(hint)));
  }
  return rows.join('\n');
}

function localizedTable(lang) {
  const text = locales[lang];
  return methodsTable(orderedMethods(lang), {
    name: (method) => text.methods[method.id].name,
    qrAlt: (method) => QR_ALT[lang](text.methods[method.id].name),
    hint: (method) => text.methods[method.id].hint,
  });
}

const page = (...blocks) => `${[GENERATED_NOTE, ...blocks].join('\n\n')}\n`;
const authorSiteHost = new URL(data.publisher.authorSite).host;

// 组织主页：不用翻译的内容。付款方式写成「中文 / 英文」对照，各语言的读者都看得懂
function buildProfileHome() {
  const { en, zh } = locales;
  const languageLinks = LANGUAGES.map(
    ({ code, label }) => `[${label}](${BLOB_BASE}/profile/README.${code}.md)`
  ).join(' · ');
  const table = methodsTable(data.methods, {
    name: (method) => {
      const names = [zh.methods[method.id].name, en.methods[method.id].name];
      return names[0] === names[1] ? names[0] : names.join(' / ');
    },
    qrAlt: (method) => en.methods[method.id].name,
  });
  return page(
    '<div align="center">',
    `# ${zh.publisher.shortName} · ${en.publisher.shortName}`,
    languageLinks,
    table,
    `[${authorSiteHost}](${data.publisher.authorSite})`,
    '</div>'
  );
}

function buildProfile(lang) {
  const text = locales[lang];
  const nav = [
    `[← ${text.publisher.shortName}](${data.publisher.github})`,
    ...LANGUAGES.map(({ code, label }) => (code === lang ? `**${label}**` : `[${label}](README.${code}.md)`)),
  ].join(' · ');
  return page(
    nav,
    `# ${text.publisher.name}`,
    [text.publisher.intro, text.profile.about].join(SENTENCE_JOINER[lang]),
    `[${text.publisher.authorSite}](${data.publisher.authorSite})`,
    `## ${text.methodsTitle}`,
    text.profile.lead,
    localizedTable(lang),
    `## ${text.profile.otherWaysTitle}`,
    text.profile.otherWays
  );
}

function buildSnippet(lang) {
  const text = locales[lang];
  return page(
    `## ${text.snippet.heading}`,
    text.snippet.lead,
    localizedTable(lang),
    text.snippet.note,
    `## ${text.snippet.authorHeading}`,
    `[${text.publisher.authorSite}](${data.publisher.authorSite}) · [${text.publisher.github}](${data.publisher.github})`
  );
}

const outputs = {
  'profile/README.md': buildProfileHome(),
  ...Object.fromEntries(LANGUAGES.map(({ code }) => [`profile/README.${code}.md`, buildProfile(code)])),
  ...Object.fromEntries(
    LANGUAGES.map(({ code }) => [`sponsor/snippets/readme-section.${code}.md`, buildSnippet(code)])
  ),
};

for (const [path, content] of Object.entries(outputs)) {
  writeFileSync(join(ROOT, path), content);
  console.log(`已生成 ${path}`);
}
