# 我的学术主页（基于 Minimal Light 修改版）

[![LICENSE](https://img.shields.io/github/license/yaoyao-liu/minimal-light?style=flat-square&logo=creative-commons&color=EF9421)](https://github.com/yaoyao-liu/minimal-light/blob/main/LICENSE)

\[[Demo the theme](https://minimal-light-theme.yliu.me/)\]  \[[原模板Readme(英文)](README_en.md)]

本项目是一个基于 [Minimal Light](https://github.com/yaoyao-liu/minimal-light) 主题修改的学术个人主页模板，适用于本科生、研究生或研究人员展示个人信息、项目经历、竞赛获奖等内容。

## 主要改动与特色

在原版 Minimal Light 主题的基础上，我进行了以下调整，使其更适合**尚未发表论文但拥有项目实践或竞赛经历的本科新生**：

- ✅ 新增 **Project Experience** 模块，用于展示个人或团队项目
- ✅ 新增 **Competitions & Awards** 模块，用于展示竞赛成果与获奖情况
- ✅ 保持原主题的简洁风格，适配学术与项目展示的双重需求
- ✅ 兼容原主题所有功能（自动暗黑模式、移动端适配、SEO 优化等）

## 快速使用

### 方式一：Fork 本仓库

1. 点击右上角 **Fork** 按钮，复制本仓库到你的 GitHub 账户
2. 将仓库重命名为 `你的用户名.github.io`
3. 在仓库设置中启用 GitHub Pages 服务
4. 修改 `_config.yml` 和 `index.md` 中的内容即可使用

### 方式二：作为远程主题使用

在你的仓库中添加 `_config.yml`，内容如下：

```yaml
remote_theme: 你的用户名/minimal-light-modified
```

> 注：若你 Fork 后修改了仓库名，请将上述地址替换为你的仓库地址。

## 配置说明

配置文件 `_config.yml` 中支持以下自定义字段（在原版基础上未作修改，可直接沿用）：

```yaml
title: 你的姓名
position: 本科生/研究生等
affiliation: 学校或单位
email: yourname@example.edu
avatar: ./assets/img/avatar.png
# 更多配置请参考原版 Minimal Light 文档
```

## 内容编辑

主页内容主要通过 `index.md`和`_includes`文件夹中的`.md`文件编写，支持 Markdown 语法。

`publications`和`services`目前尚未插入到`index.md`中，如需插入可直接复制`index-2.md`两行。

## 样式自定义

如需修改样式，可创建 `/assets/css/style.scss` 并导入原主题后添加自定义规则：

```scss
@import "{{ site.theme }}";

/* 你的自定义 CSS */
```

如需修改 HTML 结构，可复制 `_layouts/homepage.html` 到你的项目中进行修改。

## 许可证

本项目基于 [Creative Commons Zero v1.0 Universal](https://github.com/yaoyao-liu/minimal-light/blob/master/LICENSE) 许可证开源。
你可以在遵守原许可证的前提下自由使用、修改和分发。

## 致谢

本项目基于以下开源项目构建，特此致谢：

- [yaoyao-liu/minimal-light](https://github.com/yaoyao-liu/minimal-light)
- [pages-themes/minimal](https://github.com/pages-themes/minimal)
- [orderedlist/minimal](https://github.com/orderedlist/minimal)
- [al-folio](https://github.com/alshedivat/al-folio)

如果你觉得这个修改版对你有帮助，欢迎 **Star ⭐ 本仓库**，也欢迎提交 Issue 或 Pull Request 帮助改进。

---

> 本项目为个人学术主页模板，旨在帮助初学者快速搭建展示个人项目与竞赛经历的主页。如有建议或问题，欢迎通过 GitHub Issues 反馈。
