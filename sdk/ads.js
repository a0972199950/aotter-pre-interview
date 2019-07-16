export default (id, type) => {
    class Ad {
        constructor(id, type) {
            this.id = id;
            this.type = type;
            this.calledImpressionApi = false;
        }

        // 外部Api: 註冊自定義lifecycle函數
        listen(customFuncs){
            if(customFuncs["on-ad-loaded"]){
                this.onAdLoaded = customFuncs["on-ad-loaded"];
            };

            if(customFuncs["on-ad-failed"]){
                this.onAdFailed = customFuncs["on-ad-failed"];
            };

            if(customFuncs["on-ad-impression"]){
                this.onAdImpression = customFuncs["on-ad-impression"];
            };

            return this;
        }

        // 外部Api: 開始載入廣告
        load(){
            const origin = this;            
            const request = new XMLHttpRequest();
            
            request.addEventListener("load", function () {
                const ad = JSON.parse(this.response);

                // 請求成功且有拿到廣告資訊
                if(
                    Math.floor(this.status / 100) === 2 && // http request成功
                    ad.success // 有拿到廣告資訊
                ){
                    // 插入廣告內容到DOM，成功回傳true，失敗回傳false
                    const insertSuccess = origin._insertAd(ad);                    

                    if(insertSuccess){
                        origin.impressionUrl = ad.impression_url; // 儲存廣告顯示過半後的呼叫端點
                        origin._listenScroll(); // 開始監聽廣告是否顯示超過一半
                        origin.onAdLoaded ? (origin.onAdLoaded()) : false; // 呼叫自定義事件on-ad-loaded
                    } else {
                        origin.onAdFailed ? (origin.onAdFailed("Failed to insert ad to DOM. Did you resgist 'data-ad' correctly?")) : false; // 呼叫自定義事件on-ad-failed
                    }
                    

                // 請求成功但沒有廣告資訊
                } else if(
                    Math.floor(this.status / 100) === 2 && // http request成功
                    !ad.success // 沒有拿到廣告資訊
                ) {
                    origin.onAdFailed ? (origin.onAdFailed("No ad exists now")) : false; // 呼叫自定義事件on-ad-failed

                // 請求失敗
                } else {
                    origin.onAdFailed ? (origin.onAdFailed(`Server returned: ${this.status}`)) : false; // 呼叫自定義事件on-ad-failed
                }
                
            });

            
            request.addEventListener("error", function () {
                origin.onAdFailed ? (origin.onAdFailed(`Request failed or blocked`)) : false; // 呼叫自定義事件on-ad-failed
            });


            request.open("GET", "http://localhost:3000/ads" + (this.type ? "?type="+this.type : ""));
            request.send();
        }

        _insertAd(ad){
            const adSpace = document.querySelector(`[data-ad="${this.id}"]`);
            if(!adSpace) return false; // 廣告顯示區塊不存在，抓不到元素

            switch(ad.type){
                case "BANNER":
                    adSpace.innerHTML = this._createBannerHTML(ad);
                    break;

                case "VIDEO":
                    adSpace.innerHTML = this._createVideoHTML(ad);
                    break;
            };

            return true;
        }

        _createBannerHTML(ad){
            return `
            <a href="${ad.url}" target="_blank" class="ad-banner">
                <img class="ad-banner__img" src="${ad.image}">
                <div class="ad-banner__content">
                    <p class="ad-banner__domain">${ad.url.split("//")[1].split("/"[0])}</p>
                    <h3 class="ad-banner__title">${ad.title}</h3>
                    <div class="ad-banner__icon">i</div>
                </div>
            </a>
            `;
        }

        _createVideoHTML(ad){
            return `
            <div class="ad-video">
                <img class="ad-video__img" src="${ad.image}">

                <h3 class="ad-video__title">${ad.title}</h3>

                <a href="${ad.video_url}" target="_blank">
                    <div class="ad-video__btn">
                    <div class="ad-video__icon"></div>
                    </div>
                </a>

                <div class="ad-video__social">
                    <div>&#128077;195</div>
                    <div>&#128172;14</div>
                </div>
            </div>
            `;
        }

        _listenScroll(){
            const origin = this;
            const adSpace = document.querySelector(`[data-ad="${this.id}"]`);
            const getElementTop = (element) => {
                let actualTop = element.offsetTop
                let current = element.offsetParent
                while (current !== null) {
                    let parentTopBorderWidth = document.defaultView.getComputedStyle(current, null).borderTopWidth
                    actualTop += current.offsetTop
                    if (parentTopBorderWidth) {
                        actualTop += parseFloat(parentTopBorderWidth)
                    }
            
                    current = current.offsetParent
                }
                return actualTop;
            }
            const calculateShowedProportion = () => {
                // 顯示過半Api只呼叫一次
                if(origin.calledImpressionApi){
                    window.removeEventListener("scroll", calculateShowedProportion);
                    return;
                };

                const showedHeight = window.scrollY + window.innerHeight;
                const adSpaceMiddleHeight = getElementTop(adSpace) + adSpace.clientTop + (adSpace.clientHeight/2);
                
                if(showedHeight > adSpaceMiddleHeight){
                    origin.calledImpressionApi = true; // 成功呼叫過一次廣告顯示過半api
                    origin._adShowed();
                }
            };

            
            calculateShowedProportion(); // 初期呼叫第一次計算廣告顯示百分比
            window.addEventListener("scroll", calculateShowedProportion); // 當視窗滾動就呼叫計算廣告顯示百分比
        }

        _adShowed(){
            const request = new XMLHttpRequest();
            request.addEventListener("load", () => {
                this.onAdImpression ? (this.onAdImpression()) : false; // 呼叫自定義事件on-ad-impression
            });

            request.addEventListener("error", () => {
                // impression_url未開放跨域請求，因此這邊即使請求失敗也先執行onAdImpression
                this.onAdImpression ? (this.onAdImpression()) : false; // 呼叫自定義事件on-ad-impression
            });            

            request.open("GET", this.impressionUrl);
            request.send();            
        }
        
    }

    type = type ? type.toUpperCase() : null;
    return new Ad(id, type);
}

