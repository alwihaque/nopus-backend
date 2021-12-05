const scraper = require("../Util/scrape");
const gMaps = require('../Util/distances');
const cron = require('node-cron');
module.exports.scrapeEvery12Hrs = () => {
    //await scraper.getData();
    cron.schedule('*/30 * * * *', async ()=>{
        console.log("Inside Scraping Function\n");
        await scraper.getData();
    }, {
        scheduled: true,
        timezone: "America/Sao_Paulo"
    });
}
module.exports.scrapeGoogleMaps = () => {
    cron.schedule('15 10 15 * *', async () => {
        console.log("Inside Google Maps Function\n");
        await gMaps.runScraper();

    }, {
        scheduled: true,
        timezone: "America/Sao_Paulo"
    });

}