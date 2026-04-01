# 有谱么助手

有谱么助手 是一个为 [yopu.co](https://yopu.co) 网站定制的用户脚本（Userscript），旨在增强网页的查看体验。目前主要功能是为曲谱查看页面添加“全屏”切换功能。

## 🚀 主要功能

- **一键全屏**：在底部控制栏添加全屏按钮，一键进入/退出全屏模式。
- **布局优化**：进入全屏时自动隐藏侧边栏并拉伸曲谱区域，最大化显示面积。
- **屏幕常亮 (Wake Lock)**：进入全屏模式后自动申请屏幕常亮，防止练琴时屏幕自动熄灭（需浏览器支持 Wake Lock API）。
- **智能同步**：支持通过 `Esc` 键退出全屏，并自动恢复页面布局样式及释放常亮锁。
- **状态恢复**：支持页面可见性监听，当从后台切回前台时，若仍处于全屏状态将自动重新申请常亮。
- **稳健加载**：使用 `MutationObserver` 确保在页面异步加载后依然能正确挂载功能。

## 🛠️ 技术栈

- **构建工具**: [Vite](https://vitejs.dev/)
- **开发语言**: [TypeScript](https://www.typescriptlang.org/)
- **插件框架**: [vite-plugin-monkey](https://github.com/lisonge/vite-plugin-monkey) (用于构建油猴脚本)

## 📦 安装

### 方式一：直接安装（推荐）

1. 确保您的浏览器已安装 [Tampermonkey](https://www.tampermonkey.net/) 或其他用户脚本管理器。
2. 点击下方链接进入 GreasyFork 页面进行安装：
   👉 **[安装 有谱么助手](https://greasyfork.org/zh-CN/scripts/571133-%E6%9C%89%E8%B0%B1%E4%B9%88%E5%8A%A9%E6%89%8B)**

### 方式二：通过源码构建

1. 克隆或下载本项目。
2. 运行以下命令进行构建：
   ```bash
   pnpm install
   pnpm build
   ```
3. 构建完成后，在 `dist/` 目录下找到生成的 `.user.js` 文件，将其拖入浏览器安装。

## 👨‍💻 开发

如果您想进行二次开发，请执行：

```bash
# 启动开发服务器
pnpm dev
```

Vite 将会提供一个热更新的开发环境，方便您实时调试。

## 📄 许可证

本项目采用 MIT 许可证。
