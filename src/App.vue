<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">

    
    <a href="google.com" class="ad-banner">
      <img class="ad-banner__img" src="https://agirls.aotter.net/media/da724a8b-fe19-4f4e-8262-75c207ae038b.jpg">
      <div class="ad-banner__content">
        <p class="ad-banner__domain">AGIRLS.AOTTER.NET</p>
        <h3 class="ad-banner__title">三星電視獨家搶先支援Apple TV App，手機還能一秒變遙控器！</h3>
        <div class="ad-banner__icon">i</div>
      </div>
    </a>
    

    <!--
    <div class="ad-video">
      <img class="ad-video__img" src="https://agirls.aotter.net/media/60dcde35-6798-4784-8985-78323c7ec75b.jpg">

      <h3 class="ad-video__title">Google Pixel 3a XL使用一週心得 拍照有輸Pixel 3嗎？</h3>

      <a href="google.com">
        <div class="ad-video__btn">
          <div class="ad-video__icon"></div>
        </div>
      </a>

      <div class="ad-video__social">
        <div>&#128077;195</div>
        <div>&#128172;14</div>
      </div>
    </div>
    -->
    
    
    <div style="height: 1000px;"></div>
    <!-- 廣告預覽圖的長寬比值是1.76-->
    <div class="outer">
      <div data-ad="adSpace"></div>
    </div>
    
    
  </div>
</template>

<script>
import ad from "../sdk/ads"
export default {

  mounted(){
    // var myAd = ad("adSpace");

    // myAd.listen({
    //   "on-ad-loaded": () => { console.log("廣告載入成功") },
    //   "on-ad-failed": (err) => { console.log("廣告載入失敗", err) },
    //   "on-ad-impression": () => { console.log("廣告載入超過一半") }
    // });

    // myAd.load();

    //////////// or /////////////
    ad("adSpace").listen({
      "on-ad-loaded": () => { console.log("廣告載入成功") },
      "on-ad-failed": (err) => { console.log("廣告載入失敗", err) },
      "on-ad-impression": () => { console.log("廣告載入超過一半") }
    }).load();






    

  }
}
</script>

<style>
  @import url("../sdk/ads.css");

  [data-ad="adSpace"] {
    width: 500px;
    height: 285px;
  }
</style>
