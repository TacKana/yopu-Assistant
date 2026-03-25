# Yopu Assistant

Yopu Assistant 是一个为 [yopu.co](https://yopu.co) 网站定制的用户脚本（Userscript），旨在增强网页的查看体验。目前主要功能是为曲谱查看页面添加“全屏”切换功能。

## 🚀 主要功能

- **一键全屏**：在底部控制栏添加全屏按钮，一键进入/退出全屏模式。
- **布局优化**：进入全屏时自动隐藏侧边栏并拉伸曲谱区域，最大化显示面积。
- **智能同步**：支持通过 `Esc` 键退出全屏，并自动恢复页面布局样式。
- **稳健加载**：使用 `MutationObserver` 确保在页面异步加载后依然能正确挂载功能。

## 🛠️ 技术栈

- **构建工具**: [Vite](https://vitejs.dev/)
- **开发语言**: [TypeScript](https://www.typescriptlang.org/)
- **插件框架**: [vite-plugin-monkey](https://github.com/lisonge/vite-plugin-monkey) (用于构建油猴脚本)

## 📦 安装

1.  确保您的浏览器已安装 [Tampermonkey](https://www.tampermonkey.net/) 或其他用户脚本管理器。
2.  克隆或下载本项目。
3.  运行以下命令进行构建：
    ```bash
    pnpm install
    pnpm build
    ```
4.  构建完成后，在 `dist/` 目录下找到生成的 `.user.js` 文件，将其拖入浏览器安装。

## 👨‍💻 开发

如果您想进行二次开发，请执行：

```bash
# 启动开发服务器
pnpm dev
```

Vite 将会提供一个热更新的开发环境，方便您实时调试。

## 📄 许可证

本项目采用 MIT 许可证。
