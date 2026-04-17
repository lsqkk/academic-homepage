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

- 支持`About Me`、`Technical Skills`、`Education`、`Project Experience`、`Competitions & Awards`、`News`、`Publications`、`Services`、`Repository Board`，并全部模块化
- 主页主结构集中在 `index.md`，具体内容由 `_data/*.yml` 驱动
- 教育经历、项目、新闻、服务、技能等都支持独立数据维护
- 通过 `_config.yml` 控制模块显示与隐藏

### UI 与交互

- 项目经历采用倒序时间轴布局，默认展示最近 5 条，支持展开/收起
- 新闻使用独立风格时间轴，与项目区块保持统一但不完全重复
- 教育经历使用卡片式展示，并支持整卡点击跳转
- 竞赛与获奖区统一图片宽度，文本对齐更稳定
- 整页加入鼠标跟随环境光晕与轻微背景渐变
- 毛玻璃卡片采用半透明背景、模糊、内高光和环境光照亮效果
- 所有图片支持点击放大弹窗，支持淡入缩放、点击空白关闭、右上角关闭、`Esc` 关闭
- 左侧个人信息栏在桌面端固定显示，浏览长页面时不会跟随滚动离开视野
- 顶部个人信息区包含循环打字机动画

## 快速部署及使用此模板，请前往 👉 [GlassScholar](https://github.com/lsqkk/GlassScholar)

## 基于的开源项目

本项目建立在以下开源工作的基础上：

- [yaoyao-liu/minimal-light](https://github.com/yaoyao-liu/minimal-light)
- [pages-themes/minimal](https://github.com/pages-themes/minimal)
- [orderedlist/minimal](https://github.com/orderedlist/minimal)
- [al-folio](https://github.com/alshedivat/al-folio)

## 许可证

本项目沿用原主题相关许可证体系，原始主题采用 [Creative Commons Zero v1.0 Universal](https://github.com/yaoyao-liu/minimal-light/blob/master/LICENSE) 许可证。