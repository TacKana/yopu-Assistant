/**
 * Yopu Assistant - Fullscreen Toggle
 * 修复后的代码：正确处理 Wake Lock API
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
  wakeLockSentinel: null as WakeLockSentinel | null,
  isWakeLockSupported: false,
};

/**
 * 检查并初始化 Wake Lock API
 */
function initWakeLock() {
  // 检查浏览器是否支持
  if ('wakeLock' in navigator) {
    state.isWakeLockSupported = true;
    console.log('[Yopu-Assistant] ✅ 浏览器支持 Wake Lock API');

    // 检查是否为安全上下文
    if (!window.isSecureContext) {
      console.warn('[Yopu-Assistant] ⚠️ 当前不是安全上下文(HTTPS)，唤醒锁可能无法使用');
      state.isWakeLockSupported = false;
    }
  } else {
    console.warn('[Yopu-Assistant] ❌ 当前浏览器不支持 Wake Lock API');
    state.isWakeLockSupported = false;
  }
}

/**
 * 请求唤醒锁
 */
async function requestWakeLock() {
  if (!state.isWakeLockSupported) {
    console.log('[Yopu-Assistant] 唤醒锁不可用，跳过请求');
    return false;
  }

  // 如果已经有唤醒锁，直接返回
  if (state.wakeLockSentinel) {
    console.log('[Yopu-Assistant] 唤醒锁已存在');
    return true;
  }

  try {
    console.log('[Yopu-Assistant] 正在请求唤醒锁...');
    const sentinel = await navigator.wakeLock.request('screen');

    state.wakeLockSentinel = sentinel;

    // 监听唤醒锁释放事件
    sentinel.addEventListener('release', () => {
      console.log('[Yopu-Assistant] 唤醒锁已被释放');
      state.wakeLockSentinel = null;
    });

    console.log('[Yopu-Assistant] ✅ 唤醒锁获取成功');
    return true;
  } catch (err) {
    console.error('[Yopu-Assistant] ❌ 获取唤醒锁失败:', err);

    // 常见错误处理
    if (err instanceof Error) {
      if (err.name === 'NotAllowedError') {
        console.warn('[Yopu-Assistant] 用户拒绝了唤醒锁请求');
      } else if (err.name === 'NotSupportedError') {
        console.warn('[Yopu-Assistant] 当前系统不支持唤醒锁');
      } else if (err.name === 'SecurityError') {
        console.warn('[Yopu-Assistant] 安全错误，请确保页面使用 HTTPS');
      }
    }

    return false;
  }
}

/**
 * 释放唤醒锁
 */
async function releaseWakeLock() {
  if (!state.wakeLockSentinel) {
    console.log('[Yopu-Assistant] 没有活跃的唤醒锁需要释放');
    return true;
  }

  try {
    console.log('[Yopu-Assistant] 正在释放唤醒锁...');
    await state.wakeLockSentinel.release();
    state.wakeLockSentinel = null;
    console.log('[Yopu-Assistant] ✅ 唤醒锁释放成功');
    return true;
  } catch (err) {
    console.error('[Yopu-Assistant] ❌ 释放唤醒锁失败:', err);
    return false;
  }
}

/**
 * 切换唤醒锁（根据全屏状态）
 */
async function toggleWakeLock() {
  console.log('[Yopu-Assistant] 切换唤醒锁，当前全屏状态:', state.isFullscreen);

  if (state.isFullscreen) {
    // 全屏模式：请求唤醒锁
    await requestWakeLock();
  } else {
    // 非全屏模式：释放唤醒锁
    await releaseWakeLock();
  }
}

/**
 * 处理页面可见性变化（重要：防止唤醒锁丢失）
 */
function handleVisibilityChange() {
  // 当页面从后台切回前台，且处于全屏状态时，重新请求唤醒锁
  if (document.visibilityState === 'visible' && state.isFullscreen && !state.wakeLockSentinel) {
    console.log('[Yopu-Assistant] 页面重新可见且处于全屏状态，重新请求唤醒锁');
    requestWakeLock();
  }
}

/**
 * 切换全屏逻辑
 */
async function toggleFullscreen() {
  const sideBar = document.querySelector<HTMLElement>(SELECTORS.SIDE_BAR);
  const pageLayout = document.querySelector<HTMLElement>(SELECTORS.PAGE_LAYOUT);

  if (!sideBar || !pageLayout) {
    console.warn('[Yopu-Assistant] 找不到必要的 DOM 元素进行全屏切换');
    return;
  }

  if (state.isFullscreen) {
    // 退出全屏
    console.log('[Yopu-Assistant] 退出全屏模式');

    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
        console.log('[Yopu-Assistant] 退出全屏成功');
      } catch (err) {
        console.error('[Yopu-Assistant] 退出全屏失败:', err);
      }
    }

    state.isFullscreen = false;
    sideBar.style.display = "";
    pageLayout.style.width = "";

    // 释放唤醒锁
    await toggleWakeLock();
  } else {
    // 进入全屏
    console.log('[Yopu-Assistant] 进入全屏模式');

    try {
      await document.documentElement.requestFullscreen();
      console.log('[Yopu-Assistant] 进入全屏成功');
    } catch (err) {
      console.error('[Yopu-Assistant] 进入全屏失败:', err);
    }

    state.isFullscreen = true;
    sideBar.style.display = "none";
    pageLayout.style.width = "100vw";

    // 请求唤醒锁
    await toggleWakeLock();
  }
}

/**
 * 监听全屏状态变化（处理用户通过 Esc 或其他方式退出）
 */
function handleFullscreenChange() {
  const isCurrentlyFullscreen = !!document.fullscreenElement;

  // 如果状态不一致，同步状态
  if (isCurrentlyFullscreen !== state.isFullscreen) {
    console.log('[Yopu-Assistant] 检测到全屏状态变化（可能是按 Esc），同步状态');

    const sideBar = document.querySelector<HTMLElement>(SELECTORS.SIDE_BAR);
    const pageLayout = document.querySelector<HTMLElement>(SELECTORS.PAGE_LAYOUT);

    if (isCurrentlyFullscreen) {
      // 用户进入了全屏（例如通过浏览器菜单）
      state.isFullscreen = true;
      if (sideBar) sideBar.style.display = "none";
      if (pageLayout) pageLayout.style.width = "100vw";
      requestWakeLock(); // 请求唤醒锁
    } else {
      // 用户退出了全屏
      state.isFullscreen = false;
      if (sideBar) sideBar.style.display = "";
      if (pageLayout) pageLayout.style.width = "";
      releaseWakeLock(); // 释放唤醒锁
    }
  }
}

/**
 * 添加全屏按钮
 */
function addFullscreenButton(container: HTMLElement) {
  const fullscreenButton = document.createElement("button");
  fullscreenButton.textContent = "全屏";
  fullscreenButton.className = "yopu-fullscreen-btn";

  // 添加样式
  Object.assign(fullscreenButton.style, {
    padding: '4px 8px',
    cursor: 'pointer',
    marginLeft: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px'
  });

  fullscreenButton.addEventListener("click", toggleFullscreen);
  container.appendChild(fullscreenButton);

  console.log('[Yopu-Assistant] 全屏按钮已添加');

  return fullscreenButton;
}

/**
 * 显示不支持提示（可选）
 */
function showUnsupportedNotice() {
  const notice = document.createElement('div');
  notice.textContent = '⚠️ 当前浏览器不支持屏幕常亮功能';
  Object.assign(notice.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    background: '#ff9800',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    zIndex: '9999',
    fontFamily: 'sans-serif'
  });
  document.body.appendChild(notice);

  // 5秒后自动消失
  setTimeout(() => {
    notice.style.opacity = '0';
    setTimeout(() => notice.remove(), 300);
  }, 5000);
}

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
 * 初始化插件
 */
async function init() {
  console.log('[Yopu-Assistant] 开始初始化...');

  // 1. 初始化 Wake Lock API
  initWakeLock();

  // 2. 添加全屏变化监听
  document.addEventListener('fullscreenchange', handleFullscreenChange);

  // 3. 添加页面可见性监听（防止唤醒锁丢失）
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // 4. 等待底部控制栏出现
  console.log('[Yopu-Assistant] 正在寻找底部控制栏...');
  const bottomContainer = await waitForElement(SELECTORS.BUTTON_CONTAINER);

  if (!bottomContainer) {
    console.error('[Yopu-Assistant] ❌ 未能获取到底部栏，停止运行');
    return;
  }

  console.log('[Yopu-Assistant] ✅ 获取底部栏成功');

  // 5. 添加全屏按钮
  addFullscreenButton(bottomContainer);

  // 6. 如果不支持唤醒锁，显示提示（可选）
  if (!state.isWakeLockSupported) {
    showUnsupportedNotice();
  }

  console.log('[Yopu-Assistant] 初始化完成');
}

// 启动
init().catch(err => {
  console.error('[Yopu-Assistant] 初始化失败:', err);
});