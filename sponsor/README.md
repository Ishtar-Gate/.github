# 赞助信息

这个文件夹集中存放作者的赞助信息：付款方式、链接、二维码，以及中、英、日三种语言的说明文字。作者的所有项目都以这里为准。要修改赞助信息时只改这里，再按下面的「改了之后要同步的地方」去更新各项目。

用到这些信息的项目都记在下面的「已经用到的项目」里；给新项目加上赞助信息后，也要把它加进那张表。

这个文件夹所在的仓库是 `Ishtar-Gate/.github`。GitHub 对组织下名为 `.github` 的公开仓库有两项特殊处理：

- 仓库里 `.github` 文件夹下的 `FUNDING.yml`（仓库名和文件夹名都叫 `.github`，GitHub 规定这个文件要放在文件夹里，放在仓库根目录不起作用）会自动用到这个组织（Ishtar-Gate）的所有仓库上：只要某个仓库自己没有 `FUNDING.yml`，它的仓库页上就会显示「Sponsor」按钮，点开能看到这里列出的赞助链接。
- `profile/README.md` 会显示在组织主页 https://github.com/Ishtar-Gate 的最上方。这一页就是「赞助页」，上面有全部四种付款方式和二维码；各项目需要放赞助页链接时，都链到这里。GitHub 只会在组织主页上显示这一个文件，不会按访客的语言换成别的文件，所以它只放不用翻译的内容（付款方式的品牌名、二维码、链接），各语言的介绍放在同一文件夹的 `README.<语言>.md` 里，主页顶部有链接通往它们。

## 文件

下表的路径都从仓库根目录（也就是 `sponsor` 文件夹的上一层）算起。文件名里的 `<语言>` 一律用两个字母的语言代码：`en` 英文、`zh` 中文、`ja` 日文。

| 文件 | 内容 |
| --- | --- |
| `.github/FUNDING.yml` | GitHub 仓库页「Sponsor」按钮用的配置，只有两行：`github: Ishtar-Gate`（GitHub Sponsors 账号）和 `ko_fi: ishtar_gate`（Ko-fi 账号） |
| `profile/README.md` | 组织主页上显示的赞助页，只有不用翻译的内容：语言切换链接、四种付款方式（名称写成「微信 / WeChat」这样的中英对照）的二维码和链接、作者网站 |
| `profile/README.<语言>.md` | 各语言的完整介绍，现有 `en` `zh` `ja` 三份：发布者介绍、作者网站、四种付款方式的二维码和一句话说明、其他支持方式 |
| `sponsor/sponsor.json` | 不随语言变的数据：作者网站和组织的 GitHub 地址，以及四种付款方式的 `id`、种类（`link` 是能在浏览器打开的链接，`qr` 是只能扫码的收款码）、链接和二维码路径 |
| `sponsor/locales/<语言>.json` | 随语言变的文字，现有 `en` `zh` `ja` 三份：发布者的名称和介绍、链接的显示文字、付款方式的名称和一句话说明。`methods` 下的键和 `sponsor.json` 里各付款方式的 `id` 一一对应 |
| `sponsor/qr/` | 四张二维码图片。微信、支付宝是收款码，只截了二维码那一块，不带昵称和实名；Ko-fi、GitHub Sponsors 是由它们的链接生成的二维码，链接变了要重新生成，做法见下面「改了之后要同步的地方」 |
| `sponsor/snippets/readme-section.*.md` | 给各项目 README 用的「支持作者」和「作者」两节，`en` `zh` `ja` 各一份。每份第一句话里的 `PROJECT_NAME` 是占位符，用的时候换成项目名 |
| `sponsor/snippets/package-json-funding.json` | 给 npm 包用的 `funding` 字段（用这个包的人运行 `npm fund` 命令时，会列出这里的链接） |
| `sponsor/snippets/FUNDING.yml` | 给不在 Ishtar-Gate 组织下的仓库用（例如 `Toshinaki/mantyke`），内容和 `.github/FUNDING.yml` 相同 |

## 在新项目里加赞助信息

1. **README**：README 是哪种语言，就用同语言的片段：把 `snippets/readme-section.<语言>.md` 的内容复制到 README 末尾、许可证一节之前，把 `PROJECT_NAME` 换成项目名。三份片段的内容有一处不同：英文和日文片段只放 Ko-fi 和 GitHub Sponsors 两个徽章（徽章就是 README 里那种小图标链接），微信、支付宝让读者去赞助页看；中文片段多放了微信和支付宝的二维码。片段里的链接和图片地址都是完整网址，所以放在 npm 包的 README 里也能正常显示。
2. **npm 包**：把 `snippets/package-json-funding.json` 里的 `funding` 字段加到包的 `package.json`。要等这个包下一次发布，npm 上的版本才会带上它。
3. **仓库的 Sponsor 按钮**：按钮要同时满足两个条件才会显示。
   - 有赞助链接：仓库在 Ishtar-Gate 组织下时，自动用这个仓库的 `.github/FUNDING.yml`，不用做任何事；在其他账号下时，把 `snippets/FUNDING.yml` 复制到那个仓库的 `.github/FUNDING.yml`，并合并到默认分支。
   - 打开仓库的 Sponsorships 开关：每个仓库各自一个开关，上面的默认设置管不到它，新仓库默认是关的。在仓库网页的 Settings → General → Features 里勾上「Sponsorships」，或者运行下面的命令（把 `OWNER` 和 `REPO` 换成仓库的账号名和仓库名）：

     ```bash
     gh api graphql -f query='mutation($id:ID!){updateRepository(input:{repositoryId:$id,hasSponsorshipsEnabled:true}){repository{hasSponsorshipsEnabled}}}' -f id=$(gh api repos/OWNER/REPO --jq .node_id)
     ```
4. **应用或网站里的赞助页**：把 `sponsor.json`、项目用到的 `locales/<语言>.json` 和 `qr/` 里的图片复制进项目，由项目自己的代码读取复制过去的文件。复制到项目里的哪个位置，按那个项目放静态文件和翻译文件的习惯定。不要在运行时从网上读取：桌面应用要能离线显示。
5. 把这个项目加进下面的「已经用到的项目」，写明用到了哪些内容、复制到了项目里的哪些位置。以后改了这里，就按这张表逐个项目手动同步。

## 已经用到的项目

| 项目 | 用到了什么 |
| --- | --- |
| H2H（桌面下载工具，仓库 `Ishtar-Gate/H2H`） | 应用里的「支持作者」页，图片和文字是在接入这里之前复制进去的，位置在 `app/src/app/configs/sponsor.config.ts`、`app/public/sponsor/` 和 `app/public/locales/*/sponsor.json` |
| mantyke（Mantine 扩展组件，仓库 `Toshinaki/mantyke`） | README 片段：根目录 `README.md`（en）、`docs/README.zh-CN.md`（zh）、`packages/*/README.md`（en）；`packages/*/package.json` 的 `funding`；`.github/FUNDING.yml`；文档站的赞助页复制了 `sponsor.json`、`locales/en.json` 和 `qr/`，位置在 `apps/docs/sponsor/` |

## 改了之后要同步的地方

平时改动只会发生在 `sponsor.json`、`locales/` 和 `qr/` 里。改完推送到 GitHub 之后：

- **改了二维码图片**：用完整网址显示图片的地方（赞助页、各项目 README）不用改，GitHub 的图片缓存过几分钟就会显示新图。「已经用到的项目」表里写着复制了图片的项目，要把新图片重新复制到表里写的位置。Ko-fi 或 GitHub Sponsors 的链接变了时，在 `sponsor` 文件夹里运行对应的命令重新生成二维码（`-w 432` 是图片边长，和现有图片一致；`-o` 后面是输出文件，从 `sponsor` 文件夹算起）：

  ```bash
  npx qrcode -w 432 -o qr/kofi.png https://ko-fi.com/新的用户名
  ```

  ```bash
  npx qrcode -w 432 -o qr/github-sponsors.png https://github.com/sponsors/新的账号名
  ```

- **改了 `locales/<语言>.json` 里的文字**：同一语言的 `profile/README.<语言>.md` 里有同样的句子，按原句搜索找到后一起改。如果这句话也出现在同一语言的 `snippets/readme-section.<语言>.md` 里，片段和已经用到它的项目也要改。
- **改了 `sponsor.json` 里的链接**：`profile/` 下的所有 README、`.github/FUNDING.yml` 和 `snippets/FUNDING.yml`、`snippets/` 里的 README 片段和 `package-json-funding.json`，以及「已经用到的项目」里每个项目对应的地方，都要搜索旧链接换掉。

## 加一种语言

以加韩语（`ko`）为例：

1. 复制 `locales/en.json` 为 `locales/ko.json`，把每个值翻译成韩语，键不要改。
2. 复制 `profile/README.en.md` 为 `profile/README.ko.md` 并翻译。每个 `profile/README.<语言>.md` 的第一行都是语言切换，例如英文版是 `[← Ishtar Gate](https://github.com/Ishtar-Gate) · **English** · [中文](README.zh.md) · [日本語](README.ja.md)`：当前语言加粗，其他语言是指向同一文件夹里对应文件的链接。在其他每个文件的第一行末尾加上 ` · [한국어](README.ko.md)`；新文件的第一行里，韩语加粗，其他语言写成链接。
3. 在 `profile/README.md` 顶部的语言切换里加上韩语的链接。这里要写完整网址，格式照抄已有的链接，因为组织主页上的相对链接不会指到这个仓库里。
4. 需要时，复制一份 `snippets/readme-section.en.md` 为 `snippets/readme-section.ko.md` 并翻译。

已有语言的文件都不用改，第 2、3 步加的只是链接。
