import {
    none
} from '../common/util.js';
import databus from '../databus.js';

class Login {
    constructor() {
        this.userInfo = {};
    }

    do(callback=none) {
        this.loginCallback = callback;

        wx.getSetting({
            success: (res) => {
                const authSetting = res.authSetting
                if ( authSetting['scope.userInfo'] === true ) {
                    wx.getUserInfo({
                        success: (res) => {
                            databus.userInfo = res.userInfo;
                            this.userInfo = res.userInfo
                            //用户已授权，可以直接调用相关 API
                            this.loginCallback(this.userInfo);
                        }
                    });
                } else if ( authSetting['scope.userInfo'] === false ) {
                    // 用户已拒绝授权，再调用相关 API 或者 wx.authorize 会失败，需要引导用户到设置页面打开授权开关
                    this.addLoginBtn();
                } else {
                    // 未询问过用户授权，调用相关 API 或者 wx.authorize 会弹窗询问用户
                    this.addLoginBtn();
                }
            }
        });
    }

    addLoginBtn() {
        const width  = 90;
        const height = 35;

        const button = wx.createUserInfoButton({
            type: 'image',
            image: 'images/start.png',
            style: {
                left: window.innerWidth / 2 - width / 2,
                top : window.innerHeight / 2 - height / 2,
                width,
                height,
            }
        });

        button.onTap((res) => {
            if ( res.errMsg.indexOf(':ok') > -1 ) {
                button.destroy();
                try {
                    this.userInfo = JSON.parse(res.rawData);
                    databus.userInfo = this.userInfo;
                    this.loginCallback(this.userInfo);
                } catch(e) {
                    console.log(e, res);
                    this.loginCallback({});
                }
            } else {
                wx.showToast({
                    title: '请授权开始游戏',
                    icon : 'none',
                    duration:1500
                })
            }
        });
    }
}

export default new Login();

