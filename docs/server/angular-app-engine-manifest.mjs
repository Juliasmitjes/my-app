
export default {
  basePath: 'C:/Program Files/Git/my-app',
  supportedLocales: {
  "en-US": ""
},
  entryPoints: {
    '': () => import('./main.server.mjs')
  },
};
