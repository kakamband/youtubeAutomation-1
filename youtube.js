let cheerio = require("cheerio")
let puppeteer = require("puppeteer");



(async function () {
    try {

        let browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            slowMo : 50,
            args: [ "--start-fullscreen","--disable-notifications"]
        });

        let pArr = [];
        let pages = await browser.pages();
        let page = pages[0];

// ********* google login *************************************************************************
        await page.goto("https://www.google.com", { waitUntil: "networkidle0" });
        await page.click(".gb_le.gb_4.gb_5c");
        await page.waitForSelector("input[type='email']");
        await page.click("input[type='email']");
        await page.type("input[type='email']", "practiceprojecat@gmail.com", { delay: 50 })
        await page.click("#identifierNext");
        await page.waitForNavigation({ waitUntil: "networkidle0" });
        await page.waitForSelector("input[type='password']");
        await page.type("input[type='password']", "Bestfriend@29", { delay: 50 });
        await page.click("#passwordNext");
        await page.waitForNavigation({ waitUntil: "networkidle0" });

//******************** youtube ******************************************* */
        await page.goto("https://www.youtube.com")
        await page.goto("https://www.youtube.com/feed/trending")
        
//********** trending music *********************** */
        let options = await page.$$("div#header-container div#sub-menu ytd-channel-list-sub-menu-renderer div#contents ytd-channel-list-sub-menu-avatar-renderer a")

        let href = await page.evaluate(function (el) {
            return el.getAttribute("href");
          }, options[0])

         await page.goto("https:www.youtube.com"+href, { waitUntil: "networkidle0" });

//***************** href of all musics ************ */
        var list_of_href = [];
        let href_of_videos  = await page.$$('div#dismissable div#contents.style-scope.ytd-shelf-renderer ytd-expanded-shelf-contents-renderer div#grid-container ytd-video-renderer div#dismissable.style-scope.ytd-video-renderer ytd-thumbnail a');
        for(let i=0; i<href_of_videos.length; i++){
            list_of_href.push(await page.evaluate(function(el){
               return el.getAttribute("href")
            }, href_of_videos[i]))
         }

        //  console.log(list_of_href.length);
        //  for(let i=0; i<10; i++){
        //      console.log(list_of_href[i])
        //      console.log();
        //  }
//*************extracting top 10 trending videos ************************** */
        var top10_href = []
        for (let i = 0; i < 10; i++) {    
             top10_href.push(list_of_href[i]);
        }


        let title_of_videos  = await page.$$('div#dismissable div#contents.style-scope.ytd-shelf-renderer ytd-expanded-shelf-contents-renderer div#grid-container ytd-video-renderer div#dismissable.style-scope.ytd-video-renderer div.text-wrapper.style-scope.ytd-video-renderer div#title-wrapper h3 a');

//*****************finding names of top 10 videos ******************** */
       var list_of_names = [];
       for(let i=0; i<title_of_videos.length; i++){
            list_of_names.push(await page.evaluate(function(el){
            return el.getAttribute("title")
            }, title_of_videos[i]))
        }
//************* displaying names of top 10 videos ************************ */
       console.log("\nTop 10 trending videos of youtube in India\n");
       for(let i=0; i<10; i++){
              console.log(`${i+1} ${list_of_names[i]} `);
              console.log();

        }
    
//********************* parallely opening top 10 videos ******************** */
        for (let i = 0; i < 10; i++) {
             let newTab = await browser.newPage();
             let videoWillBeLiked = handleVideos(newTab, "https://www.youtube.com" + top10_href[i]);
              pArr.push(videoWillBeLiked)
         }








    } catch (err) {
        console.log(err);
    }


})();

async function handleVideos(tab, link) {
    await tab.goto(link, { waitUntil: "networkidle0" });
    await tab.waitForSelector("div#subscribe-button ytd-subscribe-button-renderer paper-button.style-scope.ytd-subscribe-button-renderer");
    //let subscribe = await tab.$("div#subscribe-button ytd-subscribe-button-renderer paper-button.style-scope.ytd-subscribe-button-renderer")

    await tab.click("div#subscribe-button ytd-subscribe-button-renderer paper-button.style-scope.ytd-subscribe-button-renderer")
    await tab.waitForSelector("div#menu-container div ytd-menu-renderer div ytd-toggle-button-renderer a.yt-simple-endpoint.style-scope.ytd-toggle-button-renderer yt-icon-button button.style-scope.yt-icon-button");
    //let likeBttn =  await tab.$("div#menu-container div ytd-menu-renderer div ytd-toggle-button-renderer a.yt-simple-endpoint.style-scope.ytd-toggle-button-renderer yt-icon-button button.style-scope.yt-icon-button");
    await tab.click("div#menu-container div ytd-menu-renderer div ytd-toggle-button-renderer a.yt-simple-endpoint.style-scope.ytd-toggle-button-renderer yt-icon-button button.style-scope.yt-icon-button");
    await tab.close()
}
//     node youtube.js
