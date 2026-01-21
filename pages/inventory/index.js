// pages/inventory/index.js
const app = getApp();

Page({
  data: {
    themeKey: "pink",

    keyword: "",
    brandOptions: [
      { key: "MARD", name: "MARD" },
      { key: "COCO", name: "COCO" },
      { key: "MANMAN", name: "漫漫" },
      { key: "PANPAN", name: "盼盼" },
      { key: "MIXIAOWO", name: "咪小窝" }
    ],
    currentBrand: "ALL",

    inventoryList: [],
    filteredInventory: [],

    mode: "normal",
    batchType: "in",
    selectedCount: 0,

    showSingleModal: false,
    singleModalType: "in",
    singleModalQuantity: "",
    singleModalReason: "",
    singleQuantityUnit: "pieces", // 'pieces' | 'package' | 'gram'
    currentItem: {},

    settings: {
      packagePieces: 500,
      gramPieces: 10
    },

    // 本地记录上一次应用的 settings 版本
    lastSettingsVersion: 0
  },

  onLoad() {
    this.loadInventoryFromServer();
  },

  onShow() {
    const themeKey = app.globalData.currentThemeKey || "pink";
    const settings = app.globalData.settings || {};
    const globalVersion = app.globalData.settingsVersion || 0;
    const { lastSettingsVersion } = this.data;

    const newSettings = {
      packagePieces: settings.packagePieces || 500,
      gramPieces: settings.gramPieces || 10
    };

    this.setData({
      themeKey,
      settings: newSettings
    });

    // 如果设置版本有变化，或者还从未应用过设置
    if (globalVersion !== lastSettingsVersion) {
      const defaultBrandKey = settings.defaultBrandKey || "ALL";

      this.setData(
        {
          currentBrand: defaultBrandKey,
          lastSettingsVersion: globalVersion
        },
        () => this.applyBrandFilter()
      );
    } else {
      // 设置没变，也刷新一下过滤，保证从其他 Tab 返回时列表正确
      this.applyBrandFilter();
    }
  },

  /* 从后端加载数据 */
  loadInventoryFromServer() {
    const baseUrl = app.globalData.apiBaseUrl || "http://127.0.0.1:8000";

    wx.showLoading({
      title: "加载中",
      mask: true
    });

    wx.request({
      url: baseUrl + "/api/inventory/list",
      method: "GET",
      success: (res) => {
        if (res.statusCode === 200 && Array.isArray(res.data)) {
          const list = res.data.map((item) => ({
            ...item,
            selected: false,
            batchQuantity: ""
          }));
          this.setData(
            {
              inventoryList: list,
              keyword: ""
            },
            () => this.applyBrandFilter()
          );
        } else {
          wx.showToast({
            title: "加载库存失败",
            icon: "none"
          });
        }
      },
      fail: (err) => {
        console.error("请求库存接口失败", err);
        wx.showToast({
          title: "无法连接服务器",
          icon: "none"
        });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  /* 工具 */
  noop() {},

  findIndexById(id) {
    return this.data.inventoryList.findIndex((item) => item.id === id);
  },

  applyBrandFilter() {
    const { inventoryList, currentBrand, keyword } = this.data;
    const kw = (keyword || "").trim().toLowerCase();

    let list = inventoryList;

    if (currentBrand !== "ALL") {
      list = list.filter((item) => item.brand === currentBrand);
    }

    if (kw) {
      list = list.filter((item) => {
        const s = `${item.brand} ${item.code} ${item.name}`.toLowerCase();
        return s.includes(kw);
      });
    }

    this.setData({ filteredInventory: list });
  },

  /* 搜索 */
  onKeywordInput(e) {
    this.setData(
      { keyword: e.detail.value },
      () => this.applyBrandFilter()
    );
  },

  onSearchConfirm() {
    wx.showToast({
      title: "已按关键字过滤",
      icon: "none"
    });
  },

  /* 品牌 Tab */
  onBrandTabClick(e) {
    const key = e.currentTarget.dataset.key;
    this.setData(
      { currentBrand: key },
      () => this.applyBrandFilter()
    );
  },

  /* 模式切换 */
  toggleMode() {
    const newMode = this.data.mode === "normal" ? "batch" : "normal";
    let list = this.data.inventoryList;

    if (newMode === "batch") {
      list = list.map((item) => ({
        ...item,
        selected: false,
        batchQuantity: ""
      }));
    }

    this.setData(
      {
        mode: newMode,
        inventoryList: list,
        selectedCount: 0
      },
      () => this.applyBrandFilter()
    );
  },

  setBatchType(e) {
    const type = e.currentTarget.dataset.type;
    if (type === this.data.batchType) return;
    this.setData({ batchType: type });
  },

  /* 普通模式：点击行 -> 详情 */
  onClickItem(e) {
    if (this.data.mode !== "normal") return;

    const d = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/inventory/detail/index?id=${d.id}&brand=${encodeURIComponent(
        d.brand
      )}&code=${encodeURIComponent(d.code)}&name=${encodeURIComponent(
        d.name
      )}&colorHex=${encodeURIComponent(d.colorHex)}`
    });
  },

  /* 普通模式：单个入库/出库 */
  openSingleInModal(e) {
    const id = e.currentTarget.dataset.id;
    const index = this.findIndexById(id);
    if (index === -1) return;
    const item = this.data.inventoryList[index];

    this.setData({
      showSingleModal: true,
      singleModalType: "in",
      singleModalQuantity: "",
      singleModalReason: "",
      singleQuantityUnit: "pieces",
      currentItem: { ...item }
    });
  },

  openSingleOutModal(e) {
    const id = e.currentTarget.dataset.id;
    const index = this.findIndexById(id);
    if (index === -1) return;
    const item = this.data.inventoryList[index];

    this.setData({
      showSingleModal: true,
      singleModalType: "out",
      singleModalQuantity: "",
      singleModalReason: "",
      singleQuantityUnit: "pieces",
      currentItem: { ...item }
    });
  },

  closeSingleModal() {
    this.setData({ showSingleModal: false });
  },

  onSingleModalQuantityInput(e) {
    this.setData({ singleModalQuantity: e.detail.value });
  },

  onSingleModalReasonInput(e) {
    this.setData({ singleModalReason: e.detail.value });
  },

  setSingleQuantityUnit(e) {
    const unit = e.currentTarget.dataset.unit;
    if (!unit) return;
    this.setData({ singleQuantityUnit: unit });
  },

  confirmSingleModal() {
    const {
      singleModalType,
      singleModalQuantity,
      singleQuantityUnit,
      currentItem,
      inventoryList,
      settings
    } = this.data;

    const rawNum = Number(singleModalQuantity);
    if (!rawNum || rawNum <= 0) {
      wx.showToast({
        title: "请输入大于 0 的数量",
        icon: "none"
      });
      return;
    }

    // 根据单位换算成实际颗数
    let pieces = rawNum;
    if (singleQuantityUnit === "package") {
      pieces = rawNum * (settings.packagePieces || 500);
    } else if (singleQuantityUnit === "gram") {
      pieces = rawNum * (settings.gramPieces || 10);
    }

    const index = this.findIndexById(currentItem.id);
    if (index === -1) {
      this.closeSingleModal();
      return;
    }

    const item = inventoryList[index];

    if (singleModalType === "out" && pieces > item.quantity) {
      wx.showToast({
        title: "出库数量不能大于库存",
        icon: "none"
      });
      return;
    }

    let newQuantity = item.quantity;
    if (singleModalType === "in") newQuantity += pieces;
    else newQuantity -= pieces;

    const newList = [...inventoryList];
    newList[index] = { ...item, quantity: newQuantity };

    this.setData(
      {
        inventoryList: newList,
        showSingleModal: false,
        singleModalQuantity: "",
        singleModalReason: "",
        currentItem: {},
        singleQuantityUnit: "pieces"
      },
      () => this.applyBrandFilter()
    );

    wx.showToast({
      title: singleModalType === "in" ? "入库成功" : "出库成功",
      icon: "success"
    });
  },

  /* 批量模式（仍按颗数处理） */
  toggleItemSelect(e) {
    const id = e.currentTarget.dataset.id;
    const index = this.findIndexById(id);
    if (index === -1) return;

    const list = [...this.data.inventoryList];
    list[index].selected = !list[index].selected;
    const selectedCount = list.filter((i) => i.selected).length;

    this.setData(
      {
        inventoryList: list,
        selectedCount
      },
      () => this.applyBrandFilter()
    );
  },

  onBatchQuantityInput(e) {
    const id = e.currentTarget.dataset.id;
    const value = e.detail.value;
    const index = this.findIndexById(id);
    if (index === -1) return;

    const list = [...this.data.inventoryList];
    list[index].batchQuantity = value;

    this.setData(
      { inventoryList: list },
      () => this.applyBrandFilter()
    );
  },

  submitBatch() {
    const { inventoryList, batchType } = this.data;
    const selected = inventoryList.filter((i) => i.selected);

    if (!selected.length) {
      wx.showToast({
        title: "请先选择至少一个色号",
        icon: "none"
      });
      return;
    }

    for (const item of selected) {
      const num = Number(item.batchQuantity);
      if (!num || num <= 0) {
        wx.showToast({
          title: `请为 ${item.brand} ${item.code} 填写大于 0 的数量`,
          icon: "none"
        });
        return;
      }
      if (batchType === "out" && num > item.quantity) {
        wx.showToast({
          title: `${item.brand} ${item.code} 出库数量不能大于库存`,
          icon: "none"
        });
        return;
      }
    }

    const newList = inventoryList.map((item) => {
      if (!item.selected) return item;

      const num = Number(item.batchQuantity);
      let q = item.quantity;
      if (batchType === "in") q += num;
      else q -= num;

      return {
        ...item,
        quantity: q,
        selected: false,
        batchQuantity: ""
      };
    });

    this.setData(
      {
        inventoryList: newList,
        selectedCount: 0
      },
      () => this.applyBrandFilter()
    );

    wx.showToast({
      title: batchType === "in" ? "批量入库成功" : "批量出库成功",
      icon: "success"
    });
  }
});