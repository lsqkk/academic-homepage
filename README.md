# Quark 学术主页

[![LICENSE](https://img.shields.io/github/license/yaoyao-liu/minimal-light?style=flat-square&logo=creative-commons&color=EF9421)](https://github.com/yaoyao-liu/minimal-light/blob/main/LICENSE)

这是一个基于 [Minimal Light](https://github.com/yaoyao-liu/minimal-light) 深度改造的学术主页，定位为更现代、数据驱动、适合本科生到研究人员的个人主页方案。它保留了 Jekyll + GitHub Pages 的轻量部署体验，同时补上了项目经历、竞赛获奖、教育卡片、时间轴、毛玻璃 UI、交互增强和模块化配置等能力。

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

### 开源与仓库展示

- 页尾可通过 GitHub API 动态拉取仓库看板
- 默认展示 `lsqkk/academic-homepage` 的仓库描述、Stars、Forks、Issues、Watchers、默认分支、最近更新时间和仓库跳转链接
- 明确标注该模板是基于开源 Minimal Light 主题的深度改造版本

### 工程与部署

- 保持 Jekyll / GitHub Pages 静态部署方案
- 自动适应浅色 / 深色模式
- 保留 SEO 基础配置、社交链接、头像、favicon、自定义字体等能力
- 支持本地 `bundle exec jekyll serve --livereload` 预览

## 项目结构

```
.
├── _config.yml                 # 站点配置、模块显示控制、仓库看板配置
├── _data
│   ├── awards.yml              # 获奖数据
│   ├── education.yml           # 教育经历数据
│   ├── news.yml                # 新闻/动态数据
│   ├── profile.yml             # About 与 Skills 数据
│   ├── project.yml             # 项目经历数据
│   ├── publications.yml        # 论文数据
│   └── services.yml            # 服务/审稿数据
├── _includes
│   ├── about.md
│   ├── awards.md
│   ├── education.md
│   ├── news.md
│   ├── project.md
│   ├── publications.md
│   ├── repo-board.md
│   ├── services.md
│   ├── services-section.md
│   └── skills.md
├── _layouts
│   └── homepage.html           # 主页布局模板
├── _sass
│   ├── minimal-light.scss
│   └── minimal-light-no-dark-mode.scss
├── assets
│   ├── css
│   │   ├── style.scss
│   │   └── style-no-dark-mode.scss
│   ├── img
│   ├── files
│   └── js
│       └── homepage-ui.js      # 展开收起、光晕、打字机、图片弹窗、GitHub API 看板
└── index.md                    # 主页模块入口
```

## 快速开始

### 方式一：直接 Fork

1. Fork 本仓库到你的 GitHub 账号
2. 将仓库名改为 `你的用户名.github.io`，或按你的 Pages 方案命名
3. 在 GitHub Pages 中启用部署
4. 修改 `_config.yml` 与 `_data/*.yml` 中的内容

### 方式二：本地预览后再部署

安装 Ruby 后，在项目目录执行：

```bash
bundle install
bundle exec jekyll serve --livereload
```

浏览器访问：

```text
http://127.0.0.1:4000/
```

如果只想生成静态文件：

```bash
bundle exec jekyll build
```

更多细节和疑难排查，可参阅原版 [Minimal Light](https://github.com/yaoyao-liu/minimal-light) 主题文档。

## 如何编辑内容

### 个人信息与技能

编辑：

- `_config.yml`
- `_data/profile.yml`

其中：

- `_config.yml` 控制姓名、学校、头像、邮箱、社交链接、模块显示开关
- `_data/profile.yml` 控制 `About Me` 与 `Technical Skills`

### 教育经历

编辑 `_data/education.yml`，支持字段：

- `school`
- `program`
- `period`
- `start_date`
- `focus`
- `summary`
- `link`
- `highlights`

### 项目经历

编辑 `_data/project.yml`，支持：

- 更具体的 `date`
- 项目标题、描述、技术栈、结果、图片、跳转链接

项目区会自动按日期倒序显示。

### 新闻动态

编辑 `_data/news.yml`，按日期维护即可。

### 获奖经历

编辑 `_data/awards.yml`。

### 论文与服务

编辑：

- `_data/publications.yml`
- `_data/services.yml`

这两个模块在当前版本默认是隐藏的，如需启用，只需修改 `_config.yml` 中的开关。

## 模块显示控制

当前推荐通过 `_config.yml` 统一控制各模块显示状态：

```yaml
section_visibility:
  about: true
  education: true
  projects: true
  awards: true
  publications: false
  services: false
  skills: true
  news: true
  repo_board: true
```

## 仓库看板配置

页尾 GitHub API 仓库看板也通过 `_config.yml` 配置：

```yaml
repo_board:
  owner: lsqkk
  name: academic-homepage
  url: https://github.com/lsqkk/academic-homepage
```

你可以替换成自己的仓库地址，让页面自动展示你的项目仓库数据。

## 基于的开源项目

本项目建立在以下开源工作的基础上：

- [yaoyao-liu/minimal-light](https://github.com/yaoyao-liu/minimal-light)
- [pages-themes/minimal](https://github.com/pages-themes/minimal)
- [orderedlist/minimal](https://github.com/orderedlist/minimal)
- [al-folio](https://github.com/alshedivat/al-folio)

## 许可证

本项目沿用原主题相关许可证体系，原始主题采用 [Creative Commons Zero v1.0 Universal](https://github.com/yaoyao-liu/minimal-light/blob/master/LICENSE) 许可证。

## 致谢

如果这个模板对你有帮助，欢迎 Star、Fork，或继续按自己的方向深度改造。它很适合作为一个轻量但不简陋的学术主页起点。
