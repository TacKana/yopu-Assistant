/**
 * Yopu Assistant - Fullscreen Toggle
 * 整理后的代码：模块化结构、增强的元素获取机制、更清晰的逻辑。
 */

// 配置与选择器
const SELECTORS = {
  BUTTON_CONTAINER: '#c > div > div.layout.no-print.svelte-bbufvt.nier > div.main.svelte-bbufvt > div.panel.svelte-uqhx9v > div.player-panel.svelte-uqhx9v > div.buttons.svelte-uqhx9v',
  SIDE_BAR: '#c > div > div.layout.no-print.svelte-bbufvt.nier > div.side.svelte-bbufvt',
  PAGE_LAYOUT: '#c > div > div.layout.no-print.svelte-bbufvt.nier',
};

// 状态管理
const state = {
  isFullscreen: false,
};

/**
 * 等待元素出现的工具函数
 */
function waitForElement(selector: string, timeout = 10000): Promise<HTMLElement | null> {
  return new Promise((resolve) => {
    const element = document.querySelector<HTMLElement>(selector);
    if (element) return resolve(element);

    const observer = new MutationObserver(() => {
      const el = document.querySelector<HTMLElement>(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeout);
  });
}

/**
 * 切换全屏逻辑
 */
function toggleFullscreen() {
  const sideBar = document.querySelector<HTMLElement>(SELECTORS.SIDE_BAR);
  const pageLayout = document.querySelector<HTMLElement>(SELECTORS.PAGE_LAYOUT);

  if (!sideBar || !pageLayout) {
    console.warn('[Yopu-Assistant] 找不到必要的 DOM 元素进行全屏切换');
    return;
  }

  if (state.isFullscreen) {
    // 退出全屏
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.error('退出全屏失败:', err));
    }
    state.isFullscreen = false;
    sideBar.style.display = "";
    pageLayout.style.width = "";
  } else {
    // 进入全屏
    document.documentElement.requestFullscreen().catch(err => console.error('进入全屏失败:', err));
    state.isFullscreen = true;
    sideBar.style.display = "none";
    pageLayout.style.width = "100vw";
  }
}

/**
 * 初始化插件
 */
async function init() {
  console.log('[Yopu-Assistant] 正在寻找底部控制栏...');

  const bottomContainer = await waitForElement(SELECTORS.BUTTON_CONTAINER);

  if (!bottomContainer) {
    console.error('[Yopu-Assistant] 未能获取到底部栏，停止运行');
    return;
  }

  console.log('[Yopu-Assistant] 获取底部栏成功，正在添加全屏按钮');

  const fullscreenButton = document.createElement("button");
  fullscreenButton.textContent = "全屏";
  fullscreenButton.className = "yopu-fullscreen-btn"; // 方便后续通过 CSS 美化

  // 基础样式（可选：也可以在外部注入 CSS）
  Object.assign(fullscreenButton.style, {
    padding: '4px 8px',
    cursor: 'pointer',
    marginLeft: '10px'
  });

  fullscreenButton.addEventListener("click", toggleFullscreen);
  bottomContainer.appendChild(fullscreenButton);

  // 监听全屏状态变化（处理用户通过 Esc 键退出全屏的情况）
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && state.isFullscreen) {
      // 如果不是通过我们的按钮退出（比如 Esc），则恢复样式
      state.isFullscreen = false;
      const sideBar = document.querySelector<HTMLElement>(SELECTORS.SIDE_BAR);
      const pageLayout = document.querySelector<HTMLElement>(SELECTORS.PAGE_LAYOUT);
      if (sideBar) sideBar.style.display = "";
      if (pageLayout) pageLayout.style.width = "";
    }
  });
}

// 启动
init();