# 简历生成目录

这里的 LaTeX 模板、字体和生成脚本只负责排版。**简历内容的唯一来源是仓库根目录的
`_config.yml` 和 `_data/*.yml`**，不需要再维护一份 `Data/` 副本。

```
_config.yml           # resume: 身份、联系方式、主题色、简历模块开关
_data/profile.yml     # 简介、focus、技能
_data/education.yml   # 教育经历
_data/project.yml     # 项目（resume_rank 决定进入简历的项目）
_data/awards.yml      # 获奖
_data/publications.yml
        │
        ▼
resume/scripts/build_resume_data.py   # 生成 resume/main.tex（请勿手改）
        │
        ▼
XeLaTeX → resume/.output/main.pdf
        │
        ▼
assets/files/Zhu_Enze_s_Resume_en_.pdf
```

## 本地构建

需要 Python 3.9+、PyYAML 和 XeLaTeX（MiKTeX 或 TeX Live）。

```bash
pip install -r resume/requirements.txt
python resume/scripts/build_resume.py
python -m unittest discover -s resume/scripts -p "test_*.py"
```

可选参数：

- `--no-compile`：只重新生成 `resume/main.tex`，不编译。
- `--no-publish`：编译但不覆盖 `assets/files/` 里的 PDF。

Windows 上如果 `python` 指向 Microsoft Store 的占位程序，可使用 `python3.11` 或实际解释器路径。

## 自动构建

`.github/workflows/build-resume.yml` 会在以下路径发生 push 时自动：

1. 读取 `_config.yml` 与 `_data/*.yml` 生成 `resume/main.tex`；
2. 用 XeLaTeX 编译；
3. 把 PDF 复制到 `assets/files/Zhu_Enze_s_Resume_en_.pdf` 并提交回 `main`。

触发路径：`_config.yml`、`_data/**`、`resume/**`、`assets/img/avatar.*`。
也可以在 Actions 页面手动运行 `workflow_dispatch`。

## 简历字段

所有描述类字段都支持 Markdown 行内链接，例如：

```yaml
description: Built with [PaddlePaddle](https://www.paddlepaddle.org.cn/).
```

### 项目

```yaml
- title: 主页/简历共用标题
  resume_title: 简历里更短的标题        # 可选
  resume_rank: 1                        # 数字越小越靠前；有 rank 的项目才会进简历
  resume_summary: 一句话概括             # 可选，默认用 description
  resume_tech: Python, PyTorch          # 可选，简历里显示的精简技术栈
  resume_bullets:                       # 可选，最多 3 条；不写则自动用 description + outcome
    - "第一条"
    - "第二条"
  resume_hidden: true                   # 可选，强制排除
```

`resume_rank` 的排序优先于日期；没有任何项目写 `resume_rank` 时，退化为按日期取最新的
`resume.list_preview_count.projects` 条。

### 教育 / 获奖 / 简介 / 技能

- `education.main[].resume_summary`、`resume_highlights`：简历专用文案；不写则用主页字段。
- `awards.main[].link`：奖项标题的链接；`reason` 支持行内 Markdown 链接。
- `awards.main[].resume_title`、`resume_award_description`、`resume_reason`：简历专用奖项文案。
- `awards.main[].resume_hidden: true`：仍显示在主页，但不进入简历（按日期取前 N 条时会跳过）。
- `profile.about.resume_summary`、`resume_focus`：简历专用简介。
- 技能条目和获奖理由里的链接会同时出现在主页和简历中。

### 显示数量

在 `_config.yml` 的 `resume.list_preview_count` 中设置：

```yaml
resume:
  list_preview_count:
    projects: 5
    awards: 3
    publications: 2
```

## 字体

`Fonts/` 中的 Sabon、Calluna、Cronos、Courier 字体随仓库分发，CI 与本地使用同一套字体。
若字体授权发生变化，请同时更新 `myresume.sty` 中的 `\setmainfont` 配置。

模板字体不含中文字形，简历字段请使用英文（主页字段可以自由使用中文）。如果需要中文简历，
需要额外引入 `xeCJK` 并随仓库提供一款中文字体。
