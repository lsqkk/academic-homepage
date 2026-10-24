# Academic Homepage

朱恩泽（Quark）的个人学术主页，同时是简历 PDF 的唯一数据源。基于 Jekyll 3.8 +
Minimal Light 深度改造，GitHub Pages 部署，自定义域名为 `aca.130923.xyz`。

## 技术栈

- **主页**：Jekyll 3.8.7 + Liquid + SCSS，无 Node 构建步骤
- **简历**：Python 3 + PyYAML 生成 LaTeX，XeLaTeX 编译（`resume/`）
- **CI**：GitHub Actions，配置变动时自动重建简历 PDF
- **部署**：GitHub Pages（`main` 分支），`CNAME` = `aca.130923.xyz`

## 目录结构

```
_config.yml            站点配置 + resume: 简历生成配置
_data/*.yml            内容唯一来源（profile / education / project / awards / news / publications / services）
_includes/*.md         Liquid 区块模板；rich-text.html 负责把 Markdown 链接渲染为 <a>
_layouts/homepage.html 页面骨架
_sass/homepage.scss    主页样式（含深色模式覆盖在 homepage-dark.scss）
assets/                CSS、JS、图片与生成的简历 PDF
resume/                简历 LaTeX 模板、字体、生成脚本（详见 resume/README.md）
.github/workflows/build-resume.yml  简历自动构建
html_source_file/      旧的静态导出，已被 _config.yml exclude，不参与构建
```

## 构建与运行

```bash
# 主页
bundle exec jekyll serve          # 本地预览 http://127.0.0.1:4000
bundle exec jekyll build          # 输出到 _site/

# 简历（需要 XeLaTeX + PyYAML）
python resume/scripts/build_resume.py
python resume/scripts/build_resume.py --no-compile   # 只生成 resume/main.tex
python -m unittest discover -s resume/scripts -p "test_*.py"
```

Windows 上若 `python` 是 Store 占位符，使用 `python3.11` 或实际解释器路径。

## 关键约定

- **内容只改 `_data/*.yml` 与 `_config.yml`**，不要在两个仓库间复制数据。
- **项目/奖项分类**：`_data/project.yml` 与 `_data/awards.yml` 顶部的 `categories`
  定义标签页顺序与文案，条目用 `category: <key>` 归属。新增条目必须写 `category`，
  否则不会出现在任何标签页中。主页按分类渲染为标签页（`_includes/project.md`、
  `_includes/awards.md` + `assets/js/homepage-ui.js` 的 `data-tab-group`）。
- **描述类字段支持 Markdown 行内链接**（`[label](https://...)`）。主页通过
  `_includes/rich-text.html` 的 `markdownify` 渲染；简历生成器在
  `resume/scripts/build_resume_data.py` 中把链接转成 `\href`。新增字段时沿用
  `{% include rich-text.html text=... %}`，不要直接输出裸文本。
- **简历项目选择**：`project.main[].resume_rank` 数字越小越靠前；只要有任意项目写了
  `resume_rank`，简历只收录这些项目。`resume_hidden: true` 可强制排除。
  `resume_title` / `resume_summary` / `resume_tech` / `resume_bullets` 为简历专用文案。
- **简历奖项**：`resume_title` / `resume_award_description` / `resume_reason` 覆盖主页文案；
  `resume_hidden: true` 让奖项只出现在主页、不参与简历的前 N 条选取。
- **简历为英文单页**：模板字体不含 CJK 字形，中文内容会触发 XeLaTeX "Missing character"。
  简历标题等字段请使用英文（主页字段不受影响）。
- **样式**：颜色、圆角、间距使用 `_sass/homepage.scss` 顶部的 CSS 变量；链接统一走
  `a` 的 accent 色，不要为单个区块硬编码颜色。
- **自动生成**：push 到 `main` 且改动 `_config.yml`、`_data/**`、`resume/**` 或头像时，
  workflow 会编译 PDF、写回 `assets/files/Zhu_Enze_s_Resume_en_.pdf` 并提交。
  该提交只改 PDF，不会再次触发 workflow。
- `resume/main.tex`、`resume/.output/`、`resume/.cache/` 是生成物，已 gitignore。

## 部署

GitHub Pages 直接从 `main` 构建。`_config.yml` 的 `remote_theme` 仅为 GitHub Pages
保留；本地 `_layouts/`、`_includes/`、`_sass/` 会覆盖远程主题。
