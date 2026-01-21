// pages/home/index.js
const app = getApp();

Page({
  data: {
    themeKey: "pink",
    themeDisplayName: "粉粉日系",

    // 来自设置的昵称
    nickname: "拼豆玩家",

    currentFamilyName: "默认家庭",
    summary: {
      totalColors: 0,
      totalQuantity: 0,
      lowWarningCount: 0
    },
    recentChanges: []
  },

  onLoad() {
    this.loadMockData();
  },

  onShow() {
    const themeKey = app.globalData.currentThemeKey || "pink";
    const themes = app.globalData.themes || {};
    const theme = themes[themeKey] || themes["pink"];

    const settings = app.globalData.settings || {};

    this.setData({
      themeKey,
      themeDisplayName: theme ? theme.name : "粉粉日系",
      nickname: settings.nickname || "拼豆玩家"
    });
  },

  // 点击右上角主题标签：切换主题（粉 -> 蓝 -> 绿 -> 粉）
  switchTheme() {
    const order = ["pink", "blue", "green"];
    const current = app.globalData.currentThemeKey || "pink";
    const idx = order.indexOf(current);
    const next = order[(idx + 1) % order.length];

    app.globalData.currentThemeKey = next;

    const themes = app.globalData.themes || {};
    const theme = themes[next] || themes["pink"];

    this.setData({
      themeKey: next,
      themeDisplayName: theme ? theme.name : "粉粉日系"
    });

    wx.showToast({
      title: theme ? `今天是：${theme.name}` : "主题已切换",
      icon: "none"
    });
  },

  loadMockData() {
    this.setData({
      currentFamilyName: "我家拼豆库存",
      summary: {
        totalColors: 80,
        totalQuantity: 12540,
        lowWarningCount: 5
      },
      recentChanges: [
        {
          id: 1,
          brand: "MARD",
          code: "001",
          change: 200,
          reason: "购入",
          time: "2026-01-15 20:30"
        },
        {
          id: 2,
          brand: "COCO",
          code: "A01",
          change: -80,
          reason: "制作作品《小猫》",
          time: "2026-01-15 19:10"
        },
        {
          id: 3,
          brand: "MANMAN",
          code: "MM-10",
          change: -50,
          reason: "制作作品《星空》",
          time: "2026-01-14 22:05"
        }
      ]
    });
  },

  goToInventory() {
    wx.switchTab({
      url: "/pages/inventory/index"
    });
  },

  goToQuickIn() {
    wx.showToast({
      title: "后续实现快速入库页面",
      icon: "none"
    });
  },

  goToQuickOut() {
    wx.showToast({
      title: "后续实现快速出库页面",
      icon: "none"
    });
  },

  goToOverview() {
    wx.switchTab({
      url: "/pages/overview/index"
    });
  },

  goToInventoryRecord() {
    wx.showToast({
      title: "后续实现记录列表页",
      icon: "none"
    });
  }
});