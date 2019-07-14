<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">

    <!--
    <a href="google.com" class="ad-banner">
      <img class="ad-banner__img" src="https://agirls.aotter.net/media/da724a8b-fe19-4f4e-8262-75c207ae038b.jpg">
      <div class="ad-banner__content">
        <p class="ad-banner__domain">AGIRLS.AOTTER.NET</p>
        <h3 class="ad-banner__title">三星電視獨家搶先支援Apple TV App，手機還能一秒變遙控器！</h3>
      </div>
    </a>


    <div class="ad-video">
      <iframe width="100%" height="100%" class="ad-video__iframe" src="https://www.youtube.com/embed/lquZJyVj3-I" frameborder="0"></iframe>
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
    // 我希望User端可以這樣調用api

    var myAd = ad("adSpace");

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
    width: 300px;
    height: 200px;
  }
</style>
