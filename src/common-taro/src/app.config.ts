export default defineAppConfig({
  pages: [
    'modules/article/pages/list',
    'modules/article/pages/detail',
    'modules/article/pages/edit',
    'modules/my/pages/userSummary',
    'modules/stage/pages/login',
  ],
  subPackages: [
    {
      root: 'modules/shop',
      pages: ['pages/goodsList'],
    },
  ],
  tabBar: {
    list: [
      {
        pagePath: 'modules/article/pages/list',
        text: '文章',
      },
      {
        pagePath: 'modules/my/pages/userSummary',
        text: '我的',
      },
    ],
  },
  window: {
    navigationStyle: 'custom',
  },
});
