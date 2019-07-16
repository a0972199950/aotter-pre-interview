若電獺的server502怎麼辦？
本文檔內範例皆以Vue做解說

# 安裝
- 下載壓縮包，內含兩個檔案 `ads.js` 及 `ads.css`。將其解壓縮後放置在專案目錄下

- 接下來，在含有廣告的組件中引入 `ads.css`
```
<style>    
    @import url("../sdk/ads.css");

    ...其他的css樣式
</style>
```

- 或是直接在單頁應用的入口文件引入
```
在`main.js`中

import Vue from 'vue'
import App from './App.vue'
import "[你的檔案路徑]/ads/ads.css"
```


- 接下來在需要的地方引入 `ads.js` 文件。 `ads.js` 使用default export，因此你可以自由命名變數的名稱
```
<script>
    import ads from "[你的檔案路徑]/ads/ads.js";
    export default {

    }
</script>
```


# 使用方式
### 定義廣告id
- 首先在需要顯示廣告的位置給予一個 `data-ad="[廣告id]"` 屬性。注意，`[廣告id]`不可重複，重複時只有第一個有效
```
<template>
	<div>
		<div data-id="my-ad-id"></div>
    </div>
</template>
```

### 關於尺寸
- 廣告適宜顯示尺寸比例為100:57，並且適宜顯示寬度不小於500px，例如
```
[data-ad="my-ad-id"] {
    width: 500px;
    height: 285px;
}
```


### 初始化
- 再來，你需要利用上面定義好的`[廣告id]`進行初始化動作
```
<template>
	<div>
    	<div data-id="my-ad-id"></div>
    </div>
</template>

<script>
    import ads from "[你的檔案路徑]/ads/ads.js";
    export default {
        created(){
            const myAd = ads("my-ad-id");
        }
    }
</script>
```


### 初始化參數
- `ads` 接受兩個參數：`[廣告id(必須)]`及`[廣告類型(可選)]`
```
const myAd = ads("my-ad-id", "BANNER");
```

- 可使用的廣告類型
    - "BANNER"
    - "VIDEO"



### 事件監聽器
- `ads` 提供三個事件供監聽
    - `on-ad-loaded` 廣告載入成功
    - `on-ad-failed` 廣告載入失敗
    - `on-ad-impression` 廣告出現在畫面上超過 50%至少一秒


- 使用 `.listen()` 註冊監聽函數。`.listen()` 可接受一個物件作為參數。例如
```
myAd.listen({
    `on-ad-loaded`: () => {
        console.log("廣告載入成功");
    },

    `on-ad-failed`: (err) => {
        console.log("廣告載入失敗。失敗原因：" + err);
    },

    `on-ad-impression`: () => {
        console.log("廣告載入過半超過一秒");
    }
});
```


### 開始獲取廣告
- 使用 `.load()` 在你準備好後開始獲取廣告內容並顯示到DOM上。注意使用 `.load()` 時DOM必須為可取用狀態
```
myAd.load();
```


# 完整範例
```
# 以Vue為例
<template>
	<div>
    	<div data-id="my-ad-id"></div>
    </div>
</template>

<script>
    import ads from "[你的檔案路徑]/ads/ads.js";
    export default {
        data(){
            return {
                myAd: null
            }
        },

        created(){
            const myAd = ads("my-ad-id", "BANNER");
            myAd.listen({
                `on-ad-loaded`: () => {
                    console.log("廣告載入成功");
                },

                `on-ad-failed`: (err) => {
                    console.log("廣告載入失敗。失敗原因：" + err);
                },

                `on-ad-impression`: () => {
                    console.log("廣告載入過半");
                },
            });

            this.myAd = myAd;
        },

        mounted(){
            this.myAd.load();
        }
    }
</script>
```



# 串接函數
- `ads()`及`.listen()`會回傳相同實例，因此，你也可以直接把它們串在一起使用
```
# 以Vue為例
<template>
	<div>
    	<div data-id="my-ad-id"></div>
    </div>
</template>

<script>
    import ads from "[你的檔案路徑]/ads/ads.js";
    export default {
        mounted(){
            ads("my-ad-id", "BANNER")
            .listen({
                `on-ad-loaded`: () => {
                    console.log("廣告載入成功");
                },

                `on-ad-failed`: (err) => {
                    console.log("廣告載入失敗。失敗原因：" + err);
                },

                `on-ad-impression`: () => {
                    console.log("廣告載入過半");
                },
            })
            .load();
        }
    }
</script>
```



