/**
 * 人脸识别模块
 */
const { group_id } = require('../../config.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        src: '',        
    },
    //拍照
    takePhoto: function () {
        const cameraContext = wx.createCameraContext();         //相机模块
        const FileSystemManager = wx.getFileSystemManager();    //文件模块
        const { face_token } = getApp().globalData;             //获取面部识别API的token
        const _this = this;
        //拍摄照片
        cameraContext.takePhoto({
            quality: 'low',
            success: (res) => {
                wx.showLoading({
                    title: '正在识别中',
                });
                _this.setData({
                    src: res.tempImagePath
                });                                    
                //将图片路径转为base64
                FileSystemManager.readFile({
                    filePath: res.tempImagePath, 
                    encoding: "base64",
                    success: function (result){
                        //请求人脸库搜索
                        wx.request({
                            url: `https://aip.baidubce.com/rest/2.0/face/v3/search?access_token=${face_token}`,
                            method: 'POST',
                            header: {
                                'content-type': 'application/json'
                            },  
                            data: {
                                image: result.data,
                                image_type: 'BASE64',
                                group_id_list: group_id,                                
                            },
                            success: function(res){
                                const [first] = res.data.result.user_list;                                
                                wx.hideLoading();                       
                                if(first.score >= 85){
                                    wx.showToast({
                                        title: `${first.user_info}考勤成功！`,
                                        icon: 'none',                                        
                                    })  
                                }else{
                                    wx.showModal({
                                        title: '提示',
                                        content: `匹配度过低请重新拍照！`,
                                        showCancel: false
                                    });  
                                }  
                                _this.setData({ 
                                    src: '' 
                                });
                                console.log(res);
                            }
                        });                                         
                    },
                    fail: function (errMsg){
                        wx.showModal({
                            title: '操作失败',
                            content: `指定的 filePath 所在目录不存在:${res.tempImagePath}！`,
                            showCancel: false
                        });   
                    }
                });                                                              
            }
        })
    },
    register: function(){
        wx.navigateTo({
            url: '../faceRegister/faceRegister'
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})