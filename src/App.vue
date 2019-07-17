<template>
  <div id="app">
    <h1>下滑至底顯示廣告2</h1>
    <h1>廣告2顯示超過一秒後上滑至中間可顯示廣告1</h1>
    <h1>事件進行狀況可從主控台觀看</h1>
    <div style="height: 1000px;"></div>
    <div data-ad="my-ad-1"></div>
    <div style="height: 1000px;"></div>
    <div data-ad="my-ad-2"></div>
  </div>
</template>

<script>
import ad from "../ads/ads.min.js"
export default {
  data(){
    return {
      myAd1: null
    }
  },

  created(){
    var myAd1 = ad("my-ad-1");

    myAd1.listen({
      "on-ad-loaded": () => { console.log("my-ad-1廣告載入成功") },
      "on-ad-failed": (err) => { console.log("my-ad-1廣告載入失敗" + err) },
      "on-ad-impression": () => { console.log("my-ad-1廣告載入超過一半") }
    });

    this.myAd1 = myAd1;
  },

  mounted(){
    const origin = this;
    ad("my-ad-2").listen({
      "on-ad-loaded": () => { console.log("my-ad-2廣告載入成功") },
      "on-ad-failed": (err) => { console.log("my-ad-2廣告載入失敗" + err) },
      "on-ad-impression": () => { 
        console.log("my-ad-2廣告載入超過一半");
        origin.myAd1.load();
      }
    }).load();
  }
}
</script>

<style>
  @import url("../ads/ads.min.css");

  [data-ad="adSpace"] {
    width: 500px;
    height: 285px;
  }
</style>
