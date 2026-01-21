// pages/inventory/detail/index.js
Page({
  data: {
    // 色号信息
    color: {
      id: null,
      brand: "",
      code: "",
      name: "",
      colorHex: "#dddddd"
    },
    // 库存信息
    quantity: 0,
    warningThreshold: 0,
    // 最近变动记录（示例）
    recentLogs: [],
    // 弹窗控制
    showModal: false,
    modalType: "in", // 'in' | 'out'
    modalQuantity: "",
    modalReason: ""
  },

  onLoad(options) {
    // options 是从列表页传过来的参数，例如 ?id=1&brand=Hama...
    console.log("detail options:", options);

    if (options && options.id) {
      // 基于传入的参数初始化（现在还没有全量数据，只是演示）
      const color = {
        id: Number(options.id),
        brand: options.brand || "Hama",
        code: options.code || "01",
        name: options.name || "白色",
        colorHex: options.colorHex || "#ffffff"
      };

      // 根据 id 简单生成一点不同的假数据，方便你看效果
      let quantity = 1000;
      let warningThreshold = 300;
      if (color.id === 2) {
        quantity = 300;
        warningThreshold = 400;
      } else if (color.id === 3) {
        quantity = 800;
        warningThreshold = 200;
      }

      this.setData({
        color,
        quantity,
        warningThreshold,
        recentLogs: [
          {
            id: 1,
            change: 200,
            reason: "购入",
            time: "2026-01-15 20:30",
            user: "自己"
          },
          {
            id: 2,
            change: -80,
            reason: "制作《小猫》",
            time: "2026-01-14 19:10",
            user: "自己"
          }
        ]
      });
    } else {
      // 如果没传参数，就用一份固定假数据
      this.setData({
        color: {
          id: 1,
          brand: "Hama",
          code: "01",
          name: "白色",
          colorHex: "#ffffff"
        },
        quantity: 1200,
        warningThreshold: 500,
        recentLogs: []
      });
    }
  },

  // 打开入库弹窗
  openInModal() {
    this.setData({
      showModal: true,
      modalType: "in",
      modalQuantity: "",
      modalReason: ""
    });
  },

  // 打开出库弹窗
  openOutModal() {
    this.setData({
      showModal: true,
      modalType: "out",
      modalQuantity: "",
      modalReason: ""
    });
  },

  // 关闭弹窗
  closeModal() {
    this.setData({
      showModal: false
    });
  },

  onModalQuantityInput(e) {
    this.setData({
      modalQuantity: e.detail.value
    });
  },

  onModalReasonInput(e) {
    this.setData({
      modalReason: e.detail.value
    });
  },

  // 确认入库/出库
  confirmModal() {
    const { modalType, modalQuantity, modalReason, quantity, recentLogs } = this.data;
    const num = Number(modalQuantity);

    if (!num || num <= 0) {
      wx.showToast({
        title: "请输入大于 0 的数量",
        icon: "none"
      });
      return;
    }

    // 出库时做个简单校验：不能出负库存
    if (modalType === "out" && num > quantity) {
      wx.showToast({
        title: "出库数量不能大于库存",
        icon: "none"
      });
      return;
    }

    // 计算新的库存
    let newQuantity = quantity;
    let changeValue = num;
    if (modalType === "in") {
      newQuantity = quantity + num;
      changeValue = num;
    } else {
      newQuantity = quantity - num;
      changeValue = -num;
    }

    // 更新本页数据
    const now = this.formatTime(new Date());
    const newLog = {
      id: recentLogs.length ? recentLogs[0].id + 1 : 1,
      change: changeValue,
      reason: modalReason || (modalType === "in" ? "入库" : "出库"),
      time: now,
      user: "自己"
    };

    this.setData({
      quantity: newQuantity,
      recentLogs: [newLog, ...recentLogs],
      showModal: false,
      modalQuantity: "",
      modalReason: ""
    });

    wx.showToast({
      title: modalType === "in" ? "入库成功" : "出库成功",
      icon: "success"
    });

    // ⚠️ 现在只是前端本地更新，后面接后端时，这里会改成：
    // 1. 调用后端 /api/inventory/change
    // 2. 成功后再更新前端数据
  },

  // 简单的时间格式化
  formatTime(date) {
    const pad = (n) => (n < 10 ? "0" + n : n);
    const y = date.getFullYear();
    const m = pad(date.getMonth() + 1);
    const d = pad(date.getDate());
    const h = pad(date.getHours());
    const mm = pad(date.getMinutes());
    return `${y}-${m}-${d} ${h}:${mm}`;
  }
});