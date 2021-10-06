const scraper = require("../Util/scrape");
const cron = require('node-cron');
module.exports.scrapeEvery12Hrs = () => {
    cron.schedule('0 */12 * * *', scraper.getData, {
        scheduled: true,
        timezone: "America/Sao_Paulo"
    });
}
