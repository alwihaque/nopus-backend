const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const launchBrowser = async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://atlas.emory.edu/', {waitUntil: 'networkidle2'});
    await page.select('#crit-camp', 'ATL');
    await page.select('#crit-career', 'UCOL');
    await page.waitForTimeout(2000);
    await page.click('#search-button');
    await page.waitForTimeout(2000);
    let data = [];
    let elements = await page.$$('.result.result--group-start a.result__link');
    for (const elem of elements) {
        //console.log(elem.asElement());
        await elem.click();
        await page.waitForTimeout(2000);
        const content = await page.content();
        const $ = cheerio.load(content);
        const code = $('.dtl-course-code');
        const title = $('.text.col-8.detail-title.margin--tiny.text--huge');

        // const sections = $('.row.noindent .section.section--all_sections a.course-section.course-section.course-section--matched').toArray();
        // console.log(sections.length);
        // for(let i = 0; i < sections.length; i++) {
        //     $(sections[i]).click();
        // }
        // await page.evaluate(() => {
        //     console.log('hergegg')
        //     let elements = document.getElementsByClassName('course-section course-section--viewing course-section--matched');
        //     console.log(elements.length);
        //     for (let element of elements)
        //         element.click();
        // });
        await page.evaluate(() => {
            let elements = $('.course-section.course-section.course-section--matched').toArray();
            for (let i = 0; i < elements.length; i++) {
                $(elements[i]).click();
                setTimeout(() => {

                }, 2000);
            }
        });
        code.each(function () {
            console.log($(this).text());
        });
        title.each(function () {
            console.log($(this).text());
        });
        const sections = await page.$$('a[data-action="result-detail"][role="row"]');
        const numSections = sections.length;
        for (const section of sections) {

            await section.click();
            await page.waitForTimeout(10*1000);

            const content = await page.content();
            const $ = cheerio.load(content);
            const enrollmentStatus = $('.text.detail-enrl_stat_html');
            const seats = $('.text.detail-seats');
            const instructionMethod = $('.text.detail-inst_method_code');
            const typicallyOffered = $('.text.detail-crse_typoff_html');
            const requirement = $('.text.detail-clss_assoc_rqmnt_designt_html');
            const courseDec = $('.section.section--description .section__content');
            const courseNotes = $('.section__content .note-wrapper .note-paragraph');
            const courseLocation = $('.section.section--meeting_html .section__content .meet');
            const credits = $('.text.detail-hours_html');

            credits.each(function () {
                console.log($(this).text());
            });

            seats.each(function () {
                console.log($(this).text());
            });

            enrollmentStatus.each(function () {
                console.log($(this).text());
            });
            instructionMethod.each(function () {
                console.log($(this).text());
            });
            typicallyOffered.each(function () {
                console.log($(this).text());
            });
            requirement.each(function () {
                console.log($(this).text());
            });
            courseDec.each(function () {
                console.log($(this).text());
            });
            courseNotes.each(function () {
                console.log($(this).text());
            });
            courseLocation.each(function () {
                console.log($(this).text());
            });
            await page.waitForTimeout(2000);

        }
        await page.click('.panel.panel--2x.panel--kind-details.panel--visible .panel__content a.panel__back.icon-link');
        await page.waitForTimeout(2000);
        //await page.click(back);
    }
}

launchBrowser();