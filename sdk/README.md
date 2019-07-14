# 安裝
- 下載壓縮包，內含兩個檔案 `ads.js` 及 `ads.css`。將其解壓縮後放置在專案目錄下

- 接下來，在包含有廣告區域的組件中，引入 `ads.css`
```
# 以Vue為例
<style>    
    @import url("../sdk/ads.css");

    ...其他的css樣式
</style>
```

- 或是直接在應用的入口文件引入
```
# 以Vue為例
# main.js
import "[你的檔案路徑]/ads/ads.css"
```


- 接下來在需要的地方引入 `ads.js` 文件。 `ads.js` 使用default export，因此你可以自由命名變數的名稱
```
# 以Vue為例
<script>
    import ads from "[你的檔案路徑]/ads/ads.js";

    export default {

    }
</script>
```


# 使用方式
## 定義廣告id
- 首先在需要顯示廣告的位置給予一個 `data-ad="[廣告id]"` 屬性。注意，`[廣告id]`不可重複，重複時只有第一個有效
```
<div data-id="my-ad-id"></div>
```

## 關於尺寸
- 廣告適宜顯示尺寸為長:寬 = 6:4，例如
```
[data-ad="my-ad-id"] {
    width: 600px;
    height: 400px;
}
```


## 初始化
- 再來，你需要利用上面定義好的id進行初始化動作
```
# 以Vue為例
<template>
    <div data-id="my-ad-id"></div>
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
- `ads` 接受兩個參數：[廣告id(必須)]及[廣告類型(可選)]
```
const myAd = ads("my-ad-id", "BANNER");
```

- 可使用的廣告類型
    - "BANNER"
    - "VIDEO"



## 事件監聽器
- `ads` 提供三個事件供監聽
    - `on-ad-loaded` 廣告載入成功
    - `on-ad-failed` 廣告載入失敗
    - `on-ad-impression` 廣告出現在畫面上超過 50%至少一秒


- 使用 `.listen()` 註冊監聽函數。`.listen()` 接受一個物件作為參數
```
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
```


## 開始獲取廣告
- 使用 `.load()` 在你準備好後獲取廣告內容。注意使用 `.load()` 時DOM必須為可取用狀態
```
myAd.load();
```


# 完整範例
```
# 以Vue為例
<template>
    <div data-id="my-ad-id"></div>
</template>

<script>
    import ads from "[你的檔案路徑]/ads/ads.js";

    export default {
        data(){
            return {
                myAd: null
            }
        }

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
        }

        mounted(){
            this.myAd.load();
        }
    }
</script>
```



# 串接函數
- `ads()`及`.listen()`都會回傳同一個實例，因此，你也可以直接把它們串在一起使用
```
# 以Vue為例
<template>
    <div data-id="my-ad-id"></div>
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



