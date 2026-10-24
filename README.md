# Quark 的学术主页

[![LICENSE](https://img.shields.io/github/license/yaoyao-liu/minimal-light?style=flat-square&logo=creative-commons&color=EF9421)](https://github.com/yaoyao-liu/minimal-light/blob/main/LICENSE)

这是一个基于 [Minimal Light](https://github.com/yaoyao-liu/minimal-light) 深度改造的学术主页，保留了 Jekyll + GitHub Pages 的轻量部署体验，同时补上了项目经历、竞赛获奖、教育卡片、时间轴、毛玻璃 UI、交互增强和模块化配置等能力。

使用此模板 👉 [GlassScholar](https://github.com/lsqkk/GlassScholar)

[![](https://img.130923.xyz/pic/2026/1776271231908-mp7xve.png)](https://lsqkk.github.io/academic-homepage)

## 适合谁？

- 想快速搭建个人学术主页的本科生、研究生与青年研究者
- 还没有正式论文，但也已经有项目、竞赛、博客或工程实践积累的同学
- 希望保留静态站点的轻量部署方式，同时获得更完整视觉和交互体验的人

## 当前版本特性

### 内容结构

- 支持`About Me`、`Technical Skills`、`Education`、`Project Experience`、`Competitions & Awards`、`News`、`Publications`、`Services`，并全部模块化
- 主页主结构集中在 `index.md`，具体内容由 `_data/*.yml` 驱动
- 教育经历、项目、新闻、服务、技能等都支持独立数据维护
- 通过 `_config.yml` 控制模块显示与隐藏
- 项目与奖项在数据文件顶部的 `categories` 中定义分类，条目用 `category` 字段归属，页面按分类渲染为标签页

### UI 与交互

- 项目经历按 Research、Personal Projects、Team & Coursework 分类，标签页切换，类别内按时间倒序
- 竞赛与获奖按 Competitions、Scholarships & Honors 分类，复用同一套标签页交互
- 新闻使用独立风格时间轴，默认展示 6 条，支持展开/收起
- 教育经历使用卡片式展示，并支持整卡点击跳转
- 所有图片支持点击放大弹窗，支持淡入缩放、点击空白关闭、右上角关闭、`Esc` 关闭
- 左侧个人信息栏在桌面端固定显示，浏览长页面时不会跟随滚动离开视野
- 自动深色模式；移动端标签栏可横向滚动，键盘方向键可切换标签

## 简历自动生成

简历不再需要在另一个仓库维护副本。LaTeX 模板、字体和生成脚本位于 [`resume/`](resume/README.md)，
内容直接读取本仓库的 `_config.yml` 与 `_data/*.yml`：

- 修改 `_data/project.yml` 等配置并 push 后，GitHub Actions 会自动重建
  `assets/files/Zhu_Enze_s_Resume_en_.pdf` 并提交回仓库；
- 本地构建：`python resume/scripts/build_resume.py`；
- 项目通过 `resume_rank` 标记进入简历的优先级，数字越小越靠前；
- 所有描述字段都支持 Markdown 行内链接，例如
  `[PaddlePaddle](https://www.paddlepaddle.org.cn/)`，主页与简历会同时渲染。

完整字段说明见 [`resume/README.md`](resume/README.md)。

## 快速部署及使用此模板，请前往 👉 [GlassScholar](https://github.com/lsqkk/GlassScholar)

## 基于的开源项目

本项目建立在以下开源工作的基础上：

- [yaoyao-liu/minimal-light](https://github.com/yaoyao-liu/minimal-light)
- [pages-themes/minimal](https://github.com/pages-themes/minimal)
- [orderedlist/minimal](https://github.com/orderedlist/minimal)
- [al-folio](https://github.com/alshedivat/al-folio)

## 许可证

本项目沿用原主题相关许可证体系，原始主题采用 [Creative Commons Zero v1.0 Universal](https://github.com/yaoyao-liu/minimal-light/blob/master/LICENSE) 许可证。