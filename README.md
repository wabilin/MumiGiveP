# MumiGiveP

姆咪姆咪發錢錢。

可以在 PTT 上自動發P幣，簡單好用。

支援 FireFox & Chrome


## Download and Installation
Coming soon...

## Usage

1. 安裝
1. 前往 https://term.ptt.cc 並登入。
1. 操作 PTT 前往您想要發前的文章。
1. 點擊本 Add-on 的 icon，就可以輕鬆發錢囉。


## Build

Production Build
```
yarn build
```

Development Build
```
yarn dev
```

使用 addon 資料夾中的內容載入 FireFox / Chrome Addon 除錯模式


# 桌面版 MumiGiveP （停止維護 / No longer supported）

支援 Windows, MacOs 和 Linux 系統。

**DEMO** : [Youtube](https://youtu.be/kCIcbG_cX0U)

## Download and Installation
### Binary
Windows 及 MacOS 使用者可從以下位置直接下載執行檔：

 - [GitHub Releases](https://github.com/wabilin/MumiGiveP/releases)

 - [Google Drive](https://goo.gl/HOHaot)

### Source
建議 Linux 及 MacOS 使用者，直接執行原始碼。

Download zip at [Github](https://github.com/wabilin/MumiGiveP)

or

```
git clone git@github.com:wabilin/MumiGiveP.git
```

After that, run this script to install dependencies

```
pip install -r requirements.txt
```

then run

```
python mumi.py
```

## 3rd Party Library
### andycjw/uao_decode.py
For PTT encoding

[https://gist.github.com/andycjw/5617496](https://gist.github.com/andycjw/5617496)

### Requests
For crawling PTT website

[https://github.com/kennethreitz/requests](https://github.com/kennethreitz/requests)

## TODO
1. 貼上推文分析
1. 稅前稅後
1. 推文內容條件
1. SSH 連線
1. LOGO
1. 編輯發送名單
1. 修改紅包

### Not to do
1. 抽獎
1. 贊助作者

# Thanks

特別感謝下列鄉民們，在本程式開發階段幫忙試用並提供優質回饋。

 - oooptt
 - alex94539
 - defendant
 - bbbruce
 - Sasamumu
 - achero
 - oz5566
 - weichipedia
 - akingeta1945
 - jerry7668
 - GayLord

以及在 Python 版上給予程式開發意見的版友們：

 - ckc1ark
 - uranusjr
 - BigBank
 - eight0

有賴鄉民們熱心協助，本程式終得以完成。
