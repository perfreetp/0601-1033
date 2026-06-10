export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/templates/index',
    'pages/preview/index',
    'pages/profile/index',
    'pages/editor/index',
    'pages/guests/index',
    'pages/collaborate/index',
    'pages/order/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTitleText: '婚礼创意设计',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FAF8F5'
  },
  tabBar: {
    color: '#9E9790',
    selectedColor: '#C9A96E',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/templates/index',
        text: '模板'
      },
      {
        pagePath: 'pages/preview/index',
        text: '预览'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的'
      }
    ]
  }
})
