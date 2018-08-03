// pages/measure/userAuth.js
Page({

  data:{
    authSrc : ''
  },

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);

    wx.getSetting({
      success: (res) => {
        console.log(res);
          that.setData({ authSrc: 'measure' });
          console.log('test')
          if (res.authSetting['scope.userInfo']) {
            wx.reLaunch({
              url: './measure',
            });
          }
        
      },
      fail: function (e) {
        console.log(e);
        wx.showToast({
          title: '获取授权失败',
          icon: 'loading',
          duration: 1000,
        });
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  userAuth: function (e) {
    var that = this;


    wx.openSetting({
      success: (res) => {
        if (that.data.authSrc == 'measure') {
          if (res.authSetting['scope.userInfo']) {
            wx.reLaunch({
              url: './measure',
            });
          }
        }
      },
      fail: function (e) {
        console.log(e);
        wx.showToast({
          title: '获取授权失败',
          icon: 'loading',
          duration: 1000,
        });
      },
    });
  },
})