var yltplugin = requirePlugin("yltplugin")
Page({
  data: {
    corpId: 'o4x04hy3zljghf7oa4', //provided by client through URL parameter
    userId: '-1', //provided by client through URL parameter
    genderList: ['DET Male'],
    userGender: 1,
    userHeight: 160,
    userWeight: 60,
    checkboxStatus: true,
    camList: [],
    tutorialList: [],
    errMsgList: [],
    camOn: false,
    tutorialOn: false,
    frontPoseSrc: '../../assets/img/front-pose-male-refimg.png',
    sidePoseSrc: '../../assets/img/side-pose-male-refimg.png',
    frontImgSrc: '',
    sideImgSrc: '',
  },

  onLoad: function(options) {
    var that = this;
    wx.hideLoading();
    wx.showLoading({
      title: '拼命加载中...',
      mask: true,
    });

    try {
      var sysInfo = wx.getSystemInfoSync();
    } catch (e) {
      console.log(e);
    }
    if (that.compareVersion(sysInfo.SDKVersion, '1.9.6') < 0) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }

    if (wx.canIUse('request')) {
      console.log("YLT: Request supported.");
    } else {
      console.log("YLT: Request not supported.")
      wx.showModal({
        title: '提示-80',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }

    if (wx.canIUse('createCameraContext')) {
      console.log("YLT: Camera supported.");
    } else {
      console.log("YLT: Camera not supported.")
      wx.showModal({
        title: '提示-81',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }

    if (wx.canIUse('onAccelerometerChange')) {
      console.log("YLT: Accelerometer supported.");
    } else {
      console.log("YLT: Accelerometer not supported.")
      wx.showModal({
        title: '提示-82',
        content: '当前微信版本过低或不支持重力传感器，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }


    wx.login({
      success: function(res) {
        if (res.code) {
          wx.getUserInfo({
            withCredentials: true,
            success: function(res_info) {
              // console.log(res_info)
              that.setData({
                userInfo: res_info.userInfo
              });
              wx.hideLoading();
            },
            fail: function(e) {
              wx.hideLoading();
              wx.redirectTo({
                url: './userAuth?src=measure',
              })
            }
          })
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '网络错误-102',
            icon: 'loading',
            duration: 1000,
          });
        }
      },
      fail: function(e) {
        wx.hideLoading();
        wx.showToast({
          title: '网络错误-101',
          icon: 'loading',
          duration: 1000,
        });
      },
    });
  },

  onReady: function() {},

  cameraActivate: function(e) {
    var that = this;
    if (e.currentTarget.dataset.imgdir == 'front') {
      wx.showActionSheet({
        itemList: ['拍摄正面照片'],
        success: function(res) {
          if (res.tapIndex == 0) {
            that.setData({
              camOn: true,
              camList: [{
                'dir': 'front'
              }]
            });
          }
        },
      })
    } else if (e.currentTarget.dataset.imgdir == 'side') {
      wx.showActionSheet({
        itemList: ['拍摄侧面照片'],
        success: function(res) {
          if (res.tapIndex == 0) {
            that.setData({
              camOn: true,
              camList: [{
                'dir': 'side'
              }]
            });
          }
        },
      })
    }
  },

  getPhoto: function(e) {
    var that = this;
    console.log(e.detail);
    that.setData({
      camOn: false,
      camList: [],
    });
    if (e.detail.status == 'OK') {
      if (e.detail.camdir == 'front') {
        that.setData({
          frontImgSrc: e.detail.tempImagePath,
        });
      } else if (e.detail.camdir == 'side') {
        that.setData({
          sideImgSrc: e.detail.tempImagePath,
        });
      } else {
        console.log("ERROR: incorrect photo data.");
      }
    } else {
      console.log(e.detail.status);
    }

  },

  closecam: function(e) {
    var that = this;
    // console.log(e.detail);
    that.setData({
      camOn: false,
      camList: []
    });
  },

  updateInfo: function(e) {
    var that = this;
    if (e.currentTarget.id == 'userheight' && e.detail.value) {
      that.setData({
        userHeight: e.detail.value * 1
      })
    } else if (e.currentTarget.id == 'userweight' && e.detail.value) {
      that.setData({
        userWeight: e.detail.value * 1
      })
    }
  },

  navToNext: function() {
    // corpId: String, 
    // userId: String, 
    // userInfo: Object, 
    // userGender: Int, (0=female, 1=male)
    // userHeight: Int,
    // userWeight: Int, 
    // frontImgSrc: String, 
    // sideImgSrc: String, 
    var that = this;
    that.setData({
      errMsgList: [],
    });
    wx.showLoading({
      title: '拼命计算中...',
      mask: true,
    })
    that.setData({
      userId: that.data.userInfo.nickName.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "")
    });
    yltplugin.getMeasurements(that.data.corpId, that.data.userId, that.data.userInfo, that.data.userGender, that.data.userHeight, that.data.userWeight, that.data.frontImgSrc, that.data.sideImgSrc).then(function(res) {
      wx.hideLoading();

      console.log(res)

      //console.log(res.data.data[0][0]);

      if (res.code == 0) {

        if (res.msg === "WARNING") {
          //Show Warning
          wx.showModal({
            title: 'Result with Warnings',
            content: res.data.data[0][0].Intro_Wechat,
          });
        } else {
          wx.showModal({
            title: '量体成功',
            content: JSON.stringify(res)
          });
          // wx.showToast({
          //   title: '量体成功' + JSON.stringify(res.data),
          //   icon: 'success',
          //   duration: 1500,
          // });
        }

      } else {
        var tmpErrMsgList = [];
        for (var i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].Intro_Wechat != '' || res.data.data[i].Intro_Wechat != null) {
            tmpErrMsgList.push({
              id: i,
              text: res.data.data[i].Intro_Wechat
            });
          }
        }
        that.setData({
          errMsgList: tmpErrMsgList,
        });
        console.log(tmpErrMsgList);
        wx.showToast({
          title: '量体失败',
          icon: 'loading',
          duration: 1000,
        });
      }
    }).catch(function(err) {
      wx.hideLoading();
      console.log(err);
      that.setData({
        errMsgList: err.data.data,
      });
      wx.showToast({
        title: '量体失败',
        icon: 'loading',
        duration: 1000,
      });
    });
  },


  navToTutorial: function() {
    var that = this;
    that.setData({
      tutorialOn: true,
      tutorialList: [{
        id: 1
      }]
    });
  },

  closeTutorial: function() {
    var that = this;
    that.setData({
      tutorialOn: false,
      tutorialList: []
    });
  },

  navToPrivacy: function(e) {
    console.log('e');
    wx.navigateTo({
      url: '../yltprivacy/privacy',
    });
  },

  checkboxChange: function(e) {
    var that = this;
    that.setData({
      checkboxStatus: !e.currentTarget.dataset.status
    });
  },

  compareVersion: function(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    var len = Math.max(v1.length, v2.length)

    while (v1.length < len) {
      v1.push('0')
    }
    while (v2.length < len) {
      v2.push('0')
    }

    for (var i = 0; i < len; i++) {
      var num1 = parseInt(v1[i])
      var num2 = parseInt(v2[i])

      if (num1 > num2) {
        return 1
      } else if (num1 < num2) {
        return -1
      }
    }

    return 0
  },
})