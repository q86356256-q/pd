// pages/profile/index.js
const app = getApp();

Page({
  data: {
    // 主题
    themeKey: "pink",

    // 用户信息展示
    hasUserInfo: false,
    nickName: "未登录用户",
    avatarUrl: "",

    // 控制安全注册对话框是否显示
    login_show: false,

    // 安全注册对话框配置（modal1）
    modal1: {
      canIUse: wx.canIUse("functional-page-navigator"),
      title: "用户登录",
      content: "授权登录后，可同步微信头像和昵称，用于个性化展示",
      confirmText: "登录",
      cancelText: "暂不",
      confirmStyle: {
        color: "#ffffff",
        backgroundColor: "#1AAD19"
      },
      cancelStyle: {
        color: "#666666",
        backgroundColor: "#FFFFFF"
      }
    },

    // 家庭与统计信息（占位，可以之后接真实数据）
    familyName: "我家拼豆库存",
    familyMembers: 3,
    colorCount: 80,
    inventoryCount: 12540,

    // 版本号
    version: "0.1.0"
  },

  onShow() {
    console.log("[profile] onShow");

    // 1. 同步全局主题（根据你项目里实际字段调整）
    this.setData({
      themeKey: app.globalData.currentThemeKey || "pink"
    });

    // 2. 从本地缓存恢复之前保存过的头像昵称
    try {
      const saved = wx.getStorageSync("demo_userInfo_from_plugin");
      console.log("[profile] load from storage:", saved);
      if (saved && saved.nickName) {
        this.setUserInfo(saved, "[onShow-storage]");
      }
    } catch (e) {
      console.warn("[profile] read storage error", e);
    }
  },

  setUserInfo(userInfo, fromWhere) {
    console.log("[profile] setUserInfo from:", fromWhere, userInfo);

    const nickName = userInfo.nickName || "微信用户";
    const avatarUrl = userInfo.avatarUrl || "";

    this.setData({
      hasUserInfo: true,
      nickName,
      avatarUrl
    });

    // 写入本地，方便下次进入自动恢复
    try {
      wx.setStorageSync("demo_userInfo_from_plugin", {
        nickName,
        avatarUrl
      });
      console.log("[profile] save to storage success");
    } catch (e) {
      console.warn("[profile] save storage error", e);
    }
  },

  // 点击“获取 / 重新获取 微信头像昵称”入口
  onOpenLoginDialog() {
    console.log("[profile] onOpenLoginDialog");
    this.setData({
      login_show: true
    });
  },

  // 登录成功回调 —— 当前安全注册回调结构：res.detail.res
  loginSuccess(res) {
    console.log("[profile] loginSuccess 原始参数:", res);
    this.setData({
      login_show: false
    });

    const info = res.detail && res.detail.res;
    console.log("[profile] parsed userInfo from detail.res:", info);

    if (!info || (!info.avatarUrl && !info.nickName)) {
      wx.showToast({
        title: "未获取到用户信息",
        icon: "none"
      });
      return;
    }

    const userInfo = {
      nickName: info.nickName || "微信用户",
      avatarUrl: info.avatarUrl || ""
    };

    this.setUserInfo(userInfo, "[loginSuccess-detail.res]");

    wx.showToast({
      title: "已获取头像昵称",
      icon: "success"
    });
  },

  // 登录失败回调（有些设备 fail 中也可能带 res，这里兼容一下）
  loginFail(res) {
    console.log("[profile] loginFail 原始参数:", res);
    this.setData({
      login_show: false
    });

    const info = res.detail && res.detail.res;
    console.log("[profile] parsed userInfo from fail.detail.res:", info);

    if (info && (info.nickName || info.avatarUrl)) {
      const userInfo = {
        nickName: info.nickName || "微信用户",
        avatarUrl: info.avatarUrl || ""
      };
      this.setUserInfo(userInfo, "[loginFail-as-success-detail.res]");

      wx.showToast({
        title: "已获取头像昵称",
        icon: "none"
      });
      return;
    }

    wx.showToast({
      title: "获取失败，可稍后重试",
      icon: "none"
    });
  },

  // 用户取消登录回调
  loginCancel(res) {
    console.log("[profile] loginCancel:", res);
    this.setData({
      login_show: false
    });
    wx.showToast({
      title: "已取消授权登录",
      icon: "none"
    });
  },

  // 以下是菜单点击占位逻辑，可按需替换为实际跳转
  onFamilyManage() {
    wx.showToast({
      title: "后续实现家庭管理页面",
      icon: "none"
    });
  },

  onDataExport() {
    wx.showToast({
      title: "后续实现库存数据导出",
      icon: "none"
    });
  },

  goToSettings() {
    wx.navigateTo({
      url: "/pages/settings/index"
    });
  },

  onFeedback() {
    wx.showToast({
      title: "后续可接入客服 / 问卷",
      icon: "none"
    });
  },

  onAbout() {
    wx.showModal({
      title: "关于小程序",
      content:
        "拼豆库存小助手\n用于管理多品牌拼豆库存，支持预警、批量操作等功能。",
      showCancel: false
    });
  }
});