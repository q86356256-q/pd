// pages/overview/index.js
const app = getApp();

Page({
  data: {
    themeKey: "pink",

    familyName: "我家拼豆库存",
    memberCount: 3,
    overview: {
      totalColors: 32,
      totalQuantity: 12540,
      lowWarningCount: 5
    },
    topColors: [],
    purchaseSummary: {
      recentIn: 0,
      recentOut: 0
    }
  },

  onLoad() {
    this.loadMockData();
  },

  onShow() {
    this.setData({
      themeKey: app.globalData.currentThemeKey || "pink"
    });
  },

  loadMockData() {
    this.setData({
      familyName: "我家拼豆库存",
      memberCount: 3,
      overview: {
        totalColors: 32,
        totalQuantity: 12540,
        lowWarningCount: 5
      },
      topColors: [
        {
          id: 1,
          brand: "MARD",
          code: "001",
          name: "纯白",
          colorHex: "#ffffff",
          used: 3020
        },
        {
          id: 2,
          brand: "COCO",
          code: "A01",
          name: "纯黑",
          colorHex: "#000000",
          used: 2650
        },
        {
          id: 3,
          brand: "MANMAN",
          code: "MM-10",
          name: "浅蓝",
          colorHex: "#7ec0ee",
          used: 1830
        }
      ],
      purchaseSummary: {
        recentIn: 4200,
        recentOut: 3500
      }
    });
  }
});