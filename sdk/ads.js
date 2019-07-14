// (function(global, factory){
//     return factory();


// }(this, function(){
//     var test = {
//         name: "john"
//     }

//     return test;
// }))


const ad = function(mark, type){
    class Ad {
        constructor(mark, type) {
            this.mark = mark;
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
            const that = this;
            
            const request = new XMLHttpRequest();
            
            request.addEventListener("load", function () {
                const ad = JSON.parse(this.response);
                console.log(ad);

                // 請求成功且有拿到廣告資訊
                if(
                    Math.floor(this.status / 100) === 2 && // http request成功
                    ad.success // 有拿到廣告資訊
                ){
                    // 插入廣告內容到DOM，成功回傳true，失敗回傳false
                    const insertSuccess = that._insertAd(ad);                    

                    if(insertSuccess){
                        that.impressionUrl = ad.impression_url; // 儲存廣告顯示過半後的呼叫端點
                        that._listenScroll(); // 開始監聽廣告是否顯示超過一半
                        that.onAdLoaded ? (that.onAdLoaded()) : false; // 呼叫自定義事件on-ad-loaded
                    } else {
                        that.onAdFailed ? (that.onAdFailed("Failed to insert ad to DOM. Did you resgist 'data-ad' correctly?")) : false; // 呼叫自定義事件on-ad-failed
                    }
                    

                // 請求成功但沒有廣告資訊
                } else if(
                    Math.floor(this.status / 100) === 2 && // http request成功
                    !ad.success // 沒有拿到廣告資訊
                ) {
                    that.onAdFailed ? (that.onAdFailed("No ad exists now")) : false; // 呼叫自定義事件on-ad-failed

                // 請求失敗
                } else {
                    that.onAdFailed ? (that.onAdFailed(`Server returned: ${this.status}`)) : false; // 呼叫自定義事件on-ad-failed
                }
                
            });

            
            request.addEventListener("error", function () {
                that.onAdFailed ? (that.onAdFailed(`Request failed or blocked`)) : false; // 呼叫自定義事件on-ad-failed
            });


            request.open("GET", "http://localhost:3000/ads" + (this.type ? "?type="+this.type : ""));
            request.send();
        }

        _insertAd(ad){
            const adSpace = document.querySelector(`[data-ad="${this.mark}"]`);
            if(!adSpace) return false; // 廣告顯示區塊不存在，抓不到元素


            //---------- 操作DOM ----------//
            const createBanner = () => {
                const adBanner = document.createElement("a");
                const adBannerImg = document.createElement("img");
                const adBannerContent = document.createElement("div");
                const adBannerDomain = document.createElement("p");
                const adBannerTitle = document.createElement("h3");

                adBanner.classList.add("ad-banner");
                adBannerImg.classList.add("ad-banner__img");
                adBannerContent.classList.add("ad-banner__content");
                adBannerDomain.classList.add("ad-banner__domain");
                adBannerTitle.classList.add("ad-banner__title");

                adBannerDomain.appendChild(document.createTextNode(ad.url.split("//")[1].split("/")[0].toUpperCase()))
                adBannerTitle.appendChild(document.createTextNode(ad.title));
                adBannerContent.appendChild(adBannerDomain);
                adBannerContent.appendChild(adBannerTitle);
                adBannerImg.src = ad.image;
                adBanner.href = ad.url;
                adBanner.appendChild(adBannerImg);
                adBanner.appendChild(adBannerContent);

                adSpace.appendChild(adBanner);
            }


            const createVideo = () => {
                const adVideo = document.createElement("div");
                const adVideoIframe = document.createElement("iframe");

                adVideo.classList.add("ad-video");
                adVideoIframe.classList.add("ad-video__iframe");

                adVideoIframe.width = "100%";
                adVideoIframe.height = "100%";
                adVideoIframe.frameborder = "0";
                adVideoIframe.src = ad.video_url;

                adVideo.appendChild(adVideoIframe);
                adSpace.appendChild(adVideo);
            }

            switch(ad.type){
                case "BANNER":
                    createBanner();
                    break;

                case "VIDEO":
                    createVideo();
                    break;
            }

            return true;
        }

        _listenScroll(){
            const that = this;
            const adSpace = document.querySelector(`[data-ad="${this.mark}"]`);
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
                if(that.calledImpressionApi){
                    window.removeEventListener("scroll", calculateShowedProportion);
                    return;
                };

                const showedHeight = window.scrollY + window.innerHeight;
                const adSpaceMiddleHeight = getElementTop(adSpace) + adSpace.clientTop + (adSpace.clientHeight/2);
                
                if(showedHeight > adSpaceMiddleHeight){
                    that._adShowed();
                }
            };

            
            calculateShowedProportion(); // 初期呼叫第一次計算廣告顯示百分比
            window.addEventListener("scroll", calculateShowedProportion); // 當視窗滾動就呼叫計算廣告顯示百分比
        }

        _adShowed(){
            const that = this;

            const request = new XMLHttpRequest();
            // request.addEventListener("load", () => {
            //     alert("success");
            //     that.calledImpressionApi = true; // 成功呼叫過一次廣告顯示過半api
            //     this.onAdImpression ? (this.onAdImpression()) : false; // 呼叫自定義事件on-ad-impression
            // });
            

            request.open("GET", this.impressionUrl);
            request.send();

            // 開發用，無視呼叫api是否有成功
            that.calledImpressionApi = true; // 成功呼叫過一次廣告顯示過半api
            this.onAdImpression ? (this.onAdImpression()) : false; // 呼叫自定義事件on-ad-impression
            
        }
        
    }



    return new Ad(mark, type);
}




export default ad;




























//! moment.js locale configuration

// ;
// (function (global, factory) {
//     typeof exports === 'object' && typeof module !== 'undefined' &&
//         typeof require === 'function' ? factory(require('../moment')) :
//         typeof define === 'function' && define.amd ? define(['../moment'], factory) :
//         factory(global.moment)
// }(this, (function (moment) {
//     'use strict';


//     var af = moment.defineLocale('af', {
//         months: 'Januarie_Februarie_Maart_April_Mei_Junie_Julie_Augustus_September_Oktober_November_Desember'.split('_'),
//         monthsShort: 'Jan_Feb_Mrt_Apr_Mei_Jun_Jul_Aug_Sep_Okt_Nov_Des'.split('_'),
//         weekdays: 'Sondag_Maandag_Dinsdag_Woensdag_Donderdag_Vrydag_Saterdag'.split('_'),
//         weekdaysShort: 'Son_Maa_Din_Woe_Don_Vry_Sat'.split('_'),
//         weekdaysMin: 'So_Ma_Di_Wo_Do_Vr_Sa'.split('_'),
//         meridiemParse: /vm|nm/i,
//         isPM: function (input) {
//             return /^nm$/i.test(input);
//         },
//         meridiem: function (hours, minutes, isLower) {
//             if (hours < 12) {
//                 return isLower ? 'vm' : 'VM';
//             } else {
//                 return isLower ? 'nm' : 'NM';
//             }
//         },
//         longDateFormat: {
//             LT: 'HH:mm',
//             LTS: 'HH:mm:ss',
//             L: 'DD/MM/YYYY',
//             LL: 'D MMMM YYYY',
//             LLL: 'D MMMM YYYY HH:mm',
//             LLLL: 'dddd, D MMMM YYYY HH:mm'
//         },
//         calendar: {
//             sameDay: '[Vandag om] LT',
//             nextDay: '[Môre om] LT',
//             nextWeek: 'dddd [om] LT',
//             lastDay: '[Gister om] LT',
//             lastWeek: '[Laas] dddd [om] LT',
//             sameElse: 'L'
//         },
//         relativeTime: {
//             future: 'oor %s',
//             past: '%s gelede',
//             s: '\'n paar sekondes',
//             ss: '%d sekondes',
//             m: '\'n minuut',
//             mm: '%d minute',
//             h: '\'n uur',
//             hh: '%d ure',
//             d: '\'n dag',
//             dd: '%d dae',
//             M: '\'n maand',
//             MM: '%d maande',
//             y: '\'n jaar',
//             yy: '%d jaar'
//         },
//         dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
//         ordinal: function (number) {
//             return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de'); // Thanks to Joris Röling : https://github.com/jjupiter
//         },
//         week: {
//             dow: 1, // Maandag is die eerste dag van die week.
//             doy: 4 // Die week wat die 4de Januarie bevat is die eerste week van die jaar.
//         }
//     });

//     return af;

// })));