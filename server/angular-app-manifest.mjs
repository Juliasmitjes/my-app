
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: 'https://juliasmitjes.github.io/my-app/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/my-app"
  },
  {
    "renderMode": 2,
    "route": "/my-app/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 7319, hash: '7a1073db96a98111780898768980602627cd32dd3b39d058a630c037ad95ec93', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 2606, hash: 'cae4a362630f9c9c20f790a3cb1c7fa2dd87644bf5ca7d124c807c7ae5dd40da', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 20261, hash: '6a345695f3c425e7183fae22f8269d06e3f4269c82ae455f1a2c751d02f36bf2', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-YPFKNVOV.css': {size: 16632, hash: '4PDCv+RFI38', text: () => import('./assets-chunks/styles-YPFKNVOV_css.mjs').then(m => m.default)}
  },
};
