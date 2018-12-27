// pages/faceRegister/faceRegister.js
const { group_id } = require('../../config.js');
const { utilReadFile } = require('../../utils/util.js');

//当前选择图片的BASE64码
let currentBase64 = ''; 

Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: ''
    },
    formSubmit: function(e){
        const { name, phone } = e.detail.value;
        const { face_token } = getApp().globalData;
        const { imgUrl } = this.data;        
        const FileSystemManager = wx.getFileSystemManager();
        //等待动画
        wx.showLoading({title: '注册中'});
        //根据图片路径转成base64码
        utilReadFile({
            filePath: imgUrl,
            encoding: "base64"
        })
        //搜索人脸库，找出是否有相同人脸
        .then((res)=>{
            //保存当前图片的base64
            currentBase64 = res.data;
            return new Promise((resove, reject)=>{
                wx.request({
                    url: `https://aip.baidubce.com/rest/2.0/face/v3/search?access_token=${face_token}`,
                    method: 'POST',
                    header: {
                        'content-type': 'application/json'
                    },
                    data: {
                        image: currentBase64,
                        image_type: 'BASE64',
                        group_id_list: group_id,
                        max_user_num: 20 
                    },
                    success: resove,
                    fail: reject,
                })                
            });
        })
        //人脸库没有相同的人脸就调用注册
        .then((res)=>{
            const { user_list=[] } = res.data.result;
            let num = user_list.filter((obj)=> obj.score > 85 ).length;
            if(num > 0){
                wx.showModal({
                    title: '提示',
                    content: `注册失败：人脸库中存在相似人脸，请重新拍照注册！`,
                    showCancel: false
                });
                wx.hideLoading();
            }else{
                wx.request({
                    url: `https://aip.baidubce.com/rest/2.0/face/v3/faceset/user/add?access_token=${face_token}`,
                    method: 'POST',
                    header: {
                        'content-type': 'application/json'
                    },
                    data: {
                        image: currentBase64,
                        image_type: 'BASE64',
                        group_id: group_id,
                        user_id: phone,
                        user_info: name,
                    },
                    success: function(res){
                        if (res.data.error_msg === "SUCCESS") {
                            wx.showToast({
                                title: `注册成功！`,
                                icon: 'success',
                            })
                        } else {
                            wx.showModal({
                                title: '提示',
                                content: `注册失败：${res.data.error_msg}！`,
                                showCancel: false
                            });
                        }
                        wx.hideLoading(); 
                        console.log(res);                    
                    },                    
                })                
            }            
        })
        .catch((res)=>{
            wx.hideLoading(); 
            console.log(`报错：${JSON.stringify(res)}`);
        });                
    },
    //选择图片
    pickImg: function(){
        const _this = this;
        wx.chooseImage({
            count: 1, // 默认9      
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有      
            sourceType: ['camera', 'album'], // 可以指定来源是相册还是相机，默认二者都有      
            success: function (res) { // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片        
                _this.setData({
                    imgUrl: res.tempFilePaths[0]
                })
            }
        })        
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad:function(options) {
        
        console.log(getApp());
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