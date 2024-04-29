import fs from 'fs-extra'
import type { Manifest } from 'webextension-polyfill'
import type PkgType from '../package.json'
import { isDev, isFirefox, port, r } from '../scripts/utils'

export async function getManifest() {
  const pkg = await fs.readJSON(r('package.json')) as typeof PkgType

  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: Manifest.WebExtensionManifest = {
    manifest_version: 3,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    declarative_net_request: {
      rule_resources: [
        {
          id: 'referrer-blbl',
          enabled: true,
          path: './assets/referrer.json',
        },
      ],
    },
    action: {
      default_icon: './assets/icon-512.png',
      default_popup: './dist/popup/index.html',
    },
    options_ui: {
      page: './dist/options/index.html',
      open_in_tab: true,
    },
    background: isFirefox
      ? {
          scripts: ['dist/background/index.mjs'],
          type: 'module',
        }
      : {
          service_worker: './dist/background/index.mjs',
        },
    icons: {
      16: './assets/icon-512.png',
      48: './assets/icon-512.png',
      128: './assets/icon-512.png',
    },
    permissions: [
      'tabs',
      'storage',
      'activeTab',
      'notifications',
      'unlimitedStorage',
      'cookies',
      '*://music.163.com/*',
      '*://*.music.163.com/*',
      '*://*.xiami.com/*',
      '*://*.qq.com/*',
      '*://*.kugou.com/',
      '*://*.kuwo.cn/',
      '*://*.bilibili.com/*',
      '*://*.bilivideo.com/*',
      '*://*.bilivideo.cn/*',
      '*://*.migu.cn/*',
      '*://*.taihe.com/*',
      '*://music.91q.com/*',
      '*://api.github.com/*',
      '*://github.com/*',
      '*://gist.githubusercontent.com/*',
      'webRequest',
      'webRequestBlocking',
      'declarativeNetRequest',
      'declarativeNetRequestFeedback',
    ],
    host_permissions: ['*://*/*'],
    content_scripts: [

    ],
    web_accessible_resources: [
      {
        resources: ['dist/contentScripts/style.css'],
        matches: ['<all_urls>'],
      },
    ],
    content_security_policy: {
      extension_pages: isDev
        // this is required on dev for Vite script to load
        ? `script-src \'self\' http://localhost:${port}; object-src \'self\'`
        : 'script-src \'self\'; object-src \'self\'',
    },
  }

  // FIXME: not work in MV3
  if (isDev && false) {
    // for content script, as browsers will cache them for each reload,
    // we use a background script to always inject the latest version
    // see src/background/contentScriptHMR.ts
    delete manifest.content_scripts
    manifest.permissions?.push('webNavigation')
  }

  return manifest
}
