import Ads from "../../ads/ads";

describe("Ads", () => {
	it("is a function", () => {
		expect(typeof Ads).toBe("function");
	});

	it("returns an new Ad object", () => {
		expect(typeof Ads("id", "banner")).toBe("object")
	});

	it("inits default props correctly", () => {
		const id = "id", type = "banner";
		const ads = Ads(id, type);

		expect(ads.id).toBe(id) &&
		expect(ads.type).toBe(type.toUpperCase());
	});

	it("registers liftcycle functions correctly", () => {
		const customFuncs = {
			"on-ad-loaded": () => {},
			"on-ad-failed": (err) => {},
			"on-ad-impression": () => {}
		}
		const ads = Ads("id", "type").listen(customFuncs);

		expect(ads.onAdLoaded).toBe(customFuncs["on-ad-loaded"]) &&
		expect(ads.onAdFailed).toBe(customFuncs["on-ad-failed"]) &&
		expect(ads.onAdImpression).toBe(customFuncs["on-ad-impression"]);
	});
});


describe("_insertAd", () => {
	let ads;
	beforeEach(() => {
		ads = Ads("id", "type");
	});


	it("return false when data-ad cannot be find", () => {
		const result = ads._insertAd(undefined);

		expect(result).toBe(false);
	});

	it("calls the right createHTML function", () => {
		spyOn(document, "querySelector").and.callFake(() => ({ innerHTML: null }));
		spyOn(ads.__proto__, "_createBannerHTML");
		spyOn(ads.__proto__, "_createVideoHTML");

		ads._insertAd({ type: "BANNER" });
		expect(ads._createBannerHTML).toHaveBeenCalled();

		ads._insertAd({ type: "VIDEO" });
		expect(ads._createVideoHTML).toHaveBeenCalled();
	});

	it("return true after called createHTML function", () => {
		spyOn(document, "querySelector").and.callFake(() => ({ innerHTML: null }));
		spyOn(ads.__proto__, "_createBannerHTML");
		spyOn(ads.__proto__, "_createVideoHTML");

		const result = ads._insertAd({ type: "BANNER" });

		expect(result).toBe(true);
	})

});


describe("_createBannerHTML", () => {
	it("returns string", () => {
		const mockAd = {  
			"id": 1,
			"type": "BANNER",
			"title": "三星電視獨家搶先支援Apple TV App，手機還能一秒變遙控器！",
			"description": "好消息！三星在本週宣布~即日起旗下2019年全系列智慧電視、和2018年的指定機型將可透過更新支援Apple TV App以及Airplay2啦！",
			"image": "https://agirls.aotter.net/media/da724a8b-fe19-4f4e-8262-75c207ae038b.jpg",
			"url": "https://agirls.aotter.net/post/55419",
			"impression_url": "https://agirls.aotter.net?imp=1",
			"success": true
		};
		const ads = Ads("id", "type");
		const result = ads._createBannerHTML(mockAd);

		expect(typeof result).toBe("string");
	});
});


describe("_createVideoHTML", () => {
	it("returns string", () => {
		const mockAd = {  
			"id": 2,
			"type": "VIDEO",
			"title": "Google Pixel 3a XL使用一週心得 拍照有輸Pixel 3嗎？",
			"description": "Google新出的Pixel 3a系列，定位在中階機款，卻擁有OLED螢幕，和可比旗艦機的強悍拍照功能，那整體使用體驗到底是如何呢？使用體驗跟Pixel 3有差很多嗎？",
			"image": "https://agirls.aotter.net/media/60dcde35-6798-4784-8985-78323c7ec75b.jpg",
			"video_url": "https://www.youtube.com/embed/lquZJyVj3-I",
			"impression_url": "https://agirls.aotter.net?imp=2",
			"success": true
		};
		const ads = Ads("id", "type");
		const result = ads._createVideoHTML(mockAd);

		expect(typeof result).toBe("string");
	});
});
