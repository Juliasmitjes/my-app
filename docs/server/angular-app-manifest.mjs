
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: 'C:/Program Files/Git/my-app/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/Program%20Files/Git/my-app"
  },
  {
    "renderMode": 2,
    "route": "/Program%20Files/Git/my-app/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 7309, hash: 'acfa23dd5536c5dde5c99390b21ef7fd820234cddc736683da078cb520d19848', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 2596, hash: '0d43591d59e26eadbae9482679366dcb1d3988e7304474640c8dbe1c7b30dc0a', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-YPFKNVOV.css': {size: 16632, hash: '4PDCv+RFI38', text: () => import('./assets-chunks/styles-YPFKNVOV_css.mjs').then(m => m.default)}
  },
};
