// pages/settings/index.js
const app = getApp();

Page({
  data: {
    themeKey: "pink",

    // 品牌与默认品牌
    brandOptions: [],          // ALL + brands
    defaultBrandKey: "ALL",
    defaultBrandName: "全部品牌",
    defaultBrandIndex: 0,

    // 库存设置
    defaultWarningThreshold: 500,
    packagePieces: 500,
    gramPieces: 10
  },

  onLoad() {
    const global = app.globalData || {};
    const brands = global.brands || [];
    const settings = global.settings || {};

    // 组装品牌选项（含 ALL）
    const brandOptions = [{ key: "ALL", name: "全部品牌" }].concat(brands);

    const defaultBrandKey = settings.defaultBrandKey || "ALL";
    let defaultBrandIndex = 0;
    const foundIndex = brandOptions.findIndex((b) => b.key === defaultBrandKey);
    if (foundIndex >= 0) {
      defaultBrandIndex = foundIndex;
    }

    const defaultBrandName = brandOptions[defaultBrandIndex].name;

    this.setData({
      brandOptions,
      defaultBrandKey,
      defaultBrandName,
      defaultBrandIndex,
      defaultWarningThreshold: settings.defaultWarningThreshold || 500,
      packagePieces: settings.packagePieces || 500,
      gramPieces: settings.gramPieces || 10
    });
  },

  onShow() {
    this.setData({
      themeKey: app.globalData.currentThemeKey || "pink"
    });
  },

  // 修改默认品牌
  onDefaultBrandChange(e) {
    const index = Number(e.detail.value);
    const option = this.data.brandOptions[index];
    if (!option) return;

    this.setData({
      defaultBrandKey: option.key,
      defaultBrandName: option.name,
      defaultBrandIndex: index
    });

    if (!app.globalData.settings) {
      app.globalData.settings = {};
    }
    app.globalData.settings.defaultBrandKey = option.key;
    app.globalData.settingsVersion = (app.globalData.settingsVersion || 0) + 1;

    wx.showToast({
      title: "默认品牌已更新",
      icon: "none"
    });
  },

  // 修改预警阈值
  onWarningThresholdInput(e) {
    const value = e.detail.value;
    const num = Number(value) || 0;

    this.setData({
      defaultWarningThreshold: num
    });

    if (!app.globalData.settings) {
      app.globalData.settings = {};
    }
    app.globalData.settings.defaultWarningThreshold = num;
    app.globalData.settingsVersion = (app.globalData.settingsVersion || 0) + 1;
  },

  // 修改包规格
  onPackagePiecesInput(e) {
    const value = e.detail.value;
    const num = Number(value) || 0;

    this.setData({
      packagePieces: num
    });

    if (!app.globalData.settings) {
      app.globalData.settings = {};
    }
    app.globalData.settings.packagePieces = num;
    app.globalData.settingsVersion = (app.globalData.settingsVersion || 0) + 1;
  },

  // 修改克规格
  onGramPiecesInput(e) {
    const value = e.detail.value;
    const num = Number(value) || 0;

    this.setData({
      gramPieces: num
    });

    if (!app.globalData.settings) {
      app.globalData.settings = {};
    }
    app.globalData.settings.gramPieces = num;
    app.globalData.settingsVersion = (app.globalData.settingsVersion || 0) + 1;
  }
});