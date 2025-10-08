
export default {
  basePath: 'https://juliasmitjes.github.io/my-app',
  supportedLocales: {
  "en-US": ""
},
  entryPoints: {
    '': () => import('./main.server.mjs')
  },
};
