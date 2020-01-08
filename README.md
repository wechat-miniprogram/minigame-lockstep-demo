## 帧同步游戏服务示例

## 简介
本项目为[小游戏帧同步服务](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/lock-step.html)配套示例，clone代码至任意文件夹再导入至最新版微信开发者工具即可运行。为了让示例尽可能轻量，本项目采用了渲染引擎Pixi.js。

游戏玩法很简答，可以1V1房间邀请微信好友对战，游戏开始后，每个玩家有一定的血量，任意一方血量为零游戏结束。

## 运行截图
![demo](/images/demo.jpg)

## 文件目录
```
|-- src
    |-- config.js          // 游戏逻辑相关配置
    |-- databus.js         // 全局状态管理器
    |-- gameserver.js      // 帧同步服务使用核心代码
    |-- index.js           // 游戏主函数
    |-- base               // 游戏基础类集合
    |   |-- bg.js          // 游戏背景类
    |   |-- bullet.js      // 子弹类
    |   |-- debug.js       // 调试信息类
    |   |-- hp.js          // 血条类
    |   |-- joystick.js    // 虚拟摇杆类
    |   |-- login.js       // 登录类
    |   |-- music.js       // 音效管理类
    |   |-- player.js      // 玩家类
    |   |-- skill.js       // 技能按键类
    |   |-- tween.js       // 缓动类
    |-- common             // 游戏内通用函数集合
    |   |-- ui.js          // ui辅助函数
    |   |-- util.js        // 各种通用函数集合
    |-- scenes             // 游戏场景集合
        |-- battle.js      // 对战场景
        |-- home.js        // 游戏主页场景
        |-- result.js      // 对战结算场景
        |-- room.js        // 房间界面场景
```

