const scraper = require("../Util/scrape");
module.exports.scrapeEvery12Hrs = async () => {
    await scraper.getData();
}
