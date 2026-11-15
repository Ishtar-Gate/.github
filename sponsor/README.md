# 赞助信息

这个文件夹集中存放作者的赞助信息：付款方式、链接、二维码，以及中、英、日三种语言的说明文字。作者的所有项目都以这里为准。要修改赞助信息时只改这里，再按下面的「改了之后要做的事」去更新。

用到这些信息的项目都记在下面的「已经用到的项目」里；给新项目加上赞助信息后，也要把它加进那张表。

这个文件夹所在的仓库是 `Ishtar-Gate/.github`。GitHub 对组织下名为 `.github` 的公开仓库有两项特殊处理：

- 仓库里 `.github` 文件夹下的 `FUNDING.yml`（仓库名和文件夹名都叫 `.github`，GitHub 规定这个文件要放在文件夹里，放在仓库根目录不起作用）会自动用到这个组织（Ishtar-Gate）的所有仓库上：只要某个仓库自己没有 `FUNDING.yml`，它的仓库页上就会显示「Sponsor」按钮，点开能看到这里列出的赞助链接。
- `profile/README.md` 会显示在组织主页 https://github.com/Ishtar-Gate 的最上方。这一页就是「赞助页」，上面有全部四种付款方式和二维码；各项目需要放赞助页链接时，都链到这里。GitHub 只会在组织主页上显示这一个文件，不会按访客的语言换成别的文件，所以它只放不用翻译的内容（付款方式的品牌名、二维码、链接），各语言的介绍放在同一文件夹的 `README.<语言>.md` 里，主页顶部有链接通往它们。

## 数据和显示分开

- **数据**：`sponsor.json`（不随语言变的部分）、`locales/<语言>.json`（文字）和 `qr/`（二维码）。各项目共用这一份。
- **显示**：每个地方按自己的方式显示同一份数据。
  - GitHub 和 npm 上显示的 Markdown（组织主页、各语言介绍、给各项目 README 用的片段）由 `build.mjs` 从数据生成，统一是一张表格：第一行是徽章（README 里那种带图标的小标签图片；Ko-fi 和 GitHub Sponsors 这两种有网页的付款方式，徽章可以点击，打开对应的网页），第二行是二维码，第三行是一句话说明。生成出来的文件开头有一行注释提醒不要手改。
  - 各项目自己渲染的页面（例如文档站、桌面应用）读复制过去的数据，按适合自己的方式显示。桌面应用显示不了网络上的徽章图片，就显示普通链接。

## 文件

下表的路径都从仓库根目录（也就是 `sponsor` 文件夹的上一层）算起。文件名里的 `<语言>` 一律用两个字母的语言代码：`en` 英文、`zh` 中文、`ja` 日文。标着「生成」的文件由 `sponsor/build.mjs` 生成，不要手改。

| 文件 | 内容 |
| --- | --- |
| `.github/FUNDING.yml` | GitHub 仓库页「Sponsor」按钮用的配置，只有两行：`github: Ishtar-Gate`（GitHub Sponsors 账号）和 `ko_fi: ishtar_gate`（Ko-fi 账号） |
| `profile/README.md`（生成） | 组织主页上显示的赞助页，只有不用翻译的内容：语言切换链接、四种付款方式的表格（只有徽章和二维码两行，没有一句话说明那一行，因为说明要翻译；徽章上的名称写成「微信 / WeChat」这样的中英对照）、作者网站 |
| `profile/README.<语言>.md`（生成） | 各语言的完整介绍：发布者介绍、作者网站、付款方式的表格、其他支持方式 |
| `sponsor/sponsor.json` | 不随语言变的数据：作者网站和组织的 GitHub 地址，以及四种付款方式的 `id`、种类（`link` 是能在浏览器打开的链接，`qr` 是只能扫码的收款码）、链接和二维码路径 |
| `sponsor/locales/<语言>.json` | 随语言变的文字：`publisher`（发布者的名称、简称、介绍、链接的显示文字）、`methods`（各付款方式的名称和一句话说明，键和 `sponsor.json` 里的 `id` 一一对应）、`methodsTitle`（付款方式一节的标题）、`profile`（只有各语言介绍页用的句子）、`snippet`（只有 README 片段用的句子） |
| `sponsor/qr/` | 四张二维码图片。微信、支付宝是收款码，只截了二维码那一块，不带昵称和实名；Ko-fi、GitHub Sponsors 是由它们的链接生成的二维码，链接变了要重新生成，做法见下面「改了之后要做的事」 |
| `sponsor/build.mjs` | 生成上面标着「生成」的文件和下面的 README 片段。徽章的颜色和图标、表格里付款方式的排序（例如中文把微信、支付宝排在前面）也写在这里 |
| `sponsor/snippets/readme-section.<语言>.md`（生成） | 给各项目 README 用的「支持作者」和「作者」两节。第一句话里的 `PROJECT_NAME` 是占位符，用的时候换成项目名 |
| `sponsor/snippets/package-json-funding.json` | 给 npm 包用的 `funding` 字段（用这个包的人运行 `npm fund` 命令时，会列出这里的链接） |
| `sponsor/snippets/FUNDING.yml` | 给不在 Ishtar-Gate 组织下的仓库用（例如 `Toshinaki/mantyke`），内容和 `.github/FUNDING.yml` 相同 |

## 在新项目里加赞助信息

1. **README**：README 是哪种语言，就用同语言的片段：把 `snippets/readme-section.<语言>.md` 的内容复制到 README 末尾、许可证一节之前，把 `PROJECT_NAME` 换成项目名。片段里的链接和图片地址都是完整网址，所以放在 npm 包的 README 里也能正常显示。
2. **npm 包**：把 `snippets/package-json-funding.json` 里的 `funding` 字段加到包的 `package.json`。要等这个包下一次发布，npm 上的版本才会带上它。
3. **仓库的 Sponsor 按钮**：按钮要同时满足两个条件才会显示。
   - 有赞助链接：仓库在 Ishtar-Gate 组织下时，自动用这个仓库的 `.github/FUNDING.yml`，不用做任何事；在其他账号下时，把 `snippets/FUNDING.yml` 复制到那个仓库的 `.github/FUNDING.yml`，并合并到默认分支。
   - 打开仓库的 Sponsorships 开关：每个仓库各自一个开关，上面的默认设置管不到它，新仓库默认是关的。在仓库网页的 Settings → General → Features 里勾上「Sponsorships」，或者运行下面的命令（把 `OWNER` 和 `REPO` 换成仓库的账号名和仓库名）：

     ```bash
     gh api graphql -f query='mutation($id:ID!){updateRepository(input:{repositoryId:$id,hasSponsorshipsEnabled:true}){repository{hasSponsorshipsEnabled}}}' -f id=$(gh api repos/OWNER/REPO --jq .node_id)
     ```
4. **应用或网站里的赞助页**：把 `sponsor.json`、项目用到的 `locales/<语言>.json` 和 `qr/` 里的图片复制进项目，由项目自己的代码读取复制过去的文件，按适合那个页面的方式显示。复制到项目里的哪个位置，按那个项目放静态文件和翻译文件的习惯定。不要在运行时从网上读取：桌面应用要能离线显示。
5. 把这个项目加进下面的「已经用到的项目」，写明用到了哪些内容、复制到了项目里的哪些位置。

## 已经用到的项目

| 项目 | 用到了什么 |
| --- | --- |
| H2H（桌面下载工具，仓库 `Ishtar-Gate/H2H`） | 应用里的「支持作者」页，图片和文字是在接入这里之前复制进去的，位置在 `app/src/app/configs/sponsor.config.ts`、`app/public/sponsor/` 和 `app/public/locales/*/sponsor.json`。需要手动同步 |
| mantyke（Mantine 扩展组件，仓库 `Toshinaki/mantyke`） | README 片段：根目录 `README.md`（en）、`docs/README.zh-CN.md`（zh）、`packages/*/README.md`（en）；`packages/*/package.json` 的 `funding`；`.github/FUNDING.yml`；文档站的赞助页复制了 `sponsor.json`、`locales/en.json` 和 `qr/`，位置在 `apps/docs/sponsor/`。**自动同步**：mantyke 每周一的依赖升级工作流会运行 `.github/scripts/sync-sponsor.mjs`，下载这里的最新内容覆盖上面这些文件，有变化时放进每周的 PR，不用手动跟进 |

## 改了之后要做的事

平时改动只会发生在 `sponsor.json`、`locales/`、`qr/` 和 `build.mjs` 里。

1. **重新生成 Markdown**：改了 `sponsor.json`、`locales/` 或 `build.mjs` 后，在仓库根目录运行下面的命令，再把生成的文件和数据一起提交、推送。只换了二维码图片（文件名不变，用新图覆盖旧图）时不用运行：Markdown 里写的是图片的网址，网址由文件名决定，文件名没变，网址也就不变。

   ```bash
   node sponsor/build.mjs
   ```

2. **改了链接时**：`.github/FUNDING.yml`、`snippets/FUNDING.yml` 和 `snippets/package-json-funding.json` 不是生成的，要手动把旧链接换掉。Ko-fi 或 GitHub Sponsors 的链接变了时，还要重新生成二维码。下面的命令要先进入 `sponsor` 文件夹再运行（`-o` 后面的输出路径从 `sponsor` 文件夹算起；`-w 432` 是图片边长，和现有图片一致）。`npx` 会自动下载 npm 上的 `qrcode` 工具，不用事先安装，第一次运行时会问是否下载，回答 y：

   ```bash
   npx qrcode -w 432 -o qr/kofi.png https://ko-fi.com/新的用户名
   ```

   ```bash
   npx qrcode -w 432 -o qr/github-sponsors.png https://github.com/sponsors/新的账号名
   ```

3. **各项目**：推送后，用完整网址显示图片的地方（组织主页、各项目 README）不用改，GitHub 的图片缓存过几分钟就会显示新图。其余的按「已经用到的项目」表处理：写着自动同步的项目会自己跟上，其他项目要手动把改动复制到表里写的位置。

## 加一种语言

以加韩语（`ko`）为例：

1. 复制 `locales/en.json` 为 `locales/ko.json`，把每个值翻译成韩语，键不要改。
2. 在 `build.mjs` 开头加三处，格式照抄已有的项：
   - `LANGUAGES` 里加 `{ code: 'ko', label: '한국어' }`（`label` 是语言切换里显示的名称）；
   - `SENTENCE_JOINER` 里加 `ko: ' '`（两句话拼成一段时中间放什么：韩语句子之间有空格，所以是一个空格）；
   - `QR_ALT` 里加 `ko: (name) => \`${name} QR 코드\``（二维码图片的替代文字，`name` 是付款方式的名称）。
3. 运行 `node sponsor/build.mjs`。它会生成 `profile/README.ko.md` 和 `snippets/readme-section.ko.md`，并在所有页面的语言切换里加上韩语。
