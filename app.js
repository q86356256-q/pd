// app.js
App({
  onLaunch() {
    console.log("拼豆库存小程序启动");
  },

  globalData: {
    // 这里不再依赖微信头像昵称，只保留通用 userInfo 占位
    userInfo: null,
    token: null,
    currentFamilyId: null,

    // 后端地址
    apiBaseUrl: "http://127.0.0.1:8000",

    // 品牌列表
    brands: [
      { key: "MARD", name: "MARD" },
      { key: "COCO", name: "COCO" },
      { key: "MANMAN", name: "漫漫" },
      { key: "PANPAN", name: "盼盼" },
      { key: "MIXIAOWO", name: "咪小窝" }
    ],

    // 主题配置
    themes: {
      pink: {
        key: "pink",
        name: "粉粉日系"
      },
      blue: {
        key: "blue",
        name: "清爽海蓝"
      },
      green: {
        key: "green",
        name: "元气森林"
      }
    },

    currentThemeKey: "pink",

    // 全局设置（默认值）
    settings: {
      // 进入库存页默认选中的品牌 key（"ALL" / "MARD" / "COCO" / ...）
      defaultBrandKey: "ALL",

      // 默认预警阈值（粒）
      defaultWarningThreshold: 500,

      // 库存规格：1 包 = 多少颗
      packagePieces: 500,

      // 库存规格：1 克 = 多少颗
      gramPieces: 10,

      // 用户自定义昵称（用于首页欢迎语 & 我的页显示）
      nickname: "拼豆玩家"
    },

    // 设置版本号（供库存页等感知配置变化）
    settingsVersion: 0
  }
});